import { NextResponse } from 'next/server';

const TICKERS = [
  { name: 'S&P 500',      symbol: '^GSPC',       yahoo: true },
  { name: 'NASDAQ',       symbol: '^IXIC',       yahoo: true },
  { name: 'Gold',         symbol: 'GC=F',        yahoo: true },
  { name: 'EUR/USD',      symbol: 'EURUSD=X',    yahoo: true },
  { name: 'GBP/CHF',      symbol: 'GBPCHF=X',    yahoo: true },
  { name: 'Bitcoin',      symbol: 'bitcoin',     coingecko: true },
  { name: 'Ethereum',     symbol: 'ethereum',     coingecko: true },
];

async function fetchYahoo(symbol: string) {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1m&range=1d`;
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0' },
    next: { revalidate: 30 },
  });
  if (!res.ok) throw new Error(`Yahoo HTTP ${res.status}`);
  const data = await res.json();
  const meta = data?.chart?.result?.[0]?.meta;
  if (!meta) throw new Error('No meta');
  const price = meta.regularMarketPrice ?? null;
  const prev = meta.chartPreviousClose ?? meta.previousClose ?? null;
  const positive = prev !== null ? price >= prev : true;
  const changePercent =
    price !== null && prev !== null && prev !== 0
      ? ((price - prev) / prev) * 100
      : null;
  return { price, changePercent, positive };
}

async function fetchCoinGecko(symbol: string) {
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${symbol}&vs_currencies=usd&include_24hr_change=true`;
  const res = await fetch(url, { next: { revalidate: 30 } });
  if (!res.ok) throw new Error(`CoinGecko HTTP ${res.status}`);
  const data = await res.json();
  const item = data?.[symbol];
  if (!item) throw new Error('No CoinGecko data');
  return {
    price: item.usd ?? null,
    changePercent: item.usd_24h_change ?? null,
    positive: (item.usd_24h_change ?? 0) >= 0,
  };
}

export async function GET() {
  try {
    const results = await Promise.all(
      TICKERS.map(async (ticker) => {
        try {
          if (ticker.yahoo) {
            const d = await fetchYahoo(ticker.symbol);
            return { name: ticker.name, symbol: ticker.symbol, ...d };
          } else {
            const d = await fetchCoinGecko(ticker.symbol);
            return { name: ticker.name, symbol: ticker.symbol, ...d };
          }
        } catch {
          return { name: ticker.name, symbol: ticker.symbol, price: null, changePercent: null, positive: true };
        }
      })
    );
    return NextResponse.json(results);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch market data' }, { status: 500 });
  }
}
