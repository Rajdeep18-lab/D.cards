import { useState } from 'react';
import { motion } from 'framer-motion';
import { useToast } from '../context/ToastContext';

const LEADERSHIP_MEMBERS = [
  {
    name: "Ritik Raj",
    title: "Founder",
    roleTag: "Founding Executive",
    initials: "RR",
    gradient: "from-pink-500 to-rose-600",
    avatarBg: "linear-gradient(135deg, #A30D62 0%, #C21875 100%)",
    bio: "Visionary founder spearheading D.Card's core mission to bring radical transparency, hidden-charge disclosures, and algorithmic debit card optimization to millions across India.",
    highlights: ["Product Vision", "Banking Strategy", "Capital Markets"],
    linkedin: "#",
    email: "ritik@dcard.in"
  },
  {
    name: "Rajdeep",
    title: "Co-Founder",
    roleTag: "Executive Leadership",
    initials: "RD",
    gradient: "from-purple-500 to-indigo-600",
    avatarBg: "linear-gradient(135deg, #7A0F52 0%, #A30D62 100%)",
    bio: "Strategic co-founder leading business development, banking network partnerships, and market expansion to cement D.Card as India's premier debit card discovery platform.",
    highlights: ["Banking Alliances", "Growth Operations", "Strategic Expansion"],
    linkedin: "#",
    email: "rajdeep@dcard.in"
  },
  {
    name: "Kaushik Kumar Srivastava",
    title: "Chief Technology Officer (CTO)",
    roleTag: "Engineering & Technology",
    initials: "KS",
    gradient: "from-amber-500 to-pink-600",
    avatarBg: "linear-gradient(135deg, #C21875 0%, #E0629A 100%)",
    bio: "Technical architect leading the engineering organization, designing D.Card's real-time comparison engine, data pipelines, cloud infrastructure, and bank-grade security protocols.",
    highlights: ["System Architecture", "Security Infrastructure", "AI & Analytics"],
    linkedin: "#",
    email: "kaushik@dcard.in"
  },
  {
    name: "Bipanshu Dubey",
    title: "Chief Marketing Officer (CMO)",
    roleTag: "Marketing & Growth",
    initials: "BD",
    gradient: "from-rose-500 to-pink-600",
    avatarBg: "linear-gradient(135deg, #A30D62 0%, #D81B60 100%)",
    bio: "Leads overall marketing strategy, digital branding, customer acquisition, partner campaigns, and brand awareness to ensure consistent brand identity across all platforms.",
    highlights: ["Marketing Strategy", "Digital Branding", "Customer Acquisition", "Brand Partnerships"],
    linkedin: "#",
    email: "bipanshu@dcard.in"
  }
];

const OFFICE_ADDRESS = {
  building: "5th Floor, Yashoban Tower",
  landmark1: "Above Srileathers",
  landmark2: "Near IDBI Bank",
  area: "Saraidhela",
  city: "Dhanbad",
  statePin: "Jharkhand – 828127",
  fullSingleLine: "5th Floor, Yashoban Tower, Above Srileathers, Near IDBI Bank, Saraidhela, Dhanbad, Jharkhand – 828127",
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=5th+Floor,+Yashoban+Tower,+Above+Srileathers,+Near+IDBI+Bank,+Saraidhela,+Dhanbad,+Jharkhand+828127"
};

function LeadershipSection() {
  const toast = useToast();
  const [copied, setCopied] = useState(false);

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(OFFICE_ADDRESS.fullSingleLine);
    setCopied(true);
    toast("Corporate office address copied to clipboard! 📋", "success");
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <section id="leadership" className="my-16 select-none scroll-mt-24">
      {/* Section Header */}
      <div className="text-center mb-12">
        <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-secondary/10 dark:bg-secondary/20 text-secondary dark:text-roseGold text-xs font-black tracking-widest uppercase rounded-full border border-secondary/20 shadow-sm">
          🏆 COMPANY PROFILE & EXECUTIVE LEADERSHIP
        </span>
        <h2 className="text-3xl sm:text-4xl font-black font-serif text-[#1E0B16] dark:text-[#F5D9E8] tracking-tight mt-3">
          Meet Our Leadership Team
        </h2>
        <p className="text-sm sm:text-base text-textSoft dark:text-slate-300 mt-2 max-w-2xl mx-mx-auto leading-relaxed font-medium">
          D.Card is driven by an ambitious team of technology and banking leaders building India's most transparent debit card discovery platform.
        </p>
      </div>

      {/* Leadership Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-6 mb-16">
        {LEADERSHIP_MEMBERS.map((member, idx) => (
          <motion.div
            key={member.name}
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: idx * 0.12 }}
            whileHover={{ y: -8, scale: 1.02 }}
            className="group relative rounded-3xl p-6 sm:p-7 backdrop-blur-xl bg-white/60 dark:bg-[#0d0714]/80 border border-slate-200/80 dark:border-secondary/25 shadow-soft hover:shadow-[0_20px_50px_rgba(194,24,117,0.2)] transition-all duration-300 flex flex-col justify-between text-left overflow-hidden"
          >
            {/* Ambient Background Glow on Hover */}
            <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-secondary/15 dark:bg-secondary/25 blur-3xl group-hover:scale-150 transition-transform duration-500 pointer-events-none" />

            <div>
              {/* Card Top: Avatar & Role Tag */}
              <div className="flex items-start justify-between gap-4 mb-5">
                <div className="relative">
                  {/* Avatar Container */}
                  <div
                    className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl flex items-center justify-center text-white font-serif font-black text-xl shadow-lg group-hover:scale-105 transition-transform duration-300 border-2 border-white/20"
                    style={{ background: member.avatarBg }}
                  >
                    {member.initials}
                  </div>
                  <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white dark:border-[#0d0714] flex items-center justify-center text-[10px] text-white font-bold" title="Verified Founder">
                    ✓
                  </span>
                </div>

                <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-secondary/10 dark:bg-secondary/20 text-secondary dark:text-roseGold border border-secondary/20">
                  {member.roleTag}
                </span>
              </div>

              {/* Member Details */}
              <h3 className="text-xl font-black font-serif text-[#1E0B16] dark:text-[#F5D9E8] group-hover:text-secondary dark:group-hover:text-roseGold transition-colors tracking-tight">
                {member.name}
              </h3>
              <p className="text-xs font-bold text-secondary dark:text-roseGold uppercase tracking-widest mt-0.5">
                {member.title}
              </p>

              <p className="text-xs sm:text-sm text-textSoft dark:text-slate-300 leading-relaxed mt-3.5 font-medium">
                {member.bio}
              </p>
            </div>

            {/* Skill / Focus Badges & Contact Footer */}
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-secondary/15">
              <div className="flex flex-wrap gap-1.5 mb-3">
                {member.highlights.map(h => (
                  <span key={h} className="text-[10px] font-bold px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-secondary/10 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-secondary/20">
                    #{h}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between text-xs text-textMuted dark:text-slate-400 font-semibold pt-1">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Active Executive
                </span>
                <a
                  href={`mailto:${member.email}`}
                  className="hover:text-secondary dark:hover:text-roseGold transition-colors font-bold text-secondary dark:text-roseGold"
                >
                  {member.email} ↗
                </a>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Corporate Office Card Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="rounded-3xl p-6 sm:p-8 md:p-10 backdrop-blur-xl bg-gradient-to-br from-white/80 via-white/50 to-secondary/5 dark:from-[#12081a]/90 dark:via-[#09030d]/90 dark:to-[#1a091d]/90 border border-secondary/20 shadow-[0_15px_40px_rgba(194,24,117,0.12)] text-left relative overflow-hidden"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Address Text Info */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#A30D62] to-[#C21875] text-white flex items-center justify-center text-2xl shadow-md shadow-secondary/30 flex-shrink-0">
                📍
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-secondary dark:text-roseGold">
                  HEADQUARTERS & REGISTERED LOCATION
                </span>
                <h3 className="text-2xl font-black font-serif text-[#1E0B16] dark:text-[#F5D9E8] tracking-tight">
                  Corporate Office
                </h3>
              </div>
            </div>

            {/* Formatted Address Box */}
            <div className="p-5 rounded-2xl bg-white/70 dark:bg-black/40 border border-secondary/15 font-sans space-y-1 shadow-inner">
              <p className="text-base font-black text-slate-900 dark:text-white">
                {OFFICE_ADDRESS.building}
              </p>
              <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
                {OFFICE_ADDRESS.landmark1}
              </p>
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                {OFFICE_ADDRESS.landmark2}
              </p>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                {OFFICE_ADDRESS.area}, {OFFICE_ADDRESS.city}
              </p>
              <p className="text-sm font-black text-secondary dark:text-roseGold pt-1">
                {OFFICE_ADDRESS.statePin}
              </p>
            </div>

            <p className="text-xs text-textSoft dark:text-slate-400 leading-relaxed font-medium">
              💡 Visitor appointments and corporate inquiry meetings require prior authorization through support@dcard.in.
            </p>
          </div>

          {/* Location Action Panel */}
          <div className="lg:col-span-5 flex flex-col justify-center gap-3 p-6 rounded-2xl bg-secondary/5 dark:bg-secondary/10 border border-secondary/20 text-center lg:text-left">
            <h4 className="text-sm font-black text-slate-900 dark:text-slate-100 font-serif">
              Corporate Office Coordinates
            </h4>
            <p className="text-xs text-textSoft dark:text-slate-300 leading-relaxed font-medium">
              Located in Saraidhela, Dhanbad — India's banking hub connecting premier standards.
            </p>

            <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 mt-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCopyAddress}
                className="w-full py-3 px-4 rounded-xl text-xs font-black border border-secondary/30 bg-white dark:bg-black/50 text-secondary dark:text-roseGold hover:bg-secondary/10 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <span>{copied ? '✓' : '📋'}</span>
                <span>{copied ? 'Address Copied!' : 'Copy Office Address'}</span>
              </motion.button>

              <motion.a
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                href={OFFICE_ADDRESS.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-xl text-xs font-black text-white bg-gradient-to-r from-[#A30D62] to-[#C21875] shadow-md shadow-secondary/25 hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer text-center"
              >
                <span>🗺️</span>
                <span>Open in Google Maps</span>
              </motion.a>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

export default LeadershipSection;
