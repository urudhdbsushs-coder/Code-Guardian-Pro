
import { GoogleGenAI, Type } from "@google/genai";
import { ObfuscationLevel, ObfuscationResult } from "../types";

export const obfuscateWithAI = async (
  code: string,
  level: ObfuscationLevel
): Promise<ObfuscationResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    Task: Obfuscate the following web code (HTML/JS/CSS).
    Level: ${level}
    
    Instructions:
    1. If level is Low: Just minify the code and remove all comments.
    2. If level is Medium: Minify, rename local variables to random strings, and encode important strings using hex or base64.
    3. If level is High: Implement complex code flow redirection, add dead code, heavily rename all identifiers, and wrap the entire logic in an execution wrapper that makes it extremely hard to debug or reverse-engineer.
    
    Return the result in JSON format with properties:
    - obfuscatedCode: The final scrambled code.
    - explanation: A brief explanation (in Bengali as the user requested) of how this protection works.
    - technique: Name of the technique used.

    The code to obfuscate:
    \`\`\`
    ${code}
    \`\`\`
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            obfuscatedCode: { type: Type.STRING },
            explanation: { type: Type.STRING },
            technique: { type: Type.STRING },
          },
          required: ["obfuscatedCode", "explanation", "technique"],
        },
      },
    });

    const data = JSON.parse(response.text || '{}');
    
    return {
      originalSize: new Blob([code]).size,
      newSize: new Blob([data.obfuscatedCode]).size,
      obfuscatedCode: data.obfuscatedCode,
      technique: data.technique,
      explanation: data.explanation,
    };
  } catch (error) {
    console.error("AI Obfuscation failed:", error);
    throw new Error("AI Obfuscation service is currently unavailable. Please try again later.");
  }
};
