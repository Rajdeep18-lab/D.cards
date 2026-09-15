import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ShieldCheck, Lock, Globe, Award, Building2, CreditCard, GitCompare, TrendingUp } from 'lucide-react';

/**
 * AuthBrandPanel — Left-side premium branding panel for the two-column auth layout.
 * Hidden on mobile, shown on lg+ screens.
 */
export default function AuthBrandPanel() {
  return (
    <div className="hidden lg:flex lg:w-[45%] xl:w-[42%] flex-col justify-between relative overflow-hidden bg-gradient-to-br from-[#0B1329] via-[#0F1C3F] to-[#091124] p-10 xl:p-12 text-white select-none">

      {/* Ambient glow blobs */}
      <div className="absolute -left-24 -top-24 w-72 h-72 rounded-full bg-[#2563EB]/30 blur-[100px] pointer-events-none" />
      <div className="absolute -right-16 top-1/2 w-64 h-64 rounded-full bg-[#3B82F6]/20 blur-[90px] pointer-events-none" />
      <div className="absolute -bottom-20 left-1/4 w-56 h-56 rounded-full bg-emerald-500/10 blur-[80px] pointer-events-none" />

      {/* Dot mesh overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.12]"
        style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.4) 1px, transparent 1px)', backgroundSize: '28px 28px' }}
      />

      {/* Content */}
      <div className="relative z-10 space-y-10">

        {/* Logo + Brand */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center shadow-lg backdrop-blur-sm">
            <img src="/logo-mark.png" alt="D.CARD" className="w-7 h-7 object-contain" />
          </div>
          <div>
            <span className="text-base font-black tracking-tight text-white block leading-tight">D.CARD</span>
            <span className="text-[9.5px] font-bold text-[#93C5FD] uppercase tracking-widest">Banking Intelligence</span>
          </div>
        </div>

        {/* Headline + Sub */}
        <div className="space-y-3">
          <p className="text-[10px] font-bold text-[#93C5FD] uppercase tracking-widest">
            Smart Financial Decisions
          </p>
          <h1 className="text-3xl xl:text-4xl font-black leading-tight tracking-tight text-white">
            Compare.<br />Choose.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#60A5FA] to-[#34D399]">Bank Smarter.</span>
          </h1>
          <p className="text-sm text-slate-400 leading-relaxed font-normal max-w-xs">
            Discover and compare banking products in one place. Savings accounts, current accounts, and debit cards — all transparent.
          </p>
        </div>

        {/* Interactive 3D Debit Card */}
        <BrandDebitCard />

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-2.5">
          {[
            { icon: Building2,  value: '26+',  label: 'Top Banks' },
            { icon: CreditCard, value: '150+', label: 'Products' },
            { icon: GitCompare, value: '100K+', label: 'Comparisons' },
            { icon: TrendingUp, value: '98%',  label: 'Accuracy', color: 'text-emerald-400' },
          ].map(({ icon: Icon, value, label, color = 'text-white' }) => (
            <div key={label} className="p-3 rounded-xl bg-white/8 border border-white/10 backdrop-blur-sm">
              <div className="flex items-center gap-1.5 mb-0.5">
                <Icon className="w-3.5 h-3.5 text-[#60A5FA]" />
              </div>
              <span className={`text-sm font-black block ${color}`}>{value}</span>
              <span className="text-[10px] text-slate-400 font-medium">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Security badges row */}
      <div className="relative z-10 border-t border-white/10 pt-5 grid grid-cols-2 gap-y-2.5 gap-x-4">
        {[
          { icon: ShieldCheck, label: 'Firebase Secured' },
          { icon: Lock,        label: '256-bit TLS' },
          { icon: Globe,       label: 'Privacy First' },
          { icon: Award,       label: 'Verified Platform' },
        ].map(({ icon: Icon, label }) => (
          <div key={label} className="flex items-center gap-1.5 text-[10.5px] font-semibold text-slate-400">
            <Icon className="w-3.5 h-3.5 text-[#60A5FA] shrink-0" />
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}

/** 3D interactive debit card with mouse-tilt effect */
function BrandDebitCard() {
  const [rotateX, setRotateX] = React.useState(0);
  const [rotateY, setRotateY] = React.useState(0);
  const [glare, setGlare] = React.useState({ x: 50, y: 50 });

  const onMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setRotateX(((y - rect.height / 2) / (rect.height / 2)) * -10);
    setRotateY(((x - rect.width / 2) / (rect.width / 2)) * 10);
    setGlare({ x: (x / rect.width) * 100, y: (y / rect.height) * 100 });
  };

  const onLeave = () => { setRotateX(0); setRotateY(0); setGlare({ x: 50, y: 50 }); };

  return (
    <div className="perspective-[1000px]">
      <motion.div
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        animate={{ rotateX, rotateY }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        className="w-full aspect-[1.586/1] rounded-2xl p-5 relative overflow-hidden border border-white/20 shadow-2xl flex flex-col justify-between cursor-pointer"
        style={{
          background: 'linear-gradient(135deg, #0B3D91 0%, #1E3A8A 50%, #2563EB 100%)',
          boxShadow: '0 20px 45px rgba(37,99,235,0.4)',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Glare */}
        <div
          className="absolute inset-0 pointer-events-none opacity-50 transition-opacity"
          style={{ background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,0.4) 0%, transparent 60%)` }}
        />
        {/* Top row */}
        <div className="flex justify-between items-start z-10">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#60A5FA]" />
            <span className="text-[10.5px] font-black tracking-widest uppercase text-white/90">D.CARD INFINITE</span>
          </div>
          <span className="text-[9px] font-extrabold bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded-full border border-white/25">RuPay Platinum</span>
        </div>
        {/* Chip */}
        <div className="w-10 h-7 rounded-md bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 border border-amber-300/60 z-10 shadow-sm" />
        {/* Bottom */}
        <div className="z-10">
          <p className="font-mono text-sm font-extrabold tracking-widest text-white/95">4000 •••• •••• 9928</p>
          <div className="flex justify-between items-end mt-1 text-[9px] text-white/70 font-bold uppercase tracking-wider">
            <span>MEMBER PRIVILEGE</span>
            <span className="text-emerald-400 font-extrabold">VERIFIED ★</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
