import { NextResponse } from 'next/server';
import { destinations } from '@/lib/destinations';
import { aiRatelimit } from '@/lib/redis';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    const { success } = await aiRatelimit.limit(ip);
    if (!success) return NextResponse.json({ error: 'Rate limit exceeded. Please wait.' }, { status: 429 });

    const { state, days, style, budget } = await request.json();
    if (!state || !days) return NextResponse.json({ error: 'State and days required' }, { status: 400 });

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return NextResponse.json({ error: 'AI not configured' }, { status: 500 });

    // Get destinations for the selected state
    const stateDests = destinations.filter(d => d.state === state || d.state.toLowerCase().includes(state.toLowerCase()));
    const destContext = stateDests.length > 0
      ? stateDests.map(d => `- ${d.name} (${d.subZone}): ${d.desc}. Activity: ${d.activity}, Budget: ₹${d.budget}, Transport: ${d.transport}`).join('\n')
      : `No specific destinations in database for ${state}. Use your knowledge of ${state}'s famous hidden gems.`;

    const prompt = `You are a premium India travel planner for VIHARA, specializing in offbeat hidden gem destinations.

Create a ${days}-day travel itinerary for ${state}, India.
Travel style: ${style || 'balanced'}
Budget per person: ₹${budget || '5000'} per day

Available destinations from VIHARA database:
${destContext}

Return ONLY a valid JSON object (no markdown):
{
  "title": "A poetic trip title",
  "tagline": "One evocative sentence about this journey",
  "days": [
    {
      "day": 1,
      "title": "Day 1 title",
      "theme": "e.g. Arrival & First Impressions",
      "destinations": ["Place Name 1", "Place Name 2"],
      "activities": ["Activity 1", "Activity 2", "Activity 3"],
      "food": "Local food recommendation for this day",
      "stay": "Accommodation suggestion",
      "tip": "One insider tip for this day",
      "budget": "Approx spend for the day"
    }
  ],
  "totalBudget": "Total estimated budget",
  "bestTime": "Best months to do this trip",
  "packingTips": ["tip1", "tip2", "tip3"]
}`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.8, maxOutputTokens: 2048 },
        }),
      }
    );

    const data = await response.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return NextResponse.json({ error: 'AI failed to generate itinerary' }, { status: 500 });

    const itinerary = JSON.parse(jsonMatch[0]);
    return NextResponse.json({ itinerary });
  } catch (err) {
    console.error('Itinerary error:', err);
    return NextResponse.json({ error: 'Failed to generate itinerary' }, { status: 500 });
  }
}
