// lib/bankRates.ts

import { BankRatesResponse, ExchangeRate } from "@/types.db";
import { API_BASE_URL } from "./constants";

export async function fetchBankRates(): Promise<{ success: boolean; data?: BankRatesResponse; error?: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/rbz/exchange-rates`);

    if (!res.ok) {
      throw new Error(`API returned ${res.status}`);
    }

    const json = await res.json();

    // Transform the old structure to match the new ExchangeRate interface
    const transformedRates: ExchangeRate[] = json.exchange_rates
      .filter((entry: any) => 
        // Filter out header rows and invalid entries
        entry.currency && 
        entry.currency !== "CURRENCY" &&
        typeof entry.bid === 'number' &&
        typeof entry.ask === 'number' &&
        typeof entry.avg === 'number'
      )
      .map((entry: any) => ({
        currency: entry.currency || "Unknown",           // e.g. "Zimbabwe Gold"
        mid_rate: entry.avg || 0,                       // Use avg as mid_rate
        pair: entry.currency ? `1USD-${entry.currency.split(' ')[0]}` : "1USD-ZiG", // Create pair format
        we_buy: entry.bid || 0,                        // Map bid to we_buy
        we_sell: entry.ask || 0,                       // Map ask to we_sell
      }));

    // Create ISO date from the existing date
    const createIsoDate = (dateStr: string): string => {
      try {
        // If it's already in a recognizable format, convert it
        const date = new Date(dateStr);
        return date.toISOString().split('T')[0]; // Return YYYY-MM-DD format
      } catch {
        // Fallback to current date if parsing fails
        return new Date().toISOString().split('T')[0];
      }
    };

    const structuredData: BankRatesResponse = {
      date: json.date || new Date().toLocaleDateString('en-US', { 
        day: '2-digit', 
        month: 'short', 
        year: 'numeric' 
      }),
      date_iso: createIsoDate(json.date || new Date().toISOString()),
      exchange_rates: transformedRates,
    };

    return { success: true, data: structuredData };
  } catch (err: any) {
    return { success: false, error: err.message || "Unexpected error" };
  }
}

