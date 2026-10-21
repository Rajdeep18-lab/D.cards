import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Scale, ArrowLeft, Building2, CreditCard, Briefcase } from 'lucide-react';
import { getAssociatedDebitCard, getAssociatedDebitCards } from '../data/mockSavingsAccounts';
import BankLogo from '../components/BankLogo';
import { useSEO } from '../hooks/useSEO';
import { formatInterestRate, formatMinimumBalance, formatNonMaintenanceCharge } from '../utils/bankingDataFormatter';

import { useLanguage } from '../context/LanguageContext';

function SavingsAccountsComparePage({ compareQueue = [], setCompareQueue, onSelectDebitCard }) {
  const { isHindi, t } = useLanguage();
  useSEO({
    title: isHindi 
      ? "बचत खातों की तुलना — ब्याज दर, न्यूनतम बैलेंस व शुल्क | D.Card"
      : "Compare Savings Accounts Side by Side | D.Card",
    description: isHindi
      ? "भारतीय बैंकों के बचत खातों की ब्याज दरों, न्यूनतम बैलेंस और लिंक डेबिट कार्ड की तुलना करें।"
      : "Compare interest rates, minimum balance requirements, and perks across savings accounts side by side on D.Card.",
    canonicalUrl: "https://www.dcard.website/compare-savings"
  });

  const navigate = useNavigate();

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 relative z-20 space-y-8 text-left select-none">
      <div className="flex items-center justify-between border-b border-[#E5E7EB] dark:border-slate-800 pb-6">
        <div>
          <Link to="/savings-accounts" className="text-xs font-bold text-[#2563EB] dark:text-[#60A5FA] flex items-center gap-1 mb-2 hover:underline">
            <ArrowLeft className="w-3.5 h-3.5" /> {isHindi ? '← बचत खातों पर वापस जाएं' : 'Back to Savings Accounts'}
          </Link>
          <h1 className="text-3xl font-extrabold text-[#1F2937] dark:text-white tracking-tight">
            {isHindi ? 'बचत खाता आमने-सामने तुलना' : 'Savings Accounts Side-by-Side Comparison'}
          </h1>
          <p className="text-xs sm:text-sm text-[#6B7280] dark:text-slate-400 mt-1">
            {isHindi
              ? 'ब्याज दरों, न्यूनतम बैलेंस, शुल्कों और संबंधित डेबिट कार्ड लाभों की तुलना करें।'
              : 'Compare interest rates, minimum balances, charges, and associated debit card perks.'}
          </p>
        </div>

        {compareQueue.length > 0 && (
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
          className="px-4 py-2 rounded-xl text-xs font-bold bg-[#2563EB] text-white shadow-xs cursor-pointer flex items-center gap-1.5"
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>{t('compare.savingsAccountsTab', 'Savings Accounts')}</span>
        </button>
        <button
          onClick={() => navigate('/compare-current')}
          className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
        >
          <Briefcase className="w-3.5 h-3.5" />
          <span>{t('compare.currentAccountsTab', 'Current Accounts')}</span>
        </button>
      </div>

      {compareQueue.length === 0 ? (
        <div className="py-20 text-center space-y-4">
          <Building2 className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto" />
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">
            {t('compare.noAccountsTitle', 'No Savings Accounts Selected')}
          </h2>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {t('compare.noAccountsDesc', 'Add up to 3 savings accounts to compare interest rates, minimum balance, penalty charges, and linked debit cards.')}
          </p>
          <Link
            to="/savings-accounts"
            className="inline-block px-6 py-2.5 rounded-full bg-[#2563EB] text-white font-bold text-xs shadow-md"
          >
            {t('compare.browseAccountsBtn', 'Browse Savings Accounts')}
          </Link>
        </div>
      ) : (
        <div className="p-6 rounded-3xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 shadow-soft overflow-x-auto">
          <table className="w-full border-collapse text-left min-w-[700px]">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800">
                <th className="p-4 w-52 font-bold text-slate-400 dark:text-slate-500 uppercase text-[11px]">
                  {isHindi ? 'मापदंड (Parameter)' : 'Parameter'}
                </th>
                {compareQueue.map(acc => (
                  <th key={acc.id} className="p-4 min-w-[220px] text-center">
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2 relative">
                      <button
                        onClick={() => setCompareQueue(prev => prev.filter(a => String(a.id) !== String(acc.id)))}
                        className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-rose-500 text-white text-xs flex items-center justify-center cursor-pointer shadow"
                      >
                        ×
                      </button>
                      <div className="flex justify-center">
                        <BankLogo bankName={acc.bank} size="md" />
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">{acc.bank}</span>
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
                {compareQueue.map(acc => (
                  <td key={acc.id} className="p-4 text-center font-bold text-[#2563EB] dark:text-[#60A5FA]">
                    {acc.accountType}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 font-bold text-slate-700 dark:text-slate-300">
                  {t('savings.interestRate', 'Interest Rate')}
                </td>
                {compareQueue.map(acc => {
                  const rateObj = formatInterestRate(acc.interestRate, acc);
                  return (
                    <td key={acc.id} className="p-4 text-center">
                      <div className="font-black text-emerald-600 dark:text-emerald-400 text-base">
                        {rateObj.display}
                      </div>
                      {rateObj.badge && (
                        <span className="inline-block mt-1 text-[10px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                          {rateObj.badge}
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>
              <tr>
                <td className="p-4 font-bold text-slate-700 dark:text-slate-300">
                  {t('savings.minimumBalance', 'Minimum Balance')}
                </td>
                {compareQueue.map(acc => {
                  const minBal = formatMinimumBalance(acc.minimumBalance, acc);
                  return (
                    <td key={acc.id} className="p-4 text-center">
                      <div className="font-bold text-slate-900 dark:text-white">
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
                  {isHindi ? 'जीरो बैलेंस सुविधा' : 'Zero Balance Available'}
                </td>
                {compareQueue.map(acc => (
                  <td key={acc.id} className="p-4 text-center font-bold text-emerald-600">
                    {acc.isZeroBalance ? (isHindi ? "✓ हाँ" : "✓ Yes") : (isHindi ? "नहीं" : "No")}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 font-bold text-slate-700 dark:text-slate-300">
                  {isHindi ? 'न्यूनतम बैलेंस न रखने पर शुल्क' : 'Non-Maintenance Charge'}
                </td>
                {compareQueue.map(acc => {
                  const charge = formatNonMaintenanceCharge(acc.nonMaintenanceCharges, acc);
                  return (
                    <td key={acc.id} className="p-4 text-center">
                      <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        {charge.display}
                      </div>
                    </td>
                  );
                })}
              </tr>
              <tr>
                <td className="p-4 font-bold text-slate-700 dark:text-slate-300">
                  {isHindi ? 'ऑनलाइन वीडियो KYC' : 'Online Video KYC'}
                </td>
                {compareQueue.map(acc => (
                  <td key={acc.id} className="p-4 text-center font-semibold text-indigo-600">
                    {acc.isOnlineOpening 
                      ? (isHindi ? "✓ तुरंत वीडियो KYC" : "✓ Instant Video KYC") 
                      : (isHindi ? "शाखा में जाएं" : "Branch Visit")}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 font-bold text-slate-700 dark:text-slate-300">
                  {isHindi ? 'पात्रता एवं शर्तें' : 'Eligibility & Conditions'}
                </td>
                {compareQueue.map(acc => (
                  <td key={acc.id} className="p-4 text-center text-xs font-medium text-slate-600 dark:text-slate-400">
                    {acc.eligibility && acc.eligibility.length > 0 
                      ? acc.eligibility[0] 
                      : (isHindi ? "निवासी भारतीय (18+)" : "Resident Indian (18+)")}
                  </td>
                ))}
              </tr>
              <tr className="bg-slate-50 dark:bg-slate-900/60">
                <td className="p-4 font-black text-[#0B3D91] dark:text-[#60A5FA] uppercase text-xs">
                  💳 {t('savings.linkedCard', 'Linked Debit Card')}
                </td>
                {compareQueue.map(acc => {
                  const cards = getAssociatedDebitCards(acc);
                  const card = cards.length > 0 ? cards[0] : null;
                  return (
                    <td key={acc.id} className="p-4 text-center align-top">
                      {card ? (
                        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-left space-y-1.5 shadow-xs">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-[#2563EB] uppercase">{card.network || 'Visa'}</span>
                            {cards.length > 1 && (
                              <span className="px-1.5 py-0.5 rounded bg-blue-100 text-[#2563EB] font-bold text-[9px]">
                                {cards.length} {isHindi ? 'कार्ड' : 'Cards'}
                              </span>
                            )}
                          </div>
                          <h4 className="font-extrabold text-xs text-slate-800 dark:text-white leading-tight">{card.card_name || card.cardName}</h4>
                          <div className="text-[11px] text-slate-600 dark:text-slate-300 space-y-0.5 pt-1 border-t border-slate-100 dark:border-slate-700">
                            <p><strong>{isHindi ? 'वार्षिक शुल्क:' : 'Fee:'}</strong> {card.annual_fee || card.annualFee || (isHindi ? 'जानकारी उपलब्ध नहीं' : 'Information not available')}</p>
                            <p><strong>{isHindi ? 'एटीएम सीमा:' : 'ATM Limit:'}</strong> {card.atm_limit || card.cashWithdrawalLimit || (isHindi ? 'जानकारी उपलब्ध नहीं' : 'Information not available')}</p>
                            <p><strong>{isHindi ? 'पीओएस सीमा:' : 'POS Limit:'}</strong> {card.pos_limit || card.purchaseLimit || (isHindi ? 'जानकारी उपलब्ध नहीं' : 'Information not available')}</p>
                            <p><strong>{isHindi ? 'लाउंज एक्सेस:' : 'Lounge Access:'}</strong> {card.lounge_access || card.loungeAccess || (isHindi ? 'जानकारी उपलब्ध नहीं' : 'Information not available')}</p>
                          </div>
                          {onSelectDebitCard && (
                            <button
                              onClick={() => onSelectDebitCard(card)}
                              className="w-full mt-2 py-1 rounded bg-[#2563EB]/10 hover:bg-[#2563EB] text-[#2563EB] hover:text-white font-bold text-[10.5px] transition-colors cursor-pointer text-center"
                            >
                              {isHindi ? 'कार्ड विवरण देखें →' : 'View Card Specs →'}
                            </button>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs font-semibold text-slate-500">
                          {isHindi ? 'इस खाते के लिए डेबिट कार्ड की जानकारी उपलब्ध नहीं है।' : 'Debit card information not available for this account.'}
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}

export default SavingsAccountsComparePage;
