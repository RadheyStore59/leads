
import { GoogleGenAI, Type } from "@google/genai";
import { SearchResponse, SearchResult } from "../types";

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const performSearchSegment = async (query: string, segment: string, retryCount = 0): Promise<SearchResult[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const modelName = 'gemini-3-flash-preview';
  
  const prompt = `
    SCRAPER MODE: ACTIVE
    TARGET: ${query} (Focus Segment: ${segment})
    GOAL: EXTRACT EVERY SINGLE RECORD ON THE WEB FOR THIS SEGMENT.

    INSTRUCTIONS:
    1. Search for directories, listing pages, and member databases specifically for "${query} in ${segment}".
    2. Do NOT summarize. Do NOT provide "top 10".
    3. Extract: Business Name, Phone, Email, Address, Website URL.
    4. Use the search tool to find high-density pages (Yellow Pages, industry associations, maps, local lists).
    5. Return as many records as you can find (aim for 50-80 unique records just for this sub-segment).

    SCHEMA:
    - name: Business Name
    - phone: Phone Number (Use N/A if missing)
    - email: Email Address (Use N/A if missing)
    - website: Website URL (Use N/A if missing)
    - address: Full Physical Address
    - sourceUrl: Verification URL

    Output valid JSON in the 'extractedData' property.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        maxOutputTokens: 25000, 
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            extractedData: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  phone: { type: Type.STRING },
                  email: { type: Type.STRING },
                  address: { type: Type.STRING },
                  website: { type: Type.STRING },
                  sourceUrl: { type: Type.STRING }
                },
                required: ["name", "phone", "email", "address", "website", "sourceUrl"]
              }
            }
          },
          required: ["extractedData"]
        }
      },
    });

    const rawText = response.text || "{}";
    try {
      const parsed = JSON.parse(rawText.replace(/^```json\s*/, "").replace(/```$/, "").trim());
      return parsed.extractedData || [];
    } catch (e) {
      console.error("JSON Parse Error in segment", segment, e);
      return [];
    }
  } catch (error: any) {
    const isRateLimit = error?.message?.includes('429') || error?.message?.includes('RESOURCE_EXHAUSTED');
    if (isRateLimit && retryCount < 2) {
      await sleep(3000 * (retryCount + 1));
      return performSearchSegment(query, segment, retryCount + 1);
    }
    console.error(`Error in segment ${segment}:`, error);
    return [];
  }
};

export const performSearch = async (query: string): Promise<SearchResponse> => {
  // To get "Much more data", we split the query into 3 parallel sub-searches.
  // We'll use different "perspectives" to force Google Search to reveal more results.
  const segments = [
    "Major Directories and Top Lists",
    "Local Sub-areas and Neighborhoods",
    "Niche specialized directories and associations"
  ];

  // Execute in parallel
  const segmentResults = await Promise.all(
    segments.map(seg => performSearchSegment(query, seg))
  );

  // Flatten and de-duplicate by name
  const allResults = segmentResults.flat();
  const uniqueResultsMap = new Map<string, SearchResult>();
  
  allResults.forEach(item => {
    const key = item.name.toLowerCase().trim();
    if (!uniqueResultsMap.has(key)) {
      uniqueResultsMap.set(key, item);
    }
  });

  const extractedData = Array.from(uniqueResultsMap.values());

  return {
    text: `Aggregated harvest of ${extractedData.length} records.`,
    sources: [], // Sources are handled internally by segment workers
    extractedData
  };
};
