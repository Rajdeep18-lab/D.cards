import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';

function ForgotPasswordModal({ isOpen, onClose, onSwitchToLogin }) {
  const { forgotPassword, updatePassword, isPasswordRecoveryActive } = useAuth();

  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSendLink = async (e) => {
    e.preventDefault();
    if (!email) {
      setErrorMsg('Please enter your email address.');
      return;
    }
    setErrorMsg('');
    setLoading(true);

    try {
      await forgotPassword(email);
      setEmailSent(true);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to dispatch password recovery email.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 8) {
      setErrorMsg('Password must be at least 8 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }
    setErrorMsg('');
    setLoading(true);

    try {
      await updatePassword(newPassword);
      onClose();
      if (onSwitchToLogin) onSwitchToLogin();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to update password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[1250] flex items-center justify-center bg-[#2D1B2E]/70 backdrop-blur-md p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-md overflow-hidden rounded-[32px] bg-cardBg dark:bg-[#0c050c] shadow-[0_25px_80px_rgba(134,0,56,0.35)] border border-highlight dark:border-secondary/20 p-8 select-none"
      >
        <button
          onClick={onClose}
          className="absolute right-6 top-6 text-textSoft dark:text-gray-400 hover:text-primary dark:hover:text-roseGold cursor-pointer focus:outline-none"
        >
          ✕
        </button>

        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-secondary/10 border border-secondary/20 flex items-center justify-center mx-auto mb-3 text-2xl">
            🔑
          </div>
          <h2 className="text-2xl font-black font-serif text-primary dark:text-accent tracking-tight">
            {isPasswordRecoveryActive ? 'Set New Password' : 'Reset Password'}
          </h2>
          <p className="text-xs text-textSoft dark:text-gray-400 font-semibold mt-1">
            {isPasswordRecoveryActive
              ? 'Enter your new secure password below'
              : 'Enter your registered email address to receive a recovery link'}
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 bg-red-500/10 border border-red-500/25 text-red-600 dark:text-red-400 rounded-xl p-3 text-xs font-semibold">
            ⚠️ {errorMsg}
          </div>
        )}

        {isPasswordRecoveryActive ? (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="block text-[10px] font-black text-secondary dark:text-roseGold uppercase tracking-widest mb-1 px-0.5">
                New Password
              </label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full rounded-xl border border-highlight dark:border-secondary/20 bg-white dark:bg-black/30 px-4 py-3 text-xs text-textDark dark:text-white font-semibold outline-none focus:border-secondary"
                placeholder="Minimum 8 characters"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-secondary dark:text-roseGold uppercase tracking-widest mb-1 px-0.5">
                Confirm New Password
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-xl border border-highlight dark:border-secondary/20 bg-white dark:bg-black/30 px-4 py-3 text-xs text-textDark dark:text-white font-semibold outline-none focus:border-secondary"
                placeholder="Re-enter password"
              />
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full mt-4 rounded-full bg-gradient-to-r from-secondary to-primary py-3.5 px-4 font-extrabold text-xs text-white uppercase tracking-widest shadow-lg cursor-pointer"
            >
              {loading ? 'Updating Password...' : 'Save New Password 🔒'}
            </motion.button>
          </form>
        ) : emailSent ? (
          <div className="text-center space-y-4 py-2">
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-600 dark:text-emerald-400 text-xs font-semibold leading-relaxed">
              📩 Password recovery link has been dispatched to <strong>{email}</strong>. Please check your inbox and click the reset link.
            </div>
            <button
              onClick={onClose}
              className="w-full py-3 rounded-full bg-secondary text-white font-bold text-xs cursor-pointer"
            >
              Close Window
            </button>
          </div>
        ) : (
          <form onSubmit={handleSendLink} className="space-y-4">
            <div>
              <label className="block text-[10px] font-black text-secondary dark:text-roseGold uppercase tracking-widest mb-1 px-0.5">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-highlight dark:border-secondary/20 bg-white dark:bg-black/30 px-4 py-3 text-xs text-textDark dark:text-white font-semibold outline-none focus:border-secondary"
                placeholder="name@example.com"
              />
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full mt-4 rounded-full bg-gradient-to-r from-secondary to-primary py-3.5 px-4 font-extrabold text-xs text-white uppercase tracking-widest shadow-lg cursor-pointer flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Dispatching...</span>
                </>
              ) : (
                <span>Send Recovery Link ✉️</span>
              )}
            </motion.button>
          </form>
        )}

        <div className="mt-5 text-center text-xs font-semibold">
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="text-secondary dark:text-roseGold hover:underline cursor-pointer"
          >
            ← Back to Log In
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default ForgotPasswordModal;
