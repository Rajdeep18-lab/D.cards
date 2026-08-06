import React from 'react';
import { motion } from 'framer-motion';
import { Bot, Zap, Sparkles, HelpCircle, ShieldCheck } from 'lucide-react';
import AIChatAssistant from '../components/AIChatAssistant';

function AIAdvisorPage({ onOpenContact }) {
  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 relative z-20 space-y-8 text-left">
      {/* Page Header */}
      <div className="border-b border-[#E5E7EB] dark:border-slate-800 pb-6">
        <span className="text-xs font-semibold text-[#2563EB] dark:text-[#60A5FA] tracking-widest uppercase block mb-1">
          FINANCIAL INFORMATION PLATFORM
        </span>
        <h1 className="text-3xl font-bold text-[#1F2937] dark:text-white">
          D.CARD AI Advisor
        </h1>
        <p className="text-xs sm:text-sm text-[#6B7280] dark:text-slate-400 mt-1 font-normal">
          Ask any question about lounge access, RuPay vs Visa, zero balance cards, or ATM limits — verified strictly against live database records
        </p>
      </div>

      {/* Embedded AI Advisor Interface */}
      <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
        {/* Left Side Highlights */}
        <div className="w-full lg:w-1/3 space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-slate-800 shadow-soft space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#EFF6FF] dark:bg-slate-800 border border-[#2563EB]/20 flex items-center justify-center text-[#2563EB] dark:text-[#60A5FA]">
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

          <div className="p-6 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-slate-800 shadow-soft space-y-3">
            <h4 className="text-xs font-bold text-[#1F2937] dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-[#2563EB]" />
              <span>Popular Questions</span>
            </h4>
            <ul className="space-y-2 text-xs font-medium text-[#2563EB] dark:text-[#60A5FA]">
              <li className="p-3 rounded-2xl bg-[#EFF6FF] dark:bg-slate-800 border border-[#2563EB]/10 hover:border-[#2563EB]/30 transition-colors cursor-pointer">
                💡 "Which debit cards offer complimentary airport lounge access?"
              </li>
              <li className="p-3 rounded-2xl bg-[#EFF6FF] dark:bg-slate-800 border border-[#2563EB]/10 hover:border-[#2563EB]/30 transition-colors cursor-pointer">
                💡 "Show me zero annual fee debit cards with zero minimum balance."
              </li>
              <li className="p-3 rounded-2xl bg-[#EFF6FF] dark:bg-slate-800 border border-[#2563EB]/10 hover:border-[#2563EB]/30 transition-colors cursor-pointer">
                💡 "What is the daily ATM withdrawal limit for HDFC Platinum?"
              </li>
            </ul>
          </div>
        </div>

        {/* Right Side: Full AI Chat Panel */}
        <div className="w-full lg:w-2/3 flex justify-center">
          <div className="w-full max-w-xl">
            <AIChatAssistant onOpenContact={onOpenContact} embeddedPage={true} />
          </div>
        </div>
      </div>
    </main>
  );
}

export default AIAdvisorPage;
