import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const TABS = [
  { id: 'privacy', label: '🔒 Privacy Policy' },
  { id: 'terms', label: '⚖️ Terms & Conditions' },
  { id: 'disclaimer', label: '⚠️ Disclaimer' }
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
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
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

  const activeTabStyle = (tabId) => ({
    padding: '10px 18px',
    borderRadius: '12px',
    fontSize: '13px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.25s ease',
    border: 'none',
    outline: 'none',
    background: activeTab === tabId ? 'linear-gradient(135deg, #A30D62, #C21875)' : 'var(--bg-chip)',
    color: activeTab === tabId ? '#ffffff' : 'var(--text-soft)',
    boxShadow: activeTab === tabId ? '0 4px 12px rgba(194, 24, 117, 0.25)' : 'none',
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Modal Overlay Container */}
          <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4 sm:p-6 overflow-y-auto pointer-events-auto">
            {/* Backdrop */}
            <motion.div
              key="legal-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-[#1E0B16]/65 backdrop-blur-md z-0"
            />

            {/* Modal Box */}
            <motion.div
              key="legal-modal"
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 350, damping: 28 }}
              className="relative z-10 w-full max-w-[720px] max-h-[85vh] my-auto flex flex-col rounded-[28px] bg-[var(--modal-bg)] border border-[#C21875]/22 shadow-[0_24px_80px_rgba(122,15,82,0.3)] backdrop-blur-xl overflow-hidden custom-scrollbar"
            >
            {/* Header */}
            <div style={{ padding: '24px 24px 16px', display: 'flex', alignItems: 'center', justifyContent: 'between', flexShrink: 0 }}>
              <div style={{ display: 'flex', gap: '14px', alignItems: 'center', width: '100%' }}>
                <div style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '14px',
                  background: 'linear-gradient(135deg,#A30D62,#C21875)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '22px',
                  boxShadow: '0 6px 18px rgba(163,13,98,0.35)',
                  color: 'white',
                  flexShrink: 0
                }}>
                  ⚖️
                </div>
                <div style={{ flexGrow: 1, textAlign: 'left' }}>
                  <h2 style={{ margin: 0, fontSize: '22px', fontWeight: '900', fontFamily: 'serif', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                    D.Card Trust Center
                  </h2>
                  <p style={{ margin: 0, fontSize: '11.5px', color: 'var(--text-soft)', fontWeight: '600' }}>
                    Startup-ready Legal Standards & Data Disclosures
                  </p>
                </div>
                <button
                  onClick={onClose}
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '50%',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-chip)',
                    color: '#7A0F52',
                    fontSize: '16px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    transition: 'all 0.2s',
                    outline: 'none'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'rotate(90deg)'; e.currentTarget.style.background = 'rgba(194,24,117,0.1)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'rotate(0deg)'; e.currentTarget.style.background = 'var(--bg-chip)'; }}
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Tabs Navigation */}
            <div style={{ padding: '0 24px', display: 'flex', gap: '8px', flexWrap: 'wrap', flexShrink: 0 }}>
              {TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={activeTabStyle(tab.id)}
                  onMouseEnter={e => {
                    if (activeTab !== tab.id) {
                      e.currentTarget.style.background = 'rgba(194, 24, 117, 0.12)';
                      e.currentTarget.style.color = '#C21875';
                    }
                  }}
                  onMouseLeave={e => {
                    if (activeTab !== tab.id) {
                      e.currentTarget.style.background = 'var(--bg-chip)';
                      e.currentTarget.style.color = 'var(--text-soft)';
                    }
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Divider */}
            <div style={{ height: '1px', background: 'linear-gradient(90deg,transparent,rgba(194,24,117,0.2),transparent)', margin: '16px 0 0', flexShrink: 0 }} />

            {/* Scrollable Content Area */}
            <div
              className="custom-scrollbar text-left"
              style={{
                padding: '24px',
                overflowY: 'auto',
                fontSize: '13.5px',
                lineHeight: '1.65',
                color: 'var(--text-soft)',
                fontFamily: 'Inter, sans-serif',
                flexGrow: 1
              }}
            >
              {activeTab === 'privacy' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
                  <h3 className="font-serif text-lg font-black text-slate-800 dark:text-slate-100 mb-3">Privacy Policy</h3>
                  <p className="mb-4">
                    At <strong>D.Card</strong>, we believe in radical transparency. D.Card operates as a debit card discovery and optimization platform, designed to help users evaluate and compare debit card charges, rates, and features prior to opening a bank account. This policy outlines exactly what data we collect, where it resides, and what sensitive information we strictly do not collect.
                  </p>

                  <h4 className="font-bold text-slate-850 dark:text-slate-200 mt-5 mb-2 uppercase text-xs tracking-wider text-[#A30D62] dark:text-[#E0B2C4]">
                    1. Information We Collect
                  </h4>
                  <p className="mb-3">
                    To deliver cloud-synchronized comparison logs and wishlists, D.Card gathers the following categories of information:
                  </p>
                  <ul className="list-disc pl-5 mb-4 space-y-2">
                    <li><strong>Account Details:</strong> Name, Email, and optional Phone number (provided during registration or update profile queries).</li>
                    <li><strong>Saved Cards:</strong> Selected debit cards added to your personalized Wishlist.</li>
                    <li><strong>Compare Activity:</strong> Logged historical card parameters you evaluated side-by-side.</li>
                    <li><strong>Contact Messages:</strong> Inquiries, feedback, and report logs dispatched via the contact forms.</li>
                    <li><strong>Referral & Action Clicks:</strong> Timestamps of clickouts leading from our engine to official banking landing portals.</li>
                  </ul>

                  <h4 className="font-bold text-slate-850 dark:text-slate-200 mt-5 mb-2 uppercase text-xs tracking-wider text-[#A30D62] dark:text-[#E0B2C4]">
                    2. Data Stored Securely in Firebase
                  </h4>
                  <p className="mb-4">
                    All gathered data is securely stored, authenticated, and guarded in our **Firebase Firestore** cloud database layer. Your data is encrypted in transit and at rest using banking-standard secure access protocols. No profile datasets or log arrays are shared with third-party advertising brokers.
                  </p>

                  <div className="p-4 rounded-2xl mb-4" style={{ background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                    <h4 className="font-black text-rose-600 dark:text-rose-450 uppercase text-xs tracking-wider mb-2 flex items-center gap-1.5">
                      ❌ Critical Security Pledge: What We Do NOT Collect
                    </h4>
                    <p className="text-xs text-rose-800 dark:text-rose-350 leading-relaxed font-semibold">
                      D.Card is a discovery database, NOT a bank or card issuer. We will **never** ask for, collect, or store the following sensitive records:
                    </p>
                    <ul className="list-disc pl-5 mt-2 space-y-1 text-xs text-rose-800 dark:text-rose-350 font-semibold">
                      <li>ATM PIN numbers</li>
                      <li>Debit card numbers (PAN/CVV/Expiry)</li>
                      <li>Online bank passwords or credentials</li>
                      <li>Aadhaar number</li>
                      <li>PAN card number</li>
                      <li>Bank account numbers</li>
                    </ul>
                  </div>

                  <h4 className="font-bold text-slate-850 dark:text-slate-200 mt-5 mb-2 uppercase text-xs tracking-wider text-[#A30D62] dark:text-[#E0B2C4]">
                    3. Contacting Us
                  </h4>
                  <p className="mb-2">
                    For privacy clarifications, please reach out to our privacy compliance desk using the contact drawer.
                  </p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 italic mt-6">Last updated: June 2026</p>
                </motion.div>
              )}

              {activeTab === 'terms' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
                  <h3 className="font-serif text-lg font-black text-slate-800 dark:text-slate-100 mb-3">Terms & Conditions</h3>
                  <p className="mb-4">
                    Welcome to <strong>D.Card</strong>. These Terms & Conditions govern your access to and usage of the D.Card web interface. By browsing, comparison-shopping, or logging into our application, you formally accept these terms.
                  </p>

                  <h4 className="font-bold text-slate-850 dark:text-slate-200 mt-5 mb-2 uppercase text-xs tracking-wider text-[#A30D62] dark:text-[#E0B2C4]">
                    1. Scope of Service
                  </h4>
                  <p className="mb-3">
                    D.Card provides informational debit card matrices, fees, and feature comparisons. D.Card is not a bank, broker, or direct card distributor. We do not approve applications, nor do we issue cards.
                  </p>

                  <h4 className="font-bold text-slate-850 dark:text-slate-200 mt-5 mb-2 uppercase text-xs tracking-wider text-[#A30D62] dark:text-[#E0B2C4]">
                    2. User Conduct & Accounts
                  </h4>
                  <p className="mb-3">
                    You are solely responsible for maintaining the privacy of your account login information. You agree not to engage in malicious scraping of card rates, scraping database content, or deploying automated bots to query the platform features.
                  </p>

                  <h4 className="font-bold text-slate-850 dark:text-slate-200 mt-5 mb-2 uppercase text-xs tracking-wider text-[#A30D62] dark:text-[#E0B2C4]">
                    3. Third-Party Banking Services
                  </h4>
                  <p className="mb-3">
                    Our platform references links and redirect coordinates to official banking pages. We have no authority over the service level agreements, underwriting guidelines, interest structures, or operations of third-party banks. Your relationships with external banks are governed strictly by their respective terms of service.
                  </p>

                  <h4 className="font-bold text-slate-850 dark:text-slate-200 mt-5 mb-2 uppercase text-xs tracking-wider text-[#A30D62] dark:text-[#E0B2C4]">
                    4. Limitation of Liability
                  </h4>
                  <p className="mb-4">
                    In no event shall D.Card, its founders, or affiliates be liable for any direct, indirect, incidental, or consequential damages resulting from choices, deposits, or applications completed based on parameters shown on D.Card.
                  </p>

                  <p className="text-xs text-slate-400 dark:text-slate-500 italic mt-6">Last updated: June 2026</p>
                </motion.div>
              )}

              {activeTab === 'disclaimer' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
                  <h3 className="font-serif text-lg font-black text-slate-800 dark:text-slate-100 mb-3">Regulatory & Information Disclaimer</h3>
                  
                  <div className="p-4 rounded-2xl mb-5 text-amber-900 dark:text-amber-300" style={{ background: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                    <p className="text-xs font-black uppercase tracking-wider mb-2">
                      ⚠️ Critical Disclaimer: Verify Before Applying
                    </p>
                    <p className="text-xs leading-relaxed font-semibold">
                      Debit card fees, benefits, interest rates, lounge visit criteria, cash-withdrawal limits, eligibility thresholds, and active promotional offers change frequently. Banks reserve the right to alter features without prior warnings. Users MUST verify all rates and terms directly from the official bank websites or bank branches before applying for or opening any account.
                    </p>
                  </div>

                  <h4 className="font-bold text-slate-850 dark:text-slate-200 mt-5 mb-2 uppercase text-xs tracking-wider text-[#A30D62] dark:text-[#E0B2C4]">
                    1. No Warranties
                  </h4>
                  <p className="mb-3">
                    The database parameters on D.Card are aggregated periodically from public bank schedules and user submissions. While we strive to maintain clean, audited directories, we do not warrant the timeliness, completeness, accuracy, or reliability of any information displayed.
                  </p>

                  <h4 className="font-bold text-slate-850 dark:text-slate-200 mt-5 mb-2 uppercase text-xs tracking-wider text-[#A30D62] dark:text-[#E0B2C4]">
                    2. Informational Purpose Only
                  </h4>
                  <p className="mb-3">
                    The content provided on D.Card is for educational and comparison purposes only. It does not constitute financial, investment, legal, or banking advice. You should seek independent consultation or do direct bank diligence before finalizing financial relationship decisions.
                  </p>

                  <h4 className="font-bold text-slate-850 dark:text-slate-200 mt-5 mb-2 uppercase text-xs tracking-wider text-[#A30D62] dark:text-[#E0B2C4]">
                    3. Intellectual Property Disclaimer
                  </h4>
                  <p className="mb-4">
                    All bank brand logos, product tags, registered trademarks (Visa, Mastercard, RuPay, etc.) remain the exclusive property of their respective corporate owners. D.Card does not claim ownership, nor does listing them imply any form of official brand partnership or direct financial compensation from primary banks listed here.
                  </p>

                  <p className="text-xs text-slate-400 dark:text-slate-500 italic mt-6">Last updated: June 2026</p>
                </motion.div>
              )}
            </div>

            {/* Footer buttons */}
            <div style={{ padding: '16px 24px 24px', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'flex-end', flexShrink: 0 }}>
              <button
                onClick={onClose}
                className="btn-cta text-xs px-6 py-2.5 rounded-full font-bold select-none cursor-pointer focus:outline-none"
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
