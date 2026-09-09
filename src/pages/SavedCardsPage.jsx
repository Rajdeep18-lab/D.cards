import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Heart, 
  Search, 
  Trash2, 
  ArrowRight, 
  ShieldCheck, 
  CreditCard, 
  Building2, 
  Sparkles, 
  Filter, 
  Plane, 
  Gift, 
  Star,
  CheckCircle2,
  Briefcase
} from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import DebitCardCard from '../components/DebitCardCard';
import SavingsAccountCard from '../components/SavingsAccountCard';
import CurrentAccountCard from '../components/CurrentAccountCard';

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

function SavedCardsPage({ setSelectedCard, toggleCompareQueue, compareQueue, userProfile, STATIC_RANKINGS }) {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProductType, setSelectedProductType] = useState('All');
  const [selectedNetworkFilter, setSelectedNetworkFilter] = useState('All');

  // Compute Top Summary Statistics for Saved Portfolio
  const stats = useMemo(() => {
    const totalItems = wishlist.length;
    const debitCardsCount = wishlist.filter(isDebitCardItem).length;
    const savingsAccountsCount = wishlist.filter(isSavingsAccountItem).length;
    const currentAccountsCount = wishlist.filter(isCurrentAccountItem).length;
    const uniqueBanks = new Set(wishlist.map(c => String(c.bank || c.bankName || '').toLowerCase().trim())).size;

    return { totalItems, debitCardsCount, savingsAccountsCount, currentAccountsCount, uniqueBanks };
  }, [wishlist]);

  // Filtered Items based on search, product type, and network chips
  const filteredWishlist = useMemo(() => {
    return wishlist.filter(item => {
      if (selectedProductType === 'Debit Cards' && !isDebitCardItem(item)) return false;
      if (selectedProductType === 'Savings Accounts' && !isSavingsAccountItem(item)) return false;
      if (selectedProductType === 'Current Accounts' && !isCurrentAccountItem(item)) return false;

      const q = searchTerm.toLowerCase().trim();
      const matchSearch = !q || (
        String(item.bank || item.bankName || '').toLowerCase().includes(q) ||
        String(item.cardName || '').toLowerCase().includes(q) ||
        String(item.accountName || '').toLowerCase().includes(q) ||
        String(item.category || '').toLowerCase().includes(q) ||
        String(item.accountType || '').toLowerCase().includes(q) ||
        String(item.network || '').toLowerCase().includes(q)
      );

      const matchNetwork = selectedNetworkFilter === 'All' || String(item.network || '').toLowerCase() === selectedNetworkFilter.toLowerCase();

      return matchSearch && matchNetwork;
    });
  }, [wishlist, searchTerm, selectedProductType, selectedNetworkFilter]);

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 relative z-20 space-y-8 text-left select-none">
      
      {/* ── 1. Page Header ── */}
      <div className="border-b border-[#E5E7EB] dark:border-slate-800 pb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-extrabold tracking-widest uppercase rounded-full mb-2 border border-rose-500/20">
            <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
            BOOKMARKED COLLECTION
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1F2937] dark:text-white tracking-tight flex items-center gap-3">
            ❤️ Saved Products
          </h1>
          <p className="text-xs sm:text-sm text-[#6B7280] dark:text-slate-400 mt-1 font-normal max-w-2xl leading-relaxed">
            Keep your preferred banking products in one place.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {wishlist.length > 0 && (
            <button
              onClick={() => clearWishlist()}
              className="px-4 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 font-bold text-xs border border-red-500/20 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All</span>
            </button>
          )}

          <Link
            to="/cards"
            className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs hover:bg-slate-200 transition-all"
          >
            Explore Cards
          </Link>
        </div>
      </div>

      {/* ── 2. Top Summary Statistics Bar ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-slate-800 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center flex-shrink-0">
            <Heart className="w-5 h-5 fill-rose-500" />
          </div>
          <div>
            <span className="text-lg font-black text-[#1F2937] dark:text-white leading-none block">
              {stats.totalItems}
            </span>
            <span className="text-[10.5px] font-bold text-[#6B7280] dark:text-slate-400 uppercase tracking-wider">
              Total Saved
            </span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-slate-800 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#2563EB]/10 text-[#2563EB] dark:text-[#60A5FA] flex items-center justify-center flex-shrink-0">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <span className="text-lg font-black text-[#1F2937] dark:text-white leading-none block">
              {stats.debitCardsCount}
            </span>
            <span className="text-[10.5px] font-bold text-[#6B7280] dark:text-slate-400 uppercase tracking-wider">
              Debit Cards
            </span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-slate-800 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-lg font-black text-[#1F2937] dark:text-white leading-none block">
              {stats.savingsAccountsCount}
            </span>
            <span className="text-[10.5px] font-bold text-[#6B7280] dark:text-slate-400 uppercase tracking-wider">
              Savings Accounts
            </span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-slate-800 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <span className="text-lg font-black text-[#1F2937] dark:text-white leading-none block">
              {stats.currentAccountsCount}
            </span>
            <span className="text-[10.5px] font-bold text-[#6B7280] dark:text-slate-400 uppercase tracking-wider">
              Current Accounts
            </span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-slate-800 shadow-xs flex items-center gap-3 col-span-2 sm:col-span-1">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-lg font-black text-[#1F2937] dark:text-white leading-none block">
              {stats.uniqueBanks}
            </span>
            <span className="text-[10.5px] font-bold text-[#6B7280] dark:text-slate-400 uppercase tracking-wider">
              Banks Covered
            </span>
          </div>
        </div>
      </div>

      {/* ── 3. Filters & Search Bar ── */}
      {wishlist.length > 0 && (
        <div className="p-4 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-slate-800 shadow-soft flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-[#6B7280] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search saved cards or accounts..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#F8FAFC] dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs outline-none focus:border-[#2563EB] font-medium text-[#1F2937] dark:text-white"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs font-bold w-full md:w-auto">
            {['All', 'Debit Cards', 'Savings Accounts', 'Current Accounts'].map(pt => (
              <button
                key={pt}
                onClick={() => setSelectedProductType(pt)}
                className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
                  selectedProductType === pt
                    ? 'bg-[#2563EB] text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-900 text-[#6B7280] hover:text-[#1F2937] dark:hover:text-white'
                }`}
              >
                {pt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── 4. Saved Portfolio Responsive Grid ── */}
      {wishlist.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="py-16 px-6 text-center max-w-md mx-auto space-y-6 glass-card-premium rounded-3xl border border-[#E5E7EB] dark:border-slate-800 shadow-soft"
        >
          <div className="w-20 h-20 rounded-full bg-rose-500/10 text-rose-500 border border-rose-500/20 flex items-center justify-center text-4xl mx-auto shadow-sm">
            <Heart className="w-10 h-10 text-rose-500 fill-rose-500/20" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-extrabold text-[#1F2937] dark:text-white">
              You haven't saved any products yet.
            </h2>
            <p className="text-xs text-[#6B7280] dark:text-slate-400 leading-relaxed font-normal">
              Tap the heart icon to save a banking product.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => navigate('/cards')}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#3B82F6] text-white font-bold text-xs uppercase shadow-md transition-all cursor-pointer"
            >
              Debit Cards
            </button>
            <button
              onClick={() => navigate('/savings-accounts')}
              className="px-5 py-3 rounded-xl bg-emerald-600 text-white font-bold text-xs uppercase shadow-md transition-all cursor-pointer"
            >
              Savings Accounts
            </button>
            <button
              onClick={() => navigate('/current-accounts')}
              className="px-5 py-3 rounded-xl bg-amber-600 text-white font-bold text-xs uppercase shadow-md transition-all cursor-pointer"
            >
              Current Accounts
            </button>
          </div>
        </motion.div>
      ) : filteredWishlist.length === 0 ? (
        <div className="py-12 text-center text-xs text-[#6B7280] dark:text-slate-400">
          No saved products match your search criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredWishlist.map((item) => {
              const isCurrent = isCurrentAccountItem(item);
              const isSavings = isSavingsAccountItem(item);

              return (
                <motion.div
                  key={item.id || item.product_id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25 }}
                >
                  {isCurrent ? (
                    <CurrentAccountCard
                      account={item}
                      onViewDetails={() => navigate(`/current-accounts/${item.id || item.product_id}`)}
                      onToggleCompare={() => {}}
                      isCompared={false}
                      onSelectDebitCard={setSelectedCard}
                    />
                  ) : isSavings ? (
                    <SavingsAccountCard
                      account={item}
                      onViewDetails={() => navigate(`/savings-accounts/${item.id || item.product_id}`)}
                      onToggleCompare={() => {}}
                      isCompared={false}
                      onSelectDebitCard={setSelectedCard}
                    />
                  ) : (
                    <DebitCardCard
                      card={item}
                      onViewDetails={() => setSelectedCard(item)}
                      onCompare={() => toggleCompareQueue(item)}
                      isCompared={compareQueue.some(c => String(c.id) === String(item.id))}
                      userProfile={userProfile}
                      rankings={STATIC_RANKINGS}
                    />
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </main>
  );
}

export default SavedCardsPage;
