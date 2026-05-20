import { NextResponse } from 'next/server';

const TICKERS = ['NVDA', 'AAPL', 'TSLA', 'BX', 'MSFT', 'BND', 'GLD'];

interface Quote {
  ticker: string;
  price: number | null;
  change: number | null; // 1-day %
}

interface YahooQuote {
  symbol: string;
  price: number | null;
  changePercent: number | null;
}

async function fetchYahoo(ticker: string): Promise<YahooQuote> {
  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?interval=1d&range=2d`;
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      next: { revalidate: 0 },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    const result = json?.chart?.result?.[0];
    if (!result) throw new Error('No result');
    const meta = result.meta;
    const price = meta?.regularMarketPrice ?? null;
    const prevClose = meta?.previousClose ?? null;
    const changePercent =
      price !== null && prevClose !== null && prevClose !== 0
        ? ((price - prevClose) / prevClose) * 100
        : null;
    return { symbol: ticker, price, changePercent };
  } catch {
    return { symbol: ticker, price: null, changePercent: null };
  }
}

export async function GET() {
  const results = await Promise.all(TICKERS.map(fetchYahoo));
  const quotes: Record<string, Quote> = {};
  for (const q of results) {
    quotes[q.symbol] = {
      ticker: q.symbol,
      price: q.price,
      change: q.changePercent,
    };
  }
  return NextResponse.json(quotes);
}