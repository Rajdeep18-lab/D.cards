import {
  locations,
  ALL_INDIA_LOCATION,
  popularLocationSlugs,
  getAllStates,
  getAllCities,
  getCitiesByState,
  getLocationBySlug,
  searchLocations,
  getCityDisplayName,
  getFormattedLocation,
  getPopularLocations,
  isProductAvailableInLocation,
  INDIAN_LOCATIONS,
  COUNTRY_CODES
} from '../src/data/locations.js';

/**
 * Lightweight, zero-dependency data quality validator for D.CARD location system
 */
export function validateLocationDataset() {
  const errors = [];
  const warnings = [];

  const allCities = getAllCities();
  const allStates = getAllStates();

  // 1. Validate All India
  if (!ALL_INDIA_LOCATION || ALL_INDIA_LOCATION.slug !== 'all-india' || ALL_INDIA_LOCATION.isAllIndia !== true) {
    errors.push("ALL_INDIA_LOCATION is missing or malformed");
  }

  // 2. Validate 36 States & UTs
  if (allStates.length !== 36) {
    errors.push(`Expected 36 States/UTs, found ${allStates.length}`);
  }

  // Standard 2-letter ISO 3166-2:IN codes
  const validStateCodes = new Set([
    'AN', 'AP', 'AR', 'AS', 'BR', 'CH', 'CG', 'DD', 'DL', 'GA', 'GJ', 'HR', 'HP',
    'JK', 'JH', 'KA', 'KL', 'LA', 'LD', 'MP', 'MH', 'MN', 'ML', 'MZ', 'NL', 'OD',
    'PY', 'PB', 'RJ', 'SK', 'TN', 'TG', 'TR', 'UP', 'UK', 'WB'
  ]);

  for (const s of locations) {
    if (!s.state || typeof s.state !== 'string' || !s.state.trim()) {
      errors.push(`Invalid state name: "${s.state}"`);
    }
    if (!validStateCodes.has(s.stateCode)) {
      errors.push(`Invalid state code "${s.stateCode}" for state "${s.state}"`);
    }
    if (!Array.isArray(s.cities) || s.cities.length === 0) {
      errors.push(`State "${s.state}" has no cities`);
    }
  }

  // 3. Validate Cities
  const seenSlugs = new Set();
  const seenCityNamesByState = new Set();

  for (const c of allCities) {
    if (!c.name || typeof c.name !== 'string' || !c.name.trim()) {
      errors.push(`Empty or non-string city name encountered`);
    }
    if (c.name.trim() !== c.name) {
      warnings.push(`City name "${c.name}" contains leading/trailing whitespace`);
    }

    if (!c.slug || typeof c.slug !== 'string' || !c.slug.trim()) {
      errors.push(`Empty or non-string slug for city "${c.name}"`);
    }
    if (c.slug.trim() !== c.slug) {
      warnings.push(`Slug "${c.slug}" contains leading/trailing whitespace`);
    }
    if (seenSlugs.has(c.slug)) {
      errors.push(`Duplicate slug detected: "${c.slug}" in city "${c.name}"`);
    }
    seenSlugs.add(c.slug);

    const stateCityKey = `${c.name.toLowerCase()}__${c.state.toLowerCase()}`;
    if (seenCityNamesByState.has(stateCityKey)) {
      errors.push(`Duplicate city "${c.name}" in state "${c.state}"`);
    }
    seenCityNamesByState.add(stateCityKey);

    // Aliases
    if (!Array.isArray(c.aliases)) {
      errors.push(`Aliases for city "${c.name}" is not an array`);
    } else {
      const aliasSet = new Set();
      for (const a of c.aliases) {
        if (!a || typeof a !== 'string') {
          errors.push(`Malformed non-string alias in city "${c.name}"`);
        } else {
          if (a.trim() !== a) {
            warnings.push(`Alias "${a}" in city "${c.name}" contains whitespace`);
          }
          if (aliasSet.has(a.toLowerCase())) {
            errors.push(`Duplicate alias "${a}" inside city "${c.name}"`);
          }
          aliasSet.add(a.toLowerCase());
        }
      }
    }

    // PIN codes
    if (!Array.isArray(c.pincodes)) {
      errors.push(`Pincodes for city "${c.name}" is not an array`);
    }
  }

  // 4. Validate Checklist Cities
  const requiredCities = [
    { query: "Delhi", state: "Delhi" },
    { query: "Mumbai", state: "Maharashtra" },
    { query: "Bengaluru", state: "Karnataka" },
    { query: "Hyderabad", state: "Telangana" },
    { query: "Chennai", state: "Tamil Nadu" },
    { query: "Kolkata", state: "West Bengal" },
    { query: "Pune", state: "Maharashtra" },
    { query: "Ahmedabad", state: "Gujarat" },
    { query: "Chandigarh", state: "Chandigarh" },
    { query: "Haridwar", state: "Uttarakhand" },
    { query: "Bhopal", state: "Madhya Pradesh" },
    { query: "Asansol", state: "West Bengal" },
    { query: "Medininagar", state: "Jharkhand" },
    { query: "Daltonganj", state: "Jharkhand" }
  ];

  for (const req of requiredCities) {
    const res = searchLocations(req.query);
    if (!res || res.length === 0) {
      errors.push(`Required city search "${req.query}" yielded 0 results`);
    } else if (req.state && res[0].state !== req.state) {
      errors.push(`Required city search "${req.query}" returned state "${res[0].state}" instead of "${req.state}"`);
    }
  }

  // 5. Validate Popular Locations
  if (!Array.isArray(popularLocationSlugs) || popularLocationSlugs.length < 15) {
    errors.push("popularLocationSlugs is too small or not an array");
  }
  const popularObjects = getPopularLocations();
  if (popularObjects.length !== popularLocationSlugs.length) {
    errors.push(`popularLocations resolved ${popularObjects.length} out of ${popularLocationSlugs.length} slugs`);
  }

  // 6. Validate Availability Filtering
  const testCardAll = { id: 1, availability: { type: "all_india" } };
  const testCardUK = { id: 2, availability: { type: "states", states: ["Uttarakhand"] } };
  const testCardHaridwar = { id: 3, availability: { type: "cities", cities: ["Haridwar"] } };

  const haridwarLoc = getLocationBySlug("haridwar");
  const bhopalLoc = getLocationBySlug("bhopal");

  if (!isProductAvailableInLocation(testCardAll, haridwarLoc)) errors.push("all_india product test failed");
  if (!isProductAvailableInLocation(testCardUK, haridwarLoc)) errors.push("state product matching test failed");
  if (isProductAvailableInLocation(testCardUK, bhopalLoc)) errors.push("state product non-matching test failed");
  if (!isProductAvailableInLocation(testCardHaridwar, haridwarLoc)) errors.push("city product matching test failed");
  if (isProductAvailableInLocation(testCardHaridwar, bhopalLoc)) errors.push("city product non-matching test failed");

  // 7. Validate Backward Compatibility Maps
  if (Object.keys(INDIAN_LOCATIONS).length !== 36) {
    errors.push(`INDIAN_LOCATIONS has ${Object.keys(INDIAN_LOCATIONS).length} keys instead of 36`);
  }
  if (!Array.isArray(COUNTRY_CODES) || COUNTRY_CODES.length === 0) {
    errors.push("COUNTRY_CODES is invalid");
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    stats: {
      statesCount: allStates.length,
      citiesCount: allCities.length,
      popularCount: popularLocationSlugs.length
    }
  };
}

// Auto-run if executed directly via node
const result = validateLocationDataset();
console.log("=== D.CARD LOCATION VALIDATION REPORT ===");
console.log(`Status: ${result.valid ? "PASSED" : "FAILED"}`);
console.log(`States/UTs: ${result.stats.statesCount}/36`);
console.log(`Total Cities: ${result.stats.citiesCount}`);
console.log(`Popular Locations: ${result.stats.popularCount}`);
console.log(`Warnings: ${result.warnings.length}`);
console.log(`Errors: ${result.errors.length}`);

if (result.errors.length > 0) {
  console.error("ERRORS:", result.errors);
  process.exit(1);
} else {
  console.log("All validation checks passed successfully!");
}
