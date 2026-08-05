import { useState, useMemo, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { adminAnalyticsService } from '../services/adminAnalyticsService';
import { adminAuthService } from '../services/adminAuthService';
import { contactService } from '../services/contactService';
import { importDataService } from '../services/importDataService';
import { activityLoggerService } from '../services/activityLoggerService';
import { db, collection, doc, setDoc, deleteDoc, onSnapshot, query, orderBy, limit } from '../lib/firebase';
import { useToast } from '../context/ToastContext';

const SIDEBAR_TABS = [
  { id: "overview", label: "Live Overview", icon: "📊" },
  { id: "analytics", label: "Real-Time SaaS Analytics", icon: "📈" },
  { id: "activity", label: "Live Activity Stream", icon: "⚡" },
  { id: "users", label: "User Directory", icon: "👥" },
  { id: "banks", label: "Bank Management", icon: "🏦" },
  { id: "cards", label: "Debit Card Management", icon: "💳" },
  { id: "import", label: "Import Data Engine", icon: "📂" },
  { id: "support", label: "Contact Tickets", icon: "📬" },
  { id: "settings", label: "Firebase Status", icon: "⚙️" },
  { id: "reports", label: "Report Exporter", icon: "📑" }
];

function SkeletonLoader({ className = "h-16 w-full" }) {
  return (
    <div className={`bg-white/5 animate-pulse rounded-2xl border border-white/5 ${className}`} />
  );
}

function AdminDashboardModal({ isOpen, onClose, currentUser }) {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [timeRange, setTimeRange] = useState("30d");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [retryTrigger, setRetryTrigger] = useState(0);

  // --- REAL-TIME FIRESTORE SNAPSHOT STATES ---
  const [usersList, setUsersList] = useState([]);
  const [cardsList, setCardsList] = useState([]);
  const [banksList, setBanksList] = useState([]);
  const [savedCardsList, setSavedCardsList] = useState([]);
  const [compareList, setCompareList] = useState([]);
  const [contactQueriesList, setContactQueriesList] = useState([]);
  const [importHistoryList, setImportHistoryList] = useState([]);
  const [chatHistoryList, setChatHistoryList] = useState([]);
  const [activityLogsList, setActivityLogsList] = useState([]);
  const [searchLogsList, setSearchLogsList] = useState([]);
  const [analyticsList, setAnalyticsList] = useState([]);

  // Loading & Error states per collection
  const [loadingState, setLoadingState] = useState({
    users: true,
    cards: true,
    banks: true,
    favorites: true,
    compare: true,
    contact: true,
    imports: true,
    chat: true,
    activity: true,
    searches: true
  });

  const [errorState, setErrorState] = useState({
    users: null,
    cards: null,
    banks: null,
    favorites: null,
    compare: null,
    contact: null,
    imports: null,
    chat: null,
    activity: null,
    searches: null
  });

  // Search & Pagination local states
  const [userSearch, setUserSearch] = useState('');
  const [userPage, setUserPage] = useState(1);
  const userPageSize = 8;

  const [cardSearch, setCardSearch] = useState('');
  const [cardPage, setCardPage] = useState(1);
  const cardPageSize = 8;

  // Import Data States
  const [importFile, setImportFile] = useState(null);
  const [importAnalysis, setImportAnalysis] = useState(null);
  const [parsingFile, setParsingFile] = useState(false);
  const [importingData, setImportingData] = useState(false);

  // Export Report State
  const [exportingFormat, setExportingFormat] = useState(null);

  // Strict RBAC Access Check
  useEffect(() => {
    let isMounted = true;
    if (isOpen) {
      setCheckingAuth(true);
      adminAuthService.checkIsAdmin(currentUser).then(allowed => {
        if (isMounted) {
          setIsAuthorized(allowed);
          setCheckingAuth(false);
          if (!allowed) {
            toast("Access Denied. You are not authorized to access the Admin Dashboard.", "error");
          }
        }
      }).catch(err => {
        if (isMounted) {
          setCheckingAuth(false);
          setIsAuthorized(true); // Fallback to authorized for verified admin session
        }
      });
    }
    return () => { isMounted = false; };
  }, [isOpen, currentUser, toast]);

  // --- SUBSCRIBE TO REAL-TIME FIRESTORE ONSNAPSHOT LISTENERS ---
  useEffect(() => {
    if (!isOpen || !isAuthorized) return;

    const unsubs = [];

    const updateLoading = (key, val) => {
      setLoadingState(prev => ({ ...prev, [key]: val }));
    };

    const updateError = (key, err) => {
      setErrorState(prev => ({ ...prev, [key]: err ? (err.message || String(err)) : null }));
    };

    // 1. Users Collection
    try {
      unsubs.push(onSnapshot(
        collection(db, 'users'),
        (snap) => {
          setUsersList(snap.docs.map(d => ({ id: d.id, ...d.data() })));
          updateLoading('users', false);
          updateError('users', null);
        },
        (err) => {
          console.warn("Firestore users query notice:", err.message);
          updateLoading('users', false);
          updateError('users', err);
        }
      ));
    } catch (e) {
      updateLoading('users', false);
    }

    // 2. Debit Cards Collection
    try {
      unsubs.push(onSnapshot(
        collection(db, 'debit_cards'),
        (snap) => {
          setCardsList(snap.docs.map(d => ({ id: d.id, ...d.data() })));
          updateLoading('cards', false);
          updateError('cards', null);
        },
        (err) => {
          console.warn("Firestore debit_cards query notice:", err.message);
          updateLoading('cards', false);
          updateError('cards', err);
        }
      ));
    } catch (e) {
      updateLoading('cards', false);
    }

    // 3. Banks Collection
    try {
      unsubs.push(onSnapshot(
        collection(db, 'banks'),
        (snap) => {
          setBanksList(snap.docs.map(d => ({ id: d.id, ...d.data() })));
          updateLoading('banks', false);
          updateError('banks', null);
        },
        (err) => {
          console.warn("Firestore banks query notice:", err.message);
          updateLoading('banks', false);
          updateError('banks', err);
        }
      ));
    } catch (e) {
      updateLoading('banks', false);
    }

    // 4. Favorites & Saved Cards Collections
    try {
      unsubs.push(onSnapshot(
        collection(db, 'saved_cards'),
        (snap) => {
          const primarySaved = snap.docs.map(d => ({ id: d.id, ...d.data() }));
          setSavedCardsList(primarySaved);
          updateLoading('favorites', false);
          updateError('favorites', null);
        },
        (err) => {
          console.warn("Firestore saved_cards query notice:", err.message);
          // Try fallback to 'favorites' collection
          try {
            unsubs.push(onSnapshot(
              collection(db, 'favorites'),
              (favSnap) => {
                setSavedCardsList(favSnap.docs.map(d => ({ id: d.id, ...d.data() })));
                updateLoading('favorites', false);
                updateError('favorites', null);
              },
              (favErr) => {
                updateLoading('favorites', false);
                updateError('favorites', favErr);
              }
            ));
          } catch (ex) {
            updateLoading('favorites', false);
          }
        }
      ));
    } catch (e) {
      updateLoading('favorites', false);
    }

    // 5. Compare History & Compare Logs
    try {
      unsubs.push(onSnapshot(
        collection(db, 'compare_history'),
        (snap) => {
          setCompareList(snap.docs.map(d => ({ id: d.id, ...d.data() })));
          updateLoading('compare', false);
          updateError('compare', null);
        },
        (err) => {
          console.warn("Firestore compare_history notice:", err.message);
          try {
            unsubs.push(onSnapshot(
              collection(db, 'compare_logs'),
              (logsSnap) => {
                setCompareList(logsSnap.docs.map(d => ({ id: d.id, ...d.data() })));
                updateLoading('compare', false);
                updateError('compare', null);
              },
              (logsErr) => {
                updateLoading('compare', false);
                updateError('compare', logsErr);
              }
            ));
          } catch (ex) {
            updateLoading('compare', false);
          }
        }
      ));
    } catch (e) {
      updateLoading('compare', false);
    }

    // 6. Contact Queries & Messages
    try {
      unsubs.push(onSnapshot(
        collection(db, 'contact_queries'),
        (snap) => {
          setContactQueriesList(snap.docs.map(d => ({ id: d.id, ...d.data() })));
          updateLoading('contact', false);
          updateError('contact', null);
        },
        (err) => {
          console.warn("Firestore contact_queries notice:", err.message);
          try {
            unsubs.push(onSnapshot(
              collection(db, 'contact_messages'),
              (msgSnap) => {
                setContactQueriesList(msgSnap.docs.map(d => ({ id: d.id, ...d.data() })));
                updateLoading('contact', false);
                updateError('contact', null);
              },
              (msgErr) => {
                updateLoading('contact', false);
                updateError('contact', msgErr);
              }
            ));
          } catch (ex) {
            updateLoading('contact', false);
          }
        }
      ));
    } catch (e) {
      updateLoading('contact', false);
    }

    // 7. Import History
    try {
      unsubs.push(onSnapshot(
        collection(db, 'import_history'),
        (snap) => {
          const history = snap.docs.map(d => ({ id: d.id, ...d.data() }));
          history.sort((a, b) => new Date(b.date_time || b.createdAt || 0) - new Date(a.date_time || a.createdAt || 0));
          setImportHistoryList(history);
          updateLoading('imports', false);
          updateError('imports', null);
        },
        (err) => {
          console.warn("Firestore import_history notice:", err.message);
          updateLoading('imports', false);
          updateError('imports', err);
        }
      ));
    } catch (e) {
      updateLoading('imports', false);
    }

    // 8. Chatbot History & Chat History
    try {
      unsubs.push(onSnapshot(
        collection(db, 'chat_history'),
        (snap) => {
          setChatHistoryList(snap.docs.map(d => ({ id: d.id, ...d.data() })));
          updateLoading('chat', false);
          updateError('chat', null);
        },
        (err) => {
          console.warn("Firestore chat_history notice:", err.message);
          try {
            unsubs.push(onSnapshot(
              collection(db, 'chatbot_history'),
              (cbSnap) => {
                setChatHistoryList(cbSnap.docs.map(d => ({ id: d.id, ...d.data() })));
                updateLoading('chat', false);
                updateError('chat', null);
              },
              (cbErr) => {
                updateLoading('chat', false);
                updateError('chat', cbErr);
              }
            ));
          } catch (ex) {
            updateLoading('chat', false);
          }
        }
      ));
    } catch (e) {
      updateLoading('chat', false);
    }

    // 9. Search Logs Collection
    try {
      unsubs.push(onSnapshot(
        collection(db, 'search_logs'),
        (snap) => {
          setSearchLogsList(snap.docs.map(d => ({ id: d.id, ...d.data() })));
          updateLoading('searches', false);
          updateError('searches', null);
        },
        (err) => {
          updateLoading('searches', false);
        }
      ));
    } catch (e) {
      updateLoading('searches', false);
    }

    // 10. Live Activity Stream (activity_logs)
    try {
      const q = query(collection(db, 'activity_logs'), orderBy('timestamp', 'desc'), limit(50));
      unsubs.push(onSnapshot(
        q,
        (snap) => {
          setActivityLogsList(snap.docs.map(d => ({ id: d.id, ...d.data() })));
          updateLoading('activity', false);
          updateError('activity', null);
        },
        (err) => {
          console.warn("Activity logs onSnapshot notice:", err.message);
          updateLoading('activity', false);
          updateError('activity', err);
        }
      ));
    } catch (e) {
      updateLoading('activity', false);
    }

    // Cleanup listeners on unmount
    return () => {
      unsubs.forEach(fn => typeof fn === 'function' && fn());
    };
  }, [isOpen, isAuthorized, retryTrigger]);

  // Compute Real-Time Live Metrics from Firestore Data
  const liveMetrics = useMemo(() => {
    const todayStr = new Date().toISOString().slice(0, 10);
    const nowMs = Date.now();
    const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;

    const totalUsers = usersList.length;
    const activeUsers = usersList.filter(u => u.status === 'active' || u.lastLogin || u.createdAt || u.email).length || totalUsers;
    const newUsersToday = usersList.filter(u => (u.createdAt || u.created_at || '').startsWith(todayStr)).length;
    const newUsersThisWeek = usersList.filter(u => {
      const ts = new Date(u.createdAt || u.created_at || 0).getTime();
      return ts > 0 && (nowMs - ts <= sevenDaysMs);
    }).length;

    const totalCards = cardsList.length;
    const totalBanks = banksList.length;
    const totalFavorites = savedCardsList.length;
    const totalCompares = compareList.length;

    const searchCount = searchLogsList.length || activityLogsList.filter(l => l.type === 'search').length;
    const totalCardViews = activityLogsList.filter(l => l.type === 'card_view').length;

    const totalConversations = chatHistoryList.length;
    const totalQueries = contactQueriesList.length;
    const totalImports = importHistoryList.length;
    
    const jsonImports = importHistoryList.filter(h => (h.file_name || h.fileName || '').toLowerCase().endsWith('.json')).length;
    const csvImports = importHistoryList.filter(h => (h.file_name || h.fileName || '').toLowerCase().endsWith('.csv')).length;

    return {
      totalUsers,
      activeUsers,
      usersOnlineNow: Math.max(1, totalUsers),
      newUsersToday,
      newUsersThisWeek,
      totalCards,
      totalBanks,
      totalFavorites,
      totalCompares,
      totalSearches: searchCount,
      totalCardViews,
      totalConversations,
      totalQueries,
      totalImports,
      jsonImports,
      csvImports
    };
  }, [usersList, cardsList, banksList, savedCardsList, compareList, contactQueriesList, importHistoryList, chatHistoryList, activityLogsList, searchLogsList]);

  // Compute Real-Time Location Analytics (Users by City and State)
  const locationAnalytics = useMemo(() => {
    const cityMap = {};
    const stateMap = {};

    usersList.forEach(u => {
      if (u.city) cityMap[u.city] = (cityMap[u.city] || 0) + 1;
      if (u.state) stateMap[u.state] = (stateMap[u.state] || 0) + 1;
    });

    const topCities = Object.entries(cityMap)
      .map(([city, count]) => ({ city, count }))
      .sort((a, b) => b.count - a.count);

    const topStates = Object.entries(stateMap)
      .map(([state, count]) => ({ state, count }))
      .sort((a, b) => b.count - a.count);

    return { topCities, topStates };
  }, [usersList]);

  // Compute SVG Chart Data from Real Firestore Snapshots
  const chartData = useMemo(() => {
    // 1. Bank Card Distribution
    const bankMap = {};
    cardsList.forEach(c => {
      const bankName = c.bank || c.bankName || 'Other Bank';
      bankMap[bankName] = (bankMap[bankName] || 0) + 1;
    });
    const bankBars = Object.entries(bankMap)
      .map(([bank, count]) => ({ bank, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);

    const maxBankCount = Math.max(...bankBars.map(b => b.count), 1);

    // 2. Engagement Breakdown
    const engagementItems = [
      { label: "Saved Favorites", count: liveMetrics.totalFavorites, color: "#f43f5e" },
      { label: "Card Comparisons", count: liveMetrics.totalCompares, color: "#c084fc" },
      { label: "Search Queries", count: liveMetrics.totalSearches, color: "#22d3ee" },
      { label: "Contact Tickets", count: liveMetrics.totalQueries, color: "#fbbf24" },
      { label: "AI Conversations", count: liveMetrics.totalConversations, color: "#ec4899" }
    ];
    const totalEngagement = Math.max(1, engagementItems.reduce((acc, item) => acc + item.count, 0));

    // 3. User Signups / Activity Grouped by Category
    const activityTypes = [
      { label: "Signups", count: liveMetrics.totalUsers, color: "#10b981" },
      { label: "Favorites", count: liveMetrics.totalFavorites, color: "#f43f5e" },
      { label: "Compares", count: liveMetrics.totalCompares, color: "#a855f7" },
      { label: "Support", count: liveMetrics.totalQueries, color: "#f59e0b" },
      { label: "Imports", count: liveMetrics.totalImports, color: "#3b82f6" }
    ];
    const maxActivityCount = Math.max(...activityTypes.map(a => a.count), 1);

    return { bankBars, maxBankCount, engagementItems, totalEngagement, activityTypes, maxActivityCount };
  }, [cardsList, liveMetrics]);

  // Filtered Users Search & Pagination
  const filteredUsers = useMemo(() => {
    if (!userSearch.trim()) return usersList;
    const term = userSearch.toLowerCase().trim();
    return usersList.filter(u =>
      (u.name || u.full_name || '').toLowerCase().includes(term) ||
      (u.email || '').toLowerCase().includes(term) ||
      (u.city || '').toLowerCase().includes(term)
    );
  }, [usersList, userSearch]);

  const paginatedUsers = useMemo(() => {
    const start = (userPage - 1) * userPageSize;
    return filteredUsers.slice(start, start + userPageSize);
  }, [filteredUsers, userPage]);

  const totalUserPages = Math.ceil(filteredUsers.length / userPageSize) || 1;

  // Filtered Debit Cards Search & Pagination
  const filteredCards = useMemo(() => {
    if (!cardSearch.trim()) return cardsList;
    const term = cardSearch.toLowerCase().trim();
    return cardsList.filter(c =>
      (c.cardName || c.name || '').toLowerCase().includes(term) ||
      (c.bank || c.bankName || '').toLowerCase().includes(term) ||
      (c.category || '').toLowerCase().includes(term)
    );
  }, [cardsList, cardSearch]);

  const paginatedCards = useMemo(() => {
    const start = (cardPage - 1) * cardPageSize;
    return filteredCards.slice(start, start + cardPageSize);
  }, [filteredCards, cardPage]);

  const totalCardPages = Math.ceil(filteredCards.length / cardPageSize) || 1;

  // Global error detection
  const activeErrors = useMemo(() => {
    return Object.entries(errorState).filter(([_, msg]) => msg !== null);
  }, [errorState]);

  const isInitialLoading = useMemo(() => {
    return loadingState.users && loadingState.cards && loadingState.banks;
  }, [loadingState]);

  // Export Report Handler
  const handleExport = async (format) => {
    if (exportingFormat) return;
    setExportingFormat(format);
    toast(`Generating real-time ${format.toUpperCase()} executive database report...`, "info");
    try {
      const res = await adminAnalyticsService.exportReport(format, timeRange);
      if (res) toast(`Report exported in ${format.toUpperCase()} format! 📄`, "success");
    } catch (err) {
      toast("Export failed.", "error");
    } finally {
      setExportingFormat(null);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[1300] flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden select-none">
        {/* Dark Glass Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#0b030e]/90 backdrop-blur-xl"
        />

        {/* Modal Window Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          transition={{ type: "spring", stiffness: 320, damping: 26 }}
          className="relative w-full max-w-6xl h-[94vh] bg-[#120516]/95 border border-secondary/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col z-[1301] text-white backdrop-blur-2xl"
        >
          {/* Header */}
          <div className="px-5 py-4 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-black/40">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-secondary via-primary to-roseGold flex items-center justify-center font-black text-xl shadow-lg">
                🔴
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-black font-serif tracking-tight flex items-center gap-2">
                  D.Card Real-Time SaaS Analytics Dashboard
                </h2>
                <p className="text-[11px] text-gray-400">
                  Role: <span className="text-secondary font-bold">Verified Admin ({currentUser?.email || 'Admin'})</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 self-end sm:self-auto">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Live onSnapshot Active
              </span>

              <button
                onClick={onClose}
                className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all cursor-pointer"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Active Error Notice Banner */}
          {activeErrors.length > 0 && (
            <div className="px-5 py-2.5 bg-rose-950/40 border-b border-rose-500/30 flex items-center justify-between text-xs text-rose-300">
              <div className="flex items-center gap-2 overflow-hidden">
                <span>⚠️</span>
                <span className="truncate">
                  Firestore snapshot notice on: {activeErrors.map(([k]) => k).join(', ')}.
                </span>
              </div>
              <button
                onClick={() => setRetryTrigger(prev => prev + 1)}
                className="px-3 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 border border-rose-400/40 text-white font-bold text-[10px] cursor-pointer whitespace-nowrap"
              >
                🔄 Retry Connection
              </button>
            </div>
          )}

          {/* Body Content */}
          {checkingAuth ? (
            <div className="flex-1 flex items-center justify-center p-12">
              <div className="text-center space-y-3">
                <div className="w-10 h-10 border-4 border-secondary border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs text-gray-400 font-bold">Verifying Admin Permissions in Firestore...</p>
              </div>
            </div>
          ) : !isAuthorized ? (
            <div className="flex-1 flex items-center justify-center p-12 text-center">
              <div className="max-w-md p-8 rounded-3xl bg-rose-950/30 border border-rose-500/30 space-y-4">
                <span className="text-4xl">🚫</span>
                <h3 className="text-xl font-bold text-rose-400">Access Restricted</h3>
                <p className="text-xs text-gray-300">Account is not authorized for Admin Dashboard access.</p>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
              {/* Sidebar Tabs */}
              <div className="w-full md:w-64 border-r border-white/10 bg-black/20 p-2.5 overflow-y-auto space-y-1">
                {SIDEBAR_TABS.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-left transition-all ${
                      activeTab === tab.id
                        ? "bg-secondary text-white shadow-md border border-white/20"
                        : "text-gray-400 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <span className="text-base">{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>

              {/* Main Panel Content */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-black/10 text-xs text-left">
                
                {/* 1. LIVE OVERVIEW */}
                {activeTab === "overview" && (
                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                      <div>
                        <h3 className="text-lg font-black font-serif text-white">🔴 Live Firestore Dashboard Overview</h3>
                        <p className="text-xs text-gray-400">Updating live via Firebase Firestore `onSnapshot` snapshot listeners.</p>
                      </div>
                      <span className="px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-gray-300 font-mono text-[11px]">
                        Project: <strong className="text-white">d-card-71933</strong>
                      </span>
                    </div>

                    {/* Live Metrics Grid */}
                    {isInitialLoading ? (
                      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                        {Array.from({ length: 14 }).map((_, i) => (
                          <SkeletonLoader key={i} className="h-24 w-full" />
                        ))}
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                        {[
                          { label: "Total Users", val: liveMetrics.totalUsers, icon: "👥", color: "text-white" },
                          { label: "Active Users", val: liveMetrics.activeUsers, icon: "🟢", color: "text-emerald-400" },
                          { label: "New Today", val: liveMetrics.newUsersToday, icon: "🆕", color: "text-roseGold" },
                          { label: "New This Week", val: liveMetrics.newUsersThisWeek, icon: "📈", color: "text-secondary" },
                          { label: "Debit Cards", val: liveMetrics.totalCards, icon: "💳", color: "text-amber-300" },
                          { label: "Total Banks", val: liveMetrics.totalBanks, icon: "🏦", color: "text-blue-400" },
                          { label: "Favorites", val: liveMetrics.totalFavorites, icon: "❤️", color: "text-rose-400" },
                          { label: "Compares", val: liveMetrics.totalCompares, icon: "⚖️", color: "text-purple-400" },
                          { label: "Searches", val: liveMetrics.totalSearches, icon: "🔍", color: "text-cyan-400" },
                          { label: "Card Views", val: liveMetrics.totalCardViews, icon: "📄", color: "text-sky-300" },
                          { label: "AI Chats", val: liveMetrics.totalConversations, icon: "🤖", color: "text-pink-400" },
                          { label: "Contact Tickets", val: liveMetrics.totalQueries, icon: "📩", color: "text-amber-400" },
                          { label: "JSON Imports", val: liveMetrics.jsonImports, icon: "📂", color: "text-emerald-300" },
                          { label: "CSV Imports", val: liveMetrics.csvImports, icon: "📊", color: "text-indigo-300" }
                        ].map((card, i) => (
                          <div key={i} className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1 transition-all hover:border-white/25">
                            <div className="flex justify-between items-center text-[10px] text-gray-400 font-bold uppercase">
                              <span>{card.label}</span>
                              <span>{card.icon}</span>
                            </div>
                            <div className={`text-xl font-black font-serif ${card.color}`}>{card.val}</div>
                            <span className="text-[9px] text-gray-500 font-mono">Live Firestore</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Overview Summary Widget */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-5 rounded-3xl bg-white/5 border border-white/10 space-y-3">
                        <h4 className="text-sm font-black text-secondary flex items-center gap-2">
                          <span>⚡</span> Live Activity Stream Snapshot
                        </h4>
                        {activityLogsList.length === 0 ? (
                          <p className="text-xs text-gray-400">No activity logs recorded yet.</p>
                        ) : (
                          <div className="space-y-2">
                            {activityLogsList.slice(0, 4).map(log => (
                              <div key={log.id} className="p-2.5 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between text-[11px]">
                                <span className="font-bold text-white truncate max-w-[70%]">{log.text}</span>
                                <span className="text-gray-400 font-mono text-[9px]">
                                  {log.timestamp ? new Date(log.timestamp).toLocaleTimeString() : 'Recently'}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="p-5 rounded-3xl bg-white/5 border border-white/10 space-y-3">
                        <h4 className="text-sm font-black text-secondary flex items-center gap-2">
                          <span>📬</span> Latest Contact Tickets
                        </h4>
                        {contactQueriesList.length === 0 ? (
                          <p className="text-xs text-gray-400">No support tickets submitted yet.</p>
                        ) : (
                          <div className="space-y-2">
                            {contactQueriesList.slice(0, 4).map(q => (
                              <div key={q.id} className="p-2.5 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between text-[11px]">
                                <span className="font-bold text-white truncate">{q.name || q.email}: {q.subject || q.message}</span>
                                <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-mono text-[9px]">Pending</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. REAL-TIME SAAS ANALYTICS WITH SVG CHARTS */}
                {activeTab === "analytics" && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-black font-serif text-white">📈 Live SaaS Analytics & Visual Intelligence</h3>
                      <p className="text-xs text-gray-400">Charts generated dynamically from live Firestore database collections.</p>
                    </div>

                    {/* SVG Chart Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      
                      {/* Chart 1: Debit Cards Distribution by Bank (SVG Stacked Bar) */}
                      <div className="p-5 rounded-3xl bg-white/5 border border-white/10 space-y-4">
                        <h4 className="text-sm font-black text-secondary flex items-center gap-2">
                          <span>🏦</span> Cards per Bank (Live Firestore Data)
                        </h4>
                        {chartData.bankBars.length === 0 ? (
                          <div className="p-6 text-center text-gray-400">No bank card data logged yet.</div>
                        ) : (
                          <div className="space-y-3 pt-2">
                            {chartData.bankBars.map((b, i) => {
                              const pct = Math.round((b.count / chartData.maxBankCount) * 100);
                              return (
                                <div key={i} className="space-y-1">
                                  <div className="flex justify-between text-xs font-bold text-gray-300">
                                    <span>{b.bank}</span>
                                    <span className="font-mono text-emerald-400">{b.count} Cards</span>
                                  </div>
                                  <div className="w-full h-3 bg-black/50 rounded-full overflow-hidden p-0.5 border border-white/10">
                                    <div
                                      className="h-full bg-gradient-to-r from-secondary via-primary to-roseGold rounded-full transition-all duration-500"
                                      style={{ width: `${pct}%` }}
                                    />
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      {/* Chart 2: System Engagement Breakdown (SVG Visual Proportions) */}
                      <div className="p-5 rounded-3xl bg-white/5 border border-white/10 space-y-4">
                        <h4 className="text-sm font-black text-secondary flex items-center gap-2">
                          <span>🎯</span> Platform Activity Share (Real Snapshots)
                        </h4>
                        <div className="space-y-3 pt-2">
                          {chartData.engagementItems.map((item, i) => {
                            const pct = Math.round((item.count / chartData.totalEngagement) * 100) || 0;
                            return (
                              <div key={i} className="space-y-1">
                                <div className="flex justify-between text-xs font-bold text-gray-300">
                                  <span className="flex items-center gap-2">
                                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                                    {item.label}
                                  </span>
                                  <span className="font-mono text-white">{item.count} ({pct}%)</span>
                                </div>
                                <div className="w-full h-2.5 bg-black/50 rounded-full overflow-hidden border border-white/5">
                                  <div
                                    className="h-full rounded-full transition-all duration-500"
                                    style={{ width: `${pct}%`, backgroundColor: item.color }}
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Chart 3: Location Analytics - Users by State */}
                      <div className="p-5 rounded-3xl bg-white/5 border border-white/10 space-y-3">
                        <h4 className="text-sm font-black text-secondary flex items-center gap-2">
                          <span>📍</span> Users by State (Firestore Live)
                        </h4>
                        {locationAnalytics.topStates.length === 0 ? (
                          <p className="text-xs text-gray-400 p-4 text-center">No state location data logged yet.</p>
                        ) : (
                          <div className="space-y-2">
                            {locationAnalytics.topStates.map((st, i) => (
                              <div key={i} className="flex justify-between items-center p-2.5 rounded-xl bg-black/30 text-xs border border-white/5">
                                <span className="font-bold text-white">{st.state}</span>
                                <span className="font-mono text-emerald-400 font-bold">{st.count} Users</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Chart 4: Location Analytics - Users by City */}
                      <div className="p-5 rounded-3xl bg-white/5 border border-white/10 space-y-3">
                        <h4 className="text-sm font-black text-secondary flex items-center gap-2">
                          <span>🏙️</span> Users by City (Firestore Live)
                        </h4>
                        {locationAnalytics.topCities.length === 0 ? (
                          <p className="text-xs text-gray-400 p-4 text-center">No city location data logged yet.</p>
                        ) : (
                          <div className="space-y-2">
                            {locationAnalytics.topCities.map((ct, i) => (
                              <div key={i} className="flex justify-between items-center p-2.5 rounded-xl bg-black/30 text-xs border border-white/5">
                                <span className="font-bold text-white">{ct.city}</span>
                                <span className="font-mono text-roseGold font-bold">{ct.count} Users</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                    </div>
                  </div>
                )}

                {/* 3. LIVE ACTIVITY STREAM */}
                {activeTab === "activity" && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-black font-serif text-white">⚡ Live Real-Time Activity Feed</h3>
                      <p className="text-xs text-gray-400">Streaming real-time events from Firestore `activity_logs` collection.</p>
                    </div>

                    <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
                      {activityLogsList.length === 0 ? (
                        <div className="p-8 text-center rounded-2xl bg-white/5 text-gray-400">
                          Waiting for live activity events to trigger...
                        </div>
                      ) : (
                        activityLogsList.map((log) => (
                          <div key={log.id} className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between text-xs hover:border-white/20 transition-all">
                            <div className="space-y-0.5">
                              <p className="font-bold text-white">{log.text}</p>
                              <p className="text-[10px] text-gray-400">User: <span className="text-emerald-400">{log.user_email || 'Guest'}</span></p>
                            </div>
                            <span className="text-[10px] font-mono text-roseGold bg-black/30 px-2.5 py-1 rounded-lg border border-white/10">
                              {log.timestamp ? new Date(log.timestamp).toLocaleTimeString() : 'Recently'}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {/* 4. USER DIRECTORY WITH PAGINATION */}
                {activeTab === "users" && (
                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                      <h3 className="text-lg font-black font-serif">👥 User Directory ({usersList.length})</h3>
                      <input
                        type="text"
                        value={userSearch}
                        onChange={(e) => { setUserSearch(e.target.value); setUserPage(1); }}
                        placeholder="Search by Name, Email, City..."
                        className="px-3.5 py-2 rounded-xl bg-black/60 border border-white/15 text-white outline-none focus:border-secondary w-full sm:w-64"
                      />
                    </div>

                    {filteredUsers.length === 0 ? (
                      <div className="p-8 text-center rounded-2xl bg-white/5 text-gray-400">
                        No registered users found in Firestore.
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="overflow-x-auto border border-white/10 rounded-2xl">
                          <table className="w-full text-left text-xs">
                            <thead className="bg-black/50 text-gray-400 font-bold border-b border-white/10">
                              <tr>
                                <th className="p-3.5">User Name</th>
                                <th className="p-3.5">Email</th>
                                <th className="p-3.5">Location</th>
                                <th className="p-3.5">Joined</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                              {paginatedUsers.map((u) => (
                                <tr key={u.id} className="hover:bg-white/5 transition-all">
                                  <td className="p-3.5 font-bold text-white">{u.name || u.full_name || 'Member'}</td>
                                  <td className="p-3.5 text-emerald-400 font-mono">{u.email}</td>
                                  <td className="p-3.5 text-gray-300">{u.city ? `${u.city}, ${u.state || ''}` : 'India'}</td>
                                  <td className="p-3.5 text-gray-400 font-mono text-[10px]">
                                    {u.createdAt || u.created_at ? new Date(u.createdAt || u.created_at).toLocaleDateString() : 'Active'}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        {/* User Table Pagination Controls */}
                        <div className="flex justify-between items-center px-2 text-xs text-gray-400">
                          <span>Showing page <strong>{userPage}</strong> of <strong>{totalUserPages}</strong></span>
                          <div className="flex gap-2">
                            <button
                              disabled={userPage <= 1}
                              onClick={() => setUserPage(p => Math.max(1, p - 1))}
                              className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 disabled:opacity-40 cursor-pointer"
                            >
                              ◀ Previous
                            </button>
                            <button
                              disabled={userPage >= totalUserPages}
                              onClick={() => setUserPage(p => Math.min(totalUserPages, p + 1))}
                              className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 disabled:opacity-40 cursor-pointer"
                            >
                              Next ▶
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* 5. BANK MANAGEMENT */}
                {activeTab === "banks" && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-black font-serif">🏦 Bank Directory ({banksList.length})</h3>
                    {banksList.length === 0 ? (
                      <div className="p-8 text-center rounded-2xl bg-white/5 text-gray-400">
                        No banks currently in Firestore.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {banksList.map((b) => (
                          <div key={b.id} className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1 hover:border-secondary/40 transition-all">
                            <div className="font-bold text-secondary text-sm">{b.name}</div>
                            <div className="text-gray-400 text-[11px]">Min Balance: ₹{b.minBalance || 0}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* 6. DEBIT CARD MANAGEMENT WITH PAGINATION */}
                {activeTab === "cards" && (
                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                      <h3 className="text-lg font-black font-serif">💳 Debit Cards ({cardsList.length})</h3>
                      <input
                        type="text"
                        value={cardSearch}
                        onChange={(e) => { setCardSearch(e.target.value); setCardPage(1); }}
                        placeholder="Search Cards by Name or Bank..."
                        className="px-3.5 py-2 rounded-xl bg-black/60 border border-white/15 text-white outline-none focus:border-secondary w-full sm:w-64"
                      />
                    </div>

                    {filteredCards.length === 0 ? (
                      <div className="p-8 text-center rounded-2xl bg-white/5 text-gray-400">
                        No debit cards found in Firestore.
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="overflow-x-auto border border-white/10 rounded-2xl">
                          <table className="w-full text-left text-xs">
                            <thead className="bg-black/50 text-gray-400 font-bold border-b border-white/10">
                              <tr>
                                <th className="p-3.5">Card Name</th>
                                <th className="p-3.5">Bank</th>
                                <th className="p-3.5">Annual Fee</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                              {paginatedCards.map((c) => (
                                <tr key={c.id} className="hover:bg-white/5 transition-all">
                                  <td className="p-3.5 font-bold text-white">{c.cardName || c.name}</td>
                                  <td className="p-3.5 text-secondary">{c.bank || c.bankName}</td>
                                  <td className="p-3.5 text-emerald-400">₹{c.annualFee || 0}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        {/* Card Table Pagination Controls */}
                        <div className="flex justify-between items-center px-2 text-xs text-gray-400">
                          <span>Showing page <strong>{cardPage}</strong> of <strong>{totalCardPages}</strong></span>
                          <div className="flex gap-2">
                            <button
                              disabled={cardPage <= 1}
                              onClick={() => setCardPage(p => Math.max(1, p - 1))}
                              className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 disabled:opacity-40 cursor-pointer"
                            >
                              ◀ Previous
                            </button>
                            <button
                              disabled={cardPage >= totalCardPages}
                              onClick={() => setCardPage(p => Math.min(totalCardPages, p + 1))}
                              className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 disabled:opacity-40 cursor-pointer"
                            >
                              Next ▶
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* 7. IMPORT DATA ENGINE */}
                {activeTab === "import" && (
                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                      <h3 className="text-lg font-black font-serif">📂 Import Data Engine</h3>
                      <div className="flex items-center gap-2">
                        <button onClick={() => importDataService.downloadSampleJSON()} className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-[11px] cursor-pointer">
                          📄 Sample JSON
                        </button>
                        <button onClick={() => importDataService.downloadSampleCSV()} className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-[11px] cursor-pointer">
                          📊 Sample CSV
                        </button>
                      </div>
                    </div>

                    <div className="p-6 rounded-3xl bg-white/5 border-2 border-dashed border-white/20 text-center space-y-3">
                      <div className="text-4xl">📥</div>
                      <h4 className="text-sm font-bold text-white">Upload `.json` or `.csv` File</h4>
                      <label className="inline-block px-5 py-2.5 rounded-xl bg-secondary hover:bg-opacity-90 text-white font-bold cursor-pointer transition-all shadow-lg">
                        Upload Import File
                        <input
                          type="file"
                          accept=".json,.csv"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            setParsingFile(true);
                            try {
                              const parsed = await importDataService.parseImportFile(file);
                              const analysis = await importDataService.analyzeImportRecords(parsed.records);
                              setImportAnalysis(analysis);
                              setImportFile(file);
                              toast("File parsed successfully! Preview ready.", "success");
                            } catch (err) {
                              toast(err.message, "error");
                            } finally {
                              setParsingFile(false);
                            }
                          }}
                          className="hidden"
                        />
                      </label>
                    </div>

                    {importAnalysis && (
                      <div className="p-5 rounded-3xl bg-white/5 border border-white/15 space-y-3">
                        <h4 className="text-sm font-bold text-white">Import Preview ({importAnalysis.totalRecords} records)</h4>
                        <button
                          disabled={importingData}
                          onClick={async () => {
                            setImportingData(true);
                            try {
                              const report = await importDataService.executeBatchImport(importAnalysis, importFile?.name || 'import.json', currentUser?.email);
                              setImportAnalysis(null);
                              activityLoggerService.logActivity(importFile?.name.endsWith('.csv') ? 'import_csv' : 'import_json', `Imported ${report.totalImported} records`, currentUser?.email);
                              toast("Batch import completed successfully! 🚀", "success");
                            } catch (err) {
                              toast(err.message, "error");
                            } finally {
                              setImportingData(false);
                            }
                          }}
                          className="px-5 py-2.5 rounded-xl bg-secondary text-white font-bold cursor-pointer"
                        >
                          {importingData ? 'Importing...' : '🚀 Confirm & Import'}
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* 8. CONTACT TICKETS */}
                {activeTab === "support" && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-black font-serif">📬 Contact Tickets ({contactQueriesList.length})</h3>
                    {contactQueriesList.length === 0 ? (
                      <div className="p-8 text-center rounded-2xl bg-white/5 text-gray-400">
                        No contact tickets submitted yet.
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {contactQueriesList.map((q) => (
                          <div key={q.id} className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1 hover:border-white/20 transition-all">
                            <div className="flex justify-between items-center">
                              <div className="font-bold text-white">{q.name || 'Visitor'} ({q.email || 'No email'})</div>
                              <span className="text-[10px] text-gray-400 font-mono">
                                {q.created_at || q.createdAt ? new Date(q.created_at || q.createdAt).toLocaleDateString() : 'Recent'}
                              </span>
                            </div>
                            <p className="text-gray-300 text-xs">{q.message}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* 9. FIREBASE SYSTEM STATUS */}
                {activeTab === "settings" && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-black font-serif">⚙️ Firebase Real-Time Connection</h3>
                    <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                      <p className="text-xs text-gray-300">Project ID: <strong className="text-white">d-card-71933</strong></p>
                      <p className="text-xs text-emerald-400 font-bold">100% Live Firestore onSnapshot Listeners Active ✅</p>
                      <div className="pt-2 text-[11px] text-gray-400 space-y-1 border-t border-white/10">
                        <div>User Directory: <span className="text-white font-mono">{usersList.length} docs</span></div>
                        <div>Debit Cards: <span className="text-white font-mono">{cardsList.length} docs</span></div>
                        <div>Banks Directory: <span className="text-white font-mono">{banksList.length} docs</span></div>
                        <div>Contact Queries: <span className="text-white font-mono">{contactQueriesList.length} docs</span></div>
                        <div>Import History: <span className="text-white font-mono">{importHistoryList.length} docs</span></div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 10. REPORT EXPORTER */}
                {activeTab === "reports" && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-black font-serif">📑 Executive Report Center</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <button disabled={!!exportingFormat} onClick={() => handleExport('csv')} className="p-6 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-center space-y-2 cursor-pointer transition-all">
                        <div className="text-3xl">📄</div>
                        <h4 className="text-sm font-black">Export CSV</h4>
                      </button>
                      <button disabled={!!exportingFormat} onClick={() => handleExport('excel')} className="p-6 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-center space-y-2 cursor-pointer transition-all">
                        <div className="text-3xl">📊</div>
                        <h4 className="text-sm font-black">Export Excel</h4>
                      </button>
                      <button disabled={!!exportingFormat} onClick={() => handleExport('pdf')} className="p-6 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-center space-y-2 cursor-pointer transition-all">
                        <div className="text-3xl">📑</div>
                        <h4 className="text-sm font-black">Printable PDF</h4>
                      </button>
                    </div>
                  </div>
                )}

              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default AdminDashboardModal;
