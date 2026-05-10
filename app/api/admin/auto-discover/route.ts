import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
export const dynamic = 'force-dynamic';

function isAdmin(request: Request): boolean {
  const token = request.headers.get('x-admin-token');
  return token === process.env.ADMIN_PASSWORD;
}

export async function POST(request: Request) {
  if (!isAdmin(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { state, subZone, count = 3 } = await request.json();

    if (!state || !subZone) {
      return NextResponse.json({ error: 'State and subZone are required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Gemini API key is not configured' }, { status: 500 });
    }

    const prompt = `You are an expert Indian travel curator specializing in offbeat and hidden gems.
The admin has requested you to auto-discover ${count} hidden gem destinations in the state of "${state}", specifically in or around the sub-zone/region of "${subZone}".

REQUIREMENTS:
1. They MUST be real places.
2. They MUST be somewhat offbeat (not the #1 most touristy spot).
3. Provide a short description, activity type (adventure, cultural, nature, or photography), duration (short or medium), estimated budget per day in INR, transport mode, and an emoji.

RETURN STRICTLY A JSON ARRAY. Do not wrap it in markdown. Do not add explanations.
Example format:
[
  {
    "placeName": "Name of Place",
    "description": "Short poetic 1-2 sentence description.",
    "activity": "nature",
    "duration": "short",
    "budget": 1500,
    "transport": "Local Bus / Taxi",
    "accommodation": "budget",
    "emoji": "🌴",
    "mapLink": "https://maps.google.com/...",
    "imageLink": "https://images.unsplash.com/..."
  }
]`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 2048 },
        }),
      }
    );

    const data = await response.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    // Extract JSON array
    const jsonMatch = rawText.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      return NextResponse.json({ error: 'Failed to parse AI response' }, { status: 500 });
    }

    const places = JSON.parse(jsonMatch[0]);
    const created = [];

    // Inject them into the database as approved
    for (const p of places) {
      const submission = await prisma.submission.create({
        data: {
          placeName: p.placeName,
          state: state,
          subZone: subZone,
          description: p.description,
          activity: p.activity,
          duration: p.duration,
          budget: p.budget,
          transport: p.transport,
          accommodation: p.accommodation || 'budget',
          emoji: p.emoji || '✨',
          mapLink: p.mapLink || '',
          imageLink: p.imageLink || '',
          videoLink: p.videoLink || '',
          submitterName: 'Gemini Auto-Discovery',
          submitterEmail: 'ai@vihara.com',
          status: 'APPROVED'
        }
      });
      created.push(submission);
    }

    return NextResponse.json({ success: true, added: created.length, places: created });

  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: 'Auto-discovery failed: ' + error.message }, { status: 500 });
  }
}
