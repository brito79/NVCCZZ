'use server';

import { API_BASE_URL } from "@/lib/constants";

export type InflationRates = {
  cpi_index: number | null;
  mom_change: number | null;
  yoy_change: number | null;
  food_yoy: number | null;
  food_mom: number | null;
  non_food_yoy: number | null;
  non_food_mom: number | null;
};

export type InflationRatesResponse = {
  date: string;
  inflation_rates: InflationRates;
  source: string;
  status: string;
  timestamp: string;
  url: string;
};

export async function fetchInflationRates(): Promise<{
  success: boolean;
  data?: InflationRatesResponse;
  error?: string;
}> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/rbz/inflation-rates`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'ngrok-skip-browser-warning': 'true',
      },
    });

    if (!res.ok) {
      throw new Error(`Request failed with status ${res.status}`);
    }

    const json = await res.json();

    const finalData: InflationRatesResponse = {
      date: json.date,
      inflation_rates: {
        cpi_index: json.inflation_rates?.cpi_index ?? null,
        food_mom: json.inflation_rates?.food_mom ?? null,
        food_yoy: json.inflation_rates?.food_yoy ?? null,
        mom_change: json.inflation_rates?.mom_change ?? null,
        non_food_mom: json.inflation_rates?.non_food_mom ?? null,
        non_food_yoy: json.inflation_rates?.non_food_yoy ?? null,
        yoy_change: json.inflation_rates?.yoy_change ?? null,
      },
      source: json.source,
      status: json.status,
      timestamp: json.timestamp,
      url: json.url,
    };

    return { success: true, data: finalData };
  } catch (error: any) {
    console.error('Error fetching inflation rates:', error.message);
    return {
      success: false,
      error: error.message || 'An unknown error occurred',
    };
  }
}
