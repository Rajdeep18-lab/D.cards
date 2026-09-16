import { useRef } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star, Heart, ArrowLeft, ArrowRight, ShieldCheck } from 'lucide-react';
import { debitCards } from '../data/mockData';
import { useWishlist } from '../context/WishlistContext';
import BankLogo from './BankLogo';
import { useAuth } from '../hooks/useAuth';

const RANK_STYLES = [
  { bg: 'linear-gradient(135deg,#FFD700,#FFA500)', shadow: 'rgba(255,185,0,0.5)', textColor: '#7a5500', label: 'Gold Pick' },
  { bg: 'linear-gradient(135deg,#C0C0C0,#9E9E9E)', shadow: 'rgba(180,180,180,0.45)', textColor: '#444', label: 'Silver Pick' },
  { bg: 'linear-gradient(135deg,#CD7F32,#A0522D)', shadow: 'rgba(180,100,30,0.45)', textColor: '#6b3a1f', label: 'Bronze Pick' },
];

function RatingBar({ value }) {
  const pct = (value / 5) * 100;
  return (
    <div className="flex items-center gap-1.5 mt-1.5">
      <div className="flex-1 h-1 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
        <motion.div
          initial={{ width: 0 }} 
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.9, ease: 'easeOut', delay: 0.15 }}
          className="h-full rounded-full bg-gradient-to-r from-[#2563EB] to-[#60A5FA]"
        />
      </div>
      <span className="text-[10px] font-semibold text-[#2563EB] dark:text-[#60A5FA]">{value}★</span>
    </div>
  );
}

function TopCardItem({ card, index, onViewDetails }) {
  const { toggleWishlist, isWishlisted } = useWishlist();
  const { user, openAuthModal } = useAuth();
  
  const fullCard = debitCards.find(c => c.id === card.id) || card;
  const wishlisted = isWishlisted(fullCard.id);
  const isTop3 = index < 3;
  const rs = RANK_STYLES[index] || RANK_STYLES[2];

  const cardName = fullCard.cardName || fullCard.name || "Debit Card";
  const bankName = fullCard.bank || "Listed Bank";
  const ratingVal = fullCard.rating || 4.5;
  const feeText = typeof fullCard.annualFee === 'number' 
    ? (fullCard.annualFee === 0 ? 'FREE' : `₹${fullCard.annualFee}`) 
    : (fullCard.fee || 'FREE');
  const cashbackText = fullCard.cashbackPct ? `${fullCard.cashbackPct}%` : 'Rewards';
  const benefitHighlight = String(fullCard.benefits || "Premium bank perks & rewards").split(',')[0];

  const handleWishlist = (e) => {
    e.stopPropagation();
    if (!user) {
      openAuthModal('required', `save-card-${fullCard.id}`);
      return;
    }
    toggleWishlist(fullCard);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.055, type: 'spring', stiffness: 230, damping: 22 }}
      whileHover={{ y: -6 }}
      onClick={() => onViewDetails && onViewDetails(fullCard)}
      className={`min-w-[270px] sm:min-w-[290px] flex-shrink-0 relative rounded-3xl p-5 cursor-pointer bg-white dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-slate-700 shadow-soft hover:shadow-cardHover transition-all flex flex-col justify-between text-left snap-start ${
        isTop3 ? 'border-[#2563EB]/40 dark:border-[#60A5FA]/40' : ''
      }`}
    >
      {/* Top rank badge */}
      <div className="flex items-center justify-between mb-3">
        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-semibold tracking-wider uppercase border shadow-sm ${
          isTop3 
            ? 'bg-[#EFF6FF] text-[#2563EB] border-[#2563EB]/20 dark:bg-slate-800 dark:text-[#60A5FA]' 
            : 'bg-slate-100 text-[#6B7280] border-slate-200 dark:bg-slate-800 dark:text-slate-400'
        }`}>
          <Trophy className="w-3 h-3 text-[#2563EB] dark:text-[#60A5FA]" />
          <span>#{index + 1} {isTop3 ? rs.label : 'Ranked'}</span>
        </span>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          title={wishlisted ? 'Saved in Favorites' : 'Add to Favorites'}
          className={`p-1.5 rounded-full border transition-all cursor-pointer ${
            wishlisted 
              ? 'bg-[#EFF6FF] border-[#2563EB]/30 text-[#2563EB]' 
              : 'bg-slate-50 dark:bg-slate-800 border-[#E5E7EB] dark:border-slate-700 text-[#6B7280] hover:text-[#2563EB]'
          }`}
        >
          <Heart className={`w-4 h-4 ${wishlisted ? 'fill-[#2563EB] text-[#2563EB]' : ''}`} />
        </button>
      </div>

      {/* Bank name & Card title */}
      <div>
        <div className="flex items-center gap-1.5 mb-1">
          <BankLogo bankName={bankName} size="xs" />
          <span className="text-[10px] font-semibold tracking-wider uppercase text-[#6B7280] dark:text-slate-400 block truncate">
            {bankName}
          </span>
        </div>
        <h3 className="text-sm sm:text-base font-bold text-[#1F2937] dark:text-white leading-tight mt-0.5">
          {cardName}
        </h3>
      </div>

      <RatingBar value={ratingVal} />

      {/* Key metric highlights */}
      <div className="grid grid-cols-2 gap-2 my-3 p-2.5 rounded-xl bg-[#F8FAFC] dark:bg-slate-900 border border-[#E5E7EB] dark:border-slate-800">
        <div>
          <span className="text-[9px] font-semibold text-[#6B7280] dark:text-slate-400 uppercase block">Annual Fee</span>
          <span className="text-xs font-bold text-[#1F2937] dark:text-white mt-0.5 block">{feeText}</span>
        </div>
        <div>
          <span className="text-[9px] font-semibold text-[#6B7280] dark:text-slate-400 uppercase block">Rewards</span>
          <span className="text-xs font-bold text-[#2563EB] dark:text-[#60A5FA] mt-0.5 block">{cashbackText}</span>
        </div>
      </div>

      {/* Benefit highlight tag */}
      <p className="text-xs text-[#6B7280] dark:text-slate-400 leading-relaxed font-normal flex-1 line-clamp-2 mb-3">
        🎁 {benefitHighlight}
      </p>

      {/* Footer link */}
      <div className="pt-2.5 border-t border-[#E5E7EB] dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-[#2563EB] dark:text-[#60A5FA]">
        <span>View Specs & Limits</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </div>
    </motion.div>
  );
}

export default function TopCardsSection({ onViewDetails }) {
  const scrollRef = useRef(null);

  return (
    <section className="my-10 text-left select-none">
      <div className="flex items-center justify-between mb-4 border-b border-[#E5E7EB] dark:border-slate-800 pb-3">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#2563EB]/10 text-[#2563EB] dark:text-[#60A5FA] text-xs font-semibold tracking-widest uppercase rounded-full mb-1">
            <Star className="w-3.5 h-3.5" />
            EDITORS' CHOICE
          </span>
          <h2 className="text-2xl font-bold text-[#1F2937] dark:text-white">
            Highest Ranked Debit Cards
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => scrollRef.current?.scrollBy({ left: -300, behavior: 'smooth' })}
            className="w-9 h-9 rounded-xl border border-[#E5E7EB] dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center justify-center text-[#1F2937] dark:text-white hover:border-[#2563EB] transition-colors cursor-pointer shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scrollRef.current?.scrollBy({ left: 300, behavior: 'smooth' })}
            className="w-9 h-9 rounded-xl border border-[#E5E7EB] dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center justify-center text-[#1F2937] dark:text-white hover:border-[#2563EB] transition-colors cursor-pointer shadow-sm"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto py-2 custom-scrollbar snap-x snap-mandatory"
      >
        {(debitCards || []).slice(0, 6).map((card, idx) => (
          <TopCardItem key={card.id} card={card} index={idx} onViewDetails={onViewDetails} />
        ))}
      </div>
    </section>
  );
}
