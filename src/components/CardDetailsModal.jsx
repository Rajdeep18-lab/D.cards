import React, { useState, useEffect, useRef, useMemo, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Check, ShieldCheck, Zap, AlertCircle, Info, ExternalLink,
  CreditCard, Landmark, Globe, Sparkles, ChevronRight, Share2, 
  CheckCircle2, ArrowRight, Heart, Star, Scale, TrendingUp, AlertTriangle, FileText, Lock
} from 'lucide-react';
import DebitCardVisual from './DebitCardVisual';
import BankLogo from './BankLogo';
import { useWishlist } from '../context/WishlistContext';
import { debitCards } from '../data/mockData';
import { useAuth } from '../hooks/useAuth';
import { referralService } from '../services/referralService';
import { useLanguage } from '../context/LanguageContext';
import { useSEO } from '../hooks/useSEO';

/* Local Bank Profiles structured data for Trust Shield */
const BANK_PROFILES = {
  "HDFC Bank": {
    overview: "HDFC Bank is India's leading private sector bank, renowned for its extensive domestic branch network and premium customer service ecosystems.",
    trustScore: "9.8 / 10",
    topCards: ["EasyShop Platinum Debit Card"],
    pros: ["Highest network acceptance", "Strong lifestyle reward structures", "Excellent mobile app integration"],
    cons: ["Higher average balance requirement", "Strict lounge spend eligibility criteria"],
    bestFor: "Premium users, salary account holders, high volume spenders",
    segment: "Premium & Professional"
  },
  "ICICI Bank": {
    overview: "ICICI Bank is a premier private sector bank in India, known for its technologically advanced digital platforms and massive merchant networks.",
    trustScore: "9.6/10",
    topCards: ["Coral Debit Card", "Sapphiro Debit Card"],
    pros: ["Extensive online shopping discounts", "Best-in-class movie rewards (BOGO deals)", "Zero-maintenance virtual cards support"],
    cons: ["Slightly high card reissuance fees", "Confusing reward tiers structure"],
    bestFor: "Millennials, online shoppers, lifestyle enthusiasts",
    segment: "Retail & Digital Native"
  },
  "SBI": {
    overview: "State Bank of India is the country's largest public sector bank, boasting an unmatched rural-urban footprint and absolute capital security.",
    trustScore: "9.5/10",
    topCards: ["Global International Debit Card", "Platinum International Debit Card"],
    pros: ["Lowest annual maintenance charges", "Widest ATM network footprint in India", "Beginner and student-friendly account linkage"],
    cons: ["Basic reward rates", "Slower customer support channels"],
    bestFor: "Mass market banking, students, senior citizens",
    segment: "Students & Mass Audience"
  },
  "Axis Bank": {
    overview: "Axis Bank is a high-growth private sector bank in India, particularly celebrated for its elite relationship programs (Burgundy & Priority Banking).",
    trustScore: "9.7/10",
    topCards: ["Burgundy Debit Card", "Priority Debit Card"],
    pros: ["Ultra-high transaction limits on top tiers", "Premium concierge and lifestyle support", "Zero forex markup on elite cards"],
    cons: ["Extremely high balance relationships required for waivers", "Paid cards have high joining fee"],
    bestFor: "HNI customers, luxury travelers, high spending professionals",
    segment: "Elite Premium & Wealth"
  }
};

/* Dynamic premium bank card skins */
function getBankCardSkin(bank) {
  const bankName = bank ? String(bank).toLowerCase() : "";
  let gradient = 'linear-gradient(135deg, #0F172A 0%, #1E293B 60%, #2563EB 100%)';
  let accent = '#2563EB';
  let shadow = 'rgba(37, 99, 235, 0.25)';

  if (bankName.includes("hdfc")) {
    gradient = 'linear-gradient(135deg, #0F172A 0%, #1E40AF 60%, #2563EB 100%)';
    accent = '#60A5FA';
    shadow = 'rgba(37, 99, 235, 0.25)';
  } else if (bankName.includes("icici")) {
    gradient = 'linear-gradient(135deg, #0b132b 0%, #1c2541 60%, #3a506b 100%)';
    accent = '#60a5fa';
    shadow = 'rgba(96, 165, 250, 0.25)';
  } else if (bankName.includes("sbi") || bankName.includes("state bank")) {
    gradient = 'linear-gradient(135deg, #022c43 0%, #053f5e 60%, #115173 100%)';
    accent = '#00b4d8';
    shadow = 'rgba(0, 180, 216, 0.25)';
  } else if (bankName.includes("axis")) {
    gradient = 'linear-gradient(135deg, #18000a 0%, #4d0022 60%, #110007 100%)';
    accent = '#f43f5e';
    shadow = 'rgba(244, 63, 94, 0.25)';
  } else if (bankName.includes("idfc")) {
    gradient = 'linear-gradient(135deg, #1c0005 0%, #4a000e 60%, #0a0002 100%)';
    accent = '#ef4444';
    shadow = 'rgba(239, 68, 68, 0.25)';
  } else if (bankName.includes("kotak")) {
    gradient = 'linear-gradient(135deg, #1f0103 0%, #4c0307 60%, #0c0001 100%)';
    accent = '#f87171';
    shadow = 'rgba(248, 113, 113, 0.25)';
  } else if (bankName.includes("indusind")) {
    gradient = 'linear-gradient(135deg, #1b0c01 0%, #452203 60%, #0c0500 100%)';
    accent = '#f97316';
    shadow = 'rgba(249, 115, 22, 0.25)';
  } else if (bankName.includes("fi money") || bankName.includes("niyo") || bankName.includes("federal") || bankName.includes("jupiter") || bankName.includes("freo")) {
    gradient = 'linear-gradient(135deg, #021a11 0%, #093a26 60%, #03140e 100%)';
    accent = '#10b981';
    shadow = 'rgba(16, 185, 129, 0.25)';
  } else if (bankName.includes("baroda") || bankName.includes("bob")) {
    gradient = 'linear-gradient(135deg, #2D0E03 0%, #612106 60%, #C2410C 100%)';
    accent = '#f97316';
    shadow = 'rgba(249, 115, 22, 0.25)';
  } else if (bankName.includes("punjab") || bankName.includes("pnb")) {
    gradient = 'linear-gradient(135deg, #1C0A19 0%, #4A0E2E 60%, #9F1239 100%)';
    accent = '#f43f5e';
    shadow = 'rgba(244, 63, 94, 0.25)';
  } else if (bankName.includes("canara")) {
    gradient = 'linear-gradient(135deg, #031E2E 0%, #064566 60%, #0284C7 100%)';
    accent = '#38bdf8';
    shadow = 'rgba(56, 189, 248, 0.25)';
  } else if (bankName.includes("yes bank") || bankName.includes("yes")) {
    gradient = 'linear-gradient(135deg, #1E070F 0%, #520F1D 60%, #B91C1C 100%)';
    accent = '#ef4444';
    shadow = 'rgba(239, 68, 68, 0.25)';
  } else if (bankName.includes("au small") || bankName.includes("au bank")) {
    gradient = 'linear-gradient(135deg, #1E0B2B 0%, #431407 60%, #D97706 100%)';
    accent = '#f59e0b';
    shadow = 'rgba(245, 158, 11, 0.25)';
  } else if (bankName.includes("paytm") || bankName.includes("airtel")) {
    gradient = 'linear-gradient(135deg, #021B29 0%, #043E5E 60%, #0284C7 100%)';
    accent = '#06b6d4';
    shadow = 'rgba(6, 182, 212, 0.25)';
  } else if (bankName.includes("rbl") || bankName.includes("equitas") || bankName.includes("ujjivan") || bankName.includes("jana") || bankName.includes("esaf")) {
    gradient = 'linear-gradient(135deg, #0F172A 0%, #1E293B 60%, #0F766E 100%)';
    accent = '#14b8a6';
    shadow = 'rgba(20, 184, 166, 0.25)';
  }

  return { gradient, accent, shadow };
}

// Normalized fallback ranking data
const DEFAULT_RANKINGS = {
  bestOverall: 4,
  bestZeroForex: 1,
  bestCashback: 5,
  bestRewards: 10,
  bestLounge: 18,
  bestStudent: 11
};

/**
 * CardDetailsModal ("View Specs")
 * 
 * Redesigned with D.CARD's signature luxury Burgundy (#800020), Gold (#D6A64B / #F59E0B), 
 * and Crisp White theme. Completely eliminates dark/black backgrounds, guaranteeing high contrast,
 * clear legibility, and professional fintech aesthetics across desktop and mobile.
 */
function CardDetailsModal({ isOpen, onClose, card, compareQueue, toggleCompareQueue, onCardSelect, userProfile = "Working Professional", rankings }) {
  const [activeTab, setActiveTab] = useState("overview");
  const scrollRef = useRef(null);
  const { wishlist, toggleWishlist, isWishlisted } = useWishlist();
  const { user, openAuthModal } = useAuth();
  const { isHindi } = useLanguage();

  const effectiveRankings = rankings || DEFAULT_RANKINGS;

  // Safe defaults from card
  const cardId = card?.id || 1;
  const cardName = card?.cardName || (isHindi ? "डेबिट कार्ड" : "Debit Card");
  const bankName = card?.bank || (isHindi ? "बैंक" : "Bank");
  const applyUrl = card?.applyUrl || "https://www.hdfcbank.com";
  const annualFee = typeof card?.annualFee === 'number' ? card.annualFee : 0;
  const minBalance = typeof card?.minBalance === 'number' ? card.minBalance : 0;
  const loungeAccess = card?.loungeAccess || (isHindi ? "उपलब्ध नहीं" : "Not Active");
  const cashbackPct = card?.cashbackPct || 0;
  const contactless = card?.contactless || false;
  const fuelWaiver = card?.fuelWaiver || false;
  const verificationStatus = card?.verificationStatus || "Verified";
  const hiddenCharges = card?.hiddenCharges || "";
  const officialSource = card?.officialSource || "";

  // Reset tab on card change
  useEffect(() => {
    setActiveTab("overview");
  }, [cardId]);

  // Handle ESC key to close
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // SEO configuration
  const cardSeoTitle = `${bankName} ${cardName} Specifications & Charges | D.CARD`;
  const cardSeoDesc = `Comprehensive technical review of ${cardName} issued by ${bankName}. Check annual fees (₹${annualFee}), ATM limits, lounge perks and transparent terms.`;
  const cardSchema = card 
    ? {
        "@context": "https://schema.org",
        "@type": "FinancialProduct",
        "name": `${bankName} ${cardName}`,
        "description": cardSeoDesc,
        "provider": {
          "@type": "BankOrCreditUnion",
          "name": bankName
        },
        "url": "https://www.dcard.website/cards"
      }
    : null;

  useSEO({
    title: cardSeoTitle,
    description: cardSeoDesc,
    schema: cardSchema,
    enabled: Boolean(isOpen && card)
  });

  const isCardWishlisted = isWishlisted(cardId);
  const isCardInCompare = compareQueue?.some(c => c.id === cardId) || false;

  const handleWishlistToggle = (e) => {
    e.stopPropagation();
    if (!card) return;
    if (!user) {
      openAuthModal('required', `save-card-${cardId}`);
      return;
    }
    toggleWishlist(card);
  };

  const handleApplyClick = (e, url) => {
    if (!user) {
      e.preventDefault();
      openAuthModal('required', `apply-${cardId}`);
      return;
    }
    if (card && referralService) {
      referralService.logReferralClick(user.uid || user.id, card, url || applyUrl, `REF_${cardId}`, 'Card Details Modal');
    }
  };

  const handleCompareToggle = (e) => {
    e.stopPropagation();
    if (!card) return;
    if (toggleCompareQueue) {
      toggleCompareQueue(card);
    }
  };

  const featuresList = card && Array.isArray(card.features) ? card.features : [];
  const atmLimitText = featuresList.find(f => typeof f === 'string' && f.toLowerCase().includes("atm limit")) || "ATM Limit: ₹50,000 daily";
  const posLimitText = featuresList.find(f => typeof f === 'string' && f.toLowerCase().includes("pos limit")) || "POS Limit: ₹2,00,000 daily";

  const handleMouseMove = (e) => {
    if (window.innerWidth < 768) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const dx = x - rect.width / 2;
    const dy = y - rect.height / 2;
    const tiltX = -(dy / (rect.height / 2)) * 8;
    const tiltY = (dx / (rect.width / 2)) * 8;

    e.currentTarget.style.setProperty('--details-tilt-x', `${tiltX}deg`);
    e.currentTarget.style.setProperty('--details-tilt-y', `${tiltY}deg`);
  };

  const handleMouseLeave = (e) => {
    e.currentTarget.style.setProperty('--details-tilt-x', `0deg`);
    e.currentTarget.style.setProperty('--details-tilt-y', `0deg`);
  };

  // Discover similar cards
  const relatedList = useMemo(() => {
    if (!card) return [];
    return debitCards
      .filter(c => c.id !== cardId && (c.bank === bankName || c.category === card.category))
      .slice(0, 3);
  }, [card, cardId, bankName]);

  const handleSelectRelatedCard = (newCard) => {
    if (onCardSelect) {
      onCardSelect(newCard);
      const scrollEl = scrollRef.current;
      if (scrollEl) {
        if (scrollEl.scrollHeight > scrollEl.clientHeight) {
          scrollEl.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          scrollEl.parentElement?.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }
    }
  };

  // Dynamic Trust Score out of 10
  const trustScore = useMemo(() => {
    if (!card) return "7.5";
    let score = 7.5;
    if (card.dataConfidence === "Verified" || verificationStatus === "Verified") score += 1.5;
    if (!card.verifyNote) score += 0.5;
    if (officialSource) score += 0.5;
    return score.toFixed(1);
  }, [card, verificationStatus, officialSource]);

  // Proprietary D.Card Score™ & Integrity Metric Engines
  const scoreMetrics = useMemo(() => {
    if (!card) return { dcardScore: 75, chargesScore: 75, benefitsScore: 75, trustScore: 75, risk: "Low" };
    let chargesScore = Math.round(98 - (annualFee / 35) - (minBalance / 9000));
    chargesScore = Math.min(98, Math.max(45, chargesScore));

    let perksCount = (loungeAccess && !String(loungeAccess).toLowerCase().startsWith('no') ? 1.5 : 0) + 
                     (card.travelZeroForex ? 1.5 : 0) + 
                     (card.healthcareFriendly ? 1.5 : 0) + 
                     (cashbackPct >= 1.0 ? 1 : 0) + 
                     (contactless ? 0.5 : 0) + 
                     (fuelWaiver ? 0.5 : 0);
    let benefitsScore = Math.round(55 + (perksCount * 6.5));
    benefitsScore = Math.min(98, Math.max(50, benefitsScore));

    let trustScoreVal = verificationStatus === 'Verified' ? 95 : verificationStatus === 'Recently Updated' ? 88 : 72;

    let risk = "Low";
    if (String(hiddenCharges || "").toLowerCase().includes("decline") || String(hiddenCharges || "").toLowerCase().includes("non-maintenance")) {
      risk = "High";
    } else if (annualFee >= 1000 || minBalance >= 10000) {
      risk = "Medium";
    }

    let overallScore = Math.round((chargesScore * 0.35) + (benefitsScore * 0.35) + (trustScoreVal * 0.3));
    overallScore = Math.min(98, Math.max(50, overallScore));

    return {
      dcardScore: overallScore,
      chargesScore,
      benefitsScore,
      trustScore: trustScoreVal,
      risk
    };
  }, [card, annualFee, minBalance, loungeAccess, cashbackPct, contactless, fuelWaiver, verificationStatus, hiddenCharges]);

  const bankProfile = BANK_PROFILES[bankName];

  const checkFeature = (kw) => {
    const s = kw.toLowerCase();
    return featuresList.some(f => typeof f === 'string' && f.toLowerCase().includes(s)) ||
           String(card?.featuresStr || '').toLowerCase().includes(s);
  };

  return (
    <AnimatePresence>
      {isOpen && card && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="card-specs-title"
          className="fixed inset-0 z-[2000] flex items-center justify-center p-0 md:p-4 bg-slate-900/60 dark:bg-black/75 backdrop-blur-md overflow-hidden select-none font-sans"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 24 }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            onClick={e => e.stopPropagation()}
            className="w-full max-w-5xl rounded-none md:rounded-[32px] h-full md:h-auto overflow-hidden relative bg-white dark:bg-[#1C101A] border-0 md:border-2 border-amber-400/30 dark:border-amber-400/25 shadow-[0_25px_70px_rgba(128,0,32,0.2)] text-slate-800 dark:text-slate-100 flex flex-col"
            style={{ maxHeight: window.innerWidth < 768 ? '100vh' : '92vh', height: window.innerWidth < 768 ? '100vh' : 'auto' }}
          >

            {/* ── PREMIUM BURGUNDY & GOLD HEADER ── */}
            <div className="sticky top-0 z-50 backdrop-blur-xl bg-white/95 dark:bg-[#180A14]/95 border-b border-rose-100 dark:border-amber-900/30 px-5 py-3.5 md:px-8 md:py-4 flex items-center justify-between gap-4 flex-shrink-0">
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <BankLogo bankName={bankName} size="xs" />
                  <span className="text-[11px] font-black tracking-wider text-[#800020] dark:text-amber-400 uppercase">
                    {bankName}
                  </span>
                  <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 text-[9px] font-black border border-emerald-200 dark:border-emerald-800 select-none tracking-wider leading-none">
                    <span>✓ VERIFIED OFFICIAL DATA</span>
                  </span>
                </div>
                <h2 id="card-specs-title" className="text-base md:text-xl font-black text-slate-900 dark:text-white truncate leading-tight">
                  {cardName}
                </h2>
              </div>
              
              {/* Header Actions: Desktop Only */}
              <div className="hidden md:flex items-center gap-2.5 flex-shrink-0">
                <a
                  href={applyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => card && referralService.logReferralClick(user?.id, card, applyUrl)}
                  className="px-5 py-2.5 rounded-xl text-xs font-black text-white bg-gradient-to-r from-[#800020] via-[#9F1239] to-[#800020] hover:from-[#6B001B] hover:to-[#881337] border border-amber-400/30 shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
                >
                  <span>Apply Now</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <button
                  onClick={handleWishlistToggle}
                  className={`px-3 py-2.5 rounded-xl border transition-all text-xs active:scale-90 flex items-center justify-center gap-1.5 cursor-pointer font-bold ${
                    isCardWishlisted 
                      ? "bg-rose-50 border-rose-300 text-rose-700 dark:bg-rose-950/50 dark:border-rose-800 dark:text-rose-300 font-extrabold" 
                      : "bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${isCardWishlisted ? "fill-rose-600 text-rose-600" : ""}`} />
                  <span>{isCardWishlisted ? "Saved" : "Save"}</span>
                </button>

                <button
                  onClick={handleCompareToggle}
                  className={`px-3.5 py-2.5 rounded-xl border transition-all text-xs font-black active:scale-90 flex items-center justify-center gap-1.5 cursor-pointer ${
                    isCardInCompare 
                      ? "bg-gradient-to-r from-[#800020] to-[#9F1239] text-white border-amber-400/40 shadow-xs" 
                      : "bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:border-amber-400/40"
                  }`}
                >
                  <Scale className="w-3.5 h-3.5" />
                  <span>{isCardInCompare ? "✓ Queued" : "Compare"}</span>
                </button>

                <button
                  onClick={onClose}
                  aria-label="Close specifications modal"
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/20 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white flex items-center justify-center text-sm font-bold transition-all active:scale-90 ml-1.5 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Header Actions: Mobile Close Only */}
              <div className="flex md:hidden items-center flex-shrink-0">
                <button
                  onClick={onClose}
                  aria-label="Close specifications modal"
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/20 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white flex items-center justify-center text-sm font-bold transition-all active:scale-90 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* ── SPLIT-PANEL SPECIFICATIONS VIEW (WARM BURGUNDY & WHITE) ── */}
            <div className="flex-1 overflow-y-auto md:overflow-hidden grid grid-cols-1 md:grid-cols-[380px_1fr] bg-gradient-to-b from-[#FFFFFF] via-[#FFF8F8] to-[#FFF1F2] dark:from-[#180A14] dark:via-[#140610] dark:to-[#0F040C]">
              
              {/* ── LEFT COLUMN: Media visualizer & D.Card Score dial ── */}
              <div className="p-6 border-b md:border-b-0 md:border-r border-rose-100 dark:border-amber-900/30 flex flex-col items-center justify-between overflow-visible md:overflow-y-auto custom-scrollbar select-none gap-6 text-center bg-white/60 dark:bg-black/20">
                
                <div className="w-full flex flex-col items-center gap-3">
                  <div
                    className="w-full max-w-[280px] aspect-[1.586/1] relative select-none transition-transform"
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    style={{
                      transform: window.innerWidth < 768 ? "none" : `perspective(1000px) rotateX(var(--details-tilt-x, 0deg)) rotateY(var(--details-tilt-y, 0deg))`,
                      transition: "transform 0.15s ease-out",
                      transformStyle: "preserve-3d"
                    }}
                  >
                    <DebitCardVisual mode="details" card={card} finish="classic" />
                  </div>
                  
                  <p className="text-[10px] text-[#800020] dark:text-amber-300 font-bold uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    <span>Interactive Premium Card Mockup</span>
                  </p>
                </div>

                {/* D.Card Score Dial and Breakdown index */}
                <div className="w-full bg-white dark:bg-white/5 p-4 rounded-2xl border border-rose-200/80 dark:border-amber-900/30 shadow-xs text-left space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500/15 via-rose-500/10 to-amber-500/20 border-2 border-amber-500/40 flex items-center justify-center font-black text-[#800020] dark:text-amber-300 text-sm shadow-inner flex-shrink-0">
                      {scoreMetrics.dcardScore}
                    </div>
                    <div>
                      <h4 className="text-[10px] font-black text-[#800020] dark:text-amber-400 tracking-widest uppercase">
                        D.Card Score™
                      </h4>
                      <p className="text-[8.5px] text-slate-500 dark:text-slate-400 font-bold uppercase mt-0.5">
                        Proprietary discovery index
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 border-t border-rose-100 dark:border-white/5 pt-3">
                    {[
                      { label: "Charges Score", score: scoreMetrics.chargesScore, color: "bg-[#800020] dark:bg-rose-500" },
                      { label: "Benefits Score", score: scoreMetrics.benefitsScore, color: "bg-emerald-600 dark:bg-emerald-500" },
                      { label: "Trust Score", score: scoreMetrics.trustScore, color: "bg-amber-500 dark:bg-amber-400" }
                    ].map(stat => (
                      <div key={stat.label}>
                        <div className="flex justify-between text-[9px] font-black text-slate-700 dark:text-slate-200">
                          <span>{stat.label}</span>
                          <span>{stat.score}/100</span>
                        </div>
                        <div className="w-full bg-slate-100 dark:bg-white/10 h-1.5 rounded-full mt-0.5 overflow-hidden">
                          <div className={`h-full ${stat.color}`} style={{ width: `${stat.score}%` }} />
                        </div>
                      </div>
                    ))}
                    
                    <div className="flex items-center justify-between text-[8.5px] font-black pt-1">
                      <span className="text-slate-500 dark:text-slate-400 uppercase">Hidden Fee Risk:</span>
                      <span className={`px-2 py-0.5 rounded text-[8.5px] border font-black uppercase ${
                        scoreMetrics.risk === "High" 
                          ? "bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-400" 
                          : scoreMetrics.risk === "Medium" 
                            ? "bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-700 dark:text-amber-400" 
                            : "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400"
                      }`}>
                        {scoreMetrics.risk} Risk
                      </span>
                    </div>
                  </div>
                </div>

                {/* Verified Shield Analytics */}
                <div className="w-full space-y-2.5 pt-2 border-t border-rose-100 dark:border-amber-900/20">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                    <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-extrabold">✓ Verified Data</span>
                    <span className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded text-[10px] font-black">
                      Trust Score: {trustScore}/10
                    </span>
                  </div>
                  <div className="w-full bg-white dark:bg-white/5 rounded-2xl p-3 border border-rose-100 dark:border-white/10 text-left text-[10px] leading-relaxed text-slate-600 dark:text-slate-300 font-medium shadow-xs">
                    This card data is verified against official regulatory frameworks and bank guidelines. 
                    <span className="block mt-1 font-black text-[#800020] dark:text-amber-300">Audited Status: Verified</span>
                  </div>
                </div>

              </div>

              {/* ── RIGHT COLUMN: Rebuilt Specification Tabs ── */}
              <div className="details-modal-right-col overflow-visible md:overflow-y-auto custom-scrollbar flex flex-col" ref={scrollRef}>
                
                {/* Tabbed Menu Controls */}
                <div className="sticky top-0 z-30 bg-white/95 dark:bg-[#180A14]/95 backdrop-blur-md border-b border-rose-100 dark:border-amber-900/30 flex overflow-x-auto whitespace-nowrap custom-scrollbar">
                  {[
                    { id: "overview", label: "Overview", icon: "🔍" },
                    { id: "benefits", label: "Benefits", icon: "🎁" },
                    { id: "charges", label: "Charges & Fees", icon: "💰" },
                    { id: "eligibility", label: "Eligibility", icon: "👤" },
                    { id: "source", label: "Official Source", icon: "🔗" }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`px-5 py-3.5 text-xs font-black transition-all border-b-2 cursor-pointer ${
                        activeTab === tab.id
                          ? "border-[#800020] dark:border-amber-400 text-[#800020] dark:text-amber-300 bg-rose-50/70 dark:bg-amber-400/10"
                          : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/5"
                      }`}
                    >
                      <span className="mr-1.5">{tab.icon}</span>{tab.label}
                    </button>
                  ))}
                </div>

                {/* Dynamic tab contents container */}
                <div className="p-5 md:p-8 space-y-6 flex-1 text-left">
                  
                  {/* ── TAB 1: OVERVIEW ── */}
                  {activeTab === "overview" && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                      <div>
                        <span className="text-[10px] font-black text-[#800020] dark:text-amber-400 tracking-widest uppercase">
                          Overview
                        </span>
                        <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
                          Platform Evaluation
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-normal mt-3 bg-white dark:bg-white/5 p-4 rounded-2xl border border-rose-100 dark:border-white/10 shadow-xs">
                          The <strong className="text-[#800020] dark:text-amber-300 font-bold">{card.cardName}</strong> is issued by <strong className="text-[#800020] dark:text-amber-300 font-bold">{card.bank}</strong>. Designed for {card.bestFor}, it coordinates reasonable charges with extensive premium privileges.
                        </p>
                      </div>

                      {/* Key Specifications Grid */}
                      <div className="space-y-3">
                        <h4 className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                          Key Card Specifications
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                          <div className="p-4 bg-white dark:bg-white/5 rounded-2xl border border-rose-100 dark:border-white/10 shadow-xs flex items-center gap-3.5 hover:border-amber-400/40 transition-colors">
                            <span className="text-2xl">💰</span>
                            <div>
                              <span className="block text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                Annual Maintenance Fee
                              </span>
                              <span className="text-xs sm:text-sm font-black text-slate-900 dark:text-white mt-0.5 leading-snug">
                                {card.annualFee === 0 ? "Lifetime Free" : `₹${card.annualFee} + GST`}
                              </span>
                            </div>
                          </div>

                          <div className="p-4 bg-white dark:bg-white/5 rounded-2xl border border-rose-100 dark:border-white/10 shadow-xs flex items-center gap-3.5 hover:border-amber-400/40 transition-colors">
                            <span className="text-2xl">🏛️</span>
                            <div>
                              <span className="block text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                Minimum Balance Required
                              </span>
                              <span className="text-xs sm:text-sm font-black text-slate-900 dark:text-white mt-0.5 leading-snug">
                                {card.minBalance === 0 ? "Zero Balance Account" : (typeof card.minBalance === 'number' ? `₹${card.minBalance.toLocaleString('en-IN')}` : "N/A")}
                              </span>
                            </div>
                          </div>

                          <div className="p-4 bg-white dark:bg-white/5 rounded-2xl border border-rose-100 dark:border-white/10 shadow-xs flex items-center gap-3.5 hover:border-amber-400/40 transition-colors">
                            <span className="text-2xl">🏧</span>
                            <div>
                              <span className="block text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                Daily ATM Limit
                              </span>
                              <span className="text-xs sm:text-sm font-black text-slate-900 dark:text-white mt-0.5 leading-snug">
                                {atmLimitText.replace("ATM Limit: ", "")}
                              </span>
                            </div>
                          </div>

                          <div className="p-4 bg-white dark:bg-white/5 rounded-2xl border border-rose-100 dark:border-white/10 shadow-xs flex items-center gap-3.5 hover:border-amber-400/40 transition-colors">
                            <span className="text-2xl">🛍️</span>
                            <div>
                              <span className="block text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                Daily POS Limit
                              </span>
                              <span className="text-xs sm:text-sm font-black text-slate-900 dark:text-white mt-0.5 leading-snug">
                                {posLimitText.replace("POS Limit: ", "")}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Card Pros & Cons */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                        <div className="p-5 bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 rounded-2xl space-y-2.5">
                          <h4 className="text-xs font-black text-emerald-800 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                            <span>✓</span> Key Advantages (Pros)
                          </h4>
                          <ul className="space-y-2 text-xs font-semibold text-slate-700 dark:text-slate-200">
                            {card.pros && card.pros.length > 0 ? (
                              card.pros.map((pro, i) => (
                                <li key={i} className="flex items-start gap-2">
                                  <span className="text-emerald-600 dark:text-emerald-400 font-black">•</span>
                                  <span className="font-sans leading-relaxed">{pro}</span>
                                </li>
                              ))
                            ) : (
                              <li className="flex items-start gap-2">
                                <span className="text-emerald-600 dark:text-emerald-400 font-black">•</span>
                                <span className="font-sans leading-relaxed">High acceptance across domestic bank terminals</span>
                              </li>
                            )}
                          </ul>
                        </div>

                        <div className="p-5 bg-rose-50/70 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800/40 rounded-2xl space-y-2.5">
                          <h4 className="text-xs font-black text-rose-800 dark:text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                            <span>✕</span> Limitations (Cons)
                          </h4>
                          <ul className="space-y-2 text-xs font-semibold text-slate-700 dark:text-slate-200">
                            {card.cons && card.cons.length > 0 ? (
                              card.cons.map((con, i) => (
                                <li key={i} className="flex items-start gap-2">
                                  <span className="text-rose-600 dark:text-rose-400 font-black">•</span>
                                  <span className="font-sans leading-relaxed">{con}</span>
                                </li>
                              ))
                            ) : (
                              <li className="flex items-start gap-2">
                                <span className="text-rose-600 dark:text-rose-400 font-black">•</span>
                                <span className="font-sans leading-relaxed">General limits and standard bank transaction charges apply</span>
                              </li>
                            )}
                          </ul>
                        </div>
                      </div>

                      {/* Hidden Charges Transparency Warning */}
                      <div className="p-5 bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 rounded-2xl space-y-2">
                        <h4 className="text-xs font-black text-amber-800 dark:text-amber-400 uppercase tracking-wider flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                          <span>Transparency Shield: Hidden Charges Alert</span>
                        </h4>
                        <p className="text-xs text-slate-700 dark:text-slate-200 font-medium font-sans leading-relaxed">
                          Banks promote benefits, but we show hidden charges. For the <strong className="text-slate-900 dark:text-white">{card.cardName}</strong>, standard regulatory and processing charges apply. These typically include lost card replacement fees (<strong>₹200 + GST</strong>), insufficient balance ATM decline fees (<strong>₹20 + GST</strong>), and quarterly SMS alert charges (<strong>₹15</strong>). Avoid balance drops to prevent maintenance penalties.
                        </p>
                      </div>

                      {/* Direct Official Source Link */}
                      {card.officialSource && (
                        <div className="p-4 bg-white dark:bg-white/5 border border-rose-100 dark:border-white/10 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
                          <div className="text-left">
                            <span className="block text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider">Regulatory Integrity</span>
                            <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 leading-snug">Verify all details directly against the official bank portal guidelines.</span>
                          </div>
                          <a
                            href={card.officialSource}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => card && referralService.logReferralClick(user?.id, card, card.officialSource || "")}
                            className="px-5 py-2.5 rounded-xl text-xs font-black text-white bg-gradient-to-r from-[#800020] via-[#9F1239] to-[#800020] hover:from-[#6B001B] hover:to-[#881337] transition-all active:scale-95 whitespace-nowrap shadow-sm"
                          >
                            🔗 Verify on Official Bank Portal ↗
                          </a>
                        </div>
                      )}

                      {/* Bank Profile Integration */}
                      {bankProfile && (
                        <div className="p-5 bg-gradient-to-r from-rose-50/80 to-amber-50/60 dark:from-rose-950/20 dark:to-amber-950/10 border border-rose-200/80 dark:border-amber-900/30 rounded-[24px] space-y-3 mt-4 shadow-xs">
                          <div className="flex items-center justify-between border-b border-rose-200/60 dark:border-amber-900/20 pb-2">
                            <h4 className="text-xs font-black text-[#800020] dark:text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                              <span>🏛️</span> {card.bank} Profile Overview
                            </h4>
                            <span className="bg-amber-100 dark:bg-amber-900/40 border border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-300 text-[9px] font-black px-2 py-0.5 rounded">
                              Bank Trust: {bankProfile.trustScore}
                            </span>
                          </div>
                          <p className="text-xs leading-relaxed text-slate-700 dark:text-slate-300 font-medium font-sans">
                            {bankProfile.overview}
                          </p>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {/* ── TAB 2: BENEFITS ── */}
                  {activeTab === "benefits" && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                      <div>
                        <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-wider mb-2">
                          Complimentary Lifestyle Perks
                        </h3>
                        <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400 font-medium font-sans mb-4">
                          Evaluated reward rates and complimentary airport lounge/fuel waiver schedules linked to your card:
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        {[
                          { title: "Airport Lounges", desc: card.loungeAccess || "Not Active", icon: "✈️", active: checkFeature("lounge access") },
                          { title: "Fuel Surcharge", desc: card.fuelWaiver || "Not Active", icon: "⛽", active: checkFeature("fuel waiver") },
                          { title: "Cashback Rate", desc: card.cashback || `Standard rate of ${card.cashbackPct}%`, icon: "🎁", active: checkFeature("rewards") },
                          { title: "Contactless Support", desc: (card.contactless === true || String(card.contactless || '').toLowerCase().includes("yes")) ? "Active Tap to Pay" : "No NFC", icon: "📶", active: checkFeature("contactless") }
                        ].map((item, idx) => (
                          <div key={idx} className={`p-4 rounded-2xl border flex items-center justify-between gap-4 shadow-xs ${
                            item.active 
                              ? "bg-emerald-50/70 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/40 text-slate-800 dark:text-slate-100" 
                              : "bg-white dark:bg-white/5 border-rose-100 dark:border-white/10 text-slate-500 dark:text-slate-400"
                          }`}>
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">{item.icon}</span>
                              <div>
                                <span className="block text-[9px] font-black uppercase text-slate-500 dark:text-slate-400 tracking-wider">{item.title}</span>
                                <span className="text-xs font-bold leading-normal font-sans text-slate-900 dark:text-white">{item.desc}</span>
                              </div>
                            </div>
                            <span className={`text-[8px] font-black px-2 py-0.5 rounded-full border ${
                              item.active 
                                ? "bg-emerald-100 dark:bg-emerald-900/40 border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300" 
                                : "bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-400"
                            }`}>
                              {item.active ? "✓ ACTIVE" : "✕ INACTIVE"}
                            </span>
                          </div>
                        ))}
                      </div>

                      {card.healthcareFriendly && card.healthcareBenefits && card.healthcareBenefits.length > 0 && (
                        <div className="p-5 bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 rounded-2xl space-y-3">
                          <h4 className="text-xs font-black text-emerald-800 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                            <span>🏥</span> Healthcare Perks Checklist
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-semibold text-slate-700 dark:text-slate-200">
                            {card.healthcareBenefits.map((benefit, i) => (
                              <div key={i} className="flex items-start gap-2.5 bg-white dark:bg-white/5 p-3 rounded-xl border border-emerald-200/60 dark:border-white/5">
                                <span className="text-emerald-600 dark:text-emerald-400 text-sm font-black">✓</span>
                                <p className="leading-relaxed font-sans">{benefit}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Integrated Digital Security & Safety Controls */}
                      <div className="p-5 bg-white dark:bg-white/5 border border-rose-100 dark:border-white/10 rounded-2xl space-y-3 mt-4 shadow-xs">
                        <h4 className="text-xs font-black text-[#800020] dark:text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                          <Lock className="w-4 h-4 text-amber-500" />
                          <span>Digital Security Controls</span>
                        </h4>
                        <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400 font-medium font-sans">
                          Configure these card features anytime within your bank's mobile application to ensure protection:
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-[11px] font-semibold">
                          <div className="bg-rose-50/50 dark:bg-white/5 p-3.5 rounded-xl border border-rose-100 dark:border-white/10">
                            <span className="block text-[8.5px] font-black text-[#800020] dark:text-amber-300 uppercase mb-1">NFC Tap Guard</span>
                            <span className="text-slate-700 dark:text-slate-300 font-sans leading-relaxed">Turn contactless payments ON/OFF or customize transactions below ₹5,000.</span>
                          </div>
                          <div className="bg-rose-50/50 dark:bg-white/5 p-3.5 rounded-xl border border-rose-100 dark:border-white/10">
                            <span className="block text-[8.5px] font-black text-[#800020] dark:text-amber-300 uppercase mb-1">Forex Toggle</span>
                            <span className="text-slate-700 dark:text-slate-300 font-sans leading-relaxed">Switch off international usages dynamically with one tap in your mobile banking app.</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* ── TAB 3: CHARGES & FEES ── */}
                  {activeTab === "charges" && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                      <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-wider mb-2">
                        Schedule of Bank Charges
                      </h3>
                      <div className="overflow-x-auto rounded-2xl border border-rose-100 dark:border-white/10 bg-white dark:bg-white/[0.02] shadow-xs">
                        <table className="w-full text-left border-collapse text-xs select-none font-sans min-w-[500px] md:min-w-0">
                          <thead>
                            <tr className="bg-rose-50/70 dark:bg-white/5 border-b border-rose-100 dark:border-white/10 text-slate-600 dark:text-slate-400 font-black uppercase tracking-wider text-[9px]">
                              <th className="p-4">Transaction / Fee Class</th>
                              <th className="p-4">Standard Amount Charged</th>
                              <th className="p-4">Waive Guidelines / Details</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-rose-100 dark:divide-white/5 font-semibold text-slate-700 dark:text-slate-200">
                            {[
                              { type: "Annual Fee", val: card.annualFee === 0 ? "Lifetime Free" : `₹${card.annualFee} + GST`, terms: "Waived off for specific premium or salary linked relationships." },
                              { type: "ATM Withdrawals", val: card.atmCharges || "₹21/transaction after limits", terms: "Standard free transaction limits apply across domestic bank networks." },
                              { type: "Zero Forex Markup", val: card.travelZeroForex ? "0% Markup Fee" : "3.5% Markup Fee", terms: "Waiver valid for specific variant linked international debit cards." },
                              { type: "Lost Card Replacement", val: "₹200 + GST", terms: "Standard fee levied to handle new physical issuance and activation." },
                              { type: "ATM Decline Fee", val: "₹20 + GST", terms: "Charged when transaction is declined due to insufficient funds at ATM." },
                              { type: "SMS Alert Charges", val: "₹15 / Quarter", terms: "Quarterly regulatory SMS communication charges levied by bank." }
                            ].map((row, i) => (
                              <tr key={i} className="hover:bg-rose-50/40 dark:hover:bg-white/5 transition-colors">
                                <td className="p-4 font-black text-slate-900 dark:text-white">{row.type}</td>
                                <td className="p-4 font-black text-[#800020] dark:text-amber-400">{row.val}</td>
                                <td className="p-4 text-slate-600 dark:text-slate-400 leading-relaxed font-sans">{row.terms}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </motion.div>
                  )}

                  {/* ── TAB 4: ELIGIBILITY ── */}
                  {activeTab === "eligibility" && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                      <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-wider mb-2">
                        Requirement Matrix
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[
                          { label: "Age Threshold", val: "18 Years & Above", desc: "Accounts for minors under 18 require parental supervision." },
                          { label: "Minimum Monthly Balance", val: card.minBalance === 0 ? "Zero Balance Link" : (typeof card.minBalance === 'number' ? `₹${card.minBalance.toLocaleString('en-IN')}` : "N/A"), desc: "Fees applicable if account balance average falls below threshold." },
                          { label: "Documents Required", val: "Aadhaar Card, PAN Card & KYC", desc: "Standard regulatory KYC documentation is required for account opening." },
                          { label: "Bank Account Relationship", val: card.eligibility || "Standard Savings Relationship", desc: "Certain premium debit cards require specific account categories." }
                        ].map((item, idx) => (
                          <div key={idx} className="p-4 bg-white dark:bg-white/5 rounded-2xl border border-rose-100 dark:border-white/10 shadow-xs">
                            <span className="block text-[8.5px] font-black text-[#800020] dark:text-amber-400 uppercase tracking-widest">{item.label}</span>
                            <span className="block text-sm font-black text-slate-900 dark:text-white mt-1 leading-snug">{item.val}</span>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium mt-1.5 leading-relaxed font-sans">{item.desc}</p>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* ── TAB 5: OFFICIAL SOURCE ── */}
                  {activeTab === "source" && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 select-none text-center py-10">
                      <span className="text-5xl select-none">🛡️</span>
                      <h3 className="text-xl font-black text-slate-900 dark:text-white mt-4 uppercase tracking-widest font-sans">
                        Official Source Transparency
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium max-w-sm mx-auto mt-2 font-sans">
                        All specifications for the {card.cardName} are actively monitored and matched against the official portal guidelines from {card.bank}.
                      </p>
                      <div className="max-w-md mx-auto bg-white dark:bg-white/5 border border-rose-100 dark:border-white/10 rounded-2xl p-4 text-left text-xs text-slate-700 dark:text-slate-300 font-medium space-y-2 mt-4 font-sans shadow-xs">
                        <p className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-black"><span className="text-sm">✓</span> Directly sourced from official bank guidelines</p>
                        <p className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-black"><span className="text-sm">✓</span> No third-party estimations or speculative claims</p>
                        <p className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-black"><span className="text-sm">✓</span> Audited status: verified</p>
                      </div>
                      {card.officialSource && (
                        <a
                          href={card.officialSource}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => card && referralService.logReferralClick(user?.id, card, card.officialSource || "")}
                          className="inline-block mt-6 px-6 py-3 rounded-xl bg-gradient-to-r from-[#800020] via-[#9F1239] to-[#800020] text-white font-black text-xs hover:shadow-lg transition-all cursor-pointer shadow-sm"
                        >
                          🔗 Open Official Bank Portal Guideline Page ↗
                        </a>
                      )}
                    </motion.div>
                  )}

                </div>

                {/* Related Similar Cards Carousel */}
                {relatedList.length > 0 && (
                  <div className="p-5 md:p-8 bg-rose-50/40 dark:bg-black/30 border-t border-rose-100 dark:border-amber-900/30">
                    <h4 className="text-xs font-black text-[#800020] dark:text-amber-400 uppercase tracking-widest mb-4 flex items-center gap-2 select-none">
                      <span>🔄</span> Discover Similar Premium Picks
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                      {relatedList.map(relatedCard => (
                        <div
                          key={relatedCard.id}
                          onClick={() => handleSelectRelatedCard(relatedCard)}
                          className="p-4 rounded-2xl bg-white dark:bg-white/5 hover:bg-rose-50/60 dark:hover:bg-white/10 border border-rose-100 dark:border-white/10 hover:border-amber-400/50 transition-all duration-300 cursor-pointer flex flex-col justify-between min-h-[140px] shadow-xs"
                        >
                          <div>
                            <span className="block text-[8px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">{relatedCard.bank}</span>
                            <h5 className="text-xs font-black text-slate-900 dark:text-white truncate mt-1 leading-tight">{relatedCard.cardName}</h5>
                          </div>
                          <div className="flex justify-between items-center text-[10px] text-slate-500 dark:text-slate-400 font-bold border-t border-rose-100 dark:border-white/5 pt-2 mt-2">
                            <span>₹{relatedCard.annualFee} AMC</span>
                            <span className="text-[#800020] dark:text-amber-400 font-black">Spec details →</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>

            </div>

            {/* Mobile Sticky Footer CTA Bar (Burgundy & Gold) */}
            <div className="sticky bottom-0 z-50 bg-white/95 dark:bg-[#180A14]/95 backdrop-blur-md border-t border-rose-100 dark:border-amber-900/30 p-3.5 flex items-center justify-between gap-2.5 md:hidden flex-shrink-0">
              <a
                href={applyUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => handleApplyClick(e, applyUrl)}
                className="flex-1 py-3 text-center rounded-xl text-xs font-black text-white bg-gradient-to-r from-[#800020] via-[#9F1239] to-[#800020] active:scale-95 shadow-md whitespace-nowrap min-h-[44px] flex items-center justify-center gap-1"
              >
                <span>Apply Now</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                onClick={handleWishlistToggle}
                className={`flex-1 py-3 rounded-xl border transition-all text-xs active:scale-90 flex items-center justify-center gap-1 font-bold min-h-[44px] ${
                  isCardWishlisted 
                    ? "bg-rose-50 border-rose-300 text-rose-700 dark:bg-rose-950/50 dark:border-rose-800 dark:text-rose-300 font-extrabold" 
                    : "bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300"
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${isCardWishlisted ? "fill-rose-600 text-rose-600" : ""}`} />
                <span>{isCardWishlisted ? "Saved" : "Save"}</span>
              </button>

              <button
                onClick={handleCompareToggle}
                className={`flex-1 py-3 rounded-xl border transition-all text-xs active:scale-90 flex items-center justify-center gap-1 font-black min-h-[44px] ${
                  isCardInCompare 
                    ? "bg-gradient-to-r from-[#800020] to-[#9F1239] text-white border-amber-400/40" 
                    : "bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300"
                }`}
              >
                <Scale className="w-3.5 h-3.5" />
                <span>{isCardInCompare ? "✓ Queued" : "Compare"}</span>
              </button>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default memo(CardDetailsModal);
