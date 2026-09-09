import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import { compareService } from '../services/compareService';
import { debitCards } from '../data/mockData';
import { savingsAccounts } from '../data/mockSavingsAccounts';
import { currentAccounts } from '../data/currentAccounts';
import { INDIAN_LOCATIONS } from '../data/indianLocations';
import DebitCardVisual from './DebitCardVisual';
import { 
  User, 
  ShieldCheck, 
  Lock, 
  Bell, 
  Sparkles, 
  Check, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Key, 
  Shield, 
  Smartphone, 
  ChevronRight,
  Heart,
  Scale,
  CreditCard,
  Building2,
  Briefcase,
  History,
  MapPin,
  Mail,
  Phone,
  Calendar,
  Zap,
  TrendingUp,
  Award,
  Sliders,
  Plane,
  Camera,
  Layers,
  ArrowRight,
  Trash2
} from 'lucide-react';

const AVATAR_PRESETS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
];

const INITIAL_NOTIFICATIONS = [
  { id: 1, title: "Account Verified", desc: "Your D.CARD executive profile is active and verified.", date: "Today", icon: ShieldCheck },
  { id: 2, title: "Card Fee Alert", desc: "HDFC & ICICI annual maintenance charge schedules audited for 2026.", date: "Yesterday", icon: AlertCircle },
  { id: 3, title: "Forex Feature Update", desc: "Zero forex markup cards updated in Travel & International segment.", date: "3 days ago", icon: Plane }
];

function isCurrentAccountItem(item) {
  if (!item) return false;
  return (
    item.productType === 'currentAccount' ||
    item.category === 'current_account' ||
    Boolean(item.businessConstitution) ||
    Boolean(item.cashDepositLimit) ||
    (item.product_id && String(item.product_id).toLowerCase().includes('current')) ||
    (item.accountName && String(item.accountName).toLowerCase().includes('current account')) ||
    (item.accountType && String(item.accountType).toLowerCase().includes('current'))
  );
}

function isSavingsAccountItem(item) {
  if (!item) return false;
  if (isCurrentAccountItem(item)) return false;
  return item.productType === 'savingsAccount' || Boolean(item.accountName);
}

function isDebitCardItem(item) {
  if (!item) return false;
  return !isCurrentAccountItem(item) && !isSavingsAccountItem(item);
}

function UserProfilePage({ activeTab = "profile", onSelectCard, onCompareCards, isDarkMode, toggleDarkMode }) {
  const { user, profile, updateProfile, logout } = useAuth();
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
  const [primaryNetworkPref, setPrimaryNetworkPref] = useState('Any');
  const [primaryGoalPref, setPrimaryGoalPref] = useState('Maximize Cashback');

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
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Saved tab sub-filter
  const [savedFilterType, setSavedFilterType] = useState('All');

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
      if (profile.primary_network) setPrimaryNetworkPref(profile.primary_network);
      if (profile.primary_goal) setPrimaryGoalPref(profile.primary_goal);
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
    
    const rX = ((y - centerY) / centerY) * -10;
    const rY = ((x - centerX) / centerX) * 10;

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

  // Saved Wishlist full card / account items
  const savedCardObjects = useMemo(() => {
    return wishlist.map(item => {
      if (isCurrentAccountItem(item)) {
        const fullCurrent = currentAccounts.find(c => String(c.id) === String(item.id) || String(c.product_id) === String(item.product_id));
        return fullCurrent || item;
      }
      if (isSavingsAccountItem(item)) {
        const fullSavings = savingsAccounts.find(s => String(s.id) === String(item.id));
        return fullSavings || item;
      }
      const fullCard = debitCards.find(c => String(c.id) === String(item.id));
      return fullCard || item;
    });
  }, [wishlist]);

  const debitCardsCount = useMemo(() => {
    return savedCardObjects.filter(isDebitCardItem).length;
  }, [savedCardObjects]);

  const savingsAccountsCount = useMemo(() => {
    return savedCardObjects.filter(isSavingsAccountItem).length;
  }, [savedCardObjects]);

  const currentAccountsCount = useMemo(() => {
    return savedCardObjects.filter(isCurrentAccountItem).length;
  }, [savedCardObjects]);

  const filteredSavedItems = useMemo(() => {
    if (savedFilterType === 'Debit Cards') return savedCardObjects.filter(isDebitCardItem);
    if (savedFilterType === 'Savings Accounts') return savedCardObjects.filter(isSavingsAccountItem);
    if (savedFilterType === 'Current Accounts') return savedCardObjects.filter(isCurrentAccountItem);
    return savedCardObjects;
  }, [savedCardObjects, savedFilterType]);

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
    } else if (occ.includes("business") || occ.includes("msme")) {
      cards = cards.filter(c => String(c.bestFor || '').toLowerCase().includes('business') || String(c.category || '').toLowerCase().includes('business'));
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
      if (c.minBalance === 0 || c.minimumBalance === '₹0') zeroBalanceCards += 1;
      const feeNum = typeof c.annualFee === 'number' ? c.annualFee : parseFloat(String(c.annualFee || '').replace(/[^0-9.]/g, '')) || 0;
      if (feeNum === 0) feeSavingsEst += 500;
    });

    const fitScore = Math.min(99, Math.max(78, 78 + (cardCount * 4) + (zeroBalanceCards * 4) + (totalLoungeVisits > 0 ? 5 : 0)));

    return {
      fitScore,
      cardCount,
      totalLoungeVisits: totalLoungeVisits || (cardCount > 0 ? 4 : 2),
      feeSavingsEst: feeSavingsEst || (cardCount > 0 ? 1200 : 0)
    };
  }, [savedCardObjects]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (savingProfile) return;

    setSavingProfile(true);
    setSavedSuccess(false);
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
        primary_network: primaryNetworkPref,
        primary_goal: primaryGoalPref,
        notification_preferences: notificationPrefs
      });
      if (updated) {
        setSavedSuccess(true);
        toast("Executive profile synced successfully!", "success");
        setTimeout(() => setSavedSuccess(false), 3000);
      }
    } catch (err) {
      toast(err.message || "Failed to update profile.", "error");
    } finally {
      setSavingProfile(false);
    }
  };

  const memberInitials = useMemo(() => {
    if (fullName && fullName.trim().length > 0) {
      const parts = fullName.trim().split(' ').filter(Boolean);
      if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
      return parts[0][0].toUpperCase();
    }
    if (user?.email) return user.email[0].toUpperCase();
    return 'M';
  }, [fullName, user]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-left select-none space-y-8">
      
      {/* ── 1. EXECUTIVE HEADER & VIRTUAL OBSIDIAN PRIVILEGE CARD ── */}
      <div className="relative rounded-[32px] bg-gradient-to-br from-[#0B1329] via-[#0F1C3F] to-[#0A1227] p-6 sm:p-8 lg:p-10 text-white shadow-2xl overflow-hidden border border-slate-700/60">
        
        {/* Subtle Ambient Refractions */}
        <div className="absolute top-0 right-1/4 w-[450px] h-[450px] rounded-full bg-[#2563EB]/15 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-[300px] h-[300px] rounded-full bg-emerald-500/10 blur-[100px] pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center relative z-10">
          
          {/* Left: Executive Identity & Live Financial Matrix */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Identity Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              
              {/* Profile Avatar with Status Ring */}
              <div className="relative group shrink-0">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-slate-900 via-slate-800 to-slate-700 p-0.5 shadow-xl border border-white/20">
                  <div className="w-full h-full rounded-[14px] overflow-hidden bg-[#0F172A] flex items-center justify-center font-black text-2xl text-white">
                    {profileImage ? (
                      <img src={profileImage} alt="Executive Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <span className="tracking-tight text-white/95">{memberInitials}</span>
                    )}
                  </div>
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-[#0B1329] flex items-center justify-center shadow-md" title="Verified Member">
                  <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
                </div>
              </div>

              {/* Name, Tier & Meta */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-none">
                    {fullName || 'Executive Member'}
                  </h1>
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10.5px] font-extrabold uppercase tracking-wider shadow-xs">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    <span>Verified Tier</span>
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-300 font-medium">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate max-w-xs">{user?.email || 'member@dcard.com'}</span>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-300 font-semibold pt-0.5">
                  <span className="px-2.5 py-0.5 rounded-lg bg-white/10 text-white border border-white/15">
                    {occupation}
                  </span>
                  <span className="flex items-center gap-1 text-slate-300">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    {city}, {state}
                  </span>
                  <span className="text-slate-500">•</span>
                  <span className="flex items-center gap-1 text-slate-400">
                    <Calendar className="w-3 h-3" />
                    Member since 2026
                  </span>
                </div>
              </div>
            </div>

            {/* Financial Health & Portfolio Overview Tiles */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              
              <div className="p-3.5 rounded-2xl bg-white/[0.04] backdrop-blur-md border border-white/10 space-y-1 hover:border-white/20 transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Fit Score™</span>
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-black text-emerald-400">{portfolioStats.fitScore}</span>
                  <span className="text-[10px] text-slate-400 font-bold">/100</span>
                </div>
                <span className="text-[9.5px] text-emerald-400/80 font-bold block">Top 5% Profile</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/[0.04] backdrop-blur-md border border-white/10 space-y-1 hover:border-white/20 transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Saved Items</span>
                  <Heart className="w-3.5 h-3.5 text-rose-400" />
                </div>
                <div className="text-xl font-black text-white">{portfolioStats.cardCount}</div>
                <span className="text-[9.5px] text-slate-400 font-medium block">In Wishlist</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/[0.04] backdrop-blur-md border border-white/10 space-y-1 hover:border-white/20 transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Lounge Entitlements</span>
                  <Plane className="w-3.5 h-3.5 text-[#60A5FA]" />
                </div>
                <div className="text-xl font-black text-cyan-300">{portfolioStats.totalLoungeVisits}</div>
                <span className="text-[9.5px] text-slate-400 font-medium block">Visits / Year</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/[0.04] backdrop-blur-md border border-white/10 space-y-1 hover:border-white/20 transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Est. Savings</span>
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                </div>
                <div className="text-xl font-black text-amber-300">₹{portfolioStats.feeSavingsEst.toLocaleString('en-IN')}</div>
                <span className="text-[9.5px] text-slate-400 font-medium block">Annual Benefit</span>
              </div>

            </div>
          </div>

          {/* Right: State-of-the-Art Obsidian Metal Privilege Card */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <div className="perspective-1000 w-full max-w-sm">
              <motion.div
                onMouseMove={handleCardMouseMove}
                onMouseLeave={handleCardMouseLeave}
                animate={{ rotateX, rotateY }}
                transition={{ type: "spring", stiffness: 450, damping: 30 }}
                className="w-full aspect-[1.586/1] rounded-2xl p-5 sm:p-6 relative overflow-hidden border border-white/25 shadow-2xl flex flex-col justify-between select-none gpu-layer cursor-pointer"
                style={{
                  background: 'radial-gradient(ellipse at 80% 20%, #1E3A8A 0%, #0F172A 60%, #030712 100%)',
                  boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.7), 0 0 35px rgba(37, 99, 235, 0.25)'
                }}
              >
                {/* Specular Glare Layer */}
                <div
                  className="absolute inset-0 pointer-events-none transition-opacity duration-300 opacity-50 mix-blend-overlay"
                  style={{
                    background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0) 60%)`
                  }}
                />

                {/* Card Top Row: Branding & Contactless Icon */}
                <div className="flex justify-between items-start z-10">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-[#2563EB] to-[#60A5FA] flex items-center justify-center text-[11px] font-black text-white shadow-md">
                        D
                      </div>
                      <span className="text-sm font-black tracking-widest text-white">D.CARD</span>
                    </div>
                    <span className="text-[8.5px] font-extrabold tracking-[0.2em] text-[#93C5FD] uppercase block">
                      PRIVILEGE PASS
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Contactless Wave Icon */}
                    <svg className="w-5 h-5 text-white/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                      <path d="M8.5 16.5a5 5 0 0 1 0-9" />
                      <path d="M12 19a8.5 8.5 0 0 1 0-14" />
                      <path d="M15.5 21.5a12 12 0 0 1 0-19" />
                    </svg>
                    <span className="font-mono text-[9px] font-black bg-white/10 px-2 py-0.5 rounded-full border border-white/20 text-white/90">
                      TIER 1
                    </span>
                  </div>
                </div>

                {/* EMV Microchip Artwork */}
                <div className="z-10 my-auto">
                  <div className="w-12 h-9 rounded-md bg-gradient-to-br from-amber-100 via-amber-300 to-amber-600 border border-amber-200/80 shadow-md relative overflow-hidden flex items-center justify-center">
                    {/* Realistic microchip grid lines */}
                    <div className="absolute inset-0 border border-amber-900/30 rounded-xs" />
                    <div className="w-full h-[1px] bg-amber-900/40" />
                    <div className="absolute w-[1px] h-full bg-amber-900/40" />
                    <div className="w-5 h-4 border border-amber-900/40 rounded-xs" />
                  </div>
                </div>

                {/* Cardholder Name & Numbers */}
                <div className="z-10 space-y-2">
                  <div className="font-mono text-xs sm:text-sm font-black tracking-[0.25em] text-white/90 drop-shadow">
                    •••• •••• •••• {user?.id ? String(user.id).slice(-4) : '2026'}
                  </div>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Cardholder</p>
                      <p className="font-mono text-xs font-black tracking-wider text-white truncate max-w-[170px]">
                        {fullName ? fullName.toUpperCase() : 'VALUED CLIENT'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Valid Thru</p>
                      <p className="font-mono text-xs font-black tracking-wider text-white">12/30</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
            
            <p className="text-[10.5px] text-slate-400 font-medium mt-3 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-[#60A5FA]" />
              <span>Interactive 3D Virtual Card — Tilt & Move to Inspect</span>
            </p>
          </div>

        </div>
      </div>

      {/* ── 2. EXECUTIVE SEGMENTED TAB BAR ── */}
      <div className="p-1.5 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-slate-800 shadow-soft flex items-center gap-1.5 overflow-x-auto">
        {[
          { id: "profile", tab: "profile", label: "Profile & Identity", icon: User },
          { id: "security", tab: "security", label: "Security & Alerts", icon: ShieldCheck },
          { id: "saved", tab: "saved", label: `Saved Portfolio (${wishlist.length})`, icon: Heart },
          { id: "recommended", tab: "recommended", label: "Curated Recommendations", icon: Sparkles },
          { id: "compare", tab: "compare", label: "Comparison History", icon: History }
        ].map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.tab;
          return (
            <button
              key={item.tab}
              onClick={() => setCurrentTab(item.tab)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 relative ${
                isActive
                  ? "bg-[#2563EB] text-white shadow-md shadow-[#2563EB]/25"
                  : "text-[#6B7280] dark:text-slate-400 hover:text-[#1F2937] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* ── 3. DYNAMIC TAB CONTENT ── */}
      <AnimatePresence mode="wait">

        {/* TAB 1: PROFILE & IDENTITY */}
        {currentTab === 'profile' && (
          <motion.form
            key="profile"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
            onSubmit={handleSaveProfile}
            className="space-y-6 text-left"
          >
            {/* Row 1: Profile Photo & Preset Selector */}
            <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-slate-800 shadow-soft space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <h3 className="text-base font-extrabold text-[#1F2937] dark:text-white flex items-center gap-2">
                    <Camera className="w-4 h-4 text-[#2563EB]" />
                    <span>Profile Photo & Avatar</span>
                  </h3>
                  <p className="text-xs text-[#6B7280] dark:text-slate-400 font-normal mt-0.5">
                    Choose an executive avatar preset or maintain your monogram
                  </p>
                </div>

                {profileImage && (
                  <button
                    type="button"
                    onClick={() => setProfileImage('')}
                    className="text-xs font-bold text-slate-500 hover:text-rose-500 cursor-pointer transition-colors"
                  >
                    Reset to Monogram
                  </button>
                )}
              </div>

              <div className="flex items-center gap-4 overflow-x-auto py-2">
                {/* Monogram Option */}
                <div
                  onClick={() => setProfileImage('')}
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-lg cursor-pointer border-2 transition-all ${
                    !profileImage
                      ? 'border-[#2563EB] bg-[#2563EB]/10 text-[#2563EB] scale-105 shadow-md'
                      : 'border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-500 hover:border-slate-400'
                  }`}
                  title="Use Initials Monogram"
                >
                  {memberInitials}
                </div>

                {/* Presets */}
                {AVATAR_PRESETS.map((url, idx) => (
                  <div
                    key={idx}
                    onClick={() => setProfileImage(url)}
                    className={`relative w-14 h-14 rounded-2xl overflow-hidden cursor-pointer border-2 transition-all shrink-0 ${
                      profileImage === url
                        ? 'border-[#2563EB] scale-105 shadow-md ring-4 ring-[#2563EB]/15'
                        : 'border-transparent opacity-75 hover:opacity-100 hover:scale-105'
                    }`}
                  >
                    <img src={url} alt={`Preset ${idx + 1}`} className="w-full h-full object-cover" />
                    {profileImage === url && (
                      <div className="absolute inset-0 bg-[#2563EB]/20 flex items-center justify-center">
                        <Check className="w-4 h-4 text-white stroke-[3]" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Row 2: Personal Details 2-Column Form */}
            <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-slate-800 shadow-soft space-y-6">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="text-base font-extrabold text-[#1F2937] dark:text-white flex items-center gap-2">
                  <User className="w-4 h-4 text-[#2563EB]" />
                  <span>Personal Information</span>
                </h3>
                <p className="text-xs text-[#6B7280] dark:text-slate-400 font-normal mt-0.5">
                  Update your contact details and geographic banking jurisdiction
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>Full Legal Name</span>
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E5E7EB] dark:border-slate-700 bg-[#F8FAFC] dark:bg-slate-900 text-xs font-semibold text-[#1F2937] dark:text-white outline-none focus:border-[#2563EB] transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>Phone Number</span>
                  </label>
                  <input
                    type="text"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E5E7EB] dark:border-slate-700 bg-[#F8FAFC] dark:bg-slate-900 text-xs font-semibold text-[#1F2937] dark:text-white outline-none focus:border-[#2563EB] transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                    <span>Occupation / Profile Segment</span>
                  </label>
                  <select
                    value={occupation}
                    onChange={(e) => setOccupation(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E7EB] dark:border-slate-700 bg-[#F8FAFC] dark:bg-slate-900 text-xs font-semibold text-[#1F2937] dark:text-white outline-none focus:border-[#2563EB] cursor-pointer transition-colors"
                  >
                    <option value="Working Professional">💼 Working Professional</option>
                    <option value="Business Owner / MSME">🏢 Business Owner / MSME</option>
                    <option value="Student">🎓 Student / Young Adult</option>
                    <option value="Frequent Traveler">✈️ Frequent Traveler</option>
                    <option value="Senior Citizen">👴 Senior Citizen</option>
                    <option value="Women Special">👩 Women Special</option>
                    <option value="Elite Premium">👑 Elite Wealth / HNI</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>State / Union Territory</span>
                  </label>
                  <select
                    value={state}
                    onChange={(e) => {
                      setState(e.target.value);
                      if (INDIAN_LOCATIONS[e.target.value]) setCity(INDIAN_LOCATIONS[e.target.value][0]);
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E7EB] dark:border-slate-700 bg-[#F8FAFC] dark:bg-slate-900 text-xs font-semibold text-[#1F2937] dark:text-white outline-none focus:border-[#2563EB] cursor-pointer transition-colors"
                  >
                    {Object.keys(INDIAN_LOCATIONS).map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>City</span>
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E7EB] dark:border-slate-700 bg-[#F8FAFC] dark:bg-slate-900 text-xs font-semibold text-[#1F2937] dark:text-white outline-none focus:border-[#2563EB] cursor-pointer transition-colors"
                  >
                    {availableCities.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                    <span>Preferred Payment Network</span>
                  </label>
                  <select
                    value={primaryNetworkPref}
                    onChange={(e) => setPrimaryNetworkPref(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E7EB] dark:border-slate-700 bg-[#F8FAFC] dark:bg-slate-900 text-xs font-semibold text-[#1F2937] dark:text-white outline-none focus:border-[#2563EB] cursor-pointer transition-colors"
                  >
                    <option value="Any">🌐 Any (Visa, RuPay, Mastercard)</option>
                    <option value="RuPay">🇮🇳 RuPay (UPI & Domestic Benefits)</option>
                    <option value="Visa">💳 Visa (Worldwide Acceptance)</option>
                    <option value="Mastercard">💳 Mastercard (Global Perks)</option>
                  </select>
                </div>

              </div>

              {/* Action Bar */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4">
                <div className="text-xs text-slate-400">
                  {savedSuccess && (
                    <span className="text-emerald-500 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Changes saved to cloud!
                    </span>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={savingProfile}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#3B82F6] hover:from-[#1D4ED8] hover:to-[#2563EB] text-white text-xs font-bold shadow-md hover:shadow-lg active:scale-95 transition-all cursor-pointer flex items-center gap-2 shrink-0"
                >
                  {savingProfile ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving Changes...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Save Profile Changes</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.form>
        )}

        {/* TAB 2: SECURITY & ALERTS CENTER */}
        {currentTab === 'security' && (
          <motion.div
            key="security"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
            className="space-y-6 text-left"
          >
            {/* Real-time Security Health Tile */}
            <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-slate-800 shadow-soft space-y-5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-6 h-6 stroke-[2.2]" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-[#1F2937] dark:text-white">
                      Account Protection & Cloud Encryption
                    </h3>
                    <p className="text-xs text-[#6B7280] dark:text-slate-400">
                      Real-time user session authentication backed by Firebase Cloud IAM
                    </p>
                  </div>
                </div>

                <span className="px-3.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-500/25 flex items-center gap-1.5 shrink-0">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Active Defense</span>
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-[#F8FAFC] dark:bg-slate-900/60 border border-[#E5E7EB] dark:border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Identity Layer</span>
                  <p className="text-xs font-extrabold text-emerald-500 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Verified Cloud Auth
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#F8FAFC] dark:bg-slate-900/60 border border-[#E5E7EB] dark:border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Encryption Transit</span>
                  <p className="text-xs font-extrabold text-[#2563EB] dark:text-[#60A5FA] flex items-center gap-1.5">
                    <Lock className="w-4 h-4" /> 256-Bit TLS / SHA-256
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#F8FAFC] dark:bg-slate-900/60 border border-[#E5E7EB] dark:border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Data Partitioning</span>
                  <p className="text-xs font-extrabold text-emerald-500 flex items-center gap-1.5">
                    <Shield className="w-4 h-4" /> Role-Based Security Rules
                  </p>
                </div>
              </div>
            </div>

            {/* Instant Subscription & Regulatory Notification Toggles */}
            <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-slate-800 shadow-soft space-y-5">
              <div>
                <h3 className="text-base font-extrabold text-[#1F2937] dark:text-white flex items-center gap-2">
                  <Bell className="w-4 h-4 text-[#2563EB]" />
                  <span>Notification & Regulatory Alert Channels</span>
                </h3>
                <p className="text-xs text-[#6B7280] dark:text-slate-400 mt-0.5">
                  Instant cloud synchronization for tariff updates, lounge spending requirements, and security logs
                </p>
              </div>

              <div className="space-y-3">
                {[
                  { key: 'feeChangeAlerts', title: 'Fee & Penalty Tariff Alerts', desc: 'Get notified immediately if annual charges or MAB penalty slabs change for your saved cards.', icon: Bell },
                  { key: 'loungeRuleUpdates', title: 'Airport Lounge Spend Criteria Updates', desc: 'Receive real-time alerts whenever quarterly spend criteria or lounge access quotas are amended by banks.', icon: Plane },
                  { key: 'monthlyAuditReports', title: 'Monthly Product Audit Summaries', desc: 'Receive verified fintech comparison intelligence reports summarizing banking updates in your inbox.', icon: Layers },
                  { key: 'securityLoginAlerts', title: 'Session Security & New Device Logins', desc: 'Instant alerts whenever an authentication session is detected from an unrecognized client.', icon: Lock }
                ].map((pref) => {
                  const Icon = pref.icon;
                  const isChecked = notificationPrefs[pref.key];
                  return (
                    <div
                      key={pref.key}
                      onClick={() => togglePreference(pref.key)}
                      className="p-4 rounded-2xl bg-[#F8FAFC] dark:bg-slate-900/60 border border-[#E5E7EB] dark:border-slate-800 flex items-center justify-between cursor-pointer hover:border-[#2563EB]/40 transition-all gap-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-[#2563EB] dark:text-[#60A5FA] flex items-center justify-center shrink-0">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-extrabold text-[#1F2937] dark:text-white">{pref.title}</h4>
                          <p className="text-[11px] text-[#6B7280] dark:text-slate-400">{pref.desc}</p>
                        </div>
                      </div>

                      {/* Smooth iOS-style Toggle */}
                      <div className={`w-11 h-6 rounded-full p-0.5 transition-colors duration-200 flex items-center shrink-0 ${
                        isChecked ? 'bg-[#2563EB] justify-end' : 'bg-slate-300 dark:bg-slate-700 justify-start'
                      }`}>
                        <motion.div layout className="w-5 h-5 rounded-full bg-white shadow-xs" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 3: SAVED PORTFOLIO */}
        {currentTab === 'saved' && (
          <motion.div
            key="saved"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
            className="space-y-6 text-left"
          >
            {/* Header & Sub-category Filter Tabs */}
            <div className="p-6 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-slate-800 shadow-soft flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-black text-[#1F2937] dark:text-white flex items-center gap-2">
                  <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
                  <span>Bookmarked Banking Products</span>
                </h3>
                <p className="text-xs text-[#6B7280] dark:text-slate-400 mt-0.5">
                  Your saved debit cards, high-yield savings accounts, and business current accounts
                </p>
              </div>

              {/* Sub-category Filter Chips */}
              <div className="flex flex-wrap items-center gap-1.5 text-xs font-bold">
                {[
                  { label: 'All', count: savedCardObjects.length },
                  { label: 'Debit Cards', count: debitCardsCount },
                  { label: 'Savings Accounts', count: savingsAccountsCount },
                  { label: 'Current Accounts', count: currentAccountsCount }
                ].map(chip => (
                  <button
                    key={chip.label}
                    onClick={() => setSavedFilterType(chip.label)}
                    className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                      savedFilterType === chip.label
                        ? 'bg-[#2563EB] text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <span>{chip.label}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      savedFilterType === chip.label ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}>
                      {chip.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Saved Items Grid */}
            {filteredSavedItems.length === 0 ? (
              <div className="py-16 text-center rounded-3xl bg-white dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-slate-800 shadow-soft space-y-3">
                <Heart className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto" />
                <h4 className="text-base font-black text-[#1F2937] dark:text-white">
                  No {savedFilterType === 'All' ? 'products' : savedFilterType.toLowerCase()} saved yet
                </h4>
                <p className="text-xs text-[#6B7280] dark:text-slate-400 max-w-sm mx-auto">
                  Click the heart icon on any card or account while exploring to bookmark it here for side-by-side analysis.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSavedItems.map(item => {
                  const isCurrent = isCurrentAccountItem(item);
                  const isSavings = isSavingsAccountItem(item);

                  return (
                    <div 
                      key={item.id || item.product_id}
                      className="p-5 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-slate-800 shadow-soft hover:shadow-lg transition-all flex flex-col justify-between space-y-4"
                    >
                      {/* Product Tag & Bank Header */}
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className={`px-2.5 py-0.5 rounded-full text-[9.5px] font-extrabold uppercase tracking-wider border ${
                            isCurrent
                              ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                              : isSavings
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                              : 'bg-blue-500/10 text-[#2563EB] dark:text-[#60A5FA] border-blue-500/20'
                          }`}>
                            {isCurrent ? '💼 Current Account' : isSavings ? '🏦 Savings Account' : '💳 Debit Card'}
                          </span>

                          <button
                            onClick={() => removeFromWishlist(item.id || item.product_id)}
                            className="text-slate-400 hover:text-rose-500 transition-colors p-1 cursor-pointer"
                            title="Remove from Saved"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Title & Specs */}
                        <div className="space-y-1">
                          <span className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400 block">
                            {item.bank || item.bankName}
                          </span>
                          <h4 className="font-extrabold text-sm text-slate-800 dark:text-white leading-snug">
                            {item.cardName || item.accountName || item.variant_name}
                          </h4>
                        </div>

                        {/* Quick Spec Metrics */}
                        <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px]">
                          {isCurrent ? (
                            <>
                              <div><span className="text-slate-400 block text-[9.5px]">MAB:</span> <strong className="text-slate-700 dark:text-slate-200">{item.minimumBalance || '₹10,000'}</strong></div>
                              <div><span className="text-slate-400 block text-[9.5px]">Cash Slab:</span> <strong className="text-slate-700 dark:text-slate-200 truncate block">{item.cashDepositLimit || 'Standard'}</strong></div>
                            </>
                          ) : isSavings ? (
                            <>
                              <div><span className="text-slate-400 block text-[9.5px]">Interest:</span> <strong className="text-emerald-600 dark:text-emerald-400">{item.interestRate || '3.5% p.a.'}</strong></div>
                              <div><span className="text-slate-400 block text-[9.5px]">Min Balance:</span> <strong className="text-slate-700 dark:text-slate-200">{item.minimumBalance || '₹0'}</strong></div>
                            </>
                          ) : (
                            <>
                              <div><span className="text-slate-400 block text-[9.5px]">Annual Fee:</span> <strong className="text-slate-700 dark:text-slate-200">{item.annualFee || 'Free'}</strong></div>
                              <div><span className="text-slate-400 block text-[9.5px]">Lounge:</span> <strong className="text-cyan-600 dark:text-cyan-400">{item.loungeAccess || 'No'}</strong></div>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Action Links */}
                      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <button
                          onClick={() => onSelectCard && onSelectCard(item)}
                          className="text-xs font-bold text-[#2563EB] dark:text-[#60A5FA] hover:underline cursor-pointer flex items-center gap-1"
                        >
                          <span>Inspect Specs</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}

        {/* TAB 4: CURATED RECOMMENDATIONS */}
        {currentTab === 'recommended' && (
          <motion.div
            key="recommended"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
            className="space-y-6 text-left"
          >
            <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-[#2563EB]/10 via-[#3B82F6]/5 to-transparent border border-[#2563EB]/20 space-y-1">
              <h3 className="text-base font-extrabold text-[#1F2937] dark:text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#2563EB]" />
                <span>AI Algorithmic Matches for {occupation}</span>
              </h3>
              <p className="text-xs text-[#6B7280] dark:text-slate-300">
                Filtered and ranked based on verified fee waivers, airport lounge rules, and daily transaction limits
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedCards.map(card => (
                <div key={card.id} className="p-4 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-slate-800 shadow-soft flex flex-col justify-between space-y-4">
                  <DebitCardVisual mode="grid" card={card} />
                  <button
                    onClick={() => onSelectCard && onSelectCard(card)}
                    className="w-full py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>View Specifications</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* TAB 5: COMPARISON HISTORY */}
        {currentTab === 'compare' && (
          <motion.div
            key="compare"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
            className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-slate-800 shadow-soft space-y-5 text-left"
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-extrabold text-[#1F2937] dark:text-white flex items-center gap-2">
                  <History className="w-4 h-4 text-[#2563EB]" />
                  <span>Comparison Audit Log</span>
                </h3>
                <p className="text-xs text-[#6B7280] dark:text-slate-400">
                  Historical matrices and side-by-side evaluation sessions
                </p>
              </div>
              <span className="text-[11px] font-bold text-slate-400">
                {compareLogs.length} Sessions Logged
              </span>
            </div>

            {loadingCompareLogs ? (
              <div className="py-12 text-center text-xs text-slate-400">Loading audit history...</div>
            ) : compareLogs.length === 0 ? (
              <div className="py-12 text-center text-xs text-[#6B7280] dark:text-slate-400 space-y-2">
                <History className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
                <p>No comparison sessions logged for this account yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {compareLogs.map((log) => {
                  const isSavingsLog = log.comparisonType === 'savingsAccount' || String(log.comparedCards?.join(' ') || '').toLowerCase().includes('account');
                  const isCurrentLog = log.comparisonType === 'currentAccount' || String(log.comparedCards?.join(' ') || '').toLowerCase().includes('current');
                  return (
                    <div key={log.id} className="p-4 rounded-2xl bg-[#F8FAFC] dark:bg-slate-900/60 border border-[#E5E7EB] dark:border-slate-800 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#2563EB] block">
                          {isCurrentLog ? '💼 Current Account Matrix' : isSavingsLog ? '🏦 Savings Account Matrix' : '💳 Debit Card Matrix'}
                        </span>
                        <p className="text-xs font-extrabold text-[#1F2937] dark:text-white mt-0.5">
                          {log.comparedCards?.join(' vs ') || log.firstCard}
                        </p>
                        <p className="text-[10px] text-[#6B7280] dark:text-slate-400 mt-0.5">
                          {log.comparedAt || log.timestamp || log.created_at || 'Recent session'}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}

export default UserProfilePage;
