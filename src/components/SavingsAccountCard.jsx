import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Scale, CheckCircle2, CreditCard, ChevronRight, ShieldCheck } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { getAssociatedDebitCards, getDebitCardRelationshipStatus } from '../data/mockSavingsAccounts';
import BankLogo from './BankLogo';
import { 
  formatInterestRate, 
  formatMinimumBalance, 
  formatBenefits, 
  formatSourceAndVerification,
  formatDebitCardRelationship
} from '../utils/bankingDataFormatter';

function SavingsAccountCard({ account, onViewDetails, onToggleCompare, isCompared, onSelectDebitCard }) {
  const { isWishlisted, toggleWishlist } = useWishlist();
  if (!account) return null;

  const accountId = account.id || account.product_id;
  const wishlisted = isWishlisted(accountId);

  const associatedCards = getAssociatedDebitCards(account);
  const debitRel = formatDebitCardRelationship(account, associatedCards, false);

  const bankName = account.bank_name || account.bank || "Partner Bank";
  const accountName = account.variant_name || account.accountName || account.account_name || "Savings Account";

  // Clean data through presentation layer
  const formattedRate = formatInterestRate(account.interest_rate || account.interestRate, account);
  const formattedBalance = formatMinimumBalance(account.minimum_balance || account.minimumBalance, account);
  const highlights = formatBenefits(account.benefits || account.keyBenefits, 4);
  const sourceInfo = formatSourceAndVerification(account);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25 }}
      className="h-full rounded-3xl bg-white dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-slate-800 shadow-soft hover:shadow-xl hover:border-[#2563EB]/40 transition-all duration-300 flex flex-col justify-between overflow-hidden text-left relative group min-w-0"
    >
      {/* Top Bar with Bank & Wishlist */}
      <div className="p-5 sm:p-6 pb-4 border-b border-slate-100 dark:border-slate-800/80">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-center gap-3 min-w-0">
            {/* Official Bank Logo */}
            <BankLogo bankName={bankName} size="md" />
            <div className="min-w-0">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#6B7280] dark:text-slate-400 block truncate">
                {bankName}
              </span>
              <Link
                to={`/savings-accounts/${accountId}`}
                className="text-base sm:text-lg font-extrabold text-[#1F2937] dark:text-white tracking-tight leading-snug group-hover:text-[#2563EB] dark:group-hover:text-[#60A5FA] transition-colors hover:underline line-clamp-1"
                title={accountName}
              >
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
        <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
          <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-extrabold bg-[#2563EB]/10 text-[#2563EB] dark:text-[#60A5FA] border border-[#2563EB]/20">
            {account.accountType || "Regular Savings"}
          </span>

          {account.isOnlineOpening && (
            <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-extrabold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
              Instant Video KYC
            </span>
          )}

          {formattedBalance.isZero && (
            <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-extrabold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>Zero Balance</span>
            </span>
          )}
        </div>
      </div>

      {/* Main Stats Grid: Max Interest Rate & Min Balance */}
      <div className="p-4 sm:p-5 py-4 grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#F8FAFC]/60 dark:bg-slate-900/40 border-b border-slate-100 dark:border-slate-800/80 items-stretch">
        {/* MAX INTEREST RATE */}
        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 shadow-xs text-left min-h-[110px] flex flex-col justify-between overflow-hidden">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-0.5">
              MAX INTEREST RATE
            </span>
            <span className="text-base sm:text-lg font-black text-emerald-600 dark:text-emerald-400 tracking-tight block">
              {formattedRate.display}
            </span>
          </div>

          {formattedRate.rateDetails && formattedRate.rateDetails.length > 0 ? (
            <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-700/60 space-y-1">
              <span className="text-[9.5px] font-bold text-slate-500 dark:text-slate-400 block uppercase tracking-wider">
                Rate Details:
              </span>
              <ul className="space-y-0.5 text-[10.5px] text-slate-600 dark:text-slate-300 font-medium">
                {formattedRate.rateDetails.slice(0, 3).map((detail, idx) => (
                  <li key={idx} className="flex items-start gap-1 leading-tight truncate">
                    <span className="text-[#2563EB] dark:text-[#60A5FA] shrink-0">•</span>
                    <span className="truncate" title={detail}>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : formattedRate.subtext ? (
            <span className="text-[10.5px] text-slate-500 dark:text-slate-400 font-medium leading-tight block mt-1 line-clamp-1" title={formattedRate.subtext}>
              {formattedRate.subtext}
            </span>
          ) : null}
        </div>

        {/* MIN. BALANCE */}
        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 shadow-xs text-left min-h-[110px] flex flex-col justify-between overflow-hidden">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-0.5">
              MIN. BALANCE
            </span>
            {!formattedBalance.hasLocationBreakdown && (
              <span className="text-base sm:text-lg font-black text-[#1F2937] dark:text-white tracking-tight block">
                {formattedBalance.display}
              </span>
            )}
          </div>

          {formattedBalance.breakdown && formattedBalance.breakdown.length > 0 ? (
            <div className="space-y-1 pt-1">
              {formattedBalance.breakdown.map((tier, idx) => (
                <div key={idx} className="flex items-center justify-between text-[11px] leading-tight gap-2">
                  <span className="text-slate-500 dark:text-slate-400 font-medium truncate">{tier.label}</span>
                  <span className="font-black text-slate-800 dark:text-slate-100 shrink-0">{tier.amount}</span>
                </div>
              ))}
            </div>
          ) : formattedBalance.subtext ? (
            <span className="text-[10.5px] text-slate-500 dark:text-slate-400 font-medium leading-tight block mt-1 line-clamp-1" title={formattedBalance.subtext}>
              {formattedBalance.subtext}
            </span>
          ) : null}
        </div>
      </div>

      {/* Key Highlights List */}
      <div className="p-5 sm:p-6 py-4 flex-1 space-y-2.5">
        <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 block text-left">
          KEY ACCOUNT HIGHLIGHTS
        </span>
        <ul className="space-y-2 text-xs text-[#1F2937] dark:text-slate-200 font-medium">
          {highlights.map((highlight, i) => (
            <li key={i} className="flex items-start gap-2 text-left">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#2563EB] dark:text-[#60A5FA] shrink-0 mt-0.5" />
              <span className="leading-snug line-clamp-2">{highlight}</span>
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
            <span className="text-[9px] font-extrabold uppercase tracking-wider text-[#2563EB] dark:text-[#60A5FA] block leading-none truncate">
              {debitRel.label}:
            </span>
            <span className={`text-xs truncate block mt-0.5 ${debitRel.isLinked ? 'font-bold text-slate-800 dark:text-slate-100' : 'font-medium text-slate-500 dark:text-slate-400'}`}>
              {debitRel.statusText}
            </span>
          </div>
        </div>

        {debitRel.isLinked && debitRel.primaryCard && onSelectDebitCard && (
          <button
            onClick={(e) => { e.stopPropagation(); onSelectDebitCard(debitRel.primaryCard); }}
            className="text-[10.5px] font-extrabold text-[#2563EB] dark:text-[#60A5FA] hover:underline flex items-center gap-0.5 shrink-0 cursor-pointer"
          >
            <span>Card Info</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Small Source / Verification Footer Bar */}
      <div className="px-5 sm:px-6 py-2 bg-slate-50/80 dark:bg-slate-900/60 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500 gap-2">
        <div className="flex items-center gap-1.5 truncate">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
          <span className="truncate">Verified: <strong className="text-slate-600 dark:text-slate-300 font-semibold">{sourceInfo.verifiedDateFormatted}</strong></span>
        </div>
        {sourceInfo.sourceUrl ? (
          <a
            href={sourceInfo.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="text-[#2563EB] dark:text-[#60A5FA] hover:underline font-bold inline-flex items-center gap-0.5 shrink-0"
            title="Open official bank source"
          >
            <span>Official Source ↗</span>
          </a>
        ) : (
          <span className="font-medium text-slate-400 shrink-0">Official Source</span>
        )}
      </div>

      {/* Action Buttons */}
      <div className="p-4 sm:p-5 pt-3 flex items-center gap-2">
        <button
          onClick={() => onToggleCompare && onToggleCompare(account)}
          className={`px-3 py-2.5 rounded-xl text-xs font-bold transition-all border cursor-pointer flex items-center justify-center gap-1.5 flex-shrink-0 min-h-[42px] ${
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
          className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#3B82F6] hover:shadow-lg hover:shadow-[#2563EB]/25 text-white font-extrabold text-xs transition-all shadow cursor-pointer active:scale-95 text-center flex items-center justify-center gap-1.5 min-h-[42px]"
        >
          <span>View Details</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </motion.div>
  );
}

export default SavingsAccountCard;
