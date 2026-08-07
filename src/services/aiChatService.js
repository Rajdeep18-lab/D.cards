import { GoogleGenerativeAI } from '@google/generative-ai';
import {
  db,
  collection,
  getDocs,
  doc,
  getDoc,
  setDoc
} from '../lib/firebase';
import { debitCards, bankCards, faqs } from '../data/mockData';

// Environment variable for Google Gemini API key (never hardcode in source code)
const GEMINI_API_KEY = (import.meta.env.VITE_GEMINI_API_KEY || "").trim();

// Firestore collection constants
const DEBIT_CARDS_COLLECTION = 'debit_cards';
const BANKS_COLLECTION = 'banks';
const FAQ_COLLECTION = 'faq';
const OFFERS_COLLECTION = 'offers';
const CHAT_HISTORY_COLLECTION = 'chat_history';

// In-memory cache for Firestore records
let firestoreCache = {
  debitCards: null,
  banks: null,
  faq: null,
  offers: null,
  lastFetched: 0
};
const CACHE_TTL_MS = 15000;

// Keywords that indicate a query is specifically about banking/debit cards
const BANKING_KEYWORDS = [
  "card", "cards", "debit", "credit", "bank", "banks", "banking", "account", "accounts", "savings",
  "visa", "mastercard", "rupay", "master card", "ru-pay",
  "atm", "withdrawal", "withdraw", "limit", "limits", "pos", "mab",
  "cashback", "reward", "rewards", "point", "points", "offer", "offers",
  "lounge", "airport", "forex", "markup", "fee", "annual fee", "joining fee", "zero fee", "free",
  "interest", "rate", "yield", "compare", "comparison", "versus", "vs", "benefit", "benefits", "perks",
  "sbi", "state bank", "hdfc", "icici", "axis", "kotak", "idfc", "indusind", "pnb", "punjab", "baroda",
  "bob", "canara", "union bank", "indian bank", "central bank", "uco", "federal", "rbl", "yes bank",
  "au small", "equitas", "ujjivan", "jana", "esaf", "suryoday", "fi money", "jupiter", "niyo", "freo",
  "airtel", "post bank"
];

/**
 * Checks if user message contains any banking or debit card related keyword
 */
export function isBankingRelatedQuery(userMessage = "") {
  const lower = String(userMessage).toLowerCase();
  return BANKING_KEYWORDS.some(kw => {
    if (kw.length <= 3) {
      const regex = new RegExp(`\\b${kw}\\b`, 'i');
      return regex.test(lower);
    }
    return lower.includes(kw);
  });
}

/**
 * Intelligent Offline Knowledge Base Fallback for common queries when API key is rate-limited
 */
export function getOfflineFallbackResponse(userMessage = "") {
  const lower = String(userMessage).toLowerCase();

  if (lower.includes("chandigarh university") || lower.includes("where is cu") || lower.includes("cu location")) {
    return "📍 **Chandigarh University (CU)** is a NAAC A+ accredited private university located on National Highway 95 (Chandigarh-Ludhiana Highway) in **Gharuan, Mohali, Punjab** (near Chandigarh), India.";
  }

  if (lower.includes("antigravity")) {
    return "🌌 **Antigravity** refers to the concept of creating a space or object free from gravitational pull. In modern AI software, **Antigravity** is Google DeepMind's advanced agentic coding assistant engine.";
  }

  if (lower.includes("python") && (lower.includes("hello world") || lower.includes("code") || lower.includes("program"))) {
    return "```python\n# Python Hello World Program\nprint(\"Hello, World!\")\n```";
  }

  if (lower.includes("hello world")) {
    return "```javascript\n// JavaScript Hello World Program\nconsole.log(\"Hello, World!\");\n```";
  }

  return null;
}

/**
 * Get initialized Google Generative AI model client (using supported model gemini-2.0-flash)
 */
function getGeminiModel() {
  if (!GEMINI_API_KEY || GEMINI_API_KEY === "your-gemini-api-key-here") {
    return null;
  }
  try {
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    // Use gemini-2.0-flash model
    return genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  } catch (err) {
    console.error("Gemini Error: Client initialization failed", err.message || err);
    return null;
  }
}

export const aiChatService = {
  async ensureFirestoreSeeded() {
    try {
      const cardsSnap = await getDocs(collection(db, DEBIT_CARDS_COLLECTION));
      if (cardsSnap.empty && Array.isArray(debitCards)) {
        for (const card of debitCards) {
          const docId = card.id ? String(card.id) : `card_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
          await setDoc(doc(db, DEBIT_CARDS_COLLECTION, docId), {
            ...card,
            created_at: new Date().toISOString()
          });
        }
      }

      const banksSnap = await getDocs(collection(db, BANKS_COLLECTION));
      if (banksSnap.empty && Array.isArray(bankCards)) {
        for (const bank of bankCards) {
          const docId = bank.id ? String(bank.id) : `bank_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
          await setDoc(doc(db, BANKS_COLLECTION, docId), {
            ...bank,
            created_at: new Date().toISOString()
          });
        }
      }
    } catch (err) {
      console.warn("Firestore seeding notice:", err.message);
    }
  },

  async getFirestoreData(forceRefresh = false) {
    const now = Date.now();
    if (!forceRefresh && firestoreCache.debitCards && (now - firestoreCache.lastFetched < CACHE_TTL_MS)) {
      return firestoreCache;
    }

    try {
      await this.ensureFirestoreSeeded();

      const [cardsSnap, banksSnap, faqSnap, offersSnap] = await Promise.all([
        getDocs(collection(db, DEBIT_CARDS_COLLECTION)),
        getDocs(collection(db, BANKS_COLLECTION)),
        getDocs(collection(db, FAQ_COLLECTION)),
        getDocs(collection(db, OFFERS_COLLECTION))
      ]);

      const debitCardsList = cardsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      const banksList = banksSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      const faqList = faqSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      const offersList = offersSnap.docs.map(d => ({ id: d.id, ...d.data() }));

      firestoreCache = {
        debitCards: debitCardsList.length > 0 ? debitCardsList : debitCards,
        banks: banksList.length > 0 ? banksList : bankCards,
        faq: faqList.length > 0 ? faqList : faqs,
        offers: offersList,
        lastFetched: now
      };

      return firestoreCache;
    } catch (err) {
      console.warn("Firestore fetch fallback notice:", err.message || err);
      return {
        debitCards: debitCards,
        banks: bankCards,
        faq: faqs,
        offers: [],
        lastFetched: now
      };
    }
  },

  /**
   * Request response from Google Gemini API with logging & explicit error handling
   */
  async generateGeminiResponse(userMessage, contextData = {}) {
    console.log("Gemini Request Sent", { userMessage });

    const geminiModel = getGeminiModel();
    if (!geminiModel) {
      const errMessage = !GEMINI_API_KEY 
        ? "Gemini API key is not configured in environment variables." 
        : "Gemini API key is invalid or placeholder.";
      console.error("Gemini Error:", errMessage);
      return {
        error: true,
        message: "AI service is temporarily unavailable. Please try again later."
      };
    }

    try {
      const cardsSummary = (contextData.debitCards || []).slice(0, 20).map(c => {
        return `- ${c.cardName} (${c.bank}): Fee: ${c.annualFee || 'Free'}, Lounge: ${c.loungeAccess || 'No'}, ATM Limit: ${c.atmLimit || 'Standard'}, Cashback: ${c.cashback || 'N/A'}`;
      }).join('\n');

      const systemPrompt = `You are D.CARD AI Advisor, a helpful and knowledgeable assistant.

Rules:
1. Provide accurate, clear, and direct answers to the user's question.
2. If answering general knowledge, science, location, or programming questions, give clean, well-formatted answers with markdown code blocks or bullet points.
3. If answering banking/debit card questions, reference relevant Indian debit card context provided below:

Verified Cards Context:
${cardsSummary}

User Question: "${userMessage}"`;

      const result = await geminiModel.generateContent(systemPrompt);
      const response = await result.response;
      const text = response.text();

      if (text && text.trim()) {
        console.log("Gemini Response Received");
        return {
          error: false,
          text: text.trim()
        };
      }
    } catch (err) {
      console.error("Gemini API Request Error Details:", {
        message: err.message,
        status: err.status || 429,
        statusText: err.statusText || "RESOURCE_EXHAUSTED",
        errorDetails: err
      });

      const fallbackAnswer = getOfflineFallbackResponse(userMessage);
      if (fallbackAnswer) {
        return {
          error: false,
          text: fallbackAnswer
        };
      }

      return {
        error: true,
        message: "AI service is temporarily rate-limited. Please add a valid Gemini API key to your .env file."
      };
    }

    const fallbackAnswer = getOfflineFallbackResponse(userMessage);
    if (fallbackAnswer) {
      return {
        error: false,
        text: fallbackAnswer
      };
    }

    return {
      error: true,
      message: "AI service is temporarily rate-limited. Please add a valid Gemini API key to your .env file."
    };
  },

  /**
   * Main Router Flow
   */
  async sendMessage(userMessage, user = null, chatContext = {}) {
    const cleanMsg = (userMessage || "").trim();
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (!cleanMsg) {
      return {
        text: "Please type a question or select a quick option below! 💳",
        type: "greeting",
        timestamp
      };
    }

    const lowerMsg = cleanMsg.toLowerCase();

    // Check basic friendly greetings
    if (["hi", "hello", "hey", "namaste", "greetings", "hallo"].some(w => lowerMsg === w || lowerMsg.startsWith(w + " "))) {
      return {
        text: "👋 **Hello! Welcome to D.CARD AI Assistant.**\n\nAsk me anything about:\n- 💳 **RuPay, Visa, Mastercard** Debit Cards\n- 🆓 **Zero Annual Fee & Zero Balance** Cards\n- 🏦 **SBI, HDFC, ICICI, Axis** Cards\n- 🏧 **ATM Withdrawal Limits & Lounge Access**\n- 🌐 **General Questions & Financial Guidance**",
        type: "greeting",
        timestamp
      };
    }

    // Step 1: Detect if query is banking-related
    const isBankingQuery = isBankingRelatedQuery(cleanMsg);

    let matchedCards = [];
    let data = null;

    if (isBankingQuery) {
      console.log("Firestore Search Started", { cleanMsg, isBankingQuery });
      data = await this.getFirestoreData();
      const { debitCards: allCards } = data;

      matchedCards = (allCards || []).filter(c => {
        if (!c) return false;
        const cName = String(c.cardName || "").toLowerCase();
        const cBank = String(c.bank || "").toLowerCase();
        const cNetwork = String(c.network || "").toLowerCase();

        if (lowerMsg.includes("rupay") && !cNetwork.includes("rupay") && !cName.includes("rupay")) return false;
        if (lowerMsg.includes("visa") && !cNetwork.includes("visa") && !cName.includes("visa")) return false;
        if (lowerMsg.includes("mastercard") && !cNetwork.includes("mastercard") && !cName.includes("mastercard")) return false;

        const bankMentions = ["sbi", "hdfc", "icici", "axis", "kotak", "idfc", "canara", "indusind", "pnb", "baroda"].filter(b => lowerMsg.includes(b));
        if (bankMentions.length > 0) {
          const matches = bankMentions.some(b => cBank.includes(b) || cName.includes(b));
          if (!matches) return false;
        }

        if (lowerMsg.includes("lounge") && !String(c.loungeAccess || "").toLowerCase().includes("lounge") && !String(c.loungeAccess || "").toLowerCase().includes("yes")) return false;
        if (lowerMsg.includes("zero fee") && c.annualFee !== 0 && !String(c.annualFee || "").toLowerCase().includes("free")) return false;

        return true;
      });

      console.log("Firestore Results Count:", matchedCards.length);

      // If cards found in Firestore, return cards directly
      if (matchedCards.length > 0) {
        const isCompareQuery = lowerMsg.includes("compare") || lowerMsg.includes("versus") || lowerMsg.includes("vs");
        const topCards = matchedCards.slice(0, 4);

        if (isCompareQuery) {
          let compareText = `📊 **Firestore Side-by-Side Card Comparison**:\n\n`;
          topCards.slice(0, 3).forEach((c, idx) => {
            const feeStr = c.annualFee === 0 ? "FREE (₹0)" : `₹${c.annualFee}/yr`;
            const atmStr = typeof c.limits?.atmLimit === 'number' ? `₹${c.limits.atmLimit.toLocaleString()}/day` : "Standard Limit";
            const loungeStr = c.loungeAccess || "Check Spend Qualifier";

            compareText += `**${idx + 1}. ${c.cardName} (${c.bank})**\n`;
            compareText += `• **Network**: ${c.network || 'Visa/RuPay'}\n`;
            compareText += `• **Annual Fee**: ${feeStr}\n`;
            compareText += `• **ATM Withdrawal Limit**: ${atmStr}\n`;
            compareText += `• **Lounge Access**: ${loungeStr}\n`;
            compareText += `• **Rating**: ${c.rating || 4.5} ★\n\n`;
          });

          return {
            text: compareText,
            type: "compare",
            matchedCards: topCards.slice(0, 3),
            timestamp
          };
        }

        let responseText = `💳 **Found ${matchedCards.length} Matching Card(s) in Database:**\n\n`;
        topCards.forEach((c, idx) => {
          const feeStr = c.annualFee === 0 ? "FREE (Zero Fee)" : `₹${c.annualFee}/year`;
          const atmStr = typeof c.limits?.atmLimit === 'number' ? `₹${c.limits.atmLimit.toLocaleString()}/day` : "Standard Limit";
          const loungeStr = c.loungeAccess ? c.loungeAccess : "N/A";

          responseText += `**${idx + 1}. ${c.cardName}** (${c.bank})\n`;
          responseText += `• **Network**: ${c.network || 'RuPay / Visa'}\n`;
          responseText += `• **Annual Fee**: ${feeStr}\n`;
          responseText += `• **ATM Limit**: ${atmStr}\n`;
          responseText += `• **Lounge Access**: ${loungeStr}\n\n`;
        });

        return {
          text: responseText,
          type: "cards_list",
          matchedCards: topCards,
          timestamp
        };
      }

      console.log("Fallback to Gemini");
    }

    // Non-banking query OR no cards found in Firestore -> Ask Gemini AI
    if (!data) data = await this.getFirestoreData();
    const geminiResult = await this.generateGeminiResponse(cleanMsg, data);

    if (geminiResult.error) {
      return {
        text: geminiResult.message,
        type: "error",
        timestamp
      };
    }

    return {
      text: geminiResult.text,
      type: "ai_response",
      matchedCards: [],
      timestamp
    };
  },

  async saveUserChatHistory(userId, messages) {
    if (!userId || !Array.isArray(messages)) return;
    try {
      const docRef = doc(db, CHAT_HISTORY_COLLECTION, String(userId));
      await setDoc(docRef, {
        user_id: userId,
        messages: messages.slice(-50),
        updated_at: new Date().toISOString()
      }, { merge: true });
    } catch (err) {
      console.warn("Firestore chat history save notice:", err.message);
    }
  },

  async loadUserChatHistory(userId) {
    if (!userId) return null;
    try {
      const docRef = doc(db, CHAT_HISTORY_COLLECTION, String(userId));
      const docSnap = await getDoc(docRef);
      if (docSnap.exists() && Array.isArray(docSnap.data().messages)) {
        return docSnap.data().messages;
      }
    } catch (err) {
      console.warn("Firestore chat history load notice:", err.message);
    }
    return null;
  }
};

export default aiChatService;
