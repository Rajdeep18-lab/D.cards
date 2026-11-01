import banksHandler from '../api/banks/index.js';
import nearbyHandler from '../api/banks/nearby.js';
import branchIdHandler from '../api/banks/[id].js';
import { getClientIp } from '../api/rateLimiter.js';

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

function createMockReqRes({ method = 'GET', url = '/', query = {}, headers = {}, body = null } = {}) {
  const req = {
    method,
    url,
    query,
    headers: {
      origin: 'https://www.dcard.website',
      'x-forwarded-for': '203.0.113.195, 70.41.3.18',
      ...headers
    },
    body
  };

  let statusCode = 200;
  const resHeaders = {};
  let responseData = null;

  const res = {
    statusCode,
    status(code) {
      this.statusCode = code;
      statusCode = code;
      return this;
    },
    setHeader(key, val) {
      resHeaders[key.toLowerCase()] = val;
      return this;
    },
    getHeader(key) {
      return resHeaders[key.toLowerCase()];
    },
    json(data) {
      responseData = data;
      return this;
    },
    end(data) {
      if (data) responseData = data;
      return this;
    },
    getStatus: () => statusCode,
    getData: () => responseData,
    getHeaders: () => resHeaders
  };

  return { req, res };
}

async function runBanksApiTests() {
  console.log('\n======================================================');
  console.log('       D.CARD BANK APIS & RATE LIMITER VERIFICATION   ');
  console.log('======================================================\n');

  // 1. IP Parser Test
  console.log('--- 1. Client IP Extraction ---');
  {
    const { req } = createMockReqRes({
      headers: { 'x-real-ip': '203.0.113.195', 'x-forwarded-for': '10.0.0.1, 203.0.113.195' }
    });
    const ip = getClientIp(req);
    assert(ip === '203.0.113.195', 'Verified edge IP is extracted', `got: ${ip}`);

    const { req: reqSingle } = createMockReqRes({
      headers: { 'x-real-ip': '198.51.100.4' }
    });
    delete reqSingle.headers['x-forwarded-for'];
    const ipSingle = getClientIp(reqSingle);
    assert(ipSingle === '198.51.100.4', 'x-real-ip is used when x-forwarded-for is absent', `got: ${ipSingle}`);
  }

  // 2. CORS Preflight & Methods
  console.log('\n--- 2. CORS & HTTP Methods ---');
  {
    const { req: reqOpt, res: resOpt } = createMockReqRes({
      method: 'OPTIONS',
      headers: { origin: 'https://www.dcard.website' }
    });
    await banksHandler(reqOpt, resOpt);
    assert(resOpt.getStatus() === 204, 'OPTIONS preflight returns HTTP 204');
    assert(resOpt.getHeader('access-control-allow-origin') === 'https://www.dcard.website', 'CORS origin header set correctly');

    const { req: reqPost, res: resPost } = createMockReqRes({
      method: 'POST'
    });
    await banksHandler(reqPost, resPost);
    assert(resPost.getStatus() === 405, 'POST to GET-only endpoint returns 405 Method Not Allowed');
  }

  // 3. /api/banks Directory & Meta
  console.log('\n--- 3. /api/banks Directory & Metadata ---');
  {
    const { req: reqMeta, res: resMeta } = createMockReqRes({
      query: { meta: 'true' }
    });
    await banksHandler(reqMeta, resMeta);
    const meta = resMeta.getData();
    assert(resMeta.getStatus() === 200, 'GET /api/banks?meta=true returns 200 OK');
    assert(Array.isArray(meta?.uniqueBanks) && meta.uniqueBanks.length > 0, 'Metadata contains verified uniqueBanks array');
    assert(meta?.totalRecords > 0, `Metadata reports total verified records: ${meta?.totalRecords}`);

    const { req: reqDir, res: resDir } = createMockReqRes({
      query: { bank: 'SBI', city: 'Kharar' }
    });
    await banksHandler(reqDir, resDir);
    const dir = resDir.getData();
    assert(resDir.getStatus() === 200, 'GET /api/banks?bank=SBI&city=Kharar returns 200 OK');
    assert(Array.isArray(dir?.data) && dir.data.length > 0, `Returns verified records matching query: ${dir?.data?.length}`);
  }

  // 4. /api/banks/nearby
  console.log('\n--- 4. /api/banks/nearby Distance Query ---');
  {
    const { req: reqNearby, res: resNearby } = createMockReqRes({
      query: { lat: '30.7499', lng: '76.6411', radiusKm: '15' }
    });
    await nearbyHandler(reqNearby, resNearby);
    const nearby = resNearby.getData();
    assert(resNearby.getStatus() === 200, 'GET /api/banks/nearby returns 200 OK');
    assert(Array.isArray(nearby?.data) && nearby.data.length > 0, `Found nearby branches: ${nearby?.data?.length}`);
    if (nearby?.data?.length >= 2) {
      assert(
        nearby.data[0].distanceKm <= nearby.data[1].distanceKm,
        'Nearby branches are correctly sorted ascending by Haversine distance'
      );
    }
  }

  // 5. /api/banks/:id
  console.log('\n--- 5. /api/banks/:id Single Record Query ---');
  {
    const { req: reqId, res: resId } = createMockReqRes({
      query: { id: 'branch_sbi_kharar_main' }
    });
    await branchIdHandler(reqId, resId);
    const branch = resId.getData();
    assert(resId.getStatus() === 200, 'GET /api/banks/:id returns 200 for valid ID');
    assert(branch?.data?.bank_name === 'State Bank of India', 'Correct bank name retrieved in branch.data');

    const { req: reqId404, res: resId404 } = createMockReqRes({
      query: { id: 'branch_nonexistent_xyz' }
    });
    await branchIdHandler(reqId404, resId404);
    assert(resId404.getStatus() === 404, 'Returns 404 for non-existent branch ID');
  }

  console.log('\n======================================================');
  console.log(`BANKS API SUMMARY: ${passed} Passed, ${failed} Failed`);
  console.log('======================================================\n');

  if (failed > 0) process.exit(1);
  process.exit(0);
}

runBanksApiTests().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
