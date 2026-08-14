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
  Award,
  Users,
  Quote,
  Briefcase,
  Lightbulb,
  Mail
} from 'lucide-react';

const TEAM = [
  {
    roleLabel: "Founder",
    name: "Ritik Raj",
    title: "Founder & CEO",
    tag: "Executive Leadership",
    initials: "RR",
    profile: "Ritik Raj is the Founder and Chief Executive Officer of D.CARD. He envisioned a platform that makes banking information simple, transparent, and accessible for every Indian user. His focus is on innovation, strategic growth, product vision, and building a trusted fintech platform that empowers users to make smarter financial decisions.",
    vision: "To empower 100+ million Indian account holders with transparent, audited debit card fee breakdowns and AI-powered recommendations.",
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
    profile: "Rajdeep serves as the Co-Founder of D.CARD and leads product development and user experience. He is responsible for transforming ideas into practical digital solutions, building scalable features, integrating AI-powered recommendations, and ensuring a seamless experience across the platform.",
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
    tag: "Technology & Engineering",
    initials: "KS",
    profile: "Kaushik Kumar Srivastava leads the technology division of D.CARD. He is responsible for the platform’s technical architecture, backend infrastructure, security, scalability, and performance optimization, ensuring a reliable and secure fintech experience for all users.",
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
    profile: "Bipashu Dubey oversees the marketing and brand strategy of D.CARD. His mission is to establish D.CARD as one of India’s most trusted fintech information platforms through digital marketing, community engagement, strategic partnerships, and user growth initiatives.",
    responsibilities: [
      "Brand Strategy",
      "Digital Marketing",
      "Community Growth",
      "Strategic Partnerships",
      "User Acquisition"
    ]
  }
];

const LEADERSHIP_MATTERS = [
  { title: "Innovation", icon: Zap, desc: "Pioneering AI algorithms that translate 60-page PDF fee schedules into simple visual metrics." },
  { title: "Technology", icon: Cpu, desc: "Engineered for bank-grade security, instant data indexing, and sub-100ms response times." },
  { title: "Customer First", icon: UserCheck, desc: "Designing every comparison matrix around real user savings, student perks, and lounge access." },
  { title: "Transparency", icon: Eye, desc: "Committing to 100% zero-commission independence from banks for completely unbiased ratings." }
];

function FoundersPage() {
  const navigate = useNavigate();

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 relative z-20 space-y-16 text-left select-none">
      
      {/* ── 1. HERO BANNER ── */}
      <section className="border-b border-[#E5E7EB] dark:border-slate-800 pb-10">
        <span className="text-xs font-semibold text-[#2563EB] dark:text-[#60A5FA] tracking-widest uppercase block mb-2">
          MEET OUR LEADERSHIP
        </span>
        <h1 className="text-3xl sm:text-5xl font-bold text-[#1F2937] dark:text-white tracking-tight">
          Meet the Team Behind <span className="text-gradient">D.CARD</span>
        </h1>
        <p className="text-base sm:text-lg text-[#6B7280] dark:text-slate-300 mt-2 max-w-3xl font-normal leading-relaxed">
          The passionate founders, engineers, and strategists building India's next-generation AI savings account and debit card discovery platform.
        </p>
      </section>

      {/* ── 2. LEADERSHIP CARDS ── */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {TEAM.map((person, idx) => (
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

              <div className="space-y-2">
                <h3 className="text-xs font-bold text-[#1F2937] dark:text-white uppercase tracking-wider">
                  Professional Profile
                </h3>
                <p className="text-xs sm:text-sm text-[#6B7280] dark:text-slate-300 leading-relaxed font-normal">
                  {person.profile}
                </p>
              </div>

              {person.vision && (
                <div className="p-3.5 rounded-2xl bg-[#EFF6FF] dark:bg-slate-800/80 border border-[#2563EB]/20 text-xs text-[#2563EB] dark:text-[#60A5FA] font-semibold">
                  <span className="font-bold uppercase tracking-wider block text-[10px] mb-0.5">Executive Vision</span>
                  {person.vision}
                </div>
              )}
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

      {/* ── 3. OUR LEADERSHIP PHILOSOPHY ── */}
      <section className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-slate-700 shadow-soft space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#EFF6FF] dark:bg-slate-800 border border-[#2563EB]/20 flex items-center justify-center text-[#2563EB]">
            <Lightbulb className="w-5 h-5" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1F2937] dark:text-white tracking-tight">
            Our Leadership Philosophy
          </h2>
        </div>
        <p className="text-sm sm:text-base text-[#1F2937] dark:text-slate-200 leading-relaxed font-normal">
          At D.CARD, our founders firmly believe that breakthrough innovation in financial technology begins with radical transparency and unyielding consumer trust.
        </p>
        <p className="text-xs sm:text-sm text-[#6B7280] dark:text-slate-300 leading-relaxed font-normal">
          By eliminating corporate bias and prioritizing user needs above short-term profit models, our leadership team ensures that every feature, comparison matrix, and AI recommendation is designed to build India's best independent savings account and debit card discovery platform.
        </p>
      </section>

      {/* ── 4. MEET OUR LEADERSHIP ── */}
      <section className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-slate-700 shadow-soft space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#EFF6FF] dark:bg-slate-800 border border-[#2563EB]/20 flex items-center justify-center text-[#2563EB]">
            <Users className="w-5 h-5" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1F2937] dark:text-white tracking-tight">
            Meet Our Leadership
          </h2>
        </div>
        <p className="text-sm sm:text-base text-[#1F2937] dark:text-slate-200 leading-relaxed font-normal">
          Our executive leadership brings together complementary expertise across product engineering, artificial intelligence, cloud architecture, and digital growth. Working collaboratively, the leadership team holds daily cross-functional syncs to continuously refine D.CARD's data algorithms, expand bank coverage, and deliver world-class financial clarity to users across India.
        </p>
      </section>

      {/* ── 5. FOUNDER MESSAGE ── */}
      <section className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-[#EFF6FF] to-white dark:from-slate-800 dark:to-[#1E293B] border border-[#2563EB]/30 shadow-soft space-y-6 text-center sm:text-left relative overflow-hidden">
        <Quote className="w-16 h-16 text-[#2563EB]/15 absolute right-6 top-6 pointer-events-none" />
        <div className="flex items-center gap-3 justify-center sm:justify-start">
          <div className="w-10 h-10 rounded-2xl bg-[#2563EB] text-white flex items-center justify-center shadow-md">
            <Quote className="w-5 h-5" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#1F2937] dark:text-white tracking-tight">
            Founder Message
          </h2>
        </div>

        <blockquote className="text-base sm:text-lg text-[#1F2937] dark:text-white font-semibold leading-relaxed max-w-3xl italic">
          "At D.CARD, our goal is to simplify banking decisions through transparency, technology, and trust. We believe every user deserves clear and unbiased financial information."
        </blockquote>

        <div className="pt-2 border-t border-[#2563EB]/20 max-w-xs">
          <p className="text-sm font-bold text-[#1F2937] dark:text-white">Ritik Raj</p>
          <p className="text-xs text-[#2563EB] dark:text-[#60A5FA] font-semibold">Founder & CEO, D.CARD</p>
        </div>
      </section>

      {/* ── 6. MEET OUR TEAM & 7. FUTURE TEAM VISION ── */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-8 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-slate-700 shadow-soft space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#EFF6FF] dark:bg-slate-800 border border-[#2563EB]/20 flex items-center justify-center text-[#2563EB]">
              <Users className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-[#1F2937] dark:text-white">
              Meet Our Team
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#6B7280] dark:text-slate-300 leading-relaxed font-normal">
            D.CARD is continuously growing and actively welcomes talented software developers, UI/UX designers, fintech marketers, and AI enthusiasts who are passionate about democratizing financial intelligence in India.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-slate-700 shadow-soft space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#EFF6FF] dark:bg-slate-800 border border-[#2563EB]/20 flex items-center justify-center text-[#2563EB]">
              <Briefcase className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-[#1F2937] dark:text-white">
              Future Team Vision
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#6B7280] dark:text-slate-300 leading-relaxed font-normal">
            As we scale platform capability, our expansion roadmap includes building dedicated data engineering teams, financial compliance auditors, and machine learning researchers to provide real-time lounge access and rewards tracking.
          </p>
        </div>
      </section>

      {/* ── 8. WHY OUR LEADERSHIP MATTERS ── */}
      <section className="space-y-8">
        <div>
          <span className="text-xs font-semibold text-[#2563EB] dark:text-[#60A5FA] tracking-widest uppercase block mb-1">
            EXECUTIVE COMMITMENT
          </span>
          <h2 className="text-3xl font-bold text-[#1F2937] dark:text-white tracking-tight">
            Why Our Leadership Matters
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {LEADERSHIP_MATTERS.map((item, idx) => {
            const IconComp = item.icon;
            return (
              <motion.div
                key={idx}
                whileHover={{ y: -4 }}
                className="p-6 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-slate-700 shadow-soft space-y-3"
              >
                <div className="w-10 h-10 rounded-2xl bg-[#EFF6FF] dark:bg-slate-800 border border-[#2563EB]/20 flex items-center justify-center text-[#2563EB] dark:text-[#60A5FA]">
                  <IconComp className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-[#1F2937] dark:text-white">{item.title}</h3>
                <p className="text-xs text-[#6B7280] dark:text-slate-400 leading-relaxed font-normal">{item.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ── 9. JOIN OUR JOURNEY (CTA) ── */}
      <section className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#2563EB] text-white text-center shadow-xl space-y-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 rounded-full bg-[#2563EB]/20 blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-4 max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Join Our Journey
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed">
            Experience India's most transparent savings account and debit card comparison platform or get in touch with our team.
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
              onClick={() => navigate('/contact')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs uppercase tracking-wider border border-slate-700 cursor-pointer transition-all flex items-center justify-center gap-2"
            >
              <Mail className="w-4 h-4" />
              <span>Contact Us</span>
            </button>
          </div>
        </div>
      </section>

    </main>
  );
}

export default FoundersPage;
