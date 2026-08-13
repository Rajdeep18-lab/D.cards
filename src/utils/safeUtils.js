/**
 * SAFE NORMALIZATION HELPERS
 * Protects string, array, and numeric operations from null / undefined runtime crashes
 */

export function safeString(value) {
  if (value === null || value === undefined) return '';
  return String(value);
}

export function safeLower(value) {
  if (value === null || value === undefined) return '';
  return String(value).toLowerCase().trim();
}

export function safeArray(value) {
  if (Array.isArray(value)) return value;
  if (value === null || value === undefined) return [];
  return [value];
}

export function parseNumericValue(val) {
  if (val === null || val === undefined) return 0;
  if (typeof val === 'number') return isNaN(val) ? 0 : val;
  const cleaned = String(val).replace(/[^0-9.]/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
}

export function safeIncludes(haystack, needle) {
  const safeH = safeLower(haystack);
  const safeN = safeLower(needle);
  if (!safeN) return true;
  return safeH.includes(safeN);
}
