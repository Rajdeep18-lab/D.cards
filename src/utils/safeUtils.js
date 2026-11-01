/**
 * SAFE NORMALIZATION & SECURITY HELPERS
 * Protects string, array, and numeric operations from null / undefined runtime crashes
 * and guards DOM insertions against XSS and unsafe URL protocols.
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

/**
 * Escapes HTML entities to prevent DOM XSS injection
 */
export function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Sanitizes external URLs, strictly rejecting dangerous schemes like javascript:, data:, or vbscript:
 */
export function safeUrl(url, defaultUrl = '#') {
  if (!url || typeof url !== 'string') return defaultUrl;
  const trimmed = url.trim();
  if (/^(javascript|data|vbscript):/i.test(trimmed)) {
    return defaultUrl;
  }
  if (/^(https?:|\/|#|tel:|mailto:)/i.test(trimmed)) {
    return trimmed;
  }
  return defaultUrl;
}
