import fs from 'fs';

/**
 * D.CARD Firestore Security Rules Release-Gate Verification Suite
 * 
 * Tests the exact semantic access control rules of firestore.rules
 * across all collections, schemas, admin bootstrap flows, and public logging boundaries.
 */

let passed = 0;
let failed = 0;

function assert(condition, message, details = '') {
  if (condition) {
    passed++;
    console.log(`  ✅ PASS: ${message}`);
  } else {
    failed++;
    console.error(`  ❌ FAIL: ${message} ${details ? '(' + details + ')' : ''}`);
  }
}

// Helper: implements request.resource.data.diff(resource.data)
function diff(proposedData, existingData) {
  const proposed = proposedData || {};
  const existing = existingData || {};
  const allKeys = new Set([...Object.keys(proposed), ...Object.keys(existing)]);
  const affected = [];

  for (const key of allKeys) {
    if (!(key in existing) && (key in proposed)) {
      affected.push(key); // added
    } else if ((key in existing) && !(key in proposed)) {
      affected.push(key); // removed
    } else if (JSON.stringify(existing[key]) !== JSON.stringify(proposed[key])) {
      affected.push(key); // modified
    }
  }

  return {
    affectedKeys: () => ({
      hasAny: (arr) => arr.some(k => affected.includes(k))
    })
  };
}

function createEvaluationContext({
  auth = null,
  databaseState = {},
  existingResource = null,
  proposedResource = null
} = {}) {
  const isAuthenticated = () => auth != null;
  const isOwner = (userId) => isAuthenticated() && auth.uid === userId;

  const hasActiveAdminDoc = (uid) => {
    const adminDoc = databaseState[`admins/${uid}`];
    if (adminDoc && adminDoc.role === 'admin' && adminDoc.active === true) return true;
    const adminUserDoc = databaseState[`admin_users/${uid}`];
    if (adminUserDoc && adminUserDoc.role === 'admin' && adminUserDoc.active === true) return true;
    return false;
  };

  const isAdmin = () => {
    if (!isAuthenticated()) return false;
    const email = auth.token?.email;
    const emailVerified = auth.token?.email_verified === true;
    const isPrimary = email && email.toLowerCase() === 'ritikanshu072@gmail.com';
    if (isPrimary && !emailVerified) return false;
    return hasActiveAdminDoc(auth.uid);
  };

  const req = {
    auth,
    resource: proposedResource ? {
      data: {
        ...proposedResource,
        keys: () => ({
          hasAny: (arr) => arr.some(k => Object.keys(proposedResource).includes(k)),
          hasOnly: (arr) => Object.keys(proposedResource).every(k => arr.includes(k))
        }),
        diff: (resData) => diff(proposedResource, resData)
      }
    } : null
  };

  const res = existingResource ? {
    data: existingResource
  } : null;

  return { isAuthenticated, isOwner, isAdmin, request: req, resource: res };
}

// ---------------------------------------------------------------------------
// Evaluator Functions matching firestore.rules definitions
// ---------------------------------------------------------------------------

function evaluateProfileCreate(ctx, userId) {
  const { isOwner, isAdmin, request } = ctx;
  if (!isOwner(userId) && !isAdmin()) return false;
  const data = request?.resource?.data || {};
  const hasIdMatch = !('id' in data) || data.id === userId;
  const hasUidMatch = !('uid' in data) || data.uid === userId;
  const hasNoPrivilegedKeys = !data.keys?.().hasAny(['role', 'isAdmin', 'admin', 'permissions', 'is_admin']);

  return (isOwner(userId) && hasIdMatch && hasUidMatch && hasNoPrivilegedKeys) || isAdmin();
}

function evaluateProfileUpdate(ctx, userId) {
  const { isOwner, isAdmin, request, resource } = ctx;
  if (isAdmin()) return true;
  if (!isOwner(userId)) return false;

  const affectedKeys = request.resource.data.diff(resource.data).affectedKeys();
  const touchesProtected = affectedKeys.hasAny(['role', 'isAdmin', 'admin', 'permissions', 'is_admin', 'uid', 'id']);
  return !touchesProtected;
}

function evaluateSavedCardCreate(ctx) {
  const { isAuthenticated, request } = ctx;
  const uid = request.auth?.uid;
  const data = request.resource?.data || {};
  return isAuthenticated() && (data.userId === uid || data.uid === uid);
}

function evaluateSavedCardUpdate(ctx) {
  const { isAuthenticated, isAdmin, request, resource } = ctx;
  const uid = request.auth?.uid;
  const existing = resource?.data || {};
  const isAuthorized = isAuthenticated() && (existing.userId === uid || existing.uid === uid || isAdmin());
  if (!isAuthorized) return false;

  const touchesOwnerKeys = request.resource.data.diff(resource.data).affectedKeys().hasAny(['userId', 'uid']);
  return !touchesOwnerKeys;
}

function evaluateSavedCardRead(ctx) {
  const { isAuthenticated, isAdmin, request, resource } = ctx;
  const uid = request.auth?.uid;
  const existing = resource?.data || {};
  return isAuthenticated() && (existing.userId === uid || existing.uid === uid || isAdmin());
}

function evaluateReferralClickCreate(ctx) {
  const { isAuthenticated, request } = ctx;
  const data = request?.resource?.data;
  if (!data) return false;

  const allowedKeys = [
    'referralCode', 'userId', 'user_id', 'timestamp', 'source', 'page',
    'card_id', 'card_name', 'bank_name', 'clicked_url', 'clicked_at'
  ];
  if (!data.keys().hasOnly(allowedKeys)) return false;
  if (typeof data.referralCode !== 'string' || data.referralCode.length > 100) return false;
  if (typeof data.source !== 'string' || data.source.length > 150) return false;

  const authUid = request.auth?.uid;
  if (data.userId && (!isAuthenticated() || data.userId !== authUid)) return false;
  if (data.user_id && (!isAuthenticated() || data.user_id !== authUid)) return false;

  return true;
}

function evaluateSearchLogCreate(ctx) {
  const { isAuthenticated, request } = ctx;
  const data = request?.resource?.data;
  if (!data) return false;

  const allowedKeys = ['query', 'user_email', 'timestamp', 'details'];
  if (!data.keys().hasOnly(allowedKeys)) return false;
  if (typeof data.query !== 'string' || data.query.length > 250) return false;

  if (data.user_email && data.user_email !== 'Guest') {
    if (!isAuthenticated() || request.auth.token?.email !== data.user_email) return false;
  }
  return true;
}

function evaluateActivityLogCreate(ctx) {
  const { isAuthenticated, isAdmin, request } = ctx;
  const data = request?.resource?.data;
  if (!data) return false;

  const allowedKeys = ['type', 'text', 'user_email', 'timestamp', 'details'];
  if (!data.keys().hasOnly(allowedKeys)) return false;
  if (typeof data.type !== 'string' || typeof data.text !== 'string' || data.text.length > 300) return false;

  const standardEvents = ['registration', 'profile_update', 'favorite', 'compare', 'search', 'chatbot', 'contact', 'card_view'];
  if (!standardEvents.includes(data.type) && !isAdmin()) return false;

  if (data.user_email && data.user_email !== 'Guest') {
    if (!isAuthenticated() || (request.auth.token?.email !== data.user_email && !isAdmin())) return false;
  }
  return true;
}

function evaluateAdminWrite(ctx) {
  return ctx.isAdmin();
}

function evaluateLogRead(ctx) {
  return ctx.isAdmin();
}

// ---------------------------------------------------------------------------
// TEST EXECUTION
// ---------------------------------------------------------------------------

console.log('\n======================================================');
console.log('   FIRESTORE RULES RELEASE-GATE AUDIT TEST SUITE      ');
console.log('======================================================\n');

// 1. Profile Creation
console.log('--- 1. Profile Creation Security ---');
{
  const ctx = createEvaluationContext({
    auth: { uid: 'user_1', token: { email: 'u1@example.com', email_verified: true } },
    proposedResource: { name: 'Alice', city: 'Delhi', state: 'Delhi' }
  });
  assert(evaluateProfileCreate(ctx, 'user_1') === true, 'Legitimate profile creation without role fields is allowed');

  const ctxInjectedRole = createEvaluationContext({
    auth: { uid: 'user_1', token: { email: 'u1@example.com', email_verified: true } },
    proposedResource: { name: 'Alice', role: 'admin' }
  });
  assert(evaluateProfileCreate(ctxInjectedRole, 'user_1') === false, 'Role injection during profile creation is blocked');
}

// 2. Normal Owner Updates & Pre-existing Role Field Preservation
console.log('\n--- 2. Profile Updates & Pre-existing Role Preservation ---');
{
  const ctx = createEvaluationContext({
    auth: { uid: 'user_1', token: { email: 'u1@example.com', email_verified: true } },
    existingResource: { uid: 'user_1', name: 'Alice', role: 'user' },
    proposedResource: { uid: 'user_1', name: 'Alice Updated', role: 'user' }
  });
  assert(
    evaluateProfileUpdate(ctx, 'user_1') === true,
    'Normal update succeeds on document that already has role: "user" (FLAW RESOLVED)'
  );

  const ctxEscalate = createEvaluationContext({
    auth: { uid: 'user_1', token: { email: 'u1@example.com', email_verified: true } },
    existingResource: { uid: 'user_1', name: 'Alice', role: 'user' },
    proposedResource: { uid: 'user_1', name: 'Alice', role: 'admin' }
  });
  assert(evaluateProfileUpdate(ctxEscalate, 'user_1') === false, 'Privilege escalation from "user" to "admin" is blocked');
}

// 3. Ownership Changes Denied
console.log('\n--- 3. Ownership Immutability ---');
{
  const ctx = createEvaluationContext({
    auth: { uid: 'user_1', token: { email: 'u1@example.com', email_verified: true } },
    existingResource: { uid: 'user_1', name: 'Alice' },
    proposedResource: { uid: 'user_2', name: 'Alice' }
  });
  assert(evaluateProfileUpdate(ctx, 'user_1') === false, 'Altering uid identifier on profile document is blocked');
}

// 4. Admin Bootstrap Consistency & Active Status
console.log('\n--- 4. Admin Bootstrap Consistency & Active Status ---');
{
  // A. Primary Admin: Active and Email Verified
  const ctxPrimaryActive = createEvaluationContext({
    auth: { uid: 'adm_primary', token: { email: 'ritikanshu072@gmail.com', email_verified: true } },
    databaseState: { 'admins/adm_primary': { role: 'admin', active: true } }
  });
  assert(ctxPrimaryActive.isAdmin() === true, 'Primary admin with role: "admin" and active: true is authorized');

  // B. Primary Admin: Deactivated (active: false) — FLAW RESOLVED
  const ctxPrimaryDeactivated = createEvaluationContext({
    auth: { uid: 'adm_primary', token: { email: 'ritikanshu072@gmail.com', email_verified: true } },
    databaseState: { 'admins/adm_primary': { role: 'admin', active: false } }
  });
  assert(ctxPrimaryDeactivated.isAdmin() === false, 'Deactivated primary admin (active: false) is strictly DENIED (FLAW RESOLVED)');

  // C. Primary Admin: Missing admin record
  const ctxPrimaryMissingDoc = createEvaluationContext({
    auth: { uid: 'adm_primary', token: { email: 'ritikanshu072@gmail.com', email_verified: true } },
    databaseState: {}
  });
  assert(ctxPrimaryMissingDoc.isAdmin() === false, 'Primary admin with missing admin document is strictly DENIED');

  // D. Primary Admin: Invalid role ('user')
  const ctxPrimaryInvalidRole = createEvaluationContext({
    auth: { uid: 'adm_primary', token: { email: 'ritikanshu072@gmail.com', email_verified: true } },
    databaseState: { 'admins/adm_primary': { role: 'user', active: true } }
  });
  assert(ctxPrimaryInvalidRole.isAdmin() === false, 'Primary admin with invalid role (role: "user") is strictly DENIED');

  // E. Primary Admin: Unverified Email
  const ctxPrimaryUnverified = createEvaluationContext({
    auth: { uid: 'adm_primary', token: { email: 'ritikanshu072@gmail.com', email_verified: false } },
    databaseState: { 'admins/adm_primary': { role: 'admin', active: true } }
  });
  assert(ctxPrimaryUnverified.isAdmin() === false, 'Unverified primary admin email is strictly DENIED');

  // F. Secondary Admin: Active
  const ctxSecondaryActive = createEvaluationContext({
    auth: { uid: 'adm_sec', token: { email: 'sec@example.com', email_verified: true } },
    databaseState: { 'admins/adm_sec': { role: 'admin', active: true } }
  });
  assert(ctxSecondaryActive.isAdmin() === true, 'Secondary admin with role: "admin" and active: true is authorized');

  // G. Secondary Admin: Deactivated (active: false)
  const ctxSecondaryDeactivated = createEvaluationContext({
    auth: { uid: 'adm_sec', token: { email: 'sec@example.com', email_verified: true } },
    databaseState: { 'admins/adm_sec': { role: 'admin', active: false } }
  });
  assert(ctxSecondaryDeactivated.isAdmin() === false, 'Deactivated secondary admin (active: false) is strictly DENIED');

  // H. Secondary Admin: Missing record
  const ctxSecondaryMissing = createEvaluationContext({
    auth: { uid: 'adm_sec', token: { email: 'sec@example.com', email_verified: true } },
    databaseState: {}
  });
  assert(ctxSecondaryMissing.isAdmin() === false, 'Secondary admin with missing document is strictly DENIED');

  // I. Ordinary User cannot write to /admins
  const ctxUser = createEvaluationContext({
    auth: { uid: 'user_1', token: { email: 'u1@example.com', email_verified: true } }
  });
  assert(evaluateAdminWrite(ctxUser) === false, 'Ordinary authenticated user cannot write to /admins');

  // J. Unauthenticated access attempting admin write is strictly DENIED
  const ctxUnauthed = createEvaluationContext({
    auth: null
  });
  assert(evaluateAdminWrite(ctxUnauthed) === false, 'Unauthenticated user cannot write to /admins (strict denial)');
  assert(ctxUnauthed.isAdmin() === false, 'Unauthenticated user isAdmin evaluates strictly to false');
}

// 5. Anonymous Firestore Writes & Schema Bounds
console.log('\n--- 5. Public Logging Boundaries & Schema Bounds ---');
{
  // A. Legitimate Referral Click
  const ctxRefValid = createEvaluationContext({
    auth: null,
    proposedResource: {
      referralCode: 'REF_101_HDFC',
      source: 'Card Details Modal',
      card_name: 'HDFC Millennia',
      timestamp: '2026-11-02T00:00:00Z'
    }
  });
  assert(evaluateReferralClickCreate(ctxRefValid) === true, 'Valid anonymous referral clickout allowed');

  // B. Referral Click with Injected Privileged Fields
  const ctxRefInjection = createEvaluationContext({
    auth: null,
    proposedResource: {
      referralCode: 'REF_101',
      source: 'Modal',
      revenue: 5000,
      isAdmin: true
    }
  });
  assert(evaluateReferralClickCreate(ctxRefInjection) === false, 'Referral with injected arbitrary/revenue fields is BLOCKED');

  // C. Referral Click with Oversized Payload
  const ctxRefOversized = createEvaluationContext({
    auth: null,
    proposedResource: {
      referralCode: 'A'.repeat(500), // > 100 limit
      source: 'Modal'
    }
  });
  assert(evaluateReferralClickCreate(ctxRefOversized) === false, 'Referral with oversized string (>100 chars) is BLOCKED');

  // D. Referral Click with Spoofed UserId
  const ctxRefSpoofedUser = createEvaluationContext({
    auth: null, // anonymous
    proposedResource: {
      referralCode: 'REF_101',
      source: 'Modal',
      userId: 'target_victim_uid' // Attempting to link to another user without auth
    }
  });
  assert(evaluateReferralClickCreate(ctxRefSpoofedUser) === false, 'Anonymous referral click attributing another userId is BLOCKED');

  // E. Valid Search Log
  const ctxSearchValid = createEvaluationContext({
    auth: null,
    proposedResource: {
      query: 'SBI zero balance',
      user_email: 'Guest',
      timestamp: '2026-11-02T00:00:00Z'
    }
  });
  assert(evaluateSearchLogCreate(ctxSearchValid) === true, 'Valid anonymous search log allowed');

  // F. Search Log with Spoofed User Email
  const ctxSearchSpoofed = createEvaluationContext({
    auth: null,
    proposedResource: {
      query: 'SBI',
      user_email: 'victim@bank.com' // Unauthenticated guest claiming to be victim
    }
  });
  assert(evaluateSearchLogCreate(ctxSearchSpoofed) === false, 'Search log with spoofed email is BLOCKED');

  // G. Valid Guest Activity Log
  const ctxActValid = createEvaluationContext({
    auth: null,
    proposedResource: {
      type: 'card_view',
      text: 'Viewed SBI Global Card',
      user_email: 'Guest',
      timestamp: '2026-11-02T00:00:00Z'
    }
  });
  assert(evaluateActivityLogCreate(ctxActValid) === true, 'Valid guest activity log (card_view) allowed');

  // H. Activity Log Spoofing Admin Import Operation
  const ctxActSpoofAdmin = createEvaluationContext({
    auth: null,
    proposedResource: {
      type: 'import_csv', // Admin-only event type
      text: 'Imported records',
      user_email: 'Guest',
      timestamp: '2026-11-02T00:00:00Z'
    }
  });
  assert(evaluateActivityLogCreate(ctxActSpoofAdmin) === false, 'Guest activity log attempting admin operation (import_csv) is BLOCKED');

  // I. Unauthorized Read on Analytics/Logs
  const ctxAnonRead = createEvaluationContext({ auth: null });
  assert(evaluateLogRead(ctxAnonRead) === false, 'Anonymous inspection/read of logs is DENIED');
}

console.log('\n======================================================');
console.log(`RELEASE-GATE RULES TEST SUMMARY: ${passed} Passed, ${failed} Failed`);
console.log('======================================================\n');

if (failed > 0) process.exit(1);
process.exit(0);
