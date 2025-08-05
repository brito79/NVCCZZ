// lib/forex.ts

export type ForexData = {
  pair: string;
  rate: string;
  change: string;
  trend: 'up' | 'down' | 'stable';
};

export async function getForexRates(): Promise<{ success: boolean; data: ForexData[]; error?: string }> {
  try {
    const res = await fetch('https://api.exchangerate.host/latest?base=USD&symbols=GBP,EUR,ZWL');

    if (!res.ok) {
      throw new Error(`Failed to fetch data: ${res.statusText}`);
    }

    const json = await res.json();
    const rates = json.rates;

    const data: ForexData[] = [
      { pair: 'USD/ZWL', rate: rates.ZWL?.toLocaleString() ?? 'N/A', change: 'N/A', trend: 'stable' },
      { pair: 'USD/GBP', rate: rates.GBP?.toFixed(4) ?? 'N/A', change: 'N/A', trend: 'stable' },
      { pair: 'USD/EUR', rate: rates.EUR?.toFixed(4) ?? 'N/A', change: 'N/A', trend: 'stable' },
    ];

    return { success: true, data };
  } catch (error: any) {
    return {
      success: false,
      data: [],
      error: error.message || 'Unknown error occurred while fetching forex rates',
    };
  }
}
