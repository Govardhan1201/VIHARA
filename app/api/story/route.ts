import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';

// ── MOCK STORY TEMPLATES (used when no AI key is available) ──────────────────
const MOODS = ['Golden Hour Memoir', 'Monsoon Wanderer', 'Hidden Valley Chronicle', 'Offbeat Soul Journey', 'Tribal Heartland Diary', 'Coastal Reverie', 'Mountain Silence Log'];

const MOCK_STORIES = [
  {
    title: 'Where the Mist Lives Before Dawn',
    mood: 'Golden Hour Memoir',
    story: `There is a quality of light that exists only between 5 and 7 in the morning, in places that haven't yet learned to perform for visitors. We found it here — in the way the valley breathed, slow and unhurried, the fog draped across the ridgeline like something left behind by the night.

The road wound upward through villages where smoke still rose from morning fires. Children looked up without the practiced indifference of tourist towns. A dog followed us for exactly three minutes, then turned back — satisfied that we were heading somewhere real.

By the time we reached the viewpoint, there was no one else. Just the layered blues of the hills, the sound of unseen water, and a silence that felt earned. Some places ask you to work for them. This one gave generously once you showed up.

We stayed longer than planned. We always do.`,
    caption: 'Found the mist before anyone else could. Some mornings, a destination gives itself to you completely — this was one of them. 🌄 #HiddenIndia #OffbeatTravel #Vihara',
  },
  {
    title: 'The Colour of a Place You\'ve Never Seen',
    mood: 'Tribal Heartland Diary',
    story: `You don't always know what you're looking for until you find it. We had maps, vague coordinates, a guesthouse booking three towns away — but no expectation of this particular afternoon light, or this particular silence, or the way the bamboo grove caught a breeze that smelled faintly of something cooking far away.

Tribal regions carry a different kind of weight. It isn't sadness — it's depth. Generations lived here, found beauty here, named the hills and the seasons in ways that never made it onto tourist itineraries. We walked slowly. Asked little. Watched more.

A woman drying rice on a cloth outside her doorway looked up and nodded — not the performance of a greeting, but the acknowledgment of one traveler to another. We were all passing through something.

The photographs from that afternoon don't quite look like any other photographs we've taken. Maybe because they weren't taken. They were simply found.`,
    caption: 'Some destinations don\'t show themselves in a single visit. They reveal themselves in quiet moments you almost miss. 🎋 #TribalIndia #SlowTravel #Vihara',
  },
  {
    title: 'Salt, Spice, and the Open Sea',
    mood: 'Coastal Reverie',
    story: `The coast has a logic of its own. Morning is for the fish markets, the boats returning, the smell of brine and diesel and something alive. By afternoon, the light goes horizontal and everything slows — the vendors, the waves, even the dogs sleeping in patches of warm sand.

We had no itinerary on this stretch. Just a direction and an appetite. The seafood at the small shack near the fishing harbour arrived without a menu — whatever had come in that morning, cooked the way people here had always cooked it. No fusion. No plating. Just prawn and fire and the sea wind.

There is a version of India that lives right here, untranslated and unperformed. You can visit it if you come without expectations, without influencer tags and "must-do" lists. You have to just walk past the tourist stretch and keep going.

We kept going. And the coast gave us everything.`,
    caption: 'Ate the catch of the day before it had a name on a menu. Coastal India, unhurried and completely real. 🦐 #CoastalIndia #LocalFood #HiddenGems',
  },
];

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const images = formData.getAll('images') as File[];
    const destination = formData.get('destination') as string || 'Unknown Place';
    const mood = formData.get('mood') as string || '';

    if (!images || images.length === 0) {
      return NextResponse.json({ error: 'Please upload at least one travel photo.' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    // ── GEMINI VISION INTEGRATION ────────────────────────────────────────────
    if (apiKey) {
      try {
        // Convert first image to base64 (Gemini supports up to 16 inline images)
        const imageParts = await Promise.all(
          images.slice(0, 4).map(async (file) => {
            const bytes = await file.arrayBuffer();
            const base64 = Buffer.from(bytes).toString('base64');
            return { inlineData: { mimeType: file.type || 'image/jpeg', data: base64 } };
          })
        );

        const prompt = `You are a cinematic travel writer for Vihara, an offbeat travel discovery platform rooted in India's hidden gems, local culture, and authentic experiences.

The traveler has uploaded ${images.length} travel photo(s) from ${destination || 'a hidden destination in India'}.
${mood ? `The mood/theme they want: ${mood}` : ''}

Generate a beautiful, emotionally rich travel journal entry. Avoid generic AI-copy tone. Write like a travel memoirist — specific, sensory, culturally aware.

Return ONLY a valid JSON object in this exact format:
{
  "title": "A poetic, specific title (not generic)",
  "mood": "One of: Golden Hour Memoir / Monsoon Wanderer / Hidden Valley Chronicle / Tribal Heartland Diary / Coastal Reverie / Mountain Silence Log / Desert Wanderer",
  "story": "3-4 paragraphs of cinematic travel writing. Be specific. Be soulful. Avoid clichés. Make it feel earned, not performed.",
  "caption": "A short, shareable social caption (2-3 lines max, with 2-3 relevant hashtags ending in #Vihara)"
}`;

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ role: 'user', parts: [...imageParts, { text: prompt }] }],
              generationConfig: { temperature: 0.85, maxOutputTokens: 1024 },
            }),
          }
        );

        const data = await response.json();
        const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
        const jsonMatch = rawText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          return NextResponse.json({ story: parsed });
        }
      } catch (aiErr) {
        console.error('Gemini story generation failed, using mock:', aiErr);
      }
    }

    // ── MOCK FALLBACK ────────────────────────────────────────────────────────
    // Deterministic based on image count so repeated calls vary
    const template = MOCK_STORIES[images.length % MOCK_STORIES.length];
    // Inject destination name if provided
    const story = {
      ...template,
      story: destination && destination !== 'Unknown Place'
        ? template.story.replace(/this particular afternoon/g, `this particular afternoon in ${destination}`)
        : template.story,
      mood: mood || template.mood,
    };

    // Simulate realistic generation delay
    await new Promise(r => setTimeout(r, 1500));
    return NextResponse.json({ story });
  } catch (error) {
    return NextResponse.json({ error: 'Story generation failed. Please try again.' }, { status: 500 });
  }
}
