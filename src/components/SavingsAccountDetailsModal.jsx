import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  CheckCircle2, 
  ExternalLink, 
  CreditCard, 
  Percent, 
  Zap, 
  ChevronRight,
  Heart,
  AlertCircle
} from 'lucide-react';
import { getAssociatedDebitCards } from '../data/mockSavingsAccounts';
import { useWishlist } from '../context/WishlistContext';
import { safeString, safeArray } from '../utils/safeUtils';
import BankLogo from './BankLogo';
import { 
  formatInterestRate, 
  formatMinimumBalance, 
  formatNonMaintenanceCharge, 
  formatSourceAndVerification 
} from '../utils/bankingDataFormatter';

function SavingsAccountDetailsModal({ isOpen, onClose, account, onSelectDebitCard, onToggleCompare, isCompared }) {
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
  const associatedCards = getAssociatedDebitCards(account);
  const bankName = account.bank_name || account.bank || "Partner Bank";
  const accountName = account.variant_name || account.accountName || "Savings Account";

  // Clean data through presentation layer
  const formattedRate = formatInterestRate(account.interest_rate || account.interestRate, account);
  const formattedBalance = formatMinimumBalance(account.minimum_balance || account.minimumBalance, account);
  const formattedPenalty = formatNonMaintenanceCharge(account.non_maintenance_penalty || account.nonMaintenanceCharges, account);
  const sourceInfo = formatSourceAndVerification(account);

  const getRelationshipBadge = (rel) => {
    switch (rel) {
      case 'provided':
        return { label: 'Provided with account', color: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30' };
      case 'optional':
        return { label: 'Available as an option', color: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/30' };
      case 'upgrade':
        return { label: 'Upgrade option', color: 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/30' };
      default:
        return { label: 'Provided with account', color: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30' };
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
                  🏦 {bankName}
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
                aria-label="Close"
                className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700 flex items-center justify-center cursor-pointer transition-all hover:scale-105"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>
          </div>

          {/* Scrollable Content Body */}
          <div className="p-5 sm:p-7 overflow-y-auto space-y-6 custom-scrollbar flex-1">
            {/* Account Overview Badges */}
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-[#2563EB]/10 text-[#2563EB] dark:text-[#60A5FA]">
                Category: {account.account_type || account.accountType || "Savings"}
              </span>
              {account.isZeroBalance && (
                <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  ✓ Zero Balance Account
                </span>
              )}
              {account.accountTypeBadges && account.accountTypeBadges.map((b, i) => (
                <span key={i} className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {b}
                </span>
              ))}
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              {account.description || "Comprehensive savings account profile."}
            </p>

            {/* Interest Rate & Balance Rules */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 space-y-4">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#2563EB] dark:text-[#60A5FA] flex items-center gap-1.5">
                <Percent className="w-4 h-4 text-[#2563EB]" />
                <span>Interest Rates & Balance Requirements</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-0.5">
                  <span className="text-slate-400 font-bold uppercase text-[10px] block">Max Interest Rate</span>
                  <span className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5 block">{formattedRate.display}</span>
                  {formattedRate.subtext && (
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block pt-0.5">{formattedRate.subtext}</span>
                  )}
                </div>
                <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-0.5">
                  <span className="text-slate-400 font-bold uppercase text-[10px] block">Minimum Balance</span>
                  <span className="text-xl font-black text-slate-800 dark:text-white mt-0.5 block">{formattedBalance.display}</span>
                  {formattedBalance.subtext && (
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block pt-0.5">{formattedBalance.subtext}</span>
                  )}
                </div>
              </div>

              {/* Structured Rate Slabs Table if available */}
              {formattedRate.slabs && formattedRate.slabs.length > 0 && (
                <div className="pt-2 border-t border-slate-200/80 dark:border-slate-800 space-y-2">
                  <span className="text-[10.5px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                    Interest Rate Slabs
                  </span>
                  <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-100 dark:bg-slate-800 text-[10px] uppercase font-bold text-slate-500">
                        <tr>
                          <th className="px-3.5 py-2">Balance Slab</th>
                          <th className="px-3.5 py-2 text-right">Rate</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {formattedRate.slabs.map((slab, i) => (
                          <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                            <td className="px-3.5 py-2 text-slate-700 dark:text-slate-300 font-medium">{slab.slab}</td>
                            <td className="px-3.5 py-2 text-right font-bold text-emerald-600 dark:text-emerald-400">{slab.rate}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {formattedRate.variantSpecificNote && (
                    <span className="text-[10.5px] text-slate-500 dark:text-slate-400 block italic">
                      Variant-specific rate: {formattedRate.variantSpecificNote}
                    </span>
                  )}
                </div>
              )}

              {/* Location Breakdown if available */}
              {formattedBalance.breakdown && formattedBalance.breakdown.length > 0 && (
                <div className="pt-2 border-t border-slate-200/80 dark:border-slate-800 space-y-2">
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

              <div className="space-y-1 pt-2 border-t border-slate-200/80 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
                <p><strong>Non-Maintenance Charges:</strong> {formattedPenalty.display} {formattedPenalty.subtext ? `(${formattedPenalty.subtext})` : ''}</p>
              </div>
            </div>

            {/* CONNECTED DEBIT CARD SECTION */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-[#EFF6FF] to-[#DBEAFE] dark:from-slate-800/90 dark:to-slate-900/90 border border-[#2563EB]/30 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black uppercase tracking-wider text-[#0B3D91] dark:text-[#60A5FA] flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-[#2563EB]" />
                  <span>
                    {associatedCards.length > 1
                      ? `Available Debit Cards (${associatedCards.length})`
                      : associatedCards.length === 1
                      ? "Debit Card Provided with this Account"
                      : "Debit Card Information"}
                  </span>
                </h3>
              </div>

              {associatedCards.length > 0 ? (
                <div className="space-y-3">
                  {associatedCards.map((cardItem, idx) => {
                    const badge = getRelationshipBadge(cardItem.relationship);
                    const cardName = cardItem.card_name || cardItem.cardName || "Information not available";
                    const network = cardItem.network || "Information not available";
                    const annualFee = cardItem.annual_fee || cardItem.annualFee || "Information not available";
                    const atmLimit = cardItem.atm_limit || cardItem.cashWithdrawalLimit || "Information not available";
                    const posLimit = cardItem.pos_limit || cardItem.purchaseLimit || "Information not available";
                    const loungeAccess = cardItem.lounge_access || cardItem.loungeAccess || "Information not available";

                    return (
                      <div key={cardItem.card_id || cardItem.id || idx} className="space-y-3 bg-white dark:bg-slate-900 p-4 rounded-xl border border-[#2563EB]/20 shadow-xs">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`px-2 py-0.5 rounded-full text-[9px] font-black border ${badge.color}`}>
                                {badge.label}
                              </span>
                              <span className="text-[10px] font-bold text-[#2563EB] dark:text-[#60A5FA] uppercase tracking-wider block">
                                {bankName} • {network}
                              </span>
                            </div>
                            <h4 className="text-base font-extrabold text-[#1F2937] dark:text-white">
                              💳 {cardName}
                            </h4>
                          </div>

                          {onSelectDebitCard && (
                            <button
                              onClick={() => { onClose(); onSelectDebitCard(cardItem); }}
                              className="px-3 py-1.5 rounded-lg bg-[#2563EB] text-white font-bold text-xs flex items-center gap-1 hover:brightness-110 cursor-pointer shadow-xs shrink-0"
                            >
                              <span>Full Card Specs</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
                          <div>
                            <span className="text-[10px] text-slate-400 block font-semibold uppercase">Annual Fee</span>
                            <span className="font-bold text-slate-800 dark:text-slate-200">{annualFee}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 block font-semibold uppercase">ATM Limit</span>
                            <span className="font-bold text-slate-800 dark:text-slate-200">{atmLimit}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 block font-semibold uppercase">POS Limit</span>
                            <span className="font-bold text-slate-800 dark:text-slate-200">{posLimit}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 block font-semibold uppercase">Lounge Access</span>
                            <span className="font-bold text-[#2563EB] dark:text-[#60A5FA]">{loungeAccess}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-4 bg-white/80 dark:bg-slate-900/80 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>Linked Debit Card: Not specified on official source</span>
                </div>
              )}
            </div>

            {/* Source & Verification Metadata Box */}
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

            {/* Account Opening Features */}
            {account.bankingFeatures && account.bankingFeatures.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#2563EB] dark:text-[#60A5FA] flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-[#2563EB]" />
                  <span>Key Banking Features</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-medium">
                  {account.bankingFeatures.map((feat, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer Action Buttons */}
          <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/80 dark:bg-slate-900/50 flex flex-col sm:flex-row items-center justify-between gap-3 flex-shrink-0">
            {(account.officialSourceUrl || account.source || account.applyUrl || account.officialUrl || account.websiteUrl || account.bankUrl) ? (
              <a
                href={account.officialSourceUrl || account.source || account.applyUrl || account.officialUrl || account.websiteUrl || account.bankUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-extrabold text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <span>Apply on Official Website</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            ) : <div />}

            <button
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-extrabold text-xs hover:bg-slate-300 dark:hover:bg-slate-700 transition-all cursor-pointer text-center"
            >
              Close Window
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default SavingsAccountDetailsModal;
