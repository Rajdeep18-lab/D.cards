import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const sitemapPath = path.join(rootDir, 'public', 'sitemap.xml');
const robotsPath = path.join(rootDir, 'public', 'robots.txt');

console.log('--- STARTING SEO SITEMAP & ROBOTS.TXT VERIFICATION ---');

let passedTests = 0;
let totalTests = 7;

function assert(condition, message) {
  if (condition) {
    console.log(`[PASS] ${message}`);
    passedTests++;
  } else {
    console.error(`[FAIL] ${message}`);
    process.exitCode = 1;
  }
}

// 1. /sitemap.xml loads successfully
assert(fs.existsSync(sitemapPath), '1. /sitemap.xml file exists and loads successfully');
const sitemapContent = fs.readFileSync(sitemapPath, 'utf8');

// 2. XML is valid
const xmlDeclarationValid = sitemapContent.startsWith('<?xml version="1.0" encoding="UTF-8"?>');
const hasOpenUrlset = sitemapContent.includes('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
const hasCloseUrlset = sitemapContent.trim().endsWith('</urlset>');

// Parse all <loc> URLs using regex
const locMatches = [...sitemapContent.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1]);
const urlBlockMatches = [...sitemapContent.matchAll(/<url>[\s\S]*?<\/url>/g)];

assert(
  xmlDeclarationValid && hasOpenUrlset && hasCloseUrlset && locMatches.length > 0 && locMatches.length === urlBlockMatches.length,
  `2. XML structure is valid (Found ${locMatches.length} valid <url> blocks with proper tags)`
);

// 3. All URLs use the production HTTPS domain
const invalidProtocolOrDomain = locMatches.filter(url => !url.startsWith('https://www.dcard.website'));
const localhostOrDev = locMatches.filter(url => url.includes('localhost') || url.includes('127.0.0.1') || url.includes('.local') || url.includes('http://'));

assert(
  invalidProtocolOrDomain.length === 0 && localhostOrDev.length === 0,
  `3. All URLs (${locMatches.length}/${locMatches.length}) use canonical production HTTPS domain (https://www.dcard.website) with zero dev/localhost links`
);

// 4. No login/profile/admin URLs are included
const forbiddenTerms = ['/login', '/signup', '/forgot-password', '/profile', '/admin', '/saved-cards', '/favorites', '/founders', '/team'];
const forbiddenFound = locMatches.filter(url => forbiddenTerms.some(term => url.toLowerCase().includes(term)));

assert(
  forbiddenFound.length === 0,
  `4. No private, authenticated, admin, or user-specific URLs found (Filtered out: ${forbiddenTerms.join(', ')})`
);

// 5. No duplicate URLs exist
const urlSet = new Set(locMatches);
const duplicates = locMatches.filter((url, idx) => locMatches.indexOf(url) !== idx);

assert(
  duplicates.length === 0 && urlSet.size === locMatches.length,
  `5. Zero duplicate URLs detected (Total unique URLs: ${urlSet.size})`
);

// 6. Dynamic product URLs are included correctly
const savingsAccountsUrls = locMatches.filter(u => u.includes('/savings-accounts/'));
const currentAccountsUrls = locMatches.filter(u => u.includes('/current-accounts/'));
const bankUrls = locMatches.filter(u => u.includes('/banks/'));

assert(
  savingsAccountsUrls.length === 50 && currentAccountsUrls.length === 12 && bankUrls.length === 32,
  `6. Dynamic product URLs included correctly: 50 Savings Accounts, 12 Current Accounts, 32 Banks (Total product pages: ${savingsAccountsUrls.length + currentAccountsUrls.length + bankUrls.length})`
);

// 7. /robots.txt references /sitemap.xml
assert(fs.existsSync(robotsPath), 'Robots.txt file exists');
const robotsContent = fs.readFileSync(robotsPath, 'utf8');
const referencesSitemap = robotsContent.includes('Sitemap: https://www.dcard.website/sitemap.xml');

assert(
  referencesSitemap,
  '7. /robots.txt properly references Sitemap: https://www.dcard.website/sitemap.xml'
);

console.log(`\nVerification Result: ${passedTests}/${totalTests} Tests Passed successfully!`);
