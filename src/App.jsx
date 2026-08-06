import { useEffect, useMemo, useState, useCallback, lazy, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ErrorBoundary from "./components/ErrorBoundary";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import FilterSidebar from "./components/FilterSidebar";
import BankCard from "./components/BankCard";
import DebitCardCard from "./components/DebitCardCard";
import ComparisonTable from "./components/ComparisonTable";
import ComparisonDock from "./components/ComparisonDock";
import LoadingSkeleton from "./components/LoadingSkeleton";
import Footer from "./components/Footer";
import TopCardsSection from "./components/TopCardsSection";
import AuthModal from "./components/AuthModal";
import QuickFilterChips from "./components/QuickFilterChips";
import VirtualizedCardGrid from "./components/VirtualizedCardGrid";
import { normalizeCard, deduplicateCards, parseAnnualFeeVal, parseCashbackVal, safeLower, safeIncludes, safeStr, safeMap } from "./utils/compareUtils";

// Lazy Loaded Heavy Components & Modals for Code Splitting
const UserProfilePage = lazy(() => import("./components/UserProfilePage"));
const AboutModal = lazy(() => import("./components/AboutModal"));
const LegalModal = lazy(() => import("./components/LegalModal"));
const ContactModal = lazy(() => import("./components/ContactModal"));
const AIChatAssistant = lazy(() => import("./components/AIChatAssistant"));
const AdminDashboardModal = lazy(() => import("./components/AdminDashboardModal"));
const AdminLoginPage = lazy(() => import("./components/AdminLoginPage"));
const ReviewSection = lazy(() => import("./components/ReviewSection"));
const FaqSection = lazy(() => import("./components/FaqSection"));
const CardDetailsModal = lazy(() => import("./components/CardDetailsModal"));
const WishlistDrawer = lazy(() => import("./components/WishlistDrawer"));
const SavingsCalculator = lazy(() => import("./components/SavingsCalculator"));
const PickOfTheMonth = lazy(() => import("./components/PickOfTheMonth"));
const FirstLoginModal = lazy(() => import("./components/FirstLoginModal"));
const AccessDeniedModal = lazy(() => import("./components/AccessDeniedModal"));

import { cardService } from "./services/cardService";
import { ToastProvider, useToast } from "./context/ToastContext";
import { WishlistProvider, useWishlist } from "./context/WishlistContext";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./hooks/useAuth";
import { bankCards, debitCards, allDebitCards } from "./data/mockData";

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
    overview: "ICICI Bank is a premier private sector bank in India, known for its technologically advanced digital platforms and massive merchant partnerships.",
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

function AppInner() {
  const toast = useToast();
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

  const [currentView, setCurrentView] = useState("home"); // "home" | "profile"
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
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
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

  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isAccessDeniedOpen, setIsAccessDeniedOpen] = useState(false);
  const [isLegalOpen, setIsLegalOpen] = useState(false);
  const [legalTab, setLegalTab] = useState("privacy");
  const [compareQueue, setCompareQueue] = useState([]);
  const [isComparing, setIsComparing] = useState(false);
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

  // Strict Admin Route Guard Listener (/admin, /admin/dashboard, #admin, etc.)
  useEffect(() => {
    const handleHashCheck = () => {
      const pathOrHash = (window.location.hash || window.location.pathname || '').toLowerCase();

      if (pathOrHash.includes('contact')) {
        setIsContactOpen(true);
      }

      // Temporarily disable all admin routes (/admin, /admin/dashboard, /admin/analytics, /admin/users, /admin/banks, /admin/cards, /admin/import)
      if (pathOrHash.includes('admin')) {
        setIsAdminOpen(false);
        setIsAdminLoginOpen(false);
        if (window.location.hash.includes('admin') || window.location.pathname.includes('admin')) {
          window.location.hash = '#home';
          if (window.history && window.history.replaceState) {
            window.history.replaceState(null, '', '/#home');
          }
        }
        setCurrentView('home');
      }
    };

    handleHashCheck();
    window.addEventListener('hashchange', handleHashCheck);
    return () => {
      window.removeEventListener('hashchange', handleHashCheck);
    };
  }, []);

  const handleOpenAdmin = useCallback(() => {
    setIsAdminOpen(false);
    setIsAdminLoginOpen(false);
    window.location.hash = '#home';
    setCurrentView('home');
  }, []);

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

    // Normal User Post-Login Routing
    if (redirectTarget) {
      if (redirectTarget.startsWith('profile-')) {
        const tab = redirectTarget.replace('profile-', '');
        setCurrentView('profile');
        setProfileActiveTab(tab);
      } else if (redirectTarget === 'profile' || redirectTarget === 'saved') {
        setCurrentView('profile');
        setProfileActiveTab(redirectTarget === 'saved' ? 'saved' : 'profile');
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
      // Default normal user redirect to User Dashboard
      setCurrentView('profile');
      setProfileActiveTab('profile');
    }
  }, [user, redirectTarget, setRedirectTarget, toggleWishlist]);

  const handleNavigateView = useCallback((viewName, profileTab = "profile") => {
    if (viewName === 'profile' && !user) {
      openAuthModal('login', `profile-${profileTab}`);
    } else {
      setCurrentView(viewName);
      setProfileActiveTab(profileTab);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [user, openAuthModal]);

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
    console.log(`[Filter Debug] Step 0 - Initial Cards: ${cards.length}`);

    // 1. Search Query Filter
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
      console.log(`[Filter Debug] Step 1 - Search Query ("${q}"): ${cards.length} cards`);
    } else {
      console.log(`[Filter Debug] Step 1 - Search Query (none): ${cards.length} cards`);
    }

    // 2. User Type Filter
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
      console.log(`[Filter Debug] Step 2 - User Types (${selectedUserTypes.join(', ')}): ${cards.length} cards`);
    } else {
      console.log(`[Filter Debug] Step 2 - User Types (none): ${cards.length} cards`);
    }

    // 3. Card Network Filter
    if (Array.isArray(selectedNetworks) && selectedNetworks.length > 0) {
      cards = cards.filter(card => {
        return selectedNetworks.some(net => safeIncludes(card.network, net));
      });
      console.log(`[Filter Debug] Step 3 - Networks (${selectedNetworks.join(', ')}): ${cards.length} cards`);
    } else {
      console.log(`[Filter Debug] Step 3 - Networks (none): ${cards.length} cards`);
    }

    // 4. Card Category Filter
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
      console.log(`[Filter Debug] Step 4 - Categories (${selectedCategories.join(', ')}): ${cards.length} cards`);
    } else {
      console.log(`[Filter Debug] Step 4 - Categories (none): ${cards.length} cards`);
    }

    // 5. Annual Fee Tier Filter
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
      console.log(`[Filter Debug] Step 5 - Fee Tier (${selectedFeeTier}): ${cards.length} cards`);
    } else {
      console.log(`[Filter Debug] Step 5 - Fee Tier (none): ${cards.length} cards`);
    }

    // 6. ATM Limit Tier Filter
    if (selectedAtmLimitTier) {
      cards = cards.filter(card => {
        const limit = card.atmLimit || 50000;
        if (selectedAtmLimitTier === "25k") return limit >= 25000;
        if (selectedAtmLimitTier === "50k") return limit >= 50000;
        if (selectedAtmLimitTier === "100k") return limit >= 100000;
        if (selectedAtmLimitTier === "200k") return limit >= 200000;
        return true;
      });
      console.log(`[Filter Debug] Step 6 - ATM Limit Tier (${selectedAtmLimitTier}): ${cards.length} cards`);
    } else {
      console.log(`[Filter Debug] Step 6 - ATM Limit Tier (none): ${cards.length} cards`);
    }

    // 7. POS Limit Tier Filter
    if (selectedPosLimitTier) {
      cards = cards.filter(card => {
        const limit = card.posLimit || 100000;
        if (selectedPosLimitTier === "50k") return limit >= 50000;
        if (selectedPosLimitTier === "100k") return limit >= 100000;
        if (selectedPosLimitTier === "200k") return limit >= 200000;
        if (selectedPosLimitTier === "500k") return limit >= 500000;
        return true;
      });
      console.log(`[Filter Debug] Step 7 - POS Limit Tier (${selectedPosLimitTier}): ${cards.length} cards`);
    } else {
      console.log(`[Filter Debug] Step 7 - POS Limit Tier (none): ${cards.length} cards`);
    }

    // 8. Features & Benefits Filter
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
      console.log(`[Filter Debug] Step 8 - Features (${selectedFeatures.join(', ')}): ${cards.length} cards`);
    } else {
      console.log(`[Filter Debug] Step 8 - Features (none): ${cards.length} cards`);
    }

    // 9. Bank Type Filter
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
      console.log(`[Filter Debug] Step 9 - Bank Types (${selectedBankTypes.join(', ')}): ${cards.length} cards`);
    } else {
      console.log(`[Filter Debug] Step 9 - Bank Types (none): ${cards.length} cards`);
    }

    // 10. Active Filters (Presets)
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
      console.log(`[Filter Debug] Step 10 - Active Presets (${activeFilters.join(', ')}): ${cards.length} cards`);
    } else {
      console.log(`[Filter Debug] Step 10 - Active Presets (none): ${cards.length} cards`);
    }

    // 11. Selected Banks Filter
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
      console.log(`[Filter Debug] Step 11 - Selected Banks (${selectedBanks.join(', ')}): ${cards.length} cards`);
    } else {
      console.log(`[Filter Debug] Step 11 - Selected Banks (none): ${cards.length} cards`);
    }

    // 12. Continuous Range Sliders (Only if user has adjusted sliders from default)
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
      console.log(`[Filter Debug] Step 12 - Range Sliders (Active): ${cards.length} cards`);
    } else {
      console.log(`[Filter Debug] Step 12 - Range Sliders (none active): ${cards.length} cards`);
    }

    console.log(`[Filter Debug] FINAL Filtered Output: ${cards.length} cards`);
    return cards;

    // 13. All Sorting Options
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

    return cards;
  }, [
    query, activeFilters, selectedUserTypes, selectedNetworks, selectedCategories,
    selectedFeeTier, selectedAtmLimitTier, selectedPosLimitTier, selectedFeatures,
    selectedBankTypes, selectedBanks, feeRange, balanceRange, minRating, minCashback,
    atmRange, posRange, sortBy, activeCardsList
  ]);

  // Public Open Application Shell (Website opens directly on Home page)
  return (
    <div className="min-h-screen text-textDark dark:text-secondary transition-colors duration-300">
      <Navbar
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
        onOpenAuth={() => openAuthModal('required')}
        onOpenWishlist={() => handleNavigateView('profile', 'saved')}
        onOpenContact={() => setIsContactOpen(true)}
        onOpenAbout={() => setIsAboutOpen(true)}
        onOpenAdmin={handleOpenAdmin}
        compareCount={compareQueue.length}
        currentView={currentView}
        onNavigateView={handleNavigateView}
      />

      {/* Dynamic View Router */}
      {currentView === 'profile' && user ? (
        <UserProfilePage
          activeTab={profileActiveTab}
          onSelectCard={(card) => setSelectedCard(card)}
          onCompareCards={(card) => toggleCompareQueue(card)}
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
        />
      ) : (
        <>
          <HeroSection query={query} setQuery={setQuery} onViewDetails={handleSelectCardFromItem} />

          <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-12 mt-0 sm:-mt-8 relative z-20">
            <TopCardsSection 
              onViewDetails={handleSelectCardFromItem} 
            />

            {/* Find Cards by Life Stage */}
            <section className="mt-14 mb-10 select-none">
              <div className="text-center md:text-left mb-8">
                <span className="mb-2 inline-flex items-center gap-1.5 px-3 py-1 bg-secondary/10 text-secondary dark:text-roseGold text-[10px] font-black tracking-widest uppercase rounded-full select-none">
                  🎯 TARGETED DISCOVERY PORTAL
                </span>
                <h2 className="text-3xl font-black font-serif text-[#1E0B16] dark:text-[#F5D9E8] tracking-tight mt-2 flex items-center justify-center md:justify-start gap-2">
                  Find Cards by Life Stage
                </h2>
                <p className="text-sm text-textSoft dark:text-gray-400 mt-1 max-w-xl">
                  Tap a card setup specifically curated for your active financial profile and life segment.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
                {[
                  { id: "Student Friendly", label: "Student Cards", icon: "🎓", gradient: "from-cyan-500/20 to-blue-500/20", border: "hover:border-cyan-500/50", text: "Zero balance setups", best: "Kotak 811", count: STATIC_AI_PILL_COUNTS["Best for Students"] },
                  { id: "Women Special",    label: "Women Special", icon: "👩", gradient: "from-pink-500/20 to-rose-500/20", border: "hover:border-pink-500/50", text: "BOGO dining & movies", best: "ICICI Coral", count: STATIC_AI_PILL_COUNTS["Best for Women"] },
                  { id: "Senior Citizen",   label: "Senior Citizen", icon: "👴", gradient: "from-amber-500/20 to-orange-500/20", border: "hover:border-amber-500/50", text: "High yield savings", best: "HDFC Platinum", count: STATIC_AI_PILL_COUNTS["Best for Seniors"] },
                  { id: "International Usage", label: "Travel Cards", icon: "✈️", gradient: "from-sky-500/20 to-indigo-500/20", border: "hover:border-sky-500/50", text: "Zero forex markup", best: "Axis Burgundy", count: STATIC_AI_PILL_COUNTS["Travel Friendly"] },
                  { id: "Zero Balance",     label: "Zero Balance", icon: "💵", gradient: "from-violet-500/20 to-purple-500/20", border: "hover:border-violet-500/50", text: "No balance pressure", best: "IDFC FIRST Wealth", count: STATIC_AI_PILL_COUNTS["Zero Balance"] },
                  { id: "Lounge Access",    label: "Premium Cards", icon: "💎", gradient: "from-yellow-500/20 to-amber-500/20", border: "hover:border-yellow-500/50", text: "Highest limits", best: "IDFC Private", count: STATIC_AI_PILL_COUNTS["Premium Benefits"] },
                  { id: "Healthcare Friendly", label: "Health Focused", icon: "🏥", gradient: "from-emerald-500/20 to-teal-500/20", border: "hover:border-emerald-500/50", text: "Free wellness perks", best: "Canara RuPay Select", count: STATIC_AI_PILL_COUNTS["Healthcare Friendly"] }
                ].map(stage => {
                  const isActive = activeFilters.includes(stage.id);
                  return (
                    <motion.div
                      key={stage.id}
                      whileHover={{ y: -6, scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => {
                        const targetFilter = stage.id;
                        setActiveFilters(prev => 
                          prev.includes(targetFilter) ? prev.filter(f => f !== targetFilter) : [...prev, targetFilter]
                        );
                        document.getElementById('cards')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className={`cursor-pointer p-4 rounded-3xl backdrop-blur-xl border transition-all duration-300 shadow-soft flex flex-col justify-between min-h-[170px] select-none text-left bg-white/45 dark:bg-black/25 ${
                        isActive 
                          ? "border-secondary dark:border-roseGold bg-secondary/10 dark:bg-secondary/15 shadow-[0_8px_30px_rgba(194,24,117,0.2)]" 
                          : `border-borderSubtle dark:border-[#2e1436]/40 ${stage.border}`
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${stage.gradient} border border-white/10 flex items-center justify-center text-xl shadow-sm mb-3`}>
                        {stage.icon}
                      </div>
                      <div>
                        <h3 className="text-xs sm:text-sm font-black text-[#1E0B16] dark:text-[#F5D9E8] tracking-tight">{stage.label}</h3>
                        <p className="text-[11px] text-textSoft dark:text-[#D89AB6]/80 mt-1.5 leading-relaxed font-semibold font-sans">{stage.text}</p>
                      </div>
                      <div className="mt-4 pt-2 border-t border-slate-100 dark:border-secondary/10 text-[10px] font-bold text-slate-400 select-none">
                        <span className="block">{stage.count} Cards Available</span>
                        <span className="block text-secondary dark:text-roseGold mt-0.5 font-black">Best: {stage.best}</span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </section>

            <PickOfTheMonth card={debitCards.find(c => c.id === 26)} onViewDetails={setSelectedCard} />

            <div className="grid grid-cols-1 gap-8 md:grid-cols-[280px_minmax(0,1fr)] mt-8">
              {/* Desktop Filter Sidebar */}
              <div className="hidden md:block">
                <FilterSidebar
                  activeFilters={activeFilters}
                  toggleFilter={toggleFilter}
                  clearFilters={clearFilters}
                  onResetFilters={handleResetFilters}
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
                  resultCount={filteredCards.length}
                  selectedCategories={selectedCategories}
                  toggleCategory={toggleCategory}
                  selectedUserTypes={selectedUserTypes}
                  toggleUserType={toggleUserType}
                  selectedBankTypes={selectedBankTypes}
                  toggleBankType={toggleBankType}
                  selectedFeeTier={selectedFeeTier}
                  setFeeTier={setSelectedFeeTier}
                  selectedAtmLimitTier={selectedAtmLimitTier}
                  setAtmLimitTier={setSelectedAtmLimitTier}
                  selectedPosLimitTier={selectedPosLimitTier}
                  setPosLimitTier={setSelectedPosLimitTier}
                  selectedFeatures={selectedFeatures}
                  toggleFeature={toggleFeature}
                  onLoadPreset={handleLoadPreset}
                  userProfile={userProfile}
                  onApplyProfilePreset={handleApplyProfilePreset}
                />
              </div>

              <div className="space-y-6">
                <QuickFilterChips
                  selectedUserTypes={selectedUserTypes}
                  toggleUserType={toggleUserType}
                  selectedFeeTier={selectedFeeTier}
                  setFeeTier={setSelectedFeeTier}
                  selectedBankTypes={selectedBankTypes}
                  toggleBankType={toggleBankType}
                  selectedNetworks={selectedNetworks}
                  toggleNetwork={toggleNetwork}
                  selectedFeatures={selectedFeatures}
                  toggleFeature={toggleFeature}
                  selectedCategories={selectedCategories}
                  toggleCategory={toggleCategory}
                  sortBy={sortBy}
                  setSortBy={setSortBy}
                  onResetFilters={handleResetFilters}
                />

                <section id="cards">
                  <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-highlight dark:border-darkHighlight pb-4">
                    <div>
                      <h2 className="text-2xl font-bold font-serif text-primary dark:text-accent">Compare Debit Cards</h2>
                      <p className="text-sm text-textSoft dark:text-gray-400 mt-1">Showing {filteredCards.length} premium debit cards matching your dynamic filters</p>
                    </div>

                    <div className="flex items-center gap-2.5 self-stretch sm:self-auto justify-between sm:justify-end">
                      <button
                        onClick={() => setIsMobileFilterOpen(true)}
                        className="md:hidden px-3.5 py-2 rounded-xl bg-secondary text-white font-extrabold text-xs flex items-center gap-1.5 shadow-md cursor-pointer"
                      >
                        <span>🎯 Smart Filters</span>
                        {totalActiveFiltersCount > 0 && (
                          <span className="bg-white text-secondary text-[10px] px-1.5 py-0.5 rounded-full font-black">
                            {totalActiveFiltersCount}
                          </span>
                        )}
                      </button>

                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 hidden sm:inline">Sort:</span>
                        <select
                          value={sortBy}
                          onChange={(e) => setSortBy(e.target.value)}
                          className="px-3.5 py-2 rounded-xl bg-white dark:bg-black/50 border border-slate-200 dark:border-secondary/25 text-xs font-bold text-slate-800 dark:text-slate-100 outline-none focus:border-secondary cursor-pointer shadow-sm"
                        >
                          <option value="most-popular">🔥 Most Popular</option>
                          <option value="most-viewed">👁️ Most Viewed</option>
                          <option value="highest-rated">⭐ Highest Rated</option>
                          <option value="lowest-fee">💰 Lowest Annual Fee</option>
                          <option value="highest-atm">🏧 Highest ATM Limit</option>
                          <option value="highest-pos">🛍️ Highest Purchase Limit</option>
                          <option value="newest-cards">✨ Newest Cards</option>
                          <option value="recently-added">🕒 Recently Added</option>
                          <option value="alphabetical-asc">🔤 Alphabetical (A-Z)</option>
                          <option value="alphabetical-desc">🔤 Alphabetical (Z-A)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Disclaimer Banner */}
                  <div className="mb-4 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 text-amber-900 dark:text-amber-300 rounded-xl px-4 py-2.5 text-xs flex items-center gap-2.5 shadow-sm select-none">
                    <span className="text-base select-none">⚠️</span>
                    <p className="font-semibold leading-relaxed">
                      <strong>Disclaimer:</strong> Debit card fees, limits, and benefits are subject to change by banks at any time. Please verify all details from the official bank website before applying.
                    </p>
                  </div>

                  {/* Data Update Panel Stats */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6 select-none">
                    {[
                      { label: "Total Database", value: `${TOTAL_CARDS_COUNT} Cards`, icon: "🗃️", bg: "from-pink-500/10 to-rose-500/10", border: "border-pink-500/20", color: "text-[#7A0F52] dark:text-[#FDF7FA]" },
                      { label: "Verified Cards", value: `${VERIFIED_CARDS_COUNT} Active`, icon: "✓", bg: "from-emerald-500/10 to-green-500/10", border: "border-emerald-500/20", color: "text-green-600 dark:text-green-400" },
                      { label: "Needs Verification", value: `${PENDING_VERIFY_COUNT} Review`, icon: "⚠️", bg: "from-amber-500/10 to-yellow-500/10", border: "border-amber-500/20", color: "text-amber-600 dark:text-amber-400" },
                      { label: "Recently Updated", value: `${RECENTLY_UPDATED_COUNT} Cards`, icon: "🔄", bg: "from-secondary/10 to-primary/10", border: "border-secondary/20", color: "text-[#C21875] dark:text-roseGold" }
                    ].map(({ label, value, icon, bg, border, color }) => (
                      <motion.div 
                        key={label}
                        whileHover={{ y: -3, scale: 1.02 }}
                        className="p-4 rounded-2xl bg-white/45 dark:bg-black/25 backdrop-blur-xl border border-borderSubtle dark:border-[#2e1436]/40 shadow-soft flex items-center gap-3.5 transition-all duration-300"
                      >
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${bg} border ${border} flex items-center justify-center text-lg shadow-sm flex-shrink-0`}>
                          {icon}
                        </div>
                        <div>
                          <p className="text-[10px] sm:text-[11px] text-textMuted dark:text-[#B07A95] font-bold uppercase tracking-wider">{label}</p>
                          <p className={`text-sm sm:text-base font-black mt-0.5 ${color}`}>{value}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {isLoading ? (
                    <LoadingSkeleton />
                  ) : filteredCards.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex flex-col items-center justify-center py-20 px-6 text-center rounded-3xl backdrop-blur-xl border border-[#E8D9E3]/55 dark:border-[#7A0F52]/20 bg-white/40 dark:bg-black/30 shadow-soft"
                    >
                      <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                        className="text-6xl mb-6 select-none"
                      >
                        🔍
                      </motion.div>
                      <h3 className="text-2xl font-black font-serif text-[#1E0B16] dark:text-[#F5D9E8] mb-2 tracking-tight">
                        No debit cards match your selected filters.
                      </h3>
                      <p className="text-sm text-textSoft dark:text-[#D89AB6] max-w-sm mb-8 leading-relaxed">
                        Try adjusting your filters, modifying ranges, or clearing select tags to find matching cards.
                      </p>
                      <button
                        onClick={handleResetFilters}
                        className="px-8 py-3 rounded-full bg-gradient-to-r from-secondary to-primary text-white font-extrabold text-xs tracking-wider uppercase shadow-[0_6px_20px_rgba(194,24,117,0.3)] hover:brightness-110 active:scale-95 transition-all cursor-pointer"
                      >
                        Reset Filters
                      </button>
                    </motion.div>
                  ) : (
                    <VirtualizedCardGrid
                      cards={filteredCards}
                      toggleCompareQueue={toggleCompareQueue}
                      compareQueue={compareQueue}
                      setSelectedCard={setSelectedCard}
                      userProfile={userProfile}
                      activeFilters={activeFilters}
                      STATIC_RANKINGS={STATIC_RANKINGS}
                    />
                  )}
                </section>

                {/* Hidden Charges Transparency */}
                <section id="hidden-charges" className="mt-10 mb-8 select-none">
                  <div className="text-center md:text-left mb-8">
                    <span className="mb-2 inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 text-amber-600 dark:text-amber-300 text-[10px] font-black tracking-widest uppercase rounded-full select-none">
                      ⚠️ TRANSPARENCY PROMISE
                    </span>
                    <h2 className="text-3xl font-black font-serif text-[#1E0B16] dark:text-[#F5D9E8] tracking-tight mt-2 flex items-center justify-center md:justify-start gap-2">
                      <span>⚖️</span> Banks show benefits. We show charges.
                    </h2>
                    <p className="text-sm text-textSoft dark:text-gray-400 mt-1 max-w-xl">
                      While banks heavily advertise premium benefits, they often hide transaction penalties. We audit and display everything transparently.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                      { title: "Minimum Balance Penalty", desc: "Non-maintenance of monthly average balance (MAB) can attract heavy penalties ranging from ₹100 to ₹600 + GST every single month.", icon: "🏦", risk: "High Risk", riskColor: "text-rose-500 border-rose-500/25 bg-rose-500/5" },
                      { title: "ATM Charges", desc: "Beyond 3-5 free monthly uses, withdrawing cash costs ₹21 + GST per transaction. Non-bank ATM uses have even lower free thresholds.", icon: "🏧", risk: "Medium Risk", riskColor: "text-amber-500 border-amber-500/25 bg-amber-500/5" },
                      { title: "Replacement Fee", desc: "Requesting a replacement card due to loss, theft, or wear and tear attracts a flat reissuance cost of ₹200 to ₹350 + GST.", icon: "💳", risk: "Low Risk", riskColor: "text-green-500 border-green-500/25 bg-green-500/5" },
                      { title: "Forex Markup", desc: "Swiping your debit card abroad or paying online in foreign currencies attracts a heavy cross-currency markup of up to 3.5% + GST.", icon: "💱", risk: "High Risk", riskColor: "text-rose-500 border-rose-500/25 bg-rose-500/5" },
                      { title: "SMS Charges", desc: "While SMS alerts are mandatory for security, banks charge an ad-hoc fee of ₹12 to ₹15 per quarter to notify you.", icon: "💬", risk: "Low Risk", riskColor: "text-green-500 border-green-500/25 bg-green-500/5" }
                    ].map((charge, idx) => (
                      <motion.div
                        key={idx}
                        whileHover={{ y: -5, scale: 1.02 }}
                        className="p-4 sm:p-5 rounded-3xl bg-white/45 dark:bg-black/25 backdrop-blur-xl border border-slate-200 dark:border-secondary/15 shadow-soft flex flex-col justify-between min-h-[160px] text-left"
                      >
                        <div className="flex items-start justify-between">
                          <span className="text-3xl select-none">{charge.icon}</span>
                          <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-bold tracking-widest uppercase ${charge.riskColor}`}>
                            {charge.risk}
                          </span>
                        </div>
                        <div className="mt-4">
                          <h4 className="text-sm font-black text-slate-800 dark:text-slate-100 tracking-tight">{charge.title}</h4>
                          <p className="text-xs text-textSoft dark:text-[#D89AB6]/80 mt-2 leading-relaxed font-semibold font-sans">{charge.desc}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </section>

                <Suspense fallback={null}>
                  <SavingsCalculator onViewDetails={setSelectedCard} />
                </Suspense>

                <section id="comparison">
                  <div className="mb-6 flex items-end justify-between border-b border-highlight dark:border-darkHighlight pb-4">
                    <div>
                      <h2 className="text-2xl font-bold font-serif text-primary dark:text-accent">
                        {compareQueue.length > 0 ? `Your Comparison (${compareQueue.length})` : "Feature Comparison Matrix"}
                      </h2>
                      <p className="text-sm text-textSoft dark:text-gray-400 mt-1">Detailed side-by-side evaluation</p>
                    </div>
                    {compareQueue.length > 0 && (
                      <button 
                        onClick={() => {
                          setCompareQueue([]);
                          setIsComparing(false);
                        }} 
                        className="text-sm text-cta dark:text-primary font-bold hover:underline cursor-pointer"
                      >
                        Clear Comparison
                      </button>
                    )}
                  </div>
                  <div className="bg-cardBg dark:bg-darkCard rounded-xl p-3 sm:p-6 shadow-soft border border-highlight dark:border-darkHighlight overflow-x-auto transition-colors">
                    <ComparisonTable cards={compareQueue} />
                  </div>
                </section>
                
                <section id="banks">
                  <div className="mb-6 flex items-end justify-between border-b border-highlight dark:border-darkHighlight pb-4">
                    <div>
                      <h2 className="text-2xl font-bold font-serif text-primary dark:text-accent">Top Banks Overview</h2>
                      <p className="text-sm text-textSoft dark:text-gray-400 mt-1">Explore features by leading banks</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                    {bankCards.map((bank) => (
                      <BankCard 
                        key={bank.id} 
                        bank={bank} 
                        onSelect={() => {
                          toggleBank(bank.name);
                          document.getElementById('cards')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                      />
                    ))}
                  </div>
                </section>
              </div>
            </div>

            <Suspense fallback={null}>
              <ReviewSection onOpenContact={() => setIsContactOpen(true)} />
            </Suspense>

            {/* Storytelling Section */}
            <section id="why-dcard" className="mt-10 mb-8 select-none py-10 md:py-12 border-t border-slate-200 dark:border-secondary/15">
              <div className="w-full">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                  <div className="lg:col-span-7 space-y-6 text-left">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-secondary/10 text-secondary dark:text-roseGold text-[10px] font-black tracking-widest uppercase rounded-full select-none">
                      💎 ADVANCED TRANSPARENCY STANDARDS
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-black font-serif text-slate-900 dark:text-slate-100 tracking-tight mt-2 leading-tight">
                      Why We Built D.Card
                    </h2>
                    <p className="text-base text-secondary dark:text-roseGold font-bold leading-relaxed font-serif">
                      "Most Indians open bank accounts without understanding debit cards. D.Card helps people choose the right debit card before opening a bank account."
                    </p>
                    <div className="space-y-4 text-sm text-textSoft dark:text-slate-300 leading-relaxed font-medium font-sans">
                      <p>
                        Every day, thousands of account holders apply for banking services attracted by high-decibel advertisements showcasing "complimentary airport lounge access," "free dining vouchers," or "high cashback rewards." But the reality is buried inside 60-page PDF schedules of charges.
                      </p>
                      <p>
                        Average balance non-maintenance penalties, hidden quarterly SMS charges, transaction decline fees, and massive 3.5% foreign currency markup fees are designed to slice away your savings when you least expect it. 
                      </p>
                      <p>
                        We built D.Card to level the playing field. Our platform is completely independent. We hold zero commission arrangements with banking networks. Our proprietary algorithms analyze features, limits, and penalties strictly based on your lifestyle choices, student status, and spending metrics.
                      </p>
                    </div>
                    <div className="pt-4 border-t border-slate-100 dark:border-secondary/10 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-secondary/10 border border-secondary/15 flex items-center justify-center text-lg select-none">
                        🇮🇳
                      </div>
                      <div>
                        <p className="text-xs font-black text-slate-800 dark:text-slate-100 leading-none">Built for India's Next Generation</p>
                        <p className="text-[10px] text-textMuted dark:text-slate-400 font-extrabold uppercase mt-1">D.Card Founders Team</p>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { title: "Zero Commission Bias", desc: "No priority deals with banks. Every D.Card Score and matching percentage is calculated algorithmically.", icon: "🛡️", score: "100% Unbiased" },
                      { title: "Profile Match Score", desc: "Real-time mathematical alignment indexing annual fees, balance terms, and perks to your stage of life.", icon: "🎯", score: "99.8% Accuracy" },
                      { title: "Verified Database", desc: "Monitored, checked, and cross-referenced with official regulatory schedules every 30 days.", icon: "✓", score: "Monthly Audited" },
                      { title: "100% Free To Use", desc: "Direct open-access comparison database designed to empower you with complete monetary clarity.", icon: "💎", score: "₹0 User Cost" }
                    ].map((item, idx) => (
                      <motion.div
                        key={idx}
                        whileHover={{ y: -4, scale: 1.02 }}
                        className="p-5 rounded-[2rem] bg-white/45 dark:bg-[#07030a]/45 backdrop-blur-xl border border-slate-200 dark:border-secondary/15 shadow-soft text-left flex flex-col justify-between min-h-[170px]"
                      >
                        <div>
                          <div className="w-10 h-10 rounded-xl bg-secondary/10 border border-secondary/15 flex items-center justify-center text-xl shadow-sm">
                            {item.icon}
                          </div>
                          <h4 className="text-xs font-black text-slate-800 dark:text-slate-100 uppercase mt-4 tracking-wider">{item.title}</h4>
                          <p className="text-xs text-textSoft dark:text-slate-400 mt-1.5 leading-relaxed font-semibold font-sans">{item.desc}</p>
                        </div>
                        <div className="mt-4 pt-2 border-t border-slate-100 dark:border-secondary/10 text-[10px] sm:text-[11px] font-black text-secondary dark:text-roseGold uppercase tracking-wider">
                          {item.score}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <Suspense fallback={null}>
              <FaqSection />
            </Suspense>
          </main>
        </>
      )}

      <Footer 
        onOpenLegal={(tab) => { setLegalTab(tab); setIsLegalOpen(true); }}
        onOpenAbout={() => setIsAboutOpen(true)}
        onOpenContact={() => setIsContactOpen(true)}
      />
      
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

        <WishlistDrawer 
          isOpen={isWishlistOpen} 
          onClose={() => setIsWishlistOpen(false)} 
          onViewDetails={handleSelectCardFromItem} 
        />
      </Suspense>

      <Suspense fallback={null}>
        {isContactOpen && <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />}
        {isAboutOpen && <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />}
        {isLegalOpen && <LegalModal isOpen={isLegalOpen} onClose={() => setIsLegalOpen(false)} initialTab={legalTab} />}
        <AIChatAssistant onOpenContact={() => setIsContactOpen(true)} />
        {isAdminOpen && <AdminDashboardModal isOpen={isAdminOpen} onClose={() => setIsAdminOpen(false)} currentUser={user} />}
        {isAdminLoginOpen && <AdminLoginPage isOpen={isAdminLoginOpen} onClose={() => setIsAdminLoginOpen(false)} />}
        {isAccessDeniedOpen && <AccessDeniedModal isOpen={isAccessDeniedOpen} onClose={() => setIsAccessDeniedOpen(false)} onOpenAuth={() => openAuthModal('login')} />}
      </Suspense>

      {/* Mobile Floating Filters Trigger Button */}
      {currentView === 'home' && (
        <div className="fixed bottom-24 right-6 z-40 md:hidden">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsMobileFilterOpen(true)}
            aria-label="Toggle mobile filter sidebar"
            className="flex items-center gap-2 px-5 py-3.5 rounded-full bg-gradient-to-r from-[#A30D62] to-[#C21875] text-white font-bold shadow-[0_8px_30px_rgba(163,13,98,0.4)] border border-white/20 text-sm select-none cursor-pointer"
          >
            <span>🎯</span> Filters
            {totalActiveFiltersCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-white text-[#A30D62] text-[10px] font-black flex items-center justify-center shadow-sm">
                {totalActiveFiltersCount}
              </span>
            )}
          </motion.button>
        </div>
      )}

      {/* Mobile Filters Bottom Drawer Sheet */}
      <AnimatePresence>
        {isMobileFilterOpen && (
          <FilterSidebar
            isMobile={true}
            onCloseMobile={() => setIsMobileFilterOpen(false)}
            activeFilters={activeFilters}
            toggleFilter={toggleFilter}
            clearFilters={clearFilters}
            onResetFilters={handleResetFilters}
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
            resultCount={filteredCards.length}
            selectedCategories={selectedCategories}
            toggleCategory={toggleCategory}
            selectedUserTypes={selectedUserTypes}
            toggleUserType={toggleUserType}
            selectedBankTypes={selectedBankTypes}
            toggleBankType={toggleBankType}
            selectedFeeTier={selectedFeeTier}
            setFeeTier={setSelectedFeeTier}
            selectedAtmLimitTier={selectedAtmLimitTier}
            setAtmLimitTier={setSelectedAtmLimitTier}
            selectedPosLimitTier={selectedPosLimitTier}
            setPosLimitTier={setSelectedPosLimitTier}
            selectedFeatures={selectedFeatures}
            toggleFeature={toggleFeature}
            onLoadPreset={handleLoadPreset}
            userProfile={userProfile}
            onApplyProfilePreset={handleApplyProfilePreset}
          />
        )}
      </AnimatePresence>

      <ComparisonDock
        compareQueue={compareQueue}
        onRemove={(cardId) => setCompareQueue(prev => prev.filter(c => String(c.id) !== String(cardId)))}
        onCompareNow={() => {
          setIsComparing(true);
          document.getElementById('comparison')?.scrollIntoView({ behavior: 'smooth' });
        }}
        onClear={() => {
          setCompareQueue([]);
          setIsComparing(false);
        }}
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
            <AppInner />
          </WishlistProvider>
        </AuthProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default App;
