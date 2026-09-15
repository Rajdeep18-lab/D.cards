import React from 'react';
import { motion } from 'framer-motion';
import {
  Pencil,
  User,
  Phone,
  Mail,
  Check,
  RefreshCw,
  CheckCircle2,
  X,
  Camera,
} from 'lucide-react';

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3 },
};

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
];

/**
 * ProfileEditProfile — clean edit form for name, phone, and avatar.
 */
export default function ProfileEditProfile({
  user,
  fullName,
  setFullName,
  phoneNumber,
  setPhoneNumber,
  profileImage,
  setProfileImage,
  memberInitials,
  onSave,
  onCancel,
  saving,
  savedSuccess,
}) {
  return (
    <motion.div {...fadeUp} className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-black text-[#1F2937] dark:text-white">Edit Profile</h2>
        <p className="text-xs text-[#6B7280] dark:text-slate-400 mt-0.5">
          Update your personal information and avatar.
        </p>
      </div>

      {/* Avatar picker */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-[#F3F4F6] dark:border-slate-800 pb-3">
          <Camera className="w-4 h-4 text-[#2563EB]" />
          <h3 className="text-sm font-extrabold text-[#1F2937] dark:text-white">Profile Photo</h3>
          {profileImage && (
            <button
              type="button"
              onClick={() => setProfileImage('')}
              className="ml-auto text-xs font-bold text-slate-500 hover:text-rose-500 cursor-pointer transition-colors"
            >
              Reset to Initials
            </button>
          )}
        </div>

        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-1">
          {/* Monogram option */}
          <button
            type="button"
            onClick={() => setProfileImage('')}
            className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-lg cursor-pointer border-2 transition-all shrink-0 ${
              !profileImage
                ? 'border-[#2563EB] bg-[#2563EB]/10 text-[#2563EB] scale-105 shadow-md'
                : 'border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-500 hover:border-slate-400'
            }`}
            title="Use initials monogram"
          >
            {memberInitials}
          </button>

          {/* Avatar presets */}
          {AVATAR_PRESETS.map((url, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setProfileImage(url)}
              className={`relative w-14 h-14 rounded-2xl overflow-hidden cursor-pointer border-2 transition-all shrink-0 ${
                profileImage === url
                  ? 'border-[#2563EB] scale-105 shadow-md ring-4 ring-[#2563EB]/15'
                  : 'border-transparent opacity-70 hover:opacity-100 hover:scale-105'
              }`}
            >
              <img src={url} alt={`Avatar preset ${idx + 1}`} className="w-full h-full object-cover" />
              {profileImage === url && (
                <div className="absolute inset-0 bg-[#2563EB]/20 flex items-center justify-center">
                  <Check className="w-4 h-4 text-white stroke-[3]" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Personal info form */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-slate-800 shadow-sm space-y-5">
        <div className="flex items-center gap-2 border-b border-[#F3F4F6] dark:border-slate-800 pb-3">
          <User className="w-4 h-4 text-[#2563EB]" />
          <h3 className="text-sm font-extrabold text-[#1F2937] dark:text-white">Personal Information</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#374151] dark:text-slate-300 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-slate-400" />
              Full Name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-4 py-2.5 rounded-xl border border-[#E5E7EB] dark:border-slate-700 bg-[#F8FAFC] dark:bg-slate-900 text-sm font-semibold text-[#1F2937] dark:text-white outline-none focus:border-[#2563EB] transition-colors"
            />
          </div>

          {/* Email (read-only) */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#374151] dark:text-slate-300 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              Email Address
            </label>
            <div className="w-full px-4 py-2.5 rounded-xl border border-[#E5E7EB] dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-sm font-semibold text-[#6B7280] dark:text-slate-400 flex items-center justify-between">
              <span className="truncate">{user?.email || '—'}</span>
              <span className="text-[9.5px] font-bold text-slate-400 ml-2 shrink-0">(fixed)</span>
            </div>
          </div>

          {/* Phone */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#374151] dark:text-slate-300 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              Phone Number
            </label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="+91 98765 43210"
              className="w-full px-4 py-2.5 rounded-xl border border-[#E5E7EB] dark:border-slate-700 bg-[#F8FAFC] dark:bg-slate-900 text-sm font-semibold text-[#1F2937] dark:text-white outline-none focus:border-[#2563EB] transition-colors"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="pt-4 border-t border-[#F3F4F6] dark:border-slate-800 flex items-center justify-between gap-4 flex-wrap">
          <div>
            {savedSuccess && (
              <span className="text-xs font-bold text-emerald-500 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                Profile saved successfully!
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 ml-auto">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2.5 rounded-xl border border-[#E5E7EB] dark:border-slate-700 text-xs font-bold text-[#374151] dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <X className="w-3.5 h-3.5" />
              Cancel
            </button>
            <button
              type="button"
              onClick={onSave}
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold shadow-sm transition-all cursor-pointer flex items-center gap-2 disabled:opacity-60"
            >
              {saving ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  Saving…
                </>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
