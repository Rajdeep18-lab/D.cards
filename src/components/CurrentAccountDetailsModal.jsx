import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  CheckCircle2, 
  ExternalLink, 
  CreditCard, 
  Briefcase, 
  ChevronRight,
  Heart,
  AlertCircle
} from 'lucide-react';
import { getAssociatedDebitCardsForCurrentAccount, getDebitCardRelationshipStatusForCurrentAccount } from '../data/currentAccounts/index.js';
import { useWishlist } from '../context/WishlistContext';
import { safeString, safeArray } from '../utils/safeUtils';
import BankLogo from './BankLogo';
import { 
  formatMinimumBalance, 
  formatCashDepositLimit, 
  formatNonMaintenanceCharge, 
  formatBenefits, 
  formatSourceAndVerification 
} from '../utils/bankingDataFormatter';

function CurrentAccountDetailsModal({ isOpen, onClose, account, onSelectDebitCard, onToggleCompare, isCompared }) {
  const { isWishlisted, toggleWishlist } = useWishlist();

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !account) return null;

  const wishlisted = isWishlisted(account.id || account.product_id);
  const associatedCards = getAssociatedDebitCardsForCurrentAccount(account);
  const bankName = account.bankName || account.bank_name || account.bank || "Partner Bank";
  const accountName = account.accountName || account.variant_name || "Current Account";

  // Clean data through presentation layer
  const formattedBalance = formatMinimumBalance(account.minimumBalance || account.minimum_balance || account.averageBalanceRequirement, account);
  const formattedCashLimit = formatCashDepositLimit(account.cashDepositLimit || account.freeCashDepositPerMonth, account);
  const formattedFee = formatNonMaintenanceCharge(account.nonMaintenanceCharge || account.non_maintenance_penalty, account);
  const highlights = formatBenefits(account.keyBenefits || account.benefits, 6);
  const sourceInfo = formatSourceAndVerification(account);

  const getRelationshipBadge = (rel) => {
    switch (rel) {
      case 'included':
        return { label: 'Complimentary / Included', color: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30' };
      case 'default':
        return { label: 'Default Issued Card', color: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/30' };
      case 'optional':
        return { label: 'Available as an Option', color: 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-500/30' };
      case 'eligibility_based':
        return { label: 'Eligibility Based Upgrade', color: 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/30' };
      default:
        return { label: 'Default Business Card', color: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/30' };
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[1200] flex items-center justify-center p-3 sm:p-6 overflow-y-auto pointer-events-auto select-none">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm z-0"
        />

        {/* Modal Box */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.96 }}
          transition={{ type: 'spring', stiffness: 350, damping: 28 }}
          className="relative z-10 w-full max-w-[850px] max-h-[90vh] my-auto flex flex-col rounded-[28px] bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 shadow-[0_25px_80px_rgba(15,23,42,0.35)] overflow-hidden text-left"
        >
          {/* Header */}
          <div className="p-5 sm:p-6 pb-4 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between flex-shrink-0 bg-slate-50/60 dark:bg-slate-900/50">
            <div className="flex items-center gap-3.5 min-w-0">
              <BankLogo bankName={bankName} size="md" />
              <div className="min-w-0">
                <span className="text-xs font-black uppercase tracking-wider text-[#2563EB] dark:text-[#60A5FA] block">
                  🏦 {bankName} • CURRENT ACCOUNT
                </span>
                <h2 className="text-lg sm:text-xl font-extrabold text-[#1F2937] dark:text-white tracking-tight truncate">
                  {accountName}
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => toggleWishlist(account)}
                title="Save Account"
                className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all cursor-pointer ${
                  wishlisted
                    ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 text-rose-500'
                    : 'bg-white dark:bg-slate-800 border-slate-200 text-slate-400 hover:text-rose-500'
                }`}
              >
                <Heart className={`w-4 h-4 ${wishlisted ? 'fill-rose-500' : ''}`} />
              </button>

              <button
                onClick={onClose}
                className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1 custom-scrollbar">
            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200/80 dark:border-blue-900/50">
                <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-blue-700 dark:text-blue-400 block mb-1">
                  Average Balance (AQB)
                </span>
                <span className="text-xl sm:text-2xl font-black text-[#1F2937] dark:text-white tracking-tight block">
                  {formattedBalance.display}
                </span>
                {formattedBalance.subtext && (
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-0.5">{formattedBalance.subtext}</span>
                )}
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
                <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1">
                  Non-Maintenance Fee
                </span>
                <span className="text-base font-black text-slate-800 dark:text-slate-200 block truncate">
                  {formattedFee.display}
                </span>
                {formattedFee.subtext && (
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-0.5">{formattedFee.subtext}</span>
                )}
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
                <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1">
                  Cash Deposit Limit
                </span>
                <span className="text-base font-black text-blue-600 dark:text-blue-400 block truncate">
                  {formattedCashLimit.display}
                </span>
                {formattedCashLimit.subtext && (
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-0.5 line-clamp-1">{formattedCashLimit.subtext}</span>
                )}
              </div>
            </div>

            {/* Location Breakdown if available */}
            {formattedBalance.breakdown && formattedBalance.breakdown.length > 0 && (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                <span className="text-[10.5px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                  Location-Specific Minimum Balance
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {formattedBalance.breakdown.map((b, i) => (
                    <div key={i} className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      <span className="text-[10px] text-slate-400 block font-semibold">{b.label}</span>
                      <span className="font-extrabold text-slate-800 dark:text-slate-100 text-sm mt-0.5 block">{b.amount}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Structured Banking Parameters (Section 4) */}
            <div className="p-4 rounded-2xl bg-slate-50/60 dark:bg-slate-900/50 border border-slate-200/70 dark:border-slate-800 space-y-3">
              <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-slate-400 block">
                Commercial Account Parameters:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700">
                  <span className="text-[9.5px] font-bold text-slate-400 uppercase block">Withdrawal Limit</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 block truncate mt-0.5">
                    {account.cashWithdrawalLimit || "Unlimited at base"}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700">
                  <span className="text-[9.5px] font-bold text-slate-400 uppercase block">NEFT / RTGS</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 block truncate mt-0.5">
                    {account.neft || account.rtgs || "Free Digital"}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700">
                  <span className="text-[9.5px] font-bold text-slate-400 uppercase block">Cheque Facility</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 block truncate mt-0.5">
                    {account.chequeBook || account.freeChequeLeaves || "Included"}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700">
                  <span className="text-[9.5px] font-bold text-slate-400 uppercase block">POS Terminal</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 block truncate mt-0.5">
                    {account.posTerminal || "Available on request"}
                  </span>
                </div>
              </div>
            </div>

            {/* Business Constitutions */}
            {account.businessConstitution && account.businessConstitution.length > 0 && (
              <div className="space-y-2">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block">
                  Eligible Business Types:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {account.businessConstitution.map((b, i) => (
                    <span key={i} className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {b}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Key Advantages */}
            {(account.keyBenefits || account.benefits) && (
              <div className="space-y-2.5">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block">
                  Key Business Benefits:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {safeArray(account.keyBenefits || account.benefits).map((b, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 text-xs font-medium text-slate-700 dark:text-slate-200 flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Associated Debit Cards */}
            <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#2563EB] dark:text-[#60A5FA] flex items-center gap-1.5">
                <CreditCard className="w-4 h-4" /> Associated Business Debit Card(s)
              </span>

              {associatedCards.length === 0 ? (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-500 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>Linked Debit Card: Not specified on official source</span>
                </div>
              ) : (
                <div className="space-y-2">
                  {associatedCards.map((card, idx) => {
                    const badge = getRelationshipBadge(card.relationship);
                    return (
                      <div key={idx} className="p-4 rounded-2xl bg-[#EFF6FF]/60 dark:bg-slate-800/40 border border-[#2563EB]/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-[#2563EB] text-white flex items-center justify-center font-bold text-xs shrink-0">
                            <CreditCard className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-extrabold text-sm text-slate-800 dark:text-white">
                                {card.name || card.card_name || card.cardName}
                              </h4>
                              <span className={`px-2 py-0.5 rounded-full text-[9.5px] font-bold border ${badge.color}`}>
                                {badge.label}
                              </span>
                            </div>
                            <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 block">
                              Fee: {card.annualFee === 0 ? 'Free' : `₹${card.annualFee}`} • ATM: {card.atmLimit || '₹1,00,000/day'}
                            </span>
                          </div>
                        </div>

                        {onSelectDebitCard && (
                          <button
                            onClick={() => {
                              onClose();
                              onSelectDebitCard(card);
                            }}
                            className="px-3 py-1.5 rounded-xl bg-[#2563EB] text-white font-bold text-xs hover:bg-blue-700 transition-colors flex items-center gap-1 cursor-pointer shrink-0"
                          >
                            <span>Card Details</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Verification Metadata */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs flex flex-wrap items-center justify-between gap-3 text-slate-500">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-slate-700 dark:text-slate-300">Verified:</span>
                <span>{sourceInfo.verifiedDateFormatted}</span>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <span className="font-bold text-slate-700 dark:text-slate-300">Source:</span>
                <span>{sourceInfo.sourceName}</span>
              </div>
              {sourceInfo.sourceUrl && (
                <a
                  href={sourceInfo.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#2563EB] dark:text-[#60A5FA] hover:underline font-bold inline-flex items-center gap-1"
                >
                  <span>View Official Source</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-900/50 flex items-center justify-between gap-3">
            <button
              onClick={() => onToggleCompare && onToggleCompare(account)}
              className={`px-4 py-2.5 rounded-xl text-xs font-extrabold border transition-all cursor-pointer ${
                isCompared
                  ? 'bg-[#2563EB] text-white border-[#2563EB]'
                  : 'bg-white dark:bg-slate-800 border-slate-200 text-slate-700 dark:text-slate-200 hover:bg-slate-100'
              }`}
            >
              {isCompared ? 'In Compare Queue ✓' : 'Add to Compare'}
            </button>

            {account.officialSource && (
              <a
                href={account.officialSource}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#3B82F6] text-white font-extrabold text-xs shadow-md hover:shadow-lg transition-all flex items-center gap-1.5"
              >
                <span>Visit Bank Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default CurrentAccountDetailsModal;
