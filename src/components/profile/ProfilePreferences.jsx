import React from 'react';
import { motion } from 'framer-motion';
import { SlidersHorizontal, Bell, Plane, Lock, Layers } from 'lucide-react';

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3 },
};

const PRODUCT_CATEGORIES = [
  { value: 'debitCard', label: '💳 Debit Cards' },
  { value: 'savingsAccount', label: '🏦 Savings Accounts' },
  { value: 'currentAccount', label: '💼 Current Accounts' },
];

const DISPLAY_MODES = [
  { value: 'comfortable', label: 'Comfortable', desc: 'More spacing, easier to read' },
  { value: 'compact', label: 'Compact', desc: 'Denser layout, more items visible' },
];

const NETWORKS = ['Any', 'RuPay', 'Visa', 'Mastercard'];
const GOALS = ['Maximize Cashback', 'Travel Rewards', 'Zero Fees', 'Lounge Access', 'High Interest Rate'];

const NOTIFICATION_PREFS = [
  { key: 'feeChangeAlerts', label: 'Fee & Penalty Alerts', desc: 'Get notified when annual charges or MAB slabs change.', icon: Bell },
  { key: 'loungeRuleUpdates', label: 'Lounge Spend Criteria Updates', desc: 'Alerts when lounge access criteria or quotas change.', icon: Plane },
  { key: 'monthlyAuditReports', label: 'Monthly Product Audits', desc: 'Receive monthly fintech comparison intelligence reports.', icon: Layers },
  { key: 'securityLoginAlerts', label: 'Security & Login Alerts', desc: 'Instant alerts for unrecognized authentication sessions.', icon: Lock },
];

function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`w-11 h-6 rounded-full p-0.5 transition-colors duration-200 flex items-center shrink-0 cursor-pointer ${
        checked ? 'bg-[#2563EB] justify-end' : 'bg-slate-300 dark:bg-slate-700 justify-start'
      }`}
      role="switch"
      aria-checked={checked}
    >
      <span className="w-5 h-5 rounded-full bg-white shadow-sm transition-all" />
    </button>
  );
}

/**
 * ProfilePreferences — product category, display mode, network, goals, and notification toggles.
 */
export default function ProfilePreferences({
  preferredCategory,
  setPreferredCategory,
  displayMode,
  setDisplayMode,
  primaryNetworkPref,
  setPrimaryNetworkPref,
  primaryGoalPref,
  setPrimaryGoalPref,
  notificationPrefs,
  onToggleNotification,
  onSave,
  saving,
}) {
  return (
    <motion.div {...fadeUp} className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-black text-[#1F2937] dark:text-white">Preferences</h2>
        <p className="text-xs text-[#6B7280] dark:text-slate-400 mt-0.5">
          Personalise your D.CARD experience.
        </p>
      </div>

      {/* Preferred Product Category */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-[#F3F4F6] dark:border-slate-800 pb-3">
          <SlidersHorizontal className="w-4 h-4 text-[#2563EB]" />
          <h3 className="text-sm font-extrabold text-[#1F2937] dark:text-white">Preferred Product Category</h3>
        </div>
        <div className="flex flex-wrap gap-2.5">
          {PRODUCT_CATEGORIES.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setPreferredCategory(value)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                preferredCategory === value
                  ? 'bg-[#2563EB] text-white border-[#2563EB] shadow-sm'
                  : 'bg-[#F8FAFC] dark:bg-slate-900 border-[#E5E7EB] dark:border-slate-700 text-[#374151] dark:text-slate-300 hover:border-[#2563EB]/40'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Display Mode */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-[#F3F4F6] dark:border-slate-800 pb-3">
          <SlidersHorizontal className="w-4 h-4 text-[#2563EB]" />
          <h3 className="text-sm font-extrabold text-[#1F2937] dark:text-white">Display Preferences</h3>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {DISPLAY_MODES.map(({ value, label, desc }) => (
            <button
              key={value}
              onClick={() => setDisplayMode(value)}
              className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                displayMode === value
                  ? 'border-[#2563EB] bg-[#2563EB]/5 dark:bg-[#2563EB]/10'
                  : 'border-[#E5E7EB] dark:border-slate-700 hover:border-[#2563EB]/40'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-extrabold text-[#1F2937] dark:text-white">{label}</span>
                <div className={`w-4 h-4 rounded-full border-2 transition-colors ${
                  displayMode === value ? 'border-[#2563EB] bg-[#2563EB]' : 'border-slate-300 dark:border-slate-600'
                }`} />
              </div>
              <p className="text-[10.5px] text-[#6B7280] dark:text-slate-400">{desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Network & Goal Preferences */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-[#F3F4F6] dark:border-slate-800 pb-3">
          <SlidersHorizontal className="w-4 h-4 text-[#2563EB]" />
          <h3 className="text-sm font-extrabold text-[#1F2937] dark:text-white">Banking Preferences</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#374151] dark:text-slate-300">Preferred Network</label>
            <div className="flex flex-wrap gap-2">
              {NETWORKS.map((n) => (
                <button
                  key={n}
                  onClick={() => setPrimaryNetworkPref(n)}
                  className={`px-3 py-1.5 rounded-lg text-[10.5px] font-bold transition-all cursor-pointer border ${
                    primaryNetworkPref === n
                      ? 'bg-[#2563EB] text-white border-[#2563EB]'
                      : 'bg-[#F8FAFC] dark:bg-slate-900 border-[#E5E7EB] dark:border-slate-700 text-[#374151] dark:text-slate-300 hover:border-[#2563EB]/40'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#374151] dark:text-slate-300">Primary Goal</label>
            <div className="flex flex-wrap gap-2">
              {GOALS.map((g) => (
                <button
                  key={g}
                  onClick={() => setPrimaryGoalPref(g)}
                  className={`px-3 py-1.5 rounded-lg text-[10.5px] font-bold transition-all cursor-pointer border ${
                    primaryGoalPref === g
                      ? 'bg-[#2563EB] text-white border-[#2563EB]'
                      : 'bg-[#F8FAFC] dark:bg-slate-900 border-[#E5E7EB] dark:border-slate-700 text-[#374151] dark:text-slate-300 hover:border-[#2563EB]/40'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-[#F3F4F6] dark:border-slate-800 pb-3">
          <Bell className="w-4 h-4 text-[#2563EB]" />
          <h3 className="text-sm font-extrabold text-[#1F2937] dark:text-white">Notification Preferences</h3>
        </div>
        <div className="space-y-3">
          {NOTIFICATION_PREFS.map(({ key, label, desc, icon: Icon }) => (
            <div
              key={key}
              className="flex items-center justify-between gap-4 p-4 rounded-xl bg-[#F8FAFC] dark:bg-slate-900/60 border border-[#E5E7EB] dark:border-slate-800 hover:border-[#2563EB]/30 transition-all cursor-pointer"
              onClick={() => onToggleNotification(key)}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-[#2563EB] dark:text-[#60A5FA] flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-extrabold text-[#1F2937] dark:text-white">{label}</p>
                  <p className="text-[10.5px] text-[#6B7280] dark:text-slate-400">{desc}</p>
                </div>
              </div>
              <Toggle checked={!!notificationPrefs[key]} onChange={() => onToggleNotification(key)} />
            </div>
          ))}
        </div>
      </div>

      {/* Save button */}
      <div className="flex justify-end">
        <button
          onClick={onSave}
          disabled={saving}
          className="px-6 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold transition-all cursor-pointer shadow-sm disabled:opacity-60 flex items-center gap-2"
        >
          {saving ? 'Saving…' : 'Save Preferences'}
        </button>
      </div>
    </motion.div>
  );
}
