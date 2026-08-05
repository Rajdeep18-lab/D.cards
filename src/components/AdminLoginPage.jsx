import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { firebaseAuthService } from '../services/firebaseAuthService';
import { adminAuthService } from '../services/adminAuthService';
import { useToast } from '../context/ToastContext';

function AdminLoginPage({ isOpen, onClose, onSuccessAdminLogin }) {
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast("Please enter both email and password.", "error");
      return;
    }

    setLoading(true);
    try {
      // 1. Authenticate with Firebase Auth
      const { user: authUser } = await firebaseAuthService.login(email.trim(), password);

      // 2. Check if user is authorized
      const allowed = await adminAuthService.checkIsAdmin(authUser);

      if (allowed) {
        toast("Admin Authentication Verified! Opening Executive Dashboard... 🛡️", "success");
        if (onSuccessAdminLogin) {
          onSuccessAdminLogin(authUser);
        }
        onClose();
        window.location.hash = "#admin/dashboard";
      } else {
        // Sign out unauthorized user
        await firebaseAuthService.logout();
        toast("Access Denied. You are not authorized to access the Admin Dashboard.", "error");
        onClose();
        window.location.hash = "#home";
      }
    } catch (err) {
      toast(err.message || "Access Denied. Authentication failed.", "error");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[1400] flex items-center justify-center p-4 overflow-hidden select-none">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#0a0312]/85 backdrop-blur-xl"
        />

        {/* Admin Login Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', stiffness: 350, damping: 28 }}
          className="relative w-full max-w-md p-7 sm:p-8 rounded-3xl bg-[#0f0817] border border-secondary/30 shadow-[0_24px_80px_rgba(194,24,117,0.35)] backdrop-blur-2xl text-white font-sans text-left overflow-hidden"
        >
          {/* Top Decorative Ambient Glow */}
          <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-secondary/20 blur-3xl pointer-events-none" />

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#860038] via-[#C21875] to-[#7A0F52] flex items-center justify-center text-xl shadow-md shadow-secondary/30">
                🛡️
              </div>
              <div>
                <h2 className="text-xl font-black font-serif text-white tracking-tight">
                  Admin Portal Login
                </h2>
                <p className="text-xs text-roseGold font-bold tracking-wider uppercase">
                  D.Card Executive Security
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-xs cursor-pointer transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                Admin Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ritikanshu072@gmail.com"
                required
                className="w-full rounded-xl bg-white/5 border border-white/15 px-4 py-3 text-xs text-white placeholder-gray-500 outline-none focus:border-secondary transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full rounded-xl bg-white/5 border border-white/15 px-4 py-3 text-xs text-white placeholder-gray-500 outline-none focus:border-secondary transition-colors pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-xs text-gray-400 hover:text-white"
                >
                  {showPassword ? "👁️" : "🙈"}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-secondary to-primary hover:opacity-95 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-secondary/30 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <>
                    <span>🔐 Login to Admin Dashboard</span>
                  </>
                )}
              </button>
            </div>
          </form>

          <p className="text-[10px] text-gray-500 text-center mt-6 leading-relaxed">
            Protected by Firebase Authentication & Role-Based Access Control.
            Unauthorized access attempts are logged and monitored.
          </p>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default AdminLoginPage;
