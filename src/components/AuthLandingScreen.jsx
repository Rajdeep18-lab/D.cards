import React from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Shield, Zap, Lock, LogIn, UserPlus } from 'lucide-react';

function AuthLandingScreen({ onOpenLogin, onOpenSignup }) {
  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-[#0F172A] text-white px-4 sm:px-6 py-12 select-none">
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
          className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-gradient-to-br from-[#2563EB]/25 to-[#3B82F6]/15 blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.1, 1, 1.1],
            rotate: [90, 0, 90],
            x: [40, -40, 40],
            y: [50, -50, 50],
          }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-gradient-to-tr from-[#1E40AF]/30 to-[#60A5FA]/20 blur-3xl"
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-r from-blue-900/10 to-indigo-900/10 blur-[120px]" />
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
          className="rounded-[36px] bg-[#1E293B]/80 backdrop-blur-2xl border border-[#334155] p-8 sm:p-12 shadow-[0_30px_90px_rgba(15,23,42,0.5)] relative overflow-hidden text-left sm:text-center"
        >
          {/* Top Subtle Border Highlight Pill */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-[2px] bg-gradient-to-r from-transparent via-[#2563EB] to-transparent" />

          {/* D.Card Logo Badge */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 350, damping: 25, delay: 0.1 }}
            className="mx-auto w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-br from-[#2563EB] via-[#3B82F6] to-[#60A5FA] border border-white/20 p-0.5 flex items-center justify-center shadow-lg shadow-[#2563EB]/30 mb-6"
          >
            <div className="w-full h-full rounded-[22px] bg-[#0F172A] flex items-center justify-center">
              <CreditCard className="w-8 h-8 text-[#60A5FA]" />
            </div>
          </motion.div>

          {/* Tagline Badge */}
          <div className="text-center">
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#2563EB]/15 border border-[#2563EB]/30 text-[#60A5FA] text-[11px] font-bold tracking-widest uppercase mb-4 shadow-sm">
              <Zap className="w-3.5 h-3.5" /> NEXT-GEN BANKING INTELLIGENCE
            </span>
          </div>

          {/* Main Welcome Heading */}
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight mb-3 text-center">
            Welcome to <span className="text-gradient">D.CARD</span>
          </h1>

          {/* Description */}
          <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed mb-8 max-w-md mx-auto text-center">
            Discover, compare, and audit Indian debit cards with 100% transparent fee breakdowns, reward calculators, and personalized recommendations.
          </p>

          {/* Action Buttons */}
          <div className="space-y-3 sm:space-y-0 sm:flex sm:items-center sm:gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onOpenLogin}
              className="w-full sm:w-auto flex-1 py-3.5 px-8 rounded-full bg-gradient-to-r from-[#2563EB] to-[#3B82F6] text-white font-semibold text-xs uppercase tracking-wider shadow-lg shadow-[#2563EB]/30 border border-white/20 cursor-pointer transition-all flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onOpenSignup}
              className="w-full sm:w-auto flex-1 py-3.5 px-8 rounded-full bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs uppercase tracking-wider border border-slate-700 cursor-pointer transition-all flex items-center justify-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>Create Account</span>
            </motion.button>
          </div>

          {/* Security Guarantee Pill */}
          <div className="mt-8 pt-6 border-t border-slate-800 flex flex-wrap items-center justify-center gap-6 text-[11px] font-semibold text-slate-400">
            <span className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-emerald-400" /> Bank-Grade Security
            </span>
            <span className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" /> Instant Verification
            </span>
            <span className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-[#60A5FA]" /> 256-Bit Encrypted
            </span>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

export default AuthLandingScreen;
