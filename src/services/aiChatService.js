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
import { savingsAccounts, getAssociatedDebitCards } from '../data/mockSavingsAccounts';
import { savingsAccountService } from './savingsAccountService';
import { canonicalBankName } from '../utils/bankDirectoryUtils';

// Environment variable for Google Gemini API key (never hardcode in source code)
const GEMINI_API_KEY = (import.meta.env.VITE_GEMINI_API_KEY || "").trim();

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

// Get initialized Google Generative AI model client (gemini-2.0-flash)
function getGeminiModel() {
  if (!GEMINI_API_KEY || GEMINI_API_KEY === "your-gemini-api-key-here") {
    return null;
  }
  try {
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    return genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  } catch (err) {
    console.error("Gemini Error: Client initialization failed", err.message || err);
    return null;
  }
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

  // Gemini API Grounded Generator
  async generateGeminiResponse(userMessage, contextData = {}, conversationState = {}) {
    console.log("Gemini Request Sent", { userMessage });

    const geminiModel = getGeminiModel();
    if (!geminiModel) {
      return {
        error: true,
        message: "I'm having trouble connecting to the AI service right now. You can still explore D.CARD's verified products manually."
      };
    }

    try {
      const cardsSummary = (contextData.debitCards || []).map(c => {
        const atm = typeof c.limits?.atmLimit === 'number' ? `₹${c.limits.atmLimit.toLocaleString()}` : (c.atmLimit ? `₹${c.atmLimit}` : '₹50,000');
        const pos = typeof c.limits?.posLimit === 'number' ? `₹${c.limits.posLimit.toLocaleString()}` : (c.posLimit ? `₹${c.posLimit}` : '₹100,000');
        return `- Debit Card [ID:${c.id}]: ${c.cardName} (${c.bank}): Network: ${c.network || 'Visa'}, Annual Fee: ${c.annualFee || 'Free'}, Joining Fee: ${c.joiningFee || '₹0'}, ATM Limit: ${atm}/day, POS Limit: ${pos}/day, Lounge Access: ${c.loungeAccess || 'No'}, Intl Usage: ${c.international ? 'Allowed' : 'Domestic Only'}, Contactless: ${c.contactless ? 'Supported' : 'Not Supported'}, Cashback/Rewards: ${c.cashback || c.rewards || 'Offers'}`;
      }).join('\n');

      const savingsSummary = (contextData.savingsAccounts || []).map(s => {
        const associatedCards = getAssociatedDebitCards(s);
        const cardNames = associatedCards.length > 0 ? associatedCards.map(c => c.cardName).join(', ') : (s.associatedDebitCardName || 'Not Listed');
        return `- Savings Account [ID:${s.id}]: ${s.accountName} (${s.bank}): Category: ${s.accountType}, Rate: ${s.interestRate}, Min Bal: ${s.minimumBalance}, Zero Bal: ${s.isZeroBalance ? 'Yes' : 'No'}, Online Video KYC: ${s.isOnlineOpening ? 'Yes' : 'No'}, Highlights: ${(s.keyBenefits || []).join('; ')}, Associated Debit Card(s): ${cardNames}`;
      }).join('\n');

      let contextStr = "";
      if (conversationState.lastMentionedBank) {
        contextStr += `Active Conversation Bank Context: ${conversationState.lastMentionedBank}\n`;
      }
      if (conversationState.lastMentionedAccount) {
        contextStr += `Active Conversation Account Context: ${conversationState.lastMentionedAccount.accountName} (${conversationState.lastMentionedAccount.bank})\n`;
      }
      if (conversationState.lastMentionedCard) {
        contextStr += `Active Conversation Card Context: ${conversationState.lastMentionedCard.cardName} (${conversationState.lastMentionedCard.bank})\n`;
      }

      const systemPrompt = `You are D.CARD AI Advisor, an independent banking product discovery assistant.

Important Rules:
1. Provide informational product discovery based strictly on the verified D.CARD database context below.
2. NEVER invent financial figures, interest rates, minimum balances, eligibility criteria, or bank benefits.
3. If a field or requested detail is missing in the provided database, explicitly state: "Information not available in current D.CARD database."
4. NEVER claim official bank approval or offer personalized financial advice. Always maintain: "D.CARD is an independent financial information and comparison platform for Savings Accounts and Debit Cards. This is not personalized financial advice."
5. When recommending savings accounts or debit cards (e.g. for students, zero balance, high interest, lounge access), explicitly name the matching products from the database so users can view and open them.
6. Provide structured bullet points or side-by-side comparison tables when comparing products or listing options.
7. Include the disclaimer: "Please verify current terms on the respective bank's official website."

${contextStr}

Verified D.CARD Database Context:

Savings Accounts:
${savingsSummary}

Debit Cards:
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
      console.error("Gemini API Error:", err.message);

      const fallbackAnswer = getOfflineFallbackResponse(userMessage);
      if (fallbackAnswer) {
        return {
          error: false,
          text: fallbackAnswer
        };
      }

      return {
        error: true,
        message: "I'm having trouble connecting to the AI service right now. You can still explore D.CARD's verified products manually."
      };
    }

    return {
      error: true,
      message: "I couldn't find verified information about that in the current D.CARD database."
    };
  },

  // Main Router Flow with Firestore-first retrieval & multi-turn memory
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

    // Friendly greetings
    if (["hi", "hello", "hey", "namaste", "greetings", "hallo"].some(w => lowerMsg === w || lowerMsg.startsWith(w + " "))) {
      return {
        text: "👋 **Hello! Welcome to D.CARD AI Advisor.**\n\nAsk me anything about:\n- 🏦 **Savings Accounts** (Zero Balance, High Interest, Student, Salary, Digital)\n- 💳 **Associated Debit Cards** (Visa, RuPay, Mastercard, Lounge Access & ATM Limits)\n- 🔄 **Comparing Savings Accounts & Debit Cards**\n- ⚡ **Online Account Opening via Video KYC**",
        type: "greeting",
        timestamp
      };
    }

    // Step 1: Detect bank mentions in query or fallback to conversation memory
    const bankKeywordsList = ["sbi", "hdfc", "icici", "axis", "kotak", "idfc", "canara", "indusind", "pnb", "baroda", "au small", "fi money", "jupiter", "niyo", "federal", "rbl", "yes bank"];
    const detectedBank = bankKeywordsList.find(b => lowerMsg.includes(b)) || conversationState.lastMentionedBank || null;

    // Step 2: Fetch Firestore data
    let data = null;
    try {
      data = await this.getFirestoreData();
    } catch (err) {
      return {
        text: "Product information is temporarily unavailable. Please try again.",
        type: "error",
        timestamp
      };
    }

    const { debitCards: allCards, savingsAccounts: allAccounts } = data;

    // Direct Intent Check A: Savings Account → Associated Debit Card query
    const isAssociatedCardQuery = (lowerMsg.includes("card") && (lowerMsg.includes("comes with") || lowerMsg.includes("associated") || lowerMsg.includes("provided") || lowerMsg.includes("get with") || lowerMsg.includes("which debit card") || lowerMsg.includes("what debit card")));

    if (isAssociatedCardQuery && Array.isArray(allAccounts) && allAccounts.length > 0) {
      let targetAccount = null;

      // Match account by bank and keywords, or fallback to conversation memory
      if (detectedBank) {
        const canonical = canonicalBankName(detectedBank);
        targetAccount = allAccounts.find(a => canonicalBankName(a.bank).toLowerCase() === canonical.toLowerCase() && (lowerMsg.includes(a.accountName.toLowerCase()) || lowerMsg.includes(a.accountType.toLowerCase())))
          || allAccounts.find(a => canonicalBankName(a.bank).toLowerCase() === canonical.toLowerCase());
      } else if (conversationState.lastMentionedAccount) {
        targetAccount = conversationState.lastMentionedAccount;
      }

      if (targetAccount) {
        const associatedCards = getAssociatedDebitCards(targetAccount);
        if (associatedCards.length > 0) {
          let ansText = `💳 **Debit Card with ${targetAccount.accountName} (${targetAccount.bank}):**\n\n`;
          associatedCards.forEach((c, idx) => {
            ansText += `**${idx + 1}. ${c.cardName}** (${c.network || 'Visa/RuPay'})\n`;
            ansText += `• **Annual Fee**: ${c.annualFee || 'Free'}\n`;
            ansText += `• **Daily ATM Limit**: ₹${(c.atmLimit || c.limits?.atmLimit || 50000).toLocaleString('en-IN')}\n`;
            ansText += `• **Daily POS Limit**: ₹${(c.posLimit || c.limits?.posLimit || 100000).toLocaleString('en-IN')}\n`;
            ansText += `• **International Usage**: ${c.international ? 'Allowed' : 'Domestic Only'}\n`;
            ansText += `• **Contactless Tap & Pay**: ${c.contactless ? 'Supported' : 'Not Supported'}\n`;
            ansText += `• **Lounge Access**: ${c.loungeAccess || 'No'}\n`;
            ansText += `• **Perks & Cashback**: ${c.cashback || c.benefits || 'Merchant Discounts'}\n\n`;
          });
          ansText += `*Please verify the latest information on the bank's official website before making a financial decision.*`;

          return {
            text: ansText,
            type: "associated_debit_card",
            matchedAccounts: [targetAccount],
            matchedCards: associatedCards,
            conversationState: {
              ...conversationState,
              lastMentionedBank: targetAccount.bank,
              lastMentionedAccount: targetAccount,
              lastMentionedCard: associatedCards[0]
            },
            timestamp
          };
        } else {
          return {
            text: `Debit card information is not available for **${targetAccount.accountName}** in the current D.CARD database.\n\n*Please verify the latest details on the bank's official website.*`,
            type: "no_data",
            conversationState: {
              ...conversationState,
              lastMentionedBank: targetAccount.bank,
              lastMentionedAccount: targetAccount
            },
            timestamp
          };
        }
      }
    }

    // Direct Intent Check B: Savings Accounts query (Filtering & Comparison)
    const isSavingsQuery = lowerMsg.includes("savings") || lowerMsg.includes("account") || lowerMsg.includes("minimum balance") || lowerMsg.includes("zero balance") || lowerMsg.includes("interest rate") || lowerMsg.includes("video kyc") || lowerMsg.includes("online opening") || lowerMsg.includes("student") || lowerMsg.includes("salary") || lowerMsg.includes("senior") || lowerMsg.includes("women");

    if (isSavingsQuery && Array.isArray(allAccounts) && allAccounts.length > 0) {
      let matchedAccounts = allAccounts.filter(acc => {
        if (!acc) return false;
        const aName = String(acc.accountName || "").toLowerCase();
        const aBank = canonicalBankName(acc.bank || "").toLowerCase();
        const aType = String(acc.accountType || "").toLowerCase();

        if (detectedBank) {
          const canonical = canonicalBankName(detectedBank).toLowerCase();
          if (!aBank.includes(canonical) && !aName.includes(canonical)) return false;
        }

        if (lowerMsg.includes("zero balance") || lowerMsg.includes("zero min")) {
          if (!acc.isZeroBalance && acc.minimumBalanceValue !== 0) return false;
        }
        if (lowerMsg.includes("online") || lowerMsg.includes("video kyc") || lowerMsg.includes("digital")) {
          if (!acc.isOnlineOpening && !acc.isDigital) return false;
        }
        if (lowerMsg.includes("student") && !acc.isStudent && !aType.includes("student")) return false;
        if (lowerMsg.includes("salary") && !acc.isSalary && !aType.includes("salary")) return false;
        if (lowerMsg.includes("senior") && !acc.isSeniorCitizen && !aType.includes("senior")) return false;
        if (lowerMsg.includes("women") && !acc.isWomenSpecial && !aType.includes("women")) return false;

        return true;
      });

      if (matchedAccounts.length > 0) {
        const isCompareQuery = lowerMsg.includes("compare") || lowerMsg.includes("versus") || lowerMsg.includes("vs");
        const topAccounts = matchedAccounts.slice(0, 4);

        if (isCompareQuery) {
          let compareText = `🏦 **Firestore Side-by-Side Savings Account Comparison**:\n\n`;
          topAccounts.slice(0, 3).forEach((acc, idx) => {
            const cards = getAssociatedDebitCards(acc);
            const cardName = cards.length > 0 ? cards.map(c => c.cardName).join(', ') : (acc.associatedDebitCardName || 'Standard Card');
            compareText += `**${idx + 1}. ${acc.accountName} (${acc.bank})**\n`;
            compareText += `• **Category**: ${acc.accountType}\n`;
            compareText += `• **Max Interest Rate**: ${acc.interestRate}\n`;
            compareText += `• **Minimum Balance**: ${acc.minimumBalance}\n`;
            compareText += `• **Zero Balance**: ${acc.isZeroBalance ? "✓ Yes" : "No"}\n`;
            compareText += `• **Video KYC**: ${acc.isOnlineOpening ? "✓ Online" : "Branch"}\n`;
            compareText += `• **Associated Debit Card**: ${cardName}\n\n`;
          });
          compareText += `*Based on verified D.CARD database attributes. Please verify latest rates on official bank portals.*`;

          return {
            text: compareText,
            type: "compare_savings",
            matchedAccounts: topAccounts.slice(0, 3),
            conversationState: {
              ...conversationState,
              lastMentionedBank: topAccounts[0].bank,
              lastMentionedAccount: topAccounts[0]
            },
            timestamp
          };
        }

        let responseText = `🏦 **Based on the available D.CARD data, these savings accounts match your query:**\n\n`;
        topAccounts.forEach((acc, idx) => {
          const cards = getAssociatedDebitCards(acc);
          const cardStr = cards.length > 0 ? `${cards[0].card_name || cards[0].cardName} (${cards[0].network || 'Visa'})` : 'Debit card information not available';
          responseText += `**${idx + 1}. ${acc.accountName}** (${acc.bank})\n`;
          responseText += `• **Category**: ${acc.accountType}\n`;
          responseText += `• **Interest Rate**: ${acc.interestRate}\n`;
          responseText += `• **Minimum Balance**: ${acc.minimumBalance}\n`;
          responseText += `• **Online Video KYC**: ${acc.isOnlineOpening ? '✓ Instant Online' : 'Branch Visit'}\n`;
          responseText += `• **Associated Debit Card**: ${cardStr}\n\n`;
        });
        responseText += `*Please verify the latest details on the respective bank's official website.*`;

        return {
          text: responseText,
          type: "savings_list",
          matchedAccounts: topAccounts,
          conversationState: {
            ...conversationState,
            lastMentionedBank: topAccounts[0].bank,
            lastMentionedAccount: topAccounts[0]
          },
          timestamp
        };
      }
    }

    // Direct Intent Check C: Debit Cards query
    const isDebitCardQuery = lowerMsg.includes("card") || lowerMsg.includes("rupay") || lowerMsg.includes("visa") || lowerMsg.includes("mastercard") || lowerMsg.includes("lounge") || lowerMsg.includes("atm limit") || lowerMsg.includes("pos limit") || lowerMsg.includes("cashback") || lowerMsg.includes("forex");

    if (isDebitCardQuery && Array.isArray(allCards) && allCards.length > 0) {
      let matchedCards = allCards.filter(c => {
        if (!c) return false;
        const cName = String(c.cardName || "").toLowerCase();
        const cBank = canonicalBankName(c.bank || "").toLowerCase();
        const cNetwork = String(c.network || "").toLowerCase();

        if (lowerMsg.includes("rupay") && !cNetwork.includes("rupay") && !cName.includes("rupay")) return false;
        if (lowerMsg.includes("visa") && !cNetwork.includes("visa") && !cName.includes("visa")) return false;
        if (lowerMsg.includes("mastercard") && !cNetwork.includes("mastercard") && !cName.includes("mastercard")) return false;

        if (detectedBank) {
          const canonical = canonicalBankName(detectedBank).toLowerCase();
          if (!cBank.includes(canonical) && !cName.includes(canonical)) return false;
        }

        if (lowerMsg.includes("lounge") && !String(c.loungeAccess || "").toLowerCase().includes("lounge") && !String(c.loungeAccess || "").toLowerCase().includes("yes")) return false;
        if (lowerMsg.includes("zero fee") && c.annualFee !== 0 && !String(c.annualFee || "").toLowerCase().includes("free")) return false;

        return true;
      });

      if (matchedCards.length > 0) {
        const isCompareQuery = lowerMsg.includes("compare") || lowerMsg.includes("versus") || lowerMsg.includes("vs");
        const topCards = matchedCards.slice(0, 4);

        if (isCompareQuery) {
          let compareText = `📊 **Firestore Side-by-Side Card Comparison**:\n\n`;
          topCards.slice(0, 3).forEach((c, idx) => {
            const feeStr = c.annualFee === 0 ? "FREE (₹0)" : `₹${c.annualFee}/yr`;
            const atmStr = typeof c.limits?.atmLimit === 'number' ? `₹${c.limits.atmLimit.toLocaleString()}/day` : (c.atmLimit ? `₹${c.atmLimit}/day` : "₹50,000/day");
            const loungeStr = c.loungeAccess || "Check Spend Qualifier";

            compareText += `**${idx + 1}. ${c.cardName} (${c.bank})**\n`;
            compareText += `• **Network**: ${c.network || 'Visa/RuPay'}\n`;
            compareText += `• **Annual Fee**: ${feeStr}\n`;
            compareText += `• **ATM Withdrawal Limit**: ${atmStr}\n`;
            compareText += `• **Lounge Access**: ${loungeStr}\n`;
            compareText += `• **Rating**: ${c.rating || 4.5} ★\n\n`;
          });
          compareText += `*Please verify the latest card fee schedule on the bank's official website.*`;

          return {
            text: compareText,
            type: "compare",
            matchedCards: topCards.slice(0, 3),
            conversationState: {
              ...conversationState,
              lastMentionedBank: topCards[0].bank,
              lastMentionedCard: topCards[0]
            },
            timestamp
          };
        }

        let responseText = `💳 **Based on the available D.CARD database, these debit cards match your requirements:**\n\n`;
        topCards.forEach((c, idx) => {
          const feeStr = c.annualFee === 0 ? "FREE (Zero Fee)" : `₹${c.annualFee}/year`;
          const atmStr = typeof c.limits?.atmLimit === 'number' ? `₹${c.limits.atmLimit.toLocaleString()}/day` : (c.atmLimit ? `₹${c.atmLimit}/day` : "₹50,000/day");
          const loungeStr = c.loungeAccess ? c.loungeAccess : "N/A";

          responseText += `**${idx + 1}. ${c.cardName}** (${c.bank})\n`;
          responseText += `• **Network**: ${c.network || 'RuPay / Visa'}\n`;
          responseText += `• **Annual Fee**: ${feeStr}\n`;
          responseText += `• **ATM Limit**: ${atmStr}\n`;
          responseText += `• **Lounge Access**: ${loungeStr}\n\n`;
        });
        responseText += `*Please verify current card terms on the bank's official portal.*`;

        return {
          text: responseText,
          type: "cards_list",
          matchedCards: topCards,
          conversationState: {
            ...conversationState,
            lastMentionedBank: topCards[0].bank,
            lastMentionedCard: topCards[0]
          },
          timestamp
        };
      }
    }

    // Step 3: Grounded Gemini Response for unhandled/complex queries
    const geminiResult = await this.generateGeminiResponse(cleanMsg, data, conversationState);

    if (geminiResult.error) {
      return {
        text: geminiResult.message,
        type: "error",
        timestamp
      };
    }

    // Auto-extract mentioned accounts/cards from response text for action buttons
    const lowerText = geminiResult.text.toLowerCase();
    const matchedAccs = (allAccounts || []).filter(acc => lowerText.includes(acc.accountName.toLowerCase()) || (acc.tier && lowerText.includes(acc.tier.toLowerCase()))).slice(0, 3);
    const matchedCrds = (allCards || []).filter(c => lowerText.includes(c.cardName.toLowerCase())).slice(0, 3);

    const textWithDisclaimer = `${geminiResult.text}\n\n*📌 D.CARD is an independent comparison and financial information platform covering Savings Accounts and Debit Cards. Information shown is for comparison and informational purposes only and does not constitute personalized financial advice or official bank approval.*`;

    return {
      text: textWithDisclaimer,
      type: "ai_response",
      matchedAccounts: matchedAccs,
      matchedCards: matchedCrds,
      conversationState,
      timestamp
    };
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
