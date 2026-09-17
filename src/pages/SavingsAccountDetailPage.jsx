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
  Sliders,
  Sparkles,
  Info,
  Check,
  Shield,
  Award,
  Globe
} from 'lucide-react';
import { savingsAccountService } from '../services/savingsAccountService';
import { getAssociatedDebitCards, getDebitCardRelationshipStatus } from '../data/mockSavingsAccounts';
import { useWishlist } from '../context/WishlistContext';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { useSEO } from '../hooks/useSEO';

import ICICIBSavingsDetailView from '../components/ICICIBSavingsDetailView';
import BankLogo from '../components/BankLogo';

function SavingsAccountDetailPage({ onSelectDebitCard, onToggleCompare, isCompared }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isWishlisted, toggleWishlist } = useWishlist();

  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCardIndex, setActiveCardIndex] = useState(0);

  const seoBankName = account?.bank_name || account?.bank || "Bank";
  const seoAccountName = account?.variant_name || account?.account_name || account?.accountName || "Savings Account";

  const seoTitle = account
    ? `${seoBankName} ${seoAccountName} Savings Account | D.Card`
    : error
      ? "Savings Account Not Found | D.Card"
      : "Savings Account Details | D.Card";

  const seoDescription = account
    ? `Explore ${bankName} ${accountName} Savings Account. Features: ${interestRate ? `${interestRate} interest, ` : ''}${minimumBalance ? `₹${minimumBalance} min balance, ` : ''}benefits, and eligibility on D.Card.`
    : "Explore features, interest rates, and minimum balance requirements for savings accounts on D.Card.";

  const seoSchema = account
    ? {
        "@context": "https://schema.org",
        "@type": "FinancialProduct",
        "name": `${bankName} ${accountName} Savings Account`,
        "description": seoDescription,
        "provider": {
          "@type": "BankOrCreditUnion",
          "name": bankName
        },
        "url": `https://www.dcard.website/savings-accounts/${id}`
      }
    : null;

  useSEO({
    title: seoTitle,
    description: seoDescription,
    canonicalUrl: `https://www.dcard.website/savings-accounts/${id}`,
    robots: error ? "noindex, follow" : "index, follow",
    schema: seoSchema
  });

  useEffect(() => {
    setLoading(true);
    savingsAccountService.getSavingsAccountById(id)
      .then(data => {
        if (data) {
          setAccount(data);
        } else {
          setError('Savings Account not found.');
        }
      })
      .catch(err => {
        console.error('Error fetching savings account details:', err);
        setError('Failed to load savings account details.');
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
        <p className="text-sm text-slate-500">{error || "The requested savings account could not be found."}</p>
        <Link
          to="/savings-accounts"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#2563EB] text-white text-xs font-bold shadow-md hover:bg-blue-700"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Savings Discovery
        </Link>
      </div>
    );
  }

  const bankName = account.bank_name || account.bank || "Partner Bank";

  // ICICI Bank Dedicated Detail View
  if (account.bank_id === 'icici' || bankName.toLowerCase().includes('icici')) {
    return <ICICIBSavingsDetailView onSelectDebitCard={onSelectDebitCard} />;
  }

  const wishlisted = isWishlisted(account.id || account.product_id);
  const associatedCards = getAssociatedDebitCards(account);
  const accountName = account.variant_name || account.accountName || "Savings Account";
  const interestRate = account.interest_rate || account.interestRate || "Information not available";
  const minimumBalance = account.minimum_balance || account.minimumBalance || "Information not available";
  const penalty = account.non_maintenance_penalty || account.nonMaintenanceCharges || "Information not available";

  const getRelationshipBadge = (rel) => {
    switch (rel) {
      case 'provided':
        return { label: 'Provided with account', color: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30' };
      case 'optional':
        return { label: 'Available as an option', color: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/30' };
      case 'upgrade':
        return { label: 'Upgrade option', color: 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/30' };
      default:
        return { label: 'Provided with account', color: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30' };
    }
  };

  return (
    <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 relative z-20 space-y-8 text-left select-none">
      {/* Top Navigation & Action Toolbar */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
        <Link
          to="/savings-accounts"
          className="text-xs font-bold text-[#2563EB] dark:text-[#60A5FA] flex items-center gap-1.5 hover:underline"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Savings Accounts
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

      {/* 1. SAVINGS ACCOUNT DETAILS SECTION */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 shadow-soft space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <BankLogo bankName={bankName} size="xl" />
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-[#2563EB] dark:text-[#60A5FA] block">
                🏦 {bankName}
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-[#1F2937] dark:text-white tracking-tight mt-0.5">
                Savings Account Details
              </h1>
              <h2 className="text-base sm:text-lg font-bold text-slate-700 dark:text-slate-300">
                {accountName}
              </h2>
            </div>
          </div>

          {(account.officialSourceUrl || account.source || account.applyUrl || account.officialUrl || account.websiteUrl || account.bankUrl) && (
            <a
              href={account.officialSourceUrl || account.source || account.applyUrl || account.officialUrl || account.websiteUrl || account.bankUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#2563EB] to-[#3B82F6] hover:shadow-lg hover:shadow-[#2563EB]/25 text-white font-extrabold text-xs transition-all shadow cursor-pointer active:scale-95 flex items-center gap-2"
            >
              <span>Apply / Open Account</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>

        {/* Badges Row */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-[#2563EB]/10 text-[#2563EB] dark:text-[#60A5FA] border border-[#2563EB]/20">
            Category: {account.account_type || account.accountType || "Savings"}
          </span>
          {account.isZeroBalance && (
            <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Zero Minimum Balance
            </span>
          )}
          {account.information_status === "Not verified" && (
            <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center gap-1">
              <Info className="w-3.5 h-3.5" /> Status: Not verified
            </span>
          )}
          {account.accountTypeBadges && account.accountTypeBadges.map((b, i) => (
            <span key={i} className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              {b}
            </span>
          ))}
        </div>

        <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
          {account.description || "Detailed savings account overview and financial product parameters."}
        </p>
      </div>

      {/* 2. INTEREST RATE & MINIMUM BALANCE & CHARGES */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 shadow-soft space-y-5">
        <h2 className="text-lg font-black text-[#1F2937] dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <Percent className="w-5 h-5 text-[#2563EB]" />
          <span>Interest Rates, Balance Rules & Charges</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-900/50">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 block">
              Interest Rate
            </span>
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1 block">
              {interestRate}
            </span>
            {account.interest_credit_frequency && (
              <span className="text-[10px] font-bold text-emerald-600/80 block mt-1">
                Credit: {account.interest_credit_frequency}
              </span>
            )}
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block">
              Minimum Balance
            </span>
            <span className="text-2xl font-black text-[#1F2937] dark:text-white mt-1 block">
              {minimumBalance}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block">
              Non-Maintenance Charges
            </span>
            <span className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1 block leading-snug">
              {penalty}
            </span>
          </div>
        </div>

        {account.interestSlabs && account.interestSlabs.length > 0 && (
          <div className="space-y-2 pt-2">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Interest Rate Tier Slabs:</h4>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 space-y-2 text-xs sm:text-sm">
              {account.interestSlabs.map((slab, i) => (
                <div key={i} className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-medium">
                  <span className="w-2 h-2 rounded-full bg-[#2563EB]" />
                  <span>{slab}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 3. ELIGIBILITY, BENEFITS & FEATURES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Eligibility & Target Segment */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 shadow-soft space-y-4">
          <h3 className="text-base font-black text-slate-800 dark:text-white flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-[#2563EB]" />
            <span>Eligibility & Criteria</span>
          </h3>
          {account.eligibility && (Array.isArray(account.eligibility) ? account.eligibility : [account.eligibility]).length > 0 ? (
            <div className="space-y-2">
              {(Array.isArray(account.eligibility) ? account.eligibility : [account.eligibility]).map((item, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 font-medium">Information not available</p>
          )}
        </div>

        {/* Benefits & Features */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 shadow-soft space-y-4">
          <h3 className="text-base font-black text-slate-800 dark:text-white flex items-center gap-2">
            <Gift className="w-5 h-5 text-[#2563EB]" />
            <span>Account Benefits & Highlights</span>
          </h3>
          {(account.benefits || account.keyBenefits) && (account.benefits || account.keyBenefits).length > 0 ? (
            <div className="space-y-2">
              {(account.benefits || account.keyBenefits).map((b, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" />
                  <span>{b}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 font-medium">Information not available</p>
          )}
        </div>
      </div>

      {/* 4. DEDICATED SECTION: DEBIT CARD(S) AVAILABLE WITH THIS ACCOUNT */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#EFF6FF] via-[#DBEAFE]/30 to-white dark:from-slate-900 dark:via-slate-900/90 dark:to-slate-800 border-2 border-[#2563EB]/40 shadow-md space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#2563EB]/20 pb-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 bg-[#2563EB] text-white text-[10px] font-black uppercase tracking-widest rounded-full mb-1">
              SAME-BANK VERIFIED DEBIT LINK
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-[#0B3D91] dark:text-[#60A5FA] flex items-center gap-2">
              <CreditCard className="w-6 h-6 text-[#2563EB]" />
              <span>Debit Card(s) Available With This Account</span>
            </h2>
          </div>

          <p className="text-xs text-[#2563EB] dark:text-[#60A5FA] font-bold">
            {associatedCards.length > 0
              ? `${associatedCards.length} verified debit card option(s)`
              : "Debit card relationship status"}
          </p>
        </div>

        {associatedCards.length === 0 ? (
          /* NO VERIFIED CARD FALLBACK */
          <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-3">
            <AlertCircle className="w-12 h-12 text-slate-400 mx-auto" />
            <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200">
              {getDebitCardRelationshipStatus(account).status === 'pending'
                ? 'Debit card relationship pending verification.'
                : 'Debit card information not available for this account.'}
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              {getDebitCardRelationshipStatus(account).status === 'pending'
                ? 'The debit card relationship for this account is being audited and is pending verification.'
                : 'No verified debit card details are explicitly mapped to this specific account in the master bank directory.'}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Multiple Cards Switcher Tabs if > 1 card */}
            {associatedCards.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-2">
                {associatedCards.map((c, idx) => {
                  return (
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
                  );
                })}
              </div>
            )}

            {/* Display Active Card Details */}
            {(() => {
              const card = associatedCards[activeCardIndex] || associatedCards[0];
              if (!card) return null;

              const relBadge = getRelationshipBadge(card.relationship);
              const cardName = card.name || card.card_name || card.cardName || "Information not available";
              const network = card.network || "Information not available";
              const annualFee = card.annual_fee || card.annualFee || "Information not available";
              const atmLimit = card.atm_limit || card.cashWithdrawalLimit || "Information not available";
              const posLimit = card.pos_limit || card.purchaseLimit || "Information not available";
              const loungeAccess = card.lounge_access || card.loungeAccess || "Information not available";
              const insurance = card.insurance || "Information not available";
              const rewards = card.rewards || card.rewardPoints || "Information not available";
              const keyBenefits = card.key_benefits || card.bestFor || card.benefits || [];
              const eligibilityText = card.eligibility 
                ? (Array.isArray(card.eligibility) ? card.eligibility.join(', ') : card.eligibility)
                : (card.salary_account ? "Salary Account Required" : "Provided with Savings Account");
              const verificationInfo = card.verification_info || card.officialWebsite || "Information not available";

              return (
                <div className="space-y-6">
                  {/* Card Main Banner Header */}
                  <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-[#2563EB]/30 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-14 rounded-xl bg-gradient-to-br from-[#0B3D91] to-[#2563EB] text-white flex flex-col items-center justify-center font-bold text-xs shadow-md shrink-0">
                        <CreditCard className="w-6 h-6 mb-1" />
                        <span>{network}</span>
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

                  {/* 11 REQUIRED FIELD METRICS GRID */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                    {/* 1. Card Name & Variant */}
                    <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Card Name & Variant</span>
                      <span className="font-extrabold text-slate-800 dark:text-slate-100 text-sm mt-1 block">
                        {cardName} ({card.cardVariant || "Standard"})
                      </span>
                    </div>

                    {/* 2. Network */}
                    <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Card Network</span>
                      <span className="font-extrabold text-slate-800 dark:text-slate-100 text-sm mt-1 block">
                        {network}
                      </span>
                    </div>

                    {/* 3. Annual/Maintenance Fee */}
                    <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Annual / Maintenance Fee</span>
                      <span className="font-extrabold text-slate-800 dark:text-slate-100 text-sm mt-1 block">
                        {annualFee}
                      </span>
                    </div>

                    {/* 4. ATM Limit */}
                    <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">ATM Withdrawal Limit</span>
                      <span className="font-extrabold text-slate-800 dark:text-slate-100 text-sm mt-1 block">
                        {atmLimit}
                      </span>
                    </div>

                    {/* 5. POS Limit */}
                    <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">POS / Shopping Limit</span>
                      <span className="font-extrabold text-slate-800 dark:text-slate-100 text-sm mt-1 block">
                        {posLimit}
                      </span>
                    </div>

                    {/* 6. Lounge Access */}
                    <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Airport Lounge Access</span>
                      <span className="font-extrabold text-slate-800 dark:text-slate-100 text-sm mt-1 block">
                        {loungeAccess}
                      </span>
                    </div>

                    {/* 7. Insurance */}
                    <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block flex items-center gap-1">
                        <Shield className="w-3 h-3 text-emerald-500" /> Insurance Protection
                      </span>
                      <span className="font-extrabold text-slate-800 dark:text-slate-100 text-sm mt-1 block">
                        {insurance}
                      </span>
                    </div>

                    {/* 8. Rewards */}
                    <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block flex items-center gap-1">
                        <Award className="w-3 h-3 text-amber-500" /> Rewards & Points
                      </span>
                      <span className="font-extrabold text-slate-800 dark:text-slate-100 text-sm mt-1 block">
                        {rewards}
                      </span>
                    </div>

                    {/* 9. Eligibility / Account Relationship */}
                    <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Eligibility & Relationship</span>
                      <span className="font-extrabold text-[#2563EB] dark:text-[#60A5FA] text-sm mt-1 block">
                        {eligibilityText}
                      </span>
                    </div>
                  </div>

                  {/* 10. Key Benefits */}
                  <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#2563EB] dark:text-[#60A5FA] flex items-center gap-1.5">
                      <Gift className="w-4 h-4 text-[#2563EB]" />
                      <span>Card Key Benefits & Best For</span>
                    </h4>
                    {keyBenefits && (Array.isArray(keyBenefits) ? keyBenefits : [keyBenefits]).length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        {(Array.isArray(keyBenefits) ? keyBenefits : [keyBenefits]).map((benefit, idx) => (
                          <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 flex items-start gap-2 font-medium text-slate-700 dark:text-slate-300">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                            <span>{benefit}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-500 font-medium">Information not available</p>
                    )}
                  </div>

                  {/* 11. Verification / Source Information */}
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                      <Globe className="w-4 h-4 text-[#2563EB]" />
                      <span className="font-medium">Verification Status & Source:</span>
                      <span className="font-bold text-slate-700 dark:text-slate-200">{verificationInfo}</span>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </div>
    </main>
  );
}

export default SavingsAccountDetailPage;
