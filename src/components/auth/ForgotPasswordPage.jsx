import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import AuthLayout from './AuthLayout';
import AuthInput from './AuthInput';
import AuthButton from './AuthButton';

/**
 * ForgotPasswordPage — Full page component for password recovery.
 */
export default function ForgotPasswordPage() {
  const { forgotPassword } = useAuth();

  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const trimmed = email.trim();
    if (!trimmed) {
      setError('Please enter your email address');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    try {
      await forgotPassword(trimmed);
      setIsSubmitted(true);
    } catch (err) {
      const code = err?.code || '';
      if (code === 'auth/user-not-found') {
        // For security, don't necessarily reveal non-existent user, but give clear info
        setError('No account found associated with this email address.');
      } else {
        setError(err?.message || 'Failed to send recovery email. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout mode="forgot">
      <div className="w-full">
        {!isSubmitted ? (
          <div>
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white mb-2">
                Reset your password
              </h1>
              <p className="text-sm text-slate-400">
                Enter the email address tied to your D.CARD account and we'll send you a secure link to reset your credentials.
              </p>
            </div>

            {/* Error banner */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3 text-rose-300 text-sm"
                  role="alert"
                >
                  <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  <div className="flex-1 font-medium">{error}</div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Reset Form */}
            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              <AuthInput
                id="reset-email"
                name="email"
                type="email"
                label="Email address"
                placeholder="name@example.com"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError('');
                }}
                error={error}
                icon={Mail}
                disabled={isSubmitting}
              />

              <div className="pt-2">
                <AuthButton
                  type="submit"
                  loading={isSubmitting}
                  loadingText="Sending reset link..."
                >
                  Send Reset Link
                </AuthButton>
              </div>
            </form>

            <div className="mt-8 pt-6 border-t border-slate-800/80 text-center">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Return to Sign In</span>
              </Link>
            </div>
          </div>
        ) : (
          /* Confirmation State */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-4"
          >
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-500/5">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h2 className="text-2xl font-black text-white tracking-tight mb-2">
              Check your inbox
            </h2>
            <p className="text-sm text-slate-400 max-w-sm mx-auto mb-6 leading-relaxed">
              We've dispatched password recovery instructions to{' '}
              <span className="text-white font-semibold">{email}</span>.
            </p>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-400 text-left space-y-2 mb-6">
              <p className="font-semibold text-slate-300">Didn't receive the email?</p>
              <ul className="list-disc pl-4 space-y-1 text-slate-400">
                <li>Check your Spam or Promotions folder</li>
                <li>Make sure you entered your correct registered address</li>
                <li>Links remain valid for 1 hour for security</li>
              </ul>
            </div>

            <div className="space-y-3">
              <AuthButton
                type="button"
                variant="ghost"
                onClick={() => setIsSubmitted(false)}
              >
                Try another email
              </AuthButton>

              <Link
                to="/login"
                className="block text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors pt-2"
              >
                Back to Sign In
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </AuthLayout>
  );
}
