import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  ExternalLink,
  Heart,
  Scale,
  Share2,
  CheckCircle2,
  ShieldCheck,
  CreditCard,
  Globe,
  Wifi,
  Plane,
  Fuel,
  Gift,
  UserCheck,
  Building2,
  ChevronRight,
  AlertCircle,
  Info,
  Check,
  Landmark,
  BadgeCheck,
  Layers,
  TrendingUp,
  Banknote,
  BarChart3,
  Wallet,
  Star,
  Zap,
  Award,
} from 'lucide-react';

import { allDebitCards } from '../data/mockData';
import { savingsAccounts } from '../data/mockSavingsAccounts';
import { accountDebitCardMappings } from '../data/accountDebitCardMappings';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../hooks/useAuth';
import { useSEO } from '../hooks/useSEO';
import { referralService } from '../services/referralService';
import DebitCardVisual from '../components/DebitCardVisual';
import BankLogo from '../components/BankLogo';

/* ─── constants ─────────────────────────────────────────────────────────────── */

const NA = 'Not available';

const TABS = [
  { id: 'overview',     label: 'Overview' },
  { id: 'benefits',     label: 'Benefits' },
  { id: 'charges',      label: 'Charges' },
  { id: 'limits',       label: 'Limits' },
  { id: 'eligibility',  label: 'Eligibility' },
  { id: 'accounts',     label: 'Related Accounts' },
  { id: 'bank',         label: 'Bank Info' },
];

/* ─── pure helpers ───────────────────────────────────────────────────────────── */

function safeStr(val) {
  if (val === null || val === undefined) return NA;
  const s = String(val).trim();
  return s === ''
    || s === 'Information not available'
    || s === 'Information not available in provided source.'
    ? NA : s;
}

function isAvailable(val) {
  const s = safeStr(val);
  return s !== NA && s.toLowerCase() !== 'no' && s !== 'false' && s !== 'Not Available';
}

/** Bank brand accent colour for the page. */
function getBankAccent(bankName) {
  const b = String(bankName || '').toLowerCase();
  if (b.includes('hdfc'))                          return { color: '#2563EB', light: 'rgba(37,99,235,0.10)',  glow: 'rgba(37,99,235,0.20)'  };
  if (b.includes('icici'))                         return { color: '#3B82F6', light: 'rgba(59,130,246,0.10)', glow: 'rgba(59,130,246,0.20)' };
  if (b.includes('sbi') || b.includes('state bank')) return { color: '#0077C8', light: 'rgba(0,119,200,0.10)',  glow: 'rgba(0,119,200,0.20)'  };
  if (b.includes('axis'))                          return { color: '#97123A', light: 'rgba(151,18,58,0.10)',  glow: 'rgba(151,18,58,0.20)'  };
  if (b.includes('idfc'))                          return { color: '#9E1B32', light: 'rgba(158,27,50,0.10)',  glow: 'rgba(158,27,50,0.20)'  };
  if (b.includes('kotak'))                         return { color: '#ED1C24', light: 'rgba(237,28,36,0.10)',  glow: 'rgba(237,28,36,0.20)'  };
  if (b.includes('indusind'))                      return { color: '#800000', light: 'rgba(128,0,0,0.10)',    glow: 'rgba(128,0,0,0.20)'    };
  if (b.includes('baroda') || b.includes('bob'))   return { color: '#F26522', light: 'rgba(242,101,34,0.10)', glow: 'rgba(242,101,34,0.20)' };
  if (b.includes('punjab') || b.includes('pnb'))   return { color: '#A31D24', light: 'rgba(163,29,36,0.10)',  glow: 'rgba(163,29,36,0.20)'  };
  if (b.includes('canara'))                        return { color: '#0072CE', light: 'rgba(0,114,206,0.10)',  glow: 'rgba(0,114,206,0.20)'  };
  if (b.includes('fi money') || b.includes('niyo') || b.includes('jupiter')) return { color: '#059669', light: 'rgba(5,150,105,0.10)', glow: 'rgba(5,150,105,0.20)' };
  return { color: '#2563EB', light: 'rgba(37,99,235,0.10)', glow: 'rgba(37,99,235,0.20)' };
}

/** Resolve a card from allDebitCards by numeric id OR string card_id / slug. */
function resolveCard(paramId) {
  if (!paramId) return null;
  const str = String(paramId);
  const byNumeric = allDebitCards.find(c => String(c.id) === str);
  if (byNumeric) return byNumeric;
  const bySlug = allDebitCards.find(c => String(c.card_id) === str);
  return bySlug || null;
}

/**
 * Find savings accounts linked to a given debit card.
 * Checks both:
 *  1. savingsAccounts[].debit_card_relationships (inline relationships)
 *  2. accountDebitCardMappings (explicit mapping dataset)
 */
function getLinkedSavingsAccounts(card) {
  if (!card) return [];
  const cardSlug = card.card_id ? String(card.card_id) : null;
  const cardNumId = String(card.id);

  // Step 1: accounts where debit_card_relationships includes this card
  const fromRelationships = savingsAccounts.filter(acc => {
    const rels = acc.debit_card_relationships || [];
    return rels.some(r => {
      const rid = String(r.card_id || '');
      return rid === cardSlug || rid === cardNumId;
    });
  });

  // Step 2: explicit mapping dataset — find account_ids mapped to this card
  const explicitMappings = accountDebitCardMappings.filter(m => {
    const mid = String(m.card_id || '');
    return mid === cardSlug || mid === cardNumId;
  });
  const explicitAccountIds = new Set(explicitMappings.map(m => String(m.account_id)));

  const fromMappings = savingsAccounts.filter(acc => {
    const pid = String(acc.product_id || '');
    const nid = String(acc.id || '');
    return explicitAccountIds.has(pid) || explicitAccountIds.has(nid);
  });

  // Union — deduplicate by account id
  const seen = new Set();
  const all = [];
  for (const acc of [...fromRelationships, ...fromMappings]) {
    const key = String(acc.id);
    if (!seen.has(key)) { seen.add(key); all.push(acc); }
  }
  return all;
}

/**
 * Weighted similar-card scoring.
 * Same bank → +10, same network → +5, same category/variant → +4,
 * similar fee tier (within 3×) → +3, both have/don't have lounge → +2.
 * Exclude self. Take top 4.
 */
function getSimilarCards(card, count = 4) {
  if (!card) return [];
  const selfId    = String(card.id);
  const selfSlug  = card.card_id ? String(card.card_id) : null;
  const selfFee   = card.numAnnualFee ?? card.num_annual_fee ?? 0;
  const selfNet   = String(card.network || '').toLowerCase();
  const selfVar   = String(card.cardVariant || card.category || '').toLowerCase();
  const selfBank  = String(card.bank || '').toLowerCase();
  const selfLounge = isAvailable(card.loungeAccess || card.lounge_access);

  return allDebitCards
    .filter(c => {
      if (String(c.id) === selfId) return false;
      if (selfSlug && c.card_id && String(c.card_id) === selfSlug) return false;
      return true;
    })
    .map(c => {
      let score = 0;
      if (String(c.bank || '').toLowerCase() === selfBank)  score += 10;
      if (String(c.network || '').toLowerCase() === selfNet) score += 5;
      const cVar = String(c.cardVariant || c.category || '').toLowerCase();
      if (cVar && selfVar && cVar === selfVar) score += 4;
      const cFee = c.numAnnualFee ?? c.num_annual_fee ?? 0;
      if (selfFee > 0 && cFee > 0 && cFee / selfFee <= 3 && selfFee / cFee <= 3) score += 3;
      if (isAvailable(c.loungeAccess || c.lounge_access) === selfLounge) score += 2;
      return { card: c, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, count)
    .map(({ card: c }) => c);
}

/** Category tier badge from variant name. */
function getCategoryBadge(card) {
  if (!card) return null;
  const v = String(card.cardVariant || card.category || '').toLowerCase();
  if (v.includes('private'))   return 'Private';
  if (v.includes('wealth'))    return 'Wealth';
  if (v.includes('infinite'))  return 'Infinite';
  if (v.includes('signature')) return 'Signature';
  if (v.includes('platinum'))  return 'Platinum';
  if (v.includes('premium'))   return 'Premium';
  if (v.includes('gold'))      return 'Gold';
  if (v.includes('titanium'))  return 'Titanium';
  if (v.includes('digital'))   return 'Digital';
  if (v.includes('classic'))   return 'Classic';
  return null;
}

/** Relationship label + colour class. */
function relInfo(rel) {
  switch (rel?.relationship) {
    case 'provided': return { label: 'Provided with account', cls: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' };
    case 'optional': return { label: 'Available as option',  cls: 'bg-blue-500/10 border-blue-500/20 text-blue-400'       };
    case 'upgrade':  return { label: 'Upgrade option',       cls: 'bg-purple-500/10 border-purple-500/20 text-purple-400' };
    default:         return { label: 'Associated',           cls: 'bg-slate-500/10 border-slate-500/20 text-slate-400'    };
  }
}

/* ─── Skeleton ───────────────────────────────────────────────────────────────── */
function SkeletonBlock({ className = '' }) {
  return (
    <div
      className={`rounded-xl bg-white/[0.04] animate-pulse ${className}`}
      aria-hidden="true"
    />
  );
}

function DetailPageSkeleton() {
  return (
    <div className="min-h-screen bg-[#04020c] px-4 sm:px-6 lg:px-8 py-6">
      <div className="max-w-[1440px] mx-auto space-y-6">
        <SkeletonBlock className="h-14 w-full" />
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(300px,0.85fr)_minmax(580px,1.5fr)] gap-6">
          <div className="space-y-4">
            <SkeletonBlock className="aspect-[1.586/1] w-full" />
            <SkeletonBlock className="h-28 w-full" />
            <SkeletonBlock className="h-40 w-full" />
          </div>
          <div className="space-y-4">
            <SkeletonBlock className="h-12 w-full" />
            <SkeletonBlock className="h-64 w-full" />
            <SkeletonBlock className="h-48 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── main component ─────────────────────────────────────────────────────────── */

export default function DebitCardDetailPage({ toggleCompareQueue, compareQueue }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const { user, openAuthModal } = useAuth();

  const [activeTab, setActiveTab]         = useState('overview');
  const [shareCopied, setShareCopied]     = useState(false);
  const [showAllCharges, setShowAllCharges] = useState(false);
  const [showAllLimits, setShowAllLimits] = useState(false);
  const [mounted, setMounted]             = useState(false);

  const tabsRef      = useRef(null);
  const sectionRefs  = useRef({});

  // Small mount delay so skeleton shows on page transition
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  // Reset scroll + state when navigating to a different card
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    setActiveTab('overview');
    setShowAllCharges(false);
    setShowAllLimits(false);
  }, [id]);

  /* ── Resolve card from ALL debit cards ── */
  const card = useMemo(() => resolveCard(id), [id]);

  /* ── Derived scalar fields ── */
  const cardId      = card?.id ?? null;
  const cardSlug    = card?.card_id ?? null;
  const cardName    = card?.cardName || card?.name || card?.card_name || 'Debit Card';
  const bankName    = card?.bank || card?.bank_name || 'Bank';
  const network     = safeStr(card?.network);
  const annualFee   = safeStr(card?.annualFee || card?.annual_fee);
  const joiningFee  = safeStr(card?.joiningFee || card?.joining_fee);
  const atmLimit    = safeStr(card?.cashWithdrawalLimit || card?.atm_limit || card?.atmLimit);
  const posLimit    = safeStr(card?.purchaseLimit || card?.pos_limit || card?.posLimit);
  const contactlessLimit = safeStr(card?.contactless_limit || card?.contactlessLimit);
  const onlineLimit = safeStr(card?.onlineLimit || card?.ecomLimit || card?.online_limit);
  const loungeAccess    = safeStr(card?.loungeAccess || card?.lounge_access);
  const forexMarkup     = safeStr(card?.forexMarkup || card?.forex_markup);
  const cashback        = safeStr(card?.cashback);
  const rewardPoints    = safeStr(card?.rewardPoints || card?.rewards);
  const insurance       = safeStr(card?.insurance);
  const airportBenefits = safeStr(card?.airportBenefits || card?.airport_benefits);
  const fuelWaiver      = safeStr(card?.fuelSurchargeWaiver || card?.fuel_surcharge_waiver || card?.fuelWaiver);
  const emi             = safeStr(card?.emi);
  const contactless     = card?.contactless === true || String(card?.contactless || '').toLowerCase() === 'yes';
  const international   = card?.international === true || String(card?.international || '').toLowerCase() === 'yes';
  const description     = safeStr(card?.description);

  // Official website & apply URL
  const officialWebsite = safeStr(card?.officialWebsite || card?.official_website || card?.officialSource || card?.source);
  const applyLink       = card?.applyLink || card?.applyUrl || card?.officialWebsite || '#';

  // Verification
  const verificationStatus = safeStr(card?.verificationStatus || card?.verification_status || card?.dataConfidence || 'Verified');
  const lastVerified        = safeStr(card?.as_of_date || card?.lastVerified || card?.verifyDate);
  const verificationInfo    = safeStr(card?.verification_info || card?.verifyNote);

  // Eligibility — actual data from the card record
  const eligibilityRaw  = safeStr(card?.eligibility);

  // Fees
  const replacementFee  = safeStr(card?.replacementFee || card?.atmCharges);
  const hiddenCharges   = safeStr(card?.hiddenCharges);

  // Category / accent
  const categoryBadge   = getCategoryBadge(card);
  const { color: accentColor, light: accentLight, glow: accentGlow } = getBankAccent(bankName);

  const bestFor = useMemo(() => {
    const b = card?.bestFor || card?.key_benefits;
    if (Array.isArray(b) && b.length) return b;
    if (typeof b === 'string' && b) return [b];
    return [];
  }, [card]);

  const pros = useMemo(() => Array.isArray(card?.pros) ? card.pros : [], [card]);
  const cons = useMemo(() => Array.isArray(card?.cons) ? card.cons : [], [card]);

  const isWishlisted_ = isWishlisted(cardId);
  const isInCompare   = compareQueue?.some(c => String(c.id) === String(cardId)) || false;

  const linkedAccounts = useMemo(() => getLinkedSavingsAccounts(card), [card]);
  const similarCards   = useMemo(() => getSimilarCards(card), [card]);

  /* ── SEO ── */
  useSEO({
    title: card ? `${bankName} ${cardName} | D.Card` : 'Debit Card Details | D.Card',
    description: card
      ? `Explore ${bankName} ${cardName}. Annual fee: ${annualFee}. ATM limit: ${atmLimit}. Benefits, charges, limits and eligibility on D.Card.`
      : 'Explore debit card details on D.Card.',
    canonicalUrl: `https://www.dcard.website/debit-cards/${id}`,
    robots: card ? 'index, follow' : 'noindex, follow',
    schema: card ? {
      '@context': 'https://schema.org',
      '@type': 'FinancialProduct',
      name: `${bankName} ${cardName}`,
      description: description !== NA ? description : undefined,
      provider: { '@type': 'BankOrCreditUnion', name: bankName },
      url: `https://www.dcard.website/debit-cards/${id}`,
    } : null,
  });

  /* ── Tab scroll / intersection ── */
  const scrollToSection = useCallback((tabId) => {
    setActiveTab(tabId);
    const el = sectionRefs.current[tabId];
    if (el) {
      const offset = 90;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  }, []);

  useEffect(() => {
    if (!card || !mounted) return;
    const obs = new IntersectionObserver(
      (entries) => {
        let best = null; let bestRatio = 0;
        entries.forEach(e => {
          if (e.isIntersecting && e.intersectionRatio > bestRatio) {
            bestRatio = e.intersectionRatio; best = e.target.dataset.section;
          }
        });
        if (best) setActiveTab(best);
      },
      { threshold: 0.25, rootMargin: '-80px 0px 0px 0px' }
    );
    Object.values(sectionRefs.current).forEach(el => { if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, [card, mounted]);

  /* ── Action handlers ── */
  const handleApply = useCallback((e) => {
    if (!user) {
      e.preventDefault();
      openAuthModal('required', `apply-${cardId}`);
      return;
    }
    if (card) referralService.logReferralClick(user?.uid || user?.id, card, applyLink, null, 'Product Detail Page');
  }, [user, openAuthModal, cardId, card, applyLink]);

  const handleSave = useCallback((e) => {
    e.stopPropagation();
    if (!card) return;
    if (!user) { openAuthModal('required', `save-card-${cardId}`); return; }
    toggleWishlist(card);
  }, [card, user, openAuthModal, cardId, toggleWishlist]);

  const handleCompare = useCallback((e) => {
    e.stopPropagation();
    if (!card) return;
    if (toggleCompareQueue) toggleCompareQueue(card);
  }, [card, toggleCompareQueue]);

  const handleShare = useCallback(async () => {
    const url = window.location.href;
    const title = `${bankName} ${cardName} | D.Card`;
    try {
      if (navigator.share) {
        await navigator.share({ title, url });
      } else {
        await navigator.clipboard.writeText(url);
        setShareCopied(true);
        setTimeout(() => setShareCopied(false), 2400);
      }
    } catch {
      try {
        await navigator.clipboard.writeText(url);
        setShareCopied(true);
        setTimeout(() => setShareCopied(false), 2400);
      } catch { /* silent */ }
    }
  }, [bankName, cardName]);

  /* ─── Loading state ─────────────────────────────────────────────────────────── */
  if (!mounted) return <DetailPageSkeleton />;

  /* ─── Not found ──────────────────────────────────────────────────────────────── */
  if (!card) {
    return (
      <main className="min-h-screen bg-[#04020c] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center max-w-sm space-y-6"
        >
          <div className="w-20 h-20 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/10">
            <AlertCircle className="w-10 h-10 text-amber-400" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-black text-white">Debit Card Not Found</h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              The requested debit card could not be found in our database, or the URL may be incorrect.
            </p>
          </div>
          <button
            onClick={() => navigate('/debit-cards')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-500 transition-all active:scale-95 shadow-lg shadow-blue-500/25"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Debit Cards
          </button>
        </motion.div>
      </main>
    );
  }

  /* ─── Feature badge list (left panel) ──────────────────────────────────────── */
  const featureBadges = [];
  if (categoryBadge)               featureBadges.push({ icon: <Layers className="w-3.5 h-3.5" />,   label: `${categoryBadge} Card`   });
  if (international)               featureBadges.push({ icon: <Globe className="w-3.5 h-3.5" />,    label: 'International Usage'     });
  if (contactless)                 featureBadges.push({ icon: <Wifi className="w-3.5 h-3.5" />,     label: 'Contactless'             });
  if (isAvailable(loungeAccess))   featureBadges.push({ icon: <Plane className="w-3.5 h-3.5" />,   label: 'Lounge Access'           });
  if (isAvailable(fuelWaiver))     featureBadges.push({ icon: <Fuel className="w-3.5 h-3.5" />,    label: 'Fuel Waiver'             });
  if (isAvailable(rewardPoints))   featureBadges.push({ icon: <Star className="w-3.5 h-3.5" />,    label: 'Reward Points'           });
  if (isAvailable(cashback))       featureBadges.push({ icon: <Gift className="w-3.5 h-3.5" />,    label: 'Cashback'                });
  if (isAvailable(insurance))      featureBadges.push({ icon: <ShieldCheck className="w-3.5 h-3.5" />, label: 'Insurance Cover'     });

  /* ─── Main render ─────────────────────────────────────────────────────────── */
  return (
    <div
      className="min-h-screen bg-[#04020c] text-slate-100"
      style={{ fontFamily: 'Poppins, Inter, sans-serif' }}
    >

      {/* ═══ STICKY PRODUCT HEADER ════════════════════════════════════════════ */}
      <div className="sticky top-0 z-40 bg-[#04020c]/96 backdrop-blur-xl border-b border-blue-900/20 shadow-lg shadow-black/30">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col sm:flex-row sm:items-center gap-3">

          {/* Left: back + identity */}
          <div className="flex items-start sm:items-center gap-3 min-w-0 flex-1">
            <button
              onClick={() => navigate(-1)}
              aria-label="Go back"
              className="shrink-0 w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 flex items-center justify-center text-slate-400 hover:text-white transition-all active:scale-95"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>

            <div className="flex flex-col gap-0.5 min-w-0">
              {/* Bank row */}
              <div className="flex items-center gap-2 flex-wrap">
                <BankLogo bankName={bankName} size="xs" />
                <span className="text-[10px] font-black tracking-widest uppercase"
                  style={{ color: accentColor }}>
                  {bankName}
                </span>
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-black tracking-wide shrink-0">
                  <CheckCircle2 className="w-2.5 h-2.5" aria-hidden />
                  VERIFIED OFFICIAL DATA
                </span>
              </div>
              {/* Card name + category badge */}
              <div className="flex items-center gap-2 flex-wrap min-w-0">
                <h1 className="text-sm sm:text-base font-extrabold text-white truncate">{cardName}</h1>
                {categoryBadge && (
                  <span
                    className="px-2 py-0.5 rounded-full text-[9px] font-black tracking-wide border shrink-0"
                    style={{ background: accentLight, borderColor: `${accentColor}40`, color: accentColor }}
                  >
                    {categoryBadge}
                  </span>
                )}
              </div>
              {/* Short description — desktop only */}
              {description !== NA && (
                <p className="hidden sm:block text-[11px] text-slate-400 leading-snug truncate max-w-xl">{description}</p>
              )}
            </div>
          </div>

          {/* Right: action buttons */}
          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            <a
              href={applyLink !== '#' ? applyLink : undefined}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleApply}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black transition-all shadow-lg hover:shadow-blue-500/30 active:scale-95"
              aria-label={`Apply for ${cardName}`}
            >
              Apply Now <ExternalLink className="w-3 h-3" aria-hidden />
            </a>

            <button
              onClick={handleSave}
              aria-label={isWishlisted_ ? 'Remove from saved' : 'Save this card'}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-bold transition-all active:scale-95 ${
                isWishlisted_
                  ? 'bg-rose-500/15 border-rose-500/30 text-rose-400'
                  : 'bg-white/5 border-white/10 text-slate-300 hover:text-white hover:border-white/20'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${isWishlisted_ ? 'fill-rose-400' : ''}`} aria-hidden />
              <span className="hidden sm:inline">{isWishlisted_ ? 'Saved' : 'Save'}</span>
            </button>

            <button
              onClick={handleCompare}
              aria-label={isInCompare ? 'Remove from compare' : 'Add to compare'}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-bold transition-all active:scale-95 ${
                isInCompare
                  ? 'bg-blue-500/15 border-blue-500/30 text-blue-400'
                  : 'bg-white/5 border-white/10 text-slate-300 hover:text-white hover:border-white/20'
              }`}
            >
              <Scale className="w-3.5 h-3.5" aria-hidden />
              <span className="hidden sm:inline">{isInCompare ? 'In Compare' : 'Compare'}</span>
            </button>

            <button
              onClick={handleShare}
              aria-label="Share this card"
              className="relative flex items-center gap-1.5 px-3 py-2 rounded-xl border border-white/10 bg-white/5 text-slate-300 hover:text-white hover:border-white/20 text-xs font-bold transition-all active:scale-95"
            >
              <AnimatePresence mode="wait" initial={false}>
                {shareCopied
                  ? <motion.span key="copied" initial={{ scale: 0.7 }} animate={{ scale: 1 }}><Check className="w-3.5 h-3.5 text-emerald-400" /></motion.span>
                  : <motion.span key="share"  initial={{ scale: 0.7 }} animate={{ scale: 1 }}><Share2 className="w-3.5 h-3.5" /></motion.span>
                }
              </AnimatePresence>
              <span className="hidden sm:inline">{shareCopied ? 'Copied!' : 'Share'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ═══ DISCLAIMER BANNER ════════════════════════════════════════════════ */}
      <div className="bg-amber-500/5 border-b border-amber-500/10 px-4 py-2">
        <p className="max-w-[1440px] mx-auto text-[10px] text-amber-400/80 text-center font-medium">
          D.CARD is an independent information platform. We do not process bank applications.
          Clicking &ldquo;Apply Now&rdquo; takes you to the official bank website.
        </p>
      </div>

      {/* ═══ MAIN CONTENT ═════════════════════════════════════════════════════ */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(300px,0.85fr)_minmax(580px,1.5fr)] gap-6 lg:gap-8 items-start">

          {/* ═══ LEFT PANEL ═══════════════════════════════════════════════════ */}
          <div className="flex flex-col gap-5">

            {/* Card Visual */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="rounded-2xl bg-white/[0.025] border border-blue-900/25 p-5 flex flex-col items-center gap-4 shadow-xl shadow-black/20"
              style={{ boxShadow: `0 0 40px -10px ${accentGlow}` }}
            >
              <div className="w-full max-w-[300px] mx-auto">
                <DebitCardVisual mode="details" card={card} finish="classic" />
              </div>
              <p className="text-[9px] text-slate-600 font-bold uppercase tracking-wider text-center">
                Illustrative card mockup — not an actual card image
              </p>
            </motion.div>

            {/* Feature Badges */}
            {featureBadges.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 }}
                className="grid grid-cols-2 gap-2"
              >
                {featureBadges.map((f, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-white/[0.04] border border-blue-900/20 text-slate-300 hover:border-blue-700/30 transition-colors"
                  >
                    <span className="text-blue-400 shrink-0" style={{ color: accentColor }} aria-hidden>{f.icon}</span>
                    <span className="text-[10px] font-bold truncate">{f.label}</span>
                  </div>
                ))}
              </motion.div>
            )}

            {/* Quick Overview */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.14 }}
              className="rounded-2xl bg-white/[0.025] border border-blue-900/25 p-5 space-y-4 shadow-lg shadow-black/10"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-black text-slate-300 uppercase tracking-widest">Quick Overview</h2>
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-black">
                  <Check className="w-2.5 h-2.5" aria-hidden /> Verified
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: <Banknote className="w-3.5 h-3.5" />,  label: 'Annual Fee',   value: annualFee  },
                  { icon: <Gift className="w-3.5 h-3.5" />,      label: 'Joining Fee',  value: joiningFee },
                  { icon: <CreditCard className="w-3.5 h-3.5" />,label: 'Card Type',    value: safeStr(card?.cardVariant || card?.category) },
                  { icon: <Globe className="w-3.5 h-3.5" />,     label: 'Network',      value: network    },
                  { icon: <Wallet className="w-3.5 h-3.5" />,    label: 'ATM Limit',    value: atmLimit   },
                  { icon: <BarChart3 className="w-3.5 h-3.5" />, label: 'POS Limit',    value: posLimit   },
                ].map((item, i) => (
                  <div key={i} className="space-y-0.5">
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <span style={{ color: `${accentColor}99` }} aria-hidden>{item.icon}</span>
                      <span className="text-[9px] font-black uppercase tracking-wider">{item.label}</span>
                    </div>
                    <p className="text-xs font-bold text-white leading-snug pl-5">{item.value}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Verification Card */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.20 }}
              className="rounded-2xl bg-emerald-500/[0.04] border border-emerald-500/15 p-4 space-y-3 shadow-lg shadow-emerald-500/5"
            >
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" aria-hidden />
                </div>
                <div className="space-y-0.5">
                  <h3 className="text-xs font-black text-emerald-400">Verified Data</h3>
                  <p className="text-[10px] text-slate-400 leading-snug">
                    {verificationInfo !== NA
                      ? verificationInfo
                      : 'Information sourced from official bank website and regulatory documentation.'}
                  </p>
                </div>
              </div>
              <div className="border-t border-emerald-500/10 pt-3 space-y-1.5 text-[10px]">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-semibold">Status</span>
                  <span className="text-emerald-400 font-bold">{verificationStatus}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-semibold">Last verified</span>
                  <span className="text-slate-300 font-bold">{lastVerified}</span>
                </div>
                {officialWebsite !== NA && (
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-semibold">Source</span>
                    <a
                      href={officialWebsite}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 font-bold flex items-center gap-0.5 hover:text-blue-300 transition-colors"
                      aria-label="Official bank source"
                    >
                      Official Site <ExternalLink className="w-2.5 h-2.5" aria-hidden />
                    </a>
                  </div>
                )}
              </div>
            </motion.div>

          </div>{/* end left panel */}

          {/* ═══ RIGHT PANEL ══════════════════════════════════════════════════ */}
          <div className="flex flex-col gap-0">

            {/* Sticky Tabs */}
            <div
              ref={tabsRef}
              className="sticky top-[88px] z-30 bg-[#04020c]/96 backdrop-blur-xl rounded-t-2xl border border-b-0 border-blue-900/20 overflow-hidden"
            >
              <div className="flex overflow-x-auto scrollbar-hide" role="tablist" aria-label="Product details tabs">
                {TABS.map(tab => (
                  <button
                    key={tab.id}
                    role="tab"
                    aria-selected={activeTab === tab.id}
                    aria-controls={`section-${tab.id}`}
                    onClick={() => scrollToSection(tab.id)}
                    className={`shrink-0 px-4 py-3.5 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-400 bg-blue-500/5'
                        : 'border-transparent text-slate-500 hover:text-slate-200 hover:border-slate-600'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Sections container */}
            <div className="border border-t-0 border-blue-900/20 rounded-b-2xl bg-white/[0.015] divide-y divide-blue-900/10">

              {/* ══ OVERVIEW ════════════════════════════════════════════════ */}
              <section
                id="section-overview"
                data-section="overview"
                ref={el => sectionRefs.current['overview'] = el}
                className="p-5 sm:p-6 space-y-5"
                aria-label="Overview section"
              >
                {/* Banner with accent gradient */}
                <div
                  className="rounded-2xl p-5 border flex flex-col sm:flex-row gap-4 items-start"
                  style={{
                    background: `linear-gradient(135deg, ${accentLight}, transparent 70%)`,
                    borderColor: `${accentColor}22`,
                  }}
                >
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: accentLight, border: `1px solid ${accentColor}30` }}
                  >
                    <BadgeCheck className="w-6 h-6" style={{ color: accentColor }} aria-hidden />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-black text-white">{cardName}</h3>
                      {categoryBadge && (
                        <span
                          className="px-2 py-0.5 rounded-full text-[9px] font-black border"
                          style={{ background: accentLight, borderColor: `${accentColor}30`, color: accentColor }}
                        >
                          {categoryBadge}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed mt-1">
                      {description !== NA ? description : `The ${cardName} is issued by ${bankName}.`}
                    </p>
                  </div>
                  {bestFor.length > 0 && (
                    <div className="shrink-0 flex flex-col gap-1.5">
                      {bestFor.slice(0, 2).map((b, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 rounded-lg text-[9px] font-black text-center"
                          style={{ background: accentLight, color: accentColor, border: `1px solid ${accentColor}30` }}
                        >
                          {b}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Key Specs Grid */}
                <div className="space-y-2.5">
                  <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Key Specifications</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { label: 'Annual Fee',    value: annualFee,  icon: <Banknote className="w-3.5 h-3.5" />   },
                      { label: 'Joining Fee',   value: joiningFee, icon: <Gift className="w-3.5 h-3.5" />       },
                      { label: 'Card Network',  value: network,    icon: <Globe className="w-3.5 h-3.5" />      },
                      { label: 'Card Variant',  value: safeStr(card?.cardVariant || card?.category), icon: <CreditCard className="w-3.5 h-3.5" /> },
                      { label: 'ATM Limit',     value: atmLimit,   icon: <Wallet className="w-3.5 h-3.5" />     },
                      { label: 'POS Limit',     value: posLimit,   icon: <BarChart3 className="w-3.5 h-3.5" />  },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3 p-3.5 rounded-xl bg-white/[0.03] border border-blue-900/15 hover:border-blue-700/25 transition-colors">
                        <span style={{ color: `${accentColor}90` }} className="shrink-0" aria-hidden>{item.icon}</span>
                        <div>
                          <span className="block text-[9px] font-black text-slate-500 uppercase tracking-wider">{item.label}</span>
                          <span className="text-xs font-bold text-white mt-0.5 leading-snug block">{item.value}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pros & Cons */}
                {(pros.length > 0 || cons.length > 0) && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {pros.length > 0 && (
                      <div className="p-4 rounded-xl bg-emerald-500/[0.03] border border-emerald-500/15 space-y-2">
                        <h4 className="text-[10px] font-black text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                          <Check className="w-3 h-3" aria-hidden /> Advantages
                        </h4>
                        <ul className="space-y-1.5">
                          {pros.map((p, i) => (
                            <li key={i} className="flex items-start gap-2 text-[11px] text-slate-300 leading-snug">
                              <span className="text-emerald-500 mt-0.5 shrink-0">•</span>{p}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {cons.length > 0 && (
                      <div className="p-4 rounded-xl bg-rose-500/[0.03] border border-rose-500/15 space-y-2">
                        <h4 className="text-[10px] font-black text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                          <AlertCircle className="w-3 h-3" aria-hidden /> Limitations
                        </h4>
                        <ul className="space-y-1.5">
                          {cons.map((c, i) => (
                            <li key={i} className="flex items-start gap-2 text-[11px] text-slate-300 leading-snug">
                              <span className="text-rose-400 mt-0.5 shrink-0">•</span>{c}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </section>

              {/* ══ BENEFITS ════════════════════════════════════════════════ */}
              <section
                id="section-benefits"
                data-section="benefits"
                ref={el => sectionRefs.current['benefits'] = el}
                className="p-5 sm:p-6 space-y-4"
                aria-label="Benefits section"
              >
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-blue-400" aria-hidden />
                  Key Features &amp; Benefits
                </h3>

                <div className="space-y-2.5">
                  {[
                    { key: 'Lounge Access',          value: loungeAccess,    icon: <Plane className="w-4 h-4" />,       available: isAvailable(loungeAccess)    },
                    { key: 'Cashback / Rewards',     value: cashback,        icon: <Gift className="w-4 h-4" />,        available: isAvailable(cashback)        },
                    { key: 'Reward Points',          value: rewardPoints,    icon: <Star className="w-4 h-4" />,        available: isAvailable(rewardPoints)    },
                    { key: 'Insurance Cover',        value: insurance,       icon: <ShieldCheck className="w-4 h-4" />, available: isAvailable(insurance)       },
                    { key: 'Fuel Surcharge Waiver',  value: fuelWaiver,      icon: <Fuel className="w-4 h-4" />,        available: isAvailable(fuelWaiver)      },
                    { key: 'Airport Benefits',       value: airportBenefits, icon: <Plane className="w-4 h-4" />,       available: isAvailable(airportBenefits) },
                    { key: 'International Usage',    value: international ? 'Supported globally' : NA, icon: <Globe className="w-4 h-4" />, available: international },
                    { key: 'Contactless Payments',   value: contactless  ? 'Tap & Pay supported' : NA, icon: <Wifi className="w-4 h-4" />,  available: contactless  },
                    { key: 'EMI Facility',           value: emi,             icon: <Banknote className="w-4 h-4" />,    available: isAvailable(emi)             },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className={`flex items-start gap-4 p-4 rounded-xl border transition-all ${
                        item.available
                          ? 'bg-white/[0.03] border-blue-900/20 hover:border-blue-700/30'
                          : 'bg-white/[0.01] border-white/5 opacity-50'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        item.available ? 'bg-blue-500/10 text-blue-400' : 'bg-white/5 text-slate-700'
                      }`} aria-hidden>
                        {item.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">{item.key}</span>
                        <span className="block text-xs font-semibold text-slate-200 mt-0.5 leading-snug">{item.value}</span>
                      </div>
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border shrink-0 mt-0.5 ${
                        item.available
                          ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                          : 'bg-white/5 border-white/10 text-slate-700'
                      }`}>
                        {item.available ? '✓ Active' : '✕ N/A'}
                      </span>
                    </div>
                  ))}
                </div>
              </section>

              {/* ══ CHARGES ═════════════════════════════════════════════════ */}
              <section
                id="section-charges"
                data-section="charges"
                ref={el => sectionRefs.current['charges'] = el}
                className="p-5 sm:p-6 space-y-4"
                aria-label="Charges and fees section"
              >
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <Banknote className="w-4 h-4 text-blue-400" aria-hidden />
                  Charges &amp; Fees
                </h3>

                {(() => {
                  const rows = [
                    { label: 'Annual Fee',                value: annualFee      },
                    { label: 'Joining / Issuance Fee',    value: joiningFee     },
                    { label: 'Forex / International Fee', value: forexMarkup    },
                    { label: 'Card Replacement Fee',      value: replacementFee },
                    { label: 'Other / Hidden Charges',    value: hiddenCharges  },
                  ].filter(r => r.value !== NA);

                  if (rows.length === 0) {
                    return (
                      <p className="text-xs text-slate-500 font-medium py-6 text-center bg-white/[0.02] rounded-xl border border-blue-900/10">
                        Charges information not available for this card.
                      </p>
                    );
                  }

                  const visible = showAllCharges ? rows : rows.slice(0, 4);
                  return (
                    <>
                      <div className="rounded-xl border border-blue-900/20 overflow-hidden">
                        <div className="grid grid-cols-2 bg-white/[0.04] border-b border-blue-900/10 px-4 py-2.5">
                          <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Fee Type</span>
                          <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Amount</span>
                        </div>
                        {visible.map((row, i) => (
                          <div key={i} className="grid grid-cols-2 px-4 py-3 border-b border-blue-900/[0.08] last:border-0 hover:bg-white/[0.02] transition-colors">
                            <span className="text-xs font-semibold text-slate-300">{row.label}</span>
                            <span className="text-xs font-bold text-white">{row.value}</span>
                          </div>
                        ))}
                      </div>
                      {rows.length > 4 && (
                        <button
                          onClick={() => setShowAllCharges(v => !v)}
                          className="text-xs text-blue-400 font-bold hover:text-blue-300 transition-colors"
                        >
                          {showAllCharges ? '↑ Show Less' : `↓ View All (${rows.length} charges)`}
                        </button>
                      )}
                    </>
                  );
                })()}

                {/* Transparency note */}
                <div className="p-3.5 rounded-xl bg-amber-500/[0.04] border border-amber-500/15 flex gap-3 items-start">
                  <Info className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" aria-hidden />
                  <p className="text-[10px] text-amber-300/80 leading-relaxed font-medium">
                    Standard bank charges may apply even when not listed — including ATM decline fees and SMS alert charges.
                    Always verify the Schedule of Charges on the official bank website.
                  </p>
                </div>
              </section>

              {/* ══ LIMITS ══════════════════════════════════════════════════ */}
              <section
                id="section-limits"
                data-section="limits"
                ref={el => sectionRefs.current['limits'] = el}
                className="p-5 sm:p-6 space-y-4"
                aria-label="Transaction limits section"
              >
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-blue-400" aria-hidden />
                  Transaction Limits
                </h3>

                {(() => {
                  const rows = [
                    { label: 'ATM Withdrawal Limit',      value: atmLimit         },
                    { label: 'POS / Shopping Limit',      value: posLimit         },
                    { label: 'Contactless Limit',         value: contactlessLimit },
                    { label: 'Online Transaction Limit',  value: onlineLimit      },
                    {
                      label: 'International Usage',
                      value: international ? 'Supported — refer bank for international limit' : NA,
                    },
                    ...(
                      (card?.dailyLimit || card?.maxLimit)
                        ? [{ label: 'Daily Transaction Limit', value: `Up to ₹${Number(card.dailyLimit || card.maxLimit || 0).toLocaleString('en-IN')}` }]
                        : []
                    ),
                  ].filter(r => r.value !== NA);

                  const visible = showAllLimits ? rows : rows.slice(0, 4);
                  return (
                    <>
                      {rows.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {visible.map((item, i) => (
                            <div key={i} className="p-4 rounded-xl bg-white/[0.03] border border-blue-900/20 hover:border-blue-700/30 transition-colors">
                              <span className="block text-[9px] font-black text-slate-500 uppercase tracking-wider mb-1">{item.label}</span>
                              <span className="text-sm font-black text-white">{item.value}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-slate-500 font-medium py-6 text-center bg-white/[0.02] rounded-xl border border-blue-900/10">
                          Limit information not available for this card.
                        </p>
                      )}
                      {rows.length > 4 && (
                        <button
                          onClick={() => setShowAllLimits(v => !v)}
                          className="text-xs text-blue-400 font-bold hover:text-blue-300 transition-colors"
                        >
                          {showAllLimits ? '↑ Show Less' : `↓ View All (${rows.length} limits)`}
                        </button>
                      )}
                    </>
                  );
                })()}
              </section>

              {/* ══ ELIGIBILITY ═════════════════════════════════════════════ */}
              <section
                id="section-eligibility"
                data-section="eligibility"
                ref={el => sectionRefs.current['eligibility'] = el}
                className="p-5 sm:p-6 space-y-4"
                aria-label="Eligibility section"
              >
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-blue-400" aria-hidden />
                  Eligibility
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Age requirement — standard regulatory across all Indian banks */}
                  <div className="p-4 rounded-xl bg-white/[0.03] border border-blue-900/20">
                    <span className="block text-[9px] font-black text-slate-500 uppercase tracking-wider mb-1">Age Requirement</span>
                    <span className="text-xs font-semibold text-slate-200 leading-snug">
                      18 years and above (Minor accounts require parental supervision)
                    </span>
                  </div>

                  {/* Residency — standard across all Indian banks */}
                  <div className="p-4 rounded-xl bg-white/[0.03] border border-blue-900/20">
                    <span className="block text-[9px] font-black text-slate-500 uppercase tracking-wider mb-1">Residency</span>
                    <span className="text-xs font-semibold text-slate-200 leading-snug">
                      Resident Indian Individual
                    </span>
                  </div>

                  {/* Account requirement — from actual card data */}
                  <div className="p-4 rounded-xl bg-white/[0.03] border border-blue-900/20">
                    <span className="block text-[9px] font-black text-slate-500 uppercase tracking-wider mb-1">Account Requirement</span>
                    <span className="text-xs font-semibold text-slate-200 leading-snug">
                      {eligibilityRaw !== NA
                        ? eligibilityRaw
                        : `Valid savings / current account with ${bankName}`}
                    </span>
                  </div>

                  {/* KYC — standard regulatory across all Indian banks */}
                  <div className="p-4 rounded-xl bg-white/[0.03] border border-blue-900/20">
                    <span className="block text-[9px] font-black text-slate-500 uppercase tracking-wider mb-1">KYC Documents</span>
                    <span className="text-xs font-semibold text-slate-200 leading-snug">
                      Aadhaar Card, PAN Card &amp; KYC as per RBI guidelines
                    </span>
                  </div>

                  {/* Student friendly — if flagged in dataset */}
                  {card?.studentFriendly === true && (
                    <div className="p-4 rounded-xl bg-emerald-500/[0.04] border border-emerald-500/15">
                      <span className="block text-[9px] font-black text-emerald-500 uppercase tracking-wider mb-1">Student Eligible</span>
                      <span className="text-xs font-semibold text-slate-200 leading-snug">
                        Specifically eligible for student account holders
                      </span>
                    </div>
                  )}

                  {/* Salary account — if flagged */}
                  {card?.salary_account === true && (
                    <div className="p-4 rounded-xl bg-blue-500/[0.04] border border-blue-500/15">
                      <span className="block text-[9px] font-black text-blue-400 uppercase tracking-wider mb-1">Salary Account</span>
                      <span className="text-xs font-semibold text-slate-200 leading-snug">
                        Available to corporate / salary account holders
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-3.5 rounded-xl bg-blue-500/[0.04] border border-blue-500/15 flex gap-3 items-start">
                  <Info className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" aria-hidden />
                  <p className="text-[10px] text-blue-300/80 leading-relaxed font-medium">
                    Eligibility conditions vary by account type and bank policy. Please verify with {bankName} before applying.
                  </p>
                </div>
              </section>

              {/* ══ RELATED ACCOUNTS ════════════════════════════════════════ */}
              <section
                id="section-accounts"
                data-section="accounts"
                ref={el => sectionRefs.current['accounts'] = el}
                className="p-5 sm:p-6 space-y-4"
                aria-label="Related savings accounts section"
              >
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-blue-400" aria-hidden />
                  Related Savings Accounts
                </h3>

                {linkedAccounts.length > 0 ? (
                  <div className="space-y-3">
                    {linkedAccounts.map((acc, i) => {
                      // Find the relationship for this card in the account's relationships
                      const relFromAccount = (acc.debit_card_relationships || []).find(r => {
                        const rid = String(r.card_id || '');
                        return rid === String(cardSlug || '') || rid === String(cardId || '');
                      });
                      // Also check explicit mappings
                      const relFromMappings = accountDebitCardMappings.find(m => {
                        const mid = String(m.card_id || '');
                        const accPid = String(acc.product_id || '');
                        const accNid = String(acc.id || '');
                        return (mid === String(cardSlug || '') || mid === String(cardId || ''))
                          && (String(m.account_id) === accPid || String(m.account_id) === accNid);
                      });
                      const rel = relFromAccount || relFromMappings;
                      const { label: relLabel, cls: relCls } = relInfo(rel);

                      return (
                        <motion.div
                          key={acc.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.03] border border-blue-900/20 hover:border-blue-700/30 hover:bg-white/[0.05] transition-all group"
                        >
                          <BankLogo bankName={acc.bank_name || acc.bank} size="sm" />
                          <div className="flex-1 min-w-0">
                            <span className="block text-[9px] font-black text-slate-500 uppercase tracking-wider">
                              {acc.bank_name || acc.bank}
                            </span>
                            <span className="block text-xs font-bold text-white truncate">
                              {acc.variant_name || acc.accountName}
                            </span>
                            <div className="flex items-center gap-3 mt-1">
                              {acc.interest_rate && (
                                <span className="text-[9px] text-slate-400 font-semibold">
                                  Interest: <strong className="text-slate-200">{acc.interest_rate}</strong>
                                </span>
                              )}
                              {acc.minimum_balance && (
                                <span className="text-[9px] text-slate-400 font-semibold">
                                  Min Bal: <strong className="text-slate-200">{acc.minimum_balance}</strong>
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2 shrink-0">
                            <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border ${relCls}`}>
                              {relLabel}
                            </span>
                            <Link
                              to={`/savings-accounts/${acc.product_id || acc.id}`}
                              className="flex items-center gap-1 text-[10px] text-blue-400 font-bold hover:text-blue-300 transition-colors group-hover:gap-1.5"
                              aria-label={`View ${acc.variant_name || acc.accountName} details`}
                            >
                              View Account <ChevronRight className="w-3 h-3" aria-hidden />
                            </Link>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="py-10 text-center bg-white/[0.02] rounded-xl border border-blue-900/10 space-y-2">
                    <Building2 className="w-8 h-8 text-slate-700 mx-auto" />
                    <p className="text-sm text-slate-500 font-semibold">Linked account information not available</p>
                    <p className="text-xs text-slate-600">No verified savings account relationship found for this card.</p>
                  </div>
                )}
              </section>

              {/* ══ BANK INFO ═══════════════════════════════════════════════ */}
              <section
                id="section-bank"
                data-section="bank"
                ref={el => sectionRefs.current['bank'] = el}
                className="p-5 sm:p-6 space-y-4"
                aria-label="Bank information section"
              >
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <Landmark className="w-4 h-4 text-blue-400" aria-hidden />
                  Bank Information
                </h3>

                <div className="rounded-2xl bg-white/[0.03] border border-blue-900/20 p-5 space-y-4">
                  {/* Bank logo + name */}
                  <div className="flex items-center gap-4">
                    <BankLogo bankName={bankName} size="lg" />
                    <div>
                      <h4 className="text-base font-black text-white">{bankName}</h4>
                      {officialWebsite !== NA && (
                        <a
                          href={officialWebsite}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs text-blue-400 font-semibold hover:text-blue-300 mt-0.5 transition-colors"
                          aria-label={`Visit ${bankName} official website`}
                        >
                          <ExternalLink className="w-3 h-3" aria-hidden />
                          Official Website
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Info grid */}
                  <div className="grid grid-cols-2 gap-3 border-t border-blue-900/10 pt-4">
                    {[
                      { label: 'Verification Status', value: verificationStatus },
                      { label: 'Data Verified On',    value: lastVerified       },
                      { label: 'Card Network',         value: network            },
                      { label: 'Official Source',      value: officialWebsite !== NA ? 'Available' : NA },
                    ].map((item, i) => (
                      <div key={i}>
                        <span className="block text-[9px] font-black text-slate-500 uppercase tracking-wider">{item.label}</span>
                        <span className="block text-xs font-bold text-white mt-0.5">{item.value}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA to bank website */}
                  {officialWebsite !== NA && (
                    <a
                      href={officialWebsite}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 w-full justify-center px-4 py-2.5 rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-400 text-xs font-bold hover:bg-blue-600/18 hover:border-blue-500/35 transition-all"
                      aria-label={`Visit ${bankName} official website`}
                    >
                      <ExternalLink className="w-3.5 h-3.5" aria-hidden />
                      Visit Official Bank Website
                    </a>
                  )}
                </div>
              </section>

            </div>{/* end divide-y */}
          </div>{/* end right panel */}
        </div>{/* end grid */}
      </div>{/* end max-w */}

      {/* ═══ SIMILAR DEBIT CARDS ══════════════════════════════════════════════ */}
      {similarCards.length > 0 && (
        <div className="border-t border-blue-900/15 mt-8">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-black text-white uppercase tracking-widest">Similar Debit Cards</h2>
                <p className="text-[10px] text-slate-500 font-medium mt-0.5">Based on bank, network &amp; category</p>
              </div>
              <Link
                to="/debit-cards"
                className="text-xs text-blue-400 font-bold hover:text-blue-300 transition-colors flex items-center gap-1"
              >
                View All <ChevronRight className="w-3 h-3" aria-hidden />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {similarCards.map((sc, i) => {
                const scFee    = safeStr(sc.annualFee || sc.annual_fee);
                const scName   = sc.cardName || sc.name || sc.card_name || 'Debit Card';
                const scBank   = sc.bank || sc.bank_name || '';
                const scBestFor = Array.isArray(sc.bestFor) && sc.bestFor[0]
                  ? sc.bestFor[0]
                  : safeStr(sc.bestFor);
                const scAccent = getBankAccent(scBank);
                return (
                  <motion.div
                    key={sc.id || i}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07 }}
                    className="group"
                  >
                    <Link
                      to={`/debit-cards/${sc.card_id || sc.id}`}
                      className="block p-4 rounded-2xl bg-white/[0.025] border border-blue-900/20 hover:border-blue-500/30 hover:bg-white/[0.05] transition-all space-y-3 h-full"
                      aria-label={`View ${scName} details`}
                    >
                      <div className="flex items-center gap-2.5">
                        <BankLogo bankName={scBank} size="sm" />
                        <div className="min-w-0">
                          <span className="block text-[9px] font-black text-slate-500 uppercase tracking-wider truncate">{scBank}</span>
                          <span className="block text-xs font-bold text-white truncate">{scName}</span>
                        </div>
                      </div>

                      {/* Mini card visual strip */}
                      <div
                        className="h-7 rounded-lg flex items-center px-2.5"
                        style={{ background: `linear-gradient(135deg, ${scAccent.light}, ${scAccent.glow})`, border: `1px solid ${scAccent.color}20` }}
                      >
                        <span className="text-[9px] font-black truncate" style={{ color: scAccent.color }}>
                          {scFee !== NA ? scFee : 'Annual Fee N/A'}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-2 border-t border-blue-900/10 pt-2.5">
                        {scBestFor !== NA && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/15 font-semibold truncate max-w-[100px]">
                            {scBestFor}
                          </span>
                        )}
                        <span className="flex items-center gap-0.5 text-[10px] text-slate-400 font-semibold group-hover:text-blue-400 transition-colors ml-auto">
                          View <ChevronRight className="w-3 h-3" aria-hidden />
                        </span>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ═══ MOBILE BOTTOM CTA BAR ═════════════════════════════════════════════ */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#04020c]/96 backdrop-blur-xl border-t border-blue-900/20 p-3 flex items-center gap-2.5 lg:hidden shadow-2xl shadow-black/40">
        <a
          href={applyLink !== '#' ? applyLink : undefined}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleApply}
          className="flex-1 py-3 text-center rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black transition-all active:scale-95 shadow-lg shadow-blue-500/20"
          aria-label={`Apply for ${cardName}`}
        >
          Apply Now ↗
        </a>
        <button
          onClick={handleSave}
          aria-label={isWishlisted_ ? 'Remove from saved' : 'Save card'}
          className={`flex-1 py-3 rounded-xl border transition-all text-xs font-bold active:scale-95 flex items-center justify-center gap-1.5 ${
            isWishlisted_
              ? 'bg-rose-500/15 border-rose-500/30 text-rose-400'
              : 'bg-white/5 border-white/10 text-slate-300'
          }`}
        >
          <Heart className={`w-3.5 h-3.5 ${isWishlisted_ ? 'fill-rose-400' : ''}`} aria-hidden />
          {isWishlisted_ ? 'Saved' : 'Save'}
        </button>
        <button
          onClick={handleCompare}
          aria-label={isInCompare ? 'Remove from compare' : 'Add to compare'}
          className={`flex-1 py-3 rounded-xl border transition-all text-xs font-bold active:scale-95 flex items-center justify-center gap-1.5 ${
            isInCompare
              ? 'bg-blue-500/15 border-blue-500/30 text-blue-400'
              : 'bg-white/5 border-white/10 text-slate-300'
          }`}
        >
          <Scale className="w-3.5 h-3.5" aria-hidden />
          {isInCompare ? 'Selected' : 'Compare'}
        </button>
      </div>

      {/* Bottom padding for mobile CTA */}
      <div className="h-16 lg:hidden" aria-hidden />

    </div>
  );
}
