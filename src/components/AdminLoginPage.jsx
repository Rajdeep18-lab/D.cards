import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Lock, Eye, EyeOff, X } from 'lucide-react';
import { firebaseAuthService } from '../services/firebaseAuthService';
import { adminAuthService } from '../services/adminAuthService';
import { useToast } from '../context/ToastContext';

function AdminLoginPage({ isOpen, onClose, onSuccessAdminLogin }) {
  const toast = useToast();

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
      const { user: authUser } = await firebaseAuthService.login(email.trim(), password);
      const allowed = await adminAuthService.checkIsAdmin(authUser);

      if (allowed) {
        toast("Admin Authentication Verified! Opening Dashboard...", "success");
        if (onSuccessAdminLogin) {
          onSuccessAdminLogin(authUser);
        }
        onClose();
        window.location.hash = "#admin/dashboard";
      } else {
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
          className="fixed inset-0 bg-[#0F172A]/85 backdrop-blur-md"
        />

        {/* Admin Login Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ type: 'spring', stiffness: 350, damping: 28 }}
          className="relative w-full max-w-md p-7 sm:p-8 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-slate-700 shadow-2xl text-[#1F2937] dark:text-white text-left overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <img src="/logo-mark.png" alt="D.CARD Mark" className="w-11 h-11 object-contain flex-shrink-0" />
              <div>
                <h2 className="text-xl font-bold text-[#1F2937] dark:text-white tracking-tight">
                  Admin Portal Login
                </h2>
                <p className="text-xs text-[#2563EB] dark:text-[#60A5FA] font-semibold tracking-wider uppercase">
                  Executive Access Controls
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-[#6B7280] hover:text-[#1F2937] dark:hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#1F2937] dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Admin Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ritikanshu072@gmail.com"
                required
                className="w-full rounded-xl bg-[#F8FAFC] dark:bg-slate-900 border border-[#E5E7EB] dark:border-slate-700 px-4 py-3 text-xs text-[#1F2937] dark:text-white placeholder-[#9CA3AF] outline-none focus:border-[#2563EB] transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1F2937] dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full rounded-xl bg-[#F8FAFC] dark:bg-slate-900 border border-[#E5E7EB] dark:border-slate-700 px-4 py-3 text-xs text-[#1F2937] dark:text-white placeholder-[#9CA3AF] outline-none focus:border-[#2563EB] transition-colors pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-[#6B7280] hover:text-[#1F2937] dark:hover:text-white cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#3B82F6] hover:opacity-95 text-white font-semibold text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 active:scale-98"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Login to Admin Dashboard</span>
                  </>
                )}
              </button>
            </div>
          </form>

          <p className="text-[10px] text-[#6B7280] dark:text-slate-400 text-center mt-6 leading-relaxed font-normal">
            Protected by Firebase Authentication & Role-Based Access Control.
          </p>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default AdminLoginPage;
