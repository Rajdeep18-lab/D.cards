/**
 * D.CARD Progressive Load Testing & Stress Simulation Harness
 * 
 * Simulates progressive concurrent user tiers (10, 25, 50, 100, 250, 500)
 * executing realistic end-to-end user journeys against D.CARD's actual
 * backend serverless handlers and data services in-process:
 * 
 * Scenarios per concurrent batch:
 * 1. Homepage & Static Bundle Navigation (/ & /cards)
 * 2. Directory Filtering & Search (GET /api/banks?bank=SBI&city=Kharar)
 * 3. Geolocation & Haversine Distance Search (GET /api/banks/nearby?lat=30.7499&lng=76.6411)
 * 4. Single Branch Details by ID (GET /api/banks?id=branch_sbi_kharar_main)
 * 5. Bank Directory Metadata Query (GET /api/banks?meta=true)
 * 6. AI Assistant Query: Zero Balance Inquiry (POST /api/ai-advisor)
 * 7. AI Assistant Query: ATM Discovery Inquiry (POST /api/ai-advisor)
 * 
 * Captures:
 * - Average latency (ms)
 * - P95 & P99 latency (ms)
 * - Requests Per Second (RPS)
 * - Success count (2xx)
 * - Rate limited count (429)
 * - Server errors (5xx)
 * - Error percentage (%)
 * - Memory heap utilization (MB)
 */

import banksHandler from '../api/banks/index.js';
import nearbyHandler from '../api/banks/nearby.js';
import aiAdvisorHandler from '../api/ai-advisor.js';
import fs from 'fs';

// Scenarios defining the realistic user workloads
const SCENARIOS = [
  {
    name: 'Homepage Static Navigation',
    handler: async (req, res) => {
      res.status(200).json({ status: 'ok', route: '/', prerendered: true });
    },
    method: 'GET',
    url: '/'
  },
  {
    name: 'Cards Page Navigation',
    handler: async (req, res) => {
      res.status(200).json({ status: 'ok', route: '/cards', prerendered: true });
    },
    method: 'GET',
    url: '/cards'
  },
  {
    name: 'Bank Search (SBI Kharar)',
    handler: banksHandler,
    method: 'GET',
    url: '/api/banks?bank=SBI&city=Kharar',
    query: { bank: 'SBI', city: 'Kharar' }
  },
  {
    name: 'Nearby Branches (15km radius)',
    handler: nearbyHandler,
    method: 'GET',
    url: '/api/banks/nearby?lat=30.7499&lng=76.6411&radiusKm=15',
    query: { lat: '30.7499', lng: '76.6411', radiusKm: '15' }
  },
  {
    name: 'Single Branch Detail',
    handler: banksHandler,
    method: 'GET',
    url: '/api/banks?id=branch_sbi_kharar_main',
    query: { id: 'branch_sbi_kharar_main' }
  },
  {
    name: 'Directory Metadata',
    handler: banksHandler,
    method: 'GET',
    url: '/api/banks?meta=true',
    query: { meta: 'true' }
  },
  {
    name: 'AI Advisor (Zero Balance Account)',
    handler: aiAdvisorHandler,
    method: 'POST',
    url: '/api/ai-advisor',
    body: { message: 'Zero balance savings account with high interest' }
  },
  {
    name: 'AI Advisor (ATM Discovery)',
    handler: aiAdvisorHandler,
    method: 'POST',
    url: '/api/ai-advisor',
    body: { message: 'Find SBI ATM near Kharar' }
  }
];

function executeMockRequest(scenario, clientIp) {
  return new Promise((resolve) => {
    const start = process.hrtime.bigint();

    const headers = {
      origin: 'https://www.dcard.website',
      'x-real-ip': clientIp,
      'content-type': 'application/json'
    };

    let statusCode = 200;
    const resHeaders = {};
    let body = null;

    const req = {
      method: scenario.method,
      url: scenario.url,
      query: scenario.query ? { ...scenario.query } : {},
      headers,
      body: scenario.body ? JSON.parse(JSON.stringify(scenario.body)) : {}
    };

    const res = {
      statusCode: 200,
      status(c) {
        this.statusCode = c;
        statusCode = c;
        return this;
      },
      setHeader(k, v) {
        resHeaders[k.toLowerCase()] = v;
        return this;
      },
      getHeader(k) {
        return resHeaders[k.toLowerCase()];
      },
      json(d) {
        body = d;
        const end = process.hrtime.bigint();
        const durationMs = Number(end - start) / 1e6;
        resolve({
          statusCode,
          durationMs,
          success: statusCode >= 200 && statusCode < 300,
          rateLimited: statusCode === 429,
          serverError: statusCode >= 500
        });
        return this;
      },
      end(data) {
        body = data;
        const end = process.hrtime.bigint();
        const durationMs = Number(end - start) / 1e6;
        resolve({
          statusCode,
          durationMs,
          success: statusCode >= 200 && statusCode < 300,
          rateLimited: statusCode === 429,
          serverError: statusCode >= 500
        });
        return this;
      }
    };

    try {
      Promise.resolve(scenario.handler(req, res)).catch((err) => {
        const end = process.hrtime.bigint();
        const durationMs = Number(end - start) / 1e6;
        resolve({
          statusCode: 500,
          durationMs,
          success: false,
          rateLimited: false,
          serverError: true,
          error: err.message
        });
      });
    } catch (syncErr) {
      const end = process.hrtime.bigint();
      const durationMs = Number(end - start) / 1e6;
      resolve({
        statusCode: 500,
        durationMs,
        success: false,
        rateLimited: false,
        serverError: true,
        error: syncErr.message
      });
    }
  });
}

async function runTier(concurrency, totalRequests) {
  const initialMem = process.memoryUsage().heapUsed / (1024 * 1024);
  const wallStart = process.hrtime.bigint();

  const results = [];
  let inFlight = 0;
  let sent = 0;

  return new Promise((resolve) => {
    function dispatchNext() {
      if (sent >= totalRequests) {
        if (inFlight === 0) {
          const wallEnd = process.hrtime.bigint();
          const totalDurationSec = Number(wallEnd - wallStart) / 1e9;
          const finalMem = process.memoryUsage().heapUsed / (1024 * 1024);

          const sortedTimes = results.map(r => r.durationMs).sort((a, b) => a - b);
          const sum = sortedTimes.reduce((acc, t) => acc + t, 0);
          const avg = sum / (sortedTimes.length || 1);
          const p95 = sortedTimes[Math.floor(sortedTimes.length * 0.95)] || avg;
          const p99 = sortedTimes[Math.floor(sortedTimes.length * 0.99)] || p95;
          const min = sortedTimes[0] || 0;
          const max = sortedTimes[sortedTimes.length - 1] || 0;

          const successes = results.filter(r => r.success).length;
          const rateLimited = results.filter(r => r.rateLimited).length;
          const serverErrors = results.filter(r => r.serverError).length;
          const clientErrors = results.filter(r => r.statusCode >= 400 && r.statusCode < 500 && !r.rateLimited).length;
          const errorRate = ((serverErrors / (totalRequests || 1)) * 100).toFixed(2);
          const rps = (totalRequests / (totalDurationSec || 1)).toFixed(1);

          resolve({
            concurrency,
            totalRequests,
            avgMs: avg.toFixed(2),
            p95Ms: p95.toFixed(2),
            p99Ms: p99.toFixed(2),
            minMs: min.toFixed(2),
            maxMs: max.toFixed(2),
            rps,
            totalDurationSec: totalDurationSec.toFixed(3),
            successes,
            rateLimited,
            clientErrors,
            serverErrors,
            errorRate,
            heapDeltaMb: (finalMem - initialMem).toFixed(2)
          });
        }
        return;
      }

      while (inFlight < concurrency && sent < totalRequests) {
        const scenario = SCENARIOS[sent % SCENARIOS.length];
        // Each simulated user has their own distinct IP to test true multi-user isolation
        const userId = (sent % concurrency) + 1;
        const clientIp = `192.168.10.${userId}`;
        sent++;
        inFlight++;

        executeMockRequest(scenario, clientIp).then((res) => {
          results.push(res);
          inFlight--;
          dispatchNext();
        });
      }
    }

    dispatchNext();
  });
}

async function main() {
  console.log(`\n========================================================================================================`);
  console.log(`                      D.CARD PROGRESSIVE CONCURRENT LOAD TESTING & STRESS SIMULATION                    `);
  console.log(`========================================================================================================\n`);

  const tiers = [
    { concurrency: 10, totalRequests: 100 },
    { concurrency: 25, totalRequests: 250 },
    { concurrency: 50, totalRequests: 500 },
    { concurrency: 100, totalRequests: 1000 },
    { concurrency: 250, totalRequests: 2000 },
    { concurrency: 500, totalRequests: 3500 }
  ];

  const summary = [];

  for (const tier of tiers) {
    process.stdout.write(`Testing Tier: ${String(tier.concurrency).padStart(3)} users (${String(tier.totalRequests).padStart(4)} requests)... `);
    const result = await runTier(tier.concurrency, tier.totalRequests);
    summary.push(result);
    console.log(
      `DONE in ${result.totalDurationSec}s | Avg: ${result.avgMs.padStart(5)}ms | P95: ${result.p95Ms.padStart(5)}ms | RPS: ${result.rps.padStart(6)} | Success: ${result.successes} | 5xx: ${result.serverErrors}`
    );
  }

  console.log(`\n========================================================================================================`);
  console.log(`                                 D.CARD CONCURRENT STRESS TEST RESULTS                                   `);
  console.log(`========================================================================================================`);
  console.log(`| Users | Requests |  Avg Latency  |    P95     |    P99     |   RPS   | Success | Rate-Lim | 5xx Err | Error % |`);
  console.log(`|-------|----------|---------------|------------|------------|---------|---------|----------|---------|---------|`);

  for (const row of summary) {
    const pad = (v, len) => String(v).padEnd(len);
    console.log(
      `| ${pad(row.concurrency, 5)} ` +
      `| ${pad(row.totalRequests, 8)} ` +
      `| ${pad(row.avgMs + ' ms', 13)} ` +
      `| ${pad(row.p95Ms + ' ms', 10)} ` +
      `| ${pad(row.p99Ms + ' ms', 10)} ` +
      `| ${pad(row.rps, 7)} ` +
      `| ${pad(row.successes, 7)} ` +
      `| ${pad(row.rateLimited, 8)} ` +
      `| ${pad(row.serverErrors, 7)} ` +
      `| ${pad(row.errorRate + '%', 7)} |`
    );
  }
  console.log(`========================================================================================================\n`);

  fs.writeFileSync('scripts/load-test-report.json', JSON.stringify(summary, null, 2));
  console.log('Results written to scripts/load-test-report.json\n');
}

main().catch(console.error);
