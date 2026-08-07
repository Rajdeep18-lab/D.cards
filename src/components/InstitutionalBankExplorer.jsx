import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  Star, 
  AlertCircle, 
  ExternalLink, 
  Award, 
  Lock, 
  Smartphone, 
  CreditCard, 
  Percent, 
  MapPin, 
  Calendar, 
  Users, 
  Landmark,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import BankBrandLogo from './BankBrandLogo';
import { getCoveredBanksDirectory, getInstitutionalProfileForBank } from '../utils/bankDirectoryUtils';

function InstitutionalBankExplorer({ onSelectBank, onCompareCard, compareQueue = [], customCardsList = null }) {
  const navigate = useNavigate();

  // Load all covered banks dynamically from JSON
  const coveredBanks = useMemo(() => {
    return getCoveredBanksDirectory(customCardsList);
  }, [customCardsList]);

  // Active bank selection state (default to first bank e.g. State Bank of India or HDFC Bank)
  const [selectedBankName, setSelectedBankName] = useState(() => {
    return coveredBanks.length > 0 ? coveredBanks[0].name : "HDFC Bank";
  });

  // Get active bank cards & profile
  const activeBankData = useMemo(() => {
    const bankObj = coveredBanks.find(b => b.name === selectedBankName) || coveredBanks[0];
    if (!bankObj) return null;
    const profile = getInstitutionalProfileForBank(bankObj.name, bankObj.cards);
    return {
      bankObj,
      profile
    };
  }, [coveredBanks, selectedBankName]);

  if (!activeBankData || !coveredBanks.length) return null;

  const { bankObj, profile } = activeBankData;
  const brandTheme = profile.brandTheme || bankObj.brandTheme;

  const handleBankChange = (name) => {
    setSelectedBankName(name);
  };

  return (
    <section className="space-y-8 select-none text-left" id="institutional-bank-explorer">
      {/* Header */}
      <div className="border-b border-[#E5E7EB] dark:border-slate-800 pb-5">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#2563EB]/10 text-[#2563EB] dark:text-[#60A5FA] text-xs font-semibold tracking-widest uppercase rounded-full mb-2">
          <ShieldCheck className="w-3.5 h-3.5" />
          INDEPENDENT INSTITUTIONAL AUDIT
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold text-[#1F2937] dark:text-white tracking-tight">
          Institutional Bank Profiles
        </h2>
        <p className="text-xs sm:text-sm text-[#6B7280] dark:text-slate-400 mt-1 max-w-3xl font-normal">
          Explore India's leading banks, compare their strengths, customer benefits, trust scores, and discover the best debit cards available.
        </p>
      </div>

      {/* Swipeable / Scrollable Premium Bank Selector Chips */}
      <div className="space-y-2">
        <span className="text-[11px] font-bold text-[#6B7280] dark:text-slate-400 uppercase tracking-wider block">
          Select Bank Explorer Profile ({coveredBanks.length} Banks Available)
        </span>
        <div className="flex gap-2.5 overflow-x-auto pb-3 pt-1 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700">
          {coveredBanks.map((b) => {
            const isActive = b.name === selectedBankName;
            return (
              <motion.button
                key={b.name}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleBankChange(b.name)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all duration-200 cursor-pointer flex-shrink-0 border ${
                  isActive
                    ? `bg-gradient-to-r ${b.brandTheme?.gradient || 'from-[#2563EB] to-[#3B82F6]'} text-white border-transparent shadow-md shadow-[#2563EB]/25`
                    : 'bg-white dark:bg-[#1E293B] text-[#1F2937] dark:text-slate-200 border-[#E5E7EB] dark:border-slate-700 hover:border-[#2563EB]/50'
                }`}
              >
                <BankBrandLogo 
                  bankName={b.name} 
                  logoText={b.logoText} 
                  className="w-7 h-7 shadow-xs" 
                />
                <div className="text-left">
                  <div className="leading-tight">{b.name}</div>
                  <div className={`text-[10px] font-medium mt-0.5 ${isActive ? 'text-white/80' : 'text-[#6B7280] dark:text-slate-400'}`}>
                    {b.cardCount} Debit Card{b.cardCount !== 1 ? 's' : ''}
                  </div>
                </div>
                {isActive && (
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-1" />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Main Profile Card Container */}
      <AnimatePresence mode="wait">
        <motion.div
          key={profile.bankName}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="rounded-3xl bg-white dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-slate-800 shadow-soft overflow-hidden space-y-8 p-6 sm:p-8 relative"
        >
          {/* Subtle Top Accent Bar using Official Bank Color */}
          <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${brandTheme?.gradient || 'from-[#2563EB] to-[#3B82F6]'}`} />

          {/* Top Profile Header: Left Side (Info) & Right Side (Ratings) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 border-b border-[#E5E7EB] dark:border-slate-800 pb-8 items-start pt-2">
            
            {/* Left Side: Logo, Name, Meta & Official Link */}
            <div className="lg:col-span-6 space-y-4">
              <div className="flex items-center gap-4">
                <BankBrandLogo 
                  bankName={profile.bankName} 
                  logoText={bankObj.logoText} 
                  className="w-16 h-16 shadow-lg rounded-2xl" 
                />
                <div>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${brandTheme?.accentBg || 'bg-[#2563EB]/10'} ${brandTheme?.accentText || 'text-[#2563EB]'}`}>
                    {profile.ownershipType}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-[#1F2937] dark:text-white mt-1">
                    {profile.bankName}
                  </h3>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs text-[#6B7280] dark:text-slate-300 pt-2 font-normal">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#2563EB]" />
                  <span>Founded: <strong className="text-[#1F2937] dark:text-white font-semibold">{profile.foundedYear}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#2563EB]" />
                  <span>HQ: <strong className="text-[#1F2937] dark:text-white font-semibold">{profile.headquarters}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Landmark className="w-4 h-4 text-[#2563EB]" />
                  <span>Type: <strong className="text-[#1F2937] dark:text-white font-semibold">{profile.ownershipType}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <ExternalLink className="w-4 h-4 text-[#2563EB]" />
                  <a 
                    href={profile.officialWebsite} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[#2563EB] dark:text-[#60A5FA] font-semibold hover:underline flex items-center gap-1"
                  >
                    <span>Official Website</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>

            {/* Right Side: Rating Badges */}
            <div className="lg:col-span-6 grid grid-cols-2 gap-3 sm:gap-4">
              {[
                { label: "Trust Score", val: profile.trustScore, icon: ShieldCheck, color: "text-blue-600 dark:text-blue-400 bg-blue-500/10 border-blue-500/20" },
                { label: "Customer Rating", val: profile.customerRating, icon: Award, color: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
                { label: "Security Rating", val: profile.securityRating, icon: Lock, color: "text-purple-600 dark:text-purple-400 bg-purple-500/10 border-purple-500/20" },
                { label: "Digital Score", val: profile.digitalBankingScore, icon: Smartphone, color: "text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 border-indigo-500/20" }
              ].map((badge, idx) => {
                const IconComp = badge.icon;
                return (
                  <div 
                    key={idx} 
                    className={`p-4 rounded-2xl border ${badge.color} flex flex-col justify-between space-y-2 shadow-xs`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-[#6B7280] dark:text-slate-400 uppercase tracking-wider">{badge.label}</span>
                      <IconComp className="w-4 h-4" />
                    </div>
                    <span className="text-xl font-black text-[#1F2937] dark:text-white tracking-tight">
                      {badge.val}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bank Overview Paragraphs */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-[#1F2937] dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#2563EB]" />
              Bank Overview & Ecosystem
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-[#4B5563] dark:text-slate-300 font-normal leading-relaxed">
              <p className="p-4 rounded-2xl bg-[#F8FAFC] dark:bg-slate-900/60 border border-[#E5E7EB] dark:border-slate-800">
                <strong className="text-[#1F2937] dark:text-white block mb-1">History & Customer Base:</strong>
                {profile.overviewHistory} {profile.overviewCustomerBase}
              </p>
              <p className="p-4 rounded-2xl bg-[#F8FAFC] dark:bg-slate-900/60 border border-[#E5E7EB] dark:border-slate-800">
                <strong className="text-[#1F2937] dark:text-white block mb-1">Network & Digital Reach:</strong>
                {profile.overviewNetwork} {profile.overviewDigital} {profile.overviewReputation}
              </p>
            </div>
          </div>

          {/* Key Strengths & Considerations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {/* Key Strengths (Icon Cards) */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Key Strengths & Perks
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {profile.keyStrengths.map((st, i) => (
                  <div 
                    key={i}
                    className="p-3 rounded-xl bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 text-xs text-[#1F2937] dark:text-slate-200 flex items-start gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="block font-semibold text-emerald-700 dark:text-emerald-300">{st.title}</strong>
                      <span className="text-[11px] text-[#6B7280] dark:text-slate-400 font-normal leading-snug">{st.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Considerations (Orange Cards) */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-amber-500" />
                Important Considerations
              </h4>
              <div className="space-y-2">
                {profile.considerations.map((con, i) => (
                  <div 
                    key={i} 
                    className="p-3 rounded-xl bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 text-xs text-[#1F2937] dark:text-slate-200 flex items-start gap-2"
                  >
                    <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                    <span className="font-medium">{con}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Best For Badges */}
          <div className="space-y-2 pt-2 border-t border-[#E5E7EB] dark:border-slate-800">
            <span className="text-[11px] font-bold text-[#6B7280] dark:text-slate-400 uppercase tracking-wider block">
              Best Tailored Profiles
            </span>
            <div className="flex flex-wrap gap-2">
              {profile.bestForBadges.map((bg, i) => (
                <span 
                  key={i}
                  className="px-3 py-1 rounded-full text-xs font-semibold bg-[#EFF6FF] dark:bg-slate-800 text-[#2563EB] dark:text-[#60A5FA] border border-[#2563EB]/20 shadow-2xs"
                >
                  {bg}
                </span>
              ))}
            </div>
          </div>

          {/* Bank Statistics Cards */}
          <div className="space-y-3 pt-2 border-t border-[#E5E7EB] dark:border-slate-800">
            <h4 className="text-xs font-bold text-[#1F2937] dark:text-white uppercase tracking-wider">
              Bank Scale & Operations Statistics
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {[
                { label: "Debit Cards Available", val: profile.stats.cardsAvailable, icon: CreditCard },
                { label: "Average Rating", val: profile.stats.avgRating, icon: Star },
                { label: "Savings Interest", val: profile.stats.interestRate, icon: Percent },
                { label: "ATM Network", val: profile.stats.atmNetwork, icon: Landmark },
                { label: "Branch Network", val: profile.stats.branches, icon: Building2 },
                { label: "Active Customers", val: profile.stats.customers, icon: Users }
              ].map((st, i) => {
                const IconComp = st.icon;
                return (
                  <div 
                    key={i}
                    className="p-3.5 rounded-2xl bg-[#F8FAFC] dark:bg-slate-900 border border-[#E5E7EB] dark:border-slate-800/80 text-left space-y-1"
                  >
                    <IconComp className="w-4 h-4 text-[#2563EB]" />
                    <div className="text-[10px] font-semibold text-[#6B7280] dark:text-slate-400 leading-tight">{st.label}</div>
                    <div className="text-sm font-extrabold text-[#1F2937] dark:text-white tracking-tight">{st.val}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Popular Debit Cards List for this Bank */}
          {profile.popularCards.length > 0 && (
            <div className="space-y-4 pt-4 border-t border-[#E5E7EB] dark:border-slate-800">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-[#1F2937] dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-[#2563EB]" />
                  Popular {profile.bankName} Debit Cards
                </h4>
                <span className="text-xs text-[#6B7280] dark:text-slate-400 font-medium">
                  Showing top {profile.popularCards.length} cards
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {profile.popularCards.map((card) => {
                  const isInCompare = compareQueue.some(c => String(c.id) === String(card.id));
                  return (
                    <div 
                      key={card.id}
                      className="p-4 rounded-2xl bg-[#F8FAFC] dark:bg-slate-900 border border-[#E5E7EB] dark:border-slate-800 hover:border-[#2563EB]/40 flex flex-col justify-between space-y-3 text-left transition-all duration-200"
                    >
                      <div className="space-y-2">
                        <div className="flex justify-between items-start">
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#2563EB]/10 text-[#2563EB] dark:text-[#60A5FA]">
                            {card.network || "Debit Card"}
                          </span>
                          <span className="flex items-center gap-1 text-xs font-bold text-amber-500">
                            <Star className="w-3.5 h-3.5 fill-amber-500" />
                            {card.rating || "4.5"}
                          </span>
                        </div>
                        <h5 className="text-xs font-bold text-[#1F2937] dark:text-white leading-tight line-clamp-2">
                          {card.cardName}
                        </h5>
                        <p className="text-[11px] text-[#6B7280] dark:text-slate-400 font-normal">
                          Annual Fee: <strong className="text-[#1F2937] dark:text-white">{card.annualFee || 'Free'}</strong>
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          if (onCompareCard) onCompareCard(card);
                        }}
                        className={`w-full py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                          isInCompare 
                            ? 'bg-emerald-500 text-white border-emerald-500' 
                            : 'bg-white dark:bg-slate-800 text-[#2563EB] dark:text-[#60A5FA] border-[#2563EB]/30 hover:border-[#2563EB]'
                        }`}
                      >
                        {isInCompare ? 'In Compare List ✓' : '+ Compare Card'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-6 border-t border-[#E5E7EB] dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              onClick={() => {
                if (onSelectBank) onSelectBank(profile.bankName);
                navigate('/cards');
                window.scrollTo(0, 0);
              }}
              className={`w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r ${brandTheme?.gradient || 'from-[#2563EB] to-[#3B82F6]'} hover:opacity-95 text-white text-xs font-semibold shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all`}
            >
              <span>View All {profile.bankName} Debit Cards</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                navigate('/compare');
                window.scrollTo(0, 0);
              }}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white dark:bg-[#1E293B] text-[#1F2937] dark:text-white border border-[#E5E7EB] dark:border-slate-700 hover:border-[#2563EB] text-xs font-semibold shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <Layers className="w-4 h-4 text-[#2563EB]" />
              <span>Compare With Other Banks</span>
            </button>
          </div>

        </motion.div>
      </AnimatePresence>
    </section>
  );
}

export default InstitutionalBankExplorer;
