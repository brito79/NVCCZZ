// lib/bankRates.ts

import { BankRatesResponse } from "@/types.db";
import { API_BASE_URL } from "./constants";

export async function fetchBankRates(): Promise<{ success: boolean; data?: BankRatesResponse; error?: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/rbz/exchange-rates`);

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

    // Create ISO date from the existing date
    const createIsoDate = (dateStr: string): string => {
      try {
        const date = new Date(dateStr);
        return date.toISOString().split('T')[0]; // Return YYYY-MM-DD format
      } catch {
        return new Date().toISOString().split('T')[0];
      }
    };

    const structuredData: BankRatesResponse = {
      date: json.date,
      date_iso: createIsoDate(json.date),
      exchange_rates: cleanedRates,
    };

    return { success: true, data: structuredData };
  } catch (err: any) {
    return { success: false, error: err.message || "Unexpected error" };
  }
}

