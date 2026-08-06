import { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, CheckCircle2, ArrowRight, ExternalLink } from 'lucide-react';
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
      
      {/* Container */}
      <div 
        className="w-full rounded-3xl bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#2563EB] border border-slate-700 px-6 py-10 md:p-12 relative overflow-hidden shadow-xl flex flex-col lg:flex-row items-center gap-10 md:gap-12"
      >
        {/* Soft Ambient Internal Glows */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-[#2563EB]/15 blur-[90px] pointer-events-none" />
        
        {/* Left Content Panel */}
        <div className="flex-1 text-left relative z-10 w-full space-y-5">
          {/* Badge */}
          <span className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold tracking-widest uppercase border border-amber-400/30 bg-amber-400/10 text-amber-300 shadow-sm select-none">
            <Trophy className="w-4 h-4 text-amber-300" />
            PICK OF THE MONTH
          </span>

          {/* Titles */}
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight leading-tight">
              {card.cardName}
            </h2>
            <p className="text-xs font-semibold text-[#60A5FA] uppercase tracking-widest mt-1">
              {card.bank}
            </p>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed font-normal">
            {card.benefits || "Top rated card: Zero account pressure, airport lounge privileges, and zero forex markup options."}
          </p>

          {/* Key checklist perks */}
          <div className="grid grid-cols-2 gap-y-3 gap-x-4 max-w-md pt-2">
            {[
              "Zero Balance Account Options",
              "Complimentary Airport Lounge Access",
              "Low Maintenance Fee Structure",
              "Global Forex Friendly Perks"
            ].map((perk, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-slate-200 font-normal">
                <CheckCircle2 className="w-4 h-4 text-[#60A5FA] flex-shrink-0" />
                <span>{perk}</span>
              </div>
            ))}
          </div>

          {/* Action Row */}
          <div className="pt-4 flex flex-wrap gap-3 select-none">
            <button
              onClick={() => onViewDetails && onViewDetails(card)}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#3B82F6] hover:opacity-95 text-white font-semibold text-xs tracking-wide uppercase shadow-md transition-all cursor-pointer flex items-center gap-2 active:scale-95"
            >
              <span>View Full Specs</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <a
              href={targetUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleApplyClick}
              className="px-6 py-3 rounded-xl border border-white/20 hover:bg-white/10 text-white text-xs font-semibold tracking-wide uppercase transition-all cursor-pointer flex items-center gap-2"
            >
              <span>Official Website</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Right Showcase Panel */}
        <div className="flex-shrink-0 relative w-full lg:w-[420px] h-[260px] sm:h-[300px] flex items-center justify-center overflow-visible z-10 mt-6 lg:mt-0">
          <div 
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
              transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
              transition: "transform 0.1s ease-out"
            }}
            className="w-[280px] sm:w-[320px] h-[175px] sm:h-[200px] rounded-3xl bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#2563EB] border border-amber-400/40 shadow-2xl p-6 flex flex-col justify-between relative overflow-hidden cursor-pointer text-left"
            onClick={() => onViewDetails && onViewDetails(card)}
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-semibold text-amber-300 uppercase tracking-widest block">FEATURED SELECTION</span>
                <h3 className="text-base font-bold text-white leading-tight">{card.cardName}</h3>
              </div>
              <Trophy className="w-6 h-6 text-amber-300" />
            </div>

            <div className="flex justify-between items-end">
              <div>
                <p className="text-[9px] text-slate-400 font-semibold uppercase">Issuer Bank</p>
                <p className="text-xs font-bold text-white">{card.bank}</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-amber-400 text-[#0F172A] text-[10px] font-bold uppercase tracking-wider">
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
