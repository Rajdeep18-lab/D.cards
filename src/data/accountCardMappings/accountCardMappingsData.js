/**
 * D.CARD ACCOUNT → DEBIT CARD EXPLICIT MAPPINGS REPOSITORY
 * 
 * STRICT ARCHITECTURE RULE:
 * NEVER associate a debit card with an account merely because both belong to the same bank.
 * A debit card can ONLY be displayed as associated with an account when the official source
 * explicitly establishes that relationship.
 * 
 * Supported Relationships:
 * - "included"          : Card is provided complimentary with account
 * - "default"           : Standard default card issued upon opening
 * - "optional"          : Available to be chosen by customer
 * - "eligibility_based" : Higher-tier card available upon meeting balance/income criteria
 * - "not_specified"     : Explicitly unknown relationship
 */

export const accountDebitCardMappings = [
  // =========================================================================
  // 1. STATE BANK OF INDIA (SBI) - SAVINGS
  // =========================================================================
  {
    account_id: "sbi-regular-savings",
    account_numeric_id: 1031,
    bank_id: "sbi",
    card_id: "sbi-classic-debit-card",
    relationship: "included",
    verification_status: "verified",
    source: "https://sbi.co.in/web/personal-banking/accounts/savings-account"
  },
  {
    account_id: "sbi-regular-savings",
    account_numeric_id: 1031,
    bank_id: "sbi",
    card_id: "sbi-global-debit-card",
    relationship: "optional",
    verification_status: "verified",
    source: "https://sbi.co.in/web/personal-banking/accounts/savings-account"
  },
  {
    account_id: "sbi-savings-plus",
    account_numeric_id: 103,
    bank_id: "sbi",
    card_id: "sbi-global-debit-card",
    relationship: "included",
    verification_status: "verified",
    source: "https://sbi.co.in"
  },
  {
    account_id: "sbi-savings-plus",
    account_numeric_id: 103,
    bank_id: "sbi",
    card_id: "sbi-platinum-debit-card",
    relationship: "eligibility_based",
    verification_status: "verified",
    source: "https://sbi.co.in"
  },
  {
    account_id: "sbi-bsbda",
    account_numeric_id: 1032,
    bank_id: "sbi",
    card_id: "sbi-classic-debit-card",
    relationship: "included",
    verification_status: "verified",
    source: "https://sbi.co.in"
  },
  {
    account_id: "sbi-pehla-kadam-minor",
    account_numeric_id: 115,
    bank_id: "sbi",
    card_id: "sbi-yuva-debit-card",
    relationship: "included",
    verification_status: "verified",
    source: "https://sbi.co.in"
  },

  // =========================================================================
  // 2. STATE BANK OF INDIA (SBI) - CURRENT ACCOUNTS
  // =========================================================================
  {
    account_id: "sbi-regular-current",
    account_numeric_id: 2001,
    bank_id: "sbi",
    card_id: "sbi-pride-debit-card",
    relationship: "default",
    verification_status: "verified",
    source: "https://sbi.co.in/web/business/sme/current-accounts"
  },
  {
    account_id: "sbi-power-jyoti-current",
    account_numeric_id: 2002,
    bank_id: "sbi",
    card_id: "sbi-pride-debit-card",
    relationship: "optional",
    verification_status: "verified",
    source: "https://sbi.co.in/web/business/sme/current-accounts"
  },

  // =========================================================================
  // 3. HDFC BANK - SAVINGS
  // =========================================================================
  {
    account_id: "hdfc-regular-savings",
    account_numeric_id: 1011,
    bank_id: "hdfc-bank",
    card_id: "hdfc-bank-hdfc-millennia-debit-card",
    relationship: "included",
    verification_status: "verified",
    source: "https://www.hdfcbank.com/personal/save/accounts/savings-accounts"
  },
  {
    account_id: "hdfc-regular-savings",
    account_numeric_id: 1011,
    bank_id: "hdfc-bank",
    card_id: "hdfc-bank-hdfc-easyshop-platinum-debit-card",
    relationship: "eligibility_based",
    verification_status: "verified",
    source: "https://www.hdfcbank.com/personal/save/accounts/savings-accounts"
  },
  {
    account_id: "hdfc-savingsmax",
    account_numeric_id: 101,
    bank_id: "hdfc-bank",
    card_id: "hdfc-bank-hdfc-easyshop-platinum-debit-card",
    relationship: "included",
    verification_status: "verified",
    source: "https://www.hdfcbank.com"
  },
  {
    account_id: "hdfc-digisave-youth",
    account_numeric_id: 1012,
    bank_id: "hdfc-bank",
    card_id: "hdfc-bank-hdfc-millennia-debit-card",
    relationship: "included",
    verification_status: "verified",
    source: "https://www.hdfcbank.com"
  },
  {
    account_id: "hdfc-womens-savings",
    account_numeric_id: 1013,
    bank_id: "hdfc-bank",
    card_id: "hdfc-bank-hdfc-easyshop-woman-s-advantage-debit-card",
    relationship: "included",
    verification_status: "verified",
    source: "https://www.hdfcbank.com"
  },
  {
    account_id: "hdfc-senior-citizen",
    account_numeric_id: 1014,
    bank_id: "hdfc-bank",
    card_id: "hdfc-bank-hdfc-easyshop-platinum-debit-card",
    relationship: "included",
    verification_status: "verified",
    source: "https://www.hdfcbank.com"
  },
  {
    account_id: "hdfc-bsbda",
    account_numeric_id: 1015,
    bank_id: "hdfc-bank",
    card_id: "hdfc-bank-hdfc-moneyback-debit-card",
    relationship: "included",
    verification_status: "verified",
    source: "https://www.hdfcbank.com"
  },
  {
    account_id: "hdfc-nre-premium",
    account_numeric_id: 116,
    bank_id: "hdfc-bank",
    card_id: "hdfc-bank-hdfc-easyshop-platinum-debit-card",
    relationship: "included",
    verification_status: "verified",
    source: "https://www.hdfcbank.com"
  },

  // =========================================================================
  // 4. HDFC BANK - CURRENT ACCOUNTS
  // =========================================================================
  {
    account_id: "hdfc-regular-current",
    account_numeric_id: 2011,
    bank_id: "hdfc-bank",
    card_id: "hdfc-bank-hdfc-moneyback-debit-card",
    relationship: "default",
    verification_status: "verified",
    source: "https://www.hdfcbank.com/sme/current-accounts/regular-current-account"
  },
  {
    account_id: "hdfc-max-advantage-current",
    account_numeric_id: 2012,
    bank_id: "hdfc-bank",
    card_id: "hdfc-bank-hdfc-easyshop-platinum-debit-card",
    relationship: "included",
    verification_status: "verified",
    source: "https://www.hdfcbank.com/sme/current-accounts"
  },

  // =========================================================================
  // 5. ICICI BANK - SAVINGS
  // =========================================================================
  {
    account_id: "icici-regular-savings",
    account_numeric_id: 1021,
    bank_id: "icici-bank",
    card_id: "icici-bank-icici-coral-debit-card",
    relationship: "included",
    verification_status: "verified",
    source: "https://www.icicibank.com"
  },
  {
    account_id: "icici-regular-savings",
    account_numeric_id: 1021,
    bank_id: "icici-bank",
    card_id: "icici-bank-icici-rubyx-debit-card",
    relationship: "eligibility_based",
    verification_status: "verified",
    source: "https://www.icicibank.com"
  },
  {
    account_id: "icici-mine-student",
    account_numeric_id: 102,
    bank_id: "icici-bank",
    card_id: "icici-bank-icici-expressions-debit-card",
    relationship: "included",
    verification_status: "verified",
    source: "https://www.icicibank.com"
  },
  {
    account_id: "icici-salary-savings",
    account_numeric_id: 1022,
    bank_id: "icici-bank",
    card_id: "icici-bank-icici-coral-debit-card",
    relationship: "included",
    verification_status: "verified",
    source: "https://www.icicibank.com"
  },
  {
    account_id: "icici-advantage-woman",
    account_numeric_id: 114,
    bank_id: "icici-bank",
    card_id: "icici-bank-icici-coral-debit-card",
    relationship: "included",
    verification_status: "verified",
    source: "https://www.icicibank.com"
  },

  // =========================================================================
  // 6. ICICI BANK - CURRENT ACCOUNTS
  // =========================================================================
  {
    account_id: "icici-classic-current",
    account_numeric_id: 2021,
    bank_id: "icici-bank",
    card_id: "icici-bank-icici-business-debit-card",
    relationship: "default",
    verification_status: "verified",
    source: "https://www.icicibank.com/business-banking/current-account"
  },
  {
    account_id: "icici-one-current",
    account_numeric_id: 2022,
    bank_id: "icici-bank",
    card_id: "icici-bank-icici-business-debit-card",
    relationship: "included",
    verification_status: "verified",
    source: "https://www.icicibank.com/business-banking/current-account"
  },

  // =========================================================================
  // 7. AXIS BANK - SAVINGS
  // =========================================================================
  {
    account_id: "axis-regular-savings",
    account_numeric_id: 1051,
    bank_id: "axis-bank",
    card_id: "axis-bank-delight-debit-card",
    relationship: "included",
    verification_status: "verified",
    source: "https://www.axisbank.com"
  },
  {
    account_id: "axis-regular-savings",
    account_numeric_id: 1051,
    bank_id: "axis-bank",
    card_id: "axis-bank-priority-platinum-debit-card",
    relationship: "eligibility_based",
    verification_status: "verified",
    source: "https://www.axisbank.com"
  },
  {
    account_id: "axis-liberty",
    account_numeric_id: 105,
    bank_id: "axis-bank",
    card_id: "axis-bank-liberty-debit-card",
    relationship: "included",
    verification_status: "verified",
    source: "https://www.axisbank.com"
  },
  {
    account_id: "axis-basic-small",
    account_numeric_id: 117,
    bank_id: "axis-bank",
    card_id: "axis-bank-delight-debit-card",
    relationship: "included",
    verification_status: "verified",
    source: "https://www.axisbank.com"
  },
  {
    account_id: "axis-prestige",
    account_numeric_id: 1052,
    bank_id: "axis-bank",
    card_id: "axis-bank-priority-platinum-debit-card",
    relationship: "included",
    verification_status: "verified",
    source: "https://www.axisbank.com"
  },
  {
    account_id: "axis-senior-privilege",
    account_numeric_id: 1053,
    bank_id: "axis-bank",
    card_id: "axis-bank-rewards-plus-debit-card",
    relationship: "included",
    verification_status: "verified",
    source: "https://www.axisbank.com"
  },
  {
    account_id: "axis-future-stars-minor",
    account_numeric_id: 1054,
    bank_id: "axis-bank",
    card_id: "axis-bank-delight-debit-card",
    relationship: "included",
    verification_status: "verified",
    source: "https://www.axisbank.com"
  },

  // =========================================================================
  // 8. AXIS BANK - CURRENT ACCOUNTS
  // =========================================================================
  {
    account_id: "axis-normal-current",
    account_numeric_id: 2031,
    bank_id: "axis-bank",
    card_id: "axis-bank-delight-debit-card",
    relationship: "default",
    verification_status: "verified",
    source: "https://www.axisbank.com/business-banking/current-accounts"
  },

  // =========================================================================
  // 9. KOTAK MAHINDRA BANK - SAVINGS
  // =========================================================================
  {
    account_id: "kotak-811-full-kyc",
    account_numeric_id: 104,
    bank_id: "kotak-mahindra-bank",
    card_id: "kotak-mahindra-bank-kotak-811-debit-card",
    relationship: "included",
    verification_status: "verified",
    source: "https://www.kotak.com"
  },
  {
    account_id: "kotak-811-edge",
    account_numeric_id: 1041,
    bank_id: "kotak-mahindra-bank",
    card_id: "kotak-mahindra-bank-kotak-pro-debit-card",
    relationship: "included",
    verification_status: "verified",
    source: "https://www.kotak.com"
  },
  {
    account_id: "kotak-811-super",
    account_numeric_id: 1042,
    bank_id: "kotak-mahindra-bank",
    card_id: "kotak-mahindra-bank-kotak-platinum-debit-card",
    relationship: "included",
    verification_status: "verified",
    source: "https://www.kotak.com"
  },
  {
    account_id: "kotak-activemoney",
    account_numeric_id: 1043,
    bank_id: "kotak-mahindra-bank",
    card_id: "kotak-mahindra-bank-kotak-ace-debit-card",
    relationship: "included",
    verification_status: "verified",
    source: "https://www.kotak.com"
  },

  // =========================================================================
  // 10. KOTAK MAHINDRA BANK - CURRENT ACCOUNTS
  // =========================================================================
  {
    account_id: "kotak-neo-current",
    account_numeric_id: 2041,
    bank_id: "kotak-mahindra-bank",
    card_id: "kotak-mahindra-bank-kotak-platinum-debit-card",
    relationship: "default",
    verification_status: "verified",
    source: "https://www.kotak.com/en/business-banking/accounts/current-accounts.html"
  },
  {
    account_id: "kotak-elite-current",
    account_numeric_id: 2042,
    bank_id: "kotak-mahindra-bank",
    card_id: "kotak-mahindra-bank-kotak-platinum-debit-card",
    relationship: "included",
    verification_status: "verified",
    source: "https://www.kotak.com/en/business-banking/accounts/current-accounts.html"
  },

  // =========================================================================
  // 11. IDFC FIRST BANK - SAVINGS
  // =========================================================================
  {
    account_id: "idfc-first-classic",
    account_numeric_id: 106,
    bank_id: "idfc-first-bank",
    card_id: "idfc-first-bank-idfc-first-classic-debit-card",
    relationship: "included",
    verification_status: "verified",
    source: "https://www.idfcfirstbank.com"
  },
  {
    account_id: "idfc-first-select",
    account_numeric_id: 107,
    bank_id: "idfc-first-bank",
    card_id: "idfc-first-bank-idfc-first-select-debit-card",
    relationship: "included",
    verification_status: "verified",
    source: "https://www.idfcfirstbank.com"
  },
  {
    account_id: "idfc-first-wealth",
    account_numeric_id: 108,
    bank_id: "idfc-first-bank",
    card_id: "idfc-first-bank-idfc-first-world-debit-card",
    relationship: "included",
    verification_status: "verified",
    source: "https://www.idfcfirstbank.com"
  },
  {
    account_id: "idfc-first-senior",
    account_numeric_id: 109,
    bank_id: "idfc-first-bank",
    card_id: "idfc-first-bank-idfc-first-millennia-debit-card",
    relationship: "included",
    verification_status: "verified",
    source: "https://www.idfcfirstbank.com"
  },

  // =========================================================================
  // 12. IDFC FIRST BANK - CURRENT ACCOUNTS
  // =========================================================================
  {
    account_id: "idfc-first-freedom-current",
    account_numeric_id: 2051,
    bank_id: "idfc-first-bank",
    card_id: "idfc-first-bank-idfc-first-classic-debit-card",
    relationship: "default",
    verification_status: "verified",
    source: "https://www.idfcfirstbank.com/business-banking/current-account"
  },

  // =========================================================================
  // 13. OTHER BANKS (AU SMALL FINANCE, BOB, INDUSIND, FI MONEY)
  // =========================================================================
  {
    account_id: "au-digital-savings",
    account_numeric_id: 110,
    bank_id: "au-small-finance-bank",
    card_id: "au-small-finance-bank-au-bank-platinum-debit-card",
    relationship: "included",
    verification_status: "verified",
    source: "https://www.aubank.in"
  },
  {
    account_id: "bob-advantage-savings",
    account_numeric_id: 111,
    bank_id: "bank-of-baroda",
    card_id: "bank-of-baroda-bob-rupay-platinum-debit-card",
    relationship: "included",
    verification_status: "verified",
    source: "https://www.bankofbaroda.in"
  },
  {
    account_id: "indusind-privilege-savings",
    account_numeric_id: 112,
    bank_id: "indusind-bank",
    card_id: "indusind-bank-indusind-platinum-debit-card",
    relationship: "included",
    verification_status: "verified",
    source: "https://www.indusind.com"
  },
  {
    account_id: "fi-money-smart-digital",
    account_numeric_id: 113,
    bank_id: "fi-money",
    card_id: "fi-money-fi-debit-card",
    relationship: "included",
    verification_status: "verified",
    source: "https://fi.money"
  },

  // Bank of Baroda - Current Account
  {
    account_id: "bob-baroda-advantage-current",
    account_numeric_id: 2061,
    bank_id: "bank-of-baroda",
    card_id: "bank-of-baroda-bob-business-debit-card",
    relationship: "default",
    verification_status: "verified",
    source: "https://www.bankofbaroda.in/business-banking/current-accounts"
  },

  // IndusInd Bank - Current Account
  {
    account_id: "indusind-freedom-current",
    account_numeric_id: 2071,
    bank_id: "indusind-bank",
    card_id: "indusind-bank-indusind-platinum-debit-card",
    relationship: "default",
    verification_status: "verified",
    source: "https://www.indusind.com/in/en/business/accounts/current-accounts.html"
  },

  // =========================================================================
  // PUNJAB NATIONAL BANK (PNB) - SAVINGS ACCOUNTS
  // Source: User Provided Banking Dataset
  // =========================================================================
  {
    account_id: "pnb-women-power-solitaire",
    account_numeric_id: 118,
    bank_id: "pnb",
    card_id: "pnb-rupay-platinum-solitaire-international",
    relationship: "included",
    verification_status: "verified",
    source: "User Provided Banking Dataset"
  },
  {
    account_id: "pnb-women-power-pearl",
    account_numeric_id: 119,
    bank_id: "pnb",
    card_id: "pnb-rupay-platinum-pearl-international",
    relationship: "included",
    verification_status: "verified",
    source: "User Provided Banking Dataset"
  },
  {
    account_id: "pnb-women-power-emerald",
    account_numeric_id: 120,
    bank_id: "pnb",
    card_id: "pnb-rupay-platinum-emerald-international",
    relationship: "included",
    verification_status: "verified",
    source: "User Provided Banking Dataset"
  },
  {
    account_id: "pnb-rise",
    account_numeric_id: 121,
    bank_id: "pnb",
    card_id: "pnb-mastercard-platinum-rise",
    relationship: "included",
    verification_status: "verified",
    source: "User Provided Banking Dataset"
  },
  {
    account_id: "pnb-grow",
    account_numeric_id: 122,
    bank_id: "pnb",
    card_id: "pnb-mastercard-platinum-grow",
    relationship: "included",
    verification_status: "verified",
    source: "User Provided Banking Dataset"
  },

  // =========================================================================
  // BANK OF BARODA (BOB) - SAVINGS ACCOUNTS
  // Source: User Provided Banking Dataset
  // =========================================================================
  {
    account_id: "bob-super-savings",
    account_numeric_id: 123,
    bank_id: "bank-of-baroda",
    card_id: "bank-of-baroda-bob-rupay-platinum-debit-card",
    relationship: "included",
    verification_status: "verified",
    source: "User Provided Banking Dataset"
  },
  {
    account_id: "bob-platinum-savings",
    account_numeric_id: 124,
    bank_id: "bank-of-baroda",
    card_id: "bank-of-baroda-bob-premium-debit-card",
    relationship: "included",
    verification_status: "verified",
    source: "User Provided Banking Dataset"
  },
  {
    account_id: "bob-masterstroke",
    account_numeric_id: 125,
    bank_id: "bank-of-baroda",
    card_id: "bank-of-baroda-bob-premium-debit-card",
    relationship: "included",
    verification_status: "verified",
    source: "User Provided Banking Dataset"
  },
  {
    account_id: "bob-masterstroke-lite",
    account_numeric_id: 126,
    bank_id: "bank-of-baroda",
    card_id: "bank-of-baroda-bob-rupay-platinum-debit-card",
    relationship: "included",
    verification_status: "verified",
    source: "User Provided Banking Dataset"
  },
  {
    account_id: "bob-mahila-shakti",
    account_numeric_id: 127,
    bank_id: "bank-of-baroda",
    card_id: "bank-of-baroda-bob-rupay-platinum-debit-card",
    relationship: "included",
    verification_status: "verified",
    source: "User Provided Banking Dataset"
  },
  {
    account_id: "bob-lite-savings",
    account_numeric_id: 128,
    bank_id: "bank-of-baroda",
    card_id: "bank-of-baroda-bob-rupay-classic-debit-card",
    relationship: "included",
    verification_status: "verified",
    source: "User Provided Banking Dataset"
  },
  {
    account_id: "bob-salary-classic",
    account_numeric_id: 129,
    bank_id: "bank-of-baroda",
    card_id: "bank-of-baroda-bob-rupay-platinum-debit-card",
    relationship: "included",
    verification_status: "verified",
    source: "User Provided Banking Dataset"
  },
  {
    account_id: "bob-salary-super",
    account_numeric_id: 130,
    bank_id: "bank-of-baroda",
    card_id: "bank-of-baroda-bob-rupay-platinum-debit-card",
    relationship: "included",
    verification_status: "verified",
    source: "User Provided Banking Dataset"
  },
  {
    account_id: "bob-salary-premium",
    account_numeric_id: 131,
    bank_id: "bank-of-baroda",
    card_id: "bank-of-baroda-bob-premium-debit-card",
    relationship: "included",
    verification_status: "verified",
    source: "User Provided Banking Dataset"
  },
  {
    account_id: "bob-salary-privilege",
    account_numeric_id: 132,
    bank_id: "bank-of-baroda",
    card_id: "bank-of-baroda-bob-premium-debit-card",
    relationship: "included",
    verification_status: "verified",
    source: "User Provided Banking Dataset"
  }
];

export default accountDebitCardMappings;
