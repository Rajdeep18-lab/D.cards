import { useState, useEffect, useRef } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { 
  Sun, 
  Moon, 
  LogIn, 
  Scale, 
  Heart, 
  Menu, 
  X, 
  User, 
  LogOut, 
  ChevronDown, 
  MoreHorizontal,
  Info,
  Mail,
  ShieldAlert,
  MapPin
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useWishlist } from "../context/WishlistContext";
import TopDisclaimerTicker from "./TopDisclaimerTicker";
import LocationSelectorButton from "./LocationSelectorButton";

function Navbar({ isDarkMode, toggleDarkMode, onOpenAuth, compareCount = 0, onOpenLegal }) {
  const { user, profile, logout, openAuthModal } = useAuth();
  const { wishlist } = useWishlist();
  const location = useLocation();

  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isMoreDropdownOpen, setIsMoreDropdownOpen] = useState(false);

  const moreDropdownRef = useRef(null);
  const profileDropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsProfileDropdownOpen(false);
    setIsMoreDropdownOpen(false);
  }, [location.pathname]);

  // Click outside listener for dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (moreDropdownRef.current && !moreDropdownRef.current.contains(event.target)) {
        setIsMoreDropdownOpen(false);
      }
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Primary core banking product links
  const coreNavLinks = [
    { name: "Debit Cards", path: "/cards", isProtected: true },
    { name: "Savings Accounts", path: "/savings-accounts", isProtected: true },
    { name: "Current Accounts", path: "/current-accounts", isProtected: true },
    { name: "Compare", path: "/compare", isProtected: true },
    { name: "AI Assistance", path: "/ai-advisor", isProtected: true },
    { name: "Banks", path: "/banks", isProtected: true },
  ];

  // Secondary links
  const secondaryNavLinks = [
    { name: "Find My Bank", path: "/find-my-bank", isProtected: false, icon: MapPin },
    { name: "About", path: "/about", isProtected: false, icon: Info },
    { name: "Contact", path: "/contact", isProtected: false, icon: Mail },
  ];

  // Full list for mobile drawer
  const allNavLinks = [
    { name: "Home", path: "/", end: true, isProtected: false },
    ...coreNavLinks,
    { name: "Find My Bank", path: "/find-my-bank", isProtected: false },
    { name: "About", path: "/about", isProtected: false },
    { name: "Contact", path: "/contact", isProtected: false },
  ];

  const handleProtectedClick = (e, path, isProtected) => {
    if (isProtected && !user) {
      e.preventDefault();
      if (isMobileMenuOpen) setIsMobileMenuOpen(false);
      setIsMoreDropdownOpen(false);
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
    <header className="sticky top-0 z-50 w-full select-none shadow-xs">
      {/* ==================================================
          1. TOP: RUNNING DISCLAIMER / STATUTORY BAR
         ================================================== */}
      <TopDisclaimerTicker />

      {/* ==================================================
          2. MAIN HEADER / NAVIGATION BAR
         ================================================== */}
      <div
        className={`w-full transition-all duration-300 h-[68px] sm:h-[76px] flex items-center ${
          scrolled
            ? "backdrop-blur-xl border-b border-[#E5E7EB] dark:border-slate-800 shadow-sm bg-white/95 dark:bg-[#0F172A]/95"
            : "border-b border-[#E5E7EB]/60 dark:border-slate-800/60 bg-white/90 dark:bg-[#0F172A]/90 backdrop-blur-md"
        }`}
      >
        <div className="w-full max-w-[1720px] mx-auto px-3 sm:px-4 lg:px-6 h-full flex items-center justify-between gap-3 xl:gap-4">
          
          {/* ── LEFT: D.CARD LOGO + TAGLINE (shrink-0) ── */}
          <div className="shrink-0 flex items-center gap-2.5 sm:gap-3.5">
            <Link
              to="/"
              className="flex items-center gap-2 group text-left bg-transparent border-0 cursor-pointer focus:outline-none shrink-0"
              aria-label="D.CARD Home"
            >
              <img 
                src="/logo-mark.png" 
                alt="D.CARD Logo" 
                className="h-9 sm:h-10 w-auto object-contain group-hover:scale-105 transition-transform duration-300 shrink-0"
              />
              <div className="flex flex-col justify-center shrink-0">
                <span className="text-base sm:text-xl font-extrabold tracking-tight leading-none text-[#0F172A] dark:text-white font-sans whitespace-nowrap">
                  D.<span className="text-[#2563EB]">CARD</span>
                </span>
                <span className="hidden min-[400px]:block text-[8.5px] sm:text-[9px] font-bold text-[#6B7280] dark:text-slate-400 tracking-wider uppercase mt-0.5 sm:mt-1 leading-tight whitespace-nowrap">
                  COMPARE. CHOOSE. BENEFIT.
                </span>
              </div>
            </Link>

            {/* Tablet Location Selector (768px - 1279px) */}
            <div className="hidden md:block min-[1280px]:hidden shrink-0">
              <LocationSelectorButton variant="desktop" />
            </div>
          </div>

          {/* ── MIDDLE: LOCATION SELECTOR + NAVIGATION LINKS (Desktop >= 1280px) ── */}
          <div className="hidden min-[1280px]:flex items-center justify-center gap-2 xl:gap-2.5 2xl:gap-3 flex-1 min-w-0">
            {/* Desktop Location Selector */}
            <div className="shrink-0">
              <LocationSelectorButton variant="desktop" />
            </div>

            {/* Visual Separator between Location Selector & Navigation */}
            <div className="h-5 w-px bg-gray-200/90 dark:bg-slate-700/80 shrink-0" aria-hidden="true" />

            {/* Desktop Navigation Links */}
            <nav className="flex items-center gap-0.5 xl:gap-1 2xl:gap-1.5 shrink-0">
              {/* Core Product Links */}
              {coreNavLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  onClick={(e) => handleProtectedClick(e, link.path, link.isProtected)}
                  className={({ isActive }) =>
                    `px-2 2xl:px-2.5 py-1.5 rounded-xl text-[12px] 2xl:text-[12.5px] font-semibold transition-all whitespace-nowrap flex items-center gap-1 shrink-0 ${
                      isActive
                        ? 'text-[#2563EB] dark:text-[#60A5FA] font-bold bg-[#EFF6FF] dark:bg-slate-800/80 shadow-xs border border-[#2563EB]/15 dark:border-[#60A5FA]/20'
                        : 'text-[#4B5563] dark:text-slate-300 hover:text-[#2563EB] dark:hover:text-[#60A5FA] hover:bg-gray-100/60 dark:hover:bg-slate-800/40'
                    }`
                  }
                >
                  <span>{link.name}</span>
                  {link.name === "Compare" && compareCount > 0 && (
                    <span className="inline-flex items-center justify-center px-1.5 py-0.2 text-[10px] font-extrabold rounded-full bg-emerald-500 text-white leading-none shadow-xs ml-0.5 shrink-0">
                      {compareCount}
                    </span>
                  )}
                </NavLink>
              ))}

              {/* Find My Bank: Visible directly on >= 1440px */}
              <NavLink
                to="/find-my-bank"
                className={({ isActive }) =>
                  `hidden min-[1440px]:flex items-center gap-1 px-2 2xl:px-2.5 py-1.5 rounded-xl text-[12px] 2xl:text-[12.5px] font-semibold transition-all whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'text-[#2563EB] dark:text-[#60A5FA] font-bold bg-[#EFF6FF] dark:bg-slate-800/80 shadow-xs border border-[#2563EB]/15 dark:border-[#60A5FA]/20'
                      : 'text-[#4B5563] dark:text-slate-300 hover:text-[#2563EB] dark:hover:text-[#60A5FA] hover:bg-gray-100/60 dark:hover:bg-slate-800/40'
                  }`
                }
              >
                <span>Find My Bank</span>
              </NavLink>

              {/* Extended Links: Visible directly in row on Large Desktop (>= 1536px) */}
              <NavLink
                to="/about"
                className={({ isActive }) =>
                  `hidden min-[1536px]:flex items-center gap-1 px-2 2xl:px-2.5 py-1.5 rounded-xl text-[12px] 2xl:text-[12.5px] font-semibold transition-all whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'text-[#2563EB] dark:text-[#60A5FA] font-bold bg-[#EFF6FF] dark:bg-slate-800/80 shadow-xs border border-[#2563EB]/15 dark:border-[#60A5FA]/20'
                      : 'text-[#4B5563] dark:text-slate-300 hover:text-[#2563EB] dark:hover:text-[#60A5FA] hover:bg-gray-100/60 dark:hover:bg-slate-800/40'
                  }`
                }
              >
                <span>About</span>
              </NavLink>

              <NavLink
                to="/contact"
                className={({ isActive }) =>
                  `hidden min-[1536px]:flex items-center gap-1 px-2 2xl:px-2.5 py-1.5 rounded-xl text-[12px] 2xl:text-[12.5px] font-semibold transition-all whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'text-[#2563EB] dark:text-[#60A5FA] font-bold bg-[#EFF6FF] dark:bg-slate-800/80 shadow-xs border border-[#2563EB]/15 dark:border-[#60A5FA]/20'
                      : 'text-[#4B5563] dark:text-slate-300 hover:text-[#2563EB] dark:hover:text-[#60A5FA] hover:bg-gray-100/60 dark:hover:bg-slate-800/40'
                  }`
                }
              >
                <span>Contact</span>
              </NavLink>

              {/* Legal: Visible directly on Large Desktop (>= 1536px) */}
              <button
                type="button"
                onClick={() => onOpenLegal ? onOpenLegal('terms') : null}
                className="hidden min-[1536px]:flex items-center gap-1 px-2 2xl:px-2.5 py-1.5 rounded-xl text-[12px] 2xl:text-[12.5px] font-semibold text-[#4B5563] dark:text-slate-300 hover:text-[#2563EB] dark:hover:text-[#60A5FA] hover:bg-gray-100/60 dark:hover:bg-slate-800/40 transition-all cursor-pointer whitespace-nowrap shrink-0"
                title="Legal & Terms"
              >
                <span>Legal</span>
              </button>

              {/* "More ▾" Dropdown: Visible on Medium Desktop (< 1536px) */}
              <div className="relative min-[1536px]:hidden shrink-0" ref={moreDropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsMoreDropdownOpen(!isMoreDropdownOpen)}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[12px] font-semibold transition-all whitespace-nowrap cursor-pointer shrink-0 ${
                    isMoreDropdownOpen || location.pathname === '/about' || location.pathname === '/contact' || location.pathname === '/find-my-bank'
                      ? 'text-[#2563EB] dark:text-[#60A5FA] font-bold bg-[#EFF6FF] dark:bg-slate-800/80 border border-[#2563EB]/15'
                      : 'text-[#4B5563] dark:text-slate-300 hover:text-[#2563EB] dark:hover:text-[#60A5FA] hover:bg-gray-100/60 dark:hover:bg-slate-800/40'
                  }`}
                  aria-expanded={isMoreDropdownOpen}
                  aria-label="More navigation options"
                >
                  <span>More</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isMoreDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isMoreDropdownOpen && (
                  <div className="absolute left-0 mt-2 w-48 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-slate-700 shadow-xl py-2 z-[60] text-left">
                    {/* Find My Bank: Show in More dropdown when screen < 1440px */}
                    <NavLink
                      to="/find-my-bank"
                      onClick={() => setIsMoreDropdownOpen(false)}
                      className={({ isActive }) =>
                        `min-[1440px]:hidden flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold transition-colors ${
                          isActive
                            ? 'text-[#2563EB] dark:text-[#60A5FA] bg-[#EFF6FF] dark:bg-slate-800/60 font-bold'
                            : 'text-[#4B5563] dark:text-slate-300 hover:text-[#2563EB] hover:bg-gray-50 dark:hover:bg-slate-800/40'
                        }`
                      }
                    >
                      <MapPin className="w-3.5 h-3.5 text-[#2563EB] shrink-0" />
                      <span>Find My Bank</span>
                    </NavLink>

                    <NavLink
                      to="/about"
                      onClick={() => setIsMoreDropdownOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold transition-colors ${
                          isActive
                            ? 'text-[#2563EB] dark:text-[#60A5FA] bg-[#EFF6FF] dark:bg-slate-800/60 font-bold'
                            : 'text-[#4B5563] dark:text-slate-300 hover:text-[#2563EB] hover:bg-gray-50 dark:hover:bg-slate-800/40'
                        }`
                      }
                    >
                      <Info className="w-3.5 h-3.5 text-[#2563EB] shrink-0" />
                      <span>About</span>
                    </NavLink>

                    <NavLink
                      to="/contact"
                      onClick={() => setIsMoreDropdownOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold transition-colors ${
                          isActive
                            ? 'text-[#2563EB] dark:text-[#60A5FA] bg-[#EFF6FF] dark:bg-slate-800/60 font-bold'
                            : 'text-[#4B5563] dark:text-slate-300 hover:text-[#2563EB] hover:bg-gray-50 dark:hover:bg-slate-800/40'
                        }`
                      }
                    >
                      <Mail className="w-3.5 h-3.5 text-[#2563EB] shrink-0" />
                      <span>Contact</span>
                    </NavLink>

                    <div className="my-1 border-t border-gray-100 dark:border-slate-800" />

                    <button
                      type="button"
                      onClick={() => {
                        setIsMoreDropdownOpen(false);
                        if (onOpenLegal) onOpenLegal('terms');
                      }}
                      className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-[#4B5563] dark:text-slate-300 hover:text-[#2563EB] hover:bg-gray-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer text-left"
                    >
                      <Scale className="w-3.5 h-3.5 text-[#2563EB] shrink-0" />
                      <span>Legal & Terms</span>
                    </button>
                  </div>
                )}
              </div>
            </nav>
          </div>

          {/* ── RIGHT: USER ACTIONS (Favourites, Theme, Profile/Login, Mobile Menu) ── */}
          <div className="flex items-center gap-1.5 sm:gap-2 xl:gap-2.5 shrink-0 justify-end">
            
            {/* 1. Favourite button with attached notification badge */}
            <Link
              to="/saved-cards"
              onClick={(e) => handleProtectedClick(e, '/saved-cards', true)}
              className="relative w-9 h-9 flex items-center justify-center rounded-xl text-[#4B5563] dark:text-slate-300 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-800/60 transition-all group shrink-0"
              title="Saved Favourites"
              aria-label="Saved Favourites"
            >
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500/20 group-hover:fill-rose-500 transition-all shrink-0" />
              {wishlist && wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 flex items-center justify-center text-[10px] font-extrabold rounded-full bg-rose-500 text-white leading-none shadow-xs pointer-events-none">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* 2. Theme Toggle Button */}
            <button
              type="button"
              onClick={toggleDarkMode}
              className="w-9 h-9 flex items-center justify-center rounded-xl text-[#4B5563] dark:text-slate-300 hover:text-[#2563EB] hover:bg-[#EFF6FF] dark:hover:bg-slate-800/60 transition-all cursor-pointer shrink-0"
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              aria-label="Toggle Dark Mode"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-[#2563EB]" />}
            </button>

            {/* 3. User Profile / Login Dropdown Button */}
            {user ? (
              <div className="relative shrink-0" ref={profileDropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center gap-1.5 sm:gap-2 p-1 pr-2 sm:pr-2.5 rounded-full border border-[#E5E7EB] dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-[#2563EB] dark:hover:border-[#60A5FA] transition-all cursor-pointer shadow-xs shrink-0 max-w-[150px]"
                  aria-expanded={isProfileDropdownOpen}
                  aria-label="User Account Menu"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-r from-[#2563EB] to-[#3B82F6] text-white flex items-center justify-center font-bold text-xs shadow-xs shrink-0">
                    {user.email ? user.email.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="hidden sm:inline-block text-xs font-bold text-[#1F2937] dark:text-white max-w-[85px] xl:max-w-[100px] truncate whitespace-nowrap overflow-hidden text-ellipsis">
                    {profile?.full_name || user.displayName || 'Account'}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                </button>

                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-slate-700 shadow-xl py-2 z-[60] text-left">
                    <div className="px-4 py-2 border-b border-gray-100 dark:border-slate-800">
                      <p className="text-xs font-bold text-[#1F2937] dark:text-white truncate">
                        {profile?.full_name || user.displayName || 'Account'}
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
                className="px-3 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#3B82F6] hover:opacity-95 text-white text-xs font-semibold shadow-md flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 shrink-0 whitespace-nowrap"
              >
                <LogIn className="w-3.5 h-3.5 shrink-0" />
                <span>Login</span>
              </button>
            )}

            {/* Mobile Location Selector Icon Button (< 768px) */}
            <div className="md:hidden flex items-center shrink-0">
              <LocationSelectorButton variant="mobile" />
            </div>

            {/* 4. Hamburger Menu Trigger for Mobile & Tablet (< 1280px) */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl text-[#4B5563] dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 min-[1280px]:hidden cursor-pointer shrink-0"
              aria-label="Toggle Navigation Menu"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Backdrop overlay when mobile menu is open */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs min-[1280px]:hidden z-[54]"
          style={{ top: "100%" }}
        />
      )}

      {/* ==================================================
          3. MOBILE & TABLET DRAWER NAVIGATION (< 1280px)
         ================================================== */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 min-[1280px]:hidden border-b border-[#E5E7EB] dark:border-slate-800 bg-white/98 dark:bg-[#0F172A]/98 backdrop-blur-xl px-4 py-4 space-y-1 text-left shadow-2xl z-[55] max-h-[calc(100vh-120px)] overflow-y-auto">
          {/* Mobile Drawer Location Selector */}
          <div className="px-2 pb-2 mb-2 border-b border-gray-100 dark:border-slate-800">
            <LocationSelectorButton variant="desktop" className="w-full justify-between" />
          </div>

          <div className="text-[11px] font-extrabold uppercase tracking-wider text-gray-400 dark:text-slate-500 px-3 py-1">
            Navigation Menu
          </div>

          {allNavLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              end={link.end}
              onClick={(e) => {
                if (link.isProtected && !user) {
                  handleProtectedClick(e, link.path, true);
                } else {
                  setIsMobileMenuOpen(false);
                }
              }}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all min-h-[44px] ${
                  isActive
                    ? 'bg-[#2563EB] text-white font-bold shadow-xs'
                    : 'text-[#1F2937] dark:text-slate-200 hover:bg-[#EFF6FF] dark:hover:bg-slate-800'
                }`
              }
            >
              <span>{link.name}</span>
              {link.name === "Compare" && compareCount > 0 && (
                <span className="px-2 py-0.5 text-[10px] font-extrabold rounded-full bg-emerald-500 text-white">
                  {compareCount}
                </span>
              )}
            </NavLink>
          ))}

          <div className="pt-3 mt-2 border-t border-gray-100 dark:border-slate-800 space-y-1">
            <div className="text-[11px] font-extrabold uppercase tracking-wider text-gray-400 dark:text-slate-500 px-3 py-1">
              Account & Utilities
            </div>

            <NavLink
              to="/profile"
              onClick={(e) => {
                if (!user) {
                  handleProtectedClick(e, '/profile', true);
                } else {
                  setIsMobileMenuOpen(false);
                }
              }}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold min-h-[44px] ${
                  isActive ? 'bg-[#2563EB] text-white font-bold' : 'text-[#1F2937] dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-800'
                }`
              }
            >
              <User className="w-4 h-4 text-[#2563EB]" />
              <span>My Profile</span>
            </NavLink>

            <Link
              to="/saved-cards"
              onClick={(e) => {
                if (!user) {
                  handleProtectedClick(e, '/saved-cards', true);
                } else {
                  setIsMobileMenuOpen(false);
                }
              }}
              className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-[#1F2937] dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-800 min-h-[44px]"
            >
              <div className="flex items-center gap-2.5">
                <Heart className="w-4 h-4 text-rose-500" />
                <span>Saved Favourites</span>
              </div>
              {wishlist && wishlist.length > 0 && (
                <span className="px-2 py-0.5 text-[10px] font-extrabold rounded-full bg-rose-500 text-white">
                  {wishlist.length}
                </span>
              )}
            </Link>

            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                if (onOpenLegal) onOpenLegal('terms');
              }}
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-[#1F2937] dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-800 cursor-pointer text-left min-h-[44px]"
            >
              <Scale className="w-4 h-4 text-[#2563EB]" />
              <span>Legal & Terms</span>
            </button>

            {user ? (
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  logout();
                }}
                className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 cursor-pointer text-left min-h-[44px]"
              >
                <LogOut className="w-4 h-4 text-rose-500" />
                <span>Sign Out ({user.email})</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleAuthButtonClick();
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#2563EB] text-white font-semibold text-xs shadow-md mt-2 cursor-pointer min-h-[44px]"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In / Register</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
