import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Search, 
  Mic, 
  MicOff, 
  Send, 
  CheckCircle2, 
  Bot, 
  ExternalLink, 
  Scale, 
  RotateCcw,
  ShieldCheck, 
  CreditCard, 
  Landmark, 
  Briefcase, 
  Zap, 
  X,
  Heart,
  Info,
  AlertCircle,
  HelpCircle,
  MapPin
} from 'lucide-react';
import BankLogo from './BankLogo';
import DebitCardVisual from './DebitCardVisual';
import { debitCards } from '../data/mockData';
import { savingsAccounts } from '../data/savingsAccounts';
import { currentAccounts } from '../data/currentAccounts';
import { aiChatService } from '../services/aiChatService';
import { useAuth } from '../hooks/useAuth';
import { useWishlist } from '../context/WishlistContext';
import { useLanguage } from '../context/LanguageContext';

const ROTATING_PLACEHOLDERS = [
  "Ask anything about banking products & branches...",
  "Show me zero balance savings accounts...",
  "Find nearest SBI ATM in Kharar...",
  "Compare debit cards with airport lounge access...",
  "Chandigarh mein HDFC branch...",
  "Show current accounts for businesses...",
  "Compare Canara Bank and SBI savings accounts..."
];

const QUICK_QUESTIONS = [
  "Find a savings account with low minimum balance",
  "Kharar mein SBI ka nearest ATM",
  "Compare Canara Bank savings accounts",
  "Show debit cards with lounge access",
  "Chandigarh mein HDFC branch",
  "Which accounts have zero balance?",
  "Find current accounts for businesses"
];

const EXAMPLE_QUERIES = [
  "Find a savings account under ₹5,000 MAB",
  "Kharar mein SBI ATM",
  "Which debit cards have lounge access?",
  "Compare SBI and HDFC savings accounts",
  "Chandigarh mein HDFC branch",
  "Show current accounts for businesses"
];

const KEY_FEATURES = [
  { icon: Bot, title: "AI Assistance", desc: "Interactive banking product discovery" },
  { icon: Sparkles, title: "Intelligent Search", desc: "Natural language product matching" },
  { icon: Mic, title: "Voice Input", desc: "Real-time speech-to-text input" },
  { icon: Zap, title: "Complete Database", desc: "Savings, Debit Cards & Current Accounts" },
  { icon: ShieldCheck, title: "Verified Data", desc: "Official bank sources & fee schedules" },
  { icon: Scale, title: "Structured Results", desc: "Cards, comparison tables & direct links" }
];

const HOW_IT_WORKS_STEPS = [
  { step: "1", title: "Ask", desc: "Type or speak your question in natural language" },
  { step: "2", title: "Search", desc: "AI searches the D.CARD database for relevant products" },
  { step: "3", title: "Understand", desc: "Get structured results with official bank sources" },
  { step: "4", title: "Choose", desc: "Compare products, view details and make the right choice" }
];

/**
 * Common banking terms definitions for clean info card queries (e.g. "What is MAB?")
 */
const BANKING_KNOWLEDGE = {
  mab: {
    title: "MAB (Monthly Average Balance)",
    definition: "Monthly Average Balance is the average end-of-day balance that must be maintained in a bank account during a calendar month to avoid non-maintenance penalty charges."
  },
  amb: {
    title: "AMB (Average Monthly Balance)",
    definition: "Average Monthly Balance is the sum of daily closing balances divided by the number of days in the month required by banks to maintain fee-free account status."
  },
  "zero balance": {
    title: "Zero Balance Savings Account",
    definition: "A zero balance savings account has no minimum balance requirement. You can keep ₹0 in the account without incurring any non-maintenance penalty charges."
  },
  bsbda: {
    title: "BSBDA (Basic Savings Bank Deposit Account)",
    definition: "BSBDA is an RBI-mandated zero-balance savings account providing basic banking facilities like ATM card, cash deposit, and withdrawals with no minimum balance penalty."
  },
  lounge: {
    title: "Airport Lounge Access",
    definition: "Complimentary access to domestic and international airport lounges via debit cards, offering free refreshments, Wi-Fi, and comfortable waiting zones (often subject to quarterly spend criteria)."
  },
  forex: {
    title: "Forex Markup Fee",
    definition: "A surcharge (typically 1.5% to 3.5%) added by the issuing bank when making international payments or cash withdrawals in a foreign currency."
  },
  overdraft: {
    title: "Overdraft (OD) Facility",
    definition: "A credit facility linked to current or savings accounts allowing account holders to withdraw money exceeding their account balance up to an agreed limit, paying interest only on the utilized sum."
  }
};

/**
 * Searches and ranks products from verified D.CARD dataset
 */
function matchLocalProducts(queryText = '') {
  const lower = queryText.toLowerCase().trim();

  // Banking term knowledge check
  let infoCard = null;
  for (const [key, val] of Object.entries(BANKING_KNOWLEDGE)) {
    if (lower.includes(key) && (lower.includes('what is') || lower.includes('meaning') || lower.includes('explain') || lower.includes('define') || lower === key)) {
      infoCard = val;
      break;
    }
  }

  const isComparison = lower.includes('compare') || lower.includes(' vs ') || lower.includes(' versus ') || lower.includes('difference between');
  const isSavingsQuery = lower.includes('saving') || lower.includes('savings') || lower.includes('interest') || lower.includes('mab') || lower.includes('balance') || lower.includes('bsbda');
  const isCurrentQuery = lower.includes('current') || lower.includes('business') || lower.includes('trade') || lower.includes('od') || lower.includes('overdraft') || lower.includes('cheque') || lower.includes('corporate');
  const isCardQuery = lower.includes('debit') || lower.includes('card') || lower.includes('lounge') || lower.includes('atm') || lower.includes('pos limit') || lower.includes('annual fee');

  const wantsZero = lower.includes('zero balance') || lower.includes('0 balance') || lower.includes('no minimum') || lower.includes('zero mab');
  const wantsLow = lower.includes('low') || lower.includes('5000') || lower.includes('5,000') || lower.includes('under');
  const wantsLounge = lower.includes('lounge') || lower.includes('airport');
  const wantsLowestFee = lower.includes('lowest') || lower.includes('free') || lower.includes('zero fee');

  // Detect banks
  const bankNames = ['canara', 'sbi', 'state bank', 'hdfc', 'icici', 'axis', 'kotak', 'idfc', 'indusind', 'pnb', 'baroda', 'federal', 'yes'];
  const matchedBanks = bankNames.filter(b => lower.includes(b));

  // Match Debit Cards
  let matchedCards = (debitCards || []).filter(card => {
    const cardLower = (card.cardName || '').toLowerCase();
    const bankLower = (card.bank || '').toLowerCase();
    const networkLower = (card.network || '').toLowerCase();

    if (matchedBanks.length > 0 && !matchedBanks.some(b => bankLower.includes(b))) {
      return false;
    }
    if (wantsLounge) {
      return card.loungeAccess && !card.loungeAccess.toLowerCase().startsWith('no') && !card.loungeAccess.toLowerCase().includes('not');
    }
    if (wantsLowestFee) {
      return (card.annualFee === 0 || card.annualFee <= 250);
    }
    if (isCardQuery) return true;
    return cardLower.includes(lower) || bankLower.includes(lower) || networkLower.includes(lower);
  });

  // Match Savings Accounts
  let matchedSavings = (savingsAccounts || []).filter(acc => {
    const accLower = (acc.accountName || '').toLowerCase();
    const bankLower = (acc.bank || '').toLowerCase();

    if (matchedBanks.length > 0 && !matchedBanks.some(b => bankLower.includes(b))) {
      return false;
    }
    if (wantsZero) {
      return acc.isZeroBalance || acc.minimumBalanceValue === 0 || String(acc.minimumBalance || '').toLowerCase().includes('zero');
    }
    if (wantsLow) {
      return acc.minimumBalanceValue !== undefined && acc.minimumBalanceValue <= 5000;
    }
    if (isSavingsQuery) return true;
    return accLower.includes(lower) || bankLower.includes(lower);
  });

  // Match Current Accounts
  let matchedCurrent = (currentAccounts || []).filter(acc => {
    const accLower = (acc.accountName || '').toLowerCase();
    const bankLower = (acc.bank || '').toLowerCase();

    if (matchedBanks.length > 0 && !matchedBanks.some(b => bankLower.includes(b))) {
      return false;
    }
    if (isCurrentQuery) return true;
    return accLower.includes(lower) || bankLower.includes(lower);
  });

  // If specific comparison between banks (e.g. Canara Bank and SBI)
  if (isComparison && matchedBanks.length >= 2) {
    if (isSavingsQuery || (!isCardQuery && !isCurrentQuery)) {
      matchedSavings = (savingsAccounts || []).filter(acc => 
        matchedBanks.some(b => (acc.bank || '').toLowerCase().includes(b))
      );
    }
    if (isCardQuery) {
      matchedCards = (debitCards || []).filter(c => 
        matchedBanks.some(b => (c.bank || '').toLowerCase().includes(b))
      );
    }
  }

  // Fallback defaults if query is broad or general
  if (matchedCards.length === 0 && matchedSavings.length === 0 && matchedCurrent.length === 0) {
    if (isCardQuery) {
      matchedCards = (debitCards || []).slice(0, 4);
    } else if (isCurrentQuery) {
      matchedCurrent = (currentAccounts || []).slice(0, 4);
    } else {
      matchedSavings = (savingsAccounts || []).filter(a => a.isZeroBalance || a.minimumBalanceValue === 0).slice(0, 4);
    }
  }

  return {
    isComparison,
    infoCard,
    cards: matchedCards.slice(0, 6),
    savings: matchedSavings.slice(0, 6),
    current: matchedCurrent.slice(0, 6)
  };
}

export default function AIAssistanceSection({
  onSelectDebitCard,
  toggleCompareQueue,
  compareQueue = [],
  setSavingsCompareQueue
}) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isWishlisted, toggleWishlist } = useWishlist();

  const { isHindi } = useLanguage();
  const [inputValue, setInputValue] = useState('');
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [voiceState, setVoiceState] = useState('idle'); // 'idle' | 'requesting' | 'listening' | 'recognized' | 'denied' | 'error' | 'unsupported'
  const [voiceLang, setVoiceLang] = useState(isHindi ? 'hi-IN' : 'en-IN');
  const [speechNotice, setSpeechNotice] = useState(null); // { type: 'listening'|'success'|'error'|'info', text: string }
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [activeTab, setActiveTab] = useState('all');

  const recognitionRef = useRef(null);
  const resultsRef = useRef(null);
  const noticeTimerRef = useRef(null);

  // Sync default voice language with site language unless manually overridden
  useEffect(() => {
    setVoiceLang(isHindi ? 'hi-IN' : 'en-IN');
  }, [isHindi]);

  // Helper to show self-clearing notice
  const showNotice = useCallback((noticeObj, autoDismissMs = 6000) => {
    if (noticeTimerRef.current) clearTimeout(noticeTimerRef.current);
    setSpeechNotice(noticeObj);
    if (autoDismissMs > 0) {
      noticeTimerRef.current = setTimeout(() => {
        setSpeechNotice(null);
      }, autoDismissMs);
    }
  }, []);

  // Rotating placeholder
  useEffect(() => {
    const timer = setInterval(() => {
      setPlaceholderIndex(prev => (prev + 1) % ROTATING_PLACEHOLDERS.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // Cleanup speech recognition and timers on unmount
  useEffect(() => {
    return () => {
      if (noticeTimerRef.current) clearTimeout(noticeTimerRef.current);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {}
      }
    };
  }, []);

  const handleVoiceToggle = () => {
    // If currently listening or requesting, clicking the button stops recognition
    if (isListening || voiceState === 'listening' || voiceState === 'requesting') {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
      setIsListening(false);
      setVoiceState('idle');
      showNotice({
        type: 'info',
        text: isHindi ? 'वॉयस इनपुट रोक दिया गया।' : 'Voice input stopped.'
      }, 4000);
      return;
    }

    const SpeechRecognition = typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition);
    if (!SpeechRecognition) {
      setVoiceState('unsupported');
      setIsListening(false);
      showNotice({
        type: 'error',
        text: isHindi
          ? 'इस ब्राउज़र में वॉयस रिकॉग्निशन समर्थित नहीं है। कृपया लिखकर प्रश्न पूछें।'
          : 'Speech recognition is not supported in this browser. Please type your query.'
      }, 7000);
      return;
    }

    try {
      setVoiceState('requesting');
      showNotice({
        type: 'listening',
        text: isHindi
          ? 'माइक्रोफ़ोन अनुमति का अनुरोध किया जा रहा है...'
          : 'Requesting microphone permission...'
      }, 0);

      const recognition = new SpeechRecognition();
      recognition.lang = voiceLang;
      recognition.interimResults = true;
      recognition.continuous = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        setVoiceState('listening');
        showNotice({
          type: 'listening',
          text: isHindi
            ? `सुन रहा है (${voiceLang === 'hi-IN' ? 'हिंदी' : 'अंग्रेजी'})... अब अपना प्रश्न बोलें`
            : `Listening in ${voiceLang === 'hi-IN' ? 'Hindi (hi-IN)' : 'English (en-IN)'}... Speak your banking question now`
        }, 0);
      };

      recognition.onresult = (event) => {
        let interimText = '';
        let finalText = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const res = event.results[i];
          const transcript = res?.[0]?.transcript || '';
          if (res.isFinal) {
            finalText += transcript;
          } else {
            interimText += transcript;
          }
        }

        if (finalText) {
          let clean = finalText.trim()
            .replace(/\bfive thousand\b/gi, '₹5,000')
            .replace(/\bten thousand\b/gi, '₹10,000')
            .replace(/\btwo thousand\b/gi, '₹2,000');

          setInputValue(clean);
          setIsListening(false);
          setVoiceState('recognized');
          showNotice({
            type: 'success',
            text: isHindi
              ? 'आवाज़ पहचान ली गई! प्रश्न की समीक्षा करें या संपादित करें, फिर Search पर क्लिक करें।'
              : 'Speech recognized! Review or edit your query, then click Search.'
          }, 6000);
        } else if (interimText) {
          setInputValue(interimText);
        }
      };

      recognition.onerror = (event) => {
        setIsListening(false);
        const err = event.error;

        if (err === 'not-allowed' || err === 'permission-denied') {
          setVoiceState('denied');
          showNotice({
            type: 'error',
            text: isHindi
              ? 'माइक्रोफ़ोन अनुमति अस्वीकृत। कृपया ब्राउज़र सेटिंग्स में माइक्रोफ़ोन की अनुमति दें या लिखकर खोजें।'
              : 'Microphone permission denied. Please allow microphone access or type your query.'
          }, 7000);
        } else if (err === 'no-speech') {
          setVoiceState('error');
          showNotice({
            type: 'error',
            text: isHindi
              ? 'कोई आवाज़ नहीं सुनी गई। कृपया पुनः बोलें या लिखकर खोजें।'
              : 'No speech was detected. Please try speaking again or type your query.'
          }, 6000);
        } else if (err === 'audio-capture') {
          setVoiceState('error');
          showNotice({
            type: 'error',
            text: isHindi
              ? 'कोई माइक्रोफ़ोन नहीं मिला। कृपया माइक्रोफ़ोन कनेक्ट करें।'
              : 'Microphone not found. Ensure a microphone is connected to your device.'
          }, 7000);
        } else if (err === 'network') {
          setVoiceState('error');
          showNotice({
            type: 'error',
            text: isHindi
              ? 'वॉयस सेवा में नेटवर्क त्रुटि। कृपया इंटरनेट कनेक्शन जांचें।'
              : 'Network error occurred during speech recognition. Please check your connection.'
          }, 7000);
        } else if (err === 'aborted') {
          setVoiceState('idle');
          setSpeechNotice(null);
        } else {
          setVoiceState('error');
          showNotice({
            type: 'error',
            text: isHindi
              ? 'वॉयस इनपुट संसाधित नहीं हो सका। कृपया पुनः प्रयास करें या लिखकर खोजें।'
              : 'Voice recognition encountered an error. Please try again or type your query.'
          }, 6000);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
        if (voiceState === 'listening' || voiceState === 'requesting') {
          setVoiceState('idle');
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      setIsListening(false);
      setVoiceState('error');
      showNotice({
        type: 'error',
        text: isHindi
          ? 'माइक्रोफ़ोन प्रारंभ नहीं हो सका। कृपया पुनः प्रयास करें या लिखकर खोजें।'
          : 'Could not start voice recognition. Please try again or type your query.'
      }, 6000);
    }
  };

  const handleSearch = async (queryToSearch) => {
    const query = String(queryToSearch !== undefined ? queryToSearch : inputValue).trim();
    if (!query) return;

    setLoading(true);
    setInputValue(query);
    setSpeechNotice(null);

    try {
      // 1. Query structured local matcher directly to ensure instant zero-latency structured product results
      const local = matchLocalProducts(query);

      let cards = local.cards;
      let savings = local.savings;
      let current = local.current;
      let locations = [];

      // 2. Also query backend if more matches needed
      if (cards.length === 0 && savings.length === 0 && current.length === 0) {
        try {
          const aiResponse = await aiChatService.sendMessage(query, user);
          if (aiResponse?.matchedCards?.length) cards = aiResponse.matchedCards;
          if (aiResponse?.matchedAccounts?.length) savings = aiResponse.matchedAccounts;
          if (aiResponse?.matchedCurrentAccounts?.length) current = aiResponse.matchedCurrentAccounts;
          if (aiResponse?.matchedLocations?.length) locations = aiResponse.matchedLocations;
        } catch (e) {}
      }

      setResult({
        query,
        isComparison: local.isComparison,
        infoCard: local.infoCard,
        matchedCards: cards,
        matchedAccounts: savings,
        matchedCurrentAccounts: current,
        matchedLocations: locations
      });

      // Smooth scroll to product results
      setTimeout(() => {
        if (resultsRef.current) {
          resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }, 100);
    } catch (err) {
      console.warn("AI search error:", err);
      const local = matchLocalProducts(query);
      setResult({
        query,
        isComparison: local.isComparison,
        infoCard: local.infoCard,
        matchedCards: local.cards,
        matchedAccounts: local.savings,
        matchedCurrentAccounts: local.current,
        matchedLocations: []
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleSearch(inputValue);
  };

  const handleCardClick = (card) => {
    if (onSelectDebitCard) {
      onSelectDebitCard(card);
    } else {
      navigate(`/debit-cards/${card.id}`);
    }
  };

  const handleCardCompare = (e, card) => {
    e.stopPropagation();
    if (toggleCompareQueue) {
      toggleCompareQueue(card);
    }
  };

  const handleSavingsDetails = (acc) => {
    navigate(`/savings-accounts/${acc.id}`);
  };

  const handleSavingsCompare = (e, acc) => {
    e.stopPropagation();
    if (setSavingsCompareQueue) {
      setSavingsCompareQueue(prev => {
        if (prev.some(a => String(a.id) === String(acc.id))) return prev;
        if (prev.length >= 3) return prev;
        return [...prev, acc];
      });
      navigate('/compare-savings');
    }
  };

  const handleCurrentDetails = (acc) => {
    navigate(`/current-accounts/${acc.id}`);
  };

  const totalProductCount = (result?.matchedCards?.length || 0) + 
    (result?.matchedAccounts?.length || 0) + 
    (result?.matchedCurrentAccounts?.length || 0) +
    (result?.matchedLocations?.length || 0);

  return (
    <section 
      id="ai-assistance" 
      aria-label="D.CARD AI Assistance"
      className="select-none text-left"
    >
      <div className="rounded-3xl bg-gradient-to-br from-[#F8FAFC] via-[#EFF6FF]/70 to-[#F1F5F9] dark:from-[#0B1528] dark:via-[#111F38] dark:to-[#0F172A] border border-blue-200/80 dark:border-slate-800 shadow-xl overflow-hidden p-6 sm:p-8 lg:p-10 relative">
        {/* Subtle background ambient glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/10 dark:bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-indigo-500/10 dark:bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* ═══ TOP 3-PANEL WIREFRAME / LAYOUT ═══ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch relative z-10">

          {/* ── LEFT PANEL: Key Features (3 cols on large) ── */}
          <div className="lg:col-span-3 hidden md:flex flex-col justify-between p-5 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 shadow-sm backdrop-blur-md">
            <div>
              <div className="flex items-center gap-2 pb-3 mb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 flex items-center justify-center text-[#2563EB]">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-white">
                  Key Features
                </h3>
              </div>

              <div className="space-y-3.5">
                {KEY_FEATURES.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div key={idx} className="flex items-start gap-2.5">
                      <div className="w-6 h-6 rounded-lg bg-blue-50 dark:bg-blue-950/70 border border-blue-100 dark:border-blue-900/70 flex items-center justify-center text-[#2563EB] shrink-0 mt-0.5">
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight">
                          {item.title}
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight mt-0.5 truncate">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
              <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Live Product AI
              </span>
              <span className="font-bold text-slate-400">100% Verified</span>
            </div>
          </div>

          {/* ── CENTER PANEL: Main D.CARD AI Assistance Search Experience (6 cols on lg) ── */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
            
            {/* Header with Title and Description */}
            <div className="space-y-2 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/10 dark:bg-blue-500/20 text-[#2563EB] dark:text-[#60A5FA] text-xs font-extrabold uppercase tracking-wider border border-blue-500/20">
                <Sparkles className="w-3.5 h-3.5" />
                <span>D.CARD AI Assistance</span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                D.CARD AI Assistance
              </h2>

              <p className="text-xs sm:text-sm font-semibold text-[#2563EB] dark:text-[#60A5FA]">
                Your AI-Powered Banking Product Assistant
              </p>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal pt-1">
                Ask questions about banking products, compare options, understand fees and benefits, and find products that match your requirements.
              </p>
            </div>

            {/* ── MAIN SEARCH INPUT BOX WITH VOICE AND SEND ── */}
            <form onSubmit={handleFormSubmit} className="relative w-full">
              <div className={`p-2 sm:p-2.5 rounded-2xl bg-white dark:bg-slate-900 border-2 transition-all duration-200 shadow-lg flex items-center gap-2 ${
                isListening 
                  ? 'border-red-500 ring-4 ring-red-500/20 dark:ring-red-500/30' 
                  : 'border-blue-500/30 hover:border-blue-500 focus-within:border-[#2563EB] focus-within:ring-4 focus-within:ring-blue-500/15'
              }`}>
                {/* Search Icon */}
                <div className="pl-2 text-slate-400 dark:text-slate-500 shrink-0">
                  <Search className="w-5 h-5 text-[#2563EB]" />
                </div>

                {/* Text Input */}
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={ROTATING_PLACEHOLDERS[placeholderIndex]}
                  className="w-full bg-transparent text-sm sm:text-base font-semibold text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none min-w-0"
                  aria-label="Ask D.CARD AI Assistance"
                />

                {/* Clear Input Button (if typing) */}
                {inputValue && (
                  <button
                    type="button"
                    onClick={() => setInputValue('')}
                    className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    aria-label="Clear query text"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}

                {/* Voice recognition language toggle (EN / HI) */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    const next = voiceLang === 'hi-IN' ? 'en-IN' : 'hi-IN';
                    setVoiceLang(next);
                    if (isListening && recognitionRef.current) {
                      try { recognitionRef.current.stop(); } catch (err) {}
                      setIsListening(false);
                      setVoiceState('idle');
                    }
                    showNotice({
                      type: 'info',
                      text: next === 'hi-IN'
                        ? (isHindi ? 'वॉयस भाषा: हिंदी (hi-IN) सेट की गई' : 'Voice input language set to Hindi (hi-IN)')
                        : (isHindi ? 'वॉयस भाषा: अंग्रेजी (en-IN) सेट की गई' : 'Voice input language set to English (en-IN)')
                    }, 3500);
                  }}
                  title={voiceLang === 'hi-IN' ? (isHindi ? 'वॉयस भाषा: हिंदी (hi-IN) - अंग्रेजी के लिए क्लिक करें' : 'Voice language: Hindi (Click for English)') : (isHindi ? 'वॉयस भाषा: अंग्रेजी (en-IN) - हिंदी के लिए क्लिक करें' : 'Voice language: English (Click for Hindi)')}
                  className={`px-2 py-1.5 rounded-xl font-black text-[10px] tracking-wider transition-all flex items-center gap-1 shrink-0 cursor-pointer ${
                    voiceLang === 'hi-IN'
                      ? 'bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 hover:bg-amber-500/20'
                      : 'bg-blue-50 dark:bg-blue-950/60 text-[#2563EB] dark:text-[#60A5FA] border border-blue-200 dark:border-blue-900 hover:bg-blue-100'
                  }`}
                  aria-label="Switch voice recognition language"
                >
                  <span>{voiceLang === 'hi-IN' ? '🇮🇳 HI' : '🌐 EN'}</span>
                </button>

                {/* Microphone / Speech-to-Text Button */}
                <button
                  type="button"
                  onClick={handleVoiceToggle}
                  title={
                    isListening
                      ? (isHindi ? 'सुन रहा है... रोकने के लिए क्लिक करें' : 'Listening... Click to stop')
                      : voiceState === 'requesting'
                      ? (isHindi ? 'अनुमति का अनुरोध किया जा रहा है...' : 'Requesting mic permission...')
                      : (isHindi ? `बोलकर खोजें (${voiceLang === 'hi-IN' ? 'हिंदी' : 'अंग्रेजी'})` : `Click to speak (${voiceLang})`)
                  }
                  className={`p-2.5 rounded-xl font-bold transition-all flex items-center justify-center shrink-0 cursor-pointer active:scale-95 relative ${
                    isListening 
                      ? 'bg-red-500 text-white animate-pulse shadow-lg shadow-red-500/40 ring-4 ring-red-400/30' 
                      : voiceState === 'recognized'
                      ? 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 border border-emerald-400'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-blue-50 hover:text-[#2563EB] dark:hover:bg-blue-950/80 dark:hover:text-[#60A5FA]'
                  }`}
                  aria-label="Voice input button"
                >
                  {isListening ? (
                    <MicOff className="w-4 h-4" />
                  ) : voiceState === 'requesting' ? (
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Mic className="w-4 h-4" />
                  )}
                  {isListening && (
                    <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600" />
                    </span>
                  )}
                </button>

                {/* Send / Search Button */}
                <button
                  type="submit"
                  disabled={loading || !inputValue.trim()}
                  className={`p-2.5 sm:px-4 sm:py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shrink-0 cursor-pointer shadow-md active:scale-95 ${
                    loading || !inputValue.trim()
                      ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed shadow-none'
                      : 'bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] hover:from-[#1D4ED8] hover:to-[#1E40AF] text-white shadow-blue-500/30'
                  }`}
                  aria-label="Send AI Query"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span className="hidden sm:inline">Search</span>
                    </>
                  )}
                </button>
              </div>

              {/* Real-time Voice Notice or Feedback Banner */}
              <AnimatePresence>
                {speechNotice && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className={`mt-2.5 text-xs font-semibold px-3.5 py-2 rounded-xl shadow-xs flex items-center justify-between gap-2 border text-left ${
                      speechNotice.type === 'listening'
                        ? 'bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-900/60 text-red-700 dark:text-red-300'
                        : speechNotice.type === 'success'
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900/60 text-emerald-700 dark:text-emerald-300'
                        : speechNotice.type === 'error'
                        ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300'
                        : 'bg-blue-50 dark:bg-slate-900 border-blue-200 dark:border-blue-900 text-blue-700 dark:text-blue-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      {speechNotice.type === 'listening' && (
                        <span className="flex h-2.5 w-2.5 relative shrink-0">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
                        </span>
                      )}
                      {speechNotice.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                      {speechNotice.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />}
                      {speechNotice.type === 'info' && <Info className="w-4 h-4 text-blue-600 shrink-0" />}
                      <span className="break-words leading-tight text-xs font-medium">{speechNotice.text}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSpeechNotice(null)}
                      className="p-1 rounded-md hover:bg-black/5 dark:hover:bg-white/10 shrink-0 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                      aria-label="Dismiss notice"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>

            {/* Quick Questions Pills */}
            <div className="space-y-2 pt-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                Quick Questions
              </span>
              <div className="flex flex-wrap gap-2">
                {QUICK_QUESTIONS.map((question, qIdx) => (
                  <button
                    key={qIdx}
                    type="button"
                    onClick={() => handleSearch(question)}
                    className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-950/30 text-slate-700 dark:text-slate-200 text-xs font-medium transition-all shadow-xs active:scale-95 text-left cursor-pointer"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>

            {/* Example User Queries */}
            <div className="space-y-2 pt-1 border-t border-slate-200/80 dark:border-slate-800">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Example User Queries
              </span>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {EXAMPLE_QUERIES.map((ex, exIdx) => (
                  <button
                    key={exIdx}
                    type="button"
                    onClick={() => handleSearch(ex)}
                    className="px-2.5 py-1 rounded-lg bg-slate-100/90 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-[11px] font-medium transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <Search className="w-2.5 h-2.5 text-blue-500 shrink-0" />
                    <span>{ex}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ── RIGHT PANEL: How It Works & AI Assistant Robot Visual (3 cols on lg) ── */}
          <div className="lg:col-span-3 flex flex-col justify-between p-5 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 shadow-sm backdrop-blur-md">
            <div>
              {/* How It Works Header */}
              <div className="flex items-center gap-2 pb-3 mb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 flex items-center justify-center text-[#2563EB]">
                  <Zap className="w-4 h-4" />
                </div>
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-white">
                  How It Works
                </h3>
              </div>

              {/* 4-Step Process */}
              <div className="space-y-3">
                {HOW_IT_WORKS_STEPS.map((stepItem, sIdx) => (
                  <div key={sIdx} className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#2563EB] text-white font-black text-[10px] flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                      {stepItem.step}
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight">
                        {stepItem.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight mt-0.5">
                        {stepItem.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Assistant Robot Visual + Message Bubble */}
            <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col items-center text-center space-y-3">
              {/* Speech bubble */}
              <div className="w-full p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900/60 text-left relative shadow-xs">
                <p className="text-xs font-bold text-blue-900 dark:text-blue-200 leading-snug">
                  "Hi! I'm D.CARD AI Assistance. Ask me anything about banking products."
                </p>
                <div className="w-2.5 h-2.5 bg-blue-50 dark:bg-blue-950/60 border-b border-l border-blue-100 dark:border-blue-900/60 transform -rotate-45 absolute -bottom-1.5 left-6" />
              </div>

              {/* Robot Assistant Graphic */}
              <div className="flex items-center justify-center gap-3 w-full">
                <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#2563EB] to-[#60A5FA] flex items-center justify-center shadow-lg shadow-blue-500/20">
                  <Bot className="w-9 h-9 text-white" />
                  <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-white dark:border-slate-900" />
                </div>
                <div className="text-left min-w-0">
                  <div className="text-xs font-black text-slate-900 dark:text-white">
                    D.CARD Bot
                  </div>
                  <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Online & Grounded
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    Zero Hallucination
                  </div>
                </div>
              </div>

              {/* Feature Indicators */}
              <div className="w-full pt-1 grid grid-cols-2 gap-1 text-[10px] font-semibold text-slate-600 dark:text-slate-300 text-left">
                <div className="flex items-center gap-1 truncate">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                  <span>Real bank data</span>
                </div>
                <div className="flex items-center gap-1 truncate">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                  <span>Compare cards</span>
                </div>
                <div className="flex items-center gap-1 truncate">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                  <span>Fees & benefits</span>
                </div>
                <div className="flex items-center gap-1 truncate">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                  <span>Match products</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ═══ CLEAN STRUCTURED PRODUCT RESULTS SECTION ═══ */}
        <AnimatePresence>
          {result && (
            <motion.div
              ref={resultsRef}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-800 space-y-6"
            >
              {/* ── RESULT HEADER (Small, clean, no explanation paragraph) ── */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black tracking-widest text-[#2563EB] dark:text-[#60A5FA] uppercase">
                      D.CARD AI RESULTS
                    </span>
                    <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
                    <span className="text-[11px] text-slate-400 font-medium">
                      Based on available D.CARD product data
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-tight">
                    {result.isComparison 
                      ? `Comparing ${totalProductCount} products for "${result.query}"`
                      : result.infoCard
                        ? `${result.infoCard.title}`
                        : `${totalProductCount} ${totalProductCount === 1 ? 'product matches' : 'products match'} your search`}
                  </h3>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setResult(null)}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300 transition-colors flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Clear Search</span>
                  </button>

                  <button
                    onClick={() => navigate('/ai-advisor')}
                    className="px-3.5 py-1.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
                  >
                    <span>Full Workspace</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* ── SIMPLE INFORMATION CARD (Only for conceptual queries e.g. "What is MAB?") ── */}
              {result.infoCard && (
                <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-900 shadow-sm flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950 text-[#2563EB] flex items-center justify-center shrink-0 mt-0.5">
                    <HelpCircle className="w-5 h-5" />
                  </div>
                  <div className="space-y-1 min-w-0">
                    <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
                      {result.infoCard.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                      {result.infoCard.definition}
                    </p>
                  </div>
                </div>
              )}

              {/* Category Filter Tabs (if multiple types exist) */}
              {totalProductCount > 0 && !result.isComparison && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  <button
                    onClick={() => setActiveTab('all')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                      activeTab === 'all'
                        ? 'bg-[#2563EB] text-white shadow-xs'
                        : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-blue-400'
                    }`}
                  >
                    All Products ({totalProductCount})
                  </button>

                  {result.matchedAccounts.length > 0 && (
                    <button
                      onClick={() => setActiveTab('savings')}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
                        activeTab === 'savings'
                          ? 'bg-[#2563EB] text-white shadow-xs'
                          : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-blue-400'
                      }`}
                    >
                      <Landmark className="w-3.5 h-3.5" />
                      Savings Accounts ({result.matchedAccounts.length})
                    </button>
                  )}

                  {result.matchedCards.length > 0 && (
                    <button
                      onClick={() => setActiveTab('cards')}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
                        activeTab === 'cards'
                          ? 'bg-[#2563EB] text-white shadow-xs'
                          : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-blue-400'
                      }`}
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      Debit Cards ({result.matchedCards.length})
                    </button>
                  )}

                  {result.matchedCurrentAccounts.length > 0 && (
                    <button
                      onClick={() => setActiveTab('current')}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
                        activeTab === 'current'
                          ? 'bg-[#2563EB] text-white shadow-xs'
                          : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-blue-400'
                      }`}
                    >
                      <Briefcase className="w-3.5 h-3.5" />
                      Current Accounts ({result.matchedCurrentAccounts.length})
                    </button>
                  )}

                  {(result.matchedLocations?.length || 0) > 0 && (
                    <button
                      onClick={() => setActiveTab('locations')}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
                        activeTab === 'locations'
                          ? 'bg-[#2563EB] text-white shadow-xs'
                          : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-blue-400'
                      }`}
                    >
                      <MapPin className="w-3.5 h-3.5" />
                      Verified Branches & ATMs ({result.matchedLocations.length})
                    </button>
                  )}
                </div>
              )}

              {/* ── REAL PRODUCT CARDS GRID ── */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

                {/* 1. SAVINGS ACCOUNT CARDS */}
                {(activeTab === 'all' || activeTab === 'savings') && result.matchedAccounts.map(acc => {
                  const officialUrl = acc.officialWebsite || acc.sourceUrl || '#';
                  const isZero = acc.isZeroBalance || acc.minimumBalanceValue === 0 || String(acc.minimumBalance || '').toLowerCase().includes('zero');
                  const minBalDisplay = isZero ? '₹0' : (acc.minimumBalance ? `₹${acc.minimumBalance}` : '₹0');
                  const isSaved = isWishlisted(acc.id);

                  return (
                    <div
                      key={`savings-${acc.id}`}
                      onClick={() => handleSavingsDetails(acc)}
                      className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-[#2563EB]/50 shadow-md hover:shadow-xl transition-all flex flex-col justify-between space-y-4 cursor-pointer group"
                    >
                      <div className="space-y-3.5">
                        {/* Top: Bank Logo + Save Heart */}
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2.5">
                            <BankLogo bankName={acc.bank} size="sm" />
                            <span className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wide">
                              {acc.bank}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); toggleWishlist(acc); }}
                            className={`p-1.5 rounded-lg border transition-colors ${
                              isSaved 
                                ? 'bg-rose-50 border-rose-200 text-rose-500' 
                                : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 hover:text-rose-500'
                            }`}
                            aria-label="Save to favorites"
                          >
                            <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
                          </button>
                        </div>

                        {/* Account Name & Type */}
                        <div>
                          <h4 className="text-base font-extrabold text-slate-900 dark:text-white leading-snug group-hover:text-[#2563EB] transition-colors">
                            {acc.accountName}
                          </h4>
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 dark:text-slate-400 mt-1">
                            🏦 {acc.accountType || 'Savings Account'}
                          </span>
                        </div>

                        {/* Core Banking Metrics */}
                        <div className="space-y-1.5 pt-1 text-xs border-t border-slate-100 dark:border-slate-800">
                          <div className="flex items-center justify-between py-1 border-b border-slate-50 dark:border-slate-800/60">
                            <span className="text-slate-500 dark:text-slate-400 font-medium">Minimum Balance</span>
                            <span className="font-extrabold text-slate-900 dark:text-white">
                              {minBalDisplay}
                            </span>
                          </div>
                          <div className="flex items-center justify-between py-1 border-b border-slate-50 dark:border-slate-800/60">
                            <span className="text-slate-500 dark:text-slate-400 font-medium">Interest Rate</span>
                            <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
                              {acc.interestRate || '2.70% – 4.00% p.a.'}
                            </span>
                          </div>
                          <div className="flex items-center justify-between py-1">
                            <span className="text-slate-500 dark:text-slate-400 font-medium">Online Opening</span>
                            <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                              ✓ Available
                            </span>
                          </div>
                        </div>

                        {/* Linked Debit Card Section */}
                        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-100 dark:border-slate-800 space-y-1">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
                            Linked Debit Card
                          </span>
                          <p className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight">
                            {acc.debitCardName || 'Classic / RuPay Debit Card'}
                          </p>
                          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
                            <span>Annual Fee:</span>
                            <span className="font-bold text-slate-700 dark:text-slate-300">
                              {acc.debitCardFee || '₹125 – ₹250 + GST'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons & Source Link */}
                      <div className="pt-2 space-y-2 border-t border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); handleSavingsDetails(acc); }}
                            className="flex-1 py-2 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-bold transition-all text-center shadow-xs"
                          >
                            View Details
                          </button>
                          <button
                            type="button"
                            onClick={(e) => handleSavingsCompare(e, acc)}
                            className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 transition-colors flex items-center gap-1"
                          >
                            <Scale className="w-3.5 h-3.5" />
                            <span>Compare</span>
                          </button>
                        </div>

                        <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                          <span>Verified: 05 Sep 2026</span>
                          {officialUrl !== '#' ? (
                            <a
                              href={officialUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="text-[#2563EB] dark:text-[#60A5FA] font-bold hover:underline flex items-center gap-1"
                            >
                              Official Source <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          ) : (
                            <span className="italic">Official Bank Source</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* 2. DEBIT CARD CARDS */}
                {(activeTab === 'all' || activeTab === 'cards') && result.matchedCards.map(card => {
                  const applyUrl = card.applyUrl || card.applyLink || card.officialWebsite || '#';
                  const isAlreadyCompared = (compareQueue || []).some(c => String(c.id) === String(card.id));
                  const isSaved = isWishlisted(card.id);

                  return (
                    <div
                      key={`card-${card.id}`}
                      onClick={() => handleCardClick(card)}
                      className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-[#2563EB]/50 shadow-md hover:shadow-xl transition-all flex flex-col justify-between space-y-4 cursor-pointer group"
                    >
                      <div className="space-y-3.5">
                        {/* Top: Bank Logo + Save Heart */}
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2.5">
                            <BankLogo bankName={card.bank} size="sm" />
                            <span className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wide">
                              {card.bank}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); toggleWishlist(card); }}
                            className={`p-1.5 rounded-lg border transition-colors ${
                              isSaved 
                                ? 'bg-rose-50 border-rose-200 text-rose-500' 
                                : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 hover:text-rose-500'
                            }`}
                            aria-label="Save to favorites"
                          >
                            <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
                          </button>
                        </div>

                        {/* Actual Debit Card Visual */}
                        <div className="w-full flex justify-center py-1">
                          <div className="w-48 sm:w-52 transform group-hover:scale-102 transition-transform duration-300">
                            <DebitCardVisual card={card} mode="grid" />
                          </div>
                        </div>

                        {/* Debit Card Name & Network */}
                        <div>
                          <h4 className="text-base font-extrabold text-slate-900 dark:text-white leading-snug group-hover:text-[#2563EB] transition-colors">
                            {card.cardName}
                          </h4>
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 dark:text-slate-400 mt-1">
                            💳 {card.network || 'Visa'} · {card.cardType || 'Debit Card'}
                          </span>
                        </div>

                        {/* Key Specs Matrix */}
                        <div className="space-y-1.5 pt-1 text-xs border-t border-slate-100 dark:border-slate-800">
                          <div className="flex items-center justify-between py-1 border-b border-slate-50 dark:border-slate-800/60">
                            <span className="text-slate-500 dark:text-slate-400 font-medium">Annual Fee</span>
                            <span className="font-extrabold text-slate-900 dark:text-white">
                              ₹{card.annualFee !== undefined ? card.annualFee : 0} + GST
                            </span>
                          </div>
                          <div className="flex items-center justify-between py-1 border-b border-slate-50 dark:border-slate-800/60">
                            <span className="text-slate-500 dark:text-slate-400 font-medium">ATM Limit</span>
                            <span className="font-extrabold text-slate-800 dark:text-slate-200">
                              ₹{card.dailyAtmLimit || card.limits?.atmLimit ? Number(card.dailyAtmLimit || card.limits?.atmLimit).toLocaleString('en-IN') : '50,000'} / day
                            </span>
                          </div>
                          <div className="flex items-center justify-between py-1 border-b border-slate-50 dark:border-slate-800/60">
                            <span className="text-slate-500 dark:text-slate-400 font-medium">Airport Lounge</span>
                            <span className="font-extrabold text-[#2563EB] dark:text-[#60A5FA] truncate max-w-[140px]" title={card.loungeAccess}>
                              {card.loungeAccess || 'Not available'}
                            </span>
                          </div>
                          <div className="flex items-center justify-between py-1">
                            <span className="text-slate-500 dark:text-slate-400 font-medium">Rewards</span>
                            <span className="font-medium text-slate-700 dark:text-slate-300 truncate max-w-[140px]">
                              {card.cashbackPct ? `${card.cashbackPct}% Cashback` : 'Standard Points'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons & Source Link */}
                      <div className="pt-2 space-y-2 border-t border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); handleCardClick(card); }}
                            className="flex-1 py-2 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-bold transition-all text-center shadow-xs"
                          >
                            View Details
                          </button>
                          <button
                            type="button"
                            onClick={(e) => handleCardCompare(e, card)}
                            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                              isAlreadyCompared
                                ? 'bg-emerald-500 text-white'
                                : 'border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200'
                            }`}
                          >
                            <Scale className="w-3.5 h-3.5" />
                            <span>{isAlreadyCompared ? 'Compared' : 'Compare'}</span>
                          </button>
                        </div>

                        <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                          <span>Verified: 05 Sep 2026</span>
                          {applyUrl !== '#' ? (
                            <a
                              href={applyUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="text-[#2563EB] dark:text-[#60A5FA] font-bold hover:underline flex items-center gap-1"
                            >
                              Official Source <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          ) : (
                            <span className="italic">Official Bank Source</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* 3. CURRENT ACCOUNT CARDS */}
                {(activeTab === 'all' || activeTab === 'current') && result.matchedCurrentAccounts.map(acc => {
                  const officialUrl = acc.officialWebsite || acc.sourceUrl || '#';
                  const isSaved = isWishlisted(acc.id);

                  return (
                    <div
                      key={`current-${acc.id}`}
                      onClick={() => handleCurrentDetails(acc)}
                      className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-purple-500/50 shadow-md hover:shadow-xl transition-all flex flex-col justify-between space-y-4 cursor-pointer group"
                    >
                      <div className="space-y-3.5">
                        {/* Top: Bank Logo + Save Heart */}
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2.5">
                            <BankLogo bankName={acc.bank} size="sm" />
                            <span className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wide">
                              {acc.bank}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); toggleWishlist(acc); }}
                            className={`p-1.5 rounded-lg border transition-colors ${
                              isSaved 
                                ? 'bg-rose-50 border-rose-200 text-rose-500' 
                                : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 hover:text-rose-500'
                            }`}
                            aria-label="Save to favorites"
                          >
                            <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
                          </button>
                        </div>

                        {/* Title & Type */}
                        <div>
                          <h4 className="text-base font-extrabold text-slate-900 dark:text-white leading-snug group-hover:text-purple-600 transition-colors">
                            {acc.accountName}
                          </h4>
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 dark:text-slate-400 mt-1">
                            🏢 Current Account
                          </span>
                        </div>

                        {/* Core Metrics */}
                        <div className="space-y-1.5 pt-1 text-xs border-t border-slate-100 dark:border-slate-800">
                          <div className="flex items-center justify-between py-1 border-b border-slate-50 dark:border-slate-800/60">
                            <span className="text-slate-500 dark:text-slate-400 font-medium">Monthly MAB</span>
                            <span className="font-extrabold text-slate-900 dark:text-white">
                              ₹{acc.mab || acc.minimumBalance || '25,000'}
                            </span>
                          </div>
                          <div className="flex items-center justify-between py-1 border-b border-slate-50 dark:border-slate-800/60">
                            <span className="text-slate-500 dark:text-slate-400 font-medium">Cash Deposit</span>
                            <span className="font-extrabold text-purple-600 dark:text-purple-400 truncate max-w-[140px]">
                              {acc.cashDepositLimit || 'Free up to ₹2L/mo'}
                            </span>
                          </div>
                          <div className="flex items-center justify-between py-1 border-b border-slate-50 dark:border-slate-800/60">
                            <span className="text-slate-500 dark:text-slate-400 font-medium">Free Cheques</span>
                            <span className="font-bold text-slate-700 dark:text-slate-300">
                              {acc.freeCheques || '50 leaves / mo'}
                            </span>
                          </div>
                          <div className="flex items-center justify-between py-1">
                            <span className="text-slate-500 dark:text-slate-400 font-medium">Linked Debit Card</span>
                            <span className="font-bold text-slate-700 dark:text-slate-300">
                              {acc.debitCardName || 'Business Debit Card'}
                            </span>
                          </div>
                        </div>

                        {/* Target Customer */}
                        <div className="text-[11px] text-slate-500 truncate">
                          <span className="text-slate-400 font-semibold">Target: </span>
                          <span>{acc.targetCustomer || acc.accountType || 'Traders & Businesses'}</span>
                        </div>
                      </div>

                      {/* Action Buttons & Source Link */}
                      <div className="pt-2 space-y-2 border-t border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); handleCurrentDetails(acc); }}
                            className="flex-1 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all text-center shadow-xs"
                          >
                            View Details
                          </button>
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); navigate('/compare-current'); }}
                            className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 transition-colors flex items-center gap-1"
                          >
                            <Scale className="w-3.5 h-3.5" />
                            <span>Compare</span>
                          </button>
                        </div>

                        <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                          <span>Verified: 05 Sep 2026</span>
                          {officialUrl !== '#' ? (
                            <a
                              href={officialUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="text-purple-600 dark:text-purple-400 font-bold hover:underline flex items-center gap-1"
                            >
                              Official Source <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          ) : (
                            <span className="italic">Official Bank Source</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* 4. VERIFIED BANK BRANCH / ATM CARDS */}
                {(activeTab === 'all' || activeTab === 'locations') && (result.matchedLocations || []).map(loc => {
                  return (
                    <div
                      key={`loc-${loc.id}`}
                      className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-400 shadow-md hover:shadow-xl transition-all flex flex-col justify-between space-y-4"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black uppercase tracking-wide text-slate-900 dark:text-white">
                            {loc.bank_name}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wide border ${
                            loc.branch_type === 'ATM' ? 'bg-amber-50 border-amber-200 text-amber-700' : 'bg-blue-50 border-blue-200 text-blue-700'
                          }`}>
                            {loc.branch_type || 'Branch'}
                          </span>
                        </div>
                        <h4 className="text-base font-extrabold text-slate-900 dark:text-white leading-snug">
                          {loc.branch_name || `${loc.bank_name} ${loc.branch_type || 'Branch'}`}
                        </h4>
                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                          {loc.address}, {loc.city}, {loc.state} - {loc.pincode}
                        </p>
                        {loc.distanceKm != null && (
                          <div className="text-xs font-bold text-blue-600 dark:text-blue-400">
                            📍 {loc.distanceKm} km away
                          </div>
                        )}
                        {loc.phone && (
                          <p className="text-[11px] text-slate-500">
                            📞 {loc.phone}
                          </p>
                        )}
                        {loc.opening_hours && (
                          <p className="text-[11px] text-slate-500">
                            🕒 {loc.opening_hours}
                          </p>
                        )}
                      </div>

                      <div className="pt-2 space-y-2 border-t border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => navigate(`/find-banks?bank=${encodeURIComponent(loc.bank_name || '')}&city=${encodeURIComponent(loc.city || '')}&highlight=${loc.id}`)}
                            className="flex-1 py-2 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-bold transition-all text-center shadow-xs"
                          >
                            View on Map
                          </button>
                          {loc.directionsUrl && (
                            <a
                              href={loc.directionsUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all"
                            >
                              Directions ↗
                            </a>
                          )}
                        </div>

                        <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                          <span>Verified: {loc.verified_on || '2026-09'}</span>
                          {loc.source_url && (
                            <a
                              href={loc.source_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#2563EB] font-bold hover:underline flex items-center gap-1"
                            >
                              Official Source <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Empty results guard */}
              {totalProductCount === 0 && !result.infoCard && (
                <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-2">
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                    No products matched your exact search query.
                  </p>
                  <p className="text-xs text-slate-500">
                    Try searching with terms like "Canara Bank", "Zero balance", "Lounge access", or "SBI".
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
