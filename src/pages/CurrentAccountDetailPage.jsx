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
import BankLogo from '../components/BankLogo';
import { safeArray, safeString } from '../utils/safeUtils';
import { useSEO } from '../hooks/useSEO';
import { 
  formatInterestRate, 
  formatMinimumBalance, 
  formatCashDepositLimit, 
  formatNonMaintenanceCharge, 
  formatBenefits, 
  formatSourceAndVerification 
} from '../utils/bankingDataFormatter';

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

  // Clean data through presentation layer
  const formattedBalance = formatMinimumBalance(account.minimumBalance || account.minimum_balance || account.averageBalanceRequirement, account);
  const formattedCashLimit = formatCashDepositLimit(account.cashDepositLimit || account.freeCashDepositPerMonth, account);
  const formattedFee = formatNonMaintenanceCharge(account.nonMaintenanceCharge || account.nonMaintenanceCharges || account.non_maintenance_penalty, account);
  const formattedRate = formatInterestRate(account.interestRate || account.interest_rate, account);
  const cleanBenefits = formatBenefits(account.keyBenefits || account.benefits, 6);
  const sourceInfo = formatSourceAndVerification(account);

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

      {/* 1. PRODUCT OVERVIEW & SUITABILITY SECTION */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 shadow-soft space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <BankLogo bankName={bankName} size="xl" />
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-[#2563EB] dark:text-[#60A5FA] block">
                🏦 {bankName} • CURRENT ACCOUNT
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-[#1F2937] dark:text-white tracking-tight mt-0.5">
                {accountName}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">
                Category: <strong className="text-slate-700 dark:text-slate-200">{account.accountType || "Current Account"}</strong>
                {account.suitableFor && (
                  <span> • Suitable For: <strong className="text-slate-700 dark:text-slate-200">{account.suitableFor}</strong></span>
                )}
              </p>
            </div>
          </div>

          {sourceInfo.sourceUrl && (
            <a
              href={sourceInfo.sourceUrl}
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
            AQB: {formattedBalance.display}
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Free Cheques: {account.freeChequeLeaves || "Included"}
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            NEFT/RTGS: {account.neft || "Free Digital"}
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> Verified: {sourceInfo.verifiedDateFormatted}
          </span>
        </div>

        <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
          {account.description || `${accountName} from ${bankName} tailored for businesses, enterprises, and commercial entities.`}
        </p>
      </div>

      {/* 2. ELIGIBILITY & BUSINESS CONSTITUTIONS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 shadow-soft space-y-4">
          <h3 className="text-base font-black text-slate-800 dark:text-white flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-[#2563EB]" />
            <span>Eligible Business Constitutions</span>
          </h3>
          <div className="space-y-2">
            {safeArray(account.businessConstitution).length > 0 ? (
              safeArray(account.businessConstitution).map((item, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500">Sole Proprietorship, Partnership, Private Limited, Public Limited, LLP, Trusts & Societies.</p>
            )}
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 shadow-soft space-y-4">
          <h3 className="text-base font-black text-slate-800 dark:text-white flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-[#2563EB]" />
            <span>Documentation & Eligibility Criteria</span>
          </h3>
          <div className="space-y-2">
            {safeArray(account.eligibility).length > 0 ? (
              safeArray(account.eligibility).map((b, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" />
                  <span>{b}</span>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500">Standard business registration documents, PAN, GST certificate, entity proofs and KYC of authorized signatories.</p>
            )}
          </div>
        </div>
      </div>

      {/* 3. BALANCE REQUIREMENTS SECTION */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 shadow-soft space-y-5">
        <h2 className="text-lg font-black text-[#1F2937] dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <Layers className="w-5 h-5 text-[#2563EB]" />
          <span>Balance Requirements & Maintenance Rules</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/80 dark:border-blue-900/50 space-y-1">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-blue-700 dark:text-blue-400 block">
              Average Balance Requirement
            </span>
            <span className="text-2xl font-black text-[#1F2937] dark:text-white mt-1 block">
              {formattedBalance.display}
            </span>
            {formattedBalance.subtext && (
              <p className="text-xs text-slate-600 dark:text-slate-300 font-medium pt-1">
                {formattedBalance.subtext}
              </p>
            )}
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block">
              Non-Maintenance Fee
            </span>
            <span className="text-2xl font-black text-slate-800 dark:text-white mt-1 block">
              {formattedFee.display}
            </span>
            {formattedFee.subtext && (
              <p className="text-xs text-slate-500 font-medium pt-1">
                {formattedFee.subtext}
              </p>
            )}
          </div>
        </div>

        {/* Location-Specific Balance Breakdown if applicable */}
        {formattedBalance.breakdown && (
          <div className="pt-2 space-y-2">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Branch Location Breakdown:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              {formattedBalance.breakdown.map((item, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">{item.label}</span>
                  <span className="text-base font-black text-slate-800 dark:text-white mt-0.5 block">{item.amount}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 4. INTEREST RULES & RBI REGULATION */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 shadow-soft space-y-4">
        <h2 className="text-lg font-black text-[#1F2937] dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <Percent className="w-5 h-5 text-[#2563EB]" />
          <span>Interest Rate & Regulatory Policy</span>
        </h2>

        <div className="p-4 rounded-2xl bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40 space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">{formattedRate.display}</span>
            <span className="text-xs text-emerald-700 dark:text-emerald-300 font-bold">Standard Commercial Rule</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Per Reserve Bank of India (RBI) regulations, commercial banks are prohibited from paying interest on Current Account balances. Any interest benefits can only be achieved via linked sweep-in fixed deposit facilities.
          </p>
        </div>
      </div>

      {/* 5. CASH DEPOSIT LIMITS & BANKING SERVICES */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 shadow-soft space-y-5">
        <h2 className="text-lg font-black text-[#1F2937] dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <Building2 className="w-5 h-5 text-[#2563EB]" />
          <span>Banking Services & Cash Handling Rules</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Cash Deposit Limit</span>
            <span className="font-extrabold text-slate-800 dark:text-slate-100 text-sm mt-1 block">
              {formattedCashLimit.display}
            </span>
            {formattedCashLimit.subtext && (
              <span className="text-[10px] text-slate-500 block mt-0.5 line-clamp-1">{formattedCashLimit.subtext}</span>
            )}
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Cheque Leaves / Month</span>
            <span className="font-extrabold text-slate-800 dark:text-slate-100 text-sm mt-1 block">
              {account.freeChequeLeaves || account.chequeBook || "Standard free allocation"}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">NEFT / RTGS</span>
            <span className="font-extrabold text-emerald-600 dark:text-emerald-400 text-sm mt-1 block">
              {account.neft || "Free Digital"}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">POS / Merchant Terminal</span>
            <span className="font-extrabold text-slate-800 dark:text-slate-100 text-sm mt-1 block">
              {account.posTerminal || "Available on request"}
            </span>
          </div>
        </div>
      </div>

      {/* 6. BUSINESS ADVANTAGES & KEY FEATURES */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 shadow-soft space-y-4">
        <h3 className="text-base font-black text-slate-800 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <Gift className="w-5 h-5 text-[#2563EB]" />
          <span>Business Advantages & Key Features</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {cleanBenefits.map((benefit, idx) => (
            <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" />
              <span>{benefit}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 7. TRANSACTION & CASH HANDLING DETAILS */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 shadow-soft space-y-4">
        <h3 className="text-base font-black text-slate-800 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <Layers className="w-5 h-5 text-[#2563EB]" />
          <span>Cash Handling Slabs & Operational Rules</span>
        </h3>
        <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
          {account.cashHandlingCharges || formattedCashLimit.fullText || "Cash handling charges apply beyond the monthly free limits according to bank commercial schedule."}
        </p>
      </div>

      {/* 8. DEDICATED SECTION: DEBIT CARD(S) AVAILABLE WITH THIS CURRENT ACCOUNT */}
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
              Linked Debit Card: Not specified on official source
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              The official source does not specify a linked debit card variant for this account. No generic debit card has been arbitrarily attached.
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

      {/* 9. FEES & CHARGES DETAILED BREAKDOWN */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 shadow-soft space-y-5">
        <h2 className="text-lg font-black text-[#1F2937] dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <FileText className="w-5 h-5 text-[#2563EB]" />
          <span>Fees, Penalties & Commercial Tariff Rules</span>
        </h2>

        <div className="space-y-4 text-xs sm:text-sm">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 space-y-1.5">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block">
              Non-Maintenance Penalty Details
            </span>
            <p className="font-semibold text-slate-800 dark:text-slate-200 leading-relaxed">
              {formattedFee.fullText}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Cheque Book Charges</span>
              <span className="font-bold text-slate-700 dark:text-slate-300 mt-1 block">
                {account.freeChequeLeaves || "Standard printed cheque leaves free per month."}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Doorstep Banking & Other Charges</span>
              <span className="font-bold text-slate-700 dark:text-slate-300 mt-1 block">
                {account.doorstepBanking || "Available on request as per branch schedule."}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 10. OFFICIAL SOURCE & VERIFICATION AUDIT */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-soft space-y-5">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
            <h2 className="text-lg font-black text-slate-800 dark:text-white">
              Official Source & Verification Audit
            </h2>
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-extrabold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            ✓ Verified Business Product
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Official Bank Source</span>
            <span className="font-bold text-slate-800 dark:text-white text-sm mt-1 block truncate">
              {sourceInfo.sourceName}
            </span>
            {sourceInfo.sourceUrl && (
              <a
                href={sourceInfo.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#2563EB] dark:text-[#60A5FA] font-extrabold hover:underline inline-flex items-center gap-1 mt-1 text-xs"
              >
                <span>Visit Official Portal</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Last Verified Date</span>
            <span className="font-bold text-slate-800 dark:text-white text-sm mt-1 block">
              {sourceInfo.verifiedDateFormatted}
            </span>
            {sourceInfo.effectiveDateFormatted && (
              <span className="text-[10px] text-slate-500 block mt-0.5">
                Effective: {sourceInfo.effectiveDateFormatted}
              </span>
            )}
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Audit & Reference Status</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm mt-1 block">
              {sourceInfo.statusNote}
            </span>
            <span className="text-[10px] text-slate-500 block mt-0.5 truncate">
              {sourceInfo.sourceFile}
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}

export default CurrentAccountDetailPage;
