import { NextResponse } from 'next/server';
import { redis } from '@/lib/redis';
export const dynamic = 'force-dynamic';

const CACHE_TTL = 30 * 60; // 30 minutes

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get('city');
    if (!city) return NextResponse.json({ error: 'City required' }, { status: 400 });

    const cacheKey = `weather:${city.toLowerCase()}`;
    if (redis) {
      const cached = await redis.get<any>(cacheKey);
      if (cached) return NextResponse.json({ ...cached, source: 'cache' });
    }

    const apiKey = process.env.OPENWEATHER_API_KEY;
    if (!apiKey) return NextResponse.json({ error: 'No weather API key' }, { status: 500 });

    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)},IN&appid=${apiKey}&units=metric`
    );
    if (!res.ok) throw new Error(`OpenWeatherMap ${res.status}`);

    const data = await res.json();
    const weather = {
      temp: Math.round(data.main.temp),
      feels: Math.round(data.main.feels_like),
      condition: data.weather[0].main,
      description: data.weather[0].description,
      humidity: data.main.humidity,
      icon: data.weather[0].icon,
      city: data.name,
    };

    if (redis) {
      await redis.setex(cacheKey, CACHE_TTL, weather);
    }
    return NextResponse.json({ ...weather, source: 'live' });
  } catch (err) {
    return NextResponse.json({ error: 'Weather unavailable' }, { status: 500 });
  }
}
