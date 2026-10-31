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
import { useLanguage } from '../context/LanguageContext';
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
  const { t, language } = useLanguage();
  const isHindi = language === 'hi';

  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCardIndex, setActiveCardIndex] = useState(0);

  const bankName = account?.bankName || account?.bank_name || account?.bank || (isHindi ? "बैंक" : "Bank");
  const accountName = account?.accountName || account?.variant_name || (isHindi ? "चालू खाता" : "Current Account");
  const minimumBalance = account?.minimumBalance || account?.minimum_balance || "";

  const seoTitle = account
    ? `${bankName} ${accountName} ${isHindi ? 'चालू खाता' : 'Current Account'} | D.Card`
    : error
      ? (isHindi ? "चालू खाता नहीं मिला | D.Card" : "Current Account Not Found | D.Card")
      : (isHindi ? "चालू खाता विवरण | D.Card" : "Current Account Details | D.Card");

  const seoDescription = account
    ? `Explore ${bankName} ${accountName} Current Account. Features: ${minimumBalance ? `minimum balance requirement ₹${minimumBalance}, ` : ''}cash deposit limits, and business banking perks on D.Card.`
    : "Explore features, limits, and minimum balance requirements for commercial and business current accounts on D.Card.";

  const seoSchema = account
    ? {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.dcard.website/" },
              { "@type": "ListItem", "position": 2, "name": "Current Accounts", "item": "https://www.dcard.website/current-accounts" },
              { "@type": "ListItem", "position": 3, "name": `${bankName} ${accountName}`, "item": `https://www.dcard.website/current-accounts/${id}` }
            ]
          },
          {
            "@type": "FinancialProduct",
            "name": `${bankName} ${accountName} Current Account`,
            "description": seoDescription,
            "provider": {
              "@type": "BankOrCreditUnion",
              "name": bankName
            },
            "url": `https://www.dcard.website/current-accounts/${id}`
          }
        ]
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
          setError(isHindi ? 'चालू खाता उत्पाद नहीं मिला।' : 'Current Account product not found.');
        }
      })
      .catch(err => {
        console.error('Error fetching current account details:', err);
        setError(isHindi ? 'चालू खाता विवरण लोड करने में विफल।' : 'Failed to load current account details.');
      })
      .finally(() => setLoading(false));
  }, [id, isHindi]);

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
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
          {isHindi ? 'खाता नहीं मिला' : 'Account Not Found'}
        </h2>
        <p className="text-sm text-slate-500">{error || (isHindi ? "अनुरोधित चालू खाता नहीं मिला।" : "The requested current account could not be found.")}</p>
        <Link
          to="/current-accounts"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#2563EB] text-white text-xs font-bold shadow-md hover:bg-blue-700"
        >
          <ArrowLeft className="w-4 h-4" /> {isHindi ? 'चालू खातों की सूची पर वापस जाएं' : 'Return to Current Accounts Discovery'}
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
        return { label: isHindi ? 'निःशुल्क / शामिल' : 'Complimentary / Included', color: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30' };
      case 'default':
        return { label: isHindi ? 'डिफ़ॉल्ट जारी कार्ड' : 'Default Issued Card', color: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/30' };
      case 'optional':
        return { label: isHindi ? 'एक विकल्प के रूप में उपलब्ध' : 'Available as an option', color: 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-500/30' };
      case 'eligibility_based':
        return { label: isHindi ? 'पात्रता आधारित अपग्रेड' : 'Eligibility Based Upgrade', color: 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/30' };
      default:
        return { label: isHindi ? 'डिफ़ॉल्ट व्यापार कार्ड' : 'Default Business Card', color: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/30' };
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
          <ArrowLeft className="w-4 h-4" /> {isHindi ? 'चालू खातों पर वापस जाएं' : 'Back to Current Accounts'}
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
            <span>{wishlisted ? (isHindi ? 'सहेजा गया' : 'Saved') : (isHindi ? 'सहेजें' : 'Save')}</span>
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
            <span>{isCompared ? (isHindi ? 'तुलना में' : 'Queued') : (isHindi ? 'तुलना करें' : 'Compare')}</span>
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
                🏦 {bankName} • {isHindi ? 'चालू खाता' : 'CURRENT ACCOUNT'}
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-[#1F2937] dark:text-white tracking-tight mt-0.5">
                {accountName}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">
                {isHindi ? 'श्रेणी' : 'Category'}: <strong className="text-slate-700 dark:text-slate-200">{account.accountType || (isHindi ? "चालू खाता" : "Current Account")}</strong>
                {account.suitableFor && (
                  <span> • {isHindi ? 'उपयुक्त' : 'Suitable For'}: <strong className="text-slate-700 dark:text-slate-200">{account.suitableFor}</strong></span>
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
              <span>{isHindi ? 'आधिकारिक बैंक पोर्टल देखें' : 'Visit Official Bank Portal'}</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>

        {/* Badges Row */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-[#2563EB]/10 text-[#2563EB] dark:text-[#60A5FA] border border-[#2563EB]/20">
            {isHindi ? 'औसत त्रैमासिक शेष (AQB):' : 'AQB:'} {formattedBalance.display}
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> {isHindi ? 'मुफ्त चेक:' : 'Free Cheques:'} {account.freeChequeLeaves || (isHindi ? "शामिल" : "Included")}
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            NEFT/RTGS: {account.neft || (isHindi ? "मुफ्त डिजिटल" : "Free Digital")}
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> {isHindi ? 'सत्यापित:' : 'Verified:'} {sourceInfo.verifiedDateFormatted}
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
            <span>{isHindi ? 'पात्र व्यापारिक संस्थाएं (Constitutions)' : 'Eligible Business Constitutions'}</span>
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
              <p className="text-xs text-slate-500">
                {isHindi ? 'एकल स्वामित्व, साझेदारी, प्राइवेट लिमिटेड, पब्लिक लिमिटेड, एलएलपी, ट्रस्ट और सोसायटियां।' : 'Sole Proprietorship, Partnership, Private Limited, Public Limited, LLP, Trusts & Societies.'}
              </p>
            )}
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 shadow-soft space-y-4">
          <h3 className="text-base font-black text-slate-800 dark:text-white flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-[#2563EB]" />
            <span>{isHindi ? 'दस्तावेजीकरण एवं पात्रता मानदंड' : 'Documentation & Eligibility Criteria'}</span>
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
              <p className="text-xs text-slate-500">
                {isHindi ? 'मानक व्यापार पंजीकरण दस्तावेज, पैन, जीएसटी प्रमाण पत्र, संस्था प्रमाण और अधिकृत हस्ताक्षरकर्ताओं का केवाईसी।' : 'Standard business registration documents, PAN, GST certificate, entity proofs and KYC of authorized signatories.'}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* 3. BALANCE REQUIREMENTS SECTION */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 shadow-soft space-y-5">
        <h2 className="text-lg font-black text-[#1F2937] dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <Layers className="w-5 h-5 text-[#2563EB]" />
          <span>{isHindi ? 'न्यूनतम शेष आवश्यकताएं एवं रखरखाव नियम' : 'Balance Requirements & Maintenance Rules'}</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/80 dark:border-blue-900/50 space-y-1">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-blue-700 dark:text-blue-400 block">
              {isHindi ? 'औसत शेष आवश्यकता' : 'Average Balance Requirement'}
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
              {isHindi ? 'न्यूनतम शेष न रखने का शुल्क' : 'Non-Maintenance Fee'}
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
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
              {isHindi ? 'शाखा स्थान अनुसार विवरण:' : 'Branch Location Breakdown:'}
            </h4>
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
          <span>{isHindi ? 'ब्याज दर एवं नियामक नीति' : 'Interest Rate & Regulatory Policy'}</span>
        </h2>

        <div className="p-4 rounded-2xl bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40 space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">{formattedRate.display}</span>
            <span className="text-xs text-emerald-700 dark:text-emerald-300 font-bold">
              {isHindi ? 'मानक वाणिज्यिक नियम' : 'Standard Commercial Rule'}
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {isHindi 
              ? 'भारतीय रिज़र्व बैंक (RBI) के नियमों के अनुसार वाणिज्यिक बैंक चालू खाते की शेष राशि पर ब्याज नहीं दे सकते। ब्याज लाभ केवल संबद्ध स्वीप-इन सावधि जमा सुविधा के माध्यम से ही प्राप्त किए जा सकते हैं।'
              : 'Per Reserve Bank of India (RBI) regulations, commercial banks are prohibited from paying interest on Current Account balances. Any interest benefits can only be achieved via linked sweep-in fixed deposit facilities.'}
          </p>
        </div>
      </div>

      {/* 5. CASH DEPOSIT LIMITS & BANKING SERVICES */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 shadow-soft space-y-5">
        <h2 className="text-lg font-black text-[#1F2937] dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <Building2 className="w-5 h-5 text-[#2563EB]" />
          <span>{isHindi ? 'बैंकिंग सेवाएं एवं नकद जमा नियम' : 'Banking Services & Cash Handling Rules'}</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">{isHindi ? 'नकद जमा सीमा' : 'Cash Deposit Limit'}</span>
            <span className="font-extrabold text-slate-800 dark:text-slate-100 text-sm mt-1 block">
              {formattedCashLimit.display}
            </span>
            {formattedCashLimit.subtext && (
              <span className="text-[10px] text-slate-500 block mt-0.5 line-clamp-1">{formattedCashLimit.subtext}</span>
            )}
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">{isHindi ? 'मुफ्त चेक पन्ने / माह' : 'Cheque Leaves / Month'}</span>
            <span className="font-extrabold text-slate-800 dark:text-slate-100 text-sm mt-1 block">
              {account.freeChequeLeaves || account.chequeBook || (isHindi ? "मानक निःशुल्क आवंटन" : "Standard free allocation")}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">NEFT / RTGS</span>
            <span className="font-extrabold text-emerald-600 dark:text-emerald-400 text-sm mt-1 block">
              {account.neft || (isHindi ? "मुफ्त डिजिटल" : "Free Digital")}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">{isHindi ? 'पीओएस / मर्चेंट टर्मिनल' : 'POS / Merchant Terminal'}</span>
            <span className="font-extrabold text-slate-800 dark:text-slate-100 text-sm mt-1 block">
              {account.posTerminal || (isHindi ? "अनुरोध पर उपलब्ध" : "Available on request")}
            </span>
          </div>
        </div>
      </div>

      {/* 6. BUSINESS ADVANTAGES & KEY FEATURES */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 shadow-soft space-y-4">
        <h3 className="text-base font-black text-slate-800 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <Gift className="w-5 h-5 text-[#2563EB]" />
          <span>{isHindi ? 'व्यापारिक लाभ एवं प्रमुख विशेषताएं' : 'Business Advantages & Key Features'}</span>
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
          <span>{isHindi ? 'नकद हैंडलिंग स्लैब और परिचालन नियम' : 'Cash Handling Slabs & Operational Rules'}</span>
        </h3>
        <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
          {account.cashHandlingCharges || formattedCashLimit.fullText || (isHindi ? "बैंक वाणिज्यिक अनुसूची के अनुसार मासिक मुफ्त सीमाओं से परे नकद हैंडलिंग शुल्क लागू होते हैं।" : "Cash handling charges apply beyond the monthly free limits according to bank commercial schedule.")}
        </p>
      </div>

      {/* 8. DEDICATED SECTION: DEBIT CARD(S) AVAILABLE WITH THIS CURRENT ACCOUNT */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#EFF6FF] via-[#DBEAFE]/30 to-white dark:from-slate-900 dark:via-slate-900/90 dark:to-slate-800 border-2 border-[#2563EB]/40 shadow-md space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#2563EB]/20 pb-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 bg-[#2563EB] text-white text-[10px] font-black uppercase tracking-widest rounded-full mb-1">
              {isHindi ? 'सत्यापित बैंक डेबिट लिंकेज' : 'SAME-BANK VERIFIED DEBIT LINK'}
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-[#0B3D91] dark:text-[#60A5FA] flex items-center gap-2">
              <CreditCard className="w-6 h-6 text-[#2563EB]" />
              <span>{isHindi ? 'इस खाते के साथ उपलब्ध बिजनेस डेबिट कार्ड' : 'Business Debit Card(s) Available With This Account'}</span>
            </h2>
          </div>

          <p className="text-xs text-[#2563EB] dark:text-[#60A5FA] font-bold">
            {associatedCards.length > 0
              ? (isHindi ? `${associatedCards.length} सत्यापित डेबिट कार्ड विकल्प` : `${associatedCards.length} verified debit card option(s)`)
              : (isHindi ? 'डेबिट कार्ड संबद्धता स्थिति' : 'Debit card relationship status')}
          </p>
        </div>

        {associatedCards.length === 0 ? (
          <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-3">
            <AlertCircle className="w-12 h-12 text-slate-400 mx-auto" />
            <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200">
              {isHindi ? 'संबद्ध डेबिट कार्ड: आधिकारिक स्रोत पर निर्दिष्ट नहीं है' : 'Linked Debit Card: Not specified on official source'}
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              {isHindi ? 'आधिकारिक स्रोत इस खाते के लिए किसी विशिष्ट डेबिट कार्ड संस्करण का उल्लेख नहीं करता है। कोई भी सामान्य डेबिट कार्ड जबरन नहीं जोड़ा गया है।' : 'The official source does not specify a linked debit card variant for this account. No generic debit card has been arbitrarily attached.'}
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
                            {isHindi ? '✓ सत्यापित कार्ड लिंकेज' : '✓ Verified Card Linkage'}
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
                        <span>{isHindi ? 'पूरा कार्ड प्रोफाइल देखें →' : 'View Full Card Profile →'}</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">{isHindi ? 'वार्षिक कार्ड शुल्क' : 'Annual Card Fee'}</span>
                      <span className="font-extrabold text-slate-800 dark:text-slate-100 text-sm mt-1 block">
                        {card.annualFee === 0 ? (isHindi ? 'निःशुल्क' : 'Free') : `₹${card.annualFee}`}
                      </span>
                    </div>

                    <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">{isHindi ? 'दैनिक एटीएम सीमा' : 'Daily ATM Limit'}</span>
                      <span className="font-extrabold text-slate-800 dark:text-slate-100 text-sm mt-1 block">
                        {card.atmLimit || '₹1,00,000/day'}
                      </span>
                    </div>

                    <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">{isHindi ? 'दैनिक पीओएस / ई-कॉमर्स' : 'Daily POS / E-Commerce'}</span>
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
          <span>{isHindi ? 'शुल्क, जुर्माना और वाणिज्यिक टैरिफ नियम' : 'Fees, Penalties & Commercial Tariff Rules'}</span>
        </h2>

        <div className="space-y-4 text-xs sm:text-sm">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 space-y-1.5">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block">
              {isHindi ? 'न्यूनतम शेष न रखने का जुर्माना विवरण' : 'Non-Maintenance Penalty Details'}
            </span>
            <p className="font-semibold text-slate-800 dark:text-slate-200 leading-relaxed">
              {formattedFee.fullText}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">{isHindi ? 'चेक बुक शुल्क' : 'Cheque Book Charges'}</span>
              <span className="font-bold text-slate-700 dark:text-slate-300 mt-1 block">
                {account.freeChequeLeaves || (isHindi ? "प्रति माह मानक मुद्रित चेक पन्ने निःशुल्क।" : "Standard printed cheque leaves free per month.")}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">{isHindi ? 'डोरस्टेप बैंकिंग एवं अन्य शुल्क' : 'Doorstep Banking & Other Charges'}</span>
              <span className="font-bold text-slate-700 dark:text-slate-300 mt-1 block">
                {account.doorstepBanking || (isHindi ? "शाखा अनुसूची के अनुसार अनुरोध पर उपलब्ध।" : "Available on request as per branch schedule.")}
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
              {isHindi ? 'आधिकारिक स्रोत एवं सत्यापन ऑडिट' : 'Official Source & Verification Audit'}
            </h2>
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-extrabold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            {isHindi ? '✓ सत्यापित व्यावसायिक उत्पाद' : '✓ Verified Business Product'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">{isHindi ? 'आधिकारिक बैंक स्रोत' : 'Official Bank Source'}</span>
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
                <span>{isHindi ? 'आधिकारिक पोर्टल देखें' : 'Visit Official Portal'}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">{isHindi ? 'अंतिम सत्यापन तिथि' : 'Last Verified Date'}</span>
            <span className="font-bold text-slate-800 dark:text-white text-sm mt-1 block">
              {sourceInfo.verifiedDateFormatted}
            </span>
            {sourceInfo.effectiveDateFormatted && (
              <span className="text-[10px] text-slate-500 block mt-0.5">
                {isHindi ? `प्रभावी: ${sourceInfo.effectiveDateFormatted}` : `Effective: ${sourceInfo.effectiveDateFormatted}`}
              </span>
            )}
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">{isHindi ? 'ऑडिट और संदर्भ स्थिति' : 'Audit & Reference Status'}</span>
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
