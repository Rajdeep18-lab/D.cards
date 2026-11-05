import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Link, NavLink, useLocation } from "react-router-dom";
import { 
  Sun, 
  Moon, 
  LogIn, 
  Heart, 
  Menu, 
  X, 
  User, 
  LogOut, 
  ChevronDown,
  MoreHorizontal,
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
import DiyaIllustration from "./festive/DiyaIllustration";
import { FESTIVE_CONFIG } from "../config/festiveConfig";

function Navbar({ 
  isDarkMode, 
  toggleDarkMode, 
  onOpenAuth, 
  compareCount = 0, 
  onOpenLegal
}) {
  const { user, profile, logout, openAuthModal } = useAuth();
  const { wishlist } = useWishlist();
  const { t, isHindi } = useLanguage();
  const location = useLocation();

  const [scrolled, setScrolled] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isMoreDropdownOpen, setIsMoreDropdownOpen] = useState(false);

  // Live count of saved favourites
  const favoritesCount = Array.isArray(wishlist) ? wishlist.length : 0;

  const profileDropdownRef = useRef(null);
  const moreDropdownRef = useRef(null);

  // Handle subtle scroll elevation
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

  // Secondary items that tuck into "More ▾" on intermediate screen widths (< 1400px)
  const moreNavPaths = ["/ai-advisor", "/banks", "/about"];
  const isMoreActive = moreNavPaths.some(p => location.pathname.startsWith(p));

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
    <header className="sticky top-0 z-50 w-full select-none shadow-xs relative bg-[#FFF9EE] dark:bg-[#0B132B]">
      
      {/* ==================================================
          1. TOP: RUNNING DISCLAIMER / STATUTORY BAR
         ================================================== */}
      <TopDisclaimerTicker />

      {/* ==================================================
          2. MAIN NAVBAR: 3 CLEARLY DEFINED SECTIONS
             LEFT: Hamburger (mobile) + Logo + Tagline
             CENTER: Primary Nav Links (responsive More on intermediate)
             RIGHT: Language, Scale, Dark Mode, Heart (Saved), Login/Profile
         ================================================== */}
      <div
        className={`w-full transition-colors duration-200 h-16 sm:h-[70px] flex items-center border-b ${
          scrolled
            ? "border-[#E8D6B3] dark:border-amber-900/40 shadow-xs bg-[#FFF9EE] dark:bg-[#0B132B]"
            : "border-[#E8D6B3]/70 dark:border-amber-900/30 bg-[#FFF9EE] dark:bg-[#0B132B]"
        }`}
      >
        <div className="w-full max-w-[1720px] mx-auto px-2 sm:px-4 lg:px-6 h-full flex items-center justify-between gap-1.5 sm:gap-2.5 lg:gap-3 xl:gap-4">
          
          {/* ══════════════════════════════════════════════
              LEFT SECTION: LOGO + TAGLINE + MOBILE TRIGGER
             ══════════════════════════════════════════════ */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0 z-10 pr-1">
            {/* Mobile/Tablet Hamburger Trigger (< 1024px) */}
            <button
              type="button"
              onClick={() => setIsMobileDrawerOpen(true)}
              className="w-8 h-8 min-[380px]:w-9 min-[380px]:h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg sm:rounded-xl text-[#111827] dark:text-slate-200 hover:bg-black/5 dark:hover:bg-white/5 lg:hidden cursor-pointer shrink-0 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500"
              aria-label="Open Navigation Menu"
              aria-expanded={isMobileDrawerOpen}
            >
              <Menu className="w-4.5 h-4.5 sm:w-5.5 sm:h-5.5" />
            </button>

            {/* D.CARD LOGO + BRAND TAGLINE */}
            <Link
              to="/"
              className="flex items-center gap-1.5 sm:gap-2 group text-left bg-transparent border-0 cursor-pointer focus:outline-none shrink-0"
              aria-label="D.CARD Home"
            >
              <img 
                src="/logo-mark.png" 
                alt="D.CARD Logo" 
                className="h-7 sm:h-8 max-h-8 w-auto object-contain group-hover:scale-105 transition-transform duration-200 shrink-0"
              />
              <div className="flex flex-col justify-center shrink-0">
                <span className="text-[15px] sm:text-lg xl:text-xl font-black tracking-tight leading-none text-[#111827] dark:text-white font-sans whitespace-nowrap">
                  D.<span className="text-[#2455A4] dark:text-[#60A5FA]">CARD</span>
                </span>
                <span className="hidden xl:block text-[8px] sm:text-[8.5px] font-bold text-[#6B7280] dark:text-slate-400 tracking-wider uppercase mt-0.5 leading-tight whitespace-nowrap">
                  {t('nav.tagline', 'COMPARE. CHOOSE. BENEFIT.')}
                </span>
              </div>
              {/* Navbar Earthen Diya next to brand logo on desktop/tablet */}
              {FESTIVE_CONFIG.isFestiveEnabled && (
                <div className="hidden sm:inline-flex items-center ml-1.5 shrink-0">
                  <DiyaIllustration size={20} glow={false} animate={true} />
                </div>
              )}
            </Link>
          </div>

          {/* ══════════════════════════════════════════════
              CENTER SECTION: DESKTOP NAVIGATION (>= 1024px)
             ══════════════════════════════════════════════ */}
          <nav 
            aria-label="Primary Navigation"
            className="hidden lg:flex items-center justify-center gap-0.5 xl:gap-1 2xl:gap-1.5 flex-1 min-w-0 px-1"
          >
            {/* 1. Home */}
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `px-2 xl:px-2.5 2xl:px-3 py-1.5 text-[12px] xl:text-[12.5px] 2xl:text-[13px] font-semibold whitespace-nowrap transition-colors rounded-lg shrink-0 ${
                  isActive
                    ? 'text-[#B8860B] dark:text-[#F5DFA8] font-bold border-b-2 border-[#D6A64B] pb-0.5'
                    : 'text-[#111827] dark:text-slate-200 hover:text-[#B8860B] dark:hover:text-[#F5DFA8]'
                }`
              }
            >
              {t('nav.home', "Home")}
            </NavLink>

            {/* 2. Debit Cards */}
            <NavLink
              to="/cards"
              onClick={(e) => handleProtectedClick(e, '/cards', true)}
              className={({ isActive }) =>
                `px-2 xl:px-2.5 2xl:px-3 py-1.5 text-[12px] xl:text-[12.5px] 2xl:text-[13px] font-semibold whitespace-nowrap transition-colors rounded-lg shrink-0 ${
                  isActive
                    ? 'text-[#B8860B] dark:text-[#F5DFA8] font-bold border-b-2 border-[#D6A64B] pb-0.5'
                    : 'text-[#111827] dark:text-slate-200 hover:text-[#B8860B] dark:hover:text-[#F5DFA8]'
                }`
              }
            >
              {t('nav.debitCards', "Debit Cards")}
            </NavLink>

            {/* 3. Savings Accounts */}
            <NavLink
              to="/savings-accounts"
              onClick={(e) => handleProtectedClick(e, '/savings-accounts', true)}
              className={({ isActive }) =>
                `px-2 xl:px-2.5 2xl:px-3 py-1.5 text-[12px] xl:text-[12.5px] 2xl:text-[13px] font-semibold whitespace-nowrap transition-colors rounded-lg shrink-0 ${
                  isActive
                    ? 'text-[#B8860B] dark:text-[#F5DFA8] font-bold border-b-2 border-[#D6A64B] pb-0.5'
                    : 'text-[#111827] dark:text-slate-200 hover:text-[#B8860B] dark:hover:text-[#F5DFA8]'
                }`
              }
            >
              {t('nav.savingsAccounts', "Savings Accounts")}
            </NavLink>

            {/* 4. Current Accounts */}
            <NavLink
              to="/current-accounts"
              onClick={(e) => handleProtectedClick(e, '/current-accounts', true)}
              className={({ isActive }) =>
                `px-2 xl:px-2.5 2xl:px-3 py-1.5 text-[12px] xl:text-[12.5px] 2xl:text-[13px] font-semibold whitespace-nowrap transition-colors rounded-lg shrink-0 ${
                  isActive
                    ? 'text-[#B8860B] dark:text-[#F5DFA8] font-bold border-b-2 border-[#D6A64B] pb-0.5'
                    : 'text-[#111827] dark:text-slate-200 hover:text-[#B8860B] dark:hover:text-[#F5DFA8]'
                }`
              }
            >
              {t('nav.currentAccounts', "Current Accounts")}
            </NavLink>

            {/* 5. Compare */}
            <NavLink
              to="/compare"
              onClick={(e) => handleProtectedClick(e, '/compare', true)}
              className={({ isActive }) =>
                `px-2 xl:px-2.5 2xl:px-3 py-1.5 text-[12px] xl:text-[12.5px] 2xl:text-[13px] font-semibold whitespace-nowrap transition-colors rounded-lg shrink-0 flex items-center gap-1 ${
                  isActive
                    ? 'text-[#B8860B] dark:text-[#F5DFA8] font-bold border-b-2 border-[#D6A64B] pb-0.5'
                    : 'text-[#111827] dark:text-slate-200 hover:text-[#B8860B] dark:hover:text-[#F5DFA8]'
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

            {/* 6. Find My Bank */}
            <NavLink
              to="/find-my-bank"
              className={({ isActive }) =>
                `px-2 xl:px-2.5 2xl:px-3 py-1.5 text-[12px] xl:text-[12.5px] 2xl:text-[13px] font-semibold whitespace-nowrap transition-colors rounded-lg shrink-0 ${
                  isActive
                    ? 'text-[#B8860B] dark:text-[#F5DFA8] font-bold border-b-2 border-[#D6A64B] pb-0.5'
                    : 'text-[#111827] dark:text-slate-200 hover:text-[#B8860B] dark:hover:text-[#F5DFA8]'
                }`
              }
            >
              {t('nav.findMyBank', "Find My Bank")}
            </NavLink>

            {/* 7. THREE-DOT MORE DROPDOWN (Contains: AI Assistance, Banks, About Us) */}
            <div className="relative shrink-0" ref={moreDropdownRef}>
              <button
                type="button"
                onClick={() => setIsMoreDropdownOpen(!isMoreDropdownOpen)}
                className={`px-2 xl:px-2.5 py-1.5 text-[12px] xl:text-[12.5px] 2xl:text-[13px] font-semibold rounded-lg flex items-center gap-1 transition-colors cursor-pointer select-none ${
                  isMoreActive
                    ? 'text-[#B8860B] dark:text-[#F5DFA8] font-bold border-b-2 border-[#D6A64B] pb-0.5'
                    : 'text-[#111827] dark:text-slate-200 hover:text-[#B8860B] dark:hover:text-[#F5DFA8]'
                }`}
                aria-expanded={isMoreDropdownOpen}
                aria-label={isHindi ? "अधिक विकल्प" : "More options"}
              >
                <MoreHorizontal className="w-4 h-4 text-current shrink-0" />
                <span>{isHindi ? 'अधिक' : 'More'}</span>
                <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isMoreDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isMoreDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-52 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#E8D6B3] dark:border-slate-700 shadow-xl py-2 z-50 text-left animate-in fade-in zoom-in-95 duration-150">
                  {/* Item 1: AI Assistance */}
                  <NavLink
                    to="/ai-advisor"
                    onClick={(e) => {
                      setIsMoreDropdownOpen(false);
                      handleProtectedClick(e, '/ai-advisor', true);
                    }}
                    className={({ isActive }) =>
                      `flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold transition-colors ${
                        isActive
                          ? 'text-[#2455A4] bg-[#F7EEDC]/80 dark:bg-slate-700/60 dark:text-[#60A5FA] font-bold'
                          : 'text-[#111827] dark:text-slate-200 hover:bg-amber-50/70 dark:hover:bg-slate-700/40'
                      }`
                    }
                  >
                    <Bot className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                    <span>{t('nav.aiAssistance', 'AI Assistance')}</span>
                  </NavLink>

                  {/* Item 2: Banks */}
                  <NavLink
                    to="/banks"
                    onClick={(e) => {
                      setIsMoreDropdownOpen(false);
                      handleProtectedClick(e, '/banks', true);
                    }}
                    className={({ isActive }) =>
                      `flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold transition-colors ${
                        isActive
                          ? 'text-[#2455A4] bg-[#F7EEDC]/80 dark:bg-slate-700/60 dark:text-[#60A5FA] font-bold'
                          : 'text-[#111827] dark:text-slate-200 hover:bg-amber-50/70 dark:hover:bg-slate-700/40'
                      }`
                    }
                  >
                    <Building2 className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                    <span>{t('nav.banks', 'Banks')}</span>
                  </NavLink>

                  {/* Item 3: About Us */}
                  <NavLink
                    to="/about"
                    onClick={() => setIsMoreDropdownOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold transition-colors ${
                        isActive
                          ? 'text-[#2455A4] bg-[#F7EEDC]/80 dark:bg-slate-700/60 dark:text-[#60A5FA] font-bold'
                          : 'text-[#111827] dark:text-slate-200 hover:bg-amber-50/70 dark:hover:bg-slate-700/40'
                      }`
                    }
                  >
                    <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                    <span>{isHindi ? 'हमारे बारे में' : 'About Us'}</span>
                  </NavLink>
                </div>
              )}
            </div>

            {/* 8. 🪔 Dhanteras/Diwali Campaign Link */}
            {FESTIVE_CONFIG.isFestiveEnabled && FESTIVE_CONFIG.navbarFestiveBadgeEnabled && (
              <a
                href="#dhanteras-hero"
                onClick={(e) => {
                  if (location.pathname === '/') {
                    e.preventDefault();
                    const el = document.getElementById('dhanteras-hero') || document.getElementById('home');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-[#9A3412] via-[#C2410C] to-[#D97706] hover:from-[#C2410C] hover:to-[#9A3412] text-white border border-amber-300/40 text-[11px] font-bold tracking-wide shadow-sm hover:shadow-md hover:scale-105 transition-all cursor-pointer shrink-0 ml-1.5 xl:ml-2.5 mr-2 xl:mr-4 select-none"
                title={isHindi ? 'शुभ धनतेरस व दीपावली उत्सव' : 'Shubh Dhanteras & Diwali Special'}
              >
                <span className="text-xs">🪔</span>
                <span className="whitespace-nowrap">{isHindi ? 'दिवाली स्पेशल' : 'Diwali Special'}</span>
              </a>
            )}
          </nav>

          {/* ══════════════════════════════════════════════
              RIGHT SECTION: UTILITY CONTROLS
              Order:
              1. Language selector
              2. Comparison icon (sm+)
              3. Dark mode toggle (sm+)
              4. Saved Favourites (Heart Icon) (ALL screens)
              5. Login/Profile button
             ══════════════════════════════════════════════ */}
          <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2 shrink-0 justify-end z-10 pl-1">
            
            {/* 1. Language Selector (English / हिंदी) */}
            <LanguageSelector variant="dropdown" />

            {/* 2. Comparison Icon (Scales-of-Justice symbol with live compare badge) - hidden on mobile < 640px to prevent crowding */}
            <Link
              to="/compare"
              onClick={(e) => handleProtectedClick(e, '/compare', true)}
              className="hidden sm:flex relative w-9 h-9 sm:w-10 sm:h-10 items-center justify-center rounded-xl text-[#4B5563] dark:text-slate-300 hover:text-[#2455A4] hover:bg-black/5 dark:hover:bg-white/5 transition-all cursor-pointer group shrink-0"
              title={t('nav.compare', 'Compare Products')}
              aria-label={`Compare Products (${compareCount})`}
            >
              <Scale className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#4B5563] dark:text-slate-300 group-hover:text-[#2455A4] dark:group-hover:text-[#60A5FA] group-hover:scale-110 transition-transform shrink-0" strokeWidth={2} />
              {compareCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[16px] h-[16px] px-1 flex items-center justify-center text-[9px] font-extrabold rounded-full bg-emerald-500 text-white leading-none shadow-xs pointer-events-none">
                  {compareCount}
                </span>
              )}
            </Link>

            {/* 3. Dark Mode Toggle - hidden on mobile < 640px to prevent crowding */}
            <button
              type="button"
              onClick={toggleDarkMode}
              className="hidden sm:flex w-9 h-9 sm:w-10 sm:h-10 items-center justify-center rounded-xl text-[#4B5563] dark:text-slate-300 hover:text-amber-600 hover:bg-black/5 dark:hover:bg-white/5 transition-all cursor-pointer shrink-0 focus:outline-none focus:ring-2 focus:ring-amber-500"
              title={isDarkMode ? t('nav.lightMode', "Switch to Light Mode") : t('nav.darkMode', "Switch to Dark Mode")}
              aria-label="Toggle Dark Mode"
            >
              {isDarkMode ? (
                <Sun className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-amber-500 group-hover:scale-110 transition-transform shrink-0" />
              ) : (
                <Moon className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#2455A4] dark:text-[#60A5FA] group-hover:scale-110 transition-transform shrink-0" />
              )}
            </button>

            {/* 4. Saved Favourites Button (Heart Icon replacing old Bell icon) - accessible across mobile and desktop */}
            <Link
              to="/saved-cards"
              onClick={(e) => handleProtectedClick(e, '/saved-cards', true)}
              className="relative w-8 h-8 min-[380px]:w-9 min-[380px]:h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center text-[#4B5563] dark:text-slate-300 hover:text-rose-500 hover:bg-black/5 dark:hover:bg-white/5 transition-all group shrink-0 focus:outline-none focus:ring-2 focus:ring-rose-500/40"
              title={t('nav.savedFavourites', 'Saved Favourites')}
              aria-label={`Saved Favourites (${favoritesCount})`}
            >
              <Heart className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#4B5563] dark:text-slate-300 group-hover:text-rose-500 dark:group-hover:text-rose-400 group-hover:scale-110 transition-all shrink-0" strokeWidth={2} />
              {favoritesCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[15px] sm:min-w-[16px] h-[15px] sm:h-[16px] px-1 flex items-center justify-center text-[8.5px] sm:text-[9px] font-extrabold rounded-full bg-rose-500 text-white leading-none shadow-xs pointer-events-none animate-in zoom-in-75 duration-150">
                  {favoritesCount}
                </span>
              )}
            </Link>

            {/* 5. User Profile / Login Dropdown Button */}
            {user ? (
              <div className="relative shrink-0" ref={profileDropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center gap-1.5 sm:gap-2 p-1 pr-2 sm:pr-2.5 rounded-full border border-amber-300/60 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-[#2455A4] dark:hover:border-[#60A5FA] transition-all cursor-pointer shadow-xs shrink-0 max-w-[130px] sm:max-w-[160px] focus:outline-none focus:ring-2 focus:ring-amber-500"
                  aria-expanded={isProfileDropdownOpen}
                  aria-label="User Account Menu"
                >
                  <div className="w-7 h-7 sm:w-7.5 sm:h-7.5 rounded-full bg-gradient-to-r from-[#2455A4] to-[#3B82F6] text-white flex items-center justify-center font-bold text-xs shadow-xs shrink-0 overflow-hidden">
                    {user.photoURL || profile?.profileImage || profile?.avatar_url ? (
                      <img 
                        src={user.photoURL || profile?.profileImage || profile?.avatar_url} 
                        alt={profile?.full_name || user.displayName || 'User'} 
                        className="w-full h-full object-cover rounded-full" 
                      />
                    ) : (
                      user.email ? user.email.charAt(0).toUpperCase() : 'U'
                    )}
                  </div>
                  <span className="hidden sm:inline-block text-xs font-bold text-[#111827] dark:text-white max-w-[65px] md:max-w-[80px] xl:max-w-[95px] truncate whitespace-nowrap overflow-hidden text-ellipsis">
                    {profile?.full_name || user.displayName || 'Member'}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                </button>

                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#E8D6B3] dark:border-slate-700 shadow-xl py-2 z-[60] text-left animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-4 py-2 border-b border-gray-100 dark:border-slate-800">
                      <p className="text-xs font-bold text-[#111827] dark:text-white truncate">
                        {profile?.full_name || user.displayName || 'Member'}
                      </p>
                      <p className="text-[11px] text-gray-500 dark:text-slate-400 truncate">
                        {user.email}
                      </p>
                    </div>
                    <Link
                      to="/profile"
                      onClick={() => setIsProfileDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-[#111827] dark:text-white hover:bg-amber-50/70 dark:hover:bg-slate-700/60 transition-colors"
                    >
                      <User className="w-3.5 h-3.5 text-[#2455A4]" />
                      <span>{t('nav.myProfile', 'Profile Dashboard')}</span>
                    </Link>
                    <Link
                      to="/saved-cards"
                      onClick={() => setIsProfileDropdownOpen(false)}
                      className="flex items-center justify-between px-4 py-2 text-xs font-semibold text-[#111827] dark:text-white hover:bg-amber-50/70 dark:hover:bg-slate-700/60 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <Heart className="w-3.5 h-3.5 text-rose-500" />
                        <span>{t('nav.savedFavourites', 'Saved Favourites')}</span>
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
                      <span>{t('nav.signOut', 'Sign Out')}</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={handleAuthButtonClick}
                className="h-8 min-[380px]:h-9 sm:h-10 px-2 min-[380px]:px-3.5 sm:px-4 rounded-lg sm:rounded-xl bg-gradient-to-r from-[#111827] via-[#1E293B] to-[#111827] hover:from-[#1E293B] hover:to-[#111827] text-white border border-[#D6A64B]/60 hover:border-[#D6A64B] text-xs font-semibold shadow-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-95 shrink-0 whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-amber-500"
                title={t('nav.login', 'Login')}
              >
                <LogIn className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 shrink-0" />
                <span className="hidden min-[380px]:inline">{t('nav.login', 'Login')}</span>
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
      {isMobileDrawerOpen && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[100] lg:hidden" role="dialog" aria-modal="true" aria-label="Navigation Menu">
          {/* Backdrop overlay */}
          <div
            onClick={() => setIsMobileDrawerOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            aria-hidden="true"
          />

          {/* Drawer container (Slide-over from left) */}
          <div className="fixed inset-y-0 left-0 w-[85vw] max-w-sm sm:max-w-md h-full bg-[#FFF9EE] dark:bg-[#0B132B] border-r border-[#E8D6B3] dark:border-amber-900/50 shadow-2xl flex flex-col justify-between overflow-hidden z-[101] text-left">
            
            {/* 1. Drawer Header */}
            <div className="flex items-center justify-between px-4 sm:px-5 py-3.5 border-b border-[#E8D6B3] dark:border-amber-900/40 shrink-0 bg-[#F7EEDC]/60 dark:bg-slate-900/40">
              <Link 
                to="/" 
                onClick={() => setIsMobileDrawerOpen(false)}
                className="flex items-center gap-2"
                aria-label="D.CARD Home"
              >
                <img src="/logo-mark.png" alt="D.CARD Logo" className="h-7 w-auto object-contain" />
                <div className="flex flex-col">
                  <span className="text-base font-black text-[#111827] dark:text-white">
                    D.<span className="text-[#2455A4] dark:text-[#60A5FA]">CARD</span>
                  </span>
                  <span className="text-[8px] font-bold text-[#6B7280] dark:text-slate-400 uppercase tracking-wider">
                    {t('nav.tagline', 'COMPARE. CHOOSE. BENEFIT.')}
                  </span>
                </div>
              </Link>
              <button
                type="button"
                onClick={() => setIsMobileDrawerOpen(false)}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-500"
                aria-label="Close navigation menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 2. Scrollable Navigation Body */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 overscroll-contain">
              
              {/* User Status / Quick Login in Mobile Drawer */}
              {user ? (
                <div className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-[#E8D6B3] dark:border-slate-700 shadow-2xs flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#2455A4] to-[#3B82F6] text-white flex items-center justify-center font-bold text-xs shrink-0">
                      {user.email ? user.email.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-[#111827] dark:text-white truncate">
                        {profile?.full_name || user.displayName || 'Member'}
                      </p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <Link
                    to="/profile"
                    onClick={() => setIsMobileDrawerOpen(false)}
                    className="px-2.5 py-1 text-[11px] font-bold text-[#2455A4] dark:text-[#60A5FA] bg-amber-50 dark:bg-slate-700 rounded-lg shrink-0"
                  >
                    View
                  </Link>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileDrawerOpen(false);
                    handleAuthButtonClick();
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#111827] via-[#1E293B] to-[#111827] text-white border border-[#D6A64B]/60 font-bold text-xs shadow-sm cursor-pointer min-h-[44px] transition-all"
                >
                  <LogIn className="w-4 h-4 text-amber-400" />
                  <span>{t('nav.signInRegister', 'Sign In / Register')}</span>
                </button>
              )}

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
                  className="block p-3 rounded-2xl bg-gradient-to-r from-[#9A3412] via-[#C2410C] to-[#D97706] text-white border border-amber-300/40 shadow-sm text-xs font-bold select-none cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <span className="text-base">🪔</span>
                      <span>{isHindi ? 'शुभ धनतेरस व दीपावली उत्सव' : 'Shubh Dhanteras & Diwali Special'}</span>
                    </span>
                    <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-white/20 text-white">
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
                              : 'text-[#111827] dark:text-slate-200 hover:bg-amber-50/70 dark:hover:bg-slate-800/60'
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

              {/* Saved Favourites Link in Mobile Drawer */}
              <div className="pt-3 border-t border-amber-200/40 dark:border-slate-800 space-y-1">
                <div className="text-[10.5px] font-extrabold uppercase tracking-wider text-amber-800/70 dark:text-amber-400/70 px-2 mb-1">
                  {t('nav.accountAndUtilities', 'Account & Utilities')}
                </div>

                <Link
                  to="/saved-cards"
                  onClick={(e) => {
                    if (!user) {
                      handleProtectedClick(e, '/saved-cards', true);
                    } else {
                      setIsMobileDrawerOpen(false);
                    }
                  }}
                  className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-[#111827] dark:text-slate-200 hover:bg-black/5 dark:hover:bg-white/5 min-h-[44px]"
                >
                  <div className="flex items-center gap-2.5">
                    <Heart className="w-4 h-4 text-rose-500" strokeWidth={2} />
                    <span>{t('nav.savedFavourites', 'Saved Favourites')}</span>
                  </div>
                  {favoritesCount > 0 && (
                    <span className="px-2 py-0.5 text-[10px] font-extrabold rounded-full bg-rose-500 text-white">
                      {favoritesCount}
                    </span>
                  )}
                </Link>

                <NavLink
                  to="/compare"
                  onClick={(e) => {
                    if (!user) {
                      handleProtectedClick(e, '/compare', true);
                    } else {
                      setIsMobileDrawerOpen(false);
                    }
                  }}
                  className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-[#111827] dark:text-slate-200 hover:bg-black/5 dark:hover:bg-white/5 min-h-[44px]"
                >
                  <div className="flex items-center gap-2.5">
                    <Scale className="w-4 h-4 text-[#2455A4] dark:text-[#60A5FA]" strokeWidth={2} />
                    <span>{t('nav.compare', 'Compare Matrix')}</span>
                  </div>
                  {compareCount > 0 && (
                    <span className="px-2 py-0.5 text-[10px] font-extrabold rounded-full bg-emerald-500 text-white">
                      {compareCount}
                    </span>
                  )}
                </NavLink>

                {/* Legal & Terms Link */}
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileDrawerOpen(false);
                    if (onOpenLegal) onOpenLegal('terms');
                  }}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-[#111827] dark:text-slate-200 hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer text-left min-h-[44px]"
                >
                  <div className="flex items-center gap-2.5">
                    <Info className="w-4 h-4 text-slate-500" />
                    <span>{t('nav.legalAndTerms', 'Legal & Terms')}</span>
                  </div>
                </button>

                {user && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsMobileDrawerOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 cursor-pointer text-left min-h-[44px]"
                  >
                    <LogOut className="w-4 h-4 text-rose-500" />
                    <span>{t('nav.signOut', 'Sign Out')}</span>
                  </button>
                )}
              </div>

              {/* Language Switcher in Mobile Drawer */}
              <div className="pt-3 border-t border-amber-200/40 dark:border-slate-800 space-y-2">
                <div className="text-[10.5px] font-extrabold uppercase tracking-wider text-amber-800/70 dark:text-amber-400/70 px-2">
                  {t('nav.selectLanguage', 'Language / भाषा')}
                </div>
                <div className="px-1">
                  <LanguageSelector variant="inline" />
                </div>
              </div>

            </div>

            {/* 3. Drawer Bottom Bar */}
            <div className="px-5 py-3 border-t border-[#E8D6B3] dark:border-slate-800 shrink-0 bg-[#F7EEDC]/60 dark:bg-slate-900/40 flex items-center justify-between text-[11px] text-[#6B7280] dark:text-slate-400">
              <span className="font-semibold">D.CARD Banking Platform</span>
              <button
                type="button"
                onClick={toggleDarkMode}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-[#E8D6B3] dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold cursor-pointer text-xs"
              >
                {isDarkMode ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-[#2455A4]" />}
                <span>{isDarkMode ? "Light" : "Dark"}</span>
              </button>
            </div>

          </div>
        </div>,
        document.body
      )}
    </header>
  );
}

export default Navbar;
