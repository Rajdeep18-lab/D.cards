/**
 * STEP 4: Savings Account → Debit Card Explicit Mappings Dataset
 *
 * Required Structure:
 * Bank → Savings Account → Debit Card
 *
 * For every relationship:
 * {
 *   "account_id": "specific-account-id",
 *   "card_id": "specific-card-id",
 *   "relationship": "provided" | "optional" | "upgrade",
 *   "verification_status": "verified" | "pending"
 * }
 */

export const accountDebitCardMappings = [
  // ==========================================
  // 1. STATE BANK OF INDIA (SBI)
  // ==========================================
  { account_id: "sbi-regular-savings", card_id: "sbi-classic-debit-card", relationship: "provided", verification_status: "verified" },
  { account_id: "sbi-regular-savings", card_id: "sbi-global-debit-card", relationship: "optional", verification_status: "verified" },
  { account_id: "1031", card_id: "sbi-classic-debit-card", relationship: "provided", verification_status: "verified" },
  { account_id: "1031", card_id: "sbi-global-debit-card", relationship: "optional", verification_status: "verified" },

  { account_id: "sbi-savings-plus", card_id: "sbi-global-debit-card", relationship: "provided", verification_status: "verified" },
  { account_id: "sbi-savings-plus", card_id: "sbi-platinum-debit-card", relationship: "upgrade", verification_status: "verified" },
  { account_id: "103", card_id: "sbi-global-debit-card", relationship: "provided", verification_status: "verified" },
  { account_id: "103", card_id: "sbi-platinum-debit-card", relationship: "upgrade", verification_status: "verified" },

  { account_id: "sbi-bsbda", card_id: "sbi-classic-debit-card", relationship: "provided", verification_status: "verified" },
  { account_id: "1032", card_id: "sbi-classic-debit-card", relationship: "provided", verification_status: "verified" },

  { account_id: "sbi-pehla-kadam-minor", card_id: "sbi-yuva-debit-card", relationship: "provided", verification_status: "verified" },
  { account_id: "115", card_id: "sbi-yuva-debit-card", relationship: "provided", verification_status: "verified" },

  // ==========================================
  // 2. HDFC BANK
  // ==========================================
  { account_id: "hdfc-regular-savings", card_id: "hdfc-bank-hdfc-millennia-debit-card", relationship: "provided", verification_status: "verified" },
  { account_id: "hdfc-regular-savings", card_id: "hdfc-bank-hdfc-easyshop-platinum-debit-card", relationship: "upgrade", verification_status: "verified" },
  { account_id: "1011", card_id: "hdfc-bank-hdfc-millennia-debit-card", relationship: "provided", verification_status: "verified" },
  { account_id: "1011", card_id: "hdfc-bank-hdfc-easyshop-platinum-debit-card", relationship: "upgrade", verification_status: "verified" },

  { account_id: "hdfc-savingsmax", card_id: "hdfc-bank-hdfc-easyshop-platinum-debit-card", relationship: "provided", verification_status: "verified" },
  { account_id: "101", card_id: "hdfc-bank-hdfc-easyshop-platinum-debit-card", relationship: "provided", verification_status: "verified" },

  { account_id: "hdfc-digisave-youth", card_id: "hdfc-bank-hdfc-millennia-debit-card", relationship: "provided", verification_status: "verified" },
  { account_id: "1012", card_id: "hdfc-bank-hdfc-millennia-debit-card", relationship: "provided", verification_status: "verified" },

  { account_id: "hdfc-womens-savings", card_id: "hdfc-bank-hdfc-easyshop-woman-s-advantage-debit-card", relationship: "provided", verification_status: "verified" },
  { account_id: "1013", card_id: "hdfc-bank-hdfc-easyshop-woman-s-advantage-debit-card", relationship: "provided", verification_status: "verified" },

  { account_id: "hdfc-senior-citizen", card_id: "hdfc-bank-hdfc-easyshop-platinum-debit-card", relationship: "provided", verification_status: "verified" },
  { account_id: "1014", card_id: "hdfc-bank-hdfc-easyshop-platinum-debit-card", relationship: "provided", verification_status: "verified" },

  { account_id: "hdfc-bsbda", card_id: "hdfc-bank-hdfc-moneyback-debit-card", relationship: "provided", verification_status: "verified" },
  { account_id: "1015", card_id: "hdfc-bank-hdfc-moneyback-debit-card", relationship: "provided", verification_status: "verified" },

  { account_id: "hdfc-nre-premium", card_id: "hdfc-bank-hdfc-easyshop-platinum-debit-card", relationship: "provided", verification_status: "verified" },
  { account_id: "116", card_id: "hdfc-bank-hdfc-easyshop-platinum-debit-card", relationship: "provided", verification_status: "verified" },

  // ==========================================
  // 3. ICICI BANK
  // ==========================================
  { account_id: "icici-regular-savings", card_id: "icici-bank-icici-coral-debit-card", relationship: "provided", verification_status: "verified" },
  { account_id: "icici-regular-savings", card_id: "icici-bank-icici-rubyx-debit-card", relationship: "upgrade", verification_status: "verified" },
  { account_id: "1021", card_id: "icici-bank-icici-coral-debit-card", relationship: "provided", verification_status: "verified" },
  { account_id: "1021", card_id: "icici-bank-icici-rubyx-debit-card", relationship: "upgrade", verification_status: "verified" },

  { account_id: "icici-mine-student", card_id: "icici-bank-icici-expressions-debit-card", relationship: "provided", verification_status: "verified" },
  { account_id: "102", card_id: "icici-bank-icici-expressions-debit-card", relationship: "provided", verification_status: "verified" },

  { account_id: "icici-salary-savings", card_id: "icici-bank-icici-coral-debit-card", relationship: "provided", verification_status: "verified" },
  { account_id: "1022", card_id: "icici-bank-icici-coral-debit-card", relationship: "provided", verification_status: "verified" },

  { account_id: "icici-advantage-woman", card_id: "icici-bank-icici-coral-debit-card", relationship: "provided", verification_status: "verified" },
  { account_id: "114", card_id: "icici-bank-icici-coral-debit-card", relationship: "provided", verification_status: "verified" },

  // ==========================================
  // 4. AXIS BANK
  // ==========================================
  { account_id: "axis-regular-savings", card_id: "axis-bank-delight-debit-card", relationship: "provided", verification_status: "verified" },
  { account_id: "axis-regular-savings", card_id: "axis-bank-priority-platinum-debit-card", relationship: "upgrade", verification_status: "verified" },
  { account_id: "1051", card_id: "axis-bank-delight-debit-card", relationship: "provided", verification_status: "verified" },
  { account_id: "1051", card_id: "axis-bank-priority-platinum-debit-card", relationship: "upgrade", verification_status: "verified" },

  { account_id: "axis-liberty", card_id: "axis-bank-liberty-debit-card", relationship: "provided", verification_status: "verified" },
  { account_id: "105", card_id: "axis-bank-liberty-debit-card", relationship: "provided", verification_status: "verified" },

  { account_id: "axis-basic-small", card_id: "axis-bank-delight-debit-card", relationship: "provided", verification_status: "verified" },
  { account_id: "117", card_id: "axis-bank-delight-debit-card", relationship: "provided", verification_status: "verified" },

  { account_id: "axis-prestige", card_id: "axis-bank-priority-platinum-debit-card", relationship: "provided", verification_status: "verified" },
  { account_id: "1052", card_id: "axis-bank-priority-platinum-debit-card", relationship: "provided", verification_status: "verified" },

  { account_id: "axis-senior-privilege", card_id: "axis-bank-rewards-plus-debit-card", relationship: "provided", verification_status: "verified" },
  { account_id: "1053", card_id: "axis-bank-rewards-plus-debit-card", relationship: "provided", verification_status: "verified" },

  { account_id: "axis-future-stars-minor", card_id: "axis-bank-delight-debit-card", relationship: "provided", verification_status: "verified" },
  { account_id: "1054", card_id: "axis-bank-delight-debit-card", relationship: "provided", verification_status: "verified" },

  // ==========================================
  // 5. KOTAK MAHINDRA BANK
  // ==========================================
  { account_id: "kotak-811-full-kyc", card_id: "kotak-mahindra-bank-kotak-811-debit-card", relationship: "provided", verification_status: "verified" },
  { account_id: "104", card_id: "kotak-mahindra-bank-kotak-811-debit-card", relationship: "provided", verification_status: "verified" },

  { account_id: "kotak-811-edge", card_id: "kotak-mahindra-bank-kotak-pro-debit-card", relationship: "provided", verification_status: "verified" },
  { account_id: "1041", card_id: "kotak-mahindra-bank-kotak-pro-debit-card", relationship: "provided", verification_status: "verified" },

  { account_id: "kotak-811-super", card_id: "kotak-mahindra-bank-kotak-platinum-debit-card", relationship: "provided", verification_status: "verified" },
  { account_id: "1042", card_id: "kotak-mahindra-bank-kotak-platinum-debit-card", relationship: "provided", verification_status: "verified" },

  { account_id: "kotak-activemoney", card_id: "kotak-mahindra-bank-kotak-ace-debit-card", relationship: "provided", verification_status: "verified" },
  { account_id: "1043", card_id: "kotak-mahindra-bank-kotak-ace-debit-card", relationship: "provided", verification_status: "verified" },

  // ==========================================
  // 6. IDFC FIRST BANK (Strict Same-Bank Mappings Only)
  // ==========================================
  { account_id: "idfc-first-classic", card_id: "idfc-first-bank-idfc-first-classic-debit-card", relationship: "provided", verification_status: "verified" },
  { account_id: "106", card_id: "idfc-first-bank-idfc-first-classic-debit-card", relationship: "provided", verification_status: "verified" },

  { account_id: "idfc-first-select", card_id: "idfc-first-bank-idfc-first-select-debit-card", relationship: "provided", verification_status: "verified" },
  { account_id: "107", card_id: "idfc-first-bank-idfc-first-select-debit-card", relationship: "provided", verification_status: "verified" },

  { account_id: "idfc-first-wealth", card_id: "idfc-first-bank-idfc-first-world-debit-card", relationship: "provided", verification_status: "verified" },
  { account_id: "108", card_id: "idfc-first-bank-idfc-first-world-debit-card", relationship: "provided", verification_status: "verified" },

  { account_id: "idfc-first-senior", card_id: "idfc-first-bank-idfc-first-millennia-debit-card", relationship: "provided", verification_status: "verified" },
  { account_id: "109", card_id: "idfc-first-bank-idfc-first-millennia-debit-card", relationship: "provided", verification_status: "verified" },

  // ==========================================
  // 7. OTHER BANKS
  // ==========================================
  { account_id: "au-digital-savings", card_id: "au-small-finance-bank-au-bank-platinum-debit-card", relationship: "provided", verification_status: "verified" },
  { account_id: "110", card_id: "au-small-finance-bank-au-bank-platinum-debit-card", relationship: "provided", verification_status: "verified" },

  { account_id: "bob-advantage-savings", card_id: "bank-of-baroda-bob-rupay-platinum-debit-card", relationship: "provided", verification_status: "verified" },
  { account_id: "111", card_id: "bank-of-baroda-bob-rupay-platinum-debit-card", relationship: "provided", verification_status: "verified" },

  { account_id: "indusind-privilege-savings", card_id: "indusind-bank-indusind-platinum-debit-card", relationship: "provided", verification_status: "verified" },
  { account_id: "112", card_id: "indusind-bank-indusind-platinum-debit-card", relationship: "provided", verification_status: "verified" },

  { account_id: "fi-money-smart-digital", card_id: "fi-money-fi-debit-card", relationship: "provided", verification_status: "verified" },
  { account_id: "113", card_id: "fi-money-fi-debit-card", relationship: "provided", verification_status: "verified" }
];

/**
 * Retrieve raw explicit mapping entries for a specific savings account
 */
export function getAccountDebitCardMappings(accountOrId) {
  if (!accountOrId) return [];

  let productId = "";
  let numericId = "";

  if (typeof accountOrId === "object" && accountOrId !== null) {
    productId = String(accountOrId.product_id || "").toLowerCase();
    numericId = String(accountOrId.id || "").toLowerCase();
  } else {
    productId = String(accountOrId).toLowerCase();
    numericId = String(accountOrId).toLowerCase();
  }

  return accountDebitCardMappings.filter((m) => {
    const target = String(m.account_id || "").toLowerCase();
    return target === productId || target === numericId;
  });
}
