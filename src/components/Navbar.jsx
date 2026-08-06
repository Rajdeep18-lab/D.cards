import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../hooks/useAuth";
import { adminAuthService } from "../services/adminAuthService";

const links = [
  { name: "Home", target: "#home", view: "home" },
  { name: "Compare Cards", target: "#comparison", view: "compare" },
  { name: "Top Cards", target: "#cards", view: "cards" },
  { name: "Reviews", target: "#reviews", view: "reviews" },
];

function Navbar({ isDarkMode, toggleDarkMode, onOpenAuth, onOpenWishlist, onOpenContact, onOpenAbout, onOpenAdmin, compareCount = 0, currentView = "home", onNavigateView }) {
  const { wishlist } = useWishlist();
  const { user, profile, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAdminUser, setIsAdminUser] = useState(false);

  useEffect(() => {
    let isMounted = true;
    adminAuthService.checkIsAdmin(user).then(res => {
      if (isMounted) setIsAdminUser(res);
    });
    return () => { isMounted = false; };
  }, [user]);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      setScrolled(prev => (prev === isScrolled ? prev : isScrolled));
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setIsMobileMenuOpen(false);
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMobileMenuOpen]);

  const handleNavClick = (viewName, targetHash, profileTab = "profile") => {
    if (viewName === 'profile') {
      if (onNavigateView) onNavigateView('profile', profileTab);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      if (onNavigateView) onNavigateView('home', 'profile');
      if (targetHash) {
        setTimeout(() => {
          const el = document.querySelector(targetHash);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
          else window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 50);
      }
    }
  };

  return (
    <header 
      className={`sticky top-0 z-50 transition-all duration-500 ${
        scrolled 
          ? "backdrop-blur-xl border-b border-primary/10 dark:border-secondary/15 shadow-[0_4px_30px_rgba(0,0,0,0.15)] bg-white/80 dark:bg-[#09050a]/80"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 py-3">

        {/* Brand Logo */}
        <div className="flex items-center gap-2">
          <button 
            onClick={() => handleNavClick("home", "#home")}
            className="flex items-center gap-2.5 group select-none text-left bg-transparent border-0 cursor-pointer focus:outline-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-md shadow-secondary/25 group-hover:scale-105 transition-transform duration-300">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 8.5C2 6.01472 4.01472 4 6.5 4H17.5C19.9853 4 22 6.01472 22 8.5V15.5C22 17.9853 19.9853 20 17.5 20H6.5C4.01472 20 2 17.9853 2 15.5V8.5Z" stroke="white" strokeWidth="2" />
                <path d="M6 8H10" stroke="white" strokeWidth="2" strokeLinecap="round" />
                <circle cx="17.5" cy="15.5" r="1.5" fill="white" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-black tracking-tight leading-none text-gradient">D.Card</span>
              <span className="text-[9px] font-bold text-textMuted dark:text-roseGold tracking-widest uppercase">DEBIT CARDS</span>
            </div>
          </button>
        </div>

        {/* Nav Links */}
        <ul className="hidden items-center gap-7 text-sm font-semibold text-textSoft dark:text-slate-300 md:flex select-none">
          {links.map((link) => (
            <li key={link.name}>
              <button
                onClick={() => handleNavClick(link.view, link.target)}
                className={`relative transition-colors hover:text-secondary dark:hover:text-roseGold bg-transparent border-0 cursor-pointer ${
                  currentView === link.view ? 'text-secondary dark:text-roseGold font-bold' : ''
                }`}
              >
                {link.name}
              </button>
            </li>
          ))}
          {user && (
            <li>
              <button
                onClick={() => handleNavClick("profile", null, "profile")}
                className={`transition-colors hover:text-secondary dark:hover:text-roseGold cursor-pointer ${
                  currentView === "profile" ? 'text-secondary dark:text-roseGold font-bold' : ''
                }`}
              >
                My Profile
              </button>
            </li>
          )}
        </ul>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-3">

          {/* Wishlist Icon */}
          <motion.button
            onClick={() => handleNavClick("profile", null, "saved")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="View Saved Wishlist Cards"
            title="Saved Cards"
            className="relative w-8 h-8 md:w-[38px] md:h-[38px] rounded-full border flex items-center justify-center text-xs md:text-lg shadow-sm transition-all select-none cursor-pointer"
            style={{
              borderColor: wishlist.length > 0 ? "rgba(194,24,117,0.3)" : "var(--border-color)",
              background: wishlist.length > 0 ? "rgba(194,24,117,0.06)" : "var(--bg-chip)"
            }}
          >
            {wishlist.length > 0 ? "❤️" : "🤍"}
            {wishlist.length > 0 && (
              <motion.span
                key={wishlist.length}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-4 h-4 md:w-5 md:h-5 rounded-full bg-gradient-to-br from-secondary to-primary text-white text-[9px] md:text-[10px] font-black flex items-center justify-center border border-white dark:border-slate-900 shadow-md shadow-secondary/35"
              >
                {wishlist.length}
              </motion.span>
            )}
          </motion.button>

          {/* Compare Count Icon */}
          <div className="flex">
            <motion.button
              onClick={() => handleNavClick("home", "#comparison")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="View Comparison Queue"
              title="Comparison Queue"
              className="relative w-8 h-8 md:w-[38px] md:h-[38px] rounded-full border flex items-center justify-center text-xs md:text-lg shadow-sm transition-all select-none cursor-pointer"
              style={{
                borderColor: compareCount > 0 ? "rgba(194,24,117,0.3)" : "var(--border-color)",
                background: compareCount > 0 ? "rgba(194,24,117,0.06)" : "var(--bg-chip)"
              }}
            >
              📊
              {compareCount > 0 && (
                <motion.span
                  key={compareCount}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-4 h-4 md:w-5 md:h-5 rounded-full bg-gradient-to-br from-secondary to-primary text-white text-[9px] md:text-[10px] font-black flex items-center justify-center border border-white dark:border-slate-900 shadow-md shadow-secondary/35"
                >
                  {compareCount}
                </motion.span>
              )}
            </motion.button>
          </div>

          {/* Desktop Only Actions */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={onOpenAbout}
              className="text-sm font-semibold text-textSoft dark:text-slate-300 hover:text-secondary dark:hover:text-roseGold transition-colors cursor-pointer"
            >
              About Us
            </button>

            <button
              onClick={onOpenContact}
              className="text-sm font-semibold text-textSoft dark:text-slate-300 hover:text-secondary dark:hover:text-roseGold transition-colors cursor-pointer"
            >
              Contact
            </button>

            {/* Admin button temporarily disabled */}

            <div className="h-4 w-px bg-slate-200 dark:bg-secondary/20" />

            {/* User Profile Avatar Dropdown */}
            {user ? (
              <div className="relative group/user flex items-center select-none">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  aria-label="Open User Profile Menu"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/10 dark:bg-secondary/20 border border-secondary/30 font-bold text-xs text-secondary dark:text-roseGold cursor-pointer focus:outline-none"
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-secondary to-primary text-white text-[10px] font-black flex items-center justify-center shadow-inner overflow-hidden">
                    {profile?.profile_image ? (
                      <img src={profile.profile_image} alt="Avatar" width="24" height="24" loading="lazy" decoding="async" className="w-full h-full object-cover" />
                    ) : (
                      <span>{String(profile?.full_name || user?.email || 'U').charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                  <span className="max-w-[85px] truncate inline-block font-sans font-black">
                    {profile?.full_name ? String(profile.full_name).split(' ')[0] : 'Member'}
                  </span>
                  <span className="text-[8px] opacity-75 font-sans font-black">▼</span>
                </motion.button>
                
                {/* Profile Menu Dropdown (Strictly: My Profile, Saved Cards, Compare History, My Reviews, Notifications, Settings, Logout) */}
                <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl bg-cardBg dark:bg-[#0c050c] border border-slate-200 dark:border-secondary/20 p-2 shadow-[0_15px_30px_rgba(0,0,0,0.25)] dark:shadow-[0_15px_30px_rgba(134,0,56,0.25)] opacity-0 invisible group-hover/user:opacity-100 group-hover/user:visible transition-all duration-300 z-50">
                  <div className="px-3 py-2 border-b border-slate-100 dark:border-secondary/15 mb-1 text-left">
                    <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none">Signed In As</p>
                    <p className="text-xs font-black text-slate-800 dark:text-slate-100 mt-1 truncate">{profile?.full_name || user.email}</p>
                    <p className="text-[10px] text-gray-400 truncate">{user.email}</p>
                  </div>
                  
                  <div className="space-y-0.5 text-left text-xs font-bold text-slate-700 dark:text-slate-200">
                    <button
                      onClick={() => handleNavClick("profile", null, "profile")}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-secondary/10 hover:text-secondary dark:hover:text-roseGold flex items-center gap-2 cursor-pointer"
                    >
                      <span>👤</span> My Profile
                    </button>

                    <button
                      onClick={() => handleNavClick("profile", null, "saved")}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-secondary/10 hover:text-secondary dark:hover:text-roseGold flex items-center gap-2 cursor-pointer"
                    >
                      <span>❤️</span> Saved Cards ({wishlist.length})
                    </button>

                    <button
                      onClick={() => handleNavClick("profile", null, "compare")}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-secondary/10 hover:text-secondary dark:hover:text-roseGold flex items-center gap-2 cursor-pointer"
                    >
                      <span>🔄</span> Compare History
                    </button>

                    <button
                      onClick={() => handleNavClick("profile", null, "reviews")}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-secondary/10 hover:text-secondary dark:hover:text-roseGold flex items-center gap-2 cursor-pointer"
                    >
                      <span>✍️</span> My Reviews
                    </button>

                    <button
                      onClick={() => handleNavClick("profile", null, "notifications")}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-secondary/10 hover:text-secondary dark:hover:text-roseGold flex items-center gap-2 cursor-pointer"
                    >
                      <span>🔔</span> Notifications
                    </button>

                    <button
                      onClick={() => handleNavClick("profile", null, "settings")}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-secondary/10 hover:text-secondary dark:hover:text-roseGold flex items-center gap-2 cursor-pointer"
                    >
                      <span>⚙️</span> Settings
                    </button>

                    {/* Admin Intelligence link temporarily disabled */}
                  </div>

                  <div className="border-t border-slate-100 dark:border-secondary/15 mt-1 pt-1">
                    <button
                      onClick={async () => {
                        await logout();
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-black text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer select-none"
                    >
                      🚪 Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="btn-cta text-xs py-2 px-5 rounded-full shadow-md font-bold select-none cursor-pointer focus:outline-none"
              >
                Login / Sign Up
              </button>
            )}

            {/* Night Mode Pill Toggle Switch */}
            <button
              onClick={toggleDarkMode}
              className="relative w-16 h-8 rounded-full bg-slate-200 dark:bg-[#1e2538] border border-slate-300 dark:border-[#2e374f] p-1 flex items-center justify-between cursor-pointer transition-colors duration-500 shadow-inner select-none focus:outline-none"
              aria-label="Toggle Night Mode"
            >
              <span className="z-10 pl-1 text-[13px] flex items-center justify-center filter drop-shadow">☀️</span>
              <span className="z-10 pr-1 text-[13px] flex items-center justify-center filter drop-shadow">🌙</span>
              <motion.div
                className="absolute left-1 w-6 h-6 rounded-full bg-white dark:bg-[#C21875] shadow-md flex items-center justify-center"
                layout
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                animate={{ x: isDarkMode ? 32 : 0 }}
              />
            </button>
          </div>

          {/* Mobile Hamburger menu toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Toggle Navigation Menu"
            className="md:hidden w-8 h-8 rounded-full border border-slate-200 dark:border-secondary/20 flex items-center justify-center text-sm bg-white/10 dark:bg-black/10 text-slate-800 dark:text-slate-200 focus:outline-none active:scale-95 transition-all select-none"
          >
            ☰
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Overlay navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 z-[2000] bg-black/60 backdrop-blur-sm md:hidden"
            />
            
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-[290px] z-[2001] bg-[#faf6f8] dark:bg-[#0b0508] border-l border-slate-200 dark:border-secondary/15 p-6 shadow-2xl flex flex-col justify-between md:hidden overflow-y-auto custom-scrollbar"
            >
              <div className="space-y-6">
                <div className="flex justify-between items-center pb-4 border-b border-slate-200/50 dark:border-secondary/10">
                  <span className="text-base font-black text-gradient">Menu</span>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-8 h-8 rounded-full border border-slate-300 dark:border-secondary/10 flex items-center justify-center text-slate-500 dark:text-slate-400 focus:outline-none text-sm font-bold active:scale-90"
                  >
                    ✕
                  </button>
                </div>

                <ul className="space-y-3 text-sm font-bold text-slate-700 dark:text-slate-300 text-left">
                  {links.map((link) => (
                    <li key={link.name}>
                      <button
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          handleNavClick(link.view, link.target);
                        }}
                        className="block w-full text-left py-2 hover:text-secondary dark:hover:text-roseGold transition-colors"
                      >
                        {link.name}
                      </button>
                    </li>
                  ))}
                  {user && (
                    <li>
                      <button
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          handleNavClick("profile", null, "profile");
                        }}
                        className="block w-full text-left py-2 text-secondary dark:text-roseGold font-black"
                      >
                        👤 My Profile
                      </button>
                    </li>
                  )}
                  <li>
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        onOpenAbout();
                      }}
                      className="block w-full text-left py-2 hover:text-secondary dark:hover:text-roseGold transition-colors font-bold"
                    >
                      About D.Card & Team
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        onOpenContact();
                      }}
                      className="block w-full text-left py-2 hover:text-secondary dark:hover:text-roseGold transition-colors font-bold"
                    >
                      Contact Support
                    </button>
                  </li>
                </ul>
              </div>

              <div className="border-t border-slate-200/50 dark:border-secondary/10 pt-5 space-y-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider">Night Mode</span>
                  <button
                    onClick={toggleDarkMode}
                    className="relative w-16 h-8 rounded-full bg-slate-200 dark:bg-[#1e2538] border border-slate-300 dark:border-[#2e374f] p-1 flex items-center justify-between cursor-pointer transition-colors duration-500 shadow-inner select-none focus:outline-none"
                    aria-label="Toggle Night Mode"
                  >
                    <span className="z-10 pl-1 text-[13px] flex items-center justify-center filter drop-shadow">☀️</span>
                    <span className="z-10 pr-1 text-[13px] flex items-center justify-center filter drop-shadow">🌙</span>
                    <motion.div
                      className="absolute left-1 w-6 h-6 rounded-full bg-white dark:bg-[#C21875] shadow-md flex items-center justify-center"
                      layout
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      animate={{ x: isDarkMode ? 32 : 0 }}
                    />
                  </button>
                </div>

                <div className="bg-slate-100/50 dark:bg-secondary/5 rounded-2xl p-4 border border-slate-200/50 dark:border-secondary/10 text-left">
                  {user ? (
                    <div className="space-y-3">
                      <div>
                        <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none">Logged In As</p>
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-100 mt-1 truncate">{profile?.full_name || user.email}</p>
                      </div>

                      <button
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          handleNavClick("profile", null, "profile");
                        }}
                        className="w-full py-2.5 rounded-xl text-xs font-black text-white bg-gradient-to-r from-secondary to-primary shadow-sm active:scale-95 cursor-pointer text-center flex items-center justify-center gap-2"
                      >
                        <span>👤</span> View My Profile
                      </button>
                      
                      <button
                        onClick={async () => {
                          setIsMobileMenuOpen(false);
                          await logout();
                        }}
                        className="w-full py-2.5 rounded-xl text-xs font-black text-white bg-rose-500 hover:bg-rose-600 transition-colors shadow-sm active:scale-95 cursor-pointer text-center"
                      >
                        🚪 Logout
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        onOpenAuth();
                      }}
                      className="w-full py-2.5 rounded-xl text-xs font-black text-white bg-gradient-to-r from-primary to-secondary shadow-sm active:scale-95 cursor-pointer text-center"
                    >
                      Login / Sign Up
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Navbar;
