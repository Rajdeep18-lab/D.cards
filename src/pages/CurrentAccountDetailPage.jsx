import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Building2, 
  CheckCircle2, 
  ExternalLink, 
  CreditCard, 
  ShieldCheck, 
  FileText, 
  UserCheck, 
  Percent, 
  ChevronRight,
  Scale,
  Heart,
  AlertCircle,
  Gift,
  Briefcase,
  Layers,
  ArrowRight,
  Globe,
  Sliders
} from 'lucide-react';
import { currentAccountService } from '../services/currentAccountService';
import { getAssociatedDebitCardsForCurrentAccount, getDebitCardRelationshipStatusForCurrentAccount } from '../data/currentAccounts/index.js';
import { useWishlist } from '../context/WishlistContext';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { safeArray, safeString } from '../utils/safeUtils';
import { useSEO } from '../hooks/useSEO';

function CurrentAccountDetailPage({ onSelectDebitCard, onToggleCompare, isCompared }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isWishlisted, toggleWishlist } = useWishlist();

  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCardIndex, setActiveCardIndex] = useState(0);

  const bankName = account?.bankName || account?.bank_name || account?.bank || "Bank";
  const accountName = account?.accountName || account?.variant_name || "Current Account";
  const minimumBalance = account?.minimumBalance || account?.minimum_balance || "";

  const seoTitle = account
    ? `${bankName} ${accountName} Current Account | D.Card`
    : error
      ? "Current Account Not Found | D.Card"
      : "Current Account Details | D.Card";

  const seoDescription = account
    ? `Explore ${bankName} ${accountName} Current Account. Features: ${minimumBalance ? `minimum balance requirement ₹${minimumBalance}, ` : ''}cash deposit limits, and business banking perks on D.Card.`
    : "Explore features, limits, and minimum balance requirements for commercial and business current accounts on D.Card.";

  const seoSchema = account
    ? {
        "@context": "https://schema.org",
        "@type": "FinancialProduct",
        "name": `${bankName} ${accountName} Current Account`,
        "description": seoDescription,
        "provider": {
          "@type": "BankOrCreditUnion",
          "name": bankName
        },
        "url": `https://www.dcard.website/current-accounts/${id}`
      }
    : null;

  useSEO({
    title: seoTitle,
    description: seoDescription,
    canonicalUrl: `https://www.dcard.website/current-accounts/${id}`,
    robots: error ? "noindex, follow" : "index, follow",
    schema: seoSchema
  });

  useEffect(() => {
    setLoading(true);
    currentAccountService.getCurrentAccountById(id)
      .then(data => {
        if (data) {
          setAccount(data);
        } else {
          setError('Current Account product not found.');
        }
      })
      .catch(err => {
        console.error('Error fetching current account details:', err);
        setError('Failed to load current account details.');
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-12">
        <LoadingSkeleton />
      </div>
    );
  }

  if (error || !account) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center space-y-4">
        <AlertCircle className="w-16 h-16 text-amber-500 mx-auto" />
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Account Not Found</h2>
        <p className="text-sm text-slate-500">{error || "The requested current account could not be found."}</p>
        <Link
          to="/current-accounts"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#2563EB] text-white text-xs font-bold shadow-md hover:bg-blue-700"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Current Accounts Discovery
        </Link>
      </div>
    );
  }

  const wishlisted = isWishlisted(account.id || account.product_id);
  const associatedCards = getAssociatedDebitCardsForCurrentAccount(account);

  const getRelationshipBadge = (rel) => {
    switch (rel) {
      case 'included':
        return { label: 'Complimentary / Included', color: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30' };
      case 'default':
        return { label: 'Default Issued Card', color: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/30' };
      case 'optional':
        return { label: 'Available as an option', color: 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-500/30' };
      case 'eligibility_based':
        return { label: 'Eligibility Based Upgrade', color: 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/30' };
      default:
        return { label: 'Default Business Card', color: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/30' };
    }
  };

  return (
    <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 relative z-20 space-y-8 text-left select-none">
      {/* Top Navigation & Action Toolbar */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
        <Link
          to="/current-accounts"
          className="text-xs font-bold text-[#2563EB] dark:text-[#60A5FA] flex items-center gap-1.5 hover:underline"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Current Accounts
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={() => toggleWishlist(account)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all cursor-pointer ${
              wishlisted
                ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 text-rose-500'
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-rose-500'
            }`}
          >
            <Heart className={`w-4 h-4 ${wishlisted ? 'fill-rose-500' : ''}`} />
            <span>{wishlisted ? 'Saved' : 'Save'}</span>
          </button>

          <button
            onClick={() => onToggleCompare && onToggleCompare(account)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all cursor-pointer ${
              isCompared
                ? 'bg-[#2563EB] text-white border-[#2563EB]'
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
            }`}
          >
            <Scale className="w-4 h-4" />
            <span>{isCompared ? 'Queued' : 'Compare'}</span>
          </button>
        </div>
      </div>

      {/* 1. CURRENT ACCOUNT OVERVIEW SECTION */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 shadow-soft space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0B3D91] to-[#2563EB] text-white font-black text-2xl flex items-center justify-center shadow-lg shadow-[#2563EB]/25 shrink-0">
              {account.logo || bankName.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-[#2563EB] dark:text-[#60A5FA] block">
                🏦 {bankName} • CURRENT ACCOUNT
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-[#1F2937] dark:text-white tracking-tight mt-0.5">
                {accountName}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">
                Category: <strong className="text-slate-700 dark:text-slate-200">{account.accountType}</strong> • Suitable For: <strong className="text-slate-700 dark:text-slate-200">{account.suitableFor}</strong>
              </p>
            </div>
          </div>

          {account.officialSource && (
            <a
              href={account.officialSource}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#2563EB] to-[#3B82F6] hover:shadow-lg hover:shadow-[#2563EB]/25 text-white font-extrabold text-xs transition-all shadow cursor-pointer active:scale-95 flex items-center gap-2"
            >
              <span>Visit Official Bank Portal</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>

        {/* Badges Row */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-[#2563EB]/10 text-[#2563EB] dark:text-[#60A5FA] border border-[#2563EB]/20">
            MAB: {account.minimumBalance}
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Free Cheques: {account.freeChequeLeaves || "Included"}
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            NEFT/RTGS: {account.neft || "Free Digital"}
          </span>
        </div>
      </div>

      {/* 2. BALANCE REQUIREMENTS & CHARGES */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 shadow-soft space-y-5">
        <h2 className="text-lg font-black text-[#1F2937] dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <Layers className="w-5 h-5 text-[#2563EB]" />
          <span>Balance Requirements & Account Maintenance</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/80 dark:border-blue-900/50">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-blue-700 dark:text-blue-400 block">
              Average Monthly Balance
            </span>
            <span className="text-2xl font-black text-[#1F2937] dark:text-white mt-1 block">
              {account.averageBalanceRequirement || account.minimumBalance}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block">
              Non-Maintenance Charge
            </span>
            <span className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1 block leading-snug">
              {account.nonMaintenanceCharge}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block">
              Interest Rate
            </span>
            <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-1 block leading-snug">
              {account.interestRate}
            </span>
          </div>
        </div>
      </div>

      {/* 3. BUSINESS CONSTITUTION & ELIGIBILITY */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 shadow-soft space-y-4">
          <h3 className="text-base font-black text-slate-800 dark:text-white flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-[#2563EB]" />
            <span>Eligible Business Constitutions</span>
          </h3>
          <div className="space-y-2">
            {safeArray(account.businessConstitution).map((item, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 shadow-soft space-y-4">
          <h3 className="text-base font-black text-slate-800 dark:text-white flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-[#2563EB]" />
            <span>Documentation & Eligibility Criteria</span>
          </h3>
          <div className="space-y-2">
            {safeArray(account.eligibility).map((b, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" />
                <span>{b}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. CASH DEPOSIT LIMITS & BANKING SERVICES */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 shadow-soft space-y-5">
        <h2 className="text-lg font-black text-[#1F2937] dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <Building2 className="w-5 h-5 text-[#2563EB]" />
          <span>Banking Services & Cash Handling Rules</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Cash Deposit Limit</span>
            <span className="font-extrabold text-slate-800 dark:text-slate-100 text-sm mt-1 block">
              {account.cashDepositLimit}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Cheque Leaves / Month</span>
            <span className="font-extrabold text-slate-800 dark:text-slate-100 text-sm mt-1 block">
              {account.freeChequeLeaves || account.chequeBook}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">NEFT / RTGS</span>
            <span className="font-extrabold text-emerald-600 dark:text-emerald-400 text-sm mt-1 block">
              {account.neft || "Free Digital"}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Cash Handling Slabs</span>
            <span className="font-bold text-slate-700 dark:text-slate-200 text-xs mt-1 block">
              {account.cashHandlingCharges}
            </span>
          </div>
        </div>
      </div>

      {/* 5. DEDICATED SECTION: DEBIT CARD(S) AVAILABLE WITH THIS CURRENT ACCOUNT */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#EFF6FF] via-[#DBEAFE]/30 to-white dark:from-slate-900 dark:via-slate-900/90 dark:to-slate-800 border-2 border-[#2563EB]/40 shadow-md space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#2563EB]/20 pb-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 bg-[#2563EB] text-white text-[10px] font-black uppercase tracking-widest rounded-full mb-1">
              SAME-BANK VERIFIED DEBIT LINK
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-[#0B3D91] dark:text-[#60A5FA] flex items-center gap-2">
              <CreditCard className="w-6 h-6 text-[#2563EB]" />
              <span>Business Debit Card(s) Available With This Account</span>
            </h2>
          </div>

          <p className="text-xs text-[#2563EB] dark:text-[#60A5FA] font-bold">
            {associatedCards.length > 0
              ? `${associatedCards.length} verified debit card option(s)`
              : "Debit card relationship status"}
          </p>
        </div>

        {associatedCards.length === 0 ? (
          <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-3">
            <AlertCircle className="w-12 h-12 text-slate-400 mx-auto" />
            <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200">
              Debit card association not specified in provided data.
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              No debit card can be displayed as associated with this account unless explicitly established by official source documentation.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {associatedCards.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-2">
                {associatedCards.map((c, idx) => (
                  <button
                    key={c.card_id || c.id || idx}
                    onClick={() => setActiveCardIndex(idx)}
                    className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all border cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                      activeCardIndex === idx
                        ? 'bg-[#2563EB] text-white border-[#2563EB] shadow-md'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>{c.name || c.card_name || c.cardName}</span>
                  </button>
                ))}
              </div>
            )}

            {(() => {
              const card = associatedCards[activeCardIndex] || associatedCards[0];
              if (!card) return null;

              const relBadge = getRelationshipBadge(card.relationship);
              const cardName = card.name || card.card_name || card.cardName;

              return (
                <div className="space-y-6">
                  <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-[#2563EB]/30 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-14 rounded-xl bg-gradient-to-br from-[#0B3D91] to-[#2563EB] text-white flex flex-col items-center justify-center font-bold text-xs shadow-md shrink-0">
                        <CreditCard className="w-6 h-6 mb-1" />
                        <span>{card.network || 'RuPay'}</span>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border ${relBadge.color}`}>
                            {relBadge.label}
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-bold text-[10px]">
                            ✓ Verified Card Linkage
                          </span>
                        </div>
                        <h3 className="text-xl font-black text-slate-800 dark:text-white tracking-tight">
                          💳 {cardName}
                        </h3>
                      </div>
                    </div>

                    {onSelectDebitCard && (
                      <button
                        onClick={() => onSelectDebitCard(card)}
                        className="px-5 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-extrabold transition-all flex items-center gap-1.5 shadow-md cursor-pointer active:scale-95"
                      >
                        <span>View Full Card Profile →</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Annual Card Fee</span>
                      <span className="font-extrabold text-slate-800 dark:text-slate-100 text-sm mt-1 block">
                        {card.annualFee === 0 ? 'Free' : `₹${card.annualFee}`}
                      </span>
                    </div>

                    <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Daily ATM Limit</span>
                      <span className="font-extrabold text-slate-800 dark:text-slate-100 text-sm mt-1 block">
                        {card.atmLimit || '₹1,00,000/day'}
                      </span>
                    </div>

                    <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Daily POS / E-Commerce</span>
                      <span className="font-extrabold text-slate-800 dark:text-slate-100 text-sm mt-1 block">
                        {card.posLimit || '₹3,00,000/day'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </div>

      {/* 6. VERIFICATION & AUDIT METADATA */}
      <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs flex flex-wrap items-center justify-between gap-3 text-slate-500">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Source: <strong className="text-slate-800 dark:text-slate-200">{account.sourceType || "Official Bank Source"}</strong></span>
        </div>
        <div>
          <span>Last Verified: <strong className="text-slate-800 dark:text-slate-200">{account.lastVerified || "Recent"}</strong></span>
        </div>
      </div>
    </main>
  );
}

export default CurrentAccountDetailPage;
