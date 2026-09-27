import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useSEO } from '../hooks/useSEO';
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
  AlertCircle, 
  CreditCard,
  Rocket,
  HelpCircle,
  MapPin,
  Compass,
  Bot,
  Users,
  Quote,
  Briefcase,
  Lightbulb,
  Cpu,
  Mail,
  Percent
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

function AboutPage() {
  useSEO({
    title: "About D.Card – Independent Financial Information Platform",
    description: "Learn about D.Card, India's independent platform comparing debit cards, savings accounts, and current accounts.",
    canonicalUrl: "https://www.dcard.website/about"
  });

  const navigate = useNavigate();

  const whatWeOffer = [
    {
      title: "Debit Cards Discovery & Specs",
      desc: "Explore 100+ debit cards across 15+ Indian banks. Compare annual fees, ATM withdrawal limits, airport lounge access, forex markup, and contactless RuPay/Visa features.",
      icon: CreditCard,
      actionText: "Explore Debit Cards",
      actionPath: "/cards"
    },
    {
      title: "High-Yield Savings Accounts",
      desc: "Compare savings account interest rates (up to 7.50% p.a.), minimum monthly average balance (MAB), online Video KYC opening, and associated debit card perks.",
      icon: Percent,
      actionText: "Explore Savings Accounts",
      actionPath: "/savings-accounts"
    },
    {
      title: "Banking Product Comparison",
      desc: "Side-by-side mathematical comparison matrix matching interest rates, annual charges, daily limits, and reward structures across public and private banks.",
      icon: Scale,
      actionText: "Compare Products",
      actionPath: "/compare"
    },
    {
      title: "D.CARD AI Assistance",
      desc: "Ask questions grounded in live database records with zero hallucinated rates. Get instant verified answers tailored to your specific spending patterns.",
      icon: Bot,
      actionText: "Ask AI Assistance",
      actionPath: "/ai-advisor"
    }
  ];

  const coreValues = [
    { title: "Transparency", desc: "100% clear fee disclosures with zero hidden fine print or ambiguous terms.", icon: Eye },
    { title: "Innovation", desc: "AI-driven recommendation engines tailored to your unique financial profile.", icon: Zap },
    { title: "Trust", desc: "Built on verified, publicly audited bank disclosures and independent research.", icon: ShieldCheck },
    { title: "Security", desc: "Bank-grade data protection standards and non-collection of sensitive credentials.", icon: Lock },
    { title: "Simplicity", desc: "Complex 60-page bank fee schedules translated into clear visual metrics.", icon: Sparkles },
    { title: "User First", desc: "Designed entirely around your lifestyle, rewards preferences, and savings goals.", icon: UserCheck },
    { title: "Financial Inclusion", desc: "Making banking intelligence accessible for students, women, and professionals alike.", icon: Globe },
    { title: "Continuous Improvement", desc: "Constantly updating card database and lounge policies as banks revise terms.", icon: TrendingUp }
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
    { year: "Future", title: "Future Expansion", desc: "Expanding into complete retail banking intelligence, lounge analytics, and reward optimization." }
  ];

  const futureRoadmap = [
    { title: "Lounge Access Tracker", desc: "Live airport & railway lounge access checker with quarterly usage quotas.", icon: Compass },
    { title: "Forex Markup Calculator", desc: "International spend simulator comparing markup rates and currency fees.", icon: Globe },
    { title: "Rewards Optimizer", desc: "Personalized point redemption calculator for flight, shopping, and fuel vouchers.", icon: Zap },
    { title: "Smart Bank Finder", desc: "Matching users to zero-balance accounts based on local branch network coverage.", icon: MapPin }
  ];

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 relative z-20 space-y-16 text-left select-none">
      
      {/* ── 1. ABOUT D.CARD (HERO BANNER) ── */}
      <section className="border-b border-[#E5E7EB] dark:border-slate-800 pb-10">
        <span className="text-xs font-semibold text-[#2563EB] dark:text-[#60A5FA] tracking-widest uppercase block mb-2">
          COMPANY OVERVIEW
        </span>
        <h1 className="text-4xl sm:text-5xl font-bold text-[#1F2937] dark:text-white tracking-tight">
          About <span className="text-gradient">D.CARD</span>
        </h1>
        <p className="text-base sm:text-lg text-[#6B7280] dark:text-slate-300 mt-2 max-w-3xl font-normal leading-relaxed">
          D.CARD is a banking-product discovery and comparison platform designed to simplify the way users explore savings accounts, current accounts, and debit cards.
        </p>
      </section>

      {/* ── 2. WHAT IS D.CARD & WHY CREATED ── */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-slate-700 shadow-soft space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#EFF6FF] dark:bg-slate-800 border border-[#2563EB]/20 flex items-center justify-center text-[#2563EB]">
                <Building2 className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-bold text-[#1F2937] dark:text-white tracking-tight">
                What is D.CARD?
              </h2>
            </div>
            <p className="text-sm sm:text-base text-[#1F2937] dark:text-slate-200 leading-relaxed font-normal">
              D.CARD is an independent fintech information platform built to help users compare, understand, and explore debit cards, savings accounts, and current accounts offered by leading banks across India.
            </p>
            <p className="text-xs sm:text-sm text-[#6B7280] dark:text-slate-300 leading-relaxed font-normal">
              Our goal is to simplify banking decisions by presenting verified, audited information in an intuitive, transparent, and easy-to-understand format.
            </p>
          </div>
        </div>

        <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-slate-700 shadow-soft space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#EFF6FF] dark:bg-slate-800 border border-[#2563EB]/20 flex items-center justify-center text-[#2563EB]">
                <HelpCircle className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-bold text-[#1F2937] dark:text-white tracking-tight">
                Why D.CARD Was Created
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#6B7280] dark:text-slate-300 leading-relaxed font-normal">
              Millions of Indians open bank accounts without fully understanding the debit card attached to their account. Unannounced quarterly charges, minimum balance penalties, and hidden foreign exchange markups quietly drain balances.
            </p>
            <p className="text-xs sm:text-sm text-[#6B7280] dark:text-slate-300 leading-relaxed font-normal">
              D.CARD was created to solve this problem by aggregating and structuring complex bank fee schedules into clear side-by-side comparisons and smart filters.
            </p>
          </div>
        </div>
      </section>

      {/* ── 3. WHAT WE OFFER ── */}
      <section className="space-y-8">
        <div>
          <span className="text-xs font-semibold text-[#2563EB] dark:text-[#60A5FA] tracking-widest uppercase block mb-1">
            CORE PLATFORM SERVICES
          </span>
          <h2 className="text-3xl font-bold text-[#1F2937] dark:text-white tracking-tight">
            What We Offer
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {whatWeOffer.map((item, idx) => {
            const IconComp = item.icon;
            return (
              <motion.div
                key={idx}
                whileHover={{ y: -4 }}
                className="p-6 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-slate-700 shadow-soft flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#EFF6FF] dark:bg-slate-800 border border-[#2563EB]/20 flex items-center justify-center text-[#2563EB] dark:text-[#60A5FA]">
                    <IconComp className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-[#1F2937] dark:text-white">{item.title}</h3>
                  <p className="text-xs text-[#6B7280] dark:text-slate-400 leading-relaxed font-normal">{item.desc}</p>
                </div>

                <button
                  onClick={() => navigate(item.actionPath)}
                  className="w-full py-2 px-3 rounded-xl bg-[#EFF6FF] dark:bg-slate-800 hover:bg-[#2563EB] hover:text-white text-[#2563EB] dark:text-[#60A5FA] text-xs font-bold transition-all cursor-pointer text-center"
                >
                  {item.actionText} →
                </button>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ── 4. MISSION & VISION GRID ── */}
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
              To simplify banking decisions by providing transparent, accurate, and AI-powered savings account and debit card comparisons that help every user choose the right financial product with confidence.
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
              To become India's most trusted independent savings account and debit card comparison platform by making financial information accessible, transparent, and easy to understand for everyone.
            </p>
          </div>
          <div className="pt-4 border-t border-[#E5E7EB] dark:border-slate-700 text-xs font-semibold text-[#2563EB] dark:text-[#60A5FA] uppercase tracking-wider">
            Trusted • Accessible • Transparent
          </div>
        </motion.div>
      </section>

      {/* ── 5. CORE VALUES ── */}
      <section className="space-y-8">
        <div>
          <span className="text-xs font-semibold text-[#2563EB] dark:text-[#60A5FA] tracking-widest uppercase block mb-1">
            GUIDING PRINCIPLES
          </span>
          <h2 className="text-3xl font-bold text-[#1F2937] dark:text-white tracking-tight">
            Core Values
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
            WHY D.CARD
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

      {/* ── 7. MEET THE FOUNDERS SECTION ── */}
      <section id="founders" className="space-y-10 scroll-mt-24 pt-4 border-t border-[#E5E7EB] dark:border-slate-800">
        <div>
          <span className="text-xs font-semibold text-[#2563EB] dark:text-[#60A5FA] tracking-widest uppercase block mb-1">
            EXECUTIVE LEADERSHIP
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1F2937] dark:text-white tracking-tight">
            Meet the Founders & Team
          </h2>
          <p className="text-sm sm:text-base text-[#6B7280] dark:text-slate-300 mt-2 max-w-3xl font-normal leading-relaxed">
            The passionate founders, engineers, and strategists building India's next-generation AI savings account and debit card discovery platform.
          </p>
        </div>

        {/* Founder Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                    <h3 className="text-xl sm:text-2xl font-bold text-[#1F2937] dark:text-white leading-tight">
                      {person.name}
                    </h3>
                    <p className="text-xs font-semibold text-[#6B7280] dark:text-slate-300">
                      {person.title}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-[#1F2937] dark:text-white uppercase tracking-wider">
                    Professional Profile
                  </h4>
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
                <h4 className="text-xs font-bold text-[#1F2937] dark:text-white uppercase tracking-wider">
                  Key Responsibilities
                </h4>
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
        </div>

        {/* Founder Message Section */}
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-[#EFF6FF] to-white dark:from-slate-800 dark:to-[#1E293B] border border-[#2563EB]/30 shadow-soft space-y-6 text-center sm:text-left relative overflow-hidden">
          <Quote className="w-16 h-16 text-[#2563EB]/15 absolute right-6 top-6 pointer-events-none" />
          <div className="flex items-center gap-3 justify-center sm:justify-start">
            <div className="w-10 h-10 rounded-2xl bg-[#2563EB] text-white flex items-center justify-center shadow-md">
              <Quote className="w-5 h-5" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-[#1F2937] dark:text-white tracking-tight">
              Founder Message
            </h3>
          </div>

          <blockquote className="text-base sm:text-lg text-[#1F2937] dark:text-white font-semibold leading-relaxed max-w-3xl italic">
            "At D.CARD, our goal is to simplify banking decisions through transparency, technology, and trust. We believe every user deserves clear and unbiased financial information."
          </blockquote>

          <div className="pt-2 border-t border-[#2563EB]/20 max-w-xs">
            <p className="text-sm font-bold text-[#1F2937] dark:text-white">Ritik Raj</p>
            <p className="text-xs text-[#2563EB] dark:text-[#60A5FA] font-semibold">Founder & CEO, D.CARD</p>
          </div>
        </div>

        {/* Leadership Philosophy */}
        <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-slate-700 shadow-soft space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#EFF6FF] dark:bg-slate-800 border border-[#2563EB]/20 flex items-center justify-center text-[#2563EB]">
              <Lightbulb className="w-5 h-5" />
            </div>
            <h3 className="text-2xl font-bold text-[#1F2937] dark:text-white tracking-tight">
              Our Leadership Philosophy
            </h3>
          </div>
          <p className="text-sm sm:text-base text-[#1F2937] dark:text-slate-200 leading-relaxed font-normal">
            At D.CARD, our founders firmly believe that breakthrough innovation in financial technology begins with radical transparency and unyielding consumer trust.
          </p>
          <p className="text-xs sm:text-sm text-[#6B7280] dark:text-slate-300 leading-relaxed font-normal">
            By eliminating corporate bias and prioritizing user needs above short-term profit models, our leadership team ensures that every feature, comparison matrix, and AI recommendation is designed to build India's best independent savings account and debit card discovery platform.
          </p>
        </div>

        {/* Why Leadership Matters Grid */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-[#1F2937] dark:text-white">
            Why Our Leadership Matters
          </h3>
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
                  <h4 className="text-base font-bold text-[#1F2937] dark:text-white">{item.title}</h4>
                  <p className="text-xs text-[#6B7280] dark:text-slate-400 leading-relaxed font-normal">{item.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 8. COMPANY JOURNEY TIMELINE ── */}
      <section className="space-y-8">
        <div>
          <span className="text-xs font-semibold text-[#2563EB] dark:text-[#60A5FA] tracking-widest uppercase block mb-1">
            EVOLUTION
          </span>
          <h2 className="text-3xl font-bold text-[#1F2937] dark:text-white tracking-tight">
            Company Journey Timeline
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

      {/* ── 9. FUTURE ROADMAP ── */}
      <section className="space-y-8">
        <div>
          <span className="text-xs font-semibold text-[#2563EB] dark:text-[#60A5FA] tracking-widest uppercase block mb-1">
            WHAT'S NEXT
          </span>
          <h2 className="text-3xl font-bold text-[#1F2937] dark:text-white tracking-tight">
            Future Roadmap
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {futureRoadmap.map((item, idx) => {
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

      {/* ── 10. WEBSITE DISCLAIMER ── */}
      <section className="p-6 sm:p-8 rounded-3xl bg-[#EFF6FF] dark:bg-slate-800/80 border border-[#2563EB]/30 shadow-soft space-y-3">
        <div className="flex items-center gap-2.5 text-[#2563EB] dark:text-[#60A5FA]">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <h3 className="text-sm font-bold uppercase tracking-wider">Website Disclaimer</h3>
        </div>
        <p className="text-xs sm:text-sm text-[#1F2937] dark:text-slate-200 leading-relaxed font-normal italic">
          "D.CARD is an independent financial information and comparison platform for Savings Accounts, Current Accounts, and Debit Cards. D.CARD is not a bank, NBFC, financial institution, payment system operator, or representative of any bank unless explicitly stated. Information shown is for comparison and informational purposes only. Savings Account, Current Account, and Debit Card features, fees, charges, eligibility, limits, and benefits may change. Please verify the latest details with the respective bank before making a decision."
        </p>
        <p className="text-xs text-[#6B7280] dark:text-slate-400 font-medium pt-1">
          Have questions or feedback? Contact us at{' '}
          <a href="mailto:dcard.website@gmail.com" className="font-bold text-[#2563EB] dark:text-[#60A5FA] hover:underline break-all">
            dcard.website@gmail.com
          </a>
        </p>
      </section>

      {/* ── 11. CTA ── */}
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
