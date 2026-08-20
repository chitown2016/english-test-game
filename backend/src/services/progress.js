const { query } = require('../db');

const defaultProgress = {
  xp: 0,
  level: 1,
  total_correct: 0,
  total_answered: 0,
  streak: 0,
  best_streak: 0,
  completed_tests: [],
  badges: [],
  stats_by_test: {},
  question_stats: {},
  last_visit_date: null,
  daily_streak: 0,
  best_daily_streak: 0,
  activity_dates: [],
};

function rowToProgress(row) {
  return {
    deviceId: row.device_id,
    xp: row.xp,
    level: row.level,
    totalCorrect: row.total_correct,
    totalAnswered: row.total_answered,
    streak: row.streak,
    bestStreak: row.best_streak,
    completedTests: row.completed_tests,
    badges: row.badges,
    statsByTest: row.stats_by_test,
    questionStats: row.question_stats,
    lastVisitDate: row.last_visit_date,
    dailyStreak: row.daily_streak || 0,
    bestDailyStreak: row.best_daily_streak || 0,
    activityDates: row.activity_dates || [],
  };
}

async function getProgress(deviceId) {
  const result = await query('SELECT * FROM progress WHERE device_id = $1', [deviceId]);
  if (result.rows.length === 0) {
    return { ...defaultProgress, deviceId };
  }
  return rowToProgress(result.rows[0]);
}

async function upsertProgress(deviceId, progress) {
  const {
    xp = 0,
    level = 1,
    totalCorrect = 0,
    totalAnswered = 0,
    streak = 0,
    bestStreak = 0,
    completedTests = [],
    badges = [],
    statsByTest = {},
    questionStats = {},
    lastVisitDate = null,
    dailyStreak = 0,
    bestDailyStreak = 0,
    activityDates = [],
  } = progress;

  const result = await query(
    `
    INSERT INTO progress (
      device_id, xp, level, total_correct, total_answered, streak, best_streak,
      completed_tests, badges, stats_by_test, question_stats, last_visit_date,
      daily_streak, best_daily_streak, activity_dates, updated_at
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, NOW())
    ON CONFLICT (device_id) DO UPDATE SET
      xp = EXCLUDED.xp,
      level = EXCLUDED.level,
      total_correct = EXCLUDED.total_correct,
      total_answered = EXCLUDED.total_answered,
      streak = EXCLUDED.streak,
      best_streak = EXCLUDED.best_streak,
      completed_tests = EXCLUDED.completed_tests,
      badges = EXCLUDED.badges,
      stats_by_test = EXCLUDED.stats_by_test,
      question_stats = EXCLUDED.question_stats,
      last_visit_date = EXCLUDED.last_visit_date,
      daily_streak = EXCLUDED.daily_streak,
      best_daily_streak = EXCLUDED.best_daily_streak,
      activity_dates = EXCLUDED.activity_dates,
      updated_at = NOW()
    RETURNING *
    `,
    [
      deviceId,
      xp,
      level,
      totalCorrect,
      totalAnswered,
      streak,
      bestStreak,
      completedTests,
      badges,
      JSON.stringify(statsByTest),
      JSON.stringify(questionStats),
      lastVisitDate,
      dailyStreak,
      bestDailyStreak,
      activityDates,
    ]
  );

  return rowToProgress(result.rows[0]);
}

module.exports = { getProgress, upsertProgress };
