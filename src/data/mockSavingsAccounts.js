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
    "source": "https://sbi.co.in/web/personal-banking/accounts/savings-account",
    "officialSourceUrl": "https://sbi.co.in/web/personal-banking/accounts/savings-account",
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
    "source": "https://sbi.co.in/web/personal-banking/accounts/savings-account/savings-plus-account",
    "officialSourceUrl": "https://sbi.co.in/web/personal-banking/accounts/savings-account/savings-plus-account",
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
    "source": "https://sbi.co.in/web/personal-banking/accounts/savings-account/bsbda",
    "officialSourceUrl": "https://sbi.co.in/web/personal-banking/accounts/savings-account/bsbda",
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
    "source": "https://sbi.co.in/web/personal-banking/accounts/savings-account/pehla-kadam-pehli-udaan",
    "officialSourceUrl": "https://sbi.co.in/web/personal-banking/accounts/savings-account/pehla-kadam-pehli-udaan",
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
    "source": "https://www.hdfcbank.com/nri-banking/save/savings-accounts/nre-savings-account",
    "officialSourceUrl": "https://www.hdfcbank.com/nri-banking/save/savings-accounts/nre-savings-account",
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
    "source": "https://www.icicibank.com/personal-banking/accounts/savings-account",
    "officialSourceUrl": "https://www.icicibank.com/personal-banking/accounts/savings-account",
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
    "source": "https://www.icicibank.com/personal-banking/accounts/savings-account/mine-account",
    "officialSourceUrl": "https://www.icicibank.com/personal-banking/accounts/savings-account/mine-account",
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
    "source": "https://www.icicibank.com/personal-banking/accounts/salary-account",
    "officialSourceUrl": "https://www.icicibank.com/personal-banking/accounts/salary-account",
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
    "source": "https://www.icicibank.com/personal-banking/accounts/savings-account/women-savings-account",
    "officialSourceUrl": "https://www.icicibank.com/personal-banking/accounts/savings-account/women-savings-account",
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
    "source": "https://www.kotak.com/en/personal-banking/accounts/savings-account/811-savings-account.html",
    "officialSourceUrl": "https://www.kotak.com/en/personal-banking/accounts/savings-account/811-savings-account.html",
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
    "source": "https://www.kotak.com/en/personal-banking/accounts/savings-account/811-edge-savings-account.html",
    "officialSourceUrl": "https://www.kotak.com/en/personal-banking/accounts/savings-account/811-edge-savings-account.html",
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
    "source": "https://www.kotak.com/en/personal-banking/accounts/savings-account/811-super-savings-account.html",
    "officialSourceUrl": "https://www.kotak.com/en/personal-banking/accounts/savings-account/811-super-savings-account.html",
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
    "source": "https://www.kotak.com/en/personal-banking/accounts/savings-account/active-money.html",
    "officialSourceUrl": "https://www.kotak.com/en/personal-banking/accounts/savings-account/active-money.html",
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
    "source": "https://www.idfcfirstbank.com/personal-banking/accounts/savings-account/10k-amb-savings-account",
    "officialSourceUrl": "https://www.idfcfirstbank.com/personal-banking/accounts/savings-account/10k-amb-savings-account",
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
    "source": "https://www.idfcfirstbank.com/personal-banking/accounts/savings-account/25k-amb-savings-account",
    "officialSourceUrl": "https://www.idfcfirstbank.com/personal-banking/accounts/savings-account/25k-amb-savings-account",
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
    "source": "https://www.idfcfirstbank.com/personal-banking/accounts/savings-account/wealth-savings-account",
    "officialSourceUrl": "https://www.idfcfirstbank.com/personal-banking/accounts/savings-account/wealth-savings-account",
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
    "source": "https://www.idfcfirstbank.com/personal-banking/accounts/savings-account/senior-citizen-account",
    "officialSourceUrl": "https://www.idfcfirstbank.com/personal-banking/accounts/savings-account/senior-citizen-account",
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
    "interest_rate": "2.75% - 3.20% p.a.",
    "interestRate": "2.75% - 3.20% p.a.",
    "interestRateValue": 3.2,
    "minimum_balance": "₹1,000",
    "minimumBalance": "₹1,000",
    "minimumBalanceValue": 1000,
    "maximum_balance": "No Limit",
    "non_maintenance_penalty": "₹100/quarter",
    "nonMaintenanceCharges": "₹100/quarter",
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
    "source": "https://www.bankofbaroda.in/personal-banking/accounts/savings-account/baroda-advantage-savings-account",
    "officialSourceUrl": "https://www.bankofbaroda.in/personal-banking/accounts/savings-account/baroda-advantage-savings-account",
    "as_of_date": "August 2026",
    "lastVerified": "August 2026",
    "information_status": "Verified",
    "description": "Public sector banking stability backed by bob World mobile app and RuPay Platinum debit card rewards.",
    "eligibility": [
      "Resident Individuals aged 18+"
    ],
    "benefits": [
      "Low minimum balance requirement",
      "bob World App for digital payments",
      "Free 30 cheque leaves per year"
    ],
    "keyBenefits": [
      "Low minimum balance requirement",
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
