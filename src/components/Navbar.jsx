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
  ChevronDown 
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useWishlist } from "../context/WishlistContext";
import TopDisclaimerTicker from "./TopDisclaimerTicker";

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
  const location = useLocation();

  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

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
  }, [location.pathname]);

  // Click outside listener for profile dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Ordered Navigation Links for Desktop & Mobile
  // Desktop Order: Home -> Debit Cards -> Savings Accounts -> Current Accounts -> Compare -> AI Assistance -> Banks -> Find My Bank -> About -> Contact
  const navLinks = [
    { name: "Home", path: "/", end: true, isProtected: false },
    { name: "Debit Cards", path: "/cards", isProtected: true },
    { name: "Savings Accounts", path: "/savings-accounts", isProtected: true },
    { name: "Current Accounts", path: "/current-accounts", isProtected: true },
    { name: "Compare", path: "/compare", isProtected: true },
    { name: "AI Assistance", path: "/ai-advisor", isProtected: true },
    { name: "Banks", path: "/banks", isProtected: true },
    { name: "Find My Bank", path: "/find-my-bank", isProtected: false },
    { name: "About", path: "/about", isProtected: false },
    { name: "Contact", path: "/contact", isProtected: false },
  ];

  const handleProtectedClick = (e, path, isProtected) => {
    if (isProtected && !user) {
      e.preventDefault();
      if (isMobileMenuOpen) setIsMobileMenuOpen(false);
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
        <div className="w-full max-w-[1720px] mx-auto px-3 sm:px-4 lg:px-6 h-full flex items-center justify-between gap-2 lg:gap-3 xl:gap-4">
          
          {/* ── LEFT: MOBILE HAMBURGER + D.CARD LOGO ── */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Mobile/Tablet Hamburger Trigger (< 1280px) */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 -ml-1 rounded-xl text-[#4B5563] dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 min-[1280px]:hidden cursor-pointer shrink-0 transition-colors"
              aria-label="Toggle Navigation Menu"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
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
                className="h-8 sm:h-9 md:h-10 w-auto object-contain group-hover:scale-105 transition-transform duration-300 shrink-0"
              />
              <div className="flex flex-col justify-center shrink-0">
                <span className="text-base sm:text-xl font-extrabold tracking-tight leading-none text-[#0F172A] dark:text-white font-sans whitespace-nowrap">
                  D.<span className="text-[#2563EB]">CARD</span>
                </span>
                <span className="hidden min-[420px]:block text-[8px] sm:text-[9px] font-bold text-[#6B7280] dark:text-slate-400 tracking-wider uppercase mt-0.5 sm:mt-1 leading-tight whitespace-nowrap">
                  COMPARE. CHOOSE. BENEFIT.
                </span>
              </div>
            </Link>
          </div>

          {/* ── MIDDLE: DESKTOP NAVIGATION LINKS (>= 1280px) ── */}
          <nav className="hidden min-[1280px]:flex items-center justify-center gap-0.5 xl:gap-1 2xl:gap-1.5 flex-1 min-w-0 mx-1 xl:mx-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                end={link.end}
                onClick={(e) => handleProtectedClick(e, link.path, link.isProtected)}
                className={({ isActive }) =>
                  `px-1.5 xl:px-2 2xl:px-2.5 py-1.5 rounded-xl text-[11.5px] xl:text-[12px] 2xl:text-[12.5px] font-semibold transition-all whitespace-nowrap flex items-center gap-1 shrink-0 ${
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
          </nav>

          {/* ── RIGHT: CONTROLS (Legal ⚖, Theme, Notification, Rajdeep Profile) ── */}
          <div className="flex items-center gap-1.5 sm:gap-2 xl:gap-2.5 shrink-0 justify-end">
            
            {/* 1. Legal Button with Scales-of-Justice Symbol (Desktop >= 1280px) */}
            <button
              type="button"
              onClick={() => onOpenLegal ? onOpenLegal('terms') : null}
              className="relative hidden min-[1280px]:flex w-9 h-9 items-center justify-center rounded-xl text-[#4B5563] dark:text-slate-300 hover:text-[#2563EB] hover:bg-[#EFF6FF] dark:hover:bg-slate-800/60 transition-all cursor-pointer group shrink-0"
              title="Legal & Terms"
              aria-label="Legal & Terms"
            >
              <img 
                src="/assets/legal-scales.png" 
                alt="Legal" 
                className="w-5 h-5 object-contain transition-transform group-hover:scale-110 shrink-0" 
              />
            </button>

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

            {/* 3. Notification Button (Bell) */}
            <Link
              to="/saved-cards"
              onClick={(e) => handleProtectedClick(e, '/saved-cards', true)}
              className="relative w-9 h-9 flex items-center justify-center rounded-xl text-[#4B5563] dark:text-slate-300 hover:text-[#2563EB] hover:bg-[#EFF6FF] dark:hover:bg-slate-800/60 transition-all group shrink-0"
              title="Notifications"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4 text-[#4B5563] dark:text-slate-300 group-hover:text-[#2563EB] dark:group-hover:text-[#60A5FA] transition-all shrink-0" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[17px] h-[17px] px-1 flex items-center justify-center text-[10px] font-extrabold rounded-full bg-rose-500 text-white leading-none shadow-xs pointer-events-none">
                  {unreadCount}
                </span>
              )}
            </Link>

            {/* 4. User Profile / Login Dropdown Button */}
            {user ? (
              <div className="relative shrink-0" ref={profileDropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center gap-1.5 sm:gap-2 p-1 pr-2 sm:pr-2.5 rounded-full border border-[#E5E7EB] dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-[#2563EB] dark:hover:border-[#60A5FA] transition-all cursor-pointer shadow-xs shrink-0 max-w-[140px] sm:max-w-[160px]"
                  aria-expanded={isProfileDropdownOpen}
                  aria-label="User Account Menu"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-r from-[#2563EB] to-[#3B82F6] text-white flex items-center justify-center font-bold text-xs shadow-xs shrink-0">
                    {user.email ? user.email.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="hidden sm:inline-block text-xs font-bold text-[#1F2937] dark:text-white max-w-[70px] md:max-w-[85px] xl:max-w-[100px] truncate whitespace-nowrap overflow-hidden text-ellipsis">
                    {profile?.full_name || user.displayName || 'Rajdeep'}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                </button>

                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-slate-700 shadow-xl py-2 z-[60] text-left">
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
                className="px-3 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#3B82F6] hover:opacity-95 text-white text-xs font-semibold shadow-md flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 shrink-0 whitespace-nowrap"
              >
                <LogIn className="w-3.5 h-3.5 shrink-0" />
                <span>Login</span>
              </button>
            )}

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
          <div className="text-[11px] font-extrabold uppercase tracking-wider text-gray-400 dark:text-slate-500 px-3 py-1">
            Navigation Menu
          </div>

          {navLinks.map((link) => (
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

          {/* Legal Item in Mobile Menu — with Scales-of-Justice image */}
          <button
            type="button"
            onClick={() => {
              setIsMobileMenuOpen(false);
              if (onOpenLegal) onOpenLegal('terms');
            }}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-[#1F2937] dark:text-slate-200 hover:bg-[#EFF6FF] dark:hover:bg-slate-800 cursor-pointer text-left min-h-[44px]"
          >
            <div className="flex items-center gap-2.5">
              <img 
                src="/assets/legal-scales.png" 
                alt="Legal" 
                className="w-[22px] h-[22px] object-contain shrink-0" 
              />
              <span>Legal & Terms</span>
            </div>
          </button>

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
              {favoritesCount > 0 && (
                <span className="px-2 py-0.5 text-[10px] font-extrabold rounded-full bg-rose-500 text-white">
                  {favoritesCount}
                </span>
              )}
            </Link>

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
