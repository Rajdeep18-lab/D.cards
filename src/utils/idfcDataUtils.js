/**
 * IDFC FIRST Bank Savings & Privilege Tier Data Utilities
 * Official source-backed dataset & eligibility calculator logic.
 */

export const IDFC_TIER_RATINGS = {
  "₹25K AMB Savings": 2.0,
  "FIRST Select": 3.0,
  "FIRST Wealth": 4.0,
  "FIRST Private": 5.0
};

export const IDFC_7_AMAZING_BENEFITS = [
  { id: 1, title: "Zero Fee Banking", desc: "Zero charges on 28 essential services including IMPS, NEFT, RTGS, Demand Drafts, and ATM transactions." },
  { id: 2, title: "Monthly Interest Credit", desc: "Earn up to 7.00% p.a. interest credited directly to your account every single month." },
  { id: 3, title: "Free Unlimited ATM Withdrawals", desc: "Enjoy unlimited free cash withdrawals at any bank ATM across India." },
  { id: 4, title: "Personal Accident Cover", desc: "Complimentary Personal Accident Insurance Cover of ₹35 Lakhs with zero additional premium." },
  { id: 5, title: "Air Accident Cover", desc: "Complimentary Air Accident Insurance Cover of ₹1 Crore on debit card activation." },
  { id: 6, title: "Contactless Debit Card", desc: "Visa Signature / RuPay debit card with zero lost card liability and high daily limits." },
  { id: 7, title: "Digital Video KYC", desc: "100% paperless, instant online account opening via Video KYC from anywhere." }
];

export const IDFC_BENEFITS_COMPARISON_MATRIX = [
  {
    category: "Travel Benefits",
    benefitName: "Domestic Airport Lounge Access",
    amb25k: "Standard limits as applicable",
    select: "4 Passes per quarter (16/yr)",
    wealth: "4 Passes per quarter (16/yr)",
    private: "Unlimited Access Globally"
  },
  {
    category: "Travel Benefits",
    benefitName: "International Airport Lounge Access",
    amb25k: "Information not available",
    select: "Information not available",
    wealth: "4 Passes per quarter (16/yr)",
    private: "Unlimited Access Globally"
  },
  {
    category: "Travel Benefits",
    benefitName: "Foreign Exchange (Forex) Markup Rate",
    amb25k: "Standard 3.50%",
    select: "1.99% Discounted Markup",
    wealth: "1.50% Low Forex Markup",
    private: "0.00% Zero Forex Markup"
  },
  {
    category: "Travel Benefits",
    benefitName: "Railway Lounge Access",
    amb25k: "Information not available",
    select: "Complimentary",
    wealth: "Complimentary",
    private: "Unlimited Access"
  },
  {
    category: "Value Added Services",
    benefitName: "Dedicated Relationship Manager",
    amb25k: "Branch Customer Support",
    select: "Priority Desk Manager",
    wealth: "Dedicated Wealth RM",
    private: "Senior Private Banker & Desk"
  },
  {
    category: "Value Added Services",
    benefitName: "Golf Privileges & Coaching",
    amb25k: "Not Included",
    select: "Not Included",
    wealth: "2 Free Rounds/Month",
    private: "Unlimited Complimentary Rounds"
  },
  {
    category: "Value Added Services",
    benefitName: "24/7 Global Concierge",
    amb25k: "Standard Phone Banking",
    select: "Priority Phone Banking",
    wealth: "Dedicated Concierge Line",
    private: "Bespoke 24/7 Global Concierge"
  },
  {
    category: "Value Added Services",
    benefitName: "Family Account Privilege Bundling",
    amb25k: "Standard Accounts",
    select: "Up to 4 Family Members",
    wealth: "Up to 6 Family Members",
    private: "Full Family Private Suite"
  },
  {
    category: "General Benefits",
    benefitName: "Monthly Interest Payout",
    amb25k: "Included (Up to 7.00% p.a.)",
    select: "Included (Up to 7.00% p.a.)",
    wealth: "Included (Up to 7.00% p.a.)",
    private: "Included (Up to 7.00% p.a.)"
  },
  {
    category: "General Benefits",
    benefitName: "Zero Fee Banking Services (28 Services)",
    amb25k: "Included",
    select: "Included",
    wealth: "Included",
    private: "Included + Bespoke Waivers"
  }
];

export const IDFC_ASSOCIATED_CREDIT_CARDS = {
  "FIRST Select": {
    cardName: "FIRST Select Credit Card",
    associatedTier: "FIRST Select",
    lifetimeFee: "Lifetime Free (₹0 Joining / ₹0 Annual)",
    incomeReq: "Net Monthly Salary ₹1,00,000+ or FIRST Select Account",
    keyBenefits: [
      "3X Rewards on offline & 6X Rewards on online spend",
      "4 Complimentary Domestic Airport Lounge visits per quarter",
      "Buy 1 Get 1 Free Movie ticket offer via Paytm Movies (up to ₹250)",
      "Low APR starting from 9% p.a. on cash advances"
    ],
    officialSource: "IDFC FIRST Bank Official Documentation",
    lastVerified: "August 2026"
  },
  "FIRST Wealth": {
    cardName: "FIRST Wealth Credit Card",
    associatedTier: "FIRST Wealth",
    lifetimeFee: "Lifetime Free (₹0 Joining / ₹0 Annual)",
    incomeReq: "Net Monthly Salary ₹3,00,000+ or FIRST Wealth Account",
    keyBenefits: [
      "10X Rewards on spend above threshold & birthday spends",
      "4 Complimentary Domestic + 4 International Lounge visits per quarter",
      "Low 1.5% Foreign Exchange Markup fee",
      "Complimentary Spa access per quarter & Golf privileges"
    ],
    officialSource: "IDFC FIRST Bank Official Documentation",
    lastVerified: "August 2026"
  },
  "FIRST Private": {
    cardName: "FIRST Private Credit Card",
    associatedTier: "FIRST Private",
    lifetimeFee: "Lifetime Free (₹0 Joining / ₹0 Annual)",
    incomeReq: "By invitation or FIRST Private Banking Relationship",
    keyBenefits: [
      "Bespoke 24/7 Global Concierge Desk & Art Advisory",
      "Unlimited Complimentary Airport Lounge Access globally",
      "0.00% Zero Foreign Exchange Markup fee on international spends",
      "Premium Taj Epicure membership & bespoke lifestyle privileges"
    ],
    officialSource: "IDFC FIRST Bank Official Documentation",
    lastVerified: "August 2026"
  }
};

export const IDFC_FIRST_WOW_CREDIT_CARD = {
  cardName: "FIRST WOW Credit Card",
  type: "Additional Credit Card Option (FD Backed)",
  eligibility: "100% Approval against Fixed Deposit starting at ₹2,000",
  fdRequirement: "Minimum Fixed Deposit of ₹2,000",
  incomeProof: "No Income Proof or CIBIL Score Required",
  lifetimeFee: "Lifetime Free (₹0 Joining / ₹0 Annual)",
  keyBenefits: [
    "100% Credit Limit equal to your Fixed Deposit amount",
    "0.00% Zero Forex Markup fee on all international purchases",
    "Earn 4X Reward points on all transactions",
    "Instant digital card issuance upon FD creation"
  ],
  importantConditions: "FD must remain active to maintain credit limit.",
  officialSource: "IDFC FIRST Bank Official Documentation",
  lastVerified: "August 2026"
};

/**
 * Calculates highest eligible IDFC FIRST Bank savings tier using ANY ONE criterion logic.
 */
export function calculateIDFCFirstTierEligibility({ amb = 0, salary = 0, aum = 0, orv = 0 }) {
  const numAmb = Number(amb) || 0;
  const numSalary = Number(salary) || 0;
  const numAum = Number(aum) || 0;
  const numOrv = Number(orv) || 0;

  // 1. Check FIRST Private (Highest)
  if (numAmb >= 10000000) {
    return { eligible: true, tier: "FIRST Private", criterionUsed: "Average Monthly Balance", criterionValue: "₹1 Crore+", rating: 5.0 };
  }
  if (numSalary >= 1000000) {
    return { eligible: true, tier: "FIRST Private", criterionUsed: "Net Monthly Salary", criterionValue: "₹10 Lakhs+/mo", rating: 5.0 };
  }
  if (numAum >= 20000000) {
    return { eligible: true, tier: "FIRST Private", criterionUsed: "Assets Under Management (AUM)", criterionValue: "₹2 Crores+", rating: 5.0 };
  }
  if (numOrv >= 50000000) {
    return { eligible: true, tier: "FIRST Private", criterionUsed: "Overall Relationship Value (ORV)", criterionValue: "₹5 Crores+", rating: 5.0 };
  }

  // 2. Check FIRST Wealth
  if (numAmb >= 1000000) {
    return { eligible: true, tier: "FIRST Wealth", criterionUsed: "Average Monthly Balance", criterionValue: "₹10 Lakhs+", rating: 4.0 };
  }
  if (numSalary >= 300000) {
    return { eligible: true, tier: "FIRST Wealth", criterionUsed: "Net Monthly Salary", criterionValue: "₹3 Lakhs+/mo", rating: 4.0 };
  }
  if (numAum >= 3000000) {
    return { eligible: true, tier: "FIRST Wealth", criterionUsed: "Assets Under Management (AUM)", criterionValue: "₹30 Lakhs+", rating: 4.0 };
  }
  if (numOrv >= 5000000) {
    return { eligible: true, tier: "FIRST Wealth", criterionUsed: "Overall Relationship Value (ORV)", criterionValue: "₹50 Lakhs+", rating: 4.0 };
  }

  // 3. Check FIRST Select
  if (numAmb >= 100000) {
    return { eligible: true, tier: "FIRST Select", criterionUsed: "Average Monthly Balance", criterionValue: "₹1 Lakh+", rating: 3.0 };
  }
  if (numSalary >= 100000) {
    return { eligible: true, tier: "FIRST Select", criterionUsed: "Net Monthly Salary", criterionValue: "₹1 Lakh+/mo", rating: 3.0 };
  }
  if (numAum >= 500000) {
    return { eligible: true, tier: "FIRST Select", criterionUsed: "Assets Under Management (AUM)", criterionValue: "₹5 Lakhs+", rating: 3.0 };
  }
  if (numOrv >= 1000000) {
    return { eligible: true, tier: "FIRST Select", criterionUsed: "Overall Relationship Value (ORV)", criterionValue: "₹10 Lakhs+", rating: 3.0 };
  }

  // 4. Check ₹25K AMB Savings
  if (numAmb >= 25000) {
    return { eligible: true, tier: "₹25K AMB Savings", criterionUsed: "Average Monthly Balance", criterionValue: "₹25,000+", rating: 2.0 };
  }

  return {
    eligible: false,
    tier: null,
    reason: "No matching tier found based on the information provided. Please verify eligibility requirements directly with IDFC FIRST Bank."
  };
}
