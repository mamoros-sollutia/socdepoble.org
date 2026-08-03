import { GoogleGenAI } from '@google/genai';
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const models = await ai.models.list();
for (const m of models) {
  if (m.name.includes('imagen')) console.log(m.name);
}
