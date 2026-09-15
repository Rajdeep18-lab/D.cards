import React from 'react';
import { Pencil, ShieldCheck } from 'lucide-react';

/**
 * ProfileHeader — full-width hero banner at the top of the profile page.
 * Shows avatar, name, welcome message, and Edit Profile CTA.
 */
export default function ProfileHeader({
  user,
  profile,
  memberInitials,
  profileImage,
  onEditProfile,
}) {
  const displayName =
    profile?.full_name || profile?.name || user?.displayName || 'Member';

  return (
    <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-[#0B1329] via-[#0F1C3F] to-[#091124] p-6 sm:p-8 text-white shadow-xl border border-slate-700/50 mb-6">
      {/* Ambient glow blobs */}
      <div className="absolute top-0 right-1/3 w-72 h-72 rounded-full bg-[#2563EB]/20 blur-[90px] pointer-events-none" />
      <div className="absolute bottom-0 left-8 w-48 h-48 rounded-full bg-emerald-500/10 blur-[80px] pointer-events-none" />

      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-5">
        {/* Avatar */}
        <div className="relative shrink-0">
          <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] flex items-center justify-center shadow-lg border-2 border-white/20">
            {profileImage ? (
              <img
                src={profileImage}
                alt="Profile avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-2xl font-black text-white">
                {memberInitials}
              </span>
            )}
          </div>
          {/* Verified badge */}
          <div
            className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full bg-emerald-500 border-2 border-[#0B1329] flex items-center justify-center shadow"
            title="Verified Member"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-white stroke-[2.5]" />
          </div>
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0 space-y-1">
          <p className="text-xs font-bold text-[#93C5FD] uppercase tracking-widest">
            Welcome back to D.CARD
          </p>
          <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight truncate">
            {displayName}
          </h1>
          <p className="text-sm text-slate-400 font-medium">
            Manage your profile, saved products and preferences.
          </p>

          {/* Email pill */}
          {user?.email && (
            <span className="inline-block mt-1 text-[10.5px] font-semibold text-slate-300 bg-white/8 border border-white/15 px-3 py-0.5 rounded-full">
              {user.email}
            </span>
          )}
        </div>

        {/* Edit Profile button */}
        <button
          onClick={onEditProfile}
          className="shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/18 border border-white/20 hover:border-white/35 text-white text-xs font-bold transition-all cursor-pointer backdrop-blur-sm"
        >
          <Pencil className="w-3.5 h-3.5" />
          Edit Profile
        </button>
      </div>
    </div>
  );
}
