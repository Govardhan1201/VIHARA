import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';

// Server-side cache — avoids hammering the free API
let cachedRates: Record<string, number> | null = null;
let cacheTime = 0;
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

// Fallback rates (updated May 2025) — used when API key is absent or request fails
const FALLBACK_RATES: Record<string, number> = {
  USD: 0.01196,
  EUR: 0.01106,
  GBP: 0.00948,
  JPY: 1.8045,
  AED: 0.04393,
  SGD: 0.01606,
  AUD: 0.01874,
  CAD: 0.01659,
  CHF: 0.01061,
  CNY: 0.08674,
};

export async function GET() {
  try {
    const now = Date.now();

    // Return cached rates if still fresh
    if (cachedRates && now - cacheTime < CACHE_TTL) {
      return NextResponse.json({ rates: cachedRates, source: 'cache', updatedAt: new Date(cacheTime).toISOString() });
    }

    const apiKey = process.env.EXCHANGE_RATE_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ rates: FALLBACK_RATES, source: 'fallback', note: 'Add EXCHANGE_RATE_API_KEY to .env for live rates' });
    }

    // ExchangeRate-API: free plan gives 1,500 req/month — with 1hr cache we use max ~720/month
    const response = await fetch(
      `https://v6.exchangerate-api.com/v6/${apiKey}/latest/INR`,
      { next: { revalidate: 3600 } }
    );

    if (!response.ok) throw new Error(`ExchangeRate-API responded ${response.status}`);

    const data = await response.json();
    if (data.result !== 'success') throw new Error('API returned error: ' + data['error-type']);

    // Store only the currencies we care about
    const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'AED', 'SGD', 'AUD', 'CAD', 'CHF', 'CNY'];
    cachedRates = Object.fromEntries(
      currencies.map(c => [c, data.conversion_rates[c] ?? FALLBACK_RATES[c]])
    );
    cacheTime = now;

    return NextResponse.json({
      rates: cachedRates,
      source: 'live',
      updatedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error('Exchange rate fetch failed:', err);
    return NextResponse.json({
      rates: FALLBACK_RATES,
      source: 'fallback',
      note: 'Live fetch failed, showing approximate rates',
    });
  }
}
