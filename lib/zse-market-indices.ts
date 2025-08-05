// lib/zse.ts

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

const API_BASE_URL = "https://40df335d36e1.ngrok-free.app";

export async function fetchMarketIndices(): Promise<{
  success: boolean;
  data?: ZseMarketIndicesResponse;
  error?: string;
}> {
  try {
    const response = await fetch(`${API_BASE_URL}/zse/market-indices`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const json = await response.json();

    // Validate structure
    if (
      !json.market_indices ||
      !Array.isArray(json.market_indices) ||
      typeof json.count !== "number"
    ) {
      throw new Error("Invalid data format from API");
    }

    const structuredData: ZseMarketIndicesResponse = {
      status: json.status,
      timestamp: json.timestamp,
      source: json.source,
      url: json.url,
      market_indices: json.market_indices,
      count: json.count,
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
