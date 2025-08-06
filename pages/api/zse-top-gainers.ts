'use server'

import {API_BASE_URL} from '@/lib/constants';

export interface TopGainer {
  symbol: string;
  value: number;
  change: number;
  currency: string;
  direction: "up" | "down" | "neutral";
}

export interface TopGainersResponse {
  status: string;
  timestamp: string;
  source: string;
  url: string;
  top_gainers: TopGainer[];
  count: number;
}



export async function fetchTopGainers(): Promise<{
  success: boolean;
  data?: TopGainersResponse;
  error?: string;
}> {
  try {
    console.log('Fetching from:', `${API_BASE_URL}/api/zse/top-gainers`);
    
    const res = await fetch(`${API_BASE_URL}/api/zse/top-gainers`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true'
      }
    });

    if (!res.ok) {
      throw new Error(`API for top-gainers returned ${res.status}: ${res.statusText}`);
    }

    const jsonData = await res.json();
    console.log('API Response:', jsonData);

    // Validate the data structure
    if (!jsonData) {
      throw new Error("No data received from API");
    }

    // if (!jsonData.top_gainers || !Array.isArray(jsonData.top_gainers)) {
    //   throw new Error("Invalid data format: top_gainers missing or not an array");
    // }

    console.log(`Received ${jsonData.top_gainers.length} top gainers`);

    return {
      success: true,
      data: {
        status: jsonData.status || 'success',
        timestamp: jsonData.timestamp || new Date().toISOString(),
        source: jsonData.source || 'ZSE API',
        url: jsonData.url || '',
        top_gainers: jsonData.top_gainers,
        count: jsonData.count || jsonData.top_gainers.length,
      },
    };
  } catch (err: any) {
    console.error('fetchTopGainers error:', err);
    return {
      success: false,
      error: err.message || "Unexpected error occurred",
    };
  }
}
