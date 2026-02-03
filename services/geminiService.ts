
import { GoogleGenAI, Type } from "@google/genai";
import { ContactType, EnrichmentData, SecurityStatus } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const lookupContact = async (contact: string, type: ContactType): Promise<EnrichmentData> => {
  const modelName = 'gemini-3-flash-preview';
  
  const systemInstruction = `
    You are an intelligent contact security analyst simulating a hybrid database of Twilio Lookup and Clearbit Enrichment APIs.
    Given a ${type}, determine if it's likely to be unauthorized, a known spammer, or a legitimate business/personal contact.
    Return a structured JSON object.
    
    If it's a phone number: simulate carrier lookup and risk score.
    If it's an email: simulate profile enrichment and domain reliability.
    
    Include a "summary" that explains why the contact is flagged or safe.
  `;

  const response = await ai.models.generateContent({
    model: modelName,
    contents: `Analyze the following ${type}: ${contact}`,
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          contact: { type: Type.STRING },
          type: { type: Type.STRING },
          status: { type: Type.STRING, description: "One of: SAFE, FLAGGED, UNKNOWN" },
          riskScore: { type: Type.NUMBER, description: "Score from 0 to 100" },
          details: {
            type: Type.OBJECT,
            properties: {
              carrier: { type: Type.STRING },
              location: { type: Type.STRING },
              profileName: { type: Type.STRING },
              domainInfo: { type: Type.STRING },
              isSpamLikely: { type: Type.BOOLEAN },
              lastFlagged: { type: Type.STRING },
              summary: { type: Type.STRING }
            },
            required: ["isSpamLikely", "summary"]
          }
        },
        required: ["contact", "type", "status", "riskScore", "details"]
      }
    }
  });

  const data = JSON.parse(response.text.trim());
  return data as EnrichmentData;
};
