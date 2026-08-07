import React from 'react';

/**
 * Official Bank Brand Logo / Vector Emblem Component
 * Renders authentic SVG brand graphics & stylized badges for Indian Banks
 */
export function BankBrandLogo({ bankName = '', logoText = '', className = "w-10 h-10", variant = "default" }) {
  const lower = String(bankName || logoText).toLowerCase();

  // 1. State Bank of India (SBI Keyhole Circle Logo)
  if (lower.includes('sbi') || lower.includes('state bank')) {
    return (
      <div className={`flex items-center justify-center rounded-2xl bg-gradient-to-br from-[#003366] to-[#0077C8] text-white shadow-sm flex-shrink-0 ${className}`}>
        <svg viewBox="0 0 100 100" className="w-3/5 h-3/5 fill-current" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="10" />
          <circle cx="50" cy="35" r="15" />
          <rect x="43" y="35" width="14" height="40" rx="2" />
        </svg>
      </div>
    );
  }

  // 2. HDFC Bank (Blue Square & Red Grid Bar Emblem)
  if (lower.includes('hdfc')) {
    return (
      <div className={`flex items-center justify-center rounded-2xl bg-gradient-to-br from-[#004B8D] via-[#003366] to-[#002855] text-white shadow-sm flex-shrink-0 relative overflow-hidden ${className}`}>
        <div className="absolute inset-0 bg-[#ED232A]/20" />
        <svg viewBox="0 0 100 100" className="w-3/4 h-3/4 relative z-10" xmlns="http://www.w3.org/2000/svg">
          <rect x="15" y="15" width="70" height="70" fill="none" stroke="#FFFFFF" strokeWidth="12" rx="4" />
          <rect x="35" y="35" width="30" height="30" fill="#ED232A" />
          <rect x="42" y="10" width="16" height="80" fill="#FFFFFF" />
          <rect x="10" y="42" width="80" height="16" fill="#FFFFFF" />
          <rect x="44" y="44" width="12" height="12" fill="#004B8D" />
        </svg>
      </div>
    );
  }

  // 3. ICICI Bank (Orange Dynamic Flame / 'I' Mark)
  if (lower.includes('icici')) {
    return (
      <div className={`flex items-center justify-center rounded-2xl bg-gradient-to-br from-[#F37021] via-[#E85D04] to-[#C41230] text-white shadow-sm flex-shrink-0 ${className}`}>
        <svg viewBox="0 0 100 100" className="w-3/4 h-3/4 fill-current" xmlns="http://www.w3.org/2000/svg">
          <path d="M 25,80 C 45,85 75,70 85,25 C 70,55 40,65 25,80 Z" fill="#FFFFFF" opacity="0.3" />
          <path d="M 30,20 L 50,20 C 65,20 75,30 75,45 C 75,60 65,70 50,70 L 30,70 Z M 48,36 L 48,54 L 52,54 C 58,54 62,50 62,45 C 62,40 58,36 52,36 Z" fill="#FFFFFF" />
        </svg>
      </div>
    );
  }

  // 4. Axis Bank (Burgundy Triangle 'A' Mark)
  if (lower.includes('axis')) {
    return (
      <div className={`flex items-center justify-center rounded-2xl bg-gradient-to-br from-[#97123A] via-[#800B28] to-[#60051B] text-white shadow-sm flex-shrink-0 ${className}`}>
        <svg viewBox="0 0 100 100" className="w-3/4 h-3/4 fill-current" xmlns="http://www.w3.org/2000/svg">
          <polygon points="50,15 85,85 62,85 50,60 38,85 15,85" fill="#FFFFFF" />
          <polygon points="50,38 64,68 36,68" fill="#97123A" />
        </svg>
      </div>
    );
  }

  // 5. Kotak Mahindra Bank (Red Infiniti Curve Mark)
  if (lower.includes('kotak')) {
    return (
      <div className={`flex items-center justify-center rounded-2xl bg-gradient-to-br from-[#ED1C24] via-[#D90429] to-[#990000] text-white shadow-sm flex-shrink-0 ${className}`}>
        <svg viewBox="0 0 100 100" className="w-3/4 h-3/4 fill-current" xmlns="http://www.w3.org/2000/svg">
          <path d="M 20,50 C 20,32 35,20 50,35 C 65,50 80,68 80,50 C 80,32 65,20 50,35 C 35,50 20,68 20,50 Z" fill="none" stroke="#FFFFFF" strokeWidth="12" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

  // 6. IDFC FIRST Bank (Maroon Crest Shield)
  if (lower.includes('idfc')) {
    return (
      <div className={`flex items-center justify-center rounded-2xl bg-gradient-to-br from-[#9E1B32] via-[#801224] to-[#5C0A18] text-white shadow-sm flex-shrink-0 ${className}`}>
        <span className="font-black tracking-tighter text-white text-xs sm:text-sm">IDFC</span>
      </div>
    );
  }

  // 7. IndusInd Bank (Burgundy Red Zebu Emblem)
  if (lower.includes('indusind') || lower.includes('indus')) {
    return (
      <div className={`flex items-center justify-center rounded-2xl bg-gradient-to-br from-[#800000] via-[#A31C1C] to-[#590000] text-white shadow-sm flex-shrink-0 ${className}`}>
        <span className="font-black tracking-tighter text-white text-xs">INDUS</span>
      </div>
    );
  }

  // 8. Punjab National Bank (PNB Red & Gold Ribbon)
  if (lower.includes('punjab') || lower.includes('pnb')) {
    return (
      <div className={`flex items-center justify-center rounded-2xl bg-gradient-to-br from-[#A31D24] via-[#C9252D] to-[#801016] text-white shadow-sm flex-shrink-0 ${className}`}>
        <div className="w-full h-full flex items-center justify-center font-black text-amber-300 text-xs">PNB</div>
      </div>
    );
  }

  // 9. Bank of Baroda (Baroda Sun Orange emblem)
  if (lower.includes('baroda') || lower.includes('bob')) {
    return (
      <div className={`flex items-center justify-center rounded-2xl bg-gradient-to-br from-[#F26522] via-[#E54E00] to-[#B33C00] text-white shadow-sm flex-shrink-0 ${className}`}>
        <svg viewBox="0 0 100 100" className="w-3/4 h-3/4 fill-current" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="22" fill="#FFFFFF" />
          <path d="M 50,10 L 50,22 M 50,78 L 50,90 M 10,50 L 22,50 M 78,50 L 90,50 M 22,22 L 30,30 M 70,70 L 78,78 M 22,78 L 30,70 M 70,30 L 78,22" stroke="#FFFFFF" strokeWidth="8" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

  // 10. Canara Bank (Canara Interlocking Cyan Triangles)
  if (lower.includes('canara')) {
    return (
      <div className={`flex items-center justify-center rounded-2xl bg-gradient-to-br from-[#0072CE] via-[#00529B] to-[#00386B] text-white shadow-sm flex-shrink-0 ${className}`}>
        <svg viewBox="0 0 100 100" className="w-3/4 h-3/4 fill-current" xmlns="http://www.w3.org/2000/svg">
          <polygon points="20,75 50,25 80,75" fill="none" stroke="#FFD100" strokeWidth="12" />
          <polygon points="35,35 65,85 95,35" fill="none" stroke="#FFFFFF" strokeWidth="10" />
        </svg>
      </div>
    );
  }

  // 11. Union Bank of India (Union Blue/Red Ribbon)
  if (lower.includes('union bank')) {
    return (
      <div className={`flex items-center justify-center rounded-2xl bg-gradient-to-br from-[#004990] via-[#003366] to-[#E31B23] text-white shadow-sm flex-shrink-0 ${className}`}>
        <span className="font-black text-white text-xs">UBI</span>
      </div>
    );
  }

  // 12. AU Small Finance Bank (AU Orange/Red Crest)
  if (lower.includes('au small') || lower.includes('au sfb')) {
    return (
      <div className={`flex items-center justify-center rounded-2xl bg-gradient-to-br from-[#E30613] via-[#F36F21] to-[#B3000A] text-white shadow-sm flex-shrink-0 ${className}`}>
        <span className="font-black text-white text-xs">AU</span>
      </div>
    );
  }

  // 13. Fi Money / Jupiter / Niyo (Fintech Teal & Indigo)
  if (lower.includes('fi money') || lower === 'fi') {
    return (
      <div className={`flex items-center justify-center rounded-2xl bg-gradient-to-br from-[#00D084] via-[#059669] to-[#047857] text-white shadow-sm flex-shrink-0 ${className}`}>
        <span className="font-black text-white text-xs">Fi</span>
      </div>
    );
  }
  if (lower.includes('jupiter')) {
    return (
      <div className={`flex items-center justify-center rounded-2xl bg-gradient-to-br from-[#FF4E00] to-[#EC9F05] text-white shadow-sm flex-shrink-0 ${className}`}>
        <span className="font-black text-white text-xs">JUP</span>
      </div>
    );
  }
  if (lower.includes('niyo')) {
    return (
      <div className={`flex items-center justify-center rounded-2xl bg-gradient-to-br from-[#6366F1] to-[#4F46E5] text-white shadow-sm flex-shrink-0 ${className}`}>
        <span className="font-black text-white text-xs">NIYO</span>
      </div>
    );
  }

  // Fallback: Styled Initials Badge with Dynamic Hash Color
  const cleanText = logoText || bankName.split(" ").map(w => w[0]).join("").slice(0, 3).toUpperCase() || "BANK";
  
  return (
    <div className={`flex items-center justify-center rounded-2xl bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] text-white font-black text-xs shadow-xs flex-shrink-0 ${className}`}>
      {cleanText}
    </div>
  );
}

export default BankBrandLogo;
