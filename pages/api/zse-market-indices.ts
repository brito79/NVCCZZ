'use server';

import { API_BASE_URL } from "@/lib/constants";

export type ZseMarketIndex = {
  index: string;
  value: number;
  change: number;
  direction: "up" | "down" | "neutral";
  currency: string;
  unit: string;
};

export type ZseMarketIndicesResponse = {
  status: string;
  timestamp: string;
  source: string;
  url: string;
  market_indices: ZseMarketIndex[];
  count: number;
};

export async function fetchMarketIndices(): Promise<{
  success: boolean;
  data?: ZseMarketIndicesResponse;
  error?: string;
}> {
  try {
    console.log('Fetching from:', `${API_BASE_URL}/api/zse/market-indices`);
    
    const response = await fetch(`${API_BASE_URL}/api/zse/market-indices`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true'
      },
    });

    if (!response.ok) {
      throw new Error(`API for market-indices returned ${response.status}: ${response.statusText}`);
    }

    const json = await response.json();
    console.log('API Response:', json);

    // Validate the data structure
    if (!json) {
      throw new Error("No data received from API");
    }

    if (!json.market_indices || !Array.isArray(json.market_indices)) {
      throw new Error("Invalid data format: market_indices missing or not an array");
    }

    console.log(`Received ${json.market_indices.length} market indices`);

    const structuredData: ZseMarketIndicesResponse = {
      status: json.status || 'success',
      timestamp: json.timestamp || new Date().toISOString(),
      source: json.source || 'ZSE API',
      url: json.url || '',
      market_indices: json.market_indices,
      count: json.count || json.market_indices.length,
    };

    return { success: true, data: structuredData };
  } catch (error: any) {
    console.error("Error fetching market indices:", error);
    return {
      success: false,
      error: error.message || "An unknown error occurred",
    };
  }
}
