import { GoogleGenAI, Type } from '@google/genai';
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
async function run() {
  const tools = [{
    functionDeclarations: [{
      name: 'dibuixar_estampa',
      description: 'Genera una imatge basada en la petició de l\'usuari.',
      parameters: {
        type: Type.OBJECT,
        properties: { prompt_angles: { type: Type.STRING } },
        required: ['prompt_angles']
      }
    }]
  }];
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: 'dibuixa un gat groc',
    config: { 
      systemInstruction: "Ets un asistent",
      tools: tools 
    }
  });
  console.log("functionCalls:", response.functionCalls);
  console.log("text:", response.text);
}
run().catch(console.error);
