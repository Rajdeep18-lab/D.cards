import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { debitCards } from '../data/mockData';

function KotakCardVisualMini({ card }) {
  const bankTitle = String(card?.bank || 'Kotak Mahindra Bank').replace('Bank', '').trim().toUpperCase();
  const cardTitle = String(card?.cardName || 'Kotak 811 Debit Card');

  return (
    <div 
      className="relative shrink-0 w-28 sm:w-36 md:w-40 aspect-[1.586/1] rounded-xl p-2 sm:p-2.5 flex flex-col justify-between text-white select-none overflow-hidden shadow-[0_6px_20px_rgba(237,28,36,0.35)] border border-white/20 transition-transform duration-200 group-hover:scale-105"
      style={{
        background: 'linear-gradient(135deg, #2C0205 0%, #600B12 55%, #ED1C24 100%)'
      }}
    >
      {/* Holographic Subtle Glare */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-25"
        style={{
          background: 'linear-gradient(115deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0) 45%, rgba(255,255,255,0.3) 100%)'
        }}
      />
      <div className="absolute -right-4 -top-4 w-16 h-16 rounded-full bg-white/10 blur-md pointer-events-none" />

      {/* Top Row: Bank Name & Network */}
      <div className="flex justify-between items-start z-10 leading-none">
        <div className="flex flex-col">
          <span className="text-[8px] sm:text-[9.5px] font-black tracking-wider uppercase drop-shadow-xs">
            {bankTitle}
          </span>
          <span className="text-[5.5px] sm:text-[6.5px] font-bold text-white/75 tracking-widest uppercase mt-0.5">
            DEBIT
          </span>
        </div>
        <span className="italic font-black text-[#0066c4] bg-white px-1.5 py-0.5 rounded text-[7px] sm:text-[8px] border border-white/30 shadow-2xs leading-none">
          VISA
        </span>
      </div>

      {/* Center Row: Golden EMV Chip & Wave */}
      <div className="flex items-center justify-between z-10 my-0.5">
        <div 
          className="w-5 sm:w-6 h-3.5 sm:h-4 rounded-xs border border-amber-400/60 relative overflow-hidden shadow-xs"
          style={{ background: 'linear-gradient(135deg, #fef08a 0%, #f59e0b 60%, #b45309 100%)' }}
        >
          <div className="absolute inset-x-0 top-1/2 h-[0.5px] bg-black/25" />
          <div className="absolute inset-y-0 left-1/2 w-[0.5px] bg-black/25" />
        </div>
        <span className="text-white/80 text-[10px] sm:text-xs">📶</span>
      </div>

      {/* Bottom Row: Digits & Name */}
      <div className="flex flex-col z-10 leading-none">
        <span className="font-mono text-[6.5px] sm:text-[8px] font-bold text-white/90 tracking-widest">
          5412 •••• •••• 3302
        </span>
        <span className="text-[6.5px] sm:text-[7.5px] font-black uppercase text-white/95 truncate mt-0.5">
          {cardTitle}
        </span>
      </div>
    </div>
  );
}

function BannerItem({ card, onSelectCard }) {
  return (
    <div 
      onClick={onSelectCard}
      className="group flex items-center gap-3 sm:gap-5 px-4 sm:px-6 py-2 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-amber-400/40 transition-all duration-300 cursor-pointer shrink-0 shadow-sm"
    >
      {/* Prominent Card Visual */}
      <KotakCardVisualMini card={card} />

      {/* Text Copy */}
      <div className="flex flex-col text-left space-y-0.5 sm:space-y-1">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-400/15 border border-amber-400/40 text-amber-300 font-black text-[9.5px] sm:text-[11px] uppercase tracking-wider shadow-2xs">
            <span>⭐ CARD OF THE MONTH</span>
          </span>
        </div>

        <h3 className="text-sm sm:text-base font-extrabold text-white tracking-tight leading-snug group-hover:text-amber-200 transition-colors">
          Kotak 811 Debit Card
        </h3>

        <p className="text-[11px] sm:text-xs text-slate-300/90 font-normal leading-tight hidden xs:block">
          Explore the Kotak 811 Debit Card on D.CARD
        </p>
      </div>

      {/* CTA Button: [ View Card ] */}
      <div className="pl-1 sm:pl-2 shrink-0">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelectCard();
          }}
          className="px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#3B82F6] hover:from-[#1D4ED8] hover:to-[#2563EB] text-white font-extrabold text-[10px] sm:text-xs tracking-wider uppercase shadow-md hover:shadow-lg transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 whitespace-nowrap"
        >
          <span>View Card</span>
          <ArrowRight className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
        </button>
      </div>
    </div>
  );
}

export default function KotakContinuousBanner({ activeCardsList = [], onViewDetails }) {
  const navigate = useNavigate();

  // Retrieve Kotak 811 from existing verified dataset
  const kotakCard = useMemo(() => {
    const list = activeCardsList && activeCardsList.length > 0 ? activeCardsList : debitCards;
    return (
      list.find(c => c.id === 48) ||
      list.find(c => 
        String(c.bank || '').toLowerCase().includes('kotak') && 
        String(c.cardName || '').toLowerCase().includes('811')
      ) ||
      debitCards.find(c => c.id === 48) ||
      null
    );
  }, [activeCardsList]);

  if (!kotakCard) return null;

  const handleSelect = () => {
    if (onViewDetails && kotakCard) {
      onViewDetails(kotakCard);
    } else {
      navigate('/cards');
    }
  };

  // 3 items per loop set guarantees full coverage across all screen widths without gaps
  const loopUnits = [0, 1, 2];

  return (
    <aside 
      aria-label="Card of the Month Continuous Advertisement Banner"
      className="w-full bg-[#080E21] dark:bg-[#060B18] border-b border-blue-900/40 py-2 sm:py-3 overflow-hidden select-none relative z-30 shadow-md"
    >
      {/* Subtle edge fade overlays for professional marquee finish */}
      <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-r from-[#080E21] dark:from-[#060B18] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-l from-[#080E21] dark:from-[#060B18] to-transparent z-10 pointer-events-none" />

      {/* Infinite Seamless Running Ticker */}
      <div className="flex w-max animate-marquee-continuous hover:[animation-play-state:paused] items-center">
        
        {/* Set 1: First 50% */}
        <div className="flex items-center gap-6 sm:gap-10 pr-6 sm:pr-10 shrink-0">
          {loopUnits.map((idx) => (
            <BannerItem key={`loop-a-${idx}`} card={kotakCard} onSelectCard={handleSelect} />
          ))}
        </div>

        {/* Set 2: Duplicate 50% for seamless 0-gap continuous loop */}
        <div className="flex items-center gap-6 sm:gap-10 pr-6 sm:pr-10 shrink-0" aria-hidden="true">
          {loopUnits.map((idx) => (
            <BannerItem key={`loop-b-${idx}`} card={kotakCard} onSelectCard={handleSelect} />
          ))}
        </div>

      </div>
    </aside>
  );
}
