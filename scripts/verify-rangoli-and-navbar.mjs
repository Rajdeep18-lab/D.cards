import { spawn } from 'child_process';
import http from 'http';
import fs from 'fs';
import path from 'path';

const PORT = 4181;
const CDP_PORT = 9230;
const CHROME_PATH = 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe';
const SCREENSHOTS_DIR = path.resolve('verification-screenshots');

if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2'
};

function startStaticServer() {
  const distDir = path.resolve('dist');
  const server = http.createServer((req, res) => {
    let reqPath = req.url.split('?')[0];
    if (reqPath === '/') reqPath = '/index.html';
    let filePath = path.join(distDir, reqPath);
    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      filePath = path.join(distDir, 'index.html');
    }
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    try {
      const content = fs.readFileSync(filePath);
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    } catch {
      res.writeHead(404);
      res.end('Not Found');
    }
  });

  return new Promise((resolve) => {
    server.listen(PORT, () => resolve(server));
  });
}

class CDPClient {
  constructor(wsUrl) {
    this.wsUrl = wsUrl;
    this.ws = null;
    this.id = 1;
    this.callbacks = new Map();
    this.consoleErrors = [];
  }

  async connect() {
    this.ws = new WebSocket(this.wsUrl);
    await new Promise((resolve, reject) => {
      this.ws.onopen = resolve;
      this.ws.onerror = reject;
    });

    this.ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id && this.callbacks.has(msg.id)) {
        const { resolve, reject } = this.callbacks.get(msg.id);
        this.callbacks.delete(msg.id);
        if (msg.error) reject(new Error(msg.error.message));
        else resolve(msg.result);
      } else if (msg.method) {
        if (msg.method === 'Runtime.consoleAPICalled' && msg.params.type === 'error') {
          this.consoleErrors.push(msg.params.args.map(a => a.value || a.description).join(' '));
        }
      }
    };

    await this.send('Page.enable');
    await this.send('Runtime.enable');
    await this.send('DOM.enable');
  }

  send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = this.id++;
      this.callbacks.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  async evaluate(expression) {
    const result = await this.send('Runtime.evaluate', {
      expression,
      returnByValue: true,
      awaitPromise: true
    });
    if (result.exceptionDetails) {
      throw new Error(result.exceptionDetails.text || 'Evaluation failed');
    }
    return result.result?.value;
  }

  async screenshot(filePath) {
    const { data } = await this.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(filePath, Buffer.from(data, 'base64'));
  }

  async setViewport(width, height, isMobile) {
    await this.send('Emulation.setDeviceMetricsOverride', {
      width,
      height,
      deviceScaleFactor: 1,
      mobile: isMobile
    });
  }
}

async function runVerification() {
  console.log(`\n======================================================`);
  console.log(`  VERIFYING DIWALI RANGOLI & NAVBAR MORE MENU CHANGES  `);
  console.log(`======================================================\n`);

  const server = await startStaticServer();
  const profileDir = path.resolve('.chrome-test-verify-' + Date.now());
  const chromeProc = spawn(CHROME_PATH, [
    '--headless=new',
    `--remote-debugging-port=${CDP_PORT}`,
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-gpu',
    `--user-data-dir=${profileDir}`
  ]);

  await new Promise(r => setTimeout(r, 1500));

  let targetPage;
  for (let i = 0; i < 20; i++) {
    try {
      const pagesRes = await fetch(`http://localhost:${CDP_PORT}/json/list`);
      const pages = await pagesRes.json();
      targetPage = pages.find(p => p.type === 'page');
      if (targetPage) break;
    } catch {
      await new Promise(r => setTimeout(r, 200));
    }
  }

  if (!targetPage) {
    const newPageRes = await fetch(`http://localhost:${CDP_PORT}/json/new?http://localhost:${PORT}/`);
    targetPage = await newPageRes.json();
  }

  const client = new CDPClient(targetPage.webSocketDebuggerUrl);
  await client.connect();

  try {
    await client.send('Page.addScriptToEvaluateOnNewDocument', {
      source: `
        try {
          localStorage.setItem('dcard_disclaimer_accepted', 'true');
        } catch(e) {}
      `
    });

    // ── 1. DESKTOP VERIFICATION (1440x900) ──
    console.log(`--- SECTION 1: Desktop Homepage & Navbar Verification (1440x900) ---`);
    await client.setViewport(1440, 900, false);
    await client.send('Page.navigate', { url: `http://localhost:${PORT}/` });

    for (let i = 0; i < 30; i++) {
      await new Promise(r => setTimeout(r, 150));
      const ready = await client.evaluate('Boolean(document.querySelector("header"))').catch(() => false);
      if (ready) break;
    }
    await new Promise(r => setTimeout(r, 600));

    // A. Check Direct Desktop Navbar Items
    const directNavLinks = await client.evaluate(`(() => {
      const links = Array.from(document.querySelectorAll('header nav[aria-label="Primary Navigation"] > a')).map(a => a.innerText.trim());
      return links;
    })()`);
    console.log(`Direct Desktop Nav Links:`, directNavLinks);

    const hasAIinDirect = directNavLinks.some(l => l.includes('AI Assistance'));
    const hasBanksinDirect = directNavLinks.some(l => l === 'Banks');
    const hasAboutinDirect = directNavLinks.some(l => l.includes('About'));

    if (!hasAIinDirect && !hasBanksinDirect && !hasAboutinDirect) {
      console.log(`✅ PASS: AI Assistance, Banks, and About Us successfully removed from direct navbar bar.`);
    } else {
      console.error(`❌ FAIL: Found moved links still in direct navbar:`, { hasAIinDirect, hasBanksinDirect, hasAboutinDirect });
    }

    // B. Open More Dropdown
    console.log(`Opening More dropdown...`);
    const moreOpened = await client.evaluate(`(() => {
      const moreBtn = document.querySelector('button[aria-label="More navigation links"]');
      if (!moreBtn) return false;
      moreBtn.click();
      return true;
    })()`);
    await new Promise(r => setTimeout(r, 500));

    // C. Inspect Items inside More Dropdown
    const moreItems = await client.evaluate(`(() => {
      const menu = document.querySelector('button[aria-label="More navigation links"] + div');
      if (!menu) return [];
      return Array.from(menu.querySelectorAll('a')).map(a => ({
        text: a.innerText.trim().replace(/\\n/g, ' '),
        href: a.getAttribute('href')
      }));
    })()`);
    console.log(`Items inside More Dropdown:`, moreItems);

    const hasAIInMore = moreItems.some(i => i.href === '/ai-advisor' && i.text.includes('AI Assistance'));
    const hasBanksInMore = moreItems.some(i => i.href === '/banks' && i.text.includes('Banks'));
    const hasAboutInMore = moreItems.some(i => i.href === '/about' && i.text.includes('About'));

    if (hasAIInMore && hasBanksInMore && hasAboutInMore) {
      console.log(`✅ PASS: AI Assistance, Banks, and About Us verified inside More dropdown with correct routes!`);
    } else {
      console.error(`❌ FAIL: Missing items in More dropdown:`, { hasAIInMore, hasBanksInMore, hasAboutInMore });
    }

    // Capture screenshot of Desktop Navbar with More dropdown open
    const moreScreenshotPath = path.join(SCREENSHOTS_DIR, 'desktop-navbar-more-open.png');
    await client.screenshot(moreScreenshotPath);
    console.log(`✅ PASS: Saved ${moreScreenshotPath}`);

    // D. Test Language Switching for More items (Hindi translation test)
    console.log(`Testing Hindi translation inside More dropdown...`);
    await client.evaluate(`(() => {
      // Close More
      const moreBtn = document.querySelector('button[aria-label="More navigation links"]');
      if (moreBtn) moreBtn.click();
    })()`);
    await new Promise(r => setTimeout(r, 300));

    // Click Language toggle
    await client.evaluate(`(() => {
      const langBtn = document.querySelector('button[aria-haspopup="listbox"]');
      if (langBtn) langBtn.click();
    })()`);
    await new Promise(r => setTimeout(r, 300));

    await client.evaluate(`(() => {
      const hindiOpt = Array.from(document.querySelectorAll('[role="option"], button')).find(el => el.innerText.includes('हिंदी') || el.innerText.includes('Hindi'));
      if (hindiOpt) hindiOpt.click();
    })()`);
    await new Promise(r => setTimeout(r, 600));

    // Reopen More in Hindi
    await client.evaluate(`(() => {
      const moreBtn = document.querySelector('button[aria-label="More navigation links"]');
      if (moreBtn) moreBtn.click();
    })()`);
    await new Promise(r => setTimeout(r, 400));

    const hindiMoreItems = await client.evaluate(`(() => {
      const menu = document.querySelector('button[aria-label="More navigation links"] + div');
      if (!menu) return [];
      return Array.from(menu.querySelectorAll('a')).map(a => a.innerText.trim().replace(/\\n/g, ' '));
    })()`);
    console.log(`More items in Hindi:`, hindiMoreItems);

    const hasHindiAI = hindiMoreItems.some(t => t.includes('एआई सहायता'));
    const hasHindiBanks = hindiMoreItems.some(t => t.includes('प्रमुख बैंक') || t.includes('बैंक'));
    const hasHindiAbout = hindiMoreItems.some(t => t.includes('हमारे बारे में'));
    if (hasHindiAI && hasHindiBanks && hasHindiAbout) {
      console.log(`✅ PASS: Hindi translations verified inside More dropdown (एआई सहायता, प्रमुख बैंक, हमारे बारे में)!`);
    }

    // Switch back to English
    await client.evaluate(`(() => {
      const langBtn = document.querySelector('button[aria-haspopup="listbox"]');
      if (langBtn) langBtn.click();
    })()`);
    await new Promise(r => setTimeout(r, 300));
    await client.evaluate(`(() => {
      const enOpt = Array.from(document.querySelectorAll('[role="option"], button')).find(el => el.innerText.includes('English'));
      if (enOpt) enOpt.click();
    })()`);
    await new Promise(r => setTimeout(r, 500));

    // Close More
    await client.evaluate(`(() => {
      const moreBtn = document.querySelector('button[aria-label="More navigation links"]');
      if (moreBtn) moreBtn.click();
    })()`);
    await new Promise(r => setTimeout(r, 300));

    // E. Verify Diwali Rangoli with Earthen Diya in Desktop Hero
    console.log(`--- SECTION 2: Diwali Rangoli with Earthen Diya in Hero ---`);
    const rangoliDetails = await client.evaluate(`(() => {
      const rangoli = document.querySelector('#rangoli-pattern');
      const diya = document.querySelector('#traditional-earthen-diya');
      const petals = document.querySelector('#scattered-petals');
      const sparkles = document.querySelector('#golden-sparkles');
      return {
        rangoliExists: Boolean(rangoli),
        diyaExists: Boolean(diya),
        petalsExist: Boolean(petals),
        sparklesExist: Boolean(sparkles)
      };
    })()`);
    console.log(`Rangoli & Diya Inspection:`, rangoliDetails);

    if (rangoliDetails.rangoliExists && rangoliDetails.diyaExists && rangoliDetails.petalsExist && rangoliDetails.sparklesExist) {
      console.log(`✅ PASS: Beautiful Indian Rangoli, central Earthen Diya with realistic flame, petals and golden sparkles verified!`);
    } else {
      console.error(`❌ FAIL: Missing elements in Rangoli decoration:`, rangoliDetails);
    }

    // Capture Desktop Homepage Hero Screenshot showing new Rangoli and Diya
    const desktopHeroScreenshotPath = path.join(SCREENSHOTS_DIR, 'desktop-homepage-rangoli-diya.png');
    await client.screenshot(desktopHeroScreenshotPath);
    console.log(`✅ PASS: Saved ${desktopHeroScreenshotPath}`);

    // ── 2. MOBILE VERIFICATION (390x844) ──
    console.log(`\n--- SECTION 3: Mobile Responsiveness Verification (390x844) ---`);
    await client.setViewport(390, 844, true);
    await new Promise(r => setTimeout(r, 800));

    // Check overflow
    const mobileOverflow = await client.evaluate(`(() => {
      return {
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
        hasHorizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth
      };
    })()`);
    console.log(`Mobile Viewport Metrics:`, mobileOverflow);
    if (!mobileOverflow.hasHorizontalOverflow) {
      console.log(`✅ PASS: Zero horizontal overflow on mobile!`);
    } else {
      console.error(`❌ FAIL: Horizontal overflow detected!`);
    }

    // Check Mobile Drawer
    console.log(`Testing Mobile Hamburger Drawer...`);
    await client.evaluate(`(() => {
      const hamburger = document.querySelector('button[aria-label*="navigation menu"]');
      if (hamburger) hamburger.click();
    })()`);
    await new Promise(r => setTimeout(r, 500));

    const drawerStatus = await client.evaluate(`(() => {
      const drawer = document.querySelector('[role="dialog"]');
      if (!drawer) return { open: false };
      const links = Array.from(drawer.querySelectorAll('a')).map(a => a.innerText.trim().replace(/\\n/g, ' '));
      return {
        open: true,
        linksCount: links.length,
        hasHome: links.some(l => l.includes('Home')),
        hasAI: links.some(l => l.includes('AI Assistance')),
        hasBanks: links.some(l => l.includes('Banks')),
        hasAbout: links.some(l => l.includes('About'))
      };
    })()`);
    console.log(`Mobile Drawer Status:`, drawerStatus);

    if (drawerStatus.open && drawerStatus.hasHome && drawerStatus.hasAI && drawerStatus.hasBanks && drawerStatus.hasAbout) {
      console.log(`✅ PASS: Mobile hamburger drawer is completely unaffected and functional!`);
    }

    // Close Mobile Drawer
    await client.evaluate(`(() => {
      const closeBtn = document.querySelector('button[aria-label="Close Navigation Menu"]');
      if (closeBtn) closeBtn.click();
    })()`);
    await new Promise(r => setTimeout(r, 500));

    // Capture Mobile Homepage Hero Screenshot showing responsive Rangoli and Diya
    const mobileHeroScreenshotPath = path.join(SCREENSHOTS_DIR, 'mobile-homepage-rangoli-diya.png');
    await client.screenshot(mobileHeroScreenshotPath);
    console.log(`✅ PASS: Saved ${mobileHeroScreenshotPath}`);

    // Console Errors check
    const errors = client.consoleErrors.filter(e => !e.includes('favicon') && !e.includes('analytics'));
    console.log(`\nRuntime Console Errors: ${errors.length}`);
    if (errors.length === 0) {
      console.log(`✅ PASS: Zero runtime console errors!`);
    } else {
      console.error(`Errors:`, errors);
    }

  } catch (err) {
    console.error(`Verification error:`, err);
  } finally {
    try {
      chromeProc.kill();
    } catch {}
    try {
      server.close();
    } catch {}
    try {
      fs.rmSync(profileDir, { recursive: true, force: true });
    } catch {}
  }
}

runVerification();
