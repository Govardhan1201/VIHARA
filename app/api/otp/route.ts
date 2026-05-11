import { NextResponse } from 'next/server';
import { redis, otpRatelimit } from '@/lib/redis';
import { sendOTP } from '@/lib/email';
export const dynamic = 'force-dynamic';

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// POST /api/otp — send OTP
export async function POST(request: Request) {
  try {
    const { email, name } = await request.json();
    if (!email || !name) return NextResponse.json({ error: 'Email and name required' }, { status: 400 });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });

    // Rate limit: 3 OTPs per email per hour
    if (otpRatelimit) {
      const { success } = await otpRatelimit.limit(email.toLowerCase());
      if (!success) return NextResponse.json({ error: 'Too many OTP requests. Please wait an hour.' }, { status: 429 });
    }

    const otp = generateOTP();
    // Store OTP in Redis with 10-minute TTL
    if (redis) {
      await redis.setex(`otp:${email.toLowerCase()}`, 600, otp);
    }

    await sendOTP(email, name, otp);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('OTP send error:', err);
    return NextResponse.json({ error: 'Failed to send OTP. Please try again.' }, { status: 500 });
  }
}

// PUT /api/otp — verify OTP
export async function PUT(request: Request) {
  try {
    const { email, otp } = await request.json();
    if (!email || !otp) return NextResponse.json({ error: 'Email and OTP required' }, { status: 400 });

    if (!redis) {
      // If redis is down, we can't verify. For demo/fallback we might allow or block.
      // Blocking is safer for security, but for Vihara we might want a demo mode?
      // Let's return error.
      return NextResponse.json({ error: 'Authentication service temporarily unavailable.' }, { status: 503 });
    }

    const stored = await redis.get<string>(`otp:${email.toLowerCase()}`);
    if (!stored) return NextResponse.json({ error: 'OTP expired or not found. Please request a new one.' }, { status: 400 });
    if (stored !== otp.toString()) return NextResponse.json({ error: 'Incorrect OTP. Please try again.' }, { status: 400 });

    // Delete OTP after use
    if (redis) {
      await redis.del(`otp:${email.toLowerCase()}`);
    }

    // Issue a short-lived verified token (30 minutes)
    const token = `vt_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    if (redis) {
      await redis.setex(`verified:${email.toLowerCase()}`, 1800, token);
    }

    return NextResponse.json({ success: true, token });
  } catch (err) {
    return NextResponse.json({ error: 'Verification failed.' }, { status: 500 });
  }
}
