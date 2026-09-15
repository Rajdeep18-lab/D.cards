import React from 'react';
import { motion } from 'framer-motion';
import {
  Settings,
  ShieldCheck,
  Lock,
  LogOut,
  Pencil,
  CheckCircle2,
  Database,
} from 'lucide-react';

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3 },
};

function SettingsRow({ icon: Icon, title, description, children, iconColor = 'text-[#2563EB]' }) {
  return (
    <div className="flex items-start justify-between gap-4 p-4 rounded-xl bg-[#F8FAFC] dark:bg-slate-900/60 border border-[#E5E7EB] dark:border-slate-800">
      <div className="flex items-start gap-3">
        <div className={`w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 ${iconColor}`}>
          <Icon className="w-4 h-4" />
        </div>
        <div>
          <p className="text-xs font-extrabold text-[#1F2937] dark:text-white">{title}</p>
          {description && (
            <p className="text-[10.5px] text-[#6B7280] dark:text-slate-400 mt-0.5">{description}</p>
          )}
        </div>
      </div>
      {children && <div className="shrink-0">{children}</div>}
    </div>
  );
}

/**
 * ProfileSettings — account settings, privacy info, data preferences, and logout.
 */
export default function ProfileSettings({ user, profile, onEditProfile, onLogout }) {
  const displayName = profile?.full_name || profile?.name || user?.displayName || 'Member';
  const email = user?.email || '';
  const isVerified = Boolean(user?.emailVerified);

  return (
    <motion.div {...fadeUp} className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-black text-[#1F2937] dark:text-white">Settings</h2>
        <p className="text-xs text-[#6B7280] dark:text-slate-400 mt-0.5">
          Manage your account, privacy, and data.
        </p>
      </div>

      {/* Account Settings */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-[#F3F4F6] dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4 text-[#2563EB]" />
            <h3 className="text-sm font-extrabold text-[#1F2937] dark:text-white">Account Settings</h3>
          </div>
          <button
            onClick={onEditProfile}
            className="flex items-center gap-1.5 text-xs font-bold text-[#2563EB] dark:text-[#60A5FA] hover:underline cursor-pointer"
          >
            <Pencil className="w-3.5 h-3.5" />
            Edit Profile
          </button>
        </div>

        <div className="space-y-3">
          {/* Name row */}
          <div className="flex items-center justify-between py-2 border-b border-[#F9FAFB] dark:border-slate-800/60">
            <span className="text-xs font-bold text-[#6B7280] dark:text-slate-400">Full Name</span>
            <span className="text-xs font-extrabold text-[#1F2937] dark:text-white">{displayName}</span>
          </div>
          {/* Email row */}
          <div className="flex items-center justify-between py-2 border-b border-[#F9FAFB] dark:border-slate-800/60">
            <span className="text-xs font-bold text-[#6B7280] dark:text-slate-400">Email</span>
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold text-[#1F2937] dark:text-white truncate max-w-[200px]">{email}</span>
              {isVerified ? (
                <span className="flex items-center gap-1 text-[9.5px] font-bold text-emerald-500">
                  <CheckCircle2 className="w-3 h-3" />
                  Verified
                </span>
              ) : (
                <span className="text-[9.5px] font-bold text-amber-500">Unverified</span>
              )}
            </div>
          </div>
          {/* Auth provider */}
          <div className="flex items-center justify-between py-2">
            <span className="text-xs font-bold text-[#6B7280] dark:text-slate-400">Auth Provider</span>
            <span className="px-2.5 py-0.5 rounded-full text-[9.5px] font-bold bg-[#2563EB]/10 text-[#2563EB] dark:text-[#60A5FA] border border-[#2563EB]/20">
              Firebase
            </span>
          </div>
        </div>
      </div>

      {/* Privacy */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-[#F3F4F6] dark:border-slate-800 pb-3">
          <ShieldCheck className="w-4 h-4 text-[#2563EB]" />
          <h3 className="text-sm font-extrabold text-[#1F2937] dark:text-white">Privacy</h3>
        </div>
        <div className="space-y-3">
          <SettingsRow
            icon={ShieldCheck}
            iconColor="text-emerald-500"
            title="Account Protection"
            description="Your account is secured with Firebase Cloud IAM and end-to-end TLS encryption."
          >
            <span className="flex items-center gap-1.5 text-[9.5px] font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Active
            </span>
          </SettingsRow>
          <SettingsRow
            icon={Lock}
            iconColor="text-[#2563EB]"
            title="Data Encryption"
            description="All profile data is encrypted in transit (256-bit TLS) and at rest in Firestore."
          />
        </div>
      </div>

      {/* Data Preferences */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-[#F3F4F6] dark:border-slate-800 pb-3">
          <Database className="w-4 h-4 text-[#2563EB]" />
          <h3 className="text-sm font-extrabold text-[#1F2937] dark:text-white">Data Preferences</h3>
        </div>
        <div className="space-y-3">
          <SettingsRow
            icon={Database}
            iconColor="text-violet-500"
            title="Wishlist Storage"
            description="Your saved products are stored in Firestore and synced across devices when signed in."
          />
          <SettingsRow
            icon={CheckCircle2}
            iconColor="text-emerald-500"
            title="Recently Viewed"
            description="Recently viewed products are stored locally in your browser's localStorage only."
          />
        </div>
      </div>

      {/* Danger Zone — Logout */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#1E293B] border border-rose-200 dark:border-rose-500/20 shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-rose-100 dark:border-rose-500/10 pb-3">
          <LogOut className="w-4 h-4 text-rose-500" />
          <h3 className="text-sm font-extrabold text-[#1F2937] dark:text-white">Sign Out</h3>
        </div>
        <p className="text-xs text-[#6B7280] dark:text-slate-400">
          Signing out will end your current session. Your saved products and profile data will remain in the cloud.
        </p>
        <button
          onClick={onLogout}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/25 text-rose-600 dark:text-rose-400 text-xs font-bold hover:bg-rose-100 dark:hover:bg-rose-500/20 transition-all cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          Sign Out of D.CARD
        </button>
      </div>
    </motion.div>
  );
}
