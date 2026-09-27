/**
 * Vercel Serverless Function entry point: /api/banks
 * Dispatches to /api/banks/index.js or /api/banks/nearby.js
 */

import banksHandler from './banks/index.js';
import nearbyHandler from './banks/nearby.js';

export default async function handler(req, res) {
  const url = req.url || '';
  if (url.includes('/nearby')) {
    return nearbyHandler(req, res);
  }
  return banksHandler(req, res);
}
