/**
 * Centralized Bank Logo Mapping System for D.CARD
 * 
 * Provides safe bank name normalization, official logo URL resolution,
 * accessible alt text generation, and fallback handling.
 */

export const BANK_CANONICAL_NAMES = {
  SBI: "State Bank of India",
  HDFC: "HDFC Bank",
  ICICI: "ICICI Bank",
  AXIS: "Axis Bank",
  KOTAK: "Kotak Mahindra Bank",
  IDFC: "IDFC FIRST Bank",
  INDUSIND: "IndusInd Bank",
  PNB: "Punjab National Bank",
  BOB: "Bank of Baroda",
  CANARA: "Canara Bank",
  UNION: "Union Bank of India",
  BOI: "Bank of India",
  CENTRAL: "Central Bank of India",
  INDIAN: "Indian Bank",
  IOB: "Indian Overseas Bank",
  UCO: "UCO Bank",
  FEDERAL: "Federal Bank",
  YES: "Yes Bank",
  RBL: "RBL Bank",
  AU_SFB: "AU Small Finance Bank",
  EQUITAS: "Equitas Small Finance Bank",
  UJJIVAN: "Ujjivan Small Finance Bank",
  JANA: "Jana Small Finance Bank",
  ESAF: "ESAF Small Finance Bank",
  SURYODAY: "Suryoday Small Finance Bank",
  SOUTH_INDIAN: "South Indian Bank",
  KARNATAKA: "Karnataka Bank",
  CUB: "City Union Bank",
  DCB: "DCB Bank",
  FI: "Fi Money",
  JUPITER: "Jupiter",
  NIYO: "Niyo",
  FREO: "Freo",
  AIRTEL: "Airtel Payments Bank",
  INDIA_POST: "India Post Payments Bank",
  HSBC: "HSBC India",
  STANDARD_CHARTERED: "Standard Chartered",
  DBS: "DBS Bank India"
};

/**
 * Maps canonical bank names to official logo asset paths in /logos/
 */
export const bankLogos = {
  "State Bank of India": "/logos/sbi.svg",
  "HDFC Bank": "/logos/hdfc.svg",
  "ICICI Bank": "/logos/icici.svg",
  "Axis Bank": "/logos/axis.svg",
  "Kotak Mahindra Bank": "/logos/kotak.svg",
  "IDFC FIRST Bank": "/logos/idfc-first.svg",
  "IndusInd Bank": "/logos/indusind.svg",
  "Punjab National Bank": "/logos/pnb.svg",
  "Bank of Baroda": "/logos/bob.svg",
  "Canara Bank": "/logos/canara.svg",
  "Union Bank of India": "/logos/union.svg",
  "Bank of India": "/logos/boi.svg",
  "Central Bank of India": "/logos/central-bank.svg",
  "Indian Bank": "/logos/indian-bank.svg",
  "Indian Overseas Bank": "/logos/iob.svg",
  "UCO Bank": "/logos/uco.svg",
  "Federal Bank": "/logos/federal.svg",
  "Yes Bank": "/logos/yes-bank.svg",
  "RBL Bank": "/logos/rbl.svg",
  "AU Small Finance Bank": "/logos/au-sfb.svg",
  "Equitas Small Finance Bank": "/logos/equitas.svg",
  "Ujjivan Small Finance Bank": "/logos/ujjivan.svg",
  "Jana Small Finance Bank": "/logos/jana.svg",
  "ESAF Small Finance Bank": "/logos/esaf.svg",
  "Suryoday Small Finance Bank": "/logos/suryoday.svg",
  "South Indian Bank": "/logos/south-indian.svg",
  "Karnataka Bank": "/logos/karnataka.svg",
  "City Union Bank": "/logos/city-union.svg",
  "DCB Bank": "/logos/dcb.svg",
  "Fi Money": "/logos/fi-money.svg",
  "Jupiter": "/logos/jupiter.svg",
  "Niyo": "/logos/niyo.svg",
  "Freo": "/logos/freo.svg",
  "Airtel Payments Bank": "/logos/airtel.svg",
  "India Post Payments Bank": "/logos/india-post.svg",
  "HSBC India": "/logos/hsbc.svg",
  "Standard Chartered": "/logos/standard-chartered.svg",
  "DBS Bank India": "/logos/dbs.svg"
};

/**
 * Normalizes raw bank names and handles abbreviations/variations safely.
 * Specific compound bank names are evaluated before generic terms.
 */
export function normalizeBankName(rawName = "") {
  const name = String(rawName || "").trim();
  if (!name) return "";

  const lower = name.toLowerCase();

  // 1. Exact/Prefix matches for State Bank of India
  if (lower === "sbi" || lower.includes("state bank of india") || lower.startsWith("sbi ") || lower === "state bank") {
    return "State Bank of India";
  }

  // 2. HDFC Bank
  if (lower.includes("hdfc")) {
    return "HDFC Bank";
  }

  // 3. ICICI Bank
  if (lower.includes("icici")) {
    return "ICICI Bank";
  }

  // 4. Axis Bank
  if (lower === "axis" || lower.includes("axis bank") || lower.startsWith("axis ")) {
    return "Axis Bank";
  }

  // 5. Kotak Mahindra Bank
  if (lower.includes("kotak")) {
    return "Kotak Mahindra Bank";
  }

  // 6. IDFC FIRST Bank
  if (lower.includes("idfc")) {
    return "IDFC FIRST Bank";
  }

  // 7. IndusInd Bank
  if (lower.includes("indusind") || lower === "indus") {
    return "IndusInd Bank";
  }

  // 8. Punjab National Bank (PNB)
  if (lower.includes("punjab national") || lower === "pnb" || lower.startsWith("pnb ")) {
    return "Punjab National Bank";
  }

  // 9. Bank of Baroda (BOB)
  if (lower.includes("bank of baroda") || lower === "bob" || lower.startsWith("bob ")) {
    return "Bank of Baroda";
  }

  // 10. Canara Bank
  if (lower.includes("canara")) {
    return "Canara Bank";
  }

  // 11. City Union Bank (CUB) - MUST CHECK BEFORE Union Bank of India
  if (lower.includes("city union") || lower === "cub") {
    return "City Union Bank";
  }

  // 12. Union Bank of India (UBI)
  if (lower.includes("union bank") || lower === "ubi") {
    return "Union Bank of India";
  }

  // 13. South Indian Bank - MUST CHECK BEFORE Indian Bank
  if (lower.includes("south indian")) {
    return "South Indian Bank";
  }

  // 14. Indian Overseas Bank (IOB) - MUST CHECK BEFORE Indian Bank
  if (lower.includes("indian overseas") || lower === "iob") {
    return "Indian Overseas Bank";
  }

  // 15. Indian Bank
  if (lower.includes("indian bank") && !lower.includes("south") && !lower.includes("overseas")) {
    return "Indian Bank";
  }

  // 16. Central Bank of India - check before Bank of India
  if (lower.includes("central bank")) {
    return "Central Bank of India";
  }

  // 17. Bank of India (BOI) - ensure not State Bank / Union / Central
  if (lower === "boi" || (lower.includes("bank of india") && !lower.includes("state") && !lower.includes("central") && !lower.includes("union") && !lower.includes("south"))) {
    return "Bank of India";
  }

  // 18. UCO Bank
  if (lower.includes("uco")) {
    return "UCO Bank";
  }

  // 19. Federal Bank
  if (lower.includes("federal")) {
    return "Federal Bank";
  }

  // 20. Yes Bank
  if (lower.includes("yes bank") || lower === "yes") {
    return "Yes Bank";
  }

  // 21. RBL Bank
  if (lower.includes("rbl")) {
    return "RBL Bank";
  }

  // 22. AU Small Finance Bank
  if (lower.includes("au small") || lower.includes("au sfb") || lower === "au bank") {
    return "AU Small Finance Bank";
  }

  // 23. Equitas Small Finance Bank
  if (lower.includes("equitas")) {
    return "Equitas Small Finance Bank";
  }

  // 24. Ujjivan Small Finance Bank
  if (lower.includes("ujjivan")) {
    return "Ujjivan Small Finance Bank";
  }

  // 25. Jana Small Finance Bank
  if (lower.includes("jana")) {
    return "Jana Small Finance Bank";
  }

  // 26. ESAF Small Finance Bank
  if (lower.includes("esaf")) {
    return "ESAF Small Finance Bank";
  }

  // 27. Suryoday Small Finance Bank
  if (lower.includes("suryoday")) {
    return "Suryoday Small Finance Bank";
  }

  // 28. Karnataka Bank
  if (lower.includes("karnataka")) {
    return "Karnataka Bank";
  }

  // 29. DCB Bank
  if (lower.includes("dcb")) {
    return "DCB Bank";
  }

  // 30. Fi Money / Fi
  if (lower.includes("fi money") || lower === "fi") {
    return "Fi Money";
  }

  // 31. Jupiter
  if (lower.includes("jupiter")) {
    return "Jupiter";
  }

  // 32. Niyo
  if (lower.includes("niyo")) {
    return "Niyo";
  }

  // 33. Freo
  if (lower.includes("freo")) {
    return "Freo";
  }

  // 34. Airtel Payments Bank
  if (lower.includes("airtel")) {
    return "Airtel Payments Bank";
  }

  // 35. India Post Payments Bank (IPPB)
  if (lower.includes("india post") || lower.includes("post payments") || lower === "ippb") {
    return "India Post Payments Bank";
  }

  // 36. HSBC India
  if (lower.includes("hsbc")) {
    return "HSBC India";
  }

  // 37. Standard Chartered
  if (lower.includes("standard chartered") || lower.includes("stanchart")) {
    return "Standard Chartered";
  }

  // 38. DBS Bank
  if (lower.includes("dbs")) {
    return "DBS Bank India";
  }

  return name;
}

const loggedMissingBanks = new Set();

/**
 * Resolves a bank name to its logo URL and metadata.
 * Logs missing mappings during development.
 */
export function getBankLogoInfo(rawBankName = "") {
  const canonicalName = normalizeBankName(rawBankName);
  const logoUrl = bankLogos[canonicalName] || null;

  if (!logoUrl && canonicalName && process.env.NODE_ENV !== "production") {
    if (!loggedMissingBanks.has(canonicalName)) {
      loggedMissingBanks.add(canonicalName);
      console.warn(`[D.CARD BankLogo] No official logo mapped for bank: "${rawBankName}" (Canonical: "${canonicalName}")`);
    }
  }

  return {
    canonicalName: canonicalName || "Partner Bank",
    logoUrl,
    altText: `${canonicalName || "Bank"} logo`
  };
}

export default bankLogos;
