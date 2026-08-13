import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Building2, 
  ShieldCheck, 
  CheckCircle2, 
  Search, 
  Percent, 
  CreditCard, 
  Scale, 
  ExternalLink, 
  ChevronRight, 
  Info, 
  Award, 
  UserCheck, 
  PhoneCall, 
  Smartphone, 
  TrendingUp, 
  Sparkles, 
  Heart, 
  Check, 
  X, 
  HelpCircle,
  Briefcase,
  Lock,
  Globe,
  Users
} from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import BankBrandLogo from './BankBrandLogo';

/* ── ICICI SAVINGS ACCOUNT CHARGES EXPLORER DATA (One Savings Account Dataset ONLY) ── */
const ICICI_SAVINGS_CHARGES_DATA = [
  {
    category: "Minimum Balance & Maintenance",
    feature: "MAB / QAB Tiering",
    value: "Metro / Urban: ₹10,000 MAB | Semi-Urban: ₹5,000 MAB | Rural: ₹2,000 MAB",
    seniorValue: "₹15,000 MAB (Senior Citizen Savings Tier)",
    note: "Must be maintained on monthly average basis"
  },
  {
    category: "Minimum Balance & Maintenance",
    feature: "Non-Maintenance Charges",
    value: "6% of shortfall in required MAB or ₹500/month (whichever is lower)",
    seniorValue: "6% of shortfall in required MAB or ₹500/month (whichever is lower)",
    note: "Applicable if MAB drops below tier requirement"
  },
  {
    category: "Cash Transactions",
    feature: "Cash Transaction Charges (Branch / CRM)",
    value: "First 3 transactions or up to ₹1 Lakh/month: Nil. Thereafter: ₹150 per transaction (or ₹5 per ₹1,000, min ₹150)",
    seniorValue: "First 3 transactions up to ₹1 Lakh each: Nil. Thereafter standard charges apply",
    note: "Combined branch and cash recycling machine limit"
  },
  {
    category: "Cash Transactions",
    feature: "CRM Deposit Charges",
    value: "Free during branch hours up to monthly cash limit. Post working hours / excess: ₹50 per transaction",
    seniorValue: "Free during branch hours. Standard CRM fee for after-hours deposits",
    note: "Cash deposit machine limits match monthly cash quota"
  },
  {
    category: "Digital Fund Transfers",
    feature: "IMPS Outward",
    value: "Up to ₹1,000: Nil | ₹1,001–₹25,000: ₹3.50 + GST | ₹25,001–₹5,00,000: ₹15 + GST",
    seniorValue: "Nil for digital transfers via iMobile / RIB*",
    note: "Online channel transfers via iMobile app"
  },
  {
    category: "Digital Fund Transfers",
    feature: "RTGS Outward (Online)",
    value: "Nil for transfers initiated via iMobile / Internet Banking. Branch: ₹20–₹45 + GST",
    seniorValue: "Nil for online RTGS transfers",
    note: "Branch-initiated RTGS attracts standard processing fee"
  },
  {
    category: "Digital Fund Transfers",
    feature: "NEFT Outward (Online)",
    value: "Nil for transfers initiated via iMobile / Internet Banking. Branch: ₹2.50–₹25 + GST",
    seniorValue: "Nil for online NEFT transfers",
    note: "Branch-initiated NEFT attracts standard processing fee"
  },
  {
    category: "Instruments & Notices",
    feature: "DD Issuance (Demand Draft)",
    value: "₹2 per ₹1,000 (Min ₹50, Max ₹15,000) for standard account holders",
    seniorValue: "Free Demand Drafts up to prescribed monthly caps*",
    note: "Issued via branch or net banking door delivery"
  },
  {
    category: "Communication & Alerts",
    feature: "SMS Alert Charges",
    value: "₹15 per quarter for value-added SMS alerts (Transaction alerts required by RBI are free)",
    seniorValue: "Nil / Waiver for Senior Citizen Savings Tier*",
    note: "Mandatory OTP & security alerts remain zero cost"
  },
  {
    category: "Cards & ATMs",
    feature: "Debit Card Annual Fees",
    value: "Smart Shopper Gold: ₹150 + GST | Coral: ₹599 + GST | Sapphiro/Wealth: Free on Select/Wealth tiers",
    seniorValue: "Complimentary / Discounted debit card variants",
    note: "Annual maintenance fee charged at beginning of year"
  },
  {
    category: "Cards & ATMs",
    feature: "ATM — ICICI Bank ATMs",
    value: "5 free financial & non-financial transactions per month. Thereafter: ₹21 per financial, ₹8.50 per non-financial",
    seniorValue: "5 free transactions per month at ICICI Bank ATMs",
    note: "Unlimited free transactions for Select & Wealth tiers"
  },
  {
    category: "Cards & ATMs",
    feature: "ATM — Interchange (Other Bank ATMs)",
    value: "3 free transactions in Metro cities, 5 in Non-Metro cities. Thereafter: ₹21 (financial), ₹8.50 (non-financial)",
    seniorValue: "Standard RBI interchange transaction limits apply",
    note: "Metros: Mumbai, New Delhi, Chennai, Kolkata, Bengaluru, Hyderabad"
  },
  {
    category: "Statements & Passbook",
    feature: "Statement Issuance",
    value: "Monthly E-Statement via Email: Free. Physical Branch Statement / Duplicate Passbook: ₹100",
    seniorValue: "Complimentary physical passbook & email statements",
    note: "Passbook updates free at all branch kiosks"
  }
];

/* ── ICICI PRIVILEGE BANKING TIERS DATA ── */
const PRIVILEGE_TIERS = [
  {
    id: "select",
    name: "Select Banking",
    tagline: "Privilege Banking Tier",
    badgeColor: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    accentBorder: "border-blue-500/30",
    headerGradient: "from-[#0B3D91] to-[#2563EB]",
    eligibilityRoutes: [
      {
        routeTitle: "CASA + Deposits Route",
        criteria: "MIB / MAB of ₹1.5 Lakhs in Savings Account OR Total Relationship Value (TRV) of ₹5 Lakhs across Savings & Fixed Deposits"
      },
      {
        routeTitle: "CASA + Investments / MF / Demat Route",
        criteria: "MIB of ₹1.5 Lakhs in Savings Account + Mutual Funds / Demat portfolio holding"
      }
    ],
    features: {
      threeInOne: "3-in-1 Account Included (Savings + Demat + Trading)",
      debitCard: "ICICI Coral / Platinum Debit Card",
      loungeAccess: "1 Complimentary Airport Lounge Access per quarter (subject to previous quarter spend criteria)",
      relationshipManager: "Dedicated Relationship Desk & Priority Branch Assistance",
      familyBanking: "Up to 4 Family Members mapped under single relationship",
      airAccidentInsurance: "Air Accidental Death Insurance cover up to ₹50 Lakhs",
      personalAccidentInsurance: "Personal Accident Death Insurance cover up to ₹10 Lakhs"
    },
    exclusivePerks: null
  },
  {
    id: "wealth",
    name: "Wealth Management",
    tagline: "Premier Wealth Relationship",
    badgeColor: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    accentBorder: "border-purple-500/40",
    headerGradient: "from-[#4C1D95] to-[#7C3AED]",
    isRecommended: true,
    eligibilityRoutes: [
      {
        routeTitle: "CASA + Deposits Route",
        criteria: "MIB / MAB of ₹5 Lakhs in Savings Account OR Total Relationship Value (TRV) of ₹25 Lakhs across Savings & Fixed Deposits"
      },
      {
        routeTitle: "CASA + Investments / MF / Demat Route",
        criteria: "MIB of ₹5 Lakhs in Savings Account + Mutual Funds / Demat / PMS portfolio TRV of ₹25 Lakhs"
      }
    ],
    features: {
      threeInOne: "Premium 3-in-1 Trading Account with zero brokerage on select segments",
      debitCard: "ICICI Wealth / Sapphiro Debit Card (Complimentary)",
      loungeAccess: "Complimentary Airport & Railway Lounge Access (Domestic & International access passes)",
      relationshipManager: "Dedicated Senior Wealth Manager & Specialist Financial Advisory Team",
      familyBanking: "Up to 6 Family Members under Wealth Family Banking",
      airAccidentInsurance: "Air Accidental Death Insurance cover up to ₹1 Crore",
      personalAccidentInsurance: "Personal Accident Death Insurance cover up to ₹25 Lakhs"
    },
    exclusivePerks: null
  },
  {
    id: "private",
    name: "Private Banking",
    tagline: "Bespoke HNI & Family Office Tier",
    badgeColor: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    accentBorder: "border-amber-500/50 shadow-lg shadow-amber-500/10",
    headerGradient: "from-[#78350F] via-[#B45309] to-[#D97706]",
    isExclusive: true,
    eligibilityRoutes: [
      {
        routeTitle: "CASA + Deposits Route",
        criteria: "Total Relationship Value (TRV) of ₹5 Crores across Savings, Fixed Deposits & Corporate Relationships (or MIB ₹25 Lakhs in CASA)"
      },
      {
        routeTitle: "CASA + Investments / MF / Demat Route",
        criteria: "TRV of ₹5 Crores including Equities, Mutual Funds, PMS, AIFs & Demat Asset Portfolios"
      }
    ],
    features: {
      threeInOne: "Bespoke Private Banking 3-in-1 Ecosystem with dedicated institutional desk",
      debitCard: "ICICI Private Banking / Emerald World Debit Card",
      loungeAccess: "Unlimited Domestic & International Airport Lounge Access + Luxury Spa privileges",
      relationshipManager: "Dedicated Senior Private Banker & Global Family Office Advisory Team",
      familyBanking: "Up to 8 Family Members under Private Banking Family Relationship",
      airAccidentInsurance: "Air Accidental Death Insurance cover up to ₹3 Crores",
      personalAccidentInsurance: "Personal Accident Death Insurance cover up to ₹50 Lakhs"
    },
    exclusivePerks: [
      {
        title: "Preferential Locker Offering",
        description: "50% to 100% discount on annual locker rental charges across all branch locations."
      },
      {
        title: "Preferential Credit-Card Offering",
        description: "Lifetime Free ICICI Emerald / Sapphiro Credit Card invitation with zero joining and annual fees."
      },
      {
        title: "Preferential Remittance Offering",
        description: "Zero forex markup exchange rates & zero wire transfer processing charges on outward international remittances."
      }
    ]
  }
];

/* ── CONNECTED ICICI DEBIT CARDS LIST ── */
const CONNECTED_ICICI_DEBIT_CARDS = [
  {
    id: "icici-coral-debit-card",
    cardName: "ICICI Coral Debit Card",
    bank: "ICICI Bank",
    network: "Visa / Mastercard / RuPay",
    category: "Rewards & Lifestyle",
    annualFee: "₹599 + GST (Waived on Select/Wealth tiers)",
    joiningFee: "₹599 + GST",
    atmLimit: "₹1,00,000/day",
    posLimit: "₹2,50,000/day",
    loungeAccess: "1 Complimentary Airport Lounge Access per quarter (min spend ₹10k in previous quarter)",
    cashback: "2 Payback Points per ₹200 spent on shopping & dining",
    insurance: "Air Accident Cover up to ₹50 Lakhs | Personal Accident ₹10 Lakhs",
    forexMarkup: "3.50%",
    contactless: true,
    international: true,
    rating: 4.6,
    bestFor: "Shopping, Rewards & Lounge Perks"
  },
  {
    id: "icici-sapphiro-debit-card",
    cardName: "ICICI Sapphiro / Wealth Debit Card",
    bank: "ICICI Bank",
    network: "Visa Signature / Mastercard World",
    category: "Premium & Wealth",
    annualFee: "₹1,999 + GST (Complimentary for Wealth Management tier)",
    joiningFee: "₹1,999 + GST",
    atmLimit: "₹2,00,000/day",
    posLimit: "₹5,00,000/day",
    loungeAccess: "2 Complimentary Airport Lounge Access per quarter + Railway Lounge Access",
    cashback: "4 Payback Points per ₹200 spent + Buy 1 Get 1 Movie Tickets on BookMyShow",
    insurance: "Air Accident Cover up to ₹1 Crore | Personal Accident ₹25 Lakhs",
    forexMarkup: "2.00% (Zero Forex markup option available)",
    contactless: true,
    international: true,
    rating: 4.9,
    bestFor: "Luxury Travel, Movies & Wealth Benefits"
  },
  {
    id: "icici-private-banking-debit-card",
    cardName: "ICICI Private Banking Emerald Debit Card",
    bank: "ICICI Bank",
    network: "Visa Infinite",
    category: "Elite Private Banking",
    annualFee: "Complimentary for Private Banking Relationship",
    joiningFee: "Complimentary",
    atmLimit: "₹3,00,000/day",
    posLimit: "₹10,00,000/day",
    loungeAccess: "Unlimited Domestic & International Airport Lounge Access + Spa Privileges",
    cashback: "6 Payback Points per ₹200 spent + Dedicated 24x7 Global Concierge",
    insurance: "Air Accident Cover up to ₹3 Crores | Personal Accident ₹50 Lakhs",
    forexMarkup: "0.00% (Zero Forex Markup on Outward Remittance & International POS)",
    contactless: true,
    international: true,
    rating: 5.0,
    bestFor: "Global HNI Travel, Unlimited Lounge & Family Banking"
  },
  {
    id: "icici-smart-shopper-gold-debit-card",
    cardName: "ICICI Smart Shopper Gold Debit Card",
    bank: "ICICI Bank",
    network: "Visa / Mastercard / RuPay",
    category: "Standard Savings",
    annualFee: "₹150 + GST",
    joiningFee: "₹150 + GST",
    atmLimit: "₹50,000/day",
    posLimit: "₹1,25,000/day",
    loungeAccess: "Not Available",
    cashback: "1 Payback Point per ₹200 spent",
    insurance: "Accidental Death Insurance cover up to ₹5 Lakhs",
    forexMarkup: "3.50%",
    contactless: true,
    international: true,
    rating: 4.3,
    bestFor: "Daily ATM Withdrawals & Utility Shopping"
  }
];

function ICICIBSavingsDetailView({ onSelectDebitCard }) {
  const navigate = useNavigate();
  const { isWishlisted, toggleWishlist } = useWishlist();

  // Search & Filter State for Charges Explorer (Section 5)
  const [chargesSearchQuery, setChargesSearchQuery] = useState('');
  const [chargesCategoryFilter, setChargesCategoryFilter] = useState('All');

  const mainAccountId = 1051;
  const isSaved = isWishlisted(mainAccountId);

  // Filtered charges table dataset (Section 5 - One Savings Account Data ONLY)
  const filteredChargesList = useMemo(() => {
    return ICICI_SAVINGS_CHARGES_DATA.filter(item => {
      const matchesCategory = chargesCategoryFilter === 'All' || item.category === chargesCategoryFilter;
      const q = chargesSearchQuery.toLowerCase().trim();
      const matchesQuery = !q || (
        item.feature.toLowerCase().includes(q) ||
        item.value.toLowerCase().includes(q) ||
        item.seniorValue.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.note.toLowerCase().includes(q)
      );
      return matchesCategory && matchesQuery;
    });
  }, [chargesSearchQuery, chargesCategoryFilter]);

  const uniqueChargeCategories = useMemo(() => {
    const categories = new Set(ICICI_SAVINGS_CHARGES_DATA.map(i => i.category));
    return ['All', ...Array.from(categories)];
  }, []);

  return (
    <div className="w-full space-y-10 text-left select-none max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* ── 0. BREADCRUMB & TOP NAV ── */}
      <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
        <Link to="/" className="hover:text-[#2563EB] transition-colors">Home</Link>
        <span>/</span>
        <Link to="/savings-accounts" className="hover:text-[#2563EB] transition-colors">Savings Accounts</Link>
        <span>/</span>
        <span className="text-slate-900 dark:text-white font-extrabold">ICICI Bank</span>
      </nav>

      {/* ── PAGE HEADER / HERO TITLE BANNER ── */}
      <div className="p-6 sm:p-10 rounded-[32px] bg-gradient-to-br from-[#0B3D91] via-[#1E3A8A] to-[#0F172A] text-white shadow-2xl relative overflow-hidden border border-slate-700/80 space-y-6">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#F37021]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-5">
            {/* ICICI Bank Logo */}
            <div className="w-20 h-20 rounded-3xl bg-white p-2.5 shadow-xl flex items-center justify-center shrink-0 border border-slate-200">
              <BankBrandLogo bankName="ICICI Bank" className="w-14 h-14" />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-3 py-0.5 rounded-full bg-[#F37021]/20 text-[#FF8C38] text-[10.5px] font-black uppercase tracking-widest border border-[#F37021]/40">
                  OFFICIAL SAVINGS INDEX
                </span>
                <span className="px-3 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10.5px] font-black uppercase tracking-widest border border-emerald-400/30 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Verified Rates & Tiers
                </span>
              </div>

              {/* Exact Page Title & Subtitle Required by Prompt */}
              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                ICICI Bank <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-[#FF8C38]">
                  Savings Account & Privilege Banking
                </span>
              </h1>

              <p className="text-xs sm:text-sm text-slate-300 font-normal max-w-2xl leading-relaxed pt-1">
                Explore savings account requirements, privilege banking tiers, senior citizen benefits, debit-card benefits and account charges in one place.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => toggleWishlist({ id: mainAccountId, accountName: "ICICI Bank Savings Account & Privilege Banking", bank: "ICICI Bank" })}
              className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center gap-2 text-xs font-bold ${
                isSaved
                  ? 'bg-rose-500 text-white border-rose-500 shadow-md'
                  : 'bg-white/10 hover:bg-white/20 text-white border-white/20'
              }`}
            >
              <Heart className={`w-4 h-4 ${isSaved ? 'fill-white' : ''}`} />
              <span>{isSaved ? 'Saved in Favourites' : 'Save to Favourites'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── SECTION 1: SAVINGS ACCOUNT OVERVIEW ── */}
      <section className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 shadow-soft space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#2563EB]/10 text-[#2563EB] dark:text-[#60A5FA] flex items-center justify-center font-bold">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                1. Savings Account Overview
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Core parameters and standard features of ICICI Bank Savings Account
              </p>
            </div>
          </div>

          <span className="text-[11px] font-black uppercase tracking-wider text-[#2563EB] dark:text-[#60A5FA] bg-[#2563EB]/10 px-3 py-1 rounded-full border border-[#2563EB]/20 hidden sm:inline">
            Standard ICICI Tier
          </span>
        </div>

        {/* 5 Core Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          
          {/* Card 1: Monthly Average Balance (MAB) */}
          <div className="p-5 rounded-2xl bg-[#F8FAFC] dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5 text-left">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#2563EB] dark:text-[#60A5FA] block">
              Monthly Average Balance (MAB)
            </span>
            <h4 className="text-lg font-black text-slate-900 dark:text-white">
              ₹10,000 <span className="text-xs font-normal text-slate-500">(Metro / Urban)</span>
            </h4>
            <div className="text-[11px] text-slate-600 dark:text-slate-400 space-y-0.5 pt-1 border-t border-slate-200/60 dark:border-slate-800">
              <p>• Semi-Urban Branches: ₹5,000 MAB</p>
              <p>• Rural Branches: ₹2,000 MAB</p>
              <p>• Senior Citizen Tier: ₹15,000 MAB</p>
            </div>
          </div>

          {/* Card 2: 3-in-1 Account */}
          <div className="p-5 rounded-2xl bg-[#F8FAFC] dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5 text-left">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block">
              3-in-1 Integrated Account
            </span>
            <h4 className="text-lg font-black text-slate-900 dark:text-white">
              Savings + Demat + Trading
            </h4>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug pt-1 border-t border-slate-200/60 dark:border-slate-800">
              Integrated seamless investment ecosystem allowing instant transfer between bank liquidity and stock trading portfolios.
            </p>
          </div>

          {/* Card 3: Debit Card Tiering */}
          <div className="p-5 rounded-2xl bg-[#F8FAFC] dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5 text-left">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-600 dark:text-purple-400 block">
              Debit Card Tiering Options
            </span>
            <h4 className="text-lg font-black text-slate-900 dark:text-white">
              Smart Shopper / Coral / Sapphiro
            </h4>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug pt-1 border-t border-slate-200/60 dark:border-slate-800">
              Choice of Gold, Coral, Sapphiro, or Private Banking Debit Cards based on your account maintenance tier.
            </p>
          </div>

          {/* Card 4: 24x7 iMobile App Banking */}
          <div className="p-5 rounded-2xl bg-[#F8FAFC] dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5 text-left">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-400 block">
              24×7 Digital Banking
            </span>
            <h4 className="text-lg font-black text-slate-900 dark:text-white">
              iMobile Pay & RIB Platform
            </h4>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug pt-1 border-t border-slate-200/60 dark:border-slate-800">
              Full 24×7 access to Video KYC, instant fund transfers (NEFT/RTGS/IMPS/UPI), bill payments, and card controls.
            </p>
          </div>

          {/* Card 5: Air Accidental Death Insurance Cover */}
          <div className="p-5 rounded-2xl bg-[#F8FAFC] dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5 text-left sm:col-span-2 lg:col-span-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-600 dark:text-rose-400 block">
              Insurance Protection
            </span>
            <h4 className="text-lg font-black text-slate-900 dark:text-white">
              Air Accidental Death Insurance Cover
            </h4>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug pt-1 border-t border-slate-200/60 dark:border-slate-800">
              Complimentary Air Accidental Death cover starting from ₹50 Lakhs up to ₹3 Crores depending on your savings privilege tier.
            </p>
          </div>

        </div>
      </section>

      {/* ── SECTION 2: PRIVILEGE BANKING (3 TIER CARDS) ── */}
      <section className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 shadow-soft space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                2. Privilege Banking Tiers
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Explore ICICI Privilege Banking relationship tiers and qualification routes
              </p>
            </div>
          </div>

          {/* CRITICAL PROMPT HIGHLIGHT CALLOUT */}
          <div className="px-4 py-2 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs font-black uppercase tracking-wider text-center">
            💡 Maintain ANY ONE qualifying route
          </div>
        </div>

        {/* 3 Tier Cards Side by Side on Desktop / Stacked on Mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {PRIVILEGE_TIERS.map((tier) => (
            <div
              key={tier.id}
              className={`rounded-3xl p-6 bg-[#F8FAFC] dark:bg-slate-900 border ${tier.accentBorder} flex flex-col justify-between space-y-6 relative text-left shadow-soft hover:shadow-xl transition-all duration-300`}
            >
              {tier.isRecommended && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-[10px] font-black uppercase tracking-widest shadow-md">
                  Most Popular Tier
                </span>
              )}
              {tier.isExclusive && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-amber-700 text-white text-[10px] font-black uppercase tracking-widest shadow-md">
                  Exclusive HNI Tier
                </span>
              )}

              {/* Tier Header */}
              <div className="space-y-3 pt-1">
                <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${tier.badgeColor}`}>
                    {tier.tagline}
                  </span>
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#0B3D91] to-[#2563EB] text-white flex items-center justify-center font-bold text-xs">
                    {tier.name.charAt(6) || 'P'}
                  </div>
                </div>

                <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                  {tier.name}
                </h3>
              </div>

              {/* Qualification Routes Box */}
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-2">
                  <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-[#2563EB] dark:text-[#60A5FA]">
                    Programme Eligibility Routes
                  </span>
                  <span className="text-[9.5px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                    EITHER ROUTE
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  {tier.eligibilityRoutes.map((route, rIdx) => (
                    <div key={rIdx} className="space-y-0.5">
                      <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block">
                        Route {rIdx + 1}: {route.routeTitle}
                      </span>
                      <p className="font-semibold text-slate-800 dark:text-slate-200 leading-snug">
                        {route.criteria}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Standard Features Breakdown */}
              <div className="space-y-2 text-xs border-t border-slate-200/80 dark:border-slate-800 pt-4 text-slate-700 dark:text-slate-300 font-medium">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" />
                  <span><strong>3-in-1 Account:</strong> {tier.features.threeInOne}</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" />
                  <span><strong>Debit Card:</strong> {tier.features.debitCard}</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" />
                  <span><strong>Lounge Access:</strong> {tier.features.loungeAccess}</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" />
                  <span><strong>RM Access:</strong> {tier.features.relationshipManager}</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" />
                  <span><strong>Family Banking:</strong> {tier.features.familyBanking}</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" />
                  <span><strong>Air Insurance:</strong> {tier.features.airAccidentInsurance}</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" />
                  <span><strong>Personal Accident:</strong> {tier.features.personalAccidentInsurance}</span>
                </div>
              </div>

              {/* Private Banking Exclusive Perks */}
              {tier.exclusivePerks && (
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2.5 text-xs">
                  <span className="text-[10.5px] font-black uppercase tracking-wider text-amber-700 dark:text-amber-300 block border-b border-amber-500/20 pb-1">
                    👑 Private Banking Exclusive Perks
                  </span>
                  {tier.exclusivePerks.map((perk, pIdx) => (
                    <div key={pIdx} className="space-y-0.5">
                      <span className="font-bold text-slate-900 dark:text-white block">• {perk.title}</span>
                      <p className="text-[11px] text-slate-700 dark:text-slate-300 leading-snug">{perk.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── SECTION 3: SENIOR CITIZEN SAVINGS ACCOUNT ── */}
      <section className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 shadow-soft space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                3. Senior Citizen Savings Account
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Tailored banking features and privileges for senior citizens (Age 60+)
              </p>
            </div>
          </div>

          {/* EXACT PROMPT HIGHLIGHT REQUIRED */}
          <div className="px-4 py-2 rounded-2xl bg-emerald-600 text-white text-xs font-extrabold uppercase tracking-wider text-center shadow-md">
            All Banking Services at no cost*
          </div>
        </div>

        {/* Six-item Benefit Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          
          {/* Item 1: Digital Banking */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 text-left">
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-[#2563EB] flex items-center justify-center font-bold">
              <Smartphone className="w-4 h-4" />
            </div>
            <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
              1. Digital Banking
            </h4>
            <p className="text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
              Full digital banking access through iMobile Pay App and Retail Internet Banking (RIB) platform.
            </p>
          </div>

          {/* Item 2: Monthly Average Balance */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 text-left">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold">
              <Percent className="w-4 h-4" />
            </div>
            <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
              2. Monthly Average Balance
            </h4>
            <p className="text-slate-600 dark:text-slate-300 font-bold text-base text-emerald-600 dark:text-emerald-400">
              ₹15K
            </p>
            <p className="text-[11px] text-slate-500 font-normal">
              Maintained on monthly average basis across all branch locations.
            </p>
          </div>

          {/* Item 3: Premium Debit Cards */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 text-left">
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center font-bold">
              <CreditCard className="w-4 h-4" />
            </div>
            <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
              3. Premium Debit Cards
            </h4>
            <p className="text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
              Lounge access based on MAB and previous quarter spending criteria.
            </p>
          </div>

          {/* Item 4: Doorstep Banking */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 text-left">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">
              <Building2 className="w-4 h-4" />
            </div>
            <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
              4. Doorstep Banking
            </h4>
            <p className="text-emerald-600 dark:text-emerald-400 font-extrabold text-sm">
              No additional cost
            </p>
            <p className="text-[11px] text-slate-500 font-normal">
              Cash pickup, cheque collection and document pickup services.
            </p>
          </div>

          {/* Item 5: Priority Assistance */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 text-left">
            <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-600 flex items-center justify-center font-bold">
              <PhoneCall className="w-4 h-4" />
            </div>
            <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
              5. Priority Assistance
            </h4>
            <p className="text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
              Priority assistance across all branches + dedicated toll-free helpline 1800 1080.
            </p>
          </div>

          {/* Item 6: Investment Solutions */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 text-left">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-600 flex items-center justify-center font-bold">
              <TrendingUp className="w-4 h-4" />
            </div>
            <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
              6. Investment Solutions
            </h4>
            <p className="text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
              Senior Citizen Savings Scheme (SCSS) government-backed scheme with tax benefits + additional FD interest rate.
            </p>
          </div>

        </div>
      </section>

      {/* ── SECTION 4: SENIOR VS NON-SENIOR CHARGES COMPARISON TABLE ── */}
      <section className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 shadow-soft space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-[#2563EB] flex items-center justify-center font-bold">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                4. Senior vs Non-Senior Charges Comparison
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Direct fee comparison between Senior Citizen Savings Account and Standard Savings Account
              </p>
            </div>
          </div>
        </div>

        {/* Responsive Table / Mobile Cards */}
        <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-left text-xs border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 font-extrabold text-slate-800 dark:text-white">
                <th className="p-4 w-1/3">Fee Parameter / Service</th>
                <th className="p-4 w-1/3 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-x border-slate-200 dark:border-slate-800">
                  Senior Citizen Savings Account
                </th>
                <th className="p-4 w-1/3">
                  Non-Senior (Standard Savings)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300 font-medium">
              <tr>
                <td className="p-4 font-bold text-slate-900 dark:text-white">Monthly Average Balance (MAB)</td>
                <td className="p-4 bg-emerald-500/5 font-extrabold text-emerald-600 dark:text-emerald-400 border-x border-slate-200 dark:border-slate-800">₹15,000 MAB</td>
                <td className="p-4 font-bold">₹10,000 (Metro/Urban) / ₹5,000 (Semi-Urban)</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-slate-900 dark:text-white">Cash Transactions (Branch / CRM)</td>
                <td className="p-4 bg-emerald-500/5 font-extrabold text-emerald-600 dark:text-emerald-400 border-x border-slate-200 dark:border-slate-800">First 3 transactions of up to ₹1L each: Free</td>
                <td className="p-4">First 3 transactions or ₹1L/month free, thereafter ₹150/txn</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-slate-900 dark:text-white">Doorstep Banking Assistance</td>
                <td className="p-4 bg-emerald-500/5 font-extrabold text-emerald-600 dark:text-emerald-400 border-x border-slate-200 dark:border-slate-800">No additional cost (Complimentary)</td>
                <td className="p-4">Standard service charges apply</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-slate-900 dark:text-white">Non-Maintenance Penalty</td>
                <td className="p-4 bg-emerald-500/5 border-x border-slate-200 dark:border-slate-800">6% of MAB shortfall or max ₹500/month</td>
                <td className="p-4">6% of MAB shortfall or max ₹500/month</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-slate-900 dark:text-white">Passbook & E-Statements</td>
                <td className="p-4 bg-emerald-500/5 font-extrabold text-emerald-600 dark:text-emerald-400 border-x border-slate-200 dark:border-slate-800">Complimentary Physical Passbook & E-Statement</td>
                <td className="p-4">E-Statement free; Duplicate passbook ₹100</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-slate-900 dark:text-white">Helpline & Branch Priority</td>
                <td className="p-4 bg-emerald-500/5 font-extrabold text-emerald-600 dark:text-emerald-400 border-x border-slate-200 dark:border-slate-800">Priority desk + Dedicated 1800 1080 helpline</td>
                <td className="p-4">Standard Customer Support</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Footnote Required by Prompt */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400 font-semibold italic text-left">
          "Cash deposit/withdrawal charges apply post 3 transactions of up to ₹1L each. MAB of ₹15K must be maintained to avoid non-maintenance charges."
        </div>
      </section>

      {/* ── SECTION 5: SAVINGS ACCOUNT CHARGES EXPLORER (SEARCHABLE & FILTERABLE) ── */}
      <section className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 shadow-soft space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#2563EB]/10 text-[#2563EB] flex items-center justify-center font-bold">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                5. Savings Account Charges Explorer
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Searchable schedule of charges for ICICI Savings Accounts
              </p>
            </div>
          </div>

          <span className="text-[10.5px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20 text-center">
            Nil charges for Sr. Citizens except Non-Maintenance and Cash Transaction Charges
          </span>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={chargesSearchQuery}
              onChange={(e) => setChargesSearchQuery(e.target.value)}
              placeholder="Search charges (e.g. 'MAB', 'IMPS', 'ATM', 'DD', 'SMS')..."
              className="w-full pl-9 pr-8 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-white outline-none focus:border-[#2563EB]"
            />
            {chargesSearchQuery && (
              <button onClick={() => setChargesSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                ✕
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar w-full sm:w-auto">
            {uniqueChargeCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setChargesCategoryFilter(cat)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  chargesCategoryFilter === cat
                    ? 'bg-[#2563EB] text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-[#2563EB]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Filtered Table - CRITICAL HARD RULE: NEVER RENDER CURRENT ACCOUNT COLUMN */}
        <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-left text-xs border-collapse min-w-[650px]">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 font-extrabold text-slate-800 dark:text-white">
                <th className="p-3.5 w-1/4">Category</th>
                <th className="p-3.5 w-1/4">Service / Feature</th>
                <th className="p-3.5 w-1/3 bg-[#2563EB]/10 text-[#2563EB] dark:text-[#60A5FA]">
                  One Savings Account Charges
                </th>
                <th className="p-3.5 w-1/6">Senior Citizen Special Tier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300 font-medium">
              {filteredChargesList.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-400">
                    No charges found matching "{chargesSearchQuery}"
                  </td>
                </tr>
              ) : (
                filteredChargesList.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                    <td className="p-3.5 text-slate-500 dark:text-slate-400 font-semibold">{item.category}</td>
                    <td className="p-3.5 font-bold text-slate-900 dark:text-white">{item.feature}</td>
                    <td className="p-3.5 bg-[#2563EB]/5 font-semibold text-slate-800 dark:text-slate-100">{item.value}</td>
                    <td className="p-3.5 text-emerald-600 dark:text-emerald-400 font-bold">{item.seniorValue}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── SECTION 6: DEBIT CARD CONNECTION ── */}
      <section className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 shadow-soft space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center font-bold">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                6. Associated ICICI Debit Cards
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Official debit cards linked exclusively to ICICI Bank Savings Account tiers
              </p>
            </div>
          </div>
        </div>

        {/* Connected Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4 text-xs">
          {CONNECTED_ICICI_DEBIT_CARDS.map((card) => (
            <div
              key={card.id}
              className="p-5 rounded-2xl bg-[#F8FAFC] dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 flex flex-col justify-between text-left shadow-xs hover:border-[#2563EB] transition-colors"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[9.5px] font-extrabold uppercase tracking-wider text-[#2563EB] dark:text-[#60A5FA]">
                    {card.network}
                  </span>
                  <span className="text-[9.5px] font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded">
                    ★ {card.rating}
                  </span>
                </div>

                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white leading-tight">
                  {card.cardName}
                </h4>

                <div className="space-y-1 text-[11px] text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-200 dark:border-slate-800">
                  <p><strong>Annual Fee:</strong> {card.annualFee}</p>
                  <p><strong>ATM Limit:</strong> {card.atmLimit}</p>
                  <p><strong>POS Limit:</strong> {card.posLimit}</p>
                  <p><strong>Lounge Access:</strong> {card.loungeAccess}</p>
                  <p><strong>Cashback:</strong> {card.cashback}</p>
                </div>
              </div>

              {onSelectDebitCard && (
                <button
                  onClick={() => onSelectDebitCard(card)}
                  className="w-full mt-2 py-2 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs transition-colors cursor-pointer text-center block"
                >
                  View Card Specs →
                </button>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── SECTION 11: STATUTORY DISCLAIMER ── */}
      <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-200 text-xs text-left space-y-1">
        <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300">
          <Info className="w-4 h-4 shrink-0" />
          <span>Statutory Disclaimer</span>
        </div>
        <p className="leading-relaxed font-medium">
          "Illustrative only, based on internal training material. Confirm current T&Cs with ICICI Bank before making decisions. For internal reference only."
        </p>
      </div>

    </div>
  );
}

export default ICICIBSavingsDetailView;
