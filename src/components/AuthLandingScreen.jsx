import React from 'react';
import { motion } from 'framer-motion';

function AuthLandingScreen({ onOpenLogin, onOpenSignup }) {
  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-[#07030a] text-white px-4 sm:px-6 py-12 select-none">
      {/* Dynamic Animated Ambient Background Orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.25, 1],
            rotate: [0, 90, 0],
            x: [-50, 50, -50],
            y: [-30, 40, -30],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-gradient-to-br from-[#C21875]/30 to-[#860038]/20 blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.1, 1, 1.1],
            rotate: [90, 0, 90],
            x: [40, -40, 40],
            y: [50, -50, 50],
          }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-gradient-to-tr from-[#7A0F52]/30 to-[#C21875]/20 blur-3xl"
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-r from-purple-900/10 to-pink-900/10 blur-[120px]" />
      </div>

      {/* Subtle Mesh Grid Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px)`,
          backgroundSize: '32px 32px'
        }}
      />

      <main className="relative z-10 max-w-xl w-full text-center">
        {/* Glassmorphism Card */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-[36px] bg-[#140816]/75 backdrop-blur-2xl border border-secondary/20 p-8 sm:p-12 shadow-[0_30px_90px_rgba(134,0,56,0.35)] relative overflow-hidden"
        >
          {/* Top Subtle Border Highlight Pill */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-[2px] bg-gradient-to-r from-transparent via-[#C21875] to-transparent" />

          {/* D.Card Logo Badge */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 350, damping: 25, delay: 0.1 }}
            className="mx-auto w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-br from-[#860038] via-[#C21875] to-[#7A0F52] border border-white/20 p-0.5 flex items-center justify-center shadow-[0_12px_35px_rgba(194,24,117,0.4)] mb-6"
          >
            <div className="w-full h-full rounded-[22px] bg-[#0c050c] flex items-center justify-center">
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 8.5C2 6.01472 4.01472 4 6.5 4H17.5C19.9853 4 22 6.01472 22 8.5V15.5C22 17.9853 19.9853 20 17.5 20H6.5C4.01472 20 2 17.9853 2 15.5V8.5Z" stroke="#F5D9E8" strokeWidth="2" />
                <path d="M6 8H10" stroke="#C21875" strokeWidth="2" strokeLinecap="round" />
                <circle cx="17.5" cy="15.5" r="1.5" fill="#F5D9E8" />
              </svg>
            </div>
          </motion.div>

          {/* Tagline Badge */}
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-secondary/10 border border-secondary/25 text-[#F5D9E8] text-[11px] font-black tracking-widest uppercase mb-4 shadow-sm">
            ✨ NEXT-GEN BANKING INTELLIGENCE
          </span>

          {/* Main Welcome Heading */}
          <h1 className="text-3xl sm:text-4xl font-black font-serif tracking-tight text-white leading-tight mb-3">
            Welcome to <span className="text-gradient">D.Card</span>
          </h1>

          {/* Description */}
          <p className="text-sm sm:text-base text-gray-300 font-sans font-medium leading-relaxed mb-8 max-w-md mx-auto">
            Discover, compare, and audit Indian debit cards with 100% transparent fee breakdowns, reward calculators, and personalized recommendations.
          </p>

          {/* Action Buttons */}
          <div className="space-y-3 sm:space-y-0 sm:flex sm:items-center sm:gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.03, boxShadow: "0 10px 30px rgba(194,24,117,0.4)" }}
              whileTap={{ scale: 0.97 }}
              onClick={onOpenLogin}
              className="w-full sm:w-auto flex-1 py-4 px-8 rounded-full bg-gradient-to-r from-[#860038] via-[#C21875] to-[#7A0F52] text-white font-extrabold text-sm tracking-wide shadow-lg border border-white/20 cursor-pointer transition-all"
            >
              Sign In 🚀
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03, backgroundColor: "rgba(255, 255, 255, 0.12)" }}
              whileTap={{ scale: 0.97 }}
              onClick={onOpenSignup}
              className="w-full sm:w-auto flex-1 py-4 px-8 rounded-full bg-white/5 hover:bg-white/10 text-white font-extrabold text-sm tracking-wide border border-white/15 cursor-pointer backdrop-blur-md transition-all"
            >
              Create Account ✨
            </motion.button>
          </div>

          {/* Security Guarantee Pill */}
          <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-center gap-6 text-[11px] font-bold text-gray-400">
            <span className="flex items-center gap-1.5">
              <span className="text-emerald-400">🛡️</span> Bank-Grade Security
            </span>
            <span className="flex items-center gap-1.5">
              <span className="text-amber-400">⚡</span> Instant Verification
            </span>
            <span className="flex items-center gap-1.5">
              <span className="text-roseGold">🔒</span> 256-Bit Encrypted
            </span>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

export default AuthLandingScreen;
