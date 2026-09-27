/**
 * D.CARD Search Autocomplete Service
 * 
 * Provides fast, contextual typeahead suggestions based on:
 * - Verified bank names and popular aliases (e.g. SBI -> State Bank of India)
 * - Verified locations (cities, PIN codes, and prominent areas)
 * - Smart combinations (Bank + City, e.g. "HDFC Bank Kharar", "SBI Chandigarh")
 * - Smart intent options ("ATM near me", "Banks in Kharar")
 */

import { getKnownLocationsIndex, getUniqueBankNames } from '../services/branchDataProvider.js';
import { parseSmartSearchQuery } from './smartSearchParser.js';

/**
 * Returns prioritized suggestions matching the user's input.
 * @param {string} input 
 * @param {number} maxResults 
 * @returns {Array<Object>} List of suggestions
 */
export function getSearchSuggestions(input = '', maxResults = 6) {
  if (!input || typeof input !== 'string') return [];
  const query = input.trim();
  if (query.length === 0) return [];

  const lower = query.toLowerCase();
  const parsed = parseSmartSearchQuery(query);
  const { cities, pincodes } = getKnownLocationsIndex();
  const allBanks = getUniqueBankNames();

  const suggestions = [];
  const seenQueries = new Set();

  const addSuggestion = (item) => {
    const key = item.query.toLowerCase().trim();
    if (!seenQueries.has(key) && suggestions.length < maxResults) {
      seenQueries.add(key);
      suggestions.push(item);
    }
  };

  // 1. If user is typing "near me", "closest", "atm near me", etc.
  if (parsed.isNearMe || lower.includes('near') || lower.includes('close')) {
    if (parsed.matchedBank) {
      addSuggestion({
        id: `near_me_bank_${parsed.matchedBank}`,
        title: `${parsed.matchedBank} near me`,
        subtitle: `Find closest ${parsed.matchedBank} branches using live GPS`,
        category: 'near_me',
        icon: 'gps',
        query: `${parsed.matchedBank} near me`,
        parsed: { ...parsed, isNearMe: true }
      });
    } else if (parsed.matchedType === 'ATM') {
      addSuggestion({
        id: 'near_me_atm',
        title: 'ATMs near me',
        subtitle: 'Find closest cash machines using live GPS',
        category: 'near_me',
        icon: 'atm',
        query: 'ATM near me',
        parsed: { ...parsed, isNearMe: true, matchedType: 'ATM' }
      });
    } else {
      addSuggestion({
        id: 'near_me_all',
        title: 'Banks near me',
        subtitle: 'Locate all verified bank branches using live GPS',
        category: 'near_me',
        icon: 'gps',
        query: 'Banks near me',
        parsed: { ...parsed, isNearMe: true, matchedType: 'All' }
      });
    }
  }

  // 2. PIN code matches (e.g. "1403", "140301", "1600")
  if (/^\d{2,6}$/.test(lower) || parsed.matchedPincode) {
    const pinTerm = parsed.matchedPincode || lower;
    for (const p of pincodes) {
      if (p.name.startsWith(pinTerm)) {
        addSuggestion({
          id: `pin_${p.name}`,
          title: `${p.name} — ${p.city}`,
          subtitle: `PIN Code in ${p.city}, ${p.state}`,
          category: 'pincode',
          icon: 'pin',
          query: p.name,
          parsed: {
            rawQuery: p.name,
            matchedBank: null,
            matchedLocation: p.name,
            matchedPincode: p.name,
            matchedType: null,
            isNearMe: false
          }
        });
      }
    }
  }

  // 3. Smart Combination: Bank + Known City (e.g. "HDFC K", "SBI Ch", "ICICI Mo")
  if (parsed.matchedBank && !parsed.isNearMe) {
    // If a location was partially typed, match cities
    const locationPrefix = parsed.matchedLocation ? parsed.matchedLocation.toLowerCase() : '';
    for (const city of cities) {
      if (!locationPrefix || city.name.toLowerCase().startsWith(locationPrefix)) {
        addSuggestion({
          id: `bank_city_${parsed.matchedBank}_${city.name}`,
          title: `${parsed.matchedBank} in ${city.name}`,
          subtitle: `Branches in ${city.name}, ${city.state}`,
          category: 'combination',
          icon: 'bank',
          query: `${parsed.matchedBank} ${city.name}`,
          parsed: {
            rawQuery: `${parsed.matchedBank} ${city.name}`,
            matchedBank: parsed.matchedBank,
            matchedLocation: city.name,
            matchedPincode: null,
            matchedType: parsed.matchedType || null,
            isNearMe: false
          }
        });
      }
    }
  }

  // 4. Exact/Prefix Bank Matches (e.g. "HDFC", "SBI", "Axis", "Kotak")
  for (const b of allBanks) {
    const bLower = b.toLowerCase();
    if (bLower.includes(lower) || lower.includes(bLower.split(' ')[0])) {
      addSuggestion({
        id: `bank_${b}`,
        title: b,
        subtitle: 'Bank institution filter',
        category: 'bank',
        icon: 'bank',
        query: b,
        parsed: {
          rawQuery: b,
          matchedBank: b,
          matchedLocation: null,
          matchedPincode: null,
          matchedType: null,
          isNearMe: false
        }
      });

      // Suggest top regional hubs for this bank
      for (const city of cities.slice(0, 3)) {
        addSuggestion({
          id: `combo_${b}_${city.name}`,
          title: `${b} ${city.name}`,
          subtitle: `Locate ${b} branches in ${city.name}`,
          category: 'combination',
          icon: 'bank',
          query: `${b} ${city.name}`,
          parsed: {
            rawQuery: `${b} ${city.name}`,
            matchedBank: b,
            matchedLocation: city.name,
            matchedPincode: null,
            matchedType: null,
            isNearMe: false
          }
        });
      }
    }
  }

  // 5. City Matches (e.g. "Kharar", "Mohali", "Chandigarh", "Delhi")
  for (const city of cities) {
    if (city.name.toLowerCase().includes(lower) || city.state.toLowerCase().includes(lower)) {
      addSuggestion({
        id: `city_${city.name}`,
        title: `${city.name}, ${city.state}`,
        subtitle: `Search verified branches in ${city.name}`,
        category: 'location',
        icon: 'pin',
        query: city.name,
        parsed: {
          rawQuery: city.name,
          matchedBank: null,
          matchedLocation: city.name,
          matchedPincode: null,
          matchedType: null,
          isNearMe: false
        }
      });

      // Also suggest ATM option in this city
      if (lower.includes('atm')) {
        addSuggestion({
          id: `city_atm_${city.name}`,
          title: `ATMs in ${city.name}`,
          subtitle: `Cash withdrawal points in ${city.name}`,
          category: 'combination',
          icon: 'atm',
          query: `ATM near ${city.name}`,
          parsed: {
            rawQuery: `ATM near ${city.name}`,
            matchedBank: null,
            matchedLocation: city.name,
            matchedPincode: null,
            matchedType: 'ATM',
            isNearMe: false
          }
        });
      }
    }
  }

  // 6. ATM Intent General Matches
  if (lower.startsWith('atm') && suggestions.length < maxResults) {
    for (const city of cities.slice(0, 2)) {
      addSuggestion({
        id: `atm_hub_${city.name}`,
        title: `ATMs near ${city.name}`,
        subtitle: `Find verified ATMs in ${city.name}, ${city.state}`,
        category: 'combination',
        icon: 'atm',
        query: `ATM near ${city.name}`,
        parsed: {
          rawQuery: `ATM near ${city.name}`,
          matchedBank: null,
          matchedLocation: city.name,
          matchedPincode: null,
          matchedType: 'ATM',
          isNearMe: false
        }
      });
    }
  }

  return suggestions.slice(0, maxResults);
}
