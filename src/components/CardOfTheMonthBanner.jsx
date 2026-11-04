import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plane,
  Globe,
  Gift,
  ShieldCheck,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Building2,
  Sparkles,
  Zap,
  CreditCard,
  Trophy,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';
import DebitCardVisual from './DebitCardVisual';
import BankLogo from './BankLogo';
import { debitCards } from '../data/mockData';
import { getMonthlySelection } from '../services/cardOfMonthService';

// ─── Icon map for benefit display ────────────────────────────────────────────

const BENEFIT_ICONS = [Gift, Plane, Globe, ShieldCheck, Zap, CreditCard, Building2, Sparkles];

function pickIcon(benefitText, index) {
  const t = (benefitText || '').toLowerCase();
  if (t.includes('lounge') || t.includes('airport') || t.includes('travel')) return Plane;
  if (t.includes('cashback') || t.includes('reward') || t.includes('payback')) return Gift;
  if (t.includes('forex') || t.includes('international') || t.includes('global')) return Globe;
  if (t.includes('insurance') || t.includes('protect') || t.includes('cover')) return ShieldCheck;
  if (t.includes('contact') || t.includes('tap') || t.includes('nfc')) return Zap;
  if (t.includes('fuel') || t.includes('waiv')) return CreditCard;
  if (t.includes('fee') || t.includes('zero') || t.includes('free')) return Trophy;
  return BENEFIT_ICONS[index % BENEFIT_ICONS.length];
}

// ─── Static fallback slides (shown while dynamic selection loads) ────────────

/**
 * Verified Featured Debit Cards with their authentic Bank → Savings Account links.
 * These are used as a fallback while the dynamic scorer runs, or if no eligible
 * cards are found.
 */
const FALLBACK_SLIDES = [
  {
    cardId: 4,
    bankKey: 'HDFC Bank',
    cardName: 'Millennia Debit Card',
    headline: 'Travel More, Spend Smarter',
    subtitle:
      'Get more from your everyday spends and travels with the HDFC Millennia Debit Card.',
    travelTag: 'Your World Awaits',
    linkedSavings: {
      accountName: 'HDFC DigiSave Youth / Millennia Savings Account',
      accountId: '1012',
      relationship: 'Complimentary with account',
    },
    benefits: [
      {
        icon: Plane,
        title: 'Airport Lounge Access',
        description: 'Complimentary domestic airport lounge access (up to 4 visits/year)',
      },
      {
        icon: Globe,
        title: 'Zero Forex / Global Acceptance',
        description: 'Accepted worldwide across millions of global Visa merchants',
      },
      {
        icon: Gift,
        title: '5% Cashback on Spends',
        description: 'Accelerated cashback on Amazon, Flipkart, SmartBuy & PayZapp',
      },
      {
        icon: ShieldCheck,
        title: '₹10 Lakh Insurance Cover',
        description: 'Complimentary accidental death and permanent disability protection',
      },
    ],
  },
  {
    cardId: 11,
    bankKey: 'Kotak Mahindra Bank',
    cardName: 'Kotak 811 Debit Card',
    headline: 'Zero Balance Freedom, 24/7 Smart Spends',
    subtitle:
      'Experience instant digital banking with zero maintenance charges and 24/7 card controls.',
    travelTag: 'Spend Freely Anywhere',
    linkedSavings: {
      accountName: 'Kotak 811 Zero-Balance Savings Account',
      accountId: '104',
      relationship: 'Included digitally with full KYC',
    },
    benefits: [
      {
        icon: CreditCard,
        title: 'Zero Maintenance Burden',
        description: 'Zero annual fee digital card with instant activation via mobile app',
      },
      {
        icon: Gift,
        title: '2X Reward Points',
        description: 'Earn rewards on every ₹100 spent on online shopping and dining',
      },
      {
        icon: Zap,
        title: 'Contactless Tap & Pay',
        description: 'NFC enabled seamless in-store payments up to ₹5,000 without PIN',
      },
      {
        icon: ShieldCheck,
        title: 'Dynamic CVV Security',
        description: 'Instant card lock/unlock controls and dynamic security in Kotak app',
      },
    ],
  },
  {
    cardId: 5,
    bankKey: 'ICICI Bank',
    cardName: 'Coral PayWave Debit Card',
    headline: 'Elevate Your Everyday Lifestyle',
    subtitle: "Premium travel and dining privileges with India's leading private sector bank.",
    travelTag: 'Exclusive Travel Privileges',
    linkedSavings: {
      accountName: 'ICICI Regular / Salary Savings Account',
      accountId: '1021',
      relationship: 'Available with account upgrade',
    },
    benefits: [
      {
        icon: Plane,
        title: 'Domestic Lounge Access',
        description: '2 complimentary domestic airport lounge visits per calendar quarter',
      },
      {
        icon: Gift,
        title: 'Culinary Treats Discounts',
        description: 'Minimum 15% savings across 2,500+ partner restaurants in India',
      },
      {
        icon: Globe,
        title: 'High ATM & POS Limits',
        description: '₹1,00,000 daily cash withdrawal limit & ₹3,00,000 daily spend limit',
      },
      {
        icon: ShieldCheck,
        title: 'Air Accident Insurance',
        description: 'Comprehensive complimentary air accident cover up to ₹20,00,000',
      },
    ],
  },
];

// ─── Build a "slide" object from a dynamically scored card ──────────────────

function buildDynamicSlide(selection, allCards) {
  const { card, reason, bullets } = selection;

  // Build benefit rows from the scored bullets (max 4)
  const benefits = bullets.slice(0, 4).map((text, i) => {
    const Icon = pickIcon(text, i);
    // Split "Title — description" at em-dash if present, else use full text as description
    const dashIdx = text.indexOf(' — ');
    const title = dashIdx > -1 ? text.slice(0, dashIdx) : text;
    const description = dashIdx > -1 ? text.slice(dashIdx + 3) : text;
    return { icon: Icon, title, description };
  });

  // Pad to at least 2 items for layout consistency
  while (benefits.length < 2) {
    benefits.push({
      icon: CheckCircle2,
      title: 'Verified Banking Product',
      description: 'All details verified from official bank sources.',
    });
  }

  // Derive travelTag from bestFor array or bank name
  const bestForArr = Array.isArray(card.bestFor) ? card.bestFor : [];
  const travelTag =
    bestForArr[0] ||
    (card.bank ? `${card.bank.split(' ')[0]} Pick` : 'Top Rated Pick');

  // Build a friendly headline from card name
  const month = new Date().toLocaleString('en-IN', { month: 'long' });
  const headline = `${month}'s Best: ${card.cardName}`;

  return {
    cardId: card.id,
    bankKey: card.bank || '',
    cardName: card.cardName || '',
    headline,
    subtitle: reason,
    travelTag,
    isDynamic: true,
    scoreLabel: selection.score != null ? `Score: ${selection.score}/100` : null,
    linkedSavings: null, // Dynamic cards don't have a hardcoded savings account link
    benefits,
    card, // resolved live card object
  };
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function CardOfTheMonthBanner({ activeCardsList = [], onViewDetails }) {
  const navigate = useNavigate();
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // ── Build the fallback slides (matching existing logic) ──────────────────
  const fallbackSlides = useMemo(() => {
    const list = activeCardsList && activeCardsList.length > 0 ? activeCardsList : debitCards;

    return FALLBACK_SLIDES.map((slide) => {
      const liveCard =
        list.find((c) => c.id === slide.cardId) ||
        list.find(
          (c) =>
            String(c.bank || '')
              .toLowerCase()
              .includes(slide.bankKey.toLowerCase().split(' ')[0]) &&
            String(c.cardName || '')
              .toLowerCase()
              .includes(slide.cardName.toLowerCase().split(' ')[0])
        ) ||
        debitCards.find((c) => c.id === slide.cardId) || {
          id: slide.cardId,
          bank: slide.bankKey,
          cardName: slide.cardName,
          network: 'Visa',
          annualFee: '₹500',
          contactless: true,
          international: true,
        };

      return { ...slide, card: liveCard };
    });
  }, [activeCardsList]);

  // ── Dynamic Card of the Month selection ─────────────────────────────────
  const [dynamicSlide, setDynamicSlide] = useState(null);
  const [selectionLoading, setSelectionLoading] = useState(true);

  useEffect(() => {
    const cardList =
      activeCardsList && activeCardsList.length > 0 ? activeCardsList : debitCards;

    // Run synchronously (localStorage + in-memory scoring) — no async needed
    try {
      const selection = getMonthlySelection(cardList);
      if (selection && selection.card) {
        setDynamicSlide(buildDynamicSlide(selection, cardList));
      }
    } catch (err) {
      // Scoring failure → gracefully fall back to curated slides
      console.warn('[CardOfTheMonth] Dynamic selection failed, using curated slides:', err);
    } finally {
      setSelectionLoading(false);
    }
  }, [activeCardsList]);

  // ── Build final slides list: dynamic "best card" first, then curated ─────
  const slides = useMemo(() => {
    if (selectionLoading) return fallbackSlides;
    if (dynamicSlide) return [dynamicSlide, ...fallbackSlides];
    return fallbackSlides;
  }, [dynamicSlide, fallbackSlides, selectionLoading]);

  // Guard against index out-of-range when slides list changes
  useEffect(() => {
    if (currentSlideIndex >= slides.length) {
      setCurrentSlideIndex(0);
    }
  }, [slides.length, currentSlideIndex]);

  const activeSlide = slides[currentSlideIndex] || slides[0];

  // ── Auto-play carousel every 6 seconds unless hovered ───────────────────
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isPaused, slides.length]);

  const handleNext = () => setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
  const handlePrev = () =>
    setCurrentSlideIndex((prev) => (prev - 1 + slides.length) % slides.length);

  const handleCtaClick = () => {
    if (onViewDetails && activeSlide.card) {
      onViewDetails(activeSlide.card);
    } else {
      navigate('/cards');
    }
  };

  const handleSavingsClick = (e) => {
    e.stopPropagation();
    if (activeSlide.linkedSavings?.accountId) {
      navigate(`/savings-accounts/${activeSlide.linkedSavings.accountId}`);
    } else {
      navigate('/savings-accounts');
    }
  };

  if (!activeSlide) return null;

  return (
    <div
      aria-label="Card of the Month"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative w-full rounded-[28px] sm:rounded-[36px] bg-gradient-to-br from-[#FFFFFF] via-[#F6FAFF] to-[#EAF3FE] dark:from-[#1E293B] dark:via-[#172338] dark:to-[#0F172A] border border-[#E2E8F0] dark:border-slate-700/80 shadow-[0_20px_50px_rgba(37,99,235,0.07)] overflow-hidden select-none text-left transition-all duration-300"
    >
      {/* Subtle Background Glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#2563EB]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-[#3B82F6]/10 rounded-full blur-2xl pointer-events-none" />

      {/* Main Grid: Left = Product Info & Benefits | Right = Traveler Advertising Model */}
      <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch min-h-[440px]">

        {/* ════════════════════════════════════════════════════════════
            LEFT COLUMN: PRODUCT INFORMATION & BENEFITS (Col span 7)
           ════════════════════════════════════════════════════════════ */}
        <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-6 z-10">

          {/* Top Row: Badge + Bank & Linked Account Info */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Crown Badge — shows "AI-Selected" tag for dynamic slide */}
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2563EB]/10 border border-[#2563EB]/20 text-[#2563EB] dark:text-[#60A5FA] font-black text-xs uppercase tracking-wider shadow-2xs">
                <span>👑</span>
                <span>Card of the Month</span>
              </span>

              {/* Dynamic score badge */}
              {activeSlide.isDynamic && activeSlide.scoreLabel && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 text-[10px] font-bold border border-amber-200 dark:border-amber-700/50">
                  <Trophy className="w-3 h-3" />
                  {activeSlide.scoreLabel}
                </span>
              )}

              {/* Bank Chip */}
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-bold border border-slate-200 dark:border-slate-700">
                <BankLogo bankName={activeSlide.bankKey} size="xs" />
                <span>{activeSlide.bankKey}</span>
              </span>

              {/* Linked Savings Account Link (only for curated slides) */}
              {activeSlide.linkedSavings && (
                <button
                  type="button"
                  onClick={handleSavingsClick}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#2563EB] dark:text-[#60A5FA] hover:underline cursor-pointer bg-blue-50/80 dark:bg-blue-950/40 px-2.5 py-0.5 rounded-full border border-blue-100 dark:border-blue-900/60"
                  title="View linked savings account details"
                >
                  <span>Linked Account:</span>
                  <span className="font-bold">{activeSlide.linkedSavings.accountName.split('/')[0]}</span>
                  <ArrowRight className="w-2.5 h-2.5" />
                </button>
              )}
            </div>

            {/* Main Headline */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSlide.headline}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
              >
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0F172A] dark:text-white tracking-tight leading-tight">
                  {activeSlide.headline}
                </h2>
                <p className="text-xs sm:text-sm text-[#64748B] dark:text-slate-300 font-normal leading-relaxed mt-1.5 max-w-xl">
                  {activeSlide.subtitle}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Center Area: Debit Card Visual + Key Benefit Rows */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 sm:gap-6 items-center my-2">

            {/* Debit Card Image Visual (Span 5 on sm) */}
            <div className="sm:col-span-5 flex justify-center sm:justify-start">
              <div className="w-full max-w-[260px] sm:max-w-none">
                <DebitCardVisual card={activeSlide.card} mode="grid" />
              </div>
            </div>

            {/* 3–4 Important Verified Benefits (Span 7 on sm) */}
            <div className="sm:col-span-7 space-y-2.5">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSlide.cardName}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-2.5"
                >
                  {activeSlide.benefits.map((b, i) => {
                    const IconComp = b.icon;
                    return (
                      <div key={i} className="flex items-start gap-2.5">
                        <div className="w-7 h-7 rounded-xl bg-[#EFF6FF] dark:bg-slate-800 border border-[#2563EB]/20 dark:border-blue-500/20 text-[#2563EB] dark:text-[#60A5FA] flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
                          <IconComp className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-[#1F2937] dark:text-white leading-tight">
                            {b.title}
                          </h4>
                          <p className="text-[11px] text-[#64748B] dark:text-slate-400 font-normal leading-tight mt-0.5 line-clamp-1">
                            {b.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Bottom Action Row: CTA Button + Prev/Next Controls */}
          <div className="flex items-center justify-between pt-2 border-t border-[#E5E7EB]/80 dark:border-slate-800">
            <button
              type="button"
              onClick={handleCtaClick}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#3B82F6] hover:from-[#1D4ED8] hover:to-[#2563EB] text-white font-extrabold text-xs sm:text-sm tracking-wide shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer active:scale-95 min-h-[44px]"
            >
              <span>View Card Details</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Desktop Slide Controls */}
            <div className="hidden sm:flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous featured card"
                className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-[#2563EB] dark:hover:text-[#60A5FA] hover:border-[#2563EB] flex items-center justify-center transition-all cursor-pointer shadow-2xs"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 min-w-[32px] text-center">
                {currentSlideIndex + 1} / {slides.length}
              </span>

              <button
                type="button"
                onClick={handleNext}
                aria-label="Next featured card"
                className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-[#2563EB] dark:hover:text-[#60A5FA] hover:border-[#2563EB] flex items-center justify-center transition-all cursor-pointer shadow-2xs"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

        {/* ════════════════════════════════════════════════════════════
            RIGHT COLUMN: TRAVELER MODEL ADVERTISEMENT VISUAL (Col span 5)
           ════════════════════════════════════════════════════════════ */}
        <div className="lg:col-span-5 relative min-h-[260px] sm:min-h-[340px] lg:min-h-full overflow-hidden flex flex-col justify-end bg-gradient-to-t from-slate-100/80 to-transparent dark:from-slate-900/60">

          {/* Decorative Flight Path & Lifestyle Script Tag */}
          <div className="absolute top-5 right-6 sm:right-10 z-20 pointer-events-none">
            <div className="flex items-center gap-1.5 text-[#2563EB] dark:text-[#60A5FA]">
              <span className="text-base">✈</span>
              <span className="text-xs sm:text-sm font-black italic tracking-wide drop-shadow-xs">
                {activeSlide.travelTag}
              </span>
            </div>
            {/* Curved Dotted Flight Trail SVG */}
            <svg className="w-20 sm:w-28 h-8 sm:h-10 text-[#2563EB]/40 dark:text-[#60A5FA]/40 -mt-1 -ml-3" viewBox="0 0 100 40" fill="none">
              <path d="M 5 35 Q 45 5 95 15" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
            </svg>
          </div>

          {/* Model Commercial Photo with Smooth Gradient Blend */}
          <img
            src="/assets/card-of-month-model.jpg"
            alt="D.CARD Featured Debit Card Lifestyle Traveler"
            className="w-full h-full object-cover object-top max-h-[380px] sm:max-h-[440px] lg:max-h-full filter contrast-[1.03]"
            loading="lazy"
          />

          {/* Subtle blend gradient on the left edge (desktop only) */}
          <div className="hidden lg:block absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#FFFFFF] dark:from-[#1E293B] to-transparent pointer-events-none" />

          {/* Carousel Pagination Indicator Dots */}
          <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 z-20 flex items-center gap-0.5 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-2 py-1 rounded-full border border-white/40 dark:border-slate-700 shadow-sm">
            {slides.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentSlideIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className="w-7 h-7 flex items-center justify-center cursor-pointer focus:outline-none"
              >
                <span
                  className={`transition-all duration-300 rounded-full block ${
                    currentSlideIndex === idx
                      ? 'w-5 sm:w-6 h-2 bg-[#2563EB]'
                      : 'w-2 h-2 bg-slate-300 dark:bg-slate-600 hover:bg-slate-400'
                  }`}
                />
              </button>
            ))}
          </div>

        </div>

      </div>
    </div>
  );
}
