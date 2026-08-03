import { GoogleGenAI } from '@google/genai';
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
async function run() {
  const models = await ai.models.listModels();
  for (const model of models) {
    if (model.name.includes("imagen")) {
      console.log(model.name);
    }
  }
}
run();
