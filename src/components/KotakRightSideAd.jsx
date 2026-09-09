import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, ShieldCheck, Zap, CreditCard, ChevronRight } from 'lucide-react';
import { debitCards } from '../data/mockData';

function KotakDebitCardVerticalVisual({ card }) {
  const bankTitle = String(card?.bank || 'Kotak Mahindra').toUpperCase();

  return (
    <div className="relative w-full max-w-[330px] aspect-[1.586/1] rounded-2xl p-5 flex flex-col justify-between text-white select-none overflow-hidden shadow-[0_16px_35px_rgba(237,28,36,0.3)] border border-white/25 transition-all duration-300 group-hover:scale-[1.03] group-hover:shadow-[0_22px_45px_rgba(237,28,36,0.45)] group-hover:-translate-y-1 mx-auto"
      style={{
        background: 'linear-gradient(135deg, #1C0103 0%, #4D070D 40%, #A50E16 80%, #ED1C24 100%)'
      }}
    >
      {/* Holographic Subtle Glare Sweep */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          background: 'linear-gradient(115deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0) 45%, rgba(255,255,255,0.35) 100%)'
        }}
      />
      
      {/* Ambient background blur orbs */}
      <div className="absolute -right-6 -top-6 w-28 h-28 rounded-full bg-white/10 blur-xl pointer-events-none" />
      <div className="absolute -left-6 -bottom-6 w-24 h-24 rounded-full bg-red-400/20 blur-lg pointer-events-none" />

      {/* Top Row: Bank Name, 811 mark & Visa */}
      <div className="flex justify-between items-start z-10">
        <div className="flex flex-col text-left">
          <span className="text-[11px] sm:text-xs font-black tracking-wider uppercase drop-shadow-md text-white">
            {bankTitle}
          </span>
          <span className="text-[8px] font-bold text-red-200 tracking-widest uppercase mt-0.5">
            DEBIT PRIVILEGE
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* 811 badge inside card */}
          <span className="font-black text-xs tracking-tight text-white bg-black/40 px-2 py-0.5 rounded border border-white/20 shadow-xs">
            811
          </span>
          {/* VISA logo */}
          <span className="italic font-black text-[#0066c4] bg-white px-2 py-0.5 rounded text-[10px] sm:text-[11px] border border-white/40 shadow-xs leading-none">
            VISA
          </span>
        </div>
      </div>

      {/* Center Row: Golden EMV Chip & Contactless */}
      <div className="flex items-center justify-between z-10 my-2">
        <div 
          className="w-10 h-7 rounded-md border border-amber-300/80 relative overflow-hidden shadow-sm flex flex-wrap p-0.5"
          style={{ background: 'linear-gradient(135deg, #fef08a 0%, #f59e0b 60%, #b45309 100%)' }}
        >
          <div className="w-[45%] h-[45%] border-r border-b border-black/30" />
          <div className="w-[45%] h-[45%] border-b border-black/30" />
          <div className="w-[45%] h-[45%] border-r border-black/30" />
          <div className="w-[45%] h-[45%] border-black/30" />
        </div>

        <div className="flex items-center gap-1.5 text-white/90">
          <span className="text-sm">📶</span>
          <span className="text-[9px] font-semibold text-white/80 hidden sm:inline">Tap & Pay</span>
        </div>
      </div>

      {/* Bottom Row: Digits & Name */}
      <div className="flex justify-between items-end z-10">
        <div className="flex flex-col text-left">
          <span className="font-mono text-xs sm:text-sm font-bold text-white/90 tracking-widest drop-shadow-xs">
            5412 •••• •••• 8110
          </span>
          <span className="text-[10px] sm:text-[11px] font-extrabold uppercase text-white/95 tracking-wide mt-1">
            KOTAK 811 DEBIT
          </span>
        </div>

        <span className="text-[9px] font-black text-white/70 uppercase tracking-widest font-mono">
          08/29
        </span>
      </div>
    </div>
  );
}

export default function KotakRightSideAd({ activeCardsList = [], onViewDetails }) {
  const navigate = useNavigate();

  // Retrieve Kotak 811 from existing verified dataset only
  const kotakCard = useMemo(() => {
    const list = activeCardsList && activeCardsList.length > 0 ? activeCardsList : debitCards;
    return (
      list.find(c => c.id === 11) ||
      list.find(c => c.id === 48) ||
      list.find(c => 
        String(c.bank || '').toLowerCase().includes('kotak') && 
        (String(c.cardName || '').toLowerCase().includes('811') || String(c.cardName || '').toLowerCase().includes('dream'))
      ) ||
      debitCards.find(c => c.id === 11) ||
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

  return (
    <div 
      aria-label="Card of the Month Advertisement"
      className="w-full select-none"
    >
      {/* Top Section Label */}
      <div className="flex items-center justify-between px-1 mb-2.5">
        <span className="inline-flex items-center gap-1.5 text-xs font-extrabold tracking-wider uppercase text-slate-700 dark:text-slate-300">
          <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
          FEATURED PROMOTION
        </span>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-200/90 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-300/70 dark:border-slate-700 uppercase tracking-wider">
          AD
        </span>
      </div>

      {/* Main Vertical Advertisement Card */}
      <div 
        onClick={handleSelect}
        className="group relative w-full rounded-3xl bg-gradient-to-b from-[#0F172A] via-[#111C38] to-[#0A1024] border border-blue-900/40 dark:border-blue-800/40 hover:border-red-500/50 p-6 sm:p-7 shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden text-left flex flex-col justify-between space-y-6"
      >
        {/* Ambient Glows */}
        <div className="absolute -right-16 -top-16 w-48 h-48 rounded-full bg-[#ED1C24]/15 blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-48 h-48 rounded-full bg-[#2563EB]/15 blur-3xl pointer-events-none" />

        {/* 1. Header: Badge & Bank Identifier */}
        <div className="flex items-center justify-between z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-amber-600/10 border border-amber-400/50 text-amber-300 font-black text-[11px] sm:text-xs tracking-wider uppercase shadow-xs">
            <span>⭐ CARD OF THE MONTH</span>
          </div>

          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Kotak 811
          </span>
        </div>

        {/* 2. Visual: Prominent, Bigger Size Kotak 811 Debit Card */}
        <div className="w-full flex justify-center py-1 z-10">
          <KotakDebitCardVerticalVisual card={kotakCard} />
        </div>

        {/* 3. Copy: Title & Tagline */}
        <div className="space-y-3 z-10">
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight group-hover:text-amber-200 transition-colors">
              Kotak 811 Debit Card
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 font-medium italic mt-1 leading-relaxed">
              "Explore the Kotak 811 Debit Card on D.CARD"
            </p>
          </div>

          {/* Key Feature Highlights */}
          <div className="grid grid-cols-1 gap-2 pt-1 border-t border-slate-800/80">
            <div className="flex items-center gap-2 text-xs text-slate-300 font-medium">
              <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>Zero balance account friendly</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-300 font-medium">
              <CreditCard className="w-3.5 h-3.5 text-[#60A5FA] shrink-0" />
              <span>Instant virtual & physical Visa card</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-300 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Customizable ATM & online limits</span>
            </div>
          </div>
        </div>

        {/* 4. Action: Big Prominent CTA Button */}
        <div className="pt-2 z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleSelect();
            }}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#ED1C24] via-[#DC143C] to-[#B30E16] hover:from-[#FF2D36] hover:to-[#DC143C] text-white font-black text-xs sm:text-sm tracking-wider uppercase shadow-lg shadow-red-900/30 hover:shadow-red-700/50 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
          >
            <span>View Card</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </div>
  );
}
