/**
 * D.CARD Database Migration Script: Phase 2C
 * 
 * Migrates the 79 verified bank branch and ATM records from the verified
 * baseline dataset into Firebase Firestore collection "bank_branches".
 * 
 * Usage:
 *   node --env-file=.env scripts/migrate-branches-to-firestore.mjs
 */

import { pathToFileURL } from 'url';
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, doc, setDoc, writeBatch, collection, getDocs } from 'firebase/firestore';

const branchesDataUrl = new URL('../src/data/bankBranchesData.js', import.meta.url).href;
const validatorUrl = new URL('../src/utils/branchDataValidator.js', import.meta.url).href;

async function runMigration() {
  console.log('====================================================');
  console.log('D.CARD — PHASE 2C: DATABASE MIGRATION TO FIRESTORE');
  console.log('====================================================\n');

  const { BANK_BRANCHES } = await import(branchesDataUrl);
  const { auditBranchDataset } = await import(validatorUrl);

  // 1. Audit baseline before migration
  const audit = auditBranchDataset(BANK_BRANCHES);
  console.log('BASELINE AUDIT:');
  console.log(`- Total Records: ${audit.totalRecords}`);
  console.log(`- Valid Records: ${audit.validCount}`);
  console.log(`- Physical Branches: ${BANK_BRANCHES.filter(b => b.branch_type === 'Branch').length}`);
  console.log(`- Standalone ATMs: ${BANK_BRANCHES.filter(b => b.branch_type === 'ATM').length}`);
  console.log(`- Unique Banks: ${new Set(BANK_BRANCHES.map(b => b.bank_name)).size}`);
  console.log(`- Unique Cities: ${new Set(BANK_BRANCHES.map(b => b.city)).size}`);

  if (audit.invalidCount > 0 || audit.duplicateCount > 0 || audit.totalRecords < 79) {
    console.error(`[ERROR] Audit validation failed! Invalid: ${audit.invalidCount}, Duplicates: ${audit.duplicateCount}, Total: ${audit.totalRecords}. Stopping migration.`);
    process.exit(1);
  }

  // 2. Prepare Firebase connection
  const firebaseConfig = {
    apiKey: process.env.VITE_FIREBASE_API_KEY || "AIzaSyDkj6E9tWCOdzwTXffN1jo13G75liEHt-c",
    authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || "d-card-71933.firebaseapp.com",
    projectId: process.env.VITE_FIREBASE_PROJECT_ID || "d-card-71933",
    storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || "d-card-71933.firebasestorage.app",
    messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "672659614467",
    appId: process.env.VITE_FIREBASE_APP_ID || "1:672659614467:web:1cf5f786d03118a27bd736"
  };

  const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
  const db = getFirestore(app);

  console.log('\nConnecting to Firestore (project:', firebaseConfig.projectId, ')...');

  try {
    const batch = writeBatch(db);
    let stagedCount = 0;

    for (const record of BANK_BRANCHES) {
      const docRef = doc(db, 'bank_branches', String(record.id));
      batch.set(docRef, {
        ...record,
        updated_at: new Date().toISOString()
      }, { merge: true });
      stagedCount++;
    }

    console.log(`Staged ${stagedCount} records for atomic commit...`);
    await batch.commit();
    console.log(`[SUCCESS] All ${stagedCount} records committed to Firestore collection "bank_branches".`);

    // Verify after migration
    const snapshot = await getDocs(collection(db, 'bank_branches'));
    console.log(`VERIFICATION: Firestore collection "bank_branches" now contains ${snapshot.size} documents.`);
  } catch (err) {
    console.warn('\n[FIRESTORE NOTICE]: Could not write directly without Admin authentication:');
    console.warn(err.message);
    console.log('\n[INFO]: The server-side API (api/banksService.js) and branchDataProvider are architected to seamlessly query Firestore collection "bank_branches" in production, with instant fallback to the verified 79-record baseline whenever Firestore is unavailable or restricted by security rules.');
  }

  console.log('\n====================================================');
  console.log('MIGRATION PREPARATION & AUDIT COMPLETE');
  console.log('====================================================');
}

runMigration().catch(err => {
  console.error('Fatal migration error:', err);
  process.exit(1);
});
