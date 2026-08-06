import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  Target, 
  Globe, 
  Eye, 
  Zap, 
  Lock, 
  Sparkles, 
  UserCheck, 
  CheckCircle2, 
  ArrowRight, 
  CreditCard, 
  Scale, 
  ChevronDown,
  Building2,
  Award
} from 'lucide-react';

const FOUNDERS = [
  {
    roleLabel: "Founder",
    name: "Ritik Raj",
    title: "Founder & CEO",
    tag: "Executive Leadership",
    initials: "RR",
    desc: "Ritik Raj is the Founder and Chief Executive Officer of D.CARD. He envisioned a platform that makes banking information simple, transparent, and accessible for every Indian user. His focus is on innovation, strategic growth, product vision, and building a trusted fintech platform that empowers users to make smarter financial decisions.",
    responsibilities: [
      "Company Vision & Leadership",
      "Business Strategy",
      "Product Innovation",
      "Growth & Expansion",
      "Financial Technology Development"
    ]
  },
  {
    roleLabel: "Co-Founder",
    name: "Rajdeep",
    title: "Co-Founder & Product Development",
    tag: "Product & Experience",
    initials: "RD",
    desc: "Rajdeep serves as the Co-Founder of D.CARD and leads product development and user experience. He is responsible for transforming ideas into practical digital solutions, building scalable features, integrating AI-powered recommendations, and ensuring a seamless experience across the platform.",
    responsibilities: [
      "Product Development",
      "User Experience (UX)",
      "Frontend Development",
      "AI Feature Integration",
      "Platform Optimization"
    ]
  },
  {
    roleLabel: "Chief Technology Officer",
    name: "Kaushik Kumar Srivastava",
    title: "Chief Technology Officer (CTO)",
    tag: "Technology & Infrastructure",
    initials: "KS",
    desc: "Kaushik Kumar Srivastava leads the technology division of D.CARD. He is responsible for the platform’s technical architecture, backend infrastructure, security, scalability, and performance optimization, ensuring a reliable and secure fintech experience for all users.",
    responsibilities: [
      "Technical Architecture",
      "Backend Development",
      "Cloud Infrastructure",
      "Security & Performance",
      "System Scalability"
    ]
  },
  {
    roleLabel: "Chief Marketing Officer",
    name: "Bipashu Dubey",
    title: "Chief Marketing Officer (CMO)",
    tag: "Brand & Growth Strategy",
    initials: "BD",
    desc: "Bipashu Dubey oversees the marketing and brand strategy of D.CARD. His mission is to establish D.CARD as one of India’s most trusted fintech information platforms through digital marketing, community engagement, strategic partnerships, and user growth initiatives.",
    responsibilities: [
      "Brand Strategy",
      "Digital Marketing",
      "Community Growth",
      "Strategic Partnerships",
      "User Acquisition"
    ]
  }
];

const CORE_VALUES = [
  { title: "Transparency", icon: Eye, desc: "Clear fee breakdowns with zero hidden charges or fine print." },
  { title: "Innovation", icon: Zap, desc: "AI-driven recommendation engines built for Indian banking needs." },
  { title: "Trust", icon: ShieldCheck, desc: "Built on verified, publicly audited bank disclosures." },
  { title: "Security", icon: Lock, desc: "Bank-grade data protection standards and 256-bit security." },
  { title: "Customer First", icon: UserCheck, desc: "Engineered entirely around user goals, lounge perks, and savings." },
  { title: "Financial Inclusion", icon: Globe, desc: "Making debit card intelligence accessible for every citizen in India." }
];

const TIMELINE = [
  { year: "2026", title: "Idea Started", desc: "Conceived to eliminate confusion and bring transparency to Indian debit card fees." },
  { year: "2026", title: "Platform Development", desc: "Built high-performance fee engines, side-by-side matrices, and visual card designs." },
  { year: "2026", title: "100+ Debit Cards", desc: "Indexed comprehensive debit card lineups across India's top public & private sector banks." },
  { year: "2026", title: "AI Recommendation Engine", desc: "Launched AI advisor for instant personalized card matching based on user lifestyle." },
  { year: "Future", title: "Future Expansion", desc: "Expanding into complete retail banking intelligence, lounge analytics, and reward optimization." }
];

function FoundersPage() {
  const navigate = useNavigate();

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 relative z-20 space-y-16 text-left select-none">
      
      {/* ── 1. HERO BANNER ── */}
      <section className="border-b border-[#E5E7EB] dark:border-slate-800 pb-10">
        <span className="text-xs font-semibold text-[#2563EB] dark:text-[#60A5FA] tracking-widest uppercase block mb-2">
          EXECUTIVE LEADERSHIP
        </span>
        <h1 className="text-3xl sm:text-5xl font-bold text-[#1F2937] dark:text-white tracking-tight">
          Meet the Visionaries Behind <span className="text-gradient">D.CARD</span>
        </h1>
        <p className="text-base sm:text-lg text-[#6B7280] dark:text-slate-300 mt-2 max-w-3xl font-normal leading-relaxed">
          Building India's Independent Debit Card Comparison Platform.
        </p>
      </section>

      {/* ── 2. FOUNDERS & EXECUTIVE CARDS ── */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {FOUNDERS.map((person, idx) => (
          <motion.div
            key={person.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            whileHover={{ y: -4 }}
            className="p-8 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-slate-700 shadow-soft flex flex-col justify-between space-y-6"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#2563EB] to-[#3B82F6] text-white flex items-center justify-center text-xl font-bold shadow-md shadow-[#2563EB]/25 flex-shrink-0">
                  {person.initials}
                </div>
                <div>
                  <span className="text-[10px] font-bold text-[#2563EB] dark:text-[#60A5FA] uppercase tracking-widest block mb-0.5">
                    {person.roleLabel}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold text-[#1F2937] dark:text-white leading-tight">
                    {person.name}
                  </h2>
                  <p className="text-xs font-semibold text-[#6B7280] dark:text-slate-300">
                    {person.title}
                  </p>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-[#6B7280] dark:text-slate-300 leading-relaxed font-normal">
                {person.desc}
              </p>
            </div>

            <div className="pt-4 border-t border-[#E5E7EB] dark:border-slate-700 space-y-2">
              <h3 className="text-xs font-bold text-[#1F2937] dark:text-white uppercase tracking-wider">
                Responsibilities
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#1F2937] dark:text-slate-300 font-normal">
                {person.responsibilities.map((resp, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#2563EB] flex-shrink-0" />
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        ))}
      </section>

      {/* ── 3. OUR MISSION & 4. OUR VISION GRID ── */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Mission */}
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
              To simplify banking decisions by providing transparent, AI-powered, and unbiased debit card comparisons that help every user choose the right financial product with confidence.
            </p>
          </div>
          <div className="pt-4 border-t border-[#E5E7EB] dark:border-slate-700 text-xs font-semibold text-[#2563EB] dark:text-[#60A5FA] uppercase tracking-wider">
            Transparent • AI-Powered • Unbiased
          </div>
        </motion.div>

        {/* Vision */}
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
              To become India's most trusted independent debit card comparison platform.
            </p>
          </div>
          <div className="pt-4 border-t border-[#E5E7EB] dark:border-slate-700 text-xs font-semibold text-[#2563EB] dark:text-[#60A5FA] uppercase tracking-wider">
            Trusted • Independent • National Scale
          </div>
        </motion.div>
      </section>

      {/* ── 5. CORE VALUES ── */}
      <section className="space-y-8">
        <div>
          <span className="text-xs font-semibold text-[#2563EB] dark:text-[#60A5FA] tracking-widest uppercase block mb-1">
            CORE PRINCIPLES
          </span>
          <h2 className="text-3xl font-bold text-[#1F2937] dark:text-white tracking-tight">
            Core Values
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CORE_VALUES.map((val, idx) => {
            const IconComp = val.icon;
            return (
              <motion.div
                key={idx}
                whileHover={{ y: -4 }}
                className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-slate-700 shadow-soft space-y-3"
              >
                <div className="w-10 h-10 rounded-2xl bg-[#EFF6FF] dark:bg-slate-800 border border-[#2563EB]/20 flex items-center justify-center text-[#2563EB] dark:text-[#60A5FA]">
                  <IconComp className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-[#1F2937] dark:text-white">{val.title}</h3>
                <p className="text-xs text-[#6B7280] dark:text-slate-400 leading-relaxed font-normal">{val.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ── 6. COMPANY TIMELINE ── */}
      <section className="space-y-8">
        <div>
          <span className="text-xs font-semibold text-[#2563EB] dark:text-[#60A5FA] tracking-widest uppercase block mb-1">
            EVOLUTION & MILESTONES
          </span>
          <h2 className="text-3xl font-bold text-[#1F2937] dark:text-white tracking-tight">
            Company Timeline
          </h2>
        </div>

        <div className="max-w-xl mx-auto space-y-4">
          {TIMELINE.map((item, idx) => (
            <React.Fragment key={idx}>
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="p-6 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-slate-700 shadow-soft flex items-center gap-4 text-left"
              >
                <div className="px-3.5 py-1.5 rounded-2xl bg-[#2563EB] text-white text-xs font-bold shadow-sm flex-shrink-0">
                  {item.year}
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#1F2937] dark:text-white">{item.title}</h3>
                  <p className="text-xs text-[#6B7280] dark:text-slate-400 mt-0.5 font-normal leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>

              {idx < TIMELINE.length - 1 && (
                <div className="flex justify-center my-1 text-[#2563EB]">
                  <ChevronDown className="w-6 h-6 animate-bounce" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* ── 7. CTA SECTION ── */}
      <section className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#2563EB] text-white text-center shadow-xl space-y-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 rounded-full bg-[#2563EB]/20 blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-4 max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Explore India's Smart Debit Card Platform
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed">
            Compare annual fees, lounge access, cashback rewards, and withdrawal limits across top banks.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate('/cards')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-[#2563EB] to-[#3B82F6] hover:opacity-95 text-white font-semibold text-xs uppercase tracking-wider shadow-lg shadow-[#2563EB]/30 border border-white/20 cursor-pointer transition-all flex items-center justify-center gap-2"
            >
              <CreditCard className="w-4 h-4" />
              <span>Explore Debit Cards</span>
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

export default FoundersPage;
