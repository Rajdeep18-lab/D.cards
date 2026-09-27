/**
 * Vercel Serverless Function: GET /api/banks
 * 
 * Directory of verified branches & ATMs with filtering, pagination, rate limiting, and caching.
 */

import { getBranches, getBranchById, getBankMetadata, checkRateLimit } from '../banksService.js';

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
