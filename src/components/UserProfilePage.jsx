import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import { compareService } from '../services/compareService';
import { debitCards } from '../data/mockData';
import { INDIAN_LOCATIONS } from '../data/indianLocations';
import DebitCardVisual from './DebitCardVisual';
import { ShieldCheck, Lock, Bell, Sparkles, Check, CheckCircle2, AlertCircle, RefreshCw, Key, Shield, Smartphone, ChevronRight } from 'lucide-react';

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

  // 3D Virtual Membership Card Mouse Tilt State
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50 });

  // Compare History State
  const [compareLogs, setCompareLogs] = useState([]);
  const [loadingCompareLogs, setLoadingCompareLogs] = useState(false);

  // Notifications State
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  // Settings & Notification Preference Toggles
  const [notificationPrefs, setNotificationPrefs] = useState({
    feeChangeAlerts: true,
    loungeRuleUpdates: true,
    monthlyAuditReports: true,
    securityLoginAlerts: true,
    email: true,
    inApp: true
  });
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
        setNotificationPrefs(prev => ({ ...prev, ...profile.notification_preferences }));
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

  const handleCardMouseMove = (e) => {
    const card = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - card.left;
    const y = e.clientY - card.top;
    const centerX = card.width / 2;
    const centerY = card.height / 2;
    
    const rX = ((y - centerY) / centerY) * -12;
    const rY = ((x - centerX) / centerX) * 12;

    setRotateX(rX);
    setRotateY(rY);
    setGlarePos({ x: (x / card.width) * 100, y: (y / card.height) * 100 });
  };

  const handleCardMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setGlarePos({ x: 50, y: 50 });
  };

  const togglePreference = (key) => {
    setNotificationPrefs(prev => {
      const updated = { ...prev, [key]: !prev[key] };
      updateProfile({ notification_preferences: updated })
        .then(() => toast("Preference updated instantly!", "success"))
        .catch(() => toast("Failed to sync preference.", "error"));
      return updated;
    });
  };

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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 text-left select-none space-y-8">
      
      {/* ── 1. INTERACTIVE 3D VIRTUAL MEMBERSHIP CARD & HERO DASHBOARD ── */}
      <div className="relative rounded-[36px] bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0B3D91] p-6 sm:p-8 text-white shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-8 items-center border border-slate-700/80">
        
        {/* Ambient Glow & Mesh */}
        <div className="absolute right-0 top-0 w-96 h-96 rounded-full bg-[#2563EB]/25 blur-3xl pointer-events-none" />

        {/* Left Info Column */}
        <div className="lg:col-span-7 space-y-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-slate-900 border-2 border-white/30 overflow-hidden shadow-xl flex items-center justify-center text-2xl font-black flex-shrink-0">
              {profileImage ? (
                <img src={profileImage} alt="Profile Avatar" className="w-full h-full object-cover" />
              ) : (
                <span>{String(fullName || user?.email || 'U').charAt(0).toUpperCase()}</span>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  {fullName || 'Valued Member'}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-wider border border-emerald-500/30 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> VERIFIED MEMBER ★
                </span>
              </div>
              <p className="text-xs text-slate-300 font-medium mt-0.5">{user?.email}</p>
              <p className="text-[11px] text-[#60A5FA] font-bold mt-1">
                Segment: {occupation} • Joined 2026 • {city}, {state}
              </p>
            </div>
          </div>

          {/* Quick Financial Health Score Widgets */}
          <div className="grid grid-cols-3 gap-3 bg-black/30 backdrop-blur-xl border border-white/15 p-4 rounded-2xl">
            <div className="text-center px-1">
              <p className="text-[10px] font-extrabold text-[#60A5FA] uppercase tracking-wider">FIT SCORE™</p>
              <p className="text-xl sm:text-2xl font-extrabold text-emerald-400 mt-0.5">{portfolioStats.fitScore}/100</p>
            </div>
            <div className="text-center px-1 border-x border-white/10">
              <p className="text-[10px] font-extrabold text-[#60A5FA] uppercase tracking-wider">SAVED CARDS</p>
              <p className="text-xl sm:text-2xl font-extrabold text-white mt-0.5">{portfolioStats.cardCount}</p>
            </div>
            <div className="text-center px-1">
              <p className="text-[10px] font-extrabold text-[#60A5FA] uppercase tracking-wider">LOUNGE VISITS</p>
              <p className="text-xl sm:text-2xl font-extrabold text-amber-300 mt-0.5">{portfolioStats.totalLoungeVisits}</p>
            </div>
          </div>
        </div>

        {/* Right Column: 3D Interactive Metallic D.CARD Privilege Pass */}
        <div className="lg:col-span-5 relative z-10 flex flex-col items-center justify-center">
          <div className="perspective-1000 w-full max-w-sm">
            <motion.div
              onMouseMove={handleCardMouseMove}
              onMouseLeave={handleCardMouseLeave}
              animate={{ rotateX, rotateY }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="w-full aspect-[1.586/1] rounded-2xl p-5 relative overflow-hidden border border-white/30 shadow-2xl flex flex-col justify-between cursor-pointer select-none gpu-layer"
              style={{
                background: 'linear-gradient(135deg, #0B3D91 0%, #1E3A8A 50%, #2563EB 100%)',
                boxShadow: '0 20px 45px rgba(37, 99, 235, 0.45)'
              }}
            >
              {/* Glare Light Sweep Overlay */}
              <div
                className="absolute inset-0 pointer-events-none transition-opacity duration-300 opacity-60"
                style={{
                  background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0) 65%)`
                }}
              />

              <div className="flex justify-between items-start z-10">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#60A5FA]" />
                  <span className="text-[11px] font-black tracking-widest uppercase text-white">D.CARD PRIVILEGE PASS</span>
                </div>
                <span className="font-extrabold text-[9.5px] bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-white/25">VERIFIED ★</span>
              </div>

              {/* Metallic Golden Chip */}
              <div className="w-11 h-8 rounded-lg bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 border border-amber-300/60 relative overflow-hidden z-10 shadow-sm">
                <div className="absolute inset-0 bg-black/15 grid grid-cols-2 gap-0.5 p-0.5" />
              </div>

              <div className="z-10">
                <p className="font-mono text-sm font-extrabold tracking-widest text-white/95 drop-shadow-md">
                  {fullName ? fullName.toUpperCase() : 'VALUED MEMBER'}
                </p>
                <div className="flex justify-between items-end mt-1.5 text-[9.5px] text-white/80 font-bold uppercase tracking-wider">
                  <span>SEGMENT: {occupation.toUpperCase()}</span>
                  <span>MEMBER SINCE 2026</span>
                </div>
              </div>
            </motion.div>
          </div>
          <span className="text-[10px] text-slate-300 font-semibold mt-2 flex items-center gap-1">
            ✨ Hover & Move Mouse to View 3D Glare Sweep
          </span>
        </div>
      </div>

      {/* Modern Profile Sub-Navigation Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#E5E7EB] dark:border-slate-800 custom-scrollbar">
        {[
          { id: "profile", tab: "profile", label: "My Profile", icon: "👤" },
          { id: "security", tab: "security", label: "Security & Alerts Center", icon: "🛡️" },
          { id: "saved", tab: "saved", label: `Saved Wallet (${wishlist.length})`, icon: "💳" },
          { id: "recommended", tab: "recommended", label: "AI Recommendations", icon: "✨" },
          { id: "compare", tab: "compare", label: "Compare History", icon: "🔄" }
        ].map((item) => (
          <button
            key={item.tab}
            onClick={() => setCurrentTab(item.tab)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              currentTab === item.tab
                ? "bg-[#2563EB] text-white shadow-md shadow-[#2563EB]/30 scale-105"
                : "bg-white dark:bg-slate-800 text-[#6B7280] dark:text-slate-300 hover:bg-[#2563EB]/10 hover:text-[#2563EB] border border-[#E5E7EB] dark:border-slate-700"
            }`}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      {/* Dynamic Tab Body Render */}
      <AnimatePresence mode="wait">

        {/* ── 2. SECURITY & NOTIFICATION CENTER TAB ── */}
        {currentTab === 'security' && (
          <motion.div
            key="security"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6 text-left"
          >
            {/* Real-time Firebase Security Status Card */}
            <div className="p-6 rounded-3xl glass-card-premium border border-[#E5E7EB] dark:border-slate-800 shadow-soft space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center justify-center shadow-xs">
                    <ShieldCheck className="w-6 h-6 stroke-[2.5]" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-[#1F2937] dark:text-white flex items-center gap-2">
                      Firebase Security Authentication Status
                    </h3>
                    <p className="text-xs text-[#6B7280] dark:text-slate-400 font-normal">
                      Real-time verification & 256-bit AES data protection
                    </p>
                  </div>
                </div>
                <span className="px-3.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-extrabold border border-emerald-500/20 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Active Protection
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-[#F8FAFC] dark:bg-slate-900/60 border border-[#E5E7EB] dark:border-slate-800">
                  <span className="text-[10px] font-extrabold text-[#6B7280] uppercase tracking-wider block">Email Security</span>
                  <p className="text-sm font-extrabold text-emerald-500 mt-1 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Verified Cloud ID
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-[#F8FAFC] dark:bg-slate-900/60 border border-[#E5E7EB] dark:border-slate-800">
                  <span className="text-[10px] font-extrabold text-[#6B7280] uppercase tracking-wider block">Encryption Layer</span>
                  <p className="text-sm font-extrabold text-[#2563EB] dark:text-[#60A5FA] mt-1 flex items-center gap-1.5">
                    <Lock className="w-4 h-4" /> 256-Bit SSL/TLS
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-[#F8FAFC] dark:bg-slate-900/60 border border-[#E5E7EB] dark:border-slate-800">
                  <span className="text-[10px] font-extrabold text-[#6B7280] uppercase tracking-wider block">Database Storage</span>
                  <p className="text-sm font-extrabold text-emerald-500 mt-1 flex items-center gap-1.5">
                    <Shield className="w-4 h-4" /> Firebase Cloud Rules
                  </p>
                </div>
              </div>
            </div>

            {/* Instant Preference Toggles */}
            <div className="p-6 rounded-3xl glass-card-premium border border-[#E5E7EB] dark:border-slate-800 shadow-soft space-y-5">
              <div>
                <h3 className="text-base font-extrabold text-[#1F2937] dark:text-white flex items-center gap-2">
                  <Bell className="w-5 h-5 text-[#2563EB]" /> Instant Preference Toggles
                </h3>
                <p className="text-xs text-[#6B7280] dark:text-slate-400 font-normal mt-0.5">
                  1-click instant subscription preferences with immediate cloud sync.
                </p>
              </div>

              <div className="space-y-3">
                {[
                  { key: 'feeChangeAlerts', title: 'Fee Change Alerts', desc: 'Get instant notifications if annual fees or MAB rules change on saved cards.', icon: '📢' },
                  { key: 'loungeRuleUpdates', title: 'Airport Lounge Rule Updates', desc: 'Receive real-time alerts when lounge spending criteria or bank limits change.', icon: '✈️' },
                  { key: 'monthlyAuditReports', title: 'Monthly Audit Reports', desc: 'Receive monthly verified banking intelligence summaries in your inbox.', icon: '📊' },
                  { key: 'securityLoginAlerts', title: 'Security Login Alerts', desc: 'Get immediate security alerts for new device logins.', icon: '🔒' }
                ].map((pref) => (
                  <div
                    key={pref.key}
                    onClick={() => togglePreference(pref.key)}
                    className="p-4 rounded-2xl bg-[#F8FAFC] dark:bg-slate-900/60 border border-[#E5E7EB] dark:border-slate-800 flex items-center justify-between cursor-pointer hover:border-[#2563EB]/40 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{pref.icon}</span>
                      <div>
                        <h4 className="text-xs font-extrabold text-[#1F2937] dark:text-white">{pref.title}</h4>
                        <p className="text-[11px] text-[#6B7280] dark:text-slate-400 font-normal">{pref.desc}</p>
                      </div>
                    </div>

                    {/* Custom Animated Toggle Pill */}
                    <div className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 flex items-center ${
                      notificationPrefs[pref.key] ? 'bg-[#2563EB] justify-end' : 'bg-slate-300 dark:bg-slate-700 justify-start'
                    }`}>
                      <motion.div layout className="w-4 h-4 rounded-full bg-white shadow-md" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* 3. MY PROFILE TAB */}
        {currentTab === 'profile' && (
          <motion.form
            key="profile"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            onSubmit={handleSaveProfile}
            className="space-y-6 text-left"
          >
            {/* Avatar Selector */}
            <div className="p-6 rounded-3xl glass-card-premium border border-[#E5E7EB] dark:border-slate-800 shadow-soft">
              <h3 className="text-sm font-extrabold text-[#1F2937] dark:text-white mb-3">
                Profile Avatar Presets
              </h3>
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {AVATAR_PRESETS.map((url, idx) => (
                  <img
                    key={idx}
                    src={url}
                    alt={`Avatar ${idx}`}
                    onClick={() => setProfileImage(url)}
                    className={`w-12 h-12 rounded-full object-cover cursor-pointer border-2 transition-all ${
                      profileImage === url ? 'border-[#2563EB] scale-110 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Account Info Form Grid */}
            <div className="p-6 rounded-3xl glass-card-premium border border-[#E5E7EB] dark:border-slate-800 shadow-soft space-y-4">
              <h3 className="text-sm font-extrabold text-[#1F2937] dark:text-white mb-2">
                Personal Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#1F2937] dark:text-slate-300 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E5E7EB] dark:border-slate-800 bg-[#F8FAFC] dark:bg-slate-900 text-xs font-bold text-[#1F2937] dark:text-white outline-none focus:border-[#2563EB]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1F2937] dark:text-slate-300 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E5E7EB] dark:border-slate-800 bg-[#F8FAFC] dark:bg-slate-900 text-xs font-bold text-[#1F2937] dark:text-white outline-none focus:border-[#2563EB]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1F2937] dark:text-slate-300 mb-1">Occupation / Profile Segment</label>
                  <select
                    value={occupation}
                    onChange={(e) => setOccupation(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#E5E7EB] dark:border-slate-800 bg-[#F8FAFC] dark:bg-slate-900 text-xs font-bold text-[#1F2937] dark:text-white outline-none focus:border-[#2563EB] cursor-pointer"
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
                  <label className="block text-xs font-bold text-[#1F2937] dark:text-slate-300 mb-1">State</label>
                  <select
                    value={state}
                    onChange={(e) => {
                      setState(e.target.value);
                      if (INDIAN_LOCATIONS[e.target.value]) setCity(INDIAN_LOCATIONS[e.target.value][0]);
                    }}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#E5E7EB] dark:border-slate-800 bg-[#F8FAFC] dark:bg-slate-900 text-xs font-bold text-[#1F2937] dark:text-white outline-none focus:border-[#2563EB] cursor-pointer"
                  >
                    {Object.keys(INDIAN_LOCATIONS).map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <div className="pt-3 flex justify-end">
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#3B82F6] text-white text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-lg active:scale-95 transition-all cursor-pointer"
                >
                  {savingProfile ? 'Saving...' : 'Save Profile Changes'}
                </button>
              </div>
            </div>
          </motion.form>
        )}

        {/* 4. SAVED CARDS & SAVINGS ACCOUNTS WALLET TAB */}
        {currentTab === 'saved' && (
          <motion.div
            key="saved"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6 text-left"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <h3 className="text-lg font-black text-[#1F2937] dark:text-white flex items-center gap-2">
                ❤️ Saved Portfolio ({savedCardObjects.length})
              </h3>
            </div>

            {savedCardObjects.length === 0 ? (
              <div className="py-16 text-center rounded-3xl glass-card-premium border border-[#E5E7EB] dark:border-slate-800 space-y-3">
                <div className="text-5xl">❤️</div>
                <h4 className="text-lg font-black text-[#1F2937] dark:text-white">Your Saved Portfolio is Empty</h4>
                <p className="text-xs text-[#6B7280] dark:text-slate-400 max-w-sm mx-auto">
                  Click the heart icon on any debit card or savings account while browsing to save it to your personal wallet.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedCardObjects.map(item => {
                  const isSavingsAcc = !!item.accountName || item.productType === 'savingsAccount';
                  if (isSavingsAcc) {
                    return (
                      <div key={item.id} className="p-5 rounded-3xl glass-card-premium border border-[#E5E7EB] dark:border-slate-800 shadow-soft flex flex-col justify-between space-y-3">
                        <div className="space-y-2">
                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#2563EB] dark:text-[#60A5FA]">
                            🏦 Savings Account • {item.bank}
                          </span>
                          <h4 className="font-extrabold text-sm text-slate-800 dark:text-white">{item.accountName}</h4>
                          <div className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300">
                            <span>Rate: {item.interestRate || '3.5% p.a.'}</span>
                            <span>•</span>
                            <span>Min Bal: {item.minimumBalance || '₹0'}</span>
                          </div>
                        </div>
                        <div className="pt-3 border-t border-[#E5E7EB] dark:border-slate-800 flex items-center justify-between">
                          <button
                            onClick={() => onSelectCard && onSelectCard(item)}
                            className="text-xs font-bold text-[#2563EB] dark:text-[#60A5FA] hover:underline cursor-pointer"
                          >
                            View Specs ➔
                          </button>
                          <button
                            onClick={() => removeFromWishlist(item.id)}
                            className="text-xs font-bold text-red-500 hover:underline cursor-pointer"
                          >
                            Remove 🗑️
                          </button>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div key={item.id} className="p-4 rounded-3xl glass-card-premium border border-[#E5E7EB] dark:border-slate-800 shadow-soft flex flex-col justify-between">
                      <DebitCardVisual mode="grid" card={item} />
                      <div className="mt-3 pt-3 border-t border-[#E5E7EB] dark:border-slate-800 flex items-center justify-between">
                        <button
                          onClick={() => onSelectCard && onSelectCard(item)}
                          className="text-xs font-bold text-[#2563EB] dark:text-[#60A5FA] hover:underline cursor-pointer"
                        >
                          View Specs ➔
                        </button>
                        <button
                          onClick={() => removeFromWishlist(item.id)}
                          className="text-xs font-bold text-red-500 hover:underline cursor-pointer"
                        >
                          Remove 🗑️
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}

        {/* 5. AI RECOMMENDATIONS TAB */}
        {currentTab === 'recommended' && (
          <motion.div
            key="recommended"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6 text-left"
          >
            <div className="p-6 rounded-3xl bg-gradient-to-r from-[#2563EB]/10 to-[#3B82F6]/10 border border-[#2563EB]/20">
              <h3 className="text-lg font-extrabold text-[#1F2937] dark:text-white flex items-center gap-2">
                ✨ AI Curated Matches for {occupation}
              </h3>
              <p className="text-xs text-[#6B7280] dark:text-slate-300 mt-1">
                Our recommendation engine filtered cards based on your life stage, fee limits, and reward structures.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedCards.map(card => (
                <div key={card.id} className="p-4 rounded-3xl glass-card-premium border border-[#E5E7EB] dark:border-slate-800 shadow-soft flex flex-col justify-between">
                  <DebitCardVisual mode="grid" card={card} />
                  <button
                    onClick={() => onSelectCard && onSelectCard(card)}
                    className="mt-3 w-full py-2.5 rounded-xl bg-[#2563EB] text-white text-xs font-bold shadow cursor-pointer hover:brightness-110"
                  >
                    Explore Card Specs ➔
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* 6. COMPARE HISTORY TAB */}
        {currentTab === 'compare' && (
          <motion.div
            key="compare"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="p-6 rounded-3xl glass-card-premium border border-[#E5E7EB] dark:border-slate-800 space-y-4 text-left"
          >
            <h3 className="text-lg font-extrabold text-[#1F2937] dark:text-white flex items-center gap-2">
              🔄 Compare Audit Log
            </h3>
            {compareLogs.length === 0 ? (
              <p className="text-xs text-[#6B7280] dark:text-slate-400 py-8 text-center">No comparison history entries logged yet.</p>
            ) : (
              <div className="space-y-3">
                {compareLogs.map((log) => (
                  <div key={log.id} className="p-4 rounded-2xl bg-[#F8FAFC] dark:bg-slate-900/60 border border-[#E5E7EB] dark:border-slate-800 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-extrabold text-[#1F2937] dark:text-white">{log.comparedCards?.join(' vs ')}</p>
                      <p className="text-[10px] text-[#6B7280] mt-0.5">{log.timestamp}</p>
                    </div>
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
