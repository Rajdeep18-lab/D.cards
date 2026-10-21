import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Scale, ArrowLeft, Building2, Briefcase, CreditCard } from 'lucide-react';
import { getAssociatedDebitCardForCurrentAccount } from '../data/currentAccounts/index.js';
import BankLogo from '../components/BankLogo';
import { safeArray } from '../utils/safeUtils';
import { useSEO } from '../hooks/useSEO';
import { formatMinimumBalance, formatNonMaintenanceCharge, formatCashDepositLimit } from '../utils/bankingDataFormatter';

import { useLanguage } from '../context/LanguageContext';

function CurrentAccountsComparePage({ compareQueue = [], setCompareQueue, onSelectDebitCard }) {
  const { isHindi, t } = useLanguage();
  useSEO({
    title: isHindi
      ? "चालू खातों की तुलना — नकद जमा सीमा, MAB व शुल्क | D.Card"
      : "Compare Current Accounts Side by Side | D.Card",
    description: isHindi
      ? "व्यवसायों के लिए चालू खातों की नकद जमा सीमा, न्यूनतम बैलेंस और लिंक डेबिट कार्ड की तुलना करें।"
      : "Compare cash deposit limits, minimum balance, and charges across current accounts side by side on D.Card.",
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
            <ArrowLeft className="w-3.5 h-3.5" /> {isHindi ? '← चालू खातों पर वापस जाएं' : 'Back to Current Accounts'}
          </Link>
          <h1 className="text-3xl font-extrabold text-[#1F2937] dark:text-white tracking-tight">
            {isHindi ? 'चालू खाता (Current Account) आमने-सामने तुलना' : 'Current Accounts Side-by-Side Comparison'}
          </h1>
          <p className="text-xs sm:text-sm text-[#6B7280] dark:text-slate-400 mt-1">
            {isHindi 
              ? 'व्यावसायिक खातों, न्यूनतम बैलेंस, नकद जमा सीमा, चेक लीव्स और लिंक्ड बिजनेस डेबिट कार्ड की तुलना करें।'
              : 'Compare business accounts, MAB requirements, cash deposit slabs, cheque leaves, and linked business debit cards.'}
          </p>
        </div>

        {queue.length > 0 && setCompareQueue && (
          <button
            onClick={() => setCompareQueue([])}
            className="px-4 py-2 rounded-xl text-xs font-bold text-rose-600 border border-rose-200 hover:bg-rose-50 cursor-pointer"
          >
            {isHindi ? 'सभी हटाएं' : 'Clear All'}
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
          <span>{t('compare.debitCardsTab', 'Debit Cards')}</span>
        </button>
        <button
          onClick={() => navigate('/compare-savings')}
          className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>{t('compare.savingsAccountsTab', 'Savings Accounts')}</span>
        </button>
        <button
          onClick={() => navigate('/compare-current')}
          className="px-4 py-2 rounded-xl text-xs font-bold bg-[#2563EB] text-white shadow-xs cursor-pointer flex items-center gap-1.5"
        >
          <Briefcase className="w-3.5 h-3.5" />
          <span>{t('compare.currentAccountsTab', 'Current Accounts')}</span>
        </button>
      </div>

      {queue.length === 0 ? (
        <div className="py-20 text-center space-y-4">
          <Briefcase className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto" />
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">
            {isHindi ? 'तुलना के लिए कोई चालू खाता चयनित नहीं है' : 'No Current Accounts Selected for Comparison'}
          </h2>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {isHindi
              ? 'चालू खातों को ब्राउज़ करें और आमने-सामने तुलना के लिए 3 खातों तक "तुलना करें" पर क्लिक करें।'
              : 'Browse current accounts and click "Compare" on up to 3 accounts to view side-by-side matrices.'}
          </p>
          <Link
            to="/current-accounts"
            className="inline-block px-6 py-2.5 rounded-full bg-[#2563EB] text-white font-bold text-xs shadow-md"
          >
            {isHindi ? 'चालू खाते देखें' : 'Browse Current Accounts'}
          </Link>
        </div>
      ) : (
        <div className="p-6 rounded-3xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 shadow-soft overflow-x-auto">
          <table className="w-full border-collapse text-left min-w-[700px]">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800">
                <th className="p-4 w-52 font-bold text-slate-400 dark:text-slate-500 uppercase text-[11px]">
                  {isHindi ? 'व्यावसायिक मापदंड' : 'Business Parameter'}
                </th>
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
                      <div className="flex justify-center">
                        <BankLogo bankName={acc.bankName || acc.bank} size="md" />
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
                <td className="p-4 font-bold text-slate-700 dark:text-slate-300">
                  {t('savings.accountType', 'Account Type')}
                </td>
                {queue.map(acc => (
                  <td key={acc.id} className="p-4 text-center font-bold text-[#2563EB] dark:text-[#60A5FA]">
                    {acc.accountType}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-4 font-bold text-slate-700 dark:text-slate-300">
                  {isHindi ? 'न्यूनतम बैलेंस (MAB/AQB)' : 'Minimum Balance (MAB/AQB)'}
                </td>
                {queue.map(acc => {
                  const minBal = formatMinimumBalance(acc.minimumBalance, acc);
                  return (
                    <td key={acc.id} className="p-4 text-center">
                      <div className="font-black text-[#1F2937] dark:text-white text-base">
                        {minBal.display}
                      </div>
                      {minBal.subtext && (
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                          {minBal.subtext}
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>

              <tr>
                <td className="p-4 font-bold text-slate-700 dark:text-slate-300">
                  {isHindi ? 'न्यूनतम बैलेंस न रखने पर जुर्माना' : 'Non-Maintenance Penalty'}
                </td>
                {queue.map(acc => {
                  const charge = formatNonMaintenanceCharge(acc.nonMaintenanceCharge || acc.nonMaintenanceCharges, acc);
                  return (
                    <td key={acc.id} className="p-4 text-center">
                      <div className="font-bold text-rose-500 text-xs sm:text-sm">
                        {charge.display}
                      </div>
                    </td>
                  );
                })}
              </tr>

              <tr>
                <td className="p-4 font-bold text-slate-700 dark:text-slate-300">
                  {isHindi ? 'मुफ़्त नकद जमा सीमा' : 'Free Cash Deposit Limit'}
                </td>
                {queue.map(acc => {
                  const deposit = formatCashDepositLimit(acc.cashDepositLimit, acc);
                  return (
                    <td key={acc.id} className="p-4 text-center">
                      <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        {deposit.display}
                      </div>
                      {deposit.subtext && (
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {deposit.subtext}
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>

              <tr>
                <td className="p-4 font-bold text-slate-700 dark:text-slate-300">
                  {isHindi ? 'निःशुल्क चेक बुक पन्ने' : 'Free Cheque Leaves'}
                </td>
                {queue.map(acc => (
                  <td key={acc.id} className="p-4 text-center font-bold text-emerald-600">
                    {acc.freeChequeLeaves || (isHindi ? "शामिल" : "Included")}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-4 font-bold text-slate-700 dark:text-slate-300">NEFT / RTGS</td>
                {queue.map(acc => (
                  <td key={acc.id} className="p-4 text-center font-bold text-emerald-600">
                    {acc.neft || (isHindi ? "निःशुल्क डिजिटल" : "Free Digital")}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-4 font-bold text-slate-700 dark:text-slate-300">
                  {isHindi ? 'संबंधित बिजनेस डेबिट कार्ड' : 'Associated Business Debit Card'}
                </td>
                {queue.map(acc => {
                  const card = getAssociatedDebitCardForCurrentAccount(acc);
                  return (
                    <td key={acc.id} className="p-4 text-center font-bold">
                      {card ? (
                        <div className="space-y-1">
                          <span className="text-xs text-[#2563EB] dark:text-[#60A5FA] block">{card.name || card.card_name || card.cardName}</span>
                          <span className="text-[10px] text-slate-400 block font-normal">
                            {isHindi ? 'शुल्क:' : 'Fee:'} {card.annualFee === 0 ? (isHindi ? 'निःशुल्क (₹0)' : 'Free') : `₹${card.annualFee}`}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400">
                          {isHindi ? 'इस खाते के लिए डेबिट कार्ड का विवरण निर्दिष्ट नहीं है।' : 'Debit card association not specified in provided data.'}
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>

              <tr>
                <td className="p-4 font-bold text-slate-700 dark:text-slate-300">
                  {isHindi ? 'सत्यापित स्रोत' : 'Verified Source'}
                </td>
                {queue.map(acc => (
                  <td key={acc.id} className="p-4 text-center text-xs text-slate-500">
                    {acc.officialSource ? (
                      <a href={acc.officialSource} target="_blank" rel="noreferrer" className="text-[#2563EB] underline">
                        {isHindi ? 'आधिकारिक बैंक लिंक' : 'Official Bank Link'}
                      </a>
                    ) : (
                      isHindi ? 'सार्वजनिक स्रोत' : "Public Source"
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
