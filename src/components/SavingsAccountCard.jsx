import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Scale, CheckCircle2, CreditCard, ChevronRight, AlertCircle } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { getAssociatedDebitCards, getDebitCardRelationshipStatus } from '../data/mockSavingsAccounts';

function SavingsAccountCard({ account, onViewDetails, onToggleCompare, isCompared, onSelectDebitCard }) {
  const { isWishlisted, toggleWishlist } = useWishlist();
  const accountId = account.id || account.product_id;
  const wishlisted = isWishlisted(accountId);

  const associatedCards = getAssociatedDebitCards(account);
  const primaryCard = associatedCards.length > 0 ? associatedCards[0] : null;

  const bankName = account.bank_name || account.bank || "Partner Bank";
  const accountName = account.variant_name || account.accountName || "Savings Account";
  const interestRate = account.interest_rate || account.interestRate || "N/A";
  const minimumBalance = account.minimum_balance || account.minimumBalance || "N/A";
  const keyBenefits = account.benefits || account.keyBenefits || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25 }}
      className="rounded-3xl bg-white dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-slate-800 shadow-soft hover:shadow-xl hover:border-[#2563EB]/40 transition-all duration-300 flex flex-col justify-between overflow-hidden text-left relative group"
    >
      {/* Top Bar with Bank & Wishlist */}
      <div className="p-5 sm:p-6 pb-4 border-b border-slate-100 dark:border-slate-800/80">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            {/* Bank Logo Avatar */}
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#0B3D91] to-[#2563EB] text-white flex items-center justify-center font-extrabold text-sm shadow-md shadow-[#2563EB]/20 flex-shrink-0">
              {account.logo || bankName.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#6B7280] dark:text-slate-400 block">
                {bankName}
              </span>
              <Link to={`/savings-accounts/${accountId}`} className="text-base sm:text-lg font-extrabold text-[#1F2937] dark:text-white tracking-tight leading-snug group-hover:text-[#2563EB] dark:group-hover:text-[#60A5FA] transition-colors hover:underline">
                {accountName}
              </Link>
            </div>
          </div>

          {/* Wishlist Toggle */}
          <button
            onClick={() => toggleWishlist(account)}
            aria-label="Save to Favourites"
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer border flex-shrink-0 ${
              wishlisted
                ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-500 shadow-xs scale-105'
                : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-400 hover:text-rose-500 hover:bg-rose-50/50'
            }`}
          >
            <Heart className={`w-4 h-4 ${wishlisted ? 'fill-rose-500' : ''}`} />
          </button>
        </div>

        {/* Badges Flow */}
        <div className="flex flex-wrap gap-1.5 mt-2">
          {account.accountTypeBadges && account.accountTypeBadges.map((badge, idx) => (
            <span
              key={idx}
              className="px-2.5 py-0.5 rounded-full text-[10.5px] font-extrabold bg-[#2563EB]/10 text-[#2563EB] dark:text-[#60A5FA] border border-[#2563EB]/20"
            >
              {badge}
            </span>
          ))}

          {account.isZeroBalance && (
            <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-extrabold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>Zero Balance</span>
            </span>
          )}
        </div>
      </div>

      {/* Main Stats Grid: Interest Rate & Min Balance */}
      <div className="p-5 sm:p-6 py-4 grid grid-cols-2 gap-3 bg-[#F8FAFC]/60 dark:bg-slate-900/40 border-b border-slate-100 dark:border-slate-800/80">
        <div className="p-3 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 shadow-xs text-left">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-0.5">
            Interest Rate
          </span>
          <span className="text-base sm:text-lg font-black text-emerald-600 dark:text-emerald-400 tracking-tight">
            {interestRate}
          </span>
        </div>

        <div className="p-3 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 shadow-xs text-left">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-0.5">
            Min. Balance
          </span>
          <span className="text-base sm:text-lg font-black text-[#1F2937] dark:text-white tracking-tight">
            {minimumBalance}
          </span>
        </div>
      </div>

      {/* Key Benefits List */}
      <div className="p-5 sm:p-6 py-4 flex-1 space-y-2.5">
        <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-slate-400 block text-left">
          Key Account Features:
        </span>
        <ul className="space-y-2 text-xs text-[#1F2937] dark:text-slate-200 font-medium">
          {keyBenefits && keyBenefits.slice(0, 3).map((benefit, i) => (
            <li key={i} className="flex items-start gap-2 text-left">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#2563EB] shrink-0 mt-0.5" />
              <span className="leading-snug">{benefit}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Associated Debit Card Connection Box */}
      <div className="px-5 sm:px-6 py-3 bg-[#EFF6FF]/60 dark:bg-slate-800/50 border-t border-b border-[#2563EB]/15 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-left min-w-0">
          <div className="w-7 h-7 rounded-xl bg-[#2563EB] text-white flex items-center justify-center shrink-0 shadow-xs">
            <CreditCard className="w-3.5 h-3.5" />
          </div>
          <div className="min-w-0">
            <span className="text-[9.5px] font-extrabold uppercase tracking-wider text-[#2563EB] dark:text-[#60A5FA] block leading-none">
              {associatedCards.length > 1 ? `Provided Debit Cards (${associatedCards.length}):` : 'Provided Debit Card:'}
            </span>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate block mt-0.5">
              {primaryCard ? (primaryCard.name || primaryCard.card_name || primaryCard.cardName) : (getDebitCardRelationshipStatus(account).message || 'Debit card information not available for this account.')}
            </span>
          </div>
        </div>

        {primaryCard && onSelectDebitCard && (
          <button
            onClick={(e) => { e.stopPropagation(); onSelectDebitCard(primaryCard); }}
            className="text-[10.5px] font-extrabold text-[#2563EB] dark:text-[#60A5FA] hover:underline flex items-center gap-1 shrink-0 cursor-pointer"
          >
            <span>Card Info</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Action Buttons */}
      <div className="p-4 sm:p-5 pt-4 flex items-center gap-2">
        <button
          onClick={() => onToggleCompare && onToggleCompare(account)}
          className={`px-3 py-2.5 rounded-xl text-xs font-bold transition-all border cursor-pointer flex items-center gap-1.5 flex-shrink-0 ${
            isCompared
              ? 'bg-[#2563EB] text-white border-[#2563EB] shadow-xs'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-200/80'
          }`}
        >
          <Scale className="w-3.5 h-3.5" />
          <span>{isCompared ? 'Queued' : 'Compare'}</span>
        </button>

        <Link
          to={`/savings-accounts/${accountId}`}
          onClick={(e) => {
            if (onViewDetails) {
              e.preventDefault();
              onViewDetails(account);
            }
          }}
          className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#3B82F6] hover:shadow-lg hover:shadow-[#2563EB]/25 text-white font-extrabold text-xs transition-all shadow cursor-pointer active:scale-95 text-center flex items-center justify-center gap-1.5"
        >
          <span>View Details</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </motion.div>
  );
}

export default SavingsAccountCard;
