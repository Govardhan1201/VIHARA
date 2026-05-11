import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';

const url = process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN;

export const redis = url && token ? new Redis({ url, token }) : null;

// 15 requests per minute for AI routes
export const aiRatelimit = redis ? new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(15, '1 m'),
  prefix: 'vihara:ai',
}) : null;

// 10 requests per minute for crowd predictions
export const crowdRatelimit = redis ? new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '1 m'),
  prefix: 'vihara:crowd',
}) : null;

// 3 OTP requests per hour per email
export const otpRatelimit = redis ? new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, '1 h'),
  prefix: 'vihara:otp',
}) : null;
