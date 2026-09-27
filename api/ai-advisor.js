import { GoogleGenAI } from '@google/genai';
import { getRelevantProductsForAI, buildPromptContext } from './productContextService.js';
import { 
  classifyUserIntent, 
  extractProductRequirements, 
  extractLocationParameters, 
  find_bank_locations, 
  isLocationQueryAmbiguous,
  buildLocationPromptContext 
} from './aiLocationService.js';

// In-memory rate limiting map: ip -> timestamps[]
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 45;

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

const SYSTEM_INSTRUCTION = `You are D.CARD AI Assistance.

D.CARD is an independent banking product discovery and comparison platform in India.

Your job is to help users:
1. Discover, understand, and compare verified Indian banking products (Savings Accounts, Current Accounts, Debit Cards).
2. Locate verified Bank Branches and ATMs across India using D.CARD's verified location database.

LANGUAGE SUPPORT:
- Support English, Hindi, and Hinglish naturally.
- Respond in the user's preferred conversational style (e.g., if asked in Hinglish like "bhai zero balance account batao", respond warmly and concisely in Hinglish/English).

CRITICAL FORMATTING RULES:
- NEVER output raw Markdown table syntax (do NOT use | col | col |).
- NEVER output raw heading markers like ### or ##.
- NEVER output horizontal rules like ---.
- NEVER output raw JSON in your visible text response.
- Keep responses short, direct, friendly, and concise. Do not write essays.

CRITICAL ZERO HALLUCINATION RULES:
- Use the provided D.CARD verified product and location data as the ONLY source of truth.
- NEVER invent:
  * bank branches, ATMs, addresses, IFSC codes, phone numbers, or opening hours.
  * interest rates, minimum balance, average balance, account charges, debit card fees, ATM limits, POS limits, or lounge access.
- If a requested bank branch or ATM is not in the provided location context, clearly state:
  "I couldn't find a verified location matching your request in D.CARD's current database."
- When comparing products, use factual differences from the available data.
- Never claim one product is universally best.

ACCOUNT <-> DEBIT CARD RELATIONSHIP RULE:
- When describing a debit card linked with a savings or current account, ONLY reference the debit card actually linked/issued with that account in the verified context. Do NOT randomly attach another card.

PRIVACY & SENSITIVE DATA:
- Never ask users for Aadhaar, PAN, card numbers, CVV, OTP, PIN, net banking credentials, or passwords.
- If provided, do not process and politely advise them never to share sensitive details.

LOCATION CONSENT:
- If a user asks for "nearest" or "near me" without specifying a city and without live location provided, politely ask for their city, area, or 6-digit PIN code.`;

/**
 * Strips raw markdown table syntax, raw heading hashes, and JSON blocks
 */
function cleanVisibleAiText(text = '') {
  let cleaned = String(text || '').trim();

  // Remove code blocks with JSON
  cleaned = cleaned.replace(/```(?:json)?\s*[\s\S]*?```/gi, '');

  // Strip markdown headers like ### or ##
  cleaned = cleaned.replace(/^#{1,6}\s+/gm, '');

  // Strip markdown horizontal rules like --- or ***
  cleaned = cleaned.replace(/^[-*_]{3,}\s*$/gm, '');

  // Convert markdown table rows into clean bullet points
  cleaned = cleaned.replace(/^\|?\s*([^|\n]+?)\s*\|\s*([^|\n]+?)\s*\|?$/gm, (match, p1, p2) => {
    if (p1.includes('---') || p2.includes('---')) return '';
    return `• ${p1.trim()}: ${p2.trim()}`;
  });

  // Strip remaining standalone pipes
  cleaned = cleaned.replace(/^\||\|$/gm, '').replace(/\|/g, '·');

  // Strip repetitive prefixes
  cleaned = cleaned.replace(/^(?:D\.CARD\s+)?(?:AI\s+)?(?:EXPLANATION|ADVISOR|ASSISTANCE):\s*/i, '');

  // Normalize excessive newlines
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n');

  return cleaned.trim();
}

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
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With, Accept');
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
    const { message, conversationHistory = [], conversationState = {}, userCoords = null } = body;

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
      console.error('[AI Assistance Error] Server GEMINI_API_KEY is missing or unconfigured.');
      const devError = process.env.NODE_ENV !== 'production'
        ? 'Server configuration error: GEMINI_API_KEY is not configured in server environment variables.'
        : 'AI Assistance is temporarily unavailable. Please try again later.';
      res.status(500).json({ error: devError });
      return;
    }

    // 3. Controlled Intent Classification & Requirement Extraction
    const intentObj = classifyUserIntent(cleanMessage, conversationState);
    const productRequirements = extractProductRequirements(cleanMessage);
    const locationParams = extractLocationParameters(cleanMessage, conversationState, userCoords);

    let locationResult = null;
    let matchedLocations = [];
    const isLocationQuery = intentObj.primaryIntent === 'find_bank_location' || 
                            intentObj.primaryIntent.startsWith('BANK_LOCATION') || 
                            intentObj.isCombined || 
                            Boolean(intentObj.isLocation);

    // 4. Execute Controlled Location Tool if location intent is present
    if (isLocationQuery) {
      // Check for unknown/unsupported bank
      if (locationParams.isUnknownBank) {
        res.status(200).json({
          type: 'no_results',
          intent: 'find_bank_location',
          answer: `I couldn't find any verified branches or ATMs for ${locationParams.unknownBankName || 'this bank'} in D.CARD's verified database. Currently, D.CARD tracks verified locations for 21 major Indian banks.`,
          matchedAccounts: [],
          matchedCurrentAccounts: [],
          matchedCards: [],
          matchedLocations: [],
          extractedRequirements: productRequirements,
          detectedBanks: [],
          suggestedActions: [
            { label: 'Find Verified Banks', action: 'NAVIGATE', url: '/find-banks' }
          ],
          disclaimer: "Please verify the latest terms, charges and eligibility on the bank's official website before applying or visiting."
        });
        return;
      }

      // Check if essential location information is ambiguous
      if (isLocationQueryAmbiguous(locationParams, userCoords)) {
        let clarifyMsg = "Sure — which city, PIN code, or location should I search around?";
        if (locationParams.isNearMe) {
          clarifyMsg = "To show branches or ATMs near you, please grant location access in your browser, or tell me your city, area, or 6-digit PIN code.";
        }
        res.status(200).json({
          type: 'clarification_required',
          intent: 'find_bank_location',
          answer: clarifyMsg,
          matchedAccounts: [],
          matchedCurrentAccounts: [],
          matchedCards: [],
          matchedLocations: [],
          extractedRequirements: productRequirements,
          detectedBanks: locationParams.bank ? [locationParams.bank] : [],
          suggestedActions: [
            { label: 'Use My Location', action: 'USE_MY_LOCATION' },
            { label: 'Find Banks & ATMs', action: 'NAVIGATE', url: '/find-banks' }
          ],
          disclaimer: "Please verify the latest terms, charges and eligibility on the bank's official website before applying or visiting."
        });
        return;
      }

      locationResult = await find_bank_locations({
        bank_name: locationParams.bank_name,
        location_query: locationParams.location_query,
        city: locationParams.city,
        state: locationParams.state,
        pincode: locationParams.pincode,
        branch_type: locationParams.branch_type,
        radius_km: locationParams.radius_km,
        latitude: userCoords?.lat || null,
        longitude: userCoords?.lng || null,
        services: locationParams.services,
        isUnknownBank: locationParams.isUnknownBank,
        unknownBankName: locationParams.unknownBankName
      });
      matchedLocations = locationResult.locations || [];
    }

    // 5. Product Context Retrieval
    const relevantProducts = getRelevantProductsForAI(cleanMessage, {
      ...conversationState,
      ...productRequirements
    });

    const productContextPrompt = buildPromptContext(relevantProducts);
    const locationContextPrompt = isLocationQuery 
      ? buildLocationPromptContext(matchedLocations)
      : '';

    // 6. Initialize Official Google GenAI Client
    const ai = new GoogleGenAI({ apiKey });
    const modelName = (process.env.GEMINI_MODEL || 'gemini-3.8-flash').trim();

    // 7. Build Multi-Turn History (bounded to last 10 messages)
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

    // Current turn with grounded database and location context
    const currentPromptWithContext = [
      `USER INTENT: ${intentObj.primaryIntent}${intentObj.isCombined ? ' + BANK_LOCATION_SEARCH' : ''}`,
      productRequirements && Object.keys(productRequirements).length > 0 ? `EXTRACTED REQUIREMENTS: ${JSON.stringify(productRequirements)}` : '',
      `==================================================`,
      `CURRENT VERIFIED D.CARD PRODUCT CONTEXT:`,
      productContextPrompt,
      `==================================================`,
      locationContextPrompt ? `${locationContextPrompt}\n==================================================` : '',
      `USER QUESTION: "${cleanMessage}"`
    ].filter(Boolean).join('\n\n');

    contents.push({
      role: 'user',
      parts: [{ text: currentPromptWithContext }]
    });

    // 8. Invoke Gemini with automatic model fallback
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
        console.warn(`[AI Assistance Notice] Model ${currentModel} returned error (${err.message || err}). Attempting fallback...`);
      }
    }

    if (!response || !response.text) {
      throw lastModelError || new Error('Empty response received from Gemini.');
    }

    const aiText = response.text || '';
    if (!aiText.trim()) {
      throw new Error('Empty response received from Gemini.');
    }

    const cleanAnswer = cleanVisibleAiText(aiText);

    // Determine high-level response type
    let responseType = 'information_answer';
    if (intentObj.isCombined) {
      responseType = 'combined_results';
    } else if (isLocationQuery) {
      responseType = matchedLocations.length > 0 ? 'location_results' : 'no_results';
    } else if ((relevantProducts.savingsAccounts?.length || 0) + (relevantProducts.debitCards?.length || 0) > 0) {
      responseType = 'product_results';
    } else if (intentObj.primaryIntent === 'PRODUCT_COMPARISON') {
      responseType = 'comparison_results';
    }

    // Contextual suggested actions
    const suggestedActions = [];
    if (matchedLocations.length > 0 || isLocationQuery) {
      const queryParam = locationParams.location ? `?search=${encodeURIComponent(locationParams.location)}` : '';
      suggestedActions.push({
        label: 'Open in Find Banks',
        action: 'NAVIGATE',
        url: `/find-banks${queryParam}`
      });
    }

    // 9. Return Structured Output
    res.status(200).json({
      type: responseType,
      intent: intentObj.primaryIntent,
      answer: cleanAnswer,
      matchedAccounts: relevantProducts.savingsAccounts || [],
      matchedCurrentAccounts: relevantProducts.currentAccounts || [],
      matchedCards: relevantProducts.debitCards || [],
      matchedLocations: matchedLocations,
      extractedRequirements: productRequirements,
      detectedBanks: relevantProducts.detectedBanks || [],
      suggestedActions,
      disclaimer: "Please verify the latest terms, charges and eligibility on the bank's official website before applying or visiting."
    });

  } catch (err) {
    console.error('[AI Assistance Error] Exception while generating response:', err.message || err);
    res.status(500).json({
      error: 'AI Assistance is temporarily unavailable. Please try again later.'
    });
  }
}
