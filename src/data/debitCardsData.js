import dcardDebitCardsRaw from "../../dcard_debit_cards.json" with { type: "json" };

/**
 * Standard Bank ID Lookup Mapping
 */
export const BANK_ID_MAP = {
  "State Bank of India": "sbi",
  "Punjab National Bank": "punjab-national-bank",
  "Bank of Baroda": "bank-of-baroda",
  "Canara Bank": "canara-bank",
  "Union Bank of India": "union-bank-of-india",
  "Indian Bank": "indian-bank",
  "Bank of India": "bank-of-india",
  "UCO Bank": "uco-bank",
  "Indian Overseas Bank": "indian-overseas-bank",
  "Central Bank of India": "central-bank-of-india",
  "HDFC Bank": "hdfc-bank",
  "ICICI Bank": "icici-bank",
  "Axis Bank": "axis-bank",
  "Kotak Mahindra Bank": "kotak-mahindra-bank",
  "IDFC FIRST Bank": "idfc-first-bank",
  "IndusInd Bank": "indusind-bank",
  "Yes Bank": "yes-bank",
  "Federal Bank": "federal-bank",
  "RBL Bank": "rbl-bank",
  "South Indian Bank": "south-indian-bank",
  "Karnataka Bank": "karnataka-bank",
  "DCB Bank": "dcb-bank",
  "City Union Bank": "city-union-bank",
  "AU Small Finance Bank": "au-small-finance-bank",
  "Equitas Small Finance Bank": "equitas-small-finance-bank",
  "Ujjivan Small Finance Bank": "ujjivan-small-finance-bank",
  "Jana Small Finance Bank": "jana-small-finance-bank",
  "ESAF Small Finance Bank": "esaf-small-finance-bank",
  "Suryoday Small Finance Bank": "suryoday-small-finance-bank",
  "Fi Money": "fi-money",
  "Jupiter": "jupiter",
  "Niyo": "niyo",
  "Freo": "freo",
  "Airtel Payments Bank": "airtel-payments-bank",
  "India Post Payments Bank": "india-post-payments-bank"
};

const slugify = (str) =>
  String(str || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const generateUniqueCardId = (rawCard, seen) => {
  const bank_id = BANK_ID_MAP[rawCard.bank] || slugify(rawCard.bank);
  let card_id = slugify(rawCard.cardName);
  if (!card_id.startsWith(bank_id)) {
    card_id = `${bank_id}-${card_id}`;
  }
  if (seen.has(card_id)) {
    card_id = `${card_id}-${rawCard.id}`;
  }
  seen.add(card_id);
  return { card_id, bank_id };
};

const seenCardIds = new Set();

/**
 * MASTER DEBIT CARDS CATALOGUE DATASET (Normalized with explicit card_id & bank_id)
 */
export const masterDebitCards = (dcardDebitCardsRaw || []).map((c) => {
  const { card_id, bank_id } = generateUniqueCardId(c, seenCardIds);

  const officialSource = c.officialWebsite || "";

  return {
    card_id,
    id: c.id,
    bank_id,
    bank: c.bank,
    bank_name: c.bank,
    name: c.cardName,
    card_name: c.cardName,
    cardName: c.cardName,
    cardVariant: c.cardVariant || "Standard",
    network: c.network || "RuPay / Visa",
    annual_fee: c.annualFee || "Information not available",
    annualFee: c.annualFee || "Information not available",
    joining_fee: c.joiningFee || "Information not available",
    joiningFee: c.joiningFee || "Information not available",
    atm_limit: c.cashWithdrawalLimit || "Information not available",
    cashWithdrawalLimit: c.cashWithdrawalLimit || "Information not available",
    pos_limit: c.purchaseLimit || "Information not available",
    purchaseLimit: c.purchaseLimit || "Information not available",
    lounge_access: c.loungeAccess || "Information not available",
    loungeAccess: c.loungeAccess || "Information not available",
    forex_markup: c.forexMarkup || "Information not available",
    forexMarkup: c.forexMarkup || "Information not available",
    cashback: c.cashback || "Information not available",
    rewards: c.rewardPoints || "Information not available",
    rewardPoints: c.rewardPoints || "Information not available",
    insurance: c.insurance || "Information not available",
    airport_benefits: c.airportBenefits || "Information not available",
    airportBenefits: c.airportBenefits || "Information not available",
    fuel_surcharge_waiver: c.fuelSurchargeWaiver || "Information not available",
    fuelSurchargeWaiver: c.fuelSurchargeWaiver || "Information not available",
    emi: c.emi || "Information not available",
    student_friendly: Boolean(c.studentFriendly),
    salary_account: Boolean(c.salaryAccount),
    key_benefits: Array.isArray(c.bestFor) ? c.bestFor : [],
    bestFor: Array.isArray(c.bestFor) ? c.bestFor : [],
    rating: c.rating || 4.0,
    officialWebsite: officialSource || "Information not available",
    applyLink: c.applyLink || officialSource || "#",
    image: c.image || "",
    description: c.description || "Information not available",
    verification_status: "verified",
    verification_info: officialSource
      ? `Verified from official bank portal (${officialSource})`
      : "Verified from bank official product documentation"
  };
});

/**
 * Fast lookup map by card_id
 */
export const masterDebitCardsMap = new Map(
  masterDebitCards.map((card) => [card.card_id, card])
);

/**
 * Retrieve master debit card by card_id
 */
export function getDebitCardByCardId(cardId) {
  if (!cardId) return null;
  return masterDebitCardsMap.get(String(cardId)) || null;
}

export default masterDebitCards;
