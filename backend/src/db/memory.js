const store = new Map();

function row(deviceId) {
  return {
    device_id: deviceId,
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
    created_at: new Date(),
    updated_at: new Date(),
  };
}

async function runMigrations() {
  console.log('Using in-memory database (dev mode)');
}

async function query(text, params) {
  if (text.trim().startsWith('SELECT')) {
    const deviceId = params[0];
    const rows = store.has(deviceId) ? [store.get(deviceId)] : [];
    return { rows };
  }

  if (text.includes('INSERT INTO progress') && text.includes('ON CONFLICT')) {
    const [
      deviceId,
      xp,
      level,
      totalCorrect,
      totalAnswered,
      streak,
      bestStreak,
      completedTests,
      badges,
      statsByTestJson,
      questionStatsJson,
      lastVisitDate,
      dailyStreak,
      bestDailyStreak,
      activityDates,
    ] = params;

    const existing = store.get(deviceId) || row(deviceId);
    const updated = {
      ...existing,
      xp,
      level,
      total_correct: totalCorrect,
      total_answered: totalAnswered,
      streak,
      best_streak: bestStreak,
      completed_tests: completedTests,
      badges,
      stats_by_test: JSON.parse(statsByTestJson),
      question_stats: JSON.parse(questionStatsJson),
      last_visit_date: lastVisitDate,
      daily_streak: dailyStreak,
      best_daily_streak: bestDailyStreak,
      activity_dates: activityDates,
      updated_at: new Date(),
    };
    store.set(deviceId, updated);
    return { rows: [updated] };
  }

  throw new Error(`Unsupported in-memory query: ${text}`);
}

module.exports = { pool: null, query, runMigrations };
