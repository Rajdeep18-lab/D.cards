import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, CheckCircle2, XCircle, CreditCard, Scale, Info, ExternalLink } from 'lucide-react';
import { getAssociatedDebitCard, getAssociatedDebitCards } from '../data/mockSavingsAccounts';

function SavingsAccountComparisonModal({ isOpen, onClose, compareQueue = [], onRemove, onSelectDebitCard }) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[1200] flex items-center justify-center p-3 sm:p-6 overflow-y-auto pointer-events-auto select-none">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm z-0"
        />

        {/* Comparison Modal Box */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.96 }}
          transition={{ type: 'spring', stiffness: 350, damping: 28 }}
          className="relative z-10 w-full max-w-6xl max-h-[90vh] my-auto flex flex-col rounded-[28px] bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 shadow-[0_25px_80px_rgba(15,23,42,0.35)] overflow-hidden text-left"
        >
          {/* Header */}
          <div className="p-5 sm:p-6 pb-4 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between flex-shrink-0 bg-slate-50/60 dark:bg-slate-900/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#0B3D91] to-[#2563EB] text-white flex items-center justify-center font-bold text-lg shadow-md shadow-[#2563EB]/25">
                <Scale className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-extrabold text-[#0B3D91] dark:text-white tracking-tight leading-snug">
                  Savings Accounts Comparison Matrix
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Side-by-side analysis of interest rates, minimum balances & associated debit cards
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              aria-label="Close modal"
              className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700 flex items-center justify-center cursor-pointer transition-all hover:scale-105"
            >
              <X className="w-4.5 h-4.5" />
            </button>
          </div>

          {/* Comparison Table Scroll Area */}
          <div className="p-4 sm:p-6 overflow-x-auto overflow-y-auto flex-1 custom-scrollbar text-xs sm:text-sm">
            {compareQueue.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <Scale className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto" />
                <p className="font-bold text-slate-500">No savings accounts queued for comparison.</p>
                <p className="text-xs text-slate-400">Click "Compare" on 2 or 3 savings account cards to view them side by side.</p>
              </div>
            ) : (
              <table className="w-full border-collapse text-left min-w-[650px]">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800">
                    <th className="p-3.5 w-48 font-bold text-slate-400 dark:text-slate-500 uppercase text-[10.5px] tracking-wider sticky left-0 bg-white dark:bg-[#0F172A] z-10">
                      Account Feature
                    </th>
                    {compareQueue.map((acc) => (
                      <th key={acc.id} className="p-3.5 font-bold text-slate-800 dark:text-slate-100 min-w-[200px] text-center align-top">
                        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 space-y-2 relative group">
                          <button
                            onClick={() => onRemove && onRemove(acc.id)}
                            className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-rose-500 text-white text-xs flex items-center justify-center shadow cursor-pointer hover:scale-110 transition-transform"
                            title="Remove from comparison"
                          >
                            ×
                          </button>
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0B3D91] to-[#2563EB] text-white flex items-center justify-center font-extrabold text-xs mx-auto shadow-xs">
                            {acc.logo || acc.bank.substring(0, 2).toUpperCase()}
                          </div>
                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">{acc.bank}</span>
                          <h4 className="font-extrabold text-xs text-[#1F2937] dark:text-white leading-tight">{acc.accountName}</h4>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                  {/* Account Type */}
                  <tr>
                    <td className="p-3.5 font-bold text-slate-700 dark:text-slate-300 sticky left-0 bg-white dark:bg-[#0F172A] z-10">Account Type</td>
                    {compareQueue.map((acc) => (
                      <td key={acc.id} className="p-3.5 text-center font-semibold">
                        <span className="px-2.5 py-1 rounded-full text-xs bg-[#2563EB]/10 text-[#2563EB] dark:text-[#60A5FA] font-bold">
                          {acc.accountType}
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* Interest Rate */}
                  <tr>
                    <td className="p-3.5 font-bold text-slate-700 dark:text-slate-300 sticky left-0 bg-white dark:bg-[#0F172A] z-10">Interest Rate</td>
                    {compareQueue.map((acc) => (
                      <td key={acc.id} className="p-3.5 text-center font-black text-emerald-600 dark:text-emerald-400 text-base">
                        {acc.interestRate}
                      </td>
                    ))}
                  </tr>

                  {/* Minimum Balance */}
                  <tr>
                    <td className="p-3.5 font-bold text-slate-700 dark:text-slate-300 sticky left-0 bg-white dark:bg-[#0F172A] z-10">Minimum Balance</td>
                    {compareQueue.map((acc) => (
                      <td key={acc.id} className="p-3.5 text-center font-bold text-slate-800 dark:text-slate-200">
                        {acc.minimumBalance}
                      </td>
                    ))}
                  </tr>

                  {/* Zero Balance Status */}
                  <tr>
                    <td className="p-3.5 font-bold text-slate-700 dark:text-slate-300 sticky left-0 bg-white dark:bg-[#0F172A] z-10">Zero Balance Available</td>
                    {compareQueue.map((acc) => (
                      <td key={acc.id} className="p-3.5 text-center">
                        {acc.isZeroBalance ? (
                          <span className="text-emerald-600 dark:text-emerald-400 font-bold inline-flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4" /> Yes
                          </span>
                        ) : (
                          <span className="text-slate-400 font-medium">No</span>
                        )}
                      </td>
                    ))}
                  </tr>

                  {/* Non-Maintenance Charges */}
                  <tr>
                    <td className="p-3.5 font-bold text-slate-700 dark:text-slate-300 sticky left-0 bg-white dark:bg-[#0F172A] z-10">Non-Maintenance Charges</td>
                    {compareQueue.map((acc) => (
                      <td key={acc.id} className="p-3.5 text-center text-xs font-medium text-slate-600 dark:text-slate-300">
                        {acc.nonMaintenanceCharges || "Nil"}
                      </td>
                    ))}
                  </tr>

                  {/* Online Video KYC */}
                  <tr>
                    <td className="p-3.5 font-bold text-slate-700 dark:text-slate-300 sticky left-0 bg-white dark:bg-[#0F172A] z-10">Online Video KYC</td>
                    {compareQueue.map((acc) => (
                      <td key={acc.id} className="p-3.5 text-center">
                        {acc.isOnlineOpening ? (
                          <span className="text-indigo-600 dark:text-indigo-400 font-bold">✓ Instant Video KYC</span>
                        ) : (
                          <span className="text-slate-400">Branch Visit</span>
                        )}
                      </td>
                    ))}
                  </tr>

                  <tr className="bg-slate-50 dark:bg-slate-900/60">
                    <td className="p-3.5 font-black text-[#0B3D91] dark:text-[#60A5FA] uppercase text-[11px] tracking-wider sticky left-0 bg-slate-50 dark:bg-slate-900 z-10">
                      💳 Associated Debit Card
                    </td>
                    {compareQueue.map((acc) => {
                      const cards = getAssociatedDebitCards(acc);
                      const associatedCard = cards.length > 0 ? cards[0] : getAssociatedDebitCard(acc.associatedDebitCardId);
                      return (
                        <td key={acc.id} className="p-3.5 text-center align-top">
                          {associatedCard ? (
                            <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-left space-y-1.5 shadow-xs">
                              <div className="flex items-center justify-between">
                                <span className="text-[9.5px] font-bold text-[#2563EB] dark:text-[#60A5FA] uppercase tracking-wider block">
                                  {associatedCard.network || 'Visa'} • {associatedCard.category || 'Standard'}
                                </span>
                                {cards.length > 1 && (
                                  <span className="px-1.5 py-0.5 rounded bg-blue-100 dark:bg-slate-700 text-[#2563EB] dark:text-blue-300 font-bold text-[9px]">
                                    {cards.length} Cards
                                  </span>
                                )}
                              </div>
                              <h5 className="font-extrabold text-xs text-slate-800 dark:text-white leading-tight">
                                {associatedCard.cardName}
                              </h5>
                              <div className="text-[11px] text-slate-600 dark:text-slate-300 space-y-0.5 pt-1 border-t border-slate-100 dark:border-slate-700">
                                <p><strong>Fee:</strong> {associatedCard.annualFee || 'Free'}</p>
                                <p><strong>ATM Limit:</strong> ₹{(associatedCard.atmLimit || associatedCard.limits?.atmLimit || 50000).toLocaleString('en-IN')}/day</p>
                                <p><strong>POS Limit:</strong> ₹{(associatedCard.posLimit || associatedCard.limits?.posLimit || 100000).toLocaleString('en-IN')}/day</p>
                                <p><strong>Lounge:</strong> {associatedCard.loungeAccess || "No"}</p>
                                <p><strong>International:</strong> {associatedCard.international ? 'Available' : 'Domestic Only'}</p>
                              </div>
                              {onSelectDebitCard && (
                                <button
                                  onClick={() => { onClose(); onSelectDebitCard(associatedCard); }}
                                  className="w-full mt-2 px-2 py-1 rounded bg-[#2563EB]/10 text-[#2563EB] dark:text-[#60A5FA] text-[10.5px] font-bold hover:bg-[#2563EB] hover:text-white transition-colors cursor-pointer text-center"
                                >
                                  Full Card Details →
                                </button>
                              )}
                            </div>
                          ) : (
                            <span className="text-xs font-semibold text-slate-500">
                              {acc.associatedDebitCardName || "Debit card info not available"}
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                </tbody>
              </table>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60 flex items-center justify-between flex-shrink-0">
            <span className="text-xs text-slate-500 font-medium hidden sm:inline">
              Comparing up to 3 savings accounts simultaneously
            </span>
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs sm:text-sm cursor-pointer transition-all active:scale-95 ml-auto"
            >
              Close Comparison Matrix
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default SavingsAccountComparisonModal;
