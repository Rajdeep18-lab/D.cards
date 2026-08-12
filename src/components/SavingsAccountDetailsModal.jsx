import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Building2, 
  CheckCircle2, 
  ExternalLink, 
  CreditCard, 
  ShieldCheck, 
  FileText, 
  UserCheck, 
  Percent, 
  Zap, 
  Lock, 
  Smartphone, 
  ChevronRight,
  Info,
  Scale,
  Heart
} from 'lucide-react';
import { getAssociatedDebitCard, getAssociatedDebitCards } from '../data/mockSavingsAccounts';
import { useWishlist } from '../context/WishlistContext';
import IDFCTierEligibilityCalculator from './IDFCTierEligibilityCalculator';
import IDFCTierBenefitsComparison from './IDFCTierBenefitsComparison';
import IDFC25KHighlights from './IDFC25KHighlights';
import IDFCCreditCardRelationship from './IDFCCreditCardRelationship';

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

  const wishlisted = isWishlisted(account.id);
  const associatedCards = getAssociatedDebitCards(account);
  const associatedCard = associatedCards.length > 0 ? associatedCards[0] : getAssociatedDebitCard(account.associatedDebitCardId);

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
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0B3D91] to-[#2563EB] text-white font-black text-lg flex items-center justify-center shadow-md shadow-[#2563EB]/25 flex-shrink-0">
                {account.logo || account.bank.substring(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0">
                <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB] dark:text-[#60A5FA] block">
                  {account.bank}
                </span>
                <h2 className="text-lg sm:text-xl font-extrabold text-[#1F2937] dark:text-white tracking-tight truncate">
                  {account.accountName}
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

          {/* Scrollable Body Content */}
          <div className="p-5 sm:p-6 overflow-y-auto flex-1 custom-scrollbar space-y-6 text-xs sm:text-sm">
            {/* Overview & Account Type Tags */}
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-[#2563EB]/10 text-[#2563EB] dark:text-[#60A5FA] border border-[#2563EB]/20">
                  {account.accountType}
                </span>
                {account.isZeroBalance && (
                  <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    ✓ Zero Balance Account
                  </span>
                )}
                {account.isOnlineOpening && (
                  <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                    ⚡ Online Video KYC Available
                  </span>
                )}
              </div>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                {account.description}
              </p>
            </div>

            {/* Interest Rate & Balance Breakdown Box */}
            <div className="p-5 rounded-2xl bg-[#F8FAFC] dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 space-y-4">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#2563EB] dark:text-[#60A5FA] flex items-center gap-1.5">
                <Percent className="w-4 h-4 text-[#2563EB]" />
                <span>Interest Rates & Balance Requirements</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <span className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider block">Max Savings Rate</span>
                  <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">{account.interestRate}</span>
                </div>
                <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <span className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider block">Minimum Balance Required</span>
                  <span className="text-xl font-black text-[#1F2937] dark:text-white">{account.minimumBalance}</span>
                </div>
              </div>

              {account.interestSlabs && (
                <div className="space-y-1.5 pt-2 border-t border-slate-200/80 dark:border-slate-800">
                  <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase">Interest Slabs:</span>
                  <ul className="list-disc pl-5 space-y-1 text-slate-700 dark:text-slate-300 font-medium">
                    {account.interestSlabs.map((slab, i) => (
                      <li key={i}>{slab}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="space-y-1 pt-2 border-t border-slate-200/80 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
                <p><strong>AMB / AQB Rules:</strong> {account.ambAqbText || "Standard Monthly Balance Rules"}</p>
                <p><strong>Non-Maintenance Penalty:</strong> {account.nonMaintenanceCharges || "Applicable if AMB is not met"}</p>
              </div>
            </div>

            {/* CRITICAL FEATURE: CONNECTED DEBIT CARD SECTION */}
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
                {associatedCards.length > 0 && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#2563EB] text-white">
                    Official Linked Card
                  </span>
                )}
              </div>

              {associatedCards.length > 0 ? (
                <div className="space-y-3">
                  {associatedCards.map((cardItem, idx) => (
                    <div key={cardItem.id || idx} className="space-y-3 bg-white dark:bg-slate-900 p-4 rounded-xl border border-[#2563EB]/20 shadow-xs">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <span className="text-[10px] font-bold text-[#2563EB] dark:text-[#60A5FA] uppercase tracking-wider block">
                            {cardItem.bank} • {cardItem.network || 'Visa'} {cardItem.category ? `• ${cardItem.category}` : ''}
                          </span>
                          <h4 className="text-base font-extrabold text-[#1F2937] dark:text-white">
                            {cardItem.cardName}
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
                          <span className="font-bold text-slate-800 dark:text-slate-200">{cardItem.annualFee || "Free"}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block font-semibold uppercase">ATM Limit</span>
                          <span className="font-bold text-slate-800 dark:text-slate-200">₹{(cardItem.atmLimit || cardItem.limits?.atmLimit || 50000).toLocaleString('en-IN')}/day</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block font-semibold uppercase">POS Limit</span>
                          <span className="font-bold text-slate-800 dark:text-slate-200">₹{(cardItem.posLimit || cardItem.limits?.posLimit || 100000).toLocaleString('en-IN')}/day</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block font-semibold uppercase">Lounge Access</span>
                          <span className="font-bold text-[#2563EB] dark:text-[#60A5FA]">{cardItem.loungeAccess || "No"}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-3.5 bg-white/80 dark:bg-slate-900/80 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300">
                  Debit card information not available in the provided source.
                </div>
              )}
            </div>

            {/* Account Opening & Video KYC */}
            {account.accountOpeningFeatures && (
              <div className="space-y-2">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#2563EB] dark:text-[#60A5FA] flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-[#2563EB]" />
                  <span>Account Opening & Digital Onboarding</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-medium">
                  {account.accountOpeningFeatures.map((feat, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Eligibility & Documents */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {account.eligibility && (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800 space-y-2">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4 text-[#2563EB]" />
                    <span>Eligibility Criteria</span>
                  </h4>
                  <ul className="list-disc pl-5 space-y-1 text-slate-700 dark:text-slate-300 font-medium">
                    {account.eligibility.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {account.documentsRequired && (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800 space-y-2">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-[#2563EB]" />
                    <span>Required Documents</span>
                  </h4>
                  <ul className="list-disc pl-5 space-y-1 text-slate-700 dark:text-slate-300 font-medium">
                    {account.documentsRequired.map((doc, i) => (
                      <li key={i}>{doc}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Banking Features (UPI, Auto-sweep, etc.) */}
            {account.bankingFeatures && (
              <div className="space-y-2">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#2563EB] dark:text-[#60A5FA] flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#2563EB]" />
                  <span>Verified Banking Features</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-medium">
                  {account.bankingFeatures.map((bFeat, i) => (
                    <div key={i} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#2563EB] shrink-0" />
                      <span>{bFeat}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── IDFC FIRST BANK SPECIAL SECTIONS ── */}
            {(account.bankId === 'idfc-first-bank' || account.bank === 'IDFC FIRST Bank') && (
              <div className="space-y-6 pt-4 border-t border-slate-200 dark:border-slate-800">
                {/* 7 Amazing Benefits for ₹25K AMB */}
                {account.sevenAmazingBenefits && <IDFC25KHighlights />}

                {/* Eligibility Calculator */}
                <IDFCTierEligibilityCalculator />

                {/* Benefits Comparison Matrix */}
                <IDFCTierBenefitsComparison />

                {/* Credit Card Relationships */}
                <IDFCCreditCardRelationship currentTier={account.tier || account.accountName} />
              </div>
            )}

            {/* Legal Information Disclaimer Box */}
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 space-y-2 text-amber-900 dark:text-amber-200 text-xs">
              <div className="flex items-center gap-2 font-black uppercase tracking-wider text-amber-800 dark:text-amber-300">
                <Info className="w-4 h-4 shrink-0" />
                <span>Information & Regulatory Disclaimer</span>
              </div>
              <p className="leading-relaxed font-medium">
                Information is provided for informational and comparison purposes only. Interest rates, charges, eligibility criteria, account features and debit-card benefits may change. Please verify the latest information on the respective bank's official website before opening an account.
              </p>
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-amber-200/60 dark:border-amber-900/40 text-[11px] font-semibold">
                <span>Source: Official Bank Schedule</span>
                <span>Last Verified: {account.lastVerified || "August 2026"}</span>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 flex items-center justify-between gap-3 flex-shrink-0">
            <button
              onClick={() => onToggleCompare && onToggleCompare(account)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all border cursor-pointer flex items-center gap-1.5 ${
                isCompared
                  ? 'bg-[#2563EB] text-white border-[#2563EB]'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
              }`}
            >
              <Scale className="w-4 h-4" />
              <span>{isCompared ? 'Queued for Compare' : 'Add to Compare'}</span>
            </button>

            {account.officialSourceUrl && (
              <a
                href={account.officialSourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#3B82F6] hover:shadow-lg hover:shadow-[#2563EB]/25 text-white font-extrabold text-xs transition-all shadow cursor-pointer active:scale-95 flex items-center gap-1.5"
              >
                <span>Open Account on Bank Site</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default SavingsAccountDetailsModal;
