import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, Scale, ShieldCheck, CreditCard } from 'lucide-react';
import DiyaIllustration from './DiyaIllustration';
import { FESTIVE_CONFIG } from '../../config/festiveConfig';
import { useLanguage } from '../../context/LanguageContext';

/**
 * Diwali & Dhanteras Promotional Campaign Banners
 * D.CARD's internal promotional campaigns celebrating mindful, informed financial choices.
 * Fully configurable, responsive across all viewports, zero third-party/fake advertisements.
 */
export default function DiwaliCampaignBanners() {
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();
  const { isHindi } = useLanguage();
  const campaigns = FESTIVE_CONFIG.diwaliCampaigns;

  if (!FESTIVE_CONFIG.diwaliCampaignBannersEnabled || !FESTIVE_CONFIG.isFestiveEnabled) {
    return null;
  }

  return (
    <section 
      id="festive-campaigns"
      aria-label="Festive Banking Campaigns"
      className="relative z-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16 select-none"
    >
      <div className="space-y-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2.5">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-amber-500/10 text-amber-700 dark:text-amber-300 text-xs font-bold tracking-widest uppercase rounded-full border border-amber-500/25">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            {isHindi ? 'दीपावली विशेष अभियान' : 'DIWALI PROMOTIONAL SHOWCASE'}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1F2937] dark:text-white tracking-tight">
            {isHindi ? 'रोशनी और समृद्धि के इस पर्व पर' : 'Illuminate Your Financial Choices'}
          </h2>
          <p className="text-xs sm:text-sm text-[#6B7280] dark:text-slate-400 font-normal">
            {isHindi 
              ? 'D.CARD के स्वतंत्र डेटा और सटीक तुलना के साथ अपने लिए सबसे उपयुक्त बैंकिंग उत्पाद चुनें।'
              : 'Discover transparent banking products backed by D.CARD’s independent information oversight.'}
          </p>
        </div>

        {/* 3 Campaign Banners Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
          {campaigns.map((camp, idx) => {
            const headline = isHindi ? camp.headlineHi : camp.headline;
            const subtext = isHindi ? camp.subtextHi : camp.subtext;
            const tag = isHindi ? camp.tagHi : camp.tag;
            const cta = isHindi ? camp.ctaLabelHi : camp.ctaLabel;

            return (
              <motion.div
                key={camp.id}
                whileHover={!shouldReduceMotion ? { y: -6, scale: 1.01 } : {}}
                transition={{ type: "spring", stiffness: 350, damping: 25 }}
                onClick={() => navigate(camp.ctaPath)}
                className={`relative rounded-3xl p-6 sm:p-8 bg-gradient-to-b from-[#1E293B] to-[#0F172A] text-white border ${camp.borderColor} shadow-lg hover:shadow-[0_20px_40px_rgba(245,158,11,0.15)] transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-6 overflow-hidden group`}
              >
                {/* Ambient Top Glow */}
                <div className={`absolute top-0 right-0 w-44 h-44 bg-gradient-to-br ${camp.accentColor} rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-500`} />

                {/* Card Top: Tag + Micro-Diya */}
                <div className="relative z-10 space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-[10px] font-extrabold uppercase tracking-wider border border-amber-400/30 backdrop-blur-sm">
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      {tag}
                    </span>
                    <DiyaIllustration size={32} glow={false} animate={true} />
                  </div>

                  {/* Headline & Description */}
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black text-white leading-snug group-hover:text-amber-200 transition-colors">
                      {headline}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal mt-2.5">
                      {subtext}
                    </p>
                  </div>
                </div>

                {/* Card Bottom: CTA Button */}
                <div className="relative z-10 pt-4 border-t border-slate-700/60 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-amber-400/80 tracking-wide uppercase">
                    D.CARD Independent
                  </span>
                  <div className="inline-flex items-center gap-1.5 text-xs font-black text-amber-300 group-hover:text-white transition-colors">
                    <span>{cta}</span>
                    <ArrowRight className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

