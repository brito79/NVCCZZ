// lib/zse.ts

export type ZseLoser = {
  symbol: string;
  value: number;
  change: number;
  currency: string;
  direction: 'down';
};

export type ZseTopLosersResponse = {
  status: string;
  timestamp: string;
  source: string;
  url: string;
  top_losers: ZseLoser[];
  count: number;
};

const API_BASE_URL = "https://73bd1d484a1c.ngrok-free.app/api";

export async function fetchTopLosers(): Promise<{
  success: boolean;
  data?: ZseTopLosersResponse;
  error?: string;
}> {
  try {
    console.log('Fetching from:', `${API_BASE_URL}/zse/top-losers`);
    
    const response = await fetch(`${API_BASE_URL}/zse/top-losers`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true'
      },
    });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}: ${response.statusText}`);
    }

    const json = await response.json();
    console.log('API Response:', json);

    // Optional: Validate required fields
    if (!json) {
      throw new Error("No data received from API");
    }

    if (
      !json.top_losers ||
      !Array.isArray(json.top_losers) ||
      typeof json.count !== "number"
    ) {
      throw new Error("Invalid data format from API - missing top_losers array or count");
    }

    console.log(`Received ${json.top_losers.length} top losers`);

    const structuredData: ZseTopLosersResponse = {
      status: json.status || 'success',
      timestamp: json.timestamp || new Date().toISOString(),
      source: json.source || 'ZSE API',
      url: json.url || '',
      top_losers: json.top_losers,
      count: json.count || json.top_losers.length,
    };

    return { success: true, data: structuredData };
  } catch (error: any) {
    console.error("Error fetching top losers:", error);
    return {
      success: false,
      error: error.message || "An unknown error occurred",
    };
  }
}
