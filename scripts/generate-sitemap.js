import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Resolve current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Production Domain
const DEFAULT_SITE_URL = 'https://www.dcard.website';
const SITE_URL = (process.env.VITE_SITE_URL || process.env.SITE_URL || DEFAULT_SITE_URL).replace(/\/+$/, '');

// Import existing datasets dynamically
import { savingsAccountsData } from '../src/data/savingsAccounts/savingsAccountsData.js';
import { currentAccountsData } from '../src/data/currentAccounts/currentAccountsData.js';
import { getCoveredBanksDirectory } from '../src/utils/bankDirectoryUtils.js';

export function generateSitemapAndRobots() {
  console.log(`[Sitemap Generator] Generating dynamic sitemap for: ${SITE_URL}`);

  const today = new Date().toISOString().split('T')[0];
  const urlEntries = [];
  const urlSet = new Set();

  function addUrl(pathname, priority = '0.7', changefreq = 'weekly', lastmod = today) {
    const cleanPath = pathname.startsWith('/') ? pathname : `/${pathname}`;
    const absoluteUrl = cleanPath === '/' ? `${SITE_URL}/` : `${SITE_URL}${cleanPath}`;
    
    // Safety check against private/admin/auth paths
    const disallowedPatterns = [
      /^\/login/i,
      /^\/signup/i,
      /^\/forgot-password/i,
      /^\/profile/i,
      /^\/admin/i,
      /^\/saved-cards/i,
      /^\/favorites/i,
      /^\/founders/i,
      /^\/team/i
    ];

    if (disallowedPatterns.some(pattern => pattern.test(cleanPath))) {
      console.warn(`[Sitemap Generator] Skipped disallowed private/auth URL: ${cleanPath}`);
      return;
    }

    if (!urlSet.has(absoluteUrl)) {
      urlSet.add(absoluteUrl);
      urlEntries.push({
        loc: absoluteUrl,
        lastmod,
        changefreq,
        priority
      });
    }
  }

  // 1. Core Public Landing & Category Pages
  addUrl('/', '1.0', 'daily');
  addUrl('/savings-accounts', '0.9', 'daily');
  addUrl('/current-accounts', '0.9', 'daily');
  addUrl('/cards', '0.9', 'daily');

  // 2. Public Comparison Pages
  addUrl('/compare', '0.8', 'weekly');
  addUrl('/compare-savings', '0.8', 'weekly');
  addUrl('/compare-current', '0.8', 'weekly');

  // 3. Bank Directory & AI Discovery
  addUrl('/banks', '0.8', 'weekly');
  addUrl('/ai-advisor', '0.8', 'weekly');

  // 4. Institutional & Contact Pages
  addUrl('/about', '0.6', 'monthly');
  addUrl('/contact', '0.6', 'monthly');

  // 5. Dynamic Savings Account Product Pages
  let savingsCount = 0;
  if (Array.isArray(savingsAccountsData)) {
    savingsAccountsData.forEach(account => {
      const id = account.id || account.product_id;
      if (id) {
        addUrl(`/savings-accounts/${id}`, '0.7', 'weekly');
        savingsCount++;
      }
    });
  }

  // 6. Dynamic Current Account Product Pages
  let currentCount = 0;
  if (Array.isArray(currentAccountsData)) {
    currentAccountsData.forEach(account => {
      const id = account.id || account.product_id;
      if (id) {
        addUrl(`/current-accounts/${id}`, '0.7', 'weekly');
        currentCount++;
      }
    });
  }

  // 7. Dynamic Bank Detail Pages
  let banksCount = 0;
  try {
    const coveredBanks = getCoveredBanksDirectory();
    if (Array.isArray(coveredBanks)) {
      coveredBanks.forEach(bank => {
        if (bank.id) {
          addUrl(`/banks/${bank.id}`, '0.7', 'weekly');
          banksCount++;
        }
      });
    }
  } catch (err) {
    console.warn('[Sitemap Generator] Warning loading covered banks:', err.message);
  }

  // Construct valid XML string
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  for (const entry of urlEntries) {
    xml += `  <url>\n`;
    xml += `    <loc>${entry.loc}</loc>\n`;
    xml += `    <lastmod>${entry.lastmod}</lastmod>\n`;
    xml += `    <changefreq>${entry.changefreq}</changefreq>\n`;
    xml += `    <priority>${entry.priority}</priority>\n`;
    xml += `  </url>\n`;
  }

  xml += `</urlset>\n`;

  // Construct standard robots.txt content
  const robotsTxt = `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`;

  // Write outputs to public/
  const publicDir = path.resolve(rootDir, 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), xml, 'utf8');
  fs.writeFileSync(path.join(publicDir, 'robots.txt'), robotsTxt, 'utf8');

  // Also write to dist/ if it exists (for immediate preview / build sync)
  const distDir = path.resolve(rootDir, 'dist');
  if (fs.existsSync(distDir)) {
    fs.writeFileSync(path.join(distDir, 'sitemap.xml'), xml, 'utf8');
    fs.writeFileSync(path.join(distDir, 'robots.txt'), robotsTxt, 'utf8');
  }

  console.log(`[Sitemap Generator] Successfully generated sitemap.xml with ${urlEntries.length} canonical URLs.`);
  console.log(`  - Core/Category/Comparison Pages: ${urlEntries.length - savingsCount - currentCount - banksCount}`);
  console.log(`  - Dynamic Savings Accounts: ${savingsCount}`);
  console.log(`  - Dynamic Current Accounts: ${currentCount}`);
  console.log(`  - Dynamic Bank Profiles: ${banksCount}`);
  console.log(`[Sitemap Generator] Successfully created/updated robots.txt with Sitemap reference.`);

  return { totalUrls: urlEntries.length, xml, robotsTxt };
}

// Execute directly if run via CLI (node scripts/generate-sitemap.js)
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(__filename)) {
  generateSitemapAndRobots();
}
