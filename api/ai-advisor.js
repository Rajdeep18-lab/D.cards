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
const MAX_REQUESTS_PER_WINDOW = 40;

/**
 * Rate limiting guard with sliding window, memory sweep, and standard header feedback
 */
function checkRateLimit(clientIp) {
  if (!clientIp || clientIp === 'unknown') return { limited: false, remaining: MAX_REQUESTS_PER_WINDOW };
  const now = Date.now();
  const timestamps = (rateLimitMap.get(clientIp) || []).filter(t => now - t < RATE_LIMIT_WINDOW_MS);
  
  if (timestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    const oldest = timestamps[0];
    const retryAfterSec = Math.max(1, Math.ceil((oldest + RATE_LIMIT_WINDOW_MS - now) / 1000));
    return { limited: true, retryAfterSec, remaining: 0 };
  }
  
  timestamps.push(now);
  rateLimitMap.set(clientIp, timestamps);

  if (rateLimitMap.size > 2000) {
    for (const [key, tsList] of rateLimitMap.entries()) {
      if (tsList.every(t => now - t >= RATE_LIMIT_WINDOW_MS)) {
        rateLimitMap.delete(key);
      }
    }
  }

  return { limited: false, remaining: MAX_REQUESTS_PER_WINDOW - timestamps.length };
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
  // Allow official preview deployments strictly matching dcard project name
  const isAllowedOrigin = allowedOrigins.includes(requestOrigin) || 
    (/^https:\/\/(smartbank-compare|d-card)(-[a-z0-9-]+)?\.vercel\.app$/.test(requestOrigin));

  if (typeof res.setHeader === 'function') {
    if (isAllowedOrigin) {
      res.setHeader('Access-Control-Allow-Origin', requestOrigin);
      res.setHeader('Access-Control-Allow-Credentials', 'true');
    }
    res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With, Accept');
  }

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({
      success: false,
      error: 'Method Not Allowed. Use POST.',
      type: 'error',
      intent: 'ERROR',
      answer: 'Method Not Allowed. Use POST.'
    });
    return;
  }

  // Rate limiting
  const clientIp = req.headers?.['x-forwarded-for'] || req.headers?.['x-real-ip'] || req.socket?.remoteAddress || 'unknown';
  const rateLimitStatus = checkRateLimit(clientIp);

  if (typeof res.setHeader === 'function') {
    res.setHeader('X-RateLimit-Limit', String(MAX_REQUESTS_PER_WINDOW));
    res.setHeader('X-RateLimit-Remaining', String(rateLimitStatus.remaining));
  }

  if (rateLimitStatus.limited) {
    if (typeof res.setHeader === 'function') {
      res.setHeader('Retry-After', String(rateLimitStatus.retryAfterSec || 60));
    }
    res.status(429).json({
      success: false,
      error: 'Too many requests. Please slow down and try again in a moment.',
      type: 'error',
      intent: 'ERROR',
      answer: 'Too many requests. Please slow down and try again in a moment.'
    });
    return;
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const { message, conversationHistory = [], conversationState = {}, userCoords = null, language = 'en' } = body;
    const isHindi = language === 'hi';

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
    const hasValidKey = Boolean(apiKey && apiKey !== 'your-gemini-api-key-here');
    if (!hasValidKey) {
      console.warn('[AI Assistance Notice] Server GEMINI_API_KEY is not configured. Serving verified D.CARD database grounded response directly.');
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

    let response = null;
    let lastModelError = null;

    if (hasValidKey) {
      // 6. Initialize Official Google GenAI Client
      const ai = new GoogleGenAI({ apiKey });

      // 7. Sanitize & build multi-turn history (bounded to last 6 turns, max 500 chars/turn)
      const rawHistory = Array.isArray(conversationHistory) ? conversationHistory : [];
      // If client included the current user question at the tail of conversationHistory, omit it
      const trimmedHistory = rawHistory.filter((turn) => {
        if (!turn || typeof turn !== 'object') return false;
        const turnText = String(turn.text || turn.content || '').trim();
        if (!turnText) return false;
        if (turn.sender === 'user' && turnText === cleanMessage) return false;
        return true;
      }).slice(-6);

      const contents = [];
      let lastRole = null;

      for (const turn of trimmedHistory) {
        const turnText = String(turn.text || turn.content || '').trim().slice(0, 500);
        if (!turnText) continue;

        const isUser = turn.sender === 'user' || turn.role === 'user';
        const role = isUser ? 'user' : 'model';

        if (role === lastRole && contents.length > 0) {
          contents[contents.length - 1].parts[0].text += `\n${turnText}`;
        } else {
          contents.push({
            role,
            parts: [{ text: turnText }]
          });
          lastRole = role;
        }
      }

      // Ensure contents does not end with 'user' before we push our final user prompt
      if (contents.length > 0 && contents[contents.length - 1].role === 'user') {
        contents.pop();
      }

      // Language preference instruction
      const languageInstruction = isHindi
        ? `CRITICAL LANGUAGE REQUIREMENT: The user's interface language is Hindi (हिंदी). You MUST respond in natural, fluent, Devanagari Hindi by default. Preserve official bank names, official product names, interest rates, fee figures, and IFSC codes accurately. If the user explicitly asks for English or another language in their message, respect their explicit choice.`
        : `LANGUAGE REQUIREMENT: The user's interface language is English. Respond in clear, professional English by default unless the user explicitly requests another language.`;

      // Current turn with grounded database and location context
      const currentPromptWithContext = [
        languageInstruction,
        `USER INTENT: ${intentObj.primaryIntent}${intentObj.isCombined ? ' + BANK_LOCATION_SEARCH' : ''}`,
        productRequirements && Object.keys(productRequirements).length > 0 ? `EXTRACTED REQUIREMENTS: ${JSON.stringify(productRequirements)}` : '',
        `==================================================`,
        `CURRENT VERIFIED D.CARD PRODUCT CONTEXT:`,
        productContextPrompt,
        `==================================================`,
        locationContextPrompt ? `${locationContextPrompt}\n==================================================` : '',
        `NOTE: Previous turns are provided only for conversational context. Ground ALL factual claims strictly in the CURRENT VERIFIED D.CARD PRODUCT CONTEXT above.`,
        `USER QUESTION: "${cleanMessage}"`
      ].filter(Boolean).join('\n\n');

      contents.push({
        role: 'user',
        parts: [{ text: currentPromptWithContext }]
      });

      // 8. Invoke Gemini with automatic model fallback across standard official models
      const configuredModel = process.env.GEMINI_MODEL ? process.env.GEMINI_MODEL.trim() : '';
      const candidateModels = [
        configuredModel,
        'gemini-2.5-flash',
        'gemini-2.0-flash',
        'gemini-1.5-flash'
      ].filter(Boolean);
      const modelsToTry = [...new Set(candidateModels)];

      for (const currentModel of modelsToTry) {
        try {
          const generatePromise = ai.models.generateContent({
            model: currentModel,
            contents,
            config: {
              systemInstruction: SYSTEM_INSTRUCTION,
              temperature: 0.2
            }
          });

          // 4500ms timeout per model attempt to prevent UI hangs and client drops
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error(`Model timeout after 4500ms for ${currentModel}`)), 4500)
          );

          response = await Promise.race([generatePromise, timeoutPromise]);
          if (response?.text) break;
        } catch (err) {
          lastModelError = err;
          console.warn(`[AI Assistance Notice] Model ${currentModel} returned error (${err.message || err}). Attempting fallback...`);
          // If network/API timed out or connection failed, do not cascade additional timeouts
          if (err.message && (err.message.includes('fetch failed') || err.message.includes('ENOTFOUND') || err.message.includes('timeout'))) {
            break;
          }
        }
      }
    }

    let cleanAnswer = '';
    let responseType = 'information_answer';

    if (response && response.text) {
      cleanAnswer = cleanVisibleAiText(response.text);
      if (intentObj.isCombined) {
        responseType = 'combined_results';
      } else if (isLocationQuery) {
        responseType = matchedLocations.length > 0 ? 'location_results' : 'no_results';
      } else if ((relevantProducts.savingsAccounts?.length || 0) + (relevantProducts.currentAccounts?.length || 0) + (relevantProducts.debitCards?.length || 0) > 0) {
        responseType = 'product_results';
      } else if (intentObj.primaryIntent === 'PRODUCT_COMPARISON') {
        responseType = 'comparison_results';
      }
    } else {
      // Deterministic, truthful D.CARD database response when model is unreachable or unavailable
      const lowerQuery = cleanMessage.toLowerCase();
      if (isLocationQuery && matchedLocations.length > 0) {
        const topLocs = matchedLocations.slice(0, 4);
        responseType = 'location_results';
        cleanAnswer = isHindi
          ? `D.CARD के सत्यापित डेटाबेस में ${matchedLocations.length} शाखाएं/एटीएम मिले हैं:\n\n` +
            topLocs.map(l => `• ${l.branch_name || l.branchName} (${l.bank_name || l.bankId}): ${l.address}, ${l.city} (IFSC: ${l.ifsc || 'N/A'})`).join('\n') +
            `\n\nआप नीचे इन्हें मैप पर देख सकते हैं और दिशा-निर्देश (Directions) प्राप्त कर सकते हैं।`
          : `Found ${matchedLocations.length} verified branch(es)/ATM(s) in D.CARD's database:\n\n` +
            topLocs.map(l => `• ${l.branch_name || l.branchName} (${l.bank_name || l.bankId}): ${l.address}, ${l.city} (IFSC: ${l.ifsc || 'N/A'})`).join('\n') +
            `\n\nYou can view them on the map and get directions below.`;
      } else if (isLocationQuery && (!locationResult || !locationResult.locations || locationResult.locations.length === 0)) {
        responseType = 'no_results';
        cleanAnswer = isHindi
          ? `D.CARD के वर्तमान डेटाबेस में "${cleanMessage}" से मेल खाती कोई सत्यापित शाखा या एटीएम नहीं मिला। आप शहर के नाम, पिन कोड से खोज सकते हैं या 'बैंक खोजें' में सभी सत्यापित शाखाएं देख सकते हैं।`
          : `I couldn't find any verified branches or ATMs matching "${cleanMessage}" in D.CARD's current database. You can search by city name, PIN code, or explore verified branches in Find My Bank.`;
      } else if (relevantProducts.savingsAccounts?.length > 0 && (lowerQuery.includes('saving') || lowerQuery.includes('zero') || lowerQuery.includes('बचत') || lowerQuery.includes('खाता') || intentObj.primaryIntent === 'PRODUCT_COMPARISON')) {
        responseType = 'product_results';
        const topAccounts = relevantProducts.savingsAccounts.slice(0, 4);
        cleanAnswer = isHindi
          ? `D.CARD के सत्यापित डेटाबेस के आधार पर, आपके प्रश्न से मेल खाते प्रमुख बचत खाते:\n\n` +
            topAccounts.map((a) => `• ${a.accountName || a.name} (${a.bank}): न्यूनतम शेष राशि ${a.minimumBalance || (a.isZeroBalance ? '₹0 (जीरो बैलेंस)' : 'N/A')}. ब्याज दर: ${a.interestRate || 'N/A'}.`).join('\n') +
            `\n\nआप नीचे सत्यापित शुल्क, ब्याज दरें और लिंक डेबिट कार्ड देख सकते हैं।`
          : `Based on D.CARD's verified database, here are matching savings accounts:\n\n` +
            topAccounts.map((a) => `• ${a.accountName || a.name} (${a.bank}): Minimum balance ${a.minimumBalance || (a.isZeroBalance ? '₹0 (Zero Balance)' : 'N/A')}. Interest rate: ${a.interestRate || 'N/A'}.`).join('\n') +
            `\n\nYou can review the verified charges, interest rates, and linked debit cards below.`;
      } else if (relevantProducts.currentAccounts?.length > 0 && (lowerQuery.includes('current') || lowerQuery.includes('business') || lowerQuery.includes('चालू'))) {
        responseType = 'product_results';
        const topCurrent = relevantProducts.currentAccounts.slice(0, 4);
        cleanAnswer = isHindi
          ? `D.CARD के सत्यापित डेटाबेस के आधार पर संबंधित चालू खाते:\n\n` +
            topCurrent.map((c) => `• ${c.accountName} (${c.bank}): मासिक औसत शेष (MAB) ${c.monthly_average_balance || c.minimum_balance || 'N/A'}.`).join('\n') +
            `\n\nआप नीचे संपूर्ण सीमाएं और सुविधाएं देख सकते हैं।`
          : `Based on D.CARD's verified database, here are matching business current accounts:\n\n` +
            topCurrent.map((c) => `• ${c.accountName} (${c.bank}): Monthly Average Balance (MAB) ${c.monthly_average_balance || c.minimum_balance || 'N/A'}.`).join('\n') +
            `\n\nYou can review complete limits and business features below.`;
      } else if (relevantProducts.debitCards?.length > 0 && (lowerQuery.includes('card') || lowerQuery.includes('debit') || lowerQuery.includes('lounge') || lowerQuery.includes('कार्ड'))) {
        responseType = 'product_results';
        const topCards = relevantProducts.debitCards.slice(0, 4);
        cleanAnswer = isHindi
          ? `D.CARD के सत्यापित डेटाबेस के आधार पर संबंधित डेबिट कार्ड:\n\n` +
            topCards.map((c) => `• ${c.name || c.cardName} (${c.bank || c.bank_name}): वार्षिक शुल्क ₹${c.annualFee !== undefined ? c.annualFee : (c.annual_fee || '0')}. लाउंज एक्सेस: ${c.loungeAccess || 'नहीं'}.`).join('\n') +
            `\n\nआप नीचे संपूर्ण सीमाएं और सुविधाएं देख सकते हैं।`
          : `Based on D.CARD's verified database, here are matching debit cards:\n\n` +
            topCards.map((c) => `• ${c.name || c.cardName} (${c.bank || c.bank_name}): Annual fee ₹${c.annualFee !== undefined ? c.annualFee : (c.annual_fee || '0')}. Lounge access: ${c.loungeAccess || 'No'}.`).join('\n') +
            `\n\nYou can review complete limits and features below.`;
      } else {
        // Truthful notice when question is conceptual/unmatched and AI service is unreachable
        responseType = 'service_notice';
        cleanAnswer = isHindi
          ? 'एआई सलाहकार सेवा से संपर्क स्थापित नहीं हो सका। कृपया कुछ पलों बाद पुनः प्रयास करें या सीधे बैंक निर्देशिका में सत्यापित उत्पादों की जांच करें।'
          : 'AI Advisor is temporarily unavailable to generate a direct response for this question. Please try again in a moment or explore verified terms in the product directory.';
      }
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
      success: true,
      type: responseType,
      intent: intentObj.primaryIntent,
      answer: cleanAnswer,
      matchedAccounts: relevantProducts.savingsAccounts || [],
      matchedCurrentAccounts: relevantProducts.currentAccounts || [],
      matchedCards: relevantProducts.debitCards || [],
      matchedLocations: matchedLocations,
      extractedRequirements: productRequirements,
      detectedBanks: relevantProducts.detectedBanks || [],
      conversationState: relevantProducts.conversationState || conversationState,
      suggestedActions,
      disclaimer: "Please verify the latest terms, charges and eligibility on the bank's official website before applying or visiting."
    });

  } catch (err) {
    console.error('[AI Assistance Error] Exception while generating response:', err.message || err);
    res.status(500).json({
      success: false,
      error: 'AI Advisor is temporarily unavailable. Please try again.',
      type: 'error',
      intent: 'ERROR',
      answer: 'AI Advisor is temporarily unavailable. Please try again in a moment.',
      matchedAccounts: [],
      matchedCurrentAccounts: [],
      matchedCards: [],
      matchedLocations: [],
      extractedRequirements: {},
      detectedBanks: [],
      suggestedActions: [],
      disclaimer: "Please verify the latest terms, charges and eligibility on the bank's official website before applying or visiting."
    });
  }
}
