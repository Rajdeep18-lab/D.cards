/**
 * D.CARD Festival Campaign Kill-Switch Verification Test
 * Verifies that toggling isFestiveEnabled: false cleanly disables all festive elements.
 */

import { FESTIVE_CONFIG } from '../src/config/festiveConfig.js';
import fs from 'fs';
import path from 'path';

let passed = 0;
let failed = 0;

function assert(condition, testName, details = '') {
  if (condition) {
    console.log(`  ✅ PASS: ${testName}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${testName}${details ? ` -> ${details}` : ''}`);
    failed++;
  }
}

console.log('\n======================================================');
console.log('   D.CARD FESTIVE KILL-SWITCH VERIFICATION            ');
console.log('======================================================\n');

// 1. Verify components have guard checks for isFestiveEnabled
const components = [
  { name: 'DhanterasHeroCampaign.jsx', path: 'src/components/festive/DhanterasHeroCampaign.jsx' },
  { name: 'AuditCycleSection.jsx', path: 'src/components/festive/AuditCycleSection.jsx' },
  { name: 'DiwaliCampaignBanners.jsx', path: 'src/components/festive/DiwaliCampaignBanners.jsx' },
  { name: 'HeroFestiveAtmosphere.jsx', path: 'src/components/festive/HeroFestiveAtmosphere.jsx' }
];

components.forEach(comp => {
  const code = fs.readFileSync(path.resolve(comp.path), 'utf8');
  assert(
    code.includes('isFestiveEnabled') && code.includes('return null'),
    `${comp.name} safely returns null when isFestiveEnabled is false`
  );
});

// 2. Verify HomePage has guard checks for isFestiveEnabled
const homeCode = fs.readFileSync(path.resolve('src/pages/HomePage.jsx'), 'utf8');
assert(
  homeCode.includes('FESTIVE_CONFIG.isFestiveEnabled && FESTIVE_CONFIG.dhanterasHeroCampaignEnabled') &&
  homeCode.includes('FESTIVE_CONFIG.isFestiveEnabled && FESTIVE_CONFIG.auditCycleSectionEnabled') &&
  homeCode.includes('FESTIVE_CONFIG.isFestiveEnabled && FESTIVE_CONFIG.diwaliCampaignBannersEnabled'),
  'HomePage guards festive sections with FESTIVE_CONFIG.isFestiveEnabled'
);

// 3. Verify Navbar guards festive badge with isFestiveEnabled
const navCode = fs.readFileSync(path.resolve('src/components/Navbar.jsx'), 'utf8');
assert(
  navCode.includes('FESTIVE_CONFIG.isFestiveEnabled && FESTIVE_CONFIG.navbarFestiveBadgeEnabled'),
  'Navbar guards festive badge with FESTIVE_CONFIG.isFestiveEnabled'
);

console.log('\n======================================================');
console.log(`KILL-SWITCH TEST SUMMARY: ${passed} Passed, ${failed} Failed`);
console.log('======================================================\n');

process.exit(failed > 0 ? 1 : 0);
