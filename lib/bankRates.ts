// lib/bankRates.ts

import { BankRatesResponse } from "@/types.db";



const API_URL = "https://73bd1d484a1c.ngrok-free.app/api/rbz/exchange-rates";

export async function fetchBankRates(): Promise<{ success: boolean; data?: BankRatesResponse; error?: string }> {
  try {
    const res = await fetch(API_URL);

    if (!res.ok) {
      throw new Error(`API returned ${res.status}`);
    }

    const json = await res.json();

    // Clean the exchange_rates array: remove header row
    const cleanedRates = json.exchange_rates.filter((entry: any) =>
      typeof entry.ask === 'number' &&
      typeof entry.avg === 'number' &&
      typeof entry.bid === 'number'
    );

    const structuredData: BankRatesResponse = {
      date: json.date,
      exchange_rates: cleanedRates,
      source: json.source,
      status: json.status,
      timestamp: json.timestamp,
    };

    return { success: true, data: structuredData };
  } catch (err: any) {
    return { success: false, error: err.message || "Unexpected error" };
  }
}

