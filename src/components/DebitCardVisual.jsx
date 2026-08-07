import React, { useState, useRef } from 'react';

/* Premium Bank Brand Gradients & Color Accents */
function getBankBrandSkin(bank) {
  const bankName = String(bank || '').toLowerCase();
  let gradient = 'linear-gradient(135deg, #0B3D91 0%, #1E3A8A 50%, #2563EB 100%)';
  let accent = '#2563EB';
  let shadow = 'rgba(37, 99, 235, 0.4)';

  if (bankName.includes("hdfc")) {
    gradient = 'linear-gradient(135deg, #0A2540 0%, #004B8D 60%, #2563EB 100%)';
    accent = '#2563EB';
    shadow = 'rgba(37, 99, 235, 0.35)';
  } else if (bankName.includes("icici")) {
    gradient = 'linear-gradient(135deg, #091936 0%, #152E66 60%, #2A66D9 100%)';
    accent = '#3B82F6';
    shadow = 'rgba(59, 130, 246, 0.35)';
  } else if (bankName.includes("sbi") || bankName.includes("state bank")) {
    gradient = 'linear-gradient(135deg, #002244 0%, #003366 60%, #0077C8 100%)';
    accent = '#0077C8';
    shadow = 'rgba(0, 119, 200, 0.35)';
  } else if (bankName.includes("axis")) {
    gradient = 'linear-gradient(135deg, #240516 0%, #4D092F 60%, #97123A 100%)';
    accent = '#97123A';
    shadow = 'rgba(151, 18, 58, 0.35)';
  } else if (bankName.includes("idfc")) {
    gradient = 'linear-gradient(135deg, #24060B 0%, #4C131D 60%, #9E1B32 100%)';
    accent = '#9E1B32';
    shadow = 'rgba(158, 27, 50, 0.35)';
  } else if (bankName.includes("kotak")) {
    gradient = 'linear-gradient(135deg, #2C0205 0%, #600B12 60%, #ED1C24 100%)';
    accent = '#ED1C24';
    shadow = 'rgba(237, 28, 36, 0.35)';
  } else if (bankName.includes("indusind")) {
    gradient = 'linear-gradient(135deg, #2E1803 0%, #5C3209 60%, #800000 100%)';
    accent = '#800000';
    shadow = 'rgba(128, 0, 0, 0.35)';
  } else if (bankName.includes("fi money") || bankName.includes("niyo") || bankName.includes("federal") || bankName.includes("jupiter") || bankName.includes("freo")) {
    gradient = 'linear-gradient(135deg, #031710 0%, #073827 60%, #059669 100%)';
    accent = '#059669';
    shadow = 'rgba(5, 150, 105, 0.35)';
  } else if (bankName.includes("baroda") || bankName.includes("bob")) {
    gradient = 'linear-gradient(135deg, #2D0E03 0%, #612106 60%, #F26522 100%)';
    accent = '#F26522';
    shadow = 'rgba(242, 101, 34, 0.35)';
  } else if (bankName.includes("punjab") || bankName.includes("pnb")) {
    gradient = 'linear-gradient(135deg, #1C0A19 0%, #4A0E2E 60%, #A31D24 100%)';
    accent = '#A31D24';
    shadow = 'rgba(163, 29, 36, 0.35)';
  } else if (bankName.includes("canara")) {
    gradient = 'linear-gradient(135deg, #031E2E 0%, #064566 60%, #0072CE 100%)';
    accent = '#0072CE';
    shadow = 'rgba(0, 114, 206, 0.35)';
  }

  return { gradient, accent, shadow };
}

function DebitCardVisual({ card, mode = "grid", finish = "classic" }) {
  const cardRef = useRef(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const { gradient: brandGradient, shadow } = getBankBrandSkin(card.bank || "");

  const networkLabel = { Visa: "VISA", Mastercard: "Mastercard", RuPay: "RuPay" }[card.network] ?? "VISA";

  const handleMouseMove = (e) => {
    if (!cardRef.current || mode === "wishlist") return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const rX = ((mouseY - height / 2) / height) * -14;
    const rY = ((mouseX - width / 2) / width) * 14;

    setRotateX(rX);
    setRotateY(rY);
    setGlarePos({
      x: (mouseX / width) * 100,
      y: (mouseY / height) * 100,
    });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
  };

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
    if (mode !== "details") return "border-white/20 dark:border-slate-700/60";
    switch (finish) {
      case "obsidian": return 'border-[#555566]/35';
      case "gold": return 'border-[#FDF8C7]/35';
      case "holographic": return 'border-[#00ffff]/35';
      default: return 'border-white/20 dark:border-slate-700/60';
    }
  };

  let dimensions = "w-full aspect-[1.586/1] rounded-3xl mb-4 p-4 sm:p-5 md:p-6 flex flex-col justify-between";
  if (mode === "details") {
    dimensions = "w-full aspect-[1.586/1] max-w-[420px] rounded-3xl p-6 md:p-8 flex flex-col justify-between";
  } else if (mode === "compare") {
    dimensions = "w-full aspect-[1.586/1] max-w-[210px] mx-auto rounded-2xl p-4 flex flex-col justify-between";
  }

  if (mode === "wishlist") {
    return (
      <div 
        className="h-10 w-16 rounded-lg relative overflow-hidden flex flex-col justify-between p-1.5 border border-white/10 select-none flex-shrink-0 shadow"
        style={{
          background: getCardSkinGradient(),
          boxShadow: `0 4px 12px ${shadow}`
        }}
      >
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

  return (
    <div className="perspective-1000 w-full">
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`relative overflow-hidden flex flex-col justify-between text-white border select-none transition-transform duration-200 ease-out shadow-2xl gpu-layer ${getBorderColor()} ${dimensions}`}
        style={{
          background: getCardSkinGradient(),
          transform: isHovered 
            ? `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02) translateZ(10px)` 
            : `rotateX(0deg) rotateY(0deg) scale(1) translateZ(0px)`,
          transformStyle: "preserve-3d",
          boxShadow: isHovered 
            ? `0 30px 70px ${shadow}` 
            : (mode === "details" ? `0 24px 60px ${shadow}` : `0 14px 35px ${shadow}`),
        }}
      >
        {/* Holographic Dynamic Glare Sweep */}
        <div 
          className="absolute inset-0 pointer-events-none transition-opacity duration-300 z-20"
          style={{
            opacity: isHovered ? 0.35 : 0.1,
            background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0) 60%)`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-black/40 pointer-events-none" />

        {/* Decorative vector ambient glows */}
        <div className="absolute -right-8 -top-8 w-36 h-36 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute -left-4 bottom-0 w-24 h-24 rounded-full bg-white/10 blur-xl pointer-events-none" />

        {/* Top Row: Bank branding & Network badge */}
        <div className="flex justify-between items-start z-10">
          <div className="flex flex-col min-w-0">
            <span className={`tracking-wide font-black uppercase drop-shadow-sm truncate leading-tight ${mode === 'compare' ? 'text-[10px]' : mode === 'details' ? 'text-base md:text-lg' : 'text-sm sm:text-base md:text-lg'}`}>
              {String(card?.bank || "").replace("Bank", "").trim() || "Unknown Bank"}
            </span>
            {mode !== 'compare' && (
              <span className="text-[#ffffff90] font-bold tracking-widest leading-none mt-1 text-[9px] sm:text-[10px]">
                DEBIT PRIVILEGE
              </span>
            )}
          </div>

          {/* Dynamic Network Badge */}
          {networkLabel === 'RuPay' ? (
            <span className={`font-extrabold italic bg-gradient-to-r from-[#FF9933] via-[#FFFFFF] to-[#128807] px-2.5 py-0.5 rounded text-black flex items-center gap-0.5 border border-white/20 select-none shadow-sm leading-none font-sans ${mode === 'compare' ? 'text-[8px]' : 'text-[9.5px]'}`}>
              <span className="text-[#000080] font-black mr-0.5">🇮🇳</span>RuPay
            </span>
          ) : networkLabel === 'Mastercard' ? (
            <div className="flex items-center gap-0.5 select-none bg-black/40 px-2 py-0.5 rounded-md border border-white/20 shadow-sm leading-none">
              <span className={`${mode === 'compare' ? 'w-2 h-2 mr-[-4px]' : 'w-2.5 h-2.5 mr-[-5px]'} rounded-full bg-red-500 inline-block opacity-90`} />
              <span className={`${mode === 'compare' ? 'w-2 h-2' : 'w-2.5 h-2.5'} rounded-full bg-amber-500 inline-block opacity-90`} />
              <span className={`font-black text-white ml-1 tracking-tighter ${mode === 'compare' ? 'text-[7.5px]' : 'text-[8.5px]'}`}>MC</span>
            </div>
          ) : (
            <span className={`italic font-black text-[#0066c4] bg-white px-2 py-0.5 rounded border border-slate-200/50 shadow-sm leading-none flex items-center select-none font-sans ${mode === 'compare' ? 'text-[8px]' : 'text-[10px]'}`}>
              <span className="text-[#ffa500] mr-0.5">⚡</span>VISA
            </span>
          )}
        </div>

        {/* Center Row: EMV Metallic Chip & Contactless sign */}
        <div className="flex items-center justify-between z-10 my-1.5">
          {/* EMV Golden 3D Chip Vector */}
          <div 
            className={`rounded-md border border-[#f59e0b]/50 relative overflow-hidden shadow-[0_3px_8px_rgba(0,0,0,0.4)] flex-shrink-0 flex flex-wrap p-0.5 ${mode === 'compare' ? 'w-8 h-6' : mode === 'details' ? 'w-14 h-10' : 'w-11 h-8'}`}
            style={{ background: 'linear-gradient(135deg, #fef08a 0%, #f59e0b 60%, #b45309 100%)' }}
          >
            <div className="w-[45%] h-[40%] border-r border-b border-black/20" />
            <div className="w-[45%] h-[40%] border-b border-black/20" />
            <div className="w-[45%] h-[45%] border-r border-black/20" />
            <div className="w-[45%] h-[45%]" />
            <div className="absolute top-1/2 left-0 w-full h-[1px] bg-black/15" />
            <div className="absolute top-0 left-1/2 w-[1px] h-full bg-black/15" />
          </div>
          
          {mode !== 'compare' && (
            <span className="text-white/80 text-sm sm:text-base pointer-events-none filter drop-shadow">📶</span>
          )}
        </div>

        {/* Bottom Row: Embossed Card Number & Name */}
        <div className="flex flex-col z-10">
          <p className={`font-mono font-bold drop-shadow-[0_1.5px_3px_rgba(0,0,0,0.7)] ${mode === 'compare' ? 'text-[10px] tracking-[0.12em]' : mode === 'details' ? 'text-lg md:text-xl tracking-[0.18em]' : 'text-sm sm:text-base tracking-[0.16em]'}`}>
            5412 •••• •••• 3302
          </p>
          
          <div className="flex justify-between items-end mt-1.5 text-white/90 font-bold select-none leading-none">
            <span className={`uppercase truncate max-w-[75%] drop-shadow-sm tracking-wide font-black ${mode === 'compare' ? 'text-[8px]' : mode === 'details' ? 'text-xs md:text-sm' : 'text-xs sm:text-sm'}`}>
              {card.cardName}
            </span>
            {mode !== 'compare' && (
              <span className="text-[9px] font-black uppercase text-white/70 tracking-wider">MEMBER</span>
            )}
          </div>
        </div>

        {/* Shimmer sweeping bottom edge line */}
        <div className="absolute bottom-0 left-5 right-5 h-[1.5px] bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />
      </div>
    </div>
  );
}

export default React.memo(DebitCardVisual);
