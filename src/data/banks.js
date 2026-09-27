/**
 * ==============================================================================
 * D.CARD - CENTRALIZED BANK DIRECTORY DATA SOURCE
 * ==============================================================================
 * Authoritative, stable bank definitions with verified identifiers, logos,
 * and canonical naming across D.CARD features.
 * ==============================================================================
 */

export const BANKS = [
  {
    bankId: "sbi",
    bankName: "State Bank of India",
    shortName: "SBI",
    logo: "/logos/sbi.svg",
    color: "#1a4480",
    aliases: ["sbi", "state bank", "state bank of india"]
  },
  {
    bankId: "hdfc",
    bankName: "HDFC Bank",
    shortName: "HDFC",
    logo: "/logos/hdfc.svg",
    color: "#004c8f",
    aliases: ["hdfc", "hdfc bank"]
  },
  {
    bankId: "icici",
    bankName: "ICICI Bank",
    shortName: "ICICI",
    logo: "/logos/icici.svg",
    color: "#a9211a",
    aliases: ["icici", "icici bank"]
  },
  {
    bankId: "axis",
    bankName: "Axis Bank",
    shortName: "Axis",
    logo: "/logos/axis.svg",
    color: "#97144d",
    aliases: ["axis", "axis bank", "uti bank"]
  },
  {
    bankId: "kotak",
    bankName: "Kotak Mahindra Bank",
    shortName: "Kotak",
    logo: "/logos/kotak.svg",
    color: "#ed1c24",
    aliases: ["kotak", "kotak mahindra", "kotak bank"]
  },
  {
    bankId: "pnb",
    bankName: "Punjab National Bank",
    shortName: "PNB",
    logo: "/logos/pnb.svg",
    color: "#a20a3a",
    aliases: ["pnb", "punjab national bank"]
  },
  {
    bankId: "bob",
    bankName: "Bank of Baroda",
    shortName: "Bank of Baroda",
    logo: "/logos/bob.svg",
    color: "#f26522",
    aliases: ["bob", "baroda", "bank of baroda"]
  },
  {
    bankId: "canara",
    bankName: "Canara Bank",
    shortName: "Canara",
    logo: "/logos/canara.svg",
    color: "#0091da",
    aliases: ["canara", "canara bank"]
  },
  {
    bankId: "union",
    bankName: "Union Bank of India",
    shortName: "Union Bank",
    logo: "/logos/union.svg",
    color: "#005a9c",
    aliases: ["union", "union bank", "union bank of india"]
  },
  {
    bankId: "idfc",
    bankName: "IDFC FIRST Bank",
    shortName: "IDFC FIRST",
    logo: "/logos/idfc-first.svg",
    color: "#991b1e",
    aliases: ["idfc", "idfc first", "idfc bank", "idfc_first", "idfc-first"]
  },
  {
    bankId: "indusind",
    bankName: "IndusInd Bank",
    shortName: "IndusInd",
    logo: "/logos/indusind.svg",
    color: "#861f41",
    aliases: ["indusind", "indusind bank"]
  },
  {
    bankId: "federal",
    bankName: "Federal Bank",
    shortName: "Federal Bank",
    logo: "/logos/federal.svg",
    color: "#004b87",
    aliases: ["federal", "federal bank"]
  },
  {
    bankId: "yes",
    bankName: "Yes Bank",
    shortName: "Yes Bank",
    logo: "/logos/yes-bank.svg",
    color: "#003b70",
    aliases: ["yes", "yes bank"]
  },
  {
    bankId: "rbl",
    bankName: "RBL Bank",
    shortName: "RBL Bank",
    logo: "/logos/rbl.svg",
    color: "#1e3a8a",
    aliases: ["rbl", "rbl bank", "ratnakar"]
  },
  {
    bankId: "au",
    bankName: "AU Small Finance Bank",
    shortName: "AU Small Finance",
    logo: "/logos/au-sfb.svg",
    color: "#6b21a8",
    aliases: ["au", "au sfb", "au small finance", "au bank"]
  },
  {
    bankId: "boi",
    bankName: "Bank of India",
    shortName: "Bank of India",
    logo: "/logos/boi.svg",
    color: "#d97706",
    aliases: ["boi", "bank of india"]
  },
  {
    bankId: "central",
    bankName: "Central Bank of India",
    shortName: "Central Bank",
    logo: "/logos/central-bank.svg",
    color: "#dc2626",
    aliases: ["central", "central bank", "central bank of india"]
  },
  {
    bankId: "indian",
    bankName: "Indian Bank",
    shortName: "Indian Bank",
    logo: "/logos/indian-bank.svg",
    color: "#2563eb",
    aliases: ["indian bank", "allahabad bank"]
  },
  {
    bankId: "uco",
    bankName: "UCO Bank",
    shortName: "UCO Bank",
    logo: "/logos/uco.svg",
    color: "#059669",
    aliases: ["uco", "uco bank"]
  },
  {
    bankId: "psb",
    bankName: "Punjab & Sind Bank",
    shortName: "Punjab & Sind",
    logo: "/logos/pnb.svg",
    color: "#b45309",
    aliases: ["psb", "punjab & sind bank", "punjab and sind"]
  },
  {
    bankId: "idbi",
    bankName: "IDBI Bank",
    shortName: "IDBI Bank",
    logo: "/logos/idbi.svg",
    color: "#0f766e",
    aliases: ["idbi", "idbi bank"]
  }
];

// Quick index caches
const bankIdMap = new Map();
const bankNameMap = new Map();

BANKS.forEach(bank => {
  bankIdMap.set(bank.bankId.toLowerCase(), bank);
  bankNameMap.set(bank.bankName.toLowerCase(), bank);
  bankNameMap.set(bank.shortName.toLowerCase(), bank);
  if (Array.isArray(bank.aliases)) {
    bank.aliases.forEach(alias => {
      bankNameMap.set(alias.toLowerCase(), bank);
    });
  }
});

/**
 * Get bank object by stable bankId
 * @param {string} bankId 
 * @returns {Object|null}
 */
export function getBankById(bankId) {
  if (!bankId) return null;
  return bankIdMap.get(String(bankId).trim().toLowerCase()) || null;
}

/**
 * Get bank object by bank name, short name, or alias
 * @param {string} name 
 * @returns {Object|null}
 */
export function getBankByName(name) {
  if (!name) return null;
  const clean = String(name).trim().toLowerCase();
  return bankNameMap.get(clean) || null;
}

/**
 * Normalize bank name or alias into a stable bankId
 * @param {string} input 
 * @returns {string|null}
 */
export function normalizeBankId(input) {
  if (!input) return null;
  const clean = String(input).trim().toLowerCase();
  if (bankIdMap.has(clean)) return clean;
  const matched = bankNameMap.get(clean);
  return matched ? matched.bankId : null;
}
