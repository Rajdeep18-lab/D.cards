import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  X, 
  MapPin, 
  Navigation, 
  Phone, 
  Clock, 
  Building2, 
  ExternalLink, 
  Check, 
  Copy, 
  ShieldCheck, 
  CreditCard,
  Percent,
  Share2
} from 'lucide-react';
import { getDirectionsUrl } from '../utils/branchUtils';
import { getBankById } from '../data/banks';
import { useLanguage } from '../context/LanguageContext';

export default function BranchDetailsModal({ branch, isOpen, onClose, onViewOnMap }) {
  const { isHindi, t } = useLanguage();
  const [copiedIfsc, setCopiedIfsc] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  // Close on ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !branch) return null;

  const branchName = branch.branchName || branch.branch_name || 'Branch';
  const bankName = branch.bank_name || branch.bankName || branch.bankId || '';
  const bankInfo = getBankById(branch.bankId) || getBankById(bankName.toLowerCase().replace(/[^a-z0-9]/g, ''));
  const directionsUrl = branch.directionsUrl || getDirectionsUrl(branch);
  const openingHours = branch.openingHours || branch.opening_hours;
  const officialSource = branch.officialSourceUrl || branch.source_url;

  const handleCopyIfsc = (e) => {
    e.stopPropagation();
    if (!branch.ifsc) return;
    navigator.clipboard.writeText(branch.ifsc);
    setCopiedIfsc(true);
    setTimeout(() => setCopiedIfsc(false), 2000);
  };

  const handleShareBranch = (e) => {
    e.stopPropagation();
    const shareText = `${bankInfo?.bankName || bankName || 'Bank'} — ${branchName}\nIFSC: ${branch.ifsc}\nAddress: ${branch.address}, ${branch.city}, ${branch.state} ${branch.pincode}\nDirections: ${directionsUrl}`;
    if (navigator.share) {
      navigator.share({
        title: `${branchName} (${bankInfo?.shortName || bankName})`,
        text: shareText,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareText);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    }
  };

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/60 backdrop-blur-xs"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="branch-modal-title"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8"
        >
          {/* Header Banner */}
          <div className="relative bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-900 p-6 text-white">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3.5">
                {bankInfo?.logo ? (
                  <div className="w-13 h-13 rounded-2xl bg-white p-2 flex items-center justify-center shadow-md shrink-0">
                    <img 
                      src={bankInfo.logo} 
                      alt={`${bankInfo.bankName} logo`}
                      className="w-full h-full object-contain"
                      loading="lazy"
                    />
                  </div>
                ) : (
                  <div className="w-13 h-13 rounded-2xl bg-white/10 backdrop-blur-xs flex items-center justify-center text-white shrink-0">
                    <Building2 className="w-6 h-6" />
                  </div>
                )}
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 mb-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    {t('findBanks.verifiedOfficialBranch', 'Verified Official Branch')}
                  </div>
                  <h3 id="branch-modal-title" className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug">
                    {branchName}
                  </h3>
                  <p className="text-blue-100 text-xs sm:text-sm font-medium mt-0.5">
                    {bankInfo?.bankName || bankName}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="rounded-xl p-2 text-white/80 hover:text-white hover:bg-white/10 transition-colors focus:outline-hidden focus:ring-2 focus:ring-white/40 cursor-pointer"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Distance Pill if GPS was active */}
            {(branch.distanceText || branch.distanceFormatted) && (
              <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/15 text-white text-xs font-semibold backdrop-blur-xs">
                <MapPin className="w-3.5 h-3.5 text-amber-300" />
                <span>
                  {branch.distanceText || branch.distanceFormatted}{' '}
                  {isHindi ? 'आपकी लोकेशन से दूरी' : 'away from your location'}
                </span>
                {branch.isNearest && (
                  <span className="ml-1 px-1.5 py-0.5 bg-amber-400 text-amber-950 text-[10px] font-black rounded-md uppercase">
                    {isHindi ? 'निकटतम' : 'Nearest'}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Body Content */}
          <div className="p-6 space-y-5 text-slate-800 dark:text-slate-200">
            {/* Physical Address */}
            <div className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
              <div className="text-sm">
                <div className="font-semibold text-slate-900 dark:text-white">
                  {t('findBanks.fullPhysicalAddress', 'Full Physical Address')}
                </div>
                <div className="text-slate-700 dark:text-slate-300 mt-1 leading-relaxed">
                  {branch.address}
                </div>
                <div className="text-slate-500 dark:text-slate-400 text-xs font-medium mt-1.5 flex flex-wrap items-center gap-2">
                  <span>{branch.city}, {branch.state}</span>
                  <span>•</span>
                  <span>PIN: <strong className="text-slate-700 dark:text-slate-200">{branch.pincode}</strong></span>
                </div>
              </div>
            </div>

            {/* IFSC Code Box */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-900/60">
              <div>
                <div className="text-xs font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wider">
                  {isHindi ? 'RBI IFSC कोड' : 'RBI IFSC CODE'}
                </div>
                <div className="text-lg font-mono font-bold text-slate-900 dark:text-white mt-0.5 tracking-wide">
                  {branch.ifsc || (isHindi ? 'उपलब्ध नहीं' : 'Not available')}
                </div>
              </div>
              {branch.ifsc && (
                <button
                  type="button"
                  onClick={handleCopyIfsc}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  title="Copy IFSC to clipboard"
                  aria-label="Copy IFSC code"
                >
                  {copiedIfsc ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-white" />
                      {t('findBanks.ifscCopied', 'Copied!')}
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-white" />
                      {t('findBanks.copyIfsc', 'Copy IFSC')}
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Operational Info Grid (ONLY displayed if verified) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              {openingHours && (
                <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-xs text-slate-900 dark:text-white">
                      {t('findBanks.operatingHours', 'Operating Hours')}
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-normal">
                      {openingHours}
                    </div>
                  </div>
                </div>
              )}

              {branch.phone && (
                <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <Phone className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-xs text-slate-900 dark:text-white">
                      {t('findBanks.phoneSupport', 'Phone Support')}
                    </div>
                    <a 
                      href={`tel:${branch.phone.replace(/[^0-9+]/g, '')}`}
                      className="text-xs text-blue-600 dark:text-blue-400 font-medium hover:underline mt-1 block"
                    >
                      {branch.phone}
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Official Source Link */}
            {officialSource && (
              <div className="p-3.5 rounded-2xl bg-slate-100/70 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                  <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>{isHindi ? 'आधिकारिक सत्यापन:' : 'Official verification:'} {branch.verifiedOn || (isHindi ? 'नवीनतम ऑडिट' : 'Latest Audit')}</span>
                </div>
                <a
                  href={officialSource}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  <span>{t('findBanks.verifyOfficial', 'Verify on official bank source')}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}

            {/* Product Connection Section (Section 16) */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-50 to-blue-50/50 dark:from-slate-800/50 dark:to-slate-850 border border-slate-200 dark:border-slate-800">
              <div className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                {t('findBanks.exploreBankOnDCard', 'Explore {{bank}} on D.CARD', { bank: bankInfo?.shortName || (isHindi ? 'बैंक' : 'Bank') })}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Link
                  to={`/banks/${branch.bankId}`}
                  onClick={onClose}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors shadow-2xs"
                >
                  <Building2 className="w-3.5 h-3.5 text-blue-600" />
                  {isHindi ? 'बैंक प्रोफ़ाइल' : 'Bank Profile'}
                </Link>

                <Link
                  to="/cards"
                  onClick={onClose}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors shadow-2xs"
                >
                  <CreditCard className="w-3.5 h-3.5 text-indigo-600" />
                  {t('debitCards.title', 'Debit Cards')}
                </Link>

                <Link
                  to="/savings-accounts"
                  onClick={onClose}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors shadow-2xs"
                >
                  <Percent className="w-3.5 h-3.5 text-emerald-600" />
                  {t('savings.title', 'Savings Accounts')}
                </Link>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-4 sm:p-6 bg-slate-50 dark:bg-slate-900/80 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleShareBranch}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            >
              <Share2 className="w-4 h-4" />
              {copiedShare ? t('findBanks.detailsCopied', 'Details Copied!') : t('findBanks.shareBranch', 'Share Branch')}
            </button>

            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              {onViewOnMap && (
                <button
                  type="button"
                  onClick={() => onViewOnMap(branch)}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-blue-600/30 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 text-sm font-bold hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-colors cursor-pointer"
                >
                  <MapPin className="w-4 h-4 text-blue-600" />
                  <span>{t('findBanks.viewOnMap', 'View on Map')}</span>
                </button>
              )}

              <button
                type="button"
                onClick={onClose}
                className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors focus:outline-hidden focus:ring-2 focus:ring-slate-400"
              >
                {t('common.close', 'Close')}
              </button>

              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-md hover:shadow-lg transition-all focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              >
                <Navigation className="w-4 h-4" />
                {t('findBanks.getDirections', 'Get Directions')}
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
