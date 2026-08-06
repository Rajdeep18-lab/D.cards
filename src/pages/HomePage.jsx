import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import HeroSection from '../components/HeroSection';
import TopCardsSection from '../components/TopCardsSection';
import PickOfTheMonth from '../components/PickOfTheMonth';
import { debitCards, bankCards } from '../data/mockData';
import BankCard from '../components/BankCard';
import FaqSection from '../components/FaqSection';
import { 
  GraduationCap, 
  UserCheck, 
  HeartHandshake, 
  Plane, 
  DollarSign, 
  Crown, 
  ShieldPlus, 
  Sparkles, 
  Bot, 
  Building2, 
  ArrowRight, 
  ShieldCheck, 
  BarChart3, 
  CheckCircle2,
  Layers,
  Search
} from 'lucide-react';

function HomePage({
  query,
  setQuery,
  onViewDetails,
  activeFilters,
  setActiveFilters,
  STATIC_AI_PILL_COUNTS,
  toggleBank
}) {
  const navigate = useNavigate();

  const handleHeroSearchSubmit = (searchVal) => {
    setQuery(searchVal);
    navigate('/cards');
  };

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <HeroSection 
        query={query} 
        setQuery={handleHeroSearchSubmit} 
        onViewDetails={onViewDetails} 
      />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16 mt-0 sm:-mt-6 relative z-20 space-y-16">
        
        {/* Featured Top Cards Section */}
        <TopCardsSection onViewDetails={onViewDetails} />

        {/* Why Choose D.CARD Infographic Section */}
        <section className="select-none py-6">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#2563EB]/10 text-[#2563EB] dark:text-[#60A5FA] text-xs font-semibold tracking-widest uppercase rounded-full">
              <ShieldCheck className="w-3.5 h-3.5" />
              FINANCIAL INFORMATION PLATFORM
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1F2937] dark:text-white tracking-tight">
              Why Smart Consumers Choose D.CARD
            </h2>
            <p className="text-xs sm:text-sm text-[#6B7280] dark:text-slate-400 font-normal">
              Zero commission arrangements with banks. Pure mathematical feature indexing designed for maximum transparency.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { 
                title: "100% Unbiased Ratings", 
                desc: "No priority deals with financial institutions. Every score is calculated algorithmically.", 
                icon: ShieldCheck,
                badge: "Zero Bias"
              },
              { 
                title: "Real-Time Matching", 
                desc: "Filter cards by minimum balance, airport lounge access, zero forex, and cashback rates.", 
                icon: Layers,
                badge: "Instant Index"
              },
              { 
                title: "Monthly Audit Protocol", 
                desc: "Fees, limits, and eligibility schedules verified directly against official bank sources every 30 days.", 
                icon: CheckCircle2,
                badge: "Audited Data"
              },
              { 
                title: "AI Recommendation Engine", 
                desc: "Get personalized debit card insights tailored to your exact spending profile and travel goals.", 
                icon: Bot,
                badge: "Smart AI"
              }
            ].map((item, idx) => {
              const IconComp = item.icon;
              return (
                <motion.div
                  key={idx}
                  whileHover={{ y: -4 }}
                  className="p-6 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-slate-800 shadow-soft text-left flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#EFF6FF] dark:bg-slate-800 border border-[#2563EB]/20 flex items-center justify-center text-[#2563EB] dark:text-[#60A5FA]">
                      <IconComp className="w-6 h-6" />
                    </div>
                    <h3 className="text-sm font-bold text-[#1F2937] dark:text-white">{item.title}</h3>
                    <p className="text-xs text-[#6B7280] dark:text-slate-400 leading-relaxed font-normal">{item.desc}</p>
                  </div>
                  <div className="mt-6 pt-3 border-t border-[#E5E7EB] dark:border-slate-800 text-[10px] font-semibold text-[#2563EB] dark:text-[#60A5FA] uppercase tracking-widest">
                    {item.badge}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Find Cards by Life Stage / Categories */}
        <section className="select-none">
          <div className="text-center md:text-left mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#E5E7EB] dark:border-slate-800 pb-4">
            <div>
              <span className="mb-2 inline-flex items-center gap-1.5 px-3 py-1 bg-[#2563EB]/10 text-[#2563EB] dark:text-[#60A5FA] text-xs font-semibold tracking-widest uppercase rounded-full">
                <BarChart3 className="w-3.5 h-3.5" />
                TARGETED DISCOVERY PORTAL
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1F2937] dark:text-white tracking-tight mt-1">
                Find Cards by Life Stage & Profile
              </h2>
              <p className="text-xs sm:text-sm text-[#6B7280] dark:text-slate-400 mt-1 max-w-xl font-normal">
                Explore card setups curated for your active financial profile and life segment.
              </p>
            </div>
            <button
              onClick={() => navigate('/cards')}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#3B82F6] hover:opacity-95 text-white font-semibold text-xs transition-all flex items-center gap-1.5 cursor-pointer self-center md:self-auto shadow-sm"
            >
              <span>View All Categories</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
            {[
              { id: "Student Friendly", label: "Student Cards", icon: GraduationCap, text: "Zero balance setups", best: "Kotak 811", count: STATIC_AI_PILL_COUNTS["Best for Students"] },
              { id: "Women Special",    label: "Women Special", icon: UserCheck, text: "BOGO dining & movies", best: "ICICI Coral", count: STATIC_AI_PILL_COUNTS["Best for Women"] },
              { id: "Senior Citizen",   label: "Senior Citizen", icon: HeartHandshake, text: "High yield savings", best: "HDFC Platinum", count: STATIC_AI_PILL_COUNTS["Best for Seniors"] },
              { id: "International Usage", label: "Travel Cards", icon: Plane, text: "Zero forex markup", best: "Axis Burgundy", count: STATIC_AI_PILL_COUNTS["Travel Friendly"] },
              { id: "Zero Balance",     label: "Zero Balance", icon: DollarSign, text: "No balance pressure", best: "IDFC Wealth", count: STATIC_AI_PILL_COUNTS["Zero Balance"] },
              { id: "Lounge Access",    label: "Premium Cards", icon: Crown, text: "Highest limits", best: "IDFC Private", count: STATIC_AI_PILL_COUNTS["Premium Benefits"] },
              { id: "Healthcare Friendly", label: "Health Focused", icon: ShieldPlus, text: "Free wellness perks", best: "Canara RuPay", count: STATIC_AI_PILL_COUNTS["Healthcare Friendly"] }
            ].map(stage => {
              const isActive = activeFilters.includes(stage.id);
              const StageIcon = stage.icon;
              return (
                <motion.div
                  key={stage.id}
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    const targetFilter = stage.id;
                    setActiveFilters(prev => 
                      prev.includes(targetFilter) ? prev.filter(f => f !== targetFilter) : [...prev, targetFilter]
                    );
                    navigate('/cards');
                  }}
                  className={`cursor-pointer p-4 rounded-2xl border transition-all duration-300 shadow-soft flex flex-col justify-between min-h-[175px] select-none text-left bg-white dark:bg-[#1E293B] ${
                    isActive 
                      ? "border-[#2563EB] bg-[#EFF6FF] dark:bg-slate-800 text-[#2563EB]" 
                      : "border-[#E5E7EB] dark:border-slate-800 hover:border-[#2563EB]/40"
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] dark:bg-slate-800 border border-[#2563EB]/20 flex items-center justify-center text-[#2563EB] dark:text-[#60A5FA] mb-3">
                    <StageIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-[#1F2937] dark:text-white tracking-tight">{stage.label}</h3>
                    <p className="text-[11px] text-[#6B7280] dark:text-slate-400 mt-1 font-normal leading-relaxed">{stage.text}</p>
                  </div>
                  <div className="mt-4 pt-2 border-t border-[#E5E7EB] dark:border-slate-800 text-[10px] font-semibold text-[#6B7280]">
                    <span className="block">{stage.count} Cards</span>
                    <span className="block text-[#2563EB] dark:text-[#60A5FA] mt-0.5 font-bold">Top: {stage.best}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Pick of the Month */}
        <PickOfTheMonth card={debitCards.find(c => c.id === 26)} onViewDetails={onViewDetails} />

        {/* AI Advisor Feature Infographic Banner */}
        <section className="select-none">
          <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#2563EB] text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 border border-slate-700">
            <div className="space-y-4 max-w-xl text-left z-10">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-[#60A5FA] uppercase tracking-wider border border-white/10">
                <Bot className="w-4 h-4 text-[#60A5FA]" />
                DATABASE AI ASSISTANT
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight leading-tight">
                Get Tailored Debit Card Guidance Powered by Live Verification
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                Ask our AI Advisor any question regarding airport lounge rules, zero forex cards, MAB waivers, or ATM withdrawal limits. Real-time responses backed by audited database rules.
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => navigate('/ai-advisor')}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#3B82F6] hover:opacity-95 text-white font-semibold text-xs tracking-wide uppercase shadow-md transition-all cursor-pointer flex items-center gap-2 active:scale-95"
                >
                  <Bot className="w-4 h-4" />
                  <span>Launch AI Advisor</span>
                </button>
                <button
                  onClick={() => navigate('/cards')}
                  className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs tracking-wide uppercase border border-white/20 transition-all cursor-pointer"
                >
                  Browse Card Database
                </button>
              </div>
            </div>

            <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-2xl relative z-10 flex-shrink-0">
              <Bot className="w-20 h-20 text-[#60A5FA]" />
            </div>
          </div>
        </section>

        {/* Top Banks Overview Preview */}
        <section className="select-none">
          <div className="mb-6 flex items-end justify-between border-b border-[#E5E7EB] dark:border-slate-800 pb-4">
            <div>
              <span className="text-xs font-semibold text-[#2563EB] dark:text-[#60A5FA] tracking-widest uppercase block mb-1">
                COVERED BANKING NETWORKS
              </span>
              <h2 className="text-2xl font-bold text-[#1F2937] dark:text-white">
                Top Listed Banks Overview
              </h2>
              <p className="text-xs text-[#6B7280] dark:text-slate-400 mt-1 font-normal">
                Explore features across leading banks covered in India
              </p>
            </div>
            <button
              onClick={() => navigate('/banks')}
              className="text-xs text-[#2563EB] dark:text-[#60A5FA] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View All Banks</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {bankCards.slice(0, 4).map((bank) => (
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

        {/* FAQ Section */}
        <FaqSection />
      </main>
    </div>
  );
}

export default HomePage;
