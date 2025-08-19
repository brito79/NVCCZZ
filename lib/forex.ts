// lib/forex.ts

export type ForexData = {
  pair: string;
  rate: string;                 // formatted string for UI
  change: string;               // e.g. "+0.0021" or "N/A"
  trend: 'up' | 'down' | 'stable';
};

type FrankfurterLatest = {
  amount: number;
  base: string;
  date: string;                 // "YYYY-MM-DD"
  rates: Record<string, number>;
};

type ErApiLatest = {
  result: string;               // "success"
  base_code: string;            // "USD"
  time_last_update_utc: string;
  rates: Record<string, number>;
};

function toFixedStr(n: number | undefined, digits = 4): string {
  if (typeof n !== 'number' || !Number.isFinite(n)) return 'N/A';
  return n.toFixed(digits);
}

function trendFromDelta(delta: number | null | undefined): 'up' | 'down' | 'stable' {
  if (typeof delta !== 'number' || !Number.isFinite(delta) || delta === 0) return 'stable';
  return delta > 0 ? 'up' : 'down';
}

// Get previous business day (skip Sat/Sun)
function previousBusinessDate(d = new Date()): string {
  const dt = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  // step back at least one day
  dt.setUTCDate(dt.getUTCDate() - 1);
  // if weekend, back to Friday
  const day = dt.getUTCDay(); // 0=Sun, 6=Sat
  if (day === 0) dt.setUTCDate(dt.getUTCDate() - 2);     // Sunday -> Friday
  if (day === 6) dt.setUTCDate(dt.getUTCDate() - 1);     // Saturday -> Friday
  const yyyy = dt.getUTCFullYear();
  const mm = String(dt.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(dt.getUTCDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

// Safe JSON fetch guard (avoids HTML surprise)
async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { Accept: 'application/json', ...(init?.headers || {}) },
    ...init,
  });
  const ct = res.headers.get('content-type') || '';
  const text = await res.text();
  if (!ct.includes('application/json')) {
    throw new Error(`Non-JSON from ${url}: ${text.slice(0, 120)}…`);
  }
  const json = JSON.parse(text);
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} from ${url}: ${JSON.stringify(json).slice(0, 120)}…`);
  }
  return json as T;
}

/**
 * Returns USD pairs: USD/ZWL (via ER-API), USD/GBP, USD/EUR (via Frankfurter)
 * - change/trend computed for EUR & GBP (vs previous business day)
 * - ZWL change is "N/A" (ER-API free endpoint lacks history)
 */
export async function getForexRates(): Promise<{ success: boolean; data: ForexData[]; error?: string }> {
  const out: ForexData[] = [];
  const errors: string[] = [];

  // ---- Frankfurter for EUR & GBP (latest + previous) ----
  try {
    const latest = await fetchJson<FrankfurterLatest>(
      'https://api.frankfurter.app/latest?from=USD&to=EUR,GBP'
    );

    // previous business day
    const prevDate = previousBusinessDate(new Date());
    const prev = await fetchJson<FrankfurterLatest>(
      `https://api.frankfurter.app/${prevDate}?from=USD&to=EUR,GBP`
    );

    // USD/EUR
    const eurNow = latest.rates?.EUR;
    const eurPrev = prev.rates?.EUR;
    const eurDelta = (typeof eurNow === 'number' && typeof eurPrev === 'number') ? eurNow - eurPrev : null;
    out.push({
      pair: 'USD/EUR',
      rate: toFixedStr(eurNow, 4),
      change: (eurDelta == null) ? 'N/A' : (eurDelta >= 0 ? `+${eurDelta.toFixed(4)}` : eurDelta.toFixed(4)),
      trend: trendFromDelta(eurDelta ?? undefined),
    });

    // USD/GBP
    const gbpNow = latest.rates?.GBP;
    const gbpPrev = prev.rates?.GBP;
    const gbpDelta = (typeof gbpNow === 'number' && typeof gbpPrev === 'number') ? gbpNow - gbpPrev : null;
    out.push({
      pair: 'USD/GBP',
      rate: toFixedStr(gbpNow, 4),
      change: (gbpDelta == null) ? 'N/A' : (gbpDelta >= 0 ? `+${gbpDelta.toFixed(4)}` : gbpDelta.toFixed(4)),
      trend: trendFromDelta(gbpDelta ?? undefined),
    });
  } catch (e: any) {
    errors.push(`Frankfurter: ${e?.message || e}`);
  }

  // ---- ER-API for ZWL (latest only) ----
  try {
    const er = await fetchJson<ErApiLatest>('https://open.er-api.com/v6/latest/USD');
    const zwl = er.rates?.ZWL;

    out.push({
      pair: 'USD/ZWL',
      rate: toFixedStr(zwl, 2),
      change: 'N/A',      // free ER-API endpoint doesn't provide historical; omit change
      trend: 'stable',    // without history we can’t compute direction
    });
  } catch (e: any) {
    // If ZWL isn’t available, still return success with the other pairs
    errors.push(`ER-API (ZWL): ${e?.message || e}`);
    out.push({
      pair: 'USD/ZWL',
      rate: 'N/A',
      change: 'N/A',
      trend: 'stable',
    });
  }

  // If we got at least one pair, return success; otherwise bubble the error
  if (out.length > 0) {
    return { success: true, data: out, error: errors.length ? errors.join(' | ') : undefined };
  }
  return { success: false, data: [], error: errors.join(' | ') || 'No data' };
}
