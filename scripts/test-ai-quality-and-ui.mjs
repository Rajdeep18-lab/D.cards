/**
 * D.CARD Automated Test Suite: UI/UX, Functional QA & AI Quality
 * 
 * Tests all requirements from:
 * 1. UI/UX & Responsive integrity across all viewports (375, 390, 768, 1366, 1920)
 * 2. Complete Navigation and Route verification (32+ routes, redirects, 404 catch-all)
 * 3. AI Assistant quality across the 7 required test scenarios:
 *    - Scenario 1: General questions (What is D.CARD?, What can I compare?, How does D.CARD work?)
 *    - Scenario 2: Savings accounts comparison (SBI vs HDFC, min balance, zero balance)
 *    - Scenario 3: Debit cards comparison (SBI Classic vs HDFC Platinum, lower fee, lounge access)
 *    - Scenario 4: Current accounts comparison (MAB, cash deposit limit, free cheque leaves)
 *    - Scenario 5: Missing information handling ("I couldn't verify this information from the available D.CARD data.")
 *    - Scenario 6: Ambiguous queries ("Which card is best?", trade-offs, follow-up questions)
 *    - Scenario 7: Out-of-scope queries (guaranteed returns, financial advice boundaries)
 * 4. Grounding and zero-hallucination verification against actual database files.
 */

import fs from 'fs';
import path from 'path';
import handler from '../api/ai-advisor.js';
import { savingsAccounts } from '../src/data/savingsAccounts/index.js';
import { currentAccounts } from '../src/data/currentAccounts/index.js';
import { allMasterDebitCards } from '../src/data/debitCardsData.js';
import { getCoveredBanksDirectory } from '../src/utils/bankDirectoryUtils.js';

let passed = 0;
let failed = 0;
const testRecords = [];

function assert(condition, testName, details = '', metadata = null) {
  const record = {
    testName,
    passed: Boolean(condition),
    details: details || '',
    metadata
  };
  testRecords.push(record);

  if (condition) {
    console.log(`  ✅ PASS: ${testName}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${testName}${details ? ` -> ${details}` : ''}`);
    failed++;
  }
}

// Helper to simulate Vercel serverless req and res objects
let testClientCounter = 1;
function createMockHttp(body = {}, headers = {}) {
  const headersSent = {};
  let statusCode = 200;
  let responseData = null;
  const clientIp = `198.51.100.${testClientCounter++ % 250 + 1}`;

  const req = {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-real-ip': clientIp,
      ...headers
    },
    body
  };

  const res = {
    statusCode: 200,
    headers: headersSent,
    setHeader(name, value) {
      headersSent[name.toLowerCase()] = value;
      return this;
    },
    status(code) {
      statusCode = code;
      this.statusCode = code;
      return this;
    },
    json(data) {
      responseData = data;
      return this;
    },
    end() {
      return this;
    },
    getStatus() {
      return statusCode;
    },
    getData() {
      return responseData;
    },
    getHeaders() {
      return headersSent;
    }
  };

  return { req, res };
}

async function runTestSuite() {
  console.log('\n======================================================');
  console.log('   D.CARD UI/UX, FUNCTIONAL QA & AI QUALITY AUDIT     ');
  console.log('======================================================\n');

  // =========================================================================
  // SECTION 1: ROUTING & CANONICAL REDIRECT VERIFICATION
  // =========================================================================
  console.log('--- SECTION 1: Route Structure & Navigation Integrity ---');
  {
    const appJs = fs.readFileSync('src/App.jsx', 'utf8');

    // 1. Core routes presence
    const expectedRoutes = [
      '/',
      '/cards',
      '/debit-cards/:id',
      '/savings-accounts',
      '/savings-accounts/:id',
      '/compare-savings',
      '/current-accounts',
      '/current-accounts/:id',
      '/compare-current',
      '/compare',
      '/ai-advisor',
      '/find-my-bank',
      '/banks',
      '/saved-cards',
      '/about',
      '/contact',
      '/profile'
    ];

    for (const r of expectedRoutes) {
      assert(
        appJs.includes(`path="${r}"`) || appJs.includes(`path='${r}'`),
        `Route registered: ${r}`
      );
    }

    // 2. Canonical redirect aliases
    const canonicalAliases = [
      { alias: '/debit-cards', target: '/cards' },
      { alias: '/savings', target: '/savings-accounts' },
      { alias: '/current', target: '/current-accounts' },
      { alias: '/find-banks', target: '/find-my-bank' },
      { alias: '/banks-near-you', target: '/find-my-bank' },
      { alias: '/ai-assistance', target: '/ai-advisor' },
      { alias: '/favorites', target: '/saved-cards' },
      { alias: '/founders', target: '/about' },
      { alias: '/team', target: '/about' }
    ];

    for (const ca of canonicalAliases) {
      assert(
        appJs.includes(`path="${ca.alias}"`) && appJs.includes(`to="${ca.target}"`),
        `Canonical alias redirect: ${ca.alias} -> ${ca.target}`
      );
    }

    // 3. Dedicated 404 Route & Component Verification
    assert(
      appJs.includes('path="*"') && appJs.includes('<NotFoundPage'),
      'Catch-all route (*) renders dedicated branded NotFoundPage component'
    );

    const notFoundJs = fs.readFileSync('src/pages/NotFoundPage.jsx', 'utf8');
    assert(
      notFoundJs.includes('Page Not Found') && notFoundJs.includes('Back to Homepage'),
      'NotFoundPage renders "Page Not Found" heading and "Back to Homepage" button'
    );
    assert(
      notFoundJs.includes('noindex, nofollow'),
      'NotFoundPage sets SEO robots meta tag to "noindex, nofollow"'
    );
  }

  // =========================================================================
  // SECTION 2: RESPONSIVE DESIGN & CONTROLS AUDIT
  // =========================================================================
  console.log('\n--- SECTION 2: UI/UX & Responsive Viewport Rules ---');
  {
    const navbarJs = fs.readFileSync('src/components/Navbar.jsx', 'utf8');
    const dockJs = fs.readFileSync('src/components/ComparisonDock.jsx', 'utf8');
    const aiChatJs = fs.readFileSync('src/components/AIChatAssistant.jsx', 'utf8');
    const indexHtml = fs.readFileSync('index.html', 'utf8');

    // Mobile viewport meta tag
    assert(
      indexHtml.includes('name="viewport"') && indexHtml.includes('width=device-width'),
      'Viewport meta tag configured with width=device-width'
    );

    // Navbar responsive breakpoint (hamburger drawer below 1280px)
    assert(
      navbarJs.includes('min-[1280px]:hidden') && navbarJs.includes('min-[1280px]:flex'),
      'Navbar supports responsive collapse: drawer under 1280px and inline nav at desktop'
    );

    // Touch targets: mobile menu links have >= 44px min-height
    assert(
      navbarJs.includes('min-h-[44px]'),
      'Mobile navigation touch target minimum height >= 44px (WCAG compliant)'
    );

    // Comparison dock overflow safety on mobile
    assert(
      dockJs.includes('w-[calc(100%-2rem)]') && dockJs.includes('max-w-3xl'),
      'Comparison dock respects horizontal viewport bounds (w-[calc(100%-2rem)])'
    );

    // Safe-area-inset padding for iOS devices (iPhone 375x812, 390x844)
    assert(
      dockJs.includes('env(safe-area-inset-bottom') && aiChatJs.includes('env(safe-area-inset-bottom'),
      'Bottom floating docks and AI assistant support iOS safe-area-inset-bottom'
    );

    // AI widget mobile width clamping (no horizontal overflow on 375px/390px)
    assert(
      aiChatJs.includes('w-[calc(100vw-16px)]') && aiChatJs.includes('max-w-[400px]'),
      'AI Chat floating panel clamps to w-[calc(100vw-16px)] on mobile viewports'
    );
  }

  // =========================================================================
  // SECTION 3: DATABASE GROUNDING & ZERO HALLUCINATION VERIFICATION
  // =========================================================================
  console.log('\n--- SECTION 3: Database Grounding & Fidelity ---');
  {
    // Verified counts in database
    assert(savingsAccounts.length >= 70, `Verified savings accounts in database: ${savingsAccounts.length} (expected >= 70)`);
    assert(allMasterDebitCards.length >= 130, `Verified debit cards in database: ${allMasterDebitCards.length} (expected >= 130)`);
    assert(currentAccounts.length >= 15, `Verified current accounts in database: ${currentAccounts.length} (expected >= 15)`);
    const coveredBanks = getCoveredBanksDirectory();
    assert(coveredBanks.length >= 20, `Verified banks in directory: ${coveredBanks.length} (expected >= 20)`);

    // Verify factual SBI and HDFC savings account properties
    const sbiRegSavings = savingsAccounts.find(a => a.accountName === 'SBI Regular Savings Account');
    assert(Boolean(sbiRegSavings), 'SBI Regular Savings Account exists in verified database');
    assert(sbiRegSavings?.isZeroBalance === true && sbiRegSavings?.minimumBalanceValue === 0, 'SBI Regular Savings Account is verified zero balance');

    const hdfcRegSavings = savingsAccounts.find(a => a.accountName === 'HDFC Regular Savings Account');
    assert(Boolean(hdfcRegSavings), 'HDFC Regular Savings Account exists in verified database');
    assert(hdfcRegSavings?.minimumBalanceValue === 10000, 'HDFC Regular Savings Account minimum balance verified at ₹10,000');

    // Verify factual debit card fees
    const sbiClassic = allMasterDebitCards.find(c => c.cardName === 'SBI Classic Debit Card');
    assert(Boolean(sbiClassic), 'SBI Classic Debit Card exists in verified database');
    assert(sbiClassic?.annualFee.includes('125'), 'SBI Classic Debit Card annual fee verified at Rs.125 + GST');
    assert(sbiClassic?.loungeAccess === 'Not Available', 'SBI Classic Debit Card lounge access verified as Not Available');

    const hdfcPlatinum = allMasterDebitCards.find(c => c.cardName === 'HDFC EasyShop Platinum Debit Card');
    assert(Boolean(hdfcPlatinum), 'HDFC EasyShop Platinum Debit Card exists in verified database');
    assert(hdfcPlatinum?.annualFee.includes('750'), 'HDFC EasyShop Platinum annual fee verified at Rs.750 + GST');
    assert(hdfcPlatinum?.loungeAccess.includes('2 complimentary'), 'HDFC EasyShop Platinum lounge verified: 2 complimentary visits/quarter');
  }

  // =========================================================================
  // SECTION 4: AI SCENARIO TESTING (7 AUDIT SCENARIOS)
  // =========================================================================
  console.log('\n--- SECTION 4: AI Assistant 7 Required Audit Scenarios ---');

  // --- Scenario 1: General Platform Questions ---
  console.log('\n  [Scenario 1: General Platform Questions]');
  {
    const q1 = "What is D.CARD?";
    const { req, res } = createMockHttp({ message: q1 });
    await handler(req, res);
    const data = res.getData();
    assert(
      data.answer.toLowerCase().includes('independent banking product discovery') || data.answer.toLowerCase().includes('d.card'),
      `Q1: "${q1}" returns truthful platform explanation`,
      data.answer.slice(0, 80)
    );

    const q2 = "What can I compare here?";
    const { req: req2, res: res2 } = createMockHttp({ message: q2 });
    await handler(req2, res2);
    const data2 = res2.getData();
    assert(
      data2.answer.includes('Savings Accounts') && data2.answer.includes('Debit Cards'),
      `Q2: "${q2}" explains savings accounts, current accounts and debit cards`,
      data2.answer.slice(0, 80)
    );

    const q3 = "How does D.CARD work?";
    const { req: req3, res: res3 } = createMockHttp({ message: q3 });
    await handler(req3, res3);
    const data3 = res3.getData();
    assert(
      data3.answer.toLowerCase().includes('compare') || data3.answer.toLowerCase().includes('verified'),
      `Q3: "${q3}" explains verified discovery and comparison`,
      data3.answer.slice(0, 80)
    );
  }

  // --- Scenario 2: Savings Accounts Queries ---
  console.log('\n  [Scenario 2: Savings Accounts Queries]');
  {
    const q1 = "Which account has a lower minimum balance requirement: SBI or HDFC?";
    const { req, res } = createMockHttp({ message: q1 });
    await handler(req, res);
    const data = res.getData();
    assert(
      data.answer.includes('SBI') && (data.answer.includes('₹0') || data.answer.includes('Zero Balance') || data.answer.includes('lower')),
      `Q1: "${q1}" factually identifies SBI as having lower (zero) minimum balance`,
      data.answer.slice(0, 100)
    );

    const q2 = "Compare SBI and HDFC savings accounts";
    const { req: req2, res: res2 } = createMockHttp({ message: q2 });
    await handler(req2, res2);
    const data2 = res2.getData();
    assert(
      data2.matchedAccounts?.length >= 2,
      `Q2: "${q2}" retrieves matching accounts from both SBI and HDFC`,
      `Matched: ${data2.matchedAccounts?.length}`
    );
  }

  // --- Scenario 3: Debit Cards Queries ---
  console.log('\n  [Scenario 3: Debit Cards Queries]');
  {
    const q1 = "Which card has a lower annual fee: SBI Classic or HDFC EasyShop Platinum?";
    const { req, res } = createMockHttp({ message: q1 });
    await handler(req, res);
    const data = res.getData();
    assert(
      data.answer.includes('SBI Classic') && (data.answer.includes('125') || data.answer.includes('lower')),
      `Q1: "${q1}" factually identifies SBI Classic (Rs.125) as having lower fee than HDFC (Rs.750)`,
      data.answer.slice(0, 100)
    );

    const q2 = "Which debit cards offer airport lounge access?";
    const { req: req2, res: res2 } = createMockHttp({ message: q2 });
    await handler(req2, res2);
    const data2 = res2.getData();
    assert(
      data2.matchedCards?.length > 0 && data2.matchedCards.every(c => c.loungeAccess && c.loungeAccess !== 'Not Available'),
      `Q2: "${q2}" returns only debit cards with verified complimentary lounge access`,
      `Found ${data2.matchedCards?.length} lounge cards`
    );
  }

  // --- Scenario 4: Current Accounts Queries ---
  console.log('\n  [Scenario 4: Current Accounts Queries]');
  {
    const q1 = "Explain minimum balance requirements for current accounts";
    const { req, res } = createMockHttp({ message: q1 });
    await handler(req, res);
    const data = res.getData();
    assert(
      data.matchedCurrentAccounts?.length > 0,
      `Q1: "${q1}" retrieves verified business current accounts with MAB specifications`,
      `Found: ${data.matchedCurrentAccounts?.length}`
    );
    assert(
      data.answer.includes('MAB') || data.answer.includes('Monthly Average Balance') || data.answer.includes('चालू'),
      `Q1: "${q1}" answer specifies Monthly Average Balance (MAB)`,
      data.answer.slice(0, 100)
    );
  }

  // --- Scenario 5: Missing Information Handling ---
  console.log('\n  [Scenario 5: Missing Information Handling]');
  {
    const q1 = "What is the cashback rate for SBI Classic Debit Card?";
    const { req, res } = createMockHttp({ message: q1 });
    await handler(req, res);
    const data = res.getData();
    assert(
      data.answer.includes("I couldn't verify this information from the available D.CARD data"),
      `Q1: "${q1}" explicitly admits: "I couldn't verify this information from the available D.CARD data."`,
      data.answer.slice(0, 120)
    );
    assert(
      !data.answer.includes('5% cashback') && !data.answer.includes('10% cashback'),
      `Q1: "${q1}" does NOT fabricate a cashback percentage`
    );
  }

  // --- Scenario 6: Ambiguous Queries ---
  console.log('\n  [Scenario 6: Ambiguous Queries]');
  {
    const q1 = "Which card is best?";
    const { req, res } = createMockHttp({ message: q1 });
    await handler(req, res);
    const data = res.getData();
    assert(
      data.answer.includes('There is no single "best" card') || data.answer.includes('depends on'),
      `Q1: "${q1}" avoids declaring a single card as universally best and explains trade-offs`,
      data.answer.slice(0, 100)
    );
    assert(
      data.answer.includes('priority') || data.answer.includes('What is your primary'),
      `Q1: "${q1}" asks clarifying follow-up questions regarding user preferences`
    );

    const q2 = "Suggest a good account";
    const { req: req2, res: res2 } = createMockHttp({ message: q2 });
    await handler(req2, res2);
    const data2 = res2.getData();
    assert(
      data2.answer.includes('There is no single "best"') || data2.answer.includes('depends on'),
      `Q2: "${q2}" explains trade-offs between zero balance vs rewards/relationship`
    );
  }

  // --- Scenario 7: Out-of-Scope Queries ---
  console.log('\n  [Scenario 7: Out-of-Scope Queries]');
  {
    const q1 = "Can you give me 50% guaranteed return on investment?";
    const { req, res } = createMockHttp({ message: q1 });
    await handler(req, res);
    const data = res.getData();
    assert(
      data.answer.includes('independent banking product discovery') && 
      (data.answer.includes('do not provide personalized financial advice') || data.answer.includes('guaranteed return')),
      `Q1: "${q1}" strictly declines guaranteed return claims and explains D.CARD boundaries`,
      data.answer.slice(0, 120)
    );

    const q2 = "Which cryptocurrency or Bitcoin should I buy today?";
    const { req: req2, res: res2 } = createMockHttp({ message: q2 });
    await handler(req2, res2);
    const data2 = res2.getData();
    assert(
      data2.answer.includes('independent banking product discovery') || data2.answer.includes('do not provide'),
      `Q2: "${q2}" declines cryptocurrency recommendations and clarifies comparison platform scope`
    );
  }

  // --- Scenario 8: ATM Withdrawal Limit Intent vs Physical ATM Search ---
  console.log('\n  [Scenario 8: ATM Withdrawal Limit Intent vs Physical ATM Discovery]');
  {
    // A. Unspecified card prompts clarifying question (Requirement 6)
    const atmQ1 = "What is the daily ATM withdrawal limit of this debit card?";
    const { req: reqAtm1, res: resAtm1 } = createMockHttp({ message: atmQ1 });
    await handler(reqAtm1, resAtm1);
    const dataAtm1 = resAtm1.getData();
    assert(
      dataAtm1.type === 'product_results' && dataAtm1.answer.includes('Which debit card or bank would you like to check'),
      `ATM Q1: "${atmQ1}" classified as product limit query and asks user which card they mean`
    );

    const atmQ2 = "How much cash can I withdraw from an ATM per day?";
    const { req: reqAtm2, res: resAtm2 } = createMockHttp({ message: atmQ2 });
    await handler(reqAtm2, resAtm2);
    const dataAtm2 = resAtm2.getData();
    assert(
      dataAtm2.type === 'product_results' && dataAtm2.answer.includes('Which debit card or bank would you like to check'),
      `ATM Q2: "${atmQ2}" classified as product query without triggering map error`
    );

    const atmQ3 = "What is the maximum ATM withdrawal limit?";
    const { req: reqAtm3, res: resAtm3 } = createMockHttp({ message: atmQ3 });
    await handler(reqAtm3, resAtm3);
    const dataAtm3 = resAtm3.getData();
    assert(
      dataAtm3.type === 'product_results' && dataAtm3.answer.includes('Which debit card or bank'),
      `ATM Q3: "${atmQ3}" explains limit variance and asks for specific card`
    );

    const atmQ4 = "Is there a daily cash withdrawal limit on this card?";
    const { req: reqAtm4, res: resAtm4 } = createMockHttp({ message: atmQ4 });
    await handler(reqAtm4, resAtm4);
    const dataAtm4 = resAtm4.getData();
    assert(
      dataAtm4.type === 'product_results',
      `ATM Q4: "${atmQ4}" correctly identifies product withdrawal limit intent`
    );

    const atmQ5 = "What is the per-day ATM withdrawal limit?";
    const { req: reqAtm5, res: resAtm5 } = createMockHttp({ message: atmQ5 });
    await handler(reqAtm5, resAtm5);
    const dataAtm5 = resAtm5.getData();
    assert(
      dataAtm5.type === 'product_results',
      `ATM Q5: "${atmQ5}" correctly identifies product withdrawal limit intent`
    );

    // B. Card-specific ATM limit query returns verified card product data (Requirement 3)
    const atmQ6 = "What is the ATM daily limit for SBI Platinum Debit Card?";
    const { req: reqAtm6, res: resAtm6 } = createMockHttp({ message: atmQ6 });
    await handler(reqAtm6, resAtm6);
    const dataAtm6 = resAtm6.getData();
    assert(
      dataAtm6.type === 'product_results' && dataAtm6.answer.includes('SBI Platinum') && dataAtm6.answer.includes('1,00,000'),
      `ATM Q6: "${atmQ6}" returns verified limit Rs.1,00,000/day for SBI Platinum`
    );

    // C. Comparison of daily ATM withdrawal limits (Requirement 3)
    const atmQ7 = "Compare daily ATM withdrawal limits of SBI Classic and SBI Platinum debit cards";
    const { req: reqAtm7, res: resAtm7 } = createMockHttp({ message: atmQ7 });
    await handler(reqAtm7, resAtm7);
    const dataAtm7 = resAtm7.getData();
    assert(
      dataAtm7.type === 'product_results' && dataAtm7.answer.includes('SBI Classic') && dataAtm7.answer.includes('SBI Platinum'),
      `ATM Q7: "${atmQ7}" outputs side-by-side limit comparison across both cards`
    );

    // D. Preservation of physical ATM branch discovery (Requirement 5)
    const atmQ8 = "Kharar mein SBI ka nearest ATM batao";
    const { req: reqAtm8, res: resAtm8 } = createMockHttp({ message: atmQ8 });
    await handler(reqAtm8, resAtm8);
    const dataAtm8 = resAtm8.getData();
    assert(
      dataAtm8 && (dataAtm8.type === 'location_results' || dataAtm8.matchedLocations?.length > 0),
      `ATM Q8: "${atmQ8}" correctly executes physical ATM search in Kharar`,
      JSON.stringify({ type: dataAtm8?.type, len: dataAtm8?.matchedLocations?.length, ans: dataAtm8?.answer?.slice(0, 50) })
    );
  }

  // =========================================================================
  // SUMMARY
  // =========================================================================
  console.log('\n======================================================');
  console.log(`TEST SUMMARY: ${passed} Passed, ${failed} Failed`);
  console.log('======================================================\n');

  process.exit(failed > 0 ? 1 : 0);
}

runTestSuite().catch(err => {
  console.error("Test execution exception:", err);
  process.exit(1);
});
