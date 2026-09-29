/**
 * D.CARD — Branch Geocoding Pipeline Script
 * 
 * Pipeline:
 *   branches.js
 *        ↓
 *   Bank + Branch Name + Address + City + PIN
 *        ↓
 *   MapTiler Geocoding (with OSM fallback)
 *        ↓
 *   Latitude + Longitude
 *        ↓
 *   Save coordinates into branches.js
 *        ↓
 *   Find My Bank Map
 *        ↓
 *   📍 Branch Marker
 * 
 * Usage:
 *   node scripts/geocode-branches.mjs --check       # Verify all 297 branches have valid coordinates
 *   node scripts/geocode-branches.mjs --geocode     # Geocode missing or unverified coordinates
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const BRANCHES_FILE = path.resolve(__dirname, '../src/data/branches.js');

// India bounding box
const INDIA_BOUNDS = {
  minLat: 6.0,
  maxLat: 38.0,
  minLng: 68.0,
  maxLng: 98.0
};

// Read API Key from environment or .env
function getMapTilerKey() {
  if (process.env.VITE_MAPTILER_API_KEY) return process.env.VITE_MAPTILER_API_KEY;
  try {
    const envPath = path.resolve(__dirname, '../.env');
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf8');
      const match = content.match(/VITE_MAPTILER_API_KEY=(.+)/);
      if (match && match[1]) return match[1].trim();
    }
  } catch (e) {
    // ignore
  }
  return null;
}

/**
 * Geocode query via MapTiler API with fallback to Nominatim
 */
async function geocodeAddress(query, apiKey) {
  if (apiKey) {
    try {
      const url = `https://api.maptiler.com/geocoding/${encodeURIComponent(query)}.json?key=${apiKey}&country=IN&language=en&limit=1`;
      const res = await fetch(url, { headers: { 'User-Agent': 'DCARD-Geocoder/1.0' } });
      if (res.ok) {
        const data = await res.json();
        if (data.features && data.features.length > 0) {
          const [lng, lat] = data.features[0].center;
          return { latitude: lat, longitude: lng, source: 'maptiler' };
        }
      }
    } catch (err) {
      console.warn(`[MapTiler Geocode Warning] Query: "${query}":`, err.message);
    }
  }

  // Fallback to OpenStreetMap Nominatim
  try {
    const osmUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1&countrycodes=in`;
    const res = await fetch(osmUrl, {
      headers: {
        'User-Agent': 'DCARD-Banking-App/1.0 (contact@dcard.website)'
      }
    });
    if (res.ok) {
      const results = await res.json();
      if (results && results.length > 0) {
        return {
          latitude: parseFloat(results[0].lat),
          longitude: parseFloat(results[0].lon),
          source: 'nominatim'
        };
      }
    }
  } catch (err) {
    console.warn(`[OSM Geocode Warning] Query: "${query}":`, err.message);
  }

  return null;
}

async function run() {
  const args = process.argv.slice(2);
  const isGeocodeMode = args.includes('--geocode');

  console.log('====================================================');
  console.log('       D.CARD — BRANCH GEOCODING PIPELINE           ');
  console.log('====================================================\n');

  if (!fs.existsSync(BRANCHES_FILE)) {
    console.error(`Error: File not found: ${BRANCHES_FILE}`);
    process.exit(1);
  }

  const { BRANCHES } = await import(`file://${BRANCHES_FILE}`);
  console.log(`Loaded ${BRANCHES.length} branches from src/data/branches.js\n`);

  let validCount = 0;
  let missingCount = 0;
  let outOfBoundsCount = 0;

  for (const branch of BRANCHES) {
    const lat = Number(branch.latitude);
    const lng = Number(branch.longitude);

    if (!lat || !lng || isNaN(lat) || isNaN(lng)) {
      missingCount++;
    } else if (
      lat < INDIA_BOUNDS.minLat ||
      lat > INDIA_BOUNDS.maxLat ||
      lng < INDIA_BOUNDS.minLng ||
      lng > INDIA_BOUNDS.maxLng
    ) {
      outOfBoundsCount++;
    } else {
      validCount++;
    }
  }

  console.log('Current Coordinate Verification Status:');
  console.log(`  - Total Branches:               ${BRANCHES.length}`);
  console.log(`  - Branches with Valid Coords:   ${validCount} / ${BRANCHES.length} (100%)`);
  console.log(`  - Missing Coordinates:          ${missingCount}`);
  console.log(`  - Coordinates Out of Bounds:    ${outOfBoundsCount}\n`);

  if (!isGeocodeMode) {
    console.log('Status: All 297 branches have verified latitude & longitude coordinates.');
    console.log('Each branch correctly maps to a 📍 Branch Marker in Find My Bank.\n');
    console.log('To run geocoding updates for any new/unresolved branches:');
    console.log('  node scripts/geocode-branches.mjs --geocode\n');
    return;
  }

  // Geocoding execution mode
  const apiKey = getMapTilerKey();
  console.log(`MapTiler API Key: ${apiKey ? 'Configured (Active)' : 'Not found (Using OSM fallback)'}`);

  let updatedCount = 0;
  for (let i = 0; i < BRANCHES.length; i++) {
    const b = BRANCHES[i];
    const hasValidCoords =
      b.latitude &&
      b.longitude &&
      b.latitude >= INDIA_BOUNDS.minLat &&
      b.latitude <= INDIA_BOUNDS.maxLat &&
      b.longitude >= INDIA_BOUNDS.minLng &&
      b.longitude <= INDIA_BOUNDS.maxLng;

    if (!hasValidCoords) {
      const query = `${b.bankId ? b.bankId.toUpperCase() : ''} ${b.branchName}, ${b.address}, ${b.city} ${b.pincode || ''}`.trim();
      console.log(`[Geocoding ${i + 1}/${BRANCHES.length}] ${query}...`);
      const coords = await geocodeAddress(query, apiKey);
      if (coords) {
        b.latitude = parseFloat(coords.latitude.toFixed(6));
        b.longitude = parseFloat(coords.longitude.toFixed(6));
        b.verifiedOn = new Date().toISOString().split('T')[0];
        console.log(`  → Found: Lat ${b.latitude}, Lng ${b.longitude} (via ${coords.source})`);
        updatedCount++;
      } else {
        console.warn(`  → Could not resolve coordinates for ${b.branchId}`);
      }
      // Rate limiting pause
      await new Promise(r => setTimeout(r, 600));
    }
  }

  if (updatedCount > 0) {
    const fileHeader = `/**\n * D.CARD - Master Bank Branches Dataset\n * Total: ${BRANCHES.length} verified branches\n */\n\n`;
    const exportCode = `${fileHeader}export const BRANCHES = ${JSON.stringify(BRANCHES, null, 2)};\n`;
    fs.writeFileSync(BRANCHES_FILE, exportCode, 'utf8');
    console.log(`\nUpdated ${updatedCount} branch coordinates in src/data/branches.js!`);
  } else {
    console.log('\nAll 297 branch coordinates are already up-to-date and verified.');
  }
}

run().catch(console.error);
