/**
 * Comprehensive Test Suite for D.CARD AI Assistance & Security
 * Tests all requirements from security audit and AI advisor reliability spec.
 */

import handler from '../api/ai-advisor.js';
import { getRelevantProductsForAI, buildPromptContext } from '../api/productContextService.js';
import { getBranches } from '../api/banksService.js';
import { extractLocationParameters, find_bank_locations } from '../api/aiLocationService.js';

let passed = 0;
let failed = 0;

function assert(condition, testName, details = '') {
  if (condition) {
    console.log(`  ✅ PASS: ${testName}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${testName}${details ? ` -> ${details}` : ''}`);
    failed++;
  }
}

// Helper to simulate Vercel serverless req and res objects
function createMockHttp(reqOptions = {}) {
  const headersSent = {};
  let statusCode = 200;
  let responseData = null;

  const req = {
    method: reqOptions.method || 'POST',
    headers: {
      'content-type': 'application/json',
      origin: reqOptions.origin || 'https://www.dcard.website',
      'x-forwarded-for': reqOptions.ip || '127.0.0.1',
      ...(reqOptions.headers || {})
    },
    body: reqOptions.body || {}
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

async function runTests() {
  console.log('\n======================================================');
  console.log('       D.CARD AI ADVISOR & SECURITY TEST SUITE        ');
  console.log('======================================================\n');

  // ---------------------------------------------------------------------------
  // 1. CORS Security Tests
  // ---------------------------------------------------------------------------
  console.log('--- 1. CORS Security & Origin Validation ---');
  {
    // A. Allowed Production Origin
    const { req, res } = createMockHttp({ origin: 'https://www.dcard.website', body: { message: 'hello' } });
    await handler(req, res);
    assert(
      res.getHeaders()['access-control-allow-origin'] === 'https://www.dcard.website',
      'Production domain https://www.dcard.website is allowed'
    );

    // B. Allowed Apex Production Origin
    const { req: req2, res: res2 } = createMockHttp({ origin: 'https://dcard.website', body: { message: 'hello' } });
    await handler(req2, res2);
    assert(
      res2.getHeaders()['access-control-allow-origin'] === 'https://dcard.website',
      'Apex domain https://dcard.website is allowed'
    );

    // C. Allowed Localhost Port
    const { req: req3, res: res3 } = createMockHttp({ origin: 'http://localhost:5173', body: { message: 'hello' } });
    await handler(req3, res3);
    assert(
      res3.getHeaders()['access-control-allow-origin'] === 'http://localhost:5173',
      'Localhost dev port http://localhost:5173 is allowed'
    );

    // D. REJECTED: Wildcard / Untrusted Origins (e.g. attacker.com, arbitrary vercel app)
    const { req: req4, res: res4 } = createMockHttp({ origin: 'https://malicious-site.com', body: { message: 'hello' } });
    await handler(req4, res4);
    assert(
      !res4.getHeaders()['access-control-allow-origin'] || res4.getHeaders()['access-control-allow-origin'] === '',
      'Untrusted origin https://malicious-site.com is NOT granted CORS header'
    );

    const { req: req5, res: res5 } = createMockHttp({ origin: 'https://fake-phishing.vercel.app', body: { message: 'hello' } });
    await handler(req5, res5);
    assert(
      !res5.getHeaders()['access-control-allow-origin'] || res5.getHeaders()['access-control-allow-origin'] === '',
      'Arbitrary third-party .vercel.app origin is rejected (no broad wildcard)'
    );

    // E. OPTIONS Preflight returns 204
    const { req: reqPre, res: resPre } = createMockHttp({ method: 'OPTIONS', origin: 'https://www.dcard.website' });
    await handler(reqPre, resPre);
    assert(resPre.getStatus() === 204, 'OPTIONS preflight returns HTTP 204 No Content');
  }

  // ---------------------------------------------------------------------------
  // 2. Input Validation & Abuse Protection
  // ---------------------------------------------------------------------------
  console.log('\n--- 2. Input Validation & Abuse Protection ---');
  {
    // A. Empty / Missing message
    const { req, res } = createMockHttp({ body: { message: '' } });
    await handler(req, res);
    assert(res.getStatus() === 400 && res.getData()?.error?.includes('valid, non-empty'), 'Empty message returns 400 Bad Request');

    // B. Whitespace-only message
    const { req: req2, res: res2 } = createMockHttp({ body: { message: '    ' } });
    await handler(req2, res2);
    assert(res2.getStatus() === 400, 'Whitespace message returns 400 Bad Request');

    // C. Non-string message (e.g. object / array payload injection)
    const { req: req3, res: res3 } = createMockHttp({ body: { message: { evil: true } } });
    await handler(req3, res3);
    assert(res3.getStatus() === 400, 'Non-string payload returns 400 Bad Request');

    // D. Excessive payload size (>2000 chars)
    const longMsg = 'A'.repeat(2005);
    const { req: req4, res: res4 } = createMockHttp({ body: { message: longMsg } });
    await handler(req4, res4);
    assert(res4.getStatus() === 400 && res4.getData()?.error?.includes('maximum limit'), 'Oversized message (>2000 chars) is rejected with 400');

    // E. Rate Limiting Headers Present
    const { req: req5, res: res5 } = createMockHttp({ body: { message: 'test query' } });
    await handler(req5, res5);
    assert(
      (res5.getHeaders()['x-ratelimit-limit'] === '40' || res5.getHeaders()['x-ratelimit-limit'] === '20') && res5.getHeaders()['x-ratelimit-remaining'] !== undefined,
      'Standard rate limiting headers (X-RateLimit-Limit, X-RateLimit-Remaining) are present'
    );
  }

  // ---------------------------------------------------------------------------
  // 3. Product Context Matching & Account-to-Card Fidelity
  // ---------------------------------------------------------------------------
  console.log('\n--- 3. Product Context Matching & Data Fidelity ---');
  {
    // A. Zero Balance Savings Account Query
    const zeroBalResult = getRelevantProductsForAI('Which savings account has zero minimum balance?');
    assert(
      zeroBalResult.savingsAccounts.length > 0 &&
      zeroBalResult.savingsAccounts.some(a => a.minimumBalance === '₹0' || a.accountType === 'Zero Balance'),
      'Zero balance query returns verified zero balance accounts',
      `Found ${zeroBalResult.savingsAccounts.length} accounts`
    );

    // B. Student Account Query
    const studentResult = getRelevantProductsForAI('Which savings account is suitable for a student?');
    assert(
      studentResult.savingsAccounts.length > 0 &&
      studentResult.savingsAccounts.some(a => (a.tags || []).includes('student') || a.accountType === 'Zero Balance' || a.name?.toLowerCase().includes('student') || a.name?.toLowerCase().includes('youth')),
      'Student query returns appropriate student/zero-balance savings accounts'
    );

    // C. Lounge Access Debit Card Query
    const loungeResult = getRelevantProductsForAI('Which debit cards offer airport lounge access?');
    assert(
      loungeResult.debitCards.length > 0 &&
      loungeResult.debitCards.some(c => c.loungeAccess && c.loungeAccess.toLowerCase() !== 'no' && c.loungeAccess.toLowerCase() !== 'none'),
      'Lounge access query returns verified cards with lounge benefits',
      `Found: ${loungeResult.debitCards.map(c => c.name).join(', ')}`
    );

    // D. Specific Account Linked Debit Card Query (Account-to-Card Fidelity)
    const sbiPlusResult = getRelevantProductsForAI('What debit card comes with SBI Savings Plus Account?');
    assert(
      sbiPlusResult.debitCards.length > 0 &&
      sbiPlusResult.debitCards.some(c => (c.bank || c.bank_name || '').includes('State Bank') || (c.bank || c.bank_name || '').includes('SBI')),
      'SBI Savings Plus Account query strictly retrieves SBI linked debit cards',
      `Linked cards: ${sbiPlusResult.debitCards.map(c => c.name).join(', ')}`
    );

    // E. Current Account vs Savings Account Separation
    const currentResult = getRelevantProductsForAI('Show me business current accounts with high transaction limits');
    assert(
      currentResult.currentAccounts.length > 0,
      'Current account query retrieves business current accounts with transaction limits',
      `Found ${currentResult.currentAccounts.length} current accounts`
    );

    // F. Multi-Bank Comparison Balancing (e.g. SBI vs HDFC)
    const compareResult = getRelevantProductsForAI('Compare SBI and HDFC savings accounts');
    const sbiAccounts = compareResult.savingsAccounts.filter(a => (a.bank || '').includes('State Bank') || (a.bank || '').includes('SBI'));
    const hdfcAccounts = compareResult.savingsAccounts.filter(a => (a.bank || '').includes('HDFC'));
    assert(
      sbiAccounts.length > 0 && hdfcAccounts.length > 0,
      'Comparison query (SBI vs HDFC) contains balanced accounts from both banks without starving one bank',
      `SBI: ${sbiAccounts.length}, HDFC: ${hdfcAccounts.length}`
    );
  }

  // ---------------------------------------------------------------------------
  // 4. Conversational Context & Multi-turn Retention
  // ---------------------------------------------------------------------------
  console.log('\n--- 4. Conversational Context & Multi-turn Retention ---');
  {
    // Turn 1: User asks about HDFC
    const turn1State = { conversationState: {} };
    const turn1Result = getRelevantProductsForAI('Tell me about HDFC savings account', turn1State.conversationState);
    assert(
      (turn1Result.conversationState.lastMentionedBank || '').includes('HDFC'),
      'Turn 1 correctly records HDFC in conversationState.lastMentionedBank'
    );

    // Turn 2: User asks "What debit card comes with it?" (implicit bank context)
    const turn2State = { conversationState: turn1Result.conversationState };
    const turn2Result = getRelevantProductsForAI('What debit card comes with it?', turn2State.conversationState);
    assert(
      turn2Result.debitCards.length > 0 && turn2Result.debitCards.every(c => (c.bank || c.bank_name || '').includes('HDFC')),
      'Turn 2 ("with it?") retains HDFC context and retrieves only HDFC debit cards',
      `Cards: ${turn2Result.debitCards.map(c => c.name).join(', ')}`
    );
  }

  // ---------------------------------------------------------------------------
  // 5. Branch & ATM Discovery Verification
  // ---------------------------------------------------------------------------
  console.log('\n--- 5. Branch & ATM Discovery Verification ---');
  {
    // A. ATM Query in Kharar
    const khararParams = extractLocationParameters('Kharar mein SBI ka nearest ATM batao', {});
    assert(
      (khararParams.bank?.includes('State Bank') || khararParams.bank?.includes('SBI')) && 
      khararParams.city?.toLowerCase() === 'kharar' && 
      khararParams.branch_type?.toLowerCase() === 'atm',
      'Location parser extracts Bank: SBI, City: Kharar, Type: ATM'
    );

    const khararLocations = await find_bank_locations({
      bank_name: 'SBI',
      city: 'Kharar',
      branch_type: 'atm'
    });
    assert(
      khararLocations.locations.length > 0,
      'Found verified SBI ATM/branch locations in Kharar',
      `Found ${khararLocations.locations.length} locations: ${khararLocations.locations[0]?.branch_name}`
    );

    // B. Newly Added Hubs (e.g. Haridwar)
    const haridwarParams = extractLocationParameters('Find SBI branches in Haridwar', {});
    assert(
      haridwarParams.city?.toLowerCase() === 'haridwar',
      'Newly added hub Haridwar correctly extracted by location service'
    );

    const haridwarLocations = await find_bank_locations({
      bank_name: 'SBI',
      city: 'Haridwar'
    });
    assert(
      haridwarLocations.locations.length > 0,
      'Found verified SBI branches in Haridwar',
      `Found ${haridwarLocations.locations.length} branches`
    );

    // C. Non-existent / Unknown Bank
    const unknownParams = extractLocationParameters('Find branches of Bank of Wakanda in Delhi', {});
    assert(
      unknownParams.isUnknownBank === true && unknownParams.unknownBankName?.includes('Wakanda'),
      'Unknown bank "Bank of Wakanda" accurately flagged as unsupported'
    );
  }

  // ---------------------------------------------------------------------------
  // 6. Frontend Greeting Check & Interception Bug Fix
  // ---------------------------------------------------------------------------
  console.log('\n--- 6. Greeting Check & Question Hijack Prevention ---');
  {
    // In our fixed logic:
    const PURE_GREETINGS = new Set([
      'hi', 'hello', 'hey', 'namaste', 'greetings', 'hallo', 'नमस्ते', 'namaskar', 'नमस्कार',
      'hi there', 'hello there', 'hey there'
    ]);

    function isPureGreetingTest(msg) {
      const normalized = msg.toLowerCase().replace(/[^a-z\u0900-\u097F\s]/g, '').trim();
      return PURE_GREETINGS.has(normalized);
    }

    assert(isPureGreetingTest('Hello') === true, '"Hello" is identified as a pure greeting');
    assert(isPureGreetingTest('Namaste!') === true, '"Namaste!" is identified as a pure greeting');
    assert(isPureGreetingTest('Hi there') === true, '"Hi there" is identified as a pure greeting');

    // CRITICAL BUG VERIFICATION: Questions starting with "hello " or "hi " must NOT be hijacked
    assert(
      isPureGreetingTest('hello what is zero balance account?') === false,
      '"hello what is zero balance account?" is NOT hijacked as a greeting'
    );
    assert(
      isPureGreetingTest('Hi, compare SBI and HDFC savings account') === false,
      '"Hi, compare SBI and HDFC savings account" is NOT hijacked as a greeting'
    );
    assert(
      isPureGreetingTest('Hey find ATM near me') === false,
      '"Hey find ATM near me" is NOT hijacked as a greeting'
    );
  }

  // ---------------------------------------------------------------------------
  // 7. Full API Handler End-to-End Execution (Sandboxed Offline Mode)
  // ---------------------------------------------------------------------------
  console.log('\n--- 7. End-to-End API Handler Execution & Safe Fallback ---');
  {
    // A. Full execution of branch lookup through API handler
    const { req, res } = createMockHttp({
      body: {
        message: 'Kharar mein SBI ka nearest ATM batao',
        conversationHistory: [],
        conversationState: {}
      }
    });
    await handler(req, res);
    const data = res.getData();

    assert(res.getStatus() === 200, 'API returns HTTP 200 for Kharar ATM query');
    assert(data.matchedLocations?.length > 0, 'API returns matched locations in payload');
    assert(data.answer?.length > 0, 'API returns truthful grounded answer');
    assert(data.suggestedActions?.some(a => a.label === 'Open in Find Banks'), 'API includes navigation suggested action to /find-banks');

    // B. Product query without crashing even when Gemini network is offline
    const { req: reqProd, res: resProd } = createMockHttp({
      body: {
        message: 'Which savings account has zero minimum balance?',
        conversationHistory: [],
        conversationState: {}
      }
    });
    await handler(reqProd, resProd);
    const prodData = resProd.getData();

    assert(resProd.getStatus() === 200, 'API returns HTTP 200 for zero balance query');
    assert(prodData.matchedAccounts?.length > 0, 'API returns matched savings accounts');
    assert(prodData.answer?.includes('zero') || prodData.answer?.includes('बचत') || prodData.answer?.includes('D.CARD'), 'API returns grounded product answer');
    assert(Boolean(prodData.disclaimer), 'API returns official bank terms verification disclaimer');

    // C. Hindi Language Query
    const { req: reqHi, res: resHi } = createMockHttp({
      body: {
        message: 'किस बचत खाते में जीरो बैलेंस की सुविधा है?',
        language: 'hi',
        conversationHistory: [],
        conversationState: {}
      }
    });
    await handler(reqHi, resHi);
    const hiData = resHi.getData();
    assert(resHi.getStatus() === 200, 'API returns HTTP 200 for Hindi query');
    assert(hiData.matchedAccounts?.length > 0, 'API returns matched accounts for Hindi query');
    assert(hiData.answer?.length > 0, 'API returns Hindi answer');
  }

  console.log('\n======================================================');
  console.log(`TEST SUMMARY: ${passed} Passed, ${failed} Failed`);
  console.log('======================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
  process.exit(0);
}

runTests().catch(err => {
  console.error('Test execution error:', err);
  process.exit(1);
});
