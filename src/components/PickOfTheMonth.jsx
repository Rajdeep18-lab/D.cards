import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { referralService } from '../services/referralService';

function PickOfTheMonth({ card, onViewDetails }) {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const { user, openAuthModal } = useAuth();

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const xVal = (e.clientX - rect.left) / rect.width - 0.5;
    const yVal = (e.clientY - rect.top) / rect.height - 0.5;
    setRotateX(yVal * -20);
    setRotateY(xVal * 20);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  if (!card) return null;

  const targetUrl = card.officialSource || card.applyUrl || "#";

  const handleApplyClick = (e) => {
    if (!user) {
      e.preventDefault();
      openAuthModal('required', `apply-${card.id}`);
      return;
    }
    referralService.logReferralClick(user.id, card, targetUrl);
  };

  return (
    <section className="mb-14 scroll-mt-24 select-none">
      
      {/* ── Majestic Full Width Dark Gradient Container ── */}
      <div 
        className="w-full rounded-[40px] bg-gradient-to-br from-[#0e0714] via-[#1a0c24] to-[#0b040f] border border-secondary/25 px-6 py-10 md:p-12 relative overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.85)] flex flex-col lg:flex-row items-center gap-10 md:gap-12"
      >
        {/* Soft Ambient Internal Glows */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-secondary/10 blur-[90px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full bg-[#f59e0b]/5 blur-[70px] pointer-events-none" />
        
        {/* Glassmorphism subtle grid grid */}
        <div className="absolute inset-0 opacity-[0.02] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

        {/* ── Left Content Panel ── */}
        <div className="flex-1 text-left relative z-10 w-full">
          {/* Badge */}
          <span className="mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[9.5px] font-black tracking-widest uppercase border border-amber-500/35 bg-amber-500/10 text-amber-400 shadow-[0_2px_15px_rgba(245,158,11,0.1)] shimmer-effect select-none">
            🏆 PICK OF THE MONTH
          </span>

          {/* Titles */}
          <h2 className="text-3xl sm:text-4.5xl font-black font-serif text-white tracking-tight leading-tight mt-3">
            {card.cardName}
          </h2>
          <p className="text-xs font-black text-secondary dark:text-roseGold uppercase tracking-widest font-sans mt-1.5">
            {card.bank}
          </p>

          <p className="text-sm text-slate-350 max-w-xl mt-5 leading-relaxed font-semibold">
            {card.benefits || "India's top discovery: Zero account pressure, global traveler zero-forex benefits, and premium diagnostics."}
          </p>

          {/* Key checklist perks */}
          <div className="grid grid-cols-2 gap-y-3.5 gap-x-4 mt-8 max-w-md">
            {[
              { label: "Zero Balance Account", icon: "✓" },
              { label: "Premium Airport Lounge Access", icon: "✓" },
              { label: "Ultra Low Maintenance Charges", icon: "✓" },
              { label: "Travel & Global Forex Friendly", icon: "✓" }
            ].map((perk, i) => (
              <div key={i} className="flex items-center gap-2.5 text-xs text-slate-200 font-bold">
                <span className="w-5 h-5 rounded-full bg-gradient-to-r from-secondary to-primary flex items-center justify-center text-[10px] text-white font-black flex-shrink-0">
                  {perk.icon}
                </span>
                <span>{perk.label}</span>
              </div>
            ))}
          </div>

          {/* Action Row */}
          <div className="mt-10 flex flex-wrap gap-4 select-none">
            <button
              onClick={() => onViewDetails && onViewDetails(card)}
              className="px-8 py-3.5 rounded-full bg-gradient-to-r from-secondary to-primary hover:brightness-110 active:scale-95 text-white font-extrabold text-xs tracking-wider uppercase shadow-[0_6px_20px_rgba(194,24,117,0.35)] transition-all cursor-pointer"
            >
              View Full Specs 🔎
            </button>

            <a
              href={targetUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleApplyClick}
              className="px-8 py-3.5 rounded-full border border-white/20 hover:bg-white/5 hover:border-white/40 text-slate-300 text-xs font-extrabold tracking-wide uppercase transition-all cursor-pointer flex items-center justify-center"
            >
              Official Website 🔗
            </a>
          </div>
        </div>

        {/* ── Right Showcase Panel ── */}
        <div className="flex-shrink-0 relative w-full lg:w-[420px] h-[280px] sm:h-[340px] flex items-center justify-center overflow-visible z-10 mt-6 lg:mt-0">
          <div 
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
              transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
              transition: "transform 0.1s ease-out"
            }}
            className="w-[280px] sm:w-[320px] h-[175px] sm:h-[200px] rounded-3xl bg-gradient-to-br from-[#1E0B16] via-[#7A0F52] to-[#C21875] border-2 border-amber-400/40 shadow-[0_20px_60px_rgba(194,24,117,0.45)] p-5 flex flex-col justify-between relative overflow-hidden cursor-pointer"
            onClick={() => onViewDetails && onViewDetails(card)}
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-black text-amber-300 uppercase tracking-widest">D.CARD PICK</span>
                <h3 className="text-base font-black text-white font-serif">{card.cardName}</h3>
              </div>
              <span className="text-xl">🏆</span>
            </div>

            <div className="flex justify-between items-end">
              <div>
                <p className="text-[9px] text-gray-300 font-bold uppercase">Issuer Bank</p>
                <p className="text-xs font-extrabold text-white">{card.bank}</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-amber-400 text-[#1E0B16] text-[10px] font-black uppercase tracking-wider">
                99% Match
              </span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

export default PickOfTheMonth;
