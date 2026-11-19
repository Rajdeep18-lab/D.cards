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
        return { label: 'Provided with account', color: 'bg-[#EEF4EE] text-[#006B50] border-[#DCE9E1]' };
      case 'optional':
        return { label: 'Available as an option', color: 'bg-[#F5F3EC] text-[#123C30] border-[#DCE9E1]' };
      case 'upgrade':
        return { label: 'Upgrade option', color: 'bg-emerald-50 text-[#006B50] border-emerald-300' };
      default:
        return { label: 'Provided with account', color: 'bg-[#EEF4EE] text-[#006B50] border-[#DCE9E1]' };
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
          className="fixed inset-0 bg-[#123C30]/40 backdrop-blur-md z-0"
        />

        {/* Modal Box */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.96 }}
          transition={{ type: 'spring', stiffness: 350, damping: 28 }}
          className="relative z-10 w-full max-w-[850px] max-h-[90vh] my-auto flex flex-col rounded-[28px] bg-[#FAF9F4] border border-[#DCE9E1] shadow-[0_25px_80px_rgba(20,41,31,0.18)] overflow-hidden text-left"
        >
          {/* Header */}
          <div className="p-5 sm:p-6 pb-4 border-b border-[#DCE9E1] flex items-center justify-between flex-shrink-0 bg-[#FAF9F4]">
            <div className="flex items-center gap-3.5 min-w-0">
              <BankLogo bankName={bankName} size="md" />
              <div className="min-w-0">
                <span className="text-xs font-bold uppercase tracking-wider text-[#006B50] block">
                  🏦 {bankName}
                </span>
                <h2 className="font-serif text-lg sm:text-2xl font-bold text-[#123C30] tracking-tight truncate">
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
                    ? 'bg-rose-50 border-rose-200 text-rose-600'
                    : 'bg-white border-[#DCE9E1] text-[#45534D] hover:text-[#006B50]'
                }`}
              >
                <Heart className={`w-4 h-4 ${wishlisted ? 'fill-rose-500' : ''}`} />
              </button>

              <button
                onClick={onClose}
                aria-label="Close"
                className="w-9 h-9 rounded-full bg-[#EEF4EE] hover:bg-[#DCE9E1] text-[#123C30] border border-[#DCE9E1] flex items-center justify-center cursor-pointer transition-all hover:scale-105"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Scrollable Content Body */}
          <div className="p-5 sm:p-7 overflow-y-auto space-y-6 custom-scrollbar flex-1 bg-[#FAF9F4]">
            {/* Account Overview Badges */}
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#EEF4EE] text-[#006B50] border border-[#DCE9E1]">
                Category: {account.account_type || account.accountType || "Savings"}
              </span>
              {account.isZeroBalance && (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#EEF4EE] text-[#006B50] border border-[#DCE9E1]">
                  ✓ Zero Balance Account
                </span>
              )}
              {account.accountTypeBadges && account.accountTypeBadges.map((b, i) => (
                <span key={i} className="px-3 py-1 rounded-full text-xs font-medium bg-[#F5F3EC] text-[#123C30] border border-[#DCE9E1]">
                  {b}
                </span>
              ))}
            </div>

            <p className="text-sm text-[#45534D] leading-relaxed font-normal">
              {account.description || "Comprehensive savings account profile."}
            </p>

            {/* Interest Rate & Balance Rules */}
            <div className="p-5 rounded-2xl bg-white border border-[#DCE9E1] space-y-4 shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#006B50] flex items-center gap-1.5">
                <Percent className="w-4 h-4 text-[#006B50]" />
                <span>Interest Rates & Balance Requirements</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-[#F5F3EC] border border-[#DCE9E1] space-y-0.5">
                  <span className="text-[#45534D] font-bold uppercase text-[10px] block">Max Interest Rate</span>
                  <span className="font-serif text-2xl font-bold text-[#006B50] mt-0.5 block">{formattedRate.display}</span>
                  {formattedRate.subtext && (
                    <span className="text-[10px] text-[#45534D] block pt-0.5">{formattedRate.subtext}</span>
                  )}
                </div>
                <div className="p-3.5 rounded-xl bg-[#F5F3EC] border border-[#DCE9E1] space-y-0.5">
                  <span className="text-[#45534D] font-bold uppercase text-[10px] block">Minimum Balance</span>
                  <span className="font-serif text-2xl font-bold text-[#123C30] mt-0.5 block">{formattedBalance.display}</span>
                  {formattedBalance.subtext && (
                    <span className="text-[10px] text-[#45534D] block pt-0.5">{formattedBalance.subtext}</span>
                  )}
                </div>
              </div>

              {/* Structured Rate Slabs Table if available */}
              {formattedRate.slabs && formattedRate.slabs.length > 0 && (
                <div className="pt-2 border-t border-[#DCE9E1] space-y-2">
                  <span className="text-[11px] font-bold text-[#123C30] uppercase tracking-wider block">
                    Interest Rate Slabs
                  </span>
                  <div className="rounded-xl overflow-hidden border border-[#DCE9E1]">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#EEF4EE] text-[10px] uppercase font-bold text-[#123C30]">
                        <tr>
                          <th className="px-3.5 py-2">Balance Slab</th>
                          <th className="px-3.5 py-2 text-right">Rate</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#DCE9E1]">
                        {formattedRate.slabs.map((slab, i) => (
                          <tr key={i} className="hover:bg-[#F5F3EC]/50">
                            <td className="px-3.5 py-2 text-[#123C30] font-medium">{slab.slab}</td>
                            <td className="px-3.5 py-2 text-right font-bold text-[#006B50]">{slab.rate}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {formattedRate.variantSpecificNote && (
                    <span className="text-[11px] text-[#45534D] block italic">
                      Variant-specific rate: {formattedRate.variantSpecificNote}
                    </span>
                  )}
                </div>
              )}

              {/* Location Breakdown if available */}
              {formattedBalance.breakdown && formattedBalance.breakdown.length > 0 && (
                <div className="pt-2 border-t border-[#DCE9E1] space-y-2">
                  <span className="text-[11px] font-bold text-[#123C30] uppercase tracking-wider block">
                    Location-Specific Minimum Balance
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {formattedBalance.breakdown.map((b, i) => (
                      <div key={i} className="p-2.5 rounded-xl bg-[#F5F3EC] border border-[#DCE9E1]">
                        <span className="text-[10px] text-[#45534D] block font-semibold">{b.label}</span>
                        <span className="font-bold text-[#123C30] text-sm mt-0.5 block">{b.amount}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-1 pt-2 border-t border-[#DCE9E1] text-xs text-[#45534D]">
                <p><strong>Non-Maintenance Charges:</strong> {formattedPenalty.display} {formattedPenalty.subtext ? `(${formattedPenalty.subtext})` : ''}</p>
              </div>
            </div>

            {/* CONNECTED DEBIT CARD SECTION */}
            <div className="p-5 rounded-2xl bg-[#EEF4EE] border border-[#DCE9E1] shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#006B50] flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-[#006B50]" />
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
                      <div key={cardItem.card_id || cardItem.id || idx} className="space-y-3 bg-white p-4 rounded-xl border border-[#DCE9E1] shadow-xs">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${badge.color}`}>
                                {badge.label}
                              </span>
                              <span className="text-[10px] font-bold text-[#006B50] uppercase tracking-wider block">
                                {bankName} • {network}
                              </span>
                            </div>
                            <h4 className="font-serif text-base font-bold text-[#123C30]">
                              💳 {cardName}
                            </h4>
                          </div>

                          {onSelectDebitCard && (
                            <button
                              onClick={() => { onClose(); onSelectDebitCard(cardItem); }}
                              className="px-3 py-1.5 rounded-lg bg-[#006B50] hover:bg-[#064E3B] text-white font-bold text-xs flex items-center gap-1 cursor-pointer shadow-xs shrink-0"
                            >
                              <span>Full Card Specs</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs pt-2 border-t border-[#DCE9E1]">
                          <div>
                            <span className="text-[10px] text-[#45534D] block font-semibold uppercase">Annual Fee</span>
                            <span className="font-bold text-[#123C30]">{annualFee}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-[#45534D] block font-semibold uppercase">ATM Limit</span>
                            <span className="font-bold text-[#123C30]">{atmLimit}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-[#45534D] block font-semibold uppercase">POS Limit</span>
                            <span className="font-bold text-[#123C30]">{posLimit}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-[#45534D] block font-semibold uppercase">Lounge Access</span>
                            <span className="font-bold text-[#006B50]">{loungeAccess}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-4 bg-white rounded-xl text-xs font-semibold text-[#45534D] flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Linked Debit Card: Not specified on official source</span>
                </div>
              )}
            </div>

            {/* Source & Verification Metadata Box */}
            <div className="p-4 rounded-2xl bg-white border border-[#DCE9E1] text-xs flex flex-wrap items-center justify-between gap-3 text-[#45534D]">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-[#123C30]">Verified:</span>
                <span>{sourceInfo.verifiedDateFormatted}</span>
                <span className="text-[#DCE9E1]">•</span>
                <span className="font-bold text-[#123C30]">Source:</span>
                <span>{sourceInfo.sourceName}</span>
              </div>
              {sourceInfo.sourceUrl && (
                <a
                  href={sourceInfo.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#006B50] hover:underline font-bold inline-flex items-center gap-1"
                >
                  <span>View Official Source</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>

            {/* Account Opening Features */}
            {account.bankingFeatures && account.bankingFeatures.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#006B50] flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-[#006B50]" />
                  <span>Key Banking Features</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-medium">
                  {account.bankingFeatures.map((feat, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-white border border-[#DCE9E1] flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#006B50] shrink-0" />
                      <span className="text-[#123C30]">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer Action Buttons */}
          <div className="p-4 sm:p-5 border-t border-[#DCE9E1] bg-[#FAF9F4] flex flex-col sm:flex-row items-center justify-between gap-3 flex-shrink-0">
            {(account.officialSourceUrl || account.source || account.applyUrl || account.officialUrl || account.websiteUrl || account.bankUrl) ? (
              <a
                href={account.officialSourceUrl || account.source || account.applyUrl || account.officialUrl || account.websiteUrl || account.bankUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#006B50] hover:bg-[#064E3B] text-white font-bold text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <span>Apply on Official Website</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            ) : <div />}

            <button
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#EEF4EE] hover:bg-[#DCE9E1] text-[#123C30] font-bold text-xs transition-all cursor-pointer text-center border border-[#DCE9E1]"
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