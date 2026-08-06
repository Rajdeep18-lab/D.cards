import { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { CreditCard, Sun, Moon, LogIn, User, Scale, Heart, Menu, X, Bot } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useWishlist } from "../context/WishlistContext";

function Navbar({ isDarkMode, toggleDarkMode, onOpenAuth, compareCount = 0 }) {
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
    { name: "Home", path: "/" },
    { name: "Debit Cards", path: "/cards" },
    { name: "Compare", path: "/compare" },
    { name: "AI Advisor", path: "/ai-advisor" },
    { name: "Favorites", path: "/favorites" },
    { name: "Banks", path: "/banks" },
    { name: "About", path: "/about" },
    { name: "Founders", path: "/founders" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "backdrop-blur-xl border-b border-[#E5E7EB] dark:border-slate-800 shadow-sm bg-white/85 dark:bg-[#0F172A]/85"
          : "border-b border-transparent bg-white/70 dark:bg-[#0F172A]/70 backdrop-blur-md"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 py-3.5">
        
        {/* Brand Logo */}
        <Link
          to="/"
          className="flex items-center gap-2.5 group select-none text-left bg-transparent border-0 cursor-pointer focus:outline-none"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#3B82F6] flex items-center justify-center shadow-md text-white group-hover:scale-105 transition-transform duration-300">
            <CreditCard className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight leading-none text-[#1F2937] dark:text-white">
              D.<span className="text-[#2563EB]">CARD</span>
            </span>
            <span className="text-[9px] font-semibold text-[#6B7280] dark:text-slate-400 tracking-widest uppercase mt-0.5">
              FINANCIAL PLATFORM
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <ul className="hidden items-center gap-6 text-xs font-semibold text-[#6B7280] dark:text-slate-300 lg:flex select-none">
          {navLinks.map((link) => (
            <li key={link.name}>
              <NavLink
                to={link.path}
                className={({ isActive }) =>
                  `transition-all hover:text-[#2563EB] dark:hover:text-[#60A5FA] px-2 py-1 rounded-lg ${
                    isActive ? 'text-[#2563EB] dark:text-[#60A5FA] font-bold bg-[#EFF6FF] dark:bg-slate-800' : ''
                  }`
                }
              >
                {link.name}
              </NavLink>
            </li>
          ))}
          {user && (
            <li>
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  `transition-all hover:text-[#2563EB] dark:hover:text-[#60A5FA] px-2 py-1 rounded-lg ${
                    isActive ? 'text-[#2563EB] dark:text-[#60A5FA] font-bold bg-[#EFF6FF] dark:bg-slate-800' : ''
                  }`
                }
              >
                My Profile
              </NavLink>
            </li>
          )}
        </ul>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          {/* Wishlist Link with Badge */}
          <Link
            to="/favorites"
            className="relative p-2 rounded-xl text-[#6B7280] dark:text-slate-300 hover:text-[#2563EB] hover:bg-[#EFF6FF] dark:hover:bg-slate-800 transition-colors"
            title="Saved Favorites"
          >
            <Heart className="w-5 h-5" />
            {wishlist && wishlist.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#2563EB] text-white text-[10px] font-bold flex items-center justify-center shadow-sm">
                {wishlist.length}
              </span>
            )}
          </Link>

          {/* Compare Badge Link */}
          <Link
            to="/compare"
            className="relative p-2 rounded-xl text-[#6B7280] dark:text-slate-300 hover:text-[#2563EB] hover:bg-[#EFF6FF] dark:hover:bg-slate-800 transition-colors"
            title="Compare Queue"
          >
            <Scale className="w-5 h-5" />
            {compareCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 text-white text-[10px] font-bold flex items-center justify-center shadow-sm">
                {compareCount}
              </span>
            )}
          </Link>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-xl text-[#6B7280] dark:text-slate-300 hover:text-[#2563EB] hover:bg-[#EFF6FF] dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDarkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-[#2563EB]" />}
          </button>

          {/* Auth Button / User Avatar Menu */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center gap-2 p-1.5 rounded-xl border border-[#E5E7EB] dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-[#2563EB] transition-colors cursor-pointer"
              >
                <div className="w-7 h-7 rounded-lg bg-[#2563EB] text-white flex items-center justify-center font-bold text-xs">
                  {user.email ? user.email.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="hidden sm:inline text-xs font-semibold text-[#1F2937] dark:text-white max-w-[90px] truncate">
                  {profile?.full_name || user.displayName || 'Account'}
                </span>
              </button>

              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-slate-700 shadow-xl py-2 z-50 text-left">
                  <Link
                    to="/profile"
                    onClick={() => setIsProfileDropdownOpen(false)}
                    className="block px-4 py-2 text-xs font-semibold text-[#1F2937] dark:text-white hover:bg-[#EFF6FF] dark:hover:bg-slate-700"
                  >
                    Profile Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      setIsProfileDropdownOpen(false);
                      logout();
                    }}
                    className="w-full text-left px-4 py-2 text-xs font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#3B82F6] hover:opacity-95 text-white text-xs font-semibold shadow-md flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Login</span>
            </button>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-xl text-[#6B7280] dark:text-slate-300 lg:hidden cursor-pointer"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-b border-[#E5E7EB] dark:border-slate-800 bg-white dark:bg-[#0F172A] px-4 py-4 space-y-2 text-left">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }) =>
                `block px-4 py-2.5 rounded-xl text-xs font-semibold ${
                  isActive
                    ? 'bg-[#2563EB] text-white'
                    : 'text-[#1F2937] dark:text-slate-200 hover:bg-[#EFF6FF] dark:hover:bg-slate-800'
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </div>
      )}
    </header>
  );
}

export default Navbar;
