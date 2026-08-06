import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import { compareService } from '../services/compareService';
import { debitCards } from '../data/mockData';
import { INDIAN_LOCATIONS } from '../data/indianLocations';
import DebitCardVisual from './DebitCardVisual';

const AVATAR_PRESETS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
];

const INITIAL_NOTIFICATIONS = [
  { id: 1, title: "Account Verified", desc: "Welcome to your D.Card profile portal.", date: "Today", icon: "✨" },
  { id: 2, title: "Card Fee Alert", desc: "HDFC & ICICI annual maintenance charge schedules updated for 2026.", date: "Yesterday", icon: "📢" },
  { id: 3, title: "Forex Feature Update", desc: "Zero forex markup cards updated in Travel segment.", date: "3 days ago", icon: "✈️" }
];

function UserProfilePage({ activeTab = "profile", onSelectCard, onCompareCards, isDarkMode, toggleDarkMode }) {
  const { user, profile, updateProfile, updateEmail, logout } = useAuth();
  const { wishlist, removeFromWishlist } = useWishlist();
  const toast = useToast();

  const [currentTab, setCurrentTab] = useState(activeTab);

  // Profile Form States
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [country, setCountry] = useState('India');
  const [state, setState] = useState('Maharashtra');
  const [city, setCity] = useState('Mumbai');
  const [profileImage, setProfileImage] = useState('');
  const [occupation, setOccupation] = useState('Working Professional');

  // Compare History State
  const [compareLogs, setCompareLogs] = useState([]);
  const [loadingCompareLogs, setLoadingCompareLogs] = useState(false);

  // User Reviews State
  const [userReviews, setUserReviews] = useState([
    { id: 1, cardId: 1, cardName: "HDFC Millennia", bank: "HDFC Bank", rating: 5, text: "Excellent cashback on online shopping! Seamless lounge access.", date: "15 Jan 2026" }
  ]);
  const [editingReview, setEditingReview] = useState(null);
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);

  // Notifications State
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  // Settings & Email State
  const [notificationPrefs, setNotificationPrefs] = useState({
    email: true,
    inApp: true,
    promos: false,
    security: true
  });
  const [newEmail, setNewEmail] = useState('');
  const [isChangingEmail, setIsChangingEmail] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);

  useEffect(() => {
    setCurrentTab(activeTab);
  }, [activeTab]);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || profile.name || '');
      setPhoneNumber(profile.phone || '');
      setCountry(profile.country || 'India');
      setState(profile.state || 'Maharashtra');
      setCity(profile.city || 'Mumbai');
      setProfileImage(profile.profile_image || '');
      setOccupation(profile.occupation || 'Working Professional');
      if (profile.notification_preferences) {
        setNotificationPrefs(profile.notification_preferences);
      }
    }
  }, [profile]);

  // Fetch Compare History when user switches to 'compare' tab
  useEffect(() => {
    if (currentTab === 'compare' && user?.id) {
      setLoadingCompareLogs(true);
      compareService.getComparisonHistory(user.id)
        .then(logs => setCompareLogs(logs || []))
        .catch(err => console.warn('Could not load compare history:', err))
        .finally(() => setLoadingCompareLogs(false));
    }
  }, [currentTab, user?.id]);

  const availableCities = INDIAN_LOCATIONS[state] || ["Other"];

  // Saved Wishlist full card items
  const savedCardObjects = useMemo(() => {
    return wishlist.map(item => {
      const full = debitCards.find(c => c.id === item.id);
      return full || item;
    });
  }, [wishlist]);

  // Recommended Cards tailored to user occupation / profile
  const recommendedCards = useMemo(() => {
    let cards = [...debitCards];
    const occ = (occupation || '').toLowerCase();
    if (occ.includes("student")) {
      cards = cards.filter(c => c.studentFriendly || (typeof c.numAnnualFee === 'number' ? c.numAnnualFee : parseFloat(String(c.annualFee || '').replace(/[^0-9.]/g, '')) || 0) <= 250);
    } else if (occ.includes("travel")) {
      cards = cards.filter(c => c.travelZeroForex || (c.loungeAccess && !String(c.loungeAccess).toLowerCase().startsWith('no')));
    } else if (occ.includes("senior")) {
      cards = cards.filter(c => c.seniorCitizen || c.interestRate >= 6.5);
    } else if (occ.includes("women")) {
      cards = cards.filter(c => c.womenSpecial || c.rating >= 4.5);
    } else {
      cards = cards.filter(c => (c.rating || 0) >= 4.4 || String(c.category || '').toLowerCase() === 'rewards' || String(c.category || '').toLowerCase() === 'premium');
    }
    return cards.slice(0, 6);
  }, [occupation]);

  // Executive Health Score & Stats Calculation
  const portfolioStats = useMemo(() => {
    const cardCount = savedCardObjects.length;
    let totalLoungeVisits = 0;
    let zeroBalanceCards = 0;
    let feeSavingsEst = 0;

    savedCardObjects.forEach(c => {
      const loungeStr = String(c.loungeAccess || '').toLowerCase();
      if (loungeStr && !loungeStr.startsWith('no')) totalLoungeVisits += 4;
      if (c.minBalance === 0) zeroBalanceCards += 1;
      const feeNum = typeof c.annualFee === 'number' ? c.annualFee : parseFloat(String(c.annualFee || '').replace(/[^0-9.]/g, '')) || 0;
      if (feeNum === 0) feeSavingsEst += 500;
    });

    const fitScore = Math.min(99, Math.max(75, 75 + (cardCount * 4) + (zeroBalanceCards * 5) + (totalLoungeVisits > 0 ? 6 : 0)));

    return {
      fitScore,
      cardCount,
      totalLoungeVisits: totalLoungeVisits || (cardCount > 0 ? 4 : 0),
      feeSavingsEst: feeSavingsEst || 1200
    };
  }, [savedCardObjects]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (savingProfile) return;

    setSavingProfile(true);
    try {
      const updated = await updateProfile({
        full_name: String(fullName || '').trim(),
        name: String(fullName || '').trim(),
        phone: String(phoneNumber || '').trim(),
        country: String(country || '').trim(),
        state: String(state || '').trim(),
        city: String(city || '').trim(),
        profile_image: String(profileImage || '').trim(),
        occupation: String(occupation || '').trim(),
        notification_preferences: notificationPrefs
      });
      if (updated) {
        toast("Profile updated successfully!", "success");
      }
    } catch (err) {
      toast(err.message || "Failed to update profile.", "error");
    } finally {
      setSavingProfile(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 text-left select-none space-y-6">
      
      {/* ── PROFILE TOP HERO EXECUTIVE DASHBOARD ── */}
      <div className="relative rounded-[32px] bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#2563EB] p-6 sm:p-8 text-white shadow-xl overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-6">
        <div className="absolute right-0 top-0 w-80 h-80 rounded-full bg-white/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-center gap-5">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-slate-900 border-4 border-white/30 overflow-hidden shadow-2xl flex items-center justify-center text-3xl font-black flex-shrink-0">
            {profileImage ? (
              <img src={profileImage} alt="Profile Avatar" width="96" height="96" loading="lazy" decoding="async" className="w-full h-full object-cover" />
            ) : (
              <span>{String(fullName || user?.email || 'U').charAt(0).toUpperCase()}</span>
            )}
          </div>

          <div className="text-center sm:text-left space-y-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                {fullName || 'Valued Member'}
              </h1>
              <span className="px-3 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-black uppercase tracking-wider">
                ✓ Verified Member
              </span>
            </div>
            <p className="text-xs sm:text-sm text-gray-200 font-semibold">{user?.email}</p>
            <p className="text-[11px] text-roseGold font-medium">Segment: {occupation} • {city}, {state}</p>
          </div>
        </div>

        {/* Financial Health Score Stats Panel */}
        <div className="relative z-10 grid grid-cols-3 gap-3 bg-black/25 backdrop-blur-xl border border-white/15 p-4 rounded-2xl w-full lg:w-auto">
          <div className="text-center px-2">
            <p className="text-[10px] font-black text-roseGold uppercase tracking-wider">FIT SCORE™</p>
            <p className="text-xl sm:text-2xl font-black text-emerald-400 mt-0.5">{portfolioStats.fitScore}/100</p>
          </div>
          <div className="text-center px-2 border-x border-white/10">
            <p className="text-[10px] font-black text-roseGold uppercase tracking-wider">SAVED CARDS</p>
            <p className="text-xl sm:text-2xl font-black text-white mt-0.5">{portfolioStats.cardCount}</p>
          </div>
          <div className="text-center px-2">
            <p className="text-[10px] font-black text-roseGold uppercase tracking-wider">LOUNGE PERKS</p>
            <p className="text-xl sm:text-2xl font-black text-amber-300 mt-0.5">{portfolioStats.totalLoungeVisits} Visits</p>
          </div>
        </div>

        <button
          onClick={() => logout()}
          className="relative z-10 py-2.5 px-6 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-sm active:scale-95 flex-shrink-0"
        >
          🚪 Logout
        </button>
      </div>

      {/* Modern Profile Sub-Navigation Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 dark:border-secondary/15 custom-scrollbar">
        {[
          { id: "profile", tab: "profile", label: "My Profile", icon: "👤" },
          { id: "saved", tab: "saved", label: `Saved Wallet (${wishlist.length})`, icon: "💳" },
          { id: "recommended", tab: "recommended", label: "AI Recommendations", icon: "✨" },
          { id: "compare", tab: "compare", label: "Compare History", icon: "🔄" },
          { id: "reviews", tab: "reviews", label: `My Reviews (${userReviews.length})`, icon: "✍️" },
          { id: "notifications", tab: "notifications", label: `Alerts (${notifications.length})`, icon: "🔔" },
          { id: "settings", tab: "settings", label: "Settings", icon: "⚙️" }
        ].map((item) => (
          <button
            key={item.tab}
            onClick={() => setCurrentTab(item.tab)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              currentTab === item.tab
                ? "bg-secondary text-white shadow-md shadow-secondary/30 scale-105"
                : "bg-white/40 dark:bg-black/25 text-slate-600 dark:text-gray-300 hover:bg-secondary/10 hover:text-secondary border border-slate-200 dark:border-secondary/15"
            }`}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      {/* Dynamic Tab Body Render */}
      <AnimatePresence mode="wait">

        {/* 1. MY PROFILE TAB */}
        {currentTab === 'profile' && (
          <motion.form
            key="profile"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            onSubmit={handleSaveProfile}
            className="space-y-6"
          >
            {/* Avatar Selector */}
            <div className="p-6 rounded-3xl bg-white/40 dark:bg-black/30 backdrop-blur-xl border border-slate-200 dark:border-secondary/20 shadow-soft">
              <h3 className="text-base font-black text-slate-800 dark:text-slate-100 mb-3 flex items-center gap-2">
                <span>🖼️</span> Profile Picture / Avatar Presets
              </h3>
              <div className="flex items-center gap-3 overflow-x-auto pb-2 mb-3">
                {AVATAR_PRESETS.map((url, idx) => (
                  <img
                    key={idx}
                    src={url}
                    alt={`Avatar ${idx}`}
                    width="48"
                    height="48"
                    loading="lazy"
                    decoding="async"
                    onClick={() => setProfileImage(url)}
                    className={`w-12 h-12 rounded-full object-cover cursor-pointer border-2 transition-all ${
                      profileImage === url ? 'border-secondary scale-110 shadow-lg' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Account Info Form Grid */}
            <div className="p-6 rounded-3xl bg-white/40 dark:bg-black/30 backdrop-blur-xl border border-slate-200 dark:border-secondary/20 shadow-soft space-y-4">
              <h3 className="text-base font-black text-slate-800 dark:text-slate-100 mb-2 flex items-center gap-2">
                <span>📋</span> Personal Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-secondary/20 bg-white dark:bg-black/40 text-xs font-bold text-slate-900 dark:text-slate-100 outline-none focus:border-secondary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-secondary/20 bg-white dark:bg-black/40 text-xs font-bold text-slate-900 dark:text-slate-100 outline-none focus:border-secondary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Occupation / Profile</label>
                  <select
                    value={occupation}
                    onChange={(e) => setOccupation(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-secondary/20 bg-white dark:bg-black/40 text-xs font-bold text-slate-900 dark:text-slate-100 outline-none focus:border-secondary cursor-pointer"
                  >
                    <option value="Working Professional">💼 Working Professional</option>
                    <option value="Student">🎓 Student</option>
                    <option value="Traveler">✈️ Traveler</option>
                    <option value="Senior Citizen">👴 Senior Citizen</option>
                    <option value="Women">👩 Women Special</option>
                    <option value="Premium User">👑 Elite Premium</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">State</label>
                  <select
                    value={state}
                    onChange={(e) => {
                      setState(e.target.value);
                      if (INDIAN_LOCATIONS[e.target.value]) setCity(INDIAN_LOCATIONS[e.target.value][0]);
                    }}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-secondary/20 bg-white dark:bg-black/40 text-xs font-bold text-slate-900 dark:text-slate-100 outline-none focus:border-secondary cursor-pointer"
                  >
                    {Object.keys(INDIAN_LOCATIONS).map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">City</label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-secondary/20 bg-white dark:bg-black/40 text-xs font-bold text-slate-900 dark:text-slate-100 outline-none focus:border-secondary cursor-pointer"
                  >
                    {availableCities.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div className="pt-3 flex justify-end">
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="px-6 py-2.5 rounded-full bg-gradient-to-r from-primary to-secondary text-white text-xs font-black uppercase tracking-wider shadow-md hover:brightness-110 active:scale-95 transition-all cursor-pointer"
                >
                  {savingProfile ? 'Saving...' : 'Save Profile Changes 💾'}
                </button>
              </div>
            </div>
          </motion.form>
        )}

        {/* 2. SAVED CARDS WALLET TAB */}
        {currentTab === 'saved' && (
          <motion.div
            key="saved"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <span>💳</span> My Saved Debit Card Portfolio ({savedCardObjects.length})
              </h3>
            </div>

            {savedCardObjects.length === 0 ? (
              <div className="py-16 text-center rounded-3xl bg-white/40 dark:bg-black/30 border border-slate-200 dark:border-white/10 space-y-3">
                <div className="text-5xl">❤️</div>
                <h4 className="text-lg font-black text-slate-800 dark:text-slate-200">Your Saved Portfolio is Empty</h4>
                <p className="text-xs text-textSoft dark:text-slate-400 max-w-sm mx-auto">
                  Click the heart icon on any debit card while browsing to save it to your personal wallet.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedCardObjects.map(card => (
                  <div key={card.id} className="p-4 rounded-3xl bg-white/60 dark:bg-black/40 border border-slate-200 dark:border-secondary/20 shadow-soft flex flex-col justify-between">
                    <DebitCardVisual mode="grid" card={card} />
                    <div className="mt-3 pt-3 border-t border-slate-200/60 dark:border-white/10 flex items-center justify-between">
                      <button
                        onClick={() => onSelectCard && onSelectCard(card)}
                        className="text-xs font-black text-secondary dark:text-roseGold hover:underline cursor-pointer"
                      >
                        View Specs ➔
                      </button>
                      <button
                        onClick={() => removeFromWishlist(card.id)}
                        className="text-xs font-bold text-red-500 hover:underline cursor-pointer"
                      >
                        Remove 🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* 3. AI RECOMMENDATIONS TAB */}
        {currentTab === 'recommended' && (
          <motion.div
            key="recommended"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6"
          >
            <div className="p-6 rounded-3xl bg-gradient-to-r from-secondary/10 to-primary/10 border border-secondary/20 text-left">
              <h3 className="text-lg font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <span>✨</span> AI Curated Matches for {occupation}
              </h3>
              <p className="text-xs text-textSoft dark:text-slate-300 mt-1">
                Our recommendation engine filtered cards based on your life stage, fee limits, and reward structures.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedCards.map(card => (
                <div key={card.id} className="p-4 rounded-3xl bg-white/60 dark:bg-black/40 border border-slate-200 dark:border-secondary/20 shadow-soft flex flex-col justify-between">
                  <DebitCardVisual mode="grid" card={card} />
                  <button
                    onClick={() => onSelectCard && onSelectCard(card)}
                    className="mt-3 w-full py-2 rounded-xl bg-secondary text-white text-xs font-black shadow cursor-pointer hover:brightness-110"
                  >
                    Explore Card Specs ➔
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* 4. COMPARE HISTORY TAB */}
        {currentTab === 'compare' && (
          <motion.div
            key="compare"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="p-6 rounded-3xl bg-white/40 dark:bg-black/30 backdrop-blur-xl border border-slate-200 dark:border-secondary/20 shadow-soft space-y-4"
          >
            <h3 className="text-lg font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <span>🔄</span> Compare Audit Log
            </h3>
            {compareLogs.length === 0 ? (
              <p className="text-xs text-slate-500 py-8 text-center">No comparison history entries logged yet.</p>
            ) : (
              <div className="space-y-3">
                {compareLogs.map((log) => (
                  <div key={log.id} className="p-4 rounded-2xl bg-white/60 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-black text-slate-800 dark:text-slate-100">{log.comparedCards?.join(' vs ')}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{log.timestamp}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteCompareHistory(log.id)}
                      className="text-xs font-bold text-rose-500 hover:underline cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}

export default UserProfilePage;
