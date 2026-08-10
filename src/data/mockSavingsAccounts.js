import { debitCards } from "./mockData";

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
    associatedDebitCardName: "SBI Global International Debit Card",
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
    associatedDebitCardId: 9,
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
    associatedDebitCardId: 8,
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
    accountName: "IDFC FIRST FIRST Progress Savings Account",
    accountType: "Premium Savings",
    accountTypeBadges: ["High Interest", "Zero Charges", "Premium"],
    interestRate: "3.00% - 7.00% p.a.",
    interestRateValue: 7.0,
    minimumBalance: "₹10,000",
    minimumBalanceValue: 10000,
    isZeroBalance: false,
    isOnlineOpening: true,
    isStudent: false,
    isSalary: true,
    isSeniorCitizen: true,
    isWomenSpecial: true,
    isDigital: true,
    isPremium: true,
    isNRI: false,
    rating: 4.9,
    isPopular: true,
    officialSourceUrl: "https://www.idfcfirstbank.com/personal-banking/accounts/savings-account",
    lastVerified: "August 2026",
    description: "Industry-leading savings interest rate up to 7.00% p.a. with monthly interest payout, zero fee on 28 essential banking services, and Visa Signature debit card.",
    keyBenefits: [
      "Earn up to 7.00% p.a. interest with MONTHLY interest credit",
      "Zero fee on 28 common banking services (IMPS, ATM, Chequebook, SMS)",
      "Free Visa Signature / Wealth Debit Card with Airport Lounge access",
      "Personal Accident Insurance up to ₹35 Lakhs & Lost Card liability cover"
    ],
    associatedDebitCardId: 10,
    associatedDebitCardName: "IDFC FIRST Wealth Debit Card",
    interestSlabs: [
      "Balance up to ₹1 Lakh: 3.00% p.a.",
      "Balance > ₹1 Lakh to ₹10 Lakhs: 6.00% p.a.",
      "Balance > ₹10 Lakhs to ₹5 Crores: 7.00% p.a."
    ],
    ambAqbText: "Average Monthly Balance: ₹10,000 or ₹25,000 variant options",
    nonMaintenanceCharges: "Proportional fee capped at ₹400/month max",
    accountOpeningFeatures: [
      "100% Paperless Online Video KYC",
      "Instant Account Number & Virtual Debit Card",
      "Initial Deposit funding via UPI/Netbanking"
    ],
    eligibility: [
      "Resident Indian Individuals",
      "Single or Joint Account holders"
    ],
    documentsRequired: [
      "Aadhaar Card",
      "PAN Card"
    ],
    bankingFeatures: [
      "Monthly Interest Credit into Account",
      "Zero Fee on Unlimited ATM Withdrawals across any bank ATM",
      "Free IMPS, NEFT, RTGS & UPI transfers",
      "Free Doorstep Banking Services"
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
    associatedDebitCardId: 12,
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
    associatedDebitCardId: 13,
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
    associatedDebitCardId: 11,
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
    associatedDebitCardId: 14,
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
  }
];

export function getAssociatedDebitCard(cardId) {
  if (!cardId) return null;
  return debitCards.find(c => Number(c.id) === Number(cardId)) || null;
}
