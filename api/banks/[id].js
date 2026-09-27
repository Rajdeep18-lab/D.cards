/**
 * Vercel Serverless Function: GET /api/banks/:id
 * 
 * Fetches a single verified branch or ATM record by unique ID.
 */

import { getBranchById, checkRateLimit } from '../banksService.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  const clientIp = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '127.0.0.1';
  const rateLimitStatus = checkRateLimit(clientIp);
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
