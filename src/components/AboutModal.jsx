import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Building2, ShieldCheck, Target, Rocket, X } from 'lucide-react';

function AboutModal({ isOpen, onClose }) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Modal Overlay Container */}
          <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4 sm:p-6 overflow-y-auto pointer-events-auto select-none">
            {/* Backdrop */}
            <motion.div
              key="about-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-[#0F172A]/75 backdrop-blur-md z-0"
            />

            {/* Modal Box */}
            <motion.div
              key="about-modal"
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 350, damping: 28 }}
              className="relative z-10 w-full max-w-[820px] max-h-[90vh] my-auto flex flex-col rounded-[28px] bg-white dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-slate-700 shadow-2xl backdrop-blur-xl overflow-hidden custom-scrollbar"
            >
              {/* Modal Header */}
              <div className="p-6 sm:px-8 sm:py-6 flex items-center justify-between flex-shrink-0 border-b border-[#E5E7EB] dark:border-slate-800">
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-[#2563EB] text-white flex items-center justify-center shadow-md shadow-[#2563EB]/25 flex-shrink-0">
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-left">
                    <h2 className="text-xl sm:text-2xl font-bold text-[#1F2937] dark:text-white leading-tight">
                      About D.CARD & Platform Profile
                    </h2>
                    <p className="text-xs text-[#2563EB] dark:text-[#60A5FA] font-semibold mt-0.5">
                      Independent Banking Discovery & Financial Information Platform
                    </p>
                  </div>
                </div>

                <button
                  onClick={onClose}
                  className="w-9 h-9 rounded-full border border-[#E5E7EB] dark:border-slate-700 bg-[#F8FAFC] dark:bg-slate-800 text-[#6B7280] dark:text-slate-300 hover:text-[#2563EB] dark:hover:text-[#60A5FA] flex items-center justify-center transition-colors outline-none cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable Content Area */}
              <div className="p-6 sm:p-8 overflow-y-auto text-left space-y-6 flex-grow custom-scrollbar">
                {/* Platform Story */}
                <div className="p-6 rounded-3xl bg-[#EFF6FF] dark:bg-slate-800/80 border border-[#2563EB]/20 space-y-3">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-[#2563EB]" />
                    <h3 className="text-base font-bold text-[#1F2937] dark:text-white">
                      Our Core Purpose
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-[#2563EB] dark:text-[#60A5FA] font-semibold leading-relaxed">
                    "Most Indians open bank accounts without understanding debit cards. D.CARD helps consumers choose the right debit card before opening an account."
                  </p>
                  <p className="text-xs text-[#6B7280] dark:text-slate-300 leading-relaxed font-normal">
                    Every day, thousands of account holders apply for banking services attracted by high-decibel advertisements showcasing complimentary airport lounge access, dining vouchers, or cashback rewards. But the reality is buried inside 60-page PDF schedules of charges.
                  </p>
                  <p className="text-xs text-[#6B7280] dark:text-slate-300 leading-relaxed font-normal">
                    Average balance non-maintenance penalties, hidden quarterly SMS charges, transaction decline fees, and foreign currency markup fees slice away savings. D.CARD was built to level the playing field through algorithmic, unbiased auditing.
                  </p>
                </div>

                {/* Mission & Vision Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-[#E5E7EB] dark:border-slate-800 shadow-sm space-y-2">
                    <div className="flex items-center gap-2">
                      <Target className="w-5 h-5 text-[#2563EB]" />
                      <h4 className="text-sm font-bold text-[#1F2937] dark:text-white">
                        Our Mission
                      </h4>
                    </div>
                    <p className="text-xs text-[#6B7280] dark:text-slate-400 leading-relaxed font-normal">
                      To empower every Indian banking customer with 100% transparent fee breakdowns, audited debit card limits, and real-time algorithmic feature match scores before signing account agreements.
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-[#E5E7EB] dark:border-slate-800 shadow-sm space-y-2">
                    <div className="flex items-center gap-2">
                      <Rocket className="w-5 h-5 text-[#2563EB]" />
                      <h4 className="text-sm font-bold text-[#1F2937] dark:text-white">
                        Our Vision
                      </h4>
                    </div>
                    <p className="text-xs text-[#6B7280] dark:text-slate-400 leading-relaxed font-normal">
                      To become India's primary independent capital discovery engine, eliminating hidden banking penalties and elevating consumer financial awareness nationwide.
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-5 sm:px-8 border-t border-[#E5E7EB] dark:border-slate-800 flex justify-end flex-shrink-0">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#3B82F6] text-white text-xs font-bold hover:opacity-95 transition-all shadow-md cursor-pointer"
                >
                  Close Profile
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

export default AboutModal;fault AboutModal;
