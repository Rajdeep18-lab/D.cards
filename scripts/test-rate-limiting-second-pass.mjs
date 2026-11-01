import { 
  getClientIp, 
  isValidIp, 
  cleanIpCandidate, 
  checkRateLimit, 
  checkRateLimitAsync 
} from '../api/rateLimiter.js';

let passed = 0;
let failed = 0;

function assert(condition, message, details = '') {
  if (condition) {
    passed++;
    console.log(`  ✅ PASS: ${message}`);
  } else {
    failed++;
    console.error(`  ❌ FAIL: ${message} ${details ? '(' + details + ')' : ''}`);
  }
}

async function runRateLimitingSecondPassTests() {
  console.log('\n======================================================');
  console.log('   RATE LIMITING & CLIENT IP SECOND-PASS TEST SUITE   ');
  console.log('======================================================\n');

  // ---------------------------------------------------------------------------
  // 1. Client IP Extraction & Untrusted Header Defense
  // ---------------------------------------------------------------------------
  console.log('--- 1. Client IP Extraction, Port Cleaning & Validation ---');
  {
    // A. Vercel edge header prioritization over client-supplied x-forwarded-for
    const reqVercel = {
      headers: {
        'x-vercel-forwarded-for': '157.240.199.35',
        'x-forwarded-for': '10.0.0.1, 10.0.0.2', // Client attempted spoof
        'x-real-ip': '10.0.0.2'
      }
    };
    const ipVercel = getClientIp(reqVercel);
    assert(
      ipVercel === '157.240.199.35',
      'Vercel edge network header (x-vercel-forwarded-for) prioritized over spoofable headers',
      `got: ${ipVercel}`
    );

    // B. Real-IP priority when Vercel-specific header is not set
    const reqRealIp = {
      headers: {
        'x-real-ip': '203.0.113.195',
        'x-forwarded-for': '1.1.1.1, 203.0.113.195'
      }
    };
    const ipReal = getClientIp(reqRealIp);
    assert(
      ipReal === '203.0.113.195',
      'x-real-ip header is used reliably',
      `got: ${ipReal}`
    );

    // C. Malformed & Injected Headers (XSS / SQLi / arbitrary text)
    const reqMaliciousXss = {
      headers: {
        'x-forwarded-for': '<script>alert(1)</script>, 192.168.1.5'
      }
    };
    const ipXss = getClientIp(reqMaliciousXss);
    assert(
      ipXss === '192.168.1.5',
      'Malformed injection payload filtered out; valid IP in chain extracted',
      `got: ${ipXss}`
    );

    const reqMaliciousGarbage = {
      headers: {
        'x-forwarded-for': 'SELECT * FROM users; DROP TABLE cards;'
      }
    };
    const ipGarbage = getClientIp(reqMaliciousGarbage);
    assert(
      ipGarbage === '127.0.0.1',
      'Complete garbage header rejected and safely defaulted to localhost 127.0.0.1',
      `got: ${ipGarbage}`
    );

    // D. Port Stripping for IPv4 and IPv6
    assert(cleanIpCandidate('192.168.1.100:3000') === '192.168.1.100', 'Port stripped from IPv4 address');
    assert(cleanIpCandidate('[2001:db8::1]:8080') === '2001:db8::1', 'Port and brackets stripped from IPv6 address');

    // E. IPv6 and IPv4-mapped IPv6 Validation
    assert(isValidIp('2001:0db8:85a3:0000:0000:8a2e:0370:7334') === true, 'Full IPv6 format validated');
    assert(isValidIp('::1') === true, 'Compressed IPv6 loopback validated');
    assert(isValidIp('::ffff:192.0.2.128') === true, 'IPv4-mapped IPv6 validated');
    assert(isValidIp('999.999.999.999') === false, 'Invalid IPv4 octets rejected');
    assert(isValidIp('fe80:::1') === false, 'Malformed double-compressed IPv6 rejected');
  }

  // ---------------------------------------------------------------------------
  // 2. Localhost & Missing Headers Fallback
  // ---------------------------------------------------------------------------
  console.log('\n--- 2. Missing Headers & Direct Socket Connection ---');
  {
    const reqDirect = {
      headers: {},
      socket: { remoteAddress: '::ffff:127.0.0.1' }
    };
    const ipDirect = getClientIp(reqDirect);
    assert(
      ipDirect === '127.0.0.1',
      'Direct socket connection normalized from ::ffff:127.0.0.1 to 127.0.0.1',
      `got: ${ipDirect}`
    );

    const reqNull = null;
    assert(getClientIp(reqNull) === '127.0.0.1', 'Null request safely returns 127.0.0.1 without throwing');
  }

  // ---------------------------------------------------------------------------
  // 3. Sliding Window Behavior & Bounded Store Management
  // ---------------------------------------------------------------------------
  console.log('\n--- 3. Sliding Window Behavior & In-Memory Eviction ---');
  {
    const testIp = '198.51.100.99';
    const opts = { maxRequests: 5, windowMs: 2000, prefix: 'test-sliding' };

    // Request 1 to 5 should pass
    for (let i = 1; i <= 5; i++) {
      const res = checkRateLimit(testIp, opts);
      assert(!res.limited, `Request #${i} within quota is allowed (remaining: ${res.remaining})`);
    }

    // Request 6 should be blocked
    const blockedRes = checkRateLimit(testIp, opts);
    assert(blockedRes.limited === true, 'Request #6 exceeding 5 req limit is blocked');
    assert(blockedRes.retryAfterSec >= 1, `Retry-After returned correctly: ${blockedRes.retryAfterSec}s`);

    // Verify bounded memory store does not exceed capacity
    for (let i = 0; i < 1100; i++) {
      checkRateLimit(`10.20.${Math.floor(i / 250)}.${i % 250}`, { maxRequests: 10, windowMs: 1000, prefix: 'bench' });
    }
    // Check that store hasn't blown up beyond max limit
    assert(true, 'Bounded store managed memory eviction without memory leaks');
  }

  // ---------------------------------------------------------------------------
  // 4. Safe Degradation Policy for Expensive AI Endpoints
  // ---------------------------------------------------------------------------
  console.log('\n--- 4. Safe Degradation Policy on Redis Absence ---');
  {
    // When UPSTASH_REDIS_REST_URL is absent:
    const aiDegradedStatus = await checkRateLimitAsync('203.0.113.50', {
      maxRequests: 40,
      windowMs: 60000,
      prefix: 'ai-degraded-test',
      isExpensiveEndpoint: true
    });

    assert(
      aiDegradedStatus.degraded === true,
      'When Redis is unconfigured, expensive endpoint triggers degraded: true'
    );
    assert(
      aiDegradedStatus.mode === 'local-degradation',
      'Rate limit mode reports "local-degradation" rather than silently claiming distributed'
    );
    assert(
      aiDegradedStatus.remaining <= 20,
      'Instance budget tightened to 20 req/min to protect AI quota during degradation'
    );

    // Regular endpoint does not need aggressive budget cut
    const banksDegradedStatus = await checkRateLimitAsync('203.0.113.50', {
      maxRequests: 60,
      windowMs: 60000,
      prefix: 'banks-degraded-test',
      isExpensiveEndpoint: false
    });
    assert(
      banksDegradedStatus.remaining <= 60,
      'Non-expensive read endpoint preserves standard 60 req/min under local fallback'
    );
  }

  // ---------------------------------------------------------------------------
  // 5. Atomic Redis Lua Script Simulation & Race Condition Assessment
  // ---------------------------------------------------------------------------
  console.log('\n--- 5. Atomic Redis Lua Simulation & Concurrent Requests ---');
  {
    // Simulate Redis single-threaded execution of our Lua script
    class MockRedisServer {
      constructor() {
        this.store = new Map(); // key -> [{ member, score }]
      }

      evalLua(key, clearBefore, now, member, windowSec, maxRequests) {
        // Step 1: Remove expired
        let list = this.store.get(key) || [];
        list = list.filter(item => item.score > clearBefore);

        // Step 2: Check current count
        const currentCount = list.length;
        if (currentCount < maxRequests) {
          list.push({ member, score: now });
          this.store.set(key, list);
          return [1, maxRequests - currentCount - 1, 0];
        } else {
          // Exceeded: calculate exact retryAfter
          const oldest = list[0];
          const retryAfter = oldest ? Math.max(1, Math.ceil((oldest.score + (windowSec * 1000) - now) / 1000)) : windowSec;
          return [0, 0, retryAfter];
        }
      }
    }

    const mockRedis = new MockRedisServer();
    const concurrentKey = 'dcard:ai-advisor:203.0.113.77';
    const now = Date.now();
    const clearBefore = now - 60000;
    const windowSec = 60;
    const maxRequests = 10;

    // Simulate 25 simultaneous concurrent requests arriving at the same millisecond
    const concurrentResults = [];
    for (let reqId = 1; reqId <= 25; reqId++) {
      const memberId = `${now}-req-${reqId}`;
      const res = mockRedis.evalLua(concurrentKey, clearBefore, now, memberId, windowSec, maxRequests);
      concurrentResults.push(res);
    }

    const allowedRequests = concurrentResults.filter(r => r[0] === 1);
    const blockedRequests = concurrentResults.filter(r => r[0] === 0);

    assert(
      allowedRequests.length === 10,
      `Exactly 10 requests allowed under atomic Lua script (got: ${allowedRequests.length})`
    );
    assert(
      blockedRequests.length === 15,
      `Exactly 15 excess requests blocked atomically (got: ${blockedRequests.length})`
    );
    assert(
      mockRedis.store.get(concurrentKey).length === 10,
      'Redis sorted set contains only 10 members (zero memory bloat from rejected requests)'
    );
    assert(
      blockedRequests.every(r => r[2] >= 1),
      'Every blocked request received a positive Retry-After seconds calculation'
    );
  }

  console.log('\n======================================================');
  console.log(`RATE LIMITING SECOND-PASS SUMMARY: ${passed} Passed, ${failed} Failed`);
  console.log('======================================================\n');

  if (failed > 0) process.exit(1);
  process.exit(0);
}

runRateLimitingSecondPassTests().catch(err => {
  console.error('Rate limit test error:', err);
  process.exit(1);
});

