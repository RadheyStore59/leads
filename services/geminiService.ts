
import { GoogleGenAI } from "@google/genai";
import { SearchResponse, SearchResult } from "../types";

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Perform a high-density lead extraction.
 * @param query The search query
 * @param specializedModifier A modifier to force Google Search into different directory corners
 */
export const performSearch = async (query: string, specializedModifier: string = "", retryCount = 0): Promise<SearchResponse> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const modelName = 'gemini-3-flash-preview';

  const finalQuery = specializedModifier ? `${query} ${specializedModifier}` : query;

  const prompt = `
    INSTRUCTIONS: You are a B2B Lead Generation Expert. Perform an EXHAUSTIVE extraction for: "${finalQuery}".
    
    GOAL: Find EVERY possible business contact. Do not summarize. 
    Look for lists, tables, and directory entries in the search results.
    
    TARGET SOURCES:
    - Industrial Zone Member Directories (GIDC, MIDC, RIICO, etc.)
    - B2B Portals (IndiaMART, TradeIndia, ExportersIndia)
    - Trade Association Lists
    - Government MSME/Udyam registries
    
    REQUIRED JSON FORMAT (EXTRACT AS MANY AS POSSIBLE):
    [
      {
        "name": "Business Name",
        "phone": "Full Phone Number (Mandatory)",
        "email": "Email if available",
        "website": "URL",
        "address": "Full Address",
        "sourceUrl": "Source link"
      }
    ]

    STRICT RULES:
    1. Only include businesses where a PHONE NUMBER is found.
    2. If multiple numbers exist, pick the primary mobile/WhatsApp.
    3. MAXIMIZE QUANTITY. If you see a list of 50 leads, try to extract all of them.
    4. JSON ONLY. No text before or after.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        temperature: 0.1,
      },
    });

    const rawText = response.text || "";
    let extractedData: SearchResult[] = [];
    
    const jsonMatch = rawText.match(/\[\s*\{[\s\S]*\}\s*\]/);
    if (jsonMatch) {
      try {
        extractedData = JSON.parse(jsonMatch[0].trim());
      } catch (e) {
        try {
          const sanitized = jsonMatch[0].replace(/,\s*\]/, ']').trim();
          extractedData = JSON.parse(sanitized);
        } catch (e2) {
          console.error("JSON Parsing Error");
        }
      }
    }

    const sources = (response.candidates?.[0]?.groundingMetadata?.groundingChunks || [])
      .map((chunk: any) => ({
        title: chunk.web?.title || 'Registry Source',
        uri: chunk.web?.uri || ''
      }))
      .filter((s: any) => s.uri !== '');

    return {
      text: rawText,
      sources: sources, 
      extractedData: extractedData
    };

  } catch (error: any) {
    const errorMsg = error?.message || "";
    const isQuota = errorMsg.includes("429") || errorMsg.includes("RESOURCE_EXHAUSTED");
    
    if (isQuota && retryCount < 1) {
      await sleep(10000);
      return performSearch(query, specializedModifier, retryCount + 1);
    }

    if (isQuota) {
      throw new Error("QUOTA_EXHAUSTED: Multi-phase scan requires more API capacity. Please use a personal API key.");
    }

    throw new Error(errorMsg || "Search phase failed.");
  }
};
