/**
 * D.CARD DATA VALIDATION & SCHEMA NORMALIZATION UTILITY
 * Ensures all banking products have consistent structures, safe fallbacks,
 * valid numeric values, and non-empty display strings.
 */

export const NOT_AVAILABLE = "Information not available in provided source.";
export const NOT_SPECIFIED = "Debit card association not specified in provided data.";

export const VALID_SOURCE_TYPES = [
  "Official Bank Source",
  "Bank Verified",
  "Public/Third-party Source"
];

export const VALID_CARD_RELATIONSHIPS = [
  "included",
  "default",
  "optional",
  "eligibility_based",
  "not_specified"
];

/**
 * Safely parse a numeric value, returns fallback if NaN or null
 */
export function safeNumber(val, fallback = 0) {
  if (val === null || val === undefined || val === '') return fallback;
  if (typeof val === 'number') return isNaN(val) ? fallback : val;
  const cleaned = String(val).replace(/[^0-9.-]+/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? fallback : parsed;
}

/**
 * Safely get a string value or return fallback
 */
export function safeString(val, fallback = NOT_AVAILABLE) {
  if (val === null || val === undefined) return fallback;
  const str = String(val).trim();
  return str.length > 0 ? str : fallback;
}

/**
 * Safely format an array of string items
 */
export function safeStringArray(arr, fallback = []) {
  if (!Array.isArray(arr)) {
    if (typeof arr === 'string' && arr.trim()) {
      return [arr.trim()];
    }
    return fallback;
  }
  return arr.map(item => String(item).trim()).filter(Boolean);
}

/**
 * Normalizes verification source fields
 */
export function normalizeSourceInfo(data) {
  const officialSource = safeString(data.officialSource || data.officialSourceUrl || data.source, "");
  let sourceType = safeString(data.sourceType, officialSource ? "Official Bank Source" : "Public/Third-party Source");
  
  // Rule: Never display "Bank Verified" unless strictly verified
  if (sourceType === "Bank Verified" && !data.isBankVerified && !data.bankVerified) {
    sourceType = officialSource ? "Official Bank Source" : "Public/Third-party Source";
  }

  const lastVerified = safeString(data.lastVerified || data.as_of_date, "Recent");

  return {
    officialSource: officialSource || NOT_AVAILABLE,
    sourceType,
    lastVerified
  };
}

/**
 * Normalizes debit card relationship
 */
export function normalizeDebitCardRelationship(rel) {
  const raw = String(rel || '').toLowerCase().trim();
  if (raw === 'included' || raw === 'provided' || raw === 'complimentary') return 'included';
  if (raw === 'default') return 'default';
  if (raw === 'optional') return 'optional';
  if (raw === 'eligibility_based' || raw === 'upgrade') return 'eligibility_based';
  return 'not_specified';
}

/**
 * Validates and normalizes a Savings Account record
 */
export function validateSavingsAccount(account) {
  if (!account || typeof account !== 'object') return null;

  const bankName = safeString(account.bankName || account.bank_name || account.bank, "Partner Bank");
  const accountName = safeString(account.accountName || account.variant_name || account.name, "Savings Account");
  const accountType = safeString(account.accountType || account.account_type, "Regular Savings");
  const interestRate = safeString(account.interestRate || account.interest_rate, NOT_AVAILABLE);
  const minimumBalance = safeString(account.minimumBalance || account.minimum_balance, NOT_AVAILABLE);
  const nonMaintenanceCharge = safeString(account.nonMaintenanceCharge || account.non_maintenance_penalty || account.nonMaintenanceCharges, NOT_AVAILABLE);

  const sourceInfo = normalizeSourceInfo(account);

  return {
    ...account,
    id: account.id || account.product_id || `savings_${String(bankName).toLowerCase().replace(/\s+/g, '_')}_${Date.now()}`,
    product_id: account.product_id || account.id || `savings_${String(bankName).toLowerCase().replace(/\s+/g, '_')}`,
    bankName,
    bank: bankName,
    bank_name: bankName,
    accountName,
    variant_name: accountName,
    accountType,
    account_type: accountType,
    targetCustomer: safeString(account.targetCustomer || account.target_segment, "General Public"),
    interestRate,
    interest_rate: interestRate,
    minimumBalance,
    minimum_balance: minimumBalance,
    maximumBalance: safeString(account.maximumBalance || account.maximum_balance, "No Limit"),
    nonMaintenanceCharge,
    non_maintenance_penalty: nonMaintenanceCharge,
    eligibility: safeStringArray(account.eligibility, [NOT_AVAILABLE]),
    ageRequirement: safeString(account.ageRequirement, "18 years and above (Minors supported under guardian)"),
    openingRequirements: safeString(account.openingRequirements, "Valid PAN Card, Aadhaar Card, Address Proof"),
    
    // Limits and charges
    atmLimit: safeString(account.atmLimit, NOT_AVAILABLE),
    posLimit: safeString(account.posLimit, NOT_AVAILABLE),
    chequeBook: safeString(account.chequeBook, NOT_AVAILABLE),
    atmCharges: safeString(account.atmCharges, NOT_AVAILABLE),
    cashDepositRules: safeString(account.cashDepositRules, NOT_AVAILABLE),
    cashWithdrawalRules: safeString(account.cashWithdrawalRules, NOT_AVAILABLE),

    // Benefits
    keyBenefits: safeStringArray(account.keyBenefits || account.benefits, []),
    specialFeatures: safeStringArray(account.specialFeatures || account.features, []),
    importantConditions: safeString(account.importantConditions, NOT_AVAILABLE),

    // Verification
    ...sourceInfo
  };
}

/**
 * Validates and normalizes a Current Account record
 */
export function validateCurrentAccount(account) {
  if (!account || typeof account !== 'object') return null;

  const bankName = safeString(account.bankName || account.bank_name || account.bank, "Partner Bank");
  const accountName = safeString(account.accountName || account.variant_name || account.name, "Current Account");
  const accountType = safeString(account.accountType || account.account_type, "Standard Current Account");
  const minimumBalance = safeString(account.minimumBalance || account.minimum_balance, NOT_AVAILABLE);
  const averageBalanceRequirement = safeString(account.averageBalanceRequirement || account.averageMonthlyBalance || account.amb, minimumBalance);
  const nonMaintenanceCharge = safeString(account.nonMaintenanceCharge || account.non_maintenance_penalty || account.nonMaintenanceCharges, NOT_AVAILABLE);
  const interestRate = safeString(account.interestRate || account.interest_rate, "0% (Interest not permissible as per RBI guidelines)");

  const sourceInfo = normalizeSourceInfo(account);

  return {
    ...account,
    id: account.id || account.product_id || `current_${String(bankName).toLowerCase().replace(/\s+/g, '_')}_${Date.now()}`,
    product_id: account.product_id || account.id || `current_${String(bankName).toLowerCase().replace(/\s+/g, '_')}`,
    bankName,
    bank: bankName,
    bank_name: bankName,
    productType: "currentAccount",
    category: "current_account",
    accountName,
    variant_name: accountName,
    accountType,
    account_type: accountType,
    suitableFor: safeString(account.suitableFor, "Traders, Retailers, Professionals & MSMEs"),
    businessConstitution: safeStringArray(account.businessConstitution, [
      "Sole Proprietorship",
      "Partnership",
      "Private Limited Company",
      "LLP",
      "Trust / Association"
    ]),
    minimumBalance,
    minimum_balance: minimumBalance,
    averageBalanceRequirement,
    nonMaintenanceCharge,
    interestRate,
    eligibility: safeStringArray(account.eligibility, [
      "Resident Individual operating business",
      "Registered Firm / Entity with Valid Business Proof",
      "Valid PAN of entity or proprietor",
      "Entity Address Proof & Registration Certificate"
    ]),

    // Limits
    atmLimit: safeString(account.atmLimit, NOT_AVAILABLE),
    posLimit: safeString(account.posLimit, NOT_AVAILABLE),
    cashDepositLimit: safeString(account.cashDepositLimit, NOT_AVAILABLE),
    cashWithdrawalLimit: safeString(account.cashWithdrawalLimit, NOT_AVAILABLE),

    // Banking services
    chequeBook: safeString(account.chequeBook, NOT_AVAILABLE),
    freeChequeLeaves: safeString(account.freeChequeLeaves, NOT_AVAILABLE),
    branchTransactionRules: safeString(account.branchTransactionRules, NOT_AVAILABLE),
    neft: safeString(account.neft, "Free via Digital Banking"),
    rtgs: safeString(account.rtgs, "Free via Digital Banking"),
    imps: safeString(account.imps, "Standard nominal charges apply"),
    cashHandlingCharges: safeString(account.cashHandlingCharges, NOT_AVAILABLE),

    // Benefits
    keyBenefits: safeStringArray(account.keyBenefits || account.benefits, []),
    specialFeatures: safeStringArray(account.specialFeatures || account.features, []),
    importantConditions: safeString(account.importantConditions, "Standard KYC and entity documentation required."),

    // Verification
    ...sourceInfo
  };
}

/**
 * Validates and normalizes a Debit Card record
 */
export function validateDebitCard(card) {
  if (!card || typeof card !== 'object') return null;

  const bankName = safeString(card.bankName || card.bank_name || card.bank, "Partner Bank");
  const cardName = safeString(card.cardName || card.card_name || card.name, "Debit Card");
  const network = safeString(card.network, "RuPay / Visa / Mastercard");
  const annualFee = card.annualFee !== undefined ? card.annualFee : (card.annual_fee || NOT_AVAILABLE);
  const issuanceFee = card.issuanceFee !== undefined ? card.issuanceFee : (card.joiningFee || card.joining_fee || NOT_AVAILABLE);
  const replacementFee = safeString(card.replacementFee, "₹100–₹200 + GST");

  const sourceInfo = normalizeSourceInfo(card);

  return {
    ...card,
    id: card.id || card.card_id || `card_${String(bankName).toLowerCase().replace(/\s+/g, '_')}_${Date.now()}`,
    card_id: card.card_id || card.id || `card_${String(bankName).toLowerCase().replace(/\s+/g, '_')}`,
    bankName,
    bank: bankName,
    bank_name: bankName,
    cardName,
    name: cardName,
    card_name: cardName,
    network,
    issuanceFee,
    joiningFee: issuanceFee,
    annualFee,
    annual_fee: annualFee,
    replacementFee,
    atmLimit: safeString(card.atmLimit || card.atm_limit || card.cashWithdrawalLimit, NOT_AVAILABLE),
    posLimit: safeString(card.posLimit || card.pos_limit || card.purchaseLimit, NOT_AVAILABLE),
    ecommerceLimit: safeString(card.ecommerceLimit || card.purchaseLimit, safeString(card.posLimit || card.purchaseLimit, NOT_AVAILABLE)),
    loungeAccess: safeString(card.loungeAccess || card.lounge_access, "Not Available"),
    loungeSpendCriteria: safeString(card.loungeSpendCriteria, "As per quarterly bank merchant spend terms"),
    insurance: safeString(card.insurance, NOT_AVAILABLE),
    rewards: safeString(card.rewards || card.rewardPoints, NOT_AVAILABLE),
    fuelBenefits: safeString(card.fuelBenefits || card.fuelSurchargeWaiver, NOT_AVAILABLE),
    otherBenefits: safeStringArray(card.otherBenefits || card.bestFor, []),
    eligibility: safeString(card.eligibility, "Issued with linked bank account"),

    // Verification
    ...sourceInfo
  };
}
