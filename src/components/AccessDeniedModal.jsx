import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white dark:bg-[#0e0712] border border-rose-500/30 shadow-[0_25px_60px_rgba(225,29,72,0.25)] p-6 sm:p-8 text-center select-none"
        >
          {/* Glowing Top Shield Badge */}
          <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-rose-500/20 to-red-600/10 border border-rose-500/30 flex items-center justify-center text-4xl shadow-inner mb-6 relative">
            <span className="filter drop-shadow-[0_4px_12px_rgba(225,29,72,0.4)]">🚫</span>
            <div className="absolute inset-0 rounded-full animate-ping opacity-15 bg-rose-500" />
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 text-[10px] font-black tracking-widest uppercase mb-3 border border-rose-500/20">
            HTTP STATUS 403 • FORBIDDEN ACCESS
          </span>

          <h2 className="text-2xl sm:text-3xl font-black font-serif text-slate-900 dark:text-slate-100 tracking-tight">
            Access Denied
          </h2>

          <p className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-rose-200/70 mt-3 leading-relaxed">
            Your authenticated account does not possess <strong className="text-slate-800 dark:text-slate-200">Administrator Privileges</strong> to access the D.Card Admin Intelligence Portal or restricted API resources.
          </p>

          <div className="mt-4 p-3 rounded-2xl bg-rose-500/5 dark:bg-rose-950/20 border border-rose-500/15 text-[11px] text-rose-700 dark:text-rose-300 font-medium text-left flex items-start gap-2.5">
            <span className="text-sm select-none">🛡️</span>
            <span>If you believe this is an error, please verify that you are logged in with your primary administrator account (<code className="font-mono text-rose-600 dark:text-rose-400 font-bold">ritikanshu072@gmail.com</code>).</span>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={onClose}
              className="w-full py-3 px-4 rounded-2xl bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/15 text-slate-700 dark:text-slate-200 text-xs font-extrabold transition-all cursor-pointer shadow-sm active:scale-95"
            >
              🏠 Return to Home Page
            </button>

            {onOpenAuth && (
              <button
                onClick={() => {
                  onClose();
                  onOpenAuth();
                }}
                className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-rose-600 to-primary text-white text-xs font-black shadow-lg shadow-rose-600/30 hover:brightness-110 transition-all cursor-pointer active:scale-95 flex items-center justify-center gap-1.5"
              >
                <span>🔑</span> Switch Account
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default AccessDeniedModal;
