import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';

// ── In-memory rate limiter ──────────────────────────────────────────────────
const WINDOW_MS = 60 * 1000;
const MAX_REQUESTS = 10;
const ipMap = new Map<string, { count: number; resetAt: number }>();
function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = ipMap.get(ip);
  if (!entry || now > entry.resetAt) { ipMap.set(ip, { count: 1, resetAt: now + WINDOW_MS }); return false; }
  if (entry.count >= MAX_REQUESTS) return true;
  entry.count++;
  return false;
}

export interface CrowdAIResponse {
  level: 'Low' | 'Moderate' | 'High';
  score: number;
  summary: string;
  tip: string;
  bestWindow: string;
  avoidWindow: string;
  alternatives: string;
  source: 'gemini' | 'algorithmic';
}

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    if (isRateLimited(ip)) {
      return NextResponse.json({ error: 'Rate limit exceeded. Please wait a moment.' }, { status: 429 });
    }

    const { destination, month, isWeekend, isFestival, timeOfDay } = await request.json();
    if (!destination) return NextResponse.json({ error: 'Destination required' }, { status: 400 });

    const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    const monthName = monthNames[(month || 1) - 1];

    const prompt = `You are an expert India travel analyst for VIHARA, specializing in crowd prediction and travel planning.

Analyze crowd levels for visiting: ${destination}, India
Visit details:
- Month: ${monthName}
- Day type: ${isWeekend ? 'Weekend/Holiday' : 'Weekday'}
- Festival period: ${isFestival ? 'Yes' : 'No'}
- Time of day: ${timeOfDay}

Provide a JSON response ONLY (no markdown, no extra text):
{
  "level": "Low" | "Moderate" | "High",
  "score": <number 0-100 representing crowd intensity>,
  "summary": "<1 sentence factual crowd assessment for this specific destination and timing>",
  "tip": "<2-3 sentences with specific, actionable advice for visiting ${destination} in ${monthName}>",
  "bestWindow": "<best time window to visit for least crowds, be specific>",
  "avoidWindow": "<times/periods to avoid, be specific>",
  "alternatives": "<1-2 nearby lesser-known alternatives if crowds are High>"
}

Base your prediction on real knowledge of ${destination}'s tourism patterns, seasonal festivals, weather, and typical visitor trends.`;

    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ role: 'user', parts: [{ text: prompt }] }],
              generationConfig: { temperature: 0.4, maxOutputTokens: 512 },
            }),
          }
        );
        const data = await response.json();
        const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
        const jsonMatch = rawText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          return NextResponse.json({ ...parsed, source: 'gemini' } as CrowdAIResponse);
        }
      } catch (err) {
        console.error('Gemini crowd prediction failed, falling back:', err);
      }
    }

    // Algorithmic fallback
    const { predictCrowd, MAJOR_FESTIVALS } = await import('@/lib/crowdPrediction');
    const result = predictCrowd({ destination, month: month || 1, isWeekend: !!isWeekend, isFestival: !!isFestival, timeOfDay: timeOfDay || 'morning' });
    return NextResponse.json({
      level: result.level,
      score: result.score,
      summary: `Based on seasonal patterns, ${destination} is expected to have ${result.level.toLowerCase()} crowds in ${monthName}.`,
      tip: result.tip,
      bestWindow: result.bestWindow,
      avoidWindow: result.avoidWindow,
      alternatives: '',
      source: 'algorithmic',
    } as CrowdAIResponse);

  } catch (error) {
    return NextResponse.json({ error: 'Prediction failed. Please try again.' }, { status: 500 });
  }
}
