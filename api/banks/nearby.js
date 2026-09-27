/**
 * Vercel Serverless Function: GET /api/banks/nearby
 * 
 * Scalable nearby branch and ATM search endpoint with Haversine distance,
 * nearest-first sorting, input validation, rate limiting, and pagination.
 */

import { getNearbyBranches, checkRateLimit } from '../banksService.js';

export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  // Security: Extract IP and enforce rate limiting (60 requests/min)
  const clientIp = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '127.0.0.1';
  const rateLimitStatus = checkRateLimit(clientIp);
  if (rateLimitStatus.limited) {
    res.setHeader('Retry-After', String(rateLimitStatus.retryAfterSec || 60));
    return res.status(429).json({
      error: 'Too Many Requests. Please wait before searching again.',
      retryAfterSec: rateLimitStatus.retryAfterSec
    });
  }

  // Parse query parameters
  const {
    lat,
    lng,
    radiusKm = 10,
    bank = 'All Banks',
    type = 'All',
    page = 1,
    limit = 50
  } = req.query || {};

  // Input Validation
  if (lat === undefined || lng === undefined) {
    return res.status(400).json({
      error: 'Missing required query parameters: "lat" and "lng" are required.'
    });
  }

  try {
    const result = await getNearbyBranches({
      lat,
      lng,
      radiusKm,
      bank,
      type,
      page,
      limit
    });

    res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=120');
    return res.status(200).json(result);
  } catch (err) {
    console.error('[API /api/banks/nearby Error]:', err.message);
    return res.status(400).json({
      error: err.message || 'Error processing nearby branch search.'
    });
  }
}
