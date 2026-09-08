import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { X, ArrowRight, Scale } from 'lucide-react';
import DebitCardVisual from './DebitCardVisual';
import { debitCards } from '../data/mockData';

const DISMISSAL_STORAGE_KEY = 'dcard_cotm_dismissed';

function CardOfTheMonthPopup({
  activeCardsList = [],
  onViewDetails,
  toggleCompareQueue,
  compareQueue = []
}) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  // Retrieve Kotak 811 Debit Card exclusively from verified existing dataset
  const kotakCard = useMemo(() => {
    const list = activeCardsList && activeCardsList.length > 0 ? activeCardsList : debitCards;
    return (
      list.find(c => c.id === 48) ||
      list.find(c => 
        String(c.bank || '').toLowerCase().includes('kotak') && 
        String(c.cardName || '').toLowerCase().includes('811')
      ) ||
      debitCards.find(c => c.id === 48) ||
      null
    );
  }, [activeCardsList]);

  // Check dismissal state on mount and trigger subtle entrance
  useEffect(() => {
    try {
      const sessionDismissed = sessionStorage.getItem(DISMISSAL_STORAGE_KEY) === 'true';
      const localDismissed = localStorage.getItem(DISMISSAL_STORAGE_KEY) === 'true';

      if (!sessionDismissed && !localDismissed) {
        // Smooth entrance delay so initial page paint settles
        const timer = setTimeout(() => {
          setIsOpen(true);
        }, 600);
        return () => clearTimeout(timer);
      }
    } catch (e) {
      console.warn("Storage check failed:", e);
      setIsOpen(true);
    }
  }, []);

  // Dismissal handler remembering session & device choice
  const handleDismiss = useCallback(() => {
    setIsOpen(false);
    try {
      sessionStorage.setItem(DISMISSAL_STORAGE_KEY, 'true');
      localStorage.setItem(DISMISSAL_STORAGE_KEY, 'true');
    } catch (e) {
      console.warn("Could not save dismissal state:", e);
    }
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleDismiss();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleDismiss]);

  // "View Card Details" CTA action
  const handleViewDetails = () => {
    handleDismiss();
    if (onViewDetails && kotakCard) {
      onViewDetails(kotakCard);
    }
  };

  // "Compare Cards" secondary action
  const handleCompareCards = () => {
    handleDismiss();
    if (toggleCompareQueue && kotakCard) {
      const isAlreadyQueued = compareQueue.some(
        c => String(c.id) === String(kotakCard.id) ||
             (String(c.bank || '').trim().toLowerCase() === String(kotakCard.bank || '').trim().toLowerCase() &&
              String(c.cardName || '').trim().toLowerCase() === String(kotakCard.cardName || '').trim().toLowerCase())
      );
      if (!isAlreadyQueued) {
        toggleCompareQueue(kotakCard);
      }
    }
    navigate('/compare');
  };

  if (!kotakCard) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed inset-0 z-[90] flex items-center justify-center p-4 sm:p-6 select-none overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="cotm-title"
        >
          {/* Subtle Dimmed Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            onClick={handleDismiss}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-0 cursor-pointer"
          />

          {/* Modal Popup Window */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 14 }}
            transition={{ type: 'spring', stiffness: 360, damping: 28 }}
            className="relative z-10 w-full max-w-xl md:max-w-2xl rounded-3xl bg-white dark:bg-[#0F172A] border border-slate-200/90 dark:border-slate-800 shadow-2xl overflow-hidden p-6 sm:p-8 my-auto text-left"
          >
            {/* Ambient Background Accents */}
            <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-amber-400/10 dark:bg-amber-500/10 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full bg-red-500/10 dark:bg-red-600/10 blur-3xl pointer-events-none" />

            {/* Accessible Top-Right Close Button */}
            <button
              onClick={handleDismiss}
              aria-label="Close Card of the Month popup"
              className="absolute top-4 right-4 sm:top-5 sm:right-5 z-30 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white flex items-center justify-center transition-colors cursor-pointer border border-slate-200 dark:border-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Content & Visual Grid */}
            <div className="flex flex-col md:flex-row items-center gap-6 sm:gap-8 relative z-10">
              
              {/* Debit Card Showcase (Main Visual Focus) */}
              <div className="w-full md:w-5/12 flex-shrink-0 flex items-center justify-center">
                <div className="w-full max-w-[280px] sm:max-w-[310px] md:max-w-none transition-transform hover:scale-[1.02] duration-200">
                  <DebitCardVisual card={kotakCard} mode="grid" />
                </div>
              </div>

              {/* Promotional Copy & Actions */}
              <div className="w-full md:w-7/12 flex flex-col justify-center space-y-3 sm:space-y-4">
                
                {/* Badge: ⭐ CARD OF THE MONTH */}
                <div>
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-400/15 border border-amber-400/40 text-amber-600 dark:text-amber-400 text-[11px] sm:text-xs font-black tracking-wider uppercase shadow-sm">
                    ⭐ CARD OF THE MONTH
                  </span>
                </div>

                {/* Subtitle & Title */}
                <div>
                  <p className="text-[11px] sm:text-xs font-extrabold text-[#2563EB] dark:text-[#60A5FA] tracking-widest uppercase">
                    Featured Debit Card
                  </p>
                  <h2 
                    id="cotm-title" 
                    className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight mt-0.5"
                  >
                    Kotak 811 Debit Card
                  </h2>
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                  Discover the Kotak 811 Debit Card and explore its features, benefits, fees and transaction limits on D.CARD.
                </p>

                {/* Action Buttons */}
                <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3">
                  {/* Primary CTA */}
                  <button
                    onClick={handleViewDetails}
                    className="flex-1 px-5 py-3 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#3B82F6] hover:from-[#1D4ED8] hover:to-[#2563EB] text-white font-extrabold text-xs tracking-wide uppercase shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                  >
                    <span>View Card Details</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  {/* Secondary Action */}
                  <button
                    onClick={handleCompareCards}
                    className="flex-1 px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-extrabold text-xs tracking-wide uppercase border border-slate-200 dark:border-slate-700 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                  >
                    <Scale className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                    <span>Compare Cards</span>
                  </button>
                </div>

              </div>

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default React.memo(CardOfTheMonthPopup);
