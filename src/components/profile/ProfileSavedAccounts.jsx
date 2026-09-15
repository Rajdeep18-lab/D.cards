import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Landmark, Trash2, ChevronRight, ExternalLink, Building2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3 },
};

function EmptyState({ type, navigate }) {
  const paths = { savings: '/savings-accounts', current: '/current-accounts' };
  const labels = { savings: 'Savings Accounts', current: 'Current Accounts' };
  return (
    <div className="py-16 text-center rounded-2xl bg-[#F8FAFC] dark:bg-slate-900/50 border border-dashed border-[#E5E7EB] dark:border-slate-700 space-y-3">
      <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto">
        <Landmark className="w-6 h-6 text-slate-400 dark:text-slate-500" />
      </div>
      <div>
        <p className="text-sm font-bold text-[#1F2937] dark:text-white">
          No {labels[type]} saved yet.
        </p>
        <p className="text-xs text-[#6B7280] dark:text-slate-400 mt-1 max-w-xs mx-auto">
          Start exploring banking products and save your favourites here.
        </p>
      </div>
      <button
        onClick={() => navigate(paths[type])}
        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2563EB] text-white text-xs font-bold hover:bg-[#1D4ED8] transition-all cursor-pointer shadow-sm"
      >
        <ExternalLink className="w-3.5 h-3.5" />
        Explore {labels[type]}
      </button>
    </div>
  );
}

function AccountCard({ item, onRemove, onViewDetails, type }) {
  const isSavings = type === 'savings';
  return (
    <div className="p-5 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4">
      {/* Header */}
      <div>
        <div className="flex items-start justify-between gap-2 mb-3">
          <span
            className={`px-2.5 py-0.5 rounded-full text-[9.5px] font-extrabold uppercase tracking-wider border ${
              isSavings
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
            }`}
          >
            {isSavings ? '🏦 Savings Account' : '💼 Current Account'}
          </span>
          <button
            onClick={() => onRemove(item.id || item.product_id)}
            className="text-slate-400 hover:text-rose-500 transition-colors p-1 cursor-pointer rounded-lg hover:bg-rose-50 dark:hover:bg-rose-500/10"
            title="Remove from saved"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
            <Building2 className="w-4 h-4 text-slate-500 dark:text-slate-400" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              {item.bank || item.bankName}
            </p>
            <h4 className="text-sm font-extrabold text-[#1F2937] dark:text-white leading-snug truncate">
              {item.accountName || item.variant_name}
            </h4>
          </div>
        </div>
      </div>

      {/* Specs */}
      <div className="grid grid-cols-2 gap-2 pt-3 border-t border-[#F3F4F6] dark:border-slate-800 text-[11px]">
        {isSavings ? (
          <>
            <div>
              <span className="text-[9.5px] font-bold text-slate-400 block uppercase tracking-wide">Interest Rate</span>
              <strong className="text-emerald-600 dark:text-emerald-400 font-extrabold">
                {item.interestRate || '—'}
              </strong>
            </div>
            <div>
              <span className="text-[9.5px] font-bold text-slate-400 block uppercase tracking-wide">Min Balance</span>
              <strong className="text-[#1F2937] dark:text-slate-200 font-extrabold">
                {item.minimumBalance || '₹0'}
              </strong>
            </div>
          </>
        ) : (
          <>
            <div>
              <span className="text-[9.5px] font-bold text-slate-400 block uppercase tracking-wide">MAB</span>
              <strong className="text-[#1F2937] dark:text-slate-200 font-extrabold">
                {item.minimumBalance || '₹10,000'}
              </strong>
            </div>
            <div>
              <span className="text-[9.5px] font-bold text-slate-400 block uppercase tracking-wide">Cash Limit</span>
              <strong className="text-[#1F2937] dark:text-slate-200 font-extrabold truncate block">
                {item.cashDepositLimit || 'Standard'}
              </strong>
            </div>
          </>
        )}
      </div>

      {/* Actions */}
      <div className="pt-3 border-t border-[#F3F4F6] dark:border-slate-800 flex items-center justify-between gap-2">
        <button
          onClick={() => onViewDetails(item)}
          className="flex items-center gap-1 text-xs font-bold text-[#2563EB] dark:text-[#60A5FA] hover:underline cursor-pointer"
        >
          View Details
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

/**
 * ProfileSavedAccounts — shows saved savings and current accounts.
 */
export default function ProfileSavedAccounts({
  savedSavingsItems,
  savedCurrentItems,
  onRemove,
  onViewDetails,
}) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('savings');

  const tabs = [
    { id: 'savings', label: 'Savings Accounts', count: savedSavingsItems.length },
    { id: 'current', label: 'Current Accounts', count: savedCurrentItems.length },
  ];

  const items = activeTab === 'savings' ? savedSavingsItems : savedCurrentItems;

  return (
    <motion.div {...fadeUp} className="space-y-5">
      {/* Header */}
      <div>
        <h2 className="text-xl font-black text-[#1F2937] dark:text-white">Saved Accounts</h2>
        <p className="text-xs text-[#6B7280] dark:text-slate-400 mt-0.5">
          Your bookmarked savings and current accounts.
        </p>
      </div>

      {/* Tab selector */}
      <div className="flex items-center gap-2 p-1 rounded-xl bg-[#F3F4F6] dark:bg-slate-900 border border-[#E5E7EB] dark:border-slate-800 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'bg-white dark:bg-[#1E293B] text-[#1F2937] dark:text-white shadow-sm border border-[#E5E7EB] dark:border-slate-700'
                : 'text-[#6B7280] dark:text-slate-400 hover:text-[#1F2937] dark:hover:text-white'
            }`}
          >
            {tab.label}
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded-full font-extrabold ${
                activeTab === tab.id
                  ? 'bg-[#2563EB] text-white'
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Content */}
      {items.length === 0 ? (
        <EmptyState type={activeTab} navigate={navigate} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {items.map((item) => (
            <AccountCard
              key={item.id || item.product_id}
              item={item}
              type={activeTab}
              onRemove={onRemove}
              onViewDetails={onViewDetails}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}
