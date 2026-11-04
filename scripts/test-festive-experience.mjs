/**
 * D.CARD Diwali & Dhanteras Festive Experience & 15-Day Audit Cycle Test Suite
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
console.log('   D.CARD DIWALI & DHANTERAS FESTIVE AUDIT SUITE      ');
console.log('======================================================\n');

// ── SECTION 1: Centralized Campaign Configuration & Governance ──
console.log('--- SECTION 1: Centralized Festive Configuration ---');
{
  assert(typeof FESTIVE_CONFIG.isFestiveEnabled === 'boolean', 'Master festive switch is configured');
  assert(FESTIVE_CONFIG.isFestiveEnabled === true, 'Festive experience is actively enabled');
  assert(typeof FESTIVE_CONFIG.dhanterasHeroCampaignEnabled === 'boolean', 'Dhanteras hero toggle exists');
  assert(typeof FESTIVE_CONFIG.auditCycleSectionEnabled === 'boolean', '15-day audit cycle toggle exists');
  assert(typeof FESTIVE_CONFIG.diwaliCampaignBannersEnabled === 'boolean', 'Diwali campaign banners toggle exists');
  assert(typeof FESTIVE_CONFIG.festiveAnimationsEnabled === 'boolean', 'Festive animations toggle exists');
  assert(typeof FESTIVE_CONFIG.navbarFestiveBadgeEnabled === 'boolean', 'Navbar festive badge toggle exists');
}

// ── SECTION 2: 15-Day Audit Cycle Integrity ──
console.log('\n--- SECTION 2: 15-Day Audit Cycle Integrity ---');
{
  const cycle = FESTIVE_CONFIG.auditCycle;
  assert(cycle.cycleDays === 15, 'Cycle duration is exactly 15 days');
  assert(cycle.mainHeading === '15-DAY AUDIT CYCLE', 'Main heading matches "15-DAY AUDIT CYCLE"');
  assert(cycle.supportingText.includes('Your banking information deserves regular verification'), 'Supporting text matches requirement');
  assert(cycle.shortMessage.includes('We continuously review banking product information to help keep D.CARD data accurate and up to date'), 'Message matches requirement');
  assert(Boolean(cycle.lastAuditDate && cycle.nextScheduledAuditDate), 'Transparent last and next audit dates are configured');
  assert(cycle.disclaimer.includes("D.CARD's internal scheduled review cycle") && cycle.disclaimer.includes('Independent banking institutions do not verify this platform'), 'Disclaimer accurately clarifies internal governance without false bank endorsements');
  assert(Boolean(cycle.mainHeadingHi && cycle.supportingTextHi && cycle.shortMessageHi), 'Hindi localizations for 15-Day Audit Cycle are present');
}

// ── SECTION 3: Dhanteras Hero Campaign Verification ──
console.log('\n--- SECTION 3: Dhanteras Hero Campaign ---');
{
  const dhan = FESTIVE_CONFIG.dhanterasCampaign;
  assert(dhan.headline.includes('Celebrate Prosperity. Discover Smarter Banking'), 'Dhanteras headline matches requirement');
  assert(dhan.supportingText.includes('explore banking products and make more informed financial choices with D.CARD'), 'Dhanteras supporting text matches requirement');
  assert(dhan.ctaExplore.label === 'Explore Banking Products', 'Primary CTA matches "Explore Banking Products"');
  assert(dhan.ctaCompare.label === 'Compare Now', 'Secondary CTA matches "Compare Now"');
  assert(Boolean(dhan.headlineHi && dhan.supportingTextHi && dhan.ctaExplore.labelHi && dhan.ctaCompare.labelHi), 'Hindi translations for Dhanteras campaign are present');
}

// ── SECTION 4: Diwali Promotional Campaign Banners ──
console.log('\n--- SECTION 4: Diwali Promotional Campaign Banners ---');
{
  const banners = FESTIVE_CONFIG.diwaliCampaigns;
  assert(Array.isArray(banners) && banners.length === 3, 'Exactly 3 Diwali promotional campaign banners are configured');

  const b1 = banners.find(b => b.id === 'diwali-match');
  assert(b1 && b1.headline.includes('Diwali Special – Discover Your Banking Match'), 'Campaign 1 matches "Diwali Special – Discover Your Banking Match"');
  assert(b1?.ctaPath === '/cards', 'Campaign 1 routes to /cards');

  const b2 = banners.find(b => b.id === 'dhanteras-choices');
  assert(b2 && b2.headline.includes('This Dhanteras, Make Smarter Banking Choices'), 'Campaign 2 matches "This Dhanteras, Make Smarter Banking Choices"');
  assert(b2?.ctaPath === '/savings-accounts', 'Campaign 2 routes to /savings-accounts');

  const b3 = banners.find(b => b.id === 'independent-compare');
  assert(b3 && b3.headline.includes('Compare. Discover. Choose Better'), 'Campaign 3 matches "Compare. Discover. Choose Better."');
  assert(b3?.ctaPath === '/compare', 'Campaign 3 routes to /compare');

  // Verify no third-party claims or fake bank discounts
  const allSubtext = banners.map(b => b.subtext).join(' ').toLowerCase();
  assert(!allSubtext.includes('guaranteed cashback') && !allSubtext.includes('100% discount'), 'Promotional copy contains zero fake bank offers or unverified claims');
}

// ── SECTION 5: Code Integration & Component Structure ──
console.log('\n--- SECTION 5: Code Integration & Component Structure ---');
{
  const heroFile = fs.readFileSync(path.resolve('src/components/HeroSection.jsx'), 'utf8');
  assert(heroFile.includes('<HeroFestiveAtmosphere'), 'HeroSection integrates HeroFestiveAtmosphere');
  assert(heroFile.includes('FLOATING FESTIVE GOLDEN PARTICLES AROUND HERO ILLUSTRATION'), 'HeroSection integrates floating particles around illustration');
  assert(heroFile.includes('overflow-hidden'), 'HeroSection enforces overflow-hidden');

  const homeFile = fs.readFileSync(path.resolve('src/pages/HomePage.jsx'), 'utf8');
  assert(homeFile.includes('<DhanterasHeroCampaign'), 'HomePage integrates DhanterasHeroCampaign');
  assert(homeFile.includes('<AuditCycleSection'), 'HomePage integrates AuditCycleSection');
  assert(homeFile.includes('<DiwaliCampaignBanners'), 'HomePage integrates DiwaliCampaignBanners');

  const navFile = fs.readFileSync(path.resolve('src/components/Navbar.jsx'), 'utf8');
  assert(navFile.includes('DEDICATED DIWALI & DHANTERAS FESTIVE CAMPAIGN ANNOUNCEMENT RIBBON') || navFile.includes('Festive Campaign Announcement'), 'Navbar integrates dedicated festive campaign ribbon in separate tier');
  assert(navFile.includes('dhanteras-hero'), 'Navbar badge anchors to #dhanteras-hero');
  assert(!navFile.includes('ml-2 shrink-0 group select-none cursor-pointer'), 'Navbar left logo div is completely free of campaign pill');

  // Component file existence
  assert(fs.existsSync(path.resolve('src/components/festive/DiyaIllustration.jsx')), 'DiyaIllustration.jsx exists');
  assert(fs.existsSync(path.resolve('src/components/festive/HeroFestiveAtmosphere.jsx')), 'HeroFestiveAtmosphere.jsx exists');
  assert(fs.existsSync(path.resolve('src/components/festive/DhanterasHeroCampaign.jsx')), 'DhanterasHeroCampaign.jsx exists');
  assert(fs.existsSync(path.resolve('src/components/festive/AuditCycleSection.jsx')), 'AuditCycleSection.jsx exists');
  assert(fs.existsSync(path.resolve('src/components/festive/DiwaliCampaignBanners.jsx')), 'DiwaliCampaignBanners.jsx exists');

  // Verify pointer-events-none on ambient background effects to prevent blocking clicks
  const atmosphereFile = fs.readFileSync(path.resolve('src/components/festive/HeroFestiveAtmosphere.jsx'), 'utf8');
  assert(atmosphereFile.includes('pointer-events-none'), 'HeroFestiveAtmosphere is strictly pointer-events-none');
  assert(atmosphereFile.includes('useReducedMotion'), 'HeroFestiveAtmosphere respects prefers-reduced-motion');

  const diyaFile = fs.readFileSync(path.resolve('src/components/festive/DiyaIllustration.jsx'), 'utf8');
  assert(diyaFile.includes('pointer-events-none'), 'DiyaIllustration is pointer-events-none');
}

console.log('\n======================================================');
console.log(`FESTIVE TEST SUMMARY: ${passed} Passed, ${failed} Failed`);
console.log('======================================================\n');

process.exit(failed > 0 ? 1 : 0);
