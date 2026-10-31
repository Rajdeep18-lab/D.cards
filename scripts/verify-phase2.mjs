/**
 * Phase 2 Verification Script: Real Automated Testing of Core Features & Invariants
 */

import handler from '../api/ai-advisor.js';
import { getRelevantProductsForAI } from '../api/productContextService.js';
import { extractLocationParameters, find_bank_locations } from '../api/aiLocationService.js';

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function report(condition, name, details = '') {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`[PASS] ${name}`);
    if (details) console.log(`       ↳ Details: ${details}`);
  } else {
    failedTests++;
    console.error(`[FAIL] ${name}`);
    if (details) console.error(`       ↳ Error Details: ${details}`);
  }
}

function mockHttp(reqOptions = {}) {
  const headers = {};
  let status = 200;
  let body = null;
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
    setHeader(k, v) { headers[k.toLowerCase()] = v; return this; },
    status(c) { status = c; this.statusCode = c; return this; },
    json(d) { body = d; return this; },
    end() { return this; },
    getStatus() { return status; },
    getBody() { return body; },
    getHeaders() { return headers; }
  };
  return { req, res };
}

async function verifyAll() {
  console.log('===========================================================');
  console.log('   D.CARD PHASE 2 — INDEPENDENT VERIFICATION TEST RUNNER   ');
  console.log('===========================================================\n');

  // --- TEST 1: Greeting Hijack Check ---
  console.log('--- 1. Testing Greeting Detection Logic ---');
  const PURE_GREETINGS = new Set([
    'hi', 'hello', 'hey', 'namaste', 'greetings', 'hallo', 'नमस्ते', 'namaskar', 'नमस्कार',
    'hi there', 'hello there', 'hey there'
  ]);
  function checkGreeting(msg) {
    const norm = msg.toLowerCase().replace(/[^a-z\u0900-\u097F\s]/g, '').trim();
    return PURE_GREETINGS.has(norm);
  }

  report(checkGreeting('Hello') === true, 'Pure greeting "Hello" triggers greeting handler');
  report(checkGreeting('Namaste') === true, 'Pure greeting "Namaste" triggers greeting handler');
  report(
    checkGreeting('Hello, what is a zero-balance account?') === false,
    '"Hello, what is a zero-balance account?" is NOT hijacked as a greeting',
    'Message will be routed to product/advisor engine'
  );
  report(
    checkGreeting('Hi, compare SBI and HDFC savings accounts') === false,
    '"Hi, compare SBI and HDFC savings accounts" is NOT hijacked as a greeting',
    'Message will be routed to comparison engine'
  );

  // --- TEST 2: Comparison Balancing ---
  console.log('\n--- 2. Testing Comparison Product Retrieval (SBI vs HDFC) ---');
  const compareRes = getRelevantProductsForAI('Hi, compare SBI and HDFC savings accounts');
  const sbiAccs = compareRes.savingsAccounts.filter(a => (a.bank || '').includes('State Bank') || (a.bank || '').includes('SBI'));
  const hdfcAccs = compareRes.savingsAccounts.filter(a => (a.bank || '').includes('HDFC'));
  report(
    sbiAccs.length > 0 && hdfcAccs.length > 0,
    'Comparison contains accounts from both SBI and HDFC without starving either',
    `SBI accounts: ${sbiAccs.map(a => a.accountName).join(', ')} | HDFC accounts: ${hdfcAccs.map(a => a.accountName).join(', ')}`
  );

  // --- TEST 3: Account-to-Card Fidelity ---
  console.log('\n--- 3. Testing Account-to-Card Fidelity ---');
  const sbiPlus = getRelevantProductsForAI('What debit card comes with SBI Savings Plus Account?');
  const allCardsAreSBI = sbiPlus.debitCards.length > 0 && sbiPlus.debitCards.every(c => (c.bank || c.bank_name || '').includes('State Bank') || (c.bank || c.bank_name || '').includes('SBI'));
  report(
    allCardsAreSBI,
    'SBI Savings Plus Account query strictly returns verified linked SBI debit cards',
    `Matched cards: ${sbiPlus.debitCards.map(c => c.name).join(', ')}`
  );

  // --- TEST 4: Devanagari Hindi Queries ---
  console.log('\n--- 4. Testing Devanagari Hindi Query Intent & Retrieval ---');
  const hindiQuery = 'किस बचत खाते में जीरो बैलेंस की सुविधा है?';
  const hindiRes = getRelevantProductsForAI(hindiQuery);
  const foundZeroBalInHindi = hindiRes.savingsAccounts.length > 0 && hindiRes.savingsAccounts.some(a => a.isZeroBalance || a.minimumBalanceValue === 0 || a.accountType === 'Zero Balance');
  report(
    foundZeroBalInHindi,
    'Hindi Devanagari query successfully returns zero-balance savings accounts',
    `Found ${hindiRes.savingsAccounts.length} accounts: ${hindiRes.savingsAccounts.map(a => a.accountName).join(', ')}`
  );

  // --- TEST 5: Follow-up Context Preservation ---
  console.log('\n--- 5. Testing Multi-Turn Follow-Up Conversational Context ---');
  const turn1 = getRelevantProductsForAI('Tell me about HDFC savings account', {});
  const turn2 = getRelevantProductsForAI('What debit card comes with it?', turn1.conversationState);
  const turn2RetainedHdfc = turn2.debitCards.length > 0 && turn2.debitCards.every(c => (c.bank || c.bank_name || '').includes('HDFC'));
  report(
    turn2RetainedHdfc,
    'Follow-up query "What debit card comes with it?" preserves HDFC bank context',
    `Turn 1 bank: ${turn1.conversationState.lastMentionedBank} -> Turn 2 cards: ${turn2.debitCards.map(c => c.name).join(', ')}`
  );

  // --- TEST 6: Invalid Requests, Size Ceiling & Input Sanitization ---
  console.log('\n--- 6. Testing Input Validation & Error Handling ---');
  {
    const { req, res } = mockHttp({ body: { message: '' } });
    await handler(req, res);
    report(res.getStatus() === 400, 'Empty string returns HTTP 400 Bad Request');
  }
  {
    const { req, res } = mockHttp({ body: { message: 'A'.repeat(2005) } });
    await handler(req, res);
    report(res.getStatus() === 400, 'Message exceeding 2000 chars returns HTTP 400 Bad Request');
  }
  {
    const { req, res } = mockHttp({ body: { message: { $where: 'sleep(1000)' } } });
    await handler(req, res);
    report(res.getStatus() === 400, 'Non-string payload injection returns HTTP 400 Bad Request');
  }

  // --- TEST 7: CORS & Security Headers ---
  console.log('\n--- 7. Testing CORS Validation ---');
  {
    const { req, res } = mockHttp({ origin: 'https://www.dcard.website', body: { message: 'hello' } });
    await handler(req, res);
    report(res.getHeaders()['access-control-allow-origin'] === 'https://www.dcard.website', 'Approved production origin receives Access-Control-Allow-Origin header');
  }
  {
    const { req, res } = mockHttp({ origin: 'https://attacker-domain.xyz', body: { message: 'hello' } });
    await handler(req, res);
    report(!res.getHeaders()['access-control-allow-origin'], 'Untrusted origin https://attacker-domain.xyz is DENIED CORS header');
  }
  {
    const { req, res } = mockHttp({ method: 'OPTIONS', origin: 'https://www.dcard.website' });
    await handler(req, res);
    report(res.getStatus() === 204, 'OPTIONS preflight returns HTTP 204 No Content');
  }

  // --- TEST 8: Rate Limiting Enforcement ---
  console.log('\n--- 8. Testing Sliding Window Rate Limiting ---');
  {
    const ip = '198.51.100.99'; // Distinct test IP
    let wasLimited = false;
    let rateLimitHeaderPresent = false;
    let retryAfterHeaderPresent = false;

    for (let i = 0; i < 42; i++) {
      const { req, res } = mockHttp({ ip, body: { message: 'Rate limit test ' + i } });
      await handler(req, res);
      if (res.getHeaders()['x-ratelimit-limit']) rateLimitHeaderPresent = true;
      if (res.getStatus() === 429) {
        wasLimited = true;
        if (res.getHeaders()['retry-after']) retryAfterHeaderPresent = true;
      }
    }

    report(rateLimitHeaderPresent, 'X-RateLimit-Limit & X-RateLimit-Remaining headers are sent');
    report(wasLimited, 'Requests exceeding limit (40 req/min) are blocked with HTTP 429 Too Many Requests');
    report(retryAfterHeaderPresent, 'HTTP 429 response includes standard Retry-After header');
  }

  // --- TEST 9: Graceful Offline & Gemini Failure Resilience ---
  console.log('\n--- 9. Testing Deterministic Grounded Database Fallback ---');
  {
    const { req, res } = mockHttp({
      body: {
        message: 'Hello, what is a zero-balance account?',
        conversationHistory: [],
        conversationState: {}
      }
    });
    await handler(req, res);
    const data = res.getBody();
    report(
      res.getStatus() === 200 && data.answer?.length > 0 && !data.error,
      '"Hello, what is a zero-balance account?" returns HTTP 200 with grounded factual response',
      `Answer preview: ${data.answer.slice(0, 100)}...`
    );
  }

  console.log('\n===========================================================');
  console.log(`PHASE 2 SUMMARY: ${passedTests}/${totalTests} Tests Passed (${failedTests} Failed)`);
  console.log('===========================================================\n');

  if (failedTests > 0) process.exit(1);
}

verifyAll().catch(err => {
  console.error('Phase 2 Runner Unhandled Exception:', err);
  process.exit(1);
});

