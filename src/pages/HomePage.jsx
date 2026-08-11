import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import HeroSection from '../components/HeroSection';
import DebitCardCard from '../components/DebitCardCard';
import BankCard from '../components/BankCard';
import FaqSection from '../components/FaqSection';
import { debitCards } from '../data/mockData';
import { savingsAccounts, getAssociatedDebitCards } from '../data/mockSavingsAccounts';
import { getCoveredBanksDirectory } from '../utils/bankDirectoryUtils';
import { useWishlist } from '../context/WishlistContext';
import { 
  GraduationCap, 
  UserCheck, 
  HeartHandshake, 
  Plane, 
  DollarSign, 
  Crown, 
  ShieldPlus, 
  Sparkles, 
  Bot, 
  ArrowRight, 
  ShieldCheck, 
  BarChart3, 
  CheckCircle2,
  Layers,
  CreditCard,
  Percent,
  Search,
  Scale,
  Heart,
  HelpCircle,
  Landmark,
  ChevronRight
} from 'lucide-react';

function HomePage({
  query,
  setQuery,
  onViewDetails,
  activeFilters,
  setActiveFilters,
  STATIC_AI_PILL_COUNTS,
  toggleBank,
  selectSingleBank,
  activeCardsList,
  toggleCompareQueue,
  compareQueue = [],
  savingsCompareQueue = [],
  setSavingsCompareQueue
}) {
  const navigate = useNavigate();
  const { isWishlisted, toggleWishlist } = useWishlist();

  const dynamicBanks = useMemo(() => {
    return getCoveredBanksDirectory(activeCardsList);
  }, [activeCardsList]);

  const handleHeroSearchSubmit = (searchVal) => {
    setQuery(searchVal);
    navigate('/cards');
  };

  const featuredDebitCards = useMemo(() => {
    const source = (activeCardsList && activeCardsList.length > 0) ? activeCardsList : debitCards;
    return source.slice(0, 3);
  }, [activeCardsList]);

  const featuredSavingsAccounts = useMemo(() => {
    return savingsAccounts.slice(0, 4);
  }, []);

  const handleToggleSavingsCompare = (acc) => {
    if (!setSavingsCompareQueue) return;
    setSavingsCompareQueue(prev => {
      if (prev.some(a => String(a.id) === String(acc.id))) {
        return prev.filter(a => String(a.id) !== String(acc.id));
      }
      if (prev.length >= 3) return prev;
      return [...prev, acc];
    });
  };

  return (
    <div className="space-y-12 overflow-hidden select-none">
      
      {/* ── 1. Hero Section ── */}
      <HeroSection 
        query={query} 
        setQuery={handleHeroSearchSubmit} 
        onViewDetails={onViewDetails} 
      />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16 space-y-20">
        
        {/* ── 2. PRODUCT CATEGORIES (Debit Cards & Savings Accounts) ── */}
        <section id="product-categories" className="select-none scroll-mt-24">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-10">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-[#2563EB]/10 text-[#2563EB] dark:text-[#60A5FA] text-xs font-bold tracking-widest uppercase rounded-full border border-[#2563EB]/20">
              <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
              EXPLORE BANKING PRODUCTS
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1F2937] dark:text-white tracking-tight">
              Choose Your Banking Category
            </h2>
            <p className="text-xs sm:text-sm text-[#6B7280] dark:text-slate-400 font-normal">
              Compare debit card perks and high-yield savings accounts across verified Indian banks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            {/* 💳 DEBIT CARDS CARD */}
            <motion.div
              whileHover={{ y: -6, scale: 1.01 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              onClick={() => navigate('/cards')}
              className="p-8 rounded-3xl bg-gradient-to-br from-white via-slate-50 to-blue-50/40 dark:from-[#1E293B] dark:via-[#1E293B] dark:to-slate-900 border border-slate-200 dark:border-slate-800 hover:border-[#2563EB]/50 shadow-soft hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0B3D91] to-[#2563EB] text-white flex items-center justify-center shadow-lg">
                  <CreditCard className="w-7 h-7" />
                </div>
                <div>
                  <span className="text-[11px] font-extrabold text-[#2563EB] dark:text-[#60A5FA] uppercase tracking-wider block">
                    CARD DISCOVERY & COMPARISON
                  </span>
                  <h3 className="text-2xl font-black text-slate-800 dark:text-white mt-0.5">
                    Debit Cards
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                  Discover debit cards, compare their features, benefits, limits and charges. Filter by RuPay vs Visa, airport lounge access, zero forex, and cashback programs.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400">106+ Cards Indexed</span>
                <button
                  onClick={(e) => { e.stopPropagation(); navigate('/cards'); }}
                  className="px-5 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-extrabold text-xs transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Explore Debit Cards</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>

            {/* 🏦 SAVINGS ACCOUNTS CARD */}
            <motion.div
              whileHover={{ y: -6, scale: 1.01 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              onClick={() => navigate('/savings-accounts')}
              className="p-8 rounded-3xl bg-gradient-to-br from-white via-slate-50 to-emerald-50/40 dark:from-[#1E293B] dark:via-[#1E293B] dark:to-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 shadow-soft hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-lg">
                  <Percent className="w-7 h-7" />
                </div>
                <div>
                  <span className="text-[11px] font-extrabold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">
                    HIGH-YIELD SAVINGS & DEBIT CARDS
                  </span>
                  <h3 className="text-2xl font-black text-slate-800 dark:text-white mt-0.5">
                    Savings Accounts
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                  Explore savings accounts, compare interest rates, balances, features and associated debit cards. Filter zero balance, instant Video KYC, and student accounts.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400">40+ Accounts Indexed</span>
                <button
                  onClick={(e) => { e.stopPropagation(); navigate('/savings-accounts'); }}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Explore Savings Accounts</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── 3. HOW D.CARD HELPS (4 Simple Feature Cards) ── */}
        <section className="select-none text-left space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-[#2563EB]/10 text-[#2563EB] dark:text-[#60A5FA] text-xs font-bold tracking-widest uppercase rounded-full border border-[#2563EB]/20">
              <ShieldCheck className="w-4 h-4 text-[#2563EB]" />
              FINTECH ADVANTAGE
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1F2937] dark:text-white tracking-tight">
              Everything You Need to Choose Better
            </h2>
            <p className="text-xs sm:text-sm text-[#6B7280] dark:text-slate-400 font-normal">
              Zero commission arrangements. Independent mathematical feature indexing for maximum transparency.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Search,
                title: "🔎 Discover",
                desc: "Find banking products based on your specific lifestyle & financial requirements."
              },
              {
                icon: Scale,
                title: "⚖️ Compare",
                desc: "Compare products side by side across interest rates, limits, and fees before making a decision."
              },
              {
                icon: Heart,
                title: "❤️ Save",
                desc: "Save your favourite banking products to your personal profile for later review."
              },
              {
                icon: Bot,
                title: "🤖 AI Advisor",
                desc: "Get instant verified product answers using D.CARD's AI-powered financial advisor."
              }
            ].map((f, idx) => {
              const IconComp = f.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-3xl glass-card-premium border border-slate-200 dark:border-slate-800 shadow-soft space-y-3 hover:border-[#2563EB]/40 transition-all"
                >
                  <div className="w-10 h-10 rounded-2xl bg-[#EFF6FF] dark:bg-slate-800 border border-[#2563EB]/20 flex items-center justify-center text-[#2563EB] dark:text-[#60A5FA]">
                    <IconComp className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-extrabold text-slate-800 dark:text-white">{f.title}</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-normal">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── 4. SAVINGS ACCOUNT HIGHLIGHT ── */}
        <section className="select-none text-left space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 block mb-1">
                FEATURED SAVINGS SCHEMES
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-white">
                Looking for a Savings Account?
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl font-normal">
                Compare savings accounts based on interest rates, minimum balance, account features, eligibility and associated debit-card benefits.
              </p>
            </div>

            <button
              onClick={() => navigate('/savings-accounts')}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs transition-all shadow-md flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <span>Explore Savings Accounts →</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredSavingsAccounts.map(account => {
              const associatedCards = getAssociatedDebitCards(account);
              const linkedCard = associatedCards.length > 0 ? associatedCards[0] : null;

              return (
                <div
                  key={account.id}
                  className="p-6 rounded-3xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 shadow-soft hover:shadow-xl transition-all space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-[10.5px] font-bold uppercase tracking-wider text-[#2563EB] dark:text-[#60A5FA] block">
                          {account.bank}
                        </span>
                        <Link
                          to={`/savings-accounts/${account.id}`}
                          className="text-lg font-extrabold text-slate-800 dark:text-white hover:text-[#2563EB] hover:underline leading-snug block"
                        >
                          {account.accountName}
                        </Link>
                      </div>

                      <button
                        onClick={() => toggleWishlist(account)}
                        className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer border shrink-0 ${
                          isWishlisted(account.id)
                            ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 text-rose-500'
                            : 'bg-slate-50 dark:bg-slate-800 border-slate-200 text-slate-400 hover:text-rose-500'
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${isWishlisted(account.id) ? 'fill-rose-500' : ''}`} />
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-1.5 text-[10.5px]">
                      <span className="px-2.5 py-0.5 rounded-full font-extrabold bg-[#2563EB]/10 text-[#2563EB] dark:text-[#60A5FA] border border-[#2563EB]/20">
                        {account.accountType}
                      </span>
                      {account.isZeroBalance && (
                        <span className="px-2.5 py-0.5 rounded-full font-extrabold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                          ✓ Zero Balance
                        </span>
                      )}
                      {account.isOnlineOpening && (
                        <span className="px-2.5 py-0.5 rounded-full font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                          ⚡ Video KYC
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-1 text-xs">
                      <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                        <span className="text-[10px] font-extrabold text-slate-400 uppercase block">Interest Rate</span>
                        <span className="text-base font-black text-emerald-600 dark:text-emerald-400">{account.interestRate}</span>
                      </div>
                      <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                        <span className="text-[10px] font-extrabold text-slate-400 uppercase block">Min. Balance</span>
                        <span className="text-base font-black text-slate-800 dark:text-white">{account.minimumBalance}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                    <span className="text-[11px] font-medium text-slate-500 truncate">
                      {linkedCard ? `Linked: ${linkedCard.cardName}` : 'Associated Card Available'}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleSavingsCompare(account)}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 cursor-pointer"
                      >
                        Compare
                      </button>
                      <Link
                        to={`/savings-accounts/${account.id}`}
                        className="px-3.5 py-1.5 rounded-xl bg-[#2563EB] text-white font-bold text-xs hover:bg-blue-700 flex items-center gap-1"
                      >
                        <span>Details</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── 5. DEBIT CARD HIGHLIGHT ── */}
        <section className="select-none text-left space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#2563EB] dark:text-[#60A5FA] block mb-1">
                TOP DEBIT CARDS
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-white">
                Find Your Ideal Debit Card
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl font-normal">
                Compare debit cards based on fees, limits, rewards, lounge access, international usage and other benefits.
              </p>
            </div>

            <button
              onClick={() => navigate('/cards')}
              className="px-5 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-extrabold text-xs transition-all shadow-md flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <span>Explore Debit Cards →</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredDebitCards.map(card => (
              <DebitCardCard
                key={card.id}
                card={card}
                onViewDetails={() => onViewDetails && onViewDetails(card)}
                onCompare={() => toggleCompareQueue && toggleCompareQueue(card)}
                isCompared={compareQueue.some(c => String(c.id) === String(card.id))}
              />
            ))}
          </div>
        </section>

        {/* ── 6. BANK DISCOVERY ── */}
        <section className="select-none text-left space-y-6">
          <div className="flex items-end justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <span className="text-xs font-bold text-[#2563EB] dark:text-[#60A5FA] tracking-widest uppercase block mb-1">
                INSTITUTIONAL DIRECTORY
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-white">
                Explore Banks
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 font-normal">
                Explore debit cards and savings account options across leading banks in India
              </p>
            </div>

            <button
              onClick={() => navigate('/banks')}
              className="text-xs text-[#2563EB] dark:text-[#60A5FA] font-bold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View All Banks →</span>
            </button>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {dynamicBanks.slice(0, 3).map((bank) => (
              <BankCard 
                key={bank.name} 
                bank={bank} 
                onSelect={() => navigate(`/banks/${bank.id}`)}
              />
            ))}
          </div>
        </section>

        {/* ── 7. AI ADVISOR SECTION ── */}
        <section className="select-none text-left">
          <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-[#0B3D91] via-[#1E3A8A] to-[#1E293B] text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 border border-slate-700/80">
            <div className="space-y-4 max-w-xl text-left z-10">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-bold text-[#60A5FA] uppercase tracking-wider border border-white/10">
                <Bot className="w-4 h-4 text-[#60A5FA]" />
                D.CARD AI ADVISOR ENGINE
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight">
                Not Sure What You Need?
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                Ask D.CARD's AI Advisor about debit cards, savings accounts and banking features. Grounded strictly in live database records with zero hallucinated rates.
              </p>

              <div className="flex flex-wrap gap-2 pt-1 text-xs">
                {[
                  "What savings account is suitable for a student?",
                  "Compare SBI and HDFC savings accounts.",
                  "What debit card comes with this account?",
                  "Which debit cards offer lounge access?"
                ].map((promptText, idx) => (
                  <button
                    key={idx}
                    onClick={() => navigate('/ai-advisor')}
                    className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-[11px] border border-white/15 cursor-pointer"
                  >
                    💬 "{promptText}"
                  </button>
                ))}
              </div>

              <div className="pt-3">
                <button
                  onClick={() => navigate('/ai-advisor')}
                  className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#3B82F6] hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] text-white font-bold text-xs tracking-wide uppercase shadow-md transition-all cursor-pointer flex items-center gap-2 active:scale-95"
                >
                  <Bot className="w-4 h-4" />
                  <span>Ask AI Advisor →</span>
                </button>
              </div>
            </div>

            <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 flex flex-col items-center justify-center text-white shadow-2xl relative z-10 flex-shrink-0 p-4 space-y-2 text-center">
              <Bot className="w-16 h-16 text-[#60A5FA] animate-bounce" style={{ animationDuration: '3s' }} />
              <span className="text-xs font-extrabold text-white">AI Assistant</span>
              <span className="text-[10px] text-emerald-400 font-semibold uppercase flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Database Grounding
              </span>
            </div>
          </div>
        </section>

        {/* ── 8. FAQ Section ── */}
        <FaqSection />
      </main>
    </div>
  );
}

export default HomePage;
