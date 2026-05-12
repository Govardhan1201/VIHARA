import { NextResponse } from 'next/server';
import { aiRatelimit } from '@/lib/redis';

export const dynamic = 'force-dynamic';

// ── MOCK STORY TEMPLATES (used when no AI key is available) ──────────────────
const MOCK_STORIES = [
  {
    title: 'Where the Mist Lives Before Dawn',
    mood: 'Golden Hour Memoir',
    caption: 'Found the mist before anyone else could. Some mornings, a destination gives itself to you completely. 🌄 #HiddenIndia #OffbeatTravel #Vihara',
    photoLayout: [
      { index: 0, type: 'landscape', caption: 'The misty valley at golden hour' },
      { index: 1, type: 'portrait', caption: 'A quiet moment with locals' },
      { index: 2, type: 'landscape', caption: 'The ridgeline at dawn' },
    ],
    sections: [
      {
        heading: 'Arrival',
        body: `There is a quality of light that exists only between 5 and 7 in the morning, in places that haven't yet learned to perform for visitors. We found it here — in the way the valley breathed, slow and unhurried, the fog draped across the ridgeline like something left behind by the night.`,
        photoIndices: [0],
      },
      {
        heading: 'The Road Up',
        body: `The road wound upward through villages where smoke still rose from morning fires. Children looked up without the practiced indifference of tourist towns. A dog followed us for exactly three minutes, then turned back — satisfied that we were heading somewhere real.`,
        photoIndices: [1],
      },
      {
        heading: 'The Viewpoint',
        body: `By the time we reached the viewpoint, there was no one else. Just the layered blues of the hills, the sound of unseen water, and a silence that felt earned. Some places ask you to work for them. This one gave generously once you showed up. We stayed longer than planned. We always do.`,
        photoIndices: [2],
      },
    ],
  },
  {
    title: 'Salt, Spice, and the Open Sea',
    mood: 'Coastal Reverie',
    caption: 'Ate the catch of the day before it had a name on a menu. Coastal India, unhurried and completely real. 🦐 #CoastalIndia #LocalFood #Vihara',
    photoLayout: [
      { index: 0, type: 'landscape', caption: 'The fishing harbour at dawn' },
      { index: 1, type: 'food', caption: 'The catch of the day' },
    ],
    sections: [
      {
        heading: 'The Morning Market',
        body: `The coast has a logic of its own. Morning is for the fish markets, the boats returning, the smell of brine and diesel and something alive. By afternoon, the light goes horizontal and everything slows — the vendors, the waves, even the dogs sleeping in patches of warm sand.`,
        photoIndices: [0],
      },
      {
        heading: 'The Meal',
        body: `We had no itinerary on this stretch. Just a direction and an appetite. The seafood at the small shack near the fishing harbour arrived without a menu — whatever had come in that morning, cooked the way people here had always cooked it. No fusion. No plating. Just prawn and fire and the sea wind.`,
        photoIndices: [1],
      },
      {
        heading: 'Untranslated India',
        body: `There is a version of India that lives right here, untranslated and unperformed. You can visit it if you come without expectations, without influencer tags and "must-do" lists. You have to just walk past the tourist stretch and keep going. We kept going. And the coast gave us everything.`,
        photoIndices: [],
      },
    ],
  },
];

export async function POST(request: Request) {
  try {
    // ── RATE LIMITING ─────────────────────────────────────────────────────────
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    if (aiRatelimit) {
      const { success, limit, remaining, reset } = await aiRatelimit.limit(`story_${ip}`);
      if (!success) {
        return NextResponse.json(
          { error: `Rate limit exceeded. Please wait ${Math.ceil((reset - Date.now()) / 1000)} seconds.` },
          { status: 429, headers: { 'X-RateLimit-Limit': limit.toString(), 'X-RateLimit-Remaining': remaining.toString() } }
        );
      }
    }

    const formData = await request.formData();
    const images = formData.getAll('images') as File[];
    const destination = formData.get('destination') as string || 'a hidden destination in India';
    const mood = formData.get('mood') as string || '';

    if (!images || images.length === 0) {
      return NextResponse.json({ error: 'Please upload at least one travel photo.' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    // ── GEMINI VISION INTEGRATION ────────────────────────────────────────────
    if (apiKey) {
      try {
        const imageParts = await Promise.all(
          images.slice(0, 6).map(async (file) => {
            const bytes = await file.arrayBuffer();
            const base64 = Buffer.from(bytes).toString('base64');
            return { inlineData: { mimeType: file.type || 'image/jpeg', data: base64 } };
          })
        );

        const prompt = `You are a cinematic travel writer and photo editor for Vihara, an offbeat travel discovery platform rooted in India's hidden gems.

The traveler has uploaded ${images.length} travel photo(s) from: "${destination}".
${mood ? `Story mood requested: ${mood}` : 'Auto-detect the best mood from the photos.'}

Your job has TWO parts:

PART 1 — Classify each photo by index (0 to ${images.length - 1}):
For each photo, determine its primary type: "landscape" (mountains, valleys, sky, nature scenery), "portrait" (people, faces, human subjects), "food" (meals, market produce, drinks), "architecture" (buildings, temples, bridges, ruins), "activity" (travel in motion, adventures, events), or "other".
Give each a short evocative 5-8 word caption.

PART 2 — Write a structured travel journal with 3-4 sections:
Each section must have:
- A short heading (2-4 words, poetic not generic)
- A rich paragraph (4-6 sentences, cinematic, sensory, culturally specific to India)
- Which photo indices (0-based) to display with that section — place landscape/architecture photos with descriptive sections, portrait photos with people-focused sections, food with food moments. Spread the photos across sections, don't cluster them all in one.

Return ONLY a valid JSON object with this EXACT shape:
{
  "title": "A poetic, specific title for the journal (not generic)",
  "mood": "One of: Golden Hour Memoir / Monsoon Wanderer / Hidden Valley Chronicle / Tribal Heartland Diary / Coastal Reverie / Mountain Silence Log / Desert Wanderer / City Pulse Diaries",
  "caption": "A short social media caption — 2 punchy lines + 3-4 hashtags ending in #Vihara. Keep under 200 chars total.",
  "photoLayout": [
    { "index": 0, "type": "landscape|portrait|food|architecture|activity|other", "caption": "short evocative caption" }
  ],
  "sections": [
    {
      "heading": "Section Heading",
      "body": "Full paragraph text. Be specific, sensory, soulful. Avoid clichés.",
      "photoIndices": [0]
    }
  ]
}`;

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ role: 'user', parts: [...imageParts, { text: prompt }] }],
              generationConfig: { temperature: 0.85, maxOutputTokens: 2048 },
            }),
          }
        );

        const data = await response.json();

        if (data.error) {
          console.error('Gemini API error:', JSON.stringify(data.error));
          throw new Error(`Gemini: ${data.error.message}`);
        }

        const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
        // Extract JSON — handle possible markdown code fences
        const jsonMatch = rawText.match(/```json\s*([\s\S]*?)```/) || rawText.match(/(\{[\s\S]*\})/);
        const jsonStr = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : '';

        if (jsonStr) {
          const parsed = JSON.parse(jsonStr.trim());
          // Validate required fields
          if (parsed.title && parsed.sections && Array.isArray(parsed.sections)) {
            return NextResponse.json({ story: parsed });
          }
        }
        console.error('Gemini returned unparseable response:', rawText.slice(0, 500));
      } catch (aiErr) {
        console.error('Gemini story generation failed, using mock:', aiErr);
      }
    }

    // ── MOCK FALLBACK ────────────────────────────────────────────────────────
    const template = MOCK_STORIES[images.length % MOCK_STORIES.length];
    const story = {
      ...template,
      title: destination !== 'a hidden destination in India'
        ? `${template.title} — ${destination}`
        : template.title,
      mood: mood || template.mood,
      // Clamp photoLayout to actual number of uploaded images
      photoLayout: template.photoLayout.filter(p => p.index < images.length),
      sections: template.sections.map(s => ({
        ...s,
        photoIndices: s.photoIndices.filter(i => i < images.length),
      })),
    };

    await new Promise(r => setTimeout(r, 1500));
    return NextResponse.json({ story });
  } catch (error) {
    console.error('Story route error:', error);
    return NextResponse.json({ error: 'Story generation failed. Please try again.' }, { status: 500 });
  }
}
