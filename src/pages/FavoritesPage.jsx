import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Heart, ArrowRight, Sparkles } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import DebitCardCard from '../components/DebitCardCard';

function FavoritesPage({ setSelectedCard, toggleCompareQueue, compareQueue, userProfile, STATIC_RANKINGS }) {
  const { wishlist } = useWishlist();
  const navigate = useNavigate();

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 relative z-20 space-y-8 text-left">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#E5E7EB] dark:border-slate-800 pb-6">
        <div>
          <span className="text-xs font-semibold text-[#2563EB] dark:text-[#60A5FA] tracking-widest uppercase block mb-1">
            SAVED WISHLIST PORTAL
          </span>
          <h1 className="text-3xl font-bold text-[#1F2937] dark:text-white flex items-center gap-3">
            <Heart className="w-7 h-7 text-[#2563EB] fill-[#2563EB]" />
            <span>Saved Favorites ({wishlist.length})</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#6B7280] dark:text-slate-400 mt-1 font-normal">
            Your personal collection of saved debit cards for quick access and comparison
          </p>
        </div>

        {wishlist.length > 0 && (
          <button
            onClick={() => navigate('/cards')}
            className="px-5 py-2.5 rounded-xl bg-[#EFF6FF] dark:bg-slate-800 hover:bg-[#2563EB] hover:text-white text-[#2563EB] dark:text-[#60A5FA] font-semibold text-xs border border-[#2563EB]/20 transition-all cursor-pointer flex items-center gap-1.5"
          >
            <span>Explore More Cards</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Grid or Empty State */}
      {wishlist.length === 0 ? (
        <div className="py-16 px-6 text-center max-w-md mx-auto space-y-5 bg-white dark:bg-[#1E293B] rounded-3xl border border-[#E5E7EB] dark:border-slate-800 shadow-soft">
          <div className="w-16 h-16 rounded-full bg-[#EFF6FF] text-[#2563EB] border border-[#2563EB]/20 flex items-center justify-center text-3xl mx-auto shadow-sm">
            <Heart className="w-8 h-8 text-[#2563EB]" />
          </div>
          <h2 className="text-xl font-bold text-[#1F2937] dark:text-white">
            No Saved Cards Yet
          </h2>
          <p className="text-xs sm:text-sm text-[#6B7280] dark:text-slate-400 leading-relaxed font-normal">
            Click the heart icon on any debit card while browsing to save it to your personal wishlist.
          </p>
          <button
            onClick={() => navigate('/cards')}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#3B82F6] hover:opacity-95 text-white font-semibold text-xs tracking-wide uppercase shadow-md transition-all cursor-pointer inline-flex items-center gap-2"
          >
            <span>Browse Debit Cards</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {wishlist.map((card) => (
            <DebitCardCard
              key={card.id}
              card={card}
              onViewDetails={() => setSelectedCard(card)}
              onCompare={() => toggleCompareQueue(card)}
              isCompared={compareQueue.some(c => String(c.id) === String(card.id))}
              userProfile={userProfile}
              rankings={STATIC_RANKINGS}
            />
          ))}
        </div>
      )}
    </main>
  );
}

export default FavoritesPage;
