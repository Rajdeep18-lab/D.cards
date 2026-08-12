import { useEffect, useMemo, useState, useCallback, lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ErrorBoundary from "./components/ErrorBoundary";
import Navbar from "./components/Navbar";
import ComparisonDock from "./components/ComparisonDock";
import LoadingSkeleton from "./components/LoadingSkeleton";
import Footer from "./components/Footer";
import AuthModal from "./components/AuthModal";
import WebsiteDisclaimerModal from "./components/WebsiteDisclaimerModal";

// Pages
import HomePage from "./pages/HomePage";
import CardsPage from "./pages/CardsPage";
import ComparePage from "./pages/ComparePage";
import AIAdvisorPage from "./pages/AIAdvisorPage";
import SavedCardsPage from "./pages/SavedCardsPage";
import BanksPage from "./pages/BanksPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import FoundersPage from "./pages/FoundersPage";
import SavingsAccountsPage from "./pages/SavingsAccountsPage";
import SavingsAccountsComparePage from "./pages/SavingsAccountsComparePage";
import SavingsAccountDetailPage from "./pages/SavingsAccountDetailPage";

import { normalizeCard, deduplicateCards, parseAnnualFeeVal, parseCashbackVal, safeLower, safeIncludes, safeStr, safeMap } from "./utils/compareUtils";

// Lazy Loaded Heavy Components & Modals for Code Splitting
const UserProfilePage = lazy(() => import("./components/UserProfilePage"));
const LegalModal = lazy(() => import("./components/LegalModal"));
const AIChatAssistant = lazy(() => import("./components/AIChatAssistant"));
const AdminDashboardModal = lazy(() => import("./components/AdminDashboardModal"));
const AdminLoginPage = lazy(() => import("./components/AdminLoginPage"));
const CardDetailsModal = lazy(() => import("./components/CardDetailsModal"));
const FirstLoginModal = lazy(() => import("./components/FirstLoginModal"));
const AccessDeniedModal = lazy(() => import("./components/AccessDeniedModal"));

import { cardService } from "./services/cardService";
import { ToastProvider, useToast } from "./context/ToastContext";
import { WishlistProvider, useWishlist } from "./context/WishlistContext";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./hooks/useAuth";
import { bankCards, debitCards } from "./data/mockData";

/* Dynamic limit extractor from card features */
function getCardLimits(card) {
  if (!card) return { atmLimit: 50000, posLimit: 100000 };
  let atmLimit = 50000;
  let posLimit = card.maxLimit || 100000;

  if (Array.isArray(card.features)) {
    card.features.forEach(feat => {
      const lower = String(feat || '').toLowerCase();
      if (lower.includes("atm limit")) {
        const match = lower.match(/₹([\d,]+)/);
        if (match) {
          atmLimit = parseInt(match[1].replace(/,/g, ''), 10) || atmLimit;
        } else if (lower.includes("high premium") || lower.includes("high tier") || lower.includes("high elite") || lower.includes("high select") || lower.includes("high royale") || lower.includes("wealth") || lower.includes("private")) {
          atmLimit = 150000;
        } else if (lower.includes("standard plus") || lower.includes("high standard")) {
          atmLimit = 100000;
        } else if (lower.includes("standard") || lower.includes("configurable") || lower.includes("flexible")) {
          atmLimit = 50000;
        } else if (lower.includes("basic")) {
          atmLimit = 25000;
        }
      }
      if (lower.includes("pos limit")) {
        const match = lower.match(/₹([\d,]+)/);
        if (match) {
          posLimit = parseInt(match[1].replace(/,/g, ''), 10) || posLimit;
        } else if (lower.includes("high premium") || lower.includes("high tier") || lower.includes("high elite") || lower.includes("high select") || lower.includes("high royale") || lower.includes("wealth") || lower.includes("private")) {
          posLimit = 500000;
        } else if (lower.includes("standard plus") || lower.includes("high standard")) {
          posLimit = 300000;
        } else if (lower.includes("standard") || lower.includes("configurable") || lower.includes("flexible")) {
          posLimit = 200000;
        } else if (lower.includes("basic")) {
          posLimit = 50000;
        }
      }
    });
  }

  const cardNameLower = String(card.cardName || '').toLowerCase();
  if (cardNameLower.includes("wealth")) {
    atmLimit = Math.max(atmLimit, 700000);
    posLimit = Math.max(posLimit, 1200000);
  }
  if (cardNameLower.includes("private")) {
    atmLimit = Math.max(atmLimit, 1000000);
    posLimit = Math.max(posLimit, 1500000);
  }

  if (card.maxLimit && posLimit < card.maxLimit) {
    posLimit = card.maxLimit;
  }

  return { atmLimit, posLimit };
}

/* Proprietary Bank Profiles for Startup trust layer */
const BANK_PROFILES = {
  "HDFC Bank": {
    overview: "HDFC Bank is India's leading private sector bank, renowned for its extensive domestic branch network and premium customer service ecosystems.",
    trustScore: "9.8/10",
    topCards: ["EasyShop Platinum Debit Card"],
    pros: ["Highest network acceptance", "Strong lifestyle reward structures", "Excellent mobile app integration"],
    cons: ["Higher average balance requirement", "Strict lounge spend eligibility criteria"],
    bestFor: "Premium users, salary account holders, high volume spenders",
    segment: "Premium & Professional"
  },
  "ICICI Bank": {
    overview: "ICICI Bank is a premier private sector bank in India, known for its technologically advanced digital platforms and massive merchant networks.",
    trustScore: "9.6/10",
    topCards: ["Coral Debit Card", "Sapphiro Debit Card"],
    pros: ["Extensive online shopping discounts", "Best-in-class movie rewards (BOGO deals)", "Zero-maintenance virtual cards support"],
    cons: ["Slightly high card reissuance fees", "Confusing reward tiers structure"],
    bestFor: "Millennials, online shoppers, lifestyle enthusiasts",
    segment: "Retail & Digital Native"
  },
  "SBI": {
    overview: "State Bank of India is the country's largest public sector bank, boasting an unmatched rural-urban footprint and absolute capital security.",
    trustScore: "9.5/10",
    topCards: ["Global International Debit Card", "Platinum International Debit Card"],
    pros: ["Lowest annual maintenance charges", "Widest ATM network footprint in India", "Beginner and student-friendly account linkage"],
    cons: ["Basic reward rates", "Slower customer support channels"],
    bestFor: "Mass market banking, students, senior citizens",
    segment: "Students & Mass Audience"
  },
  "Axis Bank": {
    overview: "Axis Bank is a high-growth private sector bank in India, particularly celebrated for its elite relationship programs (Burgundy & Priority Banking).",
    trustScore: "9.7/10",
    topCards: ["Burgundy Debit Card", "Priority Debit Card"],
    pros: ["Ultra-high transaction limits on top tiers", "Premium concierge and lifestyle support", "Zero forex markup on elite cards"],
    cons: ["Extremely high balance relationships required for waivers", "Paid cards have high joining fee"],
    bestFor: "HNI customers, luxury travelers, high spending professionals",
    segment: "Elite Premium & Wealth"
  }
};

const DEBIT_CARDS_WITH_LIMITS = (debitCards || []).map(c => ({
  ...c,
  limits: getCardLimits(c)
}));

const STATIC_RANKINGS = (() => {
  const list = Array.isArray(debitCards) ? [...debitCards] : [];
  const studentRanked = [...list].sort((a, b) => (b.studentFriendly ? 1 : 0) - (a.studentFriendly ? 1 : 0) || (a.minBalance || 0) - (b.minBalance || 0) || (b.rating || 0) - (a.rating || 0));
  const womenRanked = [...list].sort((a, b) => (b.womenSpecial ? 1 : 0) - (a.womenSpecial ? 1 : 0) || (b.rating || 0) - (a.rating || 0));
  const seniorRanked = [...list].sort((a, b) => (b.seniorCitizen ? 1 : 0) - (a.seniorCitizen ? 1 : 0) || (b.interestRate || 0) - (a.interestRate || 0) || (b.rating || 0) - (a.rating || 0));
  const travelRanked = [...list].sort((a, b) => (b.travelZeroForex ? 1 : 0) - (a.travelZeroForex ? 1 : 0) || (b.loungeAccess && !String(b.loungeAccess || '').toLowerCase().startsWith('no') ? 1 : 0) - (a.loungeAccess && !String(a.loungeAccess || '').toLowerCase().startsWith('no') ? 1 : 0) || (b.rating || 0) - (a.rating || 0));
  const healthcareRanked = [...list].sort((a, b) => (b.healthcareFriendly ? 1 : 0) - (a.healthcareFriendly ? 1 : 0) || (b.rating || 0) - (a.rating || 0));
  const cashbackRanked = [...list].sort((a, b) => (b.cashbackPct || 0) - (a.cashbackPct || 0) || (b.rating || 0) - (a.rating || 0));

  return {
    student: studentRanked.slice(0, 3).map(c => c.id),
    women: womenRanked.slice(0, 3).map(c => c.id),
    senior: seniorRanked.slice(0, 3).map(c => c.id),
    travel: travelRanked.slice(0, 3).map(c => c.id),
    healthcare: healthcareRanked.slice(0, 3).map(c => c.id),
    cashback: cashbackRanked.slice(0, 3).map(c => c.id),
  };
})();

const STATIC_AI_PILL_COUNTS = {
  "Best for Students": (debitCards || []).filter(c => c?.studentFriendly).length,
  "Best for Women": (debitCards || []).filter(c => c?.womenSpecial).length,
  "Best for Seniors": (debitCards || []).filter(c => c?.seniorCitizen).length,
  "Lowest Fee": (debitCards || []).filter(c => (typeof c?.annualFee === 'number' ? c.annualFee : parseFloat(String(c?.annualFee || '').replace(/[^0-9.]/g, '')) || 0) <= 250).length,
  "Highest Cashback": (debitCards || []).filter(c => (c?.cashbackPct || 0) >= 1.5).length,
  "Zero Balance": (debitCards || []).filter(c => (c?.minBalance || 0) === 0).length,
  "Premium Benefits": (debitCards || []).filter(c => String(c?.category || '').toLowerCase() === 'premium' || (typeof c?.annualFee === 'number' ? c.annualFee >= 1000 : parseFloat(String(c?.annualFee || '').replace(/[^0-9.]/g, '')) >= 1000)).length,
  "Travel Friendly": (debitCards || []).filter(c => c?.travelZeroForex || (c?.loungeAccess && !String(c.loungeAccess || '').toLowerCase().startsWith('no'))).length,
  "Healthcare Friendly": (debitCards || []).filter(c => c?.healthcareFriendly).length,
  "Most Popular": (debitCards || []).filter(c => c?.isPopular).length,
  "Editor's Choice": (debitCards || []).filter(c => (c?.rating || 0) >= 4.5 && c?.verificationStatus === 'Verified').length,
};

const TOTAL_CARDS_COUNT = DEBIT_CARDS_WITH_LIMITS.length;
const VERIFIED_CARDS_COUNT = DEBIT_CARDS_WITH_LIMITS.filter(c => c?.verificationStatus === "Verified").length;
const PENDING_VERIFY_COUNT = DEBIT_CARDS_WITH_LIMITS.filter(c => c?.verificationStatus === "Needs Verification").length;
const RECENTLY_UPDATED_COUNT = DEBIT_CARDS_WITH_LIMITS.filter(c => c?.verificationStatus === "Recently Updated").length;

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function AppContent() {
  const toast = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const { toggleWishlist } = useWishlist();
  const {
    user,
    profile,
    loading: authLoading,
    isAuthModalOpen,
    setIsAuthModalOpen,
    openAuthModal,
    isEmailVerified,
    isFirstLogin,
    redirectTarget,
    setRedirectTarget
  } = useAuth();

  const [profileActiveTab, setProfileActiveTab] = useState("profile");
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);

  const [query, setQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState([]);
  const [sortBy, setSortBy] = useState("most-popular");
  const [feeRange, setFeeRange] = useState(2000);
  const [balanceRange, setBalanceRange] = useState(500000);
  const [minRating, setMinRating] = useState(0);
  const [minCashback, setMinCashback] = useState(0);
  const [atmRange, setAtmRange] = useState([0, 1000000]);
  const [posRange, setPosRange] = useState([0, 1500000]);
  const [selectedBanks, setSelectedBanks] = useState([]);
  const [selectedNetworks, setSelectedNetworks] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedUserTypes, setSelectedUserTypes] = useState([]);
  const [selectedBankTypes, setSelectedBankTypes] = useState([]);
  const [selectedFeeTier, setSelectedFeeTier] = useState(null);
  const [selectedAtmLimitTier, setSelectedAtmLimitTier] = useState(null);
  const [selectedPosLimitTier, setSelectedPosLimitTier] = useState(null);
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const [userProfile, setUserProfile] = useState("Working Professional");
  const [isLoading, setIsLoading] = useState(true);

  const [isDarkMode, setIsDarkMode] = useState(() => {
    try {
      const saved = localStorage.getItem('isDarkMode');
      if (saved !== null) return JSON.parse(saved);
    } catch (e) {
      console.warn("localStorage loading failed: ", e);
    }
    try {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch (e) {
      return false;
    }
  });

  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isAccessDeniedOpen, setIsAccessDeniedOpen] = useState(false);
  const [isLegalOpen, setIsLegalOpen] = useState(false);
  const [legalTab, setLegalTab] = useState("privacy");
  const [compareQueue, setCompareQueue] = useState([]);
  const [savingsCompareQueue, setSavingsCompareQueue] = useState([]);
  const [compareDockHeight, setCompareDockHeight] = useState(0);
  const [selectedCard, setSelectedCard] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const [rawLiveCards, setRawLiveCards] = useState(debitCards);

  const fetchLiveCards = useCallback(async () => {
    try {
      const fetched = await cardService.getDebitCards();
      if (fetched && fetched.length > 0) {
        setRawLiveCards(fetched);
      }
    } catch (e) {
      console.warn("Live card fetch error:", e);
    }
  }, []);

  useEffect(() => {
    fetchLiveCards();
    const handleImportEvent = () => {
      fetchLiveCards();
    };
    window.addEventListener('dcard_data_imported', handleImportEvent);
    return () => window.removeEventListener('dcard_data_imported', handleImportEvent);
  }, [fetchLiveCards]);

  const activeCardsList = useMemo(() => {
    return safeMap(rawLiveCards, c => {
      const norm = normalizeCard(c);
      const limits = getCardLimits(norm);
      return {
        ...norm,
        atmLimit: norm.atmLimit || limits.atmLimit,
        posLimit: norm.posLimit || limits.posLimit
      };
    });
  }, [rawLiveCards]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // First login popup trigger
  useEffect(() => {
    if (user && isEmailVerified && isFirstLogin) {
      setShowWelcomeModal(true);
    }
  }, [user, isEmailVerified, isFirstLogin]);

  const toggleDarkMode = useCallback(() => {
    setIsDarkMode(prev => {
      const next = !prev;
      localStorage.setItem('isDarkMode', JSON.stringify(next));
      return next;
    });
  }, []);

  // Post-Login Intent Routing Handler
  const handleAuthSuccessResume = useCallback(async () => {
    if (!user) return;

    if (redirectTarget) {
      if (redirectTarget.startsWith('profile-')) {
        const tab = redirectTarget.replace('profile-', '');
        navigate('/profile');
        setProfileActiveTab(tab);
      } else if (redirectTarget === 'profile' || redirectTarget === 'saved') {
        navigate(redirectTarget === 'saved' ? '/favorites' : '/profile');
        setProfileActiveTab('profile');
      } else if (redirectTarget.startsWith('apply-')) {
        const cardId = parseInt(redirectTarget.replace('apply-', ''), 10);
        const card = debitCards.find(c => c.id === cardId);
        if (card && card.applyUrl) {
          window.open(card.applyUrl, '_blank', 'noopener,noreferrer');
        }
      } else if (redirectTarget.startsWith('save-card-')) {
        const cardId = parseInt(redirectTarget.replace('save-card-', ''), 10);
        const card = debitCards.find(c => c.id === cardId);
        if (card && toggleWishlist) {
          toggleWishlist(card);
        }
      }
      setRedirectTarget(null);
    } else {
      navigate('/profile');
      setProfileActiveTab('profile');
    }
  }, [user, redirectTarget, setRedirectTarget, toggleWishlist, navigate]);

  const handleSelectCardFromItem = useCallback((item) => {
    const fullCard = debitCards.find(c => c.id === item.id);
    if (fullCard) setSelectedCard(fullCard);
  }, []);

  const toggleFilter = useCallback((filter) => {
    setActiveFilters((previous) =>
      previous.includes(filter) ? previous.filter((item) => item !== filter) : [...previous, filter]
    );
  }, []);

  const clearFilters = useCallback(() => {
    setActiveFilters([]);
    setSelectedUserTypes([]);
    setSelectedBankTypes([]);
    setSelectedFeeTier(null);
    setSelectedAtmLimitTier(null);
    setSelectedPosLimitTier(null);
    setSelectedFeatures([]);
  }, []);

  const toggleBank = useCallback((bank) => {
    setSelectedBanks(prev =>
      prev.includes(bank) ? prev.filter(b => b !== bank) : [...prev, bank]
    );
  }, []);

  const selectSingleBank = useCallback((bank) => {
    setSelectedBanks([bank]);
  }, []);

  const toggleNetwork = useCallback((network) => {
    setSelectedNetworks(prev =>
      prev.includes(network) ? prev.filter(n => n !== network) : [...prev, network]
    );
  }, []);

  const toggleCategory = useCallback((category) => {
    setSelectedCategories(prev =>
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    );
  }, []);

  const toggleUserType = useCallback((userType) => {
    setSelectedUserTypes(prev =>
      prev.includes(userType) ? prev.filter(t => t !== userType) : [...prev, userType]
    );
  }, []);

  const toggleBankType = useCallback((bankType) => {
    setSelectedBankTypes(prev =>
      prev.includes(bankType) ? prev.filter(b => b !== bankType) : [...prev, bankType]
    );
  }, []);

  const toggleFeature = useCallback((feat) => {
    setSelectedFeatures(prev =>
      prev.includes(feat) ? prev.filter(f => f !== feat) : [...prev, feat]
    );
  }, []);

  const handleResetFilters = useCallback(() => {
    setQuery("");
    setActiveFilters([]);
    setFeeRange(2000);
    setBalanceRange(500000);
    setAtmRange([0, 1000000]);
    setPosRange([0, 1500000]);
    setMinRating(0);
    setMinCashback(0);
    setSelectedBanks([]);
    setSelectedNetworks([]);
    setSelectedCategories([]);
    setSelectedUserTypes([]);
    setSelectedBankTypes([]);
    setSelectedFeeTier(null);
    setSelectedAtmLimitTier(null);
    setSelectedPosLimitTier(null);
    setSelectedFeatures([]);
    setSortBy("most-popular");
    setUserProfile("Working Professional");
    toast("Filters reset to default configurations", "info");
  }, [toast]);

  const handleApplyProfilePreset = useCallback((profilePreset) => {
    setUserProfile(profilePreset);
    if (profilePreset === "Student") {
      setAtmRange([0, 50000]);
      setPosRange([0, 100000]);
      setFeeRange(250);
      setBalanceRange(10000);
      setMinRating(0);
      setMinCashback(0);
      setActiveFilters(["Student Friendly"]);
      toast("D.Card Engine: Applied Student profile boundaries!", "success");
    } else if (profilePreset === "Working Professional") {
      setAtmRange([50000, 300000]);
      setPosRange([200000, 500000]);
      setFeeRange(1000);
      setBalanceRange(50000);
      setMinRating(4.0);
      setMinCashback(0.5);
      setActiveFilters(["Rewards Program"]);
      toast("D.Card Engine: Applied Working Professional boundaries!", "success");
    } else if (profilePreset === "Traveler") {
      setAtmRange([100000, 500000]);
      setPosRange([300000, 800000]);
      setFeeRange(2000);
      setBalanceRange(100000);
      setMinRating(4.2);
      setMinCashback(1.0);
      setActiveFilters(["Lounge Access", "Zero Forex", "International Usage"]);
      toast("D.Card Engine: Applied Traveler profile boundaries!", "success");
    } else if (profilePreset === "Senior Citizen") {
      setAtmRange([0, 100000]);
      setPosRange([0, 200000]);
      setFeeRange(300);
      setBalanceRange(10000);
      setMinRating(4.0);
      setMinCashback(0);
      setActiveFilters(["Senior Citizen"]);
      toast("D.Card Engine: Applied Senior Citizen boundaries!", "success");
    } else if (profilePreset === "Women") {
      setAtmRange([0, 150000]);
      setPosRange([0, 300000]);
      setFeeRange(1000);
      setBalanceRange(25000);
      setMinRating(4.0);
      setMinCashback(0.5);
      setActiveFilters(["Women Special"]);
      toast("D.Card Engine: Applied Women profile boundaries!", "success");
    } else if (profilePreset === "Premium User") {
      setAtmRange([200000, 1000000]);
      setPosRange([500000, 1500000]);
      setFeeRange(2000);
      setBalanceRange(500000);
      setMinRating(4.5);
      setMinCashback(1.5);
      setActiveFilters(["Premium Banking", "Lounge Access"]);
      toast("D.Card Engine: Applied Elite Premium boundaries!", "success");
    }
  }, [toast]);

  const handleLoadPreset = useCallback((preset) => {
    setActiveFilters(preset.activeFilters || []);
    setSelectedBanks(preset.selectedBanks || []);
    setSelectedNetworks(preset.selectedNetworks || []);
    setSelectedCategories(preset.selectedCategories || []);
    setFeeRange(preset.feeRange ?? 2000);
    setBalanceRange(preset.balanceRange ?? 500000);
    setAtmRange(preset.atmRange || [0, 1000000]);
    setPosRange(preset.posRange || [0, 1500000]);
    setMinRating(preset.minRating ?? 0);
    setMinCashback(preset.minCashback ?? 0);
    toast(`Preset settings loaded successfully!`, "success");
  }, [toast]);

  const toggleCompareQueue = useCallback((rawCard) => {
    if (!rawCard) return;
    const card = normalizeCard(rawCard);
    setCompareQueue(prev => {
      const exists = prev.some(c => String(c.id) === String(card.id) || (c.bank.toLowerCase().trim() === card.bank.toLowerCase().trim() && c.cardName.toLowerCase().trim() === card.cardName.toLowerCase().trim()));
      if (exists) {
        return prev.filter(c => String(c.id) !== String(card.id) && !(c.bank.toLowerCase().trim() === card.bank.toLowerCase().trim() && c.cardName.toLowerCase().trim() === card.cardName.toLowerCase().trim()));
      }
      if (prev.length >= 3) {
        toast("You can compare up to 3 cards at a time", "warning");
        return prev;
      }
      return deduplicateCards([...prev, card]);
    });
  }, [toast]);

  const totalActiveFiltersCount = useMemo(() => {
    return activeFilters.length +
      selectedUserTypes.length +
      selectedBankTypes.length +
      selectedFeatures.length +
      selectedBanks.length +
      selectedNetworks.length +
      selectedCategories.length +
      (selectedFeeTier ? 1 : 0) +
      (selectedAtmLimitTier ? 1 : 0) +
      (selectedPosLimitTier ? 1 : 0) +
      (feeRange < 2000 ? 1 : 0) +
      (balanceRange < 500000 ? 1 : 0) +
      (minRating > 0 ? 1 : 0) +
      (minCashback > 0 ? 1 : 0) +
      (atmRange[0] > 0 || atmRange[1] < 1000000 ? 1 : 0) +
      (posRange[0] > 0 || posRange[1] < 1500000 ? 1 : 0);
  }, [
    activeFilters, selectedUserTypes, selectedBankTypes, selectedFeatures,
    selectedBanks, selectedNetworks, selectedCategories, selectedFeeTier,
    selectedAtmLimitTier, selectedPosLimitTier, feeRange, balanceRange,
    minRating, minCashback, atmRange, posRange
  ]);

  const filteredCards = useMemo(() => {
    let cards = safeMap(activeCardsList, c => normalizeCard(c));

    const q = safeLower(query).trim();
    if (q) {
      const terms = q.split(/\s+/).filter(Boolean);
      cards = cards.filter((card) => {
        const bank = safeLower(card.bank);
        const cardName = safeLower(card.cardName);
        const benefits = safeLower(card.benefits);
        const bestForStr = Array.isArray(card.bestFor) ? card.bestFor.map(safeLower).join(' ') : safeLower(card.bestFor);
        const network = safeLower(card.network);
        const category = safeLower(card.category);
        const featuresStr = Array.isArray(card.features) ? card.features.map(safeLower).join(' ') : safeLower(card.features);
        const elig = safeLower(card.eligibility);

        return terms.every(term => {
          const matchBank = bank.includes(term);
          const matchCardName = cardName.includes(term);
          const matchBenefits = benefits.includes(term);
          const matchBestFor = bestForStr.includes(term);
          const matchNetwork = network.includes(term);
          const matchCategory = category.includes(term);
          const matchFeatures = featuresStr.includes(term);
          const matchElig = elig.includes(term);

          let matchUserType = false;
          if (term.includes("student")) matchUserType = card.studentFriendly === true || bestForStr.includes("student");
          if (term.includes("women") || term.includes("woman")) matchUserType = card.womenSpecial === true || bestForStr.includes("women");
          if (term.includes("senior")) matchUserType = card.seniorCitizen === true || bestForStr.includes("senior");

          return matchBank || matchCardName || matchBenefits || matchBestFor || matchNetwork || matchCategory || matchFeatures || matchElig || matchUserType;
        });
      });
    }

    if (Array.isArray(selectedUserTypes) && selectedUserTypes.length > 0) {
      cards = cards.filter(card => {
        const bestForStr = Array.isArray(card.bestFor) ? card.bestFor.map(safeLower).join(' ') : safeLower(card.bestFor);
        const category = safeLower(card.category);
        const elig = safeLower(card.eligibility);
        const name = safeLower(card.cardName);
        const fee = parseAnnualFeeVal(card.annualFee);
        const minBal = card.minimumBalance;

        return selectedUserTypes.some(ut => {
          if (ut === "Student") return card.studentFriendly === true || bestForStr.includes("student") || category.includes("student");
          if (ut === "Women") return card.womenSpecial === true || bestForStr.includes("women") || bestForStr.includes("woman");
          if (ut === "Senior Citizen") return card.seniorCitizen === true || bestForStr.includes("senior") || bestForStr.includes("pension");
          if (ut === "Salaried") return bestForStr.includes("salaried") || elig.includes("salary") || fee > 0;
          if (ut === "Business Owner") return bestForStr.includes("business") || category.includes("premium") || name.includes("business") || (card.posLimit || 0) >= 200000;
          if (ut === "Freelancer") return bestForStr.includes("freelance") || category.includes("digital") || card.contactless || minBal === 0;
          if (ut === "NRI") return elig.includes("nri") || card.internationalUsage === true;
          if (ut === "Minor Account") return name.includes("minor") || name.includes("junior") || card.studentFriendly === true;
          if (ut === "Premium Customer") return category.includes("premium") || category.includes("wealth") || category.includes("private") || fee >= 1000 || minBal >= 25000;
          return true;
        });
      });
    }

    if (Array.isArray(selectedNetworks) && selectedNetworks.length > 0) {
      cards = cards.filter(card => {
        return selectedNetworks.some(net => safeIncludes(card.network, net));
      });
    }

    if (Array.isArray(selectedCategories) && selectedCategories.length > 0) {
      cards = cards.filter(card => {
        const name = safeLower(card.cardName);
        const cat = safeLower(card.category);
        const net = safeLower(card.network);

        return selectedCategories.some(c => {
          const cl = safeLower(c);
          if (cl === "classic") return name.includes("classic") || cat.includes("classic") || cat.includes("savings");
          if (cl === "silver") return name.includes("silver") || cat.includes("silver");
          if (cl === "gold") return name.includes("gold") || cat.includes("gold");
          if (cl === "platinum") return name.includes("platinum") || cat.includes("platinum");
          if (cl === "signature") return name.includes("signature") || net.includes("signature") || cat.includes("signature");
          if (cl === "infinite") return name.includes("infinite") || net.includes("infinite") || cat.includes("infinite");
          return cat.includes(cl) || name.includes(cl);
        });
      });
    }

    if (selectedFeeTier) {
      cards = cards.filter(card => {
        const fee = parseAnnualFeeVal(card.annualFee);
        if (selectedFeeTier === "free") return fee === 0;
        if (selectedFeeTier === "under-250") return fee > 0 && fee <= 250;
        if (selectedFeeTier === "250-500") return fee >= 250 && fee <= 500;
        if (selectedFeeTier === "500-1000") return fee >= 500 && fee <= 1000;
        if (selectedFeeTier === "above-1000") return fee > 1000;
        return true;
      });
    }

    if (selectedAtmLimitTier) {
      cards = cards.filter(card => {
        const limit = card.atmLimit || 50000;
        if (selectedAtmLimitTier === "25k") return limit >= 25000;
        if (selectedAtmLimitTier === "50k") return limit >= 50000;
        if (selectedAtmLimitTier === "100k") return limit >= 100000;
        if (selectedAtmLimitTier === "200k") return limit >= 200000;
        return true;
      });
    }

    if (selectedPosLimitTier) {
      cards = cards.filter(card => {
        const limit = card.posLimit || 100000;
        if (selectedPosLimitTier === "50k") return limit >= 50000;
        if (selectedPosLimitTier === "100k") return limit >= 100000;
        if (selectedPosLimitTier === "200k") return limit >= 200000;
        if (selectedPosLimitTier === "500k") return limit >= 500000;
        return true;
      });
    }

    if (Array.isArray(selectedFeatures) && selectedFeatures.length > 0) {
      cards = cards.filter(card => {
        const lounge = safeLower(card.loungeAccess);
        const benefits = safeLower(card.benefits);
        const featList = (Array.isArray(card.features) ? card.features : []).map(safeLower);

        return selectedFeatures.every(f => {
          if (f === "Contactless") return Boolean(card.contactless) || featList.some(x => x.includes("contactless") || x.includes("paywave") || x.includes("tap"));
          if (f === "NFC") return Boolean(card.contactless) || featList.some(x => x.includes("nfc") || x.includes("contactless"));
          if (f === "Virtual Card") return safeLower(card.category) === "digital" || featList.some(x => x.includes("virtual")) || safeLower(card.cardName).includes("digital");
          if (f === "International Usage") return card.internationalUsage === true || safeLower(card.forexMarkup).includes("0%");
          if (f === "Domestic Only") return card.internationalUsage === false;
          if (f === "Lounge Access") return Boolean(lounge) && !lounge.startsWith("no") && !lounge.includes("not available");
          if (f === "Cashback") return parseCashbackVal(card.cashback) > 0 || benefits.includes("cashback");
          if (f === "Reward Points") return safeStr(card.rewards).length > 0 && !safeLower(card.rewards).includes("not available") || benefits.includes("reward");
          if (f === "Fuel Benefits") return benefits.includes("fuel") || featList.some(x => x.includes("fuel"));
          if (f === "Dining Benefits") return benefits.includes("dining") || featList.some(x => x.includes("dining") || x.includes("food"));
          if (f === "Shopping Benefits") return benefits.includes("shopping") || safeLower(card.bestFor).includes("shopping");
          if (f === "Entertainment Benefits") return benefits.includes("movie") || benefits.includes("bogo") || featList.some(x => x.includes("movie") || x.includes("bogo"));
          if (f === "Insurance Coverage") return benefits.includes("insurance") || featList.some(x => x.includes("insurance"));
          if (f === "EMI Support") return safeStr(card.emi).length > 0 && !safeLower(card.emi).includes("not available") || benefits.includes("emi");
          return true;
        });
      });
    }

    if (Array.isArray(selectedBankTypes) && selectedBankTypes.length > 0) {
      cards = cards.filter(card => {
        const bankName = safeLower(card.bank);
        return selectedBankTypes.some(bt => {
          if (bt === "Government Banks") return bankName.includes("sbi") || bankName.includes("state bank") || bankName.includes("baroda") || bankName.includes("punjab") || bankName.includes("canara") || bankName.includes("union bank") || bankName.includes("indian bank") || bankName.includes("central bank") || bankName.includes("bank of india");
          if (bt === "Private Banks") return bankName.includes("hdfc") || bankName.includes("icici") || bankName.includes("axis") || bankName.includes("kotak") || bankName.includes("indusind") || bankName.includes("yes bank") || bankName.includes("idfc") || bankName.includes("federal") || bankName.includes("rbl") || bankName.includes("south indian");
          if (bt === "Small Finance Banks") return bankName.includes("au small") || bankName.includes("equitas") || bankName.includes("ujjivan") || bankName.includes("suryoday") || bankName.includes("small finance") || bankName.includes("jana");
          if (bt === "Payments Banks") return bankName.includes("paytm") || bankName.includes("airtel") || bankName.includes("post") || bankName.includes("nsdl") || bankName.includes("payments") || bankName.includes("fi money");
          return true;
        });
      });
    }

    if (Array.isArray(activeFilters) && activeFilters.length > 0) {
      cards = cards.filter((card) => {
        return activeFilters.every(f => {
          const category = safeLower(card.category);
          const lounge = safeLower(card.loungeAccess);

          if (f === "Best for Students" || f === "Student Friendly") return card.studentFriendly === true;
          if (f === "Best for Women" || f === "Women Special") return card.womenSpecial === true;
          if (f === "Best for Seniors" || f === "Senior Citizen") return card.seniorCitizen === true;
          if (f === "Lowest Fee") return parseAnnualFeeVal(card.annualFee) <= 250;
          if (f === "Highest Cashback") return parseCashbackVal(card.cashback) >= 1.5;
          if (f === "Zero Balance") return card.minimumBalance === 0;
          if (f === "Premium Benefits" || f === "Premium Banking") return category.includes('premium') || parseAnnualFeeVal(card.annualFee) >= 1000;
          if (f === "Travel Friendly" || f === "Best Travel Cards" || f === "Zero Forex") return safeLower(card.forexMarkup).includes('0%') || (Boolean(lounge) && !lounge.startsWith('no'));
          if (f === "Lounge Access") return Boolean(lounge) && !lounge.startsWith('no') && !lounge.includes('not available');
          if (f === "International Usage") return card.internationalUsage === true;
          if (f === "Contactless") return Boolean(card.contactless);
          return true;
        });
      });
    }

    if (Array.isArray(selectedBanks) && selectedBanks.length > 0) {
      cards = cards.filter(card => {
        const cb = safeLower(card.bank);
        return selectedBanks.some(b => {
          const sb = safeLower(b);
          if (cb === sb || cb.includes(sb) || sb.includes(cb)) return true;
          if (sb.includes("sbi") && (cb.includes("state bank") || cb.includes("sbi"))) return true;
          if (sb.includes("state bank") && (cb.includes("sbi") || cb.includes("state bank"))) return true;
          if (sb.includes("icici") && cb.includes("icici")) return true;
          if (sb.includes("hdfc") && cb.includes("hdfc")) return true;
          if (sb.includes("axis") && cb.includes("axis")) return true;
          if (sb.includes("kotak") && cb.includes("kotak")) return true;
          if ((sb.includes("pnb") || sb.includes("punjab")) && (cb.includes("pnb") || cb.includes("punjab"))) return true;
          if ((sb.includes("bob") || sb.includes("baroda")) && (cb.includes("bob") || cb.includes("baroda"))) return true;
          return false;
        });
      });
    }

    const isFeeActive = feeRange < 2000;
    const isBalanceActive = balanceRange < 500000;
    const isRatingActive = minRating > 0;
    const isCashbackActive = minCashback > 0;
    const isAtmActive = (Array.isArray(atmRange) && (atmRange[0] > 0 || atmRange[1] < 1000000));
    const isPosActive = (Array.isArray(posRange) && (posRange[0] > 0 || posRange[1] < 1500000));

    if (isFeeActive || isBalanceActive || isRatingActive || isCashbackActive || isAtmActive || isPosActive) {
      cards = cards.filter(card => {
        const annualFeeNum = parseAnnualFeeVal(card.annualFee);
        const minBalNum = card.minimumBalance;
        const ratingNum = card.rating || 4.5;
        const cbNum = parseCashbackVal(card.cashback);
        const atmLimit = card.atmLimit || 50000;
        const posLimit = card.posLimit || 100000;

        if (isFeeActive && annualFeeNum > feeRange) return false;
        if (isBalanceActive && minBalNum > balanceRange) return false;
        if (isRatingActive && ratingNum < minRating) return false;
        if (isCashbackActive && cbNum < minCashback) return false;
        if (isAtmActive && (atmLimit < atmRange[0] || atmLimit > atmRange[1])) return false;
        if (isPosActive && (posLimit < posRange[0] || posLimit > posRange[1])) return false;
        return true;
      });
    }

    if (sortBy === "most-popular") {
      cards = [...cards].sort((a, b) => ((b?.isPopular ? 1 : 0) - (a?.isPopular ? 1 : 0)) || ((b?.rating || 0) - (a?.rating || 0)));
    } else if (sortBy === "highest-rated" || sortBy === "rating-desc") {
      cards = [...cards].sort((a, b) => (b?.rating || 0) - (a?.rating || 0));
    } else if (sortBy === "rating-asc") {
      cards = [...cards].sort((a, b) => (a?.rating || 0) - (b?.rating || 0));
    } else if (sortBy === "fee-low" || sortBy === "lowest-fee" || sortBy === "annual-fee-asc") {
      cards = [...cards].sort((a, b) => (a?.numAnnualFee ?? (parseFloat(String(a?.annualFee || '').replace(/[^0-9.]/g, '')) || 0)) - (b?.numAnnualFee ?? (parseFloat(String(b?.annualFee || '').replace(/[^0-9.]/g, '')) || 0)));
    } else if (sortBy === "fee-high" || sortBy === "highest-fee" || sortBy === "annual-fee-desc") {
      cards = [...cards].sort((a, b) => (b?.numAnnualFee ?? (parseFloat(String(b?.annualFee || '').replace(/[^0-9.]/g, '')) || 0)) - (a?.numAnnualFee ?? (parseFloat(String(a?.annualFee || '').replace(/[^0-9.]/g, '')) || 0)));
    } else if (sortBy === "bank-asc" || sortBy === "alphabetical-asc") {
      cards = [...cards].sort((a, b) => String(a?.bank || '').localeCompare(String(b?.bank || '')));
    } else if (sortBy === "bank-desc" || sortBy === "alphabetical-desc") {
      cards = [...cards].sort((a, b) => String(b?.bank || '').localeCompare(String(a?.bank || '')));
    } else if (sortBy === "newest-cards" || sortBy === "recently-added" || sortBy === "newest-updated") {
      cards = [...cards].sort((a, b) => (b?.id || 0) - (a?.id || 0));
    }

    if (!import.meta.env.PROD) {
      console.log(`[D.CARD Filter Engine] Base Cards: ${activeCardsList?.length || 0} | Active Filters: ${totalActiveFiltersCount} | Filtered Result: ${cards.length}`);
    }

    return cards;
  }, [
    query, activeFilters, selectedUserTypes, selectedNetworks, selectedCategories,
    selectedFeeTier, selectedAtmLimitTier, selectedPosLimitTier, selectedFeatures,
    selectedBankTypes, selectedBanks, feeRange, balanceRange, minRating, minCashback,
    atmRange, posRange, sortBy, activeCardsList
  ]);

  return (
    <div className="min-h-screen text-textDark dark:text-secondary transition-colors duration-300 flex flex-col justify-between">
      <ScrollToTop />
      
      <Navbar
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
        onOpenAuth={() => openAuthModal('required')}
        compareCount={compareQueue.length}
        onOpenLegal={(tab) => { setLegalTab(tab || 'terms'); setIsLegalOpen(true); }}
      />

      <div className="flex-1">
        <Routes>
          <Route 
            path="/" 
            element={
              <HomePage
                query={query}
                setQuery={setQuery}
                onViewDetails={handleSelectCardFromItem}
                activeFilters={activeFilters}
                setActiveFilters={setActiveFilters}
                STATIC_AI_PILL_COUNTS={STATIC_AI_PILL_COUNTS}
                toggleBank={toggleBank}
                selectSingleBank={selectSingleBank}
                activeCardsList={activeCardsList}
                toggleCompareQueue={toggleCompareQueue}
                compareQueue={compareQueue}
                savingsCompareQueue={savingsCompareQueue}
                setSavingsCompareQueue={setSavingsCompareQueue}
              />
            } 
          />
          <Route 
            path="/cards" 
            element={
              <CardsPage
                filteredCards={filteredCards}
                activeFilters={activeFilters}
                toggleFilter={toggleFilter}
                clearFilters={clearFilters}
                handleResetFilters={handleResetFilters}
                sortBy={sortBy}
                setSortBy={setSortBy}
                feeRange={feeRange}
                setFeeRange={setFeeRange}
                balanceRange={balanceRange}
                setBalanceRange={setBalanceRange}
                atmRange={atmRange}
                setAtmRange={setAtmRange}
                posRange={posRange}
                setPosRange={setPosRange}
                minRating={minRating}
                setMinRating={setMinRating}
                minCashback={minCashback}
                setMinCashback={setMinCashback}
                selectedBanks={selectedBanks}
                toggleBank={toggleBank}
                selectedNetworks={selectedNetworks}
                toggleNetwork={toggleNetwork}
                selectedCategories={selectedCategories}
                toggleCategory={toggleCategory}
                selectedUserTypes={selectedUserTypes}
                toggleUserType={toggleUserType}
                selectedBankTypes={selectedBankTypes}
                toggleBankType={toggleBankType}
                selectedFeeTier={selectedFeeTier}
                setSelectedFeeTier={setSelectedFeeTier}
                selectedAtmLimitTier={selectedAtmLimitTier}
                setSelectedAtmLimitTier={setSelectedAtmLimitTier}
                selectedPosLimitTier={selectedPosLimitTier}
                setSelectedPosLimitTier={setSelectedPosLimitTier}
                selectedFeatures={selectedFeatures}
                toggleFeature={toggleFeature}
                handleLoadPreset={handleLoadPreset}
                userProfile={userProfile}
                handleApplyProfilePreset={handleApplyProfilePreset}
                totalActiveFiltersCount={totalActiveFiltersCount}
                isLoading={isLoading}
                toggleCompareQueue={toggleCompareQueue}
                compareQueue={compareQueue}
                setSelectedCard={setSelectedCard}
                STATIC_RANKINGS={STATIC_RANKINGS}
                TOTAL_CARDS_COUNT={TOTAL_CARDS_COUNT}
                VERIFIED_CARDS_COUNT={VERIFIED_CARDS_COUNT}
                PENDING_VERIFY_COUNT={PENDING_VERIFY_COUNT}
                RECENTLY_UPDATED_COUNT={RECENTLY_UPDATED_COUNT}
                query={query}
                setQuery={setQuery}
              />
            } 
          />
          <Route 
            path="/savings-accounts" 
            element={
              <SavingsAccountsPage
                onSelectDebitCard={(card) => setSelectedCard(card)}
              />
            } 
          />
          <Route 
            path="/savings-accounts/:id" 
            element={
              <SavingsAccountDetailPage
                onSelectDebitCard={(card) => setSelectedCard(card)}
                onToggleCompare={(acc) => {
                  setSavingsCompareQueue(prev => {
                    if (prev.some(a => String(a.id) === String(acc.id))) return prev;
                    if (prev.length >= 3) return prev;
                    return [...prev, acc];
                  });
                }}
                isCompared={false}
              />
            } 
          />
          <Route 
            path="/compare-savings" 
            element={
              <SavingsAccountsComparePage
                compareQueue={savingsCompareQueue}
                setCompareQueue={setSavingsCompareQueue}
                onSelectDebitCard={(card) => setSelectedCard(card)}
              />
            } 
          />
          <Route 
            path="/compare" 
            element={
              <ComparePage
                compareQueue={compareQueue}
                setCompareQueue={setCompareQueue}
                setSelectedCard={setSelectedCard}
              />
            } 
          />
          <Route 
            path="/ai-advisor" 
            element={
              <AIAdvisorPage
                onOpenContact={() => navigate('/contact')}
                onSelectDebitCard={(card) => setSelectedCard(card)}
                toggleCompareQueue={toggleCompareQueue}
                setSavingsCompareQueue={setSavingsCompareQueue}
              />
            } 
          />
          <Route 
            path="/saved-cards" 
            element={
              <SavedCardsPage
                setSelectedCard={setSelectedCard}
                toggleCompareQueue={toggleCompareQueue}
                compareQueue={compareQueue}
                userProfile={userProfile}
                STATIC_RANKINGS={STATIC_RANKINGS}
              />
            } 
          />
          <Route 
            path="/favorites" 
            element={
              <SavedCardsPage
                setSelectedCard={setSelectedCard}
                toggleCompareQueue={toggleCompareQueue}
                compareQueue={compareQueue}
                userProfile={userProfile}
                STATIC_RANKINGS={STATIC_RANKINGS}
              />
            } 
          />
          <Route 
            path="/banks" 
            element={
              <BanksPage
                BANK_PROFILES={BANK_PROFILES}
                toggleBank={toggleBank}
                selectSingleBank={selectSingleBank}
                activeCardsList={activeCardsList}
                toggleCompareQueue={toggleCompareQueue}
                compareQueue={compareQueue}
                onSelectDebitCard={(card) => setSelectedCard(card)}
                savingsCompareQueue={savingsCompareQueue}
                setSavingsCompareQueue={setSavingsCompareQueue}
              />
            } 
          />
          <Route 
            path="/banks/:id" 
            element={
              <BanksPage
                BANK_PROFILES={BANK_PROFILES}
                toggleBank={toggleBank}
                selectSingleBank={selectSingleBank}
                activeCardsList={activeCardsList}
                toggleCompareQueue={toggleCompareQueue}
                compareQueue={compareQueue}
                onSelectDebitCard={(card) => setSelectedCard(card)}
                savingsCompareQueue={savingsCompareQueue}
                setSavingsCompareQueue={setSavingsCompareQueue}
              />
            } 
          />
          <Route 
            path="/about" 
            element={<AboutPage />} 
          />
          <Route 
            path="/founders" 
            element={<FoundersPage />} 
          />
          <Route 
            path="/team" 
            element={<FoundersPage />} 
          />
          <Route 
            path="/contact" 
            element={<ContactPage />} 
          />
          <Route 
            path="/profile" 
            element={
              user ? (
                <Suspense fallback={<LoadingSkeleton />}>
                  <UserProfilePage
                    activeTab={profileActiveTab}
                    onSelectCard={(card) => setSelectedCard(card)}
                    onCompareCards={(card) => toggleCompareQueue(card)}
                    isDarkMode={isDarkMode}
                    toggleDarkMode={toggleDarkMode}
                  />
                </Suspense>
              ) : (
                <div className="py-20 text-center space-y-4">
                  <h2 className="text-2xl font-bold">Authentication Required</h2>
                  <p className="text-sm text-gray-500">Please sign in to view your profile dashboard.</p>
                  <button
                    onClick={() => openAuthModal('login')}
                    className="px-6 py-2.5 rounded-full bg-secondary text-white font-bold text-xs shadow-md"
                  >
                    Sign In Now
                  </button>
                </div>
              )
            } 
          />
        </Routes>
      </div>

      <Footer onOpenLegal={(tab) => { setLegalTab(tab); setIsLegalOpen(true); }} />

      {/* Website First Visit Disclaimer Popup */}
      <WebsiteDisclaimerModal />

      {/* Global Modals */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        onSuccessAction={handleAuthSuccessResume}
      />

      <Suspense fallback={null}>
        <FirstLoginModal 
          isOpen={showWelcomeModal} 
          onClose={() => setShowWelcomeModal(false)}
          userName={profile?.full_name || profile?.name} 
        />

        <CardDetailsModal 
          isOpen={!!selectedCard} 
          onClose={() => setSelectedCard(null)} 
          card={selectedCard}
          compareQueue={compareQueue}
          toggleCompareQueue={toggleCompareQueue}
          onCardSelect={setSelectedCard}
          userProfile={userProfile}
          rankings={STATIC_RANKINGS}
        />
      </Suspense>

      <Suspense fallback={null}>
        {isLegalOpen && <LegalModal isOpen={isLegalOpen} onClose={() => setIsLegalOpen(false)} initialTab={legalTab} />}
        {/* Render floating AI widget on all routes except dedicated /ai-advisor */}
        {location.pathname !== '/ai-advisor' && (
          <AIChatAssistant 
            onOpenContact={() => navigate('/contact')} 
            isCompareActive={compareQueue.length > 0}
            compareDockHeight={compareDockHeight}
          />
        )}
        {isAdminOpen && <AdminDashboardModal isOpen={isAdminOpen} onClose={() => setIsAdminOpen(false)} currentUser={user} />}
        {isAdminLoginOpen && <AdminLoginPage isOpen={isAdminLoginOpen} onClose={() => setIsAdminLoginOpen(false)} />}
        {isAccessDeniedOpen && <AccessDeniedModal isOpen={isAccessDeniedOpen} onClose={() => setIsAccessDeniedOpen(false)} onOpenAuth={() => openAuthModal('login')} />}
      </Suspense>

      {/* Floating Compare Dock */}
      <ComparisonDock
        compareQueue={compareQueue}
        onRemove={(cardId) => setCompareQueue(prev => prev.filter(c => String(c.id) !== String(cardId)))}
        onCompareNow={() => navigate('/compare')}
        onClear={() => setCompareQueue([])}
        onHeightChange={setCompareDockHeight}
      />
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <AuthProvider>
          <WishlistProvider>
            <BrowserRouter>
              <AppContent />
            </BrowserRouter>
          </WishlistProvider>
        </AuthProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default App;
