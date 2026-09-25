import { GoogleGenAI } from '@google/genai';
import { getRelevantProductsForAI, buildPromptContext } from './productContextService.js';

// In-memory rate limiting map: ip -> timestamps[]
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 35;

/**
 * Basic rate limiting guard
 */
function isRateLimited(clientIp) {
  if (!clientIp) return false;
  const now = Date.now();
  const timestamps = (rateLimitMap.get(clientIp) || []).filter(t => now - t < RATE_LIMIT_WINDOW_MS);
  
  if (timestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    return true;
  }
  
  timestamps.push(now);
  rateLimitMap.set(clientIp, timestamps);
  return false;
}

const SYSTEM_INSTRUCTION = `You are D.CARD AI Advisor.

D.CARD is an independent banking product discovery and comparison platform.

Your job is to help users understand and compare Savings Accounts, Current Accounts, Debit Cards, and related banking product information available in D.CARD's verified product database.

Use the provided D.CARD product data as the primary source of truth.

Never invent:
- interest rates
- minimum balance
- average balance
- account charges
- debit card fees
- ATM limits
- POS limits
- online transaction limits
- lounge access
- insurance benefits
- rewards
- eligibility
- account benefits
- card benefits
- bank policies

If a requested piece of information is not present in the D.CARD data, clearly say that the information is not available in the current D.CARD dataset.

Do not guess.

If product data appears incomplete, say so.

When comparing products, use factual differences from the available data.

Do not claim that one product is universally best.

The appropriate product depends on the user's stated requirements.

You may help the user understand which products match specific criteria.
For example:
- zero balance
- low minimum balance
- student-friendly eligibility
- lower fees
- lounge access
- higher ATM limit
- debit card benefits
- digital banking features

Always explain the factual reason for the match based strictly on D.CARD product data.

CRITICAL ACCOUNT <-> DEBIT CARD RELATIONSHIP RULE:
When showing or describing a debit card for a savings or current account, ONLY reference the debit card actually linked/issued with that account variant in the verified D.CARD context. Do NOT randomly attach a bank's other debit cards.

D.CARD is NOT a bank.
Do not claim to open accounts.
Do not claim to approve accounts.
Do not claim to issue debit cards.
Do not claim to process KYC.

Do not ask users for:
- Aadhaar number
- PAN number
- bank account number
- debit card number
- CVV
- PIN
- OTP
- passwords
- UPI PIN
- net banking credentials
- card credentials
- sensitive financial information

Never request these details.
If a user provides sensitive information, do not store or process it and politely tell them not to share it.

Do not guarantee financial outcomes.
Do not provide investment advice.
Do not impersonate banks.

For actual account opening or application, direct the user to the official bank website.
Always distinguish D.CARD product information from the bank's official terms.

When appropriate, remind the user:
"Please verify the latest terms, charges and eligibility on the bank's official website before applying."

Keep responses concise, useful and easy to understand.
Use clean markdown tables or bullet points when comparing multiple products.

If the user asks a question unrelated to banking products, answer briefly and politely, but guide them back to banking product comparison on D.CARD.`;

/**
 * Main serverless handler (compatible with Vercel & Node server runtimes)
 */
export default async function handler(req, res) {
  // Standardize res helpers for compatibility across Vercel and Node/Vite environments
  if (!res.status) {
    res.status = function(code) {
      this.statusCode = code;
      return this;
    };
  }
  if (!res.json) {
    res.json = function(data) {
      this.setHeader('Content-Type', 'application/json');
      this.end(JSON.stringify(data));
      return this;
    };
  }

  // Dynamic CORS origin validation for secure cross-origin requests
  const requestOrigin = req.headers?.origin || '';
  const allowedOrigins = [
    'https://www.dcard.website',
    'https://dcard.website',
    'http://localhost:5173',
    'http://localhost:3000',
    'http://127.0.0.1:5173'
  ];
  const isAllowedOrigin = allowedOrigins.includes(requestOrigin) || 
    (requestOrigin.endsWith('.vercel.app') && requestOrigin.startsWith('https://'));

  if (typeof res.setHeader === 'function') {
    if (isAllowedOrigin) {
      res.setHeader('Access-Control-Allow-Origin', requestOrigin);
      res.setHeader('Access-Control-Allow-Credentials', 'true');
    } else {
      res.setHeader('Access-Control-Allow-Origin', 'https://www.dcard.website');
    }
    res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Content-Type, X-Requested-With, Accept'
    );
  }

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed. Use POST.' });
    return;
  }

  // Rate limiting
  const clientIp = req.headers?.['x-forwarded-for'] || req.headers?.['x-real-ip'] || req.socket?.remoteAddress || 'unknown';
  if (isRateLimited(clientIp)) {
    res.status(429).json({ error: 'Too many requests. Please slow down and try again in a moment.' });
    return;
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const { message, conversationHistory = [], conversationState = {} } = body;

    // 1. Input Validation
    if (!message || typeof message !== 'string' || !message.trim()) {
      res.status(400).json({ error: 'Please provide a valid, non-empty question.' });
      return;
    }

    const cleanMessage = message.trim();
    if (cleanMessage.length > 2000) {
      res.status(400).json({ error: 'Message exceeds the maximum limit of 2000 characters.' });
      return;
    }

    // 2. Server API Key Validation
    const apiKey = (process.env.GEMINI_API_KEY || '').trim();
    if (!apiKey || apiKey === 'your-gemini-api-key-here') {
      console.error('[AI Advisor Error] Server GEMINI_API_KEY is missing or unconfigured.');
      const devError = process.env.NODE_ENV !== 'production'
        ? 'Server configuration error: GEMINI_API_KEY is not configured in server environment variables.'
        : 'AI Advisor is temporarily unavailable. Please try again later.';
      res.status(500).json({ error: devError });
      return;
    }

    // 3. Grounded Product Context Retrieval
    const relevantProducts = getRelevantProductsForAI(cleanMessage, conversationState);
    const contextPromptString = buildPromptContext(relevantProducts);

    // 4. Initialize Official Google GenAI Client
    const ai = new GoogleGenAI({ apiKey });
    const modelName = (process.env.GEMINI_MODEL || 'gemini-3.8-flash').trim();

    // 5. Build Multi-Turn History (bounded to last 10 messages)
    const boundedHistory = Array.isArray(conversationHistory)
      ? conversationHistory.slice(-10)
      : [];

    const contents = [];

    for (const turn of boundedHistory) {
      if (turn.sender === 'user' || turn.role === 'user') {
        contents.push({
          role: 'user',
          parts: [{ text: String(turn.text || turn.content || '') }]
        });
      } else if (turn.sender === 'bot' || turn.role === 'model' || turn.role === 'assistant') {
        contents.push({
          role: 'model',
          parts: [{ text: String(turn.text || turn.content || '') }]
        });
      }
    }

    // Current turn with grounded database context
    const currentPromptWithContext = `CURRENT VERIFIED D.CARD PRODUCT CONTEXT:
==================================================
${contextPromptString}
==================================================

USER QUESTION: "${cleanMessage}"`;

    contents.push({
      role: 'user',
      parts: [{ text: currentPromptWithContext }]
    });

    // 6. Invoke Gemini with configurable model and automatic fallback on temporary 503 spikes
    const candidateModels = [
      (process.env.GEMINI_MODEL || 'gemini-3.8-flash').trim(),
      'gemini-3.5-flash',
      'gemini-3.7-flash',
      'gemini-flash-latest'
    ];
    const modelsToTry = [...new Set(candidateModels)];

    let response = null;
    let lastModelError = null;

    for (const currentModel of modelsToTry) {
      try {
        response = await ai.models.generateContent({
          model: currentModel,
          contents,
          config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            temperature: 0.2
          }
        });
        if (response?.text) break;
      } catch (err) {
        lastModelError = err;
        console.warn(`[AI Advisor Notice] Model ${currentModel} returned error (${err.message || err}). Attempting fallback...`);
      }
    }

    if (!response || !response.text) {
      throw lastModelError || new Error('Empty response received from Gemini.');
    }

    const aiText = response.text || '';

    if (!aiText.trim()) {
      throw new Error('Empty response received from Gemini.');
    }

    // 7. Return Structured Output
    res.status(200).json({
      answer: aiText.trim(),
      matchedAccounts: relevantProducts.savingsAccounts || [],
      matchedCurrentAccounts: relevantProducts.currentAccounts || [],
      matchedCards: relevantProducts.debitCards || [],
      detectedBanks: relevantProducts.detectedBanks || [],
      disclaimer: "Please verify the latest terms, charges and eligibility on the bank's official website before applying."
    });

  } catch (err) {
    console.error('[AI Advisor Error] Exception while generating response:', err.message || err);
    res.status(500).json({
      error: 'AI Advisor is temporarily unavailable. Please try again later.'
    });
  }
}
