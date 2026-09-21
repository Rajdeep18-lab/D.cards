import React, { useState, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, ShieldCheck, CreditCard, Building2,
  ArrowRight, CheckCircle2, Scale, ExternalLink,
  ChevronRight, Bot, Landmark, Globe, Wallet,
  BarChart3, TrendingUp, Zap, Search,
} from 'lucide-react';
import AIChatAssistant from '../components/AIChatAssistant';
import BankLogo from '../components/BankLogo';
import { useSEO } from '../hooks/useSEO';
import { useNavigate as useNav } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';

/* ─── Data ───────────────────────────────────────────────────────────────────── */

const SUGGESTED_PROMPTS = [
  { category: 'Zero Balance',    query: 'Which savings account has zero minimum balance?'                        },
  { category: 'SBI vs HDFC',     query: 'Compare SBI and HDFC savings accounts'                                  },
  { category: 'Student Account', query: 'Which savings account is suitable for a student?'                       },
  { category: 'Debit Card Link', query: 'What debit card comes with SBI Savings Plus Account and what features?' },
  { category: 'Lounge Access',   query: 'Which debit cards offer complimentary airport lounge access?'           },
  { category: 'Video KYC',       query: 'Which savings accounts can be opened online via Video KYC?'             },
];

const QUICK_NAV = [
  { label: 'Savings Accounts',  href: '/savings-accounts',  icon: <Building2  className="w-4 h-4" /> },
  { label: 'Current Accounts',  href: '/current-accounts',  icon: <Landmark   className="w-4 h-4" /> },
  { label: 'Debit Cards',       href: '/debit-cards',       icon: <CreditCard className="w-4 h-4" /> },
  { label: 'Compare Products',  href: '/compare',           icon: <Scale      className="w-4 h-4" /> },
];

/* ─── ProductInsightsPanel ───────────────────────────────────────────────────── */

/**
 * Richer product card for the right-side insights panel.
 * Larger than the inline mini-card — shows more info.
 */
/* ─── ProductInsightsPanel ───────────────────────────────────────────────────── */

/**
 * Richer product card for the right-side insights panel.
 */
function InsightCard({ item, type, navigate, toggleWishlist, isWishlisted }) {
  const isAccount = type === 'account';
  const name      = isAccount
    ? (item.accountName || item.variant_name || 'Account')
    : (item.cardName    || item.name          || 'Card');
  const bankName  = item.bank_name || item.bank || '';
  const href      = isAccount
    ? `/savings-accounts/${item.product_id || item.id}`
    : `/debit-cards/${item.card_id || item.id}`;

  const m1Label = isAccount ? 'Interest Rate' : 'Annual Fee';
  const m1Value = isAccount
    ? (item.interest_rate  || item.interestRate || '—')
    : (item.annualFee      || item.annual_fee   || '—');
  const m2Label = isAccount ? 'Min Balance'  : 'ATM Limit';
  const m2Value = isAccount
    ? (item.minimum_balance     || item.minimumBalance    || '—')
    : (item.cashWithdrawalLimit || item.atm_limit         || '—');
  const m3Label = isAccount ? 'Account Type' : 'Network';
  const m3Value = isAccount
    ? (item.account_type   || item.accountType   || '—')
    : (item.network                               || '—');

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 rounded-2xl bg-white border border-gray-200/90 hover:border-[#2563EB]/40 hover:shadow-sm transition-all group space-y-3"
    >
      {/* Header */}
      <div className="flex items-start gap-3">
        <BankLogo bankName={bankName} size="sm" className="shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <p className="text-[9px] font-black text-gray-400 uppercase tracking-wider truncate">{bankName}</p>
          <p className="text-xs font-bold text-gray-900 leading-snug truncate">{name}</p>
        </div>
        <span
          className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wide border shrink-0 ${
            isAccount
              ? 'bg-emerald-50 border-emerald-200 text-emerald-600'
              : 'bg-blue-50 border-blue-200 text-blue-600'
          }`}
        >
          {isAccount ? 'Savings' : 'Debit Card'}
        </span>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-3 gap-2 py-1 bg-gray-50/80 rounded-xl px-2.5 border border-gray-100">
        {[
          { label: m1Label, value: m1Value },
          { label: m2Label, value: m2Value },
          { label: m3Label, value: m3Value },
        ].map(({ label, value }) => (
          <div key={label} className="space-y-0.5 min-w-0">
            <p className="text-[8px] font-black text-gray-400 uppercase tracking-wide truncate">{label}</p>
            <p className="text-[11px] font-bold text-gray-800 leading-snug truncate" title={value}>{value}</p>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 pt-1 border-t border-gray-100">
        <button
          onClick={() => navigate(href)}
          className="flex-1 py-1.5 text-xs font-bold text-white bg-[#2563EB] hover:bg-blue-700 rounded-xl transition-all active:scale-95 shadow-xs"
        >
          View Details
        </button>
        <button
          onClick={() => toggleWishlist(item)}
          title={isWishlisted(item.id) ? 'Remove from saved' : 'Save'}
          className={`p-1.5 rounded-xl border transition-colors ${
            isWishlisted(item.id)
              ? 'bg-rose-50 border-rose-200 text-rose-500'
              : 'bg-white border-gray-200 text-gray-400 hover:text-rose-400 hover:border-rose-200'
          }`}
          aria-label={isWishlisted(item.id) ? 'Remove from saved' : 'Save product'}
        >
          <span className="text-xs">♥</span>
        </button>
      </div>
    </motion.div>
  );
}

/** Right-side product insights panel */
function ProductInsightsPanel({ insights, navigate, toggleWishlist, isWishlisted }) {
  const { accounts = [], cards = [] } = insights || {};
  const total = accounts.length + cards.length;

  /* Empty state */
  if (total === 0) {
    return (
      <div className="flex flex-col h-full items-center justify-between p-6 text-center">
        <div className="flex-1 flex flex-col items-center justify-center space-y-4 max-w-[260px]">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#2563EB]">
            <Sparkles className="w-6 h-6" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-sm font-bold text-gray-900">Live Product Matches</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Matching savings accounts, current accounts, and debit cards will appear here as you chat.
            </p>
          </div>

          <div className="w-full space-y-1.5 pt-2">
            {[
              { icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />, text: 'Verified bank fee structures' },
              { icon: <ShieldCheck  className="w-3.5 h-3.5 text-blue-500 shrink-0"    />, text: 'Independent & unsponsored' },
              { icon: <Scale        className="w-3.5 h-3.5 text-purple-500 shrink-0"  />, text: 'Instant comparison readiness' },
            ].map(({ icon, text }, i) => (
              <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-100/80 text-left">
                {icon}
                <span className="text-[11px] font-medium text-gray-600">{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick explore links */}
        <div className="w-full pt-4 border-t border-gray-100 space-y-2">
          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest text-left">Quick Explore</p>
          <div className="grid grid-cols-2 gap-1.5">
            {QUICK_NAV.map(nav => (
              <Link
                key={nav.href}
                to={nav.href}
                className="flex items-center gap-2 px-2.5 py-2 rounded-xl bg-gray-50/80 border border-gray-200/80 hover:border-[#2563EB]/40 hover:bg-blue-50/60 text-gray-700 hover:text-[#2563EB] transition-all group"
                aria-label={`Go to ${nav.label}`}
              >
                <span className="text-gray-400 group-hover:text-[#2563EB] transition-colors shrink-0">{nav.icon}</span>
                <span className="text-[11px] font-semibold truncate">{nav.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* Results state */
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {/* Savings / Current Account cards */}
      {accounts.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between px-0.5">
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
              Accounts ({accounts.length})
            </p>
            <Link to="/savings-accounts" className="text-[10px] font-bold text-[#2563EB] hover:underline">
              View All
            </Link>
          </div>
          {accounts.map(acc => (
            <InsightCard
              key={acc.id}
              item={acc}
              type="account"
              navigate={navigate}
              toggleWishlist={toggleWishlist}
              isWishlisted={isWishlisted}
            />
          ))}
        </div>
      )}

      {/* Debit card results */}
      {cards.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between px-0.5">
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
              Debit Cards ({cards.length})
            </p>
            <Link to="/debit-cards" className="text-[10px] font-bold text-[#2563EB] hover:underline">
              View All
            </Link>
          </div>
          {cards.map(card => (
            <InsightCard
              key={card.id}
              item={card}
              type="card"
              navigate={navigate}
              toggleWishlist={toggleWishlist}
              isWishlisted={isWishlisted}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── AIAdvisorPage ──────────────────────────────────────────────────────────── */

function AIAdvisorPage({ onOpenContact, onSelectDebitCard, toggleCompareQueue, setSavingsCompareQueue }) {
  useSEO({
    title:        'D.CARD AI Advisor – Discover Savings Accounts, Debit Cards & More',
    description:  'Ask D.CARD AI Advisor about savings accounts, current accounts and debit cards. Compare fees, limits, interest rates and benefits using verified product information.',
    canonicalUrl: 'https://www.dcard.website/ai-advisor',
  });

  const navigate                      = useNavigate();
  const location                      = useLocation();
  const { toggleWishlist, isWishlisted } = useWishlist();

  /* Ensure the page always starts strictly at the top position on route mount */
  React.useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  /* External query injected via navigation state (e.g., from other pages) */
  const [activeExternalQuery, setActiveExternalQuery] = useState(
    location.state?.query || null
  );

  React.useEffect(() => {
    if (location.state?.query) setActiveExternalQuery(location.state.query);
  }, [location.state]);

  /* Lifted state: matched products from the AI response */
  const [insights, setInsights] = useState({ accounts: [], cards: [] });

  const handleProductsFound = useCallback((payload) => {
    setInsights({ accounts: payload.accounts || [], cards: payload.cards || [] });
  }, []);

  const totalInsights = (insights.accounts?.length || 0) + (insights.cards?.length || 0);

  return (
    <main className="min-h-screen bg-[#F8FAFC] pb-10" style={{ fontFamily: 'Inter, Poppins, sans-serif' }}>

      {/* ═══ CLEAN COMPACT HEADER ═══════════════════════════════════════════════ */}
      <header className="bg-white border-b border-gray-200/80 sticky top-[68px] sm:top-[76px] z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#2563EB] flex items-center justify-center text-white shadow-xs shrink-0">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base sm:text-lg font-black text-gray-900 leading-tight">
                    D.CARD AI Advisor
                  </h1>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Online
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs text-gray-500 leading-snug">
                  Ask questions to discover, understand, and compare verified Indian banking products
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 border border-gray-200 text-gray-600 text-[10px] font-semibold">
                <ShieldCheck className="w-3 h-3 text-[#2563EB]" />
                Verified Bank Data · No Bias
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* ═══ MAIN WORKSPACE (UNIFIED 2-COLUMN) ═════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">

          {/* ── LEFT: CHAT ASSISTANT (7 cols) ── */}
          <section aria-label="AI conversation" className="lg:col-span-8 h-[680px] min-h-[560px] flex flex-col">
            <AIChatAssistant
              onOpenContact={onOpenContact}
              embeddedPage={true}
              externalQuery={activeExternalQuery}
              onSelectDebitCard={onSelectDebitCard}
              toggleCompareQueue={toggleCompareQueue}
              setSavingsCompareQueue={setSavingsCompareQueue}
              onProductsFound={handleProductsFound}
            />
          </section>

          {/* ── RIGHT: PRODUCT INSIGHTS PANEL (4 cols) ── */}
          <aside aria-label="Product recommendations" className="lg:col-span-4 h-[680px] min-h-[560px] flex flex-col bg-white border border-gray-200 rounded-2xl shadow-xs overflow-hidden">
            {/* Panel header */}
            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between shrink-0 bg-white">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-[#2563EB]">
                  <BarChart3 className="w-3.5 h-3.5" aria-hidden />
                </div>
                <h2 className="text-xs font-black text-gray-900 uppercase tracking-wider">Product Insights</h2>
              </div>
              {totalInsights > 0 && (
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-[#2563EB] text-[10px] font-black">
                    {totalInsights} {totalInsights === 1 ? 'match' : 'matches'}
                  </span>
                  <button
                    onClick={() => setInsights({ accounts: [], cards: [] })}
                    className="text-[10px] font-semibold text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label="Clear insights"
                  >
                    Clear
                  </button>
                </div>
              )}
            </div>

            {/* Panel content */}
            <div className="flex-1 min-h-0 flex flex-col bg-white">
              <ProductInsightsPanel
                insights={insights}
                navigate={navigate}
                toggleWishlist={toggleWishlist}
                isWishlisted={isWishlisted}
              />
            </div>
          </aside>

        </div>

        {/* ═══ CLEAN SUBTLE FOOTER COMPLIANCE NOTE ═════════════════════════════ */}
        <footer className="mt-4 text-center">
          <p className="text-[11px] text-gray-400 leading-relaxed">
            D.CARD is an independent banking product discovery platform. Always verify current fees, limits and terms on the official bank portal before applying.
          </p>
        </footer>
      </div>

    </main>
  );
}

export default AIAdvisorPage;
