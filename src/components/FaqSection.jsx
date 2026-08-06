import React, { useState } from 'react';
import { HelpCircle, ChevronDown, CheckCircle2 } from 'lucide-react';
import { faqs } from '../data/mockData';

function FaqSection() {
  const [openIdx, setOpenIdx] = useState(0);

  return (
    <section className="py-12 border-t border-[#E2E8F0] dark:border-slate-800 text-left">
      <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#1E5EFF]/10 text-[#1E5EFF] dark:text-[#60A5FA] text-xs font-bold tracking-widest uppercase rounded-full">
          <HelpCircle className="w-3.5 h-3.5" />
          KNOWLEDGE BASE & FAQS
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172A] dark:text-white">
          Frequently Asked Questions
        </h2>
        <p className="text-xs sm:text-sm text-[#64748B] dark:text-slate-400">
          Everything you need to know about comparing debit cards, fee disclosures, and limits.
        </p>
      </div>

      <div className="max-w-3xl mx-auto space-y-3">
        {faqs.map((faq, index) => {
          const isOpen = openIdx === index;
          return (
            <div 
              key={index} 
              className="bg-white dark:bg-[#1E293B] rounded-2xl border border-[#E2E8F0] dark:border-slate-800 overflow-hidden transition-all shadow-soft"
            >
              <button
                onClick={() => setOpenIdx(isOpen ? null : index)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm text-[#0F172A] dark:text-white hover:text-[#1E5EFF] dark:hover:text-[#60A5FA] transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#1E5EFF] flex-shrink-0" />
                  <span>{faq.q}</span>
                </span>
                <ChevronDown className={`w-4 h-4 text-[#64748B] transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#1E5EFF]' : ''}`} />
              </button>
              
              {isOpen && (
                <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-[#64748B] dark:text-slate-300 leading-relaxed border-t border-[#F1F5F9] dark:border-slate-800">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default FaqSection;
