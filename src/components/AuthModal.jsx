import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Lock, X, Sparkles, Building2, CreditCard, Users, CheckCircle2, Shield, KeyRound, Globe, Award } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import LoginPage from './LoginPage';
import SignupPage from './SignupPage';
import ForgotPasswordModal from './ForgotPasswordModal';

function AuthModal({ isOpen, onClose, onSuccessAction }) {
  const { authModalInitialTab } = useAuth();
  const [activeTab, setActiveTab] = useState('login'); // 'login' | 'signup' | 'forgot'

  // 3D Card Mouse Tilt Tracking State
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50 });

  useEffect(() => {
    if (isOpen) {
      if (authModalInitialTab === 'signup') {
        setActiveTab('signup');
      } else if (authModalInitialTab === 'forgot') {
        setActiveTab('forgot');
      } else {
        setActiveTab('login');
      }
    }
  }, [authModalInitialTab, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleCardMouseMove = (e) => {
    const card = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - card.left;
    const y = e.clientY - card.top;
    const centerX = card.width / 2;
    const centerY = card.height / 2;
    
    const rX = ((y - centerY) / centerY) * -12;
    const rY = ((x - centerX) / centerX) * 12;

    setRotateX(rX);
    setRotateY(rY);
    setGlarePos({ x: (x / card.width) * 100, y: (y / card.height) * 100 });
  };

  const handleCardMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setGlarePos({ x: 50, y: 50 });
  };

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleAuthSuccess = () => {
    onClose();
    if (onSuccessAction) {
      onSuccessAction();
    }
  };

  if (activeTab === 'forgot') {
    return (
      <ForgotPasswordModal
        isOpen={isOpen}
        onClose={onClose}
        onSwitchToLogin={() => setActiveTab('login')}
      />
    );
  }

  return (
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 z-[1200] flex items-center justify-center bg-[#0F172A]/85 backdrop-blur-2xl transition-all duration-300 p-3 sm:p-5 select-none"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 20 }}
        transition={{ type: "spring", stiffness: 350, damping: 28 }}
        className="relative w-full max-w-5xl overflow-hidden rounded-[36px] bg-white dark:bg-[#0F172A] shadow-[0_25px_80px_rgba(15,23,42,0.6)] border border-[#DCE8FF] dark:border-slate-800 grid grid-cols-1 md:grid-cols-12 m-2 max-h-[92vh] overflow-y-auto custom-scrollbar text-left"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close Authentication Modal"
          className="absolute right-5 top-5 w-9 h-9 rounded-full bg-white/90 dark:bg-slate-800/90 border border-[#E5E7EB] dark:border-slate-700 flex items-center justify-center text-[#6B7280] dark:text-slate-300 hover:text-[#2563EB] hover:scale-105 transition-all focus:outline-none cursor-pointer z-40 shadow-sm"
        >
          <X className="w-4 h-4" />
        </button>

        {/* ── LEFT PANEL (45% Split - Premium Branding & Interactive 3D Card) ── */}
        <div className="hidden md:flex md:col-span-5 p-8 bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0B3D91] text-white flex-col justify-between relative overflow-hidden border-r border-slate-800/80">
          
          {/* Animated Background Mesh & Orbs */}
          <div className="absolute inset-0 bg-grid-mesh opacity-15 pointer-events-none" />
          <div className="absolute -left-20 -top-20 w-64 h-64 rounded-full bg-[#2563EB]/35 blur-3xl pointer-events-none" />
          <div className="absolute -right-20 -bottom-20 w-64 h-64 rounded-full bg-[#3B82F6]/35 blur-3xl pointer-events-none" />

          {/* Top Brand Header */}
          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-2.5">
              <img src="/logo-mark.png" alt="D.CARD Mark" className="w-9 h-9 object-contain" />
              <div>
                <span className="text-lg font-extrabold tracking-tight text-white block">D.CARD AI</span>
                <span className="text-[10px] font-bold text-[#60A5FA] uppercase tracking-widest block">Financial Intelligence</span>
              </div>
            </div>

            {/* 3D Interactive Metallic Debit Card */}
            <div className="perspective-1000 py-1">
              <motion.div
                onMouseMove={handleCardMouseMove}
                onMouseLeave={handleCardMouseLeave}
                animate={{ rotateX, rotateY }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className="w-full aspect-[1.586/1] rounded-2xl p-5 relative overflow-hidden border border-white/25 shadow-2xl flex flex-col justify-between cursor-pointer select-none gpu-layer"
                style={{
                  background: 'linear-gradient(135deg, #0B3D91 0%, #1E3A8A 50%, #2563EB 100%)',
                  boxShadow: '0 20px 45px rgba(37, 99, 235, 0.45)'
                }}
              >
                {/* Glare Light Sweep Overlay */}
                <div
                  className="absolute inset-0 pointer-events-none transition-opacity duration-300 opacity-60"
                  style={{
                    background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0) 65%)`
                  }}
                />

                <div className="flex justify-between items-start z-10">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[#60A5FA]" />
                    <span className="text-[11px] font-black tracking-widest uppercase text-white/90">D.CARD INFINITE</span>
                  </div>
                  <span className="font-extrabold text-[10px] bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-white/25">RuPay Platinum</span>
                </div>

                {/* Metallic Golden Chip */}
                <div className="w-11 h-8 rounded-lg bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 border border-amber-300/60 relative overflow-hidden z-10 shadow-sm">
                  <div className="absolute inset-0 bg-black/15 grid grid-cols-2 gap-0.5 p-0.5" />
                </div>

                <div className="z-10">
                  <p className="font-mono text-sm font-extrabold tracking-widest text-white/95 drop-shadow-md">
                    4000 •••• •••• 9928
                  </p>
                  <div className="flex justify-between items-end mt-1.5 text-[9.5px] text-white/80 font-bold uppercase tracking-wider">
                    <span>MEMBER PRIVILEGE</span>
                    <span className="text-emerald-400 font-extrabold">VERIFIED ★</span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Headline & Paragraph */}
            <div className="space-y-2">
              <h3 className="text-xl font-extrabold tracking-tight leading-snug text-white">
                Smart Banking Starts Here.
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed font-normal">
                Compare, analyze and discover India's best debit cards using AI-powered insights and verified banking intelligence.
              </p>
            </div>

            {/* Animated Statistics Counter Badges */}
            <div className="grid grid-cols-2 gap-2.5 pt-2">
              <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 text-left">
                <span className="text-sm font-extrabold text-white block">26+</span>
                <span className="text-[10px] text-slate-300 font-semibold block">Top Banks Indexed</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 text-left">
                <span className="text-sm font-extrabold text-white block">150+</span>
                <span className="text-[10px] text-slate-300 font-semibold block">Debit Cards</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 text-left">
                <span className="text-sm font-extrabold text-white block">100K+</span>
                <span className="text-[10px] text-slate-300 font-semibold block">User Comparisons</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 text-left">
                <span className="text-sm font-extrabold text-[#60A5FA] block">98%</span>
                <span className="text-[10px] text-slate-300 font-semibold block">Match Accuracy</span>
              </div>
            </div>
          </div>

          {/* Bottom Security Badges */}
          <div className="relative z-10 grid grid-cols-2 gap-2 pt-4 border-t border-slate-800/80 text-[10.5px] font-semibold text-slate-300">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#60A5FA]" />
              <span>Firebase Auth</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-[#60A5FA]" />
              <span>256-bit Encryption</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-[#60A5FA]" />
              <span>Google Secure</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-emerald-400" />
              <span>Verified Platform</span>
            </div>
          </div>
        </div>

        {/* ── RIGHT PANEL (55% Split - Auth Forms) ── */}
        <div className="md:col-span-7 p-6 sm:p-10 flex flex-col justify-between relative bg-[#F8FBFF] dark:bg-[#0F172A]">
          <div>
            {/* Mode Switcher Tabs */}
            <div className="flex bg-[#EBF2FF] dark:bg-slate-800 rounded-2xl p-1 mb-6 border border-[#DCE8FF] dark:border-slate-700 select-none max-w-sm">
              <button
                type="button"
                onClick={() => setActiveTab('login')}
                className={`flex-1 py-2.5 text-xs font-extrabold rounded-xl transition-all cursor-pointer ${
                  activeTab === 'login'
                    ? 'bg-white dark:bg-[#0F172A] text-[#2563EB] dark:text-[#60A5FA] shadow-md border border-[#DCE8FF] dark:border-slate-700'
                    : 'text-[#6B7280] dark:text-slate-400 hover:text-[#2563EB]'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('signup')}
                className={`flex-1 py-2.5 text-xs font-extrabold rounded-xl transition-all cursor-pointer ${
                  activeTab === 'signup'
                    ? 'bg-white dark:bg-[#0F172A] text-[#2563EB] dark:text-[#60A5FA] shadow-md border border-[#DCE8FF] dark:border-slate-700'
                    : 'text-[#6B7280] dark:text-slate-400 hover:text-[#2563EB]'
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Dynamic Form View */}
            <AnimatePresence mode="wait">
              {activeTab === 'login' ? (
                <LoginPage
                  key="login"
                  onSwitchToSignup={() => setActiveTab('signup')}
                  onSwitchToForgot={() => setActiveTab('forgot')}
                  onSuccess={handleAuthSuccess}
                />
              ) : (
                <SignupPage
                  key="signup"
                  onSwitchToLogin={() => setActiveTab('login')}
                  onSuccess={handleAuthSuccess}
                />
              )}
            </AnimatePresence>
          </div>

          {/* Guest Link Footer */}
          <div className="mt-8 pt-4 border-t border-[#E5E7EB] dark:border-slate-800 text-center">
            <button
              onClick={onClose}
              className="text-xs font-bold text-[#6B7280] dark:text-slate-400 hover:text-[#2563EB] dark:hover:text-[#60A5FA] transition-colors cursor-pointer"
            >
              Continue Browsing as Guest
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default AuthModal;
