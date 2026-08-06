import { useState, useMemo, memo } from "react";
import { motion } from "framer-motion";
import { Heart, Star, CheckCircle2, ExternalLink, Scale, ShieldCheck, ArrowRight, Zap } from "lucide-react";
import DebitCardVisual from "./DebitCardVisual";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../hooks/useAuth";
import { referralService } from "../services/referralService";

/* MAIN REDESIGNED PREMIUM DEBIT CARD - FINTECH BLUE ENGINE */
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
    e.currentTarget.style.setProperty('--card-shadow-glow', '0 20px 45px rgba(37, 99, 235, 0.16)');
  };

  const handleMouseLeave = (e) => {
    setShowTooltip(false);
    
    e.currentTarget.style.setProperty('--tilt-x', `0deg`);
    e.currentTarget.style.setProperty('--tilt-y', `0deg`);
    e.currentTarget.style.setProperty('--card-translate-y', `0px`);
    e.currentTarget.style.setProperty('--card-shadow-glow', '0 4px 20px rgba(0, 0, 0, 0.05)');
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

  /* Proprietary D.CARD Score™ & AI Match Engines */
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
    if (rankings.student?.includes(card.id)) return { label: "#1 Best for Students", color: "from-[#2563EB] to-[#3B82F6]" };
    if (rankings.women?.includes(card.id)) return { label: "Women Choice", color: "from-[#2563EB] to-[#60A5FA]" };
    if (rankings.senior?.includes(card.id)) return { label: "Senior Preferred", color: "from-amber-500 to-orange-600" };
    if (rankings.travel?.includes(card.id)) return { label: "Best Travel Card", color: "from-sky-500 to-blue-600" };
    if (rankings.cashback?.includes(card.id)) return { label: "Highest Cashback", color: "from-emerald-500 to-teal-600" };
    return null;
  }, [card.id, rankings]);

  return (
    <article
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group relative flex flex-col h-full rounded-3xl p-4 sm:p-5 border border-[#E5E7EB] dark:border-slate-800 transition-all duration-300 bg-white dark:bg-[#1E293B] shadow-soft hover:shadow-cardHover hover:border-[#2563EB]/40 cursor-pointer overflow-hidden max-w-[420px] mx-auto w-full text-left"
      style={{
        transform: window.innerWidth < 768 ? "none" : `perspective(1000px) rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg)) translateY(var(--card-translate-y, 0px))`,
        boxShadow: `var(--card-shadow-glow, 0 4px 20px rgba(0, 0, 0, 0.05))`,
        transition: "transform 0.15s ease-out, box-shadow 0.3s ease, border-color 0.3s ease",
        transformStyle: "preserve-3d"
      }}
      onClick={() => onViewDetails && onViewDetails(card)}
    >
      {/* ── TOP RIGHT WISHLIST HEART BUTTON ── */}
      <button
        onClick={handleWishlistToggle}
        aria-label={isCardSaved ? "Remove from wishlist" : "Save to wishlist"}
        className="absolute top-4 right-4 z-30 w-8 h-8 rounded-xl bg-white dark:bg-slate-800 border border-[#E5E7EB] dark:border-slate-700 flex items-center justify-center text-xs shadow-sm hover:border-[#2563EB] transition-all cursor-pointer"
      >
        <Heart className={`w-4 h-4 ${isCardSaved ? 'fill-rose-500 text-rose-500' : 'text-[#6B7280]'}`} />
      </button>

      {/* Dynamic Cursor Spotlight Radial Glow */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl pointer-events-none z-0"
        style={{
          background: `radial-gradient(circle 200px at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(37, 99, 235, 0.06), transparent 80%)`
        }}
      />

      {/* ── CARD MEDIA skin display ── */}
      <div className="mt-2 relative z-10">
        <DebitCardVisual mode="grid" card={card} />
      </div>

      {/* ── SUBTLE INLINE CAPSULE BADGES ── */}
      <div className="flex flex-wrap gap-1.5 mt-3 select-none z-10 relative">
        {rankingBadge && (
          <span className={`bg-gradient-to-r ${rankingBadge.color} text-white text-[10px] font-semibold px-2.5 py-0.5 rounded-full shadow-sm flex items-center gap-1 select-none`}>
            <Zap className="w-3 h-3 text-white" />
            <span>{rankingBadge.label}</span>
          </span>
        )}
        {card.verificationStatus === 'Verified' && (
          <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
            <span>Verified</span>
          </span>
        )}
        {card.studentFriendly && (
          <span className="bg-[#2563EB]/10 border border-[#2563EB]/20 text-[#2563EB] dark:text-[#60A5FA] text-[10px] font-semibold px-2.5 py-0.5 rounded-full">
            Student Friendly
          </span>
        )}
        {card.minBalance === 0 && (
          <span className="bg-[#2563EB]/10 border border-[#2563EB]/20 text-[#2563EB] dark:text-[#60A5FA] text-[10px] font-semibold px-2.5 py-0.5 rounded-full">
            Zero Balance
          </span>
        )}
        {(card.category === 'Premium' || card.annualFee >= 1000) && (
          <span className="bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-[10px] font-semibold px-2.5 py-0.5 rounded-full">
            Premium
          </span>
        )}
      </div>

      {/* ── SCORE METRICS ── */}
      <div className="mt-3.5 p-3 rounded-2xl bg-[#F8FAFC] dark:bg-slate-900 border border-[#E5E7EB] dark:border-slate-800 z-10 relative">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#2563EB] animate-pulse" />
            <span className="text-[10px] font-semibold text-[#1F2937] dark:text-slate-200 tracking-wider uppercase">D.CARD SCORE™</span>
          </div>
          <span className="text-xs font-bold text-[#2563EB] dark:text-[#60A5FA]">{scoreMetrics.dcardScore} / 100</span>
        </div>

        <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden mb-2">
          <div 
            className="h-full bg-gradient-to-r from-[#2563EB] to-[#60A5FA] rounded-full transition-all duration-500" 
            style={{ width: `${scoreMetrics.dcardScore}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[10px] font-semibold text-[#6B7280] dark:text-slate-400">
          <span>AI Match: <strong className="text-emerald-600 dark:text-emerald-400">{scoreMetrics.aiMatchScore}%</strong></span>
          <span>Risk: <strong className={scoreMetrics.risk === 'High' ? 'text-rose-500' : 'text-emerald-500'}>{scoreMetrics.risk}</strong></span>
        </div>
      </div>

      {/* ── SPECIFIED FIELDS DATA TILES ── */}
      <div className="grid grid-cols-2 gap-2 my-3 select-none z-10 relative">
        <div className="p-2 rounded-xl border border-[#E5E7EB] dark:border-slate-800 bg-[#F8FAFC] dark:bg-slate-900">
          <p className="text-[9px] text-[#6B7280] dark:text-slate-400 font-semibold uppercase tracking-wider">Annual Fee</p>
          <p className="text-xs font-bold text-[#1F2937] dark:text-white truncate mt-0.5">{card.annualFee ?? "N/A"}</p>
        </div>
        
        <div className="p-2 rounded-xl border border-[#E5E7EB] dark:border-slate-800 bg-[#F8FAFC] dark:bg-slate-900">
          <p className="text-[9px] text-[#6B7280] dark:text-slate-400 font-semibold uppercase tracking-wider">Joining Fee</p>
          <p className="text-xs font-bold text-[#1F2937] dark:text-white truncate mt-0.5">{card.joiningFee ?? "N/A"}</p>
        </div>

        <div className="p-2 rounded-xl border border-[#E5E7EB] dark:border-slate-800 bg-[#F8FAFC] dark:bg-slate-900">
          <p className="text-[9px] text-[#6B7280] dark:text-slate-400 font-semibold uppercase tracking-wider">International</p>
          <p className="text-xs font-bold text-[#1F2937] dark:text-white truncate mt-0.5">
            {card.international !== undefined ? (card.international ? "Yes" : "No") : (card.internationalUsage ?? "N/A")}
          </p>
        </div>

        <div className="p-2 rounded-xl border border-[#E5E7EB] dark:border-slate-800 bg-[#F8FAFC] dark:bg-slate-900">
          <p className="text-[9px] text-[#6B7280] dark:text-slate-400 font-semibold uppercase tracking-wider">Contactless</p>
          <p className="text-xs font-bold text-[#1F2937] dark:text-white truncate mt-0.5">
            {card.contactless !== undefined ? (card.contactless ? "Yes" : "No") : "N/A"}
          </p>
        </div>

        <div className="p-2 rounded-xl border border-[#E5E7EB] dark:border-slate-800 bg-[#F8FAFC] dark:bg-slate-900">
          <p className="text-[9px] text-[#6B7280] dark:text-slate-400 font-semibold uppercase tracking-wider">Lounge Access</p>
          <p className="text-xs font-bold text-[#1F2937] dark:text-white truncate mt-0.5">{card.loungeAccess ?? "N/A"}</p>
        </div>

        <div className="p-2 rounded-xl border border-[#E5E7EB] dark:border-slate-800 bg-[#F8FAFC] dark:bg-slate-900">
          <p className="text-[9px] text-[#6B7280] dark:text-slate-400 font-semibold uppercase tracking-wider">Forex Markup</p>
          <p className="text-xs font-bold text-[#1F2937] dark:text-white truncate mt-0.5">{card.forexMarkup ?? "N/A"}</p>
        </div>

        <div className="col-span-2 p-2 rounded-xl border border-[#E5E7EB] dark:border-slate-800 bg-[#F8FAFC] dark:bg-slate-900 flex items-center justify-between">
          <div className="min-w-0 pr-2">
            <p className="text-[9px] text-[#6B7280] dark:text-slate-400 font-semibold uppercase tracking-wider">Best For</p>
            <p className="text-xs font-bold text-[#2563EB] dark:text-[#60A5FA] truncate mt-0.5">{card.bestFor ?? "N/A"}</p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-[9px] text-[#6B7280] dark:text-slate-400 font-semibold uppercase tracking-wider">Rating</p>
            <p className="text-xs font-bold text-amber-500 mt-0.5 flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>{card.rating ?? "N/A"}</span>
            </p>
          </div>
        </div>
      </div>

      {/* ── INTERACTION ROW WITH APPLY & DETAILS ── */}
      <div 
        className="flex gap-2 mt-auto pt-3 border-t border-[#E5E7EB] dark:border-slate-800 z-10 select-none relative"
        style={{ transform: "translateZ(12px)" }}
      >
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={(e) => {
            e.stopPropagation();
            if (onViewDetails) onViewDetails(card);
          }}
          className="flex-1 py-2.5 rounded-xl text-xs font-semibold border border-[#E5E7EB] dark:border-slate-700 text-[#1F2937] dark:text-white hover:border-[#2563EB] hover:text-[#2563EB] transition-all cursor-pointer"
        >
          View Specs
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleApplyClick}
          className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-[#2563EB] to-[#3B82F6] hover:opacity-95 transition-all shadow-sm cursor-pointer flex items-center justify-center gap-1"
        >
          <span>Apply Now</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={(e) => {
            e.stopPropagation();
            onCompare();
          }}
          className={`px-3 py-2.5 rounded-xl text-xs font-semibold text-white transition-all shadow-sm cursor-pointer ${
            isQueued
              ? "bg-emerald-600"
              : "bg-slate-800 dark:bg-slate-700 hover:bg-[#2563EB]"
          }`}
        >
          <Scale className="w-3.5 h-3.5" />
        </motion.button>
      </div>
    </article>
  );
}

export default memo(DebitCardCard, (prevProps, nextProps) => {
  return (
    prevProps.card?.id === nextProps.card?.id &&
    prevProps.isQueued === nextProps.isQueued &&
    prevProps.userProfile === nextProps.userProfile &&
    prevProps.activeFilters?.length === nextProps.activeFilters?.length
  );
});
