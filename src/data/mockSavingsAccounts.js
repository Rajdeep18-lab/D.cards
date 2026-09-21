import { canonicalBankName } from "../utils/bankDirectoryUtils.js";
import { masterDebitCardsMap } from "./debitCardsData.js";
import { getAccountDebitCardMappings } from "./accountDebitCardMappings.js";

/**
 * BANK COMPARISON PLATFORM - SAVINGS ACCOUNTS & ASSOCIATED DEBIT CARDS
 * Architecture: BANK -> SAVINGS ACCOUNT -> DEBIT CARD ASSOCIATED WITH THAT SPECIFIC ACCOUNT
 */
export const savingsAccounts = [
  {
    "id": 1031,
    "product_id": "sbi-regular-savings",
    "bank_id": "sbi",
    "bank_name": "State Bank of India",
    "bank": "State Bank of India",
    "logo": "SB",
    "variant_name": "SBI Regular Savings Account",
    "accountName": "SBI Regular Savings Account",
    "account_type": "Regular Savings",
    "accountType": "Regular Savings",
    "target_segment": "General Public",
    "accountTypeBadges": [
      "Regular",
      "Popular",
      "Government Bank"
    ],
    "interest_rate": "2.70% p.a.",
    "interestRate": "2.70% p.a.",
    "interestRateValue": 2.7,
    "minimum_balance": "₹0",
    "minimumBalance": "₹0",
    "minimumBalanceValue": 0,
    "maximum_balance": "No Limit",
    "non_maintenance_penalty": "Nil (Waiver active across all branches)",
    "nonMaintenanceCharges": "Nil (Waiver active across all branches)",
    "interest_credit_frequency": "Quarterly",
    "isZeroBalance": true,
    "isOnlineOpening": true,
    "isStudent": true,
    "isSalary": false,
    "isSeniorCitizen": false,
    "isWomenSpecial": false,
    "isDigital": true,
    "isPremium": false,
    "isNRI": false,
    "rating": 4.6,
    "isPopular": true,
    "source": "https://sbi.bank.in/web/personal-banking/accounts/saving-account",
    "officialSourceUrl": "https://sbi.bank.in/web/personal-banking/accounts/saving-account",
    "as_of_date": "August 2026",
    "lastVerified": "August 2026",
    "information_status": "Verified",
    "description": "India's most popular savings account with zero minimum balance requirement, widespread ATM access, and YONO digital banking integration.",
    "eligibility": [
      "Resident Indian Individual",
      "Age: 18 years and above",
      "Single or Joint Account operation"
    ],
    "benefits": [
      "Zero monthly average balance maintenance requirement",
      "Free YONO SBI Mobile Banking & Internet Banking",
      "Free 10 cheque leaves per financial year",
      "Access to India's largest network of ATMs & branches"
    ],
    "keyBenefits": [
      "Zero monthly average balance maintenance requirement",
      "Free YONO SBI Mobile Banking & Internet Banking",
      "Free 10 cheque leaves per financial year",
      "Access to India's largest network of ATMs & branches"
    ],
    "features": [
      "Instant Video KYC account opening via YONO App",
      "Complimentary SBI Classic or Global RuPay/Visa Debit Card",
      "SMS alerts & E-Statements included",
      "Auto-sweep (MOD) option available upon request"
    ],
    "bankingFeatures": [
      "Instant Video KYC account opening via YONO App",
      "Complimentary SBI Classic or Global RuPay/Visa Debit Card",
      "SMS alerts & E-Statements included",
      "Auto-sweep (MOD) option available upon request"
    ],
    "debit_card_relationships": [
      {
        "card_id": "sbi-classic-debit-card",
        "relationship": "provided",
        "verification_status": "verified"
      },
      {
        "card_id": "sbi-global-debit-card",
        "relationship": "optional",
        "verification_status": "verified"
      }
    ]
  },
  {
    "id": 103,
    "product_id": "sbi-savings-plus",
    "bank_id": "sbi",
    "bank_name": "State Bank of India",
    "bank": "State Bank of India",
    "logo": "SB",
    "variant_name": "SBI Savings Plus Account",
    "accountName": "SBI Savings Plus Account",
    "account_type": "Auto-Sweep Savings",
    "accountType": "Regular Savings",
    "target_segment": "General Public & High Savers",
    "accountTypeBadges": [
      "Auto-Sweep",
      "High Returns",
      "Government Bank"
    ],
    "interest_rate": "2.70% - 6.80% p.a.",
    "interestRate": "2.70% - 6.80% p.a.",
    "interestRateValue": 2.7,
    "minimum_balance": "₹0",
    "minimumBalance": "₹0",
    "minimumBalanceValue": 0,
    "maximum_balance": "No Limit",
    "non_maintenance_penalty": "Nil",
    "nonMaintenanceCharges": "Nil",
    "interest_credit_frequency": "Quarterly",
    "isZeroBalance": true,
    "isOnlineOpening": true,
    "isStudent": false,
    "isSalary": false,
    "isSeniorCitizen": true,
    "isWomenSpecial": false,
    "isDigital": true,
    "isPremium": false,
    "isNRI": false,
    "rating": 4.7,
    "isPopular": true,
    "source": "https://sbi.bank.in/web/personal-banking/accounts/saving-account/savings-plus-account",
    "officialSourceUrl": "https://sbi.bank.in/web/personal-banking/accounts/saving-account/savings-plus-account",
    "as_of_date": "August 2026",
    "lastVerified": "August 2026",
    "information_status": "Verified",
    "description": "Linked to MOD (Multi Option Deposit) scheme, automatically transferring surplus funds above ₹35,000 into high-yielding Term Deposits while retaining instant liquidity.",
    "eligibility": [
      "Resident Indian Individuals eligible",
      "Single or Joint Account operation"
    ],
    "benefits": [
      "Auto-sweep facility into MODD (Term Deposits) for higher FD returns",
      "Unmatched ATM network access across all Indian cities & rural hubs",
      "Zero minimum balance maintenance requirement",
      "Complimentary SBI Global / Platinum International Debit Card options"
    ],
    "keyBenefits": [
      "Auto-sweep facility into MODD (Term Deposits) for higher FD returns",
      "Unmatched ATM network access across all Indian cities & rural hubs",
      "Zero minimum balance maintenance requirement",
      "Complimentary SBI Global / Platinum International Debit Card options"
    ],
    "features": [
      "Automatic reverse sweep when liquidity is required",
      "YONO SBI App online management",
      "Free e-statements & digital passbook"
    ],
    "bankingFeatures": [
      "Automatic reverse sweep when liquidity is required",
      "YONO SBI App online management",
      "Free e-statements & digital passbook"
    ],
    "debit_card_relationships": [
      {
        "card_id": "sbi-global-debit-card",
        "relationship": "provided",
        "verification_status": "verified"
      },
      {
        "card_id": "sbi-platinum-debit-card",
        "relationship": "upgrade",
        "verification_status": "verified"
      }
    ]
  },
  {
    "id": 1032,
    "product_id": "sbi-bsbda",
    "bank_id": "sbi",
    "bank_name": "State Bank of India",
    "bank": "State Bank of India",
    "logo": "SB",
    "variant_name": "SBI Basic Savings Bank Deposit Account (BSBDA)",
    "accountName": "SBI Basic Savings Bank Deposit Account (BSBDA)",
    "account_type": "BSBDA",
    "accountType": "Zero Balance",
    "target_segment": "Financially Excluded / Basic Banking",
    "accountTypeBadges": [
      "BSBDA",
      "Zero Balance",
      "Government Scheme"
    ],
    "interest_rate": "2.70% p.a.",
    "interestRate": "2.70% p.a.",
    "interestRateValue": 2.7,
    "minimum_balance": "₹0",
    "minimumBalance": "₹0",
    "minimumBalanceValue": 0,
    "maximum_balance": "No Limit",
    "non_maintenance_penalty": "Nil",
    "nonMaintenanceCharges": "Nil",
    "interest_credit_frequency": "Quarterly",
    "isZeroBalance": true,
    "isOnlineOpening": true,
    "isStudent": true,
    "isSalary": false,
    "isSeniorCitizen": false,
    "isWomenSpecial": false,
    "isDigital": false,
    "isPremium": false,
    "isNRI": false,
    "rating": 4.5,
    "isPopular": false,
    "source": "https://sbi.bank.in/web/personal-banking/accounts/saving-account/basic-savings-bank-deposit-account",
    "officialSourceUrl": "https://sbi.bank.in/web/personal-banking/accounts/saving-account/basic-savings-bank-deposit-account",
    "as_of_date": "August 2026",
    "lastVerified": "August 2026",
    "information_status": "Verified",
    "description": "RBI mandated basic savings account for all Indian citizens without minimum balance criteria or maintenance charges.",
    "eligibility": [
      "Any Resident Indian Individual with valid KYC documents",
      "Must not hold another BSBD savings account with SBI"
    ],
    "benefits": [
      "100% Zero minimum balance maintenance requirement",
      "Free basic RuPay Debit Card",
      "4 free ATM withdrawals per month"
    ],
    "keyBenefits": [
      "100% Zero minimum balance maintenance requirement",
      "Free basic RuPay Debit Card",
      "4 free ATM withdrawals per month"
    ],
    "features": [
      "Free deposit and receipt of money through all electronic channels",
      "No account closure fees"
    ],
    "bankingFeatures": [
      "Free deposit and receipt of money through all electronic channels",
      "No account closure fees"
    ],
    "debit_card_relationships": [
      {
        "card_id": "sbi-classic-debit-card",
        "relationship": "provided",
        "verification_status": "verified"
      }
    ]
  },
  {
    "id": 115,
    "product_id": "sbi-pehla-kadam-minor",
    "bank_id": "sbi",
    "bank_name": "State Bank of India",
    "bank": "State Bank of India",
    "logo": "SB",
    "variant_name": "SBI Pehla Kadam Minor Savings Account",
    "accountName": "SBI Pehla Kadam Minor Savings Account",
    "account_type": "Minor Savings",
    "accountType": "Minor Savings",
    "target_segment": "Minors & Kids",
    "accountTypeBadges": [
      "Minor Special",
      "Zero Balance",
      "Kids Banking"
    ],
    "interest_rate": "2.70% p.a.",
    "interestRate": "2.70% p.a.",
    "interestRateValue": 2.7,
    "minimum_balance": "₹0",
    "minimumBalance": "₹0",
    "minimumBalanceValue": 0,
    "maximum_balance": "₹10,000 (Account Balance Cap)",
    "non_maintenance_penalty": "Nil",
    "nonMaintenanceCharges": "Nil",
    "interest_credit_frequency": "Quarterly",
    "isZeroBalance": true,
    "isOnlineOpening": false,
    "isStudent": true,
    "isSalary": false,
    "isSeniorCitizen": false,
    "isWomenSpecial": false,
    "isDigital": false,
    "isPremium": false,
    "isNRI": false,
    "rating": 4.4,
    "isPopular": false,
    "source": "https://sbi.bank.in/web/personal-banking/accounts/saving-account/savings-account-for-minors",
    "officialSourceUrl": "https://sbi.bank.in/web/personal-banking/accounts/saving-account/savings-account-for-minors",
    "as_of_date": "August 2026",
    "lastVerified": "August 2026",
    "information_status": "Verified",
    "description": "Specially crafted savings account for kids under 18 years operated jointly with parents to build financial discipline early.",
    "eligibility": [
      "Minors of any age operated jointly with Parents/Guardians"
    ],
    "benefits": [
      "Custom photo debit card with child & parent photo option",
      "Zero monthly balance penalty",
      "Per-day transaction cap to enforce prudent spending"
    ],
    "keyBenefits": [
      "Custom photo debit card with child & parent photo option",
      "Zero monthly balance penalty",
      "Per-day transaction cap to enforce prudent spending"
    ],
    "features": [
      "Specially curated mobile banking app for minors",
      "Auto-deposit facility"
    ],
    "bankingFeatures": [
      "Specially curated mobile banking app for minors",
      "Auto-deposit facility"
    ],
    "debit_card_relationships": [
      {
        "card_id": "sbi-yuva-debit-card",
        "relationship": "provided",
        "verification_status": "verified"
      }
    ]
  },
  {
    "id": 1011,
    "product_id": "hdfc-regular-savings",
    "bank_id": "hdfc-bank",
    "bank_name": "HDFC Bank",
    "bank": "HDFC Bank",
    "logo": "HD",
    "variant_name": "HDFC Regular Savings Account",
    "accountName": "HDFC Regular Savings Account",
    "account_type": "Regular Savings",
    "accountType": "Regular Savings",
    "target_segment": "General Public",
    "accountTypeBadges": [
      "Regular",
      "Popular",
      "Private Bank"
    ],
    "interest_rate": "3.00% - 3.50% p.a.",
    "interestRate": "3.00% - 3.50% p.a.",
    "interestRateValue": 3.5,
    "minimum_balance": "₹10,000",
    "minimumBalance": "₹10,000",
    "minimumBalanceValue": 10000,
    "maximum_balance": "No Limit",
    "non_maintenance_penalty": "₹150 to ₹600 per quarter depending on shortfall",
    "nonMaintenanceCharges": "₹150 to ₹600 per quarter depending on shortfall",
    "interest_credit_frequency": "Quarterly",
    "isZeroBalance": false,
    "isOnlineOpening": true,
    "isStudent": false,
    "isSalary": false,
    "isSeniorCitizen": false,
    "isWomenSpecial": false,
    "isDigital": true,
    "isPremium": false,
    "isNRI": false,
    "rating": 4.7,
    "isPopular": true,
    "source": "https://www.hdfcbank.com/personal/save/accounts/savings-accounts/regular-savings-account",
    "officialSourceUrl": "https://www.hdfcbank.com/personal/save/accounts/savings-accounts/regular-savings-account",
    "as_of_date": "August 2026",
    "lastVerified": "August 2026",
    "information_status": "Verified",
    "description": "HDFC Bank's signature Everyday Savings Account providing seamless digital banking, bill pay, and MoneyBack debit card benefits.",
    "eligibility": [
      "Resident Indian Individuals (Single or Joint)",
      "Age: 18 years and above"
    ],
    "benefits": [
      "Access to HDFC NetBanking & MobileBanking App",
      "Free safe deposit locker discounts for eligible balances",
      "Free 25 cheque leaves per year"
    ],
    "keyBenefits": [
      "Access to HDFC NetBanking & MobileBanking App",
      "Free safe deposit locker discounts for eligible balances",
      "Free 25 cheque leaves per year"
    ],
    "features": [
      "Instant Video KYC onboarding",
      "Free fund transfers via NEFT / RTGS / IMPS online"
    ],
    "bankingFeatures": [
      "Instant Video KYC onboarding",
      "Free fund transfers via NEFT / RTGS / IMPS online"
    ],
    "debit_card_relationships": [
      {
        "card_id": "hdfc-bank-hdfc-millennia-debit-card",
        "relationship": "provided",
        "verification_status": "verified"
      },
      {
        "card_id": "hdfc-bank-hdfc-easyshop-platinum-debit-card",
        "relationship": "upgrade",
        "verification_status": "verified"
      }
    ]
  },
  {
    "id": 101,
    "product_id": "hdfc-savingsmax",
    "bank_id": "hdfc-bank",
    "bank_name": "HDFC Bank",
    "bank": "HDFC Bank",
    "logo": "HD",
    "variant_name": "HDFC SavingsMax Account",
    "accountName": "HDFC SavingsMax Account",
    "account_type": "Premium Savings",
    "accountType": "Premium Savings",
    "target_segment": "HNI & High Balances",
    "accountTypeBadges": [
      "Premium",
      "Salary",
      "High Rewards"
    ],
    "interest_rate": "3.00% - 3.50% p.a.",
    "interestRate": "3.00% - 3.50% p.a.",
    "interestRateValue": 3.5,
    "minimum_balance": "₹25,000",
    "minimumBalance": "₹25,000",
    "minimumBalanceValue": 25000,
    "maximum_balance": "No Limit",
    "non_maintenance_penalty": "₹600/quarter if AMB falls below threshold",
    "nonMaintenanceCharges": "₹600/quarter if AMB falls below threshold",
    "interest_credit_frequency": "Quarterly",
    "isZeroBalance": false,
    "isOnlineOpening": true,
    "isStudent": false,
    "isSalary": true,
    "isSeniorCitizen": false,
    "isWomenSpecial": false,
    "isDigital": true,
    "isPremium": true,
    "isNRI": false,
    "rating": 4.8,
    "isPopular": true,
    "source": "https://www.hdfcbank.com/personal/save/accounts/savings-accounts/savingsmax-account",
    "officialSourceUrl": "https://www.hdfcbank.com/personal/save/accounts/savings-accounts/savingsmax-account",
    "as_of_date": "August 2026",
    "lastVerified": "August 2026",
    "information_status": "Verified",
    "description": "A feature-packed premium savings account offering lifetime free EasyShop Platinum Debit Card, accidental insurance, and automatic sweep-in benefits.",
    "eligibility": [
      "Resident Indian Individual",
      "Age: 18 years and above",
      "Valid Aadhaar Number & PAN Card required"
    ],
    "benefits": [
      "Lifetime Free HDFC EasyShop Platinum Debit Card (1% Cashback)",
      "Accidental Death Cover of ₹10 Lakhs & Air Cover of ₹30 Lakhs",
      "Free Unlimited ATM transactions at all HDFC Bank ATMs",
      "Auto-sweep facility to earn fixed deposit interest rates"
    ],
    "keyBenefits": [
      "Lifetime Free HDFC EasyShop Platinum Debit Card (1% Cashback)",
      "Accidental Death Cover of ₹10 Lakhs & Air Cover of ₹30 Lakhs",
      "Free Unlimited ATM transactions at all HDFC Bank ATMs",
      "Auto-sweep facility to earn fixed deposit interest rates"
    ],
    "features": [
      "Instant Video KYC Account Opening",
      "Priority teller desk service at branches"
    ],
    "bankingFeatures": [
      "Instant Video KYC Account Opening",
      "Priority teller desk service at branches"
    ],
    "debit_card_relationships": [
      {
        "card_id": "hdfc-bank-hdfc-easyshop-platinum-debit-card",
        "relationship": "provided",
        "verification_status": "verified"
      }
    ]
  },
  {
    "id": 1012,
    "product_id": "hdfc-digisave-youth",
    "bank_id": "hdfc-bank",
    "bank_name": "HDFC Bank",
    "bank": "HDFC Bank",
    "logo": "HD",
    "variant_name": "HDFC DigiSave Youth / Millennia Savings Account",
    "accountName": "HDFC DigiSave Youth Savings Account",
    "account_type": "Youth Savings",
    "accountType": "Youth",
    "target_segment": "Youth & Students (18-25 yrs)",
    "accountTypeBadges": [
      "Youth",
      "Digital",
      "Cashback"
    ],
    "interest_rate": "3.00% - 3.50% p.a.",
    "interestRate": "3.00% - 3.50% p.a.",
    "interestRateValue": 3.5,
    "minimum_balance": "₹5,000",
    "minimumBalance": "₹5,000",
    "minimumBalanceValue": 5000,
    "maximum_balance": "No Limit",
    "non_maintenance_penalty": "₹300/quarter",
    "nonMaintenanceCharges": "₹300/quarter",
    "interest_credit_frequency": "Quarterly",
    "isZeroBalance": false,
    "isOnlineOpening": true,
    "isStudent": true,
    "isSalary": false,
    "isSeniorCitizen": false,
    "isWomenSpecial": false,
    "isDigital": true,
    "isPremium": false,
    "isNRI": false,
    "rating": 4.8,
    "isPopular": true,
    "source": "https://www.hdfcbank.com/personal/save/accounts/savings-accounts/digisave-youth-account",
    "officialSourceUrl": "https://www.hdfcbank.com/personal/save/accounts/savings-accounts/digisave-youth-account",
    "as_of_date": "August 2026",
    "lastVerified": "August 2026",
    "information_status": "Verified",
    "description": "Designed for young adults aged 18-25 with Millennia debit card cashback, OTT subscription discounts, and low balance requirements.",
    "eligibility": [
      "Resident Individuals aged between 18 and 25 years"
    ],
    "benefits": [
      "5% CashBack on PayZapp, SmartBuy, Amazon & Flipkart spends",
      "Complimentary HDFC Millennia Debit Card",
      "Special discounts on food delivery & ride hailing apps"
    ],
    "keyBenefits": [
      "5% CashBack on PayZapp, SmartBuy, Amazon & Flipkart spends",
      "Complimentary HDFC Millennia Debit Card",
      "Special discounts on food delivery & ride hailing apps"
    ],
    "features": [
      "100% Digital Video KYC account opening",
      "Virtual debit card instant access"
    ],
    "bankingFeatures": [
      "100% Digital Video KYC account opening",
      "Virtual debit card instant access"
    ],
    "debit_card_relationships": [
      {
        "card_id": "hdfc-bank-hdfc-millennia-debit-card",
        "relationship": "provided",
        "verification_status": "verified"
      }
    ]
  },
  {
    "id": 1013,
    "product_id": "hdfc-womens-savings",
    "bank_id": "hdfc-bank",
    "bank_name": "HDFC Bank",
    "bank": "HDFC Bank",
    "logo": "HD",
    "variant_name": "HDFC Women's Savings Account",
    "accountName": "HDFC Women's Savings Account",
    "account_type": "Women's Savings",
    "accountType": "Women Special",
    "target_segment": "Women",
    "accountTypeBadges": [
      "Women Special",
      "Insurance Cover",
      "Shopping Deals"
    ],
    "interest_rate": "3.00% - 3.50% p.a.",
    "interestRate": "3.00% - 3.50% p.a.",
    "interestRateValue": 3.5,
    "minimum_balance": "₹10,000",
    "minimumBalance": "₹10,000",
    "minimumBalanceValue": 10000,
    "maximum_balance": "No Limit",
    "non_maintenance_penalty": "₹450/quarter",
    "nonMaintenanceCharges": "₹450/quarter",
    "interest_credit_frequency": "Quarterly",
    "isZeroBalance": false,
    "isOnlineOpening": true,
    "isStudent": false,
    "isSalary": false,
    "isSeniorCitizen": false,
    "isWomenSpecial": true,
    "isDigital": true,
    "isPremium": false,
    "isNRI": false,
    "rating": 4.7,
    "isPopular": false,
    "source": "https://www.hdfcbank.com/personal/save/accounts/savings-accounts/women-savings-account",
    "officialSourceUrl": "https://www.hdfcbank.com/personal/save/accounts/savings-accounts/women-savings-account",
    "as_of_date": "August 2026",
    "lastVerified": "August 2026",
    "information_status": "Verified",
    "description": "Curated for women offering preferential personal loan rates, higher daily debit card spending limits, and health insurance covers.",
    "eligibility": [
      "Resident Women Individuals (Single or Primary Holder)"
    ],
    "benefits": [
      "EasyShop Women's Advantage Debit Card with cashback on shopping",
      "Accidental death cover of ₹10 Lakhs & critical illness insurance options",
      "Preferential rates on gold loans and personal loans"
    ],
    "keyBenefits": [
      "EasyShop Women's Advantage Debit Card with cashback on shopping",
      "Accidental death cover of ₹10 Lakhs & critical illness insurance options",
      "Preferential rates on gold loans and personal loans"
    ],
    "features": [
      "Free Unlimited demand drafts & online NEFT/RTGS",
      "Exclusive discounts on health checkups and wellness"
    ],
    "bankingFeatures": [
      "Free Unlimited demand drafts & online NEFT/RTGS",
      "Exclusive discounts on health checkups and wellness"
    ],
    "debit_card_relationships": [
      {
        "card_id": "hdfc-bank-hdfc-easyshop-woman-s-advantage-debit-card",
        "relationship": "provided",
        "verification_status": "verified"
      }
    ]
  },
  {
    "id": 1014,
    "product_id": "hdfc-senior-citizen",
    "bank_id": "hdfc-bank",
    "bank_name": "HDFC Bank",
    "bank": "HDFC Bank",
    "logo": "HD",
    "variant_name": "HDFC Senior Citizen Savings Account",
    "accountName": "HDFC Senior Citizen Savings Account",
    "account_type": "Senior Citizen",
    "accountType": "Senior Citizen",
    "target_segment": "Senior Citizens (60+ yrs)",
    "accountTypeBadges": [
      "Senior Citizen",
      "Higher FD Interest",
      "Free Banking"
    ],
    "interest_rate": "3.00% - 3.50% p.a.",
    "interestRate": "3.00% - 3.50% p.a.",
    "interestRateValue": 3.5,
    "minimum_balance": "₹5,000",
    "minimumBalance": "₹5,000",
    "minimumBalanceValue": 5000,
    "maximum_balance": "No Limit",
    "non_maintenance_penalty": "₹300/quarter",
    "nonMaintenanceCharges": "₹300/quarter",
    "interest_credit_frequency": "Quarterly",
    "isZeroBalance": false,
    "isOnlineOpening": true,
    "isStudent": false,
    "isSalary": false,
    "isSeniorCitizen": true,
    "isWomenSpecial": false,
    "isDigital": true,
    "isPremium": false,
    "isNRI": false,
    "rating": 4.8,
    "isPopular": false,
    "source": "https://www.hdfcbank.com/personal/save/accounts/savings-accounts/senior-citizen-account",
    "officialSourceUrl": "https://www.hdfcbank.com/personal/save/accounts/savings-accounts/senior-citizen-account",
    "as_of_date": "August 2026",
    "lastVerified": "August 2026",
    "information_status": "Verified",
    "description": "Dedicated account for individuals aged 60 and above offering higher FD interest rates, lifetime free debit card, and door-step banking assistance.",
    "eligibility": [
      "Resident Indian Senior Citizens aged 60 years and above"
    ],
    "benefits": [
      "0.50% p.a. additional interest rate on Fixed Deposits",
      "Lifetime Free EasyShop Platinum Debit Card",
      "Free doorstep banking services and priority branch teller access"
    ],
    "keyBenefits": [
      "0.50% p.a. additional interest rate on Fixed Deposits",
      "Lifetime Free EasyShop Platinum Debit Card",
      "Free doorstep banking services and priority branch teller access"
    ],
    "features": [
      "Free quarterly physical account statements",
      "Free Demat account AMC waiver for first year"
    ],
    "bankingFeatures": [
      "Free quarterly physical account statements",
      "Free Demat account AMC waiver for first year"
    ],
    "debit_card_relationships": [
      {
        "card_id": "hdfc-bank-hdfc-easyshop-platinum-debit-card",
        "relationship": "provided",
        "verification_status": "verified"
      }
    ]
  },
  {
    "id": 1015,
    "product_id": "hdfc-bsbda",
    "bank_id": "hdfc-bank",
    "bank_name": "HDFC Bank",
    "bank": "HDFC Bank",
    "logo": "HD",
    "variant_name": "HDFC Basic Savings Bank Deposit Account (BSBDA)",
    "accountName": "HDFC Basic Savings Bank Deposit Account (BSBDA)",
    "account_type": "BSBDA",
    "accountType": "Zero Balance",
    "target_segment": "Basic Banking",
    "accountTypeBadges": [
      "BSBDA",
      "Zero Balance"
    ],
    "interest_rate": "3.00% - 3.50% p.a.",
    "interestRate": "3.00% - 3.50% p.a.",
    "interestRateValue": 3.5,
    "minimum_balance": "₹0",
    "minimumBalance": "₹0",
    "minimumBalanceValue": 0,
    "maximum_balance": "No Limit",
    "non_maintenance_penalty": "Nil",
    "nonMaintenanceCharges": "Nil",
    "interest_credit_frequency": "Quarterly",
    "isZeroBalance": true,
    "isOnlineOpening": true,
    "isStudent": true,
    "isSalary": false,
    "isSeniorCitizen": false,
    "isWomenSpecial": false,
    "isDigital": false,
    "isPremium": false,
    "isNRI": false,
    "rating": 4.5,
    "isPopular": false,
    "source": "https://www.hdfcbank.com/personal/save/accounts/savings-accounts/basic-savings-bank-deposit-account",
    "officialSourceUrl": "https://www.hdfcbank.com/personal/save/accounts/savings-accounts/basic-savings-bank-deposit-account",
    "as_of_date": "August 2026",
    "lastVerified": "August 2026",
    "information_status": "Verified",
    "description": "Zero balance basic savings deposit account aligned with RBI BSBD guidelines.",
    "eligibility": [
      "Resident Individuals who do not hold any other savings account in HDFC Bank"
    ],
    "benefits": [
      "Zero Minimum Balance criteria",
      "Free basic RuPay debit card",
      "4 free ATM withdrawals every month"
    ],
    "keyBenefits": [
      "Zero Minimum Balance criteria",
      "Free basic RuPay debit card",
      "4 free ATM withdrawals every month"
    ],
    "features": [
      "Free NetBanking & Mobile Banking",
      "No maintenance penalty"
    ],
    "bankingFeatures": [
      "Free NetBanking & Mobile Banking",
      "No maintenance penalty"
    ],
    "debit_card_relationships": [
      {
        "card_id": "hdfc-bank-hdfc-moneyback-debit-card",
        "relationship": "provided",
        "verification_status": "verified"
      }
    ]
  },
  {
    "id": 116,
    "product_id": "hdfc-nre-premium",
    "bank_id": "hdfc-bank",
    "bank_name": "HDFC Bank",
    "bank": "HDFC Bank",
    "logo": "HD",
    "variant_name": "HDFC NRE Premium Savings Account",
    "accountName": "HDFC NRE Premium Savings Account",
    "account_type": "NRI Savings",
    "accountType": "NRI Account",
    "target_segment": "Non-Resident Indians",
    "accountTypeBadges": [
      "NRI",
      "Tax Free",
      "Foreign Remittance"
    ],
    "interest_rate": "3.00% - 3.50% p.a.",
    "interestRate": "3.00% - 3.50% p.a.",
    "interestRateValue": 3.5,
    "minimum_balance": "₹10,000",
    "minimumBalance": "₹10,000",
    "minimumBalanceValue": 10000,
    "maximum_balance": "No Limit",
    "non_maintenance_penalty": "₹500/quarter",
    "nonMaintenanceCharges": "₹500/quarter",
    "interest_credit_frequency": "Quarterly",
    "isZeroBalance": false,
    "isOnlineOpening": true,
    "isStudent": false,
    "isSalary": false,
    "isSeniorCitizen": false,
    "isWomenSpecial": false,
    "isDigital": true,
    "isPremium": true,
    "isNRI": true,
    "rating": 4.7,
    "isPopular": false,
    "source": "https://www.hdfcbank.com/personal/save/accounts/savings-accounts",
    "officialSourceUrl": "https://www.hdfcbank.com/personal/save/accounts/savings-accounts",
    "as_of_date": "August 2026",
    "lastVerified": "August 2026",
    "information_status": "Verified",
    "description": "Tax-free interest account for NRIs allowing 100% repatriability of principal and interest earned back to overseas country.",
    "eligibility": [
      "Non-Resident Indians (NRIs) or Persons of Indian Origin (PIOs)"
    ],
    "benefits": [
      "100% Tax-free interest in India",
      "Full repatriability of funds",
      "Global access via HDFC EasyShop NRE Platinum Debit Card"
    ],
    "keyBenefits": [
      "100% Tax-free interest in India",
      "Full repatriability of funds",
      "Global access via HDFC EasyShop NRE Platinum Debit Card"
    ],
    "features": [
      "24/7 overseas remittance tracking",
      "Family mandate card facility in India"
    ],
    "bankingFeatures": [
      "24/7 overseas remittance tracking",
      "Family mandate card facility in India"
    ],
    "debit_card_relationships": [
      {
        "card_id": "hdfc-bank-hdfc-easyshop-platinum-debit-card",
        "relationship": "provided",
        "verification_status": "verified"
      }
    ]
  },
  {
    "id": 1021,
    "product_id": "icici-regular-savings",
    "bank_id": "icici-bank",
    "bank_name": "ICICI Bank",
    "bank": "ICICI Bank",
    "logo": "IC",
    "variant_name": "ICICI Regular Savings Account",
    "accountName": "ICICI Regular Savings Account",
    "account_type": "Regular Savings",
    "accountType": "Regular Savings",
    "target_segment": "General Public",
    "accountTypeBadges": [
      "Regular",
      "iMobile Banking",
      "Private Bank"
    ],
    "interest_rate": "3.00% - 3.50% p.a.",
    "interestRate": "3.00% - 3.50% p.a.",
    "interestRateValue": 3.5,
    "minimum_balance": "₹10,000",
    "minimumBalance": "₹10,000",
    "minimumBalanceValue": 10000,
    "maximum_balance": "No Limit",
    "non_maintenance_penalty": "₹500/month or 6% of shortfall (whichever is lower)",
    "nonMaintenanceCharges": "₹500/month or 6% of shortfall (whichever is lower)",
    "interest_credit_frequency": "Quarterly",
    "isZeroBalance": false,
    "isOnlineOpening": true,
    "isStudent": false,
    "isSalary": false,
    "isSeniorCitizen": false,
    "isWomenSpecial": false,
    "isDigital": true,
    "isPremium": false,
    "isNRI": false,
    "rating": 4.7,
    "isPopular": true,
    "source": "https://www.icici.bank.in/personal-banking/accounts/savings-account",
    "officialSourceUrl": "https://www.icici.bank.in/personal-banking/accounts/savings-account",
    "as_of_date": "August 2026",
    "lastVerified": "August 2026",
    "information_status": "Verified",
    "description": "Everyday banking power backed by iMobile Pay app, smart lock safety, and nationwide branch accessibility.",
    "eligibility": [
      "Resident Indian Individuals aged 18+"
    ],
    "benefits": [
      "Access to iMobile Pay app with 350+ financial services",
      "Smart Shopper Silver / Coral Debit Card options",
      "Free e-passbook and e-statements"
    ],
    "keyBenefits": [
      "Access to iMobile Pay app with 350+ financial services",
      "Smart Shopper Silver / Coral Debit Card options",
      "Free e-passbook and e-statements"
    ],
    "features": [
      "Video KYC instant online verification",
      "Money Manager automated budget expense tracker"
    ],
    "bankingFeatures": [
      "Video KYC instant online verification",
      "Money Manager automated budget expense tracker"
    ],
    "debit_card_relationships": [
      {
        "card_id": "icici-bank-icici-coral-debit-card",
        "relationship": "provided",
        "verification_status": "verified"
      },
      {
        "card_id": "icici-bank-icici-rubyx-debit-card",
        "relationship": "upgrade",
        "verification_status": "verified"
      }
    ]
  },
  {
    "id": 102,
    "product_id": "icici-mine-student",
    "bank_id": "icici-bank",
    "bank_name": "ICICI Bank",
    "bank": "ICICI Bank",
    "logo": "IC",
    "variant_name": "ICICI MINE Savings Account",
    "accountName": "ICICI MINE Savings Account",
    "account_type": "Digital Savings",
    "accountType": "Digital Savings",
    "target_segment": "Youth & Students (18-35 yrs)",
    "accountTypeBadges": [
      "Digital",
      "Youth",
      "Zero Balance"
    ],
    "interest_rate": "3.00% - 3.50% p.a.",
    "interestRate": "3.00% - 3.50% p.a.",
    "interestRateValue": 3.5,
    "minimum_balance": "₹0",
    "minimumBalance": "₹0",
    "minimumBalanceValue": 0,
    "maximum_balance": "No Limit",
    "non_maintenance_penalty": "Nil (Zero Balance Account)",
    "nonMaintenanceCharges": "Nil (Zero Balance Account)",
    "interest_credit_frequency": "Quarterly",
    "isZeroBalance": true,
    "isOnlineOpening": true,
    "isStudent": true,
    "isSalary": false,
    "isSeniorCitizen": false,
    "isWomenSpecial": false,
    "isDigital": true,
    "isPremium": false,
    "isNRI": false,
    "rating": 4.7,
    "isPopular": true,
    "source": "https://www.icici.bank.in/personal-banking/accounts/savings-account",
    "officialSourceUrl": "https://www.icici.bank.in/personal-banking/accounts/savings-account",
    "as_of_date": "August 2026",
    "lastVerified": "August 2026",
    "information_status": "Verified",
    "description": "India's first millennial-focused zero balance digital savings account with customizable debit cards, instant iMobile Pay setup, and online shopping cashbacks.",
    "eligibility": [
      "Resident Indian Individuals aged between 18 to 35 years",
      "Valid PAN Card & Aadhaar linked with mobile number"
    ],
    "benefits": [
      "100% Zero Minimum Balance Account for 18-35 age group",
      "Customizable iMobile Debit Card with instant cashback offers",
      "Instant account opening via Video KYC under 5 minutes",
      "Exclusive discounts on Myntra, Swiggy, Zomato & BookMyShow"
    ],
    "keyBenefits": [
      "100% Zero Minimum Balance Account for 18-35 age group",
      "Customizable iMobile Debit Card with instant cashback offers",
      "Instant account opening via Video KYC under 5 minutes",
      "Exclusive discounts on Myntra, Swiggy, Zomato & BookMyShow"
    ],
    "features": [
      "Instant UPI setup & Money Transfer via iMobile Pay",
      "Sub-accounts for budgeting & goal savings"
    ],
    "bankingFeatures": [
      "Instant UPI setup & Money Transfer via iMobile Pay",
      "Sub-accounts for budgeting & goal savings"
    ],
    "debit_card_relationships": [
      {
        "card_id": "icici-bank-icici-expressions-debit-card",
        "relationship": "provided",
        "verification_status": "verified"
      }
    ]
  },
  {
    "id": 1022,
    "product_id": "icici-salary-savings",
    "bank_id": "icici-bank",
    "bank_name": "ICICI Bank",
    "bank": "ICICI Bank",
    "logo": "IC",
    "variant_name": "ICICI Salary Savings Account",
    "accountName": "ICICI Salary Savings Account",
    "account_type": "Salary Savings",
    "accountType": "Salary",
    "target_segment": "Salaried Corporate Employees",
    "accountTypeBadges": [
      "Salary Special",
      "Zero Balance",
      "Overdraft"
    ],
    "interest_rate": "3.00% - 3.50% p.a.",
    "interestRate": "3.00% - 3.50% p.a.",
    "interestRateValue": 3.5,
    "minimum_balance": "₹0",
    "minimumBalance": "₹0",
    "minimumBalanceValue": 0,
    "maximum_balance": "No Limit",
    "non_maintenance_penalty": "Nil (As long as regular salary credit occurs)",
    "nonMaintenanceCharges": "Nil (As long as regular salary credit occurs)",
    "interest_credit_frequency": "Quarterly",
    "isZeroBalance": true,
    "isOnlineOpening": true,
    "isStudent": false,
    "isSalary": true,
    "isSeniorCitizen": false,
    "isWomenSpecial": false,
    "isDigital": true,
    "isPremium": true,
    "isNRI": false,
    "rating": 4.8,
    "isPopular": true,
    "source": "https://www.icici.bank.in/personal-banking/accounts/salary-account",
    "officialSourceUrl": "https://www.icici.bank.in/personal-banking/accounts/salary-account",
    "as_of_date": "August 2026",
    "lastVerified": "August 2026",
    "information_status": "Verified",
    "description": "Corporate salary account offering zero minimum balance, pre-approved personal loans, complimentary Titanium debit card, and instant salary overdraft.",
    "eligibility": [
      "Salaried Employees working with eligible corporate tie-ups"
    ],
    "benefits": [
      "Zero minimum balance maintenance requirement",
      "Instant Salary Overdraft facility up to 3x net monthly salary",
      "Complimentary ICICI Titanium / Platinum Salary Debit Card",
      "Free unlimited transactions at ICICI Bank ATMs"
    ],
    "keyBenefits": [
      "Zero minimum balance maintenance requirement",
      "Instant Salary Overdraft facility up to 3x net monthly salary",
      "Complimentary ICICI Titanium / Platinum Salary Debit Card",
      "Free unlimited transactions at ICICI Bank ATMs"
    ],
    "features": [
      "Pre-approved home loan and car loan rates",
      "Personal accident death cover up to ₹30 Lakhs"
    ],
    "bankingFeatures": [
      "Pre-approved home loan and car loan rates",
      "Personal accident death cover up to ₹30 Lakhs"
    ],
    "debit_card_relationships": [
      {
        "card_id": "icici-bank-icici-coral-debit-card",
        "relationship": "provided",
        "verification_status": "verified"
      }
    ]
  },
  {
    "id": 114,
    "product_id": "icici-advantage-woman",
    "bank_id": "icici-bank",
    "bank_name": "ICICI Bank",
    "bank": "ICICI Bank",
    "logo": "IC",
    "variant_name": "ICICI Advantage Woman Savings Account",
    "accountName": "ICICI Advantage Woman Savings Account",
    "account_type": "Women's Savings",
    "accountType": "Women Special",
    "target_segment": "Women",
    "accountTypeBadges": [
      "Women Special",
      "Cashback Deals",
      "Locker Discounts"
    ],
    "interest_rate": "3.00% - 3.50% p.a.",
    "interestRate": "3.00% - 3.50% p.a.",
    "interestRateValue": 3.5,
    "minimum_balance": "₹10,000",
    "minimumBalance": "₹10,000",
    "minimumBalanceValue": 10000,
    "maximum_balance": "No Limit",
    "non_maintenance_penalty": "₹500/month",
    "nonMaintenanceCharges": "₹500/month",
    "interest_credit_frequency": "Quarterly",
    "isZeroBalance": false,
    "isOnlineOpening": true,
    "isStudent": false,
    "isSalary": false,
    "isSeniorCitizen": false,
    "isWomenSpecial": true,
    "isDigital": true,
    "isPremium": false,
    "isNRI": false,
    "rating": 4.7,
    "isPopular": false,
    "source": "https://www.icici.bank.in/personal-banking/accounts/savings-account",
    "officialSourceUrl": "https://www.icici.bank.in/personal-banking/accounts/savings-account",
    "as_of_date": "August 2026",
    "lastVerified": "August 2026",
    "information_status": "Verified",
    "description": "Designed specifically for modern women, combining financial independence with everyday shopping discounts, healthcare offers, and locker concessions.",
    "eligibility": [
      "Resident Women Individuals aged 18 and above"
    ],
    "benefits": [
      "Custom Advantage Woman Debit Card with cashback on shopping & dining",
      "50% discount on locker rental for the first year",
      "Unlimited free transactions at ICICI Bank ATMs"
    ],
    "keyBenefits": [
      "Custom Advantage Woman Debit Card with cashback on shopping & dining",
      "50% discount on locker rental for the first year",
      "Unlimited free transactions at ICICI Bank ATMs"
    ],
    "features": [
      "Complimentary Cancer Cover insurance option",
      "iMobile Pay online account control"
    ],
    "bankingFeatures": [
      "Complimentary Cancer Cover insurance option",
      "iMobile Pay online account control"
    ],
    "debit_card_relationships": [
      {
        "card_id": "icici-bank-icici-coral-debit-card",
        "relationship": "provided",
        "verification_status": "verified"
      }
    ]
  },
  {
    "id": 1051,
    "product_id": "axis-regular-savings",
    "bank_id": "axis-bank",
    "bank_name": "Axis Bank",
    "bank": "Axis Bank",
    "logo": "AX",
    "variant_name": "Axis Regular Savings Account",
    "accountName": "Axis Regular Savings Account",
    "account_type": "Regular Savings",
    "accountType": "Regular Savings",
    "target_segment": "General Public",
    "accountTypeBadges": [
      "Regular",
      "Personalized",
      "Private Bank"
    ],
    "interest_rate": "3.00% - 3.50% p.a.",
    "interestRate": "3.00% - 3.50% p.a.",
    "interestRateValue": 3.5,
    "minimum_balance": "₹10,000",
    "minimumBalance": "₹10,000",
    "minimumBalanceValue": 10000,
    "maximum_balance": "No Limit",
    "non_maintenance_penalty": "₹500 or ₹10 per ₹100 of shortfall",
    "nonMaintenanceCharges": "₹500 or ₹10 per ₹100 of shortfall",
    "interest_credit_frequency": "Quarterly",
    "isZeroBalance": false,
    "isOnlineOpening": true,
    "isStudent": false,
    "isSalary": false,
    "isSeniorCitizen": false,
    "isWomenSpecial": false,
    "isDigital": true,
    "isPremium": false,
    "isNRI": false,
    "rating": 4.6,
    "isPopular": true,
    "source": "https://www.axisbank.com/retail/accounts/savings-account/easy-access-savings-account",
    "officialSourceUrl": "https://www.axisbank.com/retail/accounts/savings-account/easy-access-savings-account",
    "as_of_date": "August 2026",
    "lastVerified": "August 2026",
    "information_status": "Verified",
    "description": "Axis Easy Access regular savings account offering high-value digital deals, Online Rewards debit card, and Axis Mobile App control.",
    "eligibility": [
      "Resident Indian Individuals (Single or Joint operation)"
    ],
    "benefits": [
      "Online Rewards Debit Card with FLAT cashback on e-commerce",
      "Axis e-Debit card instant access upon Video KYC",
      "Free monthly e-statements"
    ],
    "keyBenefits": [
      "Online Rewards Debit Card with FLAT cashback on e-commerce",
      "Axis e-Debit card instant access upon Video KYC",
      "Free monthly e-statements"
    ],
    "features": [
      "100% paperless onboarding via ASAP Video KYC",
      "Grab Deals portal discounts on major merchants"
    ],
    "bankingFeatures": [
      "100% paperless onboarding via ASAP Video KYC",
      "Grab Deals portal discounts on major merchants"
    ],
    "debit_card_relationships": [
      {
        "card_id": "axis-bank-delight-debit-card",
        "relationship": "provided",
        "verification_status": "verified"
      },
      {
        "card_id": "axis-bank-priority-platinum-debit-card",
        "relationship": "upgrade",
        "verification_status": "verified"
      }
    ]
  },
  {
    "id": 105,
    "product_id": "axis-liberty",
    "bank_id": "axis-bank",
    "bank_name": "Axis Bank",
    "logo": "AX",
    "variant_name": "Axis Liberty Savings Account",
    "accountName": "Axis Liberty Savings Account",
    "account_type": "Lifestyle Savings",
    "accountType": "Lifestyle Savings",
    "target_segment": "Young Professionals & Lifestyle Shoppers",
    "accountTypeBadges": [
      "Lifestyle",
      "Cashback",
      "Vouchers"
    ],
    "interest_rate": "3.00% - 3.50% p.a.",
    "interestRate": "3.00% - 3.50% p.a.",
    "interestRateValue": 3.5,
    "minimum_balance": "₹25,000",
    "minimumBalance": "₹25,000",
    "minimumBalanceValue": 25000,
    "maximum_balance": "No Limit",
    "non_maintenance_penalty": "₹600/quarter",
    "nonMaintenanceCharges": "₹600/quarter",
    "interest_credit_frequency": "Quarterly",
    "isZeroBalance": false,
    "isOnlineOpening": true,
    "isStudent": false,
    "isSalary": true,
    "isSeniorCitizen": false,
    "isWomenSpecial": false,
    "isDigital": true,
    "isPremium": true,
    "isNRI": false,
    "rating": 4.8,
    "isPopular": true,
    "source": "https://www.axisbank.com/retail/accounts/savings-account/liberty-savings-account",
    "officialSourceUrl": "https://www.axisbank.com/retail/accounts/savings-account/liberty-savings-account",
    "as_of_date": "August 2026",
    "lastVerified": "August 2026",
    "information_status": "Verified",
    "description": "Lifestyle-centric account rewarding spends on food, entertainment, and fashion with ₹750 monthly vouchers and flat cashback.",
    "eligibility": [
      "Resident Indian Individuals",
      "Age: 18 years and above"
    ],
    "benefits": [
      "FLAT ₹750 gift vouchers monthly on spending ₹10,000 using Liberty Debit Card",
      "5% cashback on weekend food & entertainment spends",
      "Complimentary ₹20 Lakhs personal accident cover"
    ],
    "keyBenefits": [
      "FLAT ₹750 gift vouchers monthly on spending ₹10,000 using Liberty Debit Card",
      "5% cashback on weekend food & entertainment spends",
      "Complimentary ₹20 Lakhs personal accident cover"
    ],
    "features": [
      "Instant ASAP digital Video KYC",
      "Quarterly shopping milestone rewards"
    ],
    "bankingFeatures": [
      "Instant ASAP digital Video KYC",
      "Quarterly shopping milestone rewards"
    ],
    "debit_card_relationships": [
      {
        "card_id": "axis-bank-liberty-debit-card",
        "relationship": "provided",
        "verification_status": "verified"
      }
    ]
  },
  {
    "id": 117,
    "product_id": "axis-basic-small",
    "bank_id": "axis-bank",
    "bank_name": "Axis Bank",
    "logo": "AX",
    "variant_name": "Axis Basic Small Savings Account (BSBD)",
    "accountName": "Axis Basic Small Savings Account (BSBD)",
    "account_type": "BSBDA",
    "accountType": "Zero Balance",
    "target_segment": "Basic Banking",
    "accountTypeBadges": [
      "BSBDA",
      "Zero Balance",
      "No Maintenance Fee"
    ],
    "interest_rate": "3.00% - 3.50% p.a.",
    "interestRate": "3.00% - 3.50% p.a.",
    "interestRateValue": 3.5,
    "minimum_balance": "₹0",
    "minimumBalance": "₹0",
    "minimumBalanceValue": 0,
    "maximum_balance": "No Limit",
    "non_maintenance_penalty": "Nil (Protected under RBI BSBD Norms)",
    "nonMaintenanceCharges": "Nil (Protected under RBI BSBD Norms)",
    "interest_credit_frequency": "Quarterly",
    "isZeroBalance": true,
    "isOnlineOpening": true,
    "isStudent": true,
    "isSalary": false,
    "isSeniorCitizen": false,
    "isWomenSpecial": false,
    "isDigital": false,
    "isPremium": false,
    "isNRI": false,
    "rating": 4.4,
    "isPopular": false,
    "source": "https://www.axisbank.com/retail/accounts/savings-account/basic-savings-account",
    "officialSourceUrl": "https://www.axisbank.com/retail/accounts/savings-account/basic-savings-account",
    "as_of_date": "August 2026",
    "lastVerified": "August 2026",
    "information_status": "Verified",
    "description": "Zero maintenance fee account protecting low-income and first-time account holders with essential banking services.",
    "eligibility": [
      "All Resident Indian Individuals who do not hold another BSBD account in Axis Bank"
    ],
    "benefits": [
      "Zero AMB requirement",
      "Free basic RuPay debit card",
      "4 free ATM withdrawals per month"
    ],
    "keyBenefits": [
      "Zero AMB requirement",
      "Free basic RuPay debit card",
      "4 free ATM withdrawals per month"
    ],
    "features": [
      "Simple e-KYC Branch or Online onboarding",
      "Free Direct Benefit Transfer (DBT) government subsidy credits"
    ],
    "bankingFeatures": [
      "Simple e-KYC Branch or Online onboarding",
      "Free Direct Benefit Transfer (DBT) government subsidy credits"
    ],
    "debit_card_relationships": [
      {
        "card_id": "axis-bank-delight-debit-card",
        "relationship": "provided",
        "verification_status": "verified"
      }
    ]
  },
  {
    "id": 1052,
    "product_id": "axis-prestige",
    "bank_id": "axis-bank",
    "bank_name": "Axis Bank",
    "logo": "AX",
    "variant_name": "Axis Prestige Savings Account",
    "accountName": "Axis Prestige Savings Account",
    "account_type": "Premium Savings",
    "accountType": "Premium Savings",
    "target_segment": "HNI & Mass Affluent",
    "accountTypeBadges": [
      "Premium",
      "Lounge Access",
      "Movie Cashback"
    ],
    "interest_rate": "3.00% - 3.50% p.a.",
    "interestRate": "3.00% - 3.50% p.a.",
    "interestRateValue": 3.5,
    "minimum_balance": "₹75,000",
    "minimumBalance": "₹75,000",
    "minimumBalanceValue": 75000,
    "maximum_balance": "No Limit",
    "non_maintenance_penalty": "₹800/quarter",
    "nonMaintenanceCharges": "₹800/quarter",
    "interest_credit_frequency": "Quarterly",
    "isZeroBalance": false,
    "isOnlineOpening": true,
    "isStudent": false,
    "isSalary": true,
    "isSeniorCitizen": false,
    "isWomenSpecial": false,
    "isDigital": true,
    "isPremium": true,
    "isNRI": false,
    "rating": 4.8,
    "isPopular": false,
    "source": "https://www.axisbank.com/retail/accounts/savings-account/prestige-savings-account",
    "officialSourceUrl": "https://www.axisbank.com/retail/accounts/savings-account/prestige-savings-account",
    "as_of_date": "August 2026",
    "lastVerified": "August 2026",
    "information_status": "Verified",
    "description": "Premium banking tier offering dedicated relation support, Prestige debit card lounge perks, and Buy 1 Get 1 movie offers.",
    "eligibility": [
      "Resident Individuals maintaining AQB of ₹75,000 or salary credit of ₹1 Lakh/month"
    ],
    "benefits": [
      "Complimentary Axis Prestige Debit Card",
      "Buy 1 Get 1 Free movie tickets on Paytm Movies",
      "Free airport lounge access & priority banking desks"
    ],
    "keyBenefits": [
      "Complimentary Axis Prestige Debit Card",
      "Buy 1 Get 1 Free movie tickets on Paytm Movies",
      "Free airport lounge access & priority banking desks"
    ],
    "features": [
      "Preferential rates on loans & lockers",
      "Zero fee on NEFT/RTGS/IMPS"
    ],
    "bankingFeatures": [
      "Preferential rates on loans & lockers",
      "Zero fee on NEFT/RTGS/IMPS"
    ],
    "debit_card_relationships": [
      {
        "card_id": "axis-bank-priority-platinum-debit-card",
        "relationship": "provided",
        "verification_status": "verified"
      }
    ]
  },
  {
    "id": 1053,
    "product_id": "axis-senior-privilege",
    "bank_id": "axis-bank",
    "bank_name": "Axis Bank",
    "logo": "AX",
    "variant_name": "Axis Senior Privilege Savings Account",
    "accountName": "Axis Senior Privilege Savings Account",
    "account_type": "Senior Citizen",
    "accountType": "Senior Citizen",
    "target_segment": "Senior Citizens (60+ yrs)",
    "accountTypeBadges": [
      "Senior Citizen",
      "Health Perks",
      "Free Banking"
    ],
    "interest_rate": "3.00% - 3.50% p.a.",
    "interestRate": "3.00% - 3.50% p.a.",
    "interestRateValue": 3.5,
    "minimum_balance": "₹10,000",
    "minimumBalance": "₹10,000",
    "minimumBalanceValue": 10000,
    "maximum_balance": "No Limit",
    "non_maintenance_penalty": "₹450/quarter",
    "nonMaintenanceCharges": "₹450/quarter",
    "interest_credit_frequency": "Quarterly",
    "isZeroBalance": false,
    "isOnlineOpening": true,
    "isStudent": false,
    "isSalary": false,
    "isSeniorCitizen": true,
    "isWomenSpecial": false,
    "isDigital": true,
    "isPremium": false,
    "isNRI": false,
    "rating": 4.7,
    "isPopular": false,
    "source": "https://www.axisbank.com/retail/accounts/savings-account/senior-privilege-savings-account",
    "officialSourceUrl": "https://www.axisbank.com/retail/accounts/savings-account/senior-privilege-savings-account",
    "as_of_date": "August 2026",
    "lastVerified": "August 2026",
    "information_status": "Verified",
    "description": "Tailored account for senior citizens offering higher returns on fixed deposits, discount on healthcare diagnostics, and dedicated senior debit card.",
    "eligibility": [
      "Resident Senior Citizens aged 60 years and above"
    ],
    "benefits": [
      "Higher FD interest rate boost (+0.50% p.a.)",
      "Special discounts on Apollo Pharmacy & health checkups",
      "Complimentary Senior Privilege Debit Card"
    ],
    "keyBenefits": [
      "Higher FD interest rate boost (+0.50% p.a.)",
      "Special discounts on Apollo Pharmacy & health checkups",
      "Complimentary Senior Privilege Debit Card"
    ],
    "features": [
      "Priority customer care assistance",
      "Free quarterly physical account statements"
    ],
    "bankingFeatures": [
      "Priority customer care assistance",
      "Free quarterly physical account statements"
    ],
    "debit_card_relationships": [
      {
        "card_id": "axis-bank-rewards-plus-debit-card",
        "relationship": "provided",
        "verification_status": "verified"
      }
    ]
  },
  {
    "id": 1054,
    "product_id": "axis-future-stars-minor",
    "bank_id": "axis-bank",
    "bank_name": "Axis Bank",
    "logo": "AX",
    "variant_name": "Axis Future Stars Minor Savings Account",
    "accountName": "Axis Future Stars Savings Account",
    "account_type": "Minor Savings",
    "accountType": "Minor Savings",
    "target_segment": "Minors (Under 18 yrs)",
    "accountTypeBadges": [
      "Minor Special",
      "Kids Card",
      "Savings Habit"
    ],
    "interest_rate": "3.00% - 3.50% p.a.",
    "interestRate": "3.00% - 3.50% p.a.",
    "interestRateValue": 3.5,
    "minimum_balance": "₹2,500",
    "minimumBalance": "₹2,500",
    "minimumBalanceValue": 2500,
    "maximum_balance": "No Limit",
    "non_maintenance_penalty": "₹150/quarter",
    "nonMaintenanceCharges": "₹150/quarter",
    "interest_credit_frequency": "Quarterly",
    "isZeroBalance": false,
    "isOnlineOpening": false,
    "isStudent": true,
    "isSalary": false,
    "isSeniorCitizen": false,
    "isWomenSpecial": false,
    "isDigital": false,
    "isPremium": false,
    "isNRI": false,
    "rating": 4.5,
    "isPopular": false,
    "source": "https://www.axisbank.com/retail/accounts/savings-account/future-stars-savings-account",
    "officialSourceUrl": "https://www.axisbank.com/retail/accounts/savings-account/future-stars-savings-account",
    "as_of_date": "August 2026",
    "lastVerified": "August 2026",
    "information_status": "Verified",
    "description": "Account created for minors under 18 years operated under guardian guidance to encourage smart savings early.",
    "eligibility": [
      "Minors under 18 years represented by parent/guardian"
    ],
    "benefits": [
      "Custom Smart Pay Youth Debit Card for children aged 10+",
      "Low minimum balance requirement of ₹2,500",
      "Personal accident insurance cover for guardian"
    ],
    "keyBenefits": [
      "Custom Smart Pay Youth Debit Card for children aged 10+",
      "Low minimum balance requirement of ₹2,500",
      "Personal accident insurance cover for guardian"
    ],
    "features": [
      "Daily transaction caps for safety",
      "Auto-recurring deposit facility"
    ],
    "bankingFeatures": [
      "Daily transaction caps for safety",
      "Auto-recurring deposit facility"
    ],
    "debit_card_relationships": [
      {
        "card_id": "axis-bank-delight-debit-card",
        "relationship": "provided",
        "verification_status": "verified"
      }
    ]
  },
  {
    "id": 104,
    "product_id": "kotak-811-full-kyc",
    "bank_id": "kotak-mahindra-bank",
    "bank_name": "Kotak Mahindra Bank",
    "bank": "Kotak Mahindra Bank",
    "logo": "KO",
    "variant_name": "Kotak 811 Full KYC Zero Balance Account",
    "accountName": "Kotak 811 Full KYC Zero Balance Account",
    "account_type": "Zero Balance",
    "accountType": "Zero Balance",
    "target_segment": "Digital Natives & Youth",
    "accountTypeBadges": [
      "Zero Balance",
      "Digital",
      "Virtual Card"
    ],
    "interest_rate": "3.50% - 4.00% p.a.",
    "interestRate": "3.50% - 4.00% p.a.",
    "interestRateValue": 4,
    "minimum_balance": "₹0",
    "minimumBalance": "₹0",
    "minimumBalanceValue": 0,
    "maximum_balance": "No Limit",
    "non_maintenance_penalty": "Nil (Lifetime Zero Balance)",
    "nonMaintenanceCharges": "Nil (Lifetime Zero Balance)",
    "interest_credit_frequency": "Quarterly",
    "isZeroBalance": true,
    "isOnlineOpening": true,
    "isStudent": true,
    "isSalary": false,
    "isSeniorCitizen": false,
    "isWomenSpecial": false,
    "isDigital": true,
    "isPremium": false,
    "isNRI": false,
    "rating": 4.8,
    "isPopular": true,
    "source": "https://www.kotak811.bank.in/",
    "officialSourceUrl": "https://www.kotak811.bank.in/",
    "as_of_date": "August 2026",
    "lastVerified": "August 2026",
    "information_status": "Verified",
    "description": "India's premier digital zero balance account with instant Video KYC, free virtual debit card, and zero non-maintenance penalties for life.",
    "eligibility": [
      "Resident Indians aged 18 years and above",
      "Aadhaar & PAN mandatory"
    ],
    "benefits": [
      "Lifetime Zero Minimum Balance Account",
      "Free Virtual Visa Debit Card inside Kotak 811 App",
      "Earn up to 4.00% p.a. interest rate on daily balances",
      "Instant Video KYC completion in under 3 minutes"
    ],
    "keyBenefits": [
      "Lifetime Zero Minimum Balance Account",
      "Free Virtual Visa Debit Card inside Kotak 811 App",
      "Earn up to 4.00% p.a. interest rate on daily balances",
      "Instant Video KYC completion in under 3 minutes"
    ],
    "features": [
      "Scan & Pay free instant UPI transactions",
      "In-app shopping offers via KayMall"
    ],
    "bankingFeatures": [
      "Scan & Pay free instant UPI transactions",
      "In-app shopping offers via KayMall"
    ],
    "debit_card_relationships": [
      {
        "card_id": "kotak-mahindra-bank-kotak-811-debit-card",
        "relationship": "provided",
        "verification_status": "verified"
      }
    ]
  },
  {
    "id": 1041,
    "product_id": "kotak-811-edge",
    "bank_id": "kotak-mahindra-bank",
    "bank_name": "Kotak Mahindra Bank",
    "bank": "Kotak Mahindra Bank",
    "logo": "KO",
    "variant_name": "Kotak 811 Edge Savings Account",
    "accountName": "Kotak 811 Edge Savings Account",
    "account_type": "Regular Savings",
    "accountType": "Regular Savings",
    "target_segment": "General Public",
    "accountTypeBadges": [
      "Regular",
      "Physical Card",
      "Low AMB"
    ],
    "interest_rate": "3.50% - 4.00% p.a.",
    "interestRate": "3.50% - 4.00% p.a.",
    "interestRateValue": 4,
    "minimum_balance": "₹10,000",
    "minimumBalance": "₹10,000",
    "minimumBalanceValue": 10000,
    "maximum_balance": "No Limit",
    "non_maintenance_penalty": "₹500/quarter",
    "nonMaintenanceCharges": "₹500/quarter",
    "interest_credit_frequency": "Quarterly",
    "isZeroBalance": false,
    "isOnlineOpening": true,
    "isStudent": false,
    "isSalary": false,
    "isSeniorCitizen": false,
    "isWomenSpecial": false,
    "isDigital": true,
    "isPremium": false,
    "isNRI": false,
    "rating": 4.7,
    "isPopular": false,
    "source": "https://www.kotak811.bank.in/",
    "officialSourceUrl": "https://www.kotak811.bank.in/",
    "as_of_date": "August 2026",
    "lastVerified": "August 2026",
    "information_status": "Verified",
    "description": "Hybrid savings account combining digital 811 benefits with physical branch services and Classic debit card.",
    "eligibility": [
      "Resident Indian Individuals (Single/Joint)"
    ],
    "benefits": [
      "Physical Classic Debit Card bundled",
      "Free fund transfers via IMPS, NEFT & RTGS online",
      "Earn up to 4.00% p.a. interest rate"
    ],
    "keyBenefits": [
      "Physical Classic Debit Card bundled",
      "Free fund transfers via IMPS, NEFT & RTGS online",
      "Earn up to 4.00% p.a. interest rate"
    ],
    "features": [
      "Full branch banking access nationwide",
      "Chequebook facility provided"
    ],
    "bankingFeatures": [
      "Full branch banking access nationwide",
      "Chequebook facility provided"
    ],
    "debit_card_relationships": [
      {
        "card_id": "kotak-mahindra-bank-kotak-pro-debit-card",
        "relationship": "provided",
        "verification_status": "verified"
      }
    ]
  },
  {
    "id": 1042,
    "product_id": "kotak-811-super",
    "bank_id": "kotak-mahindra-bank",
    "bank_name": "Kotak Mahindra Bank",
    "bank": "Kotak Mahindra Bank",
    "logo": "KO",
    "variant_name": "Kotak 811 Super Savings Account",
    "accountName": "Kotak 811 Super Savings Account",
    "account_type": "High Yield Savings",
    "accountType": "Digital Savings",
    "target_segment": "High Yield Seekers",
    "accountTypeBadges": [
      "High Interest",
      "Platinum Card",
      "Cashback"
    ],
    "interest_rate": "3.50% - 4.00% p.a.",
    "interestRate": "3.50% - 4.00% p.a.",
    "interestRateValue": 4,
    "minimum_balance": "₹0",
    "minimumBalance": "₹0",
    "minimumBalanceValue": 0,
    "maximum_balance": "No Limit",
    "non_maintenance_penalty": "Nil (Zero balance with monthly deposit commitment)",
    "nonMaintenanceCharges": "Nil (Zero balance with monthly deposit commitment)",
    "interest_credit_frequency": "Quarterly",
    "isZeroBalance": true,
    "isOnlineOpening": true,
    "isStudent": false,
    "isSalary": false,
    "isSeniorCitizen": false,
    "isWomenSpecial": false,
    "isDigital": true,
    "isPremium": false,
    "isNRI": false,
    "rating": 4.8,
    "isPopular": true,
    "source": "https://www.kotak811.bank.in/",
    "officialSourceUrl": "https://www.kotak811.bank.in/",
    "as_of_date": "August 2026",
    "lastVerified": "August 2026",
    "information_status": "Verified",
    "description": "Supercharged zero balance account offering 1.5% cashback on debit card spends and higher transaction limits.",
    "eligibility": [
      "Resident Indians maintaining monthly auto-deposit of ₹5,000"
    ],
    "benefits": [
      "1.5% cashback on all online spends via Platinum Debit Card",
      "Zero AMB requirement",
      "Free unlimited online fund transfers"
    ],
    "keyBenefits": [
      "1.5% cashback on all online spends via Platinum Debit Card",
      "Zero AMB requirement",
      "Free unlimited online fund transfers"
    ],
    "features": [
      "Kotak Mobile App privilege access",
      "Instant e-KYC account setup"
    ],
    "bankingFeatures": [
      "Kotak Mobile App privilege access",
      "Instant e-KYC account setup"
    ],
    "debit_card_relationships": [
      {
        "card_id": "kotak-mahindra-bank-kotak-platinum-debit-card",
        "relationship": "provided",
        "verification_status": "verified"
      }
    ]
  },
  {
    "id": 1043,
    "product_id": "kotak-activemoney",
    "bank_id": "kotak-mahindra-bank",
    "bank_name": "Kotak Mahindra Bank",
    "bank": "Kotak Mahindra Bank",
    "logo": "KO",
    "variant_name": "Kotak ActiveMoney Savings Account",
    "accountName": "Kotak ActiveMoney Savings Account",
    "account_type": "Auto-Sweep Savings",
    "accountType": "Auto-Sweep",
    "target_segment": "High Liquidity Savers",
    "accountTypeBadges": [
      "7.00% FD Returns",
      "Flexi Sweep",
      "Popular"
    ],
    "interest_rate": "3.50% - 7.00% p.a.",
    "interestRate": "3.50% - 7.00% p.a.",
    "interestRateValue": 7,
    "minimum_balance": "₹10,000",
    "minimumBalance": "₹10,000",
    "minimumBalanceValue": 10000,
    "maximum_balance": "No Limit",
    "non_maintenance_penalty": "₹500/quarter",
    "nonMaintenanceCharges": "₹500/quarter",
    "interest_credit_frequency": "Quarterly",
    "isZeroBalance": false,
    "isOnlineOpening": true,
    "isStudent": false,
    "isSalary": false,
    "isSeniorCitizen": false,
    "isWomenSpecial": false,
    "isDigital": true,
    "isPremium": true,
    "isNRI": false,
    "rating": 4.9,
    "isPopular": true,
    "source": "https://www.kotak.bank.in/en/personal-banking/deposits/activmoney.html",
    "officialSourceUrl": "https://www.kotak.bank.in/en/personal-banking/deposits/activmoney.html",
    "as_of_date": "August 2026",
    "lastVerified": "August 2026",
    "information_status": "Verified",
    "description": "Earn FD interest rates up to 7.00% p.a. on surplus funds above threshold with automatic sweep-in and zero withdrawal penalty.",
    "eligibility": [
      "Resident Indian Individuals (Single / Joint)"
    ],
    "benefits": [
      "Earn up to 7.00% p.a. FD interest rate via auto-sweep",
      "Zero premature withdrawal penalty on auto-sweep FDs",
      "Kotak PayShopMore Debit Card bundled"
    ],
    "keyBenefits": [
      "Earn up to 7.00% p.a. FD interest rate via auto-sweep",
      "Zero premature withdrawal penalty on auto-sweep FDs",
      "Kotak PayShopMore Debit Card bundled"
    ],
    "features": [
      "Automatic sweep threshold of ₹25,000",
      "FD tenure default set to 180 days for maximum yield"
    ],
    "bankingFeatures": [
      "Automatic sweep threshold of ₹25,000",
      "FD tenure default set to 180 days for maximum yield"
    ],
    "debit_card_relationships": [
      {
        "card_id": "kotak-mahindra-bank-kotak-ace-debit-card",
        "relationship": "provided",
        "verification_status": "verified"
      }
    ]
  },
  {
    "id": 106,
    "product_id": "idfc-first-classic",
    "bank_id": "idfc-first-bank",
    "bank_name": "IDFC FIRST Bank",
    "bank": "IDFC FIRST Bank",
    "logo": "ID",
    "variant_name": "FIRST Classic Savings Account",
    "accountName": "FIRST Classic Savings Account",
    "account_type": "Savings Account",
    "accountType": "Regular Savings",
    "target_segment": "General Public",
    "accountTypeBadges": [
      "7% Interest",
      "Monthly Interest",
      "Zero Charges"
    ],
    "interest_rate": "3.00% - 7.00% p.a.",
    "interestRate": "3.00% - 7.00% p.a.",
    "interestRateValue": 7,
    "minimum_balance": "₹10,000",
    "minimumBalance": "₹10,000",
    "minimumBalanceValue": 10000,
    "maximum_balance": "No Limit",
    "non_maintenance_penalty": "Nil (Zero fee policy on 28+ basic banking services)",
    "nonMaintenanceCharges": "Nil (Zero fee policy on 28+ basic banking services)",
    "interest_credit_frequency": "Monthly",
    "isZeroBalance": false,
    "isOnlineOpening": true,
    "isStudent": false,
    "isSalary": false,
    "isSeniorCitizen": false,
    "isWomenSpecial": false,
    "isDigital": true,
    "isPremium": false,
    "isNRI": false,
    "rating": 4.8,
    "isPopular": true,
    "source": "https://www.idfcfirst.bank.in/personal-banking/accounts/savings-account",
    "officialSourceUrl": "https://www.idfcfirst.bank.in/personal-banking/accounts/savings-account",
    "as_of_date": "August 2026",
    "lastVerified": "August 2026",
    "information_status": "Verified",
    "description": "Industry-leading monthly interest payouts with zero fee policy on 28+ essential services including IMPS, ATM, & Chequebook.",
    "eligibility": [
      "Resident Indian Individual",
      "Age: 18 years and above"
    ],
    "benefits": [
      "Monthly Interest Credits directly into your savings account",
      "Earn up to 7.00% p.a. interest rate on balance slabs",
      "Zero fee policy on 28+ common banking services",
      "IDFC FIRST Classic Visa Debit Card with insurance covers"
    ],
    "keyBenefits": [
      "Monthly Interest Credits directly into your savings account",
      "Earn up to 7.00% p.a. interest rate on balance slabs",
      "Zero fee policy on 28+ common banking services",
      "IDFC FIRST Classic Visa Debit Card with insurance covers"
    ],
    "features": [
      "Instant Video KYC online account opening",
      "Free unlimited ATM transactions at any bank ATM in India"
    ],
    "bankingFeatures": [
      "Instant Video KYC online account opening",
      "Free unlimited ATM transactions at any bank ATM in India"
    ],
    "debit_card_relationships": [
      {
        "card_id": "idfc-first-bank-idfc-first-classic-debit-card",
        "relationship": "provided",
        "verification_status": "verified"
      }
    ]
  },
  {
    "id": 107,
    "product_id": "idfc-first-select",
    "bank_id": "idfc-first-bank",
    "bank_name": "IDFC FIRST Bank",
    "bank": "IDFC FIRST Bank",
    "logo": "ID",
    "variant_name": "FIRST Select Savings Account",
    "accountName": "FIRST Select Savings Account",
    "account_type": "Premium Savings",
    "accountType": "Premium Savings",
    "target_segment": "Mass Affluent & Professionals",
    "accountTypeBadges": [
      "7% Interest",
      "Lounge Access",
      "Visa Signature"
    ],
    "interest_rate": "3.00% - 7.00% p.a.",
    "interestRate": "3.00% - 7.00% p.a.",
    "interestRateValue": 7,
    "minimum_balance": "₹25,000",
    "minimumBalance": "₹25,000",
    "minimumBalanceValue": 25000,
    "maximum_balance": "No Limit",
    "non_maintenance_penalty": "Nil (Zero fee policy on 28+ services)",
    "nonMaintenanceCharges": "Nil (Zero fee policy on 28+ services)",
    "interest_credit_frequency": "Monthly",
    "isZeroBalance": false,
    "isOnlineOpening": true,
    "isStudent": false,
    "isSalary": true,
    "isSeniorCitizen": false,
    "isWomenSpecial": false,
    "isDigital": true,
    "isPremium": true,
    "isNRI": false,
    "rating": 4.9,
    "isPopular": true,
    "source": "https://www.idfcfirst.bank.in/personal-banking/accounts/savings-account",
    "officialSourceUrl": "https://www.idfcfirst.bank.in/personal-banking/accounts/savings-account",
    "as_of_date": "August 2026",
    "lastVerified": "August 2026",
    "information_status": "Verified",
    "description": "Premium ₹25,000 AMB tier savings account with monthly compounding interest, airport lounge access debit card, and zero fee policy.",
    "eligibility": [
      "Resident Indian Individuals",
      "Age: 18 years and above"
    ],
    "benefits": [
      "Monthly Interest Credits",
      "Complimentary FIRST Select Visa Signature Debit Card",
      "Free domestic airport lounge access (2 visits/quarter)",
      "Personal accident cover of ₹35 Lakhs & Air accident cover of ₹1 Crore"
    ],
    "keyBenefits": [
      "Monthly Interest Credits",
      "Complimentary FIRST Select Visa Signature Debit Card",
      "Free domestic airport lounge access (2 visits/quarter)",
      "Personal accident cover of ₹35 Lakhs & Air accident cover of ₹1 Crore"
    ],
    "features": [
      "Zero fee policy across all digital and branch banking services",
      "Free unlimited domestic ATM withdrawals"
    ],
    "bankingFeatures": [
      "Zero fee policy across all digital and branch banking services",
      "Free unlimited domestic ATM withdrawals"
    ],
    "debit_card_relationships": [
      {
        "card_id": "idfc-first-bank-idfc-first-select-debit-card",
        "relationship": "provided",
        "verification_status": "verified"
      }
    ]
  },
  {
    "id": 108,
    "product_id": "idfc-first-wealth",
    "bank_id": "idfc-first-bank",
    "bank_name": "IDFC FIRST Bank",
    "bank": "IDFC FIRST Bank",
    "logo": "ID",
    "variant_name": "FIRST Wealth Savings Account",
    "accountName": "FIRST Wealth Savings Account",
    "account_type": "Wealth Savings",
    "accountType": "Wealth Tier",
    "target_segment": "High Net-Worth Individuals (HNI)",
    "accountTypeBadges": [
      "Wealth Banking",
      "Visa Infinite",
      "Golf Access"
    ],
    "interest_rate": "3.00% - 7.25% p.a.",
    "interestRate": "3.00% - 7.25% p.a.",
    "interestRateValue": 7.25,
    "minimum_balance": "₹1,00,000",
    "minimumBalance": "₹1,00,000",
    "minimumBalanceValue": 100000,
    "maximum_balance": "No Limit",
    "non_maintenance_penalty": "Nil (Zero charges under IDFC FIRST transparent policy)",
    "nonMaintenanceCharges": "Nil (Zero charges under IDFC FIRST transparent policy)",
    "interest_credit_frequency": "Monthly",
    "isZeroBalance": false,
    "isOnlineOpening": true,
    "isStudent": false,
    "isSalary": false,
    "isSeniorCitizen": false,
    "isWomenSpecial": false,
    "isDigital": true,
    "isPremium": true,
    "isNRI": false,
    "rating": 5,
    "isPopular": true,
    "source": "https://www.idfcfirst.bank.in/personal-banking/accounts/savings-account",
    "officialSourceUrl": "https://www.idfcfirst.bank.in/personal-banking/accounts/savings-account",
    "as_of_date": "August 2026",
    "lastVerified": "August 2026",
    "information_status": "Verified",
    "description": "IDFC FIRST Bank's ultra-premium tier providing monthly interest payouts, dedicated wealth managers, Visa Infinite debit card, and golf privileges.",
    "eligibility": [
      "Resident Indian Individuals maintaining AMB of ₹1,00,000 or Relationship Value of ₹10 Lakhs"
    ],
    "benefits": [
      "Highest monthly interest credit earnings",
      "Complimentary FIRST Wealth Visa Infinite Debit Card",
      "Unlimited domestic airport lounge access + Spa access",
      "Complimentary Golf rounds & lessons at premium clubs"
    ],
    "keyBenefits": [
      "Highest monthly interest credit earnings",
      "Complimentary FIRST Wealth Visa Infinite Debit Card",
      "Unlimited domestic airport lounge access + Spa access",
      "Complimentary Golf rounds & lessons at premium clubs"
    ],
    "features": [
      "Dedicated Relationship Manager (RM)",
      "Zero cross-currency mark-up fees on overseas debit card spends"
    ],
    "bankingFeatures": [
      "Dedicated Relationship Manager (RM)",
      "Zero cross-currency mark-up fees on overseas debit card spends"
    ],
    "debit_card_relationships": [
      {
        "card_id": "idfc-first-bank-idfc-first-world-debit-card",
        "relationship": "provided",
        "verification_status": "verified"
      }
    ]
  },
  {
    "id": 109,
    "product_id": "idfc-first-senior",
    "bank_id": "idfc-first-bank",
    "bank_name": "IDFC FIRST Bank",
    "logo": "ID",
    "variant_name": "FIRST Senior Citizen Savings Account",
    "accountName": "FIRST Senior Citizen Savings Account",
    "account_type": "Senior Citizen",
    "accountType": "Senior Citizen",
    "target_segment": "Senior Citizens (60+ yrs)",
    "accountTypeBadges": [
      "Senior Privilege",
      "Monthly Payout",
      "Health Perks"
    ],
    "interest_rate": "3.00% - 7.00% p.a.",
    "interestRate": "3.00% - 7.00% p.a.",
    "interestRateValue": 7,
    "minimum_balance": "₹10,000",
    "minimumBalance": "₹10,000",
    "minimumBalanceValue": 10000,
    "maximum_balance": "No Limit",
    "non_maintenance_penalty": "Nil",
    "nonMaintenanceCharges": "Nil",
    "interest_credit_frequency": "Monthly",
    "isZeroBalance": false,
    "isOnlineOpening": true,
    "isStudent": false,
    "isSalary": false,
    "isSeniorCitizen": true,
    "isWomenSpecial": false,
    "isDigital": true,
    "isPremium": false,
    "isNRI": false,
    "rating": 4.9,
    "isPopular": false,
    "source": "https://www.idfcfirst.bank.in/personal-banking/accounts/savings-account/senior-citizens-savings-account",
    "officialSourceUrl": "https://www.idfcfirst.bank.in/personal-banking/accounts/savings-account/senior-citizens-savings-account",
    "as_of_date": "August 2026",
    "lastVerified": "August 2026",
    "information_status": "Verified",
    "description": "Monthly income flow for senior citizens through monthly interest credits, doorstep banking support, and zero fee structure.",
    "eligibility": [
      "Resident Senior Citizens aged 60 years and above"
    ],
    "benefits": [
      "Monthly Interest Income credited on 1st of every month",
      "Doorstep banking for cash pickup and cheque submission",
      "Free Senior Privilege Debit Card with health discounts"
    ],
    "keyBenefits": [
      "Monthly Interest Income credited on 1st of every month",
      "Doorstep banking for cash pickup and cheque submission",
      "Free Senior Privilege Debit Card with health discounts"
    ],
    "features": [
      "Priority teller desk service at all IDFC FIRST branches",
      "Free physical passbook & monthly statements"
    ],
    "bankingFeatures": [
      "Priority teller desk service at all IDFC FIRST branches",
      "Free physical passbook & monthly statements"
    ],
    "debit_card_relationships": [
      {
        "card_id": "idfc-first-bank-idfc-first-millennia-debit-card",
        "relationship": "provided",
        "verification_status": "verified"
      }
    ]
  },
  {
    "id": 110,
    "product_id": "au-digital-savings",
    "bank_id": "au-small-finance-bank",
    "bank_name": "AU Small Finance Bank",
    "bank": "AU Small Finance Bank",
    "logo": "AU",
    "variant_name": "AU Digital Savings Account",
    "accountName": "AU Digital Savings Account",
    "account_type": "Digital Savings",
    "accountType": "Digital Savings",
    "target_segment": "General Public",
    "accountTypeBadges": [
      "7.25% Interest",
      "Monthly Interest",
      "Video KYC"
    ],
    "interest_rate": "3.50% - 7.25% p.a.",
    "interestRate": "3.50% - 7.25% p.a.",
    "interestRateValue": 7.25,
    "minimum_balance": "₹0",
    "minimumBalance": "₹0",
    "minimumBalanceValue": 0,
    "maximum_balance": "No Limit",
    "non_maintenance_penalty": "Nil",
    "nonMaintenanceCharges": "Nil",
    "interest_credit_frequency": "Monthly",
    "isZeroBalance": true,
    "isOnlineOpening": true,
    "isStudent": false,
    "isSalary": false,
    "isSeniorCitizen": false,
    "isWomenSpecial": false,
    "isDigital": true,
    "isPremium": false,
    "isNRI": false,
    "rating": 4.7,
    "isPopular": false,
    "source": "https://www.aubank.in/personal-banking/accounts/savings-account/au-digital-savings-account",
    "officialSourceUrl": "https://www.aubank.in/personal-banking/accounts/savings-account/au-digital-savings-account",
    "as_of_date": "August 2026",
    "lastVerified": "August 2026",
    "information_status": "Verified",
    "description": "High interest rates up to 7.25% p.a. paid out monthly with 100% video KYC zero balance digital account setup.",
    "eligibility": [
      "Resident Indian Individuals aged 18+"
    ],
    "benefits": [
      "Monthly interest payout",
      "Earn up to 7.25% p.a. interest",
      "AU Royale / Platinum Debit Card bundled"
    ],
    "keyBenefits": [
      "Monthly interest payout",
      "Earn up to 7.25% p.a. interest",
      "AU Royale / Platinum Debit Card bundled"
    ],
    "features": [
      "AU 0101 Mobile Banking app access",
      "Zero paperwork onboarding"
    ],
    "bankingFeatures": [
      "AU 0101 Mobile Banking app access",
      "Zero paperwork onboarding"
    ],
    "debit_card_relationships": [
      {
        "card_id": "au-small-finance-bank-au-bank-platinum-debit-card",
        "relationship": "provided",
        "verification_status": "verified"
      }
    ]
  },
  {
    "id": 111,
    "product_id": "bob-advantage-savings",
    "bank_id": "bank-of-baroda",
    "bank_name": "Bank of Baroda",
    "bank": "Bank of Baroda",
    "logo": "BO",
    "variant_name": "bob Advantage Savings Account",
    "accountName": "bob Advantage Savings Account",
    "account_type": "Regular Savings",
    "accountType": "Regular Savings",
    "target_segment": "General Public",
    "accountTypeBadges": [
      "Government Bank",
      "bob World App"
    ],
    "interest_rate": "2.50% below ₹50 crore",
    "interestRate": "2.50% below ₹50 crore",
    "interestRateValue": 2.5,
    "interestSlabs": [
      "Below ₹50 crore: 2.50% p.a.",
      "₹50 crore to ₹500 crore: 2.75% p.a.",
      "₹500 crore to ₹1,000 crore: 3.50% p.a.",
      "₹1,000 crore to ₹2,000 crore: 4.50% p.a.",
      "₹2,000 crore and above: 4.75% p.a."
    ],
    "minimum_balance": "₹500 rural / ₹1,000 semi-urban / ₹2,000 urban/metro",
    "minimumBalance": "₹500 rural / ₹1,000 semi-urban / ₹2,000 urban/metro",
    "minimumBalanceValue": 500,
    "maximum_balance": "No Limit",
    "non_maintenance_penalty": "₹0 from 01-07-2025, but premium savings accounts are excluded",
    "nonMaintenanceCharges": "₹0 from 01-07-2025, but premium savings accounts are excluded",
    "interest_credit_frequency": "Quarterly",
    "isZeroBalance": false,
    "isOnlineOpening": true,
    "isStudent": false,
    "isSalary": false,
    "isSeniorCitizen": false,
    "isWomenSpecial": false,
    "isDigital": true,
    "isPremium": false,
    "isNRI": false,
    "rating": 4.5,
    "isPopular": false,
    "source": "https://bankofbaroda.bank.in/accounts/saving-accounts/bob-advantage-saving-account",
    "officialSourceUrl": "https://bankofbaroda.bank.in/accounts/saving-accounts/bob-advantage-saving-account",
    "as_of_date": "August 2026",
    "lastVerified": "August 2026",
    "information_status": "Verified",
    "description": "Public sector banking stability backed by bob World mobile app, ₹0 non-maintenance fee from 01-07-2025, and tiered interest rates.",
    "eligibility": [
      "Resident Individuals aged 18+"
    ],
    "benefits": [
      "₹0 non-maintenance from 01-07-2025 (standard branches)",
      "bob World App for digital payments",
      "Free 30 cheque leaves per year"
    ],
    "keyBenefits": [
      "₹0 non-maintenance from 01-07-2025 (standard branches)",
      "bob World App for digital payments",
      "Free 30 cheque leaves per year"
    ],
    "features": [
      "Pan-India branch network",
      "Direct Benefit Transfer support"
    ],
    "bankingFeatures": [
      "Pan-India branch network",
      "Direct Benefit Transfer support"
    ],
    "debit_card_relationships": [
      {
        "card_id": "bank-of-baroda-bob-rupay-platinum-debit-card",
        "relationship": "provided",
        "verification_status": "verified"
      }
    ]
  },
  {
    "id": 123,
    "product_id": "bob-super-savings",
    "bank_id": "bank-of-baroda",
    "bank_name": "Bank of Baroda",
    "bank": "Bank of Baroda",
    "logo": "BO",
    "variant_name": "Baroda Super Savings Account",
    "accountName": "Baroda Super Savings Account",
    "account_type": "Super Savings",
    "accountType": "Premium Savings",
    "target_segment": "Affluent Savers",
    "accountTypeBadges": [
      "Super Savings",
      "Premium Tier",
      "Public Sector Bank"
    ],
    "interest_rate": "2.50% below ₹50 crore",
    "interestRate": "2.50% below ₹50 crore",
    "interestRateValue": 2.5,
    "minimum_balance": "₹20,000",
    "minimumBalance": "₹20,000",
    "minimumBalanceValue": 20000,
    "maximum_balance": "No Limit",
    "non_maintenance_penalty": "₹50–₹400",
    "nonMaintenanceCharges": "₹50–₹400",
    "interest_credit_frequency": "Quarterly",
    "isZeroBalance": false,
    "isOnlineOpening": true,
    "isStudent": false,
    "isSalary": false,
    "isSeniorCitizen": false,
    "isWomenSpecial": false,
    "isDigital": true,
    "isPremium": true,
    "isNRI": false,
    "rating": 4.6,
    "isPopular": true,
    "source": "https://bankofbaroda.bank.in/accounts/saving-accounts/super-savings-personal-account",
    "officialSourceUrl": "https://bankofbaroda.bank.in/accounts/saving-accounts/super-savings-personal-account",
    "as_of_date": "August 2026",
    "lastVerified": "August 2026",
    "information_status": "Verified",
    "description": "Super savings account designed for affluent individuals maintaining ₹20,000 MAB with priority processing and premium debit card options.",
    "eligibility": [
      "Resident Individuals maintaining ₹20,000 MAB"
    ],
    "benefits": [
      "Enhanced daily ATM and transaction limits",
      "Priority customer assistance and concessions",
      "Free multicity cheques"
    ],
    "keyBenefits": [
      "Enhanced daily ATM and transaction limits",
      "Priority customer assistance and concessions",
      "Free multicity cheques"
    ],
    "features": [
      "bob World digital app banking",
      "Convenient auto-sweep facility"
    ],
    "bankingFeatures": [
      "bob World digital app banking",
      "Convenient auto-sweep facility"
    ],
    "debit_card_relationships": [
      {
        "card_id": "bank-of-baroda-bob-rupay-platinum-debit-card",
        "relationship": "provided",
        "verification_status": "verified"
      }
    ]
  },
  {
    "id": 124,
    "product_id": "bob-platinum-savings",
    "bank_id": "bank-of-baroda",
    "bank_name": "Bank of Baroda",
    "bank": "Bank of Baroda",
    "logo": "BO",
    "variant_name": "Baroda Platinum Savings Account",
    "accountName": "Baroda Platinum Savings Account",
    "account_type": "Platinum Savings",
    "accountType": "Premium Savings",
    "target_segment": "High Net-Worth Savers",
    "accountTypeBadges": [
      "Platinum Savings",
      "HNI Tier",
      "Public Sector Bank"
    ],
    "interest_rate": "2.50% below ₹50 crore",
    "interestRate": "2.50% below ₹50 crore",
    "interestRateValue": 2.5,
    "minimum_balance": "₹1,00,000",
    "minimumBalance": "₹1,00,000",
    "minimumBalanceValue": 100000,
    "maximum_balance": "No Limit",
    "non_maintenance_penalty": "₹50–₹334",
    "nonMaintenanceCharges": "₹50–₹334",
    "interest_credit_frequency": "Quarterly",
    "isZeroBalance": false,
    "isOnlineOpening": true,
    "isStudent": false,
    "isSalary": false,
    "isSeniorCitizen": false,
    "isWomenSpecial": false,
    "isDigital": true,
    "isPremium": true,
    "isNRI": false,
    "rating": 4.7,
    "isPopular": true,
    "source": "https://bankofbaroda.bank.in/accounts/saving-accounts/bob-platinum-saving-bank-account",
    "officialSourceUrl": "https://bankofbaroda.bank.in/accounts/saving-accounts/bob-platinum-saving-bank-account",
    "as_of_date": "August 2026",
    "lastVerified": "August 2026",
    "information_status": "Verified",
    "description": "High-tier savings proposition with ₹1,00,000 MAB, complimentary BoB Premium Debit Card, and dedicated relationship support.",
    "eligibility": [
      "Resident Individuals maintaining ₹1,00,000 MAB"
    ],
    "benefits": [
      "Complimentary BoB Premium Debit Card",
      "Unlimited free multicity cheque leaves",
      "Fee waivers on locker rent and demand drafts"
    ],
    "keyBenefits": [
      "Complimentary BoB Premium Debit Card",
      "Unlimited free multicity cheque leaves",
      "Fee waivers on locker rent and demand drafts"
    ],
    "features": [
      "bob World digital banking & priority desks",
      "Airport lounge perks on linked premium card"
    ],
    "bankingFeatures": [
      "bob World digital banking & priority desks",
      "Airport lounge perks on linked premium card"
    ],
    "debit_card_relationships": [
      {
        "card_id": "bank-of-baroda-bob-premium-debit-card",
        "relationship": "provided",
        "verification_status": "verified"
      }
    ]
  },
  {
    "id": 125,
    "product_id": "bob-masterstroke",
    "bank_id": "bank-of-baroda",
    "bank_name": "Bank of Baroda",
    "bank": "Bank of Baroda",
    "logo": "BO",
    "variant_name": "Baroda Masterstroke Savings Account",
    "accountName": "Baroda Masterstroke Savings Account",
    "account_type": "Ultra HNI Savings",
    "accountType": "Premium Savings",
    "target_segment": "Ultra HNI & Wealth Clients",
    "accountTypeBadges": [
      "Masterstroke",
      "Wealth",
      "Ultra HNI"
    ],
    "interest_rate": "2.50% below ₹50 crore",
    "interestRate": "2.50% below ₹50 crore",
    "interestRateValue": 2.5,
    "minimum_balance": "₹10 lakh OR ₹5 lakh + ₹10 lakh TD",
    "minimumBalance": "₹10 lakh OR ₹5 lakh + ₹10 lakh TD",
    "minimumBalanceValue": 1000000,
    "maximum_balance": "No Limit",
    "non_maintenance_penalty": "₹200–₹1,000",
    "nonMaintenanceCharges": "₹200–₹1,000",
    "interest_credit_frequency": "Quarterly",
    "isZeroBalance": false,
    "isOnlineOpening": true,
    "isStudent": false,
    "isSalary": false,
    "isSeniorCitizen": false,
    "isWomenSpecial": false,
    "isDigital": true,
    "isPremium": true,
    "isNRI": false,
    "rating": 4.8,
    "isPopular": true,
    "source": "https://bankofbaroda.bank.in/accounts/saving-accounts/bob-masterstroke-saving-bank-account",
    "officialSourceUrl": "https://bankofbaroda.bank.in/accounts/saving-accounts/bob-masterstroke-saving-bank-account",
    "as_of_date": "August 2026",
    "lastVerified": "August 2026",
    "information_status": "Verified",
    "description": "Ultra-affluent proposition requiring ₹10 lakh AQB or ₹5 lakh AQB + ₹10 lakh Term Deposit, with customized wealth management privileges.",
    "eligibility": [
      "High Net-worth Individuals maintaining ₹10L balance or ₹5L + ₹10L Term Deposit"
    ],
    "benefits": [
      "Concierge lifestyle and wealth relationship services",
      "Maximum transaction limits and premium card allocations",
      "Preferential rates across deposits and foreign remittances"
    ],
    "keyBenefits": [
      "Concierge lifestyle and wealth relationship services",
      "Maximum transaction limits and premium card allocations",
      "Preferential rates across deposits and foreign remittances"
    ],
    "features": [
      "Dedicated wealth desk & priority lounges",
      "Highest daily POS and ATM withdrawal thresholds"
    ],
    "bankingFeatures": [
      "Dedicated wealth desk & priority lounges",
      "Highest daily POS and ATM withdrawal thresholds"
    ],
    "debit_card_relationships": [
      {
        "card_id": "bank-of-baroda-bob-premium-debit-card",
        "relationship": "provided",
        "verification_status": "verified"
      }
    ]
  },
  {
    "id": 126,
    "product_id": "bob-masterstroke-lite",
    "bank_id": "bank-of-baroda",
    "bank_name": "Bank of Baroda",
    "bank": "Bank of Baroda",
    "logo": "BO",
    "variant_name": "Baroda Masterstroke LITE",
    "accountName": "Baroda Masterstroke LITE",
    "account_type": "Affluent Savings",
    "accountType": "Premium Savings",
    "target_segment": "Affluent Clients",
    "accountTypeBadges": [
      "Masterstroke LITE",
      "Priority",
      "Affluent"
    ],
    "interest_rate": "2.50% below ₹50 crore",
    "interestRate": "2.50% below ₹50 crore",
    "interestRateValue": 2.5,
    "minimum_balance": "₹5 lakh OR ₹2.5 lakh + ₹5 lakh TD",
    "minimumBalance": "₹5 lakh OR ₹2.5 lakh + ₹5 lakh TD",
    "minimumBalanceValue": 500000,
    "maximum_balance": "No Limit",
    "non_maintenance_penalty": "₹200–₹1,000",
    "nonMaintenanceCharges": "₹200–₹1,000",
    "interest_credit_frequency": "Quarterly",
    "isZeroBalance": false,
    "isOnlineOpening": true,
    "isStudent": false,
    "isSalary": false,
    "isSeniorCitizen": false,
    "isWomenSpecial": false,
    "isDigital": true,
    "isPremium": true,
    "isNRI": false,
    "rating": 4.6,
    "isPopular": false,
    "source": "https://bankofbaroda.bank.in/accounts/saving-accounts/bob-masterstroke-lite",
    "officialSourceUrl": "https://bankofbaroda.bank.in/accounts/saving-accounts/bob-masterstroke-lite",
    "as_of_date": "August 2026",
    "lastVerified": "August 2026",
    "information_status": "Verified",
    "description": "Mid-tier wealth proposition requiring ₹5 lakh balance or ₹2.5 lakh balance + ₹5 lakh Term Deposit, offering elite perks at accessible thresholds.",
    "eligibility": [
      "Affluent individuals maintaining ₹5L balance or ₹2.5L + ₹5L Term Deposit"
    ],
    "benefits": [
      "Priority banking desks & reduced fee structure",
      "Free electronic funds transfer across NEFT / RTGS / IMPS",
      "Access to premium debit cards"
    ],
    "keyBenefits": [
      "Priority banking desks & reduced fee structure",
      "Free electronic funds transfer across NEFT / RTGS / IMPS",
      "Access to premium debit cards"
    ],
    "features": [
      "bob World App priority digital interface",
      "Complimentary annual financial checkup"
    ],
    "bankingFeatures": [
      "bob World App priority digital interface",
      "Complimentary annual financial checkup"
    ],
    "debit_card_relationships": [
      {
        "card_id": "bank-of-baroda-bob-rupay-platinum-debit-card",
        "relationship": "provided",
        "verification_status": "verified"
      }
    ]
  },
  {
    "id": 127,
    "product_id": "bob-mahila-shakti",
    "bank_id": "bank-of-baroda",
    "bank_name": "Bank of Baroda",
    "bank": "Bank of Baroda",
    "logo": "BO",
    "variant_name": "Baroda Mahila Shakti Savings Account",
    "accountName": "Baroda Mahila Shakti Savings Account",
    "account_type": "Women's Savings Account",
    "accountType": "Women's",
    "target_segment": "Women",
    "accountTypeBadges": [
      "Women's",
      "Mahila Shakti",
      "Public Sector Bank"
    ],
    "interest_rate": "2.50% below ₹50 crore",
    "interestRate": "2.50% below ₹50 crore",
    "interestRateValue": 2.5,
    "minimum_balance": "₹3,000 Metro/Urban / ₹2,000 Semi-Urban / ₹1,000 Rural",
    "minimumBalance": "₹3,000 Metro/Urban / ₹2,000 Semi-Urban / ₹1,000 Rural",
    "minimumBalanceValue": 1000,
    "maximum_balance": "No Limit",
    "non_maintenance_penalty": "BoB page has conflicting figures; verify before publication.",
    "nonMaintenanceCharges": "BoB page has conflicting figures; verify before publication.",
    "interest_credit_frequency": "Quarterly",
    "isZeroBalance": false,
    "isOnlineOpening": true,
    "isStudent": false,
    "isSalary": false,
    "isSeniorCitizen": false,
    "isWomenSpecial": true,
    "isDigital": true,
    "isPremium": false,
    "isNRI": false,
    "rating": 4.4,
    "isPopular": true,
    "source": "https://bankofbaroda.bank.in/accounts/saving-accounts/bob-mahila-shakti-saving-account",
    "officialSourceUrl": "https://bankofbaroda.bank.in/accounts/saving-accounts/bob-mahila-shakti-saving-account",
    "as_of_date": "Not specified",
    "lastVerified": "Not specified",
    "information_status": "Not verified",
    "description": "Tailored savings account empowering women with accessible tiered MAB requirements and customized debit perks.",
    "eligibility": [
      "Women resident accounts (Single or Joint operation)"
    ],
    "benefits": [
      "Concession on retail loan interest rates",
      "Free SMS alerts and e-statements",
      "Dedicated RuPay Platinum debit card privileges"
    ],
    "keyBenefits": [
      "Concession on retail loan interest rates",
      "Free SMS alerts and e-statements",
      "Dedicated RuPay Platinum debit card privileges"
    ],
    "features": [
      "bob World App instant access",
      "Convenient recurring deposit tie-in"
    ],
    "bankingFeatures": [
      "bob World App instant access",
      "Convenient recurring deposit tie-in"
    ],
    "debit_card_relationships": [
      {
        "card_id": "bank-of-baroda-bob-rupay-platinum-debit-card",
        "relationship": "provided",
        "verification_status": "verified"
      }
    ]
  },
  {
    "id": 128,
    "product_id": "bob-lite-savings",
    "bank_id": "bank-of-baroda",
    "bank_name": "Bank of Baroda",
    "bank": "Bank of Baroda",
    "logo": "BO",
    "variant_name": "Baroda LITE Savings Account",
    "accountName": "Baroda LITE Savings Account",
    "account_type": "Zero Balance Savings",
    "accountType": "Zero Balance",
    "target_segment": "General Public & Beginners",
    "accountTypeBadges": [
      "LITE Savings",
      "Zero Balance",
      "Digital"
    ],
    "interest_rate": "2.50% below ₹50 crore",
    "interestRate": "2.50% below ₹50 crore",
    "interestRateValue": 2.5,
    "minimum_balance": "Zero",
    "minimumBalance": "Zero",
    "minimumBalanceValue": 0,
    "maximum_balance": "No Limit",
    "non_maintenance_penalty": "₹0 from 01-07-2025",
    "nonMaintenanceCharges": "₹0 from 01-07-2025",
    "interest_credit_frequency": "Quarterly",
    "isZeroBalance": true,
    "isOnlineOpening": true,
    "isStudent": true,
    "isSalary": false,
    "isSeniorCitizen": false,
    "isWomenSpecial": false,
    "isDigital": true,
    "isPremium": false,
    "isNRI": false,
    "rating": 4.5,
    "isPopular": true,
    "source": "https://bankofbaroda.bank.in/accounts/saving-accounts/bob-lite-savings-account",
    "officialSourceUrl": "https://bankofbaroda.bank.in/accounts/saving-accounts/bob-lite-savings-account",
    "as_of_date": "August 2026",
    "lastVerified": "August 2026",
    "information_status": "Verified",
    "description": "Zero balance savings account designed for everyday digital banking without minimum balance maintenance charges.",
    "eligibility": [
      "Resident Individual aged 18+"
    ],
    "benefits": [
      "Zero balance requirement with no non-maintenance fees",
      "Full digital banking via bob World app",
      "Complimentary RuPay Classic debit card"
    ],
    "keyBenefits": [
      "Zero balance requirement with no non-maintenance fees",
      "Full digital banking via bob World app",
      "Complimentary RuPay Classic debit card"
    ],
    "features": [
      "Instant Video KYC onboarding",
      "Free digital passbook & SMS alerts"
    ],
    "bankingFeatures": [
      "Instant Video KYC onboarding",
      "Free digital passbook & SMS alerts"
    ],
    "debit_card_relationships": [
      {
        "card_id": "bank-of-baroda-bob-rupay-classic-debit-card",
        "relationship": "provided",
        "verification_status": "verified"
      }
    ]
  },
  {
    "id": 129,
    "product_id": "bob-salary-classic",
    "bank_id": "bank-of-baroda",
    "bank_name": "Bank of Baroda",
    "bank": "Bank of Baroda",
    "logo": "BO",
    "variant_name": "Baroda Salary Classic Account",
    "accountName": "Baroda Salary Classic Account",
    "account_type": "Salary Account – Classic Tier",
    "accountType": "Salary",
    "target_segment": "Salaried Employees (₹10k–₹50k)",
    "accountTypeBadges": [
      "Salary Classic",
      "Zero Balance",
      "Salary Band ₹10k–₹50k"
    ],
    "salary_requirement": "₹10,000–₹50,000/month",
    "salaryRequirement": "₹10,000–₹50,000/month",
    "interest_rate": "2.50% below ₹50 crore",
    "interestRate": "2.50% below ₹50 crore",
    "interestRateValue": 2.5,
    "minimum_balance": "Zero",
    "minimumBalance": "Zero",
    "minimumBalanceValue": 0,
    "maximum_balance": "No Limit",
    "non_maintenance_penalty": "Nil (Salary Account)",
    "nonMaintenanceCharges": "Nil (Salary Account)",
    "interest_credit_frequency": "Quarterly",
    "isZeroBalance": true,
    "isOnlineOpening": true,
    "isStudent": false,
    "isSalary": true,
    "isSeniorCitizen": false,
    "isWomenSpecial": false,
    "isDigital": true,
    "isPremium": false,
    "isNRI": false,
    "rating": 4.5,
    "isPopular": false,
    "source": "https://bankofbaroda.bank.in/accounts/salary-accounts/bob-salary-classic-account",
    "officialSourceUrl": "https://bankofbaroda.bank.in/accounts/salary-accounts/bob-salary-classic-account",
    "as_of_date": "August 2026",
    "lastVerified": "August 2026",
    "information_status": "Verified",
    "description": "Zero balance salary account package for monthly salaries between ₹10,000 and ₹50,000 with overdraft and RuPay card perks.",
    "eligibility": [
      "Salaried employees with net salary ₹10,000 to ₹50,000/month"
    ],
    "benefits": [
      "Zero minimum balance requirement",
      "Overdraft facility up to ₹50,000",
      "Free accidental insurance on linked RuPay card"
    ],
    "keyBenefits": [
      "Zero minimum balance requirement",
      "Overdraft facility up to ₹50,000",
      "Free accidental insurance on linked RuPay card"
    ],
    "features": [
      "Corporate payroll integration",
      "bob World App instant salary credit alerts"
    ],
    "bankingFeatures": [
      "Corporate payroll integration",
      "bob World App instant salary credit alerts"
    ],
    "debit_card_relationships": [
      {
        "card_id": "bank-of-baroda-bob-rupay-platinum-debit-card",
        "relationship": "provided",
        "verification_status": "verified"
      }
    ]
  },
  {
    "id": 130,
    "product_id": "bob-salary-super",
    "bank_id": "bank-of-baroda",
    "bank_name": "Bank of Baroda",
    "bank": "Bank of Baroda",
    "logo": "BO",
    "variant_name": "Baroda Salary Super Account",
    "accountName": "Baroda Salary Super Account",
    "account_type": "Salary Account – Super Tier",
    "accountType": "Salary",
    "target_segment": "Salaried Employees (>₹50k–₹1L)",
    "accountTypeBadges": [
      "Salary Super",
      "Zero Balance",
      "Salary Band >₹50k–₹1L"
    ],
    "salary_requirement": ">₹50,000–₹1,00,000/month",
    "salaryRequirement": ">₹50,000–₹1,00,000/month",
    "interest_rate": "2.50% below ₹50 crore",
    "interestRate": "2.50% below ₹50 crore",
    "interestRateValue": 2.5,
    "minimum_balance": "Zero",
    "minimumBalance": "Zero",
    "minimumBalanceValue": 0,
    "maximum_balance": "No Limit",
    "non_maintenance_penalty": "Nil (Salary Account)",
    "nonMaintenanceCharges": "Nil (Salary Account)",
    "interest_credit_frequency": "Quarterly",
    "isZeroBalance": true,
    "isOnlineOpening": true,
    "isStudent": false,
    "isSalary": true,
    "isSeniorCitizen": false,
    "isWomenSpecial": false,
    "isDigital": true,
    "isPremium": false,
    "isNRI": false,
    "rating": 4.6,
    "isPopular": true,
    "source": "https://bankofbaroda.bank.in/accounts/salary-accounts/bob-salary-super-account",
    "officialSourceUrl": "https://bankofbaroda.bank.in/accounts/salary-accounts/bob-salary-super-account",
    "as_of_date": "August 2026",
    "lastVerified": "August 2026",
    "information_status": "Verified",
    "description": "Executive salary account for monthly salaries between ₹50,000 and ₹1,00,000 featuring higher overdraft limits and Platinum debit card perks.",
    "eligibility": [
      "Salaried employees with net salary >₹50,000 to ₹1,00,000/month"
    ],
    "benefits": [
      "Zero minimum balance requirement",
      "Higher overdraft facility up to ₹1,50,000",
      "Free multicity cheques & demand drafts"
    ],
    "keyBenefits": [
      "Zero minimum balance requirement",
      "Higher overdraft facility up to ₹1,50,000",
      "Free multicity cheques & demand drafts"
    ],
    "features": [
      "Priority customer service",
      "Auto-sweep into term deposits"
    ],
    "bankingFeatures": [
      "Priority customer service",
      "Auto-sweep into term deposits"
    ],
    "debit_card_relationships": [
      {
        "card_id": "bank-of-baroda-bob-rupay-platinum-debit-card",
        "relationship": "provided",
        "verification_status": "verified"
      }
    ]
  },
  {
    "id": 131,
    "product_id": "bob-salary-premium",
    "bank_id": "bank-of-baroda",
    "bank_name": "Bank of Baroda",
    "bank": "Bank of Baroda",
    "logo": "BO",
    "variant_name": "Baroda Salary Premium Account",
    "accountName": "Baroda Salary Premium Account",
    "account_type": "Salary Account – Premium Tier",
    "accountType": "Salary",
    "target_segment": "Senior Executives (>₹1L–₹2L)",
    "accountTypeBadges": [
      "Salary Premium",
      "Zero Balance",
      "Salary Band >₹1L–₹2L"
    ],
    "salary_requirement": ">₹1,00,000–₹2,00,000/month",
    "salaryRequirement": ">₹1,00,000–₹2,00,000/month",
    "interest_rate": "2.50% below ₹50 crore",
    "interestRate": "2.50% below ₹50 crore",
    "interestRateValue": 2.5,
    "minimum_balance": "Zero",
    "minimumBalance": "Zero",
    "minimumBalanceValue": 0,
    "maximum_balance": "No Limit",
    "non_maintenance_penalty": "Nil (Salary Account)",
    "nonMaintenanceCharges": "Nil (Salary Account)",
    "interest_credit_frequency": "Quarterly",
    "isZeroBalance": true,
    "isOnlineOpening": true,
    "isStudent": false,
    "isSalary": true,
    "isSeniorCitizen": false,
    "isWomenSpecial": false,
    "isDigital": true,
    "isPremium": true,
    "isNRI": false,
    "rating": 4.7,
    "isPopular": true,
    "source": "https://bankofbaroda.bank.in/accounts/salary-accounts/bob-salary-premium-account",
    "officialSourceUrl": "https://bankofbaroda.bank.in/accounts/salary-accounts/bob-salary-premium-account",
    "as_of_date": "August 2026",
    "lastVerified": "August 2026",
    "information_status": "Verified",
    "description": "Premium salary package for corporate leaders earning >₹1,00,000 to ₹2,00,000/month with zero balance rules, complimentary BoB Premium card, and loan discounts.",
    "eligibility": [
      "Corporate executives with net monthly salary >₹1,00,000 to ₹2,00,000"
    ],
    "benefits": [
      "Zero balance requirement",
      "Complimentary BoB Premium Debit Card with lounge access",
      "Concession on home & car loan processing charges"
    ],
    "keyBenefits": [
      "Zero balance requirement",
      "Complimentary BoB Premium Debit Card with lounge access",
      "Concession on home & car loan processing charges"
    ],
    "features": [
      "Dedicated relationship manager desk",
      "Unlimited transactions at all domestic ATMs"
    ],
    "bankingFeatures": [
      "Dedicated relationship manager desk",
      "Unlimited transactions at all domestic ATMs"
    ],
    "debit_card_relationships": [
      {
        "card_id": "bank-of-baroda-bob-premium-debit-card",
        "relationship": "provided",
        "verification_status": "verified"
      }
    ]
  },
  {
    "id": 132,
    "product_id": "bob-salary-privilege",
    "bank_id": "bank-of-baroda",
    "bank_name": "Bank of Baroda",
    "bank": "Bank of Baroda",
    "logo": "BO",
    "variant_name": "Baroda Salary Privilege Account",
    "accountName": "Baroda Salary Privilege Account",
    "account_type": "Salary Account – Privilege Tier",
    "accountType": "Salary",
    "target_segment": "Top Management (>₹2L)",
    "accountTypeBadges": [
      "Salary Privilege",
      "Zero Balance",
      "Salary Band >₹2L"
    ],
    "salary_requirement": ">₹2,00,000/month",
    "salaryRequirement": ">₹2,00,000/month",
    "interest_rate": "2.50% below ₹50 crore",
    "interestRate": "2.50% below ₹50 crore",
    "interestRateValue": 2.5,
    "minimum_balance": "Zero",
    "minimumBalance": "Zero",
    "minimumBalanceValue": 0,
    "maximum_balance": "No Limit",
    "non_maintenance_penalty": "Nil (Salary Account)",
    "nonMaintenanceCharges": "Nil (Salary Account)",
    "interest_credit_frequency": "Quarterly",
    "isZeroBalance": true,
    "isOnlineOpening": true,
    "isStudent": false,
    "isSalary": true,
    "isSeniorCitizen": false,
    "isWomenSpecial": false,
    "isDigital": true,
    "isPremium": true,
    "isNRI": false,
    "rating": 4.8,
    "isPopular": true,
    "source": "https://bankofbaroda.bank.in/accounts/salary-accounts/bob-salary-privilege-account",
    "officialSourceUrl": "https://bankofbaroda.bank.in/accounts/salary-accounts/bob-salary-privilege-account",
    "as_of_date": "August 2026",
    "lastVerified": "August 2026",
    "information_status": "Verified",
    "description": "Pinnacle salary proposition for CXOs and business heads with monthly salary >₹2,00,000 offering supreme zero-balance lifestyle privileges.",
    "eligibility": [
      "Corporate leaders and CXOs with net monthly salary >₹2,00,000"
    ],
    "benefits": [
      "Zero balance requirement",
      "Overdraft up to ₹3,00,000",
      "Complimentary BoB Premium Debit Card with lounge access & highest limits"
    ],
    "keyBenefits": [
      "Zero balance requirement",
      "Overdraft up to ₹3,00,000",
      "Complimentary BoB Premium Debit Card with lounge access & highest limits"
    ],
    "features": [
      "Private banking concierge assistance",
      "Zero charges across domestic & international banking transactions"
    ],
    "bankingFeatures": [
      "Private banking concierge assistance",
      "Zero charges across domestic & international banking transactions"
    ],
    "debit_card_relationships": [
      {
        "card_id": "bank-of-baroda-bob-premium-debit-card",
        "relationship": "provided",
        "verification_status": "verified"
      }
    ]
  },
  {
    "id": 112,
    "product_id": "indusind-privilege-savings",
    "bank_id": "indusind-bank",
    "bank_name": "IndusInd Bank",
    "bank": "IndusInd Bank",
    "logo": "IN",
    "variant_name": "IndusInd Privilege Savings Account",
    "accountName": "IndusInd Privilege Savings Account",
    "account_type": "Premium Savings",
    "accountType": "Premium Savings",
    "target_segment": "Mass Affluent",
    "accountTypeBadges": [
      "My Account Number",
      "Signature Perks"
    ],
    "interest_rate": "3.50% - 6.75% p.a.",
    "interestRate": "3.50% - 6.75% p.a.",
    "interestRateValue": 6.75,
    "minimum_balance": "₹10,000",
    "minimumBalance": "₹10,000",
    "minimumBalanceValue": 10000,
    "maximum_balance": "No Limit",
    "non_maintenance_penalty": "₹450/quarter",
    "nonMaintenanceCharges": "₹450/quarter",
    "interest_credit_frequency": "Quarterly",
    "isZeroBalance": false,
    "isOnlineOpening": true,
    "isStudent": false,
    "isSalary": false,
    "isSeniorCitizen": false,
    "isWomenSpecial": false,
    "isDigital": true,
    "isPremium": true,
    "isNRI": false,
    "rating": 4.7,
    "isPopular": false,
    "source": "https://www.indusind.com/in/en/personal/accounts/savings-account/indus-privilege.html",
    "officialSourceUrl": "https://www.indusind.com/in/en/personal/accounts/savings-account/indus-privilege.html",
    "as_of_date": "August 2026",
    "lastVerified": "August 2026",
    "information_status": "Verified",
    "description": "Choose your own account number with IndusInd Privilege savings account offering Signature Debit Card and movie discounts.",
    "eligibility": [
      "Resident Individuals aged 18+"
    ],
    "benefits": [
      "Custom Account Number of your choice (Mobile number, birth date, etc.)",
      "IndusInd Signature Debit Card bundled",
      "BookMyShow BOGO movie deals"
    ],
    "keyBenefits": [
      "Custom Account Number of your choice (Mobile number, birth date, etc.)",
      "IndusInd Signature Debit Card bundled",
      "BookMyShow BOGO movie deals"
    ],
    "features": [
      "Doorstep banking services",
      "Free unlimited fund transfers online"
    ],
    "bankingFeatures": [
      "Doorstep banking services",
      "Free unlimited fund transfers online"
    ],
    "debit_card_relationships": [
      {
        "card_id": "indusind-bank-indusind-platinum-debit-card",
        "relationship": "provided",
        "verification_status": "verified"
      }
    ]
  },
  {
    "id": 113,
    "product_id": "fi-money-smart-digital",
    "bank_id": "fi-money",
    "bank_name": "Fi Money",
    "bank": "Fi Money",
    "logo": "FI",
    "variant_name": "Fi Money Smart Digital Savings Account",
    "accountName": "Fi Money Smart Digital Savings Account",
    "account_type": "Neobank Savings",
    "accountType": "Zero Balance",
    "target_segment": "Tech Professionals & Millennial Freelancers",
    "accountTypeBadges": [
      "Zero Balance",
      "Zero Forex",
      "Neobank"
    ],
    "interest_rate": "3.00% - 7.00% p.a.",
    "interestRate": "3.00% - 7.00% p.a.",
    "interestRateValue": 7,
    "minimum_balance": "₹0",
    "minimumBalance": "₹0",
    "minimumBalanceValue": 0,
    "maximum_balance": "No Limit",
    "non_maintenance_penalty": "Nil",
    "nonMaintenanceCharges": "Nil",
    "interest_credit_frequency": "Quarterly",
    "isZeroBalance": true,
    "isOnlineOpening": true,
    "isStudent": true,
    "isSalary": false,
    "isSeniorCitizen": false,
    "isWomenSpecial": false,
    "isDigital": true,
    "isPremium": false,
    "isNRI": false,
    "rating": 4.8,
    "isPopular": true,
    "source": "https://fi.money/features/savings-account",
    "officialSourceUrl": "https://fi.money/features/savings-account",
    "as_of_date": "August 2026",
    "lastVerified": "August 2026",
    "information_status": "Verified",
    "description": "Digital zero balance savings account in partnership with Federal Bank offering zero forex markup, smart automated savings jars, and Fi Visa Platinum card.",
    "eligibility": [
      "Resident Working Professionals & Individuals with Aadhaar & PAN"
    ],
    "benefits": [
      "Zero Minimum Balance Account",
      "Zero Forex Markup on international online spends & travel",
      "Smart Jars for automatic habit-based savings"
    ],
    "keyBenefits": [
      "Zero Minimum Balance Account",
      "Zero Forex Markup on international online spends & travel",
      "Smart Jars for automatic habit-based savings"
    ],
    "features": [
      "FIT Rules automated savings triggers",
      "Connected banking & expense analyzer"
    ],
    "bankingFeatures": [
      "FIT Rules automated savings triggers",
      "Connected banking & expense analyzer"
    ],
    "debit_card_relationships": [
      {
        "card_id": "fi-money-fi-debit-card",
        "relationship": "provided",
        "verification_status": "verified"
      }
    ]
  },
  {
    "id": 1061,
    "product_id": "icici-savings-privilege",
    "bank_id": "icici",
    "bank_name": "ICICI Bank",
    "bank": "ICICI Bank",
    "logo": "IC",
    "variant_name": "ICICI Bank Savings Account & Privilege Banking",
    "accountName": "ICICI Bank Savings Account & Privilege Banking",
    "account_type": "Regular Savings",
    "accountType": "Regular Savings",
    "target_segment": "General Public, HNI & Senior Citizens",
    "accountTypeBadges": [
      "Regular Savings",
      "Privilege Tiers",
      "Senior Citizen",
      "3-in-1 Account"
    ],
    "interest_rate": "3.00% - 3.50% p.a.",
    "interestRate": "3.00% - 3.50% p.a.",
    "interestRateValue": 3.5,
    "minimum_balance": "₹10,000 (Metro/Urban)",
    "minimumBalance": "₹10,000 (Metro/Urban)",
    "minimumBalanceValue": 10000,
    "maximum_balance": "No Limit",
    "non_maintenance_penalty": "6% of MAB shortfall or max ₹500/month",
    "nonMaintenanceCharges": "6% of MAB shortfall or max ₹500/month",
    "interest_credit_frequency": "Quarterly",
    "isZeroBalance": false,
    "isOnlineOpening": true,
    "isStudent": false,
    "isSalary": false,
    "isSeniorCitizen": true,
    "isWomenSpecial": false,
    "isDigital": true,
    "isPremium": true,
    "isNRI": false,
    "rating": 4.8,
    "isPopular": true,
    "source": "https://www.icici.bank.in/personal-banking/accounts/savings-account",
    "officialSourceUrl": "https://www.icici.bank.in/personal-banking/accounts/savings-account",
    "as_of_date": "August 2026",
    "lastVerified": "August 2026",
    "information_status": "Verified",
    "description": "Explore savings account requirements, privilege banking tiers, senior citizen benefits, debit-card benefits and account charges in one place.",
    "eligibility": [
      "Resident Indian Individual",
      "Age: 18 years and above (Age 60+ for Senior Citizen Tier)",
      "Single or Joint Account operation"
    ],
    "benefits": [
      "Monthly Average Balance (MAB): ₹10,000 (Metro/Urban) / ₹5,000 (Semi-Urban) / ₹2,000 (Rural)",
      "3-in-1 Account: Integrated Savings + Demat + Trading accounts",
      "Debit Card Tiering: Smart Shopper Gold, Coral, Sapphiro & Private Banking variants",
      "24×7 iMobile App banking with instant Video KYC",
      "Air Accidental Death Insurance cover up to ₹3 Crores"
    ],
    "keyBenefits": [
      "Monthly Average Balance (MAB): ₹10,000 (Metro/Urban) / ₹5,000 (Semi-Urban) / ₹2,000 (Rural)",
      "3-in-1 Account: Integrated Savings + Demat + Trading accounts",
      "Debit Card Tiering: Smart Shopper Gold, Coral, Sapphiro & Private Banking variants",
      "24×7 iMobile App banking with instant Video KYC",
      "Air Accidental Death Insurance cover up to ₹3 Crores"
    ],
    "features": [
      "24x7 iMobile Pay & Retail Internet Banking (RIB) digital access",
      "Select, Wealth Management & Private Banking Privilege Relationship Tiers",
      "Senior Citizen Savings Tier with doorstep banking at no additional cost",
      "Complimentary Airport & Railway Lounge Access on privilege debit cards"
    ],
    "bankingFeatures": [
      "24x7 iMobile Pay & Retail Internet Banking (RIB) digital access",
      "Select, Wealth Management & Private Banking Privilege Relationship Tiers",
      "Senior Citizen Savings Tier with doorstep banking at no additional cost",
      "Complimentary Airport & Railway Lounge Access on privilege debit cards"
    ],
    "debit_card_relationships": [
      {
        "card_id": "icici-coral-debit-card",
        "relationship": "provided",
        "verification_status": "verified"
      },
      {
        "card_id": "icici-sapphiro-debit-card",
        "relationship": "optional",
        "verification_status": "verified"
      },
      {
        "card_id": "icici-private-banking-debit-card",
        "relationship": "optional",
        "verification_status": "verified"
      },
      {
        "card_id": "icici-smart-shopper-gold-debit-card",
        "relationship": "provided",
        "verification_status": "verified"
      }
    ]
  },
  {
    "id": 1062,
    "product_id": "icici-senior-citizen-savings",
    "bank_id": "icici",
    "bank_name": "ICICI Bank",
    "bank": "ICICI Bank",
    "logo": "IC",
    "variant_name": "ICICI Senior Citizen Savings Account",
    "accountName": "ICICI Senior Citizen Savings Account",
    "account_type": "Senior Citizen",
    "accountType": "Senior Citizen",
    "target_segment": "Senior Citizens (Age 60+)",
    "accountTypeBadges": [
      "Senior Citizen",
      "Zero Cost Banking",
      "Doorstep Banking"
    ],
    "interest_rate": "3.00% - 3.50% p.a. + FD Bonus",
    "interestRate": "3.00% - 3.50% p.a. + FD Bonus",
    "interestRateValue": 3.5,
    "minimum_balance": "₹15,000",
    "minimumBalance": "₹15,000",
    "minimumBalanceValue": 15000,
    "maximum_balance": "No Limit",
    "non_maintenance_penalty": "6% of MAB shortfall or max ₹500/month",
    "nonMaintenanceCharges": "6% of MAB shortfall or max ₹500/month",
    "interest_credit_frequency": "Quarterly",
    "isZeroBalance": false,
    "isOnlineOpening": true,
    "isStudent": false,
    "isSalary": false,
    "isSeniorCitizen": true,
    "isWomenSpecial": false,
    "isDigital": true,
    "isPremium": false,
    "isNRI": false,
    "rating": 4.8,
    "isPopular": true,
    "source": "https://www.icici.bank.in/personal-banking/accounts/savings-account",
    "officialSourceUrl": "https://www.icici.bank.in/personal-banking/accounts/savings-account",
    "as_of_date": "August 2026",
    "lastVerified": "August 2026",
    "information_status": "Verified",
    "description": "Tailored savings account for senior citizens featuring All Banking Services at no cost*, doorstep banking, priority branch assistance, and SCSS government-backed investments.",
    "eligibility": [
      "Resident Senior Citizens",
      "Age: 60 years and above"
    ],
    "benefits": [
      "All Banking Services at no cost*",
      "Doorstep Banking with no additional cost for cash pickup & cheque collection",
      "Priority assistance at branches and dedicated 1800 1080 helpline",
      "SCSS government-backed scheme with tax benefits + additional FD interest rate"
    ],
    "keyBenefits": [
      "All Banking Services at no cost*",
      "Doorstep Banking with no additional cost for cash pickup & cheque collection",
      "Priority assistance at branches and dedicated 1800 1080 helpline",
      "SCSS government-backed scheme with tax benefits + additional FD interest rate"
    ],
    "features": [
      "iMobile + RIB digital banking access",
      "Premium debit cards with lounge access based on MAB & spend criteria",
      "Free physical passbook & monthly email statements"
    ],
    "bankingFeatures": [
      "iMobile + RIB digital banking access",
      "Premium debit cards with lounge access based on MAB & spend criteria",
      "Free physical passbook & monthly email statements"
    ],
    "debit_card_relationships": [
      {
        "card_id": "icici-coral-debit-card",
        "relationship": "provided",
        "verification_status": "verified"
      }
    ]
  },
  {
    "id": 118,
    "product_id": "pnb-women-power-solitaire",
    "bank_id": "pnb",
    "bank_name": "Punjab National Bank",
    "bank": "Punjab National Bank",
    "logo": "PNB",
    "variant_name": "PNB Women Power Solitaire",
    "accountName": "PNB Women Power Solitaire",
    "account_type": "Women Power Savings – Solitaire",
    "accountType": "Women's",
    "target_segment": "Women",
    "accountTypeBadges": [
      "Women Power",
      "Solitaire",
      "Public Sector Bank"
    ],
    "interest_rate": "2.50% p.a.*",
    "interestRate": "2.50% p.a.*",
    "interestRateValue": 2.5,
    "minimum_balance": "₹50,000",
    "minimumBalance": "₹50,000",
    "minimumBalanceValue": 50000,
    "maximum_balance": "No Limit",
    "salary_requirement": "Not applicable",
    "salaryRequirement": "Not applicable",
    "non_maintenance_penalty": "Scheme benefits/concessions depend on maintaining required MAB",
    "nonMaintenanceCharges": "Scheme benefits/concessions depend on maintaining required MAB",
    "cheque_book": "100 cheque leaves/year*",
    "chequeBook": "100 cheque leaves/year*",
    "atm_limits": "ATM ₹50,000/day; POS/e-commerce ₹1,50,000/day; Contactless ₹5,000/day",
    "atmLimits": "ATM ₹50,000/day; POS/e-commerce ₹1,50,000/day; Contactless ₹5,000/day",
    "debit_card": "RuPay Platinum Solitaire International",
    "debitCard": "RuPay Platinum Solitaire International",
    "associatedDebitCardName": "RuPay Platinum Solitaire International",
    "interest_credit_frequency": "Quarterly",
    "isZeroBalance": false,
    "isOnlineOpening": true,
    "isStudent": false,
    "isSalary": false,
    "isSeniorCitizen": false,
    "isWomenSpecial": true,
    "isDigital": true,
    "isPremium": true,
    "isNRI": false,
    "rating": 4.5,
    "isPopular": true,
    "source": "https://www.pnbindia.in/savings-account.html",
    "officialSourceUrl": "https://www.pnbindia.in/savings-account.html",
    "sourceType": "Provided Dataset",
    "sourceFile": "User Provided Banking Dataset",
    "as_of_date": "Not specified",
    "lastVerified": "Not specified",
    "information_status": "Verified",
    "description": "Exclusive women-oriented savings scheme with ₹50,000 minimum balance requirement and 100 free cheque leaves per year.",
    "eligibility": [
      "Women accounts (Individual / Joint operation)",
      "Salary Requirement: Not applicable"
    ],
    "benefits": [
      "100 cheque leaves/year*",
      "RuPay Platinum Solitaire International Debit Card",
      "Scheme benefits/concessions depend on maintaining required MAB"
    ],
    "keyBenefits": [
      "100 cheque leaves/year*",
      "RuPay Platinum Solitaire International Debit Card",
      "Scheme benefits/concessions depend on maintaining required MAB"
    ],
    "features": [
      "ATM ₹50,000/day; POS/e-commerce ₹1,50,000/day; Contactless ₹5,000/day",
      "PNB ONE Mobile Banking & Internet Banking access",
      "2.50% p.a.* interest rate"
    ],
    "bankingFeatures": [
      "ATM ₹50,000/day; POS/e-commerce ₹1,50,000/day; Contactless ₹5,000/day",
      "PNB ONE Mobile Banking & Internet Banking access",
      "2.50% p.a.* interest rate"
    ],
    "debit_card_relationships": [
      {
        "card_id": "pnb-rupay-platinum-solitaire-international",
        "relationship": "included",
        "verification_status": "verified"
      }
    ]
  },
  {
    "id": 119,
    "product_id": "pnb-women-power-pearl",
    "bank_id": "pnb",
    "bank_name": "Punjab National Bank",
    "bank": "Punjab National Bank",
    "logo": "PNB",
    "variant_name": "PNB Women Power Pearl",
    "accountName": "PNB Women Power Pearl",
    "account_type": "Women Power Savings – Pearl",
    "accountType": "Women's",
    "target_segment": "Women",
    "accountTypeBadges": [
      "Women Power",
      "Pearl",
      "Public Sector Bank"
    ],
    "interest_rate": "2.50% p.a.*",
    "interestRate": "2.50% p.a.*",
    "interestRateValue": 2.5,
    "minimum_balance": "₹10,000",
    "minimumBalance": "₹10,000",
    "minimumBalanceValue": 10000,
    "maximum_balance": "No Limit",
    "salary_requirement": "Not applicable",
    "salaryRequirement": "Not applicable",
    "non_maintenance_penalty": "Scheme benefits/concessions depend on maintaining required MAB",
    "nonMaintenanceCharges": "Scheme benefits/concessions depend on maintaining required MAB",
    "cheque_book": "100 cheque leaves/year*",
    "chequeBook": "100 cheque leaves/year*",
    "atm_limits": "ATM ₹50,000/day; POS/e-commerce ₹1,50,000/day; Contactless ₹5,000/day",
    "atmLimits": "ATM ₹50,000/day; POS/e-commerce ₹1,50,000/day; Contactless ₹5,000/day",
    "debit_card": "RuPay Platinum Pearl International — ₹250 + GST issuance",
    "debitCard": "RuPay Platinum Pearl International — ₹250 + GST issuance",
    "associatedDebitCardName": "RuPay Platinum Pearl International",
    "interest_credit_frequency": "Quarterly",
    "isZeroBalance": false,
    "isOnlineOpening": true,
    "isStudent": false,
    "isSalary": false,
    "isSeniorCitizen": false,
    "isWomenSpecial": true,
    "isDigital": true,
    "isPremium": false,
    "isNRI": false,
    "rating": 4.4,
    "isPopular": true,
    "source": "https://www.pnbindia.in/savings-account.html",
    "officialSourceUrl": "https://www.pnbindia.in/savings-account.html",
    "sourceType": "Provided Dataset",
    "sourceFile": "User Provided Banking Dataset",
    "as_of_date": "Not specified",
    "lastVerified": "Not specified",
    "information_status": "Verified",
    "description": "Specialized women's savings account with ₹10,000 minimum balance, RuPay Platinum Pearl card, and 100 free cheque leaves per year.",
    "eligibility": [
      "Women accounts (Individual / Joint operation)",
      "Salary Requirement: Not applicable"
    ],
    "benefits": [
      "100 cheque leaves/year*",
      "RuPay Platinum Pearl International Debit Card (₹250 + GST issuance)",
      "Scheme benefits/concessions depend on maintaining required MAB"
    ],
    "keyBenefits": [
      "100 cheque leaves/year*",
      "RuPay Platinum Pearl International Debit Card (₹250 + GST issuance)",
      "Scheme benefits/concessions depend on maintaining required MAB"
    ],
    "features": [
      "ATM ₹50,000/day; POS/e-commerce ₹1,50,000/day; Contactless ₹5,000/day",
      "PNB ONE Mobile Banking & Internet Banking access",
      "2.50% p.a.* interest rate"
    ],
    "bankingFeatures": [
      "ATM ₹50,000/day; POS/e-commerce ₹1,50,000/day; Contactless ₹5,000/day",
      "PNB ONE Mobile Banking & Internet Banking access",
      "2.50% p.a.* interest rate"
    ],
    "debit_card_relationships": [
      {
        "card_id": "pnb-rupay-platinum-pearl-international",
        "relationship": "included",
        "verification_status": "verified"
      }
    ]
  },
  {
    "id": 120,
    "product_id": "pnb-women-power-emerald",
    "bank_id": "pnb",
    "bank_name": "Punjab National Bank",
    "bank": "Punjab National Bank",
    "logo": "PNB",
    "variant_name": "PNB Women Power Emerald",
    "accountName": "PNB Women Power Emerald",
    "account_type": "Women Power Savings – Emerald",
    "accountType": "Women's",
    "target_segment": "Women",
    "accountTypeBadges": [
      "Women Power",
      "Emerald",
      "Public Sector Bank"
    ],
    "interest_rate": "2.50% p.a.*",
    "interestRate": "2.50% p.a.*",
    "interestRateValue": 2.5,
    "minimum_balance": "₹25,000",
    "minimumBalance": "₹25,000",
    "minimumBalanceValue": 25000,
    "maximum_balance": "No Limit",
    "salary_requirement": "Not applicable",
    "salaryRequirement": "Not applicable",
    "non_maintenance_penalty": "Scheme benefits/concessions depend on maintaining required MAB",
    "nonMaintenanceCharges": "Scheme benefits/concessions depend on maintaining required MAB",
    "cheque_book": "100 cheque leaves/year*",
    "chequeBook": "100 cheque leaves/year*",
    "atm_limits": "ATM ₹50,000/day; POS/e-commerce ₹1,50,000/day; Contactless ₹5,000/day",
    "atmLimits": "ATM ₹50,000/day; POS/e-commerce ₹1,50,000/day; Contactless ₹5,000/day",
    "debit_card": "RuPay Platinum Emerald International — ₹300 + GST issuance",
    "debitCard": "RuPay Platinum Emerald International — ₹300 + GST issuance",
    "associatedDebitCardName": "RuPay Platinum Emerald International",
    "interest_credit_frequency": "Quarterly",
    "isZeroBalance": false,
    "isOnlineOpening": true,
    "isStudent": false,
    "isSalary": false,
    "isSeniorCitizen": false,
    "isWomenSpecial": true,
    "isDigital": true,
    "isPremium": false,
    "isNRI": false,
    "rating": 4.4,
    "isPopular": true,
    "source": "https://www.pnbindia.in/savings-account.html",
    "officialSourceUrl": "https://www.pnbindia.in/savings-account.html",
    "sourceType": "Provided Dataset",
    "sourceFile": "User Provided Banking Dataset",
    "as_of_date": "Not specified",
    "lastVerified": "Not specified",
    "information_status": "Verified",
    "description": "Enhanced women's savings account with ₹25,000 minimum balance, RuPay Platinum Emerald card, and 100 free cheque leaves per year.",
    "eligibility": [
      "Women accounts (Individual / Joint operation)",
      "Salary Requirement: Not applicable"
    ],
    "benefits": [
      "100 cheque leaves/year*",
      "RuPay Platinum Emerald International Debit Card (₹300 + GST issuance)",
      "Scheme benefits/concessions depend on maintaining required MAB"
    ],
    "keyBenefits": [
      "100 cheque leaves/year*",
      "RuPay Platinum Emerald International Debit Card (₹300 + GST issuance)",
      "Scheme benefits/concessions depend on maintaining required MAB"
    ],
    "features": [
      "ATM ₹50,000/day; POS/e-commerce ₹1,50,000/day; Contactless ₹5,000/day",
      "PNB ONE Mobile Banking & Internet Banking access",
      "2.50% p.a.* interest rate"
    ],
    "bankingFeatures": [
      "ATM ₹50,000/day; POS/e-commerce ₹1,50,000/day; Contactless ₹5,000/day",
      "PNB ONE Mobile Banking & Internet Banking access",
      "2.50% p.a.* interest rate"
    ],
    "debit_card_relationships": [
      {
        "card_id": "pnb-rupay-platinum-emerald-international",
        "relationship": "included",
        "verification_status": "verified"
      }
    ]
  },
  {
    "id": 121,
    "product_id": "pnb-rise",
    "bank_id": "pnb",
    "bank_name": "Punjab National Bank",
    "bank": "Punjab National Bank",
    "logo": "PNB",
    "variant_name": "PNB Rise",
    "accountName": "PNB Rise",
    "account_type": "Youth Savings Account",
    "accountType": "Student",
    "target_segment": "Youth & Students",
    "accountTypeBadges": [
      "Youth Savings",
      "Zero Balance",
      "Public Sector Bank"
    ],
    "interest_rate": "2.50% p.a.*",
    "interestRate": "2.50% p.a.*",
    "interestRateValue": 2.5,
    "minimum_balance": "Zero",
    "minimumBalance": "Zero",
    "minimumBalanceValue": 0,
    "maximum_balance": "No Limit",
    "salary_requirement": "Not applicable",
    "salaryRequirement": "Not applicable",
    "non_maintenance_penalty": "Applicable charges as per current PNB rules",
    "nonMaintenanceCharges": "Applicable charges as per current PNB rules",
    "cheque_book": "Unlimited*",
    "chequeBook": "Unlimited*",
    "atm_limits": "ATM ₹50,000/day; POS/e-commerce ₹3,00,000/day; Contactless ₹5,000/day",
    "atmLimits": "ATM ₹50,000/day; POS/e-commerce ₹3,00,000/day; Contactless ₹5,000/day",
    "debit_card": "Mastercard Platinum Rise — ₹375 + GST issuance; ₹375 + GST AMC",
    "debitCard": "Mastercard Platinum Rise — ₹375 + GST issuance; ₹375 + GST AMC",
    "associatedDebitCardName": "Mastercard Platinum Rise",
    "interest_credit_frequency": "Quarterly",
    "isZeroBalance": true,
    "isOnlineOpening": true,
    "isStudent": true,
    "isSalary": false,
    "isSeniorCitizen": false,
    "isWomenSpecial": false,
    "isDigital": true,
    "isPremium": false,
    "isNRI": false,
    "rating": 4.5,
    "isPopular": true,
    "source": "https://www.pnbindia.in/savings-account.html",
    "officialSourceUrl": "https://www.pnbindia.in/savings-account.html",
    "sourceType": "Provided Dataset",
    "sourceFile": "User Provided Banking Dataset",
    "as_of_date": "Not specified",
    "lastVerified": "Not specified",
    "information_status": "Verified",
    "description": "Youth-centric zero balance savings account featuring high POS limits and unlimited cheque book facility.",
    "eligibility": [
      "Youth and young individuals",
      "Salary Requirement: Not applicable"
    ],
    "benefits": [
      "Zero minimum balance maintenance requirement",
      "Unlimited* cheque book facility",
      "Mastercard Platinum Rise Debit Card (₹375 + GST issuance; ₹375 + GST AMC)"
    ],
    "keyBenefits": [
      "Zero minimum balance maintenance requirement",
      "Unlimited* cheque book facility",
      "Mastercard Platinum Rise Debit Card (₹375 + GST issuance; ₹375 + GST AMC)"
    ],
    "features": [
      "ATM ₹50,000/day; POS/e-commerce ₹3,00,000/day; Contactless ₹5,000/day",
      "PNB ONE Mobile Banking & Internet Banking access",
      "2.50% p.a.* interest rate"
    ],
    "bankingFeatures": [
      "ATM ₹50,000/day; POS/e-commerce ₹3,00,000/day; Contactless ₹5,000/day",
      "PNB ONE Mobile Banking & Internet Banking access",
      "2.50% p.a.* interest rate"
    ],
    "debit_card_relationships": [
      {
        "card_id": "pnb-mastercard-platinum-rise",
        "relationship": "included",
        "verification_status": "verified"
      }
    ]
  },
  {
    "id": 122,
    "product_id": "pnb-grow",
    "bank_id": "pnb",
    "bank_name": "Punjab National Bank",
    "bank": "Punjab National Bank",
    "logo": "PNB",
    "variant_name": "PNB Grow",
    "accountName": "PNB Grow",
    "account_type": "Savings Account for Minors",
    "accountType": "Minor",
    "target_segment": "Minors & Children",
    "accountTypeBadges": [
      "Minor Account",
      "Zero Balance",
      "Public Sector Bank"
    ],
    "interest_rate": "2.50% p.a.*",
    "interestRate": "2.50% p.a.*",
    "interestRateValue": 2.5,
    "minimum_balance": "Zero",
    "minimumBalance": "Zero",
    "minimumBalanceValue": 0,
    "maximum_balance": "No Limit",
    "salary_requirement": "Not applicable",
    "salaryRequirement": "Not applicable",
    "non_maintenance_penalty": "AMC applicable under PNB rules; waiver linked to ₹5,000 yearly-average balance",
    "nonMaintenanceCharges": "AMC applicable under PNB rules; waiver linked to ₹5,000 yearly-average balance",
    "cheque_book": "25 cheque leaves/year*",
    "chequeBook": "25 cheque leaves/year*",
    "atm_limits": "ATM ₹10,000/day; POS/e-commerce ₹10,000/day; Contactless ₹5,000/day",
    "atmLimits": "ATM ₹10,000/day; POS/e-commerce ₹10,000/day; Contactless ₹5,000/day",
    "debit_card": "Mastercard Platinum Grow",
    "debitCard": "Mastercard Platinum Grow",
    "associatedDebitCardName": "Mastercard Platinum Grow",
    "interest_credit_frequency": "Quarterly",
    "isZeroBalance": true,
    "isOnlineOpening": true,
    "isStudent": true,
    "isSalary": false,
    "isSeniorCitizen": false,
    "isWomenSpecial": false,
    "isDigital": true,
    "isPremium": false,
    "isNRI": false,
    "rating": 4.3,
    "isPopular": true,
    "source": "https://www.pnbindia.in/savings-account.html",
    "officialSourceUrl": "https://www.pnbindia.in/savings-account.html",
    "sourceType": "Provided Dataset",
    "sourceFile": "User Provided Banking Dataset",
    "as_of_date": "Not specified",
    "lastVerified": "Not specified",
    "information_status": "Verified",
    "description": "Zero balance savings account designed for minors with safe transaction limits and 25 free cheque leaves per year.",
    "eligibility": [
      "Minors with parents / legal guardians",
      "Salary Requirement: Not applicable"
    ],
    "benefits": [
      "Zero minimum balance maintenance requirement",
      "25 cheque leaves/year*",
      "Mastercard Platinum Grow Debit Card",
      "AMC waiver linked to ₹5,000 yearly-average balance"
    ],
    "keyBenefits": [
      "Zero minimum balance maintenance requirement",
      "25 cheque leaves/year*",
      "Mastercard Platinum Grow Debit Card",
      "AMC waiver linked to ₹5,000 yearly-average balance"
    ],
    "features": [
      "ATM ₹10,000/day; POS/e-commerce ₹10,000/day; Contactless ₹5,000/day",
      "PNB ONE Mobile Banking & Internet Banking access",
      "2.50% p.a.* interest rate"
    ],
    "bankingFeatures": [
      "ATM ₹10,000/day; POS/e-commerce ₹10,000/day; Contactless ₹5,000/day",
      "PNB ONE Mobile Banking & Internet Banking access",
      "2.50% p.a.* interest rate"
    ],
    "debit_card_relationships": [
      {
        "card_id": "pnb-mastercard-platinum-grow",
        "relationship": "included",
        "verification_status": "verified"
      }
    ]
  },
  // ==========================================
  // CANARA BANK - SAVINGS & SALARY ACCOUNTS
  // Source: Canara Bank Official Product Dataset
  // ==========================================
  {
  "id": 3001,
  "product_id": "canara-sb-general",
  "bank_id": "canara-bank",
  "bank_name": "Canara Bank",
  "bankName": "Canara Bank",
  "bank": "Canara Bank",
  "logo": "CB",
  "variant_name": "Savings Bank Account (SB General)",
  "accountName": "Savings Bank Account (SB General)",
  "account_type": "Savings",
  "accountType": "Regular Savings",
  "target_segment": "All individuals / Karta HUF / organisations eligible to open SB (govt bodies with authorisation, DWCRA, SHGs, PCCS financed by bank, Khadi & Village Industries Boards, APMCs)",
  "targetCustomer": "All individuals / Karta HUF / organisations eligible to open SB (govt bodies with authorisation, DWCRA, SHGs, PCCS financed by bank, Khadi & Village Industries Boards, APMCs)",
  "accountTypeBadges": [
    "Savings",
    "Savings Account",
    "Public Sector Bank"
  ],
  "interest_rate": "2.50% p.a. (bank-wide savings slab for balances below Rs 100 Cr; slabs rise to 4.00% only at Rs 2,000 Cr+). Source: canarabank.bank.in/domestic/nro/nre-savings-bank-deposits, effective 05.09.2026. Variant-specific rate not stated",
  "interestRate": "2.50% p.a. (bank-wide savings slab for balances below Rs 100 Cr; slabs rise to 4.00% only at Rs 2,000 Cr+). Source: canarabank.bank.in/domestic/nro/nre-savings-bank-deposits, effective 05.09.2026. Variant-specific rate not stated",
  "interestRateValue": 2.5,
  "minimum_balance": "AMB Rs 2,000 urban/metro; Rs 1,000 semi-urban; Rs 500 rural",
  "minimumBalance": "AMB Rs 2,000 urban/metro; Rs 1,000 semi-urban; Rs 500 rural",
  "minimumBalanceValue": 1000,
  "maximum_balance": "No Limit",
  "salary_requirement": "Not applicable",
  "salaryRequirement": "Not applicable",
  "non_maintenance_penalty": "Waived for all SB account types w.e.f. 01-06-2025 per official press release (canarabank.bank.in/documents/d/guest/31-05-2025-9only-in-english-canara-bank-waives-charges-for-non-maintenance-of-minimum-balance-for-all-sb-accounts). Benefits tied to balance may still be withdrawn - verify",
  "nonMaintenanceCharges": "Waived for all SB account types w.e.f. 01-06-2025 per official press release (canarabank.bank.in/documents/d/guest/31-05-2025-9only-in-english-canara-bank-waives-charges-for-non-maintenance-of-minimum-balance-for-all-sb-accounts). Benefits tied to balance may still be withdrawn - verify",
  "cheque_book": "Available (2023 comparison PDF)",
  "chequeBook": "Available (2023 comparison PDF)",
  "atm_limits": "As per issued card variant",
  "atmLimits": "As per issued card variant",
  "debit_card": "ATM-cum-Debit Card listed; specific variant NOT named",
  "debitCard": "ATM-cum-Debit Card listed; specific variant NOT named",
  "associatedDebitCardName": "ATM-cum-Debit Card listed; specific variant NOT named",
  "interest_credit_frequency": "Calculated on daily product basis; credited quarterly on 27 Jun, 27 Sep, 27 Dec, 27 Mar",
  "isZeroBalance": false,
  "isOnlineOpening": true,
  "isStudent": false,
  "isSalary": false,
  "isSeniorCitizen": false,
  "isWomenSpecial": false,
  "isDigital": true,
  "isPremium": false,
  "isNRI": false,
  "rating": 4.3,
  "isPopular": true,
  "source": "https://www.canarabank.bank.in/savings-bank-account",
  "officialSourceUrl": "https://www.canarabank.bank.in/savings-bank-account",
  "officialSource": "https://www.canarabank.bank.in/savings-bank-account",
  "sourceType": "Official Bank Source",
  "sourceFile": "Canara Bank Product Dataset",
  "as_of_date": "2026-09-21",
  "lastVerified": "2026-09-21",
  "information_status": "Retrieved (partial)",
  "description": "Savings Bank Account (SB General) offered by Canara Bank.",
  "eligibility": [
    "All individuals / Karta HUF / organisations eligible to open SB (govt bodies with authorisation, DWCRA, SHGs, PCCS financed by bank, Khadi & Village Industries Boards, APMCs)",
    "Age: Not specified on official source"
  ],
  "benefits": [
    "Passbook, standing instructions, cheque collection, nomination applicable; loan against deposit not permitted; TDS n/a; no senior-citizen special rate",
    "Waived for all SB account types w.e.f. 01-06-2025 per official press release (canarabank.bank.in/documents/d/guest/31-05-2025-9only-in-english-canara-bank-waives-charges-for-non-maintenance-of-minimum-balance-for-all-sb-accounts). Benefits tied to balance may still be withdrawn - verify",
    "Standing instructions, nomination, netbanking"
  ],
  "keyBenefits": [
    "Passbook, standing instructions, cheque collection, nomination applicable; loan against deposit not permitted; TDS n/a; no senior-citizen special rate",
    "Waived for all SB account types w.e.f. 01-06-2025 per official press release (canarabank.bank.in/documents/d/guest/31-05-2025-9only-in-english-canara-bank-waives-charges-for-non-maintenance-of-minimum-balance-for-all-sb-accounts). Benefits tied to balance may still be withdrawn - verify",
    "Standing instructions, nomination, netbanking"
  ],
  "features": [
    "Minimum Balance: AMB Rs 2,000 urban/metro; Rs 1,000 semi-urban; Rs 500 rural",
    "Interest: 2.50% p.a. (bank-wide savings slab for balances below Rs 100 Cr; slabs rise to 4.00% only at Rs 2,000 Cr+). Source: canarabank.bank.in/domestic/nro/nre-savings-bank-deposits, effective 05.09.2026. Variant-specific rate not stated",
    "Internet / Mobile Banking: Internet & Mobile Banking (Canara ai1 app)"
  ],
  "bankingFeatures": [
    "Minimum Balance: AMB Rs 2,000 urban/metro; Rs 1,000 semi-urban; Rs 500 rural",
    "Interest: 2.50% p.a. (bank-wide savings slab for balances below Rs 100 Cr; slabs rise to 4.00% only at Rs 2,000 Cr+). Source: canarabank.bank.in/domestic/nro/nre-savings-bank-deposits, effective 05.09.2026. Variant-specific rate not stated",
    "Internet / Mobile Banking: Internet & Mobile Banking (Canara ai1 app)"
  ],
  "debit_card_relationships": []
},
  {
  "id": 3002,
  "product_id": "canara-sb-select",
  "bank_id": "canara-bank",
  "bank_name": "Canara Bank",
  "bankName": "Canara Bank",
  "bank": "Canara Bank",
  "logo": "CB",
  "variant_name": "Canara SB Select",
  "accountName": "Canara SB Select",
  "account_type": "Savings",
  "accountType": "Regular Savings",
  "target_segment": "Individuals",
  "targetCustomer": "Individuals",
  "accountTypeBadges": [
    "Savings",
    "Savings Account",
    "Public Sector Bank"
  ],
  "interest_rate": "2.50% p.a. (bank-wide savings slab for balances below Rs 100 Cr; slabs rise to 4.00% only at Rs 2,000 Cr+). Source: canarabank.bank.in/domestic/nro/nre-savings-bank-deposits, effective 05.09.2026. Variant-specific rate not stated",
  "interestRate": "2.50% p.a. (bank-wide savings slab for balances below Rs 100 Cr; slabs rise to 4.00% only at Rs 2,000 Cr+). Source: canarabank.bank.in/domestic/nro/nre-savings-bank-deposits, effective 05.09.2026. Variant-specific rate not stated",
  "interestRateValue": 2.5,
  "minimum_balance": "MAB Rs 10,000 rural / Rs 15,000 semi-urban / Rs 20,000 urban / Rs 25,000 metro",
  "minimumBalance": "MAB Rs 10,000 rural / Rs 15,000 semi-urban / Rs 20,000 urban / Rs 25,000 metro",
  "minimumBalanceValue": 1000,
  "maximum_balance": "No Limit",
  "salary_requirement": "Not applicable",
  "salaryRequirement": "Not applicable",
  "non_maintenance_penalty": "Waived for all SB account types w.e.f. 01-06-2025 per official press release (canarabank.bank.in/documents/d/guest/31-05-2025-9only-in-english-canara-bank-waives-charges-for-non-maintenance-of-minimum-balance-for-all-sb-accounts). Benefits tied to balance may still be withdrawn - verify",
  "nonMaintenanceCharges": "Waived for all SB account types w.e.f. 01-06-2025 per official press release (canarabank.bank.in/documents/d/guest/31-05-2025-9only-in-english-canara-bank-waives-charges-for-non-maintenance-of-minimum-balance-for-all-sb-accounts). Benefits tied to balance may still be withdrawn - verify",
  "cheque_book": "25 leaves free per calendar year (issued with card only on reaching threshold balance)",
  "chequeBook": "25 leaves free per calendar year (issued with card only on reaching threshold balance)",
  "atm_limits": "As per issued card variant",
  "atmLimits": "As per issued card variant",
  "debit_card": "RuPay Platinum",
  "debitCard": "RuPay Platinum",
  "associatedDebitCardName": "RuPay Platinum",
  "interest_credit_frequency": "Not stated on this page",
  "isZeroBalance": false,
  "isOnlineOpening": true,
  "isStudent": false,
  "isSalary": false,
  "isSeniorCitizen": false,
  "isWomenSpecial": false,
  "isDigital": true,
  "isPremium": true,
  "isNRI": false,
  "rating": 4.3,
  "isPopular": true,
  "source": "https://canarabank.com/Select.aspx (alt: https://www.canarabank.bank.in/canara-sb-select)",
  "officialSourceUrl": "https://canarabank.com/Select.aspx (alt: https://www.canarabank.bank.in/canara-sb-select)",
  "officialSource": "https://canarabank.com/Select.aspx (alt: https://www.canarabank.bank.in/canara-sb-select)",
  "sourceType": "Official Bank Source",
  "sourceFile": "Canara Bank Product Dataset",
  "as_of_date": "2026-09-21",
  "lastVerified": "2026-09-21",
  "information_status": "Retrieved (partial)",
  "description": "Canara SB Select offered by Canara Bank.",
  "eligibility": [
    "Individuals",
    "Age: Not specified on official source"
  ],
  "benefits": [
    "Card PAI via CANCARE: air Rs 8L self/Rs 4L spouse; other Rs 4L self/Rs 2L spouse; NPCI PA & PTD Rs 2L (30-day txn condition); cash withdrawal Rs 1,00,000/day; baggage cover Rs 25,000; purchase protection Rs 25,000; existing SB customers can convert without changing account number",
    "Waived for all SB account types w.e.f. 01-06-2025 per official press release (canarabank.bank.in/documents/d/guest/31-05-2025-9only-in-english-canara-bank-waives-charges-for-non-maintenance-of-minimum-balance-for-all-sb-accounts). Benefits tied to balance may still be withdrawn - verify",
    "Standing instructions, nomination, netbanking"
  ],
  "keyBenefits": [
    "Card PAI via CANCARE: air Rs 8L self/Rs 4L spouse; other Rs 4L self/Rs 2L spouse; NPCI PA & PTD Rs 2L (30-day txn condition); cash withdrawal Rs 1,00,000/day; baggage cover Rs 25,000; purchase protection Rs 25,000; existing SB customers can convert without changing account number",
    "Waived for all SB account types w.e.f. 01-06-2025 per official press release (canarabank.bank.in/documents/d/guest/31-05-2025-9only-in-english-canara-bank-waives-charges-for-non-maintenance-of-minimum-balance-for-all-sb-accounts). Benefits tied to balance may still be withdrawn - verify",
    "Standing instructions, nomination, netbanking"
  ],
  "features": [
    "Minimum Balance: MAB Rs 10,000 rural / Rs 15,000 semi-urban / Rs 20,000 urban / Rs 25,000 metro",
    "Interest: 2.50% p.a. (bank-wide savings slab for balances below Rs 100 Cr; slabs rise to 4.00% only at Rs 2,000 Cr+). Source: canarabank.bank.in/domestic/nro/nre-savings-bank-deposits, effective 05.09.2026. Variant-specific rate not stated",
    "Internet / Mobile Banking: Available / Available"
  ],
  "bankingFeatures": [
    "Minimum Balance: MAB Rs 10,000 rural / Rs 15,000 semi-urban / Rs 20,000 urban / Rs 25,000 metro",
    "Interest: 2.50% p.a. (bank-wide savings slab for balances below Rs 100 Cr; slabs rise to 4.00% only at Rs 2,000 Cr+). Source: canarabank.bank.in/domestic/nro/nre-savings-bank-deposits, effective 05.09.2026. Variant-specific rate not stated",
    "Internet / Mobile Banking: Available / Available"
  ],
  "debit_card_relationships": [
    {
      "card_id": "canara-bank-rupay-platinum",
      "relationship": "included",
      "verification_status": "verified"
    }
  ]
},
  {
  "id": 3003,
  "product_id": "canara-sb-power-plus",
  "bank_id": "canara-bank",
  "bank_name": "Canara Bank",
  "bankName": "Canara Bank",
  "bank": "Canara Bank",
  "logo": "CB",
  "variant_name": "Canara SB Power Plus",
  "accountName": "Canara SB Power Plus",
  "account_type": "Savings",
  "accountType": "Regular Savings",
  "target_segment": "Not specified in retrieved excerpt",
  "targetCustomer": "Not specified in retrieved excerpt",
  "accountTypeBadges": [
    "Savings",
    "Savings Account",
    "Public Sector Bank"
  ],
  "interest_rate": "2.50% p.a. (bank-wide savings slab for balances below Rs 100 Cr; slabs rise to 4.00% only at Rs 2,000 Cr+). Source: canarabank.bank.in/domestic/nro/nre-savings-bank-deposits, effective 05.09.2026. Variant-specific rate not stated",
  "interestRate": "2.50% p.a. (bank-wide savings slab for balances below Rs 100 Cr; slabs rise to 4.00% only at Rs 2,000 Cr+). Source: canarabank.bank.in/domestic/nro/nre-savings-bank-deposits, effective 05.09.2026. Variant-specific rate not stated",
  "interestRateValue": 2.5,
  "minimum_balance": "Rs 1 lakh average quarterly balance (2023 PDF)",
  "minimumBalance": "Rs 1 lakh average quarterly balance (2023 PDF)",
  "minimumBalanceValue": 1000,
  "maximum_balance": "No Limit",
  "salary_requirement": "Not applicable",
  "salaryRequirement": "Not applicable",
  "non_maintenance_penalty": "Waived for all SB account types w.e.f. 01-06-2025 per official press release (canarabank.bank.in/documents/d/guest/31-05-2025-9only-in-english-canara-bank-waives-charges-for-non-maintenance-of-minimum-balance-for-all-sb-accounts). Benefits tied to balance may still be withdrawn - verify",
  "nonMaintenanceCharges": "Waived for all SB account types w.e.f. 01-06-2025 per official press release (canarabank.bank.in/documents/d/guest/31-05-2025-9only-in-english-canara-bank-waives-charges-for-non-maintenance-of-minimum-balance-for-all-sb-accounts). Benefits tied to balance may still be withdrawn - verify",
  "cheque_book": "Free, up to 300 leaves per annum",
  "chequeBook": "Free, up to 300 leaves per annum",
  "atm_limits": "As per issued card variant",
  "atmLimits": "As per issued card variant",
  "debit_card": "Debit card 'FREE' - card name NOT stated",
  "debitCard": "Debit card 'FREE' - card name NOT stated",
  "associatedDebitCardName": "Debit card 'FREE' - card name NOT stated",
  "interest_credit_frequency": "Not specified in retrieved excerpt",
  "isZeroBalance": false,
  "isOnlineOpening": true,
  "isStudent": false,
  "isSalary": false,
  "isSeniorCitizen": false,
  "isWomenSpecial": false,
  "isDigital": true,
  "isPremium": false,
  "isNRI": false,
  "rating": 4.3,
  "isPopular": false,
  "source": "https://www.canarabank.bank.in/documents/d/guest/savings-bank-products-1207202307-1-",
  "officialSourceUrl": "https://www.canarabank.bank.in/documents/d/guest/savings-bank-products-1207202307-1-",
  "officialSource": "https://www.canarabank.bank.in/documents/d/guest/savings-bank-products-1207202307-1-",
  "sourceType": "Official Bank Source",
  "sourceFile": "Canara Bank Product Dataset",
  "as_of_date": "2026-09-21",
  "lastVerified": "2026-09-21",
  "information_status": "Retrieved (partial)",
  "description": "Canara SB Power Plus offered by Canara Bank.",
  "eligibility": [
    "Not specified in retrieved excerpt",
    "Age: Not specified in retrieved excerpt"
  ],
  "benefits": [
    "Free cash remittance/deposits; credit card first year free",
    "Waived for all SB account types w.e.f. 01-06-2025 per official press release (canarabank.bank.in/documents/d/guest/31-05-2025-9only-in-english-canara-bank-waives-charges-for-non-maintenance-of-minimum-balance-for-all-sb-accounts). Benefits tied to balance may still be withdrawn - verify",
    "Standing instructions, nomination, netbanking"
  ],
  "keyBenefits": [
    "Free cash remittance/deposits; credit card first year free",
    "Waived for all SB account types w.e.f. 01-06-2025 per official press release (canarabank.bank.in/documents/d/guest/31-05-2025-9only-in-english-canara-bank-waives-charges-for-non-maintenance-of-minimum-balance-for-all-sb-accounts). Benefits tied to balance may still be withdrawn - verify",
    "Standing instructions, nomination, netbanking"
  ],
  "features": [
    "Minimum Balance: Rs 1 lakh average quarterly balance (2023 PDF)",
    "Interest: 2.50% p.a. (bank-wide savings slab for balances below Rs 100 Cr; slabs rise to 4.00% only at Rs 2,000 Cr+). Source: canarabank.bank.in/domestic/nro/nre-savings-bank-deposits, effective 05.09.2026. Variant-specific rate not stated",
    "Internet / Mobile Banking: Available / Canara ai1 Super Banking App"
  ],
  "bankingFeatures": [
    "Minimum Balance: Rs 1 lakh average quarterly balance (2023 PDF)",
    "Interest: 2.50% p.a. (bank-wide savings slab for balances below Rs 100 Cr; slabs rise to 4.00% only at Rs 2,000 Cr+). Source: canarabank.bank.in/domestic/nro/nre-savings-bank-deposits, effective 05.09.2026. Variant-specific rate not stated",
    "Internet / Mobile Banking: Available / Canara ai1 Super Banking App"
  ],
  "debit_card_relationships": []
},
  {
  "id": 3004,
  "product_id": "canara-aspire",
  "bank_id": "canara-bank",
  "bank_name": "Canara Bank",
  "bankName": "Canara Bank",
  "bank": "Canara Bank",
  "logo": "CB",
  "variant_name": "Canara Aspire",
  "accountName": "Canara Aspire",
  "account_type": "Savings",
  "accountType": "Youth",
  "target_segment": "Resident individuals (incl. visually impaired/illiterate)",
  "targetCustomer": "Resident individuals (incl. visually impaired/illiterate)",
  "accountTypeBadges": [
    "Savings",
    "Savings Account",
    "Public Sector Bank"
  ],
  "interest_rate": "2.50% p.a. (bank-wide savings slab for balances below Rs 100 Cr; slabs rise to 4.00% only at Rs 2,000 Cr+). Source: canarabank.bank.in/domestic/nro/nre-savings-bank-deposits, effective 05.09.2026. Variant-specific rate not stated",
  "interestRate": "2.50% p.a. (bank-wide savings slab for balances below Rs 100 Cr; slabs rise to 4.00% only at Rs 2,000 Cr+). Source: canarabank.bank.in/domestic/nro/nre-savings-bank-deposits, effective 05.09.2026. Variant-specific rate not stated",
  "interestRateValue": 2.5,
  "minimum_balance": "AMBIGUOUS: older page version: Nil (if Coursera course not availed), MAB Rs 2,000 (if availed); newer page: Nil. Education-loan concession needs QAB Rs 5,000",
  "minimumBalance": "AMBIGUOUS: older page version: Nil (if Coursera course not availed), MAB Rs 2,000 (if availed); newer page: Nil. Education-loan concession needs QAB Rs 5,000",
  "minimumBalanceValue": 1000,
  "maximum_balance": "No Limit",
  "salary_requirement": "Not applicable",
  "salaryRequirement": "Not applicable",
  "non_maintenance_penalty": "Waived for all SB account types w.e.f. 01-06-2025 per official press release (canarabank.bank.in/documents/d/guest/31-05-2025-9only-in-english-canara-bank-waives-charges-for-non-maintenance-of-minimum-balance-for-all-sb-accounts). Benefits tied to balance may still be withdrawn - verify",
  "nonMaintenanceCharges": "Waived for all SB account types w.e.f. 01-06-2025 per official press release (canarabank.bank.in/documents/d/guest/31-05-2025-9only-in-english-canara-bank-waives-charges-for-non-maintenance-of-minimum-balance-for-all-sb-accounts). Benefits tied to balance may still be withdrawn - verify",
  "cheque_book": "25 leaves free per annum (minors not eligible)",
  "chequeBook": "25 leaves free per annum (minors not eligible)",
  "atm_limits": "As per issued card variant",
  "atmLimits": "As per issued card variant",
  "debit_card": "RuPay Platinum Millennial",
  "debitCard": "RuPay Platinum Millennial",
  "associatedDebitCardName": "RuPay Platinum Millennial",
  "interest_credit_frequency": "Not stated on this page",
  "isZeroBalance": true,
  "isOnlineOpening": true,
  "isStudent": true,
  "isSalary": false,
  "isSeniorCitizen": false,
  "isWomenSpecial": false,
  "isDigital": true,
  "isPremium": false,
  "isNRI": false,
  "rating": 4.3,
  "isPopular": true,
  "source": "https://www.canarabank.bank.in/pages/canara-aspire",
  "officialSourceUrl": "https://www.canarabank.bank.in/pages/canara-aspire",
  "officialSource": "https://www.canarabank.bank.in/pages/canara-aspire",
  "sourceType": "Official Bank Source",
  "sourceFile": "Canara Bank Product Dataset",
  "as_of_date": "2026-09-21",
  "lastVerified": "2026-09-21",
  "information_status": "Retrieved (partial)",
  "description": "Canara Aspire offered by Canara Bank.",
  "eligibility": [
    "Resident individuals (incl. visually impaired/illiterate)",
    "Age: 17-28 years inclusive"
  ],
  "benefits": [
    "Zero balance; 0.50% concession on fresh education loan; PAI Rs 6 lakh (card + Cancare); card offers Swiggy One Lite, BookMyShow, Gaana; airport lounge access listed (details ambiguous); free Coursera course tied to QAB",
    "Waived for all SB account types w.e.f. 01-06-2025 per official press release (canarabank.bank.in/documents/d/guest/31-05-2025-9only-in-english-canara-bank-waives-charges-for-non-maintenance-of-minimum-balance-for-all-sb-accounts). Benefits tied to balance may still be withdrawn - verify",
    "Standing instructions, nomination, netbanking"
  ],
  "keyBenefits": [
    "Zero balance; 0.50% concession on fresh education loan; PAI Rs 6 lakh (card + Cancare); card offers Swiggy One Lite, BookMyShow, Gaana; airport lounge access listed (details ambiguous); free Coursera course tied to QAB",
    "Waived for all SB account types w.e.f. 01-06-2025 per official press release (canarabank.bank.in/documents/d/guest/31-05-2025-9only-in-english-canara-bank-waives-charges-for-non-maintenance-of-minimum-balance-for-all-sb-accounts). Benefits tied to balance may still be withdrawn - verify",
    "Standing instructions, nomination, netbanking"
  ],
  "features": [
    "Minimum Balance: AMBIGUOUS: older page version: Nil (if Coursera course not availed), MAB Rs 2,000 (if availed); newer page: Nil. Education-loan concession needs QAB Rs 5,000",
    "Interest: 2.50% p.a. (bank-wide savings slab for balances below Rs 100 Cr; slabs rise to 4.00% only at Rs 2,000 Cr+). Source: canarabank.bank.in/domestic/nro/nre-savings-bank-deposits, effective 05.09.2026. Variant-specific rate not stated",
    "Internet / Mobile Banking: Available"
  ],
  "bankingFeatures": [
    "Minimum Balance: AMBIGUOUS: older page version: Nil (if Coursera course not availed), MAB Rs 2,000 (if availed); newer page: Nil. Education-loan concession needs QAB Rs 5,000",
    "Interest: 2.50% p.a. (bank-wide savings slab for balances below Rs 100 Cr; slabs rise to 4.00% only at Rs 2,000 Cr+). Source: canarabank.bank.in/domestic/nro/nre-savings-bank-deposits, effective 05.09.2026. Variant-specific rate not stated",
    "Internet / Mobile Banking: Available"
  ],
  "debit_card_relationships": [
    {
      "card_id": "canara-bank-rupay-millennial-platinum",
      "relationship": "included",
      "verification_status": "verified"
    }
  ]
},
  {
  "id": 3005,
  "product_id": "canara-angel-lavender",
  "bank_id": "canara-bank",
  "bank_name": "Canara Bank",
  "bankName": "Canara Bank",
  "bank": "Canara Bank",
  "logo": "CB",
  "variant_name": "Canara Angel (Lavender)",
  "accountName": "Canara Angel (Lavender)",
  "account_type": "Savings",
  "accountType": "Women's",
  "target_segment": "Women individuals; joint accounts not permitted",
  "targetCustomer": "Women individuals; joint accounts not permitted",
  "accountTypeBadges": [
    "Savings",
    "Savings Account",
    "Public Sector Bank"
  ],
  "interest_rate": "2.50% p.a. (bank-wide savings slab for balances below Rs 100 Cr; slabs rise to 4.00% only at Rs 2,000 Cr+). Source: canarabank.bank.in/domestic/nro/nre-savings-bank-deposits, effective 05.09.2026. Variant-specific rate not stated",
  "interestRate": "2.50% p.a. (bank-wide savings slab for balances below Rs 100 Cr; slabs rise to 4.00% only at Rs 2,000 Cr+). Source: canarabank.bank.in/domestic/nro/nre-savings-bank-deposits, effective 05.09.2026. Variant-specific rate not stated",
  "interestRateValue": 2.5,
  "minimum_balance": "QAB Rs 5,000 (quarterly average balance to receive benefits)",
  "minimumBalance": "QAB Rs 5,000 (quarterly average balance to receive benefits)",
  "minimumBalanceValue": 1000,
  "maximum_balance": "No Limit",
  "salary_requirement": "Not applicable",
  "salaryRequirement": "Not applicable",
  "non_maintenance_penalty": "Waived for all SB account types w.e.f. 01-06-2025 per official press release (canarabank.bank.in/documents/d/guest/31-05-2025-9only-in-english-canara-bank-waives-charges-for-non-maintenance-of-minimum-balance-for-all-sb-accounts). Benefits tied to balance may still be withdrawn - verify",
  "nonMaintenanceCharges": "Waived for all SB account types w.e.f. 01-06-2025 per official press release (canarabank.bank.in/documents/d/guest/31-05-2025-9only-in-english-canara-bank-waives-charges-for-non-maintenance-of-minimum-balance-for-all-sb-accounts). Benefits tied to balance may still be withdrawn - verify",
  "cheque_book": "25 free leaves/yr",
  "chequeBook": "25 free leaves/yr",
  "atm_limits": "As per issued card variant",
  "atmLimits": "As per issued card variant",
  "debit_card": "RuPay Platinum",
  "debitCard": "RuPay Platinum",
  "associatedDebitCardName": "RuPay Platinum",
  "interest_credit_frequency": "Not specified in retrieved excerpt",
  "isZeroBalance": false,
  "isOnlineOpening": true,
  "isStudent": false,
  "isSalary": false,
  "isSeniorCitizen": false,
  "isWomenSpecial": true,
  "isDigital": true,
  "isPremium": false,
  "isNRI": false,
  "rating": 4.3,
  "isPopular": false,
  "source": "https://www.canarabank.bank.in/pages/canara-angel",
  "officialSourceUrl": "https://www.canarabank.bank.in/pages/canara-angel",
  "officialSource": "https://www.canarabank.bank.in/pages/canara-angel",
  "sourceType": "Official Bank Source",
  "sourceFile": "Canara Bank Product Dataset",
  "as_of_date": "2026-09-21",
  "lastVerified": "2026-09-21",
  "information_status": "Retrieved (partial)",
  "description": "Canara Angel (Lavender) offered by Canara Bank.",
  "eligibility": [
    "Women individuals; joint accounts not permitted",
    "Age: 18-70 years"
  ],
  "benefits": [
    "Cancer Care Rs 3 lakh; total free PAI Rs 8 lakh; card PAI Rs 2L; air accident cover for spouse Rs 4L; baggage Rs 50,000; purchase protection Rs 50,000; ATM Rs 1,00,000/day; family banking: Not available",
    "Waived for all SB account types w.e.f. 01-06-2025 per official press release (canarabank.bank.in/documents/d/guest/31-05-2025-9only-in-english-canara-bank-waives-charges-for-non-maintenance-of-minimum-balance-for-all-sb-accounts). Benefits tied to balance may still be withdrawn - verify",
    "Standing instructions, nomination, netbanking"
  ],
  "keyBenefits": [
    "Cancer Care Rs 3 lakh; total free PAI Rs 8 lakh; card PAI Rs 2L; air accident cover for spouse Rs 4L; baggage Rs 50,000; purchase protection Rs 50,000; ATM Rs 1,00,000/day; family banking: Not available",
    "Waived for all SB account types w.e.f. 01-06-2025 per official press release (canarabank.bank.in/documents/d/guest/31-05-2025-9only-in-english-canara-bank-waives-charges-for-non-maintenance-of-minimum-balance-for-all-sb-accounts). Benefits tied to balance may still be withdrawn - verify",
    "Standing instructions, nomination, netbanking"
  ],
  "features": [
    "Minimum Balance: QAB Rs 5,000 (quarterly average balance to receive benefits)",
    "Interest: 2.50% p.a. (bank-wide savings slab for balances below Rs 100 Cr; slabs rise to 4.00% only at Rs 2,000 Cr+). Source: canarabank.bank.in/domestic/nro/nre-savings-bank-deposits, effective 05.09.2026. Variant-specific rate not stated",
    "Internet / Mobile Banking: Not specified in retrieved excerpt"
  ],
  "bankingFeatures": [
    "Minimum Balance: QAB Rs 5,000 (quarterly average balance to receive benefits)",
    "Interest: 2.50% p.a. (bank-wide savings slab for balances below Rs 100 Cr; slabs rise to 4.00% only at Rs 2,000 Cr+). Source: canarabank.bank.in/domestic/nro/nre-savings-bank-deposits, effective 05.09.2026. Variant-specific rate not stated",
    "Internet / Mobile Banking: Not specified in retrieved excerpt"
  ],
  "debit_card_relationships": [
    {
      "card_id": "canara-bank-rupay-platinum",
      "relationship": "included",
      "verification_status": "verified"
    }
  ]
},
  {
  "id": 3006,
  "product_id": "canara-angel-rose",
  "bank_id": "canara-bank",
  "bank_name": "Canara Bank",
  "bankName": "Canara Bank",
  "bank": "Canara Bank",
  "logo": "CB",
  "variant_name": "Canara Angel (Rose)",
  "accountName": "Canara Angel (Rose)",
  "account_type": "Savings",
  "accountType": "Women's",
  "target_segment": "Women individuals; joint accounts not permitted",
  "targetCustomer": "Women individuals; joint accounts not permitted",
  "accountTypeBadges": [
    "Savings",
    "Savings Account",
    "Public Sector Bank"
  ],
  "interest_rate": "2.50% p.a. (bank-wide savings slab for balances below Rs 100 Cr; slabs rise to 4.00% only at Rs 2,000 Cr+). Source: canarabank.bank.in/domestic/nro/nre-savings-bank-deposits, effective 05.09.2026. Variant-specific rate not stated",
  "interestRate": "2.50% p.a. (bank-wide savings slab for balances below Rs 100 Cr; slabs rise to 4.00% only at Rs 2,000 Cr+). Source: canarabank.bank.in/domestic/nro/nre-savings-bank-deposits, effective 05.09.2026. Variant-specific rate not stated",
  "interestRateValue": 2.5,
  "minimum_balance": "QAB Rs 30,000 (quarterly average balance to receive benefits)",
  "minimumBalance": "QAB Rs 30,000 (quarterly average balance to receive benefits)",
  "minimumBalanceValue": 1000,
  "maximum_balance": "No Limit",
  "salary_requirement": "Not applicable",
  "salaryRequirement": "Not applicable",
  "non_maintenance_penalty": "Waived for all SB account types w.e.f. 01-06-2025 per official press release (canarabank.bank.in/documents/d/guest/31-05-2025-9only-in-english-canara-bank-waives-charges-for-non-maintenance-of-minimum-balance-for-all-sb-accounts). Benefits tied to balance may still be withdrawn - verify",
  "nonMaintenanceCharges": "Waived for all SB account types w.e.f. 01-06-2025 per official press release (canarabank.bank.in/documents/d/guest/31-05-2025-9only-in-english-canara-bank-waives-charges-for-non-maintenance-of-minimum-balance-for-all-sb-accounts). Benefits tied to balance may still be withdrawn - verify",
  "cheque_book": "50 free leaves/yr",
  "chequeBook": "50 free leaves/yr",
  "atm_limits": "As per issued card variant",
  "atmLimits": "As per issued card variant",
  "debit_card": "RuPay Platinum",
  "debitCard": "RuPay Platinum",
  "associatedDebitCardName": "RuPay Platinum",
  "interest_credit_frequency": "Not specified in retrieved excerpt",
  "isZeroBalance": false,
  "isOnlineOpening": true,
  "isStudent": false,
  "isSalary": false,
  "isSeniorCitizen": false,
  "isWomenSpecial": true,
  "isDigital": true,
  "isPremium": false,
  "isNRI": false,
  "rating": 4.3,
  "isPopular": false,
  "source": "https://www.canarabank.bank.in/pages/canara-angel",
  "officialSourceUrl": "https://www.canarabank.bank.in/pages/canara-angel",
  "officialSource": "https://www.canarabank.bank.in/pages/canara-angel",
  "sourceType": "Official Bank Source",
  "sourceFile": "Canara Bank Product Dataset",
  "as_of_date": "2026-09-21",
  "lastVerified": "2026-09-21",
  "information_status": "Retrieved (partial)",
  "description": "Canara Angel (Rose) offered by Canara Bank.",
  "eligibility": [
    "Women individuals; joint accounts not permitted",
    "Age: 18-70 years"
  ],
  "benefits": [
    "Cancer Care Rs 5 lakh; total free PAI Rs 16 lakh; card PAI Rs 2L; air accident cover for spouse Rs 4L; baggage Rs 50,000; purchase protection Rs 50,000; ATM Rs 1,00,000/day; family banking: Spouse + 1 Child",
    "Waived for all SB account types w.e.f. 01-06-2025 per official press release (canarabank.bank.in/documents/d/guest/31-05-2025-9only-in-english-canara-bank-waives-charges-for-non-maintenance-of-minimum-balance-for-all-sb-accounts). Benefits tied to balance may still be withdrawn - verify",
    "Standing instructions, nomination, netbanking"
  ],
  "keyBenefits": [
    "Cancer Care Rs 5 lakh; total free PAI Rs 16 lakh; card PAI Rs 2L; air accident cover for spouse Rs 4L; baggage Rs 50,000; purchase protection Rs 50,000; ATM Rs 1,00,000/day; family banking: Spouse + 1 Child",
    "Waived for all SB account types w.e.f. 01-06-2025 per official press release (canarabank.bank.in/documents/d/guest/31-05-2025-9only-in-english-canara-bank-waives-charges-for-non-maintenance-of-minimum-balance-for-all-sb-accounts). Benefits tied to balance may still be withdrawn - verify",
    "Standing instructions, nomination, netbanking"
  ],
  "features": [
    "Minimum Balance: QAB Rs 30,000 (quarterly average balance to receive benefits)",
    "Interest: 2.50% p.a. (bank-wide savings slab for balances below Rs 100 Cr; slabs rise to 4.00% only at Rs 2,000 Cr+). Source: canarabank.bank.in/domestic/nro/nre-savings-bank-deposits, effective 05.09.2026. Variant-specific rate not stated",
    "Internet / Mobile Banking: Not specified in retrieved excerpt"
  ],
  "bankingFeatures": [
    "Minimum Balance: QAB Rs 30,000 (quarterly average balance to receive benefits)",
    "Interest: 2.50% p.a. (bank-wide savings slab for balances below Rs 100 Cr; slabs rise to 4.00% only at Rs 2,000 Cr+). Source: canarabank.bank.in/domestic/nro/nre-savings-bank-deposits, effective 05.09.2026. Variant-specific rate not stated",
    "Internet / Mobile Banking: Not specified in retrieved excerpt"
  ],
  "debit_card_relationships": [
    {
      "card_id": "canara-bank-rupay-platinum",
      "relationship": "included",
      "verification_status": "verified"
    }
  ]
},
  {
  "id": 3007,
  "product_id": "canara-angel-orchid",
  "bank_id": "canara-bank",
  "bank_name": "Canara Bank",
  "bankName": "Canara Bank",
  "bank": "Canara Bank",
  "logo": "CB",
  "variant_name": "Canara Angel (Orchid)",
  "accountName": "Canara Angel (Orchid)",
  "account_type": "Savings",
  "accountType": "Women's",
  "target_segment": "Women individuals; joint accounts not permitted",
  "targetCustomer": "Women individuals; joint accounts not permitted",
  "accountTypeBadges": [
    "Savings",
    "Savings Account",
    "Public Sector Bank"
  ],
  "interest_rate": "2.50% p.a. (bank-wide savings slab for balances below Rs 100 Cr; slabs rise to 4.00% only at Rs 2,000 Cr+). Source: canarabank.bank.in/domestic/nro/nre-savings-bank-deposits, effective 05.09.2026. Variant-specific rate not stated",
  "interestRate": "2.50% p.a. (bank-wide savings slab for balances below Rs 100 Cr; slabs rise to 4.00% only at Rs 2,000 Cr+). Source: canarabank.bank.in/domestic/nro/nre-savings-bank-deposits, effective 05.09.2026. Variant-specific rate not stated",
  "interestRateValue": 2.5,
  "minimum_balance": "QAB Rs 1,00,000 (quarterly average balance to receive benefits)",
  "minimumBalance": "QAB Rs 1,00,000 (quarterly average balance to receive benefits)",
  "minimumBalanceValue": 1000,
  "maximum_balance": "No Limit",
  "salary_requirement": "Not applicable",
  "salaryRequirement": "Not applicable",
  "non_maintenance_penalty": "Waived for all SB account types w.e.f. 01-06-2025 per official press release (canarabank.bank.in/documents/d/guest/31-05-2025-9only-in-english-canara-bank-waives-charges-for-non-maintenance-of-minimum-balance-for-all-sb-accounts). Benefits tied to balance may still be withdrawn - verify",
  "nonMaintenanceCharges": "Waived for all SB account types w.e.f. 01-06-2025 per official press release (canarabank.bank.in/documents/d/guest/31-05-2025-9only-in-english-canara-bank-waives-charges-for-non-maintenance-of-minimum-balance-for-all-sb-accounts). Benefits tied to balance may still be withdrawn - verify",
  "cheque_book": "200 free leaves/yr",
  "chequeBook": "200 free leaves/yr",
  "atm_limits": "As per issued card variant",
  "atmLimits": "As per issued card variant",
  "debit_card": "RuPay Women Platinum",
  "debitCard": "RuPay Women Platinum",
  "associatedDebitCardName": "RuPay Women Platinum",
  "interest_credit_frequency": "Not specified in retrieved excerpt",
  "isZeroBalance": false,
  "isOnlineOpening": true,
  "isStudent": false,
  "isSalary": false,
  "isSeniorCitizen": false,
  "isWomenSpecial": true,
  "isDigital": true,
  "isPremium": false,
  "isNRI": false,
  "rating": 4.3,
  "isPopular": false,
  "source": "https://www.canarabank.bank.in/pages/canara-angel",
  "officialSourceUrl": "https://www.canarabank.bank.in/pages/canara-angel",
  "officialSource": "https://www.canarabank.bank.in/pages/canara-angel",
  "sourceType": "Official Bank Source",
  "sourceFile": "Canara Bank Product Dataset",
  "as_of_date": "2026-09-21",
  "lastVerified": "2026-09-21",
  "information_status": "Retrieved (partial)",
  "description": "Canara Angel (Orchid) offered by Canara Bank.",
  "eligibility": [
    "Women individuals; joint accounts not permitted",
    "Age: 18-70 years"
  ],
  "benefits": [
    "Cancer Care Rs 10 lakh; total free PAI Rs 26 lakh; card PAI Rs 2L; air accident cover for spouse Rs 4L; baggage Rs 50,000; purchase protection Rs 50,000; ATM Rs 1,00,000/day; family banking: Spouse + 2 Children",
    "Waived for all SB account types w.e.f. 01-06-2025 per official press release (canarabank.bank.in/documents/d/guest/31-05-2025-9only-in-english-canara-bank-waives-charges-for-non-maintenance-of-minimum-balance-for-all-sb-accounts). Benefits tied to balance may still be withdrawn - verify",
    "Standing instructions, nomination, netbanking"
  ],
  "keyBenefits": [
    "Cancer Care Rs 10 lakh; total free PAI Rs 26 lakh; card PAI Rs 2L; air accident cover for spouse Rs 4L; baggage Rs 50,000; purchase protection Rs 50,000; ATM Rs 1,00,000/day; family banking: Spouse + 2 Children",
    "Waived for all SB account types w.e.f. 01-06-2025 per official press release (canarabank.bank.in/documents/d/guest/31-05-2025-9only-in-english-canara-bank-waives-charges-for-non-maintenance-of-minimum-balance-for-all-sb-accounts). Benefits tied to balance may still be withdrawn - verify",
    "Standing instructions, nomination, netbanking"
  ],
  "features": [
    "Minimum Balance: QAB Rs 1,00,000 (quarterly average balance to receive benefits)",
    "Interest: 2.50% p.a. (bank-wide savings slab for balances below Rs 100 Cr; slabs rise to 4.00% only at Rs 2,000 Cr+). Source: canarabank.bank.in/domestic/nro/nre-savings-bank-deposits, effective 05.09.2026. Variant-specific rate not stated",
    "Internet / Mobile Banking: Not specified in retrieved excerpt"
  ],
  "bankingFeatures": [
    "Minimum Balance: QAB Rs 1,00,000 (quarterly average balance to receive benefits)",
    "Interest: 2.50% p.a. (bank-wide savings slab for balances below Rs 100 Cr; slabs rise to 4.00% only at Rs 2,000 Cr+). Source: canarabank.bank.in/domestic/nro/nre-savings-bank-deposits, effective 05.09.2026. Variant-specific rate not stated",
    "Internet / Mobile Banking: Not specified in retrieved excerpt"
  ],
  "debit_card_relationships": [
    {
      "card_id": "canara-bank-rupay-women-platinum",
      "relationship": "included",
      "verification_status": "verified"
    }
  ]
},
  {
  "id": 3008,
  "product_id": "canara-truedge",
  "bank_id": "canara-bank",
  "bank_name": "Canara Bank",
  "bankName": "Canara Bank",
  "bank": "Canara Bank",
  "logo": "CB",
  "variant_name": "Canara TruEdge",
  "accountName": "Canara TruEdge",
  "account_type": "Savings",
  "accountType": "Regular Savings",
  "target_segment": "Not yet retrieved",
  "targetCustomer": "Not yet retrieved",
  "accountTypeBadges": [
    "Savings",
    "Savings Account",
    "Public Sector Bank"
  ],
  "interest_rate": "2.50% p.a. (bank-wide savings slab for balances below Rs 100 Cr; slabs rise to 4.00% only at Rs 2,000 Cr+). Source: canarabank.bank.in/domestic/nro/nre-savings-bank-deposits, effective 05.09.2026. Variant-specific rate not stated",
  "interestRate": "2.50% p.a. (bank-wide savings slab for balances below Rs 100 Cr; slabs rise to 4.00% only at Rs 2,000 Cr+). Source: canarabank.bank.in/domestic/nro/nre-savings-bank-deposits, effective 05.09.2026. Variant-specific rate not stated",
  "interestRateValue": 2.5,
  "minimum_balance": "Not yet retrieved",
  "minimumBalance": "Not yet retrieved",
  "minimumBalanceValue": 1000,
  "maximum_balance": "No Limit",
  "salary_requirement": "Not applicable",
  "salaryRequirement": "Not applicable",
  "non_maintenance_penalty": "Waived for all SB account types w.e.f. 01-06-2025 per official press release (canarabank.bank.in/documents/d/guest/31-05-2025-9only-in-english-canara-bank-waives-charges-for-non-maintenance-of-minimum-balance-for-all-sb-accounts). Benefits tied to balance may still be withdrawn - verify",
  "nonMaintenanceCharges": "Waived for all SB account types w.e.f. 01-06-2025 per official press release (canarabank.bank.in/documents/d/guest/31-05-2025-9only-in-english-canara-bank-waives-charges-for-non-maintenance-of-minimum-balance-for-all-sb-accounts). Benefits tied to balance may still be withdrawn - verify",
  "cheque_book": "Not yet retrieved",
  "chequeBook": "Not yet retrieved",
  "atm_limits": "As per issued card variant",
  "atmLimits": "As per issued card variant",
  "debit_card": "Not yet retrieved",
  "debitCard": "Not yet retrieved",
  "associatedDebitCardName": "Not yet retrieved",
  "interest_credit_frequency": "Not yet retrieved",
  "isZeroBalance": false,
  "isOnlineOpening": true,
  "isStudent": false,
  "isSalary": false,
  "isSeniorCitizen": false,
  "isWomenSpecial": false,
  "isDigital": true,
  "isPremium": false,
  "isNRI": false,
  "rating": 4.3,
  "isPopular": false,
  "source": "https://www.canarabank.bank.in/canara-truedge",
  "officialSourceUrl": "https://www.canarabank.bank.in/canara-truedge",
  "officialSource": "https://www.canarabank.bank.in/canara-truedge",
  "sourceType": "Official Bank Source",
  "sourceFile": "Canara Bank Product Dataset",
  "as_of_date": "2026-09-21",
  "lastVerified": "2026-09-21",
  "information_status": "NOT RETRIEVED - listed on official menu only",
  "description": "Canara TruEdge offered by Canara Bank.",
  "eligibility": [
    "Not yet retrieved",
    "Age: Not yet retrieved"
  ],
  "benefits": [
    "Not yet retrieved",
    "Waived for all SB account types w.e.f. 01-06-2025 per official press release (canarabank.bank.in/documents/d/guest/31-05-2025-9only-in-english-canara-bank-waives-charges-for-non-maintenance-of-minimum-balance-for-all-sb-accounts). Benefits tied to balance may still be withdrawn - verify",
    "Standing instructions, nomination, netbanking"
  ],
  "keyBenefits": [
    "Not yet retrieved",
    "Waived for all SB account types w.e.f. 01-06-2025 per official press release (canarabank.bank.in/documents/d/guest/31-05-2025-9only-in-english-canara-bank-waives-charges-for-non-maintenance-of-minimum-balance-for-all-sb-accounts). Benefits tied to balance may still be withdrawn - verify",
    "Standing instructions, nomination, netbanking"
  ],
  "features": [
    "Minimum Balance: Not yet retrieved",
    "Interest: 2.50% p.a. (bank-wide savings slab for balances below Rs 100 Cr; slabs rise to 4.00% only at Rs 2,000 Cr+). Source: canarabank.bank.in/domestic/nro/nre-savings-bank-deposits, effective 05.09.2026. Variant-specific rate not stated",
    "Internet / Mobile Banking: Not yet retrieved"
  ],
  "bankingFeatures": [
    "Minimum Balance: Not yet retrieved",
    "Interest: 2.50% p.a. (bank-wide savings slab for balances below Rs 100 Cr; slabs rise to 4.00% only at Rs 2,000 Cr+). Source: canarabank.bank.in/domestic/nro/nre-savings-bank-deposits, effective 05.09.2026. Variant-specific rate not stated",
    "Internet / Mobile Banking: Not yet retrieved"
  ],
  "debit_card_relationships": []
},
  {
  "id": 3009,
  "product_id": "canara-sb-senior-citizen-jeevandhara",
  "bank_id": "canara-bank",
  "bank_name": "Canara Bank",
  "bankName": "Canara Bank",
  "bank": "Canara Bank",
  "logo": "CB",
  "variant_name": "SB Senior Citizen (Jeevandhara)",
  "accountName": "SB Senior Citizen (Jeevandhara)",
  "account_type": "Savings",
  "accountType": "Senior Citizen",
  "target_segment": "Not stated in retrieved excerpt",
  "targetCustomer": "Not stated in retrieved excerpt",
  "accountTypeBadges": [
    "Savings",
    "Savings Account",
    "Public Sector Bank"
  ],
  "interest_rate": "2.50% p.a. (bank-wide savings slab for balances below Rs 100 Cr; slabs rise to 4.00% only at Rs 2,000 Cr+). Source: canarabank.bank.in/domestic/nro/nre-savings-bank-deposits, effective 05.09.2026. Variant-specific rate not stated",
  "interestRate": "2.50% p.a. (bank-wide savings slab for balances below Rs 100 Cr; slabs rise to 4.00% only at Rs 2,000 Cr+). Source: canarabank.bank.in/domestic/nro/nre-savings-bank-deposits, effective 05.09.2026. Variant-specific rate not stated",
  "interestRateValue": 2.5,
  "minimum_balance": "No minimum balance requirement",
  "minimumBalance": "No minimum balance requirement",
  "minimumBalanceValue": 0,
  "maximum_balance": "No Limit",
  "salary_requirement": "Not applicable",
  "salaryRequirement": "Not applicable",
  "non_maintenance_penalty": "Waived for all SB account types w.e.f. 01-06-2025 per official press release (canarabank.bank.in/documents/d/guest/31-05-2025-9only-in-english-canara-bank-waives-charges-for-non-maintenance-of-minimum-balance-for-all-sb-accounts). Benefits tied to balance may still be withdrawn - verify",
  "nonMaintenanceCharges": "Waived for all SB account types w.e.f. 01-06-2025 per official press release (canarabank.bank.in/documents/d/guest/31-05-2025-9only-in-english-canara-bank-waives-charges-for-non-maintenance-of-minimum-balance-for-all-sb-accounts). Benefits tied to balance may still be withdrawn - verify",
  "cheque_book": "Not specified in retrieved excerpt",
  "chequeBook": "Not specified in retrieved excerpt",
  "atm_limits": "As per issued card variant",
  "atmLimits": "As per issued card variant",
  "debit_card": "Not named",
  "debitCard": "Not named",
  "associatedDebitCardName": "Not named",
  "interest_credit_frequency": "Not specified in retrieved excerpt",
  "isZeroBalance": true,
  "isOnlineOpening": true,
  "isStudent": false,
  "isSalary": false,
  "isSeniorCitizen": true,
  "isWomenSpecial": false,
  "isDigital": true,
  "isPremium": false,
  "isNRI": false,
  "rating": 4.3,
  "isPopular": false,
  "source": "https://www.canarabank.bank.in/sb-senior-citizen",
  "officialSourceUrl": "https://www.canarabank.bank.in/sb-senior-citizen",
  "officialSource": "https://www.canarabank.bank.in/sb-senior-citizen",
  "sourceType": "Official Bank Source",
  "sourceFile": "Canara Bank Product Dataset",
  "as_of_date": "2026-09-21",
  "lastVerified": "2026-09-21",
  "information_status": "Retrieved (partial)",
  "description": "SB Senior Citizen (Jeevandhara) offered by Canara Bank.",
  "eligibility": [
    "Not stated in retrieved excerpt",
    "Age: Not specified in retrieved excerpt"
  ],
  "benefits": [
    "Health insurance on softer terms; free unlimited ATM transactions at Canara ATMs; sweep-in/out; medicine purchase concession up to 25%",
    "Waived for all SB account types w.e.f. 01-06-2025 per official press release (canarabank.bank.in/documents/d/guest/31-05-2025-9only-in-english-canara-bank-waives-charges-for-non-maintenance-of-minimum-balance-for-all-sb-accounts). Benefits tied to balance may still be withdrawn - verify",
    "Standing instructions, nomination, netbanking"
  ],
  "keyBenefits": [
    "Health insurance on softer terms; free unlimited ATM transactions at Canara ATMs; sweep-in/out; medicine purchase concession up to 25%",
    "Waived for all SB account types w.e.f. 01-06-2025 per official press release (canarabank.bank.in/documents/d/guest/31-05-2025-9only-in-english-canara-bank-waives-charges-for-non-maintenance-of-minimum-balance-for-all-sb-accounts). Benefits tied to balance may still be withdrawn - verify",
    "Standing instructions, nomination, netbanking"
  ],
  "features": [
    "Minimum Balance: No minimum balance requirement",
    "Interest: 2.50% p.a. (bank-wide savings slab for balances below Rs 100 Cr; slabs rise to 4.00% only at Rs 2,000 Cr+). Source: canarabank.bank.in/domestic/nro/nre-savings-bank-deposits, effective 05.09.2026. Variant-specific rate not stated",
    "Internet / Mobile Banking: Not specified in retrieved excerpt"
  ],
  "bankingFeatures": [
    "Minimum Balance: No minimum balance requirement",
    "Interest: 2.50% p.a. (bank-wide savings slab for balances below Rs 100 Cr; slabs rise to 4.00% only at Rs 2,000 Cr+). Source: canarabank.bank.in/domestic/nro/nre-savings-bank-deposits, effective 05.09.2026. Variant-specific rate not stated",
    "Internet / Mobile Banking: Not specified in retrieved excerpt"
  ],
  "debit_card_relationships": []
},
  {
  "id": 3010,
  "product_id": "canara-jeevandhara-diamond",
  "bank_id": "canara-bank",
  "bank_name": "Canara Bank",
  "bankName": "Canara Bank",
  "bank": "Canara Bank",
  "logo": "CB",
  "variant_name": "Canara Jeevandhara Diamond",
  "accountName": "Canara Jeevandhara Diamond",
  "account_type": "Savings",
  "accountType": "Regular Savings",
  "target_segment": "Not yet retrieved",
  "targetCustomer": "Not yet retrieved",
  "accountTypeBadges": [
    "Savings",
    "Savings Account",
    "Public Sector Bank"
  ],
  "interest_rate": "2.50% p.a. (bank-wide savings slab for balances below Rs 100 Cr; slabs rise to 4.00% only at Rs 2,000 Cr+). Source: canarabank.bank.in/domestic/nro/nre-savings-bank-deposits, effective 05.09.2026. Variant-specific rate not stated",
  "interestRate": "2.50% p.a. (bank-wide savings slab for balances below Rs 100 Cr; slabs rise to 4.00% only at Rs 2,000 Cr+). Source: canarabank.bank.in/domestic/nro/nre-savings-bank-deposits, effective 05.09.2026. Variant-specific rate not stated",
  "interestRateValue": 2.5,
  "minimum_balance": "Not yet retrieved",
  "minimumBalance": "Not yet retrieved",
  "minimumBalanceValue": 1000,
  "maximum_balance": "No Limit",
  "salary_requirement": "Not applicable",
  "salaryRequirement": "Not applicable",
  "non_maintenance_penalty": "Waived for all SB account types w.e.f. 01-06-2025 per official press release (canarabank.bank.in/documents/d/guest/31-05-2025-9only-in-english-canara-bank-waives-charges-for-non-maintenance-of-minimum-balance-for-all-sb-accounts). Benefits tied to balance may still be withdrawn - verify",
  "nonMaintenanceCharges": "Waived for all SB account types w.e.f. 01-06-2025 per official press release (canarabank.bank.in/documents/d/guest/31-05-2025-9only-in-english-canara-bank-waives-charges-for-non-maintenance-of-minimum-balance-for-all-sb-accounts). Benefits tied to balance may still be withdrawn - verify",
  "cheque_book": "Not yet retrieved",
  "chequeBook": "Not yet retrieved",
  "atm_limits": "As per issued card variant",
  "atmLimits": "As per issued card variant",
  "debit_card": "Not yet retrieved",
  "debitCard": "Not yet retrieved",
  "associatedDebitCardName": "Not yet retrieved",
  "interest_credit_frequency": "Not yet retrieved",
  "isZeroBalance": false,
  "isOnlineOpening": true,
  "isStudent": false,
  "isSalary": false,
  "isSeniorCitizen": true,
  "isWomenSpecial": false,
  "isDigital": true,
  "isPremium": true,
  "isNRI": false,
  "rating": 4.3,
  "isPopular": false,
  "source": "https://www.canarabank.bank.in/canara-jeevandhara-diamond",
  "officialSourceUrl": "https://www.canarabank.bank.in/canara-jeevandhara-diamond",
  "officialSource": "https://www.canarabank.bank.in/canara-jeevandhara-diamond",
  "sourceType": "Official Bank Source",
  "sourceFile": "Canara Bank Product Dataset",
  "as_of_date": "2026-09-21",
  "lastVerified": "2026-09-21",
  "information_status": "NOT RETRIEVED - listed on official menu only",
  "description": "Canara Jeevandhara Diamond offered by Canara Bank.",
  "eligibility": [
    "Not yet retrieved",
    "Age: Not yet retrieved"
  ],
  "benefits": [
    "Not yet retrieved",
    "Waived for all SB account types w.e.f. 01-06-2025 per official press release (canarabank.bank.in/documents/d/guest/31-05-2025-9only-in-english-canara-bank-waives-charges-for-non-maintenance-of-minimum-balance-for-all-sb-accounts). Benefits tied to balance may still be withdrawn - verify",
    "Standing instructions, nomination, netbanking"
  ],
  "keyBenefits": [
    "Not yet retrieved",
    "Waived for all SB account types w.e.f. 01-06-2025 per official press release (canarabank.bank.in/documents/d/guest/31-05-2025-9only-in-english-canara-bank-waives-charges-for-non-maintenance-of-minimum-balance-for-all-sb-accounts). Benefits tied to balance may still be withdrawn - verify",
    "Standing instructions, nomination, netbanking"
  ],
  "features": [
    "Minimum Balance: Not yet retrieved",
    "Interest: 2.50% p.a. (bank-wide savings slab for balances below Rs 100 Cr; slabs rise to 4.00% only at Rs 2,000 Cr+). Source: canarabank.bank.in/domestic/nro/nre-savings-bank-deposits, effective 05.09.2026. Variant-specific rate not stated",
    "Internet / Mobile Banking: Not yet retrieved"
  ],
  "bankingFeatures": [
    "Minimum Balance: Not yet retrieved",
    "Interest: 2.50% p.a. (bank-wide savings slab for balances below Rs 100 Cr; slabs rise to 4.00% only at Rs 2,000 Cr+). Source: canarabank.bank.in/domestic/nro/nre-savings-bank-deposits, effective 05.09.2026. Variant-specific rate not stated",
    "Internet / Mobile Banking: Not yet retrieved"
  ],
  "debit_card_relationships": []
},
  {
  "id": 3011,
  "product_id": "canara-jeevandhara-platinum",
  "bank_id": "canara-bank",
  "bank_name": "Canara Bank",
  "bankName": "Canara Bank",
  "bank": "Canara Bank",
  "logo": "CB",
  "variant_name": "Canara Jeevandhara Platinum",
  "accountName": "Canara Jeevandhara Platinum",
  "account_type": "Savings",
  "accountType": "Regular Savings",
  "target_segment": "Not yet retrieved",
  "targetCustomer": "Not yet retrieved",
  "accountTypeBadges": [
    "Savings",
    "Savings Account",
    "Public Sector Bank"
  ],
  "interest_rate": "2.50% p.a. (bank-wide savings slab for balances below Rs 100 Cr; slabs rise to 4.00% only at Rs 2,000 Cr+). Source: canarabank.bank.in/domestic/nro/nre-savings-bank-deposits, effective 05.09.2026. Variant-specific rate not stated",
  "interestRate": "2.50% p.a. (bank-wide savings slab for balances below Rs 100 Cr; slabs rise to 4.00% only at Rs 2,000 Cr+). Source: canarabank.bank.in/domestic/nro/nre-savings-bank-deposits, effective 05.09.2026. Variant-specific rate not stated",
  "interestRateValue": 2.5,
  "minimum_balance": "Not yet retrieved",
  "minimumBalance": "Not yet retrieved",
  "minimumBalanceValue": 1000,
  "maximum_balance": "No Limit",
  "salary_requirement": "Not applicable",
  "salaryRequirement": "Not applicable",
  "non_maintenance_penalty": "Waived for all SB account types w.e.f. 01-06-2025 per official press release (canarabank.bank.in/documents/d/guest/31-05-2025-9only-in-english-canara-bank-waives-charges-for-non-maintenance-of-minimum-balance-for-all-sb-accounts). Benefits tied to balance may still be withdrawn - verify",
  "nonMaintenanceCharges": "Waived for all SB account types w.e.f. 01-06-2025 per official press release (canarabank.bank.in/documents/d/guest/31-05-2025-9only-in-english-canara-bank-waives-charges-for-non-maintenance-of-minimum-balance-for-all-sb-accounts). Benefits tied to balance may still be withdrawn - verify",
  "cheque_book": "Not yet retrieved",
  "chequeBook": "Not yet retrieved",
  "atm_limits": "As per issued card variant",
  "atmLimits": "As per issued card variant",
  "debit_card": "Not yet retrieved",
  "debitCard": "Not yet retrieved",
  "associatedDebitCardName": "Not yet retrieved",
  "interest_credit_frequency": "Not yet retrieved",
  "isZeroBalance": false,
  "isOnlineOpening": true,
  "isStudent": false,
  "isSalary": false,
  "isSeniorCitizen": true,
  "isWomenSpecial": false,
  "isDigital": true,
  "isPremium": true,
  "isNRI": false,
  "rating": 4.3,
  "isPopular": false,
  "source": "https://www.canarabank.bank.in/canara-jeevandhara-platinum",
  "officialSourceUrl": "https://www.canarabank.bank.in/canara-jeevandhara-platinum",
  "officialSource": "https://www.canarabank.bank.in/canara-jeevandhara-platinum",
  "sourceType": "Official Bank Source",
  "sourceFile": "Canara Bank Product Dataset",
  "as_of_date": "2026-09-21",
  "lastVerified": "2026-09-21",
  "information_status": "NOT RETRIEVED - listed on official menu only",
  "description": "Canara Jeevandhara Platinum offered by Canara Bank.",
  "eligibility": [
    "Not yet retrieved",
    "Age: Not yet retrieved"
  ],
  "benefits": [
    "Not yet retrieved",
    "Waived for all SB account types w.e.f. 01-06-2025 per official press release (canarabank.bank.in/documents/d/guest/31-05-2025-9only-in-english-canara-bank-waives-charges-for-non-maintenance-of-minimum-balance-for-all-sb-accounts). Benefits tied to balance may still be withdrawn - verify",
    "Standing instructions, nomination, netbanking"
  ],
  "keyBenefits": [
    "Not yet retrieved",
    "Waived for all SB account types w.e.f. 01-06-2025 per official press release (canarabank.bank.in/documents/d/guest/31-05-2025-9only-in-english-canara-bank-waives-charges-for-non-maintenance-of-minimum-balance-for-all-sb-accounts). Benefits tied to balance may still be withdrawn - verify",
    "Standing instructions, nomination, netbanking"
  ],
  "features": [
    "Minimum Balance: Not yet retrieved",
    "Interest: 2.50% p.a. (bank-wide savings slab for balances below Rs 100 Cr; slabs rise to 4.00% only at Rs 2,000 Cr+). Source: canarabank.bank.in/domestic/nro/nre-savings-bank-deposits, effective 05.09.2026. Variant-specific rate not stated",
    "Internet / Mobile Banking: Not yet retrieved"
  ],
  "bankingFeatures": [
    "Minimum Balance: Not yet retrieved",
    "Interest: 2.50% p.a. (bank-wide savings slab for balances below Rs 100 Cr; slabs rise to 4.00% only at Rs 2,000 Cr+). Source: canarabank.bank.in/domestic/nro/nre-savings-bank-deposits, effective 05.09.2026. Variant-specific rate not stated",
    "Internet / Mobile Banking: Not yet retrieved"
  ],
  "debit_card_relationships": []
},
  {
  "id": 3012,
  "product_id": "canara-sb-galaxy",
  "bank_id": "canara-bank",
  "bank_name": "Canara Bank",
  "bankName": "Canara Bank",
  "bank": "Canara Bank",
  "logo": "CB",
  "variant_name": "Canara SB Galaxy",
  "accountName": "Canara SB Galaxy",
  "account_type": "Savings",
  "accountType": "Regular Savings",
  "target_segment": "Not yet retrieved",
  "targetCustomer": "Not yet retrieved",
  "accountTypeBadges": [
    "Savings",
    "Savings Account",
    "Public Sector Bank"
  ],
  "interest_rate": "2.50% p.a. (bank-wide savings slab for balances below Rs 100 Cr; slabs rise to 4.00% only at Rs 2,000 Cr+). Source: canarabank.bank.in/domestic/nro/nre-savings-bank-deposits, effective 05.09.2026. Variant-specific rate not stated",
  "interestRate": "2.50% p.a. (bank-wide savings slab for balances below Rs 100 Cr; slabs rise to 4.00% only at Rs 2,000 Cr+). Source: canarabank.bank.in/domestic/nro/nre-savings-bank-deposits, effective 05.09.2026. Variant-specific rate not stated",
  "interestRateValue": 2.5,
  "minimum_balance": "Not yet retrieved",
  "minimumBalance": "Not yet retrieved",
  "minimumBalanceValue": 1000,
  "maximum_balance": "No Limit",
  "salary_requirement": "Not applicable",
  "salaryRequirement": "Not applicable",
  "non_maintenance_penalty": "Waived for all SB account types w.e.f. 01-06-2025 per official press release (canarabank.bank.in/documents/d/guest/31-05-2025-9only-in-english-canara-bank-waives-charges-for-non-maintenance-of-minimum-balance-for-all-sb-accounts). Benefits tied to balance may still be withdrawn - verify",
  "nonMaintenanceCharges": "Waived for all SB account types w.e.f. 01-06-2025 per official press release (canarabank.bank.in/documents/d/guest/31-05-2025-9only-in-english-canara-bank-waives-charges-for-non-maintenance-of-minimum-balance-for-all-sb-accounts). Benefits tied to balance may still be withdrawn - verify",
  "cheque_book": "Not yet retrieved",
  "chequeBook": "Not yet retrieved",
  "atm_limits": "As per issued card variant",
  "atmLimits": "As per issued card variant",
  "debit_card": "Not yet retrieved",
  "debitCard": "Not yet retrieved",
  "associatedDebitCardName": "Not yet retrieved",
  "interest_credit_frequency": "Not yet retrieved",
  "isZeroBalance": false,
  "isOnlineOpening": true,
  "isStudent": false,
  "isSalary": false,
  "isSeniorCitizen": false,
  "isWomenSpecial": false,
  "isDigital": true,
  "isPremium": false,
  "isNRI": false,
  "rating": 4.3,
  "isPopular": false,
  "source": "https://www.canarabank.bank.in/canara-sb-galaxy",
  "officialSourceUrl": "https://www.canarabank.bank.in/canara-sb-galaxy",
  "officialSource": "https://www.canarabank.bank.in/canara-sb-galaxy",
  "sourceType": "Official Bank Source",
  "sourceFile": "Canara Bank Product Dataset",
  "as_of_date": "2026-09-21",
  "lastVerified": "2026-09-21",
  "information_status": "NOT RETRIEVED - listed on official menu only",
  "description": "Canara SB Galaxy offered by Canara Bank.",
  "eligibility": [
    "Not yet retrieved",
    "Age: Not yet retrieved"
  ],
  "benefits": [
    "Not yet retrieved",
    "Waived for all SB account types w.e.f. 01-06-2025 per official press release (canarabank.bank.in/documents/d/guest/31-05-2025-9only-in-english-canara-bank-waives-charges-for-non-maintenance-of-minimum-balance-for-all-sb-accounts). Benefits tied to balance may still be withdrawn - verify",
    "Standing instructions, nomination, netbanking"
  ],
  "keyBenefits": [
    "Not yet retrieved",
    "Waived for all SB account types w.e.f. 01-06-2025 per official press release (canarabank.bank.in/documents/d/guest/31-05-2025-9only-in-english-canara-bank-waives-charges-for-non-maintenance-of-minimum-balance-for-all-sb-accounts). Benefits tied to balance may still be withdrawn - verify",
    "Standing instructions, nomination, netbanking"
  ],
  "features": [
    "Minimum Balance: Not yet retrieved",
    "Interest: 2.50% p.a. (bank-wide savings slab for balances below Rs 100 Cr; slabs rise to 4.00% only at Rs 2,000 Cr+). Source: canarabank.bank.in/domestic/nro/nre-savings-bank-deposits, effective 05.09.2026. Variant-specific rate not stated",
    "Internet / Mobile Banking: Not yet retrieved"
  ],
  "bankingFeatures": [
    "Minimum Balance: Not yet retrieved",
    "Interest: 2.50% p.a. (bank-wide savings slab for balances below Rs 100 Cr; slabs rise to 4.00% only at Rs 2,000 Cr+). Source: canarabank.bank.in/domestic/nro/nre-savings-bank-deposits, effective 05.09.2026. Variant-specific rate not stated",
    "Internet / Mobile Banking: Not yet retrieved"
  ],
  "debit_card_relationships": []
},
  {
  "id": 3013,
  "product_id": "canara-champ-deposit-scheme",
  "bank_id": "canara-bank",
  "bank_name": "Canara Bank",
  "bankName": "Canara Bank",
  "bank": "Canara Bank",
  "logo": "CB",
  "variant_name": "Canara Champ Deposit Scheme",
  "accountName": "Canara Champ Deposit Scheme",
  "account_type": "Savings",
  "accountType": "Regular Savings",
  "target_segment": "Not yet retrieved",
  "targetCustomer": "Not yet retrieved",
  "accountTypeBadges": [
    "Savings",
    "Savings Account",
    "Public Sector Bank"
  ],
  "interest_rate": "2.50% p.a. (bank-wide savings slab for balances below Rs 100 Cr; slabs rise to 4.00% only at Rs 2,000 Cr+). Source: canarabank.bank.in/domestic/nro/nre-savings-bank-deposits, effective 05.09.2026. Variant-specific rate not stated",
  "interestRate": "2.50% p.a. (bank-wide savings slab for balances below Rs 100 Cr; slabs rise to 4.00% only at Rs 2,000 Cr+). Source: canarabank.bank.in/domestic/nro/nre-savings-bank-deposits, effective 05.09.2026. Variant-specific rate not stated",
  "interestRateValue": 2.5,
  "minimum_balance": "Not yet retrieved",
  "minimumBalance": "Not yet retrieved",
  "minimumBalanceValue": 1000,
  "maximum_balance": "No Limit",
  "salary_requirement": "Not applicable",
  "salaryRequirement": "Not applicable",
  "non_maintenance_penalty": "Waived for all SB account types w.e.f. 01-06-2025 per official press release (canarabank.bank.in/documents/d/guest/31-05-2025-9only-in-english-canara-bank-waives-charges-for-non-maintenance-of-minimum-balance-for-all-sb-accounts). Benefits tied to balance may still be withdrawn - verify",
  "nonMaintenanceCharges": "Waived for all SB account types w.e.f. 01-06-2025 per official press release (canarabank.bank.in/documents/d/guest/31-05-2025-9only-in-english-canara-bank-waives-charges-for-non-maintenance-of-minimum-balance-for-all-sb-accounts). Benefits tied to balance may still be withdrawn - verify",
  "cheque_book": "Not yet retrieved",
  "chequeBook": "Not yet retrieved",
  "atm_limits": "As per issued card variant",
  "atmLimits": "As per issued card variant",
  "debit_card": "Not yet retrieved",
  "debitCard": "Not yet retrieved",
  "associatedDebitCardName": "Not yet retrieved",
  "interest_credit_frequency": "Not yet retrieved",
  "isZeroBalance": false,
  "isOnlineOpening": true,
  "isStudent": false,
  "isSalary": false,
  "isSeniorCitizen": false,
  "isWomenSpecial": false,
  "isDigital": true,
  "isPremium": false,
  "isNRI": false,
  "rating": 4.3,
  "isPopular": false,
  "source": "https://www.canarabank.bank.in/canara-champ-deposit-scheme",
  "officialSourceUrl": "https://www.canarabank.bank.in/canara-champ-deposit-scheme",
  "officialSource": "https://www.canarabank.bank.in/canara-champ-deposit-scheme",
  "sourceType": "Official Bank Source",
  "sourceFile": "Canara Bank Product Dataset",
  "as_of_date": "2026-09-21",
  "lastVerified": "2026-09-21",
  "information_status": "NOT RETRIEVED - listed on official menu only",
  "description": "Canara Champ Deposit Scheme offered by Canara Bank.",
  "eligibility": [
    "Not yet retrieved",
    "Age: Not yet retrieved"
  ],
  "benefits": [
    "Not yet retrieved",
    "Waived for all SB account types w.e.f. 01-06-2025 per official press release (canarabank.bank.in/documents/d/guest/31-05-2025-9only-in-english-canara-bank-waives-charges-for-non-maintenance-of-minimum-balance-for-all-sb-accounts). Benefits tied to balance may still be withdrawn - verify",
    "Standing instructions, nomination, netbanking"
  ],
  "keyBenefits": [
    "Not yet retrieved",
    "Waived for all SB account types w.e.f. 01-06-2025 per official press release (canarabank.bank.in/documents/d/guest/31-05-2025-9only-in-english-canara-bank-waives-charges-for-non-maintenance-of-minimum-balance-for-all-sb-accounts). Benefits tied to balance may still be withdrawn - verify",
    "Standing instructions, nomination, netbanking"
  ],
  "features": [
    "Minimum Balance: Not yet retrieved",
    "Interest: 2.50% p.a. (bank-wide savings slab for balances below Rs 100 Cr; slabs rise to 4.00% only at Rs 2,000 Cr+). Source: canarabank.bank.in/domestic/nro/nre-savings-bank-deposits, effective 05.09.2026. Variant-specific rate not stated",
    "Internet / Mobile Banking: Not yet retrieved"
  ],
  "bankingFeatures": [
    "Minimum Balance: Not yet retrieved",
    "Interest: 2.50% p.a. (bank-wide savings slab for balances below Rs 100 Cr; slabs rise to 4.00% only at Rs 2,000 Cr+). Source: canarabank.bank.in/domestic/nro/nre-savings-bank-deposits, effective 05.09.2026. Variant-specific rate not stated",
    "Internet / Mobile Banking: Not yet retrieved"
  ],
  "debit_card_relationships": []
},
  {
  "id": 3014,
  "product_id": "canara-junior-saving-account",
  "bank_id": "canara-bank",
  "bank_name": "Canara Bank",
  "bankName": "Canara Bank",
  "bank": "Canara Bank",
  "logo": "CB",
  "variant_name": "Canara Junior Saving Account",
  "accountName": "Canara Junior Saving Account",
  "account_type": "Savings",
  "accountType": "Regular Savings",
  "target_segment": "Not yet retrieved",
  "targetCustomer": "Not yet retrieved",
  "accountTypeBadges": [
    "Savings",
    "Savings Account",
    "Public Sector Bank"
  ],
  "interest_rate": "2.50% p.a. (bank-wide savings slab for balances below Rs 100 Cr; slabs rise to 4.00% only at Rs 2,000 Cr+). Source: canarabank.bank.in/domestic/nro/nre-savings-bank-deposits, effective 05.09.2026. Variant-specific rate not stated",
  "interestRate": "2.50% p.a. (bank-wide savings slab for balances below Rs 100 Cr; slabs rise to 4.00% only at Rs 2,000 Cr+). Source: canarabank.bank.in/domestic/nro/nre-savings-bank-deposits, effective 05.09.2026. Variant-specific rate not stated",
  "interestRateValue": 2.5,
  "minimum_balance": "Not yet retrieved",
  "minimumBalance": "Not yet retrieved",
  "minimumBalanceValue": 1000,
  "maximum_balance": "No Limit",
  "salary_requirement": "Not applicable",
  "salaryRequirement": "Not applicable",
  "non_maintenance_penalty": "Waived for all SB account types w.e.f. 01-06-2025 per official press release (canarabank.bank.in/documents/d/guest/31-05-2025-9only-in-english-canara-bank-waives-charges-for-non-maintenance-of-minimum-balance-for-all-sb-accounts). Benefits tied to balance may still be withdrawn - verify",
  "nonMaintenanceCharges": "Waived for all SB account types w.e.f. 01-06-2025 per official press release (canarabank.bank.in/documents/d/guest/31-05-2025-9only-in-english-canara-bank-waives-charges-for-non-maintenance-of-minimum-balance-for-all-sb-accounts). Benefits tied to balance may still be withdrawn - verify",
  "cheque_book": "Not yet retrieved",
  "chequeBook": "Not yet retrieved",
  "atm_limits": "As per issued card variant",
  "atmLimits": "As per issued card variant",
  "debit_card": "Not yet retrieved",
  "debitCard": "Not yet retrieved",
  "associatedDebitCardName": "Not yet retrieved",
  "interest_credit_frequency": "Not yet retrieved",
  "isZeroBalance": false,
  "isOnlineOpening": true,
  "isStudent": true,
  "isSalary": false,
  "isSeniorCitizen": false,
  "isWomenSpecial": false,
  "isDigital": true,
  "isPremium": false,
  "isNRI": false,
  "rating": 4.3,
  "isPopular": false,
  "source": "https://www.canarabank.bank.in/canara-junior-saving-account",
  "officialSourceUrl": "https://www.canarabank.bank.in/canara-junior-saving-account",
  "officialSource": "https://www.canarabank.bank.in/canara-junior-saving-account",
  "sourceType": "Official Bank Source",
  "sourceFile": "Canara Bank Product Dataset",
  "as_of_date": "2026-09-21",
  "lastVerified": "2026-09-21",
  "information_status": "NOT RETRIEVED - listed on official menu only",
  "description": "Canara Junior Saving Account offered by Canara Bank.",
  "eligibility": [
    "Not yet retrieved",
    "Age: Not yet retrieved"
  ],
  "benefits": [
    "Not yet retrieved",
    "Waived for all SB account types w.e.f. 01-06-2025 per official press release (canarabank.bank.in/documents/d/guest/31-05-2025-9only-in-english-canara-bank-waives-charges-for-non-maintenance-of-minimum-balance-for-all-sb-accounts). Benefits tied to balance may still be withdrawn - verify",
    "Standing instructions, nomination, netbanking"
  ],
  "keyBenefits": [
    "Not yet retrieved",
    "Waived for all SB account types w.e.f. 01-06-2025 per official press release (canarabank.bank.in/documents/d/guest/31-05-2025-9only-in-english-canara-bank-waives-charges-for-non-maintenance-of-minimum-balance-for-all-sb-accounts). Benefits tied to balance may still be withdrawn - verify",
    "Standing instructions, nomination, netbanking"
  ],
  "features": [
    "Minimum Balance: Not yet retrieved",
    "Interest: 2.50% p.a. (bank-wide savings slab for balances below Rs 100 Cr; slabs rise to 4.00% only at Rs 2,000 Cr+). Source: canarabank.bank.in/domestic/nro/nre-savings-bank-deposits, effective 05.09.2026. Variant-specific rate not stated",
    "Internet / Mobile Banking: Not yet retrieved"
  ],
  "bankingFeatures": [
    "Minimum Balance: Not yet retrieved",
    "Interest: 2.50% p.a. (bank-wide savings slab for balances below Rs 100 Cr; slabs rise to 4.00% only at Rs 2,000 Cr+). Source: canarabank.bank.in/domestic/nro/nre-savings-bank-deposits, effective 05.09.2026. Variant-specific rate not stated",
    "Internet / Mobile Banking: Not yet retrieved"
  ],
  "debit_card_relationships": []
},
  {
  "id": 3015,
  "product_id": "canara-pfms",
  "bank_id": "canara-bank",
  "bank_name": "Canara Bank",
  "bankName": "Canara Bank",
  "bank": "Canara Bank",
  "logo": "CB",
  "variant_name": "PFMS",
  "accountName": "PFMS",
  "account_type": "Savings",
  "accountType": "Regular Savings",
  "target_segment": "Not yet retrieved",
  "targetCustomer": "Not yet retrieved",
  "accountTypeBadges": [
    "Savings",
    "Savings Account",
    "Public Sector Bank"
  ],
  "interest_rate": "2.50% p.a. (bank-wide savings slab for balances below Rs 100 Cr; slabs rise to 4.00% only at Rs 2,000 Cr+). Source: canarabank.bank.in/domestic/nro/nre-savings-bank-deposits, effective 05.09.2026. Variant-specific rate not stated",
  "interestRate": "2.50% p.a. (bank-wide savings slab for balances below Rs 100 Cr; slabs rise to 4.00% only at Rs 2,000 Cr+). Source: canarabank.bank.in/domestic/nro/nre-savings-bank-deposits, effective 05.09.2026. Variant-specific rate not stated",
  "interestRateValue": 2.5,
  "minimum_balance": "Not yet retrieved",
  "minimumBalance": "Not yet retrieved",
  "minimumBalanceValue": 1000,
  "maximum_balance": "No Limit",
  "salary_requirement": "Not applicable",
  "salaryRequirement": "Not applicable",
  "non_maintenance_penalty": "Waived for all SB account types w.e.f. 01-06-2025 per official press release (canarabank.bank.in/documents/d/guest/31-05-2025-9only-in-english-canara-bank-waives-charges-for-non-maintenance-of-minimum-balance-for-all-sb-accounts). Benefits tied to balance may still be withdrawn - verify",
  "nonMaintenanceCharges": "Waived for all SB account types w.e.f. 01-06-2025 per official press release (canarabank.bank.in/documents/d/guest/31-05-2025-9only-in-english-canara-bank-waives-charges-for-non-maintenance-of-minimum-balance-for-all-sb-accounts). Benefits tied to balance may still be withdrawn - verify",
  "cheque_book": "Not yet retrieved",
  "chequeBook": "Not yet retrieved",
  "atm_limits": "As per issued card variant",
  "atmLimits": "As per issued card variant",
  "debit_card": "Not yet retrieved",
  "debitCard": "Not yet retrieved",
  "associatedDebitCardName": "Not yet retrieved",
  "interest_credit_frequency": "Not yet retrieved",
  "isZeroBalance": false,
  "isOnlineOpening": true,
  "isStudent": false,
  "isSalary": false,
  "isSeniorCitizen": false,
  "isWomenSpecial": false,
  "isDigital": true,
  "isPremium": false,
  "isNRI": false,
  "rating": 4.3,
  "isPopular": false,
  "source": "https://www.canarabank.bank.in/pfms",
  "officialSourceUrl": "https://www.canarabank.bank.in/pfms",
  "officialSource": "https://www.canarabank.bank.in/pfms",
  "sourceType": "Official Bank Source",
  "sourceFile": "Canara Bank Product Dataset",
  "as_of_date": "2026-09-21",
  "lastVerified": "2026-09-21",
  "information_status": "NOT RETRIEVED - listed on official menu only",
  "description": "PFMS offered by Canara Bank.",
  "eligibility": [
    "Not yet retrieved",
    "Age: Not yet retrieved"
  ],
  "benefits": [
    "Not yet retrieved",
    "Waived for all SB account types w.e.f. 01-06-2025 per official press release (canarabank.bank.in/documents/d/guest/31-05-2025-9only-in-english-canara-bank-waives-charges-for-non-maintenance-of-minimum-balance-for-all-sb-accounts). Benefits tied to balance may still be withdrawn - verify",
    "Standing instructions, nomination, netbanking"
  ],
  "keyBenefits": [
    "Not yet retrieved",
    "Waived for all SB account types w.e.f. 01-06-2025 per official press release (canarabank.bank.in/documents/d/guest/31-05-2025-9only-in-english-canara-bank-waives-charges-for-non-maintenance-of-minimum-balance-for-all-sb-accounts). Benefits tied to balance may still be withdrawn - verify",
    "Standing instructions, nomination, netbanking"
  ],
  "features": [
    "Minimum Balance: Not yet retrieved",
    "Interest: 2.50% p.a. (bank-wide savings slab for balances below Rs 100 Cr; slabs rise to 4.00% only at Rs 2,000 Cr+). Source: canarabank.bank.in/domestic/nro/nre-savings-bank-deposits, effective 05.09.2026. Variant-specific rate not stated",
    "Internet / Mobile Banking: Not yet retrieved"
  ],
  "bankingFeatures": [
    "Minimum Balance: Not yet retrieved",
    "Interest: 2.50% p.a. (bank-wide savings slab for balances below Rs 100 Cr; slabs rise to 4.00% only at Rs 2,000 Cr+). Source: canarabank.bank.in/domestic/nro/nre-savings-bank-deposits, effective 05.09.2026. Variant-specific rate not stated",
    "Internet / Mobile Banking: Not yet retrieved"
  ],
  "debit_card_relationships": []
},
  {
  "id": 3016,
  "product_id": "canara-bsbda",
  "bank_id": "canara-bank",
  "bank_name": "Canara Bank",
  "bankName": "Canara Bank",
  "bank": "Canara Bank",
  "logo": "CB",
  "variant_name": "Canara Basic Savings Bank Deposit Account (BSBDA)",
  "accountName": "Canara Basic Savings Bank Deposit Account (BSBDA)",
  "account_type": "Savings",
  "accountType": "Regular Savings",
  "target_segment": "Not specified in retrieved excerpt",
  "targetCustomer": "Not specified in retrieved excerpt",
  "accountTypeBadges": [
    "Savings",
    "Savings Account",
    "Public Sector Bank"
  ],
  "interest_rate": "2.50% p.a. (bank-wide savings slab for balances below Rs 100 Cr; slabs rise to 4.00% only at Rs 2,000 Cr+). Source: canarabank.bank.in/domestic/nro/nre-savings-bank-deposits, effective 05.09.2026. Variant-specific rate not stated",
  "interestRate": "2.50% p.a. (bank-wide savings slab for balances below Rs 100 Cr; slabs rise to 4.00% only at Rs 2,000 Cr+). Source: canarabank.bank.in/domestic/nro/nre-savings-bank-deposits, effective 05.09.2026. Variant-specific rate not stated",
  "interestRateValue": 2.5,
  "minimum_balance": "No minimum balance requirement",
  "minimumBalance": "No minimum balance requirement",
  "minimumBalanceValue": 0,
  "maximum_balance": "No Limit",
  "salary_requirement": "Not applicable",
  "salaryRequirement": "Not applicable",
  "non_maintenance_penalty": "Waived for all SB account types w.e.f. 01-06-2025 per official press release (canarabank.bank.in/documents/d/guest/31-05-2025-9only-in-english-canara-bank-waives-charges-for-non-maintenance-of-minimum-balance-for-all-sb-accounts). Benefits tied to balance may still be withdrawn - verify",
  "nonMaintenanceCharges": "Waived for all SB account types w.e.f. 01-06-2025 per official press release (canarabank.bank.in/documents/d/guest/31-05-2025-9only-in-english-canara-bank-waives-charges-for-non-maintenance-of-minimum-balance-for-all-sb-accounts). Benefits tied to balance may still be withdrawn - verify",
  "cheque_book": "Not specified in retrieved excerpt",
  "chequeBook": "Not specified in retrieved excerpt",
  "atm_limits": "As per issued card variant",
  "atmLimits": "As per issued card variant",
  "debit_card": "RuPay PMJDY (per Variants PDF: issued to PMJDY/BSBDA account)",
  "debitCard": "RuPay PMJDY (per Variants PDF: issued to PMJDY/BSBDA account)",
  "associatedDebitCardName": "RuPay PMJDY (per Variants PDF: issued to PMJDY/BSBDA account)",
  "interest_credit_frequency": "Not specified in retrieved excerpt",
  "isZeroBalance": true,
  "isOnlineOpening": true,
  "isStudent": false,
  "isSalary": false,
  "isSeniorCitizen": false,
  "isWomenSpecial": false,
  "isDigital": true,
  "isPremium": false,
  "isNRI": false,
  "rating": 4.3,
  "isPopular": false,
  "source": "https://www.canarabank.bank.in/canara-basic-savings-bank-deposit-account",
  "officialSourceUrl": "https://www.canarabank.bank.in/canara-basic-savings-bank-deposit-account",
  "officialSource": "https://www.canarabank.bank.in/canara-basic-savings-bank-deposit-account",
  "sourceType": "Official Bank Source",
  "sourceFile": "Canara Bank Product Dataset",
  "as_of_date": "2026-09-21",
  "lastVerified": "2026-09-21",
  "information_status": "Retrieved (partial)",
  "description": "Canara Basic Savings Bank Deposit Account (BSBDA) offered by Canara Bank.",
  "eligibility": [
    "Not specified in retrieved excerpt",
    "Age: Not specified in retrieved excerpt"
  ],
  "benefits": [
    "Free deposits, limited free withdrawals, ATM/debit card support, nomination, basic digital banking; RuPay PMJDY card PAI up to Rs 2 lakh; cash withdrawal Rs 75,000/day",
    "Waived for all SB account types w.e.f. 01-06-2025 per official press release (canarabank.bank.in/documents/d/guest/31-05-2025-9only-in-english-canara-bank-waives-charges-for-non-maintenance-of-minimum-balance-for-all-sb-accounts). Benefits tied to balance may still be withdrawn - verify",
    "Standing instructions, nomination, netbanking"
  ],
  "keyBenefits": [
    "Free deposits, limited free withdrawals, ATM/debit card support, nomination, basic digital banking; RuPay PMJDY card PAI up to Rs 2 lakh; cash withdrawal Rs 75,000/day",
    "Waived for all SB account types w.e.f. 01-06-2025 per official press release (canarabank.bank.in/documents/d/guest/31-05-2025-9only-in-english-canara-bank-waives-charges-for-non-maintenance-of-minimum-balance-for-all-sb-accounts). Benefits tied to balance may still be withdrawn - verify",
    "Standing instructions, nomination, netbanking"
  ],
  "features": [
    "Minimum Balance: No minimum balance requirement",
    "Interest: 2.50% p.a. (bank-wide savings slab for balances below Rs 100 Cr; slabs rise to 4.00% only at Rs 2,000 Cr+). Source: canarabank.bank.in/domestic/nro/nre-savings-bank-deposits, effective 05.09.2026. Variant-specific rate not stated",
    "Internet / Mobile Banking: Not specified in retrieved excerpt"
  ],
  "bankingFeatures": [
    "Minimum Balance: No minimum balance requirement",
    "Interest: 2.50% p.a. (bank-wide savings slab for balances below Rs 100 Cr; slabs rise to 4.00% only at Rs 2,000 Cr+). Source: canarabank.bank.in/domestic/nro/nre-savings-bank-deposits, effective 05.09.2026. Variant-specific rate not stated",
    "Internet / Mobile Banking: Not specified in retrieved excerpt"
  ],
  "debit_card_relationships": [
    {
      "card_id": "canara-bank-rupay-pmjdy",
      "relationship": "included",
      "verification_status": "verified"
    }
  ]
},
  {
  "id": 3017,
  "product_id": "canara-small-savings-bank-deposit-account",
  "bank_id": "canara-bank",
  "bank_name": "Canara Bank",
  "bankName": "Canara Bank",
  "bank": "Canara Bank",
  "logo": "CB",
  "variant_name": "Canara Small Savings Bank Deposit Account",
  "accountName": "Canara Small Savings Bank Deposit Account",
  "account_type": "Savings",
  "accountType": "Regular Savings",
  "target_segment": "Not yet retrieved",
  "targetCustomer": "Not yet retrieved",
  "accountTypeBadges": [
    "Savings",
    "Savings Account",
    "Public Sector Bank"
  ],
  "interest_rate": "2.50% p.a. (bank-wide savings slab for balances below Rs 100 Cr; slabs rise to 4.00% only at Rs 2,000 Cr+). Source: canarabank.bank.in/domestic/nro/nre-savings-bank-deposits, effective 05.09.2026. Variant-specific rate not stated",
  "interestRate": "2.50% p.a. (bank-wide savings slab for balances below Rs 100 Cr; slabs rise to 4.00% only at Rs 2,000 Cr+). Source: canarabank.bank.in/domestic/nro/nre-savings-bank-deposits, effective 05.09.2026. Variant-specific rate not stated",
  "interestRateValue": 2.5,
  "minimum_balance": "Not yet retrieved",
  "minimumBalance": "Not yet retrieved",
  "minimumBalanceValue": 1000,
  "maximum_balance": "No Limit",
  "salary_requirement": "Not applicable",
  "salaryRequirement": "Not applicable",
  "non_maintenance_penalty": "Waived for all SB account types w.e.f. 01-06-2025 per official press release (canarabank.bank.in/documents/d/guest/31-05-2025-9only-in-english-canara-bank-waives-charges-for-non-maintenance-of-minimum-balance-for-all-sb-accounts). Benefits tied to balance may still be withdrawn - verify",
  "nonMaintenanceCharges": "Waived for all SB account types w.e.f. 01-06-2025 per official press release (canarabank.bank.in/documents/d/guest/31-05-2025-9only-in-english-canara-bank-waives-charges-for-non-maintenance-of-minimum-balance-for-all-sb-accounts). Benefits tied to balance may still be withdrawn - verify",
  "cheque_book": "Not yet retrieved",
  "chequeBook": "Not yet retrieved",
  "atm_limits": "As per issued card variant",
  "atmLimits": "As per issued card variant",
  "debit_card": "Not yet retrieved",
  "debitCard": "Not yet retrieved",
  "associatedDebitCardName": "Not yet retrieved",
  "interest_credit_frequency": "Not yet retrieved",
  "isZeroBalance": false,
  "isOnlineOpening": true,
  "isStudent": false,
  "isSalary": false,
  "isSeniorCitizen": false,
  "isWomenSpecial": false,
  "isDigital": true,
  "isPremium": false,
  "isNRI": false,
  "rating": 4.3,
  "isPopular": false,
  "source": "https://www.canarabank.bank.in/canara-small-savings-bank-deposit-account",
  "officialSourceUrl": "https://www.canarabank.bank.in/canara-small-savings-bank-deposit-account",
  "officialSource": "https://www.canarabank.bank.in/canara-small-savings-bank-deposit-account",
  "sourceType": "Official Bank Source",
  "sourceFile": "Canara Bank Product Dataset",
  "as_of_date": "2026-09-21",
  "lastVerified": "2026-09-21",
  "information_status": "NOT RETRIEVED - listed on official menu only",
  "description": "Canara Small Savings Bank Deposit Account offered by Canara Bank.",
  "eligibility": [
    "Not yet retrieved",
    "Age: Not yet retrieved"
  ],
  "benefits": [
    "Not yet retrieved",
    "Waived for all SB account types w.e.f. 01-06-2025 per official press release (canarabank.bank.in/documents/d/guest/31-05-2025-9only-in-english-canara-bank-waives-charges-for-non-maintenance-of-minimum-balance-for-all-sb-accounts). Benefits tied to balance may still be withdrawn - verify",
    "Standing instructions, nomination, netbanking"
  ],
  "keyBenefits": [
    "Not yet retrieved",
    "Waived for all SB account types w.e.f. 01-06-2025 per official press release (canarabank.bank.in/documents/d/guest/31-05-2025-9only-in-english-canara-bank-waives-charges-for-non-maintenance-of-minimum-balance-for-all-sb-accounts). Benefits tied to balance may still be withdrawn - verify",
    "Standing instructions, nomination, netbanking"
  ],
  "features": [
    "Minimum Balance: Not yet retrieved",
    "Interest: 2.50% p.a. (bank-wide savings slab for balances below Rs 100 Cr; slabs rise to 4.00% only at Rs 2,000 Cr+). Source: canarabank.bank.in/domestic/nro/nre-savings-bank-deposits, effective 05.09.2026. Variant-specific rate not stated",
    "Internet / Mobile Banking: Not yet retrieved"
  ],
  "bankingFeatures": [
    "Minimum Balance: Not yet retrieved",
    "Interest: 2.50% p.a. (bank-wide savings slab for balances below Rs 100 Cr; slabs rise to 4.00% only at Rs 2,000 Cr+). Source: canarabank.bank.in/domestic/nro/nre-savings-bank-deposits, effective 05.09.2026. Variant-specific rate not stated",
    "Internet / Mobile Banking: Not yet retrieved"
  ],
  "debit_card_relationships": []
},
  {
  "id": 3018,
  "product_id": "canara-nsigse-savings-bank-deposit-account",
  "bank_id": "canara-bank",
  "bank_name": "Canara Bank",
  "bankName": "Canara Bank",
  "bank": "Canara Bank",
  "logo": "CB",
  "variant_name": "Canara NSIGSE Savings Bank Deposit Account",
  "accountName": "Canara NSIGSE Savings Bank Deposit Account",
  "account_type": "Savings",
  "accountType": "Regular Savings",
  "target_segment": "Not yet retrieved",
  "targetCustomer": "Not yet retrieved",
  "accountTypeBadges": [
    "Savings",
    "Savings Account",
    "Public Sector Bank"
  ],
  "interest_rate": "2.50% p.a. (bank-wide savings slab for balances below Rs 100 Cr; slabs rise to 4.00% only at Rs 2,000 Cr+). Source: canarabank.bank.in/domestic/nro/nre-savings-bank-deposits, effective 05.09.2026. Variant-specific rate not stated",
  "interestRate": "2.50% p.a. (bank-wide savings slab for balances below Rs 100 Cr; slabs rise to 4.00% only at Rs 2,000 Cr+). Source: canarabank.bank.in/domestic/nro/nre-savings-bank-deposits, effective 05.09.2026. Variant-specific rate not stated",
  "interestRateValue": 2.5,
  "minimum_balance": "Not yet retrieved",
  "minimumBalance": "Not yet retrieved",
  "minimumBalanceValue": 1000,
  "maximum_balance": "No Limit",
  "salary_requirement": "Not applicable",
  "salaryRequirement": "Not applicable",
  "non_maintenance_penalty": "Waived for all SB account types w.e.f. 01-06-2025 per official press release (canarabank.bank.in/documents/d/guest/31-05-2025-9only-in-english-canara-bank-waives-charges-for-non-maintenance-of-minimum-balance-for-all-sb-accounts). Benefits tied to balance may still be withdrawn - verify",
  "nonMaintenanceCharges": "Waived for all SB account types w.e.f. 01-06-2025 per official press release (canarabank.bank.in/documents/d/guest/31-05-2025-9only-in-english-canara-bank-waives-charges-for-non-maintenance-of-minimum-balance-for-all-sb-accounts). Benefits tied to balance may still be withdrawn - verify",
  "cheque_book": "Not yet retrieved",
  "chequeBook": "Not yet retrieved",
  "atm_limits": "As per issued card variant",
  "atmLimits": "As per issued card variant",
  "debit_card": "Not yet retrieved",
  "debitCard": "Not yet retrieved",
  "associatedDebitCardName": "Not yet retrieved",
  "interest_credit_frequency": "Not yet retrieved",
  "isZeroBalance": false,
  "isOnlineOpening": true,
  "isStudent": false,
  "isSalary": false,
  "isSeniorCitizen": false,
  "isWomenSpecial": false,
  "isDigital": true,
  "isPremium": false,
  "isNRI": false,
  "rating": 4.3,
  "isPopular": false,
  "source": "https://www.canarabank.bank.in/canara-nsigse-savings-bank-deposit-account",
  "officialSourceUrl": "https://www.canarabank.bank.in/canara-nsigse-savings-bank-deposit-account",
  "officialSource": "https://www.canarabank.bank.in/canara-nsigse-savings-bank-deposit-account",
  "sourceType": "Official Bank Source",
  "sourceFile": "Canara Bank Product Dataset",
  "as_of_date": "2026-09-21",
  "lastVerified": "2026-09-21",
  "information_status": "NOT RETRIEVED - listed on official menu only",
  "description": "Canara NSIGSE Savings Bank Deposit Account offered by Canara Bank.",
  "eligibility": [
    "Not yet retrieved",
    "Age: Not yet retrieved"
  ],
  "benefits": [
    "Not yet retrieved",
    "Waived for all SB account types w.e.f. 01-06-2025 per official press release (canarabank.bank.in/documents/d/guest/31-05-2025-9only-in-english-canara-bank-waives-charges-for-non-maintenance-of-minimum-balance-for-all-sb-accounts). Benefits tied to balance may still be withdrawn - verify",
    "Standing instructions, nomination, netbanking"
  ],
  "keyBenefits": [
    "Not yet retrieved",
    "Waived for all SB account types w.e.f. 01-06-2025 per official press release (canarabank.bank.in/documents/d/guest/31-05-2025-9only-in-english-canara-bank-waives-charges-for-non-maintenance-of-minimum-balance-for-all-sb-accounts). Benefits tied to balance may still be withdrawn - verify",
    "Standing instructions, nomination, netbanking"
  ],
  "features": [
    "Minimum Balance: Not yet retrieved",
    "Interest: 2.50% p.a. (bank-wide savings slab for balances below Rs 100 Cr; slabs rise to 4.00% only at Rs 2,000 Cr+). Source: canarabank.bank.in/domestic/nro/nre-savings-bank-deposits, effective 05.09.2026. Variant-specific rate not stated",
    "Internet / Mobile Banking: Not yet retrieved"
  ],
  "bankingFeatures": [
    "Minimum Balance: Not yet retrieved",
    "Interest: 2.50% p.a. (bank-wide savings slab for balances below Rs 100 Cr; slabs rise to 4.00% only at Rs 2,000 Cr+). Source: canarabank.bank.in/domestic/nro/nre-savings-bank-deposits, effective 05.09.2026. Variant-specific rate not stated",
    "Internet / Mobile Banking: Not yet retrieved"
  ],
  "debit_card_relationships": []
},
  {
  "id": 3019,
  "product_id": "canara-gigstar",
  "bank_id": "canara-bank",
  "bank_name": "Canara Bank",
  "bankName": "Canara Bank",
  "bank": "Canara Bank",
  "logo": "CB",
  "variant_name": "Canara GigStar",
  "accountName": "Canara GigStar",
  "account_type": "Savings",
  "accountType": "Regular Savings",
  "target_segment": "Not yet retrieved",
  "targetCustomer": "Not yet retrieved",
  "accountTypeBadges": [
    "Savings",
    "Savings Account",
    "Public Sector Bank"
  ],
  "interest_rate": "2.50% p.a. (bank-wide savings slab for balances below Rs 100 Cr; slabs rise to 4.00% only at Rs 2,000 Cr+). Source: canarabank.bank.in/domestic/nro/nre-savings-bank-deposits, effective 05.09.2026. Variant-specific rate not stated",
  "interestRate": "2.50% p.a. (bank-wide savings slab for balances below Rs 100 Cr; slabs rise to 4.00% only at Rs 2,000 Cr+). Source: canarabank.bank.in/domestic/nro/nre-savings-bank-deposits, effective 05.09.2026. Variant-specific rate not stated",
  "interestRateValue": 2.5,
  "minimum_balance": "Not yet retrieved",
  "minimumBalance": "Not yet retrieved",
  "minimumBalanceValue": 1000,
  "maximum_balance": "No Limit",
  "salary_requirement": "Not applicable",
  "salaryRequirement": "Not applicable",
  "non_maintenance_penalty": "Waived for all SB account types w.e.f. 01-06-2025 per official press release (canarabank.bank.in/documents/d/guest/31-05-2025-9only-in-english-canara-bank-waives-charges-for-non-maintenance-of-minimum-balance-for-all-sb-accounts). Benefits tied to balance may still be withdrawn - verify",
  "nonMaintenanceCharges": "Waived for all SB account types w.e.f. 01-06-2025 per official press release (canarabank.bank.in/documents/d/guest/31-05-2025-9only-in-english-canara-bank-waives-charges-for-non-maintenance-of-minimum-balance-for-all-sb-accounts). Benefits tied to balance may still be withdrawn - verify",
  "cheque_book": "Not yet retrieved",
  "chequeBook": "Not yet retrieved",
  "atm_limits": "As per issued card variant",
  "atmLimits": "As per issued card variant",
  "debit_card": "Not yet retrieved",
  "debitCard": "Not yet retrieved",
  "associatedDebitCardName": "Not yet retrieved",
  "interest_credit_frequency": "Not yet retrieved",
  "isZeroBalance": false,
  "isOnlineOpening": true,
  "isStudent": false,
  "isSalary": false,
  "isSeniorCitizen": false,
  "isWomenSpecial": false,
  "isDigital": true,
  "isPremium": false,
  "isNRI": false,
  "rating": 4.3,
  "isPopular": false,
  "source": "https://www.canarabank.bank.in/canara-gigstar",
  "officialSourceUrl": "https://www.canarabank.bank.in/canara-gigstar",
  "officialSource": "https://www.canarabank.bank.in/canara-gigstar",
  "sourceType": "Official Bank Source",
  "sourceFile": "Canara Bank Product Dataset",
  "as_of_date": "2026-09-21",
  "lastVerified": "2026-09-21",
  "information_status": "NOT RETRIEVED - listed on official menu only",
  "description": "Canara GigStar offered by Canara Bank.",
  "eligibility": [
    "Not yet retrieved",
    "Age: Not yet retrieved"
  ],
  "benefits": [
    "Not yet retrieved",
    "Waived for all SB account types w.e.f. 01-06-2025 per official press release (canarabank.bank.in/documents/d/guest/31-05-2025-9only-in-english-canara-bank-waives-charges-for-non-maintenance-of-minimum-balance-for-all-sb-accounts). Benefits tied to balance may still be withdrawn - verify",
    "Standing instructions, nomination, netbanking"
  ],
  "keyBenefits": [
    "Not yet retrieved",
    "Waived for all SB account types w.e.f. 01-06-2025 per official press release (canarabank.bank.in/documents/d/guest/31-05-2025-9only-in-english-canara-bank-waives-charges-for-non-maintenance-of-minimum-balance-for-all-sb-accounts). Benefits tied to balance may still be withdrawn - verify",
    "Standing instructions, nomination, netbanking"
  ],
  "features": [
    "Minimum Balance: Not yet retrieved",
    "Interest: 2.50% p.a. (bank-wide savings slab for balances below Rs 100 Cr; slabs rise to 4.00% only at Rs 2,000 Cr+). Source: canarabank.bank.in/domestic/nro/nre-savings-bank-deposits, effective 05.09.2026. Variant-specific rate not stated",
    "Internet / Mobile Banking: Not yet retrieved"
  ],
  "bankingFeatures": [
    "Minimum Balance: Not yet retrieved",
    "Interest: 2.50% p.a. (bank-wide savings slab for balances below Rs 100 Cr; slabs rise to 4.00% only at Rs 2,000 Cr+). Source: canarabank.bank.in/domestic/nro/nre-savings-bank-deposits, effective 05.09.2026. Variant-specific rate not stated",
    "Internet / Mobile Banking: Not yet retrieved"
  ],
  "debit_card_relationships": []
},
  {
  "id": 3020,
  "product_id": "canara-payroll-silver",
  "bank_id": "canara-bank",
  "bank_name": "Canara Bank",
  "bankName": "Canara Bank",
  "bank": "Canara Bank",
  "logo": "CB",
  "variant_name": "Canara Premium Payroll Package (Silver)",
  "accountName": "Canara Premium Payroll Package (Silver)",
  "account_type": "Salary / Payroll",
  "accountType": "Salary",
  "target_segment": "Employees of a firm/company with minimum 5 enrolments; salary mandate required",
  "targetCustomer": "Employees of a firm/company with minimum 5 enrolments; salary mandate required",
  "accountTypeBadges": [
    "Salary / Payroll",
    "Salary Package",
    "Public Sector Bank"
  ],
  "interest_rate": "2.50% p.a. (bank-wide savings slab for balances below Rs 100 Cr; slabs rise to 4.00% only at Rs 2,000 Cr+). Source: canarabank.bank.in/domestic/nro/nre-savings-bank-deposits, effective 05.09.2026. Variant-specific rate not stated",
  "interestRate": "2.50% p.a. (bank-wide savings slab for balances below Rs 100 Cr; slabs rise to 4.00% only at Rs 2,000 Cr+). Source: canarabank.bank.in/domestic/nro/nre-savings-bank-deposits, effective 05.09.2026. Variant-specific rate not stated",
  "interestRateValue": 2.5,
  "minimum_balance": "NIL",
  "minimumBalance": "NIL",
  "minimumBalanceValue": 0,
  "maximum_balance": "No Limit",
  "salary_requirement": "Employees of a firm/company with minimum 5 enrolments; salary mandate required",
  "salaryRequirement": "Employees of a firm/company with minimum 5 enrolments; salary mandate required",
  "non_maintenance_penalty": "Waived for all SB account types w.e.f. 01-06-2025 per official press release (canarabank.bank.in/documents/d/guest/31-05-2025-9only-in-english-canara-bank-waives-charges-for-non-maintenance-of-minimum-balance-for-all-sb-accounts). Benefits tied to balance may still be withdrawn - verify",
  "nonMaintenanceCharges": "Waived for all SB account types w.e.f. 01-06-2025 per official press release (canarabank.bank.in/documents/d/guest/31-05-2025-9only-in-english-canara-bank-waives-charges-for-non-maintenance-of-minimum-balance-for-all-sb-accounts). Benefits tied to balance may still be withdrawn - verify",
  "cheque_book": "Not specified in retrieved excerpt",
  "chequeBook": "Not specified in retrieved excerpt",
  "atm_limits": "As per issued card variant",
  "atmLimits": "As per issued card variant",
  "debit_card": "RuPay Platinum (per page description)",
  "debitCard": "RuPay Platinum (per page description)",
  "associatedDebitCardName": "RuPay Platinum (per page description)",
  "interest_credit_frequency": "Not specified in retrieved excerpt",
  "isZeroBalance": true,
  "isOnlineOpening": true,
  "isStudent": false,
  "isSalary": true,
  "isSeniorCitizen": false,
  "isWomenSpecial": false,
  "isDigital": true,
  "isPremium": false,
  "isNRI": false,
  "rating": 4.6,
  "isPopular": false,
  "source": "https://www.canarabank.bank.in/canara-premium-payroll-package-silver",
  "officialSourceUrl": "https://www.canarabank.bank.in/canara-premium-payroll-package-silver",
  "officialSource": "https://www.canarabank.bank.in/canara-premium-payroll-package-silver",
  "sourceType": "Official Bank Source",
  "sourceFile": "Canara Bank Product Dataset",
  "as_of_date": "2026-09-21",
  "lastVerified": "2026-09-21",
  "information_status": "Retrieved (partial)",
  "description": "Canara Premium Payroll Package (Silver) offered by Canara Bank.",
  "eligibility": [
    "Employees of a firm/company with minimum 5 enrolments; salary mandate required",
    "Age: 18-65 years"
  ],
  "benefits": [
    "Salary band < Rs 50,000/month; free term life, personal accident and air accident insurance; instant overdraft; free credit card issuance",
    "Waived for all SB account types w.e.f. 01-06-2025 per official press release (canarabank.bank.in/documents/d/guest/31-05-2025-9only-in-english-canara-bank-waives-charges-for-non-maintenance-of-minimum-balance-for-all-sb-accounts). Benefits tied to balance may still be withdrawn - verify",
    "Standing instructions, nomination, netbanking"
  ],
  "keyBenefits": [
    "Salary band < Rs 50,000/month; free term life, personal accident and air accident insurance; instant overdraft; free credit card issuance",
    "Waived for all SB account types w.e.f. 01-06-2025 per official press release (canarabank.bank.in/documents/d/guest/31-05-2025-9only-in-english-canara-bank-waives-charges-for-non-maintenance-of-minimum-balance-for-all-sb-accounts). Benefits tied to balance may still be withdrawn - verify",
    "Standing instructions, nomination, netbanking"
  ],
  "features": [
    "Minimum Balance: NIL",
    "Interest: 2.50% p.a. (bank-wide savings slab for balances below Rs 100 Cr; slabs rise to 4.00% only at Rs 2,000 Cr+). Source: canarabank.bank.in/domestic/nro/nre-savings-bank-deposits, effective 05.09.2026. Variant-specific rate not stated",
    "Internet / Mobile Banking: Not specified in retrieved excerpt"
  ],
  "bankingFeatures": [
    "Minimum Balance: NIL",
    "Interest: 2.50% p.a. (bank-wide savings slab for balances below Rs 100 Cr; slabs rise to 4.00% only at Rs 2,000 Cr+). Source: canarabank.bank.in/domestic/nro/nre-savings-bank-deposits, effective 05.09.2026. Variant-specific rate not stated",
    "Internet / Mobile Banking: Not specified in retrieved excerpt"
  ],
  "debit_card_relationships": [
    {
      "card_id": "canara-bank-rupay-platinum",
      "relationship": "included",
      "verification_status": "verified"
    }
  ]
},
  {
  "id": 3021,
  "product_id": "canara-payroll-gold",
  "bank_id": "canara-bank",
  "bank_name": "Canara Bank",
  "bankName": "Canara Bank",
  "bank": "Canara Bank",
  "logo": "CB",
  "variant_name": "Canara Premium Payroll Package (Gold)",
  "accountName": "Canara Premium Payroll Package (Gold)",
  "account_type": "Salary / Payroll",
  "accountType": "Salary",
  "target_segment": "Salaried employees; salary band Rs 50,000-1,00,000/month (per description)",
  "targetCustomer": "Salaried employees; salary band Rs 50,000-1,00,000/month (per description)",
  "accountTypeBadges": [
    "Salary / Payroll",
    "Salary Package",
    "Public Sector Bank"
  ],
  "interest_rate": "2.50% p.a. (bank-wide savings slab for balances below Rs 100 Cr; slabs rise to 4.00% only at Rs 2,000 Cr+). Source: canarabank.bank.in/domestic/nro/nre-savings-bank-deposits, effective 05.09.2026. Variant-specific rate not stated",
  "interestRate": "2.50% p.a. (bank-wide savings slab for balances below Rs 100 Cr; slabs rise to 4.00% only at Rs 2,000 Cr+). Source: canarabank.bank.in/domestic/nro/nre-savings-bank-deposits, effective 05.09.2026. Variant-specific rate not stated",
  "interestRateValue": 2.5,
  "minimum_balance": "Not specified in retrieved excerpt",
  "minimumBalance": "Not specified in retrieved excerpt",
  "minimumBalanceValue": 1000,
  "maximum_balance": "No Limit",
  "salary_requirement": "Salaried employees; salary band Rs 50,000-1,00,000/month (per description)",
  "salaryRequirement": "Salaried employees; salary band Rs 50,000-1,00,000/month (per description)",
  "non_maintenance_penalty": "Waived for all SB account types w.e.f. 01-06-2025 per official press release (canarabank.bank.in/documents/d/guest/31-05-2025-9only-in-english-canara-bank-waives-charges-for-non-maintenance-of-minimum-balance-for-all-sb-accounts). Benefits tied to balance may still be withdrawn - verify",
  "nonMaintenanceCharges": "Waived for all SB account types w.e.f. 01-06-2025 per official press release (canarabank.bank.in/documents/d/guest/31-05-2025-9only-in-english-canara-bank-waives-charges-for-non-maintenance-of-minimum-balance-for-all-sb-accounts). Benefits tied to balance may still be withdrawn - verify",
  "cheque_book": "Free 200 leaves/annum",
  "chequeBook": "Free 200 leaves/annum",
  "atm_limits": "As per issued card variant",
  "atmLimits": "As per issued card variant",
  "debit_card": "RuPay Platinum",
  "debitCard": "RuPay Platinum",
  "associatedDebitCardName": "RuPay Platinum",
  "interest_credit_frequency": "Not specified in retrieved excerpt",
  "isZeroBalance": false,
  "isOnlineOpening": true,
  "isStudent": false,
  "isSalary": true,
  "isSeniorCitizen": false,
  "isWomenSpecial": false,
  "isDigital": true,
  "isPremium": false,
  "isNRI": false,
  "rating": 4.6,
  "isPopular": true,
  "source": "https://www.canarabank.bank.in/canara-premium-payroll-package-gold",
  "officialSourceUrl": "https://www.canarabank.bank.in/canara-premium-payroll-package-gold",
  "officialSource": "https://www.canarabank.bank.in/canara-premium-payroll-package-gold",
  "sourceType": "Official Bank Source",
  "sourceFile": "Canara Bank Product Dataset",
  "as_of_date": "2026-09-21",
  "lastVerified": "2026-09-21",
  "information_status": "Retrieved (partial)",
  "description": "Canara Premium Payroll Package (Gold) offered by Canara Bank.",
  "eligibility": [
    "Salaried employees; salary band Rs 50,000-1,00,000/month (per description)",
    "Age: Not specified in retrieved excerpt"
  ],
  "benefits": [
    "ATM Rs 1,00,000/day; POS Rs 5,00,000/day; NFC Rs 25,000/day; free unlimited txns at Canara ATMs; free DDs up to average balance; credit card issuance free with 25% AMC waiver; free term life, PAI, air accident insurance; instant OD; zero-balance family accounts",
    "Waived for all SB account types w.e.f. 01-06-2025 per official press release (canarabank.bank.in/documents/d/guest/31-05-2025-9only-in-english-canara-bank-waives-charges-for-non-maintenance-of-minimum-balance-for-all-sb-accounts). Benefits tied to balance may still be withdrawn - verify",
    "Standing instructions, nomination, netbanking"
  ],
  "keyBenefits": [
    "ATM Rs 1,00,000/day; POS Rs 5,00,000/day; NFC Rs 25,000/day; free unlimited txns at Canara ATMs; free DDs up to average balance; credit card issuance free with 25% AMC waiver; free term life, PAI, air accident insurance; instant OD; zero-balance family accounts",
    "Waived for all SB account types w.e.f. 01-06-2025 per official press release (canarabank.bank.in/documents/d/guest/31-05-2025-9only-in-english-canara-bank-waives-charges-for-non-maintenance-of-minimum-balance-for-all-sb-accounts). Benefits tied to balance may still be withdrawn - verify",
    "Standing instructions, nomination, netbanking"
  ],
  "features": [
    "Minimum Balance: Not specified in retrieved excerpt",
    "Interest: 2.50% p.a. (bank-wide savings slab for balances below Rs 100 Cr; slabs rise to 4.00% only at Rs 2,000 Cr+). Source: canarabank.bank.in/domestic/nro/nre-savings-bank-deposits, effective 05.09.2026. Variant-specific rate not stated",
    "Internet / Mobile Banking: Not specified in retrieved excerpt"
  ],
  "bankingFeatures": [
    "Minimum Balance: Not specified in retrieved excerpt",
    "Interest: 2.50% p.a. (bank-wide savings slab for balances below Rs 100 Cr; slabs rise to 4.00% only at Rs 2,000 Cr+). Source: canarabank.bank.in/domestic/nro/nre-savings-bank-deposits, effective 05.09.2026. Variant-specific rate not stated",
    "Internet / Mobile Banking: Not specified in retrieved excerpt"
  ],
  "debit_card_relationships": [
    {
      "card_id": "canara-bank-rupay-platinum",
      "relationship": "included",
      "verification_status": "verified"
    }
  ]
},
  {
  "id": 3022,
  "product_id": "canara-payroll-diamond",
  "bank_id": "canara-bank",
  "bank_name": "Canara Bank",
  "bankName": "Canara Bank",
  "bank": "Canara Bank",
  "logo": "CB",
  "variant_name": "Canara Premium Payroll Package (Diamond)",
  "accountName": "Canara Premium Payroll Package (Diamond)",
  "account_type": "Salary / Payroll",
  "accountType": "Salary",
  "target_segment": "Salaried; salary band Rs 1,00,000-1,50,000/month (per description)",
  "targetCustomer": "Salaried; salary band Rs 1,00,000-1,50,000/month (per description)",
  "accountTypeBadges": [
    "Salary / Payroll",
    "Salary Package",
    "Public Sector Bank"
  ],
  "interest_rate": "2.50% p.a. (bank-wide savings slab for balances below Rs 100 Cr; slabs rise to 4.00% only at Rs 2,000 Cr+). Source: canarabank.bank.in/domestic/nro/nre-savings-bank-deposits, effective 05.09.2026. Variant-specific rate not stated",
  "interestRate": "2.50% p.a. (bank-wide savings slab for balances below Rs 100 Cr; slabs rise to 4.00% only at Rs 2,000 Cr+). Source: canarabank.bank.in/domestic/nro/nre-savings-bank-deposits, effective 05.09.2026. Variant-specific rate not stated",
  "interestRateValue": 2.5,
  "minimum_balance": "NIL",
  "minimumBalance": "NIL",
  "minimumBalanceValue": 0,
  "maximum_balance": "No Limit",
  "salary_requirement": "Salaried; salary band Rs 1,00,000-1,50,000/month (per description)",
  "salaryRequirement": "Salaried; salary band Rs 1,00,000-1,50,000/month (per description)",
  "non_maintenance_penalty": "Waived for all SB account types w.e.f. 01-06-2025 per official press release (canarabank.bank.in/documents/d/guest/31-05-2025-9only-in-english-canara-bank-waives-charges-for-non-maintenance-of-minimum-balance-for-all-sb-accounts). Benefits tied to balance may still be withdrawn - verify",
  "nonMaintenanceCharges": "Waived for all SB account types w.e.f. 01-06-2025 per official press release (canarabank.bank.in/documents/d/guest/31-05-2025-9only-in-english-canara-bank-waives-charges-for-non-maintenance-of-minimum-balance-for-all-sb-accounts). Benefits tied to balance may still be withdrawn - verify",
  "cheque_book": "Free 200 leaves/annum",
  "chequeBook": "Free 200 leaves/annum",
  "atm_limits": "As per issued card variant",
  "atmLimits": "As per issued card variant",
  "debit_card": "RuPay Select",
  "debitCard": "RuPay Select",
  "associatedDebitCardName": "RuPay Select",
  "interest_credit_frequency": "Not specified in retrieved excerpt",
  "isZeroBalance": true,
  "isOnlineOpening": true,
  "isStudent": false,
  "isSalary": true,
  "isSeniorCitizen": false,
  "isWomenSpecial": false,
  "isDigital": true,
  "isPremium": true,
  "isNRI": false,
  "rating": 4.6,
  "isPopular": false,
  "source": "https://www.canarabank.bank.in/canara-premium-payroll-package-diamond",
  "officialSourceUrl": "https://www.canarabank.bank.in/canara-premium-payroll-package-diamond",
  "officialSource": "https://www.canarabank.bank.in/canara-premium-payroll-package-diamond",
  "sourceType": "Official Bank Source",
  "sourceFile": "Canara Bank Product Dataset",
  "as_of_date": "2026-09-21",
  "lastVerified": "2026-09-21",
  "information_status": "Retrieved (partial)",
  "description": "Canara Premium Payroll Package (Diamond) offered by Canara Bank.",
  "eligibility": [
    "Salaried; salary band Rs 1,00,000-1,50,000/month (per description)",
    "Age: Not specified in retrieved excerpt"
  ],
  "benefits": [
    "ATM Rs 1,00,000/day; free DDs up to average balance; credit card issuance free, AMC 50% waiver; instant overdraft (3 months net salary) up to Rs 2 lakh; free term life, PAI and air accident insurance; zero-balance family accounts; discounts on e-com/OTT via card",
    "Waived for all SB account types w.e.f. 01-06-2025 per official press release (canarabank.bank.in/documents/d/guest/31-05-2025-9only-in-english-canara-bank-waives-charges-for-non-maintenance-of-minimum-balance-for-all-sb-accounts). Benefits tied to balance may still be withdrawn - verify",
    "Standing instructions, nomination, netbanking"
  ],
  "keyBenefits": [
    "ATM Rs 1,00,000/day; free DDs up to average balance; credit card issuance free, AMC 50% waiver; instant overdraft (3 months net salary) up to Rs 2 lakh; free term life, PAI and air accident insurance; zero-balance family accounts; discounts on e-com/OTT via card",
    "Waived for all SB account types w.e.f. 01-06-2025 per official press release (canarabank.bank.in/documents/d/guest/31-05-2025-9only-in-english-canara-bank-waives-charges-for-non-maintenance-of-minimum-balance-for-all-sb-accounts). Benefits tied to balance may still be withdrawn - verify",
    "Standing instructions, nomination, netbanking"
  ],
  "features": [
    "Minimum Balance: NIL",
    "Interest: 2.50% p.a. (bank-wide savings slab for balances below Rs 100 Cr; slabs rise to 4.00% only at Rs 2,000 Cr+). Source: canarabank.bank.in/domestic/nro/nre-savings-bank-deposits, effective 05.09.2026. Variant-specific rate not stated",
    "Internet / Mobile Banking: Not specified in retrieved excerpt"
  ],
  "bankingFeatures": [
    "Minimum Balance: NIL",
    "Interest: 2.50% p.a. (bank-wide savings slab for balances below Rs 100 Cr; slabs rise to 4.00% only at Rs 2,000 Cr+). Source: canarabank.bank.in/domestic/nro/nre-savings-bank-deposits, effective 05.09.2026. Variant-specific rate not stated",
    "Internet / Mobile Banking: Not specified in retrieved excerpt"
  ],
  "debit_card_relationships": [
    {
      "card_id": "canara-bank-rupay-select",
      "relationship": "included",
      "verification_status": "verified"
    }
  ]
},
  {
  "id": 3023,
  "product_id": "canara-payroll-platinum",
  "bank_id": "canara-bank",
  "bank_name": "Canara Bank",
  "bankName": "Canara Bank",
  "bank": "Canara Bank",
  "logo": "CB",
  "variant_name": "Canara Premium Payroll Package (Platinum)",
  "accountName": "Canara Premium Payroll Package (Platinum)",
  "account_type": "Salary / Payroll",
  "accountType": "Salary",
  "target_segment": "Any salary holder; salary band Rs 1,50,000/month and above; salary mandate required",
  "targetCustomer": "Any salary holder; salary band Rs 1,50,000/month and above; salary mandate required",
  "accountTypeBadges": [
    "Salary / Payroll",
    "Salary Package",
    "Public Sector Bank"
  ],
  "interest_rate": "2.50% p.a. (bank-wide savings slab for balances below Rs 100 Cr; slabs rise to 4.00% only at Rs 2,000 Cr+). Source: canarabank.bank.in/domestic/nro/nre-savings-bank-deposits, effective 05.09.2026. Variant-specific rate not stated",
  "interestRate": "2.50% p.a. (bank-wide savings slab for balances below Rs 100 Cr; slabs rise to 4.00% only at Rs 2,000 Cr+). Source: canarabank.bank.in/domestic/nro/nre-savings-bank-deposits, effective 05.09.2026. Variant-specific rate not stated",
  "interestRateValue": 2.5,
  "minimum_balance": "Not specified in retrieved excerpt",
  "minimumBalance": "Not specified in retrieved excerpt",
  "minimumBalanceValue": 1000,
  "maximum_balance": "No Limit",
  "salary_requirement": "Any salary holder; salary band Rs 1,50,000/month and above; salary mandate required",
  "salaryRequirement": "Any salary holder; salary band Rs 1,50,000/month and above; salary mandate required",
  "non_maintenance_penalty": "Waived for all SB account types w.e.f. 01-06-2025 per official press release (canarabank.bank.in/documents/d/guest/31-05-2025-9only-in-english-canara-bank-waives-charges-for-non-maintenance-of-minimum-balance-for-all-sb-accounts). Benefits tied to balance may still be withdrawn - verify",
  "nonMaintenanceCharges": "Waived for all SB account types w.e.f. 01-06-2025 per official press release (canarabank.bank.in/documents/d/guest/31-05-2025-9only-in-english-canara-bank-waives-charges-for-non-maintenance-of-minimum-balance-for-all-sb-accounts). Benefits tied to balance may still be withdrawn - verify",
  "cheque_book": "Free 200 leaves/annum",
  "chequeBook": "Free 200 leaves/annum",
  "atm_limits": "As per issued card variant",
  "atmLimits": "As per issued card variant",
  "debit_card": "RuPay Select",
  "debitCard": "RuPay Select",
  "associatedDebitCardName": "RuPay Select",
  "interest_credit_frequency": "Not specified in retrieved excerpt",
  "isZeroBalance": false,
  "isOnlineOpening": true,
  "isStudent": false,
  "isSalary": true,
  "isSeniorCitizen": false,
  "isWomenSpecial": false,
  "isDigital": true,
  "isPremium": true,
  "isNRI": false,
  "rating": 4.6,
  "isPopular": false,
  "source": "https://www.canarabank.bank.in/canara-premium-payroll-package-platinum",
  "officialSourceUrl": "https://www.canarabank.bank.in/canara-premium-payroll-package-platinum",
  "officialSource": "https://www.canarabank.bank.in/canara-premium-payroll-package-platinum",
  "sourceType": "Official Bank Source",
  "sourceFile": "Canara Bank Product Dataset",
  "as_of_date": "2026-09-21",
  "lastVerified": "2026-09-21",
  "information_status": "Retrieved (partial)",
  "description": "Canara Premium Payroll Package (Platinum) offered by Canara Bank.",
  "eligibility": [
    "Any salary holder; salary band Rs 1,50,000/month and above; salary mandate required",
    "Age: 18-65 years"
  ],
  "benefits": [
    "ATM Rs 1,00,000/day; POS Rs 5,00,000/day; NFC Rs 25,000/day; free unlimited txns at Canara ATMs; free DDs up to average balance; free credit card issuance and AMC; instant OD (3 months net salary) up to Rs 3 lakh; free term life, PAI, air accident insurance; zero-balance family accounts (Spouse + 2 Children)",
    "Waived for all SB account types w.e.f. 01-06-2025 per official press release (canarabank.bank.in/documents/d/guest/31-05-2025-9only-in-english-canara-bank-waives-charges-for-non-maintenance-of-minimum-balance-for-all-sb-accounts). Benefits tied to balance may still be withdrawn - verify",
    "Standing instructions, nomination, netbanking"
  ],
  "keyBenefits": [
    "ATM Rs 1,00,000/day; POS Rs 5,00,000/day; NFC Rs 25,000/day; free unlimited txns at Canara ATMs; free DDs up to average balance; free credit card issuance and AMC; instant OD (3 months net salary) up to Rs 3 lakh; free term life, PAI, air accident insurance; zero-balance family accounts (Spouse + 2 Children)",
    "Waived for all SB account types w.e.f. 01-06-2025 per official press release (canarabank.bank.in/documents/d/guest/31-05-2025-9only-in-english-canara-bank-waives-charges-for-non-maintenance-of-minimum-balance-for-all-sb-accounts). Benefits tied to balance may still be withdrawn - verify",
    "Standing instructions, nomination, netbanking"
  ],
  "features": [
    "Minimum Balance: Not specified in retrieved excerpt",
    "Interest: 2.50% p.a. (bank-wide savings slab for balances below Rs 100 Cr; slabs rise to 4.00% only at Rs 2,000 Cr+). Source: canarabank.bank.in/domestic/nro/nre-savings-bank-deposits, effective 05.09.2026. Variant-specific rate not stated",
    "Internet / Mobile Banking: Not specified in retrieved excerpt"
  ],
  "bankingFeatures": [
    "Minimum Balance: Not specified in retrieved excerpt",
    "Interest: 2.50% p.a. (bank-wide savings slab for balances below Rs 100 Cr; slabs rise to 4.00% only at Rs 2,000 Cr+). Source: canarabank.bank.in/domestic/nro/nre-savings-bank-deposits, effective 05.09.2026. Variant-specific rate not stated",
    "Internet / Mobile Banking: Not specified in retrieved excerpt"
  ],
  "debit_card_relationships": [
    {
      "card_id": "canara-bank-rupay-select",
      "relationship": "included",
      "verification_status": "verified"
    }
  ]
},
  {
  "id": 3024,
  "product_id": "canara-central-govt-salary",
  "bank_id": "canara-bank",
  "bank_name": "Canara Bank",
  "bankName": "Canara Bank",
  "bank": "Canara Bank",
  "logo": "CB",
  "variant_name": "Central Government Employees Salary Package (page: Canara Premium Payroll Gold Plus)",
  "accountName": "Central Government Employees Salary Package (page: Canara Premium Payroll Gold Plus)",
  "account_type": "Salary / Payroll",
  "accountType": "Salary",
  "target_segment": "All employees of Central Government Departments; salary band up to Rs 70,000/month; salary mandate required",
  "targetCustomer": "All employees of Central Government Departments; salary band up to Rs 70,000/month; salary mandate required",
  "accountTypeBadges": [
    "Salary / Payroll",
    "Salary Package",
    "Public Sector Bank"
  ],
  "interest_rate": "2.50% p.a. (bank-wide savings slab for balances below Rs 100 Cr; slabs rise to 4.00% only at Rs 2,000 Cr+). Source: canarabank.bank.in/domestic/nro/nre-savings-bank-deposits, effective 05.09.2026. Variant-specific rate not stated",
  "interestRate": "2.50% p.a. (bank-wide savings slab for balances below Rs 100 Cr; slabs rise to 4.00% only at Rs 2,000 Cr+). Source: canarabank.bank.in/domestic/nro/nre-savings-bank-deposits, effective 05.09.2026. Variant-specific rate not stated",
  "interestRateValue": 2.5,
  "minimum_balance": "NIL",
  "minimumBalance": "NIL",
  "minimumBalanceValue": 0,
  "maximum_balance": "No Limit",
  "salary_requirement": "All employees of Central Government Departments; salary band up to Rs 70,000/month; salary mandate required",
  "salaryRequirement": "All employees of Central Government Departments; salary band up to Rs 70,000/month; salary mandate required",
  "non_maintenance_penalty": "Waived for all SB account types w.e.f. 01-06-2025 per official press release (canarabank.bank.in/documents/d/guest/31-05-2025-9only-in-english-canara-bank-waives-charges-for-non-maintenance-of-minimum-balance-for-all-sb-accounts). Benefits tied to balance may still be withdrawn - verify",
  "nonMaintenanceCharges": "Waived for all SB account types w.e.f. 01-06-2025 per official press release (canarabank.bank.in/documents/d/guest/31-05-2025-9only-in-english-canara-bank-waives-charges-for-non-maintenance-of-minimum-balance-for-all-sb-accounts). Benefits tied to balance may still be withdrawn - verify",
  "cheque_book": "Free 200 leaves/annum",
  "chequeBook": "Free 200 leaves/annum",
  "atm_limits": "As per issued card variant",
  "atmLimits": "As per issued card variant",
  "debit_card": "RuPay Platinum",
  "debitCard": "RuPay Platinum",
  "associatedDebitCardName": "RuPay Platinum",
  "interest_credit_frequency": "Not specified in retrieved excerpt",
  "isZeroBalance": true,
  "isOnlineOpening": true,
  "isStudent": false,
  "isSalary": true,
  "isSeniorCitizen": false,
  "isWomenSpecial": false,
  "isDigital": true,
  "isPremium": false,
  "isNRI": false,
  "rating": 4.6,
  "isPopular": false,
  "source": "https://www.canarabank.bank.in/pages/canara-premium-payroll-gold-plus",
  "officialSourceUrl": "https://www.canarabank.bank.in/pages/canara-premium-payroll-gold-plus",
  "officialSource": "https://www.canarabank.bank.in/pages/canara-premium-payroll-gold-plus",
  "sourceType": "Official Bank Source",
  "sourceFile": "Canara Bank Product Dataset",
  "as_of_date": "2026-09-21",
  "lastVerified": "2026-09-21",
  "information_status": "Retrieved (partial)",
  "description": "Central Government Employees Salary Package (page: Canara Premium Payroll Gold Plus) offered by Canara Bank.",
  "eligibility": [
    "All employees of Central Government Departments; salary band up to Rs 70,000/month; salary mandate required",
    "Age: 18-65 years"
  ],
  "benefits": [
    "ATM Rs 1,00,000/day; POS Rs 5,00,000/day; NFC Rs 25,000/day; free unlimited txns at Canara ATMs; free DDs up to average balance; concession in retail-loan processing charges; zero-balance family accounts (Spouse + 1 Child); personal loan available",
    "Waived for all SB account types w.e.f. 01-06-2025 per official press release (canarabank.bank.in/documents/d/guest/31-05-2025-9only-in-english-canara-bank-waives-charges-for-non-maintenance-of-minimum-balance-for-all-sb-accounts). Benefits tied to balance may still be withdrawn - verify",
    "Standing instructions, nomination, netbanking"
  ],
  "keyBenefits": [
    "ATM Rs 1,00,000/day; POS Rs 5,00,000/day; NFC Rs 25,000/day; free unlimited txns at Canara ATMs; free DDs up to average balance; concession in retail-loan processing charges; zero-balance family accounts (Spouse + 1 Child); personal loan available",
    "Waived for all SB account types w.e.f. 01-06-2025 per official press release (canarabank.bank.in/documents/d/guest/31-05-2025-9only-in-english-canara-bank-waives-charges-for-non-maintenance-of-minimum-balance-for-all-sb-accounts). Benefits tied to balance may still be withdrawn - verify",
    "Standing instructions, nomination, netbanking"
  ],
  "features": [
    "Minimum Balance: NIL",
    "Interest: 2.50% p.a. (bank-wide savings slab for balances below Rs 100 Cr; slabs rise to 4.00% only at Rs 2,000 Cr+). Source: canarabank.bank.in/domestic/nro/nre-savings-bank-deposits, effective 05.09.2026. Variant-specific rate not stated",
    "Internet / Mobile Banking: Not specified in retrieved excerpt"
  ],
  "bankingFeatures": [
    "Minimum Balance: NIL",
    "Interest: 2.50% p.a. (bank-wide savings slab for balances below Rs 100 Cr; slabs rise to 4.00% only at Rs 2,000 Cr+). Source: canarabank.bank.in/domestic/nro/nre-savings-bank-deposits, effective 05.09.2026. Variant-specific rate not stated",
    "Internet / Mobile Banking: Not specified in retrieved excerpt"
  ],
  "debit_card_relationships": [
    {
      "card_id": "canara-bank-rupay-platinum",
      "relationship": "included",
      "verification_status": "verified"
    }
  ]
}
];

/**
 * HELPER: Retrieve associated debit cards strictly linked to a specific savings account
 * STEP 4 BANK VALIDATION RULES:
 * 1. card.bank_id === account.bank_id
 * 2. Relationship exists in explicit accountDebitCardMappings or account.debit_card_relationships
 * 3. verification_status === "verified"
 * 4. Card is explicitly a debit card
 *
 * If any condition fails, do not render the card.
 */
export function getAssociatedDebitCards(accountOrId) {
  if (!accountOrId) return [];

  let account = null;
  if (typeof accountOrId === 'object' && accountOrId !== null) {
    account = accountOrId;
  } else {
    account = savingsAccounts.find(s => 
      String(s.id) === String(accountOrId) || 
      String(s.product_id) === String(accountOrId)
    );
  }

  if (!account || !account.bank_id) return [];

  const accountBankId = String(account.bank_id).toLowerCase().trim();

  // Combine explicit mappings from module and local account object
  const moduleMappings = getAccountDebitCardMappings(account);
  const localMappings = Array.isArray(account.debit_card_relationships) ? account.debit_card_relationships : [];

  const combinedMappings = [...moduleMappings];
  localMappings.forEach(lm => {
    if (!combinedMappings.some(cm => cm.card_id === lm.card_id)) {
      combinedMappings.push(lm);
    }
  });

  if (combinedMappings.length === 0) {
    return [];
  }

  const verifiedCards = [];
  const seenCardIds = new Set();

  for (const rel of combinedMappings) {
    if (!rel || rel.verification_status !== 'verified' || !rel.card_id) {
      continue;
    }

    if (seenCardIds.has(rel.card_id)) continue;

    const card = masterDebitCardsMap.get(rel.card_id);
    if (!card) continue;

    // Strict Bank Validation & Card Type Check
    const cardBankId = String(card.bank_id || "").toLowerCase().trim();
    if (cardBankId === accountBankId) {
      seenCardIds.add(rel.card_id);
      verifiedCards.push({
        ...card,
        relationship: rel.relationship || 'provided',
        verification_status: rel.verification_status
      });
    }
  }

  return verifiedCards;
}

/**
 * HELPER: Retrieve primary associated debit card for a savings account
 * Returns null if no verified card exists for this specific account
 */
export function getAssociatedDebitCard(accountOrId) {
  const cards = getAssociatedDebitCards(accountOrId);
  return cards.length > 0 ? cards[0] : null;
}

/**
 * HELPER: Retrieve full relationship status (verified, pending, or none)
 */
export function getDebitCardRelationshipStatus(accountOrId) {
  if (!accountOrId) {
    return { status: 'none', cards: [], message: 'Debit card information not available for this account.' };
  }

  let account = null;
  if (typeof accountOrId === 'object' && accountOrId !== null) {
    account = accountOrId;
  } else {
    account = savingsAccounts.find(s => 
      String(s.id) === String(accountOrId) || 
      String(s.product_id) === String(accountOrId)
    );
  }

  if (!account || !account.bank_id) {
    return { status: 'none', cards: [], message: 'Debit card information not available for this account.' };
  }

  const verifiedCards = getAssociatedDebitCards(account);
  if (verifiedCards.length > 0) {
    return { status: 'verified', cards: verifiedCards, message: null };
  }

  const moduleMappings = getAccountDebitCardMappings(account);
  const localMappings = Array.isArray(account.debit_card_relationships) ? account.debit_card_relationships : [];
  const allMappings = [...moduleMappings, ...localMappings];

  const hasPending = allMappings.some(m => m.verification_status === 'pending');
  if (hasPending) {
    return { status: 'pending', cards: [], message: 'Debit card relationship pending verification.' };
  }

  return { status: 'none', cards: [], message: 'Debit card information not available for this account.' };
}
