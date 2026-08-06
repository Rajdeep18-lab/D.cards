import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  UserCheck, 
  Code2, 
  Cpu, 
  TrendingUp, 
  Target, 
  Globe, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight,
  CreditCard,
  Building2,
  Lock,
  Eye,
  Zap,
  Award
} from 'lucide-react';

const TEAM = [
  {
    name: "Ritik Raj",
    role: "Founder & CEO",
    tag: "Executive Leadership",
    initials: "RR",
    bio: "Ritik Raj is the Founder and Chief Executive Officer of D.CARD. He envisioned a platform that makes banking information simple, transparent, and accessible for every Indian user. His focus is on innovation, strategic growth, product vision, and building a trusted fintech platform that empowers users to make smarter financial decisions.",
    responsibilities: [
      "Company Vision & Leadership",
      "Business Strategy",
      "Product Innovation",
      "Growth & Expansion",
      "Financial Technology Development"
    ]
  },
  {
    name: "Rajdeep",
    role: "Co-Founder",
    tag: "Product & Experience",
    initials: "RD",
    bio: "Rajdeep serves as the Co-Founder of D.CARD and leads product development and user experience. He is responsible for transforming ideas into practical digital solutions, building scalable features, integrating AI-powered recommendations, and ensuring a seamless experience across the platform.",
    responsibilities: [
      "Product Development",
      "User Experience (UX)",
      "Frontend Development",
      "AI Feature Integration",
      "Platform Optimization"
    ]
  },
  {
    name: "Kaushik Kumar Srivastava",
    role: "Chief Technology Officer (CTO)",
    tag: "Technology & Engineering",
    initials: "KS",
    bio: "Kaushik Kumar Srivastava leads the technology division of D.CARD. He is responsible for the platform’s technical architecture, backend infrastructure, security, scalability, and performance optimization, ensuring a reliable and secure fintech experience for all users.",
    responsibilities: [
      "Technical Architecture",
      "Backend Development",
      "Cloud Infrastructure",
      "Security & Performance",
      "System Scalability"
    ]
  },
  {
    name: "Bipashu Dubey",
    role: "Chief Marketing Officer (CMO)",
    tag: "Brand & Growth Strategy",
    initials: "BD",
    bio: "Bipashu Dubey oversees the marketing and brand strategy of D.CARD. His mission is to establish D.CARD as one of India’s most trusted fintech information platforms through digital marketing, community engagement, strategic partnerships, and user growth initiatives.",
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
  { title: "Transparency", icon: Eye, desc: "100% clear fee disclosures with zero hidden fine print." },
  { title: "Innovation", icon: Zap, desc: "AI recommendation algorithms tailored to your spending lifestyle." },
  { title: "Trust", icon: ShieldCheck, desc: "Built on verified, publicly audited bank disclosures and independent research." },
  { title: "Security", icon: Lock, desc: "Bank-grade security and non-collection of sensitive credentials." },
  { title: "Simplicity", icon: Sparkles, desc: "Complex 60-page bank fee schedules translated into clear visual metrics." },
  { title: "User First", icon: UserCheck, desc: "Engineered around your savings, lounge perks, and cashback goals." },
  { title: "Financial Inclusion", icon: Globe, desc: "Empowering students, professionals, and families across India." },
  { title: "Continuous Improvement", icon: TrendingUp, desc: "Constant database auditing as banks revise lounge policies and charges." }
];

function FoundersPage() {
  const navigate = useNavigate();

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 relative z-20 space-y-16 text-left select-none">
      
      {/* ── HERO SECTION ── */}
      <section className="border-b border-[#E5E7EB] dark:border-slate-800 pb-10">
        <span className="text-xs font-semibold text-[#2563EB] dark:text-[#60A5FA] tracking-widest uppercase block mb-2">
          EXECUTIVE LEADERSHIP
        </span>
        <h1 className="text-3xl sm:text-5xl font-bold text-[#1F2937] dark:text-white tracking-tight">
          Meet the Visionaries Behind D.CARD
        </h1>
        <p className="text-base sm:text-lg text-[#6B7280] dark:text-slate-300 mt-2 max-w-3xl font-normal leading-relaxed">
          Building India’s next-generation AI-powered debit card comparison and banking information platform.
        </p>
      </section>

      {/* ── LEADERSHIP CARDS GRID ── */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {TEAM.map((member, idx) => (
          <motion.div
            key={member.name}
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
                  {member.initials}
                </div>
                <div>
                  <span className="text-[10px] font-bold text-[#2563EB] dark:text-[#60A5FA] uppercase tracking-widest block mb-0.5">
                    {member.tag}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold text-[#1F2937] dark:text-white leading-tight">
                    {member.name}
                  </h2>
                  <p className="text-xs font-semibold text-[#6B7280] dark:text-slate-300">
                    {member.role}
                  </p>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-[#6B7280] dark:text-slate-300 leading-relaxed font-normal">
                {member.bio}
              </p>
            </div>

            <div className="pt-4 border-t border-[#E5E7EB] dark:border-slate-700 space-y-2">
              <h3 className="text-xs font-bold text-[#1F2937] dark:text-white uppercase tracking-wider">
                Key Responsibilities
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#1F2937] dark:text-slate-300 font-normal">
                {member.responsibilities.map((resp, i) => (
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

      {/* ── OUR MISSION & OUR VISION GRID ── */}
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
              To simplify banking decisions by providing transparent, accurate, and AI-powered debit card comparisons that help every user choose the right financial product with confidence. We aim to eliminate confusion in banking choices and make financial information easy to understand for everyone.
            </p>
          </div>
          <div className="pt-4 border-t border-[#E5E7EB] dark:border-slate-700 text-xs font-semibold text-[#2563EB] dark:text-[#60A5FA] uppercase tracking-wider">
            Transparent • Accurate • AI-Powered
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
              To become India’s most trusted independent fintech comparison platform by making debit card information accessible, reliable, and user-friendly through innovative technology and intelligent recommendations.
            </p>
          </div>
          <div className="pt-4 border-t border-[#E5E7EB] dark:border-slate-700 text-xs font-semibold text-[#2563EB] dark:text-[#60A5FA] uppercase tracking-wider">
            Accessible • Reliable • User-Friendly
          </div>
        </motion.div>
      </section>

      {/* ── OUR CORE VALUES ── */}
      <section className="space-y-8">
        <div>
          <span className="text-xs font-semibold text-[#2563EB] dark:text-[#60A5FA] tracking-widest uppercase block mb-1">
            EXECUTIVE STANDARDS
          </span>
          <h2 className="text-3xl font-bold text-[#1F2937] dark:text-white tracking-tight">
            Our Core Values
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CORE_VALUES.map((val, idx) => {
            const IconComp = val.icon;
            return (
              <motion.div
                key={idx}
                whileHover={{ y: -4 }}
                className="p-6 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-slate-700 shadow-soft space-y-3"
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

      {/* ── OUR COMMITMENT ── */}
      <section className="p-8 sm:p-10 rounded-3xl bg-[#EFF6FF] dark:bg-slate-800/80 border border-[#2563EB]/30 shadow-soft space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#2563EB] text-white flex items-center justify-center shadow-md">
            <Award className="w-5 h-5" />
          </div>
          <h2 className="text-2xl font-bold text-[#1F2937] dark:text-white tracking-tight">
            Our Commitment
          </h2>
        </div>
        <p className="text-sm sm:text-base text-[#1F2937] dark:text-slate-200 leading-relaxed font-normal">
          We are committed to building a platform that is independent, transparent, and focused entirely on helping users make informed banking decisions. D.CARD is dedicated to providing reliable financial information while maintaining the highest standards of accuracy, usability, and trust.
        </p>
      </section>

      {/* ── CTA SECTION ── */}
      <section className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#2563EB] text-white text-center shadow-xl space-y-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 rounded-full bg-[#2563EB]/20 blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-4 max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Discover India's Premier Debit Card Platform
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed">
            Compare lounge access, zero-balance features, cashback rates, and foreign markup fees across all major banks.
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
              onClick={() => navigate('/about')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs uppercase tracking-wider border border-slate-700 cursor-pointer transition-all flex items-center justify-center gap-2"
            >
              <Building2 className="w-4 h-4" />
              <span>About Platform</span>
            </button>
          </div>
        </div>
      </section>

    </main>
  );
}

export default FoundersPage;
