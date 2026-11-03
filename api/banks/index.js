/**
 * Vercel Serverless Function: GET /api/banks
 * 
 * Directory of verified branches & ATMs with filtering, pagination, rate limiting, and caching.
 */

import { getBranches, getBranchById, getBankMetadata } from '../banksService.js';
import { getClientIp, handleCors, checkRateLimitAsync } from '../rateLimiter.js';

export default async function handler(req, res) {
  // CORS & Preflight handling
  if (handleCors(req, res, { allowedMethods: 'GET,OPTIONS' })) {
    return;
  }

  // Only allow GET requests
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET', 'OPTIONS']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  // Security: Extract IP and enforce distributed / sliding rate limiting (60 requests/min)
  const clientIp = getClientIp(req);
  const rateLimitStatus = await checkRateLimitAsync(clientIp, { maxRequests: 60, windowMs: 60000, prefix: 'banks' });
  res.setHeader('X-RateLimit-Limit', String(rateLimitStatus.maxRequests || 60));
  res.setHeader('X-RateLimit-Remaining', String(Math.max(0, rateLimitStatus.remaining ?? 0)));
  res.setHeader('X-RateLimit-Mode', rateLimitStatus.mode || 'local');
  if (rateLimitStatus.degraded) {
    res.setHeader('X-RateLimit-Degraded', 'true');
  }

  if (rateLimitStatus.limited) {
    res.setHeader('Retry-After', String(rateLimitStatus.retryAfterSec || 60));
    return res.status(429).json({
      error: 'Too Many Requests. Please wait a moment.',
      retryAfterSec: rateLimitStatus.retryAfterSec
    });
  }

  const query = req.query || {};

  // Sub-route: Metadata
  if (query.meta === 'true') {
    try {
      const meta = await getBankMetadata();
      res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
      return res.status(200).json(meta);
    } catch (err) {
      return res.status(500).json({ error: 'Failed to retrieve bank metadata.' });
    }
  }

  // Sub-route: Single branch by ID (e.g. /api/banks?id=branch_sbi_kharar_main)
  if (query.id) {
    try {
      const branch = await getBranchById(query.id);
      if (!branch) {
        return res.status(404).json({ error: `Branch not found with ID "${query.id}".` });
      }
      res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
      return res.status(200).json(branch);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }

  // Main Directory Search
  try {
    const {
      bank,
      city,
      state,
      pincode,
      type = 'All',
      page = 1,
      limit = 20
    } = query;

    const result = await getBranches({
      bank,
      city,
      state,
      pincode,
      type,
      page,
      limit
    });

    res.setHeader('Cache-Control', 'public, s-maxage=120, stale-while-revalidate=300');
    return res.status(200).json(result);
  } catch (err) {
    console.error('[API /api/banks Error]:', err.message);
    return res.status(400).json({
      error: err.message || 'Error retrieving branch records.'
    });
  }
}
