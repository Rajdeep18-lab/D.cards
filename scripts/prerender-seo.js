import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const templatePath = path.join(distDir, 'index.html');

const SITE_URL = 'https://www.dcard.website';

// Datasets
import { savingsAccountsData } from '../src/data/savingsAccounts/savingsAccountsData.js';
import { currentAccountsData } from '../src/data/currentAccounts/currentAccountsData.js';
import { allMasterDebitCards } from '../src/data/debitCardsData.js';
import { getCoveredBanksDirectory } from '../src/utils/bankDirectoryUtils.js';

export function prerenderRoutes() {
  if (!fs.existsSync(templatePath)) {
    console.error('[Prerender SEO] dist/index.html does not exist. Run vite build first.');
    return;
  }

  const baseHtml = fs.readFileSync(templatePath, 'utf8');
  console.log('[Prerender SEO] Generating static route HTML files for production crawlability...');

  const routes = [];

  // Helper to register route
  function addRoute(relPath, { title, description, canonicalUrl, schema, robots = 'index, follow' }) {
    const cleanPath = relPath.replace(/^\/+|\/+$/g, '');
    const canonical = canonicalUrl || (cleanPath === '' ? `${SITE_URL}/` : `${SITE_URL}/${cleanPath}`);
    routes.push({
      cleanPath,
      title,
      description,
      canonical,
      schema,
      robots
    });
  }

  // 1. Core Category & Hub Pages
  addRoute('cards', {
    title: 'Best Debit Cards in India – Compare Fees, ATM Limits & Benefits | D.Card',
    description: 'Compare debit cards across top Indian banks. Filter by annual fee, daily ATM withdrawal limits, airport lounge access, and rewards on D.Card.',
    canonicalUrl: `${SITE_URL}/cards`,
    schema: {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': [
        { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': `${SITE_URL}/` },
        { '@type': 'ListItem', 'position': 2, 'name': 'Debit Cards', 'item': `${SITE_URL}/cards` }
      ]
    }
  });

  addRoute('compare', {
    title: 'Compare Debit Cards Side by Side – Fees, Limits & Benefits | D.Card',
    description: 'Compare features, annual charges, daily ATM limits, and rewards across top Indian debit cards side by side on D.Card.',
    canonicalUrl: `${SITE_URL}/compare`,
    schema: {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': [
        { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': `${SITE_URL}/` },
        { '@type': 'ListItem', 'position': 2, 'name': 'Compare Debit Cards', 'item': `${SITE_URL}/compare` }
      ]
    }
  });

  addRoute('savings-accounts', {
    title: 'Best Savings Accounts in India – Compare Interest Rates & Min Balance | D.Card',
    description: 'Explore and compare the best savings accounts from leading banks in India. Compare interest rates, zero balance options, debit card benefits, and fees on D.Card.',
    canonicalUrl: `${SITE_URL}/savings-accounts`,
    schema: {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': [
        { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': `${SITE_URL}/` },
        { '@type': 'ListItem', 'position': 2, 'name': 'Savings Accounts', 'item': `${SITE_URL}/savings-accounts` }
      ]
    }
  });

  addRoute('compare-savings', {
    title: 'Compare Savings Accounts Side by Side | D.Card',
    description: 'Compare interest rates, minimum balance requirements, and perks across savings accounts side by side on D.Card.',
    canonicalUrl: `${SITE_URL}/compare-savings`,
    schema: {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': [
        { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': `${SITE_URL}/` },
        { '@type': 'ListItem', 'position': 2, 'name': 'Savings Accounts', 'item': `${SITE_URL}/savings-accounts` },
        { '@type': 'ListItem', 'position': 3, 'name': 'Compare Savings Accounts', 'item': `${SITE_URL}/compare-savings` }
      ]
    }
  });

  addRoute('current-accounts', {
    title: 'Current Accounts in India – Compare Business Limits & Charges | D.Card',
    description: 'Compare business and commercial current accounts from top banks in India. Check average monthly balance and cash transaction limits on D.Card.',
    canonicalUrl: `${SITE_URL}/current-accounts`,
    schema: {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': [
        { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': `${SITE_URL}/` },
        { '@type': 'ListItem', 'position': 2, 'name': 'Current Accounts', 'item': `${SITE_URL}/current-accounts` }
      ]
    }
  });

  addRoute('compare-current', {
    title: 'Compare Current Accounts Side by Side | D.Card',
    description: 'Compare cash deposit limits, minimum balance, and charges across current accounts side by side on D.Card.',
    canonicalUrl: `${SITE_URL}/compare-current`,
    schema: {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': [
        { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': `${SITE_URL}/` },
        { '@type': 'ListItem', 'position': 2, 'name': 'Current Accounts', 'item': `${SITE_URL}/current-accounts` },
        { '@type': 'ListItem', 'position': 3, 'name': 'Compare Current Accounts', 'item': `${SITE_URL}/compare-current` }
      ]
    }
  });

  addRoute('banks', {
    title: 'Top Banks in India – Directory, Ratings & Products | D.Card',
    description: 'Explore profiles of leading public, private, and small finance banks in India. Compare savings accounts and debit card offerings on D.Card.',
    canonicalUrl: `${SITE_URL}/banks`,
    schema: {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': [
        { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': `${SITE_URL}/` },
        { '@type': 'ListItem', 'position': 2, 'name': 'Banks Directory', 'item': `${SITE_URL}/banks` }
      ]
    }
  });

  addRoute('ai-advisor', {
    title: 'D.CARD AI Assistance – Discover Accounts, Cards, Branches & ATMs',
    description: 'Ask D.CARD AI Assistance about savings accounts, current accounts, debit cards, bank branches, and ATMs using verified Indian banking data.',
    canonicalUrl: `${SITE_URL}/ai-advisor`,
    schema: {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': [
        { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': `${SITE_URL}/` },
        { '@type': 'ListItem', 'position': 2, 'name': 'AI Advisor', 'item': `${SITE_URL}/ai-advisor` }
      ]
    }
  });

  addRoute('about', {
    title: 'About D.Card – Independent Financial Information Platform',
    description: 'Learn about D.Card, India\'s independent platform comparing debit cards, savings accounts, and current accounts.',
    canonicalUrl: `${SITE_URL}/about`,
    schema: {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': [
        { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': `${SITE_URL}/` },
        { '@type': 'ListItem', 'position': 2, 'name': 'About D.Card', 'item': `${SITE_URL}/about` }
      ]
    }
  });

  addRoute('contact', {
    title: 'Contact Support – D.Card',
    description: 'Get in touch with the D.Card team for queries, feedback, or assistance regarding our banking comparison platform.',
    canonicalUrl: `${SITE_URL}/contact`,
    schema: {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': [
        { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': `${SITE_URL}/` },
        { '@type': 'ListItem', 'position': 2, 'name': 'Contact Support', 'item': `${SITE_URL}/contact` }
      ]
    }
  });

  addRoute('find-my-bank', {
    title: 'Find My Bank — Nearby Bank Branch Finder | D.CARD',
    description: 'Find verified nearby bank branches of SBI, HDFC, ICICI, Axis and other Indian banks. GPS proximity search, nearest branch first, working hours and directions.',
    canonicalUrl: `${SITE_URL}/find-my-bank`,
    schema: {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      'name': 'D.CARD Find My Bank Locator',
      'applicationCategory': 'FinanceApplication',
      'operatingSystem': 'All'
    }
  });

  // 2. Dynamic Savings Accounts
  if (Array.isArray(savingsAccountsData)) {
    savingsAccountsData.forEach(acc => {
      const id = acc.id || acc.product_id;
      if (!id) return;
      const bankName = acc.bank_name || acc.bank || 'Partner Bank';
      const accountName = acc.variant_name || acc.account_name || 'Savings Account';
      const minBal = acc.minimum_balance || acc.minimumBalance || '';
      const intRate = acc.interest_rate || acc.interestRate || '';

      const desc = `Explore ${bankName} ${accountName} Savings Account. Features: ${intRate ? `${intRate} interest, ` : ''}${minBal ? `₹${minBal} min balance, ` : ''}benefits, and eligibility on D.Card.`;
      const canonical = `${SITE_URL}/savings-accounts/${id}`;

      addRoute(`savings-accounts/${id}`, {
        title: `${bankName} ${accountName} Savings Account | D.Card`,
        description: desc,
        canonicalUrl: canonical,
        schema: {
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'BreadcrumbList',
              'itemListElement': [
                { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': `${SITE_URL}/` },
                { '@type': 'ListItem', 'position': 2, 'name': 'Savings Accounts', 'item': `${SITE_URL}/savings-accounts` },
                { '@type': 'ListItem', 'position': 3, 'name': `${bankName} ${accountName}`, 'item': canonical }
              ]
            },
            {
              '@type': 'FinancialProduct',
              'name': `${bankName} ${accountName} Savings Account`,
              'description': desc,
              'provider': { '@type': 'BankOrCreditUnion', 'name': bankName },
              'url': canonical
            }
          ]
        }
      });
    });
  }

  // 3. Dynamic Current Accounts
  if (Array.isArray(currentAccountsData)) {
    currentAccountsData.forEach(acc => {
      const id = acc.id || acc.product_id;
      if (!id) return;
      const bankName = acc.bankName || acc.bank_name || acc.bank || 'Bank';
      const accountName = acc.accountName || acc.variant_name || 'Current Account';
      const minBal = acc.minimumBalance || acc.minimum_balance || '';

      const desc = `Explore ${bankName} ${accountName} Current Account. Features: ${minBal ? `minimum balance requirement ₹${minBal}, ` : ''}cash deposit limits, and business banking perks on D.Card.`;
      const canonical = `${SITE_URL}/current-accounts/${id}`;

      addRoute(`current-accounts/${id}`, {
        title: `${bankName} ${accountName} Current Account | D.Card`,
        description: desc,
        canonicalUrl: canonical,
        schema: {
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'BreadcrumbList',
              'itemListElement': [
                { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': `${SITE_URL}/` },
                { '@type': 'ListItem', 'position': 2, 'name': 'Current Accounts', 'item': `${SITE_URL}/current-accounts` },
                { '@type': 'ListItem', 'position': 3, 'name': `${bankName} ${accountName}`, 'item': canonical }
              ]
            },
            {
              '@type': 'FinancialProduct',
              'name': `${bankName} ${accountName} Current Account`,
              'description': desc,
              'provider': { '@type': 'BankOrCreditUnion', 'name': bankName },
              'url': canonical
            }
          ]
        }
      });
    });
  }

  // 4. Dynamic Debit Cards
  if (Array.isArray(allMasterDebitCards)) {
    allMasterDebitCards.forEach(card => {
      const id = card.card_id || card.id;
      if (!id) return;
      const bankName = card.bank || 'Bank';
      const cardName = card.cardName || card.name || 'Debit Card';
      const annualFee = card.annualFee || 'Free';
      const atmLimit = card.atmLimit || '₹50,000';

      const desc = `Explore ${bankName} ${cardName}. Annual fee: ${annualFee}. ATM limit: ${atmLimit}. Benefits, charges, limits and eligibility on D.Card.`;
      const canonical = `${SITE_URL}/debit-cards/${id}`;

      addRoute(`debit-cards/${id}`, {
        title: `${bankName} ${cardName} | D.Card`,
        description: desc,
        canonicalUrl: canonical,
        schema: {
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'BreadcrumbList',
              'itemListElement': [
                { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': `${SITE_URL}/` },
                { '@type': 'ListItem', 'position': 2, 'name': 'Debit Cards', 'item': `${SITE_URL}/cards` },
                { '@type': 'ListItem', 'position': 3, 'name': `${bankName} ${cardName}`, 'item': canonical }
              ]
            },
            {
              '@type': 'FinancialProduct',
              'name': `${bankName} ${cardName}`,
              'description': desc,
              'provider': { '@type': 'BankOrCreditUnion', 'name': bankName },
              'url': canonical
            }
          ]
        }
      });
    });
  }

  // 5. Dynamic Bank Profiles
  try {
    const coveredBanks = getCoveredBanksDirectory();
    if (Array.isArray(coveredBanks)) {
      coveredBanks.forEach(bank => {
        if (!bank.id) return;
        const canonical = `${SITE_URL}/banks/${bank.id}`;
        const title = `${bank.name} – Bank Profile, Debit Cards & Savings Accounts | D.Card`;
        const desc = `Explore ${bank.name} banking products. Discover debit cards, savings accounts, interest rates, and key benefits on D.Card.`;

        addRoute(`banks/${bank.id}`, {
          title,
          description: desc,
          canonicalUrl: canonical,
          schema: {
            '@context': 'https://schema.org',
            '@graph': [
              {
                '@type': 'BreadcrumbList',
                'itemListElement': [
                  { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': `${SITE_URL}/` },
                  { '@type': 'ListItem', 'position': 2, 'name': 'Banks Directory', 'item': `${SITE_URL}/banks` },
                  { '@type': 'ListItem', 'position': 3, 'name': bank.name, 'item': canonical }
                ]
              },
              {
                '@type': 'BankOrCreditUnion',
                'name': bank.name,
                'url': canonical,
                'description': desc
              }
            ]
          }
        });
      });
    }
  } catch (err) {
    console.warn('[Prerender SEO] Warning fetching banks directory:', err.message);
  }

  // Write files to dist
  let generatedCount = 0;
  for (const route of routes) {
    let html = baseHtml;

    // Replace canonical tag
    html = html.replace(
      /<link\s+rel=["']canonical["']\s+href=["'][^"']*["']\s*\/?>/i,
      `<link rel="canonical" href="${route.canonical}" />`
    );

    // Replace document title
    html = html.replace(
      /<title>[^<]*<\/title>/i,
      `<title>${escapeHtml(route.title)}</title>`
    );

    // Replace meta description
    html = html.replace(
      /<meta\s+name=["']description["']\s+content=["'][^"']*["']\s*\/?>/i,
      `<meta name="description" content="${escapeAttr(route.description)}" />`
    );

    // Replace OpenGraph URL, title, description
    html = html.replace(
      /<meta\s+property=["']og:url["']\s+content=["'][^"']*["']\s*\/?>/i,
      `<meta property="og:url" content="${route.canonical}" />`
    );
    html = html.replace(
      /<meta\s+property=["']og:title["']\s+content=["'][^"']*["']\s*\/?>/i,
      `<meta property="og:title" content="${escapeAttr(route.title)}" />`
    );
    html = html.replace(
      /<meta\s+property=["']og:description["']\s+content=["'][^"']*["']\s*\/?>/i,
      `<meta property="og:description" content="${escapeAttr(route.description)}" />`
    );

    // Replace Twitter title, description
    html = html.replace(
      /<meta\s+name=["']twitter:title["']\s+content=["'][^"']*["']\s*\/?>/i,
      `<meta name="twitter:title" content="${escapeAttr(route.title)}" />`
    );
    html = html.replace(
      /<meta\s+name=["']twitter:description["']\s+content=["'][^"']*["']\s*\/?>/i,
      `<meta name="twitter:description" content="${escapeAttr(route.description)}" />`
    );

    // Inject JSON-LD structured data if present
    if (route.schema) {
      const jsonLdTag = `<script id="dcard-structured-data" type="application/ld+json">${JSON.stringify(route.schema)}</script>`;
      html = html.replace('</head>', `  ${jsonLdTag}\n  </head>`);
    }

    const routeDir = path.join(distDir, route.cleanPath);
    if (!fs.existsSync(routeDir)) {
      fs.mkdirSync(routeDir, { recursive: true });
    }

    fs.writeFileSync(path.join(routeDir, 'index.html'), html, 'utf8');
    generatedCount++;
  }

  console.log(`[Prerender SEO] Successfully generated ${generatedCount} static route HTML files in dist/!`);
}

function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function escapeAttr(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(__filename)) {
  prerenderRoutes();
}
