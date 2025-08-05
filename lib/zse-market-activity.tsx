// lib/zse.ts

export type ZseMarketActivity = {
  trades: number;
  turnover: number;
  market_cap: number;
  foreign_buys: number;
  foreign_sells: number;
  currencies: {
    turnover: string;
    market_cap: string;
    foreign_buys: string;
    foreign_sells: string;
  };
};

export type ZseMarketActivityResponse = {
  status: string;
  date: string;
  timestamp: string;
  source: string;
  url: string;
  market_activity: ZseMarketActivity;
};

const API_BASE_URL = "https://40df335d36e1.ngrok-free.app";

export async function fetchMarketActivity(): Promise<{
  success: boolean;
  data?: ZseMarketActivityResponse;
  error?: string;
}> {
  try {
    const response = await fetch(`${API_BASE_URL}/zse/market-activity`, {
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
      !json.market_activity ||
      typeof json.market_activity.trades !== "number" ||
      typeof json.market_activity.turnover !== "number" ||
      typeof json.market_activity.market_cap !== "number"
    ) {
      throw new Error("Invalid market activity format from API");
    }

    const structuredData: ZseMarketActivityResponse = {
      status: json.status,
      date: json.date,
      timestamp: json.timestamp,
      source: json.source,
      url: json.url,
      market_activity: json.market_activity,
    };

    return { success: true, data: structuredData };
  } catch (error: any) {
    console.error("Error fetching ZSE market activity:", error);
    return {
      success: false,
      error: error.message || "An unknown error occurred",
    };
  }
}
