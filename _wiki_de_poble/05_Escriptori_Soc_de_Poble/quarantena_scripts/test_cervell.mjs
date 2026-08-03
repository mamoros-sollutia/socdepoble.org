import { transcriuAudio } from './bot/cervell.mjs';
import { readFileSync } from 'node:fs';

async function run() {
  try {
    const bytes = Buffer.from('test audio content');
    const res = await transcriuAudio(bytes, 'audio/ogg');
    console.log("Result:", res);
  } catch(e) {
    console.error("Test failed:", e);
  }
}
run();
