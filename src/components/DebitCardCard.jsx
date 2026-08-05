import { useState, useMemo, memo } from "react";
import { motion } from "framer-motion";
import DebitCardVisual from "./DebitCardVisual";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../hooks/useAuth";
import { referralService } from "../services/referralService";

/* MAIN REDESIGNED PREMIUM DEBIT CARD - HIGH PERFORMANCE COMPOSITED VERSION */
function DebitCardCard({ card, onCompare, isQueued, onViewDetails, userProfile = "Working Professional", activeFilters = [], rankings }) {
  const [showTooltip, setShowTooltip] = useState(false);
  const { wishlist, toggleWishlist, isWishlisted } = useWishlist();
  const { user, openAuthModal } = useAuth();

  const isCardSaved = isWishlisted(card.id);

  const handleMouseMove = (e) => {
    if (window.innerWidth < 768) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const xPct = (x / rect.width) * 100;
    const yPct = (y / rect.height) * 100;

    const dx = x - rect.width / 2;
    const dy = y - rect.height / 2;
    const tiltX = -(dy / (rect.height / 2)) * 6;
    const tiltY = (dx / (rect.width / 2)) * 6;

    e.currentTarget.style.setProperty('--mouse-x', `${xPct}%`);
    e.currentTarget.style.setProperty('--mouse-y', `${yPct}%`);
    e.currentTarget.style.setProperty('--tilt-x', `${tiltX}deg`);
    e.currentTarget.style.setProperty('--tilt-y', `${tiltY}deg`);
    e.currentTarget.style.setProperty('--card-translate-y', `${tiltX !== 0 ? -6 : 0}px`);
    e.currentTarget.style.setProperty('--card-shadow-glow', '0 30px 60px rgba(194, 24, 117, 0.2)');
  };

  const handleMouseLeave = (e) => {
    setShowTooltip(false);
    
    e.currentTarget.style.setProperty('--tilt-x', `0deg`);
    e.currentTarget.style.setProperty('--tilt-y', `0deg`);
    e.currentTarget.style.setProperty('--card-translate-y', `0px`);
    e.currentTarget.style.setProperty('--card-shadow-glow', 'var(--card-shadow)');
  };

  const handleWishlistToggle = (e) => {
    e.stopPropagation();
    if (!user) {
      openAuthModal('required', `save-card-${card.id}`);
      return;
    }
    toggleWishlist(card);
  };

  const handleApplyClick = (e) => {
    e.stopPropagation();
    if (!user) {
      openAuthModal('required', `apply-${card.id}`);
      return;
    }
    if (card.applyUrl) {
      referralService.logReferralClick(user.uid || user.id, card, card.applyUrl, `REF_${card.id}`, 'Card Feed Card');
      window.open(card.applyUrl, '_blank', 'noopener,noreferrer');
    }
  };

  /* Proprietary D.Card Score™ & AI Match Engines */
  const scoreMetrics = useMemo(() => {
    if (!card) return { dcardScore: 70, chargesScore: 70, benefitsScore: 70, trustScore: 70, studentFitScore: 60, travelScore: 60, digitalExperienceScore: 70, risk: "Low", recReason: "Standard debit card setup.", aiMatchScore: 70 };

    const feeNum = typeof card.annualFee === 'number' ? card.annualFee : parseFloat(String(card.annualFee || '').replace(/[^0-9.]/g, '')) || 0;
    const minBalNum = typeof card.minBalance === 'number' ? card.minBalance : parseFloat(String(card.minBalance || '').replace(/[^0-9.]/g, '')) || 0;

    let chargesScore = Math.round(98 - (feeNum / 35) - (minBalNum / 9000));
    chargesScore = Math.min(98, Math.max(45, chargesScore));

    const loungeStr = String(card.loungeAccess || '').toLowerCase();
    const categoryStr = String(card.category || '').toLowerCase();

    let perksCount = (loungeStr && !loungeStr.startsWith('no') ? 1.5 : 0) + 
                     (card.travelZeroForex ? 1.5 : 0) + 
                     (card.healthcareFriendly ? 1.5 : 0) + 
                     ((card.cashbackPct || 0) >= 1.0 ? 1 : 0) + 
                     (card.contactless ? 0.5 : 0) + 
                     (card.fuelWaiver ? 0.5 : 0);
    let benefitsScore = Math.round(55 + (perksCount * 6.5));
    benefitsScore = Math.min(98, Math.max(50, benefitsScore));

    let trustScoreVal = card.rating ? Math.round(card.rating * 19.5) : 88;
    let studentFitScore = card.studentFriendly ? 96 : 60;
    let travelScore = card.travelZeroForex ? 98 : (loungeStr && !loungeStr.startsWith('no') ? 85 : 55);
    let digitalExperienceScore = card.verificationStatus === 'Verified' ? 95 : 82;

    let risk = "Low";
    let recReason = "Low fee structures and balanced lifestyle benefits.";

    if (feeNum > 1000 || minBalNum > 50000) {
      risk = "High";
      recReason = "High balance tier requirement for premium benefits waiver.";
    } else if (feeNum > 300 || minBalNum > 10000) {
      risk = "Medium";
      recReason = "Moderate balance maintenance required for rewards.";
    }

    let overallScore = Math.round((chargesScore * 0.3) + (benefitsScore * 0.3) + (trustScoreVal * 0.2) + (digitalExperienceScore * 0.2));
    overallScore = Math.min(98, Math.max(50, overallScore));

    let matchPct = 68;
    if (userProfile === "Student" && card.studentFriendly) matchPct += 25;
    else if (userProfile === "Women" && card.womenSpecial) matchPct += 25;
    else if (userProfile === "Senior Citizen" && card.seniorCitizen) matchPct += 25;
    else if (userProfile === "Traveler" && card.travelZeroForex) matchPct += 25;
    else if (userProfile === "Premium User" && categoryStr === "premium") matchPct += 22;
    else if (userProfile === "Working Professional" && categoryStr === "rewards") matchPct += 18;

    if (card.minBalance === 0) matchPct += 5;
    if (card.annualFee <= 250) matchPct += 4;

    const finalMatchPct = Math.min(99, Math.max(55, matchPct));

    return {
      dcardScore: overallScore,
      chargesScore,
      benefitsScore,
      trustScore: trustScoreVal,
      studentFitScore,
      travelScore: travelScore,
      digitalExperienceScore,
      risk,
      recReason,
      aiMatchScore: finalMatchPct
    };
  }, [card, userProfile]);

  const rankingBadge = useMemo(() => {
    if (!rankings) return null;
    if (rankings.student?.includes(card.id)) return { label: "#1 Best for Students", icon: "🎓", color: "from-cyan-500 to-blue-600" };
    if (rankings.women?.includes(card.id)) return { label: "Women Choice", icon: "👩", color: "from-pink-500 to-rose-600" };
    if (rankings.senior?.includes(card.id)) return { label: "Senior Preferred", icon: "👴", color: "from-amber-500 to-orange-600" };
    if (rankings.travel?.includes(card.id)) return { label: "Best Travel Card", icon: "✈️", color: "from-sky-500 to-indigo-600" };
    if (rankings.cashback?.includes(card.id)) return { label: "Highest Cashback", icon: "💰", color: "from-emerald-500 to-teal-600" };
    return null;
  }, [card.id, rankings]);

  return (
    <article
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group premium-border relative flex flex-col h-full rounded-[32px] p-4 sm:p-5 border transition-all duration-500 bg-white/45 dark:bg-[#0c0612]/45 backdrop-blur-xl border-slate-200/80 dark:border-secondary/15 shadow-soft hover:shadow-[0_20px_45px_rgba(194,24,117,0.16)] hover:border-secondary/35 cursor-pointer overflow-hidden max-w-[420px] mx-auto w-full"
      style={{
        transform: window.innerWidth < 768 ? "none" : `perspective(1000px) rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg)) translateY(var(--card-translate-y, 0px))`,
        boxShadow: `var(--card-shadow-glow, var(--card-shadow))`,
        transition: "transform 0.15s ease-out, box-shadow 0.3s ease, border-color 0.3s ease, background 0.3s ease",
        transformStyle: "preserve-3d"
      }}
      onClick={() => onViewDetails && onViewDetails(card)}
    >
      {/* ── TOP RIGHT WISHLIST HEART BUTTON ── */}
      <button
        onClick={handleWishlistToggle}
        aria-label={isCardSaved ? "Remove from wishlist" : "Save to wishlist"}
        className="absolute top-4 right-4 z-30 w-8 h-8 rounded-full bg-white/80 dark:bg-black/60 border border-slate-200 dark:border-secondary/20 flex items-center justify-center text-xs shadow-md hover:scale-110 active:scale-90 transition-all cursor-pointer"
      >
        {isCardSaved ? "❤️" : "🤍"}
      </button>

      {/* Dynamic Cursor Spotlight Radial Glow */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[32px] pointer-events-none z-0"
        style={{
          background: `radial-gradient(circle 200px at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(194, 24, 117, 0.08), transparent 80%)`
        }}
      />

      {/* ── CARD MEDIA skin display ── */}
      <div className="mt-2 relative z-10">
        <DebitCardVisual mode="grid" card={card} />
      </div>

      {/* ── SUBTLE INLINE CAPSULE BADGES ── */}
      <div className="flex flex-wrap gap-1.5 mt-3 select-none z-10 relative">
        {rankingBadge && (
          <span className={`bg-gradient-to-r ${rankingBadge.color} border border-white/10 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow flex items-center gap-1 select-none transition-all duration-300 hover:scale-105`}>
            <span>{rankingBadge.icon}</span>
            <span>{rankingBadge.label}</span>
          </span>
        )}
        {card.verificationStatus === 'Verified' && (
          <span className="bg-emerald-550/10 dark:bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold px-2.5 py-0.5 rounded-full transition-all duration-300 hover:scale-105">
            ✓ Verified
          </span>
        )}
        {card.studentFriendly && (
          <span className="bg-cyan-550/10 dark:bg-cyan-500/10 border border-cyan-500/20 text-cyan-600 dark:text-cyan-400 text-[10px] font-bold px-2.5 py-0.5 rounded-full transition-all duration-300 hover:scale-105">
            🎓 Student Friendly
          </span>
        )}
        {card.minBalance === 0 && (
          <span className="bg-purple-550/10 dark:bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 text-[10px] font-bold px-2.5 py-0.5 rounded-full transition-all duration-300 hover:scale-105">
            💵 Zero Balance
          </span>
        )}
        {(card.category === 'Premium' || card.annualFee >= 1000) && (
          <span className="bg-amber-550/10 dark:bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-[10px] font-bold px-2.5 py-0.5 rounded-full transition-all duration-300 hover:scale-105">
            👑 Premium
          </span>
        )}
      </div>

      {/* ── SCORE METRICS ── */}
      <div className="mt-3.5 p-3 rounded-2xl bg-slate-100/60 dark:bg-[#120718]/60 border border-slate-200/60 dark:border-secondary/15 backdrop-blur-md z-10 relative">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10.5px] font-black text-slate-700 dark:text-slate-200 tracking-wider uppercase">D.CARD SCORE™</span>
          </div>
          <span className="text-xs font-black text-secondary dark:text-roseGold">{scoreMetrics.dcardScore} / 100</span>
        </div>

        <div className="w-full bg-slate-200 dark:bg-black/50 h-1.5 rounded-full overflow-hidden mb-2">
          <div 
            className="h-full bg-gradient-to-r from-secondary to-primary rounded-full transition-all duration-500" 
            style={{ width: `${scoreMetrics.dcardScore}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[10px] font-bold text-textSoft dark:text-slate-400">
          <span>AI Match: <strong className="text-emerald-600 dark:text-emerald-400">{scoreMetrics.aiMatchScore}%</strong></span>
          <span>Risk: <strong className={scoreMetrics.risk === 'High' ? 'text-rose-500' : 'text-emerald-500'}>{scoreMetrics.risk}</strong></span>
        </div>
      </div>

      {/* ── 12 SPECIFIED FIELDS DATA TILES ── */}
      <div className="grid grid-cols-2 gap-2 my-3 select-none z-10 relative">
        <div className="p-2 rounded-2xl border border-slate-200/60 dark:border-secondary/15 bg-slate-50/60 dark:bg-[#0f0714]/40 backdrop-blur-md">
          <p className="text-[9.5px] text-textMuted dark:text-[#D89AB6]/80 font-bold uppercase tracking-wider">Annual Fee</p>
          <p className="text-xs font-black text-slate-800 dark:text-slate-100 truncate mt-0.5">{card.annualFee ?? "Not Available"}</p>
        </div>
        
        <div className="p-2 rounded-2xl border border-slate-200/60 dark:border-secondary/15 bg-slate-50/60 dark:bg-[#0f0714]/40 backdrop-blur-md">
          <p className="text-[9.5px] text-textMuted dark:text-[#D89AB6]/80 font-bold uppercase tracking-wider">Joining Fee</p>
          <p className="text-xs font-black text-slate-800 dark:text-slate-100 truncate mt-0.5">{card.joiningFee ?? "Not Available"}</p>
        </div>

        <div className="p-2 rounded-2xl border border-slate-200/60 dark:border-secondary/15 bg-slate-50/60 dark:bg-[#0f0714]/40 backdrop-blur-md">
          <p className="text-[9.5px] text-textMuted dark:text-[#D89AB6]/80 font-bold uppercase tracking-wider">International</p>
          <p className="text-xs font-black text-slate-800 dark:text-slate-100 truncate mt-0.5">
            {card.international !== undefined ? (card.international ? "Yes ✈️" : "No ❌") : (card.internationalUsage ?? "Not Available")}
          </p>
        </div>

        <div className="p-2 rounded-2xl border border-slate-200/60 dark:border-secondary/15 bg-slate-50/60 dark:bg-[#0f0714]/40 backdrop-blur-md">
          <p className="text-[9.5px] text-textMuted dark:text-[#D89AB6]/80 font-bold uppercase tracking-wider">Contactless</p>
          <p className="text-xs font-black text-slate-800 dark:text-slate-100 truncate mt-0.5">
            {card.contactless !== undefined ? (card.contactless ? "Yes 📶" : "No ❌") : "Not Available"}
          </p>
        </div>

        <div className="p-2 rounded-2xl border border-slate-200/60 dark:border-secondary/15 bg-slate-50/60 dark:bg-[#0f0714]/40 backdrop-blur-md">
          <p className="text-[9.5px] text-textMuted dark:text-[#D89AB6]/80 font-bold uppercase tracking-wider">Lounge Access</p>
          <p className="text-xs font-black text-slate-800 dark:text-slate-100 truncate mt-0.5">{card.loungeAccess ?? "Not Available"}</p>
        </div>

        <div className="p-2 rounded-2xl border border-slate-200/60 dark:border-secondary/15 bg-slate-50/60 dark:bg-[#0f0714]/40 backdrop-blur-md">
          <p className="text-[9.5px] text-textMuted dark:text-[#D89AB6]/80 font-bold uppercase tracking-wider">Forex Markup</p>
          <p className="text-xs font-black text-slate-800 dark:text-slate-100 truncate mt-0.5">{card.forexMarkup ?? "Not Available"}</p>
        </div>

        <div className="p-2 rounded-2xl border border-slate-200/60 dark:border-secondary/15 bg-slate-50/60 dark:bg-[#0f0714]/40 backdrop-blur-md">
          <p className="text-[9.5px] text-textMuted dark:text-[#D89AB6]/80 font-bold uppercase tracking-wider">Cashback</p>
          <p className="text-xs font-black text-slate-800 dark:text-slate-100 truncate mt-0.5">{card.cashback ?? "Not Available"}</p>
        </div>

        <div className="p-2 rounded-2xl border border-slate-200/60 dark:border-secondary/15 bg-slate-50/60 dark:bg-[#0f0714]/40 backdrop-blur-md">
          <p className="text-[9.5px] text-textMuted dark:text-[#D89AB6]/80 font-bold uppercase tracking-wider">Network</p>
          <p className="text-xs font-black text-slate-800 dark:text-slate-100 truncate mt-0.5">{card.network ?? "Not Available"}</p>
        </div>

        <div className="col-span-2 p-2 rounded-2xl border border-slate-200/60 dark:border-secondary/15 bg-slate-50/60 dark:bg-[#0f0714]/40 backdrop-blur-md flex items-center justify-between">
          <div className="min-w-0 pr-2">
            <p className="text-[9.5px] text-textMuted dark:text-[#D89AB6]/80 font-bold uppercase tracking-wider">Best For</p>
            <p className="text-xs font-black text-[#A30D62] dark:text-[#E0629A] truncate mt-0.5">{card.bestFor ?? "Not Available"}</p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-[9.5px] text-textMuted dark:text-[#D89AB6]/80 font-bold uppercase tracking-wider">Rating</p>
            <p className="text-xs font-black text-amber-500 mt-0.5">{card.rating !== undefined ? `⭐ ${card.rating}` : "Not Available"}</p>
          </div>
        </div>
      </div>

      {/* ── INTERACTION ROW WITH APPLY & DETAILS ── */}
      <div 
        className="flex gap-2 mt-auto pt-3 border-t border-slate-100 dark:border-secondary/10 z-10 select-none relative"
        style={{ transform: "translateZ(12px)" }}
      >
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={(e) => {
            e.stopPropagation();
            if (onViewDetails) onViewDetails(card);
          }}
          className="flex-1 py-2.5 rounded-xl text-xs font-black border border-secondary/30 text-secondary dark:text-roseGold hover:bg-secondary/10 transition-all cursor-pointer"
        >
          View Specs
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleApplyClick}
          className="flex-1 py-2.5 rounded-xl text-xs font-black text-white bg-gradient-to-r from-primary to-secondary hover:brightness-110 transition-all shadow-md cursor-pointer whitespace-nowrap"
        >
          Apply Now ↗
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={(e) => {
            e.stopPropagation();
            onCompare();
          }}
          className={`px-3 py-2.5 rounded-xl text-xs font-black text-white transition-all duration-300 shadow cursor-pointer ${
            isQueued
              ? "bg-emerald-600 shadow-emerald-500/20"
              : "bg-slate-800 hover:bg-slate-700 dark:bg-white/10 dark:hover:bg-white/20"
          }`}
        >
          {isQueued ? "✓" : "Compare"}
        </motion.button>
      </div>
    </article>
  );
}

export default memo(DebitCardCard);
