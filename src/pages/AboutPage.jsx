import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Target, Award, Sparkles, Layers, CreditCard } from 'lucide-react';

function AboutPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 relative z-20 space-y-12 text-left select-none">
      {/* Page Header */}
      <div className="border-b border-[#E5E7EB] dark:border-slate-800 pb-6">
        <span className="text-xs font-semibold text-[#2563EB] dark:text-[#60A5FA] tracking-widest uppercase block mb-1">
          PLATFORM MISSION & VISION
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold text-[#1F2937] dark:text-white">
          About D.CARD
        </h1>
        <p className="text-xs sm:text-sm text-[#6B7280] dark:text-slate-400 mt-1 font-normal">
          Building India's independent debit card discovery & financial information platform.
        </p>
      </div>

      {/* Story Hero */}
      <section className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-slate-700 shadow-soft space-y-6">
        <span className="text-xs font-semibold text-[#2563EB] dark:text-[#60A5FA] tracking-widest uppercase block">
          OUR PURPOSE
        </span>
        <h2 className="text-2xl sm:text-4xl font-bold text-[#1F2937] dark:text-white tracking-tight leading-tight">
          Simplifying Complex Banking Terms with Independent Transparency.
        </h2>
        <p className="text-sm sm:text-base text-[#2563EB] dark:text-[#60A5FA] font-semibold leading-relaxed">
          "Most Indians open bank accounts without understanding debit cards. D.CARD helps people choose the right debit card before opening a bank account."
        </p>
        <div className="space-y-4 text-xs sm:text-sm text-[#6B7280] dark:text-slate-300 leading-relaxed font-normal">
          <p>
            Every day, thousands of account holders apply for banking services attracted by advertisements showcasing complimentary airport lounge access, dining vouchers, or cashback rewards. But the reality is buried inside complex schedules of charges.
          </p>
          <p>
            Average balance non-maintenance penalties, hidden quarterly SMS charges, transaction decline fees, and foreign currency markup fees are designed to slice away your savings when you least expect it.
          </p>
          <p>
            We built D.CARD to level the playing field. Our platform is completely independent. We hold zero commission arrangements with banking networks. Our algorithms analyze features, limits, and penalties strictly based on your lifestyle choices, student status, and spending metrics.
          </p>
        </div>
        <div className="pt-4 border-t border-[#E5E7EB] dark:border-slate-700 flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#EFF6FF] dark:bg-slate-800 border border-[#2563EB]/20 flex items-center justify-center text-[#2563EB] font-bold text-sm">
            <CreditCard className="w-5 h-5 text-[#2563EB]" />
          </div>
          <div>
            <p className="text-xs font-bold text-[#1F2937] dark:text-white leading-none">Built for India's Next Generation</p>
            <p className="text-[10px] text-[#6B7280] dark:text-slate-400 font-semibold uppercase mt-1">Independent Banking Information Platform</p>
          </div>
        </div>
      </section>

      {/* Pillars Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: "Zero Commission Bias", desc: "No priority deals with banks. Every D.CARD rating and match score is calculated algorithmically.", icon: ShieldCheck, score: "100% Unbiased" },
          { title: "Profile Match Score", desc: "Real-time mathematical alignment indexing annual fees, balance terms, and perks to your stage of life.", icon: Target, score: "99.8% Accuracy" },
          { title: "Verified Database", desc: "Monitored, checked, and cross-referenced with official regulatory schedules every 30 days.", icon: Award, score: "Monthly Audited" },
          { title: "100% Free To Use", desc: "Direct open-access comparison database designed to empower you with complete monetary clarity.", icon: Sparkles, score: "₹0 User Cost" }
        ].map((item, idx) => {
          const IconComp = item.icon;
          return (
            <motion.div
              key={idx}
              whileHover={{ y: -4 }}
              className="p-6 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-slate-700 shadow-soft flex flex-col justify-between min-h-[180px]"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-[#EFF6FF] dark:bg-slate-800 border border-[#2563EB]/20 flex items-center justify-center text-[#2563EB] dark:text-[#60A5FA]">
                  <IconComp className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-bold text-[#1F2937] dark:text-white uppercase tracking-wider">{item.title}</h4>
                <p className="text-xs text-[#6B7280] dark:text-slate-400 leading-relaxed font-normal">{item.desc}</p>
              </div>
              <div className="mt-4 pt-2 border-t border-[#E5E7EB] dark:border-slate-700 text-[10px] sm:text-[11px] font-semibold text-[#2563EB] dark:text-[#60A5FA] uppercase tracking-wider">
                {item.score}
              </div>
            </motion.div>
          );
        })}
      </section>
    </main>
  );
}

export default AboutPage;
