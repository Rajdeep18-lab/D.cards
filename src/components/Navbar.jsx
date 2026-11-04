import { useState, useEffect, useRef } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { 
  Sun, 
  Moon, 
  LogIn, 
  Bell, 
  Heart, 
  Menu, 
  X, 
  User, 
  LogOut, 
  ChevronDown,
  Scale,
  Sparkles,
  CreditCard,
  Landmark,
  Briefcase,
  Bot,
  Building2,
  Compass,
  Info
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useWishlist } from "../context/WishlistContext";
import { useLanguage } from "../context/LanguageContext";
import TopDisclaimerTicker from "./TopDisclaimerTicker";
import LanguageSelector from "./LanguageSelector";
import ToranGarland from "./festive/ToranGarland";
import DiyaIllustration from "./festive/DiyaIllustration";
import { FESTIVE_CONFIG } from "../config/festiveConfig";

function Navbar({ 
  isDarkMode, 
  toggleDarkMode, 
  onOpenAuth, 
  compareCount = 0, 
  onOpenLegal,
  unreadNotificationCount = 0,
  unreadCount: propUnreadCount
}) {
  const { user, profile, logout, openAuthModal } = useAuth();
  const { wishlist } = useWishlist();
  const { t, isHindi } = useLanguage();
  const location = useLocation();

  const [scrolled, setScrolled] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isMoreDropdownOpen, setIsMoreDropdownOpen] = useState(false);

  // Unread notifications state - defaults to 0 (no fake/hardcoded badges)
  const [unreadCount, setUnreadCount] = useState(
    typeof propUnreadCount === 'number'
      ? propUnreadCount
      : (typeof unreadNotificationCount === 'number' ? unreadNotificationCount : 0)
  );

  useEffect(() => {
    if (typeof propUnreadCount === 'number') {
      setUnreadCount(propUnreadCount);
    } else if (typeof unreadNotificationCount === 'number') {
      setUnreadCount(unreadNotificationCount);
    }
  }, [propUnreadCount, unreadNotificationCount]);

  const favoritesCount = Array.isArray(wishlist) ? wishlist.length : 0;

  const profileDropdownRef = useRef(null);
  const moreDropdownRef = useRef(null);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close all menus on route change
  useEffect(() => {
    setIsMobileDrawerOpen(false);
    setIsProfileDropdownOpen(false);
    setIsMoreDropdownOpen(false);
  }, [location.pathname]);

  // Click outside listener for dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
      if (moreDropdownRef.current && !moreDropdownRef.current.contains(event.target)) {
        setIsMoreDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Prevent background page scrolling when mobile drawer is open
  useEffect(() => {
    if (isMobileDrawerOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isMobileDrawerOpen]);

  // Support Escape key to close mobile drawer and dropdowns
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (isMobileDrawerOpen) setIsMobileDrawerOpen(false);
        if (isProfileDropdownOpen) setIsProfileDropdownOpen(false);
        if (isMoreDropdownOpen) setIsMoreDropdownOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileDrawerOpen, isProfileDropdownOpen, isMoreDropdownOpen]);

  // Primary ordered list of all navigation routes
  const primaryNavItems = [
    { name: t('nav.home', "Home"), key: "home", path: "/", end: true, isProtected: false, icon: Sparkles },
    { name: t('nav.debitCards', "Debit Cards"), key: "cards", path: "/cards", isProtected: true, icon: CreditCard },
    { name: t('nav.savingsAccounts', "Savings Accounts"), key: "savings", path: "/savings-accounts", isProtected: true, icon: Landmark },
    { name: t('nav.currentAccounts', "Current Accounts"), key: "current", path: "/current-accounts", isProtected: true, isSecondary: true, icon: Briefcase },
    { name: t('nav.compare', "Compare"), key: "compare", path: "/compare", isProtected: true, icon: Scale },
    { name: t('nav.aiAssistance', "AI Assistance"), key: "ai", path: "/ai-advisor", isProtected: true, icon: Bot },
    { name: t('nav.banks', "Banks"), key: "banks", path: "/banks", isProtected: true, isSecondary: true, icon: Building2 },
    { name: t('nav.findMyBank', "Find My Bank"), key: "find-bank", path: "/find-my-bank", isProtected: false, isSecondary: true, icon: Compass },
    { name: t('nav.about', "About"), key: "about", path: "/about", isProtected: false, isSecondary: true, icon: Info },
  ];

  // Secondary items that tuck into "More ▾" on intermediate screen widths (1024px to 1399px)
  const secondaryNavKeys = ["current", "banks", "find-bank", "about"];
  const isMoreActive = secondaryNavKeys.some(k => {
    const item = primaryNavItems.find(p => p.key === k);
    return item && location.pathname.startsWith(item.path);
  });

  const handleProtectedClick = (e, path, isProtected) => {
    if (isProtected && !user) {
      e.preventDefault();
      if (isMobileDrawerOpen) setIsMobileDrawerOpen(false);
      if (openAuthModal) {
        openAuthModal('login', path);
      } else if (onOpenAuth) {
        onOpenAuth();
      }
    }
  };

  const handleAuthButtonClick = () => {
    if (openAuthModal) {
      openAuthModal('login');
    } else if (onOpenAuth) {
      onOpenAuth();
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full select-none shadow-xs relative bg-[#FFFDF9]/95 dark:bg-[#0F172A]/95 backdrop-blur-md">
      {/* ── Minimalistic Festive Marigold Toran Garland across Top Navigation ── */}
      {FESTIVE_CONFIG.isFestiveEnabled && <ToranGarland />}

      {/* ==================================================
          1. TOP: RUNNING DISCLAIMER / STATUTORY BAR
         ================================================== */}
      <TopDisclaimerTicker />

      {/* ==================================================
          2. MAIN NAVBAR: 3 CLEARLY DEFINED SECTIONS
             LEFT: Logo + Tagline
             CENTER: Campaign Link + Nav Links (with responsive More dropdown on intermediate screens)
             RIGHT: Language, Comparison, Dark Mode, Notifications, Login/Profile
         ================================================== */}
      <div
        className={`w-full transition-colors duration-200 h-[68px] sm:h-[72px] flex items-center border-b ${
          scrolled
            ? "border-amber-300/40 dark:border-slate-800 shadow-sm bg-[#FFFDF9]/95 dark:bg-[#0F172A]/95"
            : "border-amber-200/50 dark:border-slate-800/60 bg-[#FFFDF9]/90 dark:bg-[#0F172A]/90"
        }`}
      >
        <div className="w-full max-w-[1720px] mx-auto px-3 sm:px-4 lg:px-6 h-full flex items-center justify-between gap-2 lg:gap-3 xl:gap-4">
          
          {/* ══════════════════════════════════════════════
              LEFT SECTION: LOGO + TAGLINE + MOBILE TRIGGER
             ══════════════════════════════════════════════ */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Mobile/Tablet Hamburger Trigger (< 1024px) */}
            <button
              type="button"
              onClick={() => setIsMobileDrawerOpen(true)}
              className="w-11 h-11 flex items-center justify-center rounded-xl text-[#4B5563] dark:text-slate-300 hover:bg-amber-50 dark:hover:bg-slate-800 lg:hidden cursor-pointer shrink-0 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500"
              aria-label="Open Navigation Menu"
              aria-expanded={isMobileDrawerOpen}
            >
              <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            {/* D.CARD LOGO + BRAND TAGLINE */}
            <Link
              to="/"
              className="flex items-center gap-2 group text-left bg-transparent border-0 cursor-pointer focus:outline-none shrink-0"
              aria-label="D.CARD Home"
            >
              <img 
                src="/logo-mark.png" 
                alt="D.CARD Logo" 
                className="h-8 sm:h-9 w-auto object-contain group-hover:scale-105 transition-transform duration-300 shrink-0"
              />
              <div className="flex flex-col justify-center shrink-0">
                <span className="text-base sm:text-lg xl:text-xl font-extrabold tracking-tight leading-none text-[#0F172A] dark:text-white font-sans whitespace-nowrap">
                  D.<span className="text-[#2563EB]">CARD</span>
                </span>
                <span className="hidden min-[480px]:block text-[8px] sm:text-[8.5px] font-bold text-[#6B7280] dark:text-slate-400 tracking-wider uppercase mt-0.5 leading-tight whitespace-nowrap">
                  {t('nav.tagline', 'COMPARE. CHOOSE. BENEFIT.')}
                </span>
              </div>
              {/* Navbar Earthen Diya next to brand logo */}
              {FESTIVE_CONFIG.isFestiveEnabled && (
                <div className="hidden sm:inline-flex items-center ml-1 shrink-0">
                  <DiyaIllustration size={22} glow={true} animate={true} />
                </div>
              )}
            </Link>
          </div>

          {/* ══════════════════════════════════════════════
              CENTER SECTION: DESKTOP NAVIGATION (>= 1024px)
              Order:
              1. Dhanteras/Diwali campaign link
              2. Home
              3. Debit Cards
              4. Savings Accounts
              5. Current Accounts
              6. Compare
              7. AI Assistance
              8. Banks
              9. Find My Bank
              10. About
             ══════════════════════════════════════════════ */}
          <nav 
            aria-label="Primary Navigation"
            className="hidden lg:flex items-center justify-center gap-1 xl:gap-1.5 2xl:gap-2 flex-1 min-w-0 px-1"
          >
            {/* 1. Dhanteras/Diwali Campaign Link (Campaign pill strictly separated, never overlapping) */}
            {FESTIVE_CONFIG.isFestiveEnabled && FESTIVE_CONFIG.navbarFestiveBadgeEnabled && (
              <a
                href="#dhanteras-hero"
                onClick={(e) => {
                  if (location.pathname === '/') {
                    e.preventDefault();
                    const el = document.getElementById('dhanteras-hero');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="inline-flex items-center gap-1.5 px-2.5 xl:px-3 py-1 rounded-full bg-gradient-to-r from-[#8B1D24] via-[#A8252E] to-[#78151B] text-amber-200 border border-amber-400/60 text-[11px] xl:text-[11.5px] font-black tracking-wide shadow-[0_0_12px_rgba(245,158,11,0.3)] hover:shadow-[0_0_18px_rgba(245,158,11,0.5)] hover:scale-105 transition-all cursor-pointer shrink-0 mr-1 select-none"
                title={isHindi ? 'शुभ धनतेरस व दीपावली उत्सव' : 'Shubh Dhanteras & Diwali Special'}
              >
                <span className="text-amber-400 text-xs">🪔</span>
                <span className="whitespace-nowrap">{isHindi ? 'दिवाली स्पेशल' : 'Diwali Special'}</span>
              </a>
            )}

            {/* 2. Home */}
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `px-2 xl:px-2.5 py-1 text-[11.5px] xl:text-[12px] 2xl:text-[12.5px] font-semibold whitespace-nowrap transition-colors rounded-lg shrink-0 ${
                  isActive
                    ? 'text-amber-900 dark:text-amber-300 font-bold border-b-2 border-amber-500 pb-0.5'
                    : 'text-[#374151] dark:text-slate-300 hover:text-amber-800 dark:hover:text-amber-300'
                }`
              }
            >
              {t('nav.home', "Home")}
            </NavLink>

            {/* 3. Debit Cards */}
            <NavLink
              to="/cards"
              onClick={(e) => handleProtectedClick(e, '/cards', true)}
              className={({ isActive }) =>
                `px-2 xl:px-2.5 py-1 text-[11.5px] xl:text-[12px] 2xl:text-[12.5px] font-semibold whitespace-nowrap transition-colors rounded-lg shrink-0 ${
                  isActive
                    ? 'text-amber-900 dark:text-amber-300 font-bold border-b-2 border-amber-500 pb-0.5'
                    : 'text-[#374151] dark:text-slate-300 hover:text-amber-800 dark:hover:text-amber-300'
                }`
              }
            >
              {t('nav.debitCards', "Debit Cards")}
            </NavLink>

            {/* 4. Savings Accounts */}
            <NavLink
              to="/savings-accounts"
              onClick={(e) => handleProtectedClick(e, '/savings-accounts', true)}
              className={({ isActive }) =>
                `px-2 xl:px-2.5 py-1 text-[11.5px] xl:text-[12px] 2xl:text-[12.5px] font-semibold whitespace-nowrap transition-colors rounded-lg shrink-0 ${
                  isActive
                    ? 'text-amber-900 dark:text-amber-300 font-bold border-b-2 border-amber-500 pb-0.5'
                    : 'text-[#374151] dark:text-slate-300 hover:text-amber-800 dark:hover:text-amber-300'
                }`
              }
            >
              {t('nav.savingsAccounts', "Savings Accounts")}
            </NavLink>

            {/* 5. Current Accounts (Direct on screens >= 1400px; accessible in More on 1024px-1399px) */}
            <NavLink
              to="/current-accounts"
              onClick={(e) => handleProtectedClick(e, '/current-accounts', true)}
              className={({ isActive }) =>
                `hidden min-[1400px]:flex px-2 xl:px-2.5 py-1 text-[11.5px] xl:text-[12px] 2xl:text-[12.5px] font-semibold whitespace-nowrap transition-colors rounded-lg shrink-0 ${
                  isActive
                    ? 'text-amber-900 dark:text-amber-300 font-bold border-b-2 border-amber-500 pb-0.5'
                    : 'text-[#374151] dark:text-slate-300 hover:text-amber-800 dark:hover:text-amber-300'
                }`
              }
            >
              {t('nav.currentAccounts', "Current Accounts")}
            </NavLink>

            {/* 6. Compare */}
            <NavLink
              to="/compare"
              onClick={(e) => handleProtectedClick(e, '/compare', true)}
              className={({ isActive }) =>
                `px-2 xl:px-2.5 py-1 text-[11.5px] xl:text-[12px] 2xl:text-[12.5px] font-semibold whitespace-nowrap transition-colors rounded-lg shrink-0 flex items-center gap-1 ${
                  isActive
                    ? 'text-amber-900 dark:text-amber-300 font-bold border-b-2 border-amber-500 pb-0.5'
                    : 'text-[#374151] dark:text-slate-300 hover:text-amber-800 dark:hover:text-amber-300'
                }`
              }
            >
              <span>{t('nav.compare', "Compare")}</span>
              {compareCount > 0 && (
                <span className="inline-flex items-center justify-center px-1.5 py-0.2 text-[10px] font-extrabold rounded-full bg-emerald-500 text-white leading-none shadow-xs ml-0.5 shrink-0">
                  {compareCount}
                </span>
              )}
            </NavLink>

            {/* 7. AI Assistance */}
            <NavLink
              to="/ai-advisor"
              onClick={(e) => handleProtectedClick(e, '/ai-advisor', true)}
              className={({ isActive }) =>
                `px-2 xl:px-2.5 py-1 text-[11.5px] xl:text-[12px] 2xl:text-[12.5px] font-semibold whitespace-nowrap transition-colors rounded-lg shrink-0 ${
                  isActive
                    ? 'text-amber-900 dark:text-amber-300 font-bold border-b-2 border-amber-500 pb-0.5'
                    : 'text-[#374151] dark:text-slate-300 hover:text-amber-800 dark:hover:text-amber-300'
                }`
              }
            >
              {t('nav.aiAssistance', "AI Assistance")}
            </NavLink>

            {/* 8. Banks (Direct on screens >= 1400px; accessible in More on 1024px-1399px) */}
            <NavLink
              to="/banks"
              onClick={(e) => handleProtectedClick(e, '/banks', true)}
              className={({ isActive }) =>
                `hidden min-[1400px]:flex px-2 xl:px-2.5 py-1 text-[11.5px] xl:text-[12px] 2xl:text-[12.5px] font-semibold whitespace-nowrap transition-colors rounded-lg shrink-0 ${
                  isActive
                    ? 'text-amber-900 dark:text-amber-300 font-bold border-b-2 border-amber-500 pb-0.5'
                    : 'text-[#374151] dark:text-slate-300 hover:text-amber-800 dark:hover:text-amber-300'
                }`
              }
            >
              {t('nav.banks', "Banks")}
            </NavLink>

            {/* 9. Find My Bank (Direct on screens >= 1400px; accessible in More on 1024px-1399px) */}
            <NavLink
              to="/find-my-bank"
              className={({ isActive }) =>
                `hidden min-[1400px]:flex px-2 xl:px-2.5 py-1 text-[11.5px] xl:text-[12px] 2xl:text-[12.5px] font-semibold whitespace-nowrap transition-colors rounded-lg shrink-0 ${
                  isActive
                    ? 'text-amber-900 dark:text-amber-300 font-bold border-b-2 border-amber-500 pb-0.5'
                    : 'text-[#374151] dark:text-slate-300 hover:text-amber-800 dark:hover:text-amber-300'
                }`
              }
            >
              {t('nav.findMyBank', "Find My Bank")}
            </NavLink>

            {/* 10. About (Direct on screens >= 1400px; accessible in More on 1024px-1399px) */}
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `hidden min-[1400px]:flex px-2 xl:px-2.5 py-1 text-[11.5px] xl:text-[12px] 2xl:text-[12.5px] font-semibold whitespace-nowrap transition-colors rounded-lg shrink-0 ${
                  isActive
                    ? 'text-amber-900 dark:text-amber-300 font-bold border-b-2 border-amber-500 pb-0.5'
                    : 'text-[#374151] dark:text-slate-300 hover:text-amber-800 dark:hover:text-amber-300'
                }`
              }
            >
              {t('nav.about', "About")}
            </NavLink>

            {/* ── INTERMEDIATE RESPONSIVE "MORE ▾" DROPDOWN (1024px to 1399px) ── */}
            <div className="relative min-[1400px]:hidden shrink-0" ref={moreDropdownRef}>
              <button
                type="button"
                onClick={() => setIsMoreDropdownOpen(!isMoreDropdownOpen)}
                className={`px-2 py-1 text-[11.5px] xl:text-[12px] font-semibold rounded-lg flex items-center gap-1 transition-colors cursor-pointer ${
                  isMoreActive
                    ? 'text-amber-900 dark:text-amber-300 font-bold border-b-2 border-amber-500 pb-0.5'
                    : 'text-[#374151] dark:text-slate-300 hover:text-amber-800 dark:hover:text-amber-300'
                }`}
                aria-expanded={isMoreDropdownOpen}
                aria-label="More navigation links"
              >
                <span>{isHindi ? 'अधिक' : 'More'}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isMoreDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isMoreDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-52 rounded-2xl bg-white dark:bg-[#1E293B] border border-amber-200/60 dark:border-slate-700 shadow-xl py-2 z-50 text-left animate-in fade-in zoom-in-95 duration-150">
                  <NavLink
                    to="/current-accounts"
                    onClick={(e) => {
                      setIsMoreDropdownOpen(false);
                      handleProtectedClick(e, '/current-accounts', true);
                    }}
                    className={({ isActive }) =>
                      `flex items-center gap-2 px-4 py-2.5 text-xs font-semibold transition-colors ${
                        isActive
                          ? 'text-[#2563EB] bg-[#EFF6FF] dark:bg-slate-700/60 dark:text-[#60A5FA] font-bold'
                          : 'text-[#1F2937] dark:text-slate-200 hover:bg-amber-50/70 dark:hover:bg-slate-700/40'
                      }`
                    }
                  >
                    <Briefcase className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                    <span>{t('nav.currentAccounts', 'Current Accounts')}</span>
                  </NavLink>

                  <NavLink
                    to="/banks"
                    onClick={(e) => {
                      setIsMoreDropdownOpen(false);
                      handleProtectedClick(e, '/banks', true);
                    }}
                    className={({ isActive }) =>
                      `flex items-center gap-2 px-4 py-2.5 text-xs font-semibold transition-colors ${
                        isActive
                          ? 'text-[#2563EB] bg-[#EFF6FF] dark:bg-slate-700/60 dark:text-[#60A5FA] font-bold'
                          : 'text-[#1F2937] dark:text-slate-200 hover:bg-amber-50/70 dark:hover:bg-slate-700/40'
                      }`
                    }
                  >
                    <Building2 className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                    <span>{t('nav.banks', 'Banks')}</span>
                  </NavLink>

                  <NavLink
                    to="/find-my-bank"
                    onClick={() => setIsMoreDropdownOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-2 px-4 py-2.5 text-xs font-semibold transition-colors ${
                        isActive
                          ? 'text-[#2563EB] bg-[#EFF6FF] dark:bg-slate-700/60 dark:text-[#60A5FA] font-bold'
                          : 'text-[#1F2937] dark:text-slate-200 hover:bg-amber-50/70 dark:hover:bg-slate-700/40'
                      }`
                    }
                  >
                    <Compass className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                    <span>{t('nav.findMyBank', 'Find My Bank')}</span>
                  </NavLink>

                  <NavLink
                    to="/about"
                    onClick={() => setIsMoreDropdownOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-2 px-4 py-2.5 text-xs font-semibold transition-colors ${
                        isActive
                          ? 'text-[#2563EB] bg-[#EFF6FF] dark:bg-slate-700/60 dark:text-[#60A5FA] font-bold'
                          : 'text-[#1F2937] dark:text-slate-200 hover:bg-amber-50/70 dark:hover:bg-slate-700/40'
                      }`
                    }
                  >
                    <Info className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                    <span>{t('nav.about', 'About')}</span>
                  </NavLink>
                </div>
              )}
            </div>
          </nav>

          {/* ══════════════════════════════════════════════
              RIGHT SECTION: UTILITY CONTROLS
              Order:
              1. Language selector
              2. Comparison icon
              3. Dark mode toggle
              4. Notifications
              5. Login/Profile button
             ══════════════════════════════════════════════ */}
          <div className="flex items-center gap-1.5 sm:gap-2 xl:gap-2.5 shrink-0 justify-end">
            
            {/* 1. Language Selector (English / हिंदी) */}
            <LanguageSelector variant="dropdown" />

            {/* 2. Comparison Icon (Scales-of-Justice symbol with live compare badge) */}
            <Link
              to="/compare"
              onClick={(e) => handleProtectedClick(e, '/compare', true)}
              className="relative w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center rounded-xl text-[#4B5563] dark:text-slate-300 hover:text-[#2563EB] hover:bg-amber-50/80 dark:hover:bg-slate-800 transition-all cursor-pointer group shrink-0"
              title={t('nav.compare', 'Compare Products')}
              aria-label={`Compare Products (${compareCount})`}
            >
              <img 
                src="/assets/legal-scales.png" 
                alt="Compare" 
                className="w-4 h-4 sm:w-5 sm:h-5 object-contain transition-transform group-hover:scale-110 shrink-0" 
              />
              {compareCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[16px] h-[16px] px-1 flex items-center justify-center text-[9px] font-extrabold rounded-full bg-emerald-500 text-white leading-none shadow-xs pointer-events-none">
                  {compareCount}
                </span>
              )}
            </Link>

            {/* 3. Dark Mode Toggle */}
            <button
              type="button"
              onClick={toggleDarkMode}
              className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center rounded-xl text-[#4B5563] dark:text-slate-300 hover:text-amber-600 hover:bg-amber-50/80 dark:hover:bg-slate-800 transition-all cursor-pointer shrink-0 focus:outline-none focus:ring-2 focus:ring-amber-500"
              title={isDarkMode ? t('nav.lightMode', "Switch to Light Mode") : t('nav.darkMode', "Switch to Dark Mode")}
              aria-label="Toggle Dark Mode"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-[#2563EB]" />}
            </button>

            {/* 4. Notification Button (Bell) */}
            <Link
              to="/saved-cards"
              onClick={(e) => handleProtectedClick(e, '/saved-cards', true)}
              className="relative w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center rounded-xl text-[#4B5563] dark:text-slate-300 hover:text-[#2563EB] hover:bg-amber-50/80 dark:hover:bg-slate-800 transition-all group shrink-0 focus:outline-none focus:ring-2 focus:ring-amber-500"
              title={t('nav.notifications', 'Notifications')}
              aria-label={t('nav.notifications', 'Notifications')}
            >
              <Bell className="w-4 h-4 text-[#4B5563] dark:text-slate-300 group-hover:text-[#2563EB] dark:group-hover:text-[#60A5FA] transition-all shrink-0" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[16px] h-[16px] px-1 flex items-center justify-center text-[9px] font-extrabold rounded-full bg-rose-500 text-white leading-none shadow-xs pointer-events-none">
                  {unreadCount}
                </span>
              )}
            </Link>

            {/* 5. User Profile / Login Dropdown Button */}
            {user ? (
              <div className="relative shrink-0" ref={profileDropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center gap-1.5 sm:gap-2 p-1 pr-2 sm:pr-2.5 rounded-full border border-amber-300/60 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-[#2563EB] dark:hover:border-[#60A5FA] transition-all cursor-pointer shadow-xs shrink-0 max-w-[130px] sm:max-w-[160px] focus:outline-none focus:ring-2 focus:ring-amber-500"
                  aria-expanded={isProfileDropdownOpen}
                  aria-label="User Account Menu"
                >
                  <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gradient-to-r from-[#2563EB] to-[#3B82F6] text-white flex items-center justify-center font-bold text-xs shadow-xs shrink-0">
                    {user.email ? user.email.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="hidden sm:inline-block text-xs font-bold text-[#1F2937] dark:text-white max-w-[65px] md:max-w-[80px] xl:max-w-[95px] truncate whitespace-nowrap overflow-hidden text-ellipsis">
                    {profile?.full_name || user.displayName || 'Rajdeep'}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                </button>

                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-slate-700 shadow-xl py-2 z-[60] text-left animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-4 py-2 border-b border-gray-100 dark:border-slate-800">
                      <p className="text-xs font-bold text-[#1F2937] dark:text-white truncate">
                        {profile?.full_name || user.displayName || 'Rajdeep'}
                      </p>
                      <p className="text-[11px] text-gray-500 dark:text-slate-400 truncate">
                        {user.email}
                      </p>
                    </div>
                    <Link
                      to="/profile"
                      onClick={() => setIsProfileDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-[#1F2937] dark:text-white hover:bg-[#EFF6FF] dark:hover:bg-slate-700/60 transition-colors"
                    >
                      <User className="w-3.5 h-3.5 text-[#2563EB]" />
                      <span>Profile Dashboard</span>
                    </Link>
                    <Link
                      to="/saved-cards"
                      onClick={() => setIsProfileDropdownOpen(false)}
                      className="flex items-center justify-between px-4 py-2 text-xs font-semibold text-[#1F2937] dark:text-white hover:bg-[#EFF6FF] dark:hover:bg-slate-700/60 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <Heart className="w-3.5 h-3.5 text-rose-500" />
                        <span>Saved Favourites</span>
                      </div>
                      {favoritesCount > 0 && (
                        <span className="px-1.5 py-0.2 text-[10px] font-extrabold rounded-full bg-rose-500 text-white">
                          {favoritesCount}
                        </span>
                      )}
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        setIsProfileDropdownOpen(false);
                        logout();
                      }}
                      className="w-full text-left flex items-center gap-2 px-4 py-2 text-xs font-semibold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5 text-rose-500" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={handleAuthButtonClick}
                className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#3B82F6] hover:opacity-95 text-white text-xs font-semibold shadow-md flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 shrink-0 whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <LogIn className="w-3.5 h-3.5 shrink-0" />
                <span>Login</span>
              </button>
            )}

          </div>

        </div>
      </div>

      {/* ==================================================
          3. MOBILE & TABLET SLIDE-OVER DRAWER (< 1024px)
             Full-featured responsive navigation drawer with
             backdrop, scroll lock, clear close button,
             accessible keyboard handling, and all links.
         ================================================== */}
      {isMobileDrawerOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden" role="dialog" aria-modal="true" aria-label="Navigation Menu">
          {/* Backdrop overlay */}
          <div
            onClick={() => setIsMobileDrawerOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            aria-hidden="true"
          />

          {/* Drawer container (Slide-over from left) */}
          <div className="fixed inset-y-0 left-0 w-[85vw] max-w-sm sm:max-w-md bg-[#FFFDF9] dark:bg-[#0F172A] border-r border-amber-200/50 dark:border-slate-800 shadow-2xl flex flex-col justify-between overflow-hidden z-[101] text-left">
            
            {/* 1. Drawer Header */}
            <div className="flex items-center justify-between px-4 sm:px-5 py-4 border-b border-amber-200/40 dark:border-slate-800 shrink-0 bg-amber-50/20 dark:bg-slate-900/40">
              <Link 
                to="/" 
                onClick={() => setIsMobileDrawerOpen(false)}
                className="flex items-center gap-2"
                aria-label="D.CARD Home"
              >
                <img src="/logo-mark.png" alt="D.CARD Logo" className="h-8 w-auto object-contain" />
                <div className="flex flex-col">
                  <span className="text-base font-extrabold text-[#0F172A] dark:text-white">
                    D.<span className="text-[#2563EB]">CARD</span>
                  </span>
                  <span className="text-[8px] font-bold text-[#6B7280] dark:text-slate-400 uppercase tracking-wider">
                    {t('nav.tagline', 'COMPARE. CHOOSE. BENEFIT.')}
                  </span>
                </div>
              </Link>
              <button
                type="button"
                onClick={() => setIsMobileDrawerOpen(false)}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-500"
                aria-label="Close navigation menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 2. Scrollable Navigation Body */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 overscroll-contain">
              
              {/* Mobile Festive Greeting Banner */}
              {FESTIVE_CONFIG.isFestiveEnabled && FESTIVE_CONFIG.navbarFestiveBadgeEnabled && (
                <a
                  href="#dhanteras-hero"
                  onClick={(e) => {
                    setIsMobileDrawerOpen(false);
                    if (location.pathname === '/') {
                      e.preventDefault();
                      const el = document.getElementById('dhanteras-hero');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="block p-3 rounded-2xl bg-gradient-to-r from-[#8B1D24] via-[#A8252E] to-[#78151B] text-amber-200 border border-amber-400/50 shadow-md text-xs font-bold select-none cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <span className="text-base">🪔</span>
                      <span>{isHindi ? FESTIVE_CONFIG.navbarAccent.badgeTextHi : FESTIVE_CONFIG.navbarAccent.badgeText}</span>
                    </span>
                    <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-200">
                      ➔
                    </span>
                  </div>
                </a>
              )}

              {/* Main Navigation Links */}
              <div>
                <div className="text-[10.5px] font-extrabold uppercase tracking-wider text-amber-800/70 dark:text-amber-400/70 px-2 mb-2">
                  {isHindi ? 'नेविगेशन मेनू' : 'Main Navigation'}
                </div>

                <div className="space-y-1">
                  {primaryNavItems.map((link) => {
                    const IconComponent = link.icon;
                    return (
                      <NavLink
                        key={link.name}
                        to={link.path}
                        end={link.end}
                        onClick={(e) => {
                          if (link.isProtected && !user) {
                            handleProtectedClick(e, link.path, true);
                          } else {
                            setIsMobileDrawerOpen(false);
                          }
                        }}
                        className={({ isActive }) =>
                          `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all min-h-[44px] ${
                            isActive
                              ? 'bg-amber-100/90 dark:bg-slate-800 text-amber-950 dark:text-amber-300 font-bold border border-amber-300/80 dark:border-amber-500/40 shadow-xs'
                              : 'text-[#1F2937] dark:text-slate-200 hover:bg-amber-50/70 dark:hover:bg-slate-800/60'
                          }`
                        }
                      >
                        <div className="flex items-center gap-2.5">
                          {IconComponent && <IconComponent className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />}
                          <span>{link.name}</span>
                        </div>
                        {link.key === "compare" && compareCount > 0 && (
                          <span className="px-2 py-0.5 text-[10px] font-extrabold rounded-full bg-emerald-500 text-white shadow-xs">
                            {compareCount}
                          </span>
                        )}
                      </NavLink>
                    );
                  })}
                </div>
              </div>

              {/* Legal & Terms Link */}
              <button
                type="button"
                onClick={() => {
                  setIsMobileDrawerOpen(false);
                  if (onOpenLegal) onOpenLegal('terms');
                }}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-[#1F2937] dark:text-slate-200 hover:bg-amber-50/70 dark:hover:bg-slate-800/60 cursor-pointer text-left min-h-[44px]"
              >
                <div className="flex items-center gap-2.5">
                  <img 
                    src="/assets/legal-scales.png" 
                    alt="Legal" 
                    className="w-[18px] h-[18px] object-contain shrink-0" 
                  />
                  <span>{t('nav.legalAndTerms', 'Legal & Terms')}</span>
                </div>
              </button>

              {/* Language Switcher in Mobile Drawer */}
              <div className="pt-3 border-t border-amber-200/40 dark:border-slate-800 space-y-2">
                <div className="text-[10.5px] font-extrabold uppercase tracking-wider text-amber-800/70 dark:text-amber-400/70 px-2">
                  {t('nav.selectLanguage', 'Language / भाषा')}
                </div>
                <div className="px-1">
                  <LanguageSelector variant="inline" />
                </div>
              </div>

              {/* Account & Profile Quick Actions */}
              <div className="pt-3 border-t border-amber-200/40 dark:border-slate-800 space-y-1">
                <div className="text-[10.5px] font-extrabold uppercase tracking-wider text-amber-800/70 dark:text-amber-400/70 px-2 mb-1">
                  {t('nav.accountAndUtilities', 'Account & Utilities')}
                </div>

                <NavLink
                  to="/profile"
                  onClick={(e) => {
                    if (!user) {
                      handleProtectedClick(e, '/profile', true);
                    } else {
                      setIsMobileDrawerOpen(false);
                    }
                  }}
                  className={({ isActive }) =>
                    `flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold min-h-[44px] ${
                      isActive 
                        ? 'bg-[#2563EB] text-white font-bold' 
                        : 'text-[#1F2937] dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-800'
                    }`
                  }
                >
                  <User className="w-4 h-4 text-[#2563EB]" />
                  <span>{t('nav.myProfile', 'My Profile')}</span>
                </NavLink>

                <Link
                  to="/saved-cards"
                  onClick={(e) => {
                    if (!user) {
                      handleProtectedClick(e, '/saved-cards', true);
                    } else {
                      setIsMobileDrawerOpen(false);
                    }
                  }}
                  className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-[#1F2937] dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-800 min-h-[44px]"
                >
                  <div className="flex items-center gap-2.5">
                    <Heart className="w-4 h-4 text-rose-500" />
                    <span>{t('nav.savedFavourites', 'Saved Favourites')}</span>
                  </div>
                  {favoritesCount > 0 && (
                    <span className="px-2 py-0.5 text-[10px] font-extrabold rounded-full bg-rose-500 text-white">
                      {favoritesCount}
                    </span>
                  )}
                </Link>

                {user ? (
                  <button
                    type="button"
                    onClick={() => {
                      setIsMobileDrawerOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 cursor-pointer text-left min-h-[44px]"
                  >
                    <LogOut className="w-4 h-4 text-rose-500" />
                    <span>{t('nav.signOut', 'Sign Out')} ({user.email})</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setIsMobileDrawerOpen(false);
                      handleAuthButtonClick();
                    }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold text-xs shadow-md mt-2 cursor-pointer min-h-[44px] transition-all"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>{t('nav.signInRegister', 'Sign In / Register')}</span>
                  </button>
                )}
              </div>

            </div>

            {/* 3. Drawer Bottom Bar */}
            <div className="px-5 py-3 border-t border-amber-200/40 dark:border-slate-800 shrink-0 bg-amber-50/40 dark:bg-slate-900/40 flex items-center justify-between text-[11px] text-[#6B7280] dark:text-slate-400">
              <span>D.CARD Fintech Platform</span>
              <button
                type="button"
                onClick={toggleDarkMode}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold cursor-pointer"
              >
                {isDarkMode ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-[#2563EB]" />}
                <span>{isDarkMode ? "Light" : "Dark"}</span>
              </button>
            </div>

          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
