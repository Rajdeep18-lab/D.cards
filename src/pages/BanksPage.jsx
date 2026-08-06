import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Building2, ShieldCheck, CheckCircle2, ArrowRight, Star, AlertCircle } from 'lucide-react';
import { bankCards } from '../data/mockData';
import BankCard from '../components/BankCard';

function BanksPage({ BANK_PROFILES, toggleBank }) {
  const navigate = useNavigate();
  const [selectedBankProfile, setSelectedBankProfile] = useState("HDFC Bank");

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 relative z-20 space-y-10 text-left">
      {/* Header */}
      <div className="border-b border-[#E5E7EB] dark:border-slate-800 pb-6">
        <span className="text-xs font-semibold text-[#2563EB] dark:text-[#60A5FA] tracking-widest uppercase block mb-1">
          FINANCIAL INFORMATION PLATFORM
        </span>
        <h1 className="text-3xl font-bold text-[#1F2937] dark:text-white">
          Top Listed Banks & Profiles
        </h1>
        <p className="text-xs sm:text-sm text-[#6B7280] dark:text-slate-400 mt-1 font-normal">
          Explore debit card lineups, trust scores, lounge eligibility, and charges across India's leading banks
        </p>
      </div>

      {/* Main Bank Grid */}
      <section className="space-y-6">
        <h2 className="text-xl font-bold text-[#1F2937] dark:text-white">
          Covered Banks Directory
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {bankCards.map((bank) => (
            <BankCard
              key={bank.id}
              bank={bank}
              onSelect={() => {
                toggleBank(bank.name);
                navigate('/cards');
              }}
            />
          ))}
        </div>
      </section>

      {/* Institutional Bank Audits Section */}
      {BANK_PROFILES && (
        <section className="space-y-6 pt-6 border-t border-[#E5E7EB] dark:border-slate-800">
          <div>
            <span className="text-xs font-semibold text-[#2563EB] dark:text-[#60A5FA] tracking-widest uppercase block mb-1">
              INDEPENDENT TRUST AUDIT
            </span>
            <h2 className="text-2xl font-bold text-[#1F2937] dark:text-white">
              Institutional Bank Profiles
            </h2>
            <p className="text-xs text-[#6B7280] dark:text-slate-400 mt-1 font-normal">
              Evaluated based on customer service tiers, lounge accessibility policies, and card fee transparency.
            </p>
          </div>

          {/* Bank selector pills */}
          <div className="flex flex-wrap gap-2">
            {Object.keys(BANK_PROFILES).map((bankName) => (
              <button
                key={bankName}
                onClick={() => setSelectedBankProfile(bankName)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  selectedBankProfile === bankName
                    ? 'bg-[#2563EB] text-white shadow-sm'
                    : 'bg-white dark:bg-[#1E293B] text-[#1F2937] dark:text-slate-300 border border-[#E5E7EB] dark:border-slate-700 hover:border-[#2563EB]'
                }`}
              >
                {bankName}
              </button>
            ))}
          </div>

          {/* Active Bank Profile Card */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {Object.entries(BANK_PROFILES).filter(([name]) => name === selectedBankProfile).map(([bankName, profile]) => (
              <motion.div
                key={bankName}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="md:col-span-12 p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-slate-700 shadow-soft space-y-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E7EB] dark:border-slate-700 pb-4">
                  <div>
                    <span className="text-[10px] font-semibold text-[#2563EB] dark:text-[#60A5FA] uppercase tracking-widest block mb-1">
                      {profile.segment}
                    </span>
                    <h3 className="text-2xl font-bold text-[#1F2937] dark:text-white">
                      {bankName}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#6B7280] dark:text-slate-400 font-normal">Trust Rating:</span>
                    <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold text-xs border border-emerald-500/20 flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-emerald-500 text-emerald-500" />
                      <span>{profile.trustScore}</span>
                    </span>
                  </div>
                </div>

                <p className="text-xs text-[#6B7280] dark:text-slate-300 leading-relaxed font-normal">
                  {profile.overview}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                      Key Strengths
                    </h4>
                    <ul className="space-y-1.5 text-xs text-[#1F2937] dark:text-slate-300 font-normal">
                      {profile.pros.map((pro, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                          <span>{pro}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold text-red-500 uppercase tracking-wider">
                      Considerations
                    </h4>
                    <ul className="space-y-1.5 text-xs text-[#1F2937] dark:text-slate-300 font-normal">
                      {profile.cons.map((con, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                          <span>{con}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#E5E7EB] dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <p className="text-xs text-[#6B7280] dark:text-slate-400 font-normal">
                    <strong>Best Tailored For:</strong> {profile.bestFor}
                  </p>
                  <button
                    onClick={() => {
                      toggleBank(bankName);
                      navigate('/cards');
                    }}
                    className="text-xs text-[#2563EB] dark:text-[#60A5FA] font-semibold hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <span>View {bankName} Cards</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

export default BanksPage;
