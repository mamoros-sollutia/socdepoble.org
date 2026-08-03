import { GoogleGenAI } from '@google/genai';
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
async function run() {
  try {
    const response = await ai.models.generateImages({
      model: 'imagen-3.0-generate-002',
      prompt: 'a yellow cat in a rural village, linocut style',
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/jpeg',
      },
    });
    console.log("Success! Base64 length:", response.generatedImages?.[0]?.image?.imageBytes?.length);
  } catch (err) {
    console.error("Imagen failed:", err);
  }
}
run();
