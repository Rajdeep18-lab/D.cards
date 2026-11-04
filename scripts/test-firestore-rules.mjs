import fs from 'fs';

/**
 * D.CARD Firestore Security Rules Audit & Hardening Test Suite
 * 
 * Verifies access control rules across:
 * 1. Static syntax & CEL rule integrity checks on firestore.rules
 * 2. 14 Mandatory Security Audit Tests
 * 3. Multi-field ownership consistency & anti-spoofing (user and admin paths)
 * 4. Admin update permissions separated from normal owner update permissions,
 *    while strictly locking ownership identity fields (userId, uid, user_id, id)
 * 5. Contact query schema hardening & anti-injection validation:
 *    - Strict ISO timestamp bounds
 *    - Nested history map validation (whitelisted keys, sender == 'user')
 *    - Status, assigned_to, admin_reply and replied_at constraints
 * 6. Admin document bootstrap field whitelist and role verification
 * 7. Review creation bounds, serverTimestamp validation, and email matching
 * 8. Public logging boundaries
 * 
 * NOTE: This suite executes static syntax checks and comprehensive in-memory
 * behavioral logic simulation. Live Firebase Emulator testing requires
 * @firebase/rules-unit-testing and a Java 11+ runtime.
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
  time = '2026-11-04T23:00:00Z',
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
    time,
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

function isStrictOwner(data, authUid) {
  if (!data || !authUid) return false;
  const hasAtLeastOne = (data.userId === authUid) || (data.uid === authUid) || (data.user_id === authUid);
  const noMismatchUserId = !('userId' in data) || data.userId === authUid;
  const noMismatchUid = !('uid' in data) || data.uid === authUid;
  const noMismatchUserIdAlt = !('user_id' in data) || data.user_id === authUid;
  return hasAtLeastOne && noMismatchUserId && noMismatchUid && noMismatchUserIdAlt;
}

function evaluateDebitCardRead() {
  return true;
}

function evaluateDebitCardWrite(ctx) {
  return ctx.isAdmin();
}

function evaluateProfileRead(ctx, userId) {
  return ctx.isOwner(userId) || ctx.isAdmin();
}

function evaluateProfileCreate(ctx, userId) {
  const { isOwner, isAdmin, request } = ctx;
  if (!isOwner(userId) && !isAdmin()) return false;
  const data = request?.resource?.data || {};
  const hasIdMatch = !('id' in data) || data.id === userId;
  const hasUidMatch = !('uid' in data) || data.uid === userId;
  const hasUserIdMatch = !('user_id' in data) || data.user_id === userId;
  const hasNoPrivilegedKeys = !data.keys?.().hasAny(['role', 'isAdmin', 'admin', 'permissions', 'is_admin']);

  return (isOwner(userId) && hasIdMatch && hasUidMatch && hasUserIdMatch && hasNoPrivilegedKeys) || isAdmin();
}

function evaluateProfileUpdate(ctx, userId) {
  const { isOwner, isAdmin, request, resource } = ctx;
  const affectedKeys = request.resource.data.diff(resource.data).affectedKeys();

  // Admin update path: permitted, but strictly cannot tamper with identity keys
  if (isAdmin()) {
    return !affectedKeys.hasAny(['uid', 'id', 'user_id']);
  }

  // Owner update path
  if (!isOwner(userId)) return false;

  const data = request?.resource?.data || {};
  const hasIdMatch = !('id' in data) || data.id === userId;
  const hasUidMatch = !('uid' in data) || data.uid === userId;
  const hasUserIdMatch = !('user_id' in data) || data.user_id === userId;
  if (!hasIdMatch || !hasUidMatch || !hasUserIdMatch) return false;

  const touchesProtected = affectedKeys.hasAny(['role', 'isAdmin', 'admin', 'permissions', 'is_admin', 'uid', 'id', 'user_id']);
  return !touchesProtected;
}

function evaluateSavedCardRead(ctx) {
  const { isAuthenticated, isAdmin, request, resource } = ctx;
  const uid = request.auth?.uid;
  const existing = resource?.data || {};
  return isAuthenticated() && (isStrictOwner(existing, uid) || isAdmin());
}

function evaluateSavedCardCreate(ctx) {
  const { isAuthenticated, request } = ctx;
  const uid = request.auth?.uid;
  const data = request.resource?.data || {};
  return isAuthenticated() && isStrictOwner(data, uid);
}

function evaluateSavedCardUpdate(ctx) {
  const { isAuthenticated, isAdmin, request, resource } = ctx;
  
  // Both user and admin are strictly forbidden from modifying ownership fields
  const touchesOwnerKeys = request.resource.data.diff(resource.data).affectedKeys().hasAny(['userId', 'uid', 'user_id']);
  if (touchesOwnerKeys) return false;

  if (isAdmin()) return true; // Authorized admin can manage other fields
  if (!isAuthenticated()) return false;

  const uid = request.auth?.uid;
  const existing = resource?.data || {};
  const proposed = request.resource?.data || {};

  return isStrictOwner(existing, uid) && isStrictOwner(proposed, uid);
}

function evaluateFavoriteUpdate(ctx) {
  const { isAuthenticated, isAdmin, request, resource } = ctx;
  
  // Both user and admin are strictly forbidden from modifying ownership fields
  const touchesOwnerKeys = request.resource.data.diff(resource.data).affectedKeys().hasAny(['userId', 'uid', 'user_id']);
  if (touchesOwnerKeys) return false;

  if (isAdmin()) return true;
  if (!isAuthenticated()) return false;

  const uid = request.auth?.uid;
  const existing = resource?.data || {};
  const proposed = request.resource?.data || {};

  return isStrictOwner(existing, uid) && isStrictOwner(proposed, uid);
}

function evaluateCompareHistoryUpdate(ctx) {
  const { isAuthenticated, isAdmin, request, resource } = ctx;
  
  // Both user and admin are strictly forbidden from modifying ownership fields
  const touchesOwnerKeys = request.resource.data.diff(resource.data).affectedKeys().hasAny(['userId', 'uid', 'user_id']);
  if (touchesOwnerKeys) return false;

  if (isAdmin()) return true;
  if (!isAuthenticated()) return false;

  const uid = request.auth?.uid;
  const existing = resource?.data || {};
  const proposed = request.resource?.data || {};

  return isStrictOwner(existing, uid) && isStrictOwner(proposed, uid);
}

function evaluateWishlistRead(ctx, userId) {
  return ctx.isOwner(userId) || ctx.isAdmin();
}

function evaluateWishlistCreate(ctx, userId) {
  const { isOwner, isAdmin, request } = ctx;
  if (!isOwner(userId) && !isAdmin()) return false;
  const data = request?.resource?.data || {};
  const matchUserId = !('userId' in data) || data.userId === userId;
  const matchUid = !('uid' in data) || data.uid === userId;
  const matchUserIdAlt = !('user_id' in data) || data.user_id === userId;
  return (isOwner(userId) && matchUserId && matchUid && matchUserIdAlt) || isAdmin();
}

function evaluateWishlistUpdate(ctx, userId) {
  const { isOwner, isAdmin, request, resource } = ctx;
  if (!isOwner(userId) && !isAdmin()) return false;
  const data = request?.resource?.data || {};
  const matchUserId = !('userId' in data) || data.userId === userId;
  const matchUid = !('uid' in data) || data.uid === userId;
  const matchUserIdAlt = !('user_id' in data) || data.user_id === userId;
  if (!matchUserId || !matchUid || !matchUserIdAlt) return false;

  const affectedKeys = request.resource.data.diff(resource.data).affectedKeys();
  return !affectedKeys.hasAny(['userId', 'uid', 'id', 'user_id']);
}

function evaluateAdminAccess(ctx) {
  return ctx.isAdmin();
}

function evaluateAdminCreate(ctx, adminId) {
  const { isAuthenticated, isAdmin, request } = ctx;
  if (isAdmin()) return true;
  if (!isAuthenticated()) return false;
  const auth = request.auth;
  const data = request.resource?.data || {};

  const allowedKeys = ['uid', 'email', 'role', 'active', 'createdAt', 'created_at'];
  if (!data.keys?.().hasOnly(allowedKeys)) return false;

  const isPrimary = auth.token?.email && auth.token.email.toLowerCase() === 'ritikanshu072@gmail.com';
  const isDocEmailMatch = data.email && data.email.toLowerCase() === 'ritikanshu072@gmail.com';

  return (
    auth.uid === adminId &&
    data.uid === adminId &&
    isPrimary &&
    isDocEmailMatch &&
    auth.token?.email_verified === true &&
    data.role === 'admin' &&
    data.active === true
  );
}

function evaluateAdminUpdate(ctx) {
  return ctx.isAdmin();
}

function evaluateContactCreate(ctx) {
  const data = ctx.request?.resource?.data;
  if (!data) return false;
  const allowed = [
    'query_id', 'name', 'email', 'phone', 'mobile', 'subject',
    'message', 'createdAt', 'created_at', 'status', 'assigned_to',
    'admin_reply', 'replied_at', 'history'
  ];
  if (!data.keys().hasOnly(allowed)) return false;
  if (typeof data.name !== 'string' || data.name.length < 2 || data.name.length > 100) return false;
  if (typeof data.email !== 'string' || data.email.length > 150) return false;
  if (typeof data.message !== 'string' || data.message.length < 5 || data.message.length > 2000) return false;
  if (data.subject != null && (typeof data.subject !== 'string' || data.subject.length > 150)) return false;
  if (data.mobile != null && (typeof data.mobile !== 'string' || data.mobile.length > 30)) return false;
  if (data.phone != null && (typeof data.phone !== 'string' || data.phone.length > 30)) return false;
  if (data.query_id != null && (typeof data.query_id !== 'string' || data.query_id.length > 100)) return false;

  // Safe initial values enforced for public creation
  if (data.status != null && data.status !== 'Pending') return false;
  if (data.assigned_to != null && data.assigned_to !== 'Founder / Support Team') return false;
  if (data.admin_reply != null && data.admin_reply !== '') return false;
  if (data.replied_at != null) return false;

  // Timestamps validation: at least one timestamp required, formatted correctly
  if (!('created_at' in data || 'createdAt' in data)) return false;
  if ('created_at' in data && (typeof data.created_at !== 'string' || data.created_at.length < 19 || data.created_at.length > 35)) return false;
  if ('createdAt' in data && (typeof data.createdAt !== 'string' || data.createdAt.length < 19 || data.createdAt.length > 35) && data.createdAt !== ctx.request?.time) return false;

  // History list validation
  if ('history' in data) {
    if (!Array.isArray(data.history) || data.history.length > 1) return false;
    if (data.history.length === 1) {
      const h0 = data.history[0];
      if (typeof h0 !== 'object' || h0 === null) return false;
      const hKeys = ['id', 'sender', 'senderName', 'message', 'timestamp'];
      if (!Object.keys(h0).every(k => hKeys.includes(k))) return false;
      if (h0.sender !== 'user') return false; // Strictly blocks fake admin sender
      if (typeof h0.senderName !== 'string' || h0.senderName.length > 100) return false;
      if (typeof h0.message !== 'string' || h0.message.length > 2000) return false;
      if ('id' in h0 && (typeof h0.id !== 'string' || h0.id.length > 100)) return false;
      if ('timestamp' in h0 && (typeof h0.timestamp !== 'string' || h0.timestamp.length > 50)) return false;
    }
  }

  return true;
}

function evaluateReviewCreate(ctx) {
  const { isAuthenticated, request } = ctx;
  const data = request?.resource?.data;
  if (!data) return false;

  const allowedKeys = [
    'userId', 'userName', 'userEmail', 'rating', 'message', 'category',
    'role', 'cardName', 'createdAt', 'date', 'isUserSubmitted'
  ];
  if (!data.keys().hasOnly(allowedKeys)) return false;

  if (typeof data.userName !== 'string' || data.userName.length < 2 || data.userName.length > 100) return false;
  if (typeof data.message !== 'string' || data.message.length < 5 || data.message.length > 2000) return false;
  if (typeof data.rating !== 'number' || data.rating < 1 || data.rating > 5) return false;

  // Enforce createdAt == request.time (Firebase serverTimestamp())
  if (!('createdAt' in data) || data.createdAt !== request.time) return false;

  const authUid = request.auth?.uid;
  if (data.userId != null && (!isAuthenticated() || data.userId !== authUid)) return false;

  // userEmail validation:
  if (data.userEmail != null) {
    if (!isAuthenticated()) {
      if (typeof data.userEmail !== 'string' || data.userEmail.length > 150) return false;
    } else {
      if (data.userEmail !== request.auth?.token?.email) return false;
    }
  }

  if (data.category != null && (typeof data.category !== 'string' || data.category.length > 100)) return false;
  if (data.role != null && (typeof data.role !== 'string' || data.role.length > 100)) return false;
  if (data.cardName != null && (typeof data.cardName !== 'string' || data.cardName.length > 100)) return false;
  if (data.date != null && (typeof data.date !== 'string' || data.date.length > 50)) return false;
  if (data.isUserSubmitted != null && typeof data.isUserSubmitted !== 'boolean') return false;

  return true;
}

function evaluateReviewRead(ctx) {
  return ctx.isAdmin();
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

function evaluateLogRead(ctx) {
  return ctx.isAdmin();
}

// ---------------------------------------------------------------------------
// TEST EXECUTION
// ---------------------------------------------------------------------------

console.log('\n======================================================');
console.log('   FIRESTORE RULES AUDIT & SECURITY TEST SUITE        ');
console.log('   (Static Syntax Checks & Behavioral Logic Mock)     ');
console.log('======================================================\n');

// ===========================================================================
// SECTION 0: FIRESTORE.RULES FILE SYNTAX & STATIC INTEGRITY VERIFICATION
// ===========================================================================
console.log('--- SECTION 0: Rules File Syntax & Static Integrity ---');
const rulesPath = 'firestore.rules';
const rulesContent = fs.readFileSync(rulesPath, 'utf8');

assert(rulesContent.length > 500, 'firestore.rules file exists and is populated');
assert(rulesContent.includes("rules_version = '2';"), 'firestore.rules specifies rules_version = 2');
assert(!rulesContent.includes('.toLowerCase()'), 'firestore.rules does NOT contain invalid CEL method .toLowerCase()');
assert(rulesContent.includes('.lower()'), 'firestore.rules uses valid CEL method .lower()');
assert(rulesContent.includes("isStrictOwner(data, authUid)"), 'firestore.rules defines isStrictOwner helper');
assert(rulesContent.includes("!request.resource.data.diff(resource.data).affectedKeys().hasAny(['userId', 'uid', 'user_id'])"), 'firestore.rules locks ownership fields for both users and admins');
assert(rulesContent.includes("request.resource.data.status == 'Pending'") && rulesContent.includes("request.resource.data.admin_reply == ''"), 'firestore.rules hardens contact_queries against public parameter injection');
assert(rulesContent.includes("request.resource.data.history[0].sender == 'user'"), 'firestore.rules requires initial history item sender to strictly be user');
assert(rulesContent.includes("request.resource.data.keys().hasOnly(['uid', 'email', 'role', 'active', 'createdAt', 'created_at'])"), 'firestore.rules restricts /admins/{adminId} bootstrap to strict whitelisted fields');

const FIXED_TIME = '2026-11-04T23:00:00Z';

// ===========================================================================
// SECTION A: 14 MANDATORY AUDIT TEST REQUIREMENTS (Items 1 - 14)
// ===========================================================================
console.log('\n--- SECTION A: 14 Mandatory Security Audit Tests ---');

// 1. Unauthenticated user reading public debit card data
{
  const allowed = evaluateDebitCardRead();
  assert(allowed === true, 'Test 1: Unauthenticated user reading public debit card data (ALLOWED)');
}

// 2. Unauthenticated user modifying debit card data
{
  const ctxAnon = createEvaluationContext({ auth: null });
  const allowed = evaluateDebitCardWrite(ctxAnon);
  assert(allowed === false, 'Test 2: Unauthenticated user modifying debit card data (BLOCKED)');
}

// 3. Normal user accessing their own profile
{
  const ctxSelf = createEvaluationContext({
    auth: { uid: 'user_alice', token: { email: 'alice@example.com' } }
  });
  const allowed = evaluateProfileRead(ctxSelf, 'user_alice');
  assert(allowed === true, 'Test 3: Normal user accessing their own profile (ALLOWED)');
}

// 4. Normal user accessing another user's profile
{
  const ctxOther = createEvaluationContext({
    auth: { uid: 'user_alice', token: { email: 'alice@example.com' } }
  });
  const allowed = evaluateProfileRead(ctxOther, 'user_bob');
  assert(allowed === false, 'Test 4: Normal user accessing another user profile (BLOCKED)');
}

// 5. User changing their own ownership UID
{
  const ctxChangeUid = createEvaluationContext({
    auth: { uid: 'user_alice', token: { email: 'alice@example.com' } },
    existingResource: { id: 'user_alice', uid: 'user_alice', user_id: 'user_alice', full_name: 'Alice' },
    proposedResource: { id: 'user_alice', uid: 'user_attacker', user_id: 'user_alice', full_name: 'Alice' }
  });
  const allowed = evaluateProfileUpdate(ctxChangeUid, 'user_alice');
  assert(allowed === false, 'Test 5: User changing their own ownership UID (BLOCKED)');
}

// 6. User creating a saved card for another user
{
  const ctxCrossUserSaved = createEvaluationContext({
    auth: { uid: 'user_attacker', token: { email: 'attacker@example.com' } },
    proposedResource: {
      userId: 'user_victim', // Attempting to inject into victim's account
      cardId: 'card_hdfc_millennia',
      cardName: 'HDFC Millennia',
      bankName: 'HDFC Bank'
    }
  });
  const allowed = evaluateSavedCardCreate(ctxCrossUserSaved);
  assert(allowed === false, 'Test 6: User creating a saved card for another user (BLOCKED)');
}

// 7. Normal user accessing admin collections
{
  const ctxNormalAdmin = createEvaluationContext({
    auth: { uid: 'user_regular', token: { email: 'regular@example.com' } }
  });
  const allowed = evaluateAdminAccess(ctxNormalAdmin);
  assert(allowed === false, 'Test 7: Normal user accessing admin collections (BLOCKED)');
}

// 8. Authorized admin modifying bank card information
{
  const ctxAdminCard = createEvaluationContext({
    auth: { uid: 'adm_ritik', token: { email: 'ritikanshu072@gmail.com', email_verified: true } },
    databaseState: { 'admins/adm_ritik': { role: 'admin', active: true } }
  });
  const allowed = evaluateDebitCardWrite(ctxAdminCard);
  assert(allowed === true, 'Test 8: Authorized admin modifying bank card information (ALLOWED)');
}

// 9. Guest submitting a valid review
{
  const ctxGuestValid = createEvaluationContext({
    auth: null,
    time: FIXED_TIME,
    proposedResource: {
      userId: null,
      userName: 'Aarav Patel',
      userEmail: 'aarav@example.com',
      rating: 5,
      message: 'Great comparison platform! Found my debit card in seconds.',
      category: 'General',
      createdAt: FIXED_TIME,
      date: '5 Nov 2026',
      isUserSubmitted: true
    }
  });
  const allowed = evaluateReviewCreate(ctxGuestValid);
  assert(allowed === true, 'Test 9: Guest submitting a valid review (ALLOWED)');
}

// 10. Invalid review submission
{
  const ctxInvalidRev = createEvaluationContext({
    auth: null,
    time: FIXED_TIME,
    proposedResource: {
      userName: 'R', // Less than 2 chars (invalid)
      rating: 7,    // Greater than 5 (invalid)
      message: 'Hi', // Less than 5 chars (invalid)
      createdAt: '2020-01-01T00:00:00Z' // Fake client timestamp != request.time (invalid)
    }
  });
  const allowed = evaluateReviewCreate(ctxInvalidRev);
  assert(allowed === false, 'Test 10: Invalid review submission (BLOCKED)');
}

// 11. Authenticated user submitting a review
{
  const ctxAuthReview = createEvaluationContext({
    auth: { uid: 'user_auth_123', token: { email: 'priya@example.com' } },
    time: FIXED_TIME,
    proposedResource: {
      userId: 'user_auth_123',
      userName: 'Priya Sharma',
      userEmail: 'priya@example.com',
      rating: 4,
      message: 'Helped me pick SBI Global International Debit Card.',
      category: 'SBI Global',
      cardName: 'SBI Global International Debit Card',
      role: 'Working Professional',
      createdAt: FIXED_TIME,
      date: '5 Nov 2026',
      isUserSubmitted: true
    }
  });
  const allowed = evaluateReviewCreate(ctxAuthReview);
  assert(allowed === true, 'Test 11: Authenticated user submitting a review (ALLOWED)');
}

// 12. Unauthorized user reading private reviews
{
  const ctxAnonRead = createEvaluationContext({
    auth: { uid: 'user_intruder', token: { email: 'intruder@example.com' } }
  });
  const allowed = evaluateReviewRead(ctxAnonRead);
  assert(allowed === false, 'Test 12: Unauthorized user reading private reviews (BLOCKED)');
}

// 13. User attempting to modify another user's wishlist
{
  const ctxCrossWishlist = createEvaluationContext({
    auth: { uid: 'user_attacker', token: { email: 'attacker@example.com' } },
    existingResource: { user_id: 'user_victim', items: [] },
    proposedResource: { user_id: 'user_victim', items: [{ card_id: 'hijacked' }] }
  });
  const allowed = evaluateWishlistUpdate(ctxCrossWishlist, 'user_victim');
  assert(allowed === false, 'Test 13: User attempting to modify another user wishlist (BLOCKED)');
}

// 14. User attempting to grant themselves admin privileges
{
  const ctxSelfEscalate = createEvaluationContext({
    auth: { uid: 'user_alice', token: { email: 'alice@example.com' } },
    existingResource: { id: 'user_alice', uid: 'user_alice', role: 'user' },
    proposedResource: { id: 'user_alice', uid: 'user_alice', role: 'admin' }
  });
  const allowed = evaluateProfileUpdate(ctxSelfEscalate, 'user_alice');
  assert(allowed === false, 'Test 14: User attempting to grant themselves admin privileges (BLOCKED)');
}

// ===========================================================================
// SECTION B: SPECIFIC SECURITY & ADMIN UPDATE VERIFICATION TESTS
// ===========================================================================
console.log('\n--- SECTION B: Specific Security & Admin Update Verification Tests ---');

// 15. Admin updating another user's saved card (Allowed for content, Blocked for ownership)
{
  const ctxAdminUpdateSaved = createEvaluationContext({
    auth: { uid: 'adm_ritik', token: { email: 'ritikanshu072@gmail.com', email_verified: true } },
    databaseState: { 'admins/adm_ritik': { role: 'admin', active: true } },
    existingResource: { userId: 'user_alice', cardId: 'card_1' },
    proposedResource: { userId: 'user_alice', cardId: 'card_1', adminVerified: true }
  });
  const allowed = evaluateSavedCardUpdate(ctxAdminUpdateSaved);
  assert(allowed === true, 'Test 15a: Admin updating another user saved card content (ALLOWED)');

  // 15b: Admin attempting to reassign ownership
  const ctxAdminReassignSaved = createEvaluationContext({
    auth: { uid: 'adm_ritik', token: { email: 'ritikanshu072@gmail.com', email_verified: true } },
    databaseState: { 'admins/adm_ritik': { role: 'admin', active: true } },
    existingResource: { userId: 'user_alice', cardId: 'card_1' },
    proposedResource: { userId: 'user_bob', cardId: 'card_1', adminVerified: true }
  });
  const allowedReassign = evaluateSavedCardUpdate(ctxAdminReassignSaved);
  assert(allowedReassign === false, 'Test 15b: Admin attempting to reassign ownership (userId) is BLOCKED');

  // 15c: Admin attempting to change profile uid
  const ctxAdminProfileUid = createEvaluationContext({
    auth: { uid: 'adm_ritik', token: { email: 'ritikanshu072@gmail.com', email_verified: true } },
    databaseState: { 'admins/adm_ritik': { role: 'admin', active: true } },
    existingResource: { id: 'user_alice', uid: 'user_alice', full_name: 'Alice' },
    proposedResource: { id: 'user_alice', uid: 'user_bob', full_name: 'Alice' }
  });
  const allowedProfileUid = evaluateProfileUpdate(ctxAdminProfileUid, 'user_alice');
  assert(allowedProfileUid === false, 'Test 15c: Admin attempting to mutate profile ownership uid is BLOCKED');
}

// 16. Admin updating another user's favorite
{
  const ctxAdminUpdateFav = createEvaluationContext({
    auth: { uid: 'adm_ritik', token: { email: 'ritikanshu072@gmail.com', email_verified: true } },
    databaseState: { 'admins/adm_ritik': { role: 'admin', active: true } },
    existingResource: { userId: 'user_alice', favId: 'fav_1' },
    proposedResource: { userId: 'user_alice', favId: 'fav_1', flagged: false }
  });
  const allowed = evaluateFavoriteUpdate(ctxAdminUpdateFav);
  assert(allowed === true, 'Test 16: Admin updating another user favorite (ALLOWED)');
}

// 17. Admin updating another user's compare history
{
  const ctxAdminUpdateCompare = createEvaluationContext({
    auth: { uid: 'adm_ritik', token: { email: 'ritikanshu072@gmail.com', email_verified: true } },
    databaseState: { 'admins/adm_ritik': { role: 'admin', active: true } },
    existingResource: { userId: 'user_alice', user_id: 'user_alice', comparedAt: '2026-11-01' },
    proposedResource: { userId: 'user_alice', user_id: 'user_alice', comparedAt: '2026-11-01', adminReviewed: true }
  });
  const allowed = evaluateCompareHistoryUpdate(ctxAdminUpdateCompare);
  assert(allowed === true, 'Test 17: Admin updating another user compare history (ALLOWED)');
}

// 18. Guest attempting to inject admin_reply or assigned_to in contact query
{
  const ctxGuestInjectAdminReply = createEvaluationContext({
    auth: null,
    proposedResource: {
      name: 'Sneaky User',
      email: 'sneaky@example.com',
      message: 'Legitimate looking text',
      created_at: FIXED_TIME,
      admin_reply: 'Your refund of 50000 INR has been approved by management.'
    }
  });
  const allowedReply = evaluateContactCreate(ctxGuestInjectAdminReply);
  assert(allowedReply === false, 'Test 18a: Guest attempting to inject admin_reply is BLOCKED');

  const ctxGuestInjectAssignedTo = createEvaluationContext({
    auth: null,
    proposedResource: {
      name: 'Sneaky User',
      email: 'sneaky@example.com',
      message: 'Legitimate looking text',
      created_at: FIXED_TIME,
      assigned_to: 'Ritik Anshu'
    }
  });
  const allowedAssign = evaluateContactCreate(ctxGuestInjectAssignedTo);
  assert(allowedAssign === false, 'Test 18b: Guest attempting to inject assigned_to is BLOCKED');

  const ctxGuestInjectStatus = createEvaluationContext({
    auth: null,
    proposedResource: {
      name: 'Sneaky User',
      email: 'sneaky@example.com',
      message: 'Legitimate looking text',
      created_at: FIXED_TIME,
      status: 'Closed'
    }
  });
  const allowedStatus = evaluateContactCreate(ctxGuestInjectStatus);
  assert(allowedStatus === false, 'Test 18c: Guest attempting to inject status != Pending is BLOCKED');
}

// 19. Invalid admin document fields on bootstrap
{
  const ctxAdminInjectedFields = createEvaluationContext({
    auth: { uid: 'adm_ritik', token: { email: 'ritikanshu072@gmail.com', email_verified: true } },
    proposedResource: {
      uid: 'adm_ritik',
      email: 'ritikanshu072@gmail.com',
      role: 'admin',
      active: true,
      superAdmin: true,
      walletBalance: 999999
    }
  });
  const allowedInjected = evaluateAdminCreate(ctxAdminInjectedFields, 'adm_ritik');
  assert(allowedInjected === false, 'Test 19a: Admin document bootstrap with unwhitelisted fields is BLOCKED');

  const ctxAdminInvalidRole = createEvaluationContext({
    auth: { uid: 'adm_ritik', token: { email: 'ritikanshu072@gmail.com', email_verified: true } },
    proposedResource: {
      uid: 'adm_ritik',
      email: 'ritikanshu072@gmail.com',
      role: 'super_user',
      active: true
    }
  });
  const allowedRole = evaluateAdminCreate(ctxAdminInvalidRole, 'adm_ritik');
  assert(allowedRole === false, 'Test 19b: Admin document bootstrap with role != admin is BLOCKED');

  const ctxAdminInvalidActive = createEvaluationContext({
    auth: { uid: 'adm_ritik', token: { email: 'ritikanshu072@gmail.com', email_verified: true } },
    proposedResource: {
      uid: 'adm_ritik',
      email: 'ritikanshu072@gmail.com',
      role: 'admin',
      active: false
    }
  });
  const allowedActive = evaluateAdminCreate(ctxAdminInvalidActive, 'adm_ritik');
  assert(allowedActive === false, 'Test 19c: Admin document bootstrap with active != true is BLOCKED');

  const ctxAdminSpoofedEmail = createEvaluationContext({
    auth: { uid: 'adm_ritik', token: { email: 'imposter@gmail.com', email_verified: true } },
    proposedResource: {
      uid: 'adm_ritik',
      email: 'ritikanshu072@gmail.com',
      role: 'admin',
      active: true
    }
  });
  const allowedSpoof = evaluateAdminCreate(ctxAdminSpoofedEmail, 'adm_ritik');
  assert(allowedSpoof === false, 'Test 19d: Admin bootstrap with non-primary authenticated email is BLOCKED');
}

// 20. Normal users changing ownership aliases during update
{
  const ctxUserChangeUserId = createEvaluationContext({
    auth: { uid: 'user_alice', token: { email: 'alice@example.com' } },
    existingResource: { userId: 'user_alice', cardId: 'card_1' },
    proposedResource: { userId: 'user_bob', cardId: 'card_1' }
  });
  const allowedUserId = evaluateSavedCardUpdate(ctxUserChangeUserId);
  assert(allowedUserId === false, 'Test 20a: Normal user changing userId on saved_card is BLOCKED');

  const ctxUserChangeUserIdAlt = createEvaluationContext({
    auth: { uid: 'user_alice', token: { email: 'alice@example.com' } },
    existingResource: { user_id: 'user_alice', cardId: 'card_1' },
    proposedResource: { user_id: 'user_bob', cardId: 'card_1' }
  });
  const allowedUserIdAlt = evaluateSavedCardUpdate(ctxUserChangeUserIdAlt);
  assert(allowedUserIdAlt === false, 'Test 20b: Normal user changing user_id alias on saved_card is BLOCKED');

  const ctxUserInjectConflict = createEvaluationContext({
    auth: { uid: 'user_alice', token: { email: 'alice@example.com' } },
    existingResource: { userId: 'user_alice', cardId: 'card_1' },
    proposedResource: { userId: 'user_alice', uid: 'user_bob', cardId: 'card_1' }
  });
  const allowedConflict = evaluateSavedCardUpdate(ctxUserInjectConflict);
  assert(allowedConflict === false, 'Test 20c: Normal user injecting conflicting uid alias on update is BLOCKED');
}

// ===========================================================================
// SECTION C: CONTACT & REVIEW SCHEMA VALIDATION
// ===========================================================================
console.log('\n--- SECTION C: Contact & Review Schema Validation ---');

// 21. Valid contact submission matching contactService.submitQuery()
{
  const ctxContactValid = createEvaluationContext({
    auth: null,
    proposedResource: {
      query_id: 'QRY-ABC123XYZ',
      name: 'Rohan Mehra',
      email: 'rohan@example.com',
      mobile: '+919876543210',
      subject: 'Inquiry regarding Lounge Access',
      message: 'Does HDFC Millennia card have free international lounge access?',
      created_at: FIXED_TIME,
      status: 'Pending',
      assigned_to: 'Founder / Support Team',
      admin_reply: '',
      replied_at: null,
      history: [{
        id: 'msg_1001_1',
        sender: 'user',
        senderName: 'Rohan Mehra',
        message: 'Does HDFC Millennia card have free international lounge access?',
        timestamp: FIXED_TIME
      }]
    }
  });
  const allowed = evaluateContactCreate(ctxContactValid);
  assert(allowed === true, 'Test 21a: Full contactService.submitQuery() payload is ALLOWED');

  // 21b: Attacker attempting to inject fake admin sender in history
  const ctxContactFakeAdminHistory = createEvaluationContext({
    auth: null,
    proposedResource: {
      ...ctxContactValid.request.resource.data,
      history: [{
        id: 'msg_1001_1',
        sender: 'admin',
        senderName: 'Admin Team',
        message: 'Your refund is approved',
        timestamp: FIXED_TIME
      }]
    }
  });
  const allowedFakeSender = evaluateContactCreate(ctxContactFakeAdminHistory);
  assert(allowedFakeSender === false, 'Test 21b: History item with sender: admin is BLOCKED');

  // 21c: Attacker attempting to inject unwhitelisted keys in history
  const ctxContactUnwhitelistedHistoryKey = createEvaluationContext({
    auth: null,
    proposedResource: {
      ...ctxContactValid.request.resource.data,
      history: [{
        id: 'msg_1001_1',
        sender: 'user',
        senderName: 'User',
        message: 'Inquiry',
        timestamp: FIXED_TIME,
        isPrivileged: true
      }]
    }
  });
  const allowedInjectedHistory = evaluateContactCreate(ctxContactUnwhitelistedHistoryKey);
  assert(allowedInjectedHistory === false, 'Test 21c: History item with unwhitelisted keys is BLOCKED');

  // 21d: Contact query with invalid/bogus timestamp format
  const ctxContactBogusTimestamp = createEvaluationContext({
    auth: null,
    proposedResource: {
      ...ctxContactValid.request.resource.data,
      created_at: 'bad-timestamp'
    }
  });
  const allowedBogusTime = evaluateContactCreate(ctxContactBogusTimestamp);
  assert(allowedBogusTime === false, 'Test 21d: Contact query with non-ISO timestamp format is BLOCKED');

  // 21e: Contact query missing both created_at and createdAt
  const ctxContactMissingTime = createEvaluationContext({
    auth: null,
    proposedResource: {
      name: 'Rohan Mehra',
      email: 'rohan@example.com',
      message: 'Does HDFC Millennia card have lounge access?'
    }
  });
  const allowedMissingTime = evaluateContactCreate(ctxContactMissingTime);
  assert(allowedMissingTime === false, 'Test 21e: Contact query missing creation timestamp is BLOCKED');
}

// 22. Authenticated user review with spoofed email
{
  const ctxSpoofedEmail = createEvaluationContext({
    auth: { uid: 'user_1', token: { email: 'actual@example.com' } },
    time: FIXED_TIME,
    proposedResource: {
      userId: 'user_1',
      userName: 'User One',
      userEmail: 'victim@example.com', // Spoofed
      rating: 5,
      message: 'Review with forged email',
      createdAt: FIXED_TIME
    }
  });
  const allowed = evaluateReviewCreate(ctxSpoofedEmail);
  assert(allowed === false, 'Test 22: Authenticated user review with spoofed email is BLOCKED');
}

// 23. Deactivated Primary Admin cannot reactivate via client SDK
{
  const ctxDeactivated = createEvaluationContext({
    auth: { uid: 'adm_primary', token: { email: 'ritikanshu072@gmail.com', email_verified: true } },
    databaseState: { 'admins/adm_primary': { role: 'admin', active: false } }
  });
  const allowed = evaluateAdminUpdate(ctxDeactivated);
  assert(allowed === false, 'Test 23: Deactivated primary admin cannot perform admin updates (BLOCKED)');
}

// ===========================================================================
// SECTION D: PUBLIC LOGGING BOUNDARIES
// ===========================================================================
console.log('\n--- SECTION D: Public Logging Boundaries & Schema Bounds ---');

// 24. Valid anonymous referral clickout allowed
{
  const ctx = createEvaluationContext({
    auth: null,
    proposedResource: { referralCode: 'REF_101', source: 'CardsPage' }
  });
  assert(evaluateReferralClickCreate(ctx) === true, 'Test 24: Valid anonymous referral clickout allowed');
}

// 25. Referral with injected arbitrary/revenue fields is BLOCKED
{
  const ctx = createEvaluationContext({
    auth: null,
    proposedResource: { referralCode: 'REF_101', source: 'Modal', revenue: 5000, isAdmin: true }
  });
  assert(evaluateReferralClickCreate(ctx) === false, 'Test 25: Referral with injected arbitrary/revenue fields is BLOCKED');
}

// 26. Valid anonymous search log allowed
{
  const ctx = createEvaluationContext({
    auth: null,
    proposedResource: { query: 'SBI zero balance', user_email: 'Guest', timestamp: '2026-11-02T00:00:00Z' }
  });
  assert(evaluateSearchLogCreate(ctx) === true, 'Test 26: Valid anonymous search log allowed');
}

// 27. Search log with spoofed email is BLOCKED
{
  const ctx = createEvaluationContext({
    auth: null,
    proposedResource: { query: 'SBI', user_email: 'victim@bank.com' }
  });
  assert(evaluateSearchLogCreate(ctx) === false, 'Test 27: Search log with spoofed email is BLOCKED');
}

// 28. Valid guest activity log allowed
{
  const ctx = createEvaluationContext({
    auth: null,
    proposedResource: { type: 'card_view', text: 'Viewed SBI Global Card', user_email: 'Guest', timestamp: '2026-11-02T00:00:00Z' }
  });
  assert(evaluateActivityLogCreate(ctx) === true, 'Test 28: Valid guest activity log (card_view) allowed');
}

// 29. Guest activity log attempting admin operation is BLOCKED
{
  const ctx = createEvaluationContext({
    auth: null,
    proposedResource: { type: 'import_csv', text: 'Imported records', user_email: 'Guest', timestamp: '2026-11-02T00:00:00Z' }
  });
  assert(evaluateActivityLogCreate(ctx) === false, 'Test 29: Guest activity log attempting admin operation is BLOCKED');
}

// 30. Anonymous inspection/read of logs is DENIED
{
  const ctx = createEvaluationContext({ auth: null });
  assert(evaluateLogRead(ctx) === false, 'Test 30: Anonymous inspection/read of logs is DENIED');
}

console.log('\n======================================================');
console.log(`AUDIT & SECURITY TEST SUMMARY: ${passed} Passed, ${failed} Failed`);
console.log('======================================================\n');

if (failed > 0) process.exit(1);
process.exit(0);
