import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import HeroSection from '../components/HeroSection';
import TopCardsSection from '../components/TopCardsSection';
import PickOfTheMonth from '../components/PickOfTheMonth';
import { debitCards } from '../data/mockData';
import BankCard from '../components/BankCard';
import BankBrandLogo from '../components/BankBrandLogo';
import FaqSection from '../components/FaqSection';
import AnimatedStatCounter from '../components/AnimatedStatCounter';
import { getCoveredBanksDirectory } from '../utils/bankDirectoryUtils';
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
  Search,
  Lock,
  TrendingUp,
  CreditCard,
  Percent,
  Award,
  Zap,
  Globe,
  Wallet,
  Smartphone
} from 'lucide-react';

const TOP_CAROUSEL_BANKS = [
  "HDFC Bank", "ICICI Bank", "State Bank of India", "Axis Bank", 
  "Kotak Mahindra Bank", "IDFC FIRST Bank", "IndusInd Bank", "Yes Bank", 
  "AU Small Finance Bank", "Punjab National Bank", "Bank of Baroda", 
  "Union Bank of India", "Canara Bank", "Federal Bank", "RBL Bank", "DBS Bank India"
];

function HomePage({
  query,
  setQuery,
  onViewDetails,
  activeFilters,
  setActiveFilters,
  STATIC_AI_PILL_COUNTS,
  toggleBank,
  selectSingleBank,
  activeCardsList
}) {
  const navigate = useNavigate();

  const dynamicBanks = useMemo(() => {
    return getCoveredBanksDirectory(activeCardsList);
  }, [activeCardsList]);

  const handleHeroSearchSubmit = (searchVal) => {
    setQuery(searchVal);
    navigate('/cards');
  };

  return (
    <div className="space-y-16 overflow-hidden select-none">
      
      {/* ── 1. Stripe/Revolut Inspired Hero Section ── */}
      <HeroSection 
        query={query} 
        setQuery={handleHeroSearchSubmit} 
        onViewDetails={onViewDetails} 
      />

      {/* ── 2. Infinite Auto-Scrolling Bank Logo Showcase Carousel ── */}
      <section className="py-6 border-y border-[#E5E7EB] dark:border-slate-800 bg-white/50 dark:bg-[#0F172A]/50 backdrop-blur-md overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-4 flex items-center justify-between text-left">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-[#2563EB]" />
            <span className="text-xs font-extrabold text-[#1F2937] dark:text-white uppercase tracking-wider">
              Trusted Bank Indexes Covered
            </span>
          </div>
          <span className="text-[11px] font-semibold text-[#6B7280] dark:text-slate-400">
            26+ Official Bank Specifications Indexed
          </span>
        </div>

        <div className="relative w-full flex overflow-x-hidden group py-2">
          {/* Left / Right Blur Gradients */}
          <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-r from-white dark:from-[#0F172A] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-l from-white dark:from-[#0F172A] to-transparent z-10 pointer-events-none" />

          {/* Marquee Track 1 */}
          <div className="flex gap-6 animate-[marquee_28s_linear_infinite] group-hover:[animation-play-state:paused] flex-shrink-0">
            {TOP_CAROUSEL_BANKS.concat(TOP_CAROUSEL_BANKS).map((bankName, idx) => (
              <button
                key={idx}
                onClick={() => {
                  if (selectSingleBank) selectSingleBank(bankName);
                  else if (toggleBank) toggleBank(bankName);
                  navigate('/cards');
                }}
                className="flex items-center gap-3 px-4 py-2.5 rounded-2xl glass-card-premium border border-[#E5E7EB] dark:border-slate-800 hover:border-[#2563EB]/50 hover:shadow-[0_0_15px_rgba(37,99,235,0.25)] transition-all cursor-pointer flex-shrink-0"
              >
                <BankBrandLogo bankName={bankName} className="w-7 h-7" />
                <span className="text-xs font-extrabold text-[#1F2937] dark:text-white whitespace-nowrap">
                  {bankName}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16 space-y-20">
        
        {/* ── 3. Featured Top Cards Section ── */}
        <TopCardsSection onViewDetails={onViewDetails} />

        {/* ── 4. Trust & Security 4-Pillar Infographic Section ── */}
        <section className="select-none py-6 relative">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-[#2563EB]/10 text-[#2563EB] dark:text-[#60A5FA] text-xs font-bold tracking-widest uppercase rounded-full border border-[#2563EB]/20">
              <ShieldCheck className="w-4 h-4 text-[#2563EB]" />
              INSTITUTIONAL TRUST GUARANTEE
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1F2937] dark:text-white tracking-tight">
              Why Smart Consumers Choose D.CARD
            </h2>
            <p className="text-xs sm:text-sm text-[#6B7280] dark:text-slate-400 font-normal leading-relaxed">
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
                title: "30-Day Audit Cycle", 
                desc: "Fees, limits, and eligibility schedules verified directly against official bank sources every 30 days.", 
                icon: CheckCircle2,
                badge: "Audited Data"
              },
              { 
                title: "AI Financial Engine", 
                desc: "Get personalized debit card insights tailored to your exact spending profile and travel goals.", 
                icon: Bot,
                badge: "Smart AI"
              }
            ].map((item, idx) => {
              const IconComp = item.icon;
              return (
                <motion.div
                  key={idx}
                  whileHover={{ y: -6, rotate: 0.5 }}
                  transition={{ type: "spring", stiffness: 350, damping: 25 }}
                  className="p-6 rounded-3xl glass-card-premium glass-card-hover border border-[#E5E7EB] dark:border-slate-800 shadow-soft text-left flex flex-col justify-between gpu-layer"
                >
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#EFF6FF] dark:bg-slate-800 border border-[#2563EB]/25 flex items-center justify-center text-[#2563EB] dark:text-[#60A5FA] shadow-xs">
                      <IconComp className="w-6 h-6" />
                    </div>
                    <h3 className="text-sm font-extrabold text-[#1F2937] dark:text-white">{item.title}</h3>
                    <p className="text-xs text-[#6B7280] dark:text-slate-400 leading-relaxed font-normal">{item.desc}</p>
                  </div>
                  <div className="mt-6 pt-3 border-t border-[#E5E7EB] dark:border-slate-800 text-[10.5px] font-extrabold text-[#2563EB] dark:text-[#60A5FA] uppercase tracking-widest flex items-center justify-between">
                    <span>{item.badge}</span>
                    <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* ── 5. Curved Wave Section Divider ── */}
        <div className="relative py-2 opacity-60">
          <svg className="w-full h-8 text-[#2563EB]/20 fill-current" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,0 C150,90 350,-40 500,45 C650,130 900,10 1200,60 L1200,120 L0,120 Z" />
          </svg>
        </div>

        {/* ── 6. Life Stage & Financial Profile Portal ── */}
        <section className="select-none">
          <div className="text-center md:text-left mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#E5E7EB] dark:border-slate-800 pb-4">
            <div>
              <span className="mb-2 inline-flex items-center gap-1.5 px-3.5 py-1 bg-[#2563EB]/10 text-[#2563EB] dark:text-[#60A5FA] text-xs font-bold tracking-widest uppercase rounded-full border border-[#2563EB]/20">
                <BarChart3 className="w-3.5 h-3.5" />
                TARGETED DISCOVERY PORTAL
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1F2937] dark:text-white tracking-tight mt-1">
                Find Cards by Life Stage & Profile
              </h2>
              <p className="text-xs sm:text-sm text-[#6B7280] dark:text-slate-400 mt-1 max-w-xl font-normal">
                Explore card setups curated for your active financial profile and life segment.
              </p>
            </div>
            <button
              onClick={() => navigate('/cards')}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#3B82F6] hover:shadow-[0_0_18px_rgba(37,99,235,0.4)] text-white font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer self-center md:self-auto shadow-md"
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
                  whileHover={{ y: -5, scale: 1.02 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => {
                    const targetFilter = stage.id;
                    setActiveFilters(prev => 
                      prev.includes(targetFilter) ? prev.filter(f => f !== targetFilter) : [...prev, targetFilter]
                    );
                    navigate('/cards');
                  }}
                  className={`cursor-pointer p-4 rounded-3xl border transition-all duration-300 shadow-soft flex flex-col justify-between min-h-[180px] select-none text-left glass-card-premium ${
                    isActive 
                      ? "border-[#2563EB] bg-[#EFF6FF] dark:bg-slate-800 text-[#2563EB] shadow-md" 
                      : "border-[#E5E7EB] dark:border-slate-800 hover:border-[#2563EB]/40"
                  }`}
                >
                  <div className="w-10 h-10 rounded-2xl bg-[#EFF6FF] dark:bg-slate-800 border border-[#2563EB]/20 flex items-center justify-center text-[#2563EB] dark:text-[#60A5FA] mb-3 shadow-xs">
                    <StageIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-extrabold text-[#1F2937] dark:text-white tracking-tight">{stage.label}</h3>
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

        {/* ── 7. Pick of the Month ── */}
        <PickOfTheMonth card={debitCards.find(c => c.id === 26)} onViewDetails={onViewDetails} />

        {/* ── 8. AI Financial Engine Banner ── */}
        <section className="select-none">
          <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-[#0B3D91] via-[#1E3A8A] to-[#1E293B] text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 border border-slate-700/80">
            {/* Ambient Orb */}
            <div className="absolute right-0 top-0 w-80 h-80 rounded-full bg-[#2563EB]/25 blur-3xl pointer-events-none" />

            <div className="space-y-4 max-w-xl text-left z-10">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-bold text-[#60A5FA] uppercase tracking-wider border border-white/10">
                <Bot className="w-4 h-4 text-[#60A5FA]" />
                D.CARD AI ADVISOR ENGINE
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight">
                Get Tailored Debit Card Guidance Powered by Live Verification
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                Ask our AI Advisor any question regarding airport lounge rules, zero forex cards, MAB waivers, or ATM withdrawal limits. Real-time responses backed by audited database rules.
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => navigate('/ai-advisor')}
                  className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#3B82F6] hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] text-white font-bold text-xs tracking-wide uppercase shadow-md transition-all cursor-pointer flex items-center gap-2 active:scale-95"
                >
                  <Bot className="w-4 h-4" />
                  <span>Launch AI Advisor</span>
                </button>
                <button
                  onClick={() => navigate('/cards')}
                  className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs tracking-wide uppercase border border-white/20 transition-all cursor-pointer"
                >
                  Browse Card Database
                </button>
              </div>
            </div>

            <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 flex flex-col items-center justify-center text-white shadow-2xl relative z-10 flex-shrink-0 p-4 space-y-2 text-center">
              <Bot className="w-16 h-16 text-[#60A5FA] animate-bounce" style={{ animationDuration: '3s' }} />
              <span className="text-xs font-extrabold text-white">AI Assistant</span>
              <span className="text-[10px] text-emerald-400 font-semibold uppercase flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Index
              </span>
            </div>
          </div>
        </section>

        {/* ── 9. Covered Banking Networks Preview ── */}
        <section className="select-none">
          <div className="mb-6 flex items-end justify-between border-b border-[#E5E7EB] dark:border-slate-800 pb-4 text-left">
            <div>
              <span className="text-xs font-bold text-[#2563EB] dark:text-[#60A5FA] tracking-widest uppercase block mb-1">
                COVERED BANKING NETWORKS
              </span>
              <h2 className="text-2xl font-extrabold text-[#1F2937] dark:text-white">
                Top Listed Banks Overview
              </h2>
              <p className="text-xs text-[#6B7280] dark:text-slate-400 mt-1 font-normal">
                Explore features across leading banks covered in India
              </p>
            </div>
            <button
              onClick={() => navigate('/banks')}
              className="text-xs text-[#2563EB] dark:text-[#60A5FA] font-bold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View All Banks</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {dynamicBanks.slice(0, 3).map((bank) => (
              <BankCard 
                key={bank.name} 
                bank={bank} 
                onSelect={(bankName) => {
                  if (selectSingleBank) {
                    selectSingleBank(bankName);
                  } else if (toggleBank) {
                    toggleBank(bankName);
                  }
                  navigate('/cards');
                  window.scrollTo(0, 0);
                }}
              />
            ))}
          </div>
        </section>

        {/* ── 10. FAQ Section ── */}
        <FaqSection />
      </main>
    </div>
  );
}

export default HomePage;
