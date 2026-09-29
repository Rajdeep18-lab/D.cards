const queries = [
  'Hello',
  'Which savings account has zero minimum balance?',
  'Compare SBI and HDFC debit cards.',
  'Which debit card has lounge access?',
  'Find SBI branches near Haridwar.',
  'Show me SBI branches in Bhopal.'
];

async function runTests() {
  console.log('=== TESTING ALL 6 REQUIRED AI QUERIES ===\n');
  for (let i = 0; i < queries.length; i++) {
    const q = queries[i];
    const start = Date.now();
    try {
      const res = await fetch('http://localhost:5173/api/ai-advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: q })
      });
      const dur = Date.now() - start;
      const json = await res.json();
      console.log(`[${i+1}] Query: "${q}"`);
      console.log(`    Status: ${res.status} | Duration: ${dur}ms | Intent: ${json.intent || json.type}`);
      console.log(`    Answer: ${json.answer?.replace(/\n/g, ' ')?.substring(0, 160)}...`);
      console.log(`    Data: Accounts=${json.matchedAccounts?.length || 0}, Cards=${json.matchedCards?.length || 0}, Locations=${json.matchedLocations?.length || 0}\n`);
    } catch (err) {
      console.error(`[${i+1}] Query failed: "${q}" -> ${err.message}\n`);
    }
  }
}
runTests();
