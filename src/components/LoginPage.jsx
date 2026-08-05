import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';

function LoginPage({ onSwitchToSignup, onSwitchToForgot, onSuccess }) {
  const { login, loginWithGoogle } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please provide both email and password.');
      return;
    }

    setErrorMsg('');
    setLoading(true);

    try {
      await login(email, password);
      if (rememberMe) {
        localStorage.setItem('dcard_remember_email', email);
      } else {
        localStorage.removeItem('dcard_remember_email');
      }
      if (onSuccess) onSuccess();
    } catch (err) {
      setErrorMsg(err.message || 'Invalid login credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMsg('');
    setLoading(true);
    try {
      await loginWithGoogle();
      if (onSuccess) onSuccess();
    } catch (err) {
      setErrorMsg(err.message || 'Google Sign-In failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="w-full text-left select-none"
    >
      <div className="text-center mb-5">
        <h2 className="text-2xl sm:text-3xl font-black font-serif text-primary dark:text-accent tracking-tight">
          Sign In to D.Card
        </h2>
        <p className="text-xs text-textSoft dark:text-gray-400 font-semibold mt-1 flex items-center justify-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          <span>Firebase Authentication Active</span>
        </p>
      </div>

      {errorMsg && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-4 bg-red-500/10 border border-red-500/25 text-red-600 dark:text-red-400 rounded-2xl p-3.5 text-xs font-semibold flex items-center gap-2"
        >
          <span>⚠️</span>
          <span>{errorMsg}</span>
        </motion.div>
      )}

      {/* Firebase Google Auth Button */}
      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={loading}
        className="w-full py-3 px-4 mb-4 rounded-2xl bg-white dark:bg-white/10 border border-slate-200 dark:border-white/20 text-xs font-black text-slate-700 dark:text-white shadow-sm hover:bg-slate-50 dark:hover:bg-white/20 transition-all flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
        </svg>
        <span>Continue with Google</span>
      </button>

      <div className="relative my-4 flex items-center justify-center">
        <div className="border-t border-slate-200 dark:border-white/10 w-full" />
        <span className="bg-white dark:bg-[#0d0714] px-3 text-[10px] uppercase font-bold text-slate-400">or sign in with email</span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Address */}
        <div>
          <label htmlFor="login-email" className="block text-[10px] font-black text-secondary dark:text-roseGold uppercase tracking-widest mb-1.5 px-0.5">
            Email Address
          </label>
          <div className="relative">
            <input
              id="login-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-2xl border border-highlight dark:border-secondary/20 bg-white dark:bg-black/30 px-4 py-3 text-xs text-textDark dark:text-white font-semibold outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/30 transition-all leading-normal"
              placeholder="name@example.com"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <div className="flex justify-between items-center mb-1.5 px-0.5">
            <label htmlFor="login-password" className="block text-[10px] font-black text-secondary dark:text-roseGold uppercase tracking-widest">
              Password
            </label>
            <button
              type="button"
              onClick={onSwitchToForgot}
              className="text-[11px] font-bold text-secondary dark:text-roseGold hover:underline cursor-pointer"
            >
              Forgot Password?
            </button>
          </div>
          <div className="relative">
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-2xl border border-highlight dark:border-secondary/20 bg-white dark:bg-black/30 px-4 py-3 text-xs text-textDark dark:text-white font-semibold outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/30 transition-all pr-11 leading-normal"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label="Toggle password visibility"
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-secondary text-xs focus:outline-none p-1"
            >
              {showPassword ? '👁️' : '🙈'}
            </button>
          </div>
        </div>

        {/* Remember Me Checkbox */}
        <div className="flex items-center justify-between py-1">
          <label className="flex items-center gap-2.5 text-xs text-textSoft dark:text-gray-300 font-semibold cursor-pointer select-none">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-secondary focus:ring-secondary cursor-pointer"
            />
            <span>Remember me on this device</span>
          </label>
        </div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={loading}
          whileHover={{ scale: loading ? 1 : 1.02 }}
          whileTap={{ scale: loading ? 1 : 0.98 }}
          className="w-full mt-4 rounded-full bg-gradient-to-r from-secondary to-primary py-3.5 px-6 font-extrabold text-xs text-white tracking-widest uppercase shadow-[0_6px_25px_rgba(194,24,117,0.3)] hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block" />
              <span>Signing In...</span>
            </>
          ) : (
            <span>Sign In 🚀</span>
          )}
        </motion.button>
      </form>

      {/* Switch to Signup */}
      <div className="mt-6 text-center text-xs font-semibold text-textSoft dark:text-gray-400">
        Don't have an account?{' '}
        <button
          type="button"
          onClick={onSwitchToSignup}
          className="text-secondary dark:text-roseGold font-bold hover:underline cursor-pointer"
        >
          Create Account ✨
        </button>
      </div>
    </motion.div>
  );
}

export default LoginPage;
