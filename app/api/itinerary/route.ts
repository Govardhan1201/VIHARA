import { NextResponse } from 'next/server';
import { destinations } from '@/lib/destinations';
import { aiRatelimit } from '@/lib/redis';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    if (aiRatelimit) {
      const { success } = await aiRatelimit.limit(ip);
      if (!success) return NextResponse.json({ error: 'Rate limit exceeded. Please wait.' }, { status: 429 });
    }

    const { state, days, style, budget } = await request.json();
    if (!state || !days) return NextResponse.json({ error: 'State and days required' }, { status: 400 });

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      // Mock Fallback using local data
      const stateDests = destinations.filter(d => d.state === state || d.state.toLowerCase().includes(state.toLowerCase()));
      const selectedDests = stateDests.length > 0 ? stateDests.slice(0, Math.min(stateDests.length, days)) : [];
      
      const mockItinerary = {
        title: `A Soulful Journey through ${state}`,
        tagline: "Discovering the untouched heart of the region.",
        days: Array.from({ length: parseInt(days) }).map((_, i) => ({
          day: i + 1,
          title: `Exploring ${selectedDests[i]?.subZone || 'the Local Hidden Gems'}`,
          theme: i === 0 ? "Arrival & Settling In" : "Local Discovery",
          destinations: selectedDests[i] ? [selectedDests[i].name] : ["Local Village", "Hidden Viewpoint"],
          activities: ["Photography", "Nature Walk", "Local Interaction"],
          food: "Traditional local cuisine at a village home",
          stay: "Eco-friendly boutique homestay",
          tip: "Carry cash as many offbeat spots don't have ATMs",
          budget: `₹${budget || '3000'}`
        })),
        totalBudget: `₹${(parseInt(budget || '3000') * parseInt(days)).toLocaleString()}`,
        bestTime: "September to March",
        packingTips: ["Comfortable walking shoes", "Reusable water bottle", "Power bank"]
      };

      await new Promise(r => setTimeout(r, 1000)); // Simulate delay
      return NextResponse.json({ itinerary: mockItinerary, source: 'fallback' });
    }

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

    if (data.error) {
      console.error('Gemini API error in /itinerary:', JSON.stringify(data.error));
      return NextResponse.json({ error: `AI error: ${data.error.message}` }, { status: 500 });
    }

    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    console.log('Gemini itinerary raw response (first 300 chars):', rawText.slice(0, 300));

    const jsonMatch = rawText.match(/```json\s*([\s\S]*?)```/) || rawText.match(/(\{[\s\S]*\})/);
    const jsonStr = jsonMatch ? (jsonMatch[1] || jsonMatch[0]).trim() : '';
    if (!jsonStr) {
      console.error('No JSON found in Gemini itinerary response:', rawText.slice(0, 500));
      return NextResponse.json({ error: 'AI failed to generate itinerary. Please try again.' }, { status: 500 });
    }

    const itinerary = JSON.parse(jsonStr);
    return NextResponse.json({ itinerary });
  } catch (err) {
    console.error('Itinerary error:', err);
    return NextResponse.json({ error: 'Failed to generate itinerary' }, { status: 500 });
  }
}
