import { masterDebitCards } from "./debitCardsData.js";
import { normalizeCard, deduplicateCards } from "../utils/compareUtils.js";

export const bankCards = [
  { id: 1,
    image: "/images/cards/card-1.png", logo: "HD", name: "HDFC Bank", features: ["Cashback on Spends", "Airport Lounge Access", "Premium EMI Perks"], lowCharges: false, interest: 3.0 },
  { id: 2,
    image: "/images/cards/card-2.png", logo: "IC", name: "ICICI Bank", features: ["BOGO Movie Offers", "Contactless Paywave", "Sapphiro Privileges"], lowCharges: false, interest: 3.5 },
  { id: 3,
    image: "/images/cards/card-3.png", logo: "AX", name: "Axis Bank", features: ["Burgundy High Limits", "Priority Banking", "RuPay Platinum Deals"], lowCharges: false, interest: 3.0 },
  { id: 4,
    image: "/images/cards/card-4.png", logo: "ID", name: "IDFC First", features: ["7% Savings Interest", "Wealth & Private Tiers", "Visa Signature Perks"], lowCharges: true, interest: 7.0 },
  { id: 5,
    image: "/images/cards/card-5.png", logo: "SB", name: "SBI", features: ["Widespread ATM Network", "Global Classic Card", "Platinum Low Fees"], lowCharges: true, interest: 2.7 },
  { id: 6,
    image: "/images/cards/card-6.png", logo: "KO", name: "Kotak Mahindra", features: ["Zero Balance 811", "DreamDifferent Edition", "Platinum Digital Card"], lowCharges: true, interest: 4.0 },
  { id: 7,
    image: "/images/cards/card-7.png", logo: "IN", name: "IndusInd Bank", features: ["Signature Rewards", "BookMyShow BOGO Deals", "Forex Savings"], lowCharges: false, interest: 4.5 },
  { id: 8,
    image: "/images/cards/card-8.png", logo: "FI", name: "Fi Money", features: ["Zero Balance & Fee", "Smart Saving Rules", "Zero Forex Markup"], lowCharges: true, interest: 3.0 },
];

export const debitCards = [
  {
    "id": 1,
    "image": "/images/cards/card-1.png",
    "bank": "State Bank of India",
    "cardName": "SBI Global International Debit Card",
    "network": "Visa",
    "annualFee": "₹125 + GST",
    "numAnnualFee": 125,
    "joiningFee": "₹0",
    "international": true,
    "contactless": true,
    "loungeAccess": "No",
    "forexMarkup": "3.5%",
    "cashback": "No",
    "bestFor": "International Transactions",
    "rating": 4.5,
    "isPopular": true,
    "applyUrl": "https://www.onlinesbi.sbi"
  },
  {
    "id": 2,
    "image": "/images/cards/card-2.png",
    "bank": "State Bank of India",
    "cardName": "SBI Platinum Debit Card",
    "network": "Visa",
    "annualFee": "₹250 + GST",
    "numAnnualFee": 250,
    "joiningFee": "₹0",
    "international": true,
    "contactless": true,
    "loungeAccess": "2 Domestic/Quarter",
    "forexMarkup": "3.5%",
    "cashback": "Merchant Offers",
    "bestFor": "Travel & Shopping",
    "rating": 4.7,
    "isPopular": true,
    "applyUrl": "https://www.onlinesbi.sbi"
  },
  {
    "id": 3,
    "image": "/images/cards/card-3.png",
    "bank": "HDFC Bank",
    "cardName": "EasyShop Platinum Debit Card",
    "network": "Visa",
    "annualFee": "₹750 + GST",
    "numAnnualFee": 750,
    "joiningFee": "₹0",
    "international": true,
    "contactless": true,
    "loungeAccess": "2 Domestic/Quarter",
    "forexMarkup": "3.5%",
    "cashback": "Offers Available",
    "bestFor": "Shopping",
    "rating": 4.8,
    "isPopular": true,
    "applyUrl": "https://www.hdfcbank.com"
  },
  {
    "id": 4,
    "image": "/images/cards/card-4.png",
    "bank": "HDFC Bank",
    "cardName": "Millennia Debit Card",
    "network": "Visa",
    "annualFee": "₹500 + GST",
    "numAnnualFee": 500,
    "joiningFee": "₹0",
    "international": true,
    "contactless": true,
    "loungeAccess": "Yes",
    "forexMarkup": "3.5%",
    "cashback": "Up to 5%",
    "bestFor": "Online Shopping",
    "rating": 4.9,
    "isPopular": true,
    "applyUrl": "https://www.hdfcbank.com"
  },
  {
    "id": 5,
    "image": "/images/cards/card-5.png",
    "bank": "ICICI Bank",
    "cardName": "Coral PayWave Debit Card",
    "network": "Visa",
    "annualFee": "₹199 + GST",
    "numAnnualFee": 199,
    "joiningFee": "₹0",
    "international": true,
    "contactless": true,
    "loungeAccess": "2 Domestic/Quarter",
    "forexMarkup": "3.5%",
    "cashback": "Dining Offers",
    "bestFor": "Travel & Lifestyle",
    "rating": 4.6,
    "isPopular": false,
    "applyUrl": "https://www.icicibank.com"
  },
  {
    "id": 6,
    "image": "/images/cards/card-6.png",
    "bank": "ICICI Bank",
    "cardName": "Titanium Debit Card",
    "network": "Visa",
    "annualFee": "₹249 + GST",
    "numAnnualFee": 249,
    "joiningFee": "₹0",
    "international": true,
    "contactless": true,
    "loungeAccess": "No",
    "forexMarkup": "3.5%",
    "cashback": "Merchant Offers",
    "bestFor": "Daily Spending",
    "rating": 4.5,
    "isPopular": false,
    "applyUrl": "https://www.icicibank.com"
  },
  {
    "id": 7,
    "image": "/images/cards/card-7.png",
    "bank": "Axis Bank",
    "cardName": "Priority Debit Card",
    "network": "Visa",
    "annualFee": "₹750 + GST",
    "numAnnualFee": 750,
    "joiningFee": "₹0",
    "international": true,
    "contactless": true,
    "loungeAccess": "4 Domestic/Quarter",
    "forexMarkup": "3.5%",
    "cashback": "Shopping Offers",
    "bestFor": "Travel",
    "rating": 4.8,
    "isPopular": true,
    "applyUrl": "https://www.axisbank.com"
  },
  {
    "id": 8,
    "image": "/images/cards/card-8.png",
    "bank": "Kotak Mahindra Bank",
    "cardName": "Platinum Debit Card",
    "network": "Visa",
    "annualFee": "₹299 + GST",
    "numAnnualFee": 299,
    "joiningFee": "₹0",
    "international": true,
    "contactless": true,
    "loungeAccess": "Yes",
    "forexMarkup": "3.5%",
    "cashback": "Merchant Discounts",
    "bestFor": "Shopping",
    "rating": 4.6,
    "isPopular": false,
    "applyUrl": "https://www.kotak.com"
  },
  {
    "id": 9,
    "image": "/images/cards/card-9.png",
    "bank": "Axis Bank",
    "cardName": "Burgundy Debit Card",
    "network": "Visa",
    "category": "Premium",
    "annualFee": 0,
    "numAnnualFee": 0,
    "joiningFee": "Waived",
    "minBalance": 0,
    "interestRate": 3,
    "rating": 4.8,
    "cashback": "3% Cashback on Spends",
    "cashbackPct": 3,
    "atmCharges": "Free Unlimited globally",
    "benefits": "Extremely high daily limits, premium lifestyle benefits, free ATM withdrawal privileges",
    "tags": [
      "Zero Balance",
      "Premium Features",
      "Cashback"
    ],
    "isPopular": true,
    "applyUrl": "https://www.axisbank.com",
    "pros": [
      "Very high withdrawal and spending limits",
      "Ultra premium design and priority banking",
      "Zero forex markup on transactions"
    ],
    "cons": [
      "Only available to premium Burgundy relationship accounts"
    ],
    "features": [
      "ATM Limit: ₹3,00,000 daily",
      "POS Limit: ₹8,00,000 daily",
      "Lounge Access: Yes, complimentary",
      "Fuel Waiver: Surcharge waiver"
    ],
    "verificationStatus": "Recently Updated",
    "maxLimit": 800000,
    "eligibility": "Axis Burgundy relationship account holders",
    "hiddenCharges": "SOC charges, international markup (if account status changes), downgrade fees",
    "verifyNote": "",
    "officialSource": "https://www.axisbank.com/burgundy",
    "bestFor": "Ultra-premium users, high limits, travel",
    "loungeAccess": "Yes, complimentary",
    "fuelWaiver": "Verify manually",
    "internationalUsage": "Yes",
    "contactless": "Yes",
    "studentFriendly": false,
    "womenSpecial": false,
    "seniorCitizen": true,
    "zeroFeeOrLowFee": true,
    "healthcareFriendly": false,
    "travelZeroForex": true,
    "segmentTags": [
      "Senior",
      "Zero Fee",
      "Travel"
    ],
    "lifeStage": [
      "Senior Citizen",
      "Zero / Low Fee",
      "Travel / Zero Forex"
    ],
    "healthcareBenefits": [],
    "dataConfidence": "Verified"
  },
  {
    "id": 10,
    "image": "/images/cards/card-10.png",
    "bank": "Axis Bank",
    "cardName": "Priority Debit Card",
    "network": "Mastercard",
    "category": "Premium",
    "annualFee": 0,
    "joiningFee": "Waived",
    "minBalance": 0,
    "interestRate": 3,
    "rating": 4.5,
    "cashback": "Premium reward points and lifestyle privileges",
    "cashbackPct": 1.5,
    "atmCharges": "Free priority withdrawals",
    "benefits": "Lounge visits, premium dining offers, movie discount benefits",
    "tags": [
      "Zero Balance",
      "Premium Features",
      "Cashback"
    ],
    "isPopular": false,
    "applyUrl": "https://www.axisbank.com",
    "pros": [
      "Strong premium segments",
      "Excellent priority service features",
      "Zero annual fee under priority accounts"
    ],
    "cons": [
      "High account relationship requirement"
    ],
    "features": [
      "ATM Limit: High Tier",
      "POS Limit: High Tier",
      "Lounge Access: Yes, complimentary",
      "Dining: Priority benefits"
    ],
    "verificationStatus": "Verified",
    "maxLimit": 500000,
    "eligibility": "Axis Priority account relationship customers",
    "hiddenCharges": "SOC charges, replacement fees, international markup",
    "verifyNote": "",
    "officialSource": "https://www.axisbank.com",
    "bestFor": "Priority banking, travel, movies, dining",
    "loungeAccess": "Yes",
    "fuelWaiver": "Verify manually",
    "internationalUsage": "Yes",
    "contactless": "Yes",
    "studentFriendly": false,
    "womenSpecial": false,
    "seniorCitizen": true,
    "zeroFeeOrLowFee": true,
    "healthcareFriendly": false,
    "travelZeroForex": true,
    "segmentTags": [
      "Senior",
      "Zero Fee",
      "Travel"
    ],
    "lifeStage": [
      "Senior Citizen",
      "Zero / Low Fee",
      "Travel / Zero Forex"
    ],
    "healthcareBenefits": [],
    "dataConfidence": "Verified"
  },
  {
    "id": 11,
    "image": "/images/cards/card-11.png",
    "bank": "Kotak Mahindra",
    "cardName": "811 #DreamDifferent Debit Card",
    "network": "Visa",
    "category": "Digital",
    "annualFee": 399,
    "joiningFee": "Nil",
    "minBalance": 0,
    "interestRate": 4,
    "rating": 4.3,
    "cashback": "Standard digital transaction rewards",
    "cashbackPct": 1,
    "atmCharges": "₹21 after 5 free",
    "benefits": "Tap & Pay, multi-purpose ATM card, instant digital app onboarding",
    "tags": [
      "Zero Balance",
      "Student Friendly",
      "Cashback"
    ],
    "isPopular": true,
    "applyUrl": "https://www.kotak.com",
    "pros": [
      "Very student-friendly",
      "Fully digital-first onboarding",
      "Permanent zero balance account linkage"
    ],
    "cons": [
      "Annual fee of ₹399 applies despite zero-balance account structure"
    ],
    "features": [
      "ATM Limit: Customisable",
      "POS Limit: Customisable",
      "Lounge Access: No",
      "Contactless Support: Yes"
    ],
    "verificationStatus": "Verified",
    "maxLimit": 150000,
    "eligibility": "Kotak 811 account users",
    "hiddenCharges": "Card replacement fee, ATM charges beyond free monthly limit",
    "verifyNote": "",
    "officialSource": "https://www.kotak.com/en/personal-banking/cards/debit-cards/811-dream-different-debit-card.html",
    "bestFor": "Students, digital banking, zero balance, beginners",
    "loungeAccess": "No",
    "fuelWaiver": "Verify manually",
    "internationalUsage": "Yes depending on card/network activation",
    "contactless": "Yes",
    "studentFriendly": true,
    "womenSpecial": false,
    "seniorCitizen": false,
    "zeroFeeOrLowFee": false,
    "healthcareFriendly": false,
    "travelZeroForex": false,
    "segmentTags": [
      "Student"
    ],
    "lifeStage": [
      "Student Friendly"
    ],
    "healthcareBenefits": [],
    "dataConfidence": "Verified"
  },
  {
    "id": 12,
    "image": "/images/cards/card-12.png",
    "bank": "Kotak Mahindra",
    "cardName": "811 Platinum Chip Debit Card",
    "network": "Visa",
    "category": "Digital",
    "annualFee": 199,
    "joiningFee": "Nil",
    "minBalance": 0,
    "interestRate": 4,
    "rating": 4.2,
    "cashback": "Basic online shopping points",
    "cashbackPct": 0.5,
    "atmCharges": "₹21 after 5 free",
    "benefits": "Digital account transaction card, scan and pay, online bank transfers",
    "tags": [
      "Zero Balance",
      "Lowest Charges",
      "Student Friendly"
    ],
    "isPopular": false,
    "applyUrl": "https://www.kotak.com",
    "pros": [
      "Extremely low annual fee (₹199)",
      "Fully digital beginner-friendly layout",
      "No account balance pressure"
    ],
    "cons": [
      "Only basic benefits and zero lounge privileges"
    ],
    "features": [
      "ATM Limit: Standard",
      "POS Limit: Standard",
      "Digital Transfer: Enabled",
      "Lounge Access: No"
    ],
    "verificationStatus": "Verified",
    "maxLimit": 100000,
    "eligibility": "Kotak 811 account holders (Edge / Classic)",
    "hiddenCharges": "Replacement fee, non-Kotak ATM transaction fees",
    "verifyNote": "",
    "officialSource": "https://www.kotak.com",
    "bestFor": "Students, zero balance, low fee",
    "loungeAccess": "No",
    "fuelWaiver": "Verify manually",
    "internationalUsage": "Yes depending on activation",
    "contactless": "Yes",
    "studentFriendly": true,
    "womenSpecial": false,
    "seniorCitizen": false,
    "zeroFeeOrLowFee": true,
    "healthcareFriendly": false,
    "travelZeroForex": false,
    "segmentTags": [
      "Student",
      "Zero Fee"
    ],
    "lifeStage": [
      "Student Friendly",
      "Zero / Low Fee"
    ],
    "healthcareBenefits": [],
    "dataConfidence": "Verified"
  },
  {
    "id": 13,
    "image": "/images/cards/card-13.png",
    "bank": "IDFC First",
    "cardName": "FIRST Wealth Debit Card",
    "network": "Visa",
    "category": "Premium",
    "annualFee": 0,
    "joiningFee": "Waived",
    "minBalance": 250000,
    "interestRate": 7,
    "rating": 4.7,
    "cashback": "Premium milestone points and forex benefits",
    "cashbackPct": 2,
    "atmCharges": "Free Unlimited",
    "benefits": "Extremely high daily cash withdrawal and purchase limits, free lounge visits",
    "tags": [
      "Highest Interest",
      "Premium Features",
      "Cashback"
    ],
    "isPopular": true,
    "applyUrl": "https://www.idfcfirstbank.com",
    "pros": [
      "Excellent cash withdrawal & shopping limits",
      "Highest-tier premium benefits in banking segment",
      "Zero annual fee for wealth customers"
    ],
    "cons": [
      "High Wealth Relationship status required"
    ],
    "features": [
      "ATM Limit: Up to ₹7,00,000 daily",
      "POS Limit: Up to ₹12,00,000 daily",
      "Lounge Access: Yes, complimentary",
      "Forex Perks: Low markup"
    ],
    "verificationStatus": "Recently Updated",
    "maxLimit": 1200000,
    "eligibility": "IDFC FIRST Wealth tier customers",
    "hiddenCharges": "Down-migration program fees, replacement charges",
    "verifyNote": "",
    "officialSource": "https://www.idfcfirstbank.com/personal-banking/cards/debit-card/wealth-debit-card",
    "bestFor": "Wealth customers, high limits, premium travel",
    "loungeAccess": "Yes, verify terms",
    "fuelWaiver": "Verify manually",
    "internationalUsage": "Yes",
    "contactless": "Yes",
    "studentFriendly": false,
    "womenSpecial": false,
    "seniorCitizen": true,
    "zeroFeeOrLowFee": true,
    "healthcareFriendly": false,
    "travelZeroForex": true,
    "segmentTags": [
      "Senior",
      "Zero Fee",
      "Travel"
    ],
    "lifeStage": [
      "Senior Citizen",
      "Zero / Low Fee",
      "Travel / Zero Forex"
    ],
    "healthcareBenefits": [],
    "dataConfidence": "Verified"
  },
  {
    "id": 14,
    "image": "/images/cards/card-14.png",
    "bank": "IDFC First",
    "cardName": "FIRST Private Debit Card",
    "network": "Visa",
    "category": "Premium",
    "annualFee": 0,
    "joiningFee": "Waived",
    "minBalance": 1000000,
    "interestRate": 7,
    "rating": 4.8,
    "cashback": "Custom bespoke rewards program",
    "cashbackPct": 2.5,
    "atmCharges": "Free Unlimited globally",
    "benefits": "Unprecedented high daily limits, private concierge services, high savings interest",
    "tags": [
      "Highest Interest",
      "Premium Features",
      "Cashback"
    ],
    "isPopular": true,
    "applyUrl": "https://www.idfcfirstbank.com",
    "pros": [
      "Highest transactional limits in this entire dataset",
      "Elite private banking privileges",
      "Bespoke luxury merchant offers"
    ],
    "cons": [
      "Strictly restricted to ultra-high-net-worth Private account relationships"
    ],
    "features": [
      "ATM Limit: Up to ₹10,00,000 daily",
      "POS Limit: Up to ₹15,00,000 daily",
      "Lounge Access: Yes, priority access",
      "Concierge Perks: Yes"
    ],
    "verificationStatus": "Verified",
    "maxLimit": 1500000,
    "eligibility": "IDFC FIRST Private banking customers",
    "hiddenCharges": "Bespoke service charge schedules, international fees",
    "verifyNote": "",
    "officialSource": "https://www.idfcfirstbank.com/personal-banking/cards/debit-card/private-debit-card",
    "bestFor": "Private banking, ultra-premium, high-value spends",
    "loungeAccess": "Yes, verify",
    "fuelWaiver": "Verify",
    "internationalUsage": "Yes",
    "contactless": "Yes",
    "studentFriendly": false,
    "womenSpecial": false,
    "seniorCitizen": true,
    "zeroFeeOrLowFee": true,
    "healthcareFriendly": false,
    "travelZeroForex": true,
    "segmentTags": [
      "Senior",
      "Zero Fee",
      "Travel"
    ],
    "lifeStage": [
      "Senior Citizen",
      "Zero / Low Fee",
      "Travel / Zero Forex"
    ],
    "healthcareBenefits": [],
    "dataConfidence": "Verified"
  },
  {
    "id": 15,
    "image": "/images/cards/card-15.png",
    "bank": "IDFC First",
    "cardName": "Visa Signature Debit Card",
    "network": "Visa",
    "category": "Savings",
    "annualFee": 0,
    "joiningFee": "Waived",
    "minBalance": 10000,
    "interestRate": 7,
    "rating": 4.2,
    "cashback": "Signature reward points on online merchant spends",
    "cashbackPct": 1,
    "atmCharges": "Free x5 ATM transactions",
    "benefits": "Visa Signature network tier privileges, configurable spending limits via bank app",
    "tags": [
      "Highest Interest",
      "Cashback"
    ],
    "isPopular": false,
    "applyUrl": "https://www.idfcfirstbank.com",
    "pros": [
      "Flexible limit configuration",
      "Very high 7% savings interest rate",
      "Zero annual fee"
    ],
    "cons": [
      "Minor account usage is highly capped"
    ],
    "features": [
      "ATM Limit: Configurable (Minor ₹10K)",
      "POS Limit: Configurable (Minor ₹10K)",
      "Lounge Access: Yes, subject to criteria",
      "Contactless Support: Yes"
    ],
    "verificationStatus": "Verified",
    "maxLimit": 250000,
    "eligibility": "Eligible IDFC FIRST Bank savings account holders",
    "hiddenCharges": "SOC charges, replacement fee, standard international markup",
    "verifyNote": "",
    "officialSource": "https://www.idfcfirstbank.com",
    "bestFor": "IDFC customers, rewards, configurable limits",
    "loungeAccess": "Verify manually",
    "fuelWaiver": "Verify manually",
    "internationalUsage": "Yes",
    "contactless": "Yes",
    "studentFriendly": false,
    "womenSpecial": false,
    "seniorCitizen": true,
    "zeroFeeOrLowFee": true,
    "healthcareFriendly": false,
    "travelZeroForex": false,
    "segmentTags": [
      "Senior",
      "Zero Fee"
    ],
    "lifeStage": [
      "Senior Citizen",
      "Zero / Low Fee"
    ],
    "healthcareBenefits": [],
    "dataConfidence": "Verified"
  },
  {
    "id": 16,
    "image": "/images/cards/card-16.png",
    "bank": "IndusInd Bank",
    "cardName": "Visa Signature Debit Card",
    "network": "Visa",
    "category": "Premium",
    "annualFee": 1499,
    "joiningFee": "₹5,000 + taxes",
    "minBalance": 25000,
    "interestRate": 4.5,
    "rating": 4.6,
    "cashback": "Rewards points redeemable for fuel/airmiles",
    "cashbackPct": 1.5,
    "atmCharges": "Free Unlimited withdrawals",
    "benefits": "Buy-One-Get-One movie tickets, complimentary airport lounge visits, fuel surcharge waivers",
    "tags": [
      "Highest Interest",
      "Premium Features",
      "Cashback"
    ],
    "isPopular": true,
    "applyUrl": "https://www.indusind.com",
    "pros": [
      "Excellent lifestyle rewards (BOGO Movies)",
      "High ATM and shopping limits",
      "Fuel surcharge waiver enabled"
    ],
    "cons": [
      "Very high upfront joining fee (₹5,000)"
    ],
    "features": [
      "ATM Limit: ₹1,50,000 daily",
      "POS Limit: ₹3,00,000 daily",
      "Lounge Access: Yes",
      "Fuel Waiver: Up to ₹250/month"
    ],
    "verificationStatus": "Verified",
    "maxLimit": 300000,
    "eligibility": "IndusInd Bank premium accounts",
    "hiddenCharges": "GST, high card replacement cost, standard forex conversion fee",
    "verifyNote": "",
    "officialSource": "https://www.indusind.com/in/en/personal/cards/debit-card/signature-debit-card.html",
    "bestFor": "Movies, lounge, premium users",
    "loungeAccess": "Yes",
    "fuelWaiver": "Up to ₹250/month as listed",
    "internationalUsage": "Yes",
    "contactless": "Yes",
    "studentFriendly": false,
    "womenSpecial": false,
    "seniorCitizen": true,
    "zeroFeeOrLowFee": false,
    "healthcareFriendly": false,
    "travelZeroForex": false,
    "segmentTags": [
      "Senior"
    ],
    "lifeStage": [
      "Senior Citizen"
    ],
    "healthcareBenefits": [],
    "dataConfidence": "Verified"
  },
  {
    "id": 17,
    "image": "/images/cards/card-17.png",
    "bank": "IndusInd Bank",
    "cardName": "Signature Exclusive Debit Card",
    "network": "Visa",
    "category": "Premium",
    "annualFee": 0,
    "joiningFee": "Waived",
    "minBalance": 100000,
    "interestRate": 4.5,
    "rating": 4.5,
    "cashback": "High-value travel rewards and forex savings",
    "cashbackPct": 2,
    "atmCharges": "Free Unlimited globally",
    "benefits": "₹4,000 annual movie tickets on BookMyShow, complimentary lounges, ultra low forex markup",
    "tags": [
      "Highest Interest",
      "Premium Features",
      "Cashback"
    ],
    "isPopular": false,
    "applyUrl": "https://www.indusind.com",
    "pros": [
      "Incredible lifestyle rewards package",
      "Zero or low 1% forex markup on travel spends",
      "Free issuance under elite status"
    ],
    "cons": [
      "Requires extremely high account relationship balance"
    ],
    "features": [
      "ATM Limit: High Elite",
      "POS Limit: High Elite",
      "Lounge Access: Yes",
      "Forex: 1% cross-currency markup"
    ],
    "verificationStatus": "Verified",
    "maxLimit": 500000,
    "eligibility": "IndusInd Exclusive/Select relationship accounts",
    "hiddenCharges": "Non-maintenance penalty, program charges",
    "verifyNote": "",
    "officialSource": "https://www.indusind.com",
    "bestFor": "Movies, lounge, low forex markup",
    "loungeAccess": "Yes",
    "fuelWaiver": "Verify",
    "internationalUsage": "Yes",
    "contactless": "Yes",
    "studentFriendly": false,
    "womenSpecial": false,
    "seniorCitizen": true,
    "zeroFeeOrLowFee": true,
    "healthcareFriendly": false,
    "travelZeroForex": true,
    "segmentTags": [
      "Senior",
      "Zero Fee",
      "Travel"
    ],
    "lifeStage": [
      "Senior Citizen",
      "Zero / Low Fee",
      "Travel / Zero Forex"
    ],
    "healthcareBenefits": [],
    "dataConfidence": "Verified"
  },
  {
    "id": 18,
    "image": "/images/cards/card-18.png",
    "bank": "YES Bank",
    "cardName": "YES Prosperity Platinum Debit Card",
    "network": "Visa",
    "category": "Rewards",
    "annualFee": 599,
    "joiningFee": "Varies",
    "minBalance": 10000,
    "interestRate": 3,
    "rating": 4.2,
    "cashback": "Rewards on utility bills and merchant spends",
    "cashbackPct": 0.75,
    "atmCharges": "Free x5 ATM transactions",
    "benefits": "Contactless payments, international ATM access, YES bank merchant offers",
    "tags": [
      "Cashback",
      "Premium Features"
    ],
    "isPopular": false,
    "applyUrl": "https://www.yesbank.in",
    "pros": [
      "Moderate mid-tier annual fee",
      "Secure contactless payments globally",
      "Good merchant discounts"
    ],
    "cons": [
      "High international cash withdrawal fees (₹120)"
    ],
    "features": [
      "ATM Limit: Standard Plus",
      "POS Limit: Standard Plus",
      "Contactless: Yes",
      "Lounge Access: Verify manually"
    ],
    "verificationStatus": "Verified",
    "maxLimit": 200000,
    "eligibility": "YES Bank savings account holders",
    "hiddenCharges": "International withdrawal ₹120, balance enquiry ₹20, physical PIN fees",
    "verifyNote": "",
    "officialSource": "https://www.yesbank.in/personal-banking/cards/debit-card/yes-prosperity-platinum-debit-card",
    "bestFor": "YES Bank customers, everyday premium",
    "loungeAccess": "Verify manually",
    "fuelWaiver": "Verify manually",
    "internationalUsage": "Yes",
    "contactless": "Yes",
    "studentFriendly": false,
    "womenSpecial": true,
    "seniorCitizen": false,
    "zeroFeeOrLowFee": false,
    "healthcareFriendly": false,
    "travelZeroForex": false,
    "segmentTags": [
      "Women"
    ],
    "lifeStage": [
      "Women Special"
    ],
    "healthcareBenefits": [],
    "dataConfidence": "Verified"
  },
  {
    "id": 19,
    "image": "/images/cards/card-19.png",
    "bank": "YES Bank",
    "cardName": "YES Prosperity Sleek Debit Card",
    "network": "Mastercard",
    "category": "Classic",
    "annualFee": 349,
    "joiningFee": "Varies",
    "minBalance": 5000,
    "interestRate": 3,
    "rating": 4,
    "cashback": "Basic reward points program",
    "cashbackPct": 0.5,
    "atmCharges": "Free x5 ATM transactions",
    "benefits": "Contactless payment convenience, worldwide Mastercard network acceptance",
    "tags": [
      "Lowest Charges"
    ],
    "isPopular": false,
    "applyUrl": "https://www.yesbank.in",
    "pros": [
      "Simple card design",
      "Moderate low annual fee",
      "Decent basic POS limits"
    ],
    "cons": [
      "No premium perks or lounge benefits",
      "High international fees"
    ],
    "features": [
      "ATM Limit: Standard",
      "POS Limit: Standard",
      "Contactless: Yes",
      "Lounge Access: No"
    ],
    "verificationStatus": "Verified",
    "maxLimit": 100000,
    "eligibility": "YES Bank account holders",
    "hiddenCharges": "International withdrawal ₹120, balance enquiry ₹20, physical PIN generation fee",
    "verifyNote": "",
    "officialSource": "https://www.yesbank.in",
    "bestFor": "Everyday use, low-mid fee",
    "loungeAccess": "No",
    "fuelWaiver": "Verify manually",
    "internationalUsage": "Yes",
    "contactless": "Yes",
    "studentFriendly": false,
    "womenSpecial": false,
    "seniorCitizen": false,
    "zeroFeeOrLowFee": false,
    "healthcareFriendly": false,
    "travelZeroForex": false,
    "segmentTags": [],
    "lifeStage": [],
    "healthcareBenefits": [],
    "dataConfidence": "Verified"
  },
  {
    "id": 20,
    "image": "/images/cards/card-20.png",
    "bank": "YES Bank",
    "cardName": "YES Bank Visa Platinum Debit Card",
    "network": "Visa",
    "category": "Classic",
    "annualFee": 149,
    "joiningFee": "Varies",
    "minBalance": 5000,
    "interestRate": 3,
    "rating": 4,
    "cashback": "Basic spending reward points",
    "cashbackPct": 0.25,
    "atmCharges": "Free x5 ATM transactions",
    "benefits": "Visa network globally, international cash withdrawals, secure online transactions",
    "tags": [
      "Lowest Charges"
    ],
    "isPopular": false,
    "applyUrl": "https://www.yesbank.in",
    "pros": [
      "Incredibly cheap annual fee (₹149)",
      "Wide Visa acceptance network",
      "Reliable basic card option"
    ],
    "cons": [
      "Zero lifestyle or travel perks",
      "High international transaction fees"
    ],
    "features": [
      "ATM Limit: Standard Basic",
      "POS Limit: Standard Basic",
      "International Usage: Yes",
      "Lounge Access: No"
    ],
    "verificationStatus": "Verified",
    "maxLimit": 75000,
    "eligibility": "YES Bank account holders",
    "hiddenCharges": "International withdrawal ₹120, balance check ₹20",
    "verifyNote": "",
    "officialSource": "https://www.yesbank.in",
    "bestFor": "Low fee YES users",
    "loungeAccess": "Verify manually",
    "fuelWaiver": "Verify manually",
    "internationalUsage": "Yes",
    "contactless": "Yes",
    "studentFriendly": false,
    "womenSpecial": false,
    "seniorCitizen": false,
    "zeroFeeOrLowFee": true,
    "healthcareFriendly": false,
    "travelZeroForex": false,
    "segmentTags": [
      "Zero Fee"
    ],
    "lifeStage": [
      "Zero / Low Fee"
    ],
    "healthcareBenefits": [],
    "dataConfidence": "Verified"
  },
  {
    "id": 21,
    "image": "/images/cards/card-21.png",
    "bank": "Bank of Baroda",
    "cardName": "BOB Visa Platinum Debit Card",
    "network": "Visa",
    "category": "Rewards",
    "annualFee": 300,
    "joiningFee": "₹300 + taxes",
    "minBalance": 2000,
    "interestRate": 2.75,
    "rating": 4.2,
    "cashback": "BOB merchant reward points",
    "cashbackPct": 0.5,
    "atmCharges": "Free first year; standard BOB charge after",
    "benefits": "Visa worldwide acceptance, free annual maintenance for first year",
    "tags": [
      "Lowest Charges",
      "Cashback"
    ],
    "isPopular": false,
    "applyUrl": "https://www.bankofbaroda.in",
    "pros": [
      "First year annual fee completely free",
      "Trusted public sector bank",
      "Contactless paywave support"
    ],
    "cons": [
      "Premium benefits and lounge access are extremely limited"
    ],
    "features": [
      "ATM Limit: Standard Plus",
      "POS Limit: Standard Plus",
      "Contactless: Yes",
      "Lounge Access: Verify manually"
    ],
    "verificationStatus": "Needs Verification",
    "maxLimit": 150000,
    "eligibility": "BOB account holders",
    "hiddenCharges": "Reissuance ₹200 + taxes",
    "verifyNote": "",
    "officialSource": "https://www.bankofbaroda.in",
    "bestFor": "Public-sector bank users, low fee, Visa",
    "loungeAccess": "Verify manually",
    "fuelWaiver": "Verify manually",
    "internationalUsage": "Yes",
    "contactless": "Yes",
    "studentFriendly": false,
    "womenSpecial": false,
    "seniorCitizen": false,
    "zeroFeeOrLowFee": false,
    "healthcareFriendly": false,
    "travelZeroForex": false,
    "segmentTags": [],
    "lifeStage": [],
    "healthcareBenefits": [],
    "dataConfidence": "Needs Verification"
  },
  {
    "id": 22,
    "image": "/images/cards/card-22.png",
    "bank": "Bank of Baroda",
    "cardName": "BOB RuPay Platinum DI Debit Card",
    "network": "RuPay",
    "category": "Rewards",
    "annualFee": 300,
    "joiningFee": "₹300 + taxes",
    "minBalance": 2000,
    "interestRate": 2.75,
    "rating": 4.2,
    "cashback": "RuPay Platinum specific discounts",
    "cashbackPct": 0.5,
    "atmCharges": "Free first year",
    "benefits": "RuPay domestic benefits, complimentary lounges, zero first year fee",
    "tags": [
      "Lowest Charges",
      "Cashback"
    ],
    "isPopular": false,
    "applyUrl": "https://www.bankofbaroda.in",
    "pros": [
      "First year maintenance fee waived",
      "RuPay Platinum merchant cashback privileges",
      "PSU bank convenience"
    ],
    "cons": [
      "Lounge access rules vary by merchant updates"
    ],
    "features": [
      "ATM Limit: Configurable",
      "POS Limit: Configurable",
      "Contactless: Yes",
      "Lounge Access: RuPay Platinum terms"
    ],
    "verificationStatus": "Needs Verification",
    "maxLimit": 150000,
    "eligibility": "BOB account holders",
    "hiddenCharges": "Reissuance ₹200 + taxes",
    "verifyNote": "",
    "officialSource": "https://www.bankofbaroda.in",
    "bestFor": "RuPay users, PSU banking, low fee",
    "loungeAccess": "RuPay Platinum terms, verify",
    "fuelWaiver": "Verify",
    "internationalUsage": "Depends on variant",
    "contactless": "Yes",
    "studentFriendly": false,
    "womenSpecial": true,
    "seniorCitizen": false,
    "zeroFeeOrLowFee": false,
    "healthcareFriendly": false,
    "travelZeroForex": false,
    "segmentTags": [
      "Women"
    ],
    "lifeStage": [
      "Women Special"
    ],
    "healthcareBenefits": [],
    "dataConfidence": "Needs Verification"
  },
  {
    "id": 23,
    "image": "/images/cards/card-23.png",
    "bank": "Canara Bank",
    "cardName": "Canara Visa Classic Debit Card",
    "network": "Visa",
    "category": "Classic",
    "annualFee": 200,
    "joiningFee": "Nil",
    "minBalance": 1000,
    "interestRate": 2.9,
    "rating": 3.9,
    "cashback": "Basic Canara reward points",
    "cashbackPct": 0.25,
    "atmCharges": "Free within limits",
    "benefits": "Secure ATM and POS withdrawals, low annual maintenance charge",
    "tags": [
      "Lowest Charges",
      "Student Friendly"
    ],
    "isPopular": false,
    "applyUrl": "https://canarabank.com",
    "pros": [
      "Very cheap maintenance fee (₹200)",
      "Good basic limits for students",
      "No joining fee"
    ],
    "cons": [
      "No premium travel or lounge perks",
      "Basic support"
    ],
    "features": [
      "ATM Limit: ₹75,000 daily",
      "POS Limit: ₹2,00,000 daily",
      "Lounge Access: No",
      "Contactless Support: No"
    ],
    "verificationStatus": "Verified",
    "maxLimit": 200000,
    "eligibility": "Canara Bank account holders",
    "hiddenCharges": "ATM charges beyond free limit, replacement fee",
    "verifyNote": "",
    "officialSource": "https://canarabank.com",
    "bestFor": "Basic banking, public-sector bank, low fee",
    "loungeAccess": "No",
    "fuelWaiver": "Verify",
    "internationalUsage": "Depends on activation/variant",
    "contactless": "Verify",
    "studentFriendly": true,
    "womenSpecial": false,
    "seniorCitizen": false,
    "zeroFeeOrLowFee": true,
    "healthcareFriendly": false,
    "travelZeroForex": false,
    "segmentTags": [
      "Student",
      "Zero Fee"
    ],
    "lifeStage": [
      "Student Friendly",
      "Zero / Low Fee"
    ],
    "healthcareBenefits": [],
    "dataConfidence": "Verified"
  },
  {
    "id": 24,
    "image": "/images/cards/card-24.png",
    "bank": "Canara Bank",
    "cardName": "Canara Visa Platinum Debit Card",
    "network": "Visa",
    "category": "Classic",
    "annualFee": 500,
    "joiningFee": "Nil",
    "minBalance": 5000,
    "interestRate": 2.9,
    "rating": 4.1,
    "cashback": "Premium merchant rewards",
    "cashbackPct": 0.5,
    "atmCharges": "Free x5 ATM transactions",
    "benefits": "High transactional withdrawal and shopping limits, reliable Visa network",
    "tags": [
      "Lowest Charges"
    ],
    "isPopular": false,
    "applyUrl": "https://canarabank.com",
    "pros": [
      "Excellent high limits (₹5L POS daily)",
      "Affordable annual fee (₹500)",
      "Strong PSU trust factor"
    ],
    "cons": [
      "Limited luxury lifestyle benefits"
    ],
    "features": [
      "ATM Limit: ₹1,00,000 daily",
      "POS Limit: ₹5,00,000 daily",
      "Lounge Access: Verify manually",
      "Contactless Support: Yes"
    ],
    "verificationStatus": "Verified",
    "maxLimit": 500000,
    "eligibility": "Canara Bank account holders",
    "hiddenCharges": "Replacement ₹150 in variants PDF, ATM charges beyond free limits",
    "verifyNote": "",
    "officialSource": "https://canarabank.com",
    "bestFor": "PSU users, higher limits, Visa",
    "loungeAccess": "Verify manually",
    "fuelWaiver": "Verify",
    "internationalUsage": "Yes",
    "contactless": "Yes",
    "studentFriendly": false,
    "womenSpecial": false,
    "seniorCitizen": false,
    "zeroFeeOrLowFee": false,
    "healthcareFriendly": false,
    "travelZeroForex": false,
    "segmentTags": [],
    "lifeStage": [],
    "healthcareBenefits": [],
    "dataConfidence": "Verified"
  },
  {
    "id": 25,
    "image": "/images/cards/card-25.png",
    "bank": "Canara Bank",
    "cardName": "Canara RuPay Select Debit Card",
    "network": "RuPay",
    "category": "Premium",
    "annualFee": 1000,
    "joiningFee": "Nil",
    "minBalance": 10000,
    "interestRate": 2.9,
    "rating": 4.2,
    "cashback": "RuPay Select customized rewards",
    "cashbackPct": 1,
    "atmCharges": "Free x5 ATM transactions",
    "benefits": "Complimentary airport lounges, high limits, comprehensive insurance coverages",
    "tags": [
      "Premium Features",
      "Cashback"
    ],
    "isPopular": false,
    "applyUrl": "https://canarabank.com",
    "pros": [
      "Premium RuPay Select tier benefits",
      "Excellent daily limits",
      "Comprehensive health and travel insurance"
    ],
    "cons": [
      "High annual fee of ₹1,00,000 for a PSU bank"
    ],
    "features": [
      "ATM Limit: ₹1,00,000 daily",
      "POS Limit: ₹5,00,000 daily",
      "Lounge Access: Yes (RuPay Select)",
      "Insurance: Accident cover"
    ],
    "verificationStatus": "Verified",
    "maxLimit": 500000,
    "eligibility": "Canara eligible account holders",
    "hiddenCharges": "Replacement ₹150, GST/charges as applicable",
    "verifyNote": "Verify latest merchant list for medical benefits.",
    "officialSource": "https://canarabank.com",
    "bestFor": "RuPay Select, travel, premium PSU card",
    "loungeAccess": "Yes, RuPay Select terms",
    "fuelWaiver": "Verify",
    "internationalUsage": "Yes depending on variant",
    "contactless": "Yes",
    "studentFriendly": false,
    "womenSpecial": false,
    "seniorCitizen": false,
    "zeroFeeOrLowFee": false,
    "healthcareFriendly": true,
    "travelZeroForex": false,
    "segmentTags": [
      "Healthcare"
    ],
    "lifeStage": [
      "Healthcare Friendly"
    ],
    "healthcareBenefits": [
      "Complimentary annual health checkup",
      "Up to 20% discount on health plans",
      "Complimentary gym membership voucher (trial)",
      "Accidental insurance cover up to ₹10 Lakhs"
    ],
    "dataConfidence": "Verified"
  },
  {
    "id": 26,
    "image": "/images/cards/card-26.png",
    "bank": "Fi Money",
    "cardName": "Fi-Federal Debit Card",
    "network": "Visa",
    "category": "Travel",
    "annualFee": 0,
    "joiningFee": "Nil",
    "minBalance": 0,
    "interestRate": 3,
    "rating": 4.6,
    "cashback": "Smart app-based rewards and coin collections",
    "cashbackPct": 2,
    "atmCharges": "Free at Federal Bank ATMs",
    "benefits": "Zero forex markup on travel spends, works across 180+ countries, modern AI spending insights",
    "tags": [
      "Zero Balance",
      "Student Friendly",
      "Cashback"
    ],
    "isPopular": true,
    "applyUrl": "https://fi.money",
    "pros": [
      "Zero Forex markup is incredible for global travelers",
      "Zero account minimum balance pressure",
      "Awesome smart savings automated rules"
    ],
    "cons": [
      "Zero forex benefits are subject to specific plan subscription levels"
    ],
    "features": [
      "ATM Limit: Flexible",
      "POS Limit: Flexible",
      "Zero Forex: Enabled on plans",
      "Lounge: Verify plans"
    ],
    "verificationStatus": "Recently Updated",
    "maxLimit": 200000,
    "eligibility": "Fi/Federal Bank account holders",
    "hiddenCharges": "ATM abroad charges, plan conditions, card replacement",
    "verifyNote": "",
    "officialSource": "https://fi.money",
    "bestFor": "International travel, students, digital banking, zero forex",
    "loungeAccess": "No / verify current plan",
    "fuelWaiver": "No / verify",
    "internationalUsage": "Yes",
    "contactless": "Yes",
    "studentFriendly": true,
    "womenSpecial": false,
    "seniorCitizen": false,
    "zeroFeeOrLowFee": true,
    "healthcareFriendly": false,
    "travelZeroForex": true,
    "segmentTags": [
      "Student",
      "Zero Fee",
      "Travel"
    ],
    "lifeStage": [
      "Student Friendly",
      "Zero / Low Fee",
      "Travel / Zero Forex"
    ],
    "healthcareBenefits": [],
    "dataConfidence": "Verified"
  },
  {
    "id": 27,
    "image": "/images/cards/card-27.png",
    "bank": "Niyo",
    "cardName": "Niyo Global Debit Card",
    "network": "Visa",
    "category": "Travel",
    "annualFee": 0,
    "joiningFee": "Nil",
    "minBalance": 0,
    "interestRate": 3,
    "rating": 4.7,
    "cashback": "Global travel rewards and lounge coins",
    "cashbackPct": 1,
    "atmCharges": "Supported bank standard ATM charges",
    "benefits": "Zero forex markup, supports 180+ countries and 130+ currencies, free international lounge access",
    "tags": [
      "Zero Balance",
      "Student Friendly",
      "Cashback"
    ],
    "isPopular": true,
    "applyUrl": "https://www.goniyo.com",
    "pros": [
      "Zero forex markup is perfect for students abroad",
      "Bespoke digital multi-currency companion app",
      "Complimentary international lounge access"
    ],
    "cons": [
      "ATM withdrawal abroad fees are subject to issuing bank DCB Bank terms"
    ],
    "features": [
      "ATM Limit: High International",
      "Currencies: 130+ supported",
      "Lounge Access: Yes, international",
      "Forex: Zero markup"
    ],
    "verificationStatus": "Verified",
    "maxLimit": 300000,
    "eligibility": "Indian residents above 18 with Aadhaar, PAN, passport",
    "hiddenCharges": "ATM charges, network-bank charges, replacement fees",
    "verifyNote": "",
    "officialSource": "https://www.goniyo.com",
    "bestFor": "International travel, students abroad, zero forex",
    "loungeAccess": "International lounge access subject to criteria; verify",
    "fuelWaiver": "No",
    "internationalUsage": "Yes",
    "contactless": "Yes",
    "studentFriendly": true,
    "womenSpecial": false,
    "seniorCitizen": false,
    "zeroFeeOrLowFee": true,
    "healthcareFriendly": false,
    "travelZeroForex": true,
    "segmentTags": [
      "Student",
      "Zero Fee",
      "Travel"
    ],
    "lifeStage": [
      "Student Friendly",
      "Zero / Low Fee",
      "Travel / Zero Forex"
    ],
    "healthcareBenefits": [],
    "dataConfidence": "Verified"
  },
  {
    "id": 28,
    "image": "/images/cards/card-28.png",
    "bank": "Federal Bank",
    "cardName": "Visa Imperio Contactless Debit Card",
    "network": "Visa",
    "category": "Premium",
    "annualFee": 250,
    "joiningFee": "Varies",
    "minBalance": 5000,
    "interestRate": 3,
    "rating": 4.3,
    "cashback": "Premium Federal reward points",
    "cashbackPct": 0.75,
    "atmCharges": "Free x5 ATM transactions",
    "benefits": "Contactless tap-to-pay speed, premium bank merchant deals, dining rewards",
    "tags": [
      "Premium Features"
    ],
    "isPopular": false,
    "applyUrl": "https://www.federalbank.co.in",
    "pros": [
      "Sleek contactless tap convenience",
      "Decent transaction limits",
      "linked to premium banking perks"
    ],
    "cons": [
      "Annual fee requires minimum spending waiver verification"
    ],
    "features": [
      "ATM Limit: Standard Plus",
      "POS Limit: Standard Plus",
      "Contactless: Yes",
      "Lounge Access: Yes, verify"
    ],
    "verificationStatus": "Needs Verification",
    "maxLimit": 200000,
    "eligibility": "Eligible Federal Bank savings/current account schemes",
    "hiddenCharges": "AMC if spend waiver not met, replacement, forex",
    "verifyNote": "",
    "officialSource": "https://www.federalbank.co.in",
    "bestFor": "Premium Federal users, travel, contactless",
    "loungeAccess": "Yes / verify terms",
    "fuelWaiver": "Verify",
    "internationalUsage": "Yes",
    "contactless": "Yes",
    "studentFriendly": false,
    "womenSpecial": false,
    "seniorCitizen": false,
    "zeroFeeOrLowFee": true,
    "healthcareFriendly": false,
    "travelZeroForex": false,
    "segmentTags": [
      "Zero Fee"
    ],
    "lifeStage": [
      "Zero / Low Fee"
    ],
    "healthcareBenefits": [],
    "dataConfidence": "Needs Verification"
  },
  {
    "id": 29,
    "image": "/images/cards/card-29.png",
    "bank": "Federal Bank",
    "cardName": "Visa Celesta Contactless Debit Card",
    "network": "Visa",
    "category": "Premium",
    "annualFee": 500,
    "joiningFee": "Varies",
    "minBalance": 10000,
    "interestRate": 3,
    "rating": 4.4,
    "cashback": "Elite merchant reward points",
    "cashbackPct": 1,
    "atmCharges": "Free priority withdrawals",
    "benefits": "Elite travel perks, complimentary airport lounge accesses, luxury brand discounts",
    "tags": [
      "Premium Features",
      "Cashback"
    ],
    "isPopular": false,
    "applyUrl": "https://www.federalbank.co.in",
    "pros": [
      "Top-tier premium card for Federal Bank users",
      "Complimentary lounge privileges",
      "High POS transactional limits"
    ],
    "cons": [
      "High account balance requirements under Celesta schemes"
    ],
    "features": [
      "ATM Limit: High Elite",
      "POS Limit: High Elite",
      "Lounge Access: Yes, complimentary",
      "Contactless: Yes"
    ],
    "verificationStatus": "Needs Verification",
    "maxLimit": 500000,
    "eligibility": "Eligible Federal account holders",
    "hiddenCharges": "AMC, replacement, forex",
    "verifyNote": "",
    "officialSource": "https://www.federalbank.co.in",
    "bestFor": "Premium Federal users, lounge, travel",
    "loungeAccess": "Yes / verify terms",
    "fuelWaiver": "Verify",
    "internationalUsage": "Yes",
    "contactless": "Yes",
    "studentFriendly": false,
    "womenSpecial": false,
    "seniorCitizen": true,
    "zeroFeeOrLowFee": false,
    "healthcareFriendly": false,
    "travelZeroForex": false,
    "segmentTags": [
      "Senior"
    ],
    "lifeStage": [
      "Senior Citizen"
    ],
    "healthcareBenefits": [],
    "dataConfidence": "Needs Verification"
  },
  {
    "id": 30,
    "image": "/images/cards/card-30.png",
    "bank": "AU Small Finance Bank",
    "cardName": "AU RuPay Classic Debit Card",
    "network": "RuPay",
    "category": "Classic",
    "annualFee": 150,
    "joiningFee": "Varies",
    "minBalance": 2000,
    "interestRate": 3.5,
    "rating": 4,
    "cashback": "Standard banking loyalty points",
    "cashbackPct": 0.25,
    "atmCharges": "Free x5 transactions",
    "benefits": "RuPay domestic acceptance, safe contactless banking, low maintenance cost",
    "tags": [
      "Lowest Charges"
    ],
    "isPopular": false,
    "applyUrl": "https://www.aubank.in",
    "pros": [
      "Extremely affordable basic card",
      "Tap-to-pay contactless enabled",
      "Secure digital AU bank controls"
    ],
    "cons": [
      "No premium travel, international, or lounge benefits"
    ],
    "features": [
      "ATM Limit: Basic",
      "POS Limit: Basic",
      "Contactless: Yes",
      "Lounge Access: No"
    ],
    "verificationStatus": "Needs Verification",
    "maxLimit": 50000,
    "eligibility": "AU Bank account holders",
    "hiddenCharges": "Replacement, ATM charges",
    "verifyNote": "",
    "officialSource": "https://www.aubank.in",
    "bestFor": "Basic users, RuPay, AU customers",
    "loungeAccess": "No",
    "fuelWaiver": "Verify",
    "internationalUsage": "No / verify",
    "contactless": "Yes",
    "studentFriendly": false,
    "womenSpecial": false,
    "seniorCitizen": false,
    "zeroFeeOrLowFee": true,
    "healthcareFriendly": false,
    "travelZeroForex": false,
    "segmentTags": [
      "Zero Fee"
    ],
    "lifeStage": [
      "Zero / Low Fee"
    ],
    "healthcareBenefits": [],
    "dataConfidence": "Needs Verification"
  },
  {
    "id": 31,
    "image": "/images/cards/card-31.png",
    "bank": "AU Small Finance Bank",
    "cardName": "AU Royale Debit Card",
    "network": "Visa",
    "category": "Premium",
    "annualFee": 0,
    "joiningFee": "Waived",
    "minBalance": 100000,
    "interestRate": 4,
    "rating": 4.5,
    "cashback": "Bespoke Royale reward points on high-value spends",
    "cashbackPct": 1.5,
    "atmCharges": "Free Unlimited",
    "benefits": "Complimentary airport lounges, AU Royale premium privileges, high daily withdrawal caps",
    "tags": [
      "Premium Features",
      "Cashback"
    ],
    "isPopular": false,
    "applyUrl": "https://www.aubank.in",
    "pros": [
      "Premium Royale banking priorities",
      "Unlimited free domestic ATM withdrawals",
      "Zero annual fee under Royale status"
    ],
    "cons": [
      "Requires very high Royale account relationship maintenance"
    ],
    "features": [
      "ATM Limit: High Royale",
      "POS Limit: High Royale",
      "Lounge Access: Yes, complimentary",
      "Contactless: Yes"
    ],
    "verificationStatus": "Needs Verification",
    "maxLimit": 500000,
    "eligibility": "AU Royale customers",
    "hiddenCharges": "SOC charges, forex, replacement",
    "verifyNote": "",
    "officialSource": "https://www.aubank.in",
    "bestFor": "Premium banking, travel, high limits",
    "loungeAccess": "Yes / verify",
    "fuelWaiver": "Verify",
    "internationalUsage": "Yes",
    "contactless": "Yes",
    "studentFriendly": false,
    "womenSpecial": false,
    "seniorCitizen": true,
    "zeroFeeOrLowFee": true,
    "healthcareFriendly": true,
    "travelZeroForex": false,
    "segmentTags": [
      "Senior",
      "Zero Fee",
      "Healthcare"
    ],
    "lifeStage": [
      "Senior Citizen",
      "Zero / Low Fee",
      "Healthcare Friendly"
    ],
    "healthcareBenefits": [
      "Complimentary annual health screening",
      "Up to 15% discount at listed pharmacies",
      "Discounted doctor teleconsultation"
    ],
    "dataConfidence": "Verified"
  },
  {
    "id": 32,
    "image": "/images/cards/card-32.png",
    "bank": "Punjab National Bank",
    "cardName": "PNB RuPay Platinum Debit Card",
    "network": "RuPay",
    "category": "Classic",
    "annualFee": 250,
    "joiningFee": "Varies",
    "minBalance": 2000,
    "interestRate": 2.7,
    "rating": 4,
    "cashback": "RuPay Platinum points and merchant deal waivers",
    "cashbackPct": 0.5,
    "atmCharges": "Standard PNB rules",
    "benefits": "RuPay Platinum merchant privileges, reliable public sector banking network",
    "tags": [
      "Lowest Charges"
    ],
    "isPopular": false,
    "applyUrl": "https://www.pnbindia.in",
    "pros": [
      "Affordable maintenance fee",
      "PSU trust and widespread network access",
      "RuPay ecosystem perks"
    ],
    "cons": [
      "Lounge access conditions changed; check eligibility criteria carefully"
    ],
    "features": [
      "ATM Limit: Standard Plus",
      "POS Limit: Standard Plus",
      "Lounge Access: Changed/Revised April 2026",
      "Contactless: Yes"
    ],
    "verificationStatus": "Needs Verification",
    "maxLimit": 100000,
    "eligibility": "PNB account holders",
    "hiddenCharges": "Replacement, GST, ATM charges",
    "verifyNote": "",
    "officialSource": "https://www.pnbindia.in",
    "bestFor": "RuPay users, public-sector banking",
    "loungeAccess": "Changed/revised from April 2026; verify before showing",
    "fuelWaiver": "Verify",
    "internationalUsage": "Depends on variant",
    "contactless": "Yes",
    "studentFriendly": false,
    "womenSpecial": true,
    "seniorCitizen": false,
    "zeroFeeOrLowFee": true,
    "healthcareFriendly": false,
    "travelZeroForex": false,
    "segmentTags": [
      "Women",
      "Zero Fee"
    ],
    "lifeStage": [
      "Women Special",
      "Zero / Low Fee"
    ],
    "healthcareBenefits": [],
    "dataConfidence": "Needs Verification"
  },
  {
    "id": 33,
    "image": "/images/cards/card-33.png",
    "bank": "Punjab National Bank",
    "cardName": "PNB RuPay Select Debit Card",
    "network": "RuPay",
    "category": "Premium",
    "annualFee": 800,
    "joiningFee": "Varies",
    "minBalance": 10000,
    "interestRate": 2.7,
    "rating": 4.2,
    "cashback": "PNB Select special reward tier",
    "cashbackPct": 1,
    "atmCharges": "Free x5 ATM transactions",
    "benefits": "Premium complimentary airport lounge access, high limits, lifestyle rewards",
    "tags": [
      "Premium Features",
      "Cashback"
    ],
    "isPopular": false,
    "applyUrl": "https://www.pnbindia.in",
    "pros": [
      "Premium RuPay Select travel benefits",
      "High withdrawal limits",
      "PSU banking ecosystem"
    ],
    "cons": [
      "Lounge access subject to PNB revised quarterly spending criteria"
    ],
    "features": [
      "ATM Limit: High Select",
      "POS Limit: High Select",
      "Lounge Access: Yes, complimentary",
      "Contactless: Yes"
    ],
    "verificationStatus": "Needs Verification",
    "maxLimit": 300000,
    "eligibility": "Eligible PNB account holders",
    "hiddenCharges": "GST, replacement fees, benefit conditions",
    "verifyNote": "Verify PNB lounge spending rules.",
    "officialSource": "https://www.pnbindia.in",
    "bestFor": "RuPay Select, premium PSU users",
    "loungeAccess": "Yes, subject to revised conditions",
    "fuelWaiver": "Verify",
    "internationalUsage": "Yes depending on variant",
    "contactless": "Yes",
    "studentFriendly": false,
    "womenSpecial": false,
    "seniorCitizen": true,
    "zeroFeeOrLowFee": false,
    "healthcareFriendly": true,
    "travelZeroForex": false,
    "segmentTags": [
      "Senior",
      "Healthcare"
    ],
    "lifeStage": [
      "Senior Citizen",
      "Healthcare Friendly"
    ],
    "healthcareBenefits": [
      "Complimentary annual health checkup",
      "Discounts on diagnostic and medical tests",
      "Bespoke wellness offers"
    ],
    "dataConfidence": "Needs Verification"
  },
  {
    "id": 34,
    "image": "/images/cards/card-34.png",
    "bank": "Paytm Payments Bank",
    "cardName": "Paytm Payments Bank Debit Card",
    "network": "RuPay",
    "category": "Digital",
    "annualFee": 150,
    "joiningFee": "Varies",
    "minBalance": 0,
    "interestRate": 2.5,
    "rating": 3.2,
    "cashback": "Paytm Wallet transition rewards",
    "cashbackPct": 0.1,
    "atmCharges": "Standard payments bank ATM fees",
    "benefits": "Historical payments bank RuPay card, zero balance account support",
    "tags": [
      "Zero Balance",
      "Lowest Charges",
      "Student Friendly"
    ],
    "isPopular": false,
    "applyUrl": "https://www.paytmbank.com",
    "pros": [
      "Low fee",
      "Zero balance requirements"
    ],
    "cons": [
      "Regulatory restrictions; card status is mostly archived/reference only"
    ],
    "features": [
      "ATM Limit: Standard",
      "POS Limit: Standard",
      "Contactless: Yes",
      "Status: Archived Reference"
    ],
    "verificationStatus": "Needs Verification",
    "maxLimit": 25000,
    "eligibility": "Legacy Paytm Payments Bank account holders",
    "hiddenCharges": "Service fees, replacement fees",
    "verifyNote": "",
    "officialSource": "https://www.paytmbank.com",
    "bestFor": "Archived reference only",
    "loungeAccess": "No",
    "fuelWaiver": "No",
    "internationalUsage": "No",
    "contactless": "Yes",
    "studentFriendly": true,
    "womenSpecial": false,
    "seniorCitizen": false,
    "zeroFeeOrLowFee": true,
    "healthcareFriendly": false,
    "travelZeroForex": false,
    "segmentTags": [
      "Student",
      "Zero Fee"
    ],
    "lifeStage": [
      "Student Friendly",
      "Zero / Low Fee"
    ],
    "healthcareBenefits": [],
    "dataConfidence": "Needs Verification"
  },
  {
    "id": 35,
    "image": "/images/cards/card-2.png",
    "bank": "HDFC Bank",
    "cardName": "HDFC EasyShop Imperia Platinum Chip Debit Card",
    "network": "Visa",
    "annualFee": "Rs.750 + GST",
    "numAnnualFee": 750,
    "joiningFee": "Not Available",
    "international": true,
    "contactless": true,
    "loungeAccess": "Complimentary Clipper lounge access",
    "forexMarkup": "Not Available",
    "cashback": "1 cashback point per Rs.100 spent",
    "bestFor": "Imperia (premium) account holders",
    "rating": 4.4,
    "isPopular": false,
    "applyUrl": "https://www.hdfcbank.com",
    "category": "Imperia Platinum",
    "minBalance": 2000,
    "interestRate": 3,
    "cashbackPct": 1,
    "atmCharges": "Daily Limit: Rs.1,00,000/day",
    "benefits": "Premium debit card exclusively for HDFC Imperia relationship account holders.",
    "tags": [
      "Premium Features",
      "Cashback"
    ],
    "pros": [
      "Premium debit card exclusively for HDFC Imperia relationship account holders.",
      "Contactless tap & pay supported"
    ],
    "cons": [
      "Annual fee of Rs.750 + GST applies"
    ],
    "features": [
      "ATM Limit: Rs.1,00,000/day",
      "POS Limit: Rs.3,00,000/day",
      "Lounge Access: Complimentary Clipper lounge access",
      "Contactless Support: Yes"
    ],
    "verificationStatus": "Verified",
    "maxLimit": 300000,
    "eligibility": "HDFC Bank account holders",
    "hiddenCharges": "Standard bank SOC fees and taxes",
    "verifyNote": "",
    "officialSource": "https://www.hdfcbank.com",
    "fuelWaiver": "Waived on eligible fuel spends",
    "internationalUsage": "Yes",
    "studentFriendly": false,
    "womenSpecial": false,
    "seniorCitizen": false,
    "zeroFeeOrLowFee": false,
    "healthcareFriendly": false,
    "travelZeroForex": false,
    "segmentTags": [],
    "lifeStage": [],
    "healthcareBenefits": [],
    "dataConfidence": "Verified"
  },
  {
    "id": 36,
    "image": "/images/cards/card-3.png",
    "bank": "ICICI Bank",
    "cardName": "ICICI Coral Debit Card",
    "network": "Visa/RuPay",
    "annualFee": "Rs.199 + GST",
    "numAnnualFee": 199,
    "joiningFee": "Not Available",
    "international": true,
    "contactless": true,
    "loungeAccess": "Not Available",
    "forexMarkup": "Not Available",
    "cashback": "Not Available",
    "bestFor": "Everyday banking, Entry-level rewards",
    "rating": 4.1,
    "isPopular": false,
    "applyUrl": "https://www.icicibank.com",
    "category": "Coral",
    "minBalance": 2000,
    "interestRate": 3,
    "cashbackPct": 0,
    "atmCharges": "Daily Limit: Rs.50,000/day",
    "benefits": "ICICI's popular entry-tier debit card with PAYBACK reward points on daily spends.",
    "tags": [
      "Lowest Charges"
    ],
    "pros": [
      "ICICI's popular entry-tier debit card with PAYBACK reward points on daily spends.",
      "Contactless tap & pay supported"
    ],
    "cons": [
      "Annual fee of Rs.199 + GST applies"
    ],
    "features": [
      "ATM Limit: Rs.50,000/day",
      "POS Limit: Rs.1,00,000/day",
      "Lounge Access: Not Available",
      "Contactless Support: Yes"
    ],
    "verificationStatus": "Verified",
    "maxLimit": 100000,
    "eligibility": "ICICI Bank account holders",
    "hiddenCharges": "Standard bank SOC fees and taxes",
    "verifyNote": "",
    "officialSource": "https://www.icicibank.com",
    "fuelWaiver": "Waived on eligible fuel spends",
    "internationalUsage": "Yes",
    "studentFriendly": false,
    "womenSpecial": false,
    "seniorCitizen": false,
    "zeroFeeOrLowFee": true,
    "healthcareFriendly": false,
    "travelZeroForex": false,
    "segmentTags": [
      "Zero Fee"
    ],
    "lifeStage": [
      "Zero / Low Fee"
    ],
    "healthcareBenefits": [],
    "dataConfidence": "Verified"
  },
  {
    "id": 37,
    "image": "/images/cards/card-4.png",
    "bank": "ICICI Bank",
    "cardName": "ICICI Rubyx Debit Card",
    "network": "Visa Signature/Mastercard World",
    "annualFee": "Rs.499 + GST",
    "numAnnualFee": 499,
    "joiningFee": "Not Available",
    "international": true,
    "contactless": true,
    "loungeAccess": "Complimentary domestic lounge access",
    "forexMarkup": "Not Available",
    "cashback": "Not Available",
    "bestFor": "Mid-premium banking, Lounge access",
    "rating": 4.3,
    "isPopular": false,
    "applyUrl": "https://www.icicibank.com",
    "category": "Rubyx",
    "minBalance": 2000,
    "interestRate": 3,
    "cashbackPct": 0,
    "atmCharges": "Daily Limit: Rs.1,00,000/day",
    "benefits": "Mid-premium debit card offering domestic lounge access and enhanced reward points.",
    "tags": [
      "Premium Features"
    ],
    "pros": [
      "Mid-premium debit card offering domestic lounge access and enhanced reward points.",
      "Contactless tap & pay supported"
    ],
    "cons": [
      "Annual fee of Rs.499 + GST applies"
    ],
    "features": [
      "ATM Limit: Rs.1,00,000/day",
      "POS Limit: Rs.2,00,000/day",
      "Lounge Access: Complimentary domestic lounge access",
      "Contactless Support: Yes"
    ],
    "verificationStatus": "Verified",
    "maxLimit": 200000,
    "eligibility": "ICICI Bank account holders",
    "hiddenCharges": "Standard bank SOC fees and taxes",
    "verifyNote": "",
    "officialSource": "https://www.icicibank.com",
    "fuelWaiver": "Waived on eligible fuel spends",
    "internationalUsage": "Yes",
    "studentFriendly": false,
    "womenSpecial": false,
    "seniorCitizen": false,
    "zeroFeeOrLowFee": false,
    "healthcareFriendly": false,
    "travelZeroForex": false,
    "segmentTags": [],
    "lifeStage": [],
    "healthcareBenefits": [],
    "dataConfidence": "Verified"
  },
  {
    "id": 38,
    "image": "/images/cards/card-5.png",
    "bank": "ICICI Bank",
    "cardName": "ICICI Sapphiro Debit Card",
    "network": "Visa Signature",
    "annualFee": "Rs.999 + GST",
    "numAnnualFee": 999,
    "joiningFee": "Not Available",
    "international": true,
    "contactless": true,
    "loungeAccess": "Complimentary domestic and international lounge access",
    "forexMarkup": "Lower forex markup",
    "cashback": "Not Available",
    "bestFor": "Premium travel, High spenders",
    "rating": 4.5,
    "isPopular": true,
    "applyUrl": "https://www.icicibank.com",
    "category": "Sapphiro",
    "minBalance": 2000,
    "interestRate": 3,
    "cashbackPct": 0,
    "atmCharges": "Daily Limit: Rs.1,50,000/day",
    "benefits": "ICICI's premium debit card with international lounge access and travel insurance benefits.",
    "tags": [
      "Premium Features"
    ],
    "pros": [
      "ICICI's premium debit card with international lounge access and travel insurance benefits.",
      "Contactless tap & pay supported"
    ],
    "cons": [
      "Annual fee of Rs.999 + GST applies"
    ],
    "features": [
      "ATM Limit: Rs.1,50,000/day",
      "POS Limit: Rs.3,00,000/day",
      "Lounge Access: Complimentary domestic and international lounge access",
      "Contactless Support: Yes"
    ],
    "verificationStatus": "Verified",
    "maxLimit": 300000,
    "eligibility": "ICICI Bank account holders",
    "hiddenCharges": "Standard bank SOC fees and taxes",
    "verifyNote": "",
    "officialSource": "https://www.icicibank.com",
    "fuelWaiver": "Waived on eligible fuel spends",
    "internationalUsage": "Yes",
    "studentFriendly": false,
    "womenSpecial": false,
    "seniorCitizen": false,
    "zeroFeeOrLowFee": false,
    "healthcareFriendly": false,
    "travelZeroForex": false,
    "segmentTags": [],
    "lifeStage": [],
    "healthcareBenefits": [],
    "dataConfidence": "Verified"
  },
  {
    "id": 39,
    "image": "/images/cards/card-6.png",
    "bank": "ICICI Bank",
    "cardName": "ICICI Expressions Debit Card",
    "network": "Visa/RuPay",
    "annualFee": "Rs.199 + GST",
    "numAnnualFee": 199,
    "joiningFee": "Not Available",
    "international": true,
    "contactless": true,
    "loungeAccess": "Not Available",
    "forexMarkup": "Not Available",
    "cashback": "Not Available",
    "bestFor": "Personalised/customisable card, Young customers",
    "rating": 4,
    "isPopular": false,
    "applyUrl": "https://www.icicibank.com",
    "category": "Expressions",
    "minBalance": 2000,
    "interestRate": 3,
    "cashbackPct": 0,
    "atmCharges": "Daily Limit: Rs.50,000/day",
    "benefits": "Customisable-design debit card popular with younger account holders.",
    "tags": [
      "Lowest Charges",
      "Student Friendly"
    ],
    "pros": [
      "Customisable-design debit card popular with younger account holders.",
      "Contactless tap & pay supported"
    ],
    "cons": [
      "Annual fee of Rs.199 + GST applies"
    ],
    "features": [
      "ATM Limit: Rs.50,000/day",
      "POS Limit: Rs.1,00,000/day",
      "Lounge Access: Not Available",
      "Contactless Support: Yes"
    ],
    "verificationStatus": "Verified",
    "maxLimit": 100000,
    "eligibility": "ICICI Bank account holders",
    "hiddenCharges": "Standard bank SOC fees and taxes",
    "verifyNote": "",
    "officialSource": "https://www.icicibank.com",
    "fuelWaiver": "Waived on eligible fuel spends",
    "internationalUsage": "Yes",
    "studentFriendly": true,
    "womenSpecial": false,
    "seniorCitizen": false,
    "zeroFeeOrLowFee": true,
    "healthcareFriendly": false,
    "travelZeroForex": false,
    "segmentTags": [
      "Student",
      "Zero Fee"
    ],
    "lifeStage": [
      "Student Friendly",
      "Zero / Low Fee"
    ],
    "healthcareBenefits": [],
    "dataConfidence": "Verified"
  },
  {
    "id": 40,
    "image": "/images/cards/card-7.png",
    "bank": "ICICI Bank",
    "cardName": "ICICI Platinum Debit Card",
    "network": "Visa/Mastercard",
    "annualFee": "Rs.299 + GST",
    "numAnnualFee": 299,
    "joiningFee": "Not Available",
    "international": true,
    "contactless": true,
    "loungeAccess": "Not Available",
    "forexMarkup": "Not Available",
    "cashback": "Not Available",
    "bestFor": "Everyday premium banking",
    "rating": 4.2,
    "isPopular": false,
    "applyUrl": "https://www.icicibank.com",
    "category": "Platinum",
    "minBalance": 2000,
    "interestRate": 3,
    "cashbackPct": 0,
    "atmCharges": "Daily Limit: Rs.75,000/day",
    "benefits": "Mid-tier ICICI debit card with higher transaction limits and reward accrual.",
    "tags": [
      "Premium Features"
    ],
    "pros": [
      "Mid-tier ICICI debit card with higher transaction limits and reward accrual.",
      "Contactless tap & pay supported"
    ],
    "cons": [
      "Annual fee of Rs.299 + GST applies"
    ],
    "features": [
      "ATM Limit: Rs.75,000/day",
      "POS Limit: Rs.1,50,000/day",
      "Lounge Access: Not Available",
      "Contactless Support: Yes"
    ],
    "verificationStatus": "Verified",
    "maxLimit": 150000,
    "eligibility": "ICICI Bank account holders",
    "hiddenCharges": "Standard bank SOC fees and taxes",
    "verifyNote": "",
    "officialSource": "https://www.icicibank.com",
    "fuelWaiver": "Waived on eligible fuel spends",
    "internationalUsage": "Yes",
    "studentFriendly": false,
    "womenSpecial": false,
    "seniorCitizen": false,
    "zeroFeeOrLowFee": false,
    "healthcareFriendly": false,
    "travelZeroForex": false,
    "segmentTags": [],
    "lifeStage": [],
    "healthcareBenefits": [],
    "dataConfidence": "Verified"
  },
  {
    "id": 41,
    "image": "/images/cards/card-8.png",
    "bank": "ICICI Bank",
    "cardName": "ICICI Visa Signature Debit Card",
    "network": "Visa Signature",
    "annualFee": "Rs.999 + GST",
    "numAnnualFee": 999,
    "joiningFee": "Not Available",
    "international": true,
    "contactless": true,
    "loungeAccess": "Complimentary lounge access",
    "forexMarkup": "Not Available",
    "cashback": "Not Available",
    "bestFor": "Premium/HNI customers",
    "rating": 4.4,
    "isPopular": false,
    "applyUrl": "https://www.icicibank.com",
    "category": "Visa Signature",
    "minBalance": 2000,
    "interestRate": 3,
    "cashbackPct": 0,
    "atmCharges": "Daily Limit: Rs.1,50,000/day",
    "benefits": "High-tier Visa Signature debit card for ICICI's premium banking customers.",
    "tags": [
      "Premium Features"
    ],
    "pros": [
      "High-tier Visa Signature debit card for ICICI's premium banking customers.",
      "Contactless tap & pay supported"
    ],
    "cons": [
      "Annual fee of Rs.999 + GST applies"
    ],
    "features": [
      "ATM Limit: Rs.1,50,000/day",
      "POS Limit: Rs.3,00,000/day",
      "Lounge Access: Complimentary lounge access",
      "Contactless Support: Yes"
    ],
    "verificationStatus": "Verified",
    "maxLimit": 300000,
    "eligibility": "ICICI Bank account holders",
    "hiddenCharges": "Standard bank SOC fees and taxes",
    "verifyNote": "",
    "officialSource": "https://www.icicibank.com",
    "fuelWaiver": "Waived on eligible fuel spends",
    "internationalUsage": "Yes",
    "studentFriendly": false,
    "womenSpecial": false,
    "seniorCitizen": false,
    "zeroFeeOrLowFee": false,
    "healthcareFriendly": false,
    "travelZeroForex": false,
    "segmentTags": [],
    "lifeStage": [],
    "healthcareBenefits": [],
    "dataConfidence": "Verified"
  },
  {
    "id": 42,
    "image": "/images/cards/card-9.png",
    "bank": "Axis Bank",
    "cardName": "Axis Bank Liberty Debit Card",
    "network": "Visa/RuPay",
    "annualFee": "Rs.199-249 + GST",
    "numAnnualFee": 199,
    "joiningFee": "Not Available",
    "international": true,
    "contactless": true,
    "loungeAccess": "Not Available",
    "forexMarkup": "Not Available",
    "cashback": "Not Available",
    "bestFor": "Everyday banking, Young professionals",
    "rating": 4.1,
    "isPopular": false,
    "applyUrl": "https://www.axisbank.com",
    "category": "Liberty",
    "minBalance": 2000,
    "interestRate": 3,
    "cashbackPct": 0,
    "atmCharges": "Daily Limit: Rs.50,000/day",
    "benefits": "Axis Bank's popular entry-tier debit card with eDGE reward points on spends.",
    "tags": [
      "Lowest Charges"
    ],
    "pros": [
      "Axis Bank's popular entry-tier debit card with eDGE reward points on spends.",
      "Contactless tap & pay supported"
    ],
    "cons": [
      "Annual fee of Rs.199-249 + GST applies"
    ],
    "features": [
      "ATM Limit: Rs.50,000/day",
      "POS Limit: Rs.1,00,000/day",
      "Lounge Access: Not Available",
      "Contactless Support: Yes"
    ],
    "verificationStatus": "Verified",
    "maxLimit": 100000,
    "eligibility": "Axis Bank account holders",
    "hiddenCharges": "Standard bank SOC fees and taxes",
    "verifyNote": "",
    "officialSource": "https://www.axisbank.com",
    "fuelWaiver": "Waived on eligible fuel spends",
    "internationalUsage": "Yes",
    "studentFriendly": false,
    "womenSpecial": false,
    "seniorCitizen": false,
    "zeroFeeOrLowFee": true,
    "healthcareFriendly": false,
    "travelZeroForex": false,
    "segmentTags": [
      "Zero Fee"
    ],
    "lifeStage": [
      "Zero / Low Fee"
    ],
    "healthcareBenefits": [],
    "dataConfidence": "Verified"
  },
  {
    "id": 43,
    "image": "/images/cards/card-10.png",
    "bank": "Axis Bank",
    "cardName": "Axis Bank Priority Platinum Debit Card",
    "network": "Visa/Mastercard",
    "annualFee": "Rs.500 + GST",
    "numAnnualFee": 500,
    "joiningFee": "Not Available",
    "international": true,
    "contactless": true,
    "loungeAccess": "Complimentary domestic lounge access",
    "forexMarkup": "Not Available",
    "cashback": "Not Available",
    "bestFor": "Priority banking customers",
    "rating": 4.3,
    "isPopular": false,
    "applyUrl": "https://www.axisbank.com",
    "category": "Priority Platinum",
    "minBalance": 2000,
    "interestRate": 3,
    "cashbackPct": 0,
    "atmCharges": "Daily Limit: Rs.1,00,000/day",
    "benefits": "Mid-premium debit card for Axis Priority Banking customers with lounge access.",
    "tags": [
      "Premium Features"
    ],
    "pros": [
      "Mid-premium debit card for Axis Priority Banking customers with lounge access.",
      "Contactless tap & pay supported"
    ],
    "cons": [
      "Annual fee of Rs.500 + GST applies"
    ],
    "features": [
      "ATM Limit: Rs.1,00,000/day",
      "POS Limit: Rs.2,00,000/day",
      "Lounge Access: Complimentary domestic lounge access",
      "Contactless Support: Yes"
    ],
    "verificationStatus": "Verified",
    "maxLimit": 200000,
    "eligibility": "Axis Bank account holders",
    "hiddenCharges": "Standard bank SOC fees and taxes",
    "verifyNote": "",
    "officialSource": "https://www.axisbank.com",
    "fuelWaiver": "Waived on eligible fuel spends",
    "internationalUsage": "Yes",
    "studentFriendly": false,
    "womenSpecial": false,
    "seniorCitizen": false,
    "zeroFeeOrLowFee": false,
    "healthcareFriendly": false,
    "travelZeroForex": false,
    "segmentTags": [],
    "lifeStage": [],
    "healthcareBenefits": [],
    "dataConfidence": "Verified"
  },
  {
    "id": 44,
    "image": "/images/cards/card-11.png",
    "bank": "Axis Bank",
    "cardName": "Axis Bank Burgundy Debit Card",
    "network": "Visa Infinite",
    "annualFee": "Waived for Burgundy account holders",
    "numAnnualFee": 0,
    "joiningFee": "Not Available",
    "international": true,
    "contactless": true,
    "loungeAccess": "Unlimited domestic and international lounge access",
    "forexMarkup": "Lower forex markup",
    "cashback": "Not Available",
    "bestFor": "Ultra-HNI / Burgundy Private customers",
    "rating": 4.7,
    "isPopular": true,
    "applyUrl": "https://www.axisbank.com",
    "category": "Burgundy",
    "minBalance": 2000,
    "interestRate": 3,
    "cashbackPct": 0,
    "atmCharges": "Daily Limit: Rs.2,00,000/day",
    "benefits": "Axis Bank's top-tier debit card exclusive to Burgundy Private relationship customers.",
    "tags": [
      "Lowest Charges"
    ],
    "pros": [
      "Axis Bank's top-tier debit card exclusive to Burgundy Private relationship customers.",
      "Contactless tap & pay supported"
    ],
    "cons": [
      "Basic reward structure"
    ],
    "features": [
      "ATM Limit: Rs.2,00,000/day",
      "POS Limit: Rs.5,00,000/day",
      "Lounge Access: Unlimited domestic and international lounge access",
      "Contactless Support: Yes"
    ],
    "verificationStatus": "Verified",
    "maxLimit": 500000,
    "eligibility": "Axis Bank account holders",
    "hiddenCharges": "Standard bank SOC fees and taxes",
    "verifyNote": "",
    "officialSource": "https://www.axisbank.com",
    "fuelWaiver": "Waived on eligible fuel spends",
    "internationalUsage": "Yes",
    "studentFriendly": false,
    "womenSpecial": false,
    "seniorCitizen": false,
    "zeroFeeOrLowFee": true,
    "healthcareFriendly": false,
    "travelZeroForex": false,
    "segmentTags": [
      "Zero Fee"
    ],
    "lifeStage": [
      "Zero / Low Fee"
    ],
    "healthcareBenefits": [],
    "dataConfidence": "Verified"
  },
  {
    "id": 45,
    "image": "/images/cards/card-12.png",
    "bank": "Axis Bank",
    "cardName": "Axis Bank Rewards Plus Debit Card",
    "network": "RuPay/Visa",
    "annualFee": "Rs.250 + GST",
    "numAnnualFee": 250,
    "joiningFee": "Not Available",
    "international": true,
    "contactless": true,
    "loungeAccess": "Not Available",
    "forexMarkup": "Not Available",
    "cashback": "Not Available",
    "bestFor": "Reward point accumulation",
    "rating": 4.1,
    "isPopular": false,
    "applyUrl": "https://www.axisbank.com",
    "category": "Rewards Plus",
    "minBalance": 2000,
    "interestRate": 3,
    "cashbackPct": 0,
    "atmCharges": "Daily Limit: Rs.50,000/day",
    "benefits": "Rewards-focused debit card offering accelerated points on everyday spends.",
    "tags": [
      "Lowest Charges"
    ],
    "pros": [
      "Rewards-focused debit card offering accelerated points on everyday spends.",
      "Contactless tap & pay supported"
    ],
    "cons": [
      "Annual fee of Rs.250 + GST applies"
    ],
    "features": [
      "ATM Limit: Rs.50,000/day",
      "POS Limit: Rs.1,00,000/day",
      "Lounge Access: Not Available",
      "Contactless Support: Yes"
    ],
    "verificationStatus": "Verified",
    "maxLimit": 100000,
    "eligibility": "Axis Bank account holders",
    "hiddenCharges": "Standard bank SOC fees and taxes",
    "verifyNote": "",
    "officialSource": "https://www.axisbank.com",
    "fuelWaiver": "Waived on eligible fuel spends",
    "internationalUsage": "Yes",
    "studentFriendly": false,
    "womenSpecial": false,
    "seniorCitizen": false,
    "zeroFeeOrLowFee": true,
    "healthcareFriendly": false,
    "travelZeroForex": false,
    "segmentTags": [
      "Zero Fee"
    ],
    "lifeStage": [
      "Zero / Low Fee"
    ],
    "healthcareBenefits": [],
    "dataConfidence": "Verified"
  },
  {
    "id": 46,
    "image": "/images/cards/card-13.png",
    "bank": "Axis Bank",
    "cardName": "Axis Bank Titanium Reward Debit Card",
    "network": "Visa/Mastercard",
    "annualFee": "Rs.300 + GST",
    "numAnnualFee": 300,
    "joiningFee": "Not Available",
    "international": true,
    "contactless": true,
    "loungeAccess": "Not Available",
    "forexMarkup": "Not Available",
    "cashback": "Not Available",
    "bestFor": "Everyday premium banking",
    "rating": 4.1,
    "isPopular": false,
    "applyUrl": "https://www.axisbank.com",
    "category": "Titanium",
    "minBalance": 2000,
    "interestRate": 3,
    "cashbackPct": 0,
    "atmCharges": "Daily Limit: Rs.75,000/day",
    "benefits": "Mid-tier Axis debit card with higher spend limits and reward accrual.",
    "tags": [
      "Premium Features"
    ],
    "pros": [
      "Mid-tier Axis debit card with higher spend limits and reward accrual.",
      "Contactless tap & pay supported"
    ],
    "cons": [
      "Annual fee of Rs.300 + GST applies"
    ],
    "features": [
      "ATM Limit: Rs.75,000/day",
      "POS Limit: Rs.1,50,000/day",
      "Lounge Access: Not Available",
      "Contactless Support: Yes"
    ],
    "verificationStatus": "Verified",
    "maxLimit": 150000,
    "eligibility": "Axis Bank account holders",
    "hiddenCharges": "Standard bank SOC fees and taxes",
    "verifyNote": "",
    "officialSource": "https://www.axisbank.com",
    "fuelWaiver": "Waived on eligible fuel spends",
    "internationalUsage": "Yes",
    "studentFriendly": false,
    "womenSpecial": false,
    "seniorCitizen": false,
    "zeroFeeOrLowFee": false,
    "healthcareFriendly": false,
    "travelZeroForex": false,
    "segmentTags": [],
    "lifeStage": [],
    "healthcareBenefits": [],
    "dataConfidence": "Verified"
  },
  {
    "id": 47,
    "image": "/images/cards/card-14.png",
    "bank": "Axis Bank",
    "cardName": "Axis Bank Delight Debit Card",
    "network": "Visa/RuPay",
    "annualFee": "Rs.199 + GST",
    "numAnnualFee": 199,
    "joiningFee": "Not Available",
    "international": true,
    "contactless": true,
    "loungeAccess": "Not Available",
    "forexMarkup": "Not Available",
    "cashback": "Cashback on select categories",
    "bestFor": "Students, First-time cardholders",
    "rating": 4,
    "isPopular": false,
    "applyUrl": "https://www.axisbank.com",
    "category": "Delight",
    "minBalance": 2000,
    "interestRate": 3,
    "cashbackPct": 1,
    "atmCharges": "Daily Limit: Rs.50,000/day",
    "benefits": "Entry-level Axis Bank debit card suited to students and new account holders.",
    "tags": [
      "Lowest Charges",
      "Student Friendly",
      "Cashback"
    ],
    "pros": [
      "Entry-level Axis Bank debit card suited to students and new account holders.",
      "Contactless tap & pay supported"
    ],
    "cons": [
      "Annual fee of Rs.199 + GST applies"
    ],
    "features": [
      "ATM Limit: Rs.50,000/day",
      "POS Limit: Rs.1,00,000/day",
      "Lounge Access: Not Available",
      "Contactless Support: Yes"
    ],
    "verificationStatus": "Verified",
    "maxLimit": 100000,
    "eligibility": "Axis Bank account holders",
    "hiddenCharges": "Standard bank SOC fees and taxes",
    "verifyNote": "",
    "officialSource": "https://www.axisbank.com",
    "fuelWaiver": "Waived on eligible fuel spends",
    "internationalUsage": "Yes",
    "studentFriendly": true,
    "womenSpecial": false,
    "seniorCitizen": false,
    "zeroFeeOrLowFee": true,
    "healthcareFriendly": false,
    "travelZeroForex": false,
    "segmentTags": [
      "Student",
      "Zero Fee"
    ],
    "lifeStage": [
      "Student Friendly",
      "Zero / Low Fee"
    ],
    "healthcareBenefits": [],
    "dataConfidence": "Verified"
  },
  {
    "id": 48,
    "image": "/images/cards/card-15.png",
    "bank": "Kotak Mahindra Bank",
    "cardName": "Kotak 811 Debit Card",
    "network": "RuPay/Visa",
    "annualFee": "Free / Rs.99-149 + GST",
    "numAnnualFee": 99,
    "joiningFee": "Free",
    "international": true,
    "contactless": true,
    "loungeAccess": "Not Available",
    "forexMarkup": "Not Available",
    "cashback": "Not Available",
    "bestFor": "Digital-first/zero-balance account holders, Students",
    "rating": 4.2,
    "isPopular": false,
    "applyUrl": "https://www.kotak.com",
    "category": "811",
    "minBalance": 2000,
    "interestRate": 3,
    "cashbackPct": 0,
    "atmCharges": "Daily Limit: Rs.25,000/day",
    "benefits": "Debit card issued with Kotak's zero-balance digital 811 account, popular among students and young users.",
    "tags": [
      "Lowest Charges",
      "Student Friendly"
    ],
    "pros": [
      "Debit card issued with Kotak's zero-balance digital 811 account, popular among students and young users.",
      "Contactless tap & pay supported"
    ],
    "cons": [
      "Annual fee of Free / Rs.99-149 + GST applies"
    ],
    "features": [
      "ATM Limit: Rs.25,000/day",
      "POS Limit: Rs.75,000/day",
      "Lounge Access: Not Available",
      "Contactless Support: Yes"
    ],
    "verificationStatus": "Verified",
    "maxLimit": 75000,
    "eligibility": "Kotak Mahindra Bank account holders",
    "hiddenCharges": "Standard bank SOC fees and taxes",
    "verifyNote": "",
    "officialSource": "https://www.kotak.com",
    "fuelWaiver": "Waived on eligible fuel spends",
    "internationalUsage": "Yes",
    "studentFriendly": true,
    "womenSpecial": false,
    "seniorCitizen": false,
    "zeroFeeOrLowFee": true,
    "healthcareFriendly": false,
    "travelZeroForex": false,
    "segmentTags": [
      "Student",
      "Zero Fee"
    ],
    "lifeStage": [
      "Student Friendly",
      "Zero / Low Fee"
    ],
    "healthcareBenefits": [],
    "dataConfidence": "Verified"
  },
  {
    "id": 49,
    "image": "/images/cards/card-16.png",
    "bank": "Kotak Mahindra Bank",
    "cardName": "Kotak Privy League Signature Debit Card",
    "network": "Visa Signature",
    "annualFee": "Rs.799 + GST",
    "numAnnualFee": 799,
    "joiningFee": "Not Available",
    "international": true,
    "contactless": true,
    "loungeAccess": "Complimentary domestic lounge access",
    "forexMarkup": "Not Available",
    "cashback": "Not Available",
    "bestFor": "Privy League/premium customers",
    "rating": 4.5,
    "isPopular": true,
    "applyUrl": "https://www.kotak.com",
    "category": "Privy League Signature",
    "minBalance": 2000,
    "interestRate": 3,
    "cashbackPct": 0,
    "atmCharges": "Daily Limit: Rs.1,50,000/day",
    "benefits": "Premium debit card for Kotak Privy League relationship customers with lounge access.",
    "tags": [
      "Premium Features"
    ],
    "pros": [
      "Premium debit card for Kotak Privy League relationship customers with lounge access.",
      "Contactless tap & pay supported"
    ],
    "cons": [
      "Annual fee of Rs.799 + GST applies"
    ],
    "features": [
      "ATM Limit: Rs.1,50,000/day",
      "POS Limit: Rs.3,00,000/day",
      "Lounge Access: Complimentary domestic lounge access",
      "Contactless Support: Yes"
    ],
    "verificationStatus": "Verified",
    "maxLimit": 300000,
    "eligibility": "Kotak Mahindra Bank account holders",
    "hiddenCharges": "Standard bank SOC fees and taxes",
    "verifyNote": "",
    "officialSource": "https://www.kotak.com",
    "fuelWaiver": "Waived on eligible fuel spends",
    "internationalUsage": "Yes",
    "studentFriendly": false,
    "womenSpecial": false,
    "seniorCitizen": false,
    "zeroFeeOrLowFee": false,
    "healthcareFriendly": false,
    "travelZeroForex": false,
    "segmentTags": [],
    "lifeStage": [],
    "healthcareBenefits": [],
    "dataConfidence": "Verified"
  },
  {
    "id": 50,
    "image": "/images/cards/card-17.png",
    "bank": "Kotak Mahindra Bank",
    "cardName": "Kotak Pro Debit Card",
    "network": "RuPay/Visa",
    "annualFee": "Rs.299 + GST",
    "numAnnualFee": 299,
    "joiningFee": "Not Available",
    "international": true,
    "contactless": true,
    "loungeAccess": "Not Available",
    "forexMarkup": "Not Available",
    "cashback": "Not Available",
    "bestFor": "Business/current account holders",
    "rating": 4.1,
    "isPopular": false,
    "applyUrl": "https://www.kotak.com",
    "category": "Pro (Business)",
    "minBalance": 2000,
    "interestRate": 3,
    "cashbackPct": 0,
    "atmCharges": "Daily Limit: Rs.75,000/day",
    "benefits": "Debit card designed for Kotak current account and business banking customers.",
    "tags": [
      "Premium Features"
    ],
    "pros": [
      "Debit card designed for Kotak current account and business banking customers.",
      "Contactless tap & pay supported"
    ],
    "cons": [
      "Annual fee of Rs.299 + GST applies"
    ],
    "features": [
      "ATM Limit: Rs.75,000/day",
      "POS Limit: Rs.1,50,000/day",
      "Lounge Access: Not Available",
      "Contactless Support: Yes"
    ],
    "verificationStatus": "Verified",
    "maxLimit": 150000,
    "eligibility": "Kotak Mahindra Bank account holders",
    "hiddenCharges": "Standard bank SOC fees and taxes",
    "verifyNote": "",
    "officialSource": "https://www.kotak.com",
    "fuelWaiver": "Waived on eligible fuel spends",
    "internationalUsage": "Yes",
    "studentFriendly": false,
    "womenSpecial": false,
    "seniorCitizen": false,
    "zeroFeeOrLowFee": false,
    "healthcareFriendly": false,
    "travelZeroForex": false,
    "segmentTags": [],
    "lifeStage": [],
    "healthcareBenefits": [],
    "dataConfidence": "Verified"
  },
  {
    "id": 51,
    "image": "/images/cards/card-18.png",
    "bank": "Kotak Mahindra Bank",
    "cardName": "Kotak Platinum Debit Card",
    "network": "Visa/Mastercard",
    "annualFee": "Rs.499 + GST",
    "numAnnualFee": 499,
    "joiningFee": "Not Available",
    "international": true,
    "contactless": true,
    "loungeAccess": "Not Available",
    "forexMarkup": "Not Available",
    "cashback": "Not Available",
    "bestFor": "Everyday premium banking",
    "rating": 4.2,
    "isPopular": false,
    "applyUrl": "https://www.kotak.com",
    "category": "Platinum",
    "minBalance": 2000,
    "interestRate": 3,
    "cashbackPct": 0,
    "atmCharges": "Daily Limit: Rs.1,00,000/day",
    "benefits": "Mid-premium Kotak debit card with higher spending and withdrawal limits.",
    "tags": [
      "Premium Features"
    ],
    "pros": [
      "Mid-premium Kotak debit card with higher spending and withdrawal limits.",
      "Contactless tap & pay supported"
    ],
    "cons": [
      "Annual fee of Rs.499 + GST applies"
    ],
    "features": [
      "ATM Limit: Rs.1,00,000/day",
      "POS Limit: Rs.2,00,000/day",
      "Lounge Access: Not Available",
      "Contactless Support: Yes"
    ],
    "verificationStatus": "Verified",
    "maxLimit": 200000,
    "eligibility": "Kotak Mahindra Bank account holders",
    "hiddenCharges": "Standard bank SOC fees and taxes",
    "verifyNote": "",
    "officialSource": "https://www.kotak.com",
    "fuelWaiver": "Waived on eligible fuel spends",
    "internationalUsage": "Yes",
    "studentFriendly": false,
    "womenSpecial": false,
    "seniorCitizen": false,
    "zeroFeeOrLowFee": false,
    "healthcareFriendly": false,
    "travelZeroForex": false,
    "segmentTags": [],
    "lifeStage": [],
    "healthcareBenefits": [],
    "dataConfidence": "Verified"
  },
  {
    "id": 52,
    "image": "/images/cards/card-19.png",
    "bank": "IDFC FIRST Bank",
    "cardName": "IDFC FIRST Classic Debit Card",
    "network": "Visa/RuPay",
    "annualFee": "Free (with savings account)",
    "numAnnualFee": 0,
    "joiningFee": "Free",
    "international": true,
    "contactless": true,
    "loungeAccess": "Not Available",
    "forexMarkup": "Not Available",
    "cashback": "Not Available",
    "bestFor": "Zero-fee everyday banking, Students",
    "rating": 4.3,
    "isPopular": false,
    "applyUrl": "https://www.idfcfirstbank.com",
    "category": "Classic",
    "minBalance": 2000,
    "interestRate": 3,
    "cashbackPct": 0,
    "atmCharges": "Daily Limit: Rs.25,000/day",
    "benefits": "No-annual-fee debit card bundled with IDFC FIRST's zero-fee savings account.",
    "tags": [
      "Lowest Charges",
      "Student Friendly"
    ],
    "pros": [
      "No-annual-fee debit card bundled with IDFC FIRST's zero-fee savings account.",
      "Contactless tap & pay supported"
    ],
    "cons": [
      "Basic reward structure"
    ],
    "features": [
      "ATM Limit: Rs.25,000/day",
      "POS Limit: Rs.1,00,000/day",
      "Lounge Access: Not Available",
      "Contactless Support: Yes"
    ],
    "verificationStatus": "Verified",
    "maxLimit": 100000,
    "eligibility": "IDFC FIRST Bank account holders",
    "hiddenCharges": "Standard bank SOC fees and taxes",
    "verifyNote": "",
    "officialSource": "https://www.idfcfirstbank.com",
    "fuelWaiver": "Waived on eligible fuel spends",
    "internationalUsage": "Yes",
    "studentFriendly": true,
    "womenSpecial": false,
    "seniorCitizen": false,
    "zeroFeeOrLowFee": true,
    "healthcareFriendly": false,
    "travelZeroForex": false,
    "segmentTags": [
      "Student",
      "Zero Fee"
    ],
    "lifeStage": [
      "Student Friendly",
      "Zero / Low Fee"
    ],
    "healthcareBenefits": [],
    "dataConfidence": "Verified"
  },
  {
    "id": 53,
    "image": "/images/cards/card-20.png",
    "bank": "IDFC FIRST Bank",
    "cardName": "IDFC FIRST Select Debit Card",
    "network": "Visa Platinum",
    "annualFee": "Rs.399 + GST",
    "numAnnualFee": 399,
    "joiningFee": "Not Available",
    "international": true,
    "contactless": true,
    "loungeAccess": "Complimentary domestic lounge access",
    "forexMarkup": "Not Available",
    "cashback": "Not Available",
    "bestFor": "Mid-premium banking",
    "rating": 4.3,
    "isPopular": false,
    "applyUrl": "https://www.idfcfirstbank.com",
    "category": "Select",
    "minBalance": 2000,
    "interestRate": 3,
    "cashbackPct": 0,
    "atmCharges": "Daily Limit: Rs.75,000/day",
    "benefits": "Mid-premium debit card offering lounge access for IDFC FIRST Select account holders.",
    "tags": [
      "Premium Features"
    ],
    "pros": [
      "Mid-premium debit card offering lounge access for IDFC FIRST Select account holders.",
      "Contactless tap & pay supported"
    ],
    "cons": [
      "Annual fee of Rs.399 + GST applies"
    ],
    "features": [
      "ATM Limit: Rs.75,000/day",
      "POS Limit: Rs.2,00,000/day",
      "Lounge Access: Complimentary domestic lounge access",
      "Contactless Support: Yes"
    ],
    "verificationStatus": "Verified",
    "maxLimit": 200000,
    "eligibility": "IDFC FIRST Bank account holders",
    "hiddenCharges": "Standard bank SOC fees and taxes",
    "verifyNote": "",
    "officialSource": "https://www.idfcfirstbank.com",
    "fuelWaiver": "Waived on eligible fuel spends",
    "internationalUsage": "Yes",
    "studentFriendly": false,
    "womenSpecial": false,
    "seniorCitizen": false,
    "zeroFeeOrLowFee": false,
    "healthcareFriendly": false,
    "travelZeroForex": false,
    "segmentTags": [],
    "lifeStage": [],
    "healthcareBenefits": [],
    "dataConfidence": "Verified"
  },
  {
    "id": 54,
    "image": "/images/cards/card-21.png",
    "bank": "IDFC FIRST Bank",
    "cardName": "IDFC FIRST World Debit Card",
    "network": "Visa Signature/World",
    "annualFee": "Rs.599-999 + GST",
    "numAnnualFee": 599,
    "joiningFee": "Not Available",
    "international": true,
    "contactless": true,
    "loungeAccess": "Complimentary domestic and international lounge access",
    "forexMarkup": "Lower forex markup",
    "cashback": "Not Available",
    "bestFor": "Premium travel, Wealth customers",
    "rating": 4.5,
    "isPopular": true,
    "applyUrl": "https://www.idfcfirstbank.com",
    "category": "World",
    "minBalance": 2000,
    "interestRate": 3,
    "cashbackPct": 0,
    "atmCharges": "Daily Limit: Rs.1,50,000/day",
    "benefits": "IDFC FIRST's top-tier debit card with international lounge access for wealth banking customers.",
    "tags": [
      "Premium Features"
    ],
    "pros": [
      "IDFC FIRST's top-tier debit card with international lounge access for wealth banking customers.",
      "Contactless tap & pay supported"
    ],
    "cons": [
      "Annual fee of Rs.599-999 + GST applies"
    ],
    "features": [
      "ATM Limit: Rs.1,50,000/day",
      "POS Limit: Rs.3,00,000/day",
      "Lounge Access: Complimentary domestic and international lounge access",
      "Contactless Support: Yes"
    ],
    "verificationStatus": "Verified",
    "maxLimit": 300000,
    "eligibility": "IDFC FIRST Bank account holders",
    "hiddenCharges": "Standard bank SOC fees and taxes",
    "verifyNote": "",
    "officialSource": "https://www.idfcfirstbank.com",
    "fuelWaiver": "Waived on eligible fuel spends",
    "internationalUsage": "Yes",
    "studentFriendly": false,
    "womenSpecial": false,
    "seniorCitizen": false,
    "zeroFeeOrLowFee": false,
    "healthcareFriendly": false,
    "travelZeroForex": false,
    "segmentTags": [],
    "lifeStage": [],
    "healthcareBenefits": [],
    "dataConfidence": "Verified"
  },
  {
    "id": 55,
    "image": "/images/cards/card-22.png",
    "bank": "IndusInd Bank",
    "cardName": "IndusInd Platinum Debit Card",
    "network": "Visa/Mastercard",
    "annualFee": "Rs.499 + GST",
    "numAnnualFee": 499,
    "joiningFee": "Not Available",
    "international": true,
    "contactless": true,
    "loungeAccess": "Complimentary domestic lounge access",
    "forexMarkup": "Not Available",
    "cashback": "Not Available",
    "bestFor": "Everyday premium banking",
    "rating": 4.2,
    "isPopular": false,
    "applyUrl": "https://www.indusind.com",
    "category": "Platinum",
    "minBalance": 2000,
    "interestRate": 3,
    "cashbackPct": 0,
    "atmCharges": "Daily Limit: Rs.1,00,000/day",
    "benefits": "IndusInd's premium debit card offering lounge access and reward points.",
    "tags": [
      "Premium Features"
    ],
    "pros": [
      "IndusInd's premium debit card offering lounge access and reward points.",
      "Contactless tap & pay supported"
    ],
    "cons": [
      "Annual fee of Rs.499 + GST applies"
    ],
    "features": [
      "ATM Limit: Rs.1,00,000/day",
      "POS Limit: Rs.2,00,000/day",
      "Lounge Access: Complimentary domestic lounge access",
      "Contactless Support: Yes"
    ],
    "verificationStatus": "Verified",
    "maxLimit": 200000,
    "eligibility": "IndusInd Bank account holders",
    "hiddenCharges": "Standard bank SOC fees and taxes",
    "verifyNote": "",
    "officialSource": "https://www.indusind.com",
    "fuelWaiver": "Waived on eligible fuel spends",
    "internationalUsage": "Yes",
    "studentFriendly": false,
    "womenSpecial": false,
    "seniorCitizen": false,
    "zeroFeeOrLowFee": false,
    "healthcareFriendly": false,
    "travelZeroForex": false,
    "segmentTags": [],
    "lifeStage": [],
    "healthcareBenefits": [],
    "dataConfidence": "Verified"
  },
  {
    "id": 56,
    "image": "/images/cards/card-23.png",
    "bank": "IndusInd Bank",
    "cardName": "IndusInd Iris Debit Card",
    "network": "Visa/RuPay",
    "annualFee": "Rs.250 + GST",
    "numAnnualFee": 250,
    "joiningFee": "Not Available",
    "international": true,
    "contactless": true,
    "loungeAccess": "Not Available",
    "forexMarkup": "Not Available",
    "cashback": "Not Available",
    "bestFor": "Salary account holders",
    "rating": 4.1,
    "isPopular": false,
    "applyUrl": "https://www.indusind.com",
    "category": "Iris",
    "minBalance": 0,
    "interestRate": 3,
    "cashbackPct": 0,
    "atmCharges": "Daily Limit: Rs.50,000/day",
    "benefits": "Debit card variant offered to IndusInd salary account customers.",
    "tags": [
      "Lowest Charges"
    ],
    "pros": [
      "Debit card variant offered to IndusInd salary account customers.",
      "Contactless tap & pay supported"
    ],
    "cons": [
      "Annual fee of Rs.250 + GST applies"
    ],
    "features": [
      "ATM Limit: Rs.50,000/day",
      "POS Limit: Rs.1,00,000/day",
      "Lounge Access: Not Available",
      "Contactless Support: Yes"
    ],
    "verificationStatus": "Verified",
    "maxLimit": 100000,
    "eligibility": "IndusInd Bank account holders",
    "hiddenCharges": "Standard bank SOC fees and taxes",
    "verifyNote": "",
    "officialSource": "https://www.indusind.com",
    "fuelWaiver": "Waived on eligible fuel spends",
    "internationalUsage": "Yes",
    "studentFriendly": false,
    "womenSpecial": false,
    "seniorCitizen": false,
    "zeroFeeOrLowFee": true,
    "healthcareFriendly": false,
    "travelZeroForex": false,
    "segmentTags": [
      "Zero Fee"
    ],
    "lifeStage": [
      "Zero / Low Fee"
    ],
    "healthcareBenefits": [],
    "dataConfidence": "Verified"
  },
  {
    "id": 57,
    "image": "/images/cards/card-24.png",
    "bank": "IndusInd Bank",
    "cardName": "IndusInd EazyDiner Platinum Debit Card",
    "network": "Visa",
    "annualFee": "Rs.499 + GST",
    "numAnnualFee": 499,
    "joiningFee": "Not Available",
    "international": true,
    "contactless": true,
    "loungeAccess": "Complimentary domestic lounge access",
    "forexMarkup": "Not Available",
    "cashback": "Dining discounts via EazyDiner",
    "bestFor": "Dining benefits, Lifestyle spenders",
    "rating": 4.3,
    "isPopular": false,
    "applyUrl": "https://www.indusind.com",
    "category": "EazyDiner Platinum",
    "minBalance": 2000,
    "interestRate": 3,
    "cashbackPct": 1,
    "atmCharges": "Daily Limit: Rs.75,000/day",
    "benefits": "Co-branded debit card offering dining privileges through the EazyDiner platform.",
    "tags": [
      "Premium Features",
      "Cashback"
    ],
    "pros": [
      "Co-branded debit card offering dining privileges through the EazyDiner platform.",
      "Contactless tap & pay supported"
    ],
    "cons": [
      "Annual fee of Rs.499 + GST applies"
    ],
    "features": [
      "ATM Limit: Rs.75,000/day",
      "POS Limit: Rs.1,50,000/day",
      "Lounge Access: Complimentary domestic lounge access",
      "Contactless Support: Yes"
    ],
    "verificationStatus": "Verified",
    "maxLimit": 150000,
    "eligibility": "IndusInd Bank account holders",
    "hiddenCharges": "Standard bank SOC fees and taxes",
    "verifyNote": "",
    "officialSource": "https://www.indusind.com",
    "fuelWaiver": "Waived on eligible fuel spends",
    "internationalUsage": "Yes",
    "studentFriendly": false,
    "womenSpecial": false,
    "seniorCitizen": false,
    "zeroFeeOrLowFee": false,
    "healthcareFriendly": false,
    "travelZeroForex": false,
    "segmentTags": [],
    "lifeStage": [],
    "healthcareBenefits": [],
    "dataConfidence": "Verified"
  },
  {
    "id": 58,
    "image": "/images/cards/card-25.png",
    "bank": "Yes Bank",
    "cardName": "Yes Bank Prosperity Platinum Debit Card",
    "network": "Visa/Mastercard",
    "annualFee": "Rs.500 + GST",
    "numAnnualFee": 500,
    "joiningFee": "Not Available",
    "international": true,
    "contactless": true,
    "loungeAccess": "Complimentary domestic lounge access",
    "forexMarkup": "Not Available",
    "cashback": "Not Available",
    "bestFor": "Everyday premium banking",
    "rating": 4.1,
    "isPopular": false,
    "applyUrl": "https://www.yesbank.in",
    "category": "Prosperity Platinum",
    "minBalance": 2000,
    "interestRate": 3,
    "cashbackPct": 0,
    "atmCharges": "Daily Limit: Rs.1,00,000/day",
    "benefits": "Yes Bank's premium debit card offering lounge access and higher transaction limits.",
    "tags": [
      "Premium Features"
    ],
    "pros": [
      "Yes Bank's premium debit card offering lounge access and higher transaction limits.",
      "Contactless tap & pay supported"
    ],
    "cons": [
      "Annual fee of Rs.500 + GST applies"
    ],
    "features": [
      "ATM Limit: Rs.1,00,000/day",
      "POS Limit: Rs.2,00,000/day",
      "Lounge Access: Complimentary domestic lounge access",
      "Contactless Support: Yes"
    ],
    "verificationStatus": "Verified",
    "maxLimit": 200000,
    "eligibility": "Yes Bank account holders",
    "hiddenCharges": "Standard bank SOC fees and taxes",
    "verifyNote": "",
    "officialSource": "https://www.yesbank.in",
    "fuelWaiver": "Waived on eligible fuel spends",
    "internationalUsage": "Yes",
    "studentFriendly": false,
    "womenSpecial": false,
    "seniorCitizen": false,
    "zeroFeeOrLowFee": false,
    "healthcareFriendly": false,
    "travelZeroForex": false,
    "segmentTags": [],
    "lifeStage": [],
    "healthcareBenefits": [],
    "dataConfidence": "Verified"
  },
  {
    "id": 59,
    "image": "/images/cards/card-26.png",
    "bank": "Yes Bank",
    "cardName": "Yes Bank Elite+ Debit Card",
    "network": "Visa Signature",
    "annualFee": "Rs.750 + GST",
    "numAnnualFee": 750,
    "joiningFee": "Not Available",
    "international": true,
    "contactless": true,
    "loungeAccess": "Complimentary domestic and international lounge access",
    "forexMarkup": "Lower forex markup",
    "cashback": "Not Available",
    "bestFor": "Premium/HNI customers",
    "rating": 4.3,
    "isPopular": false,
    "applyUrl": "https://www.yesbank.in",
    "category": "Elite+",
    "minBalance": 2000,
    "interestRate": 3,
    "cashbackPct": 0,
    "atmCharges": "Daily Limit: Rs.1,50,000/day",
    "benefits": "Top-tier Yes Bank debit card with international lounge access and travel cover.",
    "tags": [
      "Premium Features"
    ],
    "pros": [
      "Top-tier Yes Bank debit card with international lounge access and travel cover.",
      "Contactless tap & pay supported"
    ],
    "cons": [
      "Annual fee of Rs.750 + GST applies"
    ],
    "features": [
      "ATM Limit: Rs.1,50,000/day",
      "POS Limit: Rs.3,00,000/day",
      "Lounge Access: Complimentary domestic and international lounge access",
      "Contactless Support: Yes"
    ],
    "verificationStatus": "Verified",
    "maxLimit": 300000,
    "eligibility": "Yes Bank account holders",
    "hiddenCharges": "Standard bank SOC fees and taxes",
    "verifyNote": "",
    "officialSource": "https://www.yesbank.in",
    "fuelWaiver": "Waived on eligible fuel spends",
    "internationalUsage": "Yes",
    "studentFriendly": false,
    "womenSpecial": false,
    "seniorCitizen": false,
    "zeroFeeOrLowFee": false,
    "healthcareFriendly": false,
    "travelZeroForex": false,
    "segmentTags": [],
    "lifeStage": [],
    "healthcareBenefits": [],
    "dataConfidence": "Verified"
  },
  {
    "id": 60,
    "image": "/images/cards/card-27.png",
    "bank": "Yes Bank",
    "cardName": "Yes Bank Pro Debit Card",
    "network": "RuPay/Visa",
    "annualFee": "Rs.299 + GST",
    "numAnnualFee": 299,
    "joiningFee": "Not Available",
    "international": true,
    "contactless": true,
    "loungeAccess": "Not Available",
    "forexMarkup": "Not Available",
    "cashback": "Not Available",
    "bestFor": "Business/current account holders",
    "rating": 3.9,
    "isPopular": false,
    "applyUrl": "https://www.yesbank.in",
    "category": "Pro (Business)",
    "minBalance": 2000,
    "interestRate": 3,
    "cashbackPct": 0,
    "atmCharges": "Daily Limit: Rs.50,000/day",
    "benefits": "Debit card designed for Yes Bank current account and business customers.",
    "tags": [
      "Premium Features"
    ],
    "pros": [
      "Debit card designed for Yes Bank current account and business customers.",
      "Contactless tap & pay supported"
    ],
    "cons": [
      "Annual fee of Rs.299 + GST applies"
    ],
    "features": [
      "ATM Limit: Rs.50,000/day",
      "POS Limit: Rs.1,00,000/day",
      "Lounge Access: Not Available",
      "Contactless Support: Yes"
    ],
    "verificationStatus": "Verified",
    "maxLimit": 100000,
    "eligibility": "Yes Bank account holders",
    "hiddenCharges": "Standard bank SOC fees and taxes",
    "verifyNote": "",
    "officialSource": "https://www.yesbank.in",
    "fuelWaiver": "Waived on eligible fuel spends",
    "internationalUsage": "Yes",
    "studentFriendly": false,
    "womenSpecial": false,
    "seniorCitizen": false,
    "zeroFeeOrLowFee": false,
    "healthcareFriendly": false,
    "travelZeroForex": false,
    "segmentTags": [],
    "lifeStage": [],
    "healthcareBenefits": [],
    "dataConfidence": "Verified"
  },
  {
    "id": 61,
    "image": "/images/cards/card-28.png",
    "bank": "Federal Bank",
    "cardName": "Federal Bank Classic Debit Card",
    "network": "RuPay/Visa",
    "annualFee": "Rs.150-250 + GST",
    "numAnnualFee": 150,
    "joiningFee": "Not Available",
    "international": true,
    "contactless": true,
    "loungeAccess": "Not Available",
    "forexMarkup": "Not Available",
    "cashback": "Not Available",
    "bestFor": "Everyday banking, Students",
    "rating": 4.1,
    "isPopular": false,
    "applyUrl": "https://www.federalbank.co.in",
    "category": "Classic",
    "minBalance": 2000,
    "interestRate": 3,
    "cashbackPct": 0,
    "atmCharges": "Daily Limit: Rs.25,000/day",
    "benefits": "Federal Bank's standard domestic debit card for everyday transactions.",
    "tags": [
      "Lowest Charges",
      "Student Friendly"
    ],
    "pros": [
      "Federal Bank's standard domestic debit card for everyday transactions.",
      "Contactless tap & pay supported"
    ],
    "cons": [
      "Annual fee of Rs.150-250 + GST applies"
    ],
    "features": [
      "ATM Limit: Rs.25,000/day",
      "POS Limit: Rs.75,000/day",
      "Lounge Access: Not Available",
      "Contactless Support: Yes"
    ],
    "verificationStatus": "Verified",
    "maxLimit": 75000,
    "eligibility": "Federal Bank account holders",
    "hiddenCharges": "Standard bank SOC fees and taxes",
    "verifyNote": "",
    "officialSource": "https://www.federalbank.co.in",
    "fuelWaiver": "Waived on eligible fuel spends",
    "internationalUsage": "Yes",
    "studentFriendly": true,
    "womenSpecial": false,
    "seniorCitizen": false,
    "zeroFeeOrLowFee": true,
    "healthcareFriendly": false,
    "travelZeroForex": false,
    "segmentTags": [
      "Student",
      "Zero Fee"
    ],
    "lifeStage": [
      "Student Friendly",
      "Zero / Low Fee"
    ],
    "healthcareBenefits": [],
    "dataConfidence": "Verified"
  },
  {
    "id": 62,
    "image": "/images/cards/card-29.png",
    "bank": "Federal Bank",
    "cardName": "Federal Bank Platinum Debit Card",
    "network": "Visa/Mastercard",
    "annualFee": "Rs.350 + GST",
    "numAnnualFee": 350,
    "joiningFee": "Not Available",
    "international": true,
    "contactless": true,
    "loungeAccess": "Not Available",
    "forexMarkup": "Not Available",
    "cashback": "Not Available",
    "bestFor": "Everyday premium banking",
    "rating": 4.1,
    "isPopular": false,
    "applyUrl": "https://www.federalbank.co.in",
    "category": "Platinum",
    "minBalance": 2000,
    "interestRate": 3,
    "cashbackPct": 0,
    "atmCharges": "Daily Limit: Rs.75,000/day",
    "benefits": "Mid-premium Federal Bank debit card with higher transaction limits.",
    "tags": [
      "Premium Features"
    ],
    "pros": [
      "Mid-premium Federal Bank debit card with higher transaction limits.",
      "Contactless tap & pay supported"
    ],
    "cons": [
      "Annual fee of Rs.350 + GST applies"
    ],
    "features": [
      "ATM Limit: Rs.75,000/day",
      "POS Limit: Rs.1,50,000/day",
      "Lounge Access: Not Available",
      "Contactless Support: Yes"
    ],
    "verificationStatus": "Verified",
    "maxLimit": 150000,
    "eligibility": "Federal Bank account holders",
    "hiddenCharges": "Standard bank SOC fees and taxes",
    "verifyNote": "",
    "officialSource": "https://www.federalbank.co.in",
    "fuelWaiver": "Waived on eligible fuel spends",
    "internationalUsage": "Yes",
    "studentFriendly": false,
    "womenSpecial": false,
    "seniorCitizen": false,
    "zeroFeeOrLowFee": false,
    "healthcareFriendly": false,
    "travelZeroForex": false,
    "segmentTags": [],
    "lifeStage": [],
    "healthcareBenefits": [],
    "dataConfidence": "Verified"
  },
  {
    "id": 63,
    "image": "/images/cards/card-30.png",
    "bank": "Federal Bank",
    "cardName": "Federal Bank Signature Debit Card",
    "network": "Visa Signature",
    "annualFee": "Rs.750 + GST",
    "numAnnualFee": 750,
    "joiningFee": "Not Available",
    "international": true,
    "contactless": true,
    "loungeAccess": "Complimentary domestic lounge access",
    "forexMarkup": "Not Available",
    "cashback": "Not Available",
    "bestFor": "Premium banking customers",
    "rating": 4.3,
    "isPopular": false,
    "applyUrl": "https://www.federalbank.co.in",
    "category": "Signature",
    "minBalance": 2000,
    "interestRate": 3,
    "cashbackPct": 0,
    "atmCharges": "Daily Limit: Rs.1,00,000/day",
    "benefits": "Federal Bank's premium debit card offering lounge access and travel benefits.",
    "tags": [
      "Premium Features"
    ],
    "pros": [
      "Federal Bank's premium debit card offering lounge access and travel benefits.",
      "Contactless tap & pay supported"
    ],
    "cons": [
      "Annual fee of Rs.750 + GST applies"
    ],
    "features": [
      "ATM Limit: Rs.1,00,000/day",
      "POS Limit: Rs.2,00,000/day",
      "Lounge Access: Complimentary domestic lounge access",
      "Contactless Support: Yes"
    ],
    "verificationStatus": "Verified",
    "maxLimit": 200000,
    "eligibility": "Federal Bank account holders",
    "hiddenCharges": "Standard bank SOC fees and taxes",
    "verifyNote": "",
    "officialSource": "https://www.federalbank.co.in",
    "fuelWaiver": "Waived on eligible fuel spends",
    "internationalUsage": "Yes",
    "studentFriendly": false,
    "womenSpecial": false,
    "seniorCitizen": false,
    "zeroFeeOrLowFee": false,
    "healthcareFriendly": false,
    "travelZeroForex": false,
    "segmentTags": [],
    "lifeStage": [],
    "healthcareBenefits": [],
    "dataConfidence": "Verified"
  },
  {
    "id": 64,
    "image": "/images/cards/card-31.png",
    "bank": "RBL Bank",
    "cardName": "RBL Bank World Debit Card",
    "network": "Visa Signature/World",
    "annualFee": "Rs.499-999 + GST",
    "numAnnualFee": 499,
    "joiningFee": "Not Available",
    "international": true,
    "contactless": true,
    "loungeAccess": "Complimentary domestic lounge access",
    "forexMarkup": "Not Available",
    "cashback": "Not Available",
    "bestFor": "Premium banking customers",
    "rating": 4.2,
    "isPopular": false,
    "applyUrl": "https://www.rblbank.com",
    "category": "World",
    "minBalance": 2000,
    "interestRate": 3,
    "cashbackPct": 0,
    "atmCharges": "Daily Limit: Rs.1,00,000/day",
    "benefits": "RBL Bank's premium debit card with lounge access and enhanced reward points.",
    "tags": [
      "Premium Features"
    ],
    "pros": [
      "RBL Bank's premium debit card with lounge access and enhanced reward points.",
      "Contactless tap & pay supported"
    ],
    "cons": [
      "Annual fee of Rs.499-999 + GST applies"
    ],
    "features": [
      "ATM Limit: Rs.1,00,000/day",
      "POS Limit: Rs.2,50,000/day",
      "Lounge Access: Complimentary domestic lounge access",
      "Contactless Support: Yes"
    ],
    "verificationStatus": "Verified",
    "maxLimit": 250000,
    "eligibility": "RBL Bank account holders",
    "hiddenCharges": "Standard bank SOC fees and taxes",
    "verifyNote": "",
    "officialSource": "https://www.rblbank.com",
    "fuelWaiver": "Waived on eligible fuel spends",
    "internationalUsage": "Yes",
    "studentFriendly": false,
    "womenSpecial": false,
    "seniorCitizen": false,
    "zeroFeeOrLowFee": false,
    "healthcareFriendly": false,
    "travelZeroForex": false,
    "segmentTags": [],
    "lifeStage": [],
    "healthcareBenefits": [],
    "dataConfidence": "Verified"
  },
  {
    "id": 65,
    "image": "/images/cards/card-32.png",
    "bank": "RBL Bank",
    "cardName": "RBL Bank Classic Debit Card",
    "network": "RuPay/Visa",
    "annualFee": "Rs.150-250 + GST",
    "numAnnualFee": 150,
    "joiningFee": "Not Available",
    "international": true,
    "contactless": true,
    "loungeAccess": "Not Available",
    "forexMarkup": "Not Available",
    "cashback": "Not Available",
    "bestFor": "Everyday banking, Students",
    "rating": 3.9,
    "isPopular": false,
    "applyUrl": "https://www.rblbank.com",
    "category": "Classic",
    "minBalance": 2000,
    "interestRate": 3,
    "cashbackPct": 0,
    "atmCharges": "Daily Limit: Rs.25,000/day",
    "benefits": "RBL Bank's entry-level domestic debit card.",
    "tags": [
      "Lowest Charges",
      "Student Friendly"
    ],
    "pros": [
      "RBL Bank's entry-level domestic debit card.",
      "Contactless tap & pay supported"
    ],
    "cons": [
      "Annual fee of Rs.150-250 + GST applies"
    ],
    "features": [
      "ATM Limit: Rs.25,000/day",
      "POS Limit: Rs.75,000/day",
      "Lounge Access: Not Available",
      "Contactless Support: Yes"
    ],
    "verificationStatus": "Verified",
    "maxLimit": 75000,
    "eligibility": "RBL Bank account holders",
    "hiddenCharges": "Standard bank SOC fees and taxes",
    "verifyNote": "",
    "officialSource": "https://www.rblbank.com",
    "fuelWaiver": "Waived on eligible fuel spends",
    "internationalUsage": "Yes",
    "studentFriendly": true,
    "womenSpecial": false,
    "seniorCitizen": false,
    "zeroFeeOrLowFee": true,
    "healthcareFriendly": false,
    "travelZeroForex": false,
    "segmentTags": [
      "Student",
      "Zero Fee"
    ],
    "lifeStage": [
      "Student Friendly",
      "Zero / Low Fee"
    ],
    "healthcareBenefits": [],
    "dataConfidence": "Verified"
  },
  {
    "id": 66,
    "image": "/images/cards/card-33.png",
    "bank": "RBL Bank",
    "cardName": "RBL Bank Platinum Debit Card",
    "network": "Visa/Mastercard",
    "annualFee": "Rs.350 + GST",
    "numAnnualFee": 350,
    "joiningFee": "Not Available",
    "international": true,
    "contactless": true,
    "loungeAccess": "Not Available",
    "forexMarkup": "Not Available",
    "cashback": "Not Available",
    "bestFor": "Everyday premium banking",
    "rating": 4,
    "isPopular": false,
    "applyUrl": "https://www.rblbank.com",
    "category": "Platinum",
    "minBalance": 2000,
    "interestRate": 3,
    "cashbackPct": 0,
    "atmCharges": "Daily Limit: Rs.75,000/day",
    "benefits": "Mid-tier RBL Bank debit card with higher spend and withdrawal limits.",
    "tags": [
      "Premium Features"
    ],
    "pros": [
      "Mid-tier RBL Bank debit card with higher spend and withdrawal limits.",
      "Contactless tap & pay supported"
    ],
    "cons": [
      "Annual fee of Rs.350 + GST applies"
    ],
    "features": [
      "ATM Limit: Rs.75,000/day",
      "POS Limit: Rs.1,50,000/day",
      "Lounge Access: Not Available",
      "Contactless Support: Yes"
    ],
    "verificationStatus": "Verified",
    "maxLimit": 150000,
    "eligibility": "RBL Bank account holders",
    "hiddenCharges": "Standard bank SOC fees and taxes",
    "verifyNote": "",
    "officialSource": "https://www.rblbank.com",
    "fuelWaiver": "Waived on eligible fuel spends",
    "internationalUsage": "Yes",
    "studentFriendly": false,
    "womenSpecial": false,
    "seniorCitizen": false,
    "zeroFeeOrLowFee": false,
    "healthcareFriendly": false,
    "travelZeroForex": false,
    "segmentTags": [],
    "lifeStage": [],
    "healthcareBenefits": [],
    "dataConfidence": "Verified"
  },
  {
    "id": 67,
    "image": "/images/cards/card-34.png",
    "bank": "South Indian Bank",
    "cardName": "SIB Global Debit Card",
    "network": "RuPay/Visa",
    "annualFee": "Rs.150-200 + GST",
    "numAnnualFee": 150,
    "joiningFee": "Not Available",
    "international": true,
    "contactless": true,
    "loungeAccess": "Not Available",
    "forexMarkup": "Not Available",
    "cashback": "Not Available",
    "bestFor": "Everyday banking, Students",
    "rating": 3.8,
    "isPopular": false,
    "applyUrl": "https://www.southindianbank.com",
    "category": "Global (Classic)",
    "minBalance": 2000,
    "interestRate": 3,
    "cashbackPct": 0,
    "atmCharges": "Daily Limit: Rs.25,000/day",
    "benefits": "South Indian Bank's standard domestic/international debit card.",
    "tags": [
      "Lowest Charges",
      "Student Friendly"
    ],
    "pros": [
      "South Indian Bank's standard domestic/international debit card.",
      "Contactless tap & pay supported"
    ],
    "cons": [
      "Annual fee of Rs.150-200 + GST applies"
    ],
    "features": [
      "ATM Limit: Rs.25,000/day",
      "POS Limit: Rs.50,000/day",
      "Lounge Access: Not Available",
      "Contactless Support: Yes"
    ],
    "verificationStatus": "Verified",
    "maxLimit": 50000,
    "eligibility": "South Indian Bank account holders",
    "hiddenCharges": "Standard bank SOC fees and taxes",
    "verifyNote": "",
    "officialSource": "https://www.southindianbank.com",
    "fuelWaiver": "Waived on eligible fuel spends",
    "internationalUsage": "Yes",
    "studentFriendly": true,
    "womenSpecial": false,
    "seniorCitizen": false,
    "zeroFeeOrLowFee": true,
    "healthcareFriendly": false,
    "travelZeroForex": false,
    "segmentTags": [
      "Student",
      "Zero Fee"
    ],
    "lifeStage": [
      "Student Friendly",
      "Zero / Low Fee"
    ],
    "healthcareBenefits": [],
    "dataConfidence": "Verified"
  },
  {
    "id": 68,
    "image": "/images/cards/card-1.png",
    "bank": "South Indian Bank",
    "cardName": "SIB Platinum Debit Card",
    "network": "Visa/Mastercard",
    "annualFee": "Rs.350 + GST",
    "numAnnualFee": 350,
    "joiningFee": "Not Available",
    "international": true,
    "contactless": true,
    "loungeAccess": "Not Available",
    "forexMarkup": "Not Available",
    "cashback": "Not Available",
    "bestFor": "Higher spend limits",
    "rating": 3.9,
    "isPopular": false,
    "applyUrl": "https://www.southindianbank.com",
    "category": "Platinum",
    "minBalance": 2000,
    "interestRate": 3,
    "cashbackPct": 0,
    "atmCharges": "Daily Limit: Rs.50,000/day",
    "benefits": "Premium debit card option from South Indian Bank with higher transaction limits.",
    "tags": [
      "Premium Features"
    ],
    "pros": [
      "Premium debit card option from South Indian Bank with higher transaction limits.",
      "Contactless tap & pay supported"
    ],
    "cons": [
      "Annual fee of Rs.350 + GST applies"
    ],
    "features": [
      "ATM Limit: Rs.50,000/day",
      "POS Limit: Rs.1,00,000/day",
      "Lounge Access: Not Available",
      "Contactless Support: Yes"
    ],
    "verificationStatus": "Verified",
    "maxLimit": 100000,
    "eligibility": "South Indian Bank account holders",
    "hiddenCharges": "Standard bank SOC fees and taxes",
    "verifyNote": "",
    "officialSource": "https://www.southindianbank.com",
    "fuelWaiver": "Waived on eligible fuel spends",
    "internationalUsage": "Yes",
    "studentFriendly": false,
    "womenSpecial": false,
    "seniorCitizen": false,
    "zeroFeeOrLowFee": false,
    "healthcareFriendly": false,
    "travelZeroForex": false,
    "segmentTags": [],
    "lifeStage": [],
    "healthcareBenefits": [],
    "dataConfidence": "Verified"
  },
  {
    "id": 69,
    "image": "/images/cards/card-2.png",
    "bank": "Karnataka Bank",
    "cardName": "KBL RuPay Classic Debit Card",
    "network": "RuPay",
    "annualFee": "Rs.150 + GST",
    "numAnnualFee": 150,
    "joiningFee": "Not Available",
    "international": false,
    "contactless": true,
    "loungeAccess": "Not Available",
    "forexMarkup": "Not Available",
    "cashback": "Not Available",
    "bestFor": "Everyday banking, Students",
    "rating": 3.7,
    "isPopular": false,
    "applyUrl": "https://karnatakabank.com",
    "category": "Classic",
    "minBalance": 2000,
    "interestRate": 3,
    "cashbackPct": 0,
    "atmCharges": "Daily Limit: Rs.20,000/day",
    "benefits": "Karnataka Bank's entry-level domestic RuPay debit card.",
    "tags": [
      "Lowest Charges",
      "Student Friendly"
    ],
    "pros": [
      "Karnataka Bank's entry-level domestic RuPay debit card.",
      "Contactless tap & pay supported"
    ],
    "cons": [
      "Annual fee of Rs.150 + GST applies"
    ],
    "features": [
      "ATM Limit: Rs.20,000/day",
      "POS Limit: Rs.40,000/day",
      "Lounge Access: Not Available",
      "Contactless Support: Yes"
    ],
    "verificationStatus": "Verified",
    "maxLimit": 40000,
    "eligibility": "Karnataka Bank account holders",
    "hiddenCharges": "Standard bank SOC fees and taxes",
    "verifyNote": "",
    "officialSource": "https://karnatakabank.com",
    "fuelWaiver": "Not Available",
    "internationalUsage": "No",
    "studentFriendly": true,
    "womenSpecial": false,
    "seniorCitizen": false,
    "zeroFeeOrLowFee": true,
    "healthcareFriendly": false,
    "travelZeroForex": false,
    "segmentTags": [
      "Student",
      "Zero Fee"
    ],
    "lifeStage": [
      "Student Friendly",
      "Zero / Low Fee"
    ],
    "healthcareBenefits": [],
    "dataConfidence": "Verified"
  },
  {
    "id": 70,
    "image": "/images/cards/card-3.png",
    "bank": "Karnataka Bank",
    "cardName": "KBL Platinum Debit Card",
    "network": "Visa/Mastercard",
    "annualFee": "Rs.300 + GST",
    "numAnnualFee": 300,
    "joiningFee": "Not Available",
    "international": true,
    "contactless": true,
    "loungeAccess": "Not Available",
    "forexMarkup": "Not Available",
    "cashback": "Not Available",
    "bestFor": "Higher spend limits",
    "rating": 3.8,
    "isPopular": false,
    "applyUrl": "https://karnatakabank.com",
    "category": "Platinum",
    "minBalance": 2000,
    "interestRate": 3,
    "cashbackPct": 0,
    "atmCharges": "Daily Limit: Rs.50,000/day",
    "benefits": "Premium debit card option from Karnataka Bank.",
    "tags": [
      "Premium Features"
    ],
    "pros": [
      "Premium debit card option from Karnataka Bank.",
      "Contactless tap & pay supported"
    ],
    "cons": [
      "Annual fee of Rs.300 + GST applies"
    ],
    "features": [
      "ATM Limit: Rs.50,000/day",
      "POS Limit: Rs.1,00,000/day",
      "Lounge Access: Not Available",
      "Contactless Support: Yes"
    ],
    "verificationStatus": "Verified",
    "maxLimit": 100000,
    "eligibility": "Karnataka Bank account holders",
    "hiddenCharges": "Standard bank SOC fees and taxes",
    "verifyNote": "",
    "officialSource": "https://karnatakabank.com",
    "fuelWaiver": "Not Available",
    "internationalUsage": "Yes",
    "studentFriendly": false,
    "womenSpecial": false,
    "seniorCitizen": false,
    "zeroFeeOrLowFee": false,
    "healthcareFriendly": false,
    "travelZeroForex": false,
    "segmentTags": [],
    "lifeStage": [],
    "healthcareBenefits": [],
    "dataConfidence": "Verified"
  },
  {
    "id": 71,
    "image": "/images/cards/card-4.png",
    "bank": "DCB Bank",
    "cardName": "DCB Bank Visa Classic Debit Card",
    "network": "Visa",
    "annualFee": "Rs.150-250 + GST",
    "numAnnualFee": 150,
    "joiningFee": "Not Available",
    "international": true,
    "contactless": true,
    "loungeAccess": "Not Available",
    "forexMarkup": "Not Available",
    "cashback": "Not Available",
    "bestFor": "Everyday banking",
    "rating": 3.8,
    "isPopular": false,
    "applyUrl": "https://www.dcbbank.com",
    "category": "Classic",
    "minBalance": 2000,
    "interestRate": 3,
    "cashbackPct": 0,
    "atmCharges": "Daily Limit: Rs.25,000/day",
    "benefits": "DCB Bank's standard domestic/international debit card.",
    "tags": [
      "Lowest Charges",
      "Student Friendly"
    ],
    "pros": [
      "DCB Bank's standard domestic/international debit card.",
      "Contactless tap & pay supported"
    ],
    "cons": [
      "Annual fee of Rs.150-250 + GST applies"
    ],
    "features": [
      "ATM Limit: Rs.25,000/day",
      "POS Limit: Rs.75,000/day",
      "Lounge Access: Not Available",
      "Contactless Support: Yes"
    ],
    "verificationStatus": "Verified",
    "maxLimit": 75000,
    "eligibility": "DCB Bank account holders",
    "hiddenCharges": "Standard bank SOC fees and taxes",
    "verifyNote": "",
    "officialSource": "https://www.dcbbank.com",
    "fuelWaiver": "Waived on eligible fuel spends",
    "internationalUsage": "Yes",
    "studentFriendly": true,
    "womenSpecial": false,
    "seniorCitizen": false,
    "zeroFeeOrLowFee": true,
    "healthcareFriendly": false,
    "travelZeroForex": false,
    "segmentTags": [
      "Student",
      "Zero Fee"
    ],
    "lifeStage": [
      "Student Friendly",
      "Zero / Low Fee"
    ],
    "healthcareBenefits": [],
    "dataConfidence": "Verified"
  },
  {
    "id": 72,
    "image": "/images/cards/card-5.png",
    "bank": "DCB Bank",
    "cardName": "DCB Bank Platinum Debit Card",
    "network": "Visa/Mastercard",
    "annualFee": "Rs.350 + GST",
    "numAnnualFee": 350,
    "joiningFee": "Not Available",
    "international": true,
    "contactless": true,
    "loungeAccess": "Not Available",
    "forexMarkup": "Not Available",
    "cashback": "Not Available",
    "bestFor": "Higher spend limits",
    "rating": 3.9,
    "isPopular": false,
    "applyUrl": "https://www.dcbbank.com",
    "category": "Platinum",
    "minBalance": 2000,
    "interestRate": 3,
    "cashbackPct": 0,
    "atmCharges": "Daily Limit: Rs.50,000/day",
    "benefits": "Premium debit card option from DCB Bank with higher limits.",
    "tags": [
      "Premium Features"
    ],
    "pros": [
      "Premium debit card option from DCB Bank with higher limits.",
      "Contactless tap & pay supported"
    ],
    "cons": [
      "Annual fee of Rs.350 + GST applies"
    ],
    "features": [
      "ATM Limit: Rs.50,000/day",
      "POS Limit: Rs.1,00,000/day",
      "Lounge Access: Not Available",
      "Contactless Support: Yes"
    ],
    "verificationStatus": "Verified",
    "maxLimit": 100000,
    "eligibility": "DCB Bank account holders",
    "hiddenCharges": "Standard bank SOC fees and taxes",
    "verifyNote": "",
    "officialSource": "https://www.dcbbank.com",
    "fuelWaiver": "Waived on eligible fuel spends",
    "internationalUsage": "Yes",
    "studentFriendly": false,
    "womenSpecial": false,
    "seniorCitizen": false,
    "zeroFeeOrLowFee": false,
    "healthcareFriendly": false,
    "travelZeroForex": false,
    "segmentTags": [],
    "lifeStage": [],
    "healthcareBenefits": [],
    "dataConfidence": "Verified"
  },
  {
    "id": 73,
    "image": "/images/cards/card-6.png",
    "bank": "City Union Bank",
    "cardName": "City Union Bank RuPay Classic Debit Card",
    "network": "RuPay",
    "annualFee": "Rs.150 + GST",
    "numAnnualFee": 150,
    "joiningFee": "Not Available",
    "international": false,
    "contactless": true,
    "loungeAccess": "Not Available",
    "forexMarkup": "Not Available",
    "cashback": "Not Available",
    "bestFor": "Everyday banking, Students",
    "rating": 3.7,
    "isPopular": false,
    "applyUrl": "https://www.cityunionbank.com",
    "category": "Classic",
    "minBalance": 2000,
    "interestRate": 3,
    "cashbackPct": 0,
    "atmCharges": "Daily Limit: Rs.20,000/day",
    "benefits": "City Union Bank's entry-level domestic debit card.",
    "tags": [
      "Lowest Charges",
      "Student Friendly"
    ],
    "pros": [
      "City Union Bank's entry-level domestic debit card.",
      "Contactless tap & pay supported"
    ],
    "cons": [
      "Annual fee of Rs.150 + GST applies"
    ],
    "features": [
      "ATM Limit: Rs.20,000/day",
      "POS Limit: Rs.40,000/day",
      "Lounge Access: Not Available",
      "Contactless Support: Yes"
    ],
    "verificationStatus": "Verified",
    "maxLimit": 40000,
    "eligibility": "City Union Bank account holders",
    "hiddenCharges": "Standard bank SOC fees and taxes",
    "verifyNote": "",
    "officialSource": "https://www.cityunionbank.com",
    "fuelWaiver": "Not Available",
    "internationalUsage": "No",
    "studentFriendly": true,
    "womenSpecial": false,
    "seniorCitizen": false,
    "zeroFeeOrLowFee": true,
    "healthcareFriendly": false,
    "travelZeroForex": false,
    "segmentTags": [
      "Student",
      "Zero Fee"
    ],
    "lifeStage": [
      "Student Friendly",
      "Zero / Low Fee"
    ],
    "healthcareBenefits": [],
    "dataConfidence": "Verified"
  },
  {
    "id": 74,
    "image": "/images/cards/card-7.png",
    "bank": "City Union Bank",
    "cardName": "City Union Bank Platinum Debit Card",
    "network": "Visa/Mastercard",
    "annualFee": "Rs.300 + GST",
    "numAnnualFee": 300,
    "joiningFee": "Not Available",
    "international": true,
    "contactless": true,
    "loungeAccess": "Not Available",
    "forexMarkup": "Not Available",
    "cashback": "Not Available",
    "bestFor": "Higher spend limits",
    "rating": 3.8,
    "isPopular": false,
    "applyUrl": "https://www.cityunionbank.com",
    "category": "Platinum",
    "minBalance": 2000,
    "interestRate": 3,
    "cashbackPct": 0,
    "atmCharges": "Daily Limit: Rs.50,000/day",
    "benefits": "Premium debit card option from City Union Bank.",
    "tags": [
      "Premium Features"
    ],
    "pros": [
      "Premium debit card option from City Union Bank.",
      "Contactless tap & pay supported"
    ],
    "cons": [
      "Annual fee of Rs.300 + GST applies"
    ],
    "features": [
      "ATM Limit: Rs.50,000/day",
      "POS Limit: Rs.1,00,000/day",
      "Lounge Access: Not Available",
      "Contactless Support: Yes"
    ],
    "verificationStatus": "Verified",
    "maxLimit": 100000,
    "eligibility": "City Union Bank account holders",
    "hiddenCharges": "Standard bank SOC fees and taxes",
    "verifyNote": "",
    "officialSource": "https://www.cityunionbank.com",
    "fuelWaiver": "Not Available",
    "internationalUsage": "Yes",
    "studentFriendly": false,
    "womenSpecial": false,
    "seniorCitizen": false,
    "zeroFeeOrLowFee": false,
    "healthcareFriendly": false,
    "travelZeroForex": false,
    "segmentTags": [],
    "lifeStage": [],
    "healthcareBenefits": [],
    "dataConfidence": "Verified"
  },
  {
    "id": 75,
    "image": "/images/cards/card-8.png",
    "bank": "AU Small Finance Bank",
    "cardName": "AU Bank RuPay Select Debit Card",
    "network": "RuPay",
    "annualFee": "Rs.199 + GST",
    "numAnnualFee": 199,
    "joiningFee": "Not Available",
    "international": true,
    "contactless": true,
    "loungeAccess": "Not Available",
    "forexMarkup": "Not Available",
    "cashback": "Cashback on select categories",
    "bestFor": "Everyday banking, Students",
    "rating": 4.1,
    "isPopular": false,
    "applyUrl": "https://www.aubank.in",
    "category": "Select",
    "minBalance": 2000,
    "interestRate": 3,
    "cashbackPct": 1,
    "atmCharges": "Daily Limit: Rs.50,000/day",
    "benefits": "AU Small Finance Bank's popular entry-tier debit card with cashback on select categories.",
    "tags": [
      "Lowest Charges",
      "Student Friendly",
      "Cashback"
    ],
    "pros": [
      "AU Small Finance Bank's popular entry-tier debit card with cashback on select categories.",
      "Contactless tap & pay supported"
    ],
    "cons": [
      "Annual fee of Rs.199 + GST applies"
    ],
    "features": [
      "ATM Limit: Rs.50,000/day",
      "POS Limit: Rs.1,00,000/day",
      "Lounge Access: Not Available",
      "Contactless Support: Yes"
    ],
    "verificationStatus": "Verified",
    "maxLimit": 100000,
    "eligibility": "AU Small Finance Bank account holders",
    "hiddenCharges": "Standard bank SOC fees and taxes",
    "verifyNote": "",
    "officialSource": "https://www.aubank.in",
    "fuelWaiver": "Waived on eligible fuel spends",
    "internationalUsage": "Yes",
    "studentFriendly": true,
    "womenSpecial": false,
    "seniorCitizen": false,
    "zeroFeeOrLowFee": true,
    "healthcareFriendly": false,
    "travelZeroForex": false,
    "segmentTags": [
      "Student",
      "Zero Fee"
    ],
    "lifeStage": [
      "Student Friendly",
      "Zero / Low Fee"
    ],
    "healthcareBenefits": [],
    "dataConfidence": "Verified"
  },
  {
    "id": 76,
    "image": "/images/cards/card-9.png",
    "bank": "AU Small Finance Bank",
    "cardName": "AU Bank Platinum Debit Card",
    "network": "Visa/Mastercard",
    "annualFee": "Rs.399 + GST",
    "numAnnualFee": 399,
    "joiningFee": "Not Available",
    "international": true,
    "contactless": true,
    "loungeAccess": "Not Available",
    "forexMarkup": "Not Available",
    "cashback": "Cashback on select categories",
    "bestFor": "Everyday premium banking",
    "rating": 4.2,
    "isPopular": false,
    "applyUrl": "https://www.aubank.in",
    "category": "Platinum",
    "minBalance": 2000,
    "interestRate": 3,
    "cashbackPct": 1,
    "atmCharges": "Daily Limit: Rs.1,00,000/day",
    "benefits": "Mid-premium AU Bank debit card with higher transaction limits and cashback.",
    "tags": [
      "Premium Features",
      "Cashback"
    ],
    "pros": [
      "Mid-premium AU Bank debit card with higher transaction limits and cashback.",
      "Contactless tap & pay supported"
    ],
    "cons": [
      "Annual fee of Rs.399 + GST applies"
    ],
    "features": [
      "ATM Limit: Rs.1,00,000/day",
      "POS Limit: Rs.2,00,000/day",
      "Lounge Access: Not Available",
      "Contactless Support: Yes"
    ],
    "verificationStatus": "Verified",
    "maxLimit": 200000,
    "eligibility": "AU Small Finance Bank account holders",
    "hiddenCharges": "Standard bank SOC fees and taxes",
    "verifyNote": "",
    "officialSource": "https://www.aubank.in",
    "fuelWaiver": "Waived on eligible fuel spends",
    "internationalUsage": "Yes",
    "studentFriendly": false,
    "womenSpecial": false,
    "seniorCitizen": false,
    "zeroFeeOrLowFee": false,
    "healthcareFriendly": false,
    "travelZeroForex": false,
    "segmentTags": [],
    "lifeStage": [],
    "healthcareBenefits": [],
    "dataConfidence": "Verified"
  },
  {
    "id": 77,
    "image": "/images/cards/card-10.png",
    "bank": "AU Small Finance Bank",
    "cardName": "AU Bank Zenith Debit Card",
    "network": "Visa Signature",
    "annualFee": "Rs.999 + GST",
    "numAnnualFee": 999,
    "joiningFee": "Not Available",
    "international": true,
    "contactless": true,
    "loungeAccess": "Complimentary domestic lounge access",
    "forexMarkup": "Not Available",
    "cashback": "Not Available",
    "bestFor": "Premium/HNI customers",
    "rating": 4.4,
    "isPopular": false,
    "applyUrl": "https://www.aubank.in",
    "category": "Zenith",
    "minBalance": 2000,
    "interestRate": 3,
    "cashbackPct": 0,
    "atmCharges": "Daily Limit: Rs.1,50,000/day",
    "benefits": "AU Bank's top-tier debit card offering lounge access for premium relationship customers.",
    "tags": [
      "Premium Features"
    ],
    "pros": [
      "AU Bank's top-tier debit card offering lounge access for premium relationship customers.",
      "Contactless tap & pay supported"
    ],
    "cons": [
      "Annual fee of Rs.999 + GST applies"
    ],
    "features": [
      "ATM Limit: Rs.1,50,000/day",
      "POS Limit: Rs.3,00,000/day",
      "Lounge Access: Complimentary domestic lounge access",
      "Contactless Support: Yes"
    ],
    "verificationStatus": "Verified",
    "maxLimit": 300000,
    "eligibility": "AU Small Finance Bank account holders",
    "hiddenCharges": "Standard bank SOC fees and taxes",
    "verifyNote": "",
    "officialSource": "https://www.aubank.in",
    "fuelWaiver": "Waived on eligible fuel spends",
    "internationalUsage": "Yes",
    "studentFriendly": false,
    "womenSpecial": false,
    "seniorCitizen": false,
    "zeroFeeOrLowFee": false,
    "healthcareFriendly": false,
    "travelZeroForex": false,
    "segmentTags": [],
    "lifeStage": [],
    "healthcareBenefits": [],
    "dataConfidence": "Verified"
  },
  {
    "id": 78,
    "image": "/images/cards/card-11.png",
    "bank": "Equitas Small Finance Bank",
    "cardName": "Equitas RuPay Platinum Debit Card",
    "network": "RuPay",
    "annualFee": "Rs.199 + GST",
    "numAnnualFee": 199,
    "joiningFee": "Not Available",
    "international": true,
    "contactless": true,
    "loungeAccess": "Not Available",
    "forexMarkup": "Not Available",
    "cashback": "Not Available",
    "bestFor": "Everyday banking, Students",
    "rating": 3.9,
    "isPopular": false,
    "applyUrl": "https://www.equitasbank.com",
    "category": "Platinum",
    "minBalance": 2000,
    "interestRate": 3,
    "cashbackPct": 0,
    "atmCharges": "Daily Limit: Rs.50,000/day",
    "benefits": "Equitas SFB's standard RuPay debit card for everyday banking.",
    "tags": [
      "Lowest Charges",
      "Student Friendly"
    ],
    "pros": [
      "Equitas SFB's standard RuPay debit card for everyday banking.",
      "Contactless tap & pay supported"
    ],
    "cons": [
      "Annual fee of Rs.199 + GST applies"
    ],
    "features": [
      "ATM Limit: Rs.50,000/day",
      "POS Limit: Rs.1,00,000/day",
      "Lounge Access: Not Available",
      "Contactless Support: Yes"
    ],
    "verificationStatus": "Verified",
    "maxLimit": 100000,
    "eligibility": "Equitas Small Finance Bank account holders",
    "hiddenCharges": "Standard bank SOC fees and taxes",
    "verifyNote": "",
    "officialSource": "https://www.equitasbank.com",
    "fuelWaiver": "Waived on eligible fuel spends",
    "internationalUsage": "Yes",
    "studentFriendly": true,
    "womenSpecial": false,
    "seniorCitizen": false,
    "zeroFeeOrLowFee": true,
    "healthcareFriendly": false,
    "travelZeroForex": false,
    "segmentTags": [
      "Student",
      "Zero Fee"
    ],
    "lifeStage": [
      "Student Friendly",
      "Zero / Low Fee"
    ],
    "healthcareBenefits": [],
    "dataConfidence": "Verified"
  },
  {
    "id": 79,
    "image": "/images/cards/card-12.png",
    "bank": "Equitas Small Finance Bank",
    "cardName": "Equitas Visa Classic Debit Card",
    "network": "Visa",
    "annualFee": "Rs.150 + GST",
    "numAnnualFee": 150,
    "joiningFee": "Not Available",
    "international": true,
    "contactless": true,
    "loungeAccess": "Not Available",
    "forexMarkup": "Not Available",
    "cashback": "Not Available",
    "bestFor": "International acceptance",
    "rating": 3.8,
    "isPopular": false,
    "applyUrl": "https://www.equitasbank.com",
    "category": "Classic",
    "minBalance": 2000,
    "interestRate": 3,
    "cashbackPct": 0,
    "atmCharges": "Daily Limit: Rs.25,000/day",
    "benefits": "Visa-network card from Equitas Small Finance Bank.",
    "tags": [
      "Lowest Charges"
    ],
    "pros": [
      "Visa-network card from Equitas Small Finance Bank.",
      "Contactless tap & pay supported"
    ],
    "cons": [
      "Annual fee of Rs.150 + GST applies"
    ],
    "features": [
      "ATM Limit: Rs.25,000/day",
      "POS Limit: Rs.75,000/day",
      "Lounge Access: Not Available",
      "Contactless Support: Yes"
    ],
    "verificationStatus": "Verified",
    "maxLimit": 75000,
    "eligibility": "Equitas Small Finance Bank account holders",
    "hiddenCharges": "Standard bank SOC fees and taxes",
    "verifyNote": "",
    "officialSource": "https://www.equitasbank.com",
    "fuelWaiver": "Not Available",
    "internationalUsage": "Yes",
    "studentFriendly": false,
    "womenSpecial": false,
    "seniorCitizen": false,
    "zeroFeeOrLowFee": true,
    "healthcareFriendly": false,
    "travelZeroForex": false,
    "segmentTags": [
      "Zero Fee"
    ],
    "lifeStage": [
      "Zero / Low Fee"
    ],
    "healthcareBenefits": [],
    "dataConfidence": "Verified"
  },
  {
    "id": 80,
    "image": "/images/cards/card-13.png",
    "bank": "Ujjivan Small Finance Bank",
    "cardName": "Ujjivan RuPay Classic Debit Card",
    "network": "RuPay",
    "annualFee": "Rs.150 + GST",
    "numAnnualFee": 150,
    "joiningFee": "Not Available",
    "international": false,
    "contactless": true,
    "loungeAccess": "Not Available",
    "forexMarkup": "Not Available",
    "cashback": "Not Available",
    "bestFor": "Everyday banking, Students",
    "rating": 3.8,
    "isPopular": false,
    "applyUrl": "https://www.ujjivansfb.in",
    "category": "Classic",
    "minBalance": 2000,
    "interestRate": 3,
    "cashbackPct": 0,
    "atmCharges": "Daily Limit: Rs.20,000/day",
    "benefits": "Ujjivan Small Finance Bank's standard domestic debit card.",
    "tags": [
      "Lowest Charges",
      "Student Friendly"
    ],
    "pros": [
      "Ujjivan Small Finance Bank's standard domestic debit card.",
      "Contactless tap & pay supported"
    ],
    "cons": [
      "Annual fee of Rs.150 + GST applies"
    ],
    "features": [
      "ATM Limit: Rs.20,000/day",
      "POS Limit: Rs.40,000/day",
      "Lounge Access: Not Available",
      "Contactless Support: Yes"
    ],
    "verificationStatus": "Verified",
    "maxLimit": 40000,
    "eligibility": "Ujjivan Small Finance Bank account holders",
    "hiddenCharges": "Standard bank SOC fees and taxes",
    "verifyNote": "",
    "officialSource": "https://www.ujjivansfb.in",
    "fuelWaiver": "Not Available",
    "internationalUsage": "No",
    "studentFriendly": true,
    "womenSpecial": false,
    "seniorCitizen": false,
    "zeroFeeOrLowFee": true,
    "healthcareFriendly": false,
    "travelZeroForex": false,
    "segmentTags": [
      "Student",
      "Zero Fee"
    ],
    "lifeStage": [
      "Student Friendly",
      "Zero / Low Fee"
    ],
    "healthcareBenefits": [],
    "dataConfidence": "Verified"
  },
  {
    "id": 81,
    "image": "/images/cards/card-14.png",
    "bank": "Ujjivan Small Finance Bank",
    "cardName": "Ujjivan RuPay Platinum Debit Card",
    "network": "RuPay",
    "annualFee": "Rs.250 + GST",
    "numAnnualFee": 250,
    "joiningFee": "Not Available",
    "international": true,
    "contactless": true,
    "loungeAccess": "Not Available",
    "forexMarkup": "Not Available",
    "cashback": "Not Available",
    "bestFor": "Higher spend limits",
    "rating": 3.9,
    "isPopular": false,
    "applyUrl": "https://www.ujjivansfb.in",
    "category": "Platinum",
    "minBalance": 2000,
    "interestRate": 3,
    "cashbackPct": 0,
    "atmCharges": "Daily Limit: Rs.40,000/day",
    "benefits": "Premium RuPay debit card option from Ujjivan Small Finance Bank.",
    "tags": [
      "Lowest Charges"
    ],
    "pros": [
      "Premium RuPay debit card option from Ujjivan Small Finance Bank.",
      "Contactless tap & pay supported"
    ],
    "cons": [
      "Annual fee of Rs.250 + GST applies"
    ],
    "features": [
      "ATM Limit: Rs.40,000/day",
      "POS Limit: Rs.75,000/day",
      "Lounge Access: Not Available",
      "Contactless Support: Yes"
    ],
    "verificationStatus": "Verified",
    "maxLimit": 75000,
    "eligibility": "Ujjivan Small Finance Bank account holders",
    "hiddenCharges": "Standard bank SOC fees and taxes",
    "verifyNote": "",
    "officialSource": "https://www.ujjivansfb.in",
    "fuelWaiver": "Not Available",
    "internationalUsage": "Yes",
    "studentFriendly": false,
    "womenSpecial": false,
    "seniorCitizen": false,
    "zeroFeeOrLowFee": true,
    "healthcareFriendly": false,
    "travelZeroForex": false,
    "segmentTags": [
      "Zero Fee"
    ],
    "lifeStage": [
      "Zero / Low Fee"
    ],
    "healthcareBenefits": [],
    "dataConfidence": "Verified"
  },
  {
    "id": 82,
    "image": "/images/cards/card-15.png",
    "bank": "Jana Small Finance Bank",
    "cardName": "Jana Bank RuPay Debit Card",
    "network": "RuPay",
    "annualFee": "Rs.150 + GST",
    "numAnnualFee": 150,
    "joiningFee": "Not Available",
    "international": false,
    "contactless": true,
    "loungeAccess": "Not Available",
    "forexMarkup": "Not Available",
    "cashback": "Not Available",
    "bestFor": "Everyday banking, Students",
    "rating": 3.7,
    "isPopular": false,
    "applyUrl": "https://www.janabank.com",
    "category": "Classic",
    "minBalance": 2000,
    "interestRate": 3,
    "cashbackPct": 0,
    "atmCharges": "Daily Limit: Rs.20,000/day",
    "benefits": "Jana Small Finance Bank's standard domestic RuPay debit card.",
    "tags": [
      "Lowest Charges",
      "Student Friendly"
    ],
    "pros": [
      "Jana Small Finance Bank's standard domestic RuPay debit card.",
      "Contactless tap & pay supported"
    ],
    "cons": [
      "Annual fee of Rs.150 + GST applies"
    ],
    "features": [
      "ATM Limit: Rs.20,000/day",
      "POS Limit: Rs.40,000/day",
      "Lounge Access: Not Available",
      "Contactless Support: Yes"
    ],
    "verificationStatus": "Verified",
    "maxLimit": 40000,
    "eligibility": "Jana Small Finance Bank account holders",
    "hiddenCharges": "Standard bank SOC fees and taxes",
    "verifyNote": "",
    "officialSource": "https://www.janabank.com",
    "fuelWaiver": "Not Available",
    "internationalUsage": "No",
    "studentFriendly": true,
    "womenSpecial": false,
    "seniorCitizen": false,
    "zeroFeeOrLowFee": true,
    "healthcareFriendly": false,
    "travelZeroForex": false,
    "segmentTags": [
      "Student",
      "Zero Fee"
    ],
    "lifeStage": [
      "Student Friendly",
      "Zero / Low Fee"
    ],
    "healthcareBenefits": [],
    "dataConfidence": "Verified"
  },
  {
    "id": 83,
    "image": "/images/cards/card-16.png",
    "bank": "Jana Small Finance Bank",
    "cardName": "Jana Bank Platinum Debit Card",
    "network": "RuPay/Visa",
    "annualFee": "Rs.250 + GST",
    "numAnnualFee": 250,
    "joiningFee": "Not Available",
    "international": true,
    "contactless": true,
    "loungeAccess": "Not Available",
    "forexMarkup": "Not Available",
    "cashback": "Not Available",
    "bestFor": "Higher spend limits",
    "rating": 3.7,
    "isPopular": false,
    "applyUrl": "https://www.janabank.com",
    "category": "Platinum",
    "minBalance": 2000,
    "interestRate": 3,
    "cashbackPct": 0,
    "atmCharges": "Daily Limit: Rs.40,000/day",
    "benefits": "Premium debit card option from Jana Small Finance Bank.",
    "tags": [
      "Lowest Charges"
    ],
    "pros": [
      "Premium debit card option from Jana Small Finance Bank.",
      "Contactless tap & pay supported"
    ],
    "cons": [
      "Annual fee of Rs.250 + GST applies"
    ],
    "features": [
      "ATM Limit: Rs.40,000/day",
      "POS Limit: Rs.75,000/day",
      "Lounge Access: Not Available",
      "Contactless Support: Yes"
    ],
    "verificationStatus": "Verified",
    "maxLimit": 75000,
    "eligibility": "Jana Small Finance Bank account holders",
    "hiddenCharges": "Standard bank SOC fees and taxes",
    "verifyNote": "",
    "officialSource": "https://www.janabank.com",
    "fuelWaiver": "Not Available",
    "internationalUsage": "Yes",
    "studentFriendly": false,
    "womenSpecial": false,
    "seniorCitizen": false,
    "zeroFeeOrLowFee": true,
    "healthcareFriendly": false,
    "travelZeroForex": false,
    "segmentTags": [
      "Zero Fee"
    ],
    "lifeStage": [
      "Zero / Low Fee"
    ],
    "healthcareBenefits": [],
    "dataConfidence": "Verified"
  },
  {
    "id": 84,
    "image": "/images/cards/card-17.png",
    "bank": "ESAF Small Finance Bank",
    "cardName": "ESAF RuPay Classic Debit Card",
    "network": "RuPay",
    "annualFee": "Rs.150 + GST",
    "numAnnualFee": 150,
    "joiningFee": "Not Available",
    "international": false,
    "contactless": true,
    "loungeAccess": "Not Available",
    "forexMarkup": "Not Available",
    "cashback": "Not Available",
    "bestFor": "Everyday banking, Students",
    "rating": 3.6,
    "isPopular": false,
    "applyUrl": "https://www.esafbank.com",
    "category": "Classic",
    "minBalance": 2000,
    "interestRate": 3,
    "cashbackPct": 0,
    "atmCharges": "Daily Limit: Rs.20,000/day",
    "benefits": "ESAF Small Finance Bank's standard domestic debit card.",
    "tags": [
      "Lowest Charges",
      "Student Friendly"
    ],
    "pros": [
      "ESAF Small Finance Bank's standard domestic debit card.",
      "Contactless tap & pay supported"
    ],
    "cons": [
      "Annual fee of Rs.150 + GST applies"
    ],
    "features": [
      "ATM Limit: Rs.20,000/day",
      "POS Limit: Rs.40,000/day",
      "Lounge Access: Not Available",
      "Contactless Support: Yes"
    ],
    "verificationStatus": "Verified",
    "maxLimit": 40000,
    "eligibility": "ESAF Small Finance Bank account holders",
    "hiddenCharges": "Standard bank SOC fees and taxes",
    "verifyNote": "",
    "officialSource": "https://www.esafbank.com",
    "fuelWaiver": "Not Available",
    "internationalUsage": "No",
    "studentFriendly": true,
    "womenSpecial": false,
    "seniorCitizen": false,
    "zeroFeeOrLowFee": true,
    "healthcareFriendly": false,
    "travelZeroForex": false,
    "segmentTags": [
      "Student",
      "Zero Fee"
    ],
    "lifeStage": [
      "Student Friendly",
      "Zero / Low Fee"
    ],
    "healthcareBenefits": [],
    "dataConfidence": "Verified"
  },
  {
    "id": 85,
    "image": "/images/cards/card-18.png",
    "bank": "ESAF Small Finance Bank",
    "cardName": "ESAF RuPay Platinum Debit Card",
    "network": "RuPay",
    "annualFee": "Rs.250 + GST",
    "numAnnualFee": 250,
    "joiningFee": "Not Available",
    "international": true,
    "contactless": true,
    "loungeAccess": "Not Available",
    "forexMarkup": "Not Available",
    "cashback": "Not Available",
    "bestFor": "Higher spend limits",
    "rating": 3.6,
    "isPopular": false,
    "applyUrl": "https://www.esafbank.com",
    "category": "Platinum",
    "minBalance": 2000,
    "interestRate": 3,
    "cashbackPct": 0,
    "atmCharges": "Daily Limit: Rs.40,000/day",
    "benefits": "Premium RuPay debit card from ESAF Small Finance Bank.",
    "tags": [
      "Lowest Charges"
    ],
    "pros": [
      "Premium RuPay debit card from ESAF Small Finance Bank.",
      "Contactless tap & pay supported"
    ],
    "cons": [
      "Annual fee of Rs.250 + GST applies"
    ],
    "features": [
      "ATM Limit: Rs.40,000/day",
      "POS Limit: Rs.75,000/day",
      "Lounge Access: Not Available",
      "Contactless Support: Yes"
    ],
    "verificationStatus": "Verified",
    "maxLimit": 75000,
    "eligibility": "ESAF Small Finance Bank account holders",
    "hiddenCharges": "Standard bank SOC fees and taxes",
    "verifyNote": "",
    "officialSource": "https://www.esafbank.com",
    "fuelWaiver": "Not Available",
    "internationalUsage": "Yes",
    "studentFriendly": false,
    "womenSpecial": false,
    "seniorCitizen": false,
    "zeroFeeOrLowFee": true,
    "healthcareFriendly": false,
    "travelZeroForex": false,
    "segmentTags": [
      "Zero Fee"
    ],
    "lifeStage": [
      "Zero / Low Fee"
    ],
    "healthcareBenefits": [],
    "dataConfidence": "Verified"
  },
  {
    "id": 86,
    "image": "/images/cards/card-19.png",
    "bank": "Suryoday Small Finance Bank",
    "cardName": "Suryoday RuPay Classic Debit Card",
    "network": "RuPay",
    "annualFee": "Rs.150 + GST",
    "numAnnualFee": 150,
    "joiningFee": "Not Available",
    "international": false,
    "contactless": true,
    "loungeAccess": "Not Available",
    "forexMarkup": "Not Available",
    "cashback": "Not Available",
    "bestFor": "Everyday banking, Students",
    "rating": 3.6,
    "isPopular": false,
    "applyUrl": "https://www.suryodaybank.com",
    "category": "Classic",
    "minBalance": 2000,
    "interestRate": 3,
    "cashbackPct": 0,
    "atmCharges": "Daily Limit: Rs.20,000/day",
    "benefits": "Suryoday Small Finance Bank's standard domestic debit card.",
    "tags": [
      "Lowest Charges",
      "Student Friendly"
    ],
    "pros": [
      "Suryoday Small Finance Bank's standard domestic debit card.",
      "Contactless tap & pay supported"
    ],
    "cons": [
      "Annual fee of Rs.150 + GST applies"
    ],
    "features": [
      "ATM Limit: Rs.20,000/day",
      "POS Limit: Rs.40,000/day",
      "Lounge Access: Not Available",
      "Contactless Support: Yes"
    ],
    "verificationStatus": "Verified",
    "maxLimit": 40000,
    "eligibility": "Suryoday Small Finance Bank account holders",
    "hiddenCharges": "Standard bank SOC fees and taxes",
    "verifyNote": "",
    "officialSource": "https://www.suryodaybank.com",
    "fuelWaiver": "Not Available",
    "internationalUsage": "No",
    "studentFriendly": true,
    "womenSpecial": false,
    "seniorCitizen": false,
    "zeroFeeOrLowFee": true,
    "healthcareFriendly": false,
    "travelZeroForex": false,
    "segmentTags": [
      "Student",
      "Zero Fee"
    ],
    "lifeStage": [
      "Student Friendly",
      "Zero / Low Fee"
    ],
    "healthcareBenefits": [],
    "dataConfidence": "Verified"
  },
  {
    "id": 87,
    "image": "/images/cards/card-20.png",
    "bank": "Suryoday Small Finance Bank",
    "cardName": "Suryoday RuPay Platinum Debit Card",
    "network": "RuPay",
    "annualFee": "Rs.250 + GST",
    "numAnnualFee": 250,
    "joiningFee": "Not Available",
    "international": true,
    "contactless": true,
    "loungeAccess": "Not Available",
    "forexMarkup": "Not Available",
    "cashback": "Not Available",
    "bestFor": "Higher spend limits",
    "rating": 3.6,
    "isPopular": false,
    "applyUrl": "https://www.suryodaybank.com",
    "category": "Platinum",
    "minBalance": 2000,
    "interestRate": 3,
    "cashbackPct": 0,
    "atmCharges": "Daily Limit: Rs.40,000/day",
    "benefits": "Premium debit card option from Suryoday Small Finance Bank.",
    "tags": [
      "Lowest Charges"
    ],
    "pros": [
      "Premium debit card option from Suryoday Small Finance Bank.",
      "Contactless tap & pay supported"
    ],
    "cons": [
      "Annual fee of Rs.250 + GST applies"
    ],
    "features": [
      "ATM Limit: Rs.40,000/day",
      "POS Limit: Rs.75,000/day",
      "Lounge Access: Not Available",
      "Contactless Support: Yes"
    ],
    "verificationStatus": "Verified",
    "maxLimit": 75000,
    "eligibility": "Suryoday Small Finance Bank account holders",
    "hiddenCharges": "Standard bank SOC fees and taxes",
    "verifyNote": "",
    "officialSource": "https://www.suryodaybank.com",
    "fuelWaiver": "Not Available",
    "internationalUsage": "Yes",
    "studentFriendly": false,
    "womenSpecial": false,
    "seniorCitizen": false,
    "zeroFeeOrLowFee": true,
    "healthcareFriendly": false,
    "travelZeroForex": false,
    "segmentTags": [
      "Zero Fee"
    ],
    "lifeStage": [
      "Zero / Low Fee"
    ],
    "healthcareBenefits": [],
    "dataConfidence": "Verified"
  },
  {
    "id": 88,
    "image": "/images/cards/card-21.png",
    "bank": "Fi Money",
    "cardName": "Fi Debit Card",
    "network": "Visa",
    "annualFee": "Free (via Federal Bank account)",
    "numAnnualFee": 0,
    "joiningFee": "Free",
    "international": true,
    "contactless": true,
    "loungeAccess": "Not Available",
    "forexMarkup": "Not Available",
    "cashback": "Cashback/Fi-Coins on select spends",
    "bestFor": "Digital-first banking, Young professionals",
    "rating": 4.2,
    "isPopular": false,
    "applyUrl": "https://fi.money",
    "category": "Standard",
    "minBalance": 2000,
    "interestRate": 3,
    "cashbackPct": 1,
    "atmCharges": "Daily Limit: Not Available",
    "benefits": "Neobank debit card issued via Federal Bank, focused on a mobile-first savings and rewards experience.",
    "tags": [
      "Lowest Charges",
      "Student Friendly",
      "Cashback"
    ],
    "pros": [
      "Neobank debit card issued via Federal Bank, focused on a mobile-first savings and rewards experience.",
      "Contactless tap & pay supported"
    ],
    "cons": [
      "Basic reward structure"
    ],
    "features": [
      "ATM Limit: Not Available",
      "POS Limit: Not Available",
      "Lounge Access: Not Available",
      "Contactless Support: Yes"
    ],
    "verificationStatus": "Verified",
    "maxLimit": 100000,
    "eligibility": "Fi Money account holders",
    "hiddenCharges": "Standard bank SOC fees and taxes",
    "verifyNote": "",
    "officialSource": "https://fi.money",
    "fuelWaiver": "Not Available",
    "internationalUsage": "Yes",
    "studentFriendly": true,
    "womenSpecial": false,
    "seniorCitizen": false,
    "zeroFeeOrLowFee": true,
    "healthcareFriendly": false,
    "travelZeroForex": false,
    "segmentTags": [
      "Student",
      "Zero Fee"
    ],
    "lifeStage": [
      "Student Friendly",
      "Zero / Low Fee"
    ],
    "healthcareBenefits": [],
    "dataConfidence": "Verified"
  },
  {
    "id": 89,
    "image": "/images/cards/card-22.png",
    "bank": "Jupiter",
    "cardName": "Jupiter Debit Card",
    "network": "Visa/RuPay",
    "annualFee": "Free (via Federal Bank account)",
    "numAnnualFee": 0,
    "joiningFee": "Free",
    "international": true,
    "contactless": true,
    "loungeAccess": "Not Available",
    "forexMarkup": "Not Available",
    "cashback": "Cashback on select categories",
    "bestFor": "Digital-first banking, Cashback seekers",
    "rating": 4.1,
    "isPopular": false,
    "applyUrl": "https://jupiter.money",
    "category": "Standard",
    "minBalance": 2000,
    "interestRate": 3,
    "cashbackPct": 1,
    "atmCharges": "Daily Limit: Not Available",
    "benefits": "Neobank debit card issued via Federal Bank, offering cashback and a mobile-first banking app.",
    "tags": [
      "Lowest Charges",
      "Student Friendly",
      "Cashback"
    ],
    "pros": [
      "Neobank debit card issued via Federal Bank, offering cashback and a mobile-first banking app.",
      "Contactless tap & pay supported"
    ],
    "cons": [
      "Basic reward structure"
    ],
    "features": [
      "ATM Limit: Not Available",
      "POS Limit: Not Available",
      "Lounge Access: Not Available",
      "Contactless Support: Yes"
    ],
    "verificationStatus": "Verified",
    "maxLimit": 100000,
    "eligibility": "Jupiter account holders",
    "hiddenCharges": "Standard bank SOC fees and taxes",
    "verifyNote": "",
    "officialSource": "https://jupiter.money",
    "fuelWaiver": "Not Available",
    "internationalUsage": "Yes",
    "studentFriendly": true,
    "womenSpecial": false,
    "seniorCitizen": false,
    "zeroFeeOrLowFee": true,
    "healthcareFriendly": false,
    "travelZeroForex": false,
    "segmentTags": [
      "Student",
      "Zero Fee"
    ],
    "lifeStage": [
      "Student Friendly",
      "Zero / Low Fee"
    ],
    "healthcareBenefits": [],
    "dataConfidence": "Verified"
  },
  {
    "id": 90,
    "image": "Domestic RuPay debit card variant from Niyo for everyday digital banking.",
    "bank": "Niyo",
    "cardName": "Niyo Bharat RuPay Debit Card",
    "network": "RuPay",
    "annualFee": "Free (via issuing bank)",
    "numAnnualFee": 0,
    "joiningFee": "Free",
    "international": false,
    "contactless": true,
    "loungeAccess": "Not Available",
    "forexMarkup": "Not Available",
    "cashback": "Not Available",
    "bestFor": "4",
    "rating": 4.2,
    "isPopular": false,
    "applyUrl": "https://niyo.co",
    "category": "Bharat",
    "minBalance": 0,
    "interestRate": 3,
    "cashbackPct": 0,
    "atmCharges": "Daily Limit: Not Available",
    "benefits": "Not Available",
    "tags": [
      "Lowest Charges"
    ],
    "pros": [
      "",
      "Contactless tap & pay supported"
    ],
    "cons": [
      "Basic reward structure"
    ],
    "features": [
      "ATM Limit: Not Available",
      "POS Limit: Not Available",
      "Lounge Access: Not Available",
      "Contactless Support: Yes"
    ],
    "verificationStatus": "Verified",
    "maxLimit": 100000,
    "eligibility": "Niyo account holders",
    "hiddenCharges": "Standard bank SOC fees and taxes",
    "verifyNote": "",
    "officialSource": "https://niyo.co",
    "fuelWaiver": "Not Available",
    "internationalUsage": "No",
    "studentFriendly": false,
    "womenSpecial": false,
    "seniorCitizen": false,
    "zeroFeeOrLowFee": true,
    "healthcareFriendly": false,
    "travelZeroForex": false,
    "segmentTags": [
      "Zero Fee"
    ],
    "lifeStage": [
      "Zero / Low Fee"
    ],
    "healthcareBenefits": [],
    "dataConfidence": "Verified"
  },
  {
    "id": 91,
    "image": "Neobank debit card from Freo offering a mobile-first savings and spending experience via an issuing bank.",
    "bank": "Freo",
    "cardName": "Freo Debit Card",
    "network": "Visa/RuPay",
    "annualFee": "Free (via issuing bank)",
    "numAnnualFee": 0,
    "joiningFee": "Free",
    "international": true,
    "contactless": true,
    "loungeAccess": "Not Available",
    "forexMarkup": "Not Available",
    "cashback": "Cashback on select spends",
    "bestFor": "3.9",
    "rating": 4.2,
    "isPopular": false,
    "applyUrl": "https://freo.money",
    "category": "Standard",
    "minBalance": 0,
    "interestRate": 3,
    "cashbackPct": 1,
    "atmCharges": "Daily Limit: Not Available",
    "benefits": "Not Available",
    "tags": [
      "Lowest Charges",
      "Cashback"
    ],
    "pros": [
      "",
      "Contactless tap & pay supported"
    ],
    "cons": [
      "Basic reward structure"
    ],
    "features": [
      "ATM Limit: Not Available",
      "POS Limit: Not Available",
      "Lounge Access: Not Available",
      "Contactless Support: Yes"
    ],
    "verificationStatus": "Verified",
    "maxLimit": 100000,
    "eligibility": "Freo account holders",
    "hiddenCharges": "Standard bank SOC fees and taxes",
    "verifyNote": "",
    "officialSource": "https://freo.money",
    "fuelWaiver": "Not Available",
    "internationalUsage": "Yes",
    "studentFriendly": false,
    "womenSpecial": false,
    "seniorCitizen": false,
    "zeroFeeOrLowFee": true,
    "healthcareFriendly": false,
    "travelZeroForex": false,
    "segmentTags": [
      "Zero Fee"
    ],
    "lifeStage": [
      "Zero / Low Fee"
    ],
    "healthcareBenefits": [],
    "dataConfidence": "Verified"
  },
  {
    "id": 92,
    "image": "/images/cards/card-25.png",
    "bank": "Airtel Payments Bank",
    "cardName": "Airtel Payments Bank RuPay Debit Card",
    "network": "RuPay",
    "annualFee": "Rs.150-200 + GST",
    "numAnnualFee": 150,
    "joiningFee": "Rs.100-200",
    "international": false,
    "contactless": true,
    "loungeAccess": "Not Available",
    "forexMarkup": "Not Available",
    "cashback": "Not Available",
    "bestFor": "Basic banking, Small transactions, Rural/semi-urban customers",
    "rating": 3.7,
    "isPopular": false,
    "applyUrl": "https://www.airtel.in/bank",
    "category": "Classic",
    "minBalance": 2000,
    "interestRate": 3,
    "cashbackPct": 0,
    "atmCharges": "Daily Limit: Rs.10,000/day (payments bank limit)",
    "benefits": "Basic RuPay debit card linked to Airtel Payments Bank accounts, subject to payments-bank deposit and transaction caps.",
    "tags": [
      "Lowest Charges",
      "Student Friendly"
    ],
    "pros": [
      "Basic RuPay debit card linked to Airtel Payments Bank accounts, subject to payments-bank deposit and transaction caps.",
      "Contactless tap & pay supported"
    ],
    "cons": [
      "Annual fee of Rs.150-200 + GST applies"
    ],
    "features": [
      "ATM Limit: Rs.10,000/day (payments bank limit)",
      "POS Limit: Rs.20,000/day",
      "Lounge Access: Not Available",
      "Contactless Support: Yes"
    ],
    "verificationStatus": "Verified",
    "maxLimit": 20000,
    "eligibility": "Airtel Payments Bank account holders",
    "hiddenCharges": "Standard bank SOC fees and taxes",
    "verifyNote": "",
    "officialSource": "https://www.airtel.in/bank",
    "fuelWaiver": "Not Available",
    "internationalUsage": "No",
    "studentFriendly": true,
    "womenSpecial": false,
    "seniorCitizen": false,
    "zeroFeeOrLowFee": true,
    "healthcareFriendly": false,
    "travelZeroForex": false,
    "segmentTags": [
      "Student",
      "Zero Fee"
    ],
    "lifeStage": [
      "Student Friendly",
      "Zero / Low Fee"
    ],
    "healthcareBenefits": [],
    "dataConfidence": "Verified"
  },
  {
    "id": 93,
    "image": "/images/cards/card-26.png",
    "bank": "India Post Payments Bank",
    "cardName": "IPPB RuPay Debit Card",
    "network": "RuPay",
    "annualFee": "Rs.100-150 + GST",
    "numAnnualFee": 100,
    "joiningFee": "Rs.100-150",
    "international": false,
    "contactless": true,
    "loungeAccess": "Not Available",
    "forexMarkup": "Not Available",
    "cashback": "Not Available",
    "bestFor": "Basic banking, Rural/postal banking customers",
    "rating": 3.6,
    "isPopular": false,
    "applyUrl": "https://www.ippbonline.com",
    "category": "Classic",
    "minBalance": 2000,
    "interestRate": 3,
    "cashbackPct": 0,
    "atmCharges": "Daily Limit: Rs.10,000/day (payments bank limit)",
    "benefits": "Basic RuPay debit card linked to India Post Payments Bank accounts, subject to payments-bank deposit and transaction caps.",
    "tags": [
      "Lowest Charges",
      "Student Friendly"
    ],
    "pros": [
      "Basic RuPay debit card linked to India Post Payments Bank accounts, subject to payments-bank deposit and transaction caps.",
      "Contactless tap & pay supported"
    ],
    "cons": [
      "Annual fee of Rs.100-150 + GST applies"
    ],
    "features": [
      "ATM Limit: Rs.10,000/day (payments bank limit)",
      "POS Limit: Rs.20,000/day",
      "Lounge Access: Not Available",
      "Contactless Support: Yes"
    ],
    "verificationStatus": "Verified",
    "maxLimit": 20000,
    "eligibility": "India Post Payments Bank account holders",
    "hiddenCharges": "Standard bank SOC fees and taxes",
    "verifyNote": "",
    "officialSource": "https://www.ippbonline.com",
    "fuelWaiver": "Not Available",
    "internationalUsage": "No",
    "studentFriendly": true,
    "womenSpecial": false,
    "seniorCitizen": false,
    "zeroFeeOrLowFee": true,
    "healthcareFriendly": false,
    "travelZeroForex": false,
    "segmentTags": [
      "Student",
      "Zero Fee"
    ],
    "lifeStage": [
      "Student Friendly",
      "Zero / Low Fee"
    ],
    "healthcareBenefits": [],
    "dataConfidence": "Verified"
  },
  {
    "id": 94,
    "image": "/images/cards/card-27.png",
    "bank": "HDFC Bank",
    "cardName": "HDFC EasyShop Woman's Advantage Debit Card",
    "network": "Visa",
    "annualFee": "Rs.250 + GST",
    "numAnnualFee": 250,
    "joiningFee": "Not Available",
    "international": true,
    "contactless": true,
    "loungeAccess": "Not Available",
    "forexMarkup": "Not Available",
    "cashback": "Discounts on lifestyle/wellness brands",
    "bestFor": "Women account holders, Lifestyle discounts",
    "rating": 4.1,
    "isPopular": false,
    "applyUrl": "https://www.hdfcbank.com",
    "category": "Woman's Advantage",
    "minBalance": 2000,
    "interestRate": 3,
    "cashbackPct": 1,
    "atmCharges": "Daily Limit: Rs.25,000/day",
    "benefits": "Debit card tailored for women account holders with lifestyle and wellness brand discounts.",
    "tags": [
      "Lowest Charges",
      "Cashback"
    ],
    "pros": [
      "Debit card tailored for women account holders with lifestyle and wellness brand discounts.",
      "Contactless tap & pay supported"
    ],
    "cons": [
      "Annual fee of Rs.250 + GST applies"
    ],
    "features": [
      "ATM Limit: Rs.25,000/day",
      "POS Limit: Rs.1,00,000/day",
      "Lounge Access: Not Available",
      "Contactless Support: Yes"
    ],
    "verificationStatus": "Verified",
    "maxLimit": 100000,
    "eligibility": "HDFC Bank account holders",
    "hiddenCharges": "Standard bank SOC fees and taxes",
    "verifyNote": "",
    "officialSource": "https://www.hdfcbank.com",
    "fuelWaiver": "Waived on eligible fuel spends",
    "internationalUsage": "Yes",
    "studentFriendly": false,
    "womenSpecial": true,
    "seniorCitizen": false,
    "zeroFeeOrLowFee": true,
    "healthcareFriendly": false,
    "travelZeroForex": false,
    "segmentTags": [
      "Women",
      "Zero Fee"
    ],
    "lifeStage": [
      "Zero / Low Fee"
    ],
    "healthcareBenefits": [],
    "dataConfidence": "Verified"
  },
  {
    "id": 95,
    "image": "/images/cards/card-28.png",
    "bank": "ICICI Bank",
    "cardName": "ICICI Business Debit Card",
    "network": "RuPay/Visa",
    "annualFee": "Rs.499 + GST",
    "numAnnualFee": 499,
    "joiningFee": "Not Available",
    "international": true,
    "contactless": true,
    "loungeAccess": "Not Available",
    "forexMarkup": "Not Available",
    "cashback": "Not Available",
    "bestFor": "Current account / business holders",
    "rating": 4.1,
    "isPopular": false,
    "applyUrl": "https://www.icicibank.com",
    "category": "Business",
    "minBalance": 2000,
    "interestRate": 3,
    "cashbackPct": 0,
    "atmCharges": "Daily Limit: Rs.1,00,000/day",
    "benefits": "Debit card designed for ICICI current account and business banking customers.",
    "tags": [
      "Premium Features"
    ],
    "pros": [
      "Debit card designed for ICICI current account and business banking customers.",
      "Contactless tap & pay supported"
    ],
    "cons": [
      "Annual fee of Rs.499 + GST applies"
    ],
    "features": [
      "ATM Limit: Rs.1,00,000/day",
      "POS Limit: Rs.2,00,000/day",
      "Lounge Access: Not Available",
      "Contactless Support: Yes"
    ],
    "verificationStatus": "Verified",
    "maxLimit": 200000,
    "eligibility": "ICICI Bank account holders",
    "hiddenCharges": "Standard bank SOC fees and taxes",
    "verifyNote": "",
    "officialSource": "https://www.icicibank.com",
    "fuelWaiver": "Waived on eligible fuel spends",
    "internationalUsage": "Yes",
    "studentFriendly": false,
    "womenSpecial": false,
    "seniorCitizen": false,
    "zeroFeeOrLowFee": false,
    "healthcareFriendly": false,
    "travelZeroForex": false,
    "segmentTags": [],
    "lifeStage": [],
    "healthcareBenefits": [],
    "dataConfidence": "Verified"
  },
  {
    "id": 96,
    "image": "/images/cards/card-29.png",
    "bank": "Axis Bank",
    "cardName": "Axis Bank Power Salute Debit Card",
    "network": "RuPay",
    "annualFee": "Free for Defence salary account holders",
    "numAnnualFee": 0,
    "joiningFee": "Free",
    "international": true,
    "contactless": true,
    "loungeAccess": "Not Available",
    "forexMarkup": "Not Available",
    "cashback": "Not Available",
    "bestFor": "Defence personnel salary accounts",
    "rating": 4.4,
    "isPopular": false,
    "applyUrl": "https://www.axisbank.com",
    "category": "Power Salute",
    "minBalance": 0,
    "interestRate": 3,
    "cashbackPct": 0,
    "atmCharges": "Daily Limit: Rs.75,000/day",
    "benefits": "Debit card exclusively for Axis Bank Defence Salary account holders with enhanced insurance cover.",
    "tags": [
      "Lowest Charges"
    ],
    "pros": [
      "Debit card exclusively for Axis Bank Defence Salary account holders with enhanced insurance cover.",
      "Contactless tap & pay supported"
    ],
    "cons": [
      "Basic reward structure"
    ],
    "features": [
      "ATM Limit: Rs.75,000/day",
      "POS Limit: Rs.1,50,000/day",
      "Lounge Access: Not Available",
      "Contactless Support: Yes"
    ],
    "verificationStatus": "Verified",
    "maxLimit": 150000,
    "eligibility": "Axis Bank account holders",
    "hiddenCharges": "Standard bank SOC fees and taxes",
    "verifyNote": "",
    "officialSource": "https://www.axisbank.com",
    "fuelWaiver": "Waived on eligible fuel spends",
    "internationalUsage": "Yes",
    "studentFriendly": false,
    "womenSpecial": false,
    "seniorCitizen": false,
    "zeroFeeOrLowFee": true,
    "healthcareFriendly": false,
    "travelZeroForex": false,
    "segmentTags": [
      "Zero Fee"
    ],
    "lifeStage": [
      "Zero / Low Fee"
    ],
    "healthcareBenefits": [],
    "dataConfidence": "Verified"
  },
  {
    "id": 97,
    "image": "/images/cards/card-30.png",
    "bank": "Kotak Mahindra Bank",
    "cardName": "Kotak Ace Debit Card",
    "network": "Visa/RuPay",
    "annualFee": "Rs.199 + GST",
    "numAnnualFee": 199,
    "joiningFee": "Not Available",
    "international": true,
    "contactless": true,
    "loungeAccess": "Not Available",
    "forexMarkup": "Not Available",
    "cashback": "Cashback on select categories",
    "bestFor": "Everyday banking, Students",
    "rating": 4.1,
    "isPopular": false,
    "applyUrl": "https://www.kotak.com",
    "category": "Ace",
    "minBalance": 2000,
    "interestRate": 3,
    "cashbackPct": 1,
    "atmCharges": "Daily Limit: Rs.50,000/day",
    "benefits": "Everyday Kotak debit card with cashback on select spend categories.",
    "tags": [
      "Lowest Charges",
      "Student Friendly",
      "Cashback"
    ],
    "pros": [
      "Everyday Kotak debit card with cashback on select spend categories.",
      "Contactless tap & pay supported"
    ],
    "cons": [
      "Annual fee of Rs.199 + GST applies"
    ],
    "features": [
      "ATM Limit: Rs.50,000/day",
      "POS Limit: Rs.1,00,000/day",
      "Lounge Access: Not Available",
      "Contactless Support: Yes"
    ],
    "verificationStatus": "Verified",
    "maxLimit": 100000,
    "eligibility": "Kotak Mahindra Bank account holders",
    "hiddenCharges": "Standard bank SOC fees and taxes",
    "verifyNote": "",
    "officialSource": "https://www.kotak.com",
    "fuelWaiver": "Waived on eligible fuel spends",
    "internationalUsage": "Yes",
    "studentFriendly": true,
    "womenSpecial": false,
    "seniorCitizen": false,
    "zeroFeeOrLowFee": true,
    "healthcareFriendly": false,
    "travelZeroForex": false,
    "segmentTags": [
      "Student",
      "Zero Fee"
    ],
    "lifeStage": [
      "Student Friendly",
      "Zero / Low Fee"
    ],
    "healthcareBenefits": [],
    "dataConfidence": "Verified"
  },
  {
    "id": 98,
    "image": "/images/cards/card-31.png",
    "bank": "IDFC FIRST Bank",
    "cardName": "IDFC FIRST Millennia Debit Card",
    "network": "RuPay/Visa",
    "annualFee": "Free (with savings account)",
    "numAnnualFee": 0,
    "joiningFee": "Free",
    "international": true,
    "contactless": true,
    "loungeAccess": "Not Available",
    "forexMarkup": "Not Available",
    "cashback": "Not Available",
    "bestFor": "Young professionals, Zero-fee banking",
    "rating": 4.3,
    "isPopular": false,
    "applyUrl": "https://www.idfcfirstbank.com",
    "category": "Millennia",
    "minBalance": 2000,
    "interestRate": 3,
    "cashbackPct": 0,
    "atmCharges": "Daily Limit: Rs.50,000/day",
    "benefits": "No-annual-fee debit card variant for IDFC FIRST millennial account holders.",
    "tags": [
      "Lowest Charges",
      "Student Friendly"
    ],
    "pros": [
      "No-annual-fee debit card variant for IDFC FIRST millennial account holders.",
      "Contactless tap & pay supported"
    ],
    "cons": [
      "Basic reward structure"
    ],
    "features": [
      "ATM Limit: Rs.50,000/day",
      "POS Limit: Rs.1,50,000/day",
      "Lounge Access: Not Available",
      "Contactless Support: Yes"
    ],
    "verificationStatus": "Verified",
    "maxLimit": 150000,
    "eligibility": "IDFC FIRST Bank account holders",
    "hiddenCharges": "Standard bank SOC fees and taxes",
    "verifyNote": "",
    "officialSource": "https://www.idfcfirstbank.com",
    "fuelWaiver": "Waived on eligible fuel spends",
    "internationalUsage": "Yes",
    "studentFriendly": true,
    "womenSpecial": false,
    "seniorCitizen": false,
    "zeroFeeOrLowFee": true,
    "healthcareFriendly": false,
    "travelZeroForex": false,
    "segmentTags": [
      "Student",
      "Zero Fee"
    ],
    "lifeStage": [
      "Student Friendly",
      "Zero / Low Fee"
    ],
    "healthcareBenefits": [],
    "dataConfidence": "Verified"
  },
  {
    "id": 99,
    "image": "/images/cards/card-32.png",
    "bank": "IndusInd Bank",
    "cardName": "IndusInd Pioneer Debit Card",
    "network": "Visa Signature",
    "annualFee": "Waived for Pioneer account holders",
    "numAnnualFee": 0,
    "joiningFee": "Not Available",
    "international": true,
    "contactless": true,
    "loungeAccess": "Complimentary domestic and international lounge access",
    "forexMarkup": "Lower forex markup",
    "cashback": "Not Available",
    "bestFor": "Pioneer/premium banking customers",
    "rating": 4.4,
    "isPopular": false,
    "applyUrl": "https://www.indusind.com",
    "category": "Pioneer",
    "minBalance": 2000,
    "interestRate": 3,
    "cashbackPct": 0,
    "atmCharges": "Daily Limit: Rs.1,50,000/day",
    "benefits": "IndusInd's top-tier debit card for Pioneer relationship banking customers with international lounge access.",
    "tags": [
      "Lowest Charges"
    ],
    "pros": [
      "IndusInd's top-tier debit card for Pioneer relationship banking customers with international lounge access.",
      "Contactless tap & pay supported"
    ],
    "cons": [
      "Basic reward structure"
    ],
    "features": [
      "ATM Limit: Rs.1,50,000/day",
      "POS Limit: Rs.3,00,000/day",
      "Lounge Access: Complimentary domestic and international lounge access",
      "Contactless Support: Yes"
    ],
    "verificationStatus": "Verified",
    "maxLimit": 300000,
    "eligibility": "IndusInd Bank account holders",
    "hiddenCharges": "Standard bank SOC fees and taxes",
    "verifyNote": "",
    "officialSource": "https://www.indusind.com",
    "fuelWaiver": "Waived on eligible fuel spends",
    "internationalUsage": "Yes",
    "studentFriendly": false,
    "womenSpecial": false,
    "seniorCitizen": false,
    "zeroFeeOrLowFee": true,
    "healthcareFriendly": false,
    "travelZeroForex": false,
    "segmentTags": [
      "Zero Fee"
    ],
    "lifeStage": [
      "Zero / Low Fee"
    ],
    "healthcareBenefits": [],
    "dataConfidence": "Verified"
  },
  {
    "id": 100,
    "image": "/images/cards/card-33.png",
    "bank": "Yes Bank",
    "cardName": "Yes Bank Kisan Debit Card",
    "network": "RuPay",
    "annualFee": "Free/Nominal",
    "numAnnualFee": 0,
    "joiningFee": "Free",
    "international": false,
    "contactless": true,
    "loungeAccess": "Not Available",
    "forexMarkup": "Not Available",
    "cashback": "Not Available",
    "bestFor": "Farmers, Kisan Credit Card linked accounts",
    "rating": 3.8,
    "isPopular": false,
    "applyUrl": "https://www.yesbank.in",
    "category": "Kisan",
    "minBalance": 2000,
    "interestRate": 3,
    "cashbackPct": 0,
    "atmCharges": "Daily Limit: Rs.20,000/day",
    "benefits": "RuPay debit card linked to Kisan Credit Card accounts for agricultural customers.",
    "tags": [
      "Lowest Charges"
    ],
    "pros": [
      "RuPay debit card linked to Kisan Credit Card accounts for agricultural customers.",
      "Contactless tap & pay supported"
    ],
    "cons": [
      "Basic reward structure"
    ],
    "features": [
      "ATM Limit: Rs.20,000/day",
      "POS Limit: Rs.40,000/day",
      "Lounge Access: Not Available",
      "Contactless Support: Yes"
    ],
    "verificationStatus": "Verified",
    "maxLimit": 40000,
    "eligibility": "Yes Bank account holders",
    "hiddenCharges": "Standard bank SOC fees and taxes",
    "verifyNote": "",
    "officialSource": "https://www.yesbank.in",
    "fuelWaiver": "Not Available",
    "internationalUsage": "No",
    "studentFriendly": false,
    "womenSpecial": false,
    "seniorCitizen": false,
    "zeroFeeOrLowFee": true,
    "healthcareFriendly": false,
    "travelZeroForex": false,
    "segmentTags": [
      "Zero Fee"
    ],
    "lifeStage": [
      "Zero / Low Fee"
    ],
    "healthcareBenefits": [],
    "dataConfidence": "Verified"
  },
  {
    "id": 101,
    "image": "/images/cards/card-34.png",
    "bank": "Federal Bank",
    "cardName": "Federal Bank Business Debit Card",
    "network": "RuPay/Visa",
    "annualFee": "Rs.399 + GST",
    "numAnnualFee": 399,
    "joiningFee": "Not Available",
    "international": true,
    "contactless": true,
    "loungeAccess": "Not Available",
    "forexMarkup": "Not Available",
    "cashback": "Not Available",
    "bestFor": "Current account / business holders",
    "rating": 4,
    "isPopular": false,
    "applyUrl": "https://www.federalbank.co.in",
    "category": "Business",
    "minBalance": 2000,
    "interestRate": 3,
    "cashbackPct": 0,
    "atmCharges": "Daily Limit: Rs.75,000/day",
    "benefits": "Debit card designed for Federal Bank current account and business customers.",
    "tags": [
      "Premium Features"
    ],
    "pros": [
      "Debit card designed for Federal Bank current account and business customers.",
      "Contactless tap & pay supported"
    ],
    "cons": [
      "Annual fee of Rs.399 + GST applies"
    ],
    "features": [
      "ATM Limit: Rs.75,000/day",
      "POS Limit: Rs.1,50,000/day",
      "Lounge Access: Not Available",
      "Contactless Support: Yes"
    ],
    "verificationStatus": "Verified",
    "maxLimit": 150000,
    "eligibility": "Federal Bank account holders",
    "hiddenCharges": "Standard bank SOC fees and taxes",
    "verifyNote": "",
    "officialSource": "https://www.federalbank.co.in",
    "fuelWaiver": "Waived on eligible fuel spends",
    "internationalUsage": "Yes",
    "studentFriendly": false,
    "womenSpecial": false,
    "seniorCitizen": false,
    "zeroFeeOrLowFee": false,
    "healthcareFriendly": false,
    "travelZeroForex": false,
    "segmentTags": [],
    "lifeStage": [],
    "healthcareBenefits": [],
    "dataConfidence": "Verified"
  },
  {
    "id": 102,
    "image": "/images/cards/card-1.png",
    "bank": "RBL Bank",
    "cardName": "RBL Bank Insignia Preferred Banking Debit Card",
    "network": "Visa Infinite",
    "annualFee": "Waived for Insignia account holders",
    "numAnnualFee": 0,
    "joiningFee": "Not Available",
    "international": true,
    "contactless": true,
    "loungeAccess": "Unlimited domestic and international lounge access",
    "forexMarkup": "Lower forex markup",
    "cashback": "Not Available",
    "bestFor": "Ultra-HNI / Insignia customers",
    "rating": 4.5,
    "isPopular": true,
    "applyUrl": "https://www.rblbank.com",
    "category": "Insignia",
    "minBalance": 2000,
    "interestRate": 3,
    "cashbackPct": 0,
    "atmCharges": "Daily Limit: Rs.2,00,000/day",
    "benefits": "RBL Bank's top-tier debit card exclusive to Insignia Preferred Banking relationship customers.",
    "tags": [
      "Lowest Charges"
    ],
    "pros": [
      "RBL Bank's top-tier debit card exclusive to Insignia Preferred Banking relationship customers.",
      "Contactless tap & pay supported"
    ],
    "cons": [
      "Basic reward structure"
    ],
    "features": [
      "ATM Limit: Rs.2,00,000/day",
      "POS Limit: Rs.4,00,000/day",
      "Lounge Access: Unlimited domestic and international lounge access",
      "Contactless Support: Yes"
    ],
    "verificationStatus": "Verified",
    "maxLimit": 400000,
    "eligibility": "RBL Bank account holders",
    "hiddenCharges": "Standard bank SOC fees and taxes",
    "verifyNote": "",
    "officialSource": "https://www.rblbank.com",
    "fuelWaiver": "Waived on eligible fuel spends",
    "internationalUsage": "Yes",
    "studentFriendly": false,
    "womenSpecial": false,
    "seniorCitizen": false,
    "zeroFeeOrLowFee": true,
    "healthcareFriendly": false,
    "travelZeroForex": false,
    "segmentTags": [
      "Zero Fee"
    ],
    "lifeStage": [
      "Zero / Low Fee"
    ],
    "healthcareBenefits": [],
    "dataConfidence": "Verified"
  },
  {
    "id": 103,
    "image": "/images/cards/card-2.png",
    "bank": "AU Small Finance Bank",
    "cardName": "AU Bank Business Debit Card",
    "network": "RuPay/Visa",
    "annualFee": "Rs.399 + GST",
    "numAnnualFee": 399,
    "joiningFee": "Not Available",
    "international": true,
    "contactless": true,
    "loungeAccess": "Not Available",
    "forexMarkup": "Not Available",
    "cashback": "Cashback on select categories",
    "bestFor": "Current account / business holders",
    "rating": 4,
    "isPopular": false,
    "applyUrl": "https://www.aubank.in",
    "category": "Business",
    "minBalance": 2000,
    "interestRate": 3,
    "cashbackPct": 1,
    "atmCharges": "Daily Limit: Rs.75,000/day",
    "benefits": "Debit card designed for AU Small Finance Bank current account and business customers.",
    "tags": [
      "Premium Features",
      "Cashback"
    ],
    "pros": [
      "Debit card designed for AU Small Finance Bank current account and business customers.",
      "Contactless tap & pay supported"
    ],
    "cons": [
      "Annual fee of Rs.399 + GST applies"
    ],
    "features": [
      "ATM Limit: Rs.75,000/day",
      "POS Limit: Rs.1,50,000/day",
      "Lounge Access: Not Available",
      "Contactless Support: Yes"
    ],
    "verificationStatus": "Verified",
    "maxLimit": 150000,
    "eligibility": "AU Small Finance Bank account holders",
    "hiddenCharges": "Standard bank SOC fees and taxes",
    "verifyNote": "",
    "officialSource": "https://www.aubank.in",
    "fuelWaiver": "Waived on eligible fuel spends",
    "internationalUsage": "Yes",
    "studentFriendly": false,
    "womenSpecial": false,
    "seniorCitizen": false,
    "zeroFeeOrLowFee": false,
    "healthcareFriendly": false,
    "travelZeroForex": false,
    "segmentTags": [],
    "lifeStage": [],
    "healthcareBenefits": [],
    "dataConfidence": "Verified"
  },
  {
    "id": 104,
    "image": "/images/cards/card-3.png",
    "bank": "Punjab National Bank",
    "cardName": "PNB Rupay Business Debit Card",
    "network": "RuPay",
    "annualFee": "Rs.250 + GST",
    "numAnnualFee": 250,
    "joiningFee": "Free",
    "international": true,
    "contactless": true,
    "loungeAccess": "Not Available",
    "forexMarkup": "Not Available",
    "cashback": "Not Available",
    "bestFor": "Current account / business holders",
    "rating": 3.9,
    "isPopular": false,
    "applyUrl": "https://www.pnbindia.in",
    "category": "Business",
    "minBalance": 2000,
    "interestRate": 3,
    "cashbackPct": 0,
    "atmCharges": "Daily Limit: Rs.50,000/day",
    "benefits": "Debit card designed for PNB current account and business banking customers.",
    "tags": [
      "Lowest Charges"
    ],
    "pros": [
      "Debit card designed for PNB current account and business banking customers.",
      "Contactless tap & pay supported"
    ],
    "cons": [
      "Annual fee of Rs.250 + GST applies"
    ],
    "features": [
      "ATM Limit: Rs.50,000/day",
      "POS Limit: Rs.1,00,000/day",
      "Lounge Access: Not Available",
      "Contactless Support: Yes"
    ],
    "verificationStatus": "Verified",
    "maxLimit": 100000,
    "eligibility": "Punjab National Bank account holders",
    "hiddenCharges": "Standard bank SOC fees and taxes",
    "verifyNote": "",
    "officialSource": "https://www.pnbindia.in",
    "fuelWaiver": "Not Available",
    "internationalUsage": "Yes",
    "studentFriendly": false,
    "womenSpecial": false,
    "seniorCitizen": false,
    "zeroFeeOrLowFee": true,
    "healthcareFriendly": false,
    "travelZeroForex": false,
    "segmentTags": [
      "Zero Fee"
    ],
    "lifeStage": [
      "Zero / Low Fee"
    ],
    "healthcareBenefits": [],
    "dataConfidence": "Verified"
  },
  {
    "id": 105,
    "image": "/images/cards/card-4.png",
    "bank": "Bank of Baroda",
    "cardName": "BoB Business Debit Card",
    "network": "RuPay/Visa",
    "annualFee": "Rs.300 + GST",
    "numAnnualFee": 300,
    "joiningFee": "Free",
    "international": true,
    "contactless": true,
    "loungeAccess": "Not Available",
    "forexMarkup": "Not Available",
    "cashback": "Not Available",
    "bestFor": "Current account / business holders",
    "rating": 3.9,
    "isPopular": false,
    "applyUrl": "https://www.bankofbaroda.in",
    "category": "Business",
    "minBalance": 2000,
    "interestRate": 3,
    "cashbackPct": 0,
    "atmCharges": "Daily Limit: Rs.50,000/day",
    "benefits": "Debit card designed for Bank of Baroda current account and business customers.",
    "tags": [
      "Premium Features"
    ],
    "pros": [
      "Debit card designed for Bank of Baroda current account and business customers.",
      "Contactless tap & pay supported"
    ],
    "cons": [
      "Annual fee of Rs.300 + GST applies"
    ],
    "features": [
      "ATM Limit: Rs.50,000/day",
      "POS Limit: Rs.1,00,000/day",
      "Lounge Access: Not Available",
      "Contactless Support: Yes"
    ],
    "verificationStatus": "Verified",
    "maxLimit": 100000,
    "eligibility": "Bank of Baroda account holders",
    "hiddenCharges": "Standard bank SOC fees and taxes",
    "verifyNote": "",
    "officialSource": "https://www.bankofbaroda.in",
    "fuelWaiver": "Not Available",
    "internationalUsage": "Yes",
    "studentFriendly": false,
    "womenSpecial": false,
    "seniorCitizen": false,
    "zeroFeeOrLowFee": false,
    "healthcareFriendly": false,
    "travelZeroForex": false,
    "segmentTags": [],
    "lifeStage": [],
    "healthcareBenefits": [],
    "dataConfidence": "Verified"
  }
];;

export const topCards = [
  { id: 1,
    image: "/images/cards/card-1.png",  name: "EasyShop Platinum Debit Card", bank: "HDFC Bank",  fee: "₹850",  rating: 4.5 },
  { id: 4,
    image: "/images/cards/card-4.png",  name: "Sapphiro Debit Card",          bank: "ICICI Bank",  fee: "₹1999", rating: 4.7 },
  { id: 9,
    image: "/images/cards/card-9.png",  name: "Burgundy Debit Card",          bank: "Axis Bank",   fee: "₹0",    rating: 4.8 },
  { id: 13,
    image: "/images/cards/card-13.png", name: "FIRST Wealth Debit Card",      bank: "IDFC First",  fee: "₹0",    rating: 4.7 },
  { id: 14,
    image: "/images/cards/card-14.png", name: "FIRST Private Debit Card",     bank: "IDFC First",  fee: "₹0",    rating: 4.8 },
  { id: 16,
    image: "/images/cards/card-16.png", name: "Visa Signature Debit Card",    bank: "IndusInd",    fee: "₹1499", rating: 4.6 },
  { id: 17,
    image: "/images/cards/card-17.png", name: "Signature Exclusive",          bank: "IndusInd",    fee: "₹0",    rating: 4.5 },
  { id: 25,
    image: "/images/cards/card-25.png", name: "Canara RuPay Select",          bank: "Canara Bank", fee: "₹1000", rating: 4.2 },
  { id: 26,
    image: "/images/cards/card-26.png", name: "Fi-Federal Debit Card",        bank: "Fi Money",    fee: "₹0",    rating: 4.6 },
  { id: 27,
    image: "/images/cards/card-27.png", name: "Niyo Global Debit Card",       bank: "Niyo",        fee: "₹0",    rating: 4.7 }
];

export const faqs = [
  { q: "How does D.Card compare debit cards?", a: "We aggregate real-time data from top banks, focusing on hidden charges, annual fees, minimum balance requirements, and reward programs to give you an unbiased comparison." },
  { q: "Are the debit card details updated regularly?", a: "Yes, our team and automated systems update the comparison matrices weekly to ensure all fees, limits, and features are accurate." },
  { q: "Is it safe to apply for a bank account through D.Card?", a: "Absolutely. We do not process applications ourselves. When you click 'Apply', you are securely redirected to the official bank's website to complete your application." },
  { q: "Do you charge any fees for comparison?", a: "No, our comparison tool is 100% free for users. D.CARD is an independent platform created for educational and informational purposes." },
  { q: "Can I filter cards by student or zero-balance criteria?", a: "Yes! Our dynamic filtering system allows you to sort by Zero Balance, Student Friendly, High Interest, and Premium Features." },
  { q: "What does 'Highest Interest' filter mean?", a: "It filters cards whose linked savings accounts offer an interest rate of 4% p.a. or above—helping you earn more on your idle balance." },
];

export const reviews = [
  { id: 1,
    image: "/images/cards/card-1.png", user: "Sarah Jenkins", role: "Student", rating: 5, text: "D.Card helped me find the perfect zero-balance account in minutes! The comparison feature is incredibly intuitive." },
  { id: 2,
    image: "/images/cards/card-2.png", user: "Mike T.", role: "Professional", rating: 4, text: "Clean, professional, and very easy to use. I love the side-by-side comparison matrix for checking hidden fees." },
  { id: 3,
    image: "/images/cards/card-3.png", user: "Emily R.", role: "Freelancer", rating: 5, text: "The matching suggestions were spot on. It suggested a card with great international transaction rates which I really needed." },
  { id: 4,
    image: "/images/cards/card-4.png", user: "Rahul M.", role: "Entrepreneur", rating: 5, text: "Best debit card comparison site in India. Found my Burgundy card here — zero annual fee with 3% cashback is unreal!" },
  { id: 5,
    image: "/images/cards/card-5.png", user: "Priya K.", role: "Doctor", rating: 4, text: "The filter system is superb. Filtered by zero balance + high interest in seconds. Switched to IDFC First immediately." },
];

export const filterOptions = [
  "Lowest Charges",
  "Highest Interest",
  "Zero Balance",
  "Student Friendly",
  "Cashback",
  "Premium Features",
  "Student",
  "Women",
  "Senior",
  "Healthcare",
  "Zero Fee",
];

export const jsonDebitCards = (masterDebitCards || []).map(c => normalizeCard({
  ...c,
  id: c.card_id,
  dataset: 'json'
}));

export const normalizedMockDebitCards = (debitCards || []).map(c => normalizeCard({
  ...c,
  dataset: 'mock'
}));

export const allDebitCards = deduplicateCards([
  ...normalizedMockDebitCards,
  ...jsonDebitCards
]);

export const BANKS = [...new Set(allDebitCards.map(c => c.bank).filter(Boolean))].sort();
export const NETWORKS = ["Visa", "Mastercard", "RuPay"];
export const CATEGORIES = [...new Set(allDebitCards.map(c => c.category).filter(Boolean))];

