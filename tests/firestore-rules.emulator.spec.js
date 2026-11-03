/**
 * Official Firebase Rules Emulator Unit Testing Specification
 * 
 * File: tests/firestore-rules.emulator.spec.js
 * 
 * System Requirements to execute:
 * 1. Java Runtime Environment (JRE) / JDK version: 11, 17, or 21 (LTS)
 * 2. Firebase CLI: `firebase-tools` >= 12.0.0
 * 3. Node.js: >= 18.0.0
 * 
 * CI/CD Execution Command:
 * npx firebase emulators:exec --only firestore "node --test tests/firestore-rules.emulator.spec.js"
 */

import { test, describe, before, after, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

let testEnv = null;

const PROJECT_ID = 'd-card-rules-test';
const RULES_PATH = path.resolve(process.cwd(), 'firestore.rules');

describe('Official Firebase Emulator Security Rules Suite', () => {

  before(async () => {
    try {
      const { initializeTestEnvironment } = await import('@firebase/rules-unit-testing');
      const rules = fs.readFileSync(RULES_PATH, 'utf8');
      testEnv = await initializeTestEnvironment({
        projectId: PROJECT_ID,
        firestore: { rules }
      });
    } catch (err) {
      console.warn('[Emulator Notice] @firebase/rules-unit-testing or Firebase emulator unavailable:', err.message);
    }
  });

  after(async () => {
    if (testEnv) {
      await testEnv.cleanup();
    }
  });

  beforeEach(async () => {
    if (testEnv) {
      await testEnv.clearFirestore();
    }
  });

  // 1. Active primary admin
  test('1. Primary Admin: Active document with role admin grants administrative access', async (t) => {
    if (!testEnv) {
      t.skip('Firebase Emulator is not running in local environment (Java & firebase-tools required)');
      return;
    }

    await testEnv.withSecurityRulesDisabled(async (context) => {
      await context.firestore().collection('admins').doc('primary_uid').set({
        email: 'ritikanshu072@gmail.com',
        role: 'admin',
        active: true
      });
    });

    const authedCtx = testEnv.authenticatedContext('primary_uid', {
      email: 'ritikanshu072@gmail.com',
      email_verified: true
    });

    await assert.doesNotReject(
      authedCtx.firestore().collection('debit_cards').doc('card_test').set({ name: 'Test Card' }),
      'Active primary admin should be granted write access'
    );
  });

  // 2. Inactive primary admin
  test('2. Primary Admin: Deactivated record (active: false) is strictly DENIED', async (t) => {
    if (!testEnv) {
      t.skip('Firebase Emulator is not running in local environment (Java & firebase-tools required)');
      return;
    }

    await testEnv.withSecurityRulesDisabled(async (context) => {
      await context.firestore().collection('admins').doc('primary_uid').set({
        email: 'ritikanshu072@gmail.com',
        role: 'admin',
        active: false // DEACTIVATED
      });
    });

    const authedCtx = testEnv.authenticatedContext('primary_uid', {
      email: 'ritikanshu072@gmail.com',
      email_verified: true
    });

    await assert.rejects(
      authedCtx.firestore().collection('debit_cards').doc('card_test').set({ name: 'Test Card' }),
      /PERMISSION_DENIED/,
      'Deactivated primary admin must be denied write access'
    );
  });

  // 3. Missing primary admin document
  test('3. Primary Admin: Missing admin document in database is strictly DENIED', async (t) => {
    if (!testEnv) {
      t.skip('Firebase Emulator is not running in local environment (Java & firebase-tools required)');
      return;
    }

    // No document seeded in admins collection
    const authedCtx = testEnv.authenticatedContext('primary_unseeded_uid', {
      email: 'ritikanshu072@gmail.com',
      email_verified: true
    });

    await assert.rejects(
      authedCtx.firestore().collection('debit_cards').doc('card_test').set({ name: 'Test Card' }),
      /PERMISSION_DENIED/,
      'Primary admin without an existing admin document must be denied'
    );
  });

  // 4. Active secondary admin
  test('4. Secondary Admin: Active document with role admin grants administrative access', async (t) => {
    if (!testEnv) {
      t.skip('Firebase Emulator is not running in local environment (Java & firebase-tools required)');
      return;
    }

    await testEnv.withSecurityRulesDisabled(async (context) => {
      await context.firestore().collection('admins').doc('secondary_uid').set({
        email: 'secondary@example.com',
        role: 'admin',
        active: true
      });
    });

    const authedCtx = testEnv.authenticatedContext('secondary_uid', {
      email: 'secondary@example.com',
      email_verified: true
    });

    await assert.doesNotReject(
      authedCtx.firestore().collection('debit_cards').doc('card_test').set({ name: 'Secondary Card' }),
      'Active secondary admin should be granted write access'
    );
  });

  // 5. Inactive secondary admin
  test('5. Secondary Admin: Deactivated record (active: false) is strictly DENIED', async (t) => {
    if (!testEnv) {
      t.skip('Firebase Emulator is not running in local environment (Java & firebase-tools required)');
      return;
    }

    await testEnv.withSecurityRulesDisabled(async (context) => {
      await context.firestore().collection('admins').doc('secondary_uid').set({
        email: 'secondary@example.com',
        role: 'admin',
        active: false // DEACTIVATED
      });
    });

    const authedCtx = testEnv.authenticatedContext('secondary_uid', {
      email: 'secondary@example.com',
      email_verified: true
    });

    await assert.rejects(
      authedCtx.firestore().collection('debit_cards').doc('card_test').set({ name: 'Test Card' }),
      /PERMISSION_DENIED/,
      'Deactivated secondary admin must be denied'
    );
  });

  // 6. Normal user attempting admin access
  test('6. Normal User: Attempting admin write is strictly DENIED', async (t) => {
    if (!testEnv) {
      t.skip('Firebase Emulator is not running in local environment (Java & firebase-tools required)');
      return;
    }

    const userCtx = testEnv.authenticatedContext('ordinary_user', {
      email: 'user@example.com',
      email_verified: true
    });

    await assert.rejects(
      userCtx.firestore().collection('debit_cards').doc('card_test').set({ name: 'Hacked Card' }),
      /PERMISSION_DENIED/,
      'Ordinary user must be denied write access to debit_cards'
    );
  });

  // 7. Unauthenticated access attempting admin write
  test('7. Unauthenticated User: Attempting admin write is strictly DENIED', async (t) => {
    if (!testEnv) {
      t.skip('Firebase Emulator is not running in local environment (Java & firebase-tools required)');
      return;
    }

    const unauthedCtx = testEnv.unauthenticatedContext();

    await assert.rejects(
      unauthedCtx.firestore().collection('debit_cards').doc('card_test').set({ name: 'Anon Card' }),
      /PERMISSION_DENIED/,
      'Unauthenticated request must be denied write access to debit_cards'
    );
  });

  // 8. Public read of debit_cards is allowed
  test('8. Public Access: Reading debit_cards is ALLOWED', async (t) => {
    if (!testEnv) {
      t.skip('Firebase Emulator is not running in local environment (Java & firebase-tools required)');
      return;
    }

    const unauthedCtx = testEnv.unauthenticatedContext();

    await assert.doesNotReject(
      unauthedCtx.firestore().collection('debit_cards').get(),
      'Public read of debit_cards catalog should be allowed'
    );
  });

  // 9. Privilege escalation prevention
  test('9. User Profile: Privilege escalation via role injection is strictly DENIED', async (t) => {
    if (!testEnv) {
      t.skip('Firebase Emulator is not running in local environment (Java & firebase-tools required)');
      return;
    }

    const userCtx = testEnv.authenticatedContext('ordinary_user', {
      email: 'user@example.com',
      email_verified: true
    });

    await assert.rejects(
      userCtx.firestore().collection('profiles').doc('ordinary_user').set({
        name: 'Attacker',
        role: 'admin'
      }),
      /PERMISSION_DENIED/,
      'Ordinary user cannot inject role: admin on profile creation'
    );
  });

  // 10. Ownership immutability
  test('10. User Profile: Modifying uid or ownership identifier is strictly DENIED', async (t) => {
    if (!testEnv) {
      t.skip('Firebase Emulator is not running in local environment (Java & firebase-tools required)');
      return;
    }

    await testEnv.withSecurityRulesDisabled(async (context) => {
      await context.firestore().collection('profiles').doc('ordinary_user').set({
        uid: 'ordinary_user',
        name: 'Legit User',
        city: 'Mumbai'
      });
    });

    const userCtx = testEnv.authenticatedContext('ordinary_user', {
      email: 'user@example.com'
    });

    await assert.rejects(
      userCtx.firestore().collection('profiles').doc('ordinary_user').update({
        uid: 'victim_user'
      }),
      /PERMISSION_DENIED/,
      'Modifying uid ownership identifier must be denied'
    );
  });

});
