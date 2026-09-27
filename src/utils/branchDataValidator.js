/**
 * D.CARD Branch Data Validation Utility
 * 
 * Audits and validates branch records to guarantee data integrity across D.CARD.
 * Detects:
 * - Missing or invalid latitude/longitude (strict geographic bounds for India)
 * - Duplicate branch IDs or duplicate physical branch records
 * - Invalid PIN codes (must be valid 6-digit Indian postal code)
 * - Missing bank name or branch name
 * - Missing or invalid official source URL
 * - Stale or invalid verification dates
 * - Invalid or unverified IFSC codes
 */

// Geographic bounding box for India (inclusive of island territories)
const INDIA_GEO_BOUNDS = {
  minLat: 6.5,
  maxLat: 37.5,
  minLng: 68.0,
  maxLng: 97.5
};

const PINCODE_REGEX = /^[1-9][0-9]{5}$/;
const IFSC_REGEX = /^[A-Z]{4}0[A-Z0-9]{6}$/;

/**
 * Validates a single bank branch record
 * @param {Object} branch 
 * @returns {{ isValid: boolean, errors: string[], warnings: string[] }}
 */
export function validateBranchRecord(branch) {
  const errors = [];
  const warnings = [];

  if (!branch || typeof branch !== 'object') {
    return { isValid: false, errors: ['Record is not a valid object.'], warnings: [] };
  }

  // 1. Mandatory Identity Fields
  if (!branch.id || typeof branch.id !== 'string' || !branch.id.trim()) {
    errors.push('Missing or empty branch ID.');
  }

  if (!branch.bank_name || typeof branch.bank_name !== 'string' || !branch.bank_name.trim()) {
    errors.push('Missing or empty bank_name.');
  }

  if (!branch.branch_name || typeof branch.branch_name !== 'string' || !branch.branch_name.trim()) {
    errors.push('Missing or empty branch_name.');
  }

  // 2. Branch Type
  if (!branch.branch_type || !['Branch', 'ATM'].includes(branch.branch_type)) {
    errors.push(`Invalid branch_type: "${branch.branch_type}". Expected "Branch" or "ATM".`);
  }

  // 3. Geographic Coordinates
  if (typeof branch.latitude !== 'number' || isNaN(branch.latitude)) {
    errors.push(`Invalid or missing latitude: ${branch.latitude}`);
  } else if (branch.latitude < INDIA_GEO_BOUNDS.minLat || branch.latitude > INDIA_GEO_BOUNDS.maxLat) {
    errors.push(`Latitude ${branch.latitude} is outside valid geographic bounds for India.`);
  }

  if (typeof branch.longitude !== 'number' || isNaN(branch.longitude)) {
    errors.push(`Invalid or missing longitude: ${branch.longitude}`);
  } else if (branch.longitude < INDIA_GEO_BOUNDS.minLng || branch.longitude > INDIA_GEO_BOUNDS.maxLng) {
    errors.push(`Longitude ${branch.longitude} is outside valid geographic bounds for India.`);
  }

  // 4. Postal Code
  if (!branch.pincode || !PINCODE_REGEX.test(String(branch.pincode).trim())) {
    errors.push(`Invalid PIN code format: "${branch.pincode}". Must be a valid 6-digit Indian PIN code.`);
  }

  // 5. Address Details
  if (!branch.address || typeof branch.address !== 'string' || !branch.address.trim()) {
    errors.push('Missing or empty address.');
  }

  if (!branch.city || typeof branch.city !== 'string' || !branch.city.trim()) {
    errors.push('Missing or empty city.');
  }

  if (!branch.state || typeof branch.state !== 'string' || !branch.state.trim()) {
    errors.push('Missing or empty state.');
  }

  // 6. Source URL & Audit Verification
  if (!branch.source_url || typeof branch.source_url !== 'string' || !branch.source_url.startsWith('http')) {
    errors.push('Missing or invalid official source_url.');
  }

  if (!branch.verified_on || !/^\d{4}-\d{2}-\d{2}$/.test(branch.verified_on)) {
    errors.push(`Missing or invalid verified_on date format: "${branch.verified_on}". Expected YYYY-MM-DD.`);
  }

  // 7. IFSC Validation (if present)
  if (branch.ifsc) {
    const cleanIfsc = String(branch.ifsc).trim().toUpperCase();
    if (!IFSC_REGEX.test(cleanIfsc)) {
      warnings.push(`IFSC code "${branch.ifsc}" does not conform to standard RBI 11-character format.`);
    }
  } else {
    warnings.push('IFSC code not provided.');
  }

  // 8. Contact Phone & Hours Verification
  if (!branch.phone || branch.phone === 'Not available') {
    warnings.push('Phone number is missing or marked Not available.');
  }

  if (!branch.opening_hours || branch.opening_hours === 'Not available') {
    warnings.push('Opening hours are missing or marked Not available.');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Audits a complete dataset of branches, identifies duplicates and invalid entries
 * @param {Array} branches 
 * @returns {Object} Comprehensive audit report
 */
export function auditBranchDataset(branches = []) {
  const seenIds = new Set();
  const seenCoordinates = new Map(); // key: "lat_lng", value: branch

  const validRecords = [];
  const invalidRecords = [];
  const duplicateRecords = [];
  const recordsWithMissingFields = [];

  const bankDistribution = {};
  const cityDistribution = {};
  const stateDistribution = {};

  branches.forEach((branch, index) => {
    const validation = validateBranchRecord(branch);
    const branchId = branch?.id || `unidentified_${index}`;

    // A. Check ID Duplication
    if (seenIds.has(branchId)) {
      duplicateRecords.push({
        branch,
        reason: `Duplicate branch ID: "${branchId}"`
      });
      return;
    }
    seenIds.add(branchId);

    // B. Check Physical Location Duplication (Same bank at identical coordinates ~ 10m precision)
    if (typeof branch?.latitude === 'number' && typeof branch?.longitude === 'number') {
      const coordKey = `${branch.bank_name}_${branch.latitude.toFixed(4)}_${branch.longitude.toFixed(4)}`;
      if (seenCoordinates.has(coordKey)) {
        duplicateRecords.push({
          branch,
          reason: `Duplicate physical location with existing record: ${seenCoordinates.get(coordKey).id}`
        });
        return;
      }
      seenCoordinates.set(coordKey, branch);
    }

    // C. Validation Outcome
    if (!validation.isValid) {
      invalidRecords.push({
        branch,
        errors: validation.errors
      });
    } else {
      validRecords.push(branch);

      // Track missing optional metadata
      if (validation.warnings.length > 0) {
        recordsWithMissingFields.push({
          id: branch.id,
          bank_name: branch.bank_name,
          warnings: validation.warnings
        });
      }

      // Distributions
      const bName = branch.bank_name || 'Unknown';
      bankDistribution[bName] = (bankDistribution[bName] || 0) + 1;

      const cName = branch.city || 'Unknown';
      cityDistribution[cName] = (cityDistribution[cName] || 0) + 1;

      const sName = branch.state || 'Unknown';
      stateDistribution[sName] = (stateDistribution[sName] || 0) + 1;
    }
  });

  return {
    totalRecords: branches.length,
    validCount: validRecords.length,
    invalidCount: invalidRecords.length,
    duplicateCount: duplicateRecords.length,
    missingFieldsCount: recordsWithMissingFields.length,
    validRecords,
    invalidRecords,
    duplicateRecords,
    recordsWithMissingFields,
    bankDistribution,
    cityDistribution,
    stateDistribution
  };
}
