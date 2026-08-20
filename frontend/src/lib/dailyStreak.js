// Day-based streak: one completed test per local calendar day keeps it alive.
// The streak is always recomputed from `activityDates` so it self-heals if a
// save was missed or the clock/timezone changes.

export const DAILY_BADGES = [
  { days: 3, id: 'daily-3' },
  { days: 7, id: 'daily-7' },
  { days: 14, id: 'daily-14' },
  { days: 30, id: 'daily-30' },
];

const KEEP_DAYS = 90;

function pad(n) {
  return String(n).padStart(2, '0');
}

export function toLocalDateString(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function todayLocal() {
  return toLocalDateString(new Date());
}

export function shiftDay(dateStr, delta) {
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d + delta);
  return toLocalDateString(date);
}

function normalizeDate(value) {
  if (!value) return null;
  return String(value).slice(0, 10);
}

export function computeStreak(activityDates, today = todayLocal()) {
  const set = new Set((activityDates || []).map(normalizeDate).filter(Boolean));
  let cursor = set.has(today) ? today : shiftDay(today, -1);
  let streak = 0;
  while (set.has(cursor)) {
    streak += 1;
    cursor = shiftDay(cursor, -1);
  }
  return streak;
}

export function isActiveToday(activityDates, today = todayLocal()) {
  return (activityDates || []).map(normalizeDate).includes(today);
}

// Bonus XP awarded on the first completed test of a day, growing with the streak.
export function getDailyBonusXp(streak) {
  if (streak <= 0) return 0;
  return Math.min(50, 10 + (streak - 1) * 5);
}

// Last 7 local days (oldest first) with activity flags, for the week strip.
export function getWeekActivity(activityDates, today = todayLocal()) {
  const set = new Set((activityDates || []).map(normalizeDate));
  return Array.from({ length: 7 }, (_, i) => {
    const date = shiftDay(today, i - 6);
    return { date, active: set.has(date), isToday: i === 6 };
  });
}

// Apply today's activity to progress. Returns new fields plus whether the
// streak was extended (first activity today) and the bonus earned.
export function recordActivity(progress, today = todayLocal()) {
  const existing = (progress.activityDates || []).map(normalizeDate).filter(Boolean);
  // Fall back to legacy lastVisitDate so an existing user doesn't start from zero.
  const legacy = normalizeDate(progress.lastVisitDate);
  if (legacy && !existing.includes(legacy)) existing.push(legacy);

  const firstToday = !existing.includes(today);
  const activityDates = [...new Set(firstToday ? [...existing, today] : existing)]
    .sort()
    .slice(-KEEP_DAYS);

  const dailyStreak = computeStreak(activityDates, today);
  const bestDailyStreak = Math.max(progress.bestDailyStreak || 0, dailyStreak);
  const bonusXp = firstToday ? getDailyBonusXp(dailyStreak) : 0;

  return {
    activityDates,
    dailyStreak,
    bestDailyStreak,
    lastVisitDate: today,
    streakExtended: firstToday,
    bonusXp,
  };
}

export function pluralDays(n) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return 'день';
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return 'дня';
  return 'дней';
}
