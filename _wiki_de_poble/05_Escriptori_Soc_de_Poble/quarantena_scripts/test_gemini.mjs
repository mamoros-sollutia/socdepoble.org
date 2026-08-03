import { GoogleGenAI } from '@google/genai';
import { readFileSync } from 'node:fs';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
async function run() {
  try {
    const data = Buffer.from('test string to transcribe').toString('base64');
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        { text: "Transcribe this audio" },
        { inlineData: { data, mimeType: "audio/ogg" } },
      ],
    });
    console.log("Success!", response.text);
  } catch (err) {
    console.error("Error:", err);
  }
}
run();
