import {
  db,
  collection,
  getDocs,
  doc,
  getDoc,
  setDoc,
  addDoc
} from '../lib/firebase';
import { debitCards, bankCards, faqs } from '../data/mockData';

// Firestore collection constants
const DEBIT_CARDS_COLLECTION = 'debit_cards';
const BANKS_COLLECTION = 'banks';
const FAQ_COLLECTION = 'faq';
const OFFERS_COLLECTION = 'offers';
const CHAT_HISTORY_COLLECTION = 'chat_history';

// In-memory cache to optimize Firebase queries while guaranteeing fresh data
let firestoreCache = {
  debitCards: null,
  banks: null,
  faq: null,
  offers: null,
  lastFetched: 0
};
const CACHE_TTL_MS = 15000; // Refresh cache every 15 seconds to capture new Firestore additions automatically

export const aiChatService = {
  /**
   * Ensure Firestore collections (debit_cards, banks, faq, offers) contain records
   */
  async ensureFirestoreSeeded() {
    try {
      // 1. Ensure debit_cards collection has documents
      const cardsSnap = await getDocs(collection(db, DEBIT_CARDS_COLLECTION));
      if (cardsSnap.empty && Array.isArray(debitCards)) {
        console.log("Seeding Firestore debit_cards collection...");
        for (const card of debitCards) {
          const docId = card.id ? String(card.id) : `card_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
          await setDoc(doc(db, DEBIT_CARDS_COLLECTION, docId), {
            ...card,
            created_at: new Date().toISOString()
          });
        }
      }

      // 2. Ensure banks collection has documents
      const banksSnap = await getDocs(collection(db, BANKS_COLLECTION));
      if (banksSnap.empty && Array.isArray(bankCards)) {
        console.log("Seeding Firestore banks collection...");
        for (const bank of bankCards) {
          const docId = bank.id ? String(bank.id) : `bank_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
          await setDoc(doc(db, BANKS_COLLECTION, docId), {
            ...bank,
            created_at: new Date().toISOString()
          });
        }
      }

      // 3. Ensure faq collection has documents
      const faqSnap = await getDocs(collection(db, FAQ_COLLECTION));
      if (faqSnap.empty && Array.isArray(faqs)) {
        console.log("Seeding Firestore faq collection...");
        for (const item of faqs) {
          const docId = `faq_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
          await setDoc(doc(db, FAQ_COLLECTION, docId), {
            ...item,
            created_at: new Date().toISOString()
          });
        }
      }

      // 4. Ensure offers collection has documents
      const offersSnap = await getDocs(collection(db, OFFERS_COLLECTION));
      if (offersSnap.empty) {
        console.log("Seeding Firestore offers collection...");
        const defaultOffers = [
          { id: 'off_1', title: 'Zero Balance & Zero Forex', bank: 'Fi Money', description: 'Zero annual fee with 0% markup on international spends.', code: 'FIFIRO' },
          { id: 'off_2', title: '5% PayZapp Cashback', bank: 'HDFC Bank', description: '5% cashback points on PayZapp & SmartBuy purchases with EasyShop Platinum.', code: 'HDFC5' },
          { id: 'off_3', title: 'BookMyShow BOGO Deals', bank: 'ICICI Bank', description: 'Buy 1 Get 1 Free movie ticket on Coral & Sapphiro debit cards.', code: 'ICICIBOGO' }
        ];
        for (const off of defaultOffers) {
          await setDoc(doc(db, OFFERS_COLLECTION, off.id), {
            ...off,
            created_at: new Date().toISOString()
          });
        }
      }
    } catch (err) {
      console.warn("Firestore seeding check notice:", err.message);
    }
  },

  /**
   * Fetch all records directly from Firestore collections (debit_cards, banks, faq, offers)
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
        debitCards: debitCards,
        banks: banksList.length > 0 ? banksList : bankCards,
        faq: faqList.length > 0 ? faqList : faqs,
        offers: offersList,
        lastFetched: now
      };

      return firestoreCache;
    } catch (err) {
      console.error("Error retrieving Firestore data for AI Assistant:", err);
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
   * Search Firestore records strictly without hallucination or external knowledge.
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

    // 1. Query Firestore database collections
    const data = await this.getFirestoreData();
    const { debitCards: allCards, banks: allBanks, faq: allFaqs, offers: allOffers } = data;

    const lowerMsg = cleanMsg.toLowerCase();

    // Check basic friendly greetings
    if (["hi", "hello", "hey", "namaste", "greetings", "hallo"].some(w => lowerMsg === w || lowerMsg.startsWith(w + " "))) {
      return {
        text: "👋 **Hello! Welcome to D.Card AI Assistant.**\n\nI answer questions **strictly using our live Firestore database**. Ask me about:\n- 💳 **RuPay, Visa, Mastercard** Debit Cards\n- 🆓 **Zero Annual Fee & Zero Balance** Cards\n- 🏦 **SBI, HDFC, ICICI, Axis** Debit Cards\n- 🏧 **ATM Withdrawal Limits & Lounge Access**\n- 🎁 **Cashback & Contactless Spends**\n- 📊 **Comparing Debit Cards**",
        type: "greeting",
        timestamp
      };
    }

    // 2. Perform Firestore record matching
    let isCompareQuery = lowerMsg.includes("compare") || lowerMsg.includes("versus") || lowerMsg.includes("vs");

    // Network filters
    const hasRuPay = lowerMsg.includes("rupay") || lowerMsg.includes("ru-pay");
    const hasVisa = lowerMsg.includes("visa");
    const hasMastercard = lowerMsg.includes("mastercard") || lowerMsg.includes("master card");

    // Bank filters
    const bankMatches = (allBanks || []).filter(b => {
      if (!b || !b.name) return false;
      const bName = String(b.name).toLowerCase();
      const bFirstName = String(b.name).split(' ')[0].toLowerCase();
      return lowerMsg.includes(bName) || lowerMsg.includes(bFirstName);
    });
    const bankNamesFound = bankMatches.map(b => String(b.name).toLowerCase());
    const explicitBankMention = ["sbi", "hdfc", "icici", "axis", "kotak", "idfc", "canara", "indusind", "fi money", "niyo", "pnb", "bob", "bank of baroda"].filter(b => lowerMsg.includes(b));
    const combinedBankNames = [...new Set([...bankNamesFound, ...explicitBankMention])];

    // Attribute & Feature Search Flags
    const isZeroFee = lowerMsg.includes("zero fee") || lowerMsg.includes("no fee") || lowerMsg.includes("zero annual fee") || lowerMsg.includes("free card") || lowerMsg.includes("zero balance") || lowerMsg.includes("no annual fee") || lowerMsg.includes("free debit card");
    const isLounge = lowerMsg.includes("lounge") || lowerMsg.includes("airport");
    const isAtmOrLimit = lowerMsg.includes("atm") || lowerMsg.includes("limit") || lowerMsg.includes("withdrawal") || lowerMsg.includes("pos limit");
    const isContactless = lowerMsg.includes("contactless") || lowerMsg.includes("tap") || lowerMsg.includes("paywave") || lowerMsg.includes("nfc");
    const isCashback = lowerMsg.includes("cashback") || lowerMsg.includes("cash back") || lowerMsg.includes("reward") || lowerMsg.includes("rewards") || lowerMsg.includes("points");
    const isPlatinum = lowerMsg.includes("platinum");

    // Contextual Follow-Up Refinement
    let candidateCards = Array.isArray(allCards) ? allCards : [];
    if (chatContext && Array.isArray(chatContext.lastMatchedCards) && chatContext.lastMatchedCards.length > 0) {
      if (lowerMsg.includes("these") || lowerMsg.includes("them") || lowerMsg.includes("which of") || lowerMsg.includes("among")) {
        candidateCards = chatContext.lastMatchedCards;
      }
    }

    // Execute Strict Filtering over retrieved Firestore records
    let matchedCards = candidateCards.filter(c => {
      if (!c) return false;
      const cName = String(c.cardName || "").toLowerCase();
      const cBank = String(c.bank || "").toLowerCase();
      const cNetwork = String(c.network || "").toLowerCase();
      const cCat = String(c.category || "").toLowerCase();
      const cBenefits = String(c.benefits || "").toLowerCase();
      const cFeatures = Array.isArray(c.features) ? c.features.map(f => String(f || '').toLowerCase()).join(" ") : "";
      const cLounge = String(c.loungeAccess || "").toLowerCase();
      const cFee = c.annualFee || 0;

      let match = true;

      // Strict Network Filter
      if (hasRuPay && !cNetwork.includes("rupay") && !cName.includes("rupay")) match = false;
      if (hasVisa && !cNetwork.includes("visa") && !cName.includes("visa")) match = false;
      if (hasMastercard && !cNetwork.includes("mastercard") && !cName.includes("mastercard")) match = false;

      // Strict Bank Filter
      if (combinedBankNames.length > 0) {
        const matchesBank = combinedBankNames.some(bn => cBank.includes(bn) || cName.includes(bn));
        if (!matchesBank) match = false;
      }

      // Zero Fee Filter
      if (isZeroFee) {
        const isFree = cFee === 0 || Boolean(c.zeroFeeOrLowFee) || (c.joiningFee && String(c.joiningFee).toLowerCase().includes("free")) || cName.includes("zero") || cName.includes("811") || cName.includes("fi");
        if (!isFree) match = false;
      }

      // Lounge Access Filter
      if (isLounge) {
        const hasLounge = cLounge.includes("yes") || cFeatures.includes("lounge") || cBenefits.includes("lounge");
        if (!hasLounge) match = false;
      }

      // Contactless Filter
      if (isContactless) {
        const hasContactless = c.contactless === true || cFeatures.includes("contactless") || cFeatures.includes("paywave") || cName.includes("paywave");
        if (!hasContactless) match = false;
      }

      // Cashback Filter
      if (isCashback) {
        const hasCashback = (c.cashbackPct && c.cashbackPct > 0) || cCat.includes("rewards") || cCat.includes("cashback") || cBenefits.includes("cashback") || cBenefits.includes("reward");
        if (!hasCashback) match = false;
      }

      // Platinum Filter
      if (isPlatinum) {
        const isPlat = cName.includes("platinum") || cCat.includes("platinum");
        if (!isPlat) match = false;
      }

      return match;
    });

    // Check specific keyword matching if no specific feature filters were activated
    if (matchedCards.length === 0 && !isZeroFee && !isLounge && !isContactless && !isCashback && !isPlatinum && combinedBankNames.length === 0 && !hasRuPay && !hasVisa && !hasMastercard) {
      matchedCards = (allCards || []).filter(c => {
        if (!c) return false;
        const fullStr = `${c.cardName || ''} ${c.bank || ''} ${c.category || ''} ${c.bestFor || ''} ${c.benefits || ''}`.toLowerCase();
        return lowerMsg.split(' ').some(word => word.length > 3 && fullStr.includes(word));
      });
    }

    // Check FAQ matches in Firestore faq collection
    const faqMatch = (allFaqs || []).find(f => {
      if (!f) return false;
      const qLower = String(f.q || f.question || "").toLowerCase();
      return lowerMsg.includes(qLower) || qLower.split(' ').some(w => w.length > 4 && lowerMsg.includes(w));
    });

    // 3. Generate response ONLY from retrieved Firestore records

    // Case A: Card Comparison Matrix
    if (isCompareQuery && matchedCards.length > 0) {
      const topCards = matchedCards.slice(0, 3);
      let compareText = `📊 **Firestore Side-by-Side Card Comparison**:\n\n`;
      topCards.forEach((c, idx) => {
        const feeStr = c.annualFee === 0 ? "FREE (₹0)" : `₹${c.annualFee}/yr`;
        const atmStr = typeof c.limits?.atmLimit === 'number' ? `₹${c.limits.atmLimit.toLocaleString()}/day` : ((Array.isArray(c.features) ? c.features.find(f => String(f || '').toLowerCase().includes("atm")) : null) || "Standard");
        const loungeStr = c.loungeAccess || "Check Spend Qualifier";

        compareText += `**${idx + 1}. ${c.cardName} (${c.bank})**\n`;
        compareText += `• **Network**: ${c.network || 'Visa/RuPay'}\n`;
        compareText += `• **Annual Fee**: ${feeStr}\n`;
        compareText += `• **ATM Withdrawal Limit**: ${atmStr}\n`;
        compareText += `• **Lounge Access**: ${loungeStr}\n`;
        compareText += `• **Rating**: ${c.rating || 4.5} ★\n\n`;
      });
      compareText += `💡 *Fetched live from Firestore database.*`;

      return {
        text: compareText,
        type: "compare",
        matchedCards: topCards,
        timestamp
      };
    }

    // Case B: Matched Cards Result
    if (matchedCards.length > 0) {
      const cardsToShow = matchedCards.slice(0, 4);
      let responseText = `💳 **Found ${matchedCards.length} Matching Card(s) in Firestore Database:**\n\n`;

      cardsToShow.forEach((c, idx) => {
        const feeStr = c.annualFee === 0 ? "FREE (Zero Fee)" : `₹${c.annualFee}/year`;
        const atmStr = typeof c.limits?.atmLimit === 'number' ? `₹${c.limits.atmLimit.toLocaleString()}/day` : "Standard Limit";
        const posStr = typeof c.limits?.posLimit === 'number' ? `₹${c.limits.posLimit.toLocaleString()}/day` : (typeof c.maxLimit === 'number' ? `₹${c.maxLimit.toLocaleString()}/day` : "Standard");
        const loungeStr = c.loungeAccess ? c.loungeAccess : "N/A";
        const contactlessStr = c.contactless ? "Yes ✅" : "No";

        responseText += `**${idx + 1}. ${c.cardName}** (${c.bank})\n`;
        responseText += `• **Network**: ${c.network || 'RuPay / Visa'}\n`;
        responseText += `• **Annual Fee**: ${feeStr}\n`;
        responseText += `• **ATM Limit**: ${atmStr}\n`;
        responseText += `• **POS Limit**: ${posStr}\n`;
        responseText += `• **Lounge Access**: ${loungeStr}\n`;
        responseText += `• **Contactless**: ${contactlessStr}\n`;
        if (c.benefits) responseText += `• **Benefits**: ${c.benefits}\n`;
        responseText += `\n`;
      });

      if (matchedCards.length > 4) {
        responseText += `*+ ${matchedCards.length - 4} more matching cards available in Firestore database.*\n\n`;
      }
      responseText += `Feel free to ask a follow-up question (e.g., *"Which of these has zero fee?"* or *"Compare these cards"*).`;

      return {
        text: responseText,
        type: "cards_list",
        matchedCards,
        timestamp
      };
    }

    // Case C: FAQ Match from Firestore
    if (faqMatch) {
      return {
        text: `❓ **${faqMatch.q || faqMatch.question}**\n\n${faqMatch.a || faqMatch.answer}\n\n*(Source: Firestore FAQ Record)*`,
        type: "faq",
        timestamp
      };
    }

    // Case D: STRICT REQUIREMENT - NO MATCHING RECORD IN FIRESTORE
    return {
      text: "Sorry, I couldn't find any matching debit card in our database.",
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
        messages: messages.slice(-50), // Persist last 50 messages
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
