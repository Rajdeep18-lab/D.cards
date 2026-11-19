import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, ShieldCheck, CheckCircle2, Award, Zap } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useFestivalTheme } from '../../hooks/useFestivalTheme';
import DhanterasHeroCampaign from './DhanterasHeroCampaign';
import {
  HoliSplashMotif,
  ChristmasSnowflakeMotif,
  EidCrescentMotif,
  GurpurabHaloMotif,
  LohriBonfireMotif,
  IndependenceChakraMotif,
  JanmashtamiPeacockMotif,
  NavratriGarbaMotif,
  DussehraArrowMotif,
  NewYearSparkleMotif,
  GaneshLotusMotif,
  RakhiThreadMotif
} from './FestivalMotifWatermarks';

/**
 * FestivalCampaignSection
 * 
 * Art-directed festival experience hub:
 * - In Normal Mode: returns null (completely disappears).
 * - In Diwali Mode: renders the rich DhanterasHeroCampaign.
 * - In Other Festivals: renders an immersive, culturally curated banking experience hub
 *   with tailored banking recommendations, cultural iconography, and responsive CTAs.
 */
export default function FestivalCampaignSection() {
  const { isFestivalMode, activeFestival, theme } = useFestivalTheme();
  const { language } = useLanguage();
  const isHindi = language === 'hi';
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();

  // If Normal Mode, render nothing
  if (!isFestivalMode || !activeFestival) {
    return null;
  }

  // If Diwali, use the rich Dhanteras/Diwali campaign
  if (activeFestival.id === 'diwali') {
    return <DhanterasHeroCampaign />;
  }

  const festivalId = activeFestival.id;

  const greeting = isHindi 
    ? (activeFestival.greetingHi || activeFestival.nameHi) 
    : (activeFestival.greetingEn || activeFestival.nameEn);

  const subtext = isHindi 
    ? (activeFestival.subtextHi || '') 
    : (activeFestival.subtextEn || '');

  const badgeText = isHindi 
    ? (activeFestival.badgeLabelHi || activeFestival.nameHi) 
    : (activeFestival.badgeLabelEn || activeFestival.nameEn);

  const ctaLabel = isHindi 
    ? (activeFestival.ctaLabelHi || 'कार्ड्स एक्सप्लोर करें') 
    : (activeFestival.ctaLabelEn || 'Explore Featured Cards');

  const handleCtaClick = () => {
    navigate(activeFestival.ctaPath || '/cards');
  };

  // Curated festive banking intelligence
  const getFestivalPerks = () => {
    switch (festivalId) {
      case 'holi':
        return isHindi 
          ? ['🎨 ई-कॉमर्स पर 10% तक कैशबैक', '🛍️ उत्सव डाइनिंग व होटल छूट', '💳 त्वरित वर्चुअल कार्ड जारी']
          : ['🎨 Up to 10% E-Commerce Cashback', '🛍️ Festive Dining Privileges', '💳 Instant Virtual Card Issuance'];
      case 'christmas':
        return isHindi
          ? ['✈️ अंतरराष्ट्रीय यात्रा बीमा', '❄️ विदेशी खर्च पर 0% फॉरेक्स मार्कअप', '🎁 हॉलिडे शॉपिंग रिवॉर्ड्स']
          : ['✈️ International Travel Insurance', '❄️ 0% Forex Markup on Foreign Spends', '🎁 Holiday Shopping Rewards'];
      case 'eid':
        return isHindi
          ? ['🌙 शून्य बैलेंस बचत खाते', '🕌 पारदर्शी शुल्क संरचना', '✨ निःशुल्क कॉन्टैक्टलेस कार्ड']
          : ['🌙 Zero-Balance Savings Accounts', '🕌 Transparent Fee Structure', '✨ Free Contactless Debit Card'];
      case 'independence_day':
      case 'republic_day':
        return isHindi
          ? ['🇮🇳 सॉवरेन जमा सुरक्षा', '🛡️ RBI विनियमित पूर्ण पारदर्शिता', '🏛️ 100% निष्पक्ष बैंक डेटा']
          : ['🇮🇳 Sovereign Deposit Safety', '🛡️ RBI Regulated Transparency', '🏛️ 100% Unbiased Public Sector Data'];
      case 'gurpurab':
        return isHindi
          ? ['ੴ पूर्ण पारदर्शी बैंकिंग डेटा', '🌱 जन-कल्याण बचत खाते', '⚖️ शून्य गुप्त शुल्क']
          : ['ੴ Honest Tariff Transparency', '🌱 Community Welfare Accounts', '⚖️ Zero Hidden Penalties'];
      case 'navratri':
        return isHindi
          ? ['🌸 रिटेल खरीदारी पर विशेष कैशबैक', '💃 डाइनिंग व उत्सव लाभ', '💳 आसान माइलस्टोन रिवॉर्ड्स']
          : ['🌸 Festive Retail Cashback', '💃 Dining & Entertainment Perks', '💳 Easy Milestone Rewards'];
      case 'lohri':
        return isHindi
          ? ['🪁 उच्च ब्याज बचत खाते', '🌾 कम वार्षिक रखरखाव शुल्क', '🔥 सुदृढ़ वित्तीय सुरक्षा']
          : ['🪁 High-Yield Harvest Savings', '🌾 Low Maintenance Charges', '🔥 Warm Financial Security'];
      default:
        return isHindi
          ? ['✨ सत्यापित बैंक दरें', '🛡️ शून्य कमीशन रेटिंग', '🔍 पारदर्शी तुलना']
          : ['✨ Verified Bank Tariffs', '🛡️ Zero Commission Rating', '🔍 Transparent Comparison'];
    }
  };

  // Background cultural motif watermark
  const renderBackgroundWatermark = () => {
    switch (festivalId) {
      case 'holi':
        return <HoliSplashMotif className="absolute -right-12 -bottom-16 scale-125" opacity={0.22} />;
      case 'christmas':
        return <ChristmasSnowflakeMotif className="absolute right-4 -top-8 scale-110" opacity={0.22} />;
      case 'eid':
        return <EidCrescentMotif className="absolute right-6 -top-10 scale-110" opacity={0.24} />;
      case 'gurpurab':
        return <GurpurabHaloMotif className="absolute right-4 -top-8 scale-110" opacity={0.24} />;
      case 'lohri':
        return <LohriBonfireMotif className="absolute right-8 bottom-0 scale-110" opacity={0.24} />;
      case 'independence_day':
      case 'republic_day':
        return <IndependenceChakraMotif className="absolute right-6 -top-8 scale-105" opacity={0.22} />;
      case 'janmashtami':
        return <JanmashtamiPeacockMotif className="absolute right-4 -top-6 scale-110" opacity={0.24} />;
      case 'navratri':
        return <NavratriGarbaMotif className="absolute right-6 -top-8 scale-105" opacity={0.22} />;
      case 'dussehra':
        return <DussehraArrowMotif className="absolute right-4 -top-6 scale-110" opacity={0.24} />;
      case 'new_year':
        return <NewYearSparkleMotif className="absolute right-6 -top-8 scale-115" opacity={0.24} />;
      case 'ganesh_chaturthi':
        return <GaneshLotusMotif className="absolute right-6 -top-8 scale-110" opacity={0.24} />;
      case 'raksha_bandhan':
        return <RakhiThreadMotif className="absolute right-4 -top-6 scale-105" opacity={0.24} />;
      default:
        return null;
    }
  };

  const perks = getFestivalPerks();

  return (
    <section 
      id="festival-campaign"
      aria-label={`${activeFestival.nameEn} Special Campaign`}
      className="relative z-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-4 sm:mt-6 select-none"
    >
      <div 
        className="relative rounded-3xl overflow-hidden border shadow-2xl text-white transition-all duration-700"
        style={{
          background: `linear-gradient(135deg, ${theme?.primaryColor || '#1E1B4B'} 0%, #0F172A 65%, #020617 100%)`,
          borderColor: theme?.accentColor ? `${theme.accentColor}50` : 'rgba(255, 255, 255, 0.2)'
        }}
      >
        {/* Subtle Ambient Radial Lighting Blooms */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div 
            className="absolute -top-28 -left-28 w-[420px] h-[420px] rounded-full blur-3xl opacity-35"
            style={{ background: theme?.accentColor || '#159B72' }}
          />
          <div 
            className="absolute -bottom-28 -right-28 w-[420px] h-[420px] rounded-full blur-3xl opacity-30"
            style={{ background: theme?.highlightColor || theme?.secondaryColor || '#8B5CF6' }}
          />
          {renderBackgroundWatermark()}
        </div>

        {/* Content Container */}
        <div className="relative z-10 px-6 py-8 sm:px-10 sm:py-10 lg:px-12 lg:py-12 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          
          {/* Left Text Column */}
          <div className="max-w-2xl space-y-4">
            
            {/* Festival Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md bg-white/10 border border-white/20 shadow-sm">
              <span className="text-base">{activeFestival.badgeIcon || '✨'}</span>
              <span style={{ color: theme?.accentColor || '#FDE047' }}>{badgeText}</span>
              <span className="text-[10px] text-white/60 font-mono">• {isHindi ? 'सत्यापित बैंकिंग गाइड' : 'FESTIVE BANKING'}</span>
            </div>

            {/* Main Greeting */}
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white leading-tight">
              {greeting}
            </h2>

            {/* Subtext */}
            {subtext && (
              <p className="text-sm sm:text-base text-slate-200/90 leading-relaxed font-normal">
                {subtext}
              </p>
            )}

            {/* Curated Festive Banking Perks (Interactive feature row) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
              {perks.map((perk, idx) => (
                <div 
                  key={idx}
                  className="px-3 py-2 rounded-xl backdrop-blur-md bg-white/10 border border-white/15 text-xs text-white/95 font-medium flex items-center gap-2 shadow-xs"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="truncate">{perk}</span>
                </div>
              ))}
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-slate-300">
              <span className="inline-flex items-center gap-1.5 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                100% Unbiased Bank Tariffs
              </span>
              <span className="inline-flex items-center gap-1.5 font-medium">
                <Award className="w-4 h-4 text-amber-300 shrink-0" />
                Zero Commission Ranking
              </span>
            </div>
          </div>

          {/* Right Action Column: Cultural Medallion & CTA */}
          <div className="shrink-0 flex flex-col items-center sm:items-start lg:items-center gap-4 bg-white/5 border border-white/10 p-5 rounded-2xl backdrop-blur-md">
            {/* Medallion Display */}
            <div 
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-lg border"
              style={{
                background: `linear-gradient(135deg, ${theme?.primaryColor || '#1E1B4B'}, ${theme?.secondaryColor || '#D97706'})`,
                borderColor: theme?.accentColor ? `${theme.accentColor}66` : 'rgba(255,255,255,0.3)'
              }}
            >
              {activeFestival.badgeIcon || '✨'}
            </div>

            <div className="text-center">
              <div className="text-xs font-bold text-white uppercase tracking-wider">
                {activeFestival.nameEn}
              </div>
              <div className="text-[11px] text-slate-300">
                {isHindi ? 'विशेष बैंकिंग प्रस्ताव' : 'Featured Festive Selection'}
              </div>
            </div>

            <button
              onClick={handleCtaClick}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-xs tracking-wider uppercase shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95 text-white"
              style={{
                background: `linear-gradient(135deg, ${theme?.secondaryColor || '#800020'}, ${theme?.accentColor || '#D97706'})`,
              }}
            >
              <span>{ctaLabel}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}
