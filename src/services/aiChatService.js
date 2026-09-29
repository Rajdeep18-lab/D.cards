import {
  db,
  collection,
  getDocs,
  doc,
  getDoc,
  setDoc
} from '../lib/firebase';
import { debitCards, bankCards, faqs } from '../data/mockData';
import { savingsAccounts } from '../data/mockSavingsAccounts';
import { savingsAccountService } from './savingsAccountService';

// Firestore collection constants
const DEBIT_CARDS_COLLECTION = 'debit_cards';
const SAVINGS_ACCOUNTS_COLLECTION = 'savingsAccounts';
const BANKS_COLLECTION = 'banks';
const FAQ_COLLECTION = 'faq';
const OFFERS_COLLECTION = 'offers';
const CHAT_HISTORY_COLLECTION = 'chat_history';

// In-memory cache for Firestore records
let firestoreCache = {
  debitCards: null,
  savingsAccounts: null,
  banks: null,
  faq: null,
  offers: null,
  lastFetched: 0
};
const CACHE_TTL_MS = 15000;

// Keywords that indicate a query is specifically about banking/debit cards/savings accounts
const BANKING_KEYWORDS = [
  "card", "cards", "debit", "credit", "bank", "banks", "banking", "account", "accounts", "savings",
  "regular savings", "zero balance", "digital savings", "student", "salary", "senior citizen", "women", "minor",
  "visa", "mastercard", "rupay", "master card", "ru-pay",
  "atm", "withdrawal", "withdraw", "limit", "limits", "pos", "mab", "amb", "aqb",
  "cashback", "reward", "rewards", "point", "points", "offer", "offers",
  "lounge", "airport", "forex", "markup", "fee", "annual fee", "joining fee", "zero fee", "free",
  "interest", "rate", "yield", "compare", "comparison", "versus", "vs", "benefit", "benefits", "perks",
  "sbi", "state bank", "hdfc", "icici", "axis", "kotak", "idfc", "indusind", "pnb", "punjab", "baroda",
  "bob", "canara", "union bank", "indian bank", "central bank", "uco", "federal", "rbl", "yes bank",
  "au small", "equitas", "ujjivan", "jana", "esaf", "suryoday", "fi money", "jupiter", "niyo", "freo",
  "airtel", "post bank", "recommend", "best", "which", "what", "provide", "provided", "comes with"
];

// Helper to check if message contains banking keywords
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

// Friendly fallback for non-banking queries
export function getOfflineFallbackResponse(userMessage = "") {
  const lower = String(userMessage).toLowerCase();

  if (lower.includes("chandigarh university") || lower.includes("where is cu") || lower.includes("cu location")) {
    return "📍 **Chandigarh University (CU)** is a NAAC A+ accredited university located on Highway 95 in **Gharuan, Mohali, Punjab**, India.";
  }

  if (lower.includes("antigravity")) {
    return "🌌 **Antigravity** is Google DeepMind's advanced agentic coding assistant engine.";
  }

  if (lower.includes("python") && (lower.includes("hello world") || lower.includes("code"))) {
    return "```python\n# Python Hello World Program\nprint(\"Hello, World!\")\n```";
  }

  if (lower.includes("hello world")) {
    return "```javascript\n// JavaScript Hello World Program\nconsole.log(\"Hello, World!\");\n```";
  }

  return null;
}

export const aiChatService = {
  // Ensure Firestore collections exist
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

  // Fetch Firestore dataset with cache
  async getFirestoreData(forceRefresh = false) {
    const now = Date.now();
    if (!forceRefresh && firestoreCache.debitCards && firestoreCache.savingsAccounts && (now - firestoreCache.lastFetched < CACHE_TTL_MS)) {
      return firestoreCache;
    }

    try {
      await this.ensureFirestoreSeeded();
      const liveSavings = await savingsAccountService.getSavingsAccounts(forceRefresh);

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
        savingsAccounts: liveSavings.length > 0 ? liveSavings : savingsAccounts,
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
        savingsAccounts: savingsAccounts,
        banks: bankCards,
        faq: faqs,
        offers: [],
        lastFetched: now
      };
    }
  },

  /**
   * Main AI Advisor message dispatcher.
   * Calls secure server-side endpoint POST /api/ai-advisor.
   * Zero client-side API key exposure.
   */
  async sendMessage(userMessage, user = null, chatContext = {}) {
    const cleanMsg = (userMessage || "").trim();
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (!cleanMsg) {
      return {
        text: "Please type a question or select a suggested prompt below! 💳",
        type: "greeting",
        timestamp
      };
    }

    const lowerMsg = cleanMsg.toLowerCase();
    const conversationState = chatContext.conversationState || {};
    const conversationHistory = chatContext.conversationHistory || [];

    // Instant local greeting for pure "hi" / "hello"
    if (["hi", "hello", "hey", "namaste", "greetings", "hallo"].some(w => lowerMsg === w || lowerMsg.startsWith(w + " "))) {
      return {
        text: "👋 Hello! Welcome to D.CARD AI Assistance.\n\nI can help you explore and compare verified Indian banking products and locate branches & ATMs:\n• Savings Accounts (Zero Balance, High Interest, Student, Salary, Online Video KYC)\n• Current Accounts (Business MAB, Limits, Overdraft & Cheques)\n• Verified Linked Debit Cards (RuPay, Visa, Mastercard, ATM Limits, Lounge Access)\n• Verified Bank Branches & ATMs Near You\n• Factual Side-by-Side Comparisons\n\nWhat would you like to explore or locate today?",
        type: "greeting",
        timestamp
      };
    }

    try {
      const response = await fetch('/api/ai-advisor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: cleanMsg,
          conversationHistory: conversationHistory.slice(-10),
          conversationState,
          userCoords: chatContext.userCoords || null
        }),
        signal: typeof AbortSignal !== 'undefined' && AbortSignal.timeout ? AbortSignal.timeout(12000) : undefined
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const data = await response.json();

      return {
        text: data.answer,
        type: data.type || "ai_response",
        intent: data.intent || "GENERAL_BANKING_INFORMATION",
        matchedAccounts: data.matchedAccounts || [],
        matchedCurrentAccounts: data.matchedCurrentAccounts || [],
        matchedCards: data.matchedCards || [],
        matchedLocations: data.matchedLocations || [],
        extractedRequirements: data.extractedRequirements || {},
        suggestedActions: data.suggestedActions || [],
        disclaimer: data.disclaimer || "Please verify the latest terms, charges and eligibility on the bank's official website before applying.",
        conversationState: {
          ...conversationState,
          detectedBanks: data.detectedBanks || conversationState.detectedBanks || []
        },
        timestamp
      };
    } catch (err) {
      console.error("[aiChatService Error]:", err.message || err);

      // Check for friendly offline fallback
      const fallback = getOfflineFallbackResponse(cleanMsg);
      if (fallback) {
        return {
          text: fallback,
          type: "fallback",
          timestamp
        };
      }

      return {
        text: "AI Advisor is temporarily unavailable. Please try again.",
        type: "error",
        timestamp
      };
    }
  },

  // Save chat history to Firestore
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

  // Load chat history from Firestore
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
