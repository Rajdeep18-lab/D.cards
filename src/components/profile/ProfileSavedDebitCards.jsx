import React from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Trash2, ChevronRight, ExternalLink, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3 },
};

function EmptyState({ navigate }) {
  return (
    <div className="py-16 text-center rounded-2xl bg-[#F8FAFC] dark:bg-slate-900/50 border border-dashed border-[#E5E7EB] dark:border-slate-700 space-y-3">
      <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto">
        <CreditCard className="w-6 h-6 text-slate-400 dark:text-slate-500" />
      </div>
      <div>
        <p className="text-sm font-bold text-[#1F2937] dark:text-white">
          No debit cards saved yet.
        </p>
        <p className="text-xs text-[#6B7280] dark:text-slate-400 mt-1 max-w-xs mx-auto">
          Browse debit cards and tap the heart icon to save them here.
        </p>
      </div>
      <button
        onClick={() => navigate('/')}
        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2563EB] text-white text-xs font-bold hover:bg-[#1D4ED8] transition-all cursor-pointer shadow-sm"
      >
        <ExternalLink className="w-3.5 h-3.5" />
        Explore Debit Cards
      </button>
    </div>
  );
}

function DebitCardItem({ item, onRemove, onViewDetails }) {
  const rating = item.rating || 0;

  return (
    <div className="p-5 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4">
      {/* Header */}
      <div>
        <div className="flex items-start justify-between gap-2 mb-3">
          <span className="px-2.5 py-0.5 rounded-full text-[9.5px] font-extrabold uppercase tracking-wider bg-[#2563EB]/10 text-[#2563EB] dark:text-[#60A5FA] border border-[#2563EB]/20">
            💳 Debit Card
          </span>
          <button
            onClick={() => onRemove(item.id)}
            className="text-slate-400 hover:text-rose-500 transition-colors p-1 cursor-pointer rounded-lg hover:bg-rose-50 dark:hover:bg-rose-500/10"
            title="Remove from saved"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-1">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            {item.bank || item.bankName}
          </p>
          <h4 className="text-sm font-extrabold text-[#1F2937] dark:text-white leading-snug">
            {item.cardName}
          </h4>
          {rating > 0 && (
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
              <span className="text-[10.5px] font-bold text-[#6B7280] dark:text-slate-400">
                {rating.toFixed(1)}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Specs */}
      <div className="grid grid-cols-2 gap-2 pt-3 border-t border-[#F3F4F6] dark:border-slate-800 text-[11px]">
        <div>
          <span className="text-[9.5px] font-bold text-slate-400 block uppercase tracking-wide">Annual Fee</span>
          <strong className="text-[#1F2937] dark:text-slate-200 font-extrabold">
            {item.annualFee === 0 || item.annualFee === '0' ? 'Free' : item.annualFee || 'Free'}
          </strong>
        </div>
        <div>
          <span className="text-[9.5px] font-bold text-slate-400 block uppercase tracking-wide">Lounge Access</span>
          <strong className={`font-extrabold ${
            String(item.loungeAccess || 'No').toLowerCase().startsWith('no')
              ? 'text-slate-500 dark:text-slate-500'
              : 'text-cyan-600 dark:text-cyan-400'
          }`}>
            {item.loungeAccess || 'No'}
          </strong>
        </div>
        {item.network && (
          <div className="col-span-2">
            <span className="text-[9.5px] font-bold text-slate-400 block uppercase tracking-wide">Network</span>
            <strong className="text-[#1F2937] dark:text-slate-200 font-extrabold">
              {item.network}
            </strong>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="pt-3 border-t border-[#F3F4F6] dark:border-slate-800">
        <button
          onClick={() => onViewDetails(item)}
          className="flex items-center gap-1 text-xs font-bold text-[#2563EB] dark:text-[#60A5FA] hover:underline cursor-pointer"
        >
          View Details
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

/**
 * ProfileSavedDebitCards — shows saved debit cards with remove and view details.
 */
export default function ProfileSavedDebitCards({ savedDebitCards, onRemove, onViewDetails }) {
  const navigate = useNavigate();

  return (
    <motion.div {...fadeUp} className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-[#1F2937] dark:text-white">Saved Debit Cards</h2>
          <p className="text-xs text-[#6B7280] dark:text-slate-400 mt-0.5">
            {savedDebitCards.length} card{savedDebitCards.length !== 1 ? 's' : ''} in your wishlist.
          </p>
        </div>
        {savedDebitCards.length > 0 && (
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#E5E7EB] dark:border-slate-700 text-xs font-bold text-[#374151] dark:text-slate-300 hover:border-[#2563EB]/40 hover:text-[#2563EB] transition-all cursor-pointer shrink-0"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Explore More
          </button>
        )}
      </div>

      {savedDebitCards.length === 0 ? (
        <EmptyState navigate={navigate} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {savedDebitCards.map((item) => (
            <DebitCardItem
              key={item.id}
              item={item}
              onRemove={onRemove}
              onViewDetails={onViewDetails}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}
