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
  CheckCircle2
} from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import DebitCardCard from '../components/DebitCardCard';

function SavedCardsPage({ setSelectedCard, toggleCompareQueue, compareQueue, userProfile, STATIC_RANKINGS }) {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNetworkFilter, setSelectedNetworkFilter] = useState('All');

  // Compute Top Summary Statistics for Saved Portfolio
  const stats = useMemo(() => {
    const totalCards = wishlist.length;
    const uniqueBanks = new Set(wishlist.map(c => String(c.bank || '').toLowerCase().trim())).size;
    const premiumCards = wishlist.filter(c => {
      const fee = typeof c.annualFee === 'number' ? c.annualFee : parseFloat(String(c.annualFee || '').replace(/[^0-9.]/g, '')) || 0;
      const cat = String(c.category || '').toLowerCase();
      return fee >= 1000 || cat.includes('premium') || cat.includes('wealth');
    }).length;

    return { totalCards, uniqueBanks, premiumCards };
  }, [wishlist]);

  // Filtered Cards based on search and network chips
  const filteredWishlist = useMemo(() => {
    return wishlist.filter(card => {
      const q = searchTerm.toLowerCase().trim();
      const matchSearch = !q || (
        String(card.bank || '').toLowerCase().includes(q) ||
        String(card.cardName || '').toLowerCase().includes(q) ||
        String(card.category || '').toLowerCase().includes(q) ||
        String(card.network || '').toLowerCase().includes(q)
      );

      const matchNetwork = selectedNetworkFilter === 'All' || String(card.network || '').toLowerCase() === selectedNetworkFilter.toLowerCase();

      return matchSearch && matchNetwork;
    });
  }, [wishlist, searchTerm, selectedNetworkFilter]);

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 relative z-20 space-y-8 text-left select-none">
      
      {/* ── 1. Page Large Header ── */}
      <div className="border-b border-[#E5E7EB] dark:border-slate-800 pb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-extrabold tracking-widest uppercase rounded-full mb-2 border border-rose-500/20">
            <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
            BOOKMARKED COLLECTION
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1F2937] dark:text-white tracking-tight flex items-center gap-3">
            ❤️ Saved Cards
          </h1>
          <p className="text-xs sm:text-sm text-[#6B7280] dark:text-slate-400 mt-1 font-normal max-w-2xl leading-relaxed">
            Your personally bookmarked debit cards.
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
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#3B82F6] hover:shadow-[0_0_18px_rgba(37,99,235,0.4)] text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
          >
            <span>Explore Cards</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* ── 2. Top Summary Statistics Grid ── */}
      {wishlist.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl glass-card-premium border border-[#E5E7EB] dark:border-slate-800 shadow-soft">
            <span className="text-[11px] font-extrabold text-[#6B7280] uppercase tracking-wider block">Total Saved</span>
            <p className="text-3xl font-extrabold text-[#1F2937] dark:text-white mt-1">{stats.totalCards}</p>
          </div>
          <div className="p-5 rounded-2xl glass-card-premium border border-[#E5E7EB] dark:border-slate-800 shadow-soft">
            <span className="text-[11px] font-extrabold text-[#6B7280] uppercase tracking-wider block">Banks Covered</span>
            <p className="text-3xl font-extrabold text-[#2563EB] dark:text-[#60A5FA] mt-1">{stats.uniqueBanks}</p>
          </div>
          <div className="p-5 rounded-2xl glass-card-premium border border-[#E5E7EB] dark:border-slate-800 shadow-soft">
            <span className="text-[11px] font-extrabold text-[#6B7280] uppercase tracking-wider block">Premium Cards</span>
            <p className="text-3xl font-extrabold text-amber-500 mt-1">{stats.premiumCards}</p>
          </div>
        </div>
      )}

      {/* ── 3. Search & Filter Bar ── */}
      {wishlist.length > 0 && (
        <div className="p-4 rounded-3xl glass-card-premium border border-[#E5E7EB] dark:border-slate-800 shadow-soft flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-[#6B7280] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search saved cards or banks..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#F8FAFC] dark:bg-slate-900 border border-[#E5E7EB] dark:border-slate-800 text-xs text-[#1F2937] dark:text-white outline-none focus:border-[#2563EB]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <span className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider mr-1">Network:</span>
            {['All', 'Visa', 'RuPay', 'Mastercard'].map(net => (
              <button
                key={net}
                onClick={() => setSelectedNetworkFilter(net)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedNetworkFilter === net
                    ? 'bg-[#2563EB] text-white shadow-xs'
                    : 'bg-[#F8FAFC] dark:bg-slate-900 text-[#6B7280] dark:text-slate-300 border border-[#E5E7EB] dark:border-slate-800 hover:border-[#2563EB]'
                }`}
              >
                {net}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── 4. Saved Cards Responsive Grid (Desktop: 4, Tablet: 2, Mobile: 1) ── */}
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
              You haven't saved any debit cards yet.
            </h2>
            <p className="text-xs text-[#6B7280] dark:text-slate-400 leading-relaxed font-normal">
              Tap the heart icon on any debit card to bookmark it here for instant access.
            </p>
          </div>

          <button
            onClick={() => navigate('/cards')}
            className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#3B82F6] hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] text-white font-bold text-xs tracking-wide uppercase shadow-md transition-all cursor-pointer inline-flex items-center gap-2 active:scale-95"
          >
            <span>Explore Cards</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      ) : filteredWishlist.length === 0 ? (
        <div className="py-12 text-center text-xs text-[#6B7280] dark:text-slate-400">
          No saved cards match your search criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <AnimatePresence>
            {filteredWishlist.map((card) => (
              <motion.div
                key={card.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
              >
                <DebitCardCard
                  card={card}
                  onViewDetails={() => setSelectedCard(card)}
                  onCompare={() => toggleCompareQueue(card)}
                  isCompared={compareQueue.some(c => String(c.id) === String(card.id))}
                  userProfile={userProfile}
                  rankings={STATIC_RANKINGS}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </main>
  );
}

export default SavedCardsPage;
