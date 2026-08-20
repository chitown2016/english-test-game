import { DAILY_BADGES } from './dailyStreak';

const DIFFICULTY_MULTIPLIER = {
  easy: 1,
  medium: 1.5,
  hard: 2,
};

const BASE_XP = 10;

export function getStreakMultiplier(streak) {
  if (streak >= 10) return 2.0;
  if (streak >= 5) return 1.5;
  if (streak >= 3) return 1.2;
  return 1.0;
}

export function getSpeedBonus(timeRemainingMs, timeLimitMs) {
  const ratio = timeRemainingMs / timeLimitMs;
  if (ratio > 0.7) return 5;
  if (ratio > 0.4) return 2;
  return 0;
}

export function calculateQuestionPoints({ isCorrect, difficulty, streak, timeRemainingMs, timeLimitMs, timerEnabled = true }) {
  if (!isCorrect) return 0;

  const difficultyMultiplier = DIFFICULTY_MULTIPLIER[difficulty] || 1;
  const streakMultiplier = getStreakMultiplier(streak);
  const speedBonus = timerEnabled ? getSpeedBonus(timeRemainingMs, timeLimitMs) : 0;

  return Math.round(BASE_XP * difficultyMultiplier * streakMultiplier + speedBonus);
}

export function xpForLevel(level) {
  return Math.round(100 * Math.pow(level, 1.5));
}

export function xpForNextLevel(level) {
  return xpForLevel(level + 1);
}

const BADGE_ICONS = {
  star: '⭐',
  trophy: '🏆',
  flame: '🔥',
  zap: '⚡',
  rocket: '🚀',
  calendar: '📅',
  medal: '🏅',
  gem: '💎',
  crown: '👑',
};

export function badgeEmoji(icon) {
  return BADGE_ICONS[icon] || '🎖️';
}

export function evaluateBadges({ session, progress, newBadges }) {
  const badges = [...newBadges];
  const answers = session.answers;
  const correctCount = answers.filter((a) => a.isCorrect).length;
  const currentStreak = session.sessionStreak;
  const fastAnswers = answers.filter((a) => a.isCorrect && a.speedBonus > 0).length;

  const has = (id) => progress.badges.includes(id) || badges.includes(id);
  const add = (id) => {
    if (!has(id)) badges.push(id);
  };

  if (correctCount >= 1) add('first-correct');
  if (correctCount === session.totalQuestions && session.totalQuestions > 0) add('perfect-test');
  if (currentStreak >= 10) add('streak-10');
  if (fastAnswers >= 5) add('speed-demon');
  if (progress.level >= 5) add('level-5');
  DAILY_BADGES.forEach(({ days, id }) => {
    if ((progress.dailyStreak || 0) >= days) add(id);
  });

  return badges;
}

export function formatNumber(num) {
  return num.toLocaleString('ru-RU');
}
