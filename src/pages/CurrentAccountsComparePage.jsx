import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Scale, ArrowLeft, Building2, Briefcase, CreditCard } from 'lucide-react';
import { getAssociatedDebitCardForCurrentAccount } from '../data/currentAccounts/index.js';
import { safeArray } from '../utils/safeUtils';
import { useSEO } from '../hooks/useSEO';

function CurrentAccountsComparePage({ compareQueue = [], setCompareQueue, onSelectDebitCard }) {
  useSEO({
    title: "Compare Current Accounts Side by Side | D.Card",
    description: "Compare cash deposit limits, minimum balance, and charges across current accounts side by side on D.Card.",
    canonicalUrl: "https://www.dcard.website/compare-current"
  });

  const navigate = useNavigate();
  const location = useLocation();
  const queue = (compareQueue && compareQueue.length > 0) 
    ? compareQueue 
    : (location.state?.queue || []);

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 relative z-20 space-y-8 text-left select-none">
      <div className="flex items-center justify-between border-b border-[#E5E7EB] dark:border-slate-800 pb-6">
        <div>
          <Link to="/current-accounts" className="text-xs font-bold text-[#2563EB] dark:text-[#60A5FA] flex items-center gap-1 mb-2 hover:underline">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Current Accounts
          </Link>
          <h1 className="text-3xl font-extrabold text-[#1F2937] dark:text-white tracking-tight">
            Current Accounts Side-by-Side Comparison
          </h1>
          <p className="text-xs sm:text-sm text-[#6B7280] dark:text-slate-400 mt-1">
            Compare business accounts, MAB requirements, cash deposit slabs, cheque leaves, and linked business debit cards.
          </p>
        </div>

        {queue.length > 0 && setCompareQueue && (
          <button
            onClick={() => setCompareQueue([])}
            className="px-4 py-2 rounded-xl text-xs font-bold text-rose-600 border border-rose-200 hover:bg-rose-50 cursor-pointer"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Comparison Category Switcher */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-fit">
        <button
          onClick={() => navigate('/compare')}
          className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
        >
          <CreditCard className="w-3.5 h-3.5" />
          <span>Debit Cards</span>
        </button>
        <button
          onClick={() => navigate('/compare-savings')}
          className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>Savings Accounts</span>
        </button>
        <button
          onClick={() => navigate('/compare-current')}
          className="px-4 py-2 rounded-xl text-xs font-bold bg-[#2563EB] text-white shadow-xs cursor-pointer flex items-center gap-1.5"
        >
          <Briefcase className="w-3.5 h-3.5" />
          <span>Current Accounts</span>
        </button>
      </div>

      {queue.length === 0 ? (
        <div className="py-20 text-center space-y-4">
          <Briefcase className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto" />
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">No Current Accounts Selected for Comparison</h2>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Browse current accounts and click "Compare" on up to 3 accounts to view side-by-side matrices.
          </p>
          <Link
            to="/current-accounts"
            className="inline-block px-6 py-2.5 rounded-full bg-[#2563EB] text-white font-bold text-xs shadow-md"
          >
            Browse Current Accounts
          </Link>
        </div>
      ) : (
        <div className="p-6 rounded-3xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 shadow-soft overflow-x-auto">
          <table className="w-full border-collapse text-left min-w-[700px]">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800">
                <th className="p-4 w-52 font-bold text-slate-400 dark:text-slate-500 uppercase text-[11px]">Business Parameter</th>
                {queue.map(acc => (
                  <th key={acc.id} className="p-4 min-w-[220px] text-center">
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2 relative">
                      {setCompareQueue && (
                        <button
                          onClick={() => setCompareQueue(prev => prev.filter(a => String(a.id) !== String(acc.id)))}
                          className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-rose-500 text-white text-xs flex items-center justify-center cursor-pointer shadow"
                        >
                          ×
                        </button>
                      )}
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0B3D91] to-[#2563EB] text-white flex items-center justify-center font-black text-xs mx-auto">
                        {acc.logo || (acc.bankName || acc.bank).substring(0, 2).toUpperCase()}
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">{acc.bankName || acc.bank}</span>
                      <h3 className="font-extrabold text-sm text-[#1F2937] dark:text-white leading-tight">{acc.accountName}</h3>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs sm:text-sm">
              <tr>
                <td className="p-4 font-bold text-slate-700 dark:text-slate-300">Account Type</td>
                {queue.map(acc => (
                  <td key={acc.id} className="p-4 text-center font-bold text-[#2563EB] dark:text-[#60A5FA]">
                    {acc.accountType}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-4 font-bold text-slate-700 dark:text-slate-300">Minimum Balance (MAB)</td>
                {queue.map(acc => (
                  <td key={acc.id} className="p-4 text-center font-black text-[#1F2937] dark:text-white text-base">
                    {acc.minimumBalance}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-4 font-bold text-slate-700 dark:text-slate-300">Non-Maintenance Penalty</td>
                {queue.map(acc => (
                  <td key={acc.id} className="p-4 text-center font-bold text-rose-500">
                    {acc.nonMaintenanceCharge}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-4 font-bold text-slate-700 dark:text-slate-300">Free Cash Deposit Limit</td>
                {queue.map(acc => (
                  <td key={acc.id} className="p-4 text-center text-xs font-semibold text-slate-600 dark:text-slate-300">
                    {acc.cashDepositLimit}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-4 font-bold text-slate-700 dark:text-slate-300">Free Cheque Leaves</td>
                {queue.map(acc => (
                  <td key={acc.id} className="p-4 text-center font-bold text-emerald-600">
                    {acc.freeChequeLeaves || "Included"}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-4 font-bold text-slate-700 dark:text-slate-300">NEFT / RTGS</td>
                {queue.map(acc => (
                  <td key={acc.id} className="p-4 text-center font-bold text-emerald-600">
                    {acc.neft || "Free Digital"}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-4 font-bold text-slate-700 dark:text-slate-300">Associated Business Debit Card</td>
                {queue.map(acc => {
                  const card = getAssociatedDebitCardForCurrentAccount(acc);
                  return (
                    <td key={acc.id} className="p-4 text-center font-bold">
                      {card ? (
                        <div className="space-y-1">
                          <span className="text-xs text-[#2563EB] dark:text-[#60A5FA] block">{card.name || card.card_name || card.cardName}</span>
                          <span className="text-[10px] text-slate-400 block font-normal">Fee: {card.annualFee === 0 ? 'Free' : `₹${card.annualFee}`}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400">Debit card association not specified in provided data.</span>
                      )}
                    </td>
                  );
                })}
              </tr>

              <tr>
                <td className="p-4 font-bold text-slate-700 dark:text-slate-300">Verified Source</td>
                {queue.map(acc => (
                  <td key={acc.id} className="p-4 text-center text-xs text-slate-500">
                    {acc.officialSource ? (
                      <a href={acc.officialSource} target="_blank" rel="noreferrer" className="text-[#2563EB] underline">
                        Official Bank Link
                      </a>
                    ) : (
                      "Public Source"
                    )}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}

export default CurrentAccountsComparePage;
