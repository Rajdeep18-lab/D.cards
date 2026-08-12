import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Bot, 
  Zap, 
  Sparkles, 
  HelpCircle, 
  ShieldCheck, 
  CreditCard, 
  Plane, 
  Gift, 
  ArrowRight, 
  CheckCircle2, 
  Layers, 
  Percent, 
  Search 
} from 'lucide-react';
import AIChatAssistant from '../components/AIChatAssistant';

const SUGGESTED_PROMPTS = [
  {
    id: "p1",
    category: "Zero Balance Savings",
    icon: Gift,
    bg: "bg-[#2563EB]/10 text-[#2563EB] dark:text-[#60A5FA] border-[#2563EB]/20",
    query: "Which savings account has zero minimum balance?"
  },
  {
    id: "p2",
    category: "Savings Comparison",
    icon: Layers,
    bg: "bg-[#2563EB]/10 text-[#2563EB] dark:text-[#60A5FA] border-[#2563EB]/20",
    query: "Compare SBI and HDFC savings accounts."
  },
  {
    id: "p3",
    category: "Student Savings",
    icon: Zap,
    bg: "bg-[#2563EB]/10 text-[#2563EB] dark:text-[#60A5FA] border-[#2563EB]/20",
    query: "Which savings account is suitable for a student?"
  },
  {
    id: "p4",
    category: "Savings Debit Card",
    icon: CreditCard,
    bg: "bg-[#2563EB]/10 text-[#2563EB] dark:text-[#60A5FA] border-[#2563EB]/20",
    query: "What debit card comes with SBI Savings Plus Account and what features does it offer?"
  },
  {
    id: "p5",
    category: "Online Account Opening",
    icon: ShieldCheck,
    bg: "bg-[#2563EB]/10 text-[#2563EB] dark:text-[#60A5FA] border-[#2563EB]/20",
    query: "Which savings accounts can be opened online via Video KYC?"
  },
  {
    id: "p6",
    category: "Lounge Access",
    icon: Plane,
    bg: "bg-[#2563EB]/10 text-[#2563EB] dark:text-[#60A5FA] border-[#2563EB]/20",
    query: "Which debit cards offer complimentary airport lounge access?"
  }
];

import { useLocation } from 'react-router-dom';

function AIAdvisorPage({ onOpenContact, onSelectDebitCard, toggleCompareQueue, setSavingsCompareQueue }) {
  const location = useLocation();
  const [activeExternalQuery, setActiveExternalQuery] = useState(location.state?.query || null);

  React.useEffect(() => {
    if (location.state?.query) {
      setActiveExternalQuery(location.state.query);
    }
  }, [location.state]);

  const handlePromptClick = (queryText) => {
    setActiveExternalQuery(queryText);
  };

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 relative z-20 space-y-8 text-left select-none">
      {/* Page Header */}
      <div className="border-b border-[#E5E7EB] dark:border-slate-800 pb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#2563EB]/10 text-[#2563EB] dark:text-[#60A5FA] text-xs font-semibold tracking-widest uppercase rounded-full mb-2">
            <Sparkles className="w-3.5 h-3.5 animate-pulse text-[#2563EB]" />
            PRODUCT DISCOVERY ASSISTANCE
          </span>
          <h1 className="text-3xl font-extrabold text-[#1F2937] dark:text-white tracking-tight">
            Not Sure What to Choose?
          </h1>
          <p className="text-xs sm:text-sm text-[#6B7280] dark:text-slate-400 mt-1 font-normal max-w-3xl">
            Tell D.CARD what you're looking for and get product suggestions based on the information available on our platform.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex-shrink-0 shadow-xs">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
          <span>AI Advisor Online</span>
        </div>
      </div>

      {/* 30% / 70% Layout Container */}
      <div className="flex flex-col lg:flex-row gap-8 items-stretch justify-between">
        {/* Left Sidebar (30% Width) */}
        <div className="w-full lg:w-[30%] space-y-6 flex-shrink-0">
          {/* Zero Bias Card */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-slate-800 shadow-soft space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#EFF6FF] dark:bg-slate-800 border border-[#2563EB]/20 flex items-center justify-center text-[#2563EB] dark:text-[#60A5FA] flex-shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#1F2937] dark:text-white">Zero Bias Guaranteed</h3>
                <p className="text-[10px] text-[#6B7280] dark:text-slate-400 font-semibold uppercase tracking-wider">Verified Database Queries</p>
              </div>
            </div>
            <p className="text-xs text-[#6B7280] dark:text-slate-300 leading-relaxed font-normal">
              D.CARD AI Advisor checks actual bank fee structures, savings interest rates, lounge rules, and associated debit card limits directly from verified database records.
            </p>
          </div>

          {/* Popular Banking Questions Sidebar */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-slate-800 shadow-soft space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-[#1F2937] dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-[#2563EB]" />
                <span>Popular Banking Questions</span>
              </h4>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#2563EB]/10 text-[#2563EB] dark:text-[#60A5FA]">
                Click to Ask
              </span>
            </div>

            <div className="space-y-2.5">
              {SUGGESTED_PROMPTS.map((prompt) => {
                const IconComponent = prompt.icon;
                return (
                  <motion.button
                    key={prompt.id}
                    whileHover={{ y: -3, scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handlePromptClick(prompt.query)}
                    className="w-full text-left p-3.5 rounded-2xl bg-[#F8FAFC] dark:bg-slate-900 border border-[#E5E7EB] dark:border-slate-800/80 hover:border-[#2563EB]/40 hover:bg-[#EFF6FF] dark:hover:bg-slate-800/90 transition-all duration-200 cursor-pointer group flex items-start gap-3 shadow-xs"
                  >
                    <div className={`p-2 rounded-xl border flex-shrink-0 mt-0.5 ${prompt.bg}`}>
                      <IconComponent className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280] dark:text-slate-400">
                          {prompt.category}
                        </span>
                        <ArrowRight className="w-3 h-3 text-[#6B7280] dark:text-slate-500 group-hover:text-[#2563EB] dark:group-hover:text-[#60A5FA] group-hover:translate-x-1 transition-all" />
                      </div>
                      <p className="text-xs font-medium text-[#1F2937] dark:text-slate-200 group-hover:text-[#2563EB] dark:group-hover:text-[#60A5FA] transition-colors leading-snug line-clamp-2">
                        "{prompt.query}"
                      </p>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Chat Window (70% Width, Dominate Page) */}
        <div className="w-full lg:w-[70%] h-[720px] min-h-[680px] flex flex-col flex-1">
          <AIChatAssistant 
            onOpenContact={onOpenContact} 
            embeddedPage={true} 
            externalQuery={activeExternalQuery}
            onSelectDebitCard={onSelectDebitCard}
            toggleCompareQueue={toggleCompareQueue}
            setSavingsCompareQueue={setSavingsCompareQueue}
          />
        </div>
      </div>
    </main>
  );
}

export default AIAdvisorPage;
