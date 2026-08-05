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

const DEBIT_CARDS_COLLECTION = 'debit_cards';
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
      // Basic CSV line splitter handling quoted commas
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
        // Type conversion helpers
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
   * Analyze records against existing Firestore database to detect new, updates, duplicates, and invalid records
   */
  async analyzeImportRecords(records) {
    if (!Array.isArray(records)) {
      return { totalRecords: 0, newRecords: 0, existingRecords: 0, duplicateRecords: 0, invalidRecords: 0, items: [] };
    }

    // Query existing Firestore cards & banks
    let existingCards = [];
    let existingBanks = [];

    try {
      const cardsSnap = await getDocs(collection(db, DEBIT_CARDS_COLLECTION));
      existingCards = cardsSnap.docs.map(d => ({ id: d.id, ...d.data() }));

      const banksSnap = await getDocs(collection(db, BANKS_COLLECTION));
      existingBanks = banksSnap.docs.map(d => ({ id: d.id, ...d.data() }));
    } catch (err) {
      console.warn("Firestore query notice during import analysis:", err);
    }

    const existingCardIds = new Set(existingCards.map(c => String(c.id || '').toLowerCase()));
    const existingCardNames = new Set(existingCards.map(c => `${String(c.cardName || '').toLowerCase()}_${String(c.bank || '').toLowerCase()}`));

    const seenInFileKeys = new Set();

    let newCount = 0;
    let existingCount = 0;
    let duplicateCount = 0;
    let invalidCount = 0;

    const analyzedItems = records.map((rec, index) => {
      const cardName = rec.cardName || rec.name || rec.title || '';
      const bank = rec.bank || rec.bank_name || rec.bankName || '';

      if (!cardName && !bank) {
        invalidCount++;
        return { index, record: rec, status: 'Invalid', reason: 'Missing Card Name or Bank' };
      }

      const cardId = rec.card_id || rec.id || `card_${String(bank || 'bank').toLowerCase().replace(/\s+/g, '_')}_${String(cardName || 'card').toLowerCase().replace(/\s+/g, '_')}`;
      const uniqueFileKey = `${String(cardName || '').toLowerCase()}_${String(bank || '').toLowerCase()}`;

      if (seenInFileKeys.has(uniqueFileKey)) {
        duplicateCount++;
        return { index, record: rec, cardId, status: 'Duplicate', reason: 'Duplicate in uploaded file' };
      }
      seenInFileKeys.add(uniqueFileKey);

      const existsInDb = existingCardIds.has(String(cardId).toLowerCase()) || existingCardNames.has(uniqueFileKey);

      if (existsInDb) {
        existingCount++;
        return { index, record: rec, cardId, status: 'Update', reason: 'Matches existing Firestore record (Will Update Changed Fields)' };
      } else {
        newCount++;
        return { index, record: rec, cardId, status: 'New', reason: 'New Debit Card record to create' };
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
   * Execute batched writes into Firestore (chunks of 500) and record import history
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

    // Batched Firestore Writes (Max 500 per batch)
    const BATCH_SIZE = 450;
    let currentBatch = writeBatch(db);
    let operationCount = 0;

    const uniqueBanksToEnsure = new Set();

    for (const item of itemsToImport) {
      try {
        const rec = item.record;
        const bankName = rec.bank || rec.bank_name || rec.bankName || 'Partner Bank';
        const cardName = rec.cardName || rec.name || rec.title || 'Debit Card';

        const bankId = rec.bank_id || `bank_${String(bankName).toLowerCase().replace(/\s+/g, '_')}`;
        const cardId = item.cardId || rec.card_id || rec.id || `card_${String(bankName).toLowerCase().replace(/\s+/g, '_')}_${String(cardName).toLowerCase().replace(/\s+/g, '_')}`;

        // Ensure Bank document is prepared in batch if not seen
        if (!uniqueBanksToEnsure.has(bankId)) {
          uniqueBanksToEnsure.add(bankId);
          const bankRef = doc(db, BANKS_COLLECTION, String(bankId));
          currentBatch.set(bankRef, {
            id: String(bankId),
            name: bankName,
            updated_at: new Date().toISOString()
          }, { merge: true });
          operationCount++;
        }

        // Card payload
        const cardPayload = {
          ...rec,
          id: String(cardId),
          cardName,
          bank: bankName,
          bank_id: String(bankId),
          network: rec.network || 'Visa',
          category: rec.category || 'Rewards',
          annualFee: Number(rec.annualFee) || 0,
          minBalance: Number(rec.minBalance) || 0,
          rating: Number(rec.rating) || 4.5,
          updated_at: new Date().toISOString()
        };

        const cardRef = doc(db, DEBIT_CARDS_COLLECTION, String(cardId));
        currentBatch.set(cardRef, cardPayload, { merge: true });
        operationCount++;

        if (item.status === 'New') totalImported++;
        if (item.status === 'Update') totalUpdated++;

        // Commit batch if limit reached
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

    // Record entry into Firestore `import_history`
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

    // Force flush cache across card & AI chatbot services
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
   * Retrieve past import history logs from Firestore `import_history` collection
   */
  async fetchImportHistory() {
    try {
      const snap = await getDocs(query(collection(db, IMPORT_HISTORY_COLLECTION), orderBy('date_time', 'desc')));
      if (!snap.empty) {
        return snap.docs.map(d => ({ id: d.id, ...d.data() }));
      }
    } catch (err) {
      console.warn("Firestore import_history fetch notice:", err.message);
    }
    return [];
  },

  /**
   * Sample JSON Generator
   */
  downloadSampleJSON() {
    const sample = [
      {
        "card_id": "card_hdfc_easyshop_platinum",
        "cardName": "EasyShop Platinum Debit Card",
        "bank_id": "bank_hdfc",
        "bank": "HDFC Bank",
        "network": "Visa",
        "category": "Premium",
        "annualFee": 850,
        "minBalance": 10000,
        "rating": 4.5,
        "cashback": "Cashback points on retail spends",
        "cashbackPct": 1.0,
        "benefits": "Airport lounge access, EasyEMI, Golf perks",
        "loungeAccess": "Yes, 2 visits/quarter",
        "contactless": true,
        "studentFriendly": false
      },
      {
        "card_id": "card_kotak_811_rupay",
        "cardName": "Kotak 811 RuPay Platinum",
        "bank_id": "bank_kotak",
        "bank": "Kotak Mahindra Bank",
        "network": "RuPay",
        "category": "Zero Balance",
        "annualFee": 0,
        "minBalance": 0,
        "rating": 4.6,
        "cashback": "Digital cashback on online merchants",
        "cashbackPct": 1.5,
        "benefits": "Zero annual fee, instant digital activation",
        "loungeAccess": "No",
        "contactless": true,
        "studentFriendly": true
      }
    ];

    const jsonStr = JSON.stringify(sample, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample_debit_cards.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },

  /**
   * Sample CSV Generator
   */
  downloadSampleCSV() {
    const csvContent = `card_id,cardName,bank_id,bank,network,category,annualFee,minBalance,rating,loungeAccess,contactless,benefits
card_hdfc_easyshop_platinum,EasyShop Platinum Debit Card,bank_hdfc,HDFC Bank,Visa,Premium,850,10000,4.5,Yes,true,Airport lounge access & EasyEMI
card_icici_coral_visa,Coral Debit Card,bank_icici,ICICI Bank,Visa,Rewards,699,10000,4.4,Yes,true,BOGO movie tickets & dining rewards
card_kotak_811_rupay,Kotak 811 RuPay Platinum,bank_kotak,Kotak Mahindra Bank,RuPay,Zero Balance,0,0,4.6,No,true,Zero annual fee & digital cashback`;

    const blob = new Blob(["\ufeff" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample_debit_cards.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
};

export default importDataService;
