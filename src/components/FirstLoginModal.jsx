import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, CreditCard, ArrowRight } from 'lucide-react';

function FirstLoginModal({ isOpen, onClose, userName }) {
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
      <div className="fixed inset-0 z-[1300] flex items-center justify-center bg-[#0F172A]/80 backdrop-blur-md p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative max-w-lg w-full rounded-[36px] bg-[#1E293B] border border-slate-700 p-8 sm:p-10 text-center shadow-2xl overflow-hidden text-white"
        >
          {/* Ambient Lighting Blobs */}
          <div className="absolute -top-20 -left-20 w-44 h-44 rounded-full bg-[#2563EB]/30 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -right-20 w-44 h-44 rounded-full bg-[#3B82F6]/30 blur-3xl pointer-events-none" />

          {/* Welcome Badge Icon */}
          <motion.div
            initial={{ rotate: -15, scale: 0 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="mx-auto w-20 h-20 rounded-3xl bg-white/10 border border-white/30 p-3 flex items-center justify-center shadow-lg shadow-[#2563EB]/30 mb-6 select-none"
          >
            <img src="/logo-mark.png" alt="D.CARD Mark" className="w-full h-full object-contain" />
          </motion.div>

          <h2 className="text-3xl font-bold text-white tracking-tight mb-2">
            Welcome to D.CARD{userName ? `, ${userName}` : ''}!
          </h2>

          <p className="text-sm text-[#60A5FA] font-semibold mb-4">
            "Let's help you find the perfect debit card."
          </p>

          <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed mb-8 max-w-md mx-auto">
            Your personalized dashboard is ready. Filter cards by your life segment, calculate cashback rewards, audit hidden bank charges, and bookmark top cards.
          </p>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            onClick={onClose}
            className="w-full py-4 rounded-full bg-gradient-to-r from-[#2563EB] to-[#3B82F6] text-white font-semibold text-xs tracking-wider uppercase shadow-md border border-white/20 cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Start Exploring Now</span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default FirstLoginModal;
