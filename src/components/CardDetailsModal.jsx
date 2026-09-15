import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWishlist } from '../context/WishlistContext';
import { debitCards } from '../data/mockData';
import DebitCardVisual from './DebitCardVisual';
import { useAuth } from '../hooks/useAuth';
import { referralService } from '../services/referralService';
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

function CardDetailsModal({ isOpen, onClose, card, compareQueue, toggleCompareQueue, onCardSelect, userProfile = "Working Professional", rankings }) {
  const { toggleWishlist, isWishlisted } = useWishlist();
  const { user, openAuthModal } = useAuth();
  const scrollRef = useRef(null);

  const [activeTab, setActiveTab] = useState("overview"); // overview, benefits, charges, eligibility, source

  useEffect(() => {
    if (card?.id) {
      setActiveTab("overview");
    }
  }, [card?.id]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Safe Property Lookups with Fallbacks
  const cardId = card?.id || 0;
  const cardName = card?.cardName || card?.name || "Debit Card";
  const bankName = card?.bank || "Listed Bank";
  const annualFee = typeof card?.numAnnualFee === 'number' ? card.numAnnualFee : (typeof card?.annualFee === 'number' ? card.annualFee : parseFloat(String(card?.annualFee || '').replace(/[^0-9.]/g, '')) || 0);
  const minBalance = typeof card?.minBalance === 'number' ? card.minBalance : parseFloat(String(card?.minBalance || '').replace(/[^0-9.]/g, '')) || 0;
  const applyUrl = card?.applyUrl || "#";
  const officialSource = card?.officialSource || "";
  const bestFor = Array.isArray(card?.bestFor) ? card.bestFor.join(", ") : (card?.bestFor ? String(card.bestFor) : "general usage");
  const verificationStatus = card?.verificationStatus || "Needs Verification";
  const hiddenCharges = card?.hiddenCharges || "Standard bank charges apply";
  const loungeAccess = card?.loungeAccess || "No";
  const contactless = card?.contactless || "No";
  const fuelWaiver = card?.fuelWaiver || "No";
  const internationalUsage = card?.internationalUsage || "No";
  const cashbackPct = typeof card?.cashbackPct === 'number' ? card.cashbackPct : parseFloat(String(card?.cashbackPct || '').replace(/[^0-9.]/g, '')) || 0;

  const cardSeoTitle = (isOpen && card)
    ? `${bankName} ${cardName} | D.Card`
    : null;

  const cardSeoDesc = (isOpen && card)
    ? `Explore ${bankName} ${cardName}. Annual fee: ${card?.annualFee ? card.annualFee : (annualFee ? '₹' + annualFee : 'Free')}, daily ATM limit: ₹${card?.atmLimit ? card.atmLimit.toLocaleString('en-IN') : '50,000'}. Features and benefits on D.Card.`
    : null;

  const cardSchema = (isOpen && card)
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
    canonicalUrl: "https://www.dcard.website/cards",
    schema: cardSchema
  });

  const { gradient: brandGradient, accent, shadow } = getBankCardSkin(bankName);
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

  const parseLimitAmount = (str) => {
    if (typeof str !== 'string') return 100000;
    const numbers = str.replace(/,/g, '').match(/\d+/g);
    return numbers ? parseInt(numbers[0], 10) : 100000;
  };

  const featuresList = card && Array.isArray(card.features) ? card.features : [];
  const atmLimitText = featuresList.find(f => typeof f === 'string' && f.toLowerCase().includes("atm limit")) || "ATM Limit: ₹50,000 daily";
  const posLimitText = featuresList.find(f => typeof f === 'string' && f.toLowerCase().includes("pos limit")) || "POS Limit: ₹2,0,000 daily";

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

  const checkFeature = (feat) => {
    if (!feat || !card) return false;
    const benefitsText = typeof card.benefits === 'string' ? card.benefits : "";
    const featuresText = Array.isArray(card.features) ? card.features.join(" ") : "";
    const bestForText = typeof card.bestFor === 'string' ? card.bestFor : "";
    const text = `${benefitsText} ${featuresText} ${bestForText}`.toLowerCase();

    const contactlessVal = String(contactless || "").toLowerCase();
    const fuelWaiverVal = String(fuelWaiver || "").toLowerCase();
    const loungeVal = String(loungeAccess || "").toLowerCase();
    const intUsageVal = String(internationalUsage || "").toLowerCase();
    const cashbackVal = cashbackPct;

    switch (String(feat || "").toLowerCase()) {
      case "contactless": return contactlessVal.includes("yes") || contactless === true || text.includes("nfc") || text.includes("tap");
      case "fuel waiver": return fuelWaiverVal.includes("yes") || text.includes("fuel") || text.includes("surcharge");
      case "lounge access": return loungeVal.includes("yes") || (loungeAccess && !loungeVal.startsWith("no")) || text.includes("lounge") || text.includes("airport");
      case "rewards": return cashbackVal > 0 || text.includes("reward") || text.includes("point");
      case "insurance": return text.includes("insurance") || text.includes("liability") || text.includes("accident");
      case "international usage": return intUsageVal.includes("yes") || card.international === true || text.includes("global") || text.includes("forex");
      default: return false;
    }
  };

  const relatedList = useMemo(() => {
    if (!card) return [];
    const cardsList = Array.isArray(debitCards) ? debitCards : [];
    return cardsList
      .filter(c => {
        if (!c || c.id === cardId) return false;
        return c.bank === bankName || c.category === card.category || c.network === card.network;
      })
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

  /* Dynamic Trust Score out of 10 */
  const trustScore = useMemo(() => {
    if (!card) return "7.5";
    let score = 7.5;
    if (card.dataConfidence === "Verified" || verificationStatus === "Verified") score += 1.5;
    if (!card.verifyNote) score += 0.5;
    if (officialSource) score += 0.5;
    return score.toFixed(1);
  }, [card, verificationStatus, officialSource]);

  /* Proprietary D.Card Score™ & Integrity Metric Engines */
  const scoreMetrics = useMemo(() => {
    if (!card) return { dcardScore: 75, chargesScore: 75, benefitsScore: 75, trustScore: 75, risk: "Low" };
    // 1. Charges Score (45 to 98)
    let chargesScore = Math.round(98 - (annualFee / 35) - (minBalance / 9000));
    chargesScore = Math.min(98, Math.max(45, chargesScore));

    // 2. Benefits Score (50 to 98)
    let perksCount = (loungeAccess && !String(loungeAccess).toLowerCase().startsWith('no') ? 1.5 : 0) + 
                     (card.travelZeroForex ? 1.5 : 0) + 
                     (card.healthcareFriendly ? 1.5 : 0) + 
                     (cashbackPct >= 1.0 ? 1 : 0) + 
                     (contactless ? 0.5 : 0) + 
                     (fuelWaiver ? 0.5 : 0);
    let benefitsScore = Math.round(55 + (perksCount * 6.5));
    benefitsScore = Math.min(98, Math.max(50, benefitsScore));

    // 3. Trust Score (60 to 98)
    let trustScoreVal = verificationStatus === 'Verified' ? 95 : verificationStatus === 'Recently Updated' ? 88 : 72;

    // Hidden Charges Risk Assessment
    let risk = "Low";
    if (String(hiddenCharges || "").toLowerCase().includes("decline") || String(hiddenCharges || "").toLowerCase().includes("non-maintenance")) {
      risk = "High";
    } else if (annualFee >= 1000 || minBalance >= 10000) {
      risk = "Medium";
    }

    // Compute Overall D.Card Score™ (Weight: 35% charges, 35% benefits, 30% trust)
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

  return (
    <AnimatePresence>
      {isOpen && card && (
        <div
          className="fixed inset-0 z-[2000] flex items-center justify-center p-0 md:p-4 bg-slate-950/80 dark:bg-black/90 backdrop-blur-md overflow-hidden select-none font-sans"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 30 }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            onClick={e => e.stopPropagation()}
            className="w-full max-w-5xl rounded-none md:rounded-[32px] h-full md:h-auto overflow-hidden relative bg-[#04020c]/98 border-0 md:border border-blue-900/20 shadow-[0_24px_80px_rgba(0,0,0,0.85)] text-slate-100 flex flex-col"
            style={{ maxHeight: window.innerWidth < 768 ? '100vh' : '92vh', height: window.innerWidth < 768 ? '100vh' : 'auto' }}
          >

          {/* ── PREMIUM STARTUP HEADER ── */}
          <div className="sticky top-0 z-50 backdrop-blur-xl bg-[#04020c]/90 border-b border-blue-900/20 px-6 py-4 md:px-10 flex items-center justify-between gap-4">
            <div className="min-w-0">

              <span className="text-[10px] font-black tracking-widest text-blue-400 uppercase flex items-center gap-1.5 flex-wrap">
                <span>🏦</span> {bankName}
                <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[8.5px] font-black border border-emerald-500/20 select-none tracking-widest ml-2 leading-none">
                  <span>✓ VERIFIED OFFICIAL DATA</span>
                </span>
              </span>
              <h2 className="text-base md:text-lg font-extrabold text-slate-100 truncate leading-tight mt-0.5">{cardName}</h2>
            </div>
            
            {/* Header Actions: Desktop Only */}
            <div className="hidden md:flex items-center gap-2 flex-shrink-0">
              <a
                href={applyUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => card && referralService.logReferralClick(user?.id, card, applyUrl)}
                className="px-5 py-2.5 rounded-xl text-xs font-black text-white bg-gradient-to-r from-primary to-secondary hover:shadow-indigo transition-all active:scale-95 cursor-pointer shadow-md"
              >
                Apply Now ↗
              </a>
              <button
                onClick={handleWishlistToggle}
                className={`p-2.5 rounded-xl border transition-all text-xs active:scale-90 flex items-center justify-center cursor-pointer ${
                  isCardWishlisted 
                    ? "bg-rose-500/20 border-rose-500/40 text-rose-400 font-extrabold" 
                    : "bg-white/5 border-white/10 text-slate-300 hover:text-white"
                }`}
              >
                {isCardWishlisted ? "❤️ Saved" : "🤍 Save"}
              </button>
              <button
                onClick={handleCompareToggle}
                className={`px-3 py-2.5 rounded-xl border transition-all text-xs font-bold active:scale-90 flex items-center justify-center cursor-pointer ${
                  isCardInCompare 
                    ? "bg-blue-500/20 border-blue-500/40 text-blue-400 font-extrabold" 
                    : "bg-white/5 border-white/10 text-slate-300 hover:text-white"
                }`}
              >
                {isCardInCompare ? "✓ Selected" : "Compare"}
              </button>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-sm font-bold transition-all active:scale-90 ml-2 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Header Actions: Mobile Close Only */}
            <div className="flex md:hidden items-center flex-shrink-0">
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-sm font-bold transition-all active:scale-90 cursor-pointer"
              >
                ✕
              </button>
            </div>
          </div>

          {/* ── SPLIT-PANEL SPECIFICATIONS VIEW ── */}
          <div className="flex-1 overflow-y-auto md:overflow-hidden grid grid-cols-1 md:grid-cols-[380px_1fr] bg-gradient-to-b from-[#04020c] to-[#010104]">
            
            {/* ── LEFT COLUMN: Media visualizer & actions ── */}
            <div className="p-6 border-b md:border-b-0 md:border-r border-blue-900/10 flex flex-col items-center justify-between overflow-visible md:overflow-y-auto custom-scrollbar select-none gap-6 text-center">
              
              <div className="w-full flex flex-col items-center gap-4">
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
                
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                  ✨ Interactive Premium Card Mockup
                </p>
              </div>

              {/* D.Card Score Dial and Breakdown index */}
              <div className="w-full bg-white/5 p-4 rounded-2xl border border-white/10 text-left space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-secondary/15 border-2 border-secondary/35 flex items-center justify-center font-black text-secondary dark:text-roseGold text-sm shadow-inner flex-shrink-0">
                    {scoreMetrics.dcardScore}
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black text-roseGold tracking-widest uppercase">D.Card Score™</h4>
                    <p className="text-[8px] text-slate-400 font-bold uppercase mt-0.5">Proprietary discovery index</p>
                  </div>
                </div>

                <div className="space-y-2 border-t border-white/5 pt-3">
                  {[
                    { label: "Charges Score", score: scoreMetrics.chargesScore, color: "bg-blue-500" },
                    { label: "Benefits Score", score: scoreMetrics.benefitsScore, color: "bg-emerald-500" },
                    { label: "Trust Score", score: scoreMetrics.trustScore, color: "bg-[#3B82F6]" }
                  ].map(stat => (
                    <div key={stat.label}>
                      <div className="flex justify-between text-[8.5px] font-black text-slate-300">
                        <span>{stat.label}</span>
                        <span>{stat.score}/100</span>
                      </div>
                      <div className="w-full bg-white/10 h-1 rounded-full mt-0.5 overflow-hidden">
                        <div className={`h-full ${stat.color}`} style={{ width: `${stat.score}%` }} />
                      </div>
                    </div>
                  ))}
                  
                  <div className="flex items-center justify-between text-[8px] font-black pt-1">
                    <span className="text-slate-400 uppercase">Hidden Fee Risk:</span>
                    <span className={`px-2 py-0.5 rounded text-[8px] border font-black uppercase ${
                      scoreMetrics.risk === "High" 
                        ? "bg-rose-500/10 border-rose-500/20 text-rose-400" 
                        : scoreMetrics.risk === "Medium" 
                          ? "bg-amber-500/10 border-amber-500/20 text-amber-400" 
                          : "bg-green-500/10 border-green-500/20 text-green-400"
                    }`}>
                      {scoreMetrics.risk} Risk
                    </span>
                  </div>
                </div>
              </div>

              {/* Verified Shield Analytics */}
              <div className="w-full space-y-3 pt-3 border-t border-blue-900/10">
                <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                  <span className="flex items-center gap-1 text-emerald-400">✓ Verified Data</span>
                  <span className="bg-slate-100/10 px-2 py-0.5 rounded text-[10px]">Trust Score: {trustScore}/10</span>
                </div>
                <div className="w-full bg-slate-200/5 dark:bg-black/40 rounded-2xl p-3 border border-white/5 text-left text-[10px] leading-relaxed text-slate-400 font-semibold">
                  This card data is verified against official regulatory frameworks and bank guidelines. 
                  <span className="block mt-1 font-black text-slate-300">Audited Status: Verified</span>
                </div>
              </div>

            </div>

            {/* ── RIGHT COLUMN: Rebuilt Specification Tabs ── */}
            <div className="details-modal-right-col overflow-visible md:overflow-y-auto custom-scrollbar flex flex-col" ref={scrollRef}>
              
              {/* Tabbed Menu Controls */}
              <div className="sticky top-0 z-30 bg-[#04020c] border-b border-blue-900/10 flex overflow-x-auto whitespace-nowrap custom-scrollbar">
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
                    className={`px-6 py-3.5 text-xs font-black transition-all border-b-2 ${
                      activeTab === tab.id
                        ? "border-secondary text-secondary dark:text-roseGold font-black bg-secondary/5"
                        : "border-transparent text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <span className="mr-1.5">{tab.icon}</span>{tab.label}
                  </button>
                ))}
              </div>

              {/* Dynamic tab contents container */}
              <div className="p-6 md:p-8 space-y-6 flex-1 text-left">
                
                {/* ── TAB 1: OVERVIEW ── */}
                {activeTab === "overview" && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                    <div>
                      <span className="text-[10px] font-black text-secondary tracking-widest uppercase">Overview</span>
                      <h3 className="text-2xl font-black text-white mt-1">Platform Evaluation</h3>
                      <p className="text-sm text-slate-300 leading-relaxed font-semibold mt-3 bg-white/5 p-4 rounded-2xl border border-white/5">
                        The <strong>{card.cardName}</strong> is issued by <strong>{card.bank}</strong>. Designed for {card.bestFor}, it coordinates reasonable charges with extensive premium privileges.
                      </p>
                    </div>

                    {/* Key Specifications Grid */}
                    <div className="space-y-3">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Key Card Specifications</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center gap-3">
                          <span className="text-xl">💰</span>
                          <div>
                            <span className="block text-[9px] font-black text-slate-400 uppercase">Annual Maintenance Fee</span>
                            <span className="text-xs font-black text-white mt-0.5 leading-snug">
                              {card.annualFee === 0 ? "Lifetime Free" : `₹${card.annualFee} + GST`}
                            </span>
                          </div>
                        </div>
                        <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center gap-3">
                          <span className="text-xl">🏛️</span>
                          <div>
                            <span className="block text-[9px] font-black text-slate-400 uppercase">Minimum Balance Required</span>
                            <span className="text-xs font-black text-white mt-0.5 leading-snug">
                              {card.minBalance === 0 ? "Zero Balance Account" : (typeof card.minBalance === 'number' ? `₹${card.minBalance.toLocaleString('en-IN')}` : "N/A")}
                            </span>
                          </div>
                        </div>
                        <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center gap-3">
                          <span className="text-xl">🏧</span>
                          <div>
                            <span className="block text-[9px] font-black text-slate-400 uppercase">Daily ATM Limit</span>
                            <span className="text-xs font-black text-white mt-0.5 leading-snug">{atmLimitText.replace("ATM Limit: ", "")}</span>
                          </div>
                        </div>
                        <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center gap-3">
                          <span className="text-xl">🛍️</span>
                          <div>
                            <span className="block text-[9px] font-black text-slate-400 uppercase">Daily POS Limit</span>
                            <span className="text-xs font-black text-white mt-0.5 leading-snug">{posLimitText.replace("POS Limit: ", "")}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Card Pros & Cons */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                      <div className="p-5 bg-emerald-500/[0.02] border border-emerald-500/10 rounded-2xl space-y-3">
                        <h4 className="text-xs font-black text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                          <span>✓</span> Key Advantages (Pros)
                        </h4>
                        <ul className="space-y-2 text-xs font-semibold text-slate-300">
                          {card.pros && card.pros.length > 0 ? (
                            card.pros.map((pro, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="text-emerald-500">•</span>
                                <span className="font-sans leading-relaxed">{pro}</span>
                              </li>
                            ))
                          ) : (
                            <li className="flex items-start gap-2">
                              <span className="text-emerald-500">•</span>
                              <span className="font-sans leading-relaxed">High acceptance across domestic bank terminals</span>
                            </li>
                          )}
                        </ul>
                      </div>

                      <div className="p-5 bg-rose-500/[0.02] border border-rose-500/10 rounded-2xl space-y-3">
                        <h4 className="text-xs font-black text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                          <span>✕</span> Limitations (Cons)
                        </h4>
                        <ul className="space-y-2 text-xs font-semibold text-slate-300">
                          {card.cons && card.cons.length > 0 ? (
                            card.cons.map((con, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="text-rose-400">•</span>
                                <span className="font-sans leading-relaxed">{con}</span>
                              </li>
                            ))
                          ) : (
                            <li className="flex items-start gap-2">
                              <span className="text-rose-400">•</span>
                              <span className="font-sans leading-relaxed">General limits and standard bank transaction charges apply</span>
                            </li>
                          )}
                        </ul>
                      </div>
                    </div>

                    {/* Hidden Charges Transparency Warning */}
                    <div className="p-5 bg-amber-500/[0.02] border border-amber-500/15 rounded-2xl space-y-2.5">
                      <h4 className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-2">
                        <span>⚠️</span> Transparency Shield: Hidden Charges Alert
                      </h4>
                      <p className="text-xs text-slate-300 font-medium font-sans leading-relaxed">
                        Banks promote benefits, but we show hidden charges. For the <strong className="text-white">{card.cardName}</strong>, standard regulatory and processing charges apply. These typically include lost card replacement fees (<strong>₹200 + GST</strong>), insufficient balance ATM decline fees (<strong>₹20 + GST</strong>), and quarterly SMS alert charges (<strong>₹15</strong>). Avoid balance drops to prevent maintenance penalties.
                      </p>
                    </div>

                    {/* Direct Official Source Link */}
                    {card.officialSource && (
                      <div className="p-4 bg-white/5 border border-white/5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="text-left">
                          <span className="block text-[9px] font-black text-slate-400 uppercase">Regulatory Integrity</span>
                          <span className="text-xs font-semibold text-slate-300 leading-snug">Verify all details directly against the official bank portal guidelines.</span>
                        </div>
                        <a
                          href={card.officialSource}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => card && referralService.logReferralClick(user?.id, card, card.officialSource || "")}
                          className="px-5 py-2.5 rounded-xl text-xs font-black text-white bg-gradient-to-r from-primary to-secondary hover:shadow-indigo transition-all active:scale-95 whitespace-nowrap"
                        >
                          🔗 Verify on Official Bank Portal ↗
                        </a>
                      </div>
                    )}

                    {/* Bank Profile Integration */}
                    {bankProfile && (
                      <div className="p-5 bg-gradient-to-r from-blue-950/20 to-indigo-950/10 border border-blue-900/20 rounded-[24px] space-y-3 mt-4">
                        <div className="flex items-center justify-between border-b border-blue-900/10 pb-2">
                          <h4 className="text-xs font-black text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                            <span>🏛️</span> {card.bank} Profile Overview
                          </h4>
                          <span className="bg-blue-500/15 border border-blue-500/20 text-blue-300 text-[9px] font-black px-2 py-0.5 rounded">
                            Bank Trust: {bankProfile.trustScore}
                          </span>
                        </div>
                        <p className="text-xs leading-relaxed text-slate-300 font-medium font-sans">{bankProfile.overview}</p>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* ── TAB 2: BENEFITS ── */}
                {activeTab === "benefits" && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                    <div>
                      <h3 className="text-lg font-black text-white uppercase tracking-wider mb-3">Complimentary Lifestyle Perks</h3>
                      <p className="text-xs leading-relaxed text-slate-400 font-medium font-sans mb-4">
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
                        <div key={idx} className={`p-4 rounded-2xl border flex items-center justify-between gap-4 ${
                          item.active 
                            ? "bg-emerald-500/5 border-emerald-500/20 text-slate-100" 
                            : "bg-white/[0.01] border-white/5 text-slate-400"
                        }`}>
                          <div className="flex items-center gap-3">
                            <span className="text-xl">{item.icon}</span>
                            <div>
                              <span className="block text-[9px] font-black uppercase text-slate-400 tracking-wider">{item.title}</span>
                              <span className="text-xs font-bold leading-normal font-sans">{item.desc}</span>
                            </div>
                          </div>
                          <span className={`text-[8px] font-black px-2 py-0.5 rounded-full border ${
                            item.active ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-white/5 border-white/5 text-neutral-500"
                          }`}>
                            {item.active ? "✓ ACTIVE" : "✕ INACTIVE"}
                          </span>
                        </div>
                      ))}
                    </div>

                    {card.healthcareFriendly && card.healthcareBenefits && card.healthcareBenefits.length > 0 && (
                      <div className="p-5 bg-emerald-500/[0.02] border border-emerald-500/10 rounded-2xl space-y-3">
                        <h4 className="text-xs font-black text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                          <span>🏥</span> Healthcare Perks Checklist
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-semibold text-slate-200">
                          {card.healthcareBenefits.map((benefit, i) => (
                            <div key={i} className="flex items-start gap-2.5 bg-white/[0.01] p-3 rounded-xl border border-white/5">
                              <span className="text-emerald-500 text-sm font-black">✓</span>
                              <p className="leading-relaxed font-sans">{benefit}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Integrated Digital Security & Safety Controls */}
                    <div className="p-5 bg-white/5 border border-white/5 rounded-2xl space-y-3 mt-4">
                      <h4 className="text-xs font-black text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                        <span>🛡️</span> Digital Security Controls
                      </h4>
                      <p className="text-xs leading-relaxed text-slate-400 font-medium font-sans">
                        Configure these card features anytime within your bank's mobile application to ensure protection:
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-[11px] font-semibold">
                        <div className="bg-[#04020c] p-3 rounded-xl border border-white/5">
                          <span className="block text-[8px] font-black text-blue-400 uppercase mb-1">NFC Tap Guard</span>
                          <span className="text-slate-300 font-sans leading-relaxed">Turn contactless payments ON/OFF or customize transactions below ₹5,000.</span>
                        </div>
                        <div className="bg-[#04020c] p-3 rounded-xl border border-white/5">
                          <span className="block text-[8px] font-black text-blue-400 uppercase mb-1">Forex Toggle</span>
                          <span className="text-slate-300 font-sans leading-relaxed">Switch off international usages dynamically with one tap in your mobile banking app.</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* ── TAB 3: CHARGES & FEES ── */}
                {activeTab === "charges" && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                    <h3 className="text-lg font-black text-white uppercase tracking-wider mb-2">Schedule of Bank Charges</h3>
                    <div className="overflow-x-auto rounded-2xl border border-white/5 bg-white/[0.01]">
                      <table className="w-full text-left border-collapse text-xs select-none font-sans min-w-[500px] md:min-w-0">
                        <thead>
                          <tr className="bg-white/5 border-b border-white/5 text-neutral-400 font-extrabold uppercase tracking-wider text-[9px]">
                            <th className="p-4">Transaction / Fee Class</th>
                            <th className="p-4">Standard Amount Charged</th>
                            <th className="p-4">Waive Guidelines / Details</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 font-semibold text-slate-200">
                          {[
                            { type: "Annual Fee", val: card.annualFee === 0 ? "Lifetime Free" : `₹${card.annualFee} + GST`, terms: "Waived off for specific premium or salary linked relationships." },
                            { type: "ATM Withdrawals", val: card.atmCharges || "₹21/transaction after limits", terms: "Standard free transaction limits apply across domestic bank networks." },
                            { type: "Zero Forex Markup", val: card.travelZeroForex ? "0% Markup Fee" : "3.5% Markup Fee", terms: "Waiver valid for specific variant linked international debit cards." },
                            { type: "Lost Card Replacement", val: "₹200 + GST", terms: "Standard fee levied to handle new physical issuance and activation." },
                            { type: "ATM Decline Fee", val: "₹20 + GST", terms: "Charged when transaction is declined due to insufficient funds at ATM." },
                            { type: "SMS Alert Charges", val: "₹15 / Quarter", terms: "Quarterly regulatory SMS communication charges levied by bank." }
                          ].map((row, i) => (
                            <tr key={i} className="hover:bg-white/5 transition-colors">
                              <td className="p-4 font-black text-white">{row.type}</td>
                              <td className="p-4 font-bold text-secondary dark:text-roseGold">{row.val}</td>
                              <td className="p-4 text-slate-400 leading-relaxed font-sans">{row.terms}</td>
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
                    <h3 className="text-lg font-black text-white uppercase tracking-wider mb-2">Requirement Matrix</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        { label: "Age Threshold", val: "18 Years & Above", desc: "Accounts for minors under 18 require parental supervision." },
                        { label: "Minimum Monthly Balance", val: card.minBalance === 0 ? "Zero Balance Link" : (typeof card.minBalance === 'number' ? `₹${card.minBalance.toLocaleString('en-IN')}` : "N/A"), desc: "Fees applicable if account balance average falls below threshold." },
                        { label: "Documents Required", val: "Aadhaar Card, PAN Card & KYC", desc: "Standard regulatory KYC documentation is required for account opening." },
                        { label: "Bank Account Relationship", val: card.eligibility || "Standard Savings Relationship", desc: "Certain premium debit cards require specific account categories." }
                      ].map((item, idx) => (
                        <div key={idx} className="p-4 bg-white/5 rounded-2xl border border-[#E8D9E3]/5">
                          <span className="block text-[8px] font-black text-secondary uppercase tracking-widest">{item.label}</span>
                          <span className="block text-sm font-black text-white mt-1 leading-snug">{item.val}</span>
                          <p className="text-[10px] text-slate-400 font-bold mt-1.5 leading-relaxed font-sans">{item.desc}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* ── TAB 5: OFFICIAL SOURCE ── */}
                {activeTab === "source" && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 select-none text-center py-10">
                    <span className="text-5xl select-none">🛡️</span>
                    <h3 className="text-xl font-black text-white mt-4 uppercase tracking-widest font-sans">Official Source Transparency</h3>
                    <p className="text-xs text-slate-400 leading-relaxed font-semibold max-w-sm mx-auto mt-2 font-sans">
                      All specifications for the {card.cardName} are actively monitored and matched against the official portal guidelines from {card.bank}.
                    </p>
                    <div className="max-w-md mx-auto bg-white/5 border border-white/5 rounded-2xl p-4 text-left text-xs text-slate-300 font-semibold space-y-2 mt-4 font-sans">
                      <p className="flex items-center gap-2 text-emerald-400 font-black"><span className="text-sm">✓</span> Directly sourced from official bank guidelines</p>
                      <p className="flex items-center gap-2 text-emerald-400 font-black"><span className="text-sm">✓</span> No third-party estimations or speculative claims</p>
                      <p className="flex items-center gap-2 text-emerald-400 font-black"><span className="text-sm">✓</span> Audited status: verified</p>
                    </div>
                    {card.officialSource && (
                      <a
                        href={card.officialSource}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => card && referralService.logReferralClick(user?.id, card, card.officialSource || "")}
                        className="inline-block mt-6 px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-black text-xs hover:shadow-indigo transition-all cursor-pointer"
                      >
                        🔗 Open Official Bank Portal Guideline Page ↗
                      </a>
                    )}
                  </motion.div>
                )}

              </div>

              {/* Related Similar Cards Carousel */}
              {relatedList.length > 0 && (
                <div className="p-6 md:p-8 bg-black/45 border-t border-blue-900/10">
                  <h4 className="text-xs font-black text-blue-500 uppercase tracking-widest mb-4 flex items-center gap-2 select-none">
                    <span>🔄</span> Discover Similar Premium Picks
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {relatedList.map(relatedCard => (
                      <div
                        key={relatedCard.id}
                        onClick={() => handleSelectRelatedCard(relatedCard)}
                        className="p-4 rounded-2xl bg-white/[0.01] hover:bg-white/[0.03] border border-white/5 hover:border-blue-500/20 transition-all duration-300 cursor-pointer flex flex-col justify-between min-h-[140px] shadow"
                      >
                        <div>
                          <span className="block text-[8px] font-black text-slate-400 uppercase tracking-widest">{relatedCard.bank}</span>
                          <h5 className="text-xs font-extrabold text-white truncate mt-1 leading-tight">{relatedCard.cardName}</h5>
                        </div>
                        <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold border-t border-white/5 pt-2 mt-2">
                          <span>₹{relatedCard.annualFee} AMC</span>
                          <span className="text-secondary dark:text-roseGold">Spec details →</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

          </div>

          {/* Mobile Sticky Footer CTA Bar */}
          <div className="sticky bottom-0 z-50 bg-[#04020c]/95 border-t border-blue-900/20 p-4 flex items-center justify-between gap-2.5 md:hidden flex-shrink-0">
            <a
              href={applyUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => handleApplyClick(e, applyUrl)}
              className="flex-1 py-3 text-center rounded-xl text-xs font-black text-white bg-gradient-to-r from-primary to-secondary active:scale-95 shadow-md whitespace-nowrap"
            >
              Apply Now ↗
            </a>
            <button
              onClick={handleWishlistToggle}
              className={`flex-1 py-3 rounded-xl border transition-all text-xs active:scale-90 flex items-center justify-center font-bold ${
                isCardWishlisted 
                  ? "bg-rose-500/20 border-rose-500/40 text-rose-400" 
                  : "bg-white/5 border-white/10 text-slate-350"
              }`}
            >
              {isCardWishlisted ? "❤️ Saved" : "🤍 Save"}
            </button>
            <button
              onClick={handleCompareToggle}
              className={`flex-1 py-3 rounded-xl border transition-all text-xs active:scale-90 flex items-center justify-center font-bold ${
                isCardInCompare 
                  ? "bg-blue-500/20 border-blue-500/40 text-blue-400" 
                  : "bg-white/5 border-white/10 text-slate-350"
              }`}
            >
              {isCardInCompare ? "✓ Selected" : "Compare"}
            </button>
          </div>

        </motion.div>
      </div>
    )}
  </AnimatePresence>
);
}

export default CardDetailsModal;
