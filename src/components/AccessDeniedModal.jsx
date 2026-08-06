import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Key, Home, AlertOctagon } from 'lucide-react';

function AccessDeniedModal({ isOpen, onClose, onOpenAuth }) {
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

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4 sm:p-6 bg-[#0F172A]/80 backdrop-blur-xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white dark:bg-[#1E293B] border border-[#EF4444]/30 shadow-2xl p-6 sm:p-8 text-center select-none text-left"
        >
          {/* Glowing Top Shield Badge */}
          <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-[#EF4444]/20 to-red-600/10 border border-[#EF4444]/30 flex items-center justify-center text-4xl shadow-inner mb-6 relative">
            <ShieldAlert className="w-9 h-9 text-[#EF4444]" />
            <div className="absolute inset-0 rounded-full animate-ping opacity-15 bg-[#EF4444]" />
          </div>

          <div className="text-center">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EF4444]/10 text-[#EF4444] text-[10px] font-bold tracking-widest uppercase mb-3 border border-[#EF4444]/20">
              <AlertOctagon className="w-3 h-3" /> FORBIDDEN ACCESS
            </span>

            <h2 className="text-2xl sm:text-3xl font-bold text-[#1F2937] dark:text-white tracking-tight">
              Access Restricted
            </h2>

            <p className="text-xs sm:text-sm font-normal text-[#6B7280] dark:text-slate-300 mt-3 leading-relaxed">
              Your authenticated account does not possess <strong className="text-[#1F2937] dark:text-white font-semibold">Administrator Privileges</strong> to access the D.CARD Admin Intelligence Portal or restricted API resources.
            </p>
          </div>

          <div className="mt-4 p-3.5 rounded-2xl bg-[#EF4444]/5 border border-[#EF4444]/15 text-[11px] text-[#EF4444] dark:text-red-300 font-medium text-left flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>If you believe this is an error, verify that you are logged in with your primary administrator account (<code className="font-bold underline">ritikanshu072@gmail.com</code>).</span>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={onClose}
              className="w-full py-3 px-4 rounded-xl bg-[#F8FAFC] dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-[#1F2937] dark:text-slate-200 text-xs font-semibold transition-all cursor-pointer shadow-sm active:scale-95 flex items-center justify-center gap-1.5 border border-[#E5E7EB] dark:border-slate-700"
            >
              <Home className="w-4 h-4" /> Return to Home
            </button>

            {onOpenAuth && (
              <button
                onClick={() => {
                  onClose();
                  onOpenAuth();
                }}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#3B82F6] text-white text-xs font-semibold shadow-md hover:opacity-95 transition-all cursor-pointer active:scale-95 flex items-center justify-center gap-1.5"
              >
                <Key className="w-4 h-4" /> Switch Account
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default AccessDeniedModal;
