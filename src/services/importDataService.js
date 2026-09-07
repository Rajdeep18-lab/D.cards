import {
  db,
  collection,
  getDocs,
  doc,
  getDoc,
  setDoc,
  writeBatch,
  query,
  orderBy
} from '../lib/firebase';
import { aiChatService } from './aiChatService';
import { 
  validateDebitCard, 
  validateSavingsAccount, 
  validateCurrentAccount, 
  normalizeDebitCardRelationship 
} from '../utils/dataValidation';

const DEBIT_CARDS_COLLECTION = 'debit_cards';
const SAVINGS_ACCOUNTS_COLLECTION = 'savings_accounts';
const CURRENT_ACCOUNTS_COLLECTION = 'current_accounts';
const ACCOUNT_CARD_MAPPINGS_COLLECTION = 'account_card_mappings';
const BANKS_COLLECTION = 'banks';
const IMPORT_HISTORY_COLLECTION = 'import_history';

export const importDataService = {
  /**
   * Parse uploaded file (.json or .csv)
   */
  async parseImportFile(file) {
    if (!file) throw new Error("No file selected.");

    const fileName = file.name || "";
    const fileExt = fileName.substring(fileName.lastIndexOf('.')).toLowerCase();

    if (fileExt !== '.json' && fileExt !== '.csv') {
      throw new Error("Unsupported file format! Please upload a .json or .csv file.");
    }

    const textContent = await file.text();
    if (!textContent || !textContent.trim()) {
      throw new Error("The selected file is empty.");
    }

    if (fileExt === '.json') {
      try {
        const parsed = JSON.parse(textContent);
        const records = Array.isArray(parsed) ? parsed : [parsed];
        return { fileName, fileType: 'JSON', records };
      } catch (err) {
        throw new Error("Invalid JSON file format: " + err.message);
      }
    }

    if (fileExt === '.csv') {
      const records = this.parseCSVText(textContent);
      if (records.length === 0) {
        throw new Error("Could not parse any valid records from CSV file.");
      }
      return { fileName, fileType: 'CSV', records };
    }
  },

  /**
   * Helper to parse CSV text into an array of objects
   */
  parseCSVText(csvText) {
    const lines = csvText.trim().split(/\r?\n/).filter(line => line.trim().length > 0);
    if (lines.length < 2) return [];

    const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
    const records = [];

    for (let i = 1; i < lines.length; i++) {
      const rawLine = lines[i];
      const cols = [];
      let inQuotes = false;
      let currentVal = '';

      for (let charIdx = 0; charIdx < rawLine.length; charIdx++) {
        const char = rawLine[charIdx];
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          cols.push(currentVal.trim().replace(/^"|"$/g, ''));
          currentVal = '';
        } else {
          currentVal += char;
        }
      }
      cols.push(currentVal.trim().replace(/^"|"$/g, ''));

      const record = {};
      headers.forEach((header, idx) => {
        let val = cols[idx] !== undefined ? cols[idx] : '';
        if (val === 'true') val = true;
        else if (val === 'false') val = false;
        else if (header.toLowerCase().includes('fee') || header.toLowerCase().includes('balance') || header.toLowerCase().includes('limit')) {
          const num = Number(val);
          if (!isNaN(num) && val !== '') val = num;
        } else if (header.toLowerCase() === 'rating' || header.toLowerCase() === 'cashbackpct') {
          const num = parseFloat(val);
          if (!isNaN(num) && val !== '') val = num;
        }
        record[header] = val;
      });

      if (Object.keys(record).length > 0) {
        records.push(record);
      }
    }

    return records;
  },

  /**
   * Detect category from record
   */
  detectCategory(rec) {
    const cat = String(rec.productCategory || rec.category || rec.type || '').toLowerCase();
    const name = String(rec.accountName || rec.cardName || rec.name || '').toLowerCase();
    
    if (rec.account_id && rec.card_id) return 'account_card_mapping';
    if (cat === 'current' || cat === 'current_account' || name.includes('current account')) return 'current_account';
    if (cat === 'savings' || cat === 'savings_account' || name.includes('savings account')) return 'savings_account';
    return 'debit_card';
  },

  /**
   * Analyze records against existing database
   */
  async analyzeImportRecords(records) {
    if (!Array.isArray(records)) {
      return { totalRecords: 0, newRecords: 0, existingRecords: 0, duplicateRecords: 0, invalidRecords: 0, items: [] };
    }

    let existingCards = [];
    try {
      const cardsSnap = await getDocs(collection(db, DEBIT_CARDS_COLLECTION));
      existingCards = cardsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
    } catch (err) {
      console.warn("Firestore query notice during import analysis:", err);
    }

    const existingCardIds = new Set(existingCards.map(c => String(c.id || '').toLowerCase()));
    const existingCardNames = new Set(existingCards.map(c => `${String(c.cardName || c.accountName || '').toLowerCase()}_${String(c.bank || c.bankName || '').toLowerCase()}`));

    const seenInFileKeys = new Set();
    let newCount = 0;
    let existingCount = 0;
    let duplicateCount = 0;
    let invalidCount = 0;

    const analyzedItems = records.map((rec, index) => {
      const detectedCat = this.detectCategory(rec);
      const title = rec.cardName || rec.accountName || rec.name || rec.title || '';
      const bank = rec.bank || rec.bank_name || rec.bankName || '';

      if (detectedCat === 'account_card_mapping') {
        if (!rec.account_id || !rec.card_id) {
          invalidCount++;
          return { index, record: rec, category: detectedCat, status: 'Invalid', reason: 'Missing account_id or card_id' };
        }
        newCount++;
        return { index, record: rec, category: detectedCat, cardId: `${rec.account_id}_${rec.card_id}`, status: 'New', reason: 'New Explicit Account-Card Mapping' };
      }

      if (!title && !bank) {
        invalidCount++;
        return { index, record: rec, category: detectedCat, status: 'Invalid', reason: 'Missing Product/Card/Account Name or Bank' };
      }

      const cardId = rec.card_id || rec.product_id || rec.id || `${detectedCat}_${String(bank || 'bank').toLowerCase().replace(/\s+/g, '_')}_${String(title || 'prod').toLowerCase().replace(/\s+/g, '_')}`;
      const uniqueFileKey = `${String(title || '').toLowerCase()}_${String(bank || '').toLowerCase()}`;

      if (seenInFileKeys.has(uniqueFileKey)) {
        duplicateCount++;
        return { index, record: rec, category: detectedCat, cardId, status: 'Duplicate', reason: 'Duplicate in uploaded file' };
      }
      seenInFileKeys.add(uniqueFileKey);

      const existsInDb = existingCardIds.has(String(cardId).toLowerCase()) || existingCardNames.has(uniqueFileKey);

      if (existsInDb) {
        existingCount++;
        return { index, record: rec, category: detectedCat, cardId, status: 'Update', reason: `Matches existing record in ${detectedCat} catalogue` };
      } else {
        newCount++;
        return { index, record: rec, category: detectedCat, cardId, status: 'New', reason: `New record for ${detectedCat} catalogue` };
      }
    });

    return {
      totalRecords: records.length,
      newRecords: newCount,
      existingRecords: existingCount,
      duplicateRecords: duplicateCount,
      invalidRecords: invalidCount,
      items: analyzedItems
    };
  },

  /**
   * Execute batched writes into Firestore
   */
  async executeBatchImport(analyzedData, fileName, uploadedByEmail = 'Admin') {
    const startTime = Date.now();
    const itemsToImport = (analyzedData.items || []).filter(item => item.status === 'New' || item.status === 'Update');

    if (itemsToImport.length === 0) {
      throw new Error("No valid new or updateable records to import.");
    }

    let totalImported = 0;
    let totalUpdated = 0;
    let totalSkipped = analyzedData.duplicateRecords + analyzedData.invalidRecords;
    let totalFailed = 0;

    const BATCH_SIZE = 450;
    let currentBatch = writeBatch(db);
    let operationCount = 0;

    const uniqueBanksToEnsure = new Set();

    for (const item of itemsToImport) {
      try {
        const rec = item.record;
        const category = item.category || this.detectCategory(rec);
        const bankName = rec.bank || rec.bank_name || rec.bankName || 'Listed Bank';
        const title = rec.cardName || rec.accountName || rec.name || 'Financial Product';

        const bankId = rec.bank_id || `bank_${String(bankName).toLowerCase().replace(/\s+/g, '_')}`;
        const docId = String(item.cardId || rec.id || `${category}_${Date.now()}`);

        if (!uniqueBanksToEnsure.has(bankId) && category !== 'account_card_mapping') {
          uniqueBanksToEnsure.add(bankId);
          const bankRef = doc(db, BANKS_COLLECTION, String(bankId));
          currentBatch.set(bankRef, {
            id: String(bankId),
            name: bankName,
            updated_at: new Date().toISOString()
          }, { merge: true });
          operationCount++;
        }

        let targetCollection = DEBIT_CARDS_COLLECTION;
        let payload = null;

        if (category === 'savings_account') {
          targetCollection = SAVINGS_ACCOUNTS_COLLECTION;
          payload = validateSavingsAccount({ ...rec, id: docId, bank_id: bankId, bankName, updated_at: new Date().toISOString() });
        } else if (category === 'current_account') {
          targetCollection = CURRENT_ACCOUNTS_COLLECTION;
          payload = validateCurrentAccount({ ...rec, id: docId, bank_id: bankId, bankName, updated_at: new Date().toISOString() });
        } else if (category === 'account_card_mapping') {
          targetCollection = ACCOUNT_CARD_MAPPINGS_COLLECTION;
          payload = {
            account_id: String(rec.account_id),
            card_id: String(rec.card_id),
            relationship: normalizeDebitCardRelationship(rec.relationship),
            verification_status: rec.verification_status || 'verified',
            updated_at: new Date().toISOString()
          };
        } else {
          targetCollection = DEBIT_CARDS_COLLECTION;
          payload = validateDebitCard({ ...rec, id: docId, bank_id: bankId, bankName, updated_at: new Date().toISOString() });
        }

        const docRef = doc(db, targetCollection, docId);
        currentBatch.set(docRef, payload, { merge: true });
        operationCount++;

        if (item.status === 'New') totalImported++;
        if (item.status === 'Update') totalUpdated++;

        if (operationCount >= BATCH_SIZE) {
          await currentBatch.commit();
          currentBatch = writeBatch(db);
          operationCount = 0;
        }
      } catch (err) {
        console.error("Single item import batch error:", err);
        totalFailed++;
      }
    }

    if (operationCount > 0) {
      await currentBatch.commit();
    }

    const importTimeMs = Date.now() - startTime;
    const dateTimeIso = new Date().toISOString();

    const historyPayload = {
      file_name: fileName,
      uploaded_by: uploadedByEmail,
      date_time: dateTimeIso,
      records_imported: totalImported,
      records_updated: totalUpdated,
      records_skipped: totalSkipped,
      failed_records: totalFailed,
      total_records: analyzedData.totalRecords,
      status: totalFailed === 0 ? 'Completed' : 'Completed with warnings',
      duration_ms: importTimeMs
    };

    try {
      const historyRef = doc(db, IMPORT_HISTORY_COLLECTION, `import_${Date.now()}`);
      await setDoc(historyRef, historyPayload);
    } catch (err) {
      console.warn("Failed to write to import_history collection:", err.message);
    }

    try {
      await aiChatService.getFirestoreData(true);
    } catch (e) {}

    return {
      success: true,
      fileName,
      totalImported,
      totalUpdated,
      totalSkipped,
      totalFailed,
      importTimeMs,
      dateTimeIso
    };
  },

  /**
   * Sample Generators
   */
  downloadSampleJSON(type = 'debit_cards') {
    let sample = [];
    if (type === 'savings_accounts') {
      sample = [
        {
          "productCategory": "savings_account",
          "bankName": "HDFC Bank",
          "accountName": "HDFC SavingsMax Account",
          "accountType": "Premium Savings",
          "targetCustomer": "Affluent Individuals & Professionals",
          "interestRate": "3.00% - 3.50% p.a.",
          "minimumBalance": "₹25,000",
          "nonMaintenanceCharge": "₹600 + GST",
          "eligibility": ["Resident Indian", "Age 18+"],
          "atmLimit": "₹1,00,000/day",
          "posLimit": "₹5,00,000/day",
          "keyBenefits": ["Complimentary EasyShop Platinum Card", "Free demand drafts", "Accidental hospital cash cover"],
          "officialSource": "https://www.hdfcbank.com",
          "sourceType": "Official Bank Source"
        }
      ];
    } else if (type === 'current_accounts') {
      sample = [
        {
          "productCategory": "current_account",
          "bankName": "ICICI Bank",
          "accountName": "ICICI Classic Current Account",
          "accountType": "Regular Current",
          "suitableFor": "SMEs, Traders & Retailers",
          "businessConstitution": ["Sole Proprietorship", "Partnership", "Private Limited", "LLP"],
          "minimumBalance": "₹10,000",
          "averageBalanceRequirement": "₹10,000 MAB",
          "nonMaintenanceCharge": "₹1,000 + GST",
          "freeChequeLeaves": "100 leaves/mo",
          "cashDepositLimit": "Up to ₹2,50,000/month free",
          "keyBenefits": ["InstaBIZ app access", "Instant overdraft evaluation", "Free digital NEFT/RTGS"],
          "officialSource": "https://www.icicibank.com",
          "sourceType": "Official Bank Source"
        }
      ];
    } else if (type === 'account_card_mappings') {
      sample = [
        {
          "account_id": "hdfc-savingsmax",
          "card_id": "hdfc-bank-hdfc-easyshop-platinum-debit-card",
          "relationship": "included",
          "verification_status": "verified"
        }
      ];
    } else {
      sample = [
        {
          "productCategory": "debit_card",
          "cardName": "EasyShop Platinum Debit Card",
          "bankName": "HDFC Bank",
          "network": "Visa",
          "annualFee": 850,
          "atmLimit": "₹1,00,000/day",
          "posLimit": "₹5,00,000/day",
          "loungeAccess": "2 Domestic visits/quarter",
          "officialSource": "https://www.hdfcbank.com",
          "sourceType": "Official Bank Source"
        }
      ];
    }

    const jsonStr = JSON.stringify(sample, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sample_${type}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },

  downloadSampleCSV(type = 'debit_cards') {
    let csvContent = '';
    if (type === 'savings_accounts') {
      csvContent = `productCategory,bankName,accountName,accountType,targetCustomer,interestRate,minimumBalance,nonMaintenanceCharge,officialSource
savings_account,HDFC Bank,HDFC SavingsMax Account,Premium Savings,Professionals,3.00% p.a.,25000,600,https://www.hdfcbank.com
savings_account,State Bank of India,SBI Regular Savings,Regular Savings,General Public,2.70% p.a.,0,Nil,https://sbi.co.in`;
    } else if (type === 'current_accounts') {
      csvContent = `productCategory,bankName,accountName,accountType,suitableFor,minimumBalance,averageBalanceRequirement,freeChequeLeaves,officialSource
current_account,ICICI Bank,ICICI Classic Current,Regular Current,SMEs & Traders,10000,10000 MAB,100 leaves/mo,https://www.icicibank.com
current_account,HDFC Bank,HDFC Regular Current,Regular Current,Retailers & Startups,10000,10000 QAB,100 leaves/mo,https://www.hdfcbank.com`;
    } else if (type === 'account_card_mappings') {
      csvContent = `account_id,card_id,relationship,verification_status
hdfc-savingsmax,hdfc-bank-hdfc-easyshop-platinum-debit-card,included,verified
sbi-regular-savings,sbi-classic-debit-card,included,verified`;
    } else {
      csvContent = `productCategory,cardName,bankName,network,annualFee,atmLimit,posLimit,loungeAccess,officialSource
debit_card,EasyShop Platinum Debit Card,HDFC Bank,Visa,850,100000,500000,2 Domestic/quarter,https://www.hdfcbank.com
debit_card,SBI Global Debit Card,State Bank of India,Visa,175,40000,100000,No,https://sbi.co.in`;
    }

    const blob = new Blob(["\ufeff" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sample_${type}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
};

export default importDataService;
