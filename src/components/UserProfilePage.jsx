import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import { compareService } from '../services/compareService';
import { debitCards } from '../data/mockData';
import { INDIAN_LOCATIONS } from '../data/indianLocations';

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
      cards = cards.filter(c => c.studentFriendly || (typeof c.numAnnualFee === 'number' ? c.numAnnualFee : (typeof c.annualFee === 'number' ? c.annualFee : parseFloat(String(c.annualFee || '').replace(/[^0-9.]/g, '')) || 0)) <= 250);
    } else if (occ.includes("travel")) {
      cards = cards.filter(c => c.travelZeroForex || (c.loungeAccess && !String(c.loungeAccess).toLowerCase().startsWith('no')));
    } else if (occ.includes("senior")) {
      cards = cards.filter(c => c.seniorCitizen || c.interestRate >= 6.5);
    } else if (occ.includes("women")) {
      cards = cards.filter(c => c.womenSpecial || c.rating >= 4.5);
    } else {
      // Working Professional / Premium User
      cards = cards.filter(c => (c.rating || 0) >= 4.4 || String(c.category || '').toLowerCase() === 'rewards' || String(c.category || '').toLowerCase() === 'premium');
    }
    return cards.slice(0, 6);
  }, [occupation]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (savingProfile) return;

    // Check if any field has changed
    const currentName = profile?.full_name || profile?.name || '';
    const currentPhone = profile?.phone || profile?.phone_number || '';
    const currentCountry = profile?.country || 'India';
    const currentState = profile?.state || '';
    const currentCity = profile?.city || '';
    const currentImage = profile?.profile_image || profile?.avatar_url || '';
    const currentOcc = profile?.occupation || 'Working Professional';

    const hasChanged =
      String(fullName || '').trim() !== String(currentName || '').trim() ||
      String(phoneNumber || '').trim() !== String(currentPhone || '').trim() ||
      String(country || '').trim() !== String(currentCountry || '').trim() ||
      String(state || '').trim() !== String(currentState || '').trim() ||
      String(city || '').trim() !== String(currentCity || '').trim() ||
      String(profileImage || '').trim() !== String(currentImage || '').trim() ||
      String(occupation || '').trim() !== String(currentOcc || '').trim();

    if (!hasChanged) {
      toast("No changes detected.", "info");
      return;
    }

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
        setFullName(updated.full_name || updated.name || '');
        setPhoneNumber(updated.phone || '');
        setCountry(updated.country || 'India');
        setState(updated.state || '');
        setCity(updated.city || '');
        setProfileImage(updated.profile_image || '');
        setOccupation(updated.occupation || 'Working Professional');
      }
    } catch (err) {
      toast(err.message || "Failed to update profile.", "error");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleEmailUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!newEmail || newEmail === user?.email) return;
    try {
      await updateEmail(newEmail);
      setIsChangingEmail(false);
      setNewEmail('');
    } catch (err) {
      // Handled in toast
    }
  };

  const handleDeleteCompareHistory = async (historyId) => {
    if (!user?.id) return;
    try {
      await compareService.deleteComparisonHistory(user.id, historyId);
      setCompareLogs(prev => prev.filter(item => item.id !== historyId));
      toast('Comparison history entry deleted', 'info');
    } catch (err) {
      toast('Failed to delete comparison history item.', 'error');
    }
  };

  const handleUpdateReview = (e) => {
    e.preventDefault();
    if (!editingReview) return;
    setUserReviews(prev =>
      prev.map(r => r.id === editingReview.id ? { ...r, rating: reviewRating, text: reviewText } : r)
    );
    setEditingReview(null);
    toast('Review updated successfully!', 'success');
  };

  const handleDeleteReview = (reviewId) => {
    setUserReviews(prev => prev.filter(r => r.id !== reviewId));
    toast('Review removed', 'info');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 text-left select-none space-y-6">
      
      {/* Profile Top Hero Banner */}
      <div className="relative rounded-[32px] bg-gradient-to-r from-[#860038] via-[#C21875] to-[#7A0F52] p-6 sm:p-8 text-white shadow-xl overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="absolute right-0 top-0 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-center gap-5">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-slate-900 border-4 border-white/30 overflow-hidden shadow-2xl flex items-center justify-center text-3xl font-black flex-shrink-0">
            {profileImage ? (
              <img src={profileImage} alt="Profile Avatar" className="w-full h-full object-cover" />
            ) : (
              <span>{String(fullName || user?.email || 'U').charAt(0).toUpperCase()}</span>
            )}
          </div>

          <div className="text-center sm:text-left space-y-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="text-2xl sm:text-3xl font-black font-serif tracking-tight">
                {fullName || 'Valued Member'}
              </h1>
              <span className="px-3 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-black uppercase tracking-wider">
                👤 {profile?.user_type || 'Working Professional'}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-gray-200 font-semibold">{user?.email}</p>
            <p className="text-[11px] text-roseGold font-medium">Location: {city}, {state}</p>
          </div>
        </div>

        <button
          onClick={() => logout()}
          className="relative z-10 py-2.5 px-6 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-sm active:scale-95"
        >
          🚪 Logout Session
        </button>
      </div>

      {/* Modern Profile Sub-Navigation Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 dark:border-secondary/15 custom-scrollbar">
        {[
          { id: "profile", tab: "profile", label: "My Profile", icon: "👤" },
          { id: "saved", tab: "saved", label: `Saved Cards (${wishlist.length})`, icon: "❤️" },
          { id: "recommended", tab: "recommended", label: "Recommended Cards", icon: "✨" },
          { id: "compare", tab: "compare", label: "Compare History", icon: "🔄" },
          { id: "reviews", tab: "reviews", label: `My Reviews (${userReviews.length})`, icon: "✍️" },
          { id: "notifications", tab: "notifications", label: `Notifications (${notifications.length})`, icon: "🔔" },
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
              <h3 className="text-base font-black font-serif text-slate-800 dark:text-slate-100 mb-3 flex items-center gap-2">
                <span>🖼️</span> Profile Picture / Avatar
              </h3>
              <div className="flex items-center gap-3 overflow-x-auto pb-2 mb-3">
                {AVATAR_PRESETS.map((url, idx) => (
                  <img
                    key={idx}
                    src={url}
                    alt={`Avatar ${idx}`}
                    onClick={() => setProfileImage(url)}
                    className={`w-12 h-12 rounded-full object-cover cursor-pointer border-2 transition-all ${
                      profileImage === url ? 'border-secondary scale-110 shadow-lg' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  />
                ))}
              </div>
              <input
                type="url"
                value={profileImage}
                onChange={(e) => setProfileImage(e.target.value)}
                className="w-full rounded-2xl border border-highlight dark:border-secondary/20 bg-white dark:bg-black/30 px-4 py-2.5 text-xs text-slate-800 dark:text-white font-semibold outline-none focus:border-secondary"
                placeholder="Or paste custom image URL (https://...)"
              />
            </div>

            {/* Editable Information Fields */}
            <div className="p-6 rounded-3xl bg-white/40 dark:bg-black/30 backdrop-blur-xl border border-slate-200 dark:border-secondary/20 shadow-soft space-y-4">
              <h3 className="text-base font-black font-serif text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <span>📋</span> Personal Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-secondary dark:text-roseGold uppercase tracking-widest mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full rounded-2xl border border-highlight dark:border-secondary/20 bg-white dark:bg-black/30 px-4 py-3 text-xs text-slate-800 dark:text-white font-semibold outline-none focus:border-secondary"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-secondary dark:text-roseGold uppercase tracking-widest mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full rounded-2xl border border-highlight dark:border-secondary/20 bg-white dark:bg-black/30 px-4 py-3 text-xs text-slate-800 dark:text-white font-semibold outline-none focus:border-secondary"
                    placeholder="+91 9876543210"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-secondary dark:text-roseGold uppercase tracking-widest mb-1">
                    Account Email (Read-Only)
                  </label>
                  <input
                    type="email"
                    readOnly
                    value={user?.email || ''}
                    className="w-full rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 px-4 py-3 text-xs text-gray-500 font-semibold cursor-not-allowed outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-secondary dark:text-roseGold uppercase tracking-widest mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full rounded-2xl border border-highlight dark:border-secondary/20 bg-white dark:bg-black/30 px-4 py-3 text-xs text-slate-800 dark:text-white font-semibold outline-none focus:border-secondary"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-secondary dark:text-roseGold uppercase tracking-widest mb-1">
                    State
                  </label>
                  <select
                    value={state}
                    onChange={(e) => {
                      const newState = e.target.value;
                      setState(newState);
                      if (INDIAN_LOCATIONS[newState] && INDIAN_LOCATIONS[newState].length > 0) {
                        setCity(INDIAN_LOCATIONS[newState][0]);
                      }
                    }}
                    className="w-full rounded-2xl border border-highlight dark:border-secondary/20 bg-white dark:bg-[#160814]/90 px-3 py-3 text-xs text-slate-800 dark:text-white font-semibold outline-none cursor-pointer"
                  >
                    {Object.keys(INDIAN_LOCATIONS).map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-secondary dark:text-roseGold uppercase tracking-widest mb-1">
                    City
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full rounded-2xl border border-highlight dark:border-secondary/20 bg-white dark:bg-[#160814]/90 px-3 py-3 text-xs text-slate-800 dark:text-white font-semibold outline-none cursor-pointer"
                  >
                    {availableCities.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  if (profile) {
                    setFullName(profile.full_name || profile.name || '');
                    setPhoneNumber(profile.phone || '');
                    setCountry(profile.country || 'India');
                    setState(profile.state || 'Maharashtra');
                    setCity(profile.city || 'Mumbai');
                    setProfileImage(profile.profile_image || '');
                    setOccupation(profile.occupation || 'Working Professional');
                    toast("Changes cancelled.", "info");
                  }
                }}
                className="py-3.5 px-6 rounded-full border border-slate-300 dark:border-white/20 text-slate-700 dark:text-gray-300 font-bold text-xs uppercase tracking-wider hover:bg-slate-100 dark:hover:bg-white/10 transition-all cursor-pointer"
              >
                Cancel
              </button>

              <motion.button
                type="submit"
                disabled={savingProfile}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="py-3.5 px-8 rounded-full bg-gradient-to-r from-secondary to-primary text-white font-black text-xs uppercase tracking-widest shadow-xl border border-white/20 cursor-pointer disabled:opacity-50 flex items-center gap-2"
              >
                {savingProfile ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Saving Profile...</span>
                  </>
                ) : (
                  <span>Save Profile Changes 💾</span>
                )}
              </motion.button>
            </div>
          </motion.form>
        )}

        {/* 2. SAVED CARDS TAB */}
        {currentTab === 'saved' && (
          <motion.div
            key="saved"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="p-6 rounded-3xl bg-white/40 dark:bg-black/30 backdrop-blur-xl border border-slate-200 dark:border-secondary/20 shadow-soft"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-black font-serif text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <span>❤️</span> Saved Bookmarked Cards ({savedCardObjects.length})
              </h3>
            </div>

            {savedCardObjects.length === 0 ? (
              <div className="py-12 text-center border-2 border-dashed border-slate-200 dark:border-white/10 rounded-2xl">
                <p className="text-4xl mb-2 select-none">💳</p>
                <h4 className="text-base font-black text-slate-800 dark:text-slate-100">No Saved Cards Yet</h4>
                <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
                  Browse cards and click the ❤️ icon to bookmark your favorites for quick comparison.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {savedCardObjects.map((card) => (
                  <motion.div
                    key={card.id}
                    whileHover={{ y: -4 }}
                    className="p-4 rounded-2xl bg-white/60 dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] font-black uppercase text-secondary dark:text-roseGold tracking-wider">{card.bank}</span>
                        <button
                          onClick={() => removeFromWishlist(card.id)}
                          className="text-xs text-rose-500 hover:text-rose-700 font-black cursor-pointer"
                          title="Remove from saved"
                        >
                          ✕ Remove
                        </button>
                      </div>
                      <h4 className="text-sm font-black text-slate-800 dark:text-slate-100 mt-1.5">{card.cardName}</h4>
                      <p className="text-[11px] text-gray-500 font-semibold mt-1">Annual Fee: {card.annualFee === 0 ? "Free" : `₹${card.annualFee}`}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/10 flex gap-2">
                      <button
                        onClick={() => onSelectCard(card)}
                        className="flex-1 py-2 rounded-xl bg-secondary/10 hover:bg-secondary/20 text-secondary dark:text-roseGold text-xs font-bold transition-all cursor-pointer text-center"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => onCompareCards(card)}
                        className="py-2 px-3 rounded-xl bg-gradient-to-r from-secondary to-primary text-white text-xs font-bold transition-all cursor-pointer text-center shadow"
                      >
                        Compare 📊
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* 2.5. RECOMMENDED CARDS TAB */}
        {currentTab === 'recommended' && (
          <motion.div
            key="recommended"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="p-6 rounded-3xl bg-white/40 dark:bg-black/30 backdrop-blur-xl border border-slate-200 dark:border-secondary/20 shadow-soft space-y-6"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div>
                <h3 className="text-lg font-black font-serif text-slate-800 dark:text-slate-100 flex items-center gap-2">
                  <span>✨</span> AI Curated Card Recommendations
                </h3>
                <p className="text-xs text-textSoft dark:text-gray-400 font-medium">
                  Tailored to your profile: <span className="font-bold text-secondary dark:text-roseGold">{occupation}</span> in <span className="font-bold text-secondary dark:text-roseGold">{city}, {state}</span>
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-secondary/10 text-secondary dark:text-roseGold text-[10px] font-black uppercase tracking-wider border border-secondary/20">
                🎯 High Match Algorithm
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {recommendedCards.map((card) => (
                <motion.div
                  key={card.id}
                  whileHover={{ y: -4 }}
                  className="p-5 rounded-2xl bg-white/60 dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[10px] font-black uppercase text-secondary dark:text-roseGold tracking-wider">{card.bank}</span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">
                        98% Match
                      </span>
                    </div>

                    <h4 className="text-sm font-black text-slate-800 dark:text-slate-100">{card.cardName}</h4>
                    <p className="text-xs text-textSoft dark:text-gray-300 mt-1 font-medium line-clamp-2">{card.benefits}</p>

                    <div className="mt-3 p-2.5 rounded-xl bg-slate-50 dark:bg-black/40 border border-slate-100 dark:border-white/5 text-[11px] space-y-1">
                      <div className="flex justify-between">
                        <span className="text-gray-500 font-semibold">Annual Fee:</span>
                        <span className="font-bold text-slate-800 dark:text-white">{card.annualFee === 0 ? '₹0 (Free)' : `₹${card.annualFee}`}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500 font-semibold">Min Balance:</span>
                        <span className="font-bold text-slate-800 dark:text-white">{card.minBalance === 0 ? 'Zero Balance' : (typeof card.minBalance === 'number' ? `₹${card.minBalance.toLocaleString('en-IN')}` : 'N/A')}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/10 flex gap-2">
                    <button
                      onClick={() => onSelectCard(card)}
                      className="flex-1 py-2 rounded-xl bg-secondary/10 hover:bg-secondary/20 text-secondary dark:text-roseGold text-xs font-bold transition-all cursor-pointer text-center"
                    >
                      View Specs
                    </button>
                    <button
                      onClick={() => onCompareCards(card)}
                      className="py-2 px-3 rounded-xl bg-gradient-to-r from-secondary to-primary text-white text-xs font-bold transition-all cursor-pointer text-center shadow"
                    >
                      Compare 📊
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* 3. COMPARE HISTORY TAB */}
        {currentTab === 'compare' && (
          <motion.div
            key="compare"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="p-6 rounded-3xl bg-white/40 dark:bg-black/30 backdrop-blur-xl border border-slate-200 dark:border-secondary/20 shadow-soft"
          >
            <h3 className="text-lg font-black font-serif text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2">
              <span>🔄</span> Comparison History Log
            </h3>

            {loadingCompareLogs ? (
              <div className="py-8 text-center text-xs font-bold text-gray-400">Loading comparison logs...</div>
            ) : compareLogs.length === 0 ? (
              <div className="py-12 text-center border-2 border-dashed border-slate-200 dark:border-white/10 rounded-2xl">
                <p className="text-4xl mb-2">📊</p>
                <h4 className="text-base font-black text-slate-800 dark:text-slate-100">No Comparison History</h4>
                <p className="text-xs text-gray-400 mt-1">Select cards from the main list to generate side-by-side matrices.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {compareLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-4 rounded-2xl bg-white/60 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        {new Date(log.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                      <h4 className="text-xs sm:text-sm font-black text-slate-800 dark:text-slate-100 mt-0.5">
                        Compared: {log.compared_card_names ? log.compared_card_names.join(' vs ') : `Cards [${log.compared_cards.join(', ')}]`}
                      </h4>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleDeleteCompareHistory(log.id)}
                        className="py-1.5 px-3 rounded-xl bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 text-xs font-bold cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* 4. MY REVIEWS TAB */}
        {currentTab === 'reviews' && (
          <motion.div
            key="reviews"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="p-6 rounded-3xl bg-white/40 dark:bg-black/30 backdrop-blur-xl border border-slate-200 dark:border-secondary/20 shadow-soft space-y-6"
          >
            <h3 className="text-lg font-black font-serif text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <span>✍️</span> My Submitted Reviews ({userReviews.length})
            </h3>

            {editingReview ? (
              <form onSubmit={handleUpdateReview} className="p-4 rounded-2xl bg-white/60 dark:bg-white/5 border border-secondary/30 space-y-3">
                <h4 className="text-xs font-black text-slate-800 dark:text-slate-100">Editing Review for {editingReview.cardName}</h4>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 mb-1">Rating</label>
                  <select
                    value={reviewRating}
                    onChange={(e) => setReviewRating(Number(e.target.value))}
                    className="rounded-xl border border-secondary/20 bg-white dark:bg-black/40 px-3 py-1.5 text-xs outline-none"
                  >
                    {[5, 4, 3, 2, 1].map(num => <option key={num} value={num}>{num} Stars ★</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 mb-1">Review Feedback</label>
                  <textarea
                    rows={3}
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    className="w-full rounded-xl border border-secondary/20 bg-white dark:bg-black/40 p-3 text-xs outline-none"
                  />
                </div>

                <div className="flex gap-2">
                  <button type="submit" className="py-2 px-4 rounded-full bg-secondary text-white text-xs font-bold cursor-pointer">
                    Save Review
                  </button>
                  <button type="button" onClick={() => setEditingReview(null)} className="py-2 px-4 rounded-full bg-white/10 text-xs font-bold cursor-pointer">
                    Cancel
                  </button>
                </div>
              </form>
            ) : userReviews.length === 0 ? (
              <div className="py-10 text-center border-2 border-dashed border-slate-200 dark:border-white/10 rounded-2xl text-xs font-bold text-gray-400">
                You haven't submitted any reviews yet.
              </div>
            ) : (
              <div className="space-y-4">
                {userReviews.map((rev) => (
                  <div key={rev.id} className="p-4 rounded-2xl bg-white/60 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex flex-col sm:flex-row justify-between items-start gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-secondary dark:text-roseGold">{rev.cardName}</span>
                        <span className="text-xs font-black text-amber-500">{'★'.repeat(rev.rating)}</span>
                      </div>
                      <p className="text-xs text-slate-700 dark:text-gray-300 font-medium mt-1 leading-relaxed">{rev.text}</p>
                      <span className="text-[10px] text-gray-400 mt-2 block">{rev.date}</span>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => { setEditingReview(rev); setReviewText(rev.text); setReviewRating(rev.rating); }}
                        className="py-1.5 px-3 rounded-xl bg-secondary/10 text-secondary dark:text-roseGold text-xs font-bold cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteReview(rev.id)}
                        className="py-1.5 px-3 rounded-xl bg-rose-500/10 text-rose-500 text-xs font-bold cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* 5. NOTIFICATIONS TAB */}
        {currentTab === 'notifications' && (
          <motion.div
            key="notifications"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="p-6 rounded-3xl bg-white/40 dark:bg-black/30 backdrop-blur-xl border border-slate-200 dark:border-secondary/20 shadow-soft space-y-4"
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-black font-serif text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <span>🔔</span> Account Notifications & Platform Announcements
              </h3>
              {notifications.length > 0 && (
                <button
                  onClick={() => { setNotifications([]); toast('Notifications cleared', 'info'); }}
                  className="text-xs font-bold text-rose-500 hover:underline cursor-pointer"
                >
                  Clear All
                </button>
              )}
            </div>

            {notifications.length === 0 ? (
              <div className="py-10 text-center text-xs font-bold text-gray-400 border-2 border-dashed border-slate-200 dark:border-white/10 rounded-2xl">
                No active notifications.
              </div>
            ) : (
              <div className="space-y-3">
                {notifications.map((note) => (
                  <div key={note.id} className="p-4 rounded-2xl bg-white/60 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-start gap-3">
                    <span className="text-2xl">{note.icon}</span>
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <h4 className="text-xs sm:text-sm font-black text-slate-800 dark:text-slate-100">{note.title}</h4>
                        <span className="text-[10px] text-gray-400">{note.date}</span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-300 mt-0.5">{note.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* 6. SETTINGS TAB */}
        {currentTab === 'settings' && (
          <motion.div
            key="settings"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="p-6 rounded-3xl bg-white/40 dark:bg-black/30 backdrop-blur-xl border border-slate-200 dark:border-secondary/20 shadow-soft space-y-6"
          >
            <h3 className="text-lg font-black font-serif text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <span>⚙️</span> System Settings & Privacy Controls
            </h3>

            {/* Email Change Section */}
            <div className="p-4 rounded-2xl bg-secondary/5 border border-secondary/15 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <p className="text-xs font-black text-slate-800 dark:text-slate-100">Primary Account Email</p>
                <p className="text-xs text-gray-500 font-semibold">{user?.email}</p>
              </div>
              {!isChangingEmail ? (
                <button
                  onClick={() => setIsChangingEmail(true)}
                  className="py-2 px-4 rounded-full bg-secondary/10 text-secondary dark:text-roseGold text-xs font-bold cursor-pointer"
                >
                  Change Email
                </button>
              ) : (
                <div className="flex gap-2 w-full sm:w-auto">
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="New email"
                    className="rounded-xl border border-secondary/30 bg-white dark:bg-black/40 px-3 py-1.5 text-xs text-slate-800 dark:text-white"
                  />
                  <button onClick={handleEmailUpdateSubmit} className="py-1.5 px-3 rounded-full bg-secondary text-white text-xs font-bold cursor-pointer">
                    Verify
                  </button>
                  <button onClick={() => setIsChangingEmail(false)} className="text-xs text-gray-400 cursor-pointer">
                    Cancel
                  </button>
                </div>
              )}
            </div>

            {/* Theme Toggle Switch */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-white/60 dark:bg-white/5 border border-slate-200 dark:border-white/10">
              <div>
                <p className="text-xs font-black text-slate-800 dark:text-slate-100">App Display Theme</p>
                <p className="text-[10px] text-gray-400 font-medium">Switch between Light Mode and Obsidian Dark Mode</p>
              </div>
              <button
                type="button"
                onClick={toggleDarkMode}
                className="px-4 py-2 rounded-full bg-secondary/10 border border-secondary/20 text-secondary dark:text-roseGold text-xs font-black cursor-pointer"
              >
                {isDarkMode ? '🌙 Dark Mode Active' : '☀️ Light Mode Active'}
              </button>
            </div>

            {/* Notification Checkboxes */}
            <div className="space-y-3">
              <label className="block text-[10px] font-black text-secondary dark:text-roseGold uppercase tracking-widest">
                Notification Channels
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { key: 'email', label: 'Email Alerts', desc: 'Fee updates & monthly digest' },
                  { key: 'inApp', label: 'In-App Notifications', desc: 'Saved card & compare logs' },
                  { key: 'promos', label: 'Promotional Deals', desc: 'Bank reward announcements' },
                  { key: 'security', label: 'Security Logs', desc: 'Login alerts & device history' }
                ].map(item => (
                  <label key={item.key} className="flex items-start gap-3 p-3 rounded-2xl bg-white/50 dark:bg-white/5 border border-slate-200 dark:border-white/10 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={Boolean(notificationPrefs[item.key])}
                      onChange={(e) => setNotificationPrefs({ ...notificationPrefs, [item.key]: e.target.checked })}
                      className="mt-0.5 rounded border-gray-300 text-secondary focus:ring-secondary cursor-pointer"
                    />
                    <div>
                      <p className="text-xs font-black text-slate-800 dark:text-slate-100">{item.label}</p>
                      <p className="text-[10px] text-gray-400">{item.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}

export default UserProfilePage;
