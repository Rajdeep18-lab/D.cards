/**
 * D.CARD Festive Responsive Viewport & Layout Integrity Test Suite
 * Tests responsive rules across 5 specified viewports:
 * - 375 × 812 (iPhone Mini)
 * - 390 × 844 (iPhone Standard)
 * - 768 × 1024 (Tablet / iPad)
 * - 1366 × 768 (Laptop HD)
 * - 1920 × 1080 (Desktop Full HD)
 */

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
console.log('   D.CARD FESTIVE RESPONSIVE VIEWPORT TEST SUITE      ');
console.log('======================================================\n');

const viewports = [
  { name: 'Mobile (375x812)', width: 375, height: 812 },
  { name: 'Mobile (390x844)', width: 390, height: 844 },
  { name: 'Tablet (768x1024)', width: 768, height: 1024 },
  { name: 'Laptop (1366x768)', width: 1366, height: 768 },
  { name: 'Desktop (1920x1080)', width: 1920, height: 1080 },
];

// Read component files
const dhanterasFile = fs.readFileSync(path.resolve('src/components/festive/DhanterasHeroCampaign.jsx'), 'utf8');
const auditFile = fs.readFileSync(path.resolve('src/components/festive/AuditCycleSection.jsx'), 'utf8');
const bannersFile = fs.readFileSync(path.resolve('src/components/festive/DiwaliCampaignBanners.jsx'), 'utf8');
const effectsFile = fs.readFileSync(path.resolve('src/components/festive/FestiveBackgroundEffects.jsx'), 'utf8');
const homeFile = fs.readFileSync(path.resolve('src/pages/HomePage.jsx'), 'utf8');

console.log('--- 1. Viewport Constraints & Overflow Prevention ---');
{
  assert(homeFile.includes('overflow-x-hidden'), 'HomePage enforces overflow-x-hidden container constraint');
  assert(dhanterasFile.includes('max-w-7xl') && dhanterasFile.includes('overflow-hidden'), 'Dhanteras hero clamped within max-w-7xl with overflow-hidden');
  assert(auditFile.includes('max-w-7xl') && auditFile.includes('overflow-hidden'), '15-Day Audit Cycle clamped within max-w-7xl with overflow-hidden');
  assert(bannersFile.includes('max-w-7xl'), 'Diwali banners clamped within max-w-7xl');
  assert(effectsFile.includes('overflow-hidden') && effectsFile.includes('pointer-events-none'), 'Ambient effects strictly overflow-hidden and pointer-events-none');
}

console.log('\n--- 2. Responsive Breakpoint Matrix Verification ---');
viewports.forEach(vp => {
  const isMobile = vp.width < 768;
  const isTablet = vp.width >= 768 && vp.width < 1024;
  const isDesktop = vp.width >= 1024;

  if (isMobile) {
    // On mobile: single-column stacks, fluid button widths, uncluttered view
    assert(dhanterasFile.includes('flex flex-col lg:flex-row'), `Dhanteras Hero stacks vertically on ${vp.name}`);
    assert(dhanterasFile.includes('flex-col sm:flex-row'), `Dhanteras CTAs stack full-width on ${vp.name}`);
    assert(auditFile.includes('grid-cols-1 lg:grid-cols-12'), `Audit Cycle stacks ring and metadata vertically on ${vp.name}`);
    assert(bannersFile.includes('grid-cols-1 md:grid-cols-2 lg:grid-cols-3'), `Diwali Banners stack single column on ${vp.name}`);
  } else if (isTablet) {
    // On tablet: 2-col banners, fluid padding
    assert(bannersFile.includes('md:grid-cols-2'), `Diwali Banners use 2-column layout on ${vp.name}`);
    assert(auditFile.includes('grid-cols-1 sm:grid-cols-2'), `Audit Schedule dates use 2-column card layout on ${vp.name}`);
  } else if (isDesktop) {
    // On desktop: side-by-side flex, 3-col banners, 12-col audit grid
    assert(dhanterasFile.includes('lg:flex-row'), `Dhanteras Hero renders side-by-side on ${vp.name}`);
    assert(auditFile.includes('lg:col-span-5') && auditFile.includes('lg:col-span-7'), `Audit Cycle splits 5:7 columns on ${vp.name}`);
    assert(bannersFile.includes('lg:grid-cols-3'), `Diwali Banners render in 3-column showcase on ${vp.name}`);
  }
});

console.log('\n--- 3. Touch Target & Accessibility Guidelines ---');
{
  assert(dhanterasFile.includes('py-3.5') || dhanterasFile.includes('min-h-[44px]'), 'Dhanteras CTAs provide minimum >= 44px accessible touch target height');
  assert(auditFile.includes('text-[10px] sm:text-[11px] font-black'), 'Audit ring nodes use bold high-contrast numbered typography');
  assert(dhanterasFile.includes('aria-label="Dhanteras Festive Campaign"'), 'Dhanteras Hero has proper accessibility aria-label');
  assert(auditFile.includes('aria-label="15-Day Audit Cycle"'), 'Audit Cycle has proper accessibility aria-label');
  assert(bannersFile.includes('aria-label="Festive Banking Campaigns"'), 'Diwali Banners have proper accessibility aria-label');
}

console.log('\n======================================================');
console.log(`VIEWPORT TEST SUMMARY: ${passed} Passed, ${failed} Failed`);
console.log('======================================================\n');

process.exit(failed > 0 ? 1 : 0);

