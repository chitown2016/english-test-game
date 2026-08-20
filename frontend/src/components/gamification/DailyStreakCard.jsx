import { motion } from 'framer-motion';
import { Card } from '../ui';
import {
  computeStreak,
  isActiveToday,
  getWeekActivity,
  getDailyBonusXp,
  pluralDays,
} from '../../lib/dailyStreak';

const WEEKDAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

function weekdayLabel(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  const day = new Date(y, m - 1, d).getDay(); // 0 = Sunday
  return WEEKDAYS[(day + 6) % 7];
}

export function DailyStreakCard({ progress }) {
  const streak = computeStreak(progress.activityDates);
  const doneToday = isActiveToday(progress.activityDates);
  const week = getWeekActivity(progress.activityDates);
  const nextBonus = getDailyBonusXp(doneToday ? streak + 1 : streak + 1);

  let headline;
  let hint;
  if (doneToday) {
    headline = `${streak} ${pluralDays(streak)} подряд`;
    hint = `Сегодня зачтено! Завтра — ещё +${nextBonus} XP за серию.`;
  } else if (streak > 0) {
    headline = `${streak} ${pluralDays(streak)} подряд`;
    hint = `Пройдите один тест сегодня, чтобы сохранить серию (+${getDailyBonusXp(streak + 1)} XP).`;
  } else {
    headline = 'Начните серию!';
    hint = 'Занимайтесь каждый день — бонус за серию растёт с каждым днём.';
  }

  return (
    <Card
      className={`border ${
        doneToday
          ? 'bg-gradient-to-br from-pastel-peach/50 to-pastel-lemon/40 border-pastel-peach/50'
          : 'bg-white border-pastel-peach/30'
      }`}
    >
      <div className="flex items-center gap-3 mb-3">
        <motion.div
          animate={doneToday ? { scale: [1, 1.15, 1] } : { scale: 1 }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-soft ${
            doneToday ? 'bg-white' : 'bg-pastel-peach/30 grayscale'
          }`}
        >
          🔥
        </motion.div>
        <div className="flex-1 min-w-0">
          <p className="text-lg font-extrabold text-ink leading-tight">{headline}</p>
          <p className="text-xs text-muted">{hint}</p>
        </div>
      </div>

      <div className="flex justify-between gap-1">
        {week.map(({ date, active, isToday }) => (
          <div key={date} className="flex flex-col items-center gap-1 flex-1">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                active
                  ? 'bg-pastel-coral text-white shadow-soft'
                  : isToday
                    ? 'border-2 border-dashed border-pastel-coral text-pastel-coral'
                    : 'bg-pastel-lavender/30 text-muted'
              }`}
            >
              {active ? '✓' : ''}
            </div>
            <span className={`text-[10px] ${isToday ? 'font-bold text-ink' : 'text-muted'}`}>
              {weekdayLabel(date)}
            </span>
          </div>
        ))}
      </div>

      {progress.bestDailyStreak > 0 && (
        <p className="text-[11px] text-muted mt-3 text-right">
          Рекорд: {progress.bestDailyStreak} {pluralDays(progress.bestDailyStreak)}
        </p>
      )}
    </Card>
  );
}
