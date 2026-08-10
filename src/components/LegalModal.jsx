import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Lock, Scale, AlertTriangle } from 'lucide-react';

const TABS = [
  { id: 'privacy', label: 'Privacy Policy', icon: Lock, emoji: '🔒' },
  { id: 'terms', label: 'Terms & Conditions', icon: Scale, emoji: '⚖️' },
  { id: 'disclaimer', label: 'Disclaimer', icon: AlertTriangle, emoji: '⚠️' }
];

function LegalModal({ isOpen, onClose, initialTab = 'privacy' }) {
  const [activeTab, setActiveTab] = useState(initialTab);

  // Sync tab state when modal is opened from different links
  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Prevent scroll propagation
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Modal Overlay Container */}
          <div className="fixed inset-0 z-[1200] flex items-center justify-center p-3 sm:p-6 overflow-y-auto pointer-events-auto select-none">
            {/* Backdrop */}
            <motion.div
              key="legal-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm z-0"
            />

            {/* Modal Box */}
            <motion.div
              key="legal-modal"
              initial={{ opacity: 0, y: 25, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 350, damping: 28 }}
              className="relative z-10 w-full max-w-[740px] max-h-[88vh] my-auto flex flex-col rounded-[24px] sm:rounded-[28px] bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 shadow-[0_24px_80px_rgba(15,23,42,0.35)] overflow-hidden"
            >
              {/* Header */}
              <div className="p-4 sm:p-6 pb-3 sm:pb-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 flex-shrink-0 bg-slate-50/60 dark:bg-slate-900/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-[#2563EB] to-[#3B82F6] flex items-center justify-center text-white text-lg sm:text-xl shadow-md shadow-[#2563EB]/25 flex-shrink-0">
                    ⚖️
                  </div>
                  <div className="text-left">
                    <h2 className="text-lg sm:text-xl font-black text-[#0B3D91] dark:text-white tracking-tight leading-snug">
                      D.Card Trust Center
                    </h2>
                    <p className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-400 font-semibold">
                      Startup-ready Legal Standards & Data Disclosures
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  aria-label="Close modal"
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700 flex items-center justify-center cursor-pointer transition-all flex-shrink-0 hover:scale-105 active:scale-95"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Tabs Navigation */}
              <div className="px-4 sm:px-6 pt-3.5 sm:pt-4 flex items-center gap-2 overflow-x-auto custom-scrollbar flex-shrink-0 pb-1">
                {TABS.map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs font-extrabold transition-all duration-200 cursor-pointer flex items-center gap-1.5 flex-shrink-0 select-none ${
                        isActive
                          ? 'bg-gradient-to-r from-[#2563EB] to-[#3B82F6] text-white shadow-md shadow-[#2563EB]/25 border border-transparent'
                          : 'bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700/80 hover:bg-slate-200/80 dark:hover:bg-slate-700'
                      }`}
                    >
                      <span>{tab.emoji}</span>
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Divider */}
              <div className="h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-800 to-transparent mt-3 flex-shrink-0" />

              {/* Scrollable Content Area */}
              <div className="p-4 sm:p-6 overflow-y-auto flex-1 text-left text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-200 custom-scrollbar space-y-4">
                {activeTab === 'privacy' && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
                    <h3 className="text-base sm:text-lg font-black text-[#0B3D91] dark:text-white mb-3">Privacy Policy</h3>
                    <p className="text-slate-700 dark:text-slate-300 mb-4 leading-relaxed font-medium">
                      At <strong className="text-slate-900 dark:text-white font-extrabold">D.Card</strong>, we believe in radical transparency. D.Card operates as a debit card discovery and optimization platform, designed to help users evaluate and compare debit card charges, rates, and features prior to opening a bank account. This policy outlines exactly what data we collect, where it resides, and what sensitive information we strictly do not collect.
                    </p>

                    <h4 className="font-extrabold text-[#2563EB] dark:text-[#60A5FA] mt-5 mb-2 uppercase text-xs tracking-wider">
                      1. Information We Collect
                    </h4>
                    <p className="text-slate-700 dark:text-slate-300 mb-3 leading-relaxed font-medium">
                      To deliver cloud-synchronized comparison logs and wishlists, D.Card gathers the following categories of information:
                    </p>
                    <ul className="list-disc pl-5 mb-4 space-y-2 text-slate-700 dark:text-slate-300 font-medium">
                      <li><strong className="text-slate-900 dark:text-white font-bold">Account Details:</strong> Name, Email, and optional Phone number (provided during registration or update profile queries).</li>
                      <li><strong className="text-slate-900 dark:text-white font-bold">Saved Cards:</strong> Selected debit cards added to your personalized Wishlist.</li>
                      <li><strong className="text-slate-900 dark:text-white font-bold">Compare Activity:</strong> Logged historical card parameters you evaluated side-by-side.</li>
                      <li><strong className="text-slate-900 dark:text-white font-bold">Contact Messages:</strong> Inquiries, feedback, and report logs dispatched via the contact forms.</li>
                      <li><strong className="text-slate-900 dark:text-white font-bold">Referral & Action Clicks:</strong> Timestamps of clickouts leading from our engine to official banking landing portals.</li>
                    </ul>

                    <h4 className="font-extrabold text-[#2563EB] dark:text-[#60A5FA] mt-5 mb-2 uppercase text-xs tracking-wider">
                      2. Data Stored Securely in Firebase
                    </h4>
                    <p className="text-slate-700 dark:text-slate-300 mb-4 leading-relaxed font-medium">
                      All gathered data is securely stored, authenticated, and guarded in our <strong className="text-slate-900 dark:text-white font-bold">Firebase Firestore</strong> cloud database layer. Your data is encrypted in transit and at rest using banking-standard secure access protocols. No profile datasets or log arrays are shared with third-party advertising brokers.
                    </p>

                    <div className="p-4 rounded-2xl mb-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 shadow-xs">
                      <h4 className="font-extrabold text-rose-700 dark:text-rose-400 uppercase text-xs tracking-wider mb-2 flex items-center gap-1.5">
                        ❌ Critical Security Pledge: What We Do NOT Collect
                      </h4>
                      <p className="text-xs text-rose-900 dark:text-rose-200 leading-relaxed font-semibold">
                        D.Card is a discovery database, NOT a bank or card issuer. We will <strong className="font-extrabold underline">never</strong> ask for, collect, or store the following sensitive records:
                      </p>
                      <ul className="list-disc pl-5 mt-2 space-y-1 text-xs text-rose-850 dark:text-rose-300 font-semibold">
                        <li>ATM PIN numbers</li>
                        <li>Debit card numbers (PAN/CVV/Expiry)</li>
                        <li>Online bank passwords or credentials</li>
                        <li>Aadhaar number</li>
                        <li>PAN card number</li>
                        <li>Bank account numbers</li>
                      </ul>
                    </div>

                    <h4 className="font-extrabold text-[#2563EB] dark:text-[#60A5FA] mt-5 mb-2 uppercase text-xs tracking-wider">
                      3. Contacting Us
                    </h4>
                    <p className="text-slate-700 dark:text-slate-300 mb-2 font-medium">
                      For privacy clarifications, please reach out to our privacy compliance desk using the contact drawer.
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 italic mt-6 font-medium">Last updated: June 2026</p>
                  </motion.div>
                )}

                {activeTab === 'terms' && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
                    <h3 className="text-base sm:text-lg font-black text-[#0B3D91] dark:text-white mb-3">Terms & Conditions</h3>
                    <p className="text-slate-700 dark:text-slate-300 mb-4 leading-relaxed font-medium">
                      Welcome to <strong className="text-slate-900 dark:text-white font-extrabold">D.Card</strong>. These Terms & Conditions govern your access to and usage of the D.Card web interface. By browsing, comparison-shopping, or logging into our application, you formally accept these terms.
                    </p>

                    <h4 className="font-extrabold text-[#2563EB] dark:text-[#60A5FA] mt-5 mb-2 uppercase text-xs tracking-wider">
                      1. Scope of Service
                    </h4>
                    <p className="text-slate-700 dark:text-slate-300 mb-3 leading-relaxed font-medium">
                      D.Card provides informational debit card matrices, fees, and feature comparisons. D.Card is not a bank, broker, or direct card distributor. We do not approve applications, nor do we issue cards.
                    </p>

                    <h4 className="font-extrabold text-[#2563EB] dark:text-[#60A5FA] mt-5 mb-2 uppercase text-xs tracking-wider">
                      2. User Conduct & Accounts
                    </h4>
                    <p className="text-slate-700 dark:text-slate-300 mb-3 leading-relaxed font-medium">
                      You are solely responsible for maintaining the privacy of your account login information. You agree not to engage in malicious scraping of card rates, scraping database content, or deploying automated bots to query the platform features.
                    </p>

                    <h4 className="font-extrabold text-[#2563EB] dark:text-[#60A5FA] mt-5 mb-2 uppercase text-xs tracking-wider">
                      3. Third-Party Banking Services
                    </h4>
                    <p className="text-slate-700 dark:text-slate-300 mb-3 leading-relaxed font-medium">
                      Our platform references links and redirect coordinates to official banking pages. We have no authority over the service level agreements, underwriting guidelines, interest structures, or operations of third-party banks. Your relationships with external banks are governed strictly by their respective terms of service.
                    </p>

                    <h4 className="font-extrabold text-[#2563EB] dark:text-[#60A5FA] mt-5 mb-2 uppercase text-xs tracking-wider">
                      4. Limitation of Liability
                    </h4>
                    <p className="text-slate-700 dark:text-slate-300 mb-4 leading-relaxed font-medium">
                      In no event shall D.Card, its founders, or affiliates be liable for any direct, indirect, incidental, or consequential damages resulting from choices, deposits, or applications completed based on parameters shown on D.Card.
                    </p>

                    <p className="text-xs text-slate-500 dark:text-slate-400 italic mt-6 font-medium">Last updated: June 2026</p>
                  </motion.div>
                )}

                {activeTab === 'disclaimer' && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
                    <h3 className="text-base sm:text-lg font-black text-[#0B3D91] dark:text-white mb-3">Regulatory & Information Disclaimer</h3>
                    
                    <div className="p-4 rounded-2xl mb-5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 shadow-xs">
                      <p className="text-xs font-extrabold text-amber-850 dark:text-amber-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        ⚠️ Critical Disclaimer: Verify Before Applying
                      </p>
                      <p className="text-xs leading-relaxed font-semibold text-amber-900 dark:text-amber-200">
                        Debit card fees, benefits, interest rates, lounge visit criteria, cash-withdrawal limits, eligibility thresholds, and active promotional offers change frequently. Banks reserve the right to alter features without prior warnings. Users MUST verify all rates and terms directly from the official bank websites or bank branches before applying for or opening any account.
                      </p>
                    </div>

                    <h4 className="font-extrabold text-[#2563EB] dark:text-[#60A5FA] mt-5 mb-2 uppercase text-xs tracking-wider">
                      1. No Warranties
                    </h4>
                    <p className="text-slate-700 dark:text-slate-300 mb-3 leading-relaxed font-medium">
                      The database parameters on D.Card are aggregated periodically from public bank schedules and user submissions. While we strive to maintain clean, audited directories, we do not warrant the timeliness, completeness, accuracy, or reliability of any information displayed.
                    </p>

                    <h4 className="font-extrabold text-[#2563EB] dark:text-[#60A5FA] mt-5 mb-2 uppercase text-xs tracking-wider">
                      2. Informational Purpose Only
                    </h4>
                    <p className="text-slate-700 dark:text-slate-300 mb-3 leading-relaxed font-medium">
                      The content provided on D.Card is for educational and comparison purposes only. It does not constitute financial, investment, legal, or banking advice. You should seek independent consultation or do direct bank diligence before finalizing financial relationship decisions.
                    </p>

                    <h4 className="font-extrabold text-[#2563EB] dark:text-[#60A5FA] mt-5 mb-2 uppercase text-xs tracking-wider">
                      3. Intellectual Property Disclaimer
                    </h4>
                    <p className="text-slate-700 dark:text-slate-300 mb-4 leading-relaxed font-medium">
                      All bank brand logos, product tags, registered trademarks (Visa, Mastercard, RuPay, etc.) remain the exclusive property of their respective corporate owners. D.Card does not claim ownership, nor does listing them imply any form of official bank sponsorship or direct financial compensation from primary banks listed here.
                    </p>

                    <p className="text-xs text-slate-500 dark:text-slate-400 italic mt-6 font-medium">Last updated: June 2026</p>
                  </motion.div>
                )}
              </div>

              {/* Footer buttons */}
              <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60 flex items-center justify-end flex-shrink-0">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#2563EB] to-[#3B82F6] hover:brightness-110 text-white font-bold text-xs sm:text-sm shadow-md shadow-[#2563EB]/25 cursor-pointer transition-all active:scale-95 select-none"
                >
                  Close & Accept Terms
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

export default LegalModal;
