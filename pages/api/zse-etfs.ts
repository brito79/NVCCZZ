'use server';

import { API_BASE_URL } from "@/lib/constants";

export type ZseETF = {
  security: string;
  price: number;
  price_currency: string;
  change: number;
  change_direction: "up" | "down" | "neutral";
  market_cap: number;
  market_cap_currency: string;
  units: string;
};

export type ZseETFsResponse = {
  status: string;
  timestamp: string;
  source: string;
  url: string;
  etfs: ZseETF[];
  count: number;
};



export async function fetchZseETFs(): Promise<{
  success: boolean;
  data?: ZseETFsResponse;
  error?: string;
}> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/zse/etfs`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        'ngrok-skip-browser-warning': 'true'
      },
    });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const json = await response.json();

    // ✅ Validate the structure
    if (
      !json.etfs ||
      !Array.isArray(json.etfs) ||
      typeof json.count !== "number" ||
      !json.status ||
      !json.timestamp ||
      !json.source ||
      !json.url
    ) {
      throw new Error("Invalid data format from API");
    }

    const structuredData: ZseETFsResponse = {
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

