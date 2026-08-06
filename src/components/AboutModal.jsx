import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { 
  Building2, 
  Target, 
  Globe, 
  Eye, 
  ShieldCheck, 
  Zap, 
  Lock, 
  Sparkles, 
  UserCheck, 
  TrendingUp, 
  CheckCircle2, 
  Scale, 
  Filter, 
  RefreshCw, 
  AlertCircle, 
  CreditCard, 
  X 
} from 'lucide-react';

function AboutModal({ isOpen, onClose }) {
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

  const coreValues = [
    { title: "Transparency", desc: "100% clear fee disclosures.", icon: Eye },
    { title: "Trust", desc: "Verified bank disclosures.", icon: ShieldCheck },
    { title: "Innovation", desc: "AI-driven recommendation engines.", icon: Zap },
    { title: "Security", desc: "Bank-grade data protection.", icon: Lock },
    { title: "Simplicity", desc: "Intuitive visual metrics.", icon: Sparkles },
    { title: "User First", desc: "Designed around user goals.", icon: UserCheck },
    { title: "Continuous Improvement", desc: "Real-time card database updates.", icon: TrendingUp },
    { title: "Financial Inclusion", desc: "Accessible for everyone.", icon: Globe }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Modal Overlay Container */}
          <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4 sm:p-6 overflow-y-auto pointer-events-auto select-none">
            {/* Backdrop */}
            <motion.div
              key="about-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-[#0F172A]/75 backdrop-blur-md z-0"
            />

            {/* Modal Box */}
            <motion.div
              key="about-modal"
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 350, damping: 28 }}
              className="relative z-10 w-full max-w-[840px] max-h-[90vh] my-auto flex flex-col rounded-[28px] bg-white dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-slate-700 shadow-2xl backdrop-blur-xl overflow-hidden custom-scrollbar text-left"
            >
              {/* Modal Header */}
              <div className="p-6 sm:px-8 sm:py-6 flex items-center justify-between flex-shrink-0 border-b border-[#E5E7EB] dark:border-slate-800">
                <div className="flex items-center gap-3.5">
                  <img src="/logo-mark.png" alt="D.CARD Mark" className="w-11 h-11 object-contain flex-shrink-0" />
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-[#1F2937] dark:text-white leading-tight">
                      About D.CARD
                    </h2>
                    <p className="text-xs text-[#2563EB] dark:text-[#60A5FA] font-semibold mt-0.5">
                      India's Independent Debit Card Comparison & Information Platform
                    </p>
                  </div>
                </div>

                <button
                  onClick={onClose}
                  className="w-9 h-9 rounded-full border border-[#E5E7EB] dark:border-slate-700 bg-[#F8FAFC] dark:bg-slate-800 text-[#6B7280] dark:text-slate-300 hover:text-[#2563EB] dark:hover:text-[#60A5FA] flex items-center justify-center transition-colors outline-none cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable Content Area */}
              <div className="p-6 sm:p-8 overflow-y-auto text-left space-y-6 flex-grow custom-scrollbar">
                {/* Who We Are */}
                <div className="p-6 rounded-3xl bg-[#EFF6FF] dark:bg-slate-800/80 border border-[#2563EB]/20 space-y-2">
                  <h3 className="text-base font-bold text-[#1F2937] dark:text-white">
                    Who We Are
                  </h3>
                  <p className="text-xs sm:text-sm text-[#1F2937] dark:text-slate-200 leading-relaxed font-normal">
                    D.CARD is an independent fintech information platform built to help users compare, understand, and explore debit cards offered by various banks across India.
                  </p>
                  <p className="text-xs sm:text-sm text-[#6B7280] dark:text-slate-300 leading-relaxed font-normal">
                    Our goal is to simplify banking decisions by presenting verified information in an easy-to-understand format.
                  </p>
                </div>

                {/* Mission & Vision Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-[#E5E7EB] dark:border-slate-800 shadow-sm space-y-2">
                    <div className="flex items-center gap-2">
                      <Target className="w-5 h-5 text-[#2563EB]" />
                      <h4 className="text-sm font-bold text-[#1F2937] dark:text-white">
                        Our Mission
                      </h4>
                    </div>
                    <p className="text-xs text-[#6B7280] dark:text-slate-400 leading-relaxed font-normal">
                      To simplify banking decisions by providing transparent, accurate, and AI-powered debit card comparisons that help every user choose the right financial product with confidence.
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-[#E5E7EB] dark:border-slate-800 shadow-sm space-y-2">
                    <div className="flex items-center gap-2">
                      <Globe className="w-5 h-5 text-[#2563EB]" />
                      <h4 className="text-sm font-bold text-[#1F2937] dark:text-white">
                        Our Vision
                      </h4>
                    </div>
                    <p className="text-xs text-[#6B7280] dark:text-slate-400 leading-relaxed font-normal">
                      To become India's most trusted debit card comparison platform by making financial information accessible, transparent, and easy to understand for everyone.
                    </p>
                  </div>
                </div>

                {/* Core Values */}
                <div>
                  <h4 className="text-sm font-bold text-[#1F2937] dark:text-white mb-3">Our Core Values</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {coreValues.map((v, i) => {
                      const IconC = v.icon;
                      return (
                        <div key={i} className="p-3 rounded-xl bg-[#F8FAFC] dark:bg-slate-900 border border-[#E5E7EB] dark:border-slate-800 text-xs">
                          <IconC className="w-4 h-4 text-[#2563EB] mb-1" />
                          <p className="font-bold text-[#1F2937] dark:text-white">{v.title}</p>
                          <p className="text-[10px] text-[#6B7280] dark:text-slate-400 mt-0.5">{v.desc}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Disclaimer */}
                <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-[#E5E7EB] dark:border-slate-700 text-xs text-[#6B7280] dark:text-slate-300 font-normal italic">
                  "D.CARD is an independent debit card comparison and information platform. We are not a bank and are not officially affiliated or partnered with any listed bank. All information is collected from publicly available sources and official bank websites."
                </div>
              </div>

              {/* Footer */}
              <div className="p-5 sm:px-8 border-t border-[#E5E7EB] dark:border-slate-800 flex justify-end flex-shrink-0">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#3B82F6] text-white text-xs font-bold hover:opacity-95 transition-all shadow-md cursor-pointer"
                >
                  Close
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
