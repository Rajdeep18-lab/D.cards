import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../context/ToastContext';

function EmailVerificationPage({ onVerificationComplete }) {
  const { user, resendVerification, updateEmail, logout, refreshProfile } = useAuth();
  const toast = useToast();

  const [isResending, setIsResending] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [isChangingEmail, setIsChangingEmail] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [loadingChange, setLoadingChange] = useState(false);

  const email = user?.email || '';

  const handleResend = async () => {
    if (!email) return;
    setIsResending(true);
    try {
      await resendVerification(email);
    } catch (err) {
      // Error handles in context toast
    } finally {
      setIsResending(false);
    }
  };

  const handleRefreshStatus = async () => {
    setIsChecking(true);
    try {
      const { auth } = await import('../lib/firebase');
      if (auth.currentUser) {
        await auth.currentUser.reload();
        if (auth.currentUser.emailVerified) {
          toast("🎉 Email verified successfully! Redirecting to D.Card...", "success");
          if (onVerificationComplete) onVerificationComplete();
          else window.location.hash = "#home";
        } else {
          toast("Email is not verified yet. Please check your inbox link or click Resend.", "info");
        }
      } else {
        toast("Please log in to verify your account status.", "info");
      }
    } catch (err) {
      toast("Error checking verification status.", "error");
    } finally {
      setIsChecking(false);
    }
  };

  const handleChangeEmailSubmit = async (e) => {
    e.preventDefault();
    if (!newEmail || newEmail === email) {
      toast("Please enter a new valid email address.", "warning");
      return;
    }

    setLoadingChange(true);
    try {
      await updateEmail(newEmail);
      setIsChangingEmail(false);
      setNewEmail('');
    } catch (err) {
      // Handled in context toast
    } finally {
      setLoadingChange(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#07030a] text-white px-4 py-12 select-none relative overflow-hidden">
      {/* Background Glowing Orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-secondary/20 blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full rounded-[36px] bg-[#140816]/90 backdrop-blur-2xl border border-secondary/20 p-8 sm:p-10 text-center shadow-[0_25px_80px_rgba(134,0,56,0.4)] relative z-10"
      >
        {/* Animated Mail Icon */}
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          className="mx-auto w-20 h-20 rounded-3xl bg-gradient-to-br from-secondary to-primary p-0.5 shadow-xl flex items-center justify-center mb-6"
        >
          <div className="w-full h-full rounded-[22px] bg-[#0c050c] flex items-center justify-center text-4xl">
            ✉️
          </div>
        </motion.div>

        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-300 text-[10px] font-black uppercase tracking-widest mb-3">
          ⚠️ VERIFICATION REQUIRED
        </span>

        <h2 className="text-2xl sm:text-3xl font-black font-serif text-white tracking-tight mb-2">
          Verify Your Email
        </h2>

        <p className="text-xs sm:text-sm text-gray-300 font-sans leading-relaxed mb-4">
          We sent a verification link to{' '}
          <strong className="text-roseGold break-all">{email}</strong>. Please check your inbox and click the link to activate your D.Card account.
        </p>

        {/* Change Email Modal Inline Trigger */}
        {isChangingEmail ? (
          <motion.form
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleChangeEmailSubmit}
            className="mb-6 p-4 rounded-2xl bg-white/5 border border-white/10 text-left space-y-3"
          >
            <label className="block text-[10px] font-black text-roseGold uppercase tracking-widest">
              Enter New Email Address
            </label>
            <input
              type="email"
              required
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="w-full rounded-xl border border-secondary/20 bg-black/40 px-3.5 py-2 text-xs text-white outline-none focus:border-secondary"
              placeholder="newemail@example.com"
            />
            <div className="flex gap-2 pt-1">
              <button
                type="submit"
                disabled={loadingChange}
                className="flex-1 py-2 rounded-full bg-secondary text-white text-xs font-bold hover:brightness-110 cursor-pointer disabled:opacity-50"
              >
                {loadingChange ? 'Updating...' : 'Update & Send Link'}
              </button>
              <button
                type="button"
                onClick={() => setIsChangingEmail(false)}
                className="py-2 px-4 rounded-full bg-white/10 text-xs font-bold text-gray-300 hover:bg-white/15 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </motion.form>
        ) : null}

        {/* Actions Grid */}
        <div className="space-y-3 mt-6">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleRefreshStatus}
            disabled={isChecking}
            className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-secondary to-primary text-white font-extrabold text-xs uppercase tracking-wider shadow-lg border border-white/20 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isChecking ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Checking Status...</span>
              </>
            ) : (
              <span>🔄 Refresh Verification Status</span>
            )}
          </motion.button>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleResend}
              disabled={isResending}
              className="py-3 px-4 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-bold text-white transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5"
            >
              {isResending ? (
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                '📩 Resend Email'
              )}
            </button>

            <button
              onClick={() => setIsChangingEmail(!isChangingEmail)}
              className="py-3 px-4 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-bold text-white transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              ✏️ Change Email
            </button>
          </div>

          <button
            onClick={() => logout()}
            className="mt-4 text-xs font-bold text-rose-400 hover:underline cursor-pointer inline-block"
          >
            🚪 Sign Out / Switch Account
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default EmailVerificationPage;
