import { AnimatePresence, motion } from 'framer-motion';

const LEADERSHIP = [
  {
    name: "Ritik Raj",
    title: "Founder",
    initials: "RR",
    avatarBg: "linear-gradient(135deg, #A30D62 0%, #C21875 100%)",
    bio: "Visionary founder spearheading D.Card's core mission to bring radical transparency, hidden-charge disclosures, and algorithmic debit card optimization to millions across India.",
    highlights: ["Product Vision", "Banking Strategy", "Capital Markets"]
  },
  {
    name: "Rajdeep",
    title: "Co-Founder",
    initials: "RD",
    avatarBg: "linear-gradient(135deg, #7A0F52 0%, #A30D62 100%)",
    bio: "Strategic co-founder leading business development, banking network partnerships, and market expansion to cement D.Card as India's premier debit card discovery platform.",
    highlights: ["Banking Alliances", "Growth Operations", "Strategic Expansion"]
  },
  {
    name: "Kaushik Kumar Srivastava",
    title: "Chief Technology Officer (CTO)",
    initials: "KS",
    avatarBg: "linear-gradient(135deg, #C21875 0%, #E0629A 100%)",
    bio: "Technical architect leading the engineering organization, designing D.Card's real-time comparison engine, data pipelines, cloud infrastructure, and bank-grade security protocols.",
    highlights: ["System Architecture", "Security Infrastructure", "AI & Analytics"]
  },
  {
    name: "Bipanshu Dubey",
    title: "Chief Marketing Officer (CMO)",
    initials: "BD",
    avatarBg: "linear-gradient(135deg, #A30D62 0%, #D81B60 100%)",
    bio: "Leads D.Card's marketing strategy, digital branding, customer acquisition, partner campaigns, and brand awareness to ensure consistent brand identity across all platforms.",
    highlights: ["Marketing Strategy", "Digital Branding", "Customer Acquisition", "Brand Awareness"]
  }
];

function AboutModal({ isOpen, onClose }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Modal Overlay Container */}
          <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4 sm:p-6 overflow-y-auto pointer-events-auto">
            {/* Backdrop */}
            <motion.div
              key="about-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-[#1E0B16]/65 backdrop-blur-md z-0"
            />

            {/* Modal Box */}
            <motion.div
              key="about-modal"
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 350, damping: 28 }}
              className="relative z-10 w-full max-w-[820px] max-h-[90vh] my-auto flex flex-col rounded-[28px] bg-[var(--modal-bg)] border border-[#C21875]/22 shadow-[0_24px_80px_rgba(122,15,82,0.35)] backdrop-blur-xl overflow-hidden custom-scrollbar"
            >
            {/* Modal Header */}
            <div style={{ padding: '24px 28px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
              <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
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
                  🏢
                </div>
                <div style={{ textAlign: 'left' }}>
                  <h2 style={{ margin: 0, fontSize: '22px', fontWeight: '900', fontFamily: 'serif', color: 'var(--text-primary)' }}>
                    About D.Card & Company Profile
                  </h2>
                  <p style={{ margin: 0, fontSize: '11.5px', color: 'var(--text-soft)', fontWeight: '600' }}>
                    India's Independent Capital Discovery & Debit Card Engine
                  </p>
                </div>
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
                  outline: 'none'
                }}
              >
                ✕
              </button>
            </div>

            {/* Divider */}
            <div style={{ height: '1px', background: 'linear-gradient(90deg,transparent,rgba(194,24,117,0.2),transparent)', margin: '0' }} />

            {/* Scrollable Content Area */}
            <div
              className="custom-scrollbar text-left"
              style={{
                padding: '24px 28px',
                overflowY: 'auto',
                fontSize: '13.5px',
                lineHeight: '1.65',
                color: 'var(--text-soft)',
                fontFamily: 'Inter, sans-serif',
                flexGrow: 1
              }}
            >
              {/* Company Story */}
              <div className="mb-8 p-6 rounded-3xl bg-secondary/5 border border-secondary/15 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">📖</span>
                  <h3 className="text-lg font-black font-serif text-slate-900 dark:text-slate-100">
                    Our Founding Story
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-textSoft dark:text-slate-300 leading-relaxed font-medium">
                  "Most Indians open bank accounts without understanding debit cards. D.Card helps people choose the right debit card before opening a bank account."
                </p>
                <p className="text-xs sm:text-sm text-textSoft dark:text-slate-300 leading-relaxed font-medium">
                  Every day, thousands of account holders apply for banking services attracted by high-decibel advertisements showcasing "complimentary airport lounge access," "free dining vouchers," or "high cashback rewards." But the reality is buried inside 60-page PDF schedules of charges.
                </p>
                <p className="text-xs sm:text-sm text-textSoft dark:text-slate-300 leading-relaxed font-medium">
                  Average balance non-maintenance penalties, hidden quarterly SMS charges, transaction decline fees, and massive 3.5% foreign currency markup fees are designed to slice away your savings when you least expect it. D.Card was built to level the playing field through algorithmic, unbiased auditing.
                </p>
              </div>

              {/* Mission & Vision Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div className="p-5 rounded-2xl bg-white/60 dark:bg-black/30 border border-slate-200 dark:border-secondary/20 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">🎯</span>
                    <h4 className="text-sm font-black font-serif text-slate-900 dark:text-slate-100">
                      Our Mission
                    </h4>
                  </div>
                  <p className="text-xs text-textSoft dark:text-slate-300 leading-relaxed font-medium">
                    To empower every Indian banking customer with 100% transparent fee breakdowns, audited debit card limits, and real-time algorithmic feature match scores before signing account agreements.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-white/60 dark:bg-black/30 border border-slate-200 dark:border-secondary/20 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">🚀</span>
                    <h4 className="text-sm font-black font-serif text-slate-900 dark:text-slate-100">
                      Our Vision
                    </h4>
                  </div>
                  <p className="text-xs text-textSoft dark:text-slate-300 leading-relaxed font-medium">
                    To become India's primary independent capital discovery engine, eliminating hidden banking penalties and elevating consumer financial awareness nationwide.
                  </p>
                </div>
              </div>

              {/* Company Leadership Section */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xl">👔</span>
                  <h3 className="text-lg font-black font-serif text-slate-900 dark:text-slate-100">
                    Executive Leadership Team
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {LEADERSHIP.map((item) => (
                    <div
                      key={item.name}
                      className="p-5 rounded-2xl bg-white/70 dark:bg-black/40 border border-slate-200 dark:border-secondary/25 shadow-sm flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <div
                            className="w-12 h-12 rounded-2xl text-white font-serif font-black text-base flex items-center justify-center shadow-md"
                            style={{ background: item.avatarBg }}
                          >
                            {item.initials}
                          </div>
                          <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-secondary/10 text-secondary dark:text-roseGold border border-secondary/20">
                            {item.title}
                          </span>
                        </div>

                        <h4 className="text-base font-black text-slate-900 dark:text-slate-100 font-serif">
                          {item.name}
                        </h4>
                        <p className="text-[11px] font-bold text-secondary dark:text-roseGold uppercase tracking-widest mt-0.5">
                          {item.title}
                        </p>
                        <p className="text-xs text-textSoft dark:text-slate-300 mt-2 font-medium leading-relaxed">
                          {item.bio}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-secondary/15 flex flex-wrap gap-1">
                        {item.highlights.map(h => (
                          <span key={h} className="text-[9.5px] font-bold px-2 py-0.5 rounded bg-secondary/10 text-secondary dark:text-roseGold">
                            #{h}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div style={{ padding: '16px 28px 24px', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'flex-end', flexShrink: 0 }}>
              <button
                onClick={onClose}
                className="btn-cta text-xs px-6 py-2.5 rounded-full font-bold cursor-pointer focus:outline-none"
              >
                Close Company Profile
              </button>
            </div>
          </motion.div>
        </div>
      </>
      )}
    </AnimatePresence>
  );
}

export default AboutModal;
