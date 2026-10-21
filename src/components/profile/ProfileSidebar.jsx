import React from 'react';
import {
  LayoutDashboard,
  Landmark,
  CreditCard,
  GitCompare,
  Clock,
  SlidersHorizontal,
  Settings,
  Pencil,
  ChevronRight,
  LogOut,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export default function ProfileSidebar({
  activeSection,
  onSelectSection,
  user,
  profile,
  memberInitials,
  profileImage,
  wishlistCount,
  onLogout,
}) {
  const { t, isHindi } = useLanguage();

  const navItems = [
    { id: 'overview',        label: t('profile.overviewTab', 'Overview'),                   icon: LayoutDashboard },
    { id: 'saved-accounts',  label: t('profile.savedAccountsTab', 'Saved Accounts'),         icon: Landmark },
    { id: 'saved-cards',     label: t('profile.savedCardsTab', 'Saved Debit Cards'),        icon: CreditCard },
    { id: 'comparisons',     label: t('profile.comparisonsTab', 'Comparisons'),             icon: GitCompare },
    { id: 'recently-viewed', label: t('profile.recentlyViewedTab', 'Recently Viewed'),      icon: Clock },
    { id: 'preferences',     label: t('profile.preferencesTab', 'Preferences'),             icon: SlidersHorizontal },
    { id: 'settings',        label: t('profile.settingsTab', 'Settings'),                   icon: Settings },
  ];
  const displayName =
    profile?.full_name || profile?.name || user?.displayName || (isHindi ? 'उपयोगकर्ता' : 'Member');
  const email = user?.email || '';

  return (
    <>
      {/* ═══════════════════════════════
          DESKTOP — sticky vertical sidebar
          Hidden on mobile, shown lg+
      ═══════════════════════════════ */}
      <aside className="hidden lg:flex flex-col w-72 shrink-0 self-start sticky top-24">
        <div className="rounded-2xl bg-white dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-slate-800 shadow-sm overflow-hidden">

          {/* User identity block */}
          <div className="p-6 border-b border-[#E5E7EB] dark:border-slate-800 bg-gradient-to-br from-[#2563EB]/5 to-transparent">
            <div className="flex items-center gap-4">
              {/* Avatar */}
              <div className="relative shrink-0">
                <div className="w-14 h-14 rounded-2xl overflow-hidden bg-gradient-to-br from-[#2563EB] to-[#3B82F6] flex items-center justify-center shadow-md border-2 border-white dark:border-slate-700">
                  {profileImage ? (
                    <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-lg font-black text-white">{memberInitials}</span>
                  )}
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white dark:border-[#1E293B]" />
              </div>

              {/* Name & email */}
              <div className="min-w-0">
                <p className="text-sm font-extrabold text-[#1F2937] dark:text-white truncate leading-tight">
                  {displayName}
                </p>
                <p className="text-[10.5px] text-[#6B7280] dark:text-slate-400 truncate mt-0.5">
                  {email}
                </p>
                <button
                  onClick={() => onSelectSection('edit')}
                  className="mt-2 flex items-center gap-1 text-[10px] font-bold text-[#2563EB] dark:text-[#60A5FA] hover:underline cursor-pointer"
                >
                  <Pencil className="w-3 h-3" />
                  {isHindi ? 'प्रोफ़ाइल संपादित करें' : 'Edit Profile'}
                </button>
              </div>
            </div>
          </div>

          {/* Navigation items */}
          <nav className="p-3 space-y-0.5">
            {navItems.map(({ id, label, icon: Icon }) => {
              const isActive = activeSection === id;
              return (
                <button
                  key={id}
                  onClick={() => onSelectSection(id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer group ${
                    isActive
                      ? 'bg-[#2563EB] text-white shadow-sm'
                      : 'text-[#374151] dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[#1F2937] dark:hover:text-white'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 shrink-0 ${
                        isActive
                          ? 'text-white'
                          : 'text-slate-400 dark:text-slate-500 group-hover:text-[#2563EB] dark:group-hover:text-[#60A5FA]'
                      }`}
                    />
                    {label}
                  </span>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-white/70 shrink-0" />}
                </button>
              );
            })}
          </nav>

          {/* Sign out */}
          <div className="p-3 pt-0">
            <div className="border-t border-[#E5E7EB] dark:border-slate-800 pt-3">
              <button
                onClick={onLogout}
                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all cursor-pointer"
              >
                <LogOut className="w-4 h-4 shrink-0" />
                {t('profile.logoutBtn', 'Sign Out')}
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* ═══════════════════════════════
          MOBILE — horizontal scroll tabs
          Shown on mobile/tablet, hidden lg+
      ═══════════════════════════════ */}
      <div className="lg:hidden w-full">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
          {navItems.map(({ id, label, icon: Icon }) => {
            const isActive = activeSection === id;
            return (
              <button
                key={id}
                onClick={() => onSelectSection(id)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#2563EB] text-white shadow-sm'
                    : 'bg-white dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-slate-700 text-[#374151] dark:text-slate-300 hover:border-[#2563EB]/40'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                {label}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
