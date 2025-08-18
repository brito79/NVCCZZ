'use server'
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const revalidate = 30; // cache upstream for 30s (adjust as needed)

type TTStock = {
  ticker: string;
  name?: string;
  sector?: string;
  marketCap?: number;
  price: number;
  peRatio?: number;
  dividendYield?: number;
  ["52WeekHigh"]?: number;
  ["52WeekLow"]?: number;
  volume?: number;
  changePercent?: number;
};

type Ticker = {
  symbol: string;
  price: number;
  changePercent?: number;
  href?: string;
};

async function fetchJsonSafe(url: string, init?: RequestInit) {
  const res = await fetch(url, {
    ...init,
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
      "User-Agent": "TickerBar/1.0",
      ...(init?.headers || {}),
    },
    // If you want server caching, uncomment:
    next: { revalidate },
  });

  const ct = res.headers.get("content-type") || "";
  const text = await res.text();
  if (!ct.includes("application/json")) {
    throw new Error(`Non-JSON upstream ${res.status} ${res.statusText}: ${text.slice(0,140)}…`);
  }
  const json = JSON.parse(text);
  if (!res.ok) {
    throw new Error(`Upstream ${res.status}: ${JSON.stringify(json).slice(0,140)}…`);
  }
  return json;
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const tickers: string[] = Array.isArray(body?.tickers) ? body.tickers : [];

    if (!tickers.length) {
      return NextResponse.json(
        { success: false, error: "Provide { tickers: string[] } in the POST body" },
        { status: 400 }
      );
    }

    // Build a minimal screener payload that filters by given tickers.
    // (If you have a different schema from Tickertape, update "query" accordingly.)
    const payload = {
      query: {
        // This structure is illustrative; adapt as per Tickertape’s exact screener payload.
        // The key idea is: pass your filters forward; do not hardcode symbols here.
        filters: [{ field: "ticker", operator: "in", value: tickers }],
        // request the fields we need to keep payload small
        columns: [
          "ticker",
          "price",
          "changePercent",
          // add other fields if you’ll need them in future
        ],
        // paging
        limit: tickers.length,
        offset: 0,
      },
    };

    const tt = await fetchJsonSafe("https://api.tickertape.in/screener/query", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    // Expected shape per your sample:
    // { data: { stocks: TTStock[] }, meta: {...} }
    const rows: TTStock[] = tt?.data?.stocks ?? [];

    const data: Ticker[] = rows
      .filter((s) => typeof s.price === "number")
      .map((s) => ({
        symbol: String(s.ticker || "").toUpperCase(),
        price: Number(s.price),
        changePercent:
          typeof s.changePercent === "number" ? s.changePercent : undefined,
        href: `/markets/stocks/${String(s.ticker || "").toLowerCase()}`, // optional
      }));

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: (err as Error).message },
      { status: 502 }
    );
  }
}
