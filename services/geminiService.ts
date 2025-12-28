
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getSurvivalTips = async (query: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are HLNA (Human-Like Neural Assistant), an AI integrated into a survivor's holographic dossier. Your purpose is to provide expert guidance for ARK: Survival Evolved.
      You are answering questions for a comprehensive guide that covers all versions of the game.
      Provide concise, helpful, and strategic advice for the following user query: "${query}".
      Format your response for a mobile screen using markdown for lists, bolding for emphasis, and bullet points for clarity.`,
      config: {
        temperature: 0.5,
        topP: 0.9,
      }
    });
    return response.text || "Connection to the Obelisk is unstable... Try again later, survivor.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "The ARK archives are currently offline. Please refer to your local data.";
  }
};