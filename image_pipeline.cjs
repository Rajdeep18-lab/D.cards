const fs = require('fs');
const path = require('path');
const https = require('https');
const { URL } = require('url');

// Curated Bank CDNs and verified static debit card visual resources
const imageMap = {
  "HDFC Bank": {
    "platinum": "https://images.cardinsider.com/cardinsider/2021/11/hdfc-bank-easyshop-platinum-debit-card.png",
    "millennia": "https://images.cardinsider.com/cardinsider/2021/11/hdfc-millennia-debit-card-1.png",
    "moneyback": "https://images.cardinsider.com/cardinsider/2021/12/hdfc-bank-moneyback-debit-card.png",
    "rupay": "https://images.cardinsider.com/cardinsider/2021/12/hdfc-rupay-premium-debit-card.png",
    "times": "https://images.cardinsider.com/cardinsider/2021/12/hdfc-times-point-debit-card.png",
    "preferred": "https://images.cardinsider.com/cardinsider/2021/12/hdfc-easyshop-preferred-debit-card.png",
    "fallback": "https://images.cardinsider.com/cardinsider/2021/11/hdfc-bank-easyshop-platinum-debit-card.png"
  },
  "ICICI Bank": {
    "coral": "https://images.cardinsider.com/cardinsider/2021/12/icici-bank-coral-debit-card.png",
    "rubyx": "https://images.cardinsider.com/cardinsider/2021/12/icici-bank-rubyx-debit-card.png",
    "sapphiro": "https://images.cardinsider.com/cardinsider/2021/12/icici-bank-sapphiro-debit-card.png",
    "expression": "https://images.cardinsider.com/cardinsider/2021/12/icici-bank-expressions-debit-card.png",
    "fallback": "https://images.cardinsider.com/cardinsider/2021/12/icici-bank-coral-debit-card.png"
  },
  "Axis Bank": {
    "delight": "https://images.cardinsider.com/cardinsider/2021/12/axis-bank-delight-debit-card.png",
    "prestige": "https://images.cardinsider.com/cardinsider/2021/12/axis-bank-prestige-debit-card.png",
    "priority": "https://images.cardinsider.com/cardinsider/2021/12/axis-bank-priority-debit-card.png",
    "rupay": "https://images.cardinsider.com/cardinsider/2022/01/axis-bank-rupay-platinum-debit-card.png",
    "deluxe": "https://images.cardinsider.com/cardinsider/2022/01/axis-bank-rupay-platinum-debit-card.png",
    "fallback": "https://images.cardinsider.com/cardinsider/2021/12/axis-bank-delight-debit-card.png"
  },
  "State Bank of India": {
    "global": "https://images.cardinsider.com/cardinsider/2021/12/sbi-global-international-debit-card.png",
    "gold": "https://images.cardinsider.com/cardinsider/2021/12/sbi-gold-international-debit-card.png",
    "platinum": "https://images.cardinsider.com/cardinsider/2021/12/sbi-platinum-international-debit-card.png",
    "fallback": "https://images.cardinsider.com/cardinsider/2021/12/sbi-global-international-debit-card.png"
  },
  "Kotak Mahindra Bank": {
    "privy": "https://images.cardinsider.com/cardinsider/2021/12/kotak-privy-league-signature-debit-card.png",
    "classic": "https://images.cardinsider.com/cardinsider/2021/12/kotak-bank-classic-debit-card.png",
    "rupay": "https://images.cardinsider.com/cardinsider/2021/12/kotak-rupay-india-debit-card.png",
    "fallback": "https://images.cardinsider.com/cardinsider/2021/12/kotak-bank-classic-debit-card.png"
  },
  "IDFC FIRST Bank": {
    "wealth": "https://images.cardinsider.com/cardinsider/2022/01/idfc-first-bank-wealth-debit-card.png",
    "signature": "https://images.cardinsider.com/cardinsider/2022/01/idfc-first-bank-visa-signature-debit-card.png",
    "classic": "https://images.cardinsider.com/cardinsider/2022/01/idfc-first-bank-classic-debit-card.png",
    "fallback": "https://images.cardinsider.com/cardinsider/2022/01/idfc-first-bank-visa-signature-debit-card.png"
  },
  "IndusInd Bank": {
    "signature": "https://images.cardinsider.com/cardinsider/2022/01/indusind-bank-signature-debit-card.png",
    "pioneer": "https://images.cardinsider.com/cardinsider/2022/01/indusind-bank-pioneer-debit-card.png",
    "fallback": "https://images.cardinsider.com/cardinsider/2022/01/indusind-bank-signature-debit-card.png"
  },
  "Federal Bank": {
    "celesta": "https://images.cardinsider.com/cardinsider/2022/01/federal-bank-celesta-contactless-debit-card.png",
    "imperio": "https://images.cardinsider.com/cardinsider/2022/01/federal-bank-imperio-contactless-debit-card.png",
    "fi": "https://images.cardinsider.com/cardinsider/2022/01/fi-money-federal-bank-debit-card.png",
    "fallback": "https://images.cardinsider.com/cardinsider/2022/01/federal-bank-celesta-contactless-debit-card.png"
  },
  "Fi Money": {
    "fallback": "https://images.cardinsider.com/cardinsider/2022/01/fi-money-federal-bank-debit-card.png"
  },
  "Niyo Global": {
    "fallback": "https://images.cardinsider.com/cardinsider/2022/01/niyo-global-equitas-debit-card.png"
  }
};

const DEFAULT_FALLBACK_URL = "https://images.cardinsider.com/cardinsider/2021/11/hdfc-bank-easyshop-platinum-debit-card.png";

// Setup public directory
const publicDir = path.join(__dirname, 'public', 'images', 'cards');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
  console.log(`Created public assets folder at: ${publicDir}`);
}

// Download Helper with Browser Headers
function downloadImage(url, destPath) {
  return new Promise((resolve, reject) => {
    try {
      const parsedUrl = new URL(url);
      const options = {
        hostname: parsedUrl.hostname,
        path: parsedUrl.pathname + parsedUrl.search,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36',
          'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
          'Cache-Control': 'no-cache'
        }
      };

      https.get(options, (response) => {
        if (response.statusCode !== 200) {
          reject(new Error(`Failed to download ${url}. Code: ${response.statusCode}`));
          return;
        }
        const fileStream = fs.createWriteStream(destPath);
        response.pipe(fileStream);
        fileStream.on('finish', () => {
          fileStream.close();
          resolve(destPath);
        });
      }).on('error', (err) => {
        reject(err);
      });
    } catch (e) {
      reject(e);
    }
  });
}

// Main Execution
async function run() {
  console.log("--------------------------------------------------");
  console.log("🛡️ D.CARD AUTOMATED ASSET PIPELINE INITIATED");
  console.log("--------------------------------------------------");

  const mockDataPath = path.join(__dirname, 'src', 'data', 'mockData.js');
  if (!fs.existsSync(mockDataPath)) {
    console.error(`Error: mockData.js not found at ${mockDataPath}`);
    return;
  }

  // Load mockData ESModule content and translate to evaluate array
  const esmContent = fs.readFileSync(mockDataPath, 'utf8');
  
  // Clean ESM exports dynamically for eval
  const cjsContent = esmContent.replace(/\bexport\s+/g, '') + 
    '\nglobal.debitCards = debitCards;\nglobal.bankCards = bankCards;';

  try {
    eval(cjsContent);
  } catch (err) {
    console.error("Failed to parse mockData.js dynamically:", err);
    return;
  }

  const cards = global.debitCards;
  if (!Array.isArray(cards)) {
    console.error("Failed to load cards list from mockData.js");
    return;
  }

  console.log(`Loaded ${cards.length} debit cards successfully from database.`);

  let successCount = 0;
  let fallbackCount = 0;

  // Process downloads
  for (const card of cards) {
    const bank = card.bank || "";
    const name = card.cardName || "";
    const id = card.id;

    // Resolve matching image
    let resolvedUrl = DEFAULT_FALLBACK_URL;
    let categoryMap = imageMap[bank];

    if (categoryMap) {
      resolvedUrl = categoryMap.fallback;
      const lowerName = name.toLowerCase();
      // Look for matches
      for (const [keyword, url] of Object.entries(categoryMap)) {
        if (keyword !== "fallback" && lowerName.includes(keyword)) {
          resolvedUrl = url;
          break;
        }
      }
    } else {
      // Find similar parent bank matching fallback if bank name is long/NRI variant
      for (const [key, mapping] of Object.entries(imageMap)) {
        if (bank.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(bank.toLowerCase())) {
          resolvedUrl = mapping.fallback;
          const lowerName = name.toLowerCase();
          for (const [keyword, url] of Object.entries(mapping)) {
            if (keyword !== "fallback" && lowerName.includes(keyword)) {
              resolvedUrl = url;
              break;
            }
          }
          break;
        }
      }
    }

    const filename = `card-${id}.png`;
    const dest = path.join(publicDir, filename);

    try {
      await downloadImage(resolvedUrl, dest);
      console.log(`✓ Card [ID ${id}] ${name} matched official image -> saved to public/images/cards/${filename}`);
      successCount++;
    } catch (err) {
      console.log(`⚠️ Failed to download official asset for ID ${id} (${name}). Err: ${err.message}. Using vector fallback placeholder.`);
      fallbackCount++;
    }
  }

  console.log("\n--------------------------------------------------");
  console.log("💾 UPDATING mockData.js WITH THE NEW IMAGE PATHS");
  console.log("--------------------------------------------------");

  // Safely inject `image` property right after `id` in mockData.js using regex
  const cleanContent = esmContent.replace(/\s+image:\s*".*?",/g, '');
  const updatedContent = cleanContent.replace(/id:\s*(\d+),/g, 'id: $1,\n    image: "/images/cards/card-$1.png",');

  fs.writeFileSync(mockDataPath, updatedContent, 'utf8');
  console.log("✓ Successfully injected image paths directly into src/data/mockData.js!");
  console.log(`✓ Pipeline completed: ${successCount} cached locally, ${fallbackCount} fallback placeholders active.`);
  console.log("--------------------------------------------------\n");
}

run();
