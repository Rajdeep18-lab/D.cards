import dcardDebitCardsRaw from "../../dcard_debit_cards.json";
import { normalizeCard } from "./compareUtils";

// Bank Interest Rates Lookup (defaults by bank category)
const BANK_INTEREST_RATES = {
  "State Bank of India": 2.7,
  "SBI": 2.7,
  "HDFC Bank": 3.0,
  "ICICI Bank": 3.5,
  "Axis Bank": 3.0,
  "IDFC FIRST Bank": 7.0,
  "IDFC First": 7.0,
  "Kotak Mahindra Bank": 4.0,
  "Kotak Mahindra": 4.0,
  "IndusInd Bank": 4.5,
  "RBL Bank": 6.0,
  "Yes Bank": 5.0,
  "Federal Bank": 3.0,
  "Fi Money": 3.0,
  "Jupiter": 3.0,
  "AU Small Finance Bank": 7.25,
  "Equitas Small Finance Bank": 7.0,
  "Ujjivan Small Finance Bank": 7.5,
  "Jana Small Finance Bank": 7.5,
  "ESAF Small Finance Bank": 7.5,
  "Suryoday Small Finance Bank": 7.0,
  "Punjab National Bank": 2.7,
  "Bank of Baroda": 2.75,
  "Canara Bank": 2.9,
  "Union Bank of India": 2.75,
  "Indian Bank": 2.75,
  "Bank of India": 2.75,
  "UCO Bank": 2.75,
  "Central Bank of India": 2.75,
  "Indian Overseas Bank": 2.75,
  "South Indian Bank": 3.0,
  "Karnataka Bank": 3.0,
  "DCB Bank": 3.25,
  "City Union Bank": 3.0,
  "Niyo": 5.0,
  "Freo": 3.5,
  "Airtel Payments Bank": 2.5,
  "India Post Payments Bank": 2.0
};

// Base trust scores by bank
const BASE_TRUST_SCORES = {
  "State Bank of India": 9.3,
  "HDFC Bank": 9.4,
  "ICICI Bank": 9.2,
  "Axis Bank": 8.9,
  "Kotak Mahindra Bank": 8.8,
  "IDFC FIRST Bank": 9.1,
  "IndusInd Bank": 8.7,
  "Punjab National Bank": 8.6,
  "Bank of Baroda": 8.7,
  "Canara Bank": 8.5,
  "Union Bank of India": 8.5,
  "Indian Bank": 8.4,
  "Bank of India": 8.4,
  "Federal Bank": 8.6,
  "RBL Bank": 8.5,
  "Yes Bank": 8.4,
  "AU Small Finance Bank": 8.6,
  "Equitas Small Finance Bank": 8.3,
  "Fi Money": 8.5,
  "Jupiter": 8.4,
  "Niyo": 8.4,
  "Airtel Payments Bank": 8.2,
  "India Post Payments Bank": 8.3
};

/**
 * Normalizes bank name to prevent duplicate entries (e.g. SBI vs State Bank of India)
 */
export function canonicalBankName(rawName = "") {
  const name = String(rawName).trim();
  if (!name) return "Unknown Bank";
  const lower = name.toLowerCase();
  
  if (lower === "sbi" || lower.includes("state bank of india")) return "State Bank of India";
  if (lower.includes("hdfc")) return "HDFC Bank";
  if (lower.includes("icici")) return "ICICI Bank";
  if (lower.includes("axis")) return "Axis Bank";
  if (lower.includes("kotak")) return "Kotak Mahindra Bank";
  if (lower.includes("idfc")) return "IDFC FIRST Bank";
  if (lower.includes("indusind")) return "IndusInd Bank";
  if (lower.includes("punjab national") || lower === "pnb") return "Punjab National Bank";
  if (lower.includes("bank of baroda") || lower === "bob") return "Bank of Baroda";
  if (lower.includes("union bank")) return "Union Bank of India";
  if (lower.includes("canara")) return "Canara Bank";
  if (lower.includes("indian bank") && !lower.includes("overseas")) return "Indian Bank";
  if (lower.includes("indian overseas")) return "Indian Overseas Bank";
  if (lower.includes("bank of india") && !lower.includes("state")) return "Bank of India";
  if (lower.includes("central bank")) return "Central Bank of India";
  if (lower.includes("uco bank")) return "UCO Bank";
  if (lower.includes("federal")) return "Federal Bank";
  if (lower.includes("rbl")) return "RBL Bank";
  if (lower.includes("yes bank")) return "Yes Bank";
  if (lower.includes("au small")) return "AU Small Finance Bank";
  if (lower.includes("equitas")) return "Equitas Small Finance Bank";
  if (lower.includes("ujjivan")) return "Ujjivan Small Finance Bank";
  if (lower.includes("jana small")) return "Jana Small Finance Bank";
  if (lower.includes("esaf")) return "ESAF Small Finance Bank";
  if (lower.includes("suryoday")) return "Suryoday Small Finance Bank";
  if (lower.includes("south indian")) return "South Indian Bank";
  if (lower.includes("karnataka")) return "Karnataka Bank";
  if (lower.includes("dcb bank")) return "DCB Bank";
  if (lower.includes("city union")) return "City Union Bank";
  if (lower.includes("fi money") || lower === "fi") return "Fi Money";
  if (lower.includes("jupiter")) return "Jupiter";
  if (lower.includes("niyo")) return "Niyo";
  if (lower.includes("freo")) return "Freo";
  if (lower.includes("airtel")) return "Airtel Payments Bank";
  if (lower.includes("india post")) return "India Post Payments Bank";

  return name;
}

/**
 * Derives top 3 debit card benefits for a given list of cards belonging to a bank
 */
function deriveTop3Benefits(cards = []) {
  const benefitScores = new Map();

  const addBenefit = (label, weight = 1) => {
    benefitScores.set(label, (benefitScores.get(label) || 0) + weight);
  };

  cards.forEach(c => {
    const cashback = String(c.cashback || "").toLowerCase();
    const lounge = String(c.loungeAccess || c.airportBenefits || "").toLowerCase();
    const forex = String(c.forexMarkup || "").toLowerCase();
    const rewards = String(c.rewardPoints || c.rewards || "").toLowerCase();
    const insurance = String(c.insurance || "").toLowerCase();
    const fuel = String(c.fuelSurchargeWaiver || "").toLowerCase();
    const emi = String(c.emi || "").toLowerCase();
    const bestFor = Array.isArray(c.bestFor) ? c.bestFor.map(b => String(b).toLowerCase()) : [];

    if (cashback && !cashback.includes("not available") && !cashback.includes("no")) {
      if (cashback.includes("%")) {
        addBenefit("Cashback Rewards", 3);
      } else {
        addBenefit("Cashback Offers", 2);
      }
    }
    if (lounge && !lounge.startsWith("no") && !lounge.includes("not available")) {
      addBenefit("Airport Lounge Access", 4);
    }
    if (c.contactless) {
      addBenefit("Contactless Tap & Pay", 2);
    }
    if (forex && (forex.includes("0%") || forex.includes("zero") || c.travelZeroForex)) {
      addBenefit("Zero Forex Markup", 4);
    } else if (c.international || c.internationalUsage) {
      addBenefit("Global Acceptance", 2);
    }
    if (rewards && !rewards.includes("not available") && !rewards.includes("no")) {
      addBenefit("Reward Points Program", 2);
    }
    if (insurance && !insurance.includes("not available") && !insurance.includes("no")) {
      addBenefit("Accident Cover Insurance", 3);
    }
    if (fuel && !fuel.includes("not available") && !fuel.includes("no")) {
      addBenefit("Fuel Surcharge Waiver", 2);
    }
    if (emi && !emi.includes("not available") && !emi.includes("no")) {
      addBenefit("Merchant EMI Support", 2);
    }
    if (c.studentFriendly || bestFor.some(b => b.includes("student"))) {
      addBenefit("Student Friendly", 2);
    }
    if (c.annualFee === "Free" || String(c.annualFee).includes("0") || c.numAnnualFee === 0) {
      addBenefit("Zero Annual Fee Perks", 3);
    }
  });

  // Sort benefits by frequency/importance weight
  const sorted = Array.from(benefitScores.entries())
    .sort((a, b) => b[1] - a[1])
    .map(entry => entry[0]);

  // Fallbacks if fewer than 3 benefits found
  const fallbacks = [
    "High Daily Limits",
    "24x7 Customer Support",
    "Digital Banking Perks",
    "Wide ATM Network",
    "Contactless Payments"
  ];

  for (const fb of fallbacks) {
    if (sorted.length >= 3) break;
    if (!sorted.includes(fb)) {
      sorted.push(fb);
    }
  }

  return sorted.slice(0, 3);
}

/**
 * Calculates dynamic Trust Index (out of 10.0) for a bank based on its cards
 */
function calculateTrustIndex(bankName, cards = []) {
  if (BASE_TRUST_SCORES[bankName]) {
    return BASE_TRUST_SCORES[bankName];
  }

  // Calculate base from ratings
  const ratings = cards.map(c => typeof c.rating === 'number' ? c.rating : 4.0).filter(r => r > 0);
  const avgRating = ratings.length > 0 ? (ratings.reduce((a, b) => a + b, 0) / ratings.length) : 4.2;

  // Scale average rating (out of 5) to ~8.0-9.2
  let score = 7.0 + (avgRating * 0.44);

  if (cards.length >= 4) score += 0.2;
  if (cards.some(c => c.loungeAccess && !String(c.loungeAccess).toLowerCase().includes("not available"))) score += 0.2;
  if (cards.some(c => c.insurance && !String(c.insurance).toLowerCase().includes("not available"))) score += 0.1;

  score = Math.min(9.6, Math.max(8.0, score));
  return Math.round(score * 10) / 10;
}

/**
 * Generates dynamic badges for a bank based on card properties
 */
function generateBankBadges(bankName, cards = []) {
  const badges = [];

  const hasCashback = cards.some(c => {
    const cb = String(c.cashback || "").toLowerCase();
    return cb && !cb.includes("not available") && !cb.includes("no");
  });

  const hasLowCharges = cards.some(c => {
    const fee = String(c.annualFee || "").toLowerCase();
    return fee.includes("free") || fee.includes("125") || fee.includes("150") || fee.includes("175") || fee.includes("200") || fee.includes("250") || c.numAnnualFee === 0 || c.numAnnualFee <= 250;
  });

  const hasTravel = cards.some(c => {
    const lounge = String(c.loungeAccess || c.airportBenefits || "").toLowerCase();
    const forex = String(c.forexMarkup || "").toLowerCase();
    return (lounge && !lounge.startsWith("no") && !lounge.includes("not available")) || forex.includes("0%") || c.travelZeroForex;
  });

  const hasRewards = cards.some(c => {
    const rw = String(c.rewardPoints || c.rewards || "").toLowerCase();
    return rw && !rw.includes("not available") && !rw.includes("no");
  });

  const hasPremium = cards.some(c => {
    const variant = String(c.cardVariant || c.category || c.cardName || "").toLowerCase();
    return variant.includes("platinum") || variant.includes("signature") || variant.includes("infinite") || variant.includes("burgundy") || variant.includes("wealth") || variant.includes("gold");
  });

  const trustScore = calculateTrustIndex(bankName, cards);

  if (hasCashback) badges.push({ text: "Best Cashback", icon: "⭐", bg: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20" });
  if (hasLowCharges) badges.push({ text: "Low Charges", icon: "💰", bg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20" });
  if (hasTravel) badges.push({ text: "Travel Friendly", icon: "✈", bg: "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20" });
  if (hasRewards) badges.push({ text: "Best Rewards", icon: "🎁", bg: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20" });
  if (hasPremium) badges.push({ text: "Premium", icon: "🏆", bg: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20" });
  if (trustScore >= 9.0) badges.push({ text: "Secure Banking", icon: "🛡", bg: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20" });
  if (cards.length >= 4 || bankName.includes("SBI") || bankName.includes("HDFC") || bankName.includes("ICICI") || bankName.includes("Axis")) {
    badges.push({ text: "Popular", icon: "🔥", bg: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20" });
  }

  // Ensure at least 1 badge
  if (badges.length === 0) {
    badges.push({ text: "Verified Bank", icon: "✅", bg: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20" });
  }

  return badges.slice(0, 2); // Show top 2 most relevant badges on card
}

/**
 * Main Dynamic Generator: Reads card dataset and automatically generates deduplicated covered banks array.
 * Updating JSON automatically updates this directory!
 */
export function getCoveredBanksDirectory(customCardsList = null) {
  // Use passed list or raw JSON list
  const sourceCards = (customCardsList && customCardsList.length > 0) 
    ? customCardsList 
    : (dcardDebitCardsRaw || []);

  const bankGroups = new Map();

  sourceCards.forEach(rawCard => {
    const rawBank = rawCard.bank || rawCard.bankName || rawCard.name || "";
    if (!rawBank) return;

    const canonicalName = canonicalBankName(rawBank);
    if (!bankGroups.has(canonicalName)) {
      bankGroups.set(canonicalName, []);
    }
    bankGroups.get(canonicalName).push(rawCard);
  });

  const coveredBanks = [];

  let idCounter = 1;
  bankGroups.forEach((cards, bankName) => {
    const cardCount = cards.length;
    const features = deriveTop3Benefits(cards);
    const trustScore = calculateTrustIndex(bankName, cards);
    const interest = BANK_INTEREST_RATES[bankName] || (bankName.includes("Small Finance") ? 7.0 : 3.0);
    const badges = generateBankBadges(bankName, cards);

    // Bank logo shortcode/initials
    let logoText = bankName.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
    if (bankName.includes("SBI") || bankName.includes("State Bank")) logoText = "SBI";
    if (bankName.includes("HDFC")) logoText = "HDFC";
    if (bankName.includes("ICICI")) logoText = "ICICI";
    if (bankName.includes("Axis")) logoText = "AXIS";
    if (bankName.includes("Kotak")) logoText = "KOTAK";
    if (bankName.includes("IDFC")) logoText = "IDFC";
    if (bankName.includes("IndusInd")) logoText = "INDUS";
    if (bankName.includes("Punjab")) logoText = "PNB";
    if (bankName.includes("Baroda")) logoText = "BOB";
    if (bankName.includes("Canara")) logoText = "CNRA";
    if (bankName.includes("Union")) logoText = "UBI";

    coveredBanks.push({
      id: idCounter++,
      name: bankName,
      logoText,
      cardCount,
      features,
      trustScore,
      interest,
      badges,
      cards
    });
  });

  return coveredBanks;
}
