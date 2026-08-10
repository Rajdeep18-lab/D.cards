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
  Zap, 
  Lock, 
  Smartphone, 
  ChevronRight,
  Info,
  Scale,
  Heart,
  AlertCircle,
  HelpCircle,
  Clock,
  DollarSign
} from 'lucide-react';
import { savingsAccountService } from '../services/savingsAccountService';
import { getAssociatedDebitCard } from '../data/mockSavingsAccounts';
import { useWishlist } from '../context/WishlistContext';
import LoadingSkeleton from '../components/LoadingSkeleton';

function SavingsAccountDetailPage({ onSelectDebitCard, onToggleCompare, isCompared }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isWishlisted, toggleWishlist } = useWishlist();

  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const wishlisted = isWishlisted(account.id);
  const associatedCard = getAssociatedDebitCard(account.associatedDebitCardId);

  return (
    <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 relative z-20 space-y-8 text-left select-none">
      {/* Top Breadcrumb & Actions */}
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

      {/* Main Account Hero Box */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 shadow-soft space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0B3D91] to-[#2563EB] text-white font-black text-2xl flex items-center justify-center shadow-lg shadow-[#2563EB]/25 shrink-0">
              {account.logo || account.bank.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB] dark:text-[#60A5FA] block">
                {account.bank}
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-[#1F2937] dark:text-white tracking-tight">
                {account.accountName}
              </h1>
            </div>
          </div>

          {account.officialSourceUrl && (
            <a
              href={account.officialSourceUrl}
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
            Category: {account.accountType}
          </span>
          {account.isZeroBalance && (
            <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Zero Minimum Balance
            </span>
          )}
          {account.isOnlineOpening && (
            <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
              ⚡ Video KYC Available
            </span>
          )}
          {account.accountTypeBadges && account.accountTypeBadges.map((b, i) => (
            <span key={i} className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              {b}
            </span>
          ))}
        </div>

        <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
          {account.description}
        </p>

        {/* Key Benefits List */}
        {account.keyBenefits && (
          <div className="space-y-2.5 pt-4 border-t border-slate-100 dark:border-slate-800">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
              Key Highlights & Account Benefits:
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs sm:text-sm font-medium">
              {account.keyBenefits.map((benefit, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" />
                  <span className="text-slate-800 dark:text-slate-200 leading-snug">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* SECTION 2: INTEREST & BALANCE */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 shadow-soft space-y-5">
        <h2 className="text-lg font-black text-[#1F2937] dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <Percent className="w-5 h-5 text-[#2563EB]" />
          <span>Interest Rates & Balance Rules</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-900/50">
            <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 block">
              Max Interest Rate
            </span>
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1 block">
              {account.interestRate}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 block">
              Minimum Balance Requirement
            </span>
            <span className="text-2xl font-black text-[#1F2937] dark:text-white mt-1 block">
              {account.minimumBalance}
            </span>
          </div>
        </div>

        {account.interestSlabs && (
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm pt-2">
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
            <span className="font-extrabold text-slate-400 uppercase text-[10px] block">AMB / AQB Criterion</span>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{account.ambAqbText || "Standard Monthly Maintenance Rules"}</p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
            <span className="font-extrabold text-slate-400 uppercase text-[10px] block">Non-Maintenance Penalty</span>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{account.nonMaintenanceCharges || "Applicable if AMB threshold is not maintained"}</p>
          </div>
        </div>
      </div>

      {/* SECTION 6: CORE FEATURE - SAVINGS ACCOUNT → ASSOCIATED DEBIT CARD */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#EFF6FF] via-[#DBEAFE]/40 to-white dark:from-slate-900 dark:via-slate-900/90 dark:to-slate-800 border-2 border-[#2563EB]/40 shadow-md space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#2563EB]/20 pb-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 bg-[#2563EB] text-white text-[10px] font-black uppercase tracking-widest rounded-full mb-1">
              CORE LINKAGE PRIVILEGE
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-[#0B3D91] dark:text-[#60A5FA] flex items-center gap-2">
              <CreditCard className="w-6 h-6 text-[#2563EB]" />
              <span>Debit Card Provided with this Account</span>
            </h2>
          </div>

          <p className="text-xs text-[#2563EB] dark:text-[#60A5FA] font-bold">
            What card do you get & what features does it offer?
          </p>
        </div>

        {associatedCard ? (
          <div className="space-y-6">
            {/* Associated Card Summary Banner */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-[#2563EB]/30 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-xs font-bold text-[#2563EB] dark:text-[#60A5FA] uppercase tracking-wider block">
                  {associatedCard.bank} • {associatedCard.network} Network
                </span>
                <h3 className="text-lg sm:text-xl font-black text-slate-800 dark:text-white">
                  {associatedCard.cardName}
                </h3>
                <p className="text-xs text-slate-500">
                  Category: {associatedCard.category || 'Standard'} • Best For: {associatedCard.bestFor || 'Everyday Purchases'}
                </p>
              </div>

              {onSelectDebitCard && (
                <button
                  onClick={() => onSelectDebitCard(associatedCard)}
                  className="px-5 py-2.5 rounded-xl bg-[#2563EB] text-white text-xs font-extrabold hover:bg-blue-700 transition-all flex items-center gap-1.5 shadow-md shrink-0 cursor-pointer"
                >
                  <span>Explore Full Card Specs</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Card Features & Benefits Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-[10.5px] font-bold text-slate-400 block uppercase">Annual Fee</span>
                <span className="font-extrabold text-slate-800 dark:text-slate-200 text-sm mt-0.5 block">{associatedCard.annualFee || '₹0'}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-[10.5px] font-bold text-slate-400 block uppercase">ATM Withdrawal Limit</span>
                <span className="font-extrabold text-slate-800 dark:text-slate-200 text-sm mt-0.5 block">₹{(associatedCard.atmLimit || 50000).toLocaleString('en-IN')}/day</span>
              </div>
              <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-[10.5px] font-bold text-slate-400 block uppercase">POS Limit</span>
                <span className="font-extrabold text-slate-800 dark:text-slate-200 text-sm mt-0.5 block">₹{(associatedCard.posLimit || 100000).toLocaleString('en-IN')}/day</span>
              </div>
              <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-[10.5px] font-bold text-slate-400 block uppercase">Lounge Access</span>
                <span className="font-extrabold text-[#2563EB] dark:text-[#60A5FA] text-sm mt-0.5 block">{associatedCard.loungeAccess || 'No'}</span>
              </div>
            </div>

            {/* Additional Features List */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Card Perks & Privileges:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-medium">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>International Spends: {associatedCard.international ? 'Allowed' : 'Domestic Only'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Contactless Tap to Pay: {associatedCard.contactless ? 'Supported' : 'Not Supported'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Forex Markup: {associatedCard.forexMarkup || '3.5%'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Cashback Program: {associatedCard.cashback || 'Merchant Offers'}</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 text-xs font-medium text-slate-600 dark:text-slate-300">
            Associated Debit Card: <strong>{account.associatedDebitCardName || "Standard Bank Debit Card"}</strong>
          </div>
        )}
      </div>

      {/* SECTION 3: ACCOUNT FEATURES & DIGITIZATION */}
      {account.bankingFeatures && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 shadow-soft space-y-4">
          <h2 className="text-lg font-black text-[#1F2937] dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <ShieldCheck className="w-5 h-5 text-[#2563EB]" />
            <span>Verified Banking Features & Services</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs sm:text-sm font-medium">
            {account.bankingFeatures.map((bFeat, i) => (
              <div key={i} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#2563EB] shrink-0" />
                <span>{bFeat}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 4 & 5: ELIGIBILITY, DOCUMENTS & ACCOUNT OPENING */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {account.eligibility && (
          <div className="p-6 rounded-3xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 shadow-soft space-y-3">
            <h3 className="text-base font-extrabold text-[#1F2937] dark:text-white flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-[#2563EB]" />
              <span>Eligibility Criteria</span>
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium">
              {account.eligibility.map((el, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" />
                  <span>{el}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {account.accountOpeningFeatures && (
          <div className="p-6 rounded-3xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 shadow-soft space-y-3">
            <h3 className="text-base font-extrabold text-[#1F2937] dark:text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-[#2563EB]" />
              <span>Account Opening & Onboarding</span>
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium">
              {account.accountOpeningFeatures.map((aop, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{aop}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* SECTION 15: LEGAL DISCLAIMER */}
      <div className="p-5 sm:p-6 rounded-3xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 space-y-3 text-amber-900 dark:text-amber-200 text-xs sm:text-sm">
        <div className="flex items-center gap-2 font-black uppercase tracking-wider text-amber-800 dark:text-amber-300">
          <Info className="w-4 h-4 shrink-0" />
          <span>Statutory Disclaimer & Information Notice</span>
        </div>
        <p className="leading-relaxed font-normal">
          Information is provided for informational and comparison purposes only. Interest rates, charges, eligibility criteria, account features and debit-card benefits may change. Please verify the latest information on the respective bank's official website before opening an account.
        </p>
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-amber-200/60 dark:border-amber-900/40 text-xs font-semibold">
          <span>Source: Official Bank Website</span>
          <span>Last Verified: {account.lastVerified || "August 2026"}</span>
        </div>
      </div>
    </main>
  );
}

export default SavingsAccountDetailPage;
