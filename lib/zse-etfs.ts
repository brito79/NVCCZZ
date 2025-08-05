// lib/zse.ts

export type ZseEtf = {
  security: string;
  price: number;
  price_currency: string;
  change: number;
  change_direction: "up" | "down" | "neutral";
  market_cap: number;
  market_cap_currency: string;
  units: string;
};

export type ZseEtfsResponse = {
  status: string;
  timestamp: string;
  source: string;
  url: string;
  etfs: ZseEtf[];
  count: number;
};

const API_BASE_URL = "https://40df335d36e1.ngrok-free.app";

export async function fetchZseEtfs(): Promise<{
  success: boolean;
  data?: ZseEtfsResponse;
  error?: string;
}> {
  try {
    const response = await fetch(`${API_BASE_URL}/zse/etfs`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const json = await response.json();

    if (
      !json.etfs ||
      !Array.isArray(json.etfs) ||
      typeof json.count !== "number"
    ) {
      throw new Error("Invalid ETF data format from API");
    }

    const structuredData: ZseEtfsResponse = {
      status: json.status,
      timestamp: json.timestamp,
      source: json.source,
      url: json.url,
      etfs: json.etfs,
      count: json.count,
    };

    return { success: true, data: structuredData };
  } catch (error: any) {
    console.error("Error fetching ZSE ETFs:", error);
    return {
      success: false,
      error: error.message || "An unknown error occurred",
    };
  }
}
