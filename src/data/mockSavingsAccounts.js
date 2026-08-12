import { debitCards } from "./mockData.js";
import { canonicalBankName } from "../utils/bankDirectoryUtils.js";

export const savingsAccounts = [
  {
    id: 101,
    bankId: "hdfc-bank",
    bank: "HDFC Bank",
    logo: "HD",
    accountName: "HDFC SavingsMax Account",
    accountType: "Premium Savings",
    accountTypeBadges: ["Premium", "Salary", "High Rewards"],
    interestRate: "3.00% - 3.50% p.a.",
    interestRateValue: 3.5,
    minimumBalance: "₹25,000",
    minimumBalanceValue: 25000,
    isZeroBalance: false,
    isOnlineOpening: true,
    isStudent: false,
    isSalary: true,
    isSeniorCitizen: false,
    isWomenSpecial: false,
    isDigital: true,
    isPremium: true,
    isNRI: false,
    rating: 4.8,
    isPopular: true,
    officialSourceUrl: "https://www.hdfcbank.com/personal/save/accounts/savings-accounts/savingsmax-account",
    lastVerified: "August 2026",
    description: "A feature-packed premium savings account offering complimentary EasyShop Platinum Debit Card, lifetime free accidental insurance, and automatic sweep-in benefits.",
    keyBenefits: [
      "Lifetime Free HDFC EasyShop Platinum Debit Card (1% Cashback)",
      "Accidental Death Cover of ₹10 Lakhs & Air Cover of ₹30 Lakhs",
      "Free Unlimited ATM transactions at all HDFC Bank ATMs",
      "Auto-sweep facility to earn fixed deposit interest rates"
    ],
    associatedDebitCardId: 3,
    associatedDebitCardName: "EasyShop Platinum Debit Card",
    interestSlabs: [
      "Balance below ₹50 Lakhs: 3.00% p.a.",
      "Balance ₹50 Lakhs & above: 3.50% p.a."
    ],
    ambAqbText: "Average Monthly Balance (AMB): ₹25,000 across urban/metro branches",
    nonMaintenanceCharges: "₹600/quarter if AMB falls below threshold",
    accountOpeningFeatures: [
      "Instant Online Video KYC Account Opening",
      "Zero Paperwork & Digital Signature Verification",
      "Initial Deposit: ₹25,000",
      "Instant Access to NetBanking & HDFC Bank MobileBanking App"
    ],
    eligibility: [
      "Resident Indian Individual",
      "Age: 18 years and above",
      "Valid Aadhaar Number & PAN Card required"
    ],
    documentsRequired: [
      "Aadhaar Card (Mobile number linked for OTP)",
      "Original Physical PAN Card for Video KYC",
      "Passport size photograph & Signature sample"
    ],
    bankingFeatures: [
      "Free Unlimited NEFT, RTGS & IMPS Online Transfers",
      "Free 25 Cheque Leaves per year",
      "Complimentary BillPay & Auto-debit services",
      "Free E-Statements & Passbook facility",
      "Priority customer service desk at branches"
    ]
  },
  {
    id: 102,
    bankId: "icici-bank",
    bank: "ICICI Bank",
    logo: "IC",
    accountName: "ICICI MINE Savings Account",
    accountType: "Digital Savings",
    accountTypeBadges: ["Digital", "Youth", "Zero Balance"],
    interestRate: "3.00% - 3.50% p.a.",
    interestRateValue: 3.5,
    minimumBalance: "₹0",
    minimumBalanceValue: 0,
    isZeroBalance: true,
    isOnlineOpening: true,
    isStudent: true,
    isSalary: false,
    isSeniorCitizen: false,
    isWomenSpecial: false,
    isDigital: true,
    isPremium: false,
    isNRI: false,
    rating: 4.7,
    isPopular: true,
    officialSourceUrl: "https://www.icicibank.com/personal-banking/accounts/savings-account/mine-account",
    lastVerified: "August 2026",
    description: "India's first millennial-focused zero balance digital savings account with customizable debit cards, instant iMobile Pay setup, and online shopping cashbacks.",
    keyBenefits: [
      "100% Zero Minimum Balance Account for 18-35 age group",
      "Customizable iMobile Debit Card with instant cashback offers",
      "Instant account opening via Video KYC under 5 minutes",
      "Exclusive discounts on Myntra, Swiggy, Zomato & BookMyShow"
    ],
    associatedDebitCardId: 5,
    associatedDebitCardName: "Coral Debit Card",
    interestSlabs: [
      "Daily balance up to ₹50 Lakhs: 3.00% p.a.",
      "Daily balance above ₹50 Lakhs: 3.50% p.a."
    ],
    ambAqbText: "Zero Minimum Balance (No penalty charges)",
    nonMaintenanceCharges: "Nil (Zero Balance Account)",
    accountOpeningFeatures: [
      "Instant Video KYC via iMobile Pay App",
      "Zero initial funding mandatory",
      "Instant Virtual Debit Card generation",
      "Paperless onboarding using Aadhaar OTP"
    ],
    eligibility: [
      "Resident Indian Individuals aged between 18 to 35 years",
      "Valid PAN Card & Aadhaar linked with mobile number"
    ],
    documentsRequired: [
      "Aadhaar Card with active mobile number",
      "PAN Card for video verification"
    ],
    bankingFeatures: [
      "Instant UPI setup & Money Transfer via iMobile Pay",
      "Free E-Statements & Digital Passbook",
      "Sub-accounts for budgeting & goal savings",
      "24/7 AI Chatbot Assistance"
    ]
  },
  {
    id: 103,
    bankId: "sbi",
    bank: "State Bank of India",
    logo: "SB",
    accountName: "SBI Savings Plus Account",
    accountType: "Regular Savings",
    accountTypeBadges: ["Regular", "Auto-Sweep", "Government Bank"],
    interestRate: "2.70% p.a.",
    interestRateValue: 2.7,
    minimumBalance: "₹0",
    minimumBalanceValue: 0,
    isZeroBalance: true,
    isOnlineOpening: true,
    isStudent: true,
    isSalary: false,
    isSeniorCitizen: true,
    isWomenSpecial: false,
    isDigital: false,
    isPremium: false,
    isNRI: false,
    rating: 4.6,
    isPopular: true,
    officialSourceUrl: "https://sbi.co.in/web/personal-banking/accounts/savings-account/savings-plus-account",
    lastVerified: "August 2026",
    description: "Linked to MOD (Multi Option Deposit) scheme, automatically transferring surplus funds above ₹35,000 into high-yielding Term Deposits while retaining liquidity.",
    keyBenefits: [
      "Auto-sweep facility into MODD (Term Deposits) for higher returns",
      "Unmatched ATM network access across all Indian cities & rural hubs",
      "Zero minimum balance maintenance requirement",
      "Complimentary SBI Global / Platinum International Debit Card options"
    ],
    associatedDebitCardId: 1,
    debitCardIds: [1, 2],
    associatedDebitCardName: "SBI Global / Platinum Debit Cards",
    interestSlabs: [
      "Savings Balance: 2.70% p.a.",
      "MOD (Sweep FD) Portion: Up to 6.80% p.a."
    ],
    ambAqbText: "Zero AMB (No minimum balance maintenance requirement)",
    nonMaintenanceCharges: "Nil",
    accountOpeningFeatures: [
      "Online application via YONO SBI App",
      "Video KYC / Branch visit verification options",
      "Instant YONO App credentials"
    ],
    eligibility: [
      "All Resident Indian Individuals eligible",
      "Single or Joint Account operation"
    ],
    documentsRequired: [
      "Aadhaar Card",
      "PAN Card or Form 60",
      "Proof of Residence"
    ],
    bankingFeatures: [
      "Free YONO SBI Mobile App Access",
      "Free Internet Banking & Mobile Banking",
      "Chequebook & Passbook facility",
      "Auto-sweep & Reverse-sweep flexi liquidity"
    ]
  },
  {
    id: 104,
    bankId: "kotak-mahindra-bank",
    bank: "Kotak Mahindra Bank",
    logo: "KO",
    accountName: "Kotak 811 Full KYC Zero Balance Account",
    accountType: "Zero Balance",
    accountTypeBadges: ["Zero Balance", "Digital", "Virtual Card"],
    interestRate: "3.50% - 4.00% p.a.",
    interestRateValue: 4.0,
    minimumBalance: "₹0",
    minimumBalanceValue: 0,
    isZeroBalance: true,
    isOnlineOpening: true,
    isStudent: true,
    isSalary: false,
    isSeniorCitizen: false,
    isWomenSpecial: false,
    isDigital: true,
    isPremium: false,
    isNRI: false,
    rating: 4.8,
    isPopular: true,
    officialSourceUrl: "https://www.kotak.com/en/personal-banking/accounts/savings-account/811-savings-account.html",
    lastVerified: "August 2026",
    description: "India's premier digital zero balance account with instant Video KYC, free virtual debit card, and zero non-maintenance penalties for life.",
    keyBenefits: [
      "Lifetime Zero Minimum Balance Account",
      "Free Virtual Visa Debit Card inside Kotak 811 App",
      "Earn up to 4.00% p.a. interest rate on daily balances",
      "Instant Video KYC completion in under 3 minutes"
    ],
    associatedDebitCardId: 12,
    associatedDebitCardName: "Kotak 811 Debit Card",
    interestSlabs: [
      "Daily balance up to ₹1 Lakh: 3.50% p.a.",
      "Daily balance above ₹1 Lakh: 4.00% p.a."
    ],
    ambAqbText: "Zero AMB for life",
    nonMaintenanceCharges: "Nil",
    accountOpeningFeatures: [
      "100% Online Paperless Video KYC",
      "Instant Virtual Debit Card activation",
      "Zero initial deposit required"
    ],
    eligibility: [
      "Resident Indians aged 18 years and above",
      "Aadhaar & PAN mandatory"
    ],
    documentsRequired: [
      "Aadhaar Card",
      "Original Physical PAN Card"
    ],
    bankingFeatures: [
      "Free Instant Fund Transfers via Scan & Pay",
      "811 Virtual Card for online shopping",
      "KayMall in-app discounts on flights & shopping",
      "Digital passbook & e-statements"
    ]
  },
  {
    id: 105,
    bankId: "axis-bank",
    bank: "Axis Bank",
    logo: "AX",
    accountName: "Axis Liberty Savings Account",
    accountType: "Salary Account",
    accountTypeBadges: ["Salary", "Cashback", "Lifestyle"],
    interestRate: "3.00% - 3.50% p.a.",
    interestRateValue: 3.5,
    minimumBalance: "₹25,000",
    minimumBalanceValue: 25000,
    isZeroBalance: false,
    isOnlineOpening: true,
    isStudent: false,
    isSalary: true,
    isSeniorCitizen: false,
    isWomenSpecial: false,
    isDigital: false,
    isPremium: true,
    isNRI: false,
    rating: 4.7,
    isPopular: true,
    officialSourceUrl: "https://www.axisbank.com/retail/accounts/savings-account/liberty-savings-account",
    lastVerified: "August 2026",
    description: "Designed for young professionals, offering ₹750 monthly cashback vouchers on spending ₹10,000 quarterly, plus Axis Priority privileges.",
    keyBenefits: [
      "Flat 5% flat cashback on food, entertainment, and shopping",
      "₹750 quarterly gift voucher on maintaining ₹25,000 AMB or spending ₹10k/month",
      "Complimentary Axis Liberty Debit Card with lounge access",
      "Personal Accident Insurance Cover of ₹5 Lakhs"
    ],
    associatedDebitCardId: 7,
    associatedDebitCardName: "Priority Debit Card",
    interestSlabs: [
      "Daily balance up to ₹50 Lakhs: 3.00% p.a.",
      "Daily balance above ₹50 Lakhs: 3.50% p.a."
    ],
    ambAqbText: "Average Monthly Balance: ₹25,000 OR spend ₹25,000/month via debit card",
    nonMaintenanceCharges: "₹500/month if conditions are unmet",
    accountOpeningFeatures: [
      "Online Video KYC Account Opening",
      "Doorstep Document Verification option",
      "Instant Axis Mobile App Login"
    ],
    eligibility: [
      "Salaried & Self-Employed Resident Individuals",
      "Age: 18 to 55 years"
    ],
    documentsRequired: [
      "Aadhaar Card",
      "PAN Card",
      "Salary slip / Employment proof (if salary linked)"
    ],
    bankingFeatures: [
      "Axis EDGE REWARD Points on all transactions",
      "Free Unlimited NEFT & RTGS transactions",
      "Dedicated Relationship Manager for wealth portfolios",
      "Free Chequebook & Passbook"
    ]
  },
  {
    id: 106,
    bankId: "idfc-first-bank",
    bank: "IDFC FIRST Bank",
    logo: "ID",
    accountName: "₹25K AMB Savings",
    tier: "₹25K AMB Savings",
    accountType: "Regular Savings",
    accountTypeBadges: ["Zero Fee Banking", "Monthly Interest", "Regular"],
    interestRate: "Up to 7.00% p.a.",
    interestRateValue: 7.0,
    minimumBalance: "₹25,000",
    minimumBalanceValue: 25000,
    isZeroBalance: false,
    isOnlineOpening: true,
    isStudent: false,
    isSalary: true,
    isSeniorCitizen: false,
    isWomenSpecial: false,
    isDigital: true,
    isPremium: false,
    isNRI: false,
    rating: 2.0,
    isPopular: true,
    officialSourceUrl: "https://www.idfcfirstbank.com/personal-banking/accounts/savings-account",
    lastVerified: "August 2026",
    description: "IDFC FIRST Bank ₹25K AMB Savings Account offering zero fee banking on 28 essential services, monthly interest credit up to 7.00% p.a., and free unlimited ATM withdrawals.",
    maintenanceCriteriaText: "ANY ONE: AMB ₹25,000",
    maintenanceCriteria: { amb: 25000, salary: 0, aum: 0, orv: 0 },
    keyBenefits: [
      "Zero fee on 28 essential banking services (IMPS, ATM, Chequebook, SMS)",
      "Up to 7.00% p.a. interest rate with monthly interest credit",
      "Free Unlimited ATM withdrawals at any bank ATM in India",
      "Complimentary Personal Accident Cover of ₹35 Lakhs"
    ],
    sevenAmazingBenefits: [
      "Zero fee on 28 essential banking services (IMPS, ATM, Chequebook, Demand Drafts)",
      "Up to 7.00% p.a. interest rate with monthly interest credit",
      "Free Unlimited ATM withdrawals at any bank ATM in India",
      "Complimentary Personal Accident Insurance Cover of ₹35 Lakhs",
      "Free Air Accident Insurance Cover of ₹1 Crore",
      "Contactless RuPay / Visa Signature Debit Card with zero lost card liability",
      "Instant 100% paperless Video KYC online account opening"
    ],
    travelBenefits: "Standard debit card domestic access rules as applicable",
    valueAddedServices: "Free NetBanking, iMobile app, e-statements & 24/7 helpline",
    associatedDebitCardId: 52,
    associatedDebitCardName: "IDFC FIRST Classic Debit Card",
    associatedCreditCard: null,
    interestSlabs: [
      "Balance up to ₹1 Lakh: 3.00% p.a.",
      "Balance > ₹1 Lakh to ₹10 Lakhs: 6.00% p.a.",
      "Balance > ₹10 Lakhs to ₹5 Crores: 7.00% p.a."
    ],
    ambAqbText: "Average Monthly Balance (AMB): ₹25,000",
    nonMaintenanceCharges: "Proportional fee capped at ₹400/month max",
    accountOpeningFeatures: [
      "100% Paperless Online Video KYC",
      "Instant Account Number & Virtual Debit Card",
      "Initial Deposit funding via UPI/Netbanking"
    ],
    eligibility: [
      "Resident Indian Individual",
      "ANY ONE: AMB ₹25,000"
    ],
    documentsRequired: ["Aadhaar Card", "PAN Card"],
    bankingFeatures: [
      "Monthly Interest Credit into Account",
      "Zero Fee on Unlimited ATM Withdrawals across any bank ATM",
      "Free IMPS, NEFT, RTGS & UPI transfers",
      "Free Doorstep Banking Services"
    ]
  },
  {
    id: 1061,
    bankId: "idfc-first-bank",
    bank: "IDFC FIRST Bank",
    logo: "ID",
    accountName: "FIRST Select",
    tier: "FIRST Select",
    accountType: "Premium Savings",
    accountTypeBadges: ["Select Tier", "Lounge Access", "Priority Support"],
    interestRate: "Up to 7.00% p.a.",
    interestRateValue: 7.0,
    minimumBalance: "₹1,00,000",
    minimumBalanceValue: 100000,
    isZeroBalance: false,
    isOnlineOpening: true,
    isStudent: false,
    isSalary: true,
    isSeniorCitizen: false,
    isWomenSpecial: false,
    isDigital: true,
    isPremium: true,
    isNRI: false,
    rating: 3.0,
    isPopular: true,
    officialSourceUrl: "https://www.idfcfirstbank.com/personal-banking/accounts/savings-account",
    lastVerified: "August 2026",
    description: "IDFC FIRST Bank FIRST Select Privilege Savings Account with priority banking desk, complimentary airport lounge access, and lifetime-free FIRST Select Credit Card.",
    maintenanceCriteriaText: "ANY ONE: AMB ₹1L | Net Monthly Salary ₹1L | AUM ₹5L | ORV ₹10L",
    maintenanceCriteria: { amb: 100000, salary: 100000, aum: 500000, orv: 1000000 },
    keyBenefits: [
      "4 Complimentary Domestic Airport Lounge visits per quarter",
      "Lifetime-Free FIRST Select Credit Card with 3X/6X Rewards",
      "Priority Desk Customer Support & Personal Banker",
      "Zero fee on 28 essential banking transactions"
    ],
    travelBenefits: "4 Complimentary Domestic Airport Lounge access passes per quarter; Discounted 1.99% Forex Markup",
    valueAddedServices: "Priority Desk Customer Support, Family Account Bundling up to 4 members",
    associatedDebitCardId: 53,
    associatedDebitCardName: "IDFC FIRST Select Debit Card",
    associatedCreditCard: {
      cardName: "FIRST Select Credit Card",
      lifetimeFee: "Lifetime Free",
      incomeReq: "Net Monthly Salary ₹1,00,000+ or FIRST Select Account",
      keyBenefits: [
        "3X Rewards on offline & 6X Rewards on online spend",
        "4 Complimentary Domestic Airport Lounge visits per quarter",
        "Buy 1 Get 1 Free Movie ticket offer via Paytm Movies"
      ]
    },
    interestSlabs: [
      "Balance up to ₹1 Lakh: 3.00% p.a.",
      "Balance > ₹1 Lakh to ₹10 Lakhs: 6.00% p.a.",
      "Balance > ₹10 Lakhs to ₹5 Crores: 7.00% p.a."
    ],
    ambAqbText: "Average Monthly Balance (AMB): ₹1,00,000 or Net Salary ₹1,00,000/mo",
    nonMaintenanceCharges: "Information not available",
    accountOpeningFeatures: [
      "100% Paperless Online Video KYC",
      "Instant Account Number & Virtual Debit Card",
      "Priority Doorstep Banking Setup"
    ],
    eligibility: [
      "Resident Indian Individual",
      "ANY ONE: AMB ₹1L | Net Monthly Salary ₹1L | AUM ₹5L | ORV ₹10L"
    ],
    documentsRequired: ["Aadhaar Card", "PAN Card", "Salary proof (if salary linked)"],
    bankingFeatures: [
      "Priority Desk Relationship Support",
      "Free Unlimited ATM Withdrawals in India",
      "Free IMPS, NEFT, RTGS & UPI transfers"
    ]
  },
  {
    id: 1062,
    bankId: "idfc-first-bank",
    bank: "IDFC FIRST Bank",
    logo: "ID",
    accountName: "FIRST Wealth",
    tier: "FIRST Wealth",
    accountType: "Wealth Savings",
    accountTypeBadges: ["Wealth Tier", "Int Lounge", "RM Managed"],
    interestRate: "Up to 7.00% p.a.",
    interestRateValue: 7.0,
    minimumBalance: "₹10,00,000",
    minimumBalanceValue: 1000000,
    isZeroBalance: false,
    isOnlineOpening: true,
    isStudent: false,
    isSalary: true,
    isSeniorCitizen: false,
    isWomenSpecial: false,
    isDigital: true,
    isPremium: true,
    isNRI: false,
    rating: 4.0,
    isPopular: true,
    officialSourceUrl: "https://www.idfcfirstbank.com/personal-banking/accounts/savings-account",
    lastVerified: "August 2026",
    description: "IDFC FIRST Bank FIRST Wealth Account delivering dedicated Wealth Relationship Management, international lounge access, low 1.5% forex markup, and FIRST Wealth Credit Card.",
    maintenanceCriteriaText: "ANY ONE: AMB ₹10L | Net Monthly Salary ₹3L | AUM ₹30L | ORV ₹50L",
    maintenanceCriteria: { amb: 1000000, salary: 300000, aum: 3000000, orv: 5000000 },
    keyBenefits: [
      "Dedicated Wealth Relationship Manager & Wealth Management Services",
      "4 Domestic + 4 International Airport Lounge access passes per quarter",
      "Low 1.5% Forex Markup fee on debit and credit card spends",
      "Lifetime-Free FIRST Wealth Credit Card with 10X Rewards & Golf Privileges"
    ],
    travelBenefits: "4 Domestic + 4 International Airport Lounge access passes per quarter; Low 1.5% Forex Markup",
    valueAddedServices: "Dedicated Wealth RM, Free Golf Coaching (2 rounds/mo), 24/7 Concierge",
    associatedDebitCardId: 54,
    associatedDebitCardName: "IDFC FIRST World Debit Card",
    associatedCreditCard: {
      cardName: "FIRST Wealth Credit Card",
      lifetimeFee: "Lifetime Free",
      incomeReq: "Net Monthly Salary ₹3,00,000+ or FIRST Wealth Account",
      keyBenefits: [
        "10X Rewards on spend above threshold & birthday spends",
        "4 Domestic + 4 International Lounge visits per quarter",
        "Low 1.5% Foreign Exchange Markup fee",
        "Complimentary Spa access & Golf privileges"
      ]
    },
    interestSlabs: [
      "Balance up to ₹1 Lakh: 3.00% p.a.",
      "Balance > ₹1 Lakh to ₹10 Lakhs: 6.00% p.a.",
      "Balance > ₹10 Lakhs to ₹5 Crores: 7.00% p.a."
    ],
    ambAqbText: "Average Monthly Balance (AMB): ₹10,00,000 or Net Salary ₹3,00,000/mo",
    nonMaintenanceCharges: "Information not available",
    accountOpeningFeatures: [
      "Dedicated Wealth RM Onboarding",
      "Paperless Digital Video KYC",
      "Instant Portfolio Integration"
    ],
    eligibility: [
      "Resident Indian Individual",
      "ANY ONE: AMB ₹10L | Net Monthly Salary ₹3L | AUM ₹30L | ORV ₹50L"
    ],
    documentsRequired: ["Aadhaar Card", "PAN Card", "Wealth Statement / Income Proof"],
    bankingFeatures: [
      "Dedicated Wealth Relationship Manager",
      "Free Unlimited International & Domestic Lounge Access",
      "Low Forex Markup rates"
    ]
  },
  {
    id: 1063,
    bankId: "idfc-first-bank",
    bank: "IDFC FIRST Bank",
    logo: "ID",
    accountName: "FIRST Private",
    tier: "FIRST Private",
    accountType: "Private Banking",
    accountTypeBadges: ["Private Banking", "Zero Forex", "Bespoke Suite"],
    interestRate: "Up to 7.00% p.a.",
    interestRateValue: 7.0,
    minimumBalance: "₹1,00,00,000",
    minimumBalanceValue: 10000000,
    isZeroBalance: false,
    isOnlineOpening: true,
    isStudent: false,
    isSalary: true,
    isSeniorCitizen: false,
    isWomenSpecial: false,
    isDigital: true,
    isPremium: true,
    isNRI: false,
    rating: 5.0,
    isPopular: true,
    officialSourceUrl: "https://www.idfcfirstbank.com/personal-banking/accounts/savings-account",
    lastVerified: "August 2026",
    description: "IDFC FIRST Bank's ultra-premium private banking experience featuring bespoke global concierge, zero forex markup, unlimited lounge access globally, and invitation-only privileges.",
    maintenanceCriteriaText: "ANY ONE: AMB ₹1Cr | Net Monthly Salary ₹10L | AUM ₹2Cr | ORV ₹5Cr",
    maintenanceCriteria: { amb: 10000000, salary: 1000000, aum: 20000000, orv: 50000000 },
    keyBenefits: [
      "0.00% Zero Foreign Exchange Markup fee worldwide",
      "Unlimited Complimentary Airport Lounge Access globally",
      "Bespoke Senior Private Banker & 24/7 Global Concierge Desk",
      "Lifetime-Free FIRST Private Credit Card with Taj Epicure Membership"
    ],
    travelBenefits: "Unlimited Complimentary Airport Lounge Access Globally; 0.00% Zero Forex Markup",
    valueAddedServices: "Senior Private Banker, 24/7 Global Concierge, Taj Epicure Membership, Art & Estate Advisory",
    associatedDebitCardId: 54,
    associatedDebitCardName: "IDFC FIRST World Debit Card",
    associatedCreditCard: {
      cardName: "FIRST Private Credit Card",
      lifetimeFee: "Lifetime Free",
      incomeReq: "By invitation or FIRST Private Banking Relationship",
      keyBenefits: [
        "Bespoke 24/7 Global Concierge Desk & Art Advisory",
        "Unlimited Complimentary Airport Lounge Access globally",
        "0.00% Zero Foreign Exchange Markup fee on international spends",
        "Taj Epicure membership & bespoke lifestyle privileges"
      ]
    },
    interestSlabs: [
      "Balance up to ₹1 Lakh: 3.00% p.a.",
      "Balance > ₹1 Lakh to ₹10 Lakhs: 6.00% p.a.",
      "Balance > ₹10 Lakhs to ₹5 Crores: 7.00% p.a."
    ],
    ambAqbText: "Average Monthly Balance (AMB): ₹1,00,00,000 or Net Salary ₹10,00,000/mo",
    nonMaintenanceCharges: "Information not available",
    accountOpeningFeatures: [
      "Private Banker Doorstep Concierge Onboarding",
      "Instant Bespoke Digital Setup",
      "Dedicated Private Banking Desk"
    ],
    eligibility: [
      "Resident Indian Individual",
      "ANY ONE: AMB ₹1Cr | Net Monthly Salary ₹10L | AUM ₹2Cr | ORV ₹5Cr"
    ],
    documentsRequired: ["Aadhaar Card", "PAN Card", "Private Banking KYC & Income Proof"],
    bankingFeatures: [
      "Senior Private Banker & Desk",
      "Zero Forex Markup on transactions",
      "Unlimited Global Lounge Access"
    ]
  },
  {
    id: 107,
    bankId: "au-small-finance-bank",
    bank: "AU Small Finance Bank",
    logo: "AU",
    accountName: "AU Digital Savings Account",
    accountType: "Digital Savings",
    accountTypeBadges: ["High Interest", "Monthly Credit", "Digital"],
    interestRate: "3.50% - 7.25% p.a.",
    interestRateValue: 7.25,
    minimumBalance: "₹0",
    minimumBalanceValue: 0,
    isZeroBalance: true,
    isOnlineOpening: true,
    isStudent: true,
    isSalary: false,
    isSeniorCitizen: true,
    isWomenSpecial: true,
    isDigital: true,
    isPremium: false,
    isNRI: false,
    rating: 4.8,
    isPopular: true,
    officialSourceUrl: "https://www.aubank.in/personal-banking/savings-account/au-digital-savings-account",
    lastVerified: "August 2026",
    description: "High interest rate savings account offering up to 7.25% p.a. with monthly payouts, zero balance option for digital onboarding, and AU Royale Visa debit card privileges.",
    keyBenefits: [
      "Highest interest rates up to 7.25% p.a. credited monthly",
      "100% Video KYC digital account opening",
      "Complimentary AU Royale RuPay Platinum Debit Card",
      "Discounts on dining, OTT subscriptions, and online shopping"
    ],
    associatedDebitCardId: null,
    associatedDebitCardName: "AU Royale Debit Card",
    interestSlabs: [
      "Balance up to ₹1 Lakh: 3.50% p.a.",
      "Balance > ₹1 Lakh to ₹10 Lakhs: 6.00% p.a.",
      "Balance > ₹10 Lakhs to ₹25 Lakhs: 7.25% p.a."
    ],
    ambAqbText: "Zero AMB for AU Digital Savings Variant",
    nonMaintenanceCharges: "Nil",
    accountOpeningFeatures: [
      "Video KYC onboarding in 5 minutes",
      "Zero initial deposit option",
      "Instant AU 0101 SuperApp access"
    ],
    eligibility: [
      "Resident Indians aged 18 and above",
      "Aadhaar linked with active mobile number"
    ],
    documentsRequired: [
      "PAN Card",
      "Aadhaar Card"
    ],
    bankingFeatures: [
      "Monthly Interest Credit",
      "AU 0101 SuperApp for investments & fixed deposits",
      "Free 24/7 IMPS & UPI transfers",
      "Doorstep cash collection & cheque pick-up"
    ]
  },
  {
    id: 108,
    bankId: "bank-of-baroda",
    bank: "Bank of Baroda",
    logo: "BO",
    accountName: "bob Advantage Savings Account",
    accountType: "Regular Savings",
    accountTypeBadges: ["Government Bank", "Low Fees", "Public Sector"],
    interestRate: "2.75% - 3.20% p.a.",
    interestRateValue: 3.2,
    minimumBalance: "₹2,000",
    minimumBalanceValue: 2000,
    isZeroBalance: false,
    isOnlineOpening: true,
    isStudent: true,
    isSalary: false,
    isSeniorCitizen: true,
    isWomenSpecial: false,
    isDigital: true,
    isPremium: false,
    isNRI: false,
    rating: 4.5,
    isPopular: false,
    officialSourceUrl: "https://www.bankofbaroda.in/personal-banking/accounts/savings-accounts/bob-advantage-savings-account",
    lastVerified: "August 2026",
    description: "Reliable public sector savings account with low minimum balance requirement (₹2,000 in metro), free bob World digital banking app, and RuPay Platinum Debit Card.",
    keyBenefits: [
      "Low minimum balance requirement (₹1,000 semi-urban / ₹2,000 metro)",
      "Free bob World Mobile Banking App with 220+ services",
      "Complimentary bob World RuPay Platinum Debit Card",
      "Free Credit Card against fixed deposits"
    ],
    associatedDebitCardId: null,
    associatedDebitCardName: "BOB World Platinum Debit Card",
    interestSlabs: [
      "Balance up to ₹10 Lakhs: 2.75% p.a.",
      "Balance above ₹10 Lakhs: 3.20% p.a."
    ],
    ambAqbText: "Average Quarterly Balance: ₹2,000 (Metro/Urban), ₹1,000 (Semi-Urban)",
    nonMaintenanceCharges: "₹150/quarter if AQB is not maintained",
    accountOpeningFeatures: [
      "Online Video KYC via bob World App",
      "Branch onboarding across 8,000+ branches"
    ],
    eligibility: [
      "Resident Individuals (Single or Joint)",
      "Minors above 10 years eligible under guardian"
    ],
    documentsRequired: [
      "Aadhaar Card",
      "PAN Card",
      "2 Passport photos"
    ],
    bankingFeatures: [
      "Free bob World Digital Passbook",
      "NEFT/RTGS/IMPS via Internet & Mobile Banking",
      "Chequebook facility (30 leaves free/year)",
      "Locker fee concession for senior citizens"
    ]
  },
  {
    id: 109,
    bankId: "indusind-bank",
    bank: "IndusInd Bank",
    logo: "IN",
    accountName: "IndusInd Privilege Savings Account",
    accountType: "Premium Savings",
    accountTypeBadges: ["Custom Account Number", "High Cashback", "Premium"],
    interestRate: "3.50% - 6.75% p.a.",
    interestRateValue: 6.75,
    minimumBalance: "₹10,000",
    minimumBalanceValue: 10000,
    isZeroBalance: false,
    isOnlineOpening: true,
    isStudent: false,
    isSalary: true,
    isSeniorCitizen: true,
    isWomenSpecial: false,
    isDigital: true,
    isPremium: true,
    isNRI: false,
    rating: 4.7,
    isPopular: false,
    officialSourceUrl: "https://www.indusind.com/in/en/personal/accounts/savings-account/indus-privilege.html",
    lastVerified: "August 2026",
    description: "Allows choosing your own Account Number (My Account My Number), complimentary IndusInd Signature Debit Card with BOGO movie deals, and up to 6.75% p.a. interest.",
    keyBenefits: [
      "Choose your own Account Number (Mobile number / Birthday / Lucky digit)",
      "Buy 1 Get 1 Free movie tickets on BookMyShow via Signature Debit Card",
      "High interest rate up to 6.75% p.a.",
      "50% discount on small & medium lockers for 1st year"
    ],
    associatedDebitCardId: null,
    associatedDebitCardName: "IndusInd Signature Debit Card",
    interestSlabs: [
      "Balance up to ₹1 Lakh: 3.50% p.a.",
      "Balance > ₹1 Lakh to ₹5 Lakhs: 5.00% p.a.",
      "Balance > ₹5 Lakhs: 6.75% p.a."
    ],
    ambAqbText: "Average Monthly Balance: ₹10,000",
    nonMaintenanceCharges: "₹350/quarter max",
    accountOpeningFeatures: [
      "Instant Video KYC with account number customization",
      "Digital initial funding via Netbanking/UPI"
    ],
    eligibility: [
      "Resident Indian Individuals (Age 18+)",
      "Salaried / Self-employed professionals"
    ],
    documentsRequired: [
      "Aadhaar Card",
      "PAN Card"
    ],
    bankingFeatures: [
      "Free Unlimited ATM Withdrawals across any bank ATM in India",
      "Free Doorstep Banking (Cash & Cheque pickup)",
      "Free IMPS/NEFT/RTGS transfers",
      "IndusMobile App with biometric login"
    ]
  },
  {
    id: 110,
    bankId: "fi-money",
    bank: "Fi Money (Federal Bank)",
    logo: "FI",
    accountName: "Fi Money Smart Digital Savings Account",
    accountType: "Zero Balance",
    accountTypeBadges: ["Zero Balance", "Neobank", "Zero Forex"],
    interestRate: "3.00% - 5.50% p.a.",
    interestRateValue: 5.5,
    minimumBalance: "₹0",
    minimumBalanceValue: 0,
    isZeroBalance: true,
    isOnlineOpening: true,
    isStudent: true,
    isSalary: true,
    isSeniorCitizen: false,
    isWomenSpecial: false,
    isDigital: true,
    isPremium: false,
    isNRI: false,
    rating: 4.9,
    isPopular: true,
    officialSourceUrl: "https://fi.money/features/savings-account",
    lastVerified: "August 2026",
    description: "Neobanking digital savings account partnered with Federal Bank, featuring zero minimum balance, automated Smart Deposit rules, and Zero Forex Debit Card.",
    keyBenefits: [
      "100% Zero Minimum Balance Account powered by Federal Bank",
      "Zero Forex Markup Debit Card for international spends & online trials",
      "Smart Jar automated savings rules (e.g. Save ₹50 every time India wins)",
      "Free Instant Fund Transfers with zero hidden charges"
    ],
    associatedDebitCardId: null,
    associatedDebitCardName: "Fi Money Digital Debit Card",
    interestSlabs: [
      "Savings account balance: 3.00% p.a.",
      "Smart Jars / Connected FDs: Up to 7.20% p.a."
    ],
    ambAqbText: "Zero Minimum Balance required",
    nonMaintenanceCharges: "Nil",
    accountOpeningFeatures: [
      "Under 3-minute Video KYC onboarding via Fi App",
      "Instant Virtual Visa Platinum Card",
      "Zero paper documentation"
    ],
    eligibility: [
      "Salaried Working Professionals & College Students (Age 18+)",
      "Aadhaar & PAN required"
    ],
    documentsRequired: [
      "Aadhaar Card",
      "PAN Card"
    ],
    bankingFeatures: [
      "Fi Assistant AI expense analyzer",
      "Free Unlimited NEFT/IMPS/UPI",
      "Zero Maintenance Charge for life",
      "Free Physical Visa Debit Card dispatched to home"
    ]
  },
  {
    id: 111,
    bankId: "icici-bank",
    bank: "ICICI Bank",
    logo: "IC",
    accountName: "ICICI Advantage Woman Savings Account",
    accountType: "Women's",
    accountTypeBadges: ["Women's", "Cashback", "Shopping"],
    interestRate: "3.00% - 3.50% p.a.",
    interestRateValue: 3.5,
    minimumBalance: "₹10,000",
    minimumBalanceValue: 10000,
    isZeroBalance: false,
    isOnlineOpening: true,
    isStudent: false,
    isSalary: false,
    isSeniorCitizen: false,
    isWomenSpecial: true,
    isDigital: true,
    isPremium: true,
    isNRI: false,
    rating: 4.8,
    isPopular: true,
    officialSourceUrl: "https://www.icicibank.com/personal-banking/accounts/savings-account/women-savings-account",
    lastVerified: "August 2026",
    description: "Specially tailored for modern women, featuring Smart Shopper Silver Debit Card with high cashback rates, free cancer insurance cover, and child education benefits.",
    keyBenefits: [
      "Cashback up to ₹750/month on shopping, dining & grocery spends",
      "Complimentary Breast Cancer Insurance Cover up to ₹2 Lakhs",
      "Discounts on skill development courses & wellness subscriptions",
      "Special home & car loan interest concessions for women applicants"
    ],
    associatedDebitCardId: 5,
    associatedDebitCardName: "ICICI Coral PayWave Debit Card",
    interestSlabs: [
      "Daily balance up to ₹50 Lakhs: 3.00% p.a.",
      "Daily balance above ₹50 Lakhs: 3.50% p.a."
    ],
    ambAqbText: "Average Monthly Balance: ₹10,000 (Metro/Urban branches)",
    nonMaintenanceCharges: "₹500/quarter if AMB falls below threshold",
    accountOpeningFeatures: [
      "Instant Video KYC online onboarding",
      "Zero paperwork doorstep assistant",
      "Instant iMobile Pay app activation"
    ],
    eligibility: [
      "Resident Indian Women aged 18 years and above",
      "Single or Primary Joint Account Holder"
    ],
    documentsRequired: [
      "Aadhaar Card",
      "PAN Card",
      "Proof of Identity & Address"
    ],
    bankingFeatures: [
      "Free Unlimited NEFT & RTGS Online Transfers",
      "Complimentary iMobile Pay App access",
      "Free Chequebook (50 leaves/year)",
      "Priority customer care desk at branches"
    ]
  },
  {
    id: 112,
    bankId: "sbi",
    bank: "State Bank of India",
    logo: "SB",
    accountName: "SBI Pehla Kadam Minor Savings Account",
    accountType: "Minor",
    accountTypeBadges: ["Minor", "Kids", "Financial Literacy"],
    interestRate: "2.70% p.a.",
    interestRateValue: 2.7,
    minimumBalance: "₹0",
    minimumBalanceValue: 0,
    isZeroBalance: true,
    isOnlineOpening: true,
    isStudent: true,
    isSalary: false,
    isSeniorCitizen: false,
    isWomenSpecial: false,
    isDigital: true,
    isPremium: false,
    isNRI: false,
    rating: 4.6,
    isPopular: false,
    officialSourceUrl: "https://sbi.co.in/web/personal-banking/accounts/savings-account/pehla-kadam-pehli-udaan",
    lastVerified: "August 2026",
    description: "Empowering children below 18 years with financial literacy, zero minimum balance requirement, photo-printed contact-less debit card, and capped daily transaction limits.",
    keyBenefits: [
      "Photo-printed SBI Pehla Kadam Debit Card for children",
      "Zero Minimum Balance maintenance requirement",
      "Capped per-day ATM withdrawal (₹5,000) & POS spending (₹5,000)",
      "Automated Monthly Recurring Deposit auto-debit options"
    ],
    associatedDebitCardId: 1,
    associatedDebitCardName: "SBI Global International Debit Card",
    interestSlabs: [
      "Daily balance up to ₹10 Crores: 2.70% p.a."
    ],
    ambAqbText: "Zero Minimum Balance (No penalty for non-maintenance)",
    nonMaintenanceCharges: "Nil",
    accountOpeningFeatures: [
      "Joint opening with parent/guardian via SBI Branch or YONO",
      "Simple birth certificate & guardian Aadhaar verification"
    ],
    eligibility: [
      "Minors under 18 years of age (Jointly with Parent/Guardian for under 10 years)"
    ],
    documentsRequired: [
      "Minor's Birth Certificate & Aadhaar",
      "Guardian's PAN Card & Aadhaar"
    ],
    bankingFeatures: [
      "Restricted YONO Mobile Banking view access",
      "Personalized Chequebook with 10 free leaves",
      "Auto-sweep into e-TDR/e-STDR deposits"
    ]
  },
  {
    id: 113,
    bankId: "hdfc-bank",
    bank: "HDFC Bank",
    logo: "HD",
    accountName: "HDFC NRE Premium Savings Account",
    accountType: "NRI",
    accountTypeBadges: ["NRI", "Tax Free Interest", "Zero Forex"],
    interestRate: "3.00% - 3.50% p.a.",
    interestRateValue: 3.5,
    minimumBalance: "₹10,000",
    minimumBalanceValue: 10000,
    isZeroBalance: false,
    isOnlineOpening: true,
    isStudent: false,
    isSalary: false,
    isSeniorCitizen: false,
    isWomenSpecial: false,
    isDigital: true,
    isPremium: true,
    isNRI: true,
    rating: 4.9,
    isPopular: true,
    officialSourceUrl: "https://www.hdfcbank.com/nri-banking/save/nre-savings-account",
    lastVerified: "August 2026",
    description: "Dedicated account for Non-Resident Indians allowing full repatriation of funds, tax-free interest earned in India, and international HDFC Platinum Debit Card privileges.",
    keyBenefits: [
      "100% Tax-Free Interest earned in India under Income Tax Act",
      "Full and freely repatriable principal & interest funds back overseas",
      "Complimentary HDFC Global NRE Platinum Debit Card",
      "Free 24/7 dedicated International NRI Relationship Desk"
    ],
    associatedDebitCardId: 3,
    associatedDebitCardName: "EasyShop Platinum Debit Card",
    interestSlabs: [
      "Daily balance below ₹50 Lakhs: 3.00% p.a.",
      "Daily balance ₹50 Lakhs & above: 3.50% p.a."
    ],
    ambAqbText: "Average Monthly Balance: ₹10,000 in NRE Savings or ₹5 Lakhs overall Relationship",
    nonMaintenanceCharges: "₹750/quarter if AMB is not maintained",
    accountOpeningFeatures: [
      "100% Paperless Remote Online Account Opening for NRIs",
      "Attestation via Indian Embassy / Overseas Notary or Video KYC"
    ],
    eligibility: [
      "Non-Resident Indians (NRIs) & Persons of Indian Origin (PIOs)"
    ],
    documentsRequired: [
      "Valid Indian Passport & Overseas Work/Residence Visa",
      "Overseas Proof of Address & PAN Card or Form 60"
    ],
    bankingFeatures: [
      "Free Money2India Overseas Remittance Service",
      "Preferential Forex Exchange Rates on INR Conversion",
      "International ATM withdrawals & worldwide concierge"
    ]
  },
  {
    id: 114,
    bankId: "axis-bank",
    bank: "Axis Bank",
    logo: "AX",
    accountName: "Axis Basic Small Savings Account (BSBD)",
    accountType: "Basic Savings",
    accountTypeBadges: ["Basic Savings", "Zero Balance", "Govt Compliant"],
    interestRate: "3.00% p.a.",
    interestRateValue: 3.0,
    minimumBalance: "₹0",
    minimumBalanceValue: 0,
    isZeroBalance: true,
    isOnlineOpening: true,
    isStudent: true,
    isSalary: false,
    isSeniorCitizen: true,
    isWomenSpecial: false,
    isDigital: false,
    isPremium: false,
    isNRI: false,
    rating: 4.5,
    isPopular: false,
    officialSourceUrl: "https://www.axisbank.com/retail/accounts/savings-account/basic-savings-account",
    lastVerified: "August 2026",
    description: "RBI-mandated Basic Savings Bank Deposit (BSBD) account with zero minimum balance requirement, free RuPay debit card, and zero annual charges.",
    keyBenefits: [
      "100% Zero Minimum Balance requirement (BSBDA Guidelines)",
      "Complimentary Basic RuPay Debit Card with Zero Joining or Annual Fee",
      "4 Free ATM Withdrawals per month across any bank ATM",
      "Deposit of cash & cheques at branch with zero charges"
    ],
    associatedDebitCardId: 7,
    associatedDebitCardName: "Priority Debit Card",
    interestSlabs: [
      "Daily balance up to ₹50 Lakhs: 3.00% p.a."
    ],
    ambAqbText: "Zero AMB (No minimum balance maintenance requirement)",
    nonMaintenanceCharges: "Nil (Protected under RBI BSBD Norms)",
    accountOpeningFeatures: [
      "Simple e-KYC Branch or Online onboarding",
      "Aadhaar OTP instant verification"
    ],
    eligibility: [
      "All Resident Indian Individuals who do not hold another BSBD account in Axis Bank"
    ],
    documentsRequired: [
      "Aadhaar Card",
      "PAN Card or Form 60"
    ],
    bankingFeatures: [
      "Free E-Statements & Passbook update",
      "Free Direct Benefit Transfer (DBT) government subsidy credits",
      "Access to Mobile Banking & UPI"
    ]
  }
];

export function getAssociatedDebitCards(accountOrId) {
  if (!accountOrId) return [];

  let account = null;
  if (typeof accountOrId === 'object') {
    account = accountOrId;
  } else {
    account = savingsAccounts.find(s => Number(s.id) === Number(accountOrId));
    if (!account) {
      account = savingsAccounts.find(s => Number(s.associatedDebitCardId) === Number(accountOrId) || (Array.isArray(s.debitCardIds) && s.debitCardIds.includes(Number(accountOrId))));
    }
  }

  if (!account) return [];

  const accountBankCanonical = canonicalBankName(account.bank || "").toLowerCase();
  let candidateCards = [];

  if (Array.isArray(account.debitCardIds) && account.debitCardIds.length > 0) {
    candidateCards = account.debitCardIds
      .map(id => debitCards.find(c => Number(c.id) === Number(id)))
      .filter(Boolean);
  } else if (account.debitCardId || account.associatedDebitCardId) {
    const singleId = account.debitCardId || account.associatedDebitCardId;
    const found = debitCards.find(c => Number(c.id) === Number(singleId));
    if (found) candidateCards = [found];
  } else if (account.associatedDebitCardName) {
    const found = debitCards.find(c => 
      c.cardName && c.cardName.toLowerCase() === account.associatedDebitCardName.toLowerCase()
    );
    if (found) candidateCards = [found];
  }

  // STRICT BANK-SAFE RELATIONSHIP RULE:
  // A linked debit card may ONLY be returned if card.bank === account.bank (canonical check)
  const bankSafeCards = candidateCards.filter(card => {
    if (!card || !card.bank || !account.bank) return false;
    const cardBankCanonical = canonicalBankName(card.bank).toLowerCase();
    return accountBankCanonical && cardBankCanonical && (
      accountBankCanonical === cardBankCanonical ||
      accountBankCanonical.includes(cardBankCanonical) ||
      cardBankCanonical.includes(accountBankCanonical)
    );
  });

  return bankSafeCards;
}

export function getAssociatedDebitCard(accountOrId) {
  const cards = getAssociatedDebitCards(accountOrId);
  return cards.length > 0 ? cards[0] : null;
}

