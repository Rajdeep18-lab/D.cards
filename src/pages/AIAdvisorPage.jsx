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
    category: "Lounge Access",
    icon: Plane,
    bg: "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20",
    query: "Which debit cards offer complimentary airport lounge access?"
  },
  {
    id: "p2",
    category: "Zero Annual Fee",
    icon: Gift,
    bg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    query: "Show me zero annual fee debit cards with zero minimum balance."
  },
  {
    id: "p3",
    category: "ATM Limits",
    icon: Zap,
    bg: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    query: "What is the daily ATM withdrawal limit for HDFC Platinum?"
  },
  {
    id: "p4",
    category: "RuPay & UPI",
    icon: CreditCard,
    bg: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    query: "Show me the best RuPay debit cards for cashback and rewards."
  },
  {
    id: "p5",
    category: "Bank Comparison",
    icon: Layers,
    bg: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    query: "Compare SBI Global vs ICICI Coral debit cards."
  },
  {
    id: "p6",
    category: "Cashback Deals",
    icon: Percent,
    bg: "bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20",
    query: "Which debit card gives maximum cashback points on daily spends?"
  }
];

function AIAdvisorPage({ onOpenContact }) {
  const [activeExternalQuery, setActiveExternalQuery] = useState(null);

  const handlePromptClick = (queryText) => {
    setActiveExternalQuery(queryText);
  };

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 relative z-20 space-y-8 text-left select-none">
      {/* Page Header */}
      <div className="border-b border-[#E5E7EB] dark:border-slate-800 pb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#2563EB]/10 text-[#2563EB] dark:text-[#60A5FA] text-xs font-semibold tracking-widest uppercase rounded-full mb-2">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            FINANCIAL INTELLIGENCE ENGINE
          </span>
          <h1 className="text-3xl font-extrabold text-[#1F2937] dark:text-white tracking-tight">
            D.CARD AI Advisor
          </h1>
          <p className="text-xs sm:text-sm text-[#6B7280] dark:text-slate-400 mt-1 font-normal max-w-3xl">
            Ask any question about lounge access, RuPay vs Visa, zero balance cards, or ATM limits — verified strictly against live database records.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex-shrink-0">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span>Live Database Connected</span>
        </div>
      </div>

      {/* Embedded AI Advisor Interface */}
      <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
        {/* Left Side Highlights & Popular Questions */}
        <div className="w-full lg:w-1/3 space-y-6">
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
              D.CARD AI Advisor checks actual bank fee structures, lounge rules, and card limits directly from verified database records.
            </p>
          </div>

          {/* Enhanced Interactive Popular Prompt Suggestions */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-slate-800 shadow-soft space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-[#1F2937] dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-[#2563EB]" />
                <span>Popular Question Prompts</span>
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
                    whileHover={{ scale: 1.02, x: 2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handlePromptClick(prompt.query)}
                    className="w-full text-left p-3.5 rounded-2xl bg-[#F8FAFC] dark:bg-slate-900 border border-[#E5E7EB] dark:border-slate-800/80 hover:border-[#2563EB]/40 hover:bg-[#EFF6FF] dark:hover:bg-slate-800/90 transition-all duration-200 cursor-pointer group flex items-start gap-3"
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

        {/* Right Side: Full AI Chat Panel */}
        <div className="w-full lg:w-2/3 flex justify-center">
          <div className="w-full max-w-xl">
            <AIChatAssistant 
              onOpenContact={onOpenContact} 
              embeddedPage={true} 
              externalQuery={activeExternalQuery}
            />
          </div>
        </div>
      </div>
    </main>
  );
}

export default AIAdvisorPage;
