import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Zap, Heart, Bell, Lock, X } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import LoginPage from './LoginPage';
import SignupPage from './SignupPage';
import ForgotPasswordModal from './ForgotPasswordModal';

function AuthModal({ isOpen, onClose, onSuccessAction }) {
  const { authModalInitialTab } = useAuth();
  const [activeTab, setActiveTab] = useState('login'); // 'login' | 'signup' | 'forgot'

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
      className="fixed inset-0 z-[1200] flex items-center justify-center bg-[#0F172A]/80 backdrop-blur-2xl transition-all duration-300 p-3 sm:p-4 select-none"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative w-full max-w-4xl overflow-hidden rounded-[36px] bg-white dark:bg-[#0F172A] shadow-[0_25px_80px_rgba(15,23,42,0.45)] border border-[#E5E7EB] dark:border-slate-800 grid grid-cols-1 md:grid-cols-12 m-2 max-h-[90vh] overflow-y-auto custom-scrollbar text-left"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close Authentication Modal"
          className="absolute right-5 top-5 w-8 h-8 rounded-full bg-[#F8FAFC] dark:bg-slate-800 border border-[#E5E7EB] dark:border-slate-700 flex items-center justify-center text-[#6B7280] dark:text-slate-300 hover:text-[#2563EB] transition-colors focus:outline-none cursor-pointer z-30 shadow-sm"
        >
          <X className="w-4 h-4" />
        </button>

        {/* ── LEFT SHOWCASE PANEL (3D Debit Card & Perks) ── */}
        <div className="hidden md:flex md:col-span-5 p-8 bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] text-white flex-col justify-between relative overflow-hidden border-r border-slate-800">
          {/* Ambient Lighting Orbs */}
          <div className="absolute -left-16 -top-16 w-48 h-48 rounded-full bg-[#2563EB]/30 blur-3xl pointer-events-none" />
          <div className="absolute -right-16 -bottom-16 w-48 h-48 rounded-full bg-[#3B82F6]/30 blur-3xl pointer-events-none" />

          {/* Top Brand Tag */}
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-6">
              <img src="/logo-mark.png" alt="D.CARD Mark" className="w-8 h-8 object-contain" />
              <span className="text-lg font-bold tracking-tight text-gradient">D.CARD Privilege</span>
            </div>

            {/* 3D Metallic Card Mockup */}
            <motion.div
              whileHover={{ rotateY: 10, rotateX: -5, scale: 1.03 }}
              className="w-full aspect-[1.586/1] rounded-2xl p-5 mb-6 relative overflow-hidden border border-white/20 shadow-2xl flex flex-col justify-between cursor-pointer select-none"
              style={{
                background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #2563EB 100%)',
                boxShadow: '0 20px 40px rgba(37, 99, 235, 0.4)'
              }}
            >
              <div className="flex justify-between items-start z-10">
                <span className="text-xs font-bold tracking-widest uppercase">D.CARD PRIVILEGE</span>
                <span className="font-semibold text-[10px] bg-white/20 px-2 py-0.5 rounded border border-white/20">RuPay</span>
              </div>

              <div className="w-10 h-7 rounded bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 border border-amber-300/40 relative overflow-hidden z-10">
                <div className="absolute inset-0 bg-black/10 grid grid-cols-2 gap-0.5 p-0.5" />
              </div>

              <div className="z-10">
                <p className="font-bold text-xs tracking-widest text-white/90 drop-shadow">4000 •••• •••• 9928</p>
                <div className="flex justify-between items-end mt-1 text-[10px] text-white/80 font-semibold uppercase">
                  <span>MEMBER ACCESS</span>
                  <span>VERIFIED</span>
                </div>
              </div>
            </motion.div>

            <h3 className="text-xl font-bold tracking-tight leading-snug">
              Unlock Intelligent Debit Card Intelligence
            </h3>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed font-normal">
              Join thousands comparing charges, lounge perks, and cashback rewards across all major Indian banks.
            </p>
          </div>

          {/* Privilege Highlights List */}
          <div className="relative z-10 space-y-3 pt-6 border-t border-slate-800 text-xs font-medium text-slate-200">
            <div className="flex items-center gap-2.5">
              <Shield className="w-4 h-4 text-[#60A5FA]" />
              <span>Bank-Grade 256-bit Security</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Zap className="w-4 h-4 text-[#60A5FA]" />
              <span>1-Click Side-by-Side Card Comparison</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Heart className="w-4 h-4 text-[#60A5FA]" />
              <span>Unlimited Wishlist & Saved Cards</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Bell className="w-4 h-4 text-[#60A5FA]" />
              <span>Zero-Spam Fee & Perk Change Alerts</span>
            </div>
          </div>
        </div>

        {/* ── RIGHT FORM PANEL (Sign In & Sign Up) ── */}
        <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between relative">
          <div>
            {/* Header Badge */}
            {authModalInitialTab === 'required' && (
              <div className="mb-4 text-center sm:text-left">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#2563EB]/10 text-[#2563EB] dark:text-[#60A5FA] border border-[#2563EB]/20 text-[10px] font-semibold uppercase tracking-widest">
                  <Lock className="w-3 h-3" /> Login Required to Save & Compare
                </span>
              </div>
            )}

            {/* Auth Mode Tabs Switcher */}
            <div className="flex bg-[#F8FAFC] dark:bg-slate-800 rounded-2xl p-1 mb-6 border border-[#E5E7EB] dark:border-slate-700 select-none max-w-sm">
              <button
                type="button"
                onClick={() => setActiveTab('login')}
                className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  activeTab === 'login'
                    ? 'bg-white dark:bg-[#0F172A] text-[#2563EB] dark:text-[#60A5FA] shadow-sm border border-[#E5E7EB] dark:border-slate-700'
                    : 'text-[#6B7280] dark:text-slate-400'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('signup')}
                className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  activeTab === 'signup'
                    ? 'bg-white dark:bg-[#0F172A] text-[#2563EB] dark:text-[#60A5FA] shadow-sm border border-[#E5E7EB] dark:border-slate-700'
                    : 'text-[#6B7280] dark:text-slate-400'
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Dynamic Form Render */}
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

          {/* Continue Browsing Footer Link */}
          <div className="mt-6 pt-4 border-t border-[#E5E7EB] dark:border-slate-800 text-center">
            <button
              onClick={onClose}
              className="text-xs font-semibold text-[#6B7280] dark:text-slate-400 hover:text-[#2563EB] dark:hover:text-[#60A5FA] transition-colors cursor-pointer"
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
