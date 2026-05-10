export type CrowdLevel = 'Low' | 'Moderate' | 'High';

export interface CrowdPrediction {
  level: CrowdLevel;
  score: number; // 0-100
  tip: string;
  bestWindow: string;
  avoidWindow: string;
  confidence: 'Estimated' | 'High Confidence' | 'Indicative';
}

export interface CrowdInput {
  destination: string;
  month: number; // 1-12
  isWeekend: boolean;
  isFestival: boolean;
  timeOfDay: 'early-morning' | 'morning' | 'afternoon' | 'evening';
}

// Destinations categorised by type for seasonal logic
const HILL_DESTINATIONS = ['Araku', 'Munnar', 'Ooty', 'Coorg', 'Hampi'];
const COASTAL_DESTINATIONS = ['Vizag', 'Goa', 'Andaman'];
const DESERT_DESTINATIONS = ['Rajasthan', 'Ladakh'];
const CULTURAL_DESTINATIONS = ['Hampi', 'Rajasthan', 'Varanasi'];

const getDestinationType = (dest: string): string => {
  if (HILL_DESTINATIONS.includes(dest)) return 'hill';
  if (COASTAL_DESTINATIONS.includes(dest)) return 'coastal';
  if (DESERT_DESTINATIONS.includes(dest)) return 'desert';
  if (CULTURAL_DESTINATIONS.includes(dest)) return 'cultural';
  return 'general';
};

// Peak season months by destination type
const PEAK_MONTHS: Record<string, number[]> = {
  hill: [3, 4, 5, 10, 11, 12], // Spring + post-monsoon
  coastal: [11, 12, 1, 2, 3],  // Winter season
  desert: [10, 11, 12, 1, 2],  // Cooler months
  cultural: [10, 11, 12, 1, 2, 3],
  general: [11, 12, 1, 2],
};

export function predictCrowd(input: CrowdInput): CrowdPrediction {
  const { destination, month, isWeekend, isFestival, timeOfDay } = input;
  const destType = getDestinationType(destination);
  const peakMonths = PEAK_MONTHS[destType] || PEAK_MONTHS.general;

  let score = 30; // baseline

  // Seasonal factor
  if (peakMonths.includes(month)) score += 30;
  else if (month >= 6 && month <= 9) score -= 10; // Monsoon = fewer crowds

  // Weekend factor
  if (isWeekend) score += 20;
  else score -= 5;

  // Festival factor
  if (isFestival) score += 25;

  // Time of day factor
  if (timeOfDay === 'early-morning') score -= 20;
  else if (timeOfDay === 'morning') score += 5;
  else if (timeOfDay === 'afternoon') score += 15;
  else if (timeOfDay === 'evening') score += 10;

  score = Math.max(5, Math.min(95, score));

  const level: CrowdLevel = score < 35 ? 'Low' : score < 65 ? 'Moderate' : 'High';

  const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const currentMonth = monthNames[month - 1];

  const tips: Record<CrowdLevel, { tip: string; best: string; avoid: string }> = {
    Low: {
      tip: `${currentMonth} is a quieter window for ${destination}. You'll likely have the place mostly to yourself — a rare and rewarding experience.`,
      best: 'Any time of day; early mornings are especially magical with minimal company.',
      avoid: 'Long weekends can still see small surges — plan mid-week if possible.',
    },
    Moderate: {
      tip: `Expect a moderate number of fellow travelers at ${destination} during this period. Manageable, but plan your timings thoughtfully.`,
      best: 'Early morning (before 8am) or weekday afternoons for a calmer visit.',
      avoid: 'Weekend afternoons and any local holiday periods tend to spike footfall.',
    },
    High: {
      tip: `${destination} is likely to be crowded during this period. Consider visiting during off-peak hours or shifting your dates slightly for a more personal experience.`,
      best: 'Dawn or golden hour visits (5–7am) to beat the rush.',
      avoid: `${isWeekend ? 'Weekends in general — try planning a mid-week trip instead.' : 'Midday to evening hours see the highest footfall.'}`,
    },
  };

  return {
    level,
    score,
    tip: tips[level].tip,
    bestWindow: tips[level].best,
    avoidWindow: tips[level].avoid,
    confidence: isFestival ? 'High Confidence' : isWeekend ? 'Estimated' : 'Indicative',
  };
}

export const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];

export const MAJOR_FESTIVALS: Record<number, string[]> = {
  1: ['Makar Sankranti', 'Pongal', 'Republic Day'],
  2: ['Holi (some years)', 'Valentine week'],
  3: ['Holi (most years)', 'Ugadi'],
  4: ['Ram Navami', 'Easter'],
  5: [],
  6: [],
  7: [],
  8: ['Independence Day', 'Onam'],
  9: ['Onam', 'Ganesh Chaturthi', 'Navratri (starts)'],
  10: ['Navratri', 'Dussehra', 'Gandhi Jayanti'],
  11: ['Diwali', 'Chhath Puja'],
  12: ['Christmas', 'New Year Eve'],
};
