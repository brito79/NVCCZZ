'use server';

import { API_BASE_URL } from "@/lib/constants";

export interface TopLoser {
  symbol: string;
  value: number;
  change: number;
  currency: string;
  direction: "up" | "down" | "neutral";
}

export default interface TopLosersResponse {
  status: string;
  timestamp: string;
  source: string;
  url: string;
  top_losers: TopLoser[];
  count: number;
}



export async function fetchTopLosers(): Promise<{
  success: boolean;
  data?: TopLosersResponse;
  error?: string;
}> {
  try {
    console.log('Fetching from:', `${API_BASE_URL}/api/zse/top-losers`);
    
    const res = await fetch(`${API_BASE_URL}/api/zse/top-losers`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true'
      }
    });

    if (!res.ok) {
      throw new Error(`API for top-losers returned ${res.status}: ${res.statusText}`);
    }

    const jsonData = await res.json();
    console.log('API Response:', jsonData);

    // Validate the data structure
    if (!jsonData) {
      throw new Error("No data received from API");
    }

    if (!jsonData.top_losers || !Array.isArray(jsonData.top_losers)) {
      throw new Error("Invalid data format: top_losers missing or not an array");
    }

    console.log(`Received ${jsonData.top_losers.length} top losers`);

    return {
      success: true,
      data: {
        status: jsonData.status || 'success',
        timestamp: jsonData.timestamp || new Date().toISOString(),
        source: jsonData.source || 'ZSE API',
        url: jsonData.url || '',
        top_losers: jsonData.top_losers,
        count: jsonData.count || jsonData.top_losers.length,
      },
    };
  } catch (err: any) {
    console.error('fetchTopLosers error:', err);
    return {
      success: false,
      error: err.message || "Unexpected error occurred",
    };
  }
}
