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

// In-memory cache to optimize Firebase queries
let firestoreCache = {
  debitCards: null,
  banks: null,
  faq: null,
  offers: null,
  lastFetched: 0
};
const CACHE_TTL_MS = 15000;

/**
 * Helper to get initialized Google Generative AI client
 */
function getGeminiModel() {
  if (!GEMINI_API_KEY || GEMINI_API_KEY === "your-gemini-api-key-here") {
    return null;
  }
  try {
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    // Use gemini-1.5-flash or gemini-2.0-flash model
    return genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  } catch (err) {
    console.warn("Google Gemini AI initialization notice:", err.message || err);
    return null;
  }
}

export const aiChatService = {
  /**
   * Ensure Firestore collections contain records
   */
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

  /**
   * Fetch all records directly from Firestore collections
   */
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
   * Generate Response using Google Gemini API with Grounded Database Context
   */
  async generateGeminiResponse(userMessage, contextData) {
    const geminiModel = getGeminiModel();
    if (!geminiModel) return null;

    try {
      const cardsSummary = (contextData.debitCards || []).slice(0, 20).map(c => {
        return `- ${c.cardName} (${c.bank}): Fee: ${c.annualFee || 'Free'}, Lounge: ${c.loungeAccess || 'No'}, ATM Limit: ${c.atmLimit || 'Standard'}, Cashback: ${c.cashback || 'N/A'}, Best for: ${Array.isArray(c.bestFor) ? c.bestFor.join(', ') : (c.bestFor || 'N/A')}`;
      }).join('\n');

      const systemPrompt = `You are D.CARD AI Advisor, a world-class financial expert specializing in Indian debit cards, banking fees, airport lounge access, zero forex cards, ATM withdrawal limits, and rewards.

Strict System Rules:
1. Always be polite, professional, concise, and helpful.
2. Format key points using bold text and markdown bullet points.
3. Answer using verified card information from the database context below whenever relevant.

Available Database Context (Top Cards):
${cardsSummary}

User Question: "${userMessage}"`;

      const result = await geminiModel.generateContent(systemPrompt);
      const response = await result.response;
      const text = response.text();

      if (text && text.trim()) {
        return text.trim();
      }
    } catch (err) {
      console.warn("Google Gemini API generation error:", err.message || err);
      
      // Fallback try with gemini-pro if flash model errors
      try {
        const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
        const fallbackModel = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
        const result = await fallbackModel.generateContent(userMessage);
        const response = await result.response;
        const text = response.text();
        if (text && text.trim()) return text.trim();
      } catch (fallbackErr) {
        console.warn("Google Gemini fallback model error:", fallbackErr.message || fallbackErr);
      }
    }

    return null;
  },

  /**
   * Process incoming user messages and return AI response
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

    // 1. Fetch live database context
    const data = await this.getFirestoreData();
    const { debitCards: allCards, banks: allBanks, faq: allFaqs } = data;
    const lowerMsg = cleanMsg.toLowerCase();

    // Check basic friendly greetings
    if (["hi", "hello", "hey", "namaste", "greetings", "hallo"].some(w => lowerMsg === w || lowerMsg.startsWith(w + " "))) {
      return {
        text: "👋 **Hello! Welcome to D.CARD AI Assistant.**\n\nPowered by **Google Gemini AI** & our verified card database. Ask me anything about:\n- 💳 **RuPay, Visa, Mastercard** Debit Cards\n- 🆓 **Zero Annual Fee & Zero Balance** Cards\n- 🏦 **SBI, HDFC, ICICI, Axis** Cards\n- 🏧 **ATM Withdrawal Limits & Lounge Access**\n- 🎁 **Cashback & Contactless Spends**",
        type: "greeting",
        timestamp
      };
    }

    // 2. Perform Database Matching for Card Chips & Highlights
    let matchedCards = (allCards || []).filter(c => {
      if (!c) return false;
      const cName = String(c.cardName || "").toLowerCase();
      const cBank = String(c.bank || "").toLowerCase();
      const cNetwork = String(c.network || "").toLowerCase();
      const cCat = String(c.category || "").toLowerCase();

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

    if (matchedCards.length > 6) {
      matchedCards = matchedCards.slice(0, 4);
    }

    // 3. Request AI Response from Google Gemini API if Key is provided
    if (GEMINI_API_KEY && GEMINI_API_KEY !== "your-gemini-api-key-here") {
      const geminiAnswer = await this.generateGeminiResponse(cleanMsg, data);
      if (geminiAnswer) {
        return {
          text: geminiAnswer,
          type: matchedCards.length > 0 ? "cards_list" : "ai_response",
          matchedCards,
          timestamp
        };
      }
    }

    // 4. Deterministic Fallback if Gemini Key is not set or network call falls back
    if (matchedCards.length > 0) {
      const cardsToShow = matchedCards.slice(0, 4);
      let responseText = `💳 **Found ${matchedCards.length} Matching Card(s) in Database:**\n\n`;

      cardsToShow.forEach((c, idx) => {
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
        matchedCards,
        timestamp
      };
    }

    // FAQ fallback
    const faqMatch = (allFaqs || []).find(f => {
      if (!f) return false;
      const qLower = String(f.q || f.question || "").toLowerCase();
      return lowerMsg.includes(qLower);
    });

    if (faqMatch) {
      return {
        text: `❓ **${faqMatch.q || faqMatch.question}**\n\n${faqMatch.a || faqMatch.answer}`,
        type: "faq",
        timestamp
      };
    }

    return {
      text: "Sorry, I couldn't find any matching debit card in our database. Please try asking about SBI, HDFC, ICICI, zero fee cards, or lounge access!",
      type: "no_match",
      timestamp
    };
  },

  /**
   * Save Chat History for logged-in users in Firestore
   */
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

  /**
   * Load Saved Chat History from Firestore for logged-in users
   */
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
