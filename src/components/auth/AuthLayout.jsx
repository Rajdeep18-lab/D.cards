import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { CreditCard, ArrowLeft } from 'lucide-react';
import AuthBrandPanel from './AuthBrandPanel';

/**
 * AuthLayout — Split 2-column layout for D.CARD authentication pages.
 * Left: Rich branding & trust panel (hidden on mobile, visible on desktop)
 * Right: Clean, centered, accessible auth form container
 */
export default function AuthLayout({ children, mode = 'login' }) {
  return (
    <div className="min-h-screen w-full flex bg-[#070b14] text-slate-100 selection:bg-blue-600 selection:text-white font-sans relative overflow-hidden">
      {/* Background ambient lighting effects */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none -mr-48 -mt-48" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-3xl pointer-events-none -mb-32" />

      {/* Left Branding Panel (Desktop Only) */}
      <div className="hidden lg:flex lg:w-[48%] xl:w-[45%] flex-col relative z-10 border-r border-slate-800/80">
        <AuthBrandPanel />
      </div>

      {/* Right Form Area */}
      <div className="flex-1 flex flex-col justify-between min-h-screen relative z-10 overflow-y-auto px-4 sm:px-8 md:px-12 lg:px-14 xl:px-20 py-8">
        {/* Mobile Header (Shown when brand panel is hidden) */}
        <div className="flex items-center justify-between pb-6 mb-2 lg:mb-0 border-b border-slate-800/60 lg:border-transparent">
          <Link
            to="/"
            className="flex items-center gap-2.5 group transition-transform duration-150 active:scale-95"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-500 flex items-center justify-center shadow-md shadow-blue-600/30 ring-1 ring-white/20">
              <CreditCard className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-white group-hover:text-blue-400 transition-colors">
                D.<span className="text-blue-500">CARD</span>
              </span>
              <span className="hidden sm:block text-[10px] font-semibold tracking-wider uppercase text-slate-400">
                Banking & Card Intelligence
              </span>
            </div>
          </Link>

          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white px-3 py-1.5 rounded-lg border border-slate-800 hover:border-slate-700 bg-slate-900/60 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Center Main Form */}
        <div className="my-auto py-6 w-full max-w-md mx-auto">
          <motion.div
            key={mode}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          >
            {children}
          </motion.div>
        </div>

        {/* Footer info bar */}
        <div className="pt-6 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500 text-center sm:text-left">
          <span>&copy; {new Date().getFullYear()} D.CARD Financial Technologies. All rights reserved.</span>
          <div className="flex items-center gap-4 text-slate-400">
            <Link to="/" className="hover:text-blue-400 transition-colors">Terms of Service</Link>
            <span>&bull;</span>
            <Link to="/" className="hover:text-blue-400 transition-colors">Privacy Policy</Link>
            <span>&bull;</span>
            <Link to="/" className="hover:text-blue-400 transition-colors">Security</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
