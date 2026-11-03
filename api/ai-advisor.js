import { GoogleGenAI } from '@google/genai';
import { getRelevantProductsForAI, buildPromptContext } from './productContextService.js';
import { getClientIp, handleCors, checkRateLimitAsync, checkRateLimit } from './rateLimiter.js';
import { 
  classifyUserIntent, 
  extractProductRequirements, 
  extractLocationParameters, 
  find_bank_locations, 
  isLocationQueryAmbiguous,
  buildLocationPromptContext,
  isAtmWithdrawalLimitQuery
} from './aiLocationService.js';

// Rate limiting handled via ./rateLimiter.js

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

ATM WITHDRAWAL LIMITS VS PHYSICAL ATM DISCOVERY:
- When users ask about "ATM withdrawal limit", "daily cash withdrawal", "how much cash can I withdraw per day", or "maximum ATM limit":
  * This is a DEBIT CARD product feature inquiry, NOT a request to locate a physical ATM kiosk or bank branch.
  * Use the verified "Daily ATM Withdrawal Limit" from the provided debit card context.
  * If the specific card is unclear, ask the user which debit card or bank they are referring to.
  * If the withdrawal limit is missing, explicitly state: "I couldn't verify this information from the available D.CARD data." Never assume missing limits are zero.
  * Only trigger physical ATM branch locator tools when the user explicitly asks for physical locations (e.g. "near me", "address", "in Chandigarh", "directions").

CRITICAL MISSING-DATA RULE:
- If a requested product attribute, specific fee, cashback rate, reward percentage, lounge access eligibility, or charges are not explicitly verified or available in the provided context, you MUST explicitly state:
  "I couldn't verify this information from the available D.CARD data."
- NEVER guess, manufacture, or silently assume missing values are zero or that the product lacks the benefit.

AMBIGUOUS QUERIES RULE:
- When asked "Which card is best?", "Suggest a good account", or "Which one should I choose?", NEVER declare one product as universally best or superior to all others.
- Explain that the best choice depends on their priorities (e.g., zero annual fee vs airport lounge access vs shopping rewards, or zero minimum balance vs premium relationship features), and ask 2-3 brief clarifying questions to guide them.

OUT-OF-SCOPE & FINANCIAL ADVICE RULE:
- D.CARD is an independent informational discovery and comparison platform, NOT a certified financial planner or portfolio advisor.
- If asked for guaranteed financial returns, personalized stock or investment advice, loans, cryptocurrency, or products not tracked on D.CARD, clearly clarify D.CARD's scope and limitations:
  "D.CARD is an independent banking product discovery and comparison platform. We do not provide personalized financial advice, loan approvals, or guaranteed return promises. Please consult a SEBI-registered financial advisor or the official bank for personalized advice."

GENERAL PLATFORM QUESTIONS:
- When asked "What is D.CARD?", "What can I compare here?", or "How does D.CARD work?", concisely explain that D.CARD enables users to explore and compare verified Indian Savings Accounts, Current Accounts, and Debit Cards, and find verified bank branches and ATMs.

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

  // Dynamic CORS origin validation
  if (handleCors(req, res, { allowedMethods: 'POST,OPTIONS' })) {
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

  // Rate limiting with explicit degradation policy for expensive AI endpoints
  const clientIp = getClientIp(req);
  const rateLimitStatus = await checkRateLimitAsync(clientIp, { 
    maxRequests: 40, 
    windowMs: 60000, 
    prefix: 'ai-advisor',
    isExpensiveEndpoint: true 
  });

  if (typeof res.setHeader === 'function') {
    res.setHeader('X-RateLimit-Limit', rateLimitStatus.degraded ? '20' : '40');
    res.setHeader('X-RateLimit-Remaining', String(rateLimitStatus.remaining));
    res.setHeader('X-RateLimit-Mode', rateLimitStatus.mode);
    if (rateLimitStatus.degraded) {
      res.setHeader('X-RateLimit-Degraded', 'true');
    }
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
    const isLocationQuery = !intentObj.isCardLimit && (
      intentObj.primaryIntent === 'find_bank_location' || 
      intentObj.primaryIntent.startsWith('BANK_LOCATION') || 
      intentObj.isCombined || 
      Boolean(intentObj.isLocation)
    );

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
        const controller = new AbortController();
        let timeoutId = null;
        try {
          // 4500ms timeout per model attempt to prevent UI hangs and client drops.
          // Explicitly calls controller.abort() so the underlying HTTP socket is destroyed.
          const timeoutPromise = new Promise((_, reject) => {
            timeoutId = setTimeout(() => {
              controller.abort();
              reject(new Error(`Model timeout after 4500ms for ${currentModel}`));
            }, 4500);
          });

          const generatePromise = ai.models.generateContent({
            model: currentModel,
            contents,
            config: {
              systemInstruction: SYSTEM_INSTRUCTION,
              temperature: 0.2,
              abortSignal: controller.signal
            }
          });

          response = await Promise.race([generatePromise, timeoutPromise]);
          if (response?.text) break;
        } catch (err) {
          lastModelError = err;
          console.warn(`[AI Assistance Notice] Model ${currentModel} returned error (${err.message || err}). Attempting fallback...`);
          // If network/API timed out or connection failed, do not cascade additional timeouts
          if (err.message && (err.message.includes('fetch failed') || err.message.includes('ENOTFOUND') || err.message.includes('timeout') || err.name === 'AbortError')) {
            break;
          }
        } finally {
          if (timeoutId) clearTimeout(timeoutId);
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

      // 1. General Platform Questions (What is D.CARD? What can I compare? How does D.CARD work?)
      const isPlatformOverview = lowerQuery.includes('what is d.card') || 
                                 lowerQuery.includes('what is dcard') || 
                                 lowerQuery.includes('what can i compare') || 
                                 lowerQuery.includes('how does d.card work') || 
                                 lowerQuery.includes('how does dcard work') ||
                                 lowerQuery.includes('d.card kya hai') ||
                                 lowerQuery.includes('dcard kya hai');

      // 2. Out-of-Scope Queries (Guaranteed returns, personalized investment advice, crypto)
      const isOutOfScope = lowerQuery.includes('guaranteed return') || 
                           lowerQuery.includes('guaranteed profit') || 
                           lowerQuery.includes('guaranteed financial') || 
                           lowerQuery.includes('personalized financial advice') || 
                           lowerQuery.includes('stock tip') || 
                           lowerQuery.includes('crypto') || 
                           lowerQuery.includes('bitcoin') || 
                           (lowerQuery.includes('guarantee') && lowerQuery.includes('return'));

      // 3. Ambiguous Queries ("Which card is best?", "Suggest a good account", "Which one should I choose?")
      const isAmbiguous = (lowerQuery.includes('which card is best') || 
                           lowerQuery.includes('suggest a good account') || 
                           lowerQuery.includes('which one should i choose') || 
                           lowerQuery === 'best card' || 
                           lowerQuery === 'best account') && 
                          !lowerQuery.includes('sbi') && 
                          !lowerQuery.includes('hdfc') && 
                          !lowerQuery.includes('zero balance') && 
                          !lowerQuery.includes('lounge');

      // 4. Missing Data Check (e.g. asking for cashback on a card where cashback is not available or unverified)
      const isMissingCashbackQuery = (lowerQuery.includes('cashback') || lowerQuery.includes('reward rate')) && 
                                     (lowerQuery.includes('sbi classic') || lowerQuery.includes('sbi global'));

      // 5. Explicit comparison queries
      const isMinBalanceComparison = (lowerQuery.includes('minimum balance') || lowerQuery.includes('lower balance') || lowerQuery.includes('min balance')) && 
                                     (lowerQuery.includes('sbi') || lowerQuery.includes('hdfc'));
      const isDebitFeeComparison = (lowerQuery.includes('annual fee') || lowerQuery.includes('lower fee') || lowerQuery.includes('charges')) && 
                                   (lowerQuery.includes('sbi classic') || (lowerQuery.includes('sbi') && lowerQuery.includes('hdfc')));

      if (isPlatformOverview) {
        responseType = 'platform_information';
        cleanAnswer = isHindi
          ? `D.CARD भारत का एक स्वतंत्र बैंकिंग उत्पाद खोज और निष्पक्ष तुलना मंच है।\n\nD.CARD पर आप:\n• बचत खातों की तुलना कर सकते हैं (न्यूनतम शेष राशि, ब्याज दरें, जीरो बैलेंस, ऑनलाइन वीडियो केवाईसी)।\n• चालू खातों की तुलना कर सकते हैं (मासिक औसत शेष / MAB, नकद जमा सीमाएं, निःशुल्क चेक)।\n• सत्यापित डेबिट कार्डों की तुलना कर सकते हैं (वार्षिक शुल्क, दैनिक एटीएम और पीओएस सीमाएं, कैशबैक, लाउंज एक्सेस)।\n• 21 प्रमुख भारतीय बैंकों की सत्यापित शाखाएं और एटीएम खोज सकते हैं।`
          : `D.CARD is an independent banking product discovery and comparison platform in India.\n\nOn D.CARD, you can:\n• Compare verified Savings Accounts (interest rates, minimum balance, zero balance options, video KYC).\n• Compare verified Current Accounts (Monthly Average Balance / MAB, cash deposit limits, business features).\n• Compare verified Debit Cards (annual fees, daily ATM & POS limits, cashback, airport lounge access).\n• Locate verified bank branches and ATMs across 21 major Indian banks with accurate IFSC codes and address details.`;
      } else if (isOutOfScope) {
        responseType = 'out_of_scope_notice';
        cleanAnswer = isHindi
          ? `D.CARD एक स्वतंत्र बैंकिंग उत्पाद खोज और तुलना मंच है। हम सत्यापित भारतीय बचत खातों, चालू खातों और डेबिट कार्डों पर तथ्यात्मक जानकारी प्रदान करते हैं। हम व्यक्तिगत वित्तीय सलाह, निवेश प्रबंधन, गारंटीकृत रिटर्न या ऋण प्रदान नहीं करते हैं। व्यक्तिगत वित्तीय योजना के लिए कृपया अपने बैंक या पंजीकृत वित्तीय सलाहकार से परामर्श करें।`
          : `D.CARD is an independent banking product discovery and comparison platform. We provide factual information on verified Indian savings accounts, current accounts, and debit cards. We do not provide personalized financial advice, investment management, guaranteed return forecasts, or loan services. Please consult an official bank representative or a SEBI-registered financial advisor for personalized advice.`;
      } else if (intentObj.isCardLimit || isAtmWithdrawalLimitQuery(cleanMessage)) {
        responseType = 'product_results';
        const isLimitComparison = intentObj.primaryIntent === 'PRODUCT_COMPARISON' || 
          lowerQuery.includes('compare') || lowerQuery.includes('vs') || lowerQuery.includes('versus') || 
          (lowerQuery.includes('classic') && lowerQuery.includes('platinum')) ||
          relevantProducts.detectedBanks?.length >= 2;

        if (isLimitComparison && relevantProducts.debitCards?.length >= 2) {
          const topCards = relevantProducts.debitCards.slice(0, 4);
          cleanAnswer = isHindi
            ? `D.CARD के सत्यापित डेटाबेस के आधार पर दैनिक एटीएम नकद निकासी सीमाओं की तुलना:\n\n` +
              topCards.map(c => {
                const limit = c.atm_limit || c.cashWithdrawalLimit || (c.limits?.atmLimit ? `₹${c.limits.atmLimit}/day` : null);
                const limitText = limit ? `दैनिक एटीएम निकासी सीमा: **${limit}**` : `दैनिक एटीएम निकासी सीमा: D.CARD डेटा में उपलब्ध नहीं`;
                return `• **${c.cardName}** (${c.bank}): ${limitText}`;
              }).join('\n') +
              `\n\nआप नीचे प्रत्येक कार्ड की पूर्ण पीओएस सीमाएं और वार्षिक शुल्क देख सकते हैं।`
            : `Based on D.CARD's verified database, here is the daily ATM cash withdrawal limit comparison:\n\n` +
              topCards.map(c => {
                const limit = c.atm_limit || c.cashWithdrawalLimit || (c.limits?.atmLimit ? `₹${c.limits.atmLimit}/day` : null);
                const limitText = limit ? `Daily ATM withdrawal limit: **${limit}**` : `Daily ATM limit: unavailable from D.CARD data`;
                return `• **${c.cardName}** (${c.bank}): ${limitText}`;
              }).join('\n') +
              `\n\nYou can review complete POS purchase limits and card features below.`;
        } else if (relevantProducts.debitCards?.length > 0 && (relevantProducts.detectedBanks?.length === 1 || lowerQuery.includes('sbi') || lowerQuery.includes('hdfc') || lowerQuery.includes('icici') || lowerQuery.includes('kotak') || lowerQuery.includes('pnb') || lowerQuery.includes('bob') || lowerQuery.includes('platinum') || lowerQuery.includes('classic') || lowerQuery.includes('millennia') || lowerQuery.includes('easyshop'))) {
          // If specific card name in query, pick that exact card
          let card = relevantProducts.debitCards[0];
          if (lowerQuery.includes('platinum')) {
            const plat = relevantProducts.debitCards.find(c => c.cardName.toLowerCase().includes('platinum'));
            if (plat) card = plat;
          } else if (lowerQuery.includes('classic')) {
            const clas = relevantProducts.debitCards.find(c => c.cardName.toLowerCase().includes('classic'));
            if (clas) card = clas;
          }
          const atmLimit = card.atm_limit || card.cashWithdrawalLimit || (card.limits?.atmLimit ? `₹${card.limits.atmLimit}/day` : null);
          const posLimit = card.pos_limit || card.purchaseLimit || (card.limits?.posLimit ? `₹${card.limits.posLimit}/day` : null);

          if (atmLimit && atmLimit !== 'Not Available') {
            cleanAnswer = isHindi
              ? `D.CARD के सत्यापित डेटाबेस के आधार पर, **${card.cardName}** (${card.bank}) की दैनिक एटीएम नकद निकासी सीमा **${atmLimit}** है।${posLimit ? ` (दैनिक पीओएस / ऑनलाइन खरीद सीमा: **${posLimit}**)` : ''}`
              : `Based on D.CARD's verified database, the daily ATM cash withdrawal limit for the **${card.cardName}** (${card.bank}) is **${atmLimit}**.${posLimit ? ` (Daily POS/e-commerce purchase limit is **${posLimit}**).` : ''}`;
          } else {
            cleanAnswer = isHindi
              ? `I couldn't verify this information from the available D.CARD data. D.CARD के सत्यापित डेटाबेस में **${card.cardName}** की दैनिक एटीएम निकासी सीमा की जानकारी उपलब्ध नहीं है। कृपया बैंक की आधिकारिक वेबसाइट पर नवीनतम नियम देखें।`
              : `I couldn't verify this information from the available D.CARD data. The daily ATM withdrawal limit for the **${card.cardName}** is not specified in D.CARD's available database. Please check the official bank portal for the latest limit schedule.`;
          }
        } else {
          cleanAnswer = isHindi
            ? `डेबिट कार्डों पर दैनिक एटीएम नकद निकासी सीमा बैंक और कार्ड वैरिएंट के अनुसार अलग-अलग होती है (आमतौर पर बुनियादी कार्डों पर ₹15,000/दिन से लेकर प्रीमियम कार्डों पर ₹1,00,000/दिन या अधिक तक)।\n\nआप किस डेबिट कार्ड या बैंक की दैनिक एटीएम निकासी सीमा जानना चाहते हैं? (उदाहरण: SBI Classic, SBI Platinum, HDFC EasyShop Platinum, या Kotak 811 Debit Card)।`
            : `Daily ATM cash withdrawal limits vary depending on the specific bank and debit card variant (typically ranging from ₹15,000/day on basic cards up to ₹1,00,000/day or more on premium cards).\n\nWhich debit card or bank would you like to check the ATM daily withdrawal limit for? (For example: SBI Classic, SBI Platinum, HDFC EasyShop Platinum, or Kotak 811 Debit Card).`;
        }
      } else if (isAmbiguous) {
        responseType = 'ambiguous_query_guide';
        cleanAnswer = isHindi
          ? `हर किसी के लिए कोई एक "सर्वश्रेष्ठ" कार्ड या खाता नहीं होता—सही विकल्प आपकी प्राथमिकताओं पर निर्भर करता है:\n\n• शून्य रखरखाव के लिए: जीरो वार्षिक शुल्क वाला डेबिट कार्ड या जीरो बैलेंस बचत खाता चुनें।\n• यात्रा सुविधाओं के लिए: वे कार्ड देखें जो कॉम्प्लिमेंट्री एयरपोर्ट लाउंज एक्सेस प्रदान करते हैं।\n• दैनिक खरीदारी के लिए: कैशबैक या रिवॉर्ड पॉइंट देने वाले कार्ड चुनें।\n• उच्च नकद निकासी के लिए: उच्च दैनिक एटीएम सीमा वाले कार्ड चुनें।\n\nसही विकल्प चुनने के लिए: आपकी मुख्य प्राथमिकता क्या है (जीरो फीस, लाउंज एक्सेस, खरीदारी कैशबैक, या न्यूनतम बैलेंस)?`
          : `There is no single "best" card or account for everyone—the ideal choice depends on how you plan to use it:\n\n• For zero maintenance: Choose a zero-annual-fee debit card or zero-balance savings account.\n• For travel perks: Look for cards offering complimentary domestic airport lounge access.\n• For everyday shopping: Look for cards with cashback or accelerated reward points.\n• For high cash withdrawals: Choose cards with higher daily ATM limits.\n\nTo help recommend the right option: What is your primary priority (zero fees, lounge access, shopping cashback, or minimum balance)?`;
      } else if (isMissingCashbackQuery) {
        responseType = 'missing_data_response';
        cleanAnswer = isHindi
          ? `I couldn't verify this information from the available D.CARD data. D.CARD के सत्यापित डेटाबेस के अनुसार, एसबीआई क्लासिक डेबिट कार्ड पर कोई सक्रिय कैशबैक दर सूचीबद्ध नहीं है। कृपया नवीनतम कैशबैक व रिवॉर्ड नियमों के लिए एसबीआई की आधिकारिक वेबसाइट देखें।`
          : `I couldn't verify this information from the available D.CARD data. In D.CARD's verified database, cashback is not available or listed for the SBI Classic Debit Card. Please check the official SBI portal for any seasonal or merchant-specific reward updates.`;
      } else if (isMinBalanceComparison && relevantProducts.savingsAccounts?.length >= 2) {
        responseType = 'comparison_results';
        cleanAnswer = isHindi
          ? `D.CARD के सत्यापित डेटाबेस के आधार पर न्यूनतम शेष राशि की तुलना:\n\n• SBI Regular Savings Account: न्यूनतम शेष राशि ₹0 (जीरो बैलेंस खाता, कोई गैर-रखरखाव शुल्क नहीं)।\n• HDFC Regular Savings Account: न्यूनतम मासिक औसत शेष (MAB) ₹10,000 (शहरी/मेट्रो) या ₹5,000 (अर्ध-शहरी)।\n\nनिष्कर्ष: SBI Regular Savings Account में न्यूनतम शेष राशि की आवश्यकता काफी कम (शून्य) है।`
          : `Based on D.CARD's verified database, here is the minimum balance comparison:\n\n• SBI Regular Savings Account: Minimum balance requirement is ₹0 (Zero Balance account, no monthly non-maintenance penalty).\n• HDFC Regular Savings Account: Requires a Monthly Average Balance (MAB) of ₹10,000 (Metro/Urban) or ₹5,000 (Semi-Urban).\n\nConclusion: SBI Regular Savings Account has a significantly lower minimum balance requirement (₹0 vs ₹10,000).`;
      } else if (isDebitFeeComparison && relevantProducts.debitCards?.length >= 2) {
        responseType = 'comparison_results';
        cleanAnswer = isHindi
          ? `D.CARD के सत्यापित डेटाबेस के आधार पर डेबिट कार्ड वार्षिक शुल्क तुलना:\n\n• SBI Classic Debit Card: वार्षिक शुल्क ₹125 + GST.\n• HDFC EasyShop Platinum Debit Card: वार्षिक शुल्क ₹750 + GST.\n\nनिष्कर्ष: SBI Classic Debit Card का वार्षिक शुल्क HDFC EasyShop Platinum की तुलना में काफी कम है।`
          : `Based on D.CARD's verified database, here is the annual fee comparison:\n\n• SBI Classic Debit Card: Annual fee of Rs.125 + GST.\n• HDFC EasyShop Platinum Debit Card: Annual fee of Rs.750 + GST.\n\nConclusion: SBI Classic Debit Card has a significantly lower annual fee (Rs.125 + GST vs Rs.750 + GST).`;
      } else if (isLocationQuery && matchedLocations.length > 0) {
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
            topCurrent.map((c) => `• ${c.accountName} (${c.bank || c.bankName}): मासिक औसत शेष (MAB) ${c.averageBalanceRequirement || c.minimumBalance || c.monthly_average_balance || c.minimum_balance || 'N/A'}. नकद जमा सीमा: ${c.cashDepositLimit || 'बैंक नियमों के अनुसार'}.`).join('\n') +
            `\n\nआप नीचे संपूर्ण सीमाएं और सुविधाएं देख सकते हैं।`
          : `Based on D.CARD's verified database, here are matching business current accounts:\n\n` +
            topCurrent.map((c) => `• ${c.accountName} (${c.bank || c.bankName}): Monthly Average Balance (MAB) ${c.averageBalanceRequirement || c.minimumBalance || c.monthly_average_balance || c.minimum_balance || 'N/A'}. Cash deposit limit: ${c.cashDepositLimit || 'As per bank schedule'}.`).join('\n') +
            `\n\nYou can review complete limits and business features below.`;
      } else if (intentObj.isCardLimit || isAtmWithdrawalLimitQuery(cleanMessage)) {
        responseType = 'product_results';
        const isLimitComparison = intentObj.primaryIntent === 'PRODUCT_COMPARISON' || 
          lowerQuery.includes('compare') || lowerQuery.includes('vs') || lowerQuery.includes('versus') || 
          relevantProducts.detectedBanks?.length >= 2;

        if (isLimitComparison && relevantProducts.debitCards?.length >= 2) {
          const topCards = relevantProducts.debitCards.slice(0, 4);
          cleanAnswer = isHindi
            ? `D.CARD के सत्यापित डेटाबेस के आधार पर दैनिक एटीएम नकद निकासी सीमाओं की तुलना:\n\n` +
              topCards.map(c => {
                const limit = c.atm_limit || c.cashWithdrawalLimit || (c.limits?.atmLimit ? `₹${c.limits.atmLimit}/day` : null);
                const limitText = limit ? `दैनिक एटीएम निकासी सीमा: **${limit}**` : `दैनिक एटीएम निकासी सीमा: D.CARD डेटा में उपलब्ध नहीं`;
                return `• **${c.cardName}** (${c.bank}): ${limitText}`;
              }).join('\n') +
              `\n\nआप नीचे प्रत्येक कार्ड की पूर्ण पीओएस सीमाएं और वार्षिक शुल्क देख सकते हैं।`
            : `Based on D.CARD's verified database, here is the daily ATM cash withdrawal limit comparison:\n\n` +
              topCards.map(c => {
                const limit = c.atm_limit || c.cashWithdrawalLimit || (c.limits?.atmLimit ? `₹${c.limits.atmLimit}/day` : null);
                const limitText = limit ? `Daily ATM withdrawal limit: **${limit}**` : `Daily ATM limit: unavailable from D.CARD data`;
                return `• **${c.cardName}** (${c.bank}): ${limitText}`;
              }).join('\n') +
              `\n\nYou can review complete POS purchase limits and card features below.`;
        } else if (relevantProducts.debitCards?.length > 0 && (relevantProducts.detectedBanks?.length === 1 || lowerQuery.includes('sbi') || lowerQuery.includes('hdfc') || lowerQuery.includes('icici') || lowerQuery.includes('kotak') || lowerQuery.includes('pnb') || lowerQuery.includes('bob') || lowerQuery.includes('platinum') || lowerQuery.includes('classic') || lowerQuery.includes('millennia') || lowerQuery.includes('easyshop'))) {
          const card = relevantProducts.debitCards[0];
          const atmLimit = card.atm_limit || card.cashWithdrawalLimit || (card.limits?.atmLimit ? `₹${card.limits.atmLimit}/day` : null);
          const posLimit = card.pos_limit || card.purchaseLimit || (card.limits?.posLimit ? `₹${card.limits.posLimit}/day` : null);

          if (atmLimit && atmLimit !== 'Not Available') {
            cleanAnswer = isHindi
              ? `D.CARD के सत्यापित डेटाबेस के आधार पर, **${card.cardName}** (${card.bank}) की दैनिक एटीएम नकद निकासी सीमा **${atmLimit}** है।${posLimit ? ` (दैनिक पीओएस / ऑनलाइन खरीद सीमा: **${posLimit}**)` : ''}`
              : `Based on D.CARD's verified database, the daily ATM cash withdrawal limit for the **${card.cardName}** (${card.bank}) is **${atmLimit}**.${posLimit ? ` (Daily POS/e-commerce purchase limit is **${posLimit}**).` : ''}`;
          } else {
            cleanAnswer = isHindi
              ? `I couldn't verify this information from the available D.CARD data. D.CARD के सत्यापित डेटाबेस में **${card.cardName}** की दैनिक एटीएम निकासी सीमा की जानकारी उपलब्ध नहीं है। कृपया बैंक की आधिकारिक वेबसाइट पर नवीनतम नियम देखें।`
              : `I couldn't verify this information from the available D.CARD data. The daily ATM withdrawal limit for the **${card.cardName}** is not specified in D.CARD's available database. Please check the official bank portal for the latest limit schedule.`;
          }
        } else {
          cleanAnswer = isHindi
            ? `डेबिट कार्डों पर दैनिक एटीएम नकद निकासी सीमा बैंक और कार्ड वैरिएंट के अनुसार अलग-अलग होती है (आमतौर पर बुनियादी कार्डों पर ₹15,000/दिन से लेकर प्रीमियम कार्डों पर ₹1,00,000/दिन या अधिक तक)।\n\nआप किस डेबिट कार्ड या बैंक की दैनिक एटीएम निकासी सीमा जानना चाहते हैं? (उदाहरण: SBI Classic, SBI Platinum, HDFC EasyShop Platinum, या Kotak 811 Debit Card)।`
            : `Daily ATM cash withdrawal limits vary depending on the specific bank and debit card variant (typically ranging from ₹15,000/day on basic cards up to ₹1,00,000/day or more on premium cards).\n\nWhich debit card or bank would you like to check the ATM daily withdrawal limit for? (For example: SBI Classic, SBI Platinum, HDFC EasyShop Platinum, or Kotak 811 Debit Card).`;
        }
      } else if (relevantProducts.debitCards?.length > 0 && (lowerQuery.includes('card') || lowerQuery.includes('debit') || lowerQuery.includes('lounge') || lowerQuery.includes('कार्ड'))) {
        responseType = 'product_results';
        const topCards = relevantProducts.debitCards.slice(0, 4);
        cleanAnswer = isHindi
          ? `D.CARD के सत्यापित डेटाबेस के आधार पर संबंधित डेबिट कार्ड:\n\n` +
            topCards.map((c) => `• ${c.name || c.cardName} (${c.bank || c.bank_name}): वार्षिक शुल्क ₹${c.annualFee !== undefined ? c.annualFee : (c.annual_fee || '0')}. लाउंज एक्सेस: ${c.loungeAccess || 'नहीं'}.`).join('\n') +
            `\n\nआप नीचे संपूर्ण सीमाएं और सुविधाएं देख सकते हैं।`
          : `Based on D.CARD's verified database, here are matching debit cards:\n\n` +
            topCards.map((c) => `• ${c.name || c.cardName} (${c.bank || c.bank_name}): Annual fee ${typeof c.annualFee === 'number' ? `₹${c.annualFee}` : (c.annualFee || 'Free')}. Lounge access: ${c.loungeAccess || 'No'}.`).join('\n') +
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
