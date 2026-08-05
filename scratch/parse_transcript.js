import fs from 'fs';
import path from 'path';
import readline from 'readline';

const transcriptPath = 'C:/Users/lenovo/.gemini/antigravity-ide/brain/a11b922d-54ec-4777-ae86-bbe707d395b2/.system_generated/logs/transcript.jsonl';

async function parse() {
  const fileStream = fs.createReadStream(transcriptPath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  for await (const line of rl) {
    const obj = JSON.parse(line);
    if (obj.source === 'USER_EXPLICIT' && obj.type === 'USER_INPUT') {
      console.log(`\n--- STEP ${obj.step_index} (${obj.created_at}) ---`);
      console.log(obj.content);
    }
  }
}

parse();
