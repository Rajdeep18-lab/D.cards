import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, CheckCircle, XCircle, RotateCcw } from 'lucide-react';

function WebsiteDisclaimerModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeclined, setIsDeclined] = useState(false);

  useEffect(() => {
    try {
      const accepted = localStorage.getItem('dcard_disclaimer_accepted');
      if (accepted !== 'true') {
        setIsOpen(true);
      }
    } catch (e) {
      setIsOpen(true);
    }
  }, []);

  const handleAccept = () => {
    try {
      localStorage.setItem('dcard_disclaimer_accepted', 'true');
    } catch (e) {
      console.warn("Could not save disclaimer acceptance to localStorage:", e);
    }
    setIsOpen(false);
    setIsDeclined(false);
  };

  const handleDecline = () => {
    setIsDeclined(true);
  };

  const handleReturn = () => {
    setIsDeclined(false);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 select-none overflow-y-auto font-sans">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-[#0F172A]/85 backdrop-blur-md z-0"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ type: 'spring', stiffness: 350, damping: 28 }}
          className="relative z-10 w-full max-w-xl my-auto rounded-3xl bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-slate-700 shadow-2xl p-6 sm:p-8 text-left transition-all duration-300"
        >
          {isDeclined ? (
            /* Declined Screen State */
            <div className="py-8 text-center space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-[#EF4444]/10 border border-[#EF4444]/20 text-[#EF4444] mx-auto">
                <XCircle className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-[#0F172A] dark:text-white">
                  Access Restricted
                </h3>
                <p className="text-xs sm:text-sm text-[#64748B] dark:text-slate-300 leading-relaxed max-w-md mx-auto font-medium">
                  You have chosen not to accept the disclaimer.
                  <br />
                  You may revisit D.CARD anytime.
                </p>
              </div>
              <button
                onClick={handleReturn}
                className="px-6 py-3 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs tracking-wider uppercase shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 mx-auto"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Return</span>
              </button>
            </div>
          ) : (
            /* Standard Disclaimer Content */
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center gap-3.5 pb-4 border-b border-[#E2E8F0] dark:border-slate-700">
                <div className="w-12 h-12 rounded-2xl bg-[#EFF6FF] dark:bg-slate-800 border border-[#2563EB]/20 text-[#2563EB] dark:text-[#60A5FA] flex items-center justify-center flex-shrink-0">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-[#2563EB] dark:text-[#60A5FA] uppercase tracking-widest block">
                    INDEPENDENT PLATFORM DISCLOSURE
                  </span>
                  <h2 className="text-2xl font-bold text-[#0F172A] dark:text-white leading-tight">
                    Important Disclaimer
                  </h2>
                </div>
              </div>

              {/* Scrollable Content */}
              <div className="space-y-4 text-xs text-[#64748B] dark:text-slate-300 leading-relaxed font-normal max-h-[55vh] overflow-y-auto pr-2">
                <p className="text-sm font-semibold text-[#0F172A] dark:text-white">
                  Welcome to D.CARD.
                </p>
                
                <p>
                  D.CARD is an independent debit card comparison and information platform designed to help users compare and understand debit cards offered by different banks.
                </p>
                
                <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-900 dark:text-amber-200 font-semibold text-xs leading-relaxed flex items-start gap-2">
                  <ShieldAlert className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <span>We are NOT a bank, financial institution, or officially affiliated or partnered with any listed bank.</span>
                </div>

                <p>
                  All debit card information, fees, benefits, eligibility criteria, and features are collected from publicly available sources and official bank websites. While we strive to keep information accurate and up to date, users should always verify the latest details directly with the respective bank before making any financial decision.
                </p>

                <p>
                  The content available on D.CARD is provided solely for informational and educational purposes and should not be considered financial, legal, investment, or professional advice.
                </p>

                <p className="font-semibold text-[#0F172A] dark:text-slate-200">
                  By clicking "Accept & Continue", you acknowledge that you have read, understood, and accepted this disclaimer.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-[#E2E8F0] dark:border-slate-700 flex flex-col sm:flex-row items-center justify-end gap-3">
                <button
                  onClick={handleDecline}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-[#64748B] dark:text-slate-300 font-bold text-xs tracking-wider uppercase transition-all cursor-pointer"
                >
                  Decline
                </button>
                <button
                  onClick={handleAccept}
                  className="w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#3B82F6] hover:opacity-95 text-white font-bold text-xs tracking-wider uppercase shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Accept & Continue</span>
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default WebsiteDisclaimerModal;
