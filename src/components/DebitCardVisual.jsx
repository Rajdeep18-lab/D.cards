import React, { useState } from 'react';
import { motion } from 'framer-motion';

/* Premium Bank Brand Gradients & Color Accents */
function getBankBrandSkin(bank) {
  const bankName = String(bank || '').toLowerCase();
  let gradient = 'linear-gradient(135deg, #1E0B16 0%, #7A0F52 50%, #C21875 100%)';
  let accent = '#C21875';
  let shadow = 'rgba(194, 24, 117, 0.4)';

  if (bankName.includes("hdfc")) {
    gradient = 'linear-gradient(135deg, #1A0D3E 0%, #30105C 60%, #631B99 100%)';
    accent = '#d946ef';
    shadow = 'rgba(217, 70, 239, 0.35)';
  } else if (bankName.includes("icici")) {
    gradient = 'linear-gradient(135deg, #091936 0%, #152E66 60%, #2A66D9 100%)';
    accent = '#3b82f6';
    shadow = 'rgba(59, 130, 246, 0.35)';
  } else if (bankName.includes("sbi") || bankName.includes("state bank")) {
    gradient = 'linear-gradient(135deg, #071733 0%, #004F8A 60%, #009DC4 100%)';
    accent = '#00b4d8';
    shadow = 'rgba(0, 180, 216, 0.35)';
  } else if (bankName.includes("axis")) {
    gradient = 'linear-gradient(135deg, #240516 0%, #4D092F 60%, #8C0C53 100%)';
    accent = '#ec4899';
    shadow = 'rgba(236, 72, 153, 0.35)';
  } else if (bankName.includes("idfc")) {
    gradient = 'linear-gradient(135deg, #24060B 0%, #4C131D 60%, #8A2031 100%)';
    accent = '#ef4444';
    shadow = 'rgba(239, 68, 68, 0.35)';
  } else if (bankName.includes("kotak")) {
    gradient = 'linear-gradient(135deg, #2C0205 0%, #600B12 60%, #A80000 100%)';
    accent = '#f87171';
    shadow = 'rgba(248, 113, 113, 0.35)';
  } else if (bankName.includes("indusind")) {
    gradient = 'linear-gradient(135deg, #2E1803 0%, #5C3209 60%, #A15917 100%)';
    accent = '#fb923c';
    shadow = 'rgba(251, 146, 60, 0.35)';
  } else if (bankName.includes("fi money") || bankName.includes("niyo") || bankName.includes("federal")) {
    gradient = 'linear-gradient(135deg, #031710 0%, #073827 60%, #0E9F6E 100%)';
    accent = '#10B981';
    shadow = 'rgba(16, 185, 129, 0.35)';
  }

  return { gradient, accent, shadow };
}

function DebitCardVisual({ card, mode = "grid", finish = "classic", tilt = { x: 0, y: 0 } }) {
  const [hasError, setHasError] = useState(true); // Default to vector mockup for high-fidelity startup-grade UX
  const { gradient: brandGradient, shadow } = getBankBrandSkin(card.bank || "");

  const networkLabel = { Visa: "VISA", Mastercard: "Mastercard", RuPay: "RuPay" }[card.network] ?? "VISA";

  // Dynamic overrides for details mode finishes
  const getCardSkinGradient = () => {
    if (mode !== "details") return brandGradient;
    switch (finish) {
      case "obsidian": return 'linear-gradient(135deg, #1C1C24 0%, #0B0B0E 60%, #030304 100%)';
      case "gold": return 'linear-gradient(135deg, #C5A059 0%, #FDF8C7 25%, #C09238 50%, #FEF9C7 75%, #B3812C 100%)';
      case "holographic": return 'linear-gradient(135deg, #ff0055 0%, #5500ff 25%, #00ffff 50%, #00ff55 75%, #ff0055 100%)';
      case "classic":
      default: return brandGradient;
    }
  };

  const getBorderColor = () => {
    if (mode !== "details") return "border-white/10";
    switch (finish) {
      case "obsidian": return 'border-[#555566]/35';
      case "gold": return 'border-[#FDF8C7]/35';
      case "holographic": return 'border-[#00ffff]/35';
      default: return 'border-white/10';
    }
  };

  // Dimensions based on render mode
  let dimensions = "w-full aspect-[1.586/1] rounded-3xl mb-4 p-4 sm:p-5 md:p-6 flex flex-col justify-between";
  if (mode === "details") {
    dimensions = "w-full aspect-[1.586/1] max-w-[420px] rounded-3xl p-6 md:p-8 flex flex-col justify-between";
  } else if (mode === "compare") {
    dimensions = "w-full aspect-[1.586/1] max-w-[210px] mx-auto rounded-2xl p-4 flex flex-col justify-between";
  }

  // Render Ultra-Compact Wishlist Thumbnail Mode
  if (mode === "wishlist") {
    return (
      <div 
        className="h-10 w-16 rounded-lg relative overflow-hidden flex flex-col justify-between p-1.5 border border-white/10 select-none flex-shrink-0 shadow"
        style={{
          background: getCardSkinGradient(),
          boxShadow: `0 4px 12px ${shadow}`
        }}
      >
        {/* Shimmer sweep */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
        <div className="flex justify-between items-start text-[5.5px] font-black uppercase text-white/95 leading-none">
          <span>{String(card?.bank || "").replace("Bank", "").trim().slice(0, 4)}</span>
        </div>
        <div className="flex justify-between items-end text-[5px] font-extrabold text-white/80 leading-none">
          <span className="truncate max-w-[70%]">{String(card?.cardName || "").split(" ")[0]}</span>
          <span className="text-[4.5px] opacity-75 font-black uppercase">{networkLabel.slice(0, 3)}</span>
        </div>
      </div>
    );
  }

  // Render Premium Realistic Vector Fallback (Serious Banking UI)
  return (
    <div
      className={`relative overflow-hidden flex flex-col justify-between text-white border select-none transition-all duration-500 shadow-2xl ${getBorderColor()} ${dimensions}`}
      style={{
        background: getCardSkinGradient(),
        boxShadow: mode === "details" 
          ? `0 24px 60px ${shadow}` 
          : `0 14px 35px ${shadow}`,
        backfaceVisibility: mode === "details" ? "hidden" : "visible"
      }}
    >
      {/* Glare & Glass Reflection Diagonal Sweep */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/8 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1200 ease-out pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-white/8 via-transparent to-black/35 pointer-events-none" />

      {/* Decorative vector overlays */}
      <div className="absolute -right-8 -top-8 w-36 h-36 rounded-full bg-white/5 blur-2xl pointer-events-none" />
      <div className="absolute -left-4 bottom-0 w-24 h-24 rounded-full bg-white/5 blur-xl pointer-events-none" />

      {/* Top Row: Bank branding & Network badge */}
      <div className="flex justify-between items-start z-10">
        <div className="flex flex-col min-w-0">
          <span className={`tracking-wide font-black uppercase drop-shadow-sm truncate leading-tight font-serif ${mode === 'compare' ? 'text-[10px]' : mode === 'details' ? 'text-base md:text-lg' : 'text-sm sm:text-base md:text-lg'}`}>
            {String(card?.bank || "").replace("Bank", "").trim() || "Unknown Bank"}
          </span>
          {mode !== 'compare' && (
            <span className={`text-[#ffffff80] font-black tracking-widest leading-none mt-1 ${mode === 'details' ? 'text-[10px] md:text-xs' : 'text-[9px] sm:text-[10px]'}`}>PREMIUM MEMBER</span>
          )}
        </div>

        {/* Dynamic Network Logo Badge */}
        {networkLabel === 'RuPay' ? (
          <span className={`font-extrabold italic bg-gradient-to-r from-[#FF9933] via-[#FFFFFF] to-[#128807] px-2.5 py-0.5 rounded text-black flex items-center gap-0.5 border border-white/20 select-none shadow-sm leading-none font-sans ${mode === 'compare' ? 'text-[8px]' : 'text-[9.5px]'}`}>
            <span className="text-[#000080] font-black mr-0.5">🇮🇳</span>RuPay
          </span>
        ) : networkLabel === 'Mastercard' ? (
          <div className="flex items-center gap-0.5 select-none bg-black/30 px-1.5 py-0.5 rounded border border-white/10 shadow-sm leading-none font-mono">
            <span className={`${mode === 'compare' ? 'w-2 h-2 mr-[-4px]' : 'w-2.5 h-2.5 mr-[-5px]'} rounded-full bg-red-500 inline-block opacity-90`} />
            <span className={`${mode === 'compare' ? 'w-2 h-2' : 'w-2.5 h-2.5'} rounded-full bg-amber-500 inline-block opacity-90`} />
            <span className={`font-black text-white ml-1 font-mono tracking-tighter ${mode === 'compare' ? 'text-[7.5px]' : 'text-[8.5px]'}`}>MC</span>
          </div>
        ) : (
          <span className={`italic font-black text-[#0066c4] bg-white px-2 py-0.5 rounded border border-slate-200/50 shadow-sm leading-none flex items-center select-none font-sans ${mode === 'compare' ? 'text-[8px]' : 'text-[10px]'}`}>
            <span className="text-[#ffa500] mr-0.5">⚡</span>VISA
          </span>
        )}
      </div>

      {/* Center Row: Golden Plated EMV 3D Chip & Contactless sign */}
      <div className="flex items-center justify-between z-10 my-1.5">
        {/* EMV Golden 3D Chip Vector */}
        <div 
          className={`rounded border border-[#f59e0b]/40 relative overflow-hidden shadow-[0_2px_6px_rgba(0,0,0,0.4)] flex-shrink-0 flex flex-wrap p-0.5 ${mode === 'compare' ? 'w-8 h-6' : mode === 'details' ? 'w-14 h-10' : 'w-11 h-8'}`}
          style={{ background: 'linear-gradient(135deg, #fef08a 0%, #f59e0b 60%, #b45309 100%)' }}
        >
          <div className="w-[45%] h-[40%] border-r border-b border-black/15" />
          <div className="w-[45%] h-[40%] border-b border-black/15" />
          <div className="w-[45%] h-[45%] border-r border-black/15" />
          <div className="w-[45%] h-[45%]" />
          <div className="absolute top-1/2 left-0 w-full h-[1px] bg-black/10" />
          <div className="absolute top-0 left-1/2 w-[1px] h-full bg-black/10" />
        </div>
        
        {mode !== 'compare' && (
          <span className="text-white/60 text-base pointer-events-none filter drop-shadow">📶</span>
        )}
      </div>

      {/* Bottom Row: Embossed card number & Card Name */}
      <div className="flex flex-col z-10">
        <p className={`font-mono font-bold drop-shadow-[0_1.5px_2px_rgba(0,0,0,0.65)] ${mode === 'compare' ? 'text-[10px] tracking-[0.12em]' : mode === 'details' ? 'text-lg md:text-xl tracking-[0.18em]' : 'text-sm sm:text-base tracking-[0.16em]'}`}>
          5412 8899 0041 3302
        </p>
        
        <div className="flex justify-between items-end mt-2 text-white/80 font-bold select-none leading-none">
          <span className={`uppercase truncate max-w-[70%] drop-shadow-sm font-sans tracking-wide font-black ${mode === 'compare' ? 'text-[8.0px]' : mode === 'details' ? 'text-xs md:text-sm' : 'text-xs sm:text-sm'}`}>
            {card.cardName}
          </span>
          {mode !== 'compare' && (
            <span className={`opacity-75 font-black uppercase tracking-wider ${mode === 'details' ? 'text-[10px] md:text-xs' : 'text-[9px] sm:text-[10px]'}`}>Debit Privilege</span>
          )}
        </div>
      </div>

      {/* Shimmer sweeping bottom edge line */}
      <div className="absolute bottom-0 left-5 right-5 h-[1.5px] bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none" />
    </div>
  );
}

export default React.memo(DebitCardVisual);
