import { GoogleGenAI, Type } from '@google/genai';
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
async function run() {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: "Dibuixa'm un pirata.",
      tools: [{
        functionDeclarations: [{
          name: 'dibuixar_estampa',
          description: 'Genera una imatge',
          parameters: {
            type: Type.OBJECT,
            properties: { prompt: { type: Type.STRING } },
            required: ['prompt']
          }
        }]
      }]
    });
    console.log("Text:", response.text);
    console.log("Function Calls:", response.functionCalls);
  } catch (err) {
    console.error("Error:", err);
  }
}
run();
