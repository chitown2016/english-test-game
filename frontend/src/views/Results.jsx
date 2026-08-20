import { motion } from 'framer-motion';
import { badgeEmoji } from '../lib/gamification';
import { pluralDays } from '../lib/dailyStreak';
import { Home, RotateCcw, Trophy } from 'lucide-react';
import { Card, Button } from '../components/ui';
import { useProgressContext } from '../contexts/ProgressContext';

export function Results({ result, onHome, onRetry }) {
  const { achievements } = useProgressContext();
  const {
    test,
    score,
    totalQuestions,
    earnedXp,
    newBadges,
    leveledUpTo,
    dailyStreak = 0,
    streakExtended = false,
    streakBonusXp = 0,
  } = result;

  const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;

  let message = 'Хорошая работа!';
  if (percentage === 100) message = 'Идеально! Все ответы верны! 🌟';
  else if (percentage >= 80) message = 'Отличный результат! 🎉';
  else if (percentage >= 60) message = 'Хорошая работа! 👍';
  else message = 'Продолжайте практиковаться! 💪';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-5"
    >
      <div className="text-center py-4">
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="text-6xl mb-4"
        >
          {percentage === 100 ? '🏆' : percentage >= 80 ? '🌟' : '✨'}
        </motion.div>
        <h2 className="text-2xl font-extrabold text-ink">{test.title}</h2>
        <p className="text-muted mt-1">{message}</p>
      </div>

      <Card className="bg-gradient-to-br from-pastel-pink/30 to-pastel-lavender/30">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-4xl font-extrabold text-pastel-coral">{score}/{totalQuestions}</p>
            <p className="text-sm text-muted">правильных ответов</p>
          </div>
          <div>
            <p className="text-4xl font-extrabold text-pastel-softgreen">+{earnedXp}</p>
            <p className="text-sm text-muted">получено XP</p>
          </div>
        </div>
      </Card>

      {dailyStreak > 0 && (
        <Card className="bg-gradient-to-r from-pastel-peach/50 to-pastel-lemon/40 border border-pastel-peach/50">
          <div className="flex items-center gap-3">
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.3, 1] }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-3xl"
            >
              🔥
            </motion.span>
            <div className="flex-1">
              <p className="font-extrabold text-ink">
                Серия: {dailyStreak} {pluralDays(dailyStreak)} подряд
              </p>
              <p className="text-xs text-muted">
                {streakExtended
                  ? `Ежедневный бонус: +${streakBonusXp} XP. Возвращайтесь завтра!`
                  : 'Сегодня уже зачтено — бонус будет завтра.'}
              </p>
            </div>
          </div>
        </Card>
      )}

      {leveledUpTo && (
        <Card className="bg-pastel-lemon/40 border border-pastel-lemon text-center">
          <Trophy size={32} className="mx-auto text-pastel-coral mb-2" />
          <p className="font-extrabold text-ink">Новый уровень: {leveledUpTo}!</p>
        </Card>
      )}

      {newBadges.length > 0 && (
        <Card>
          <p className="font-bold text-ink mb-3">Получены награды:</p>
          <div className="space-y-2">
            {newBadges.map((id) => {
              const badge = achievements.find((b) => b.id === id);
              return (
                <div key={id} className="flex items-center gap-3 p-3 bg-pastel-lemon/40 rounded-2xl"
                >
                  <span className="text-2xl">
                    {badgeEmoji(badge?.icon)}
                  </span>
                  <div>
                    <p className="font-bold text-ink">{badge?.title || id}</p>
                    <p className="text-xs text-muted">{badge?.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      <div className="space-y-3">
        <Button onClick={onRetry} variant="primary" size="lg" className="w-full">
          <RotateCcw size={18} className="mr-2" />
          Пройти ещё раз
        </Button>
        <Button onClick={onHome} variant="ghost" size="md" className="w-full">
          <Home size={18} className="mr-2" />
          На главную
        </Button>
      </div>
    </motion.div>
  );
}
