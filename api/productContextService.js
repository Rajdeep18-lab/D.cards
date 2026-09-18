import { savingsAccounts, getAssociatedDebitCards } from '../src/data/savingsAccounts/index.js';
import { currentAccounts, getAssociatedDebitCardsForCurrentAccount } from '../src/data/currentAccounts/index.js';
import { allMasterDebitCards } from '../src/data/debitCardsData.js';
import { bankCards } from '../src/data/mockData.js';

/**
 * Bank keyword lookup table for detecting bank mentions in user queries
 */
const BANK_LOOKUP = [
  { keys: ['sbi', 'state bank', 'state bank of india'], canonical: 'State Bank of India' },
  { keys: ['hdfc', 'hdfc bank'], canonical: 'HDFC Bank' },
  { keys: ['icici', 'icici bank'], canonical: 'ICICI Bank' },
  { keys: ['axis', 'axis bank'], canonical: 'Axis Bank' },
  { keys: ['kotak', 'kotak mahindra', 'kotak bank'], canonical: 'Kotak Mahindra Bank' },
  { keys: ['idfc', 'idfc first', 'idfc first bank'], canonical: 'IDFC FIRST Bank' },
  { keys: ['indusind', 'indusind bank'], canonical: 'IndusInd Bank' },
  { keys: ['pnb', 'punjab national', 'punjab national bank'], canonical: 'Punjab National Bank' },
  { keys: ['bob', 'bank of baroda', 'baroda'], canonical: 'Bank of Baroda' },
  { keys: ['canara', 'canara bank'], canonical: 'Canara Bank' },
  { keys: ['union bank', 'union bank of india'], canonical: 'Union Bank of India' },
  { keys: ['indian bank'], canonical: 'Indian Bank' },
  { keys: ['bank of india', 'boi'], canonical: 'Bank of India' },
  { keys: ['federal', 'federal bank'], canonical: 'Federal Bank' },
  { keys: ['rbl', 'rbl bank'], canonical: 'RBL Bank' },
  { keys: ['yes bank'], canonical: 'Yes Bank' },
  { keys: ['au small', 'au bank', 'au small finance'], canonical: 'AU Small Finance Bank' },
  { keys: ['equitas', 'equitas small finance'], canonical: 'Equitas Small Finance Bank' },
  { keys: ['ujjivan', 'ujjivan small finance'], canonical: 'Ujjivan Small Finance Bank' },
  { keys: ['fi money', 'fi'], canonical: 'Fi Money' },
  { keys: ['jupiter'], canonical: 'Jupiter' },
  { keys: ['niyo'], canonical: 'Niyo' },
  { keys: ['freo'], canonical: 'Freo' },
  { keys: ['airtel', 'airtel payments bank'], canonical: 'Airtel Payments Bank' },
  { keys: ['india post', 'ippb', 'post bank'], canonical: 'India Post Payments Bank' }
];

/**
 * Detect banks mentioned in a query
 */
export function detectBanksInQuery(queryText = '') {
  const lower = String(queryText).toLowerCase();
  const matched = new Set();

  for (const entry of BANK_LOOKUP) {
    for (const k of entry.keys) {
      const regex = new RegExp(`\\b${k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
      if (regex.test(lower)) {
        matched.add(entry.canonical);
        break;
      }
    }
  }

  return Array.from(matched);
}

/**
 * Search and filter relevant D.CARD products for AI prompt grounding
 */
export function getRelevantProductsForAI(query = '', conversationState = {}) {
  const cleanQuery = String(query || '').trim();
  const lower = cleanQuery.toLowerCase();

  // Detect banks from query or fallback to conversation history
  const queryBanks = detectBanksInQuery(lower);
  const targetBanks = queryBanks.length > 0 
    ? queryBanks 
    : (conversationState.lastMentionedBank ? [conversationState.lastMentionedBank] : []);

  // Intent flags
  const wantsZeroBalance = lower.includes('zero balance') || lower.includes('zero min') || lower.includes('0 balance') || lower.includes('no minimum balance') || lower.includes('zero mab') || lower.includes('zero amb');
  const wantsLowBalance = lower.includes('low minimum') || lower.includes('low balance') || lower.includes('lowest balance');
  const wantsStudent = lower.includes('student') || lower.includes('college') || lower.includes('youth');
  const wantsSalary = lower.includes('salary') || lower.includes('payroll') || lower.includes('corporate');
  const wantsSenior = lower.includes('senior') || lower.includes('pension') || lower.includes('elderly');
  const wantsWomen = lower.includes('women') || lower.includes('woman') || lower.includes('female');
  const wantsOnlineKYC = lower.includes('online') || lower.includes('video kyc') || lower.includes('digital') || lower.includes('instant open');
  const wantsLounge = lower.includes('lounge') || lower.includes('airport');
  const wantsZeroFeeCard = lower.includes('zero fee') || lower.includes('free card') || lower.includes('no annual fee');
  const wantsHighLimits = lower.includes('atm limit') || lower.includes('withdrawal limit') || lower.includes('high limit') || lower.includes('pos limit');
  const wantsCurrentAccount = lower.includes('current account') || lower.includes('current accounts') || lower.includes('business account') || lower.includes('overdraft') || lower.includes('cheque');
  const wantsDebitCard = lower.includes('debit card') || lower.includes('debit cards') || lower.includes('card') || lower.includes('visa') || lower.includes('rupay') || lower.includes('mastercard') || wantsLounge || wantsZeroFeeCard;
  const isComparison = lower.includes('compare') || lower.includes('vs') || lower.includes('versus') || lower.includes('difference between');

  // --- 1. Filter Savings Accounts ---
  let matchingSavings = (savingsAccounts || []).map(acc => {
    let score = 0;
    const accNameLower = String(acc.accountName || '').toLowerCase();
    const bankLower = String(acc.bank || '').toLowerCase();
    const typeLower = String(acc.accountType || '').toLowerCase();

    // Bank match
    if (targetBanks.length > 0) {
      if (targetBanks.some(b => bankLower.includes(b.toLowerCase()) || b.toLowerCase().includes(bankLower))) {
        score += 15;
      } else {
        // Penalty if explicit banks were asked and this account does not match
        score -= 20;
      }
    }

    // Direct account name match
    if (lower.includes(accNameLower) || accNameLower.split(' ').some(w => w.length > 3 && lower.includes(w))) {
      score += 20;
    }

    // Zero balance match
    if (wantsZeroBalance) {
      if (acc.isZeroBalance || acc.minimumBalanceValue === 0 || String(acc.minimumBalance || '').toLowerCase().includes('zero')) {
        score += 25;
      } else {
        score -= 15;
      }
    }

    // Low balance match
    if (wantsLowBalance) {
      if (acc.minimumBalanceValue !== undefined && acc.minimumBalanceValue <= 2500) {
        score += 15;
      }
    }

    // Specific category match
    if (wantsStudent && (acc.isStudent || typeLower.includes('student') || accNameLower.includes('student'))) score += 20;
    if (wantsSalary && (acc.isSalary || typeLower.includes('salary') || accNameLower.includes('salary'))) score += 20;
    if (wantsSenior && (acc.isSeniorCitizen || typeLower.includes('senior') || accNameLower.includes('senior'))) score += 20;
    if (wantsWomen && (acc.isWomenSpecial || typeLower.includes('women') || accNameLower.includes('women'))) score += 20;
    if (wantsOnlineKYC && (acc.isOnlineOpening || acc.isDigital)) score += 12;

    // Attached verified debit cards
    const verifiedCards = getAssociatedDebitCards(acc);

    return {
      account: acc,
      verifiedCards,
      score
    };
  })
  .filter(item => item.score > 0)
  .sort((a, b) => b.score - a.score)
  .slice(0, isComparison ? 4 : 5)
  .map(item => item.account);

  // If no specific filters matched but query asked about savings
  if (matchingSavings.length === 0 && (lower.includes('saving') || lower.includes('account') || targetBanks.length > 0)) {
    matchingSavings = (savingsAccounts || []).filter(acc => {
      if (targetBanks.length > 0) {
        return targetBanks.some(b => String(acc.bank).toLowerCase().includes(b.toLowerCase()));
      }
      return true;
    }).slice(0, 4);
  }

  // --- 2. Filter Current Accounts ---
  let matchingCurrent = [];
  if (wantsCurrentAccount || (targetBanks.length > 0 && !wantsDebitCard)) {
    matchingCurrent = (currentAccounts || []).map(acc => {
      let score = 0;
      const accNameLower = String(acc.accountName || '').toLowerCase();
      const bankLower = String(acc.bank || '').toLowerCase();

      if (targetBanks.length > 0) {
        if (targetBanks.some(b => bankLower.includes(b.toLowerCase()) || b.toLowerCase().includes(bankLower))) {
          score += 15;
        } else {
          score -= 20;
        }
      }

      if (lower.includes(accNameLower) || accNameLower.split(' ').some(w => w.length > 3 && lower.includes(w))) {
        score += 20;
      }

      if (wantsCurrentAccount) score += 10;

      return {
        account: acc,
        verifiedCards: getAssociatedDebitCardsForCurrentAccount(acc),
        score
      };
    })
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(item => item.account);
  }

  // --- 3. Filter Debit Cards ---
  let matchingDebitCards = (allMasterDebitCards || []).map(card => {
    let score = 0;
    const cardNameLower = String(card.cardName || '').toLowerCase();
    const bankLower = String(card.bank || '').toLowerCase();
    const networkLower = String(card.network || '').toLowerCase();
    const loungeLower = String(card.loungeAccess || '').toLowerCase();

    if (targetBanks.length > 0) {
      if (targetBanks.some(b => bankLower.includes(b.toLowerCase()) || b.toLowerCase().includes(bankLower))) {
        score += 15;
      } else {
        score -= 15;
      }
    }

    if (lower.includes(cardNameLower) || cardNameLower.split(' ').some(w => w.length > 3 && lower.includes(w))) {
      score += 20;
    }

    if (wantsLounge) {
      if (loungeLower.includes('lounge') || loungeLower.includes('quarter') || loungeLower.includes('yes') || loungeLower.includes('complimentary')) {
        score += 25;
      } else {
        score -= 20;
      }
    }

    if (wantsZeroFeeCard) {
      if (card.annualFee === 0 || String(card.annualFee).toLowerCase().includes('free')) {
        score += 20;
      }
    }

    if (lower.includes('rupay') && networkLower.includes('rupay')) score += 15;
    if (lower.includes('visa') && networkLower.includes('visa')) score += 15;
    if (lower.includes('mastercard') && networkLower.includes('mastercard')) score += 15;

    if (wantsHighLimits) {
      const atm = card.limits?.atmLimit || card.atmLimit || 0;
      if (Number(atm) >= 100000) score += 15;
    }

    return { card, score };
  })
  .filter(item => item.score > 0)
  .sort((a, b) => b.score - a.score)
  .slice(0, 5)
  .map(item => item.card);

  // If no debit cards matched directly but user asked about cards from target banks
  if (matchingDebitCards.length === 0 && (wantsDebitCard || targetBanks.length > 0)) {
    matchingDebitCards = (allMasterDebitCards || []).filter(c => {
      if (targetBanks.length > 0) {
        return targetBanks.some(b => String(c.bank).toLowerCase().includes(b.toLowerCase()));
      }
      return true;
    }).slice(0, 4);
  }

  // --- 4. Matching Banks ---
  const matchingBanks = (bankCards || []).filter(b => {
    if (targetBanks.length > 0) {
      return targetBanks.some(tb => String(b.name).toLowerCase().includes(tb.toLowerCase()) || String(b.shortName).toLowerCase().includes(tb.toLowerCase()));
    }
    return false;
  }).slice(0, 2);

  return {
    savingsAccounts: matchingSavings,
    currentAccounts: matchingCurrent,
    debitCards: matchingDebitCards,
    banks: matchingBanks,
    detectedBanks: targetBanks
  };
}

/**
 * Formats retrieved verified products into a clean, compact prompt context string for Gemini
 */
export function buildPromptContext(productsData) {
  const { savingsAccounts: savings = [], currentAccounts: currents = [], debitCards: cards = [], banks = [] } = productsData;

  const sections = [];

  // 1. Savings Accounts with strictly verified associated debit cards
  if (savings.length > 0) {
    const savingsLines = savings.map(s => {
      const associated = getAssociatedDebitCards(s);
      const cardStr = associated.length > 0
        ? associated.map(c => `[Card: "${c.cardName}" (${c.network || 'RuPay/Visa'}) | Annual Fee: ${c.annualFee !== undefined ? (c.annualFee === 0 ? 'Free' : `₹${c.annualFee}`) : 'Not specified'} | ATM: ₹${(c.limits?.atmLimit || c.atmLimit || 50000).toLocaleString('en-IN')}/day | Lounge: ${c.loungeAccess || 'No'}]`).join(', ')
        : 'No specific debit card associated in current D.CARD data';

      return [
        `- Product: "${s.accountName}"`,
        `  Bank: ${s.bank}`,
        `  Product ID: ${s.product_id || s.id}`,
        `  Account Category: ${s.accountType || 'Savings'}`,
        `  Minimum Balance: ${s.minimumBalance || 'Not specified'} (Zero Balance: ${s.isZeroBalance ? 'Yes' : 'No'})`,
        `  Interest Rate: ${s.interestRate || 'Not specified'}`,
        `  Online Opening (Video KYC): ${s.isOnlineOpening ? 'Yes' : 'No'}`,
        `  Non-Maintenance Penalty: ${s.penaltyCharges || s.penalty || 'As per bank schedule'}`,
        `  Eligibility: ${s.eligibility || 'Indian Resident'}`,
        `  Key Highlights: ${(s.keyBenefits || []).join('; ') || 'Standard banking facilities'}`,
        `  STRICT LINKED DEBIT CARD: ${cardStr}`,
        `  Official Source URL: ${s.official_source_url || 'Available on official bank portal'}`
      ].join('\n');
    });

    sections.push(`VERIFIED D.CARD SAVINGS ACCOUNTS:\n${savingsLines.join('\n\n')}`);
  }

  // 2. Current Accounts with strictly verified associated debit cards
  if (currents.length > 0) {
    const currentLines = currents.map(c => {
      const associated = getAssociatedDebitCardsForCurrentAccount(c);
      const cardStr = associated.length > 0
        ? associated.map(card => `[Card: "${card.cardName}" (${card.network || 'Business Debit'}) | Annual Fee: ₹${card.annualFee || 'Free'}]`).join(', ')
        : 'Business debit card as per bank variant';

      return [
        `- Product: "${c.accountName}"`,
        `  Bank: ${c.bank}`,
        `  Product ID: ${c.product_id || c.id}`,
        `  Monthly Average Balance (MAB): ${c.monthly_average_balance || c.minimum_balance || 'Not specified'}`,
        `  Cash Deposit Limit: ${c.cash_deposit_limit || 'Standard limits apply'}`,
        `  Free Cheque Leaves: ${c.free_cheque_leaves || 'Available'}`,
        `  Key Features: ${(c.features || c.keyBenefits || []).join('; ') || 'Business current account perks'}`,
        `  STRICT LINKED DEBIT CARD: ${cardStr}`,
        `  Official Source URL: ${c.official_source_url || 'Available on official bank portal'}`
      ].join('\n');
    });

    sections.push(`VERIFIED D.CARD CURRENT ACCOUNTS:\n${currentLines.join('\n\n')}`);
  }

  // 3. Debit Cards
  if (cards.length > 0) {
    const cardLines = cards.map(c => {
      const atm = typeof c.limits?.atmLimit === 'number' ? `₹${c.limits.atmLimit.toLocaleString('en-IN')}/day` : (c.atmLimit ? `₹${c.atmLimit}/day` : '₹50,000/day');
      const pos = typeof c.limits?.posLimit === 'number' ? `₹${c.limits.posLimit.toLocaleString('en-IN')}/day` : (c.posLimit ? `₹${c.posLimit}/day` : '₹100,000/day');
      const fee = c.annualFee === 0 || String(c.annualFee).toLowerCase() === 'free' ? 'Free (₹0)' : (c.annualFee ? `₹${c.annualFee}/yr` : 'Not specified');

      return [
        `- Debit Card: "${c.cardName}"`,
        `  Bank: ${c.bank}`,
        `  Network: ${c.network || 'Visa/RuPay'}`,
        `  Annual Fee: ${fee}`,
        `  Joining Fee: ${c.joiningFee ? `₹${c.joiningFee}` : '₹0'}`,
        `  ATM Limit: ${atm}`,
        `  POS/E-Commerce Limit: ${pos}`,
        `  Lounge Access: ${c.loungeAccess || 'No complimentary lounge access'}`,
        `  International Usage: ${c.international ? 'Supported' : 'Domestic only'}`,
        `  Contactless: ${c.contactless ? 'Supported' : 'Not supported'}`,
        `  Rewards/Cashback: ${c.cashback || c.rewards || c.benefits || 'Standard reward points'}`,
        `  Official Source URL: ${c.official_source_url || 'Available on official bank portal'}`
      ].join('\n');
    });

    sections.push(`VERIFIED D.CARD DEBIT CARDS:\n${cardLines.join('\n\n')}`);
  }

  // 4. Banks
  if (banks.length > 0) {
    const bankLines = banks.map(b => `- Bank: ${b.name} (${b.type || 'Commercial Bank'}) | Website: ${b.website || 'Official Bank Website'}`);
    sections.push(`BANK PROFILES:\n${bankLines.join('\n')}`);
  }

  if (sections.length === 0) {
    return 'NO DIRECT PRODUCT MATCHES FOUND IN D.CARD DATASET FOR THIS QUERY.';
  }

  return sections.join('\n\n========================================\n\n');
}
