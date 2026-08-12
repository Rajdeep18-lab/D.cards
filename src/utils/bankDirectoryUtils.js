import dcardDebitCardsRaw from "../../dcard_debit_cards.json" with { type: "json" };
import { normalizeCard } from "./compareUtils.js";

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

// Bank Institution Profiles Metadata (Metadata dictionary with smart fallbacks)
const BANK_INSTITUTION_METADATA = {
  "State Bank of India": {
    foundedYear: "1955",
    headquarters: "Mumbai, Maharashtra",
    ownershipType: "Public Sector Bank",
    officialWebsite: "https://sbi.co.in",
    atmNetwork: "65,000+ ATMs",
    branches: "22,400+ Branches",
    customers: "480M+ Customers",
    customerRating: "4.5",
    securityRating: "9.6",
    digitalBankingScore: "9.1",
    overviewHistory: "Founded as Imperial Bank of India in 1806 and reconstituted as SBI in 1955. SBI is India's largest and most trusted public sector financial institution.",
    overviewCustomerBase: "Serves over 480 million customers across every corner of India, including rural, semi-urban, and international markets.",
    overviewNetwork: "Maintains an unparalleled physical footprint with over 22,400 domestic branches and 65,000 ATMs across all Indian states.",
    overviewDigital: "Operates YONO (You Only Need One), India's largest super-app platform handling over 80 million registered digital users.",
    overviewReputation: "Recognized as a Systemically Important Bank (D-SIB) backed by government capital guarantees and high institutional trust."
  },
  "HDFC Bank": {
    foundedYear: "1994",
    headquarters: "Mumbai, Maharashtra",
    ownershipType: "Private Sector Bank",
    officialWebsite: "https://www.hdfcbank.com",
    atmNetwork: "20,500+ ATMs",
    branches: "8,700+ Branches",
    customers: "120M+ Customers",
    customerRating: "4.7",
    securityRating: "9.7",
    digitalBankingScore: "9.5",
    overviewHistory: "Incorporated in August 1994 as a pioneer private sector bank, HDFC Bank has grown into India's largest private market cap financial engine.",
    overviewCustomerBase: "Catres to over 120 million retail, corporate, and wealth management customers with high-volume transaction reliability.",
    overviewNetwork: "Expansive network of 8,700+ tech-enabled branches and 20,500+ ATMs across urban, suburban, and rural centers.",
    overviewDigital: "Offers HDFC PayZapp and MobileBanking 2.0 with instant instant e-KYC, zero-touch card activation, and real-time fraud monitoring.",
    overviewReputation: "Consistently rated AAA by CRISIL and CARE for financial stability, superior asset quality, and premier service benchmarks."
  },
  "ICICI Bank": {
    foundedYear: "1994",
    headquarters: "Mumbai, Maharashtra",
    ownershipType: "Private Sector Bank",
    officialWebsite: "https://www.icicibank.com",
    atmNetwork: "17,000+ ATMs",
    branches: "6,400+ Branches",
    customers: "90M+ Customers",
    customerRating: "4.6",
    securityRating: "9.5",
    digitalBankingScore: "9.6",
    overviewHistory: "Formed in 1994 as part of ICICI Group. ICICI Bank revolutionized retail internet banking and online merchant payments in India.",
    overviewCustomerBase: "Powers financial services for over 90 million individual account holders, corporate partners, and global NRIs.",
    overviewNetwork: "Connected through 6,400+ modern branches and 17,000+ ATMs featuring 24/7 deposit & withdrawal kiosks.",
    overviewDigital: "iMobile Pay leads the industry in API integrations, instant digital debit cards, zero-balance salary accounts, and contactless pay.",
    overviewReputation: "Voted India's best digital banking provider with robust cybersecurity and instant card controls."
  },
  "Axis Bank": {
    foundedYear: "1993",
    headquarters: "Mumbai, Maharashtra",
    ownershipType: "Private Sector Bank",
    officialWebsite: "https://www.axisbank.com",
    atmNetwork: "15,800+ ATMs",
    branches: "5,200+ Branches",
    customers: "75M+ Customers",
    customerRating: "4.5",
    securityRating: "9.3",
    digitalBankingScore: "9.3",
    overviewHistory: "Established in 1993 as UTI Bank before rebranding to Axis Bank in 2007, pioneering elite lifestyle debit cards and priority banking.",
    overviewCustomerBase: "Over 75 million retail account holders, salary professionals, and HNI wealth clients.",
    overviewNetwork: "Extensive network spanning 5,200+ branches and 15,800+ automated teller machines nationwide.",
    overviewDigital: "Features Axis Mobile, offering instant card lock/unlock, custom POS limits, and seamless UPI integration.",
    overviewReputation: "Celebrated for high cashback card partnerships, Burgundy private banking perks, and premium lifestyle privileges."
  },
  "Kotak Mahindra Bank": {
    foundedYear: "2003",
    headquarters: "Mumbai, Maharashtra",
    ownershipType: "Private Sector Bank",
    officialWebsite: "https://www.kotak.com",
    atmNetwork: "3,200+ ATMs",
    branches: "1,900+ Branches",
    customers: "45M+ Customers",
    customerRating: "4.4",
    securityRating: "9.2",
    digitalBankingScore: "9.4",
    overviewHistory: "Converted from NBFC to a commercial bank in 2003, becoming India's fastest-growing private digital banking power.",
    overviewCustomerBase: "Serves 45+ million account holders with zero-balance digital accounts and high-yield savings structures.",
    overviewNetwork: "Compact high-efficiency network of 1,900+ branches supported by 3,200+ ATMs.",
    overviewDigital: "Kotak 811 provides full video-KYC account opening in 5 minutes with immediate virtual debit card issuance.",
    overviewReputation: "Known for high savings interest rates, transparent fee structures, and innovative 811 banking."
  },
  "IDFC FIRST Bank": {
    foundedYear: "2015",
    headquarters: "Mumbai, Maharashtra",
    ownershipType: "Private Sector Bank",
    officialWebsite: "https://www.idfcfirstbank.com",
    atmNetwork: "1,100+ ATMs",
    branches: "850+ Branches",
    customers: "25M+ Customers",
    customerRating: "4.7",
    securityRating: "9.4",
    digitalBankingScore: "9.5",
    overviewHistory: "Merged IDFC Bank and Capital First in 2018 to establish a customer-first banking model with zero hidden fees.",
    overviewCustomerBase: "Growing rapidly with 25+ million customers attracted by ethical banking practices and monthly interest payouts.",
    overviewNetwork: "Tech-focused network of 850+ branches and 1,100+ smart ATMs across major metros and tier-2 cities.",
    overviewDigital: "IDFC FIRST Mobile app features zero fee transfers, zero forex markup options, and dynamic contactless controls.",
    overviewReputation: "Highly rated for customer transparency, up to 7.0% p.a. savings yield, and lifetime free debit benefits."
  },
  "IndusInd Bank": {
    foundedYear: "1994",
    headquarters: "Mumbai, Maharashtra",
    ownershipType: "Private Sector Bank",
    officialWebsite: "https://www.indusind.com",
    atmNetwork: "2,900+ ATMs",
    branches: "2,600+ Branches",
    customers: "38M+ Customers",
    customerRating: "4.4",
    securityRating: "9.1",
    digitalBankingScore: "9.1",
    overviewHistory: "Established in 1994 driven by NRI investments to deliver technology-driven commercial and retail banking services.",
    overviewCustomerBase: "Serves 38+ million retail and institutional clients with specialized wealth and forex card offerings.",
    overviewNetwork: "2,600+ branches and 2,900+ ATMs with customized video-banking assistance.",
    overviewDigital: "INDIE by IndusInd Bank offers instant line of credit, custom debit card rewards, and zero forex options.",
    overviewReputation: "Renowned for custom account numbers, BookMyShow BOGO movie deals, and signature reward cards."
  },
  "Punjab National Bank": {
    foundedYear: "1894",
    headquarters: "New Delhi, Delhi",
    ownershipType: "Public Sector Bank",
    officialWebsite: "https://pnbindia.in",
    atmNetwork: "13,000+ ATMs",
    branches: "10,000+ Branches",
    customers: "180M+ Customers",
    customerRating: "4.2",
    securityRating: "9.0",
    digitalBankingScore: "8.6",
    overviewHistory: "Founded in 1894 in Lahore by Lala Lajpat Rai. PNB is India's second-largest public sector bank.",
    overviewCustomerBase: "Trusted by 180+ million citizens across northern and pan-Indian regions.",
    overviewNetwork: "10,000+ branches and 13,000+ ATMs covering urban centers to deep rural sectors.",
    overviewDigital: "PNB ONE app provides consolidated banking, RuPay debit management, and government subsidy access.",
    overviewReputation: "Strong capital backing, low card annual fees, and widespread government scheme integration."
  },
  "Bank of Baroda": {
    foundedYear: "1908",
    headquarters: "Vadodara, Gujarat",
    ownershipType: "Public Sector Bank",
    officialWebsite: "https://www.bankofbaroda.in",
    atmNetwork: "11,500+ ATMs",
    branches: "8,200+ Branches",
    customers: "150M+ Customers",
    customerRating: "4.3",
    securityRating: "9.1",
    digitalBankingScore: "8.9",
    overviewHistory: "Established by Maharaja Sayajirao Gaekwad III in 1908, now India's third-largest public sector bank.",
    overviewCustomerBase: "Over 150 million retail customers and international diaspora across 17 countries.",
    overviewNetwork: "8,200+ domestic branches and 11,500+ ATMs.",
    overviewDigital: "bob World app delivers 220+ digital services including instant RuPay debit card issuance and travel deals.",
    overviewReputation: "High customer trust, extensive international branches, and competitive fee schedules."
  }
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

  const sorted = Array.from(benefitScores.entries())
    .sort((a, b) => b[1] - a[1])
    .map(entry => entry[0]);

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

  const ratings = cards.map(c => typeof c.rating === 'number' ? c.rating : 4.0).filter(r => r > 0);
  const avgRating = ratings.length > 0 ? (ratings.reduce((a, b) => a + b, 0) / ratings.length) : 4.2;

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

  if (badges.length === 0) {
    badges.push({ text: "Verified Bank", icon: "✅", bg: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20" });
  }

  return badges.slice(0, 2);
}

export function getBankBrandTheme(rawName = "") {
  const canonical = canonicalBankName(rawName);
  const lower = canonical.toLowerCase();

  if (lower.includes("sbi") || lower.includes("state bank")) {
    return {
      gradient: "from-[#003366] via-[#0055A5] to-[#0077C8]",
      brandColor: "#003366",
      accentText: "text-[#0077C8]",
      accentBg: "bg-[#003366]/10 dark:bg-[#003366]/25",
      accentBorder: "border-[#0077C8]/30",
      progressGradient: "from-[#003366] to-[#00B5EF]"
    };
  }
  if (lower.includes("hdfc")) {
    return {
      gradient: "from-[#004B8D] via-[#003366] to-[#002855]",
      brandColor: "#004B8D",
      accentText: "text-[#004B8D] dark:text-[#60A5FA]",
      accentBg: "bg-[#004B8D]/10 dark:bg-[#004B8D]/25",
      accentBorder: "border-[#004B8D]/30",
      progressGradient: "from-[#004B8D] to-[#2563EB]"
    };
  }
  if (lower.includes("icici")) {
    return {
      gradient: "from-[#F37021] via-[#E85D04] to-[#C41230]",
      brandColor: "#F37021",
      accentText: "text-[#F37021]",
      accentBg: "bg-[#F37021]/10 dark:bg-[#F37021]/25",
      accentBorder: "border-[#F37021]/30",
      progressGradient: "from-[#F37021] to-[#FF8C38]"
    };
  }
  if (lower.includes("axis")) {
    return {
      gradient: "from-[#97123A] via-[#800B28] to-[#5C0519]",
      brandColor: "#97123A",
      accentText: "text-[#97123A] dark:text-[#F472B6]",
      accentBg: "bg-[#97123A]/10 dark:bg-[#97123A]/25",
      accentBorder: "border-[#97123A]/30",
      progressGradient: "from-[#97123A] to-[#D42355]"
    };
  }
  if (lower.includes("kotak")) {
    return {
      gradient: "from-[#ED1C24] via-[#D90429] to-[#990000]",
      brandColor: "#ED1C24",
      accentText: "text-[#ED1C24]",
      accentBg: "bg-[#ED1C24]/10 dark:bg-[#ED1C24]/25",
      accentBorder: "border-[#ED1C24]/30",
      progressGradient: "from-[#ED1C24] to-[#FF4D4D]"
    };
  }
  if (lower.includes("idfc")) {
    return {
      gradient: "from-[#9E1B32] via-[#801224] to-[#5C0A18]",
      brandColor: "#9E1B32",
      accentText: "text-[#9E1B32] dark:text-[#F472B6]",
      accentBg: "bg-[#9E1B32]/10 dark:bg-[#9E1B32]/25",
      accentBorder: "border-[#9E1B32]/30",
      progressGradient: "from-[#9E1B32] to-[#E11D48]"
    };
  }
  if (lower.includes("indusind") || lower.includes("indus")) {
    return {
      gradient: "from-[#800000] via-[#A31C1C] to-[#590000]",
      brandColor: "#800000",
      accentText: "text-[#991B1B] dark:text-[#FCA5A5]",
      accentBg: "bg-[#800000]/10 dark:bg-[#800000]/25",
      accentBorder: "border-[#800000]/30",
      progressGradient: "from-[#800000] to-[#DC2626]"
    };
  }
  if (lower.includes("punjab") || lower.includes("pnb")) {
    return {
      gradient: "from-[#A31D24] via-[#C9252D] to-[#801016]",
      brandColor: "#A31D24",
      accentText: "text-[#A31D24] dark:text-[#F87171]",
      accentBg: "bg-[#A31D24]/10 dark:bg-[#A31D24]/25",
      accentBorder: "border-[#A31D24]/30",
      progressGradient: "from-[#A31D24] to-[#EF4444]"
    };
  }
  if (lower.includes("baroda") || lower.includes("bob")) {
    return {
      gradient: "from-[#F26522] via-[#E54E00] to-[#B33C00]",
      brandColor: "#F26522",
      accentText: "text-[#F26522]",
      accentBg: "bg-[#F26522]/10 dark:bg-[#F26522]/25",
      accentBorder: "border-[#F26522]/30",
      progressGradient: "from-[#F26522] to-[#FB923C]"
    };
  }
  if (lower.includes("canara")) {
    return {
      gradient: "from-[#0072CE] via-[#00529B] to-[#00386B]",
      brandColor: "#0072CE",
      accentText: "text-[#0072CE] dark:text-[#38BDF8]",
      accentBg: "bg-[#0072CE]/10 dark:bg-[#0072CE]/25",
      accentBorder: "border-[#0072CE]/30",
      progressGradient: "from-[#0072CE] to-[#0EA5E9]"
    };
  }
  if (lower.includes("au small") || lower.includes("au sfb")) {
    return {
      gradient: "from-[#E30613] via-[#F36F21] to-[#B3000A]",
      brandColor: "#E30613",
      accentText: "text-[#E30613] dark:text-[#FB7185]",
      accentBg: "bg-[#E30613]/10 dark:bg-[#E30613]/25",
      accentBorder: "border-[#E30613]/30",
      progressGradient: "from-[#E30613] to-[#F43F5E]"
    };
  }
  if (lower.includes("fi money") || lower === "fi") {
    return {
      gradient: "from-[#00D084] via-[#059669] to-[#047857]",
      brandColor: "#00D084",
      accentText: "text-[#059669] dark:text-[#34D399]",
      accentBg: "bg-[#00D084]/10 dark:bg-[#00D084]/25",
      accentBorder: "border-[#00D084]/30",
      progressGradient: "from-[#00D084] to-[#10B981]"
    };
  }

  return {
    gradient: "from-[#2563EB] via-[#1D4ED8] to-[#1E40AF]",
    brandColor: "#2563EB",
    accentText: "text-[#2563EB] dark:text-[#60A5FA]",
    accentBg: "bg-[#2563EB]/10 dark:bg-[#2563EB]/25",
    accentBorder: "border-[#2563EB]/30",
    progressGradient: "from-[#2563EB] to-[#60A5FA]"
  };
}

import { savingsAccounts as defaultSavingsAccounts } from '../data/mockSavingsAccounts.js';

/**
 * Main Dynamic Generator: Reads card dataset and automatically generates deduplicated covered banks array.
 */
export function getCoveredBanksDirectory(customCardsList = null, customSavingsList = null) {
  const sourceCards = (customCardsList && customCardsList.length > 0) 
    ? customCardsList 
    : (dcardDebitCardsRaw || []);

  const sourceSavings = (customSavingsList && customSavingsList.length > 0)
    ? customSavingsList
    : (defaultSavingsAccounts || []);

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
    const bankAccounts = sourceSavings.filter(s => {
      const cBank = canonicalBankName(s.bank || s.bankId || "");
      return cBank.toLowerCase() === bankName.toLowerCase();
    });
    const accountCount = bankAccounts.length;

    const features = deriveTop3Benefits(cards);
    const trustScore = calculateTrustIndex(bankName, cards);
    const interest = BANK_INTEREST_RATES[bankName] || (bankName.includes("Small Finance") ? 7.0 : 3.0);
    const badges = generateBankBadges(bankName, cards);
    const brandTheme = getBankBrandTheme(bankName);

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
      accountCount,
      features,
      trustScore,
      interest,
      badges,
      brandTheme,
      cards,
      accounts: bankAccounts
    });
  });

  return coveredBanks;
}

/**
 * Returns full enriched Institutional Bank Profile details for ANY bank dynamically
 */
export function getInstitutionalProfileForBank(bankName, cardsForBank = []) {
  const meta = BANK_INSTITUTION_METADATA[bankName] || {};
  const canonicalName = canonicalBankName(bankName);
  
  // Calculate average rating of bank's cards
  const normalizedCards = cardsForBank.map(c => normalizeCard(c));
  const ratings = normalizedCards.map(c => c.rating || 4.0).filter(r => r > 0);
  const avgRatingNum = ratings.length > 0 
    ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1) 
    : "4.5";

  const trustScoreNum = calculateTrustIndex(canonicalName, cardsForBank);
  const interestRate = BANK_INTEREST_RATES[canonicalName] || (canonicalName.includes("Small Finance") ? 7.0 : 3.0);

  // Derive ownership type
  let ownershipType = meta.ownershipType;
  if (!ownershipType) {
    const lower = canonicalName.toLowerCase();
    if (lower.includes("sbi") || lower.includes("state bank") || lower.includes("punjab") || lower.includes("baroda") || lower.includes("canara") || lower.includes("union") || lower.includes("indian bank") || lower.includes("central bank") || lower.includes("uco")) {
      ownershipType = "Public Sector Bank";
    } else if (lower.includes("small finance")) {
      ownershipType = "Small Finance Bank";
    } else if (lower.includes("payments") || lower.includes("fi money") || lower.includes("jupiter") || lower.includes("niyo") || lower.includes("freo")) {
      ownershipType = "Payments Bank / Fintech";
    } else {
      ownershipType = "Private Sector Bank";
    }
  }

  // Derive website
  let officialWebsite = meta.officialWebsite;
  if (!officialWebsite && normalizedCards.length > 0 && normalizedCards[0].officialWebsite) {
    officialWebsite = normalizedCards[0].officialWebsite;
  }
  if (!officialWebsite) {
    const domain = canonicalName.toLowerCase().replace(/[^a-z]/g, "");
    officialWebsite = `https://www.${domain}.com`;
  }

  // Derive key strengths
  const keyStrengths = [
    { title: "Cashback Programs", desc: "Offers structured cashback on bill payments & e-commerce" },
    { title: "Airport Lounge", desc: "Quarterly complimentary lounge passes on platinum tiers" },
    { title: "Premium Debit Cards", desc: "Multiple variants tailored for lifestyle & high spenders" },
    { title: "Strong Mobile Banking", desc: "High-rated digital app with instant card management" },
    { title: "UPI Experience", desc: "Fast UPI integration with zero-friction QR payments" },
    { title: "International Acceptance", desc: "Global Visa & Mastercard acceptance with insurance" }
  ];

  // Derive considerations
  const considerations = [
    "Minimum Monthly Average Balance (MAB) requirements apply",
    "Annual maintenance charges on premium card variants",
    "Lounge access subject to quarterly minimum spend limits",
    "Reissuance and replacement fee schedules apply for physical cards"
  ];

  // Derive best for categories
  const bestForBadges = [
    "Students", "Salary Account", "Business", "Women", "Travel", "Premium", "NRI", "Senior Citizens"
  ];

  return {
    bankName: canonicalName,
    foundedYear: meta.foundedYear || "1994",
    headquarters: meta.headquarters || "Mumbai, Maharashtra",
    ownershipType,
    officialWebsite,
    trustScore: `${trustScoreNum}/10`,
    trustScoreNum,
    customerRating: `${meta.customerRating || avgRatingNum}/5.0`,
    securityRating: `${meta.securityRating || '9.5'}/10`,
    digitalBankingScore: `${meta.digitalBankingScore || '9.3'}/10`,
    overviewHistory: meta.overviewHistory || `${canonicalName} is one of India's premier financial institutions offering comprehensive retail and corporate banking services.`,
    overviewCustomerBase: meta.overviewCustomerBase || `Serves millions of individual account holders across urban, suburban, and international markets.`,
    overviewNetwork: meta.overviewNetwork || meta.atmNetwork ? `Operates an extensive nationwide banking network featuring ${meta.branches || 'thousands of branches'} and ${meta.atmNetwork || 'ATMs'}.` : `Extensive pan-India banking network.`,
    overviewDigital: meta.overviewDigital || `Provides industry-leading digital mobile banking app with instant debit card controls.`,
    overviewReputation: meta.overviewReputation || `Highly rated for financial stability, transparent fee schedules, and security standards.`,
    keyStrengths,
    considerations,
    bestForBadges,
    stats: {
      cardsAvailable: normalizedCards.length || 5,
      avgRating: `${avgRatingNum}/5.0`,
      interestRate: `${interestRate}% p.a.`,
      atmNetwork: meta.atmNetwork || "15,000+ ATMs",
      branches: meta.branches || "5,000+ Branches",
      customers: meta.customers || "50M+ Customers"
    },
    brandTheme: getBankBrandTheme(canonicalName),
    popularCards: normalizedCards.slice(0, 4)
  };
}
