import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
      className="fixed inset-0 z-[1200] flex items-center justify-center bg-[#190916]/75 backdrop-blur-xl transition-all duration-300 p-4 select-none"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative w-full max-w-md overflow-hidden rounded-[36px] bg-cardBg dark:bg-[#0c050c] shadow-[0_25px_80px_rgba(134,0,56,0.45)] border border-highlight dark:border-secondary/25 p-6 sm:p-8 m-2 max-h-[90vh] overflow-y-auto custom-scrollbar"
      >
        {/* Glowing Background Orbs */}
        <div className="absolute -right-20 -top-20 w-48 h-48 rounded-full bg-secondary/20 blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-48 h-48 rounded-full bg-primary/20 blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close Authentication Modal"
          className="absolute right-6 top-6 w-8 h-8 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center text-textSoft dark:text-gray-300 hover:text-secondary dark:hover:text-roseGold transition-colors focus:outline-none cursor-pointer z-10"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header Badge */}
        {authModalInitialTab === 'required' && (
          <div className="mb-4 text-center">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-secondary/10 text-secondary dark:text-roseGold border border-secondary/20 text-[10px] font-black uppercase tracking-widest">
              🔒 Login Required to Continue
            </span>
          </div>
        )}

        {/* Auth Mode Tabs Switcher */}
        <div className="flex bg-slate-100 dark:bg-secondary/10 rounded-2xl p-1 mb-6 border border-slate-200/50 dark:border-secondary/15 select-none">
          <button
            type="button"
            onClick={() => setActiveTab('login')}
            className={`flex-1 py-2.5 text-xs font-black rounded-xl transition-all cursor-pointer ${
              activeTab === 'login'
                ? 'bg-white dark:bg-[#160814]/90 text-[#860038] dark:text-roseGold shadow border border-slate-100 dark:border-secondary/20'
                : 'text-textSoft dark:text-slate-400'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('signup')}
            className={`flex-1 py-2.5 text-xs font-black rounded-xl transition-all cursor-pointer ${
              activeTab === 'signup'
                ? 'bg-white dark:bg-[#160814]/90 text-[#860038] dark:text-roseGold shadow border border-slate-100 dark:border-secondary/20'
                : 'text-textSoft dark:text-slate-400'
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

        {/* Continue Browsing Footer Link */}
        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-secondary/15 text-center">
          <button
            onClick={onClose}
            className="text-xs font-bold text-textSoft dark:text-gray-400 hover:text-secondary dark:hover:text-roseGold transition-colors cursor-pointer"
          >
            Continue Browsing as Guest
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default AuthModal;
