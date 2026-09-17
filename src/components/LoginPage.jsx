import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Check, AlertCircle, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

function LoginPage({ onSwitchToSignup, onSwitchToForgot, onSuccess }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [capsLockActive, setCapsLockActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loginSuccessState, setLoginSuccessState] = useState(null);

  useEffect(() => {
    try {
      const savedEmail = localStorage.getItem('dcard_remember_email');
      if (savedEmail) {
        setEmail(savedEmail);
      }
    } catch (e) {
      console.warn('localStorage read error:', e);
    }
  }, []);

  const handleKeyDownPassword = (e) => {
    if (e.getModifierState) {
      setCapsLockActive(e.getModifierState('CapsLock'));
    }
  };

  const isEmailValid = email.length > 3 && email.includes('@') && email.includes('.');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please provide both email and password.');
      return;
    }

    setErrorMsg('');
    setLoading(true);

    try {
      const userRes = await login(email, password);
      if (rememberMe) {
        localStorage.setItem('dcard_remember_email', email);
      } else {
        localStorage.removeItem('dcard_remember_email');
      }

      // Trigger Success Screen
      setLoginSuccessState(userRes?.displayName || email.split('@')[0] || 'User');
      setTimeout(() => {
        if (onSuccess) onSuccess();
      }, 1800);
    } catch (err) {
      setErrorMsg(err.message || 'Invalid login credentials. Please try again.');
      setLoading(false);
    }
  };

  if (loginSuccessState) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="py-12 px-4 text-center space-y-5 select-none"
      >
        <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(16,185,129,0.3)] animate-bounce">
          <Check className="w-10 h-10 stroke-[3]" />
        </div>
        <div className="space-y-2">
          <span className="px-3.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-black uppercase tracking-widest border border-emerald-500/20">
            Authentication Verified
          </span>
          <h2 className="text-2xl font-extrabold text-[#1F2937] dark:text-white tracking-tight">
            Welcome back, {loginSuccessState} 👋
          </h2>
          <p className="text-xs text-[#6B7280] dark:text-slate-400 font-medium">
            Preparing your personalized banking dashboard...
          </p>
        </div>
        <div className="w-48 h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 mx-auto overflow-hidden">
          <div className="h-full bg-gradient-to-r from-[#2563EB] to-emerald-500 w-full animate-[marquee_1.8s_linear_infinite]" />
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="w-full text-left select-none space-y-6"
    >
      {/* Header */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1F2937] dark:text-white tracking-tight flex items-center gap-2">
          Welcome Back 👋
        </h2>
        <p className="text-xs sm:text-sm text-[#6B7280] dark:text-slate-400 font-normal mt-1">
          Continue your intelligent banking journey.
        </p>
      </div>

      {errorMsg && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: [0, -8, 8, -8, 8, 0] }}
          transition={{ duration: 0.4 }}
          className="bg-rose-500/10 border border-rose-500/25 text-rose-600 dark:text-rose-400 rounded-2xl p-3.5 text-xs font-semibold flex items-center gap-2.5"
        >
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Floating Label Email Input */}
        <div>
          <label htmlFor="login-email" className="block text-[11px] font-extrabold text-[#1F2937] dark:text-slate-300 uppercase tracking-wider mb-1.5">
            Email Address
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-[#6B7280] absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              id="login-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-2xl border border-[#E5E7EB] dark:border-slate-800 bg-[#F8FAFC] dark:bg-slate-900/60 pl-11 pr-10 py-3 text-xs font-semibold text-[#1F2937] dark:text-white outline-none focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/15 transition-all"
              placeholder="name@example.com"
            />
            {isEmailValid && (
              <Check className="w-4 h-4 text-emerald-500 absolute right-3.5 top-1/2 -translate-y-1/2 stroke-[3]" />
            )}
          </div>
        </div>

        {/* Floating Label Password Input */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label htmlFor="login-password" className="block text-[11px] font-extrabold text-[#1F2937] dark:text-slate-300 uppercase tracking-wider">
              Password
            </label>
            <button
              type="button"
              onClick={onSwitchToForgot}
              className="text-[11px] font-bold text-[#2563EB] dark:text-[#60A5FA] hover:underline cursor-pointer"
            >
              Forgot Password?
            </button>
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 text-[#6B7280] absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDownPassword}
              className="w-full rounded-2xl border border-[#E5E7EB] dark:border-slate-800 bg-[#F8FAFC] dark:bg-slate-900/60 pl-11 pr-11 py-3 text-xs font-semibold text-[#1F2937] dark:text-white outline-none focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/15 transition-all"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-[#2563EB] transition-colors p-1"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {capsLockActive && (
            <p className="text-[10.5px] font-bold text-amber-500 mt-1 flex items-center gap-1">
              ⚠️ Caps Lock is active
            </p>
          )}
        </div>

        {/* Remember Me Custom Checkbox */}
        <div className="flex items-center justify-between py-0.5">
          <label className="flex items-center gap-2.5 text-xs text-[#6B7280] dark:text-slate-300 font-medium cursor-pointer select-none">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-[#2563EB] focus:ring-[#2563EB] cursor-pointer"
            />
            <span>Remember me on this device</span>
          </label>
        </div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={loading}
          whileHover={{ scale: loading ? 1 : 1.015 }}
          whileTap={{ scale: loading ? 1 : 0.98 }}
          className="w-full mt-2 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#2563EB] via-[#3B82F6] to-[#2563EB] text-xs font-extrabold text-white uppercase tracking-wider shadow-lg shadow-[#2563EB]/30 hover:shadow-xl hover:shadow-[#2563EB]/40 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Verifying Credentials...</span>
            </>
          ) : (
            <>
              <span>Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </motion.button>
      </form>

      {/* Switch to Signup */}
      <div className="text-center text-xs font-semibold text-[#6B7280] dark:text-slate-400 pt-2 border-t border-[#E5E7EB] dark:border-slate-800">
        Don't have an account?{' '}
        <button
          type="button"
          onClick={onSwitchToSignup}
          className="text-[#2563EB] dark:text-[#60A5FA] font-bold hover:underline cursor-pointer"
        >
          Create Account ✨
        </button>
      </div>
    </motion.div>
  );
}

export default LoginPage;
