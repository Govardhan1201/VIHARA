import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';

// ── In-memory rate limiter (resets on server restart) ──────────────────────
const WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS = 15;     // per IP per minute
const ipMap = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = ipMap.get(ip);
  if (!entry || now > entry.resetAt) {
    ipMap.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  if (entry.count >= MAX_REQUESTS) return true;
  entry.count++;
  return false;
}

import { destinations } from '@/lib/destinations';

export async function POST(request: Request) {
  try {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
              || request.headers.get('x-real-ip')
              || 'unknown';
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { reply: "You're sending too many requests. Please wait a moment before trying again." },
        { status: 429 }
      );
    }

    const { prompt } = await request.json();
    if (!prompt) return NextResponse.json({ error: 'No prompt provided' }, { status: 400 });

    // Sanitize prompt — limit length to prevent abuse
    const sanitized = String(prompt).slice(0, 500);

    const destSummary = destinations.map(d =>
      `${d.name} (${d.state}, ${d.subZone}) - ${d.activity}, ${d.duration} trip, Budget: ₹${d.budget}, Transport: ${d.transport}. ${d.desc}`
    ).join('\n');

    const systemPrompt = `You are VIHARA AI, an expert travel assistant specializing in offbeat, hidden gem destinations across India. You help travelers discover authentic, budget-smart experiences.

Here are the available destinations in our database:
${destSummary}

Guidelines:
- Give concise, helpful answers (2-4 paragraphs max)
- Recommend specific destinations from the database when relevant
- Include budget estimates, transport options, and best seasons when possible
- Be enthusiastic about off-beat travel and hidden gems
- Use simple, friendly language with occasional emojis
- NEVER discuss anything unrelated to India travel`;

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      const lower = sanitized.toLowerCase();
      const matched = destinations.filter(d =>
        lower.includes(d.state.toLowerCase()) ||
        lower.includes(d.activity.toLowerCase()) ||
        lower.includes(d.subZone.toLowerCase()) ||
        d.name.toLowerCase().split(' ').some(w => lower.includes(w))
      ).slice(0, 3);

      if (matched.length > 0) {
        const reply = `Based on your interest, here are some great picks: ${matched.map(d => `**${d.name}** (${d.state}) — ${d.desc}, Budget: ₹${d.budget}`).join('; ')}. Want more details about any of these?`;
        return NextResponse.json({ reply });
      }
      return NextResponse.json({ reply: "I can help you discover India's hidden gems! Try asking about specific states like Goa, Rajasthan, Andhra Pradesh, or Telangana, or tell me your budget and what kind of experience you're looking for — nature, adventure, or cultural." });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            { role: 'user', parts: [{ text: systemPrompt + '\n\nUser question: ' + sanitized }] }
          ],
          generationConfig: { temperature: 0.7, maxOutputTokens: 512 },
          safetySettings: [
            { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
            { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
          ]
        })
      }
    );

    const data = await response.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I could not generate a response. Please try again!';
    return NextResponse.json({ reply });
  } catch (error) {
    return NextResponse.json({ reply: 'I\'m having trouble connecting right now. Please try again in a moment!' });
  }
}
