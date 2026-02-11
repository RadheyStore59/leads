
export interface SearchResult {
  name: string;
  phone: string;
  email: string;
  address: string;
  website: string;
  sourceUrl: string;
}

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
}

export interface SearchResponse {
  text: string;
  sources: { title: string; uri: string }[];
  extractedData: SearchResult[];
}
