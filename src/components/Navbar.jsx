import { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { Sun, Moon, LogIn, Scale, Heart, Menu, X, User, LogOut, ChevronDown } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useWishlist } from "../context/WishlistContext";

function Navbar({ isDarkMode, toggleDarkMode, onOpenAuth, compareCount = 0, onOpenLegal }) {
  const { user, profile, logout } = useAuth();
  const { wishlist } = useWishlist();

  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", path: "/", end: true },
    { name: "Debit Cards", path: "/cards" },
    { name: "Savings Accounts", path: "/savings-accounts" },
    { name: "Compare", path: "/compare" },
    { name: "Favourites", path: "/saved-cards" },
    { name: "AI Advisor", path: "/ai-advisor" },
    { name: "Banks", path: "/banks" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 h-[88px] min-h-[88px] flex items-center ${
        scrolled
          ? "backdrop-blur-xl border-b border-[#E5E7EB] dark:border-slate-800 shadow-sm bg-white/95 dark:bg-[#0F172A]/95"
          : "border-b border-[#E5E7EB]/60 dark:border-slate-800/60 bg-white/90 dark:bg-[#0F172A]/90 backdrop-blur-md"
      }`}
    >
      <div className="w-full max-w-[1536px] mx-auto px-3 sm:px-5 lg:px-6 h-full flex items-center justify-between gap-2 sm:gap-4">
        
        {/* ==================================================
            1. LEFT BRAND SECTION
           ================================================== */}
        <div className="min-w-[190px] max-w-[240px] shrink-0 flex items-center select-none">
          <Link
            to="/"
            className="flex items-center gap-2.5 group text-left bg-transparent border-0 cursor-pointer focus:outline-none"
          >
            <img 
              src="/logo-mark.png" 
              alt="D.CARD Logo" 
              className="h-10 sm:h-11 w-auto object-contain group-hover:scale-105 transition-transform duration-300 shrink-0"
            />
            <div className="flex flex-col justify-center">
              <span className="text-lg sm:text-xl font-extrabold tracking-tight leading-none text-[#0F172A] dark:text-white font-sans">
                D.<span className="text-[#2563EB]">CARD</span>
              </span>
              <span className="text-[8.5px] sm:text-[9px] font-bold text-[#6B7280] dark:text-slate-400 tracking-wider uppercase mt-1 leading-tight whitespace-nowrap">
                COMPARE. CHOOSE. BENEFIT.
              </span>
            </div>
          </Link>
        </div>

        {/* ==================================================
            2. CENTER NAVIGATION SECTION (Desktop >=1280px)
           ================================================== */}
        <nav className="hidden xl:flex items-center justify-center gap-0.5 2xl:gap-1.5 flex-1 min-w-0 px-1">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              end={link.end}
              className={({ isActive }) =>
                `px-1.5 2xl:px-2.5 py-1.5 rounded-xl text-[11.5px] 2xl:text-[13px] font-semibold transition-all whitespace-nowrap flex items-center gap-1 shrink-0 ${
                  isActive
                    ? 'text-[#2563EB] dark:text-[#60A5FA] font-bold bg-[#EFF6FF] dark:bg-slate-800/80 shadow-xs border border-[#2563EB]/15 dark:border-[#60A5FA]/20'
                    : 'text-[#4B5563] dark:text-slate-300 hover:text-[#2563EB] dark:hover:text-[#60A5FA] hover:bg-gray-100/60 dark:hover:bg-slate-800/40'
                }`
              }
            >
              <span>{link.name}</span>
              {link.name === "Compare" && compareCount > 0 && (
                <span className="inline-flex items-center justify-center px-1.5 py-0.2 text-[10px] font-extrabold rounded-full bg-emerald-500 text-white leading-none shadow-xs">
                  {compareCount}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* ==================================================
            3. RIGHT USER ACTIONS SECTION
           ================================================== */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 justify-end">
          {/* Order: My Profile -> ❤️ Favourite -> ⚖️ Legal -> 🌙 Theme -> [ User Avatar / Login ] */}

          {/* 1. My Profile text link */}
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `hidden xl:flex items-center gap-1.5 px-2 2xl:px-2.5 py-1.5 rounded-xl text-[11.5px] 2xl:text-[13px] font-semibold transition-all whitespace-nowrap shrink-0 ${
                isActive
                  ? 'text-[#2563EB] dark:text-[#60A5FA] font-bold bg-[#EFF6FF] dark:bg-slate-800/80 shadow-xs border border-[#2563EB]/15 dark:border-[#60A5FA]/20'
                  : 'text-[#4B5563] dark:text-slate-300 hover:text-[#2563EB] dark:hover:text-[#60A5FA] hover:bg-gray-100/60 dark:hover:bg-slate-800/40'
              }`
            }
          >
            <span>My Profile</span>
          </NavLink>

          {/* 2. ❤️ Favourite button with attached counter badge */}
          <Link
            to="/saved-cards"
            className="flex items-center gap-1 px-2 2xl:px-2.5 py-1.5 rounded-xl text-[11.5px] 2xl:text-[13px] font-semibold text-[#4B5563] dark:text-slate-300 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-800/60 transition-all group shrink-0"
            title="Saved Favourites"
          >
            <Heart className="w-4 h-4 text-rose-500 fill-rose-500/20 group-hover:fill-rose-500 transition-all shrink-0" />
            {wishlist && wishlist.length > 0 && (
              <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-extrabold rounded-full bg-rose-500 text-white leading-none shadow-xs">
                {wishlist.length}
              </span>
            )}
          </Link>

          {/* 3. ⚖️ Legal / Terms Button */}
          <button
            onClick={() => onOpenLegal ? onOpenLegal('terms') : null}
            className="hidden sm:flex items-center gap-1.5 px-2 2xl:px-2.5 py-1.5 rounded-xl text-[11.5px] 2xl:text-[13px] font-semibold text-[#4B5563] dark:text-slate-300 hover:text-[#2563EB] dark:hover:text-[#60A5FA] hover:bg-[#EFF6FF] dark:hover:bg-slate-800/60 transition-all cursor-pointer shrink-0"
            title="Legal & Terms"
          >
            <Scale className="w-4 h-4 text-[#2563EB] dark:text-[#60A5FA] shrink-0" />
            <span>Legal</span>
          </button>

          {/* 4. 🌙 Theme Toggle Button */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-xl text-[#4B5563] dark:text-slate-300 hover:text-[#2563EB] hover:bg-[#EFF6FF] dark:hover:bg-slate-800/60 transition-all cursor-pointer shrink-0"
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label="Toggle Dark Mode"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-[#2563EB]" />}
          </button>

          {/* 5. User Profile / Login Dropdown Button */}
          {user ? (
            <div className="relative shrink-0">
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center gap-1.5 sm:gap-2 p-1 pr-2 rounded-full border border-[#E5E7EB] dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-[#2563EB] dark:hover:border-[#60A5FA] transition-all cursor-pointer shadow-xs"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-r from-[#2563EB] to-[#3B82F6] text-white flex items-center justify-center font-bold text-xs shadow-xs shrink-0">
                  {user.email ? user.email.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="hidden sm:inline text-xs font-bold text-[#1F2937] dark:text-white max-w-[90px] truncate">
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
              onClick={onOpenAuth}
              className="px-3 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#3B82F6] hover:opacity-95 text-white text-xs font-semibold shadow-md flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 shrink-0"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Login</span>
            </button>
          )}

          {/* Hamburger Menu Trigger for Tablet & Mobile (<1280px) */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-xl text-[#4B5563] dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 xl:hidden cursor-pointer shrink-0"
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* Backdrop overlay when mobile menu is open */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 top-[88px] bg-black/60 backdrop-blur-xs xl:hidden z-[54]"
        />
      )}

      {/* ==================================================
          MOBILE & TABLET DRAWER NAVIGATION (<1280px)
         ================================================== */}
      {isMobileMenuOpen && (
        <div className="absolute top-[88px] left-0 right-0 xl:hidden border-b border-[#E5E7EB] dark:border-slate-800 bg-white/95 dark:bg-[#0F172A]/95 backdrop-blur-xl px-4 py-4 space-y-1 text-left shadow-2xl z-[55] max-h-[calc(100vh-88px)] overflow-y-auto">
          <div className="text-[11px] font-extrabold uppercase tracking-wider text-gray-400 dark:text-slate-500 px-3 py-1">
            Navigation Menu
          </div>

          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              end={link.end}
              onClick={() => setIsMobileMenuOpen(false)}
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
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold min-h-[44px] ${
                  isActive ? 'bg-[#2563EB] text-white font-bold' : 'text-[#1F2937] dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-800'
                }`
              }
            >
              <User className="w-4 h-4 text-[#2563EB]" />
              <span>My Profile</span>
            </NavLink>

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
                  onOpenAuth();
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
