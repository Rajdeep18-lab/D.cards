import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  Target, 
  Eye, 
  Zap, 
  Lock, 
  Sparkles, 
  UserCheck, 
  TrendingUp, 
  Globe, 
  CheckCircle2, 
  Scale, 
  Filter, 
  RefreshCw, 
  Building2, 
  Milestone, 
  AlertCircle, 
  ArrowRight, 
  CreditCard,
  Bot
} from 'lucide-react';

function AboutPage() {
  const navigate = useNavigate();

  const coreValues = [
    { title: "Transparency", desc: "100% clear fee disclosures with zero hidden fine print or ambiguous terms.", icon: Eye },
    { title: "Trust", desc: "Built on verified, publicly audited bank disclosures and independent research.", icon: ShieldCheck },
    { title: "Innovation", desc: "AI-driven recommendation engines tailored to your unique financial profile.", icon: Zap },
    { title: "Security", desc: "Bank-grade data protection standards and non-collection of sensitive credentials.", icon: Lock },
    { title: "Simplicity", desc: "Complex schedules of charges translated into intuitive visual metrics.", icon: Sparkles },
    { title: "User First", desc: "Designed entirely around your lifestyle, rewards preferences, and savings goals.", icon: UserCheck },
    { title: "Continuous Improvement", desc: "Constantly updating card database and lounge policies as banks revise terms.", icon: TrendingUp },
    { title: "Financial Inclusion", desc: "Making banking intelligence accessible for students, women, and professionals alike.", icon: Globe }
  ];

  const whyChoose = [
    { title: "AI Powered Recommendations", desc: "Algorithms match your monthly spend patterns with optimal cashback and lounge cards.", icon: Bot },
    { title: "Verified Information", desc: "All card specs, MAB rules, and fee structures cross-referenced with official bank schedules.", icon: CheckCircle2 },
    { title: "Easy Comparisons", desc: "Side-by-side matrices comparing fees, daily limits, forex markup, and lounge access rules.", icon: Scale },
    { title: "Smart Filters", desc: "Instant segmentation by zero-balance, RuPay UPI, student friendly, and luxury perks.", icon: Filter },
    { title: "Regular Updates", desc: "Real-time updates whenever banks revise ATM withdrawal limits or lounge rules.", icon: RefreshCw },
    { title: "Independent Platform", desc: "Zero bank sponsorship or commission arrangements to guarantee unbiased ratings.", icon: Building2 }
  ];

  const timelineEvents = [
    { year: "2026", title: "Idea Started", desc: "Conceived to solve the problem of hidden debit card fees and complex bank disclosures in India." },
    { year: "2026", title: "Platform Development", desc: "Engineered high-performance comparison architecture and real-time fee calculation engines." },
    { year: "2026", title: "100+ Debit Cards Added", desc: "Indexed comprehensive debit card lineups across India's top public and private sector banks." },
    { year: "2026", title: "AI Recommendation System", desc: "Launched intelligent AI advisor for instant personalized card matching based on user lifestyle." },
    { year: "Future", title: "India's Leading Banking Information Platform", desc: "Expanding into complete retail banking intelligence, lounge analytics, and reward optimization." }
  ];

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 relative z-20 space-y-16 text-left select-none">
      
      {/* ── 1. HERO SECTION ── */}
      <section className="border-b border-[#E5E7EB] dark:border-slate-800 pb-10">
        <span className="text-xs font-semibold text-[#2563EB] dark:text-[#60A5FA] tracking-widest uppercase block mb-2">
          INDEPENDENT FINANCIAL PLATFORM
        </span>
        <h1 className="text-4xl sm:text-5xl font-bold text-[#1F2937] dark:text-white tracking-tight">
          About <span className="text-gradient">D.CARD</span>
        </h1>
        <p className="text-base sm:text-lg text-[#6B7280] dark:text-slate-300 mt-2 max-w-3xl font-normal leading-relaxed">
          India's Independent Debit Card Comparison & Information Platform
        </p>
      </section>

      {/* ── 2. WHO WE ARE ── */}
      <section className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-slate-700 shadow-soft space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#EFF6FF] dark:bg-slate-800 border border-[#2563EB]/20 flex items-center justify-center text-[#2563EB]">
            <Building2 className="w-5 h-5" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1F2937] dark:text-white tracking-tight">
            Who We Are
          </h2>
        </div>
        <p className="text-sm sm:text-base text-[#1F2937] dark:text-slate-200 leading-relaxed font-normal">
          D.CARD is an independent fintech information platform built to help users compare, understand, and explore debit cards offered by various banks across India.
        </p>
        <p className="text-sm sm:text-base text-[#6B7280] dark:text-slate-300 leading-relaxed font-normal">
          Our goal is to simplify banking decisions by presenting verified information in an easy-to-understand format.
        </p>
      </section>

      {/* ── 3. OUR MISSION & 4. OUR VISION GRID ── */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Our Mission */}
        <motion.div 
          whileHover={{ y: -4 }}
          className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-slate-700 shadow-soft space-y-4 flex flex-col justify-between"
        >
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#EFF6FF] dark:bg-slate-800 border border-[#2563EB]/20 flex items-center justify-center text-[#2563EB]">
              <Target className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-[#1F2937] dark:text-white tracking-tight">
              Our Mission
            </h2>
            <p className="text-sm sm:text-base text-[#6B7280] dark:text-slate-300 leading-relaxed font-normal">
              To simplify banking decisions by providing transparent, accurate, and AI-powered debit card comparisons that help every user choose the right financial product with confidence.
            </p>
          </div>
          <div className="pt-4 border-t border-[#E5E7EB] dark:border-slate-700 text-xs font-semibold text-[#2563EB] dark:text-[#60A5FA] uppercase tracking-wider">
            Clear • Accurate • AI-Powered
          </div>
        </motion.div>

        {/* Our Vision */}
        <motion.div 
          whileHover={{ y: -4 }}
          className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-slate-700 shadow-soft space-y-4 flex flex-col justify-between"
        >
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#EFF6FF] dark:bg-slate-800 border border-[#2563EB]/20 flex items-center justify-center text-[#2563EB]">
              <Globe className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-[#1F2937] dark:text-white tracking-tight">
              Our Vision
            </h2>
            <p className="text-sm sm:text-base text-[#6B7280] dark:text-slate-300 leading-relaxed font-normal">
              To become India's most trusted debit card comparison platform by making financial information accessible, transparent, and easy to understand for everyone.
            </p>
          </div>
          <div className="pt-4 border-t border-[#E5E7EB] dark:border-slate-700 text-xs font-semibold text-[#2563EB] dark:text-[#60A5FA] uppercase tracking-wider">
            Trusted • Accessible • Transparent
          </div>
        </motion.div>
      </section>

      {/* ── 5. OUR CORE VALUES ── */}
      <section className="space-y-8">
        <div>
          <span className="text-xs font-semibold text-[#2563EB] dark:text-[#60A5FA] tracking-widest uppercase block mb-1">
            GUIDING PRINCIPLES
          </span>
          <h2 className="text-3xl font-bold text-[#1F2937] dark:text-white tracking-tight">
            Our Core Values
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {coreValues.map((value, idx) => {
            const IconComp = value.icon;
            return (
              <motion.div
                key={idx}
                whileHover={{ y: -4 }}
                className="p-6 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-slate-700 shadow-soft flex flex-col justify-between min-h-[190px]"
              >
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#EFF6FF] dark:bg-slate-800 border border-[#2563EB]/20 flex items-center justify-center text-[#2563EB] dark:text-[#60A5FA]">
                    <IconComp className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-[#1F2937] dark:text-white">{value.title}</h3>
                  <p className="text-xs text-[#6B7280] dark:text-slate-400 leading-relaxed font-normal">{value.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ── 6. WHY CHOOSE D.CARD ── */}
      <section className="space-y-8">
        <div>
          <span className="text-xs font-semibold text-[#2563EB] dark:text-[#60A5FA] tracking-widest uppercase block mb-1">
            PLATFORM ADVANTAGES
          </span>
          <h2 className="text-3xl font-bold text-[#1F2937] dark:text-white tracking-tight">
            Why Choose D.CARD
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {whyChoose.map((item, idx) => {
            const IconComp = item.icon;
            return (
              <motion.div
                key={idx}
                whileHover={{ y: -4 }}
                className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-slate-700 shadow-soft space-y-3"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#EFF6FF] dark:bg-slate-800 border border-[#2563EB]/20 flex items-center justify-center text-[#2563EB] dark:text-[#60A5FA]">
                  <IconComp className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-[#1F2937] dark:text-white tracking-tight">{item.title}</h3>
                <p className="text-xs sm:text-sm text-[#6B7280] dark:text-slate-400 leading-relaxed font-normal">{item.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ── 7. OUR JOURNEY ── */}
      <section className="space-y-8">
        <div>
          <span className="text-xs font-semibold text-[#2563EB] dark:text-[#60A5FA] tracking-widest uppercase block mb-1">
            ROADMAP & EVOLUTION
          </span>
          <h2 className="text-3xl font-bold text-[#1F2937] dark:text-white tracking-tight">
            Our Journey
          </h2>
        </div>

        <div className="relative border-l-2 border-[#2563EB]/30 dark:border-[#2563EB]/40 ml-4 sm:ml-6 space-y-8 pl-6 sm:pl-8 py-2">
          {timelineEvents.map((event, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="relative group"
            >
              {/* Circle Marker */}
              <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-[#2563EB] border-4 border-white dark:border-[#0F172A] shadow-md group-hover:scale-125 transition-transform" />

              <div className="p-6 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-slate-700 shadow-soft max-w-2xl space-y-1.5">
                <span className="inline-block px-3 py-1 rounded-full bg-[#2563EB]/10 text-[#2563EB] dark:text-[#60A5FA] text-xs font-bold border border-[#2563EB]/20 uppercase tracking-wider">
                  {event.year}
                </span>
                <h3 className="text-lg font-bold text-[#1F2937] dark:text-white pt-1">{event.title}</h3>
                <p className="text-xs sm:text-sm text-[#6B7280] dark:text-slate-400 font-normal leading-relaxed">{event.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── 8. DISCLAIMER ── */}
      <section className="p-6 sm:p-8 rounded-3xl bg-[#EFF6FF] dark:bg-slate-800/80 border border-[#2563EB]/30 shadow-soft space-y-3">
        <div className="flex items-center gap-2.5 text-[#2563EB] dark:text-[#60A5FA]">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <h3 className="text-sm font-bold uppercase tracking-wider">Regulatory & Legal Disclaimer</h3>
        </div>
        <p className="text-xs sm:text-sm text-[#1F2937] dark:text-slate-200 leading-relaxed font-normal italic">
          "D.CARD is an independent debit card comparison and information platform. We are not a bank and are not officially affiliated or partnered with any listed bank. All information is collected from publicly available sources and official bank websites."
        </p>
      </section>

      {/* ── 9. CTA ── */}
      <section className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#2563EB] text-white text-center shadow-xl space-y-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 rounded-full bg-[#2563EB]/20 blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-4 max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Explore India's Smart Debit Card Platform
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed">
            Find the right card based on lounge access, cashback rewards, zero-balance features, and daily withdrawal limits.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate('/cards')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-[#2563EB] to-[#3B82F6] hover:opacity-95 text-white font-semibold text-xs uppercase tracking-wider shadow-lg shadow-[#2563EB]/30 border border-white/20 cursor-pointer transition-all flex items-center justify-center gap-2"
            >
              <CreditCard className="w-4 h-4" />
              <span>Explore Cards</span>
            </button>
            <button
              onClick={() => navigate('/compare')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs uppercase tracking-wider border border-slate-700 cursor-pointer transition-all flex items-center justify-center gap-2"
            >
              <Scale className="w-4 h-4" />
              <span>Compare Cards</span>
            </button>
          </div>
        </div>
      </section>

    </main>
  );
}

export default AboutPage;
