import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircle, CheckCircle2, User, Mail, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import AuthInput from './AuthInput';
import PasswordInput from './PasswordInput';
import AuthButton from './AuthButton';

/**
 * SignupForm — Modern, accessible registration form component for D.CARD.
 */
export default function SignupForm() {
  const { signUp, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);

  const validateForm = () => {
    const errors = {};
    const nameTrimmed = formData.fullName.trim();
    const emailTrimmed = formData.email.trim();

    if (!nameTrimmed) {
      errors.fullName = 'Full name is required';
    } else if (nameTrimmed.length < 2) {
      errors.fullName = 'Name must be at least 2 characters';
    }

    if (!emailTrimmed) {
      errors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrimmed)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters long';
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    }

    // Live confirm password validation
    if (name === 'confirmPassword' && formData.password && value !== formData.password) {
      setFieldErrors((prev) => ({ ...prev, confirmPassword: 'Passwords do not match' }));
    } else if (name === 'confirmPassword' && value === formData.password) {
      setFieldErrors((prev) => ({ ...prev, confirmPassword: '' }));
    }

    if (generalError) {
      setGeneralError('');
    }
  };

  const humanizeError = (err) => {
    const code = err?.code || '';
    const message = err?.message || '';

    if (code === 'auth/email-already-in-use' || message.includes('email-already-in-use')) {
      return 'An account with this email address already exists. Please sign in instead.';
    }
    if (code === 'auth/weak-password') {
      return 'The password is too weak. Please use at least 6 characters including numbers and symbols.';
    }
    if (code === 'auth/network-request-failed') {
      return 'Network connection issue. Please check your internet and retry.';
    }
    return message || 'Account registration failed. Please try again.';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError('');

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await signUp({
        email: formData.email.trim(),
        password: formData.password,
        fullName: formData.fullName.trim(),
      });
      setSignupSuccess(true);
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 1500);
    } catch (err) {
      setGeneralError(humanizeError(err));
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setGeneralError('');
    setIsGoogleSubmitting(true);
    try {
      await loginWithGoogle();
      setSignupSuccess(true);
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 1000);
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
          Create an account
        </h1>
        <p className="text-sm text-slate-400">
          Join D.CARD to compare, save, and manage India's top banking cards.
        </p>
      </div>

      {/* Success banner */}
      <AnimatePresence>
        {signupSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3 text-emerald-300 text-sm font-medium"
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 animate-bounce" />
            <div>
              <p className="font-bold">Account created successfully!</p>
              <p className="text-xs text-emerald-400/80">Taking you to your new dashboard...</p>
            </div>
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
          disabled={isSubmitting || signupSuccess}
          loading={isGoogleSubmitting}
          loadingText="Connecting to Google..."
          onClick={handleGoogleSignUp}
        >
          Sign up with Google
        </AuthButton>
      </div>

      {/* Divider */}
      <div className="relative flex items-center justify-center my-6">
        <div className="border-t border-slate-800 w-full" />
        <span className="bg-[#070b14] px-4 text-xs font-semibold uppercase tracking-wider text-slate-500 shrink-0">
          Or register with email
        </span>
        <div className="border-t border-slate-800 w-full" />
      </div>

      {/* Sign Up Form */}
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {/* Full Name */}
        <AuthInput
          id="signup-name"
          name="fullName"
          type="text"
          label="Full Name"
          placeholder="e.g. Rahul Sharma"
          autoComplete="name"
          required
          value={formData.fullName}
          onChange={handleChange}
          error={fieldErrors.fullName}
          icon={User}
          disabled={isSubmitting || signupSuccess}
        />

        {/* Email Field */}
        <AuthInput
          id="signup-email"
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
          disabled={isSubmitting || signupSuccess}
        />

        {/* Password with Strength Bar */}
        <PasswordInput
          id="signup-password"
          name="password"
          label="Create Password"
          placeholder="At least 6 characters"
          autoComplete="new-password"
          required
          showStrength={true}
          value={formData.password}
          onChange={handleChange}
          error={fieldErrors.password}
          disabled={isSubmitting || signupSuccess}
        />

        {/* Confirm Password */}
        <PasswordInput
          id="signup-confirm-password"
          name="confirmPassword"
          label="Confirm Password"
          placeholder="Re-enter your password"
          autoComplete="new-password"
          required
          value={formData.confirmPassword}
          onChange={handleChange}
          error={fieldErrors.confirmPassword}
          disabled={isSubmitting || signupSuccess}
        />

        {/* Terms notice */}
        <p className="text-[11px] text-slate-500 leading-relaxed pt-1">
          By clicking <span className="text-slate-400 font-semibold">Create Account</span>, you acknowledge that you have read and agree to D.CARD's{' '}
          <Link to="/" className="text-blue-400 hover:underline">Terms of Service</Link>{' '}and{' '}
          <Link to="/" className="text-blue-400 hover:underline">Privacy Policy</Link>.
        </p>

        {/* Submit Button */}
        <div className="pt-2">
          <AuthButton
            type="submit"
            loading={isSubmitting}
            loadingText="Creating account..."
            disabled={signupSuccess || isGoogleSubmitting}
          >
            Create Account
          </AuthButton>
        </div>
      </form>

      {/* Switch to Login */}
      <div className="mt-8 pt-6 border-t border-slate-800/80 text-center">
        <p className="text-xs sm:text-sm text-slate-400">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-bold text-blue-400 hover:text-blue-300 transition-colors ml-1 focus:outline-none focus:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
