import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AlertCircle, CheckCircle2, Mail, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import AuthInput from './AuthInput';
import PasswordInput from './PasswordInput';
import AuthButton from './AuthButton';

/**
 * LoginForm — Modern, secure, accessible login form component for D.CARD.
 */
export default function LoginForm() {
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Target to redirect after successful login
  const from = location.state?.from?.pathname || '/';

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: true,
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  const validateForm = () => {
    const errors = {};
    const emailTrimmed = formData.email.trim();

    if (!emailTrimmed) {
      errors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrimmed)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    // Clear field-specific error as user types
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (generalError) {
      setGeneralError('');
    }
  };

  const humanizeError = (err) => {
    const code = err?.code || '';
    const message = err?.message || '';

    if (code === 'auth/user-not-found' || code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
      return 'Invalid email or password. Please verify your details.';
    }
    if (code === 'auth/too-many-requests') {
      return 'Too many failed login attempts. Please reset your password or try again later.';
    }
    if (code === 'auth/network-request-failed') {
      return 'Network connection error. Please check your internet and try again.';
    }
    if (message.includes('auth/invalid-credential') || message.includes('INVALID_LOGIN_CREDENTIALS')) {
      return 'Incorrect email or password. Please try again.';
    }
    return message || 'Authentication failed. Please try again.';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError('');

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await login(formData.email.trim(), formData.password);
      setLoginSuccess(true);
      setTimeout(() => {
        navigate(from, { replace: true });
      }, 750);
    } catch (err) {
      setGeneralError(humanizeError(err));
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGeneralError('');
    setIsGoogleSubmitting(true);
    try {
      await loginWithGoogle();
      setLoginSuccess(true);
      setTimeout(() => {
        navigate(from, { replace: true });
      }, 750);
    } catch (err) {
      if (err?.code !== 'auth/popup-closed-by-user') {
        setGeneralError(humanizeError(err));
      }
      setIsGoogleSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white mb-2">
          Welcome back
        </h1>
        <p className="text-sm text-slate-400">
          Sign in to access your saved comparisons, bank cards, and preferences.
        </p>
      </div>

      {/* Success banner */}
      <AnimatePresence>
        {loginSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3 text-emerald-300 text-sm font-medium"
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 animate-bounce" />
            <span>Successfully signed in! Taking you in...</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* General error alert */}
      <AnimatePresence>
        {generalError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3 text-rose-300 text-sm"
            role="alert"
          >
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div className="flex-1 font-medium">{generalError}</div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Google Single Sign-On Button */}
      <div className="mb-5">
        <AuthButton
          type="button"
          variant="google"
          disabled={isSubmitting || loginSuccess}
          loading={isGoogleSubmitting}
          loadingText="Connecting to Google..."
          onClick={handleGoogleSignIn}
        >
          Continue with Google
        </AuthButton>
      </div>

      {/* Divider */}
      <div className="relative flex items-center justify-center my-6">
        <div className="border-t border-slate-800 w-full" />
        <span className="bg-[#070b14] px-4 text-xs font-semibold uppercase tracking-wider text-slate-500 shrink-0">
          Or sign in with email
        </span>
        <div className="border-t border-slate-800 w-full" />
      </div>

      {/* Sign In Form */}
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {/* Email Field */}
        <AuthInput
          id="login-email"
          name="email"
          type="email"
          label="Email address"
          placeholder="name@example.com"
          autoComplete="email"
          required
          value={formData.email}
          onChange={handleChange}
          error={fieldErrors.email}
          icon={Mail}
          disabled={isSubmitting || loginSuccess}
        />

        {/* Password Field */}
        <div>
          <PasswordInput
            id="login-password"
            name="password"
            label="Password"
            placeholder="Enter your password"
            autoComplete="current-password"
            required
            value={formData.password}
            onChange={handleChange}
            error={fieldErrors.password}
            disabled={isSubmitting || loginSuccess}
          />
        </div>

        {/* Remember me & Forgot Password */}
        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center gap-2 cursor-pointer group select-none">
            <input
              type="checkbox"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
              disabled={isSubmitting || loginSuccess}
              className="w-4 h-4 rounded border-slate-700 bg-slate-800/80 text-blue-600 focus:ring-blue-500 focus:ring-offset-slate-900 cursor-pointer"
            />
            <span className="text-xs font-medium text-slate-300 group-hover:text-white transition-colors">
              Remember me
            </span>
          </label>

          <Link
            to="/forgot-password"
            className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors focus:outline-none focus:underline"
          >
            Forgot password?
          </Link>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <AuthButton
            type="submit"
            loading={isSubmitting}
            loadingText="Signing in..."
            disabled={loginSuccess || isGoogleSubmitting}
          >
            Sign In
          </AuthButton>
        </div>
      </form>

      {/* Switch to Signup */}
      <div className="mt-8 pt-6 border-t border-slate-800/80 text-center">
        <p className="text-xs sm:text-sm text-slate-400">
          Don't have an account?{' '}
          <Link
            to="/signup"
            className="font-bold text-blue-400 hover:text-blue-300 transition-colors ml-1 focus:outline-none focus:underline"
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
