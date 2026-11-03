/**
 * Vercel Serverless Function: GET /api/banks/:id
 * 
 * Fetches a single verified branch or ATM record by unique ID.
 */

import { getBranchById } from '../banksService.js';
import { getClientIp, handleCors, checkRateLimitAsync } from '../rateLimiter.js';

export default async function handler(req, res) {
  if (handleCors(req, res, { allowedMethods: 'GET,OPTIONS' })) {
    return;
  }

  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET', 'OPTIONS']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  const clientIp = getClientIp(req);
  const rateLimitStatus = await checkRateLimitAsync(clientIp, { maxRequests: 60, windowMs: 60000, prefix: 'banks-id' });
  res.setHeader('X-RateLimit-Limit', String(rateLimitStatus.maxRequests || 60));
  res.setHeader('X-RateLimit-Remaining', String(Math.max(0, rateLimitStatus.remaining ?? 0)));
  res.setHeader('X-RateLimit-Mode', rateLimitStatus.mode || 'local');
  if (rateLimitStatus.degraded) {
    res.setHeader('X-RateLimit-Degraded', 'true');
  }

  if (rateLimitStatus.limited) {
    res.setHeader('Retry-After', String(rateLimitStatus.retryAfterSec || 60));
    return res.status(429).json({
      error: 'Too Many Requests.',
      retryAfterSec: rateLimitStatus.retryAfterSec
    });
  }

  const { id } = req.query || {};
  if (!id) {
    return res.status(400).json({ error: 'Branch ID parameter is required.' });
  }

  try {
    const branch = await getBranchById(id);
    if (!branch) {
      return res.status(404).json({ error: `Branch not found with ID "${id}".` });
    }

    res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
    return res.status(200).json(branch);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}
