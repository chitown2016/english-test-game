import { motion } from 'framer-motion';
import { ArrowLeft, Award, Target, TrendingUp, Volume2, VolumeX, Timer, Flame } from 'lucide-react';
import { Card, Button } from '../components/ui';
import { useProgressContext } from '../contexts/ProgressContext';
import { xpForNextLevel, badgeEmoji } from '../lib/gamification';
import { unlockAudio } from '../lib/sounds';
import { computeStreak, pluralDays } from '../lib/dailyStreak';

export function Profile({ onBack }) {
  const { progress, achievements, soundEnabled, setSoundEnabled, timerEnabled, setTimerEnabled } = useProgressContext();

  const totalTests = progress.totalAnswered > 0
    ? Math.round((progress.totalCorrect / progress.totalAnswered) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-4"
    >
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={onBack} className="!px-3">
          <ArrowLeft size={20} />
        </Button>
        <h2 className="text-xl font-extrabold text-ink">Профиль</h2>
      </div>

      <Card className="bg-gradient-to-br from-pastel-pink/30 to-pastel-lavender/30">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-pastel-coral to-pastel-peach flex items-center justify-center text-white text-3xl shadow-glow mb-3">
            👩‍🎓
          </div>
          <p className="text-2xl font-extrabold text-ink">Уровень {progress.level}</p>
          <p className="text-muted">{progress.xp} / {xpForNextLevel(progress.level)} XP</p>
        </div>
      </Card>

      <Card className="flex items-center gap-3 bg-gradient-to-r from-pastel-peach/40 to-pastel-lemon/30">
        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-pastel-coral shadow-soft">
          <Flame size={22} />
        </div>
        <div className="flex-1">
          <p className="font-bold text-ink">
            {computeStreak(progress.activityDates)} {pluralDays(computeStreak(progress.activityDates))} подряд
          </p>
          <p className="text-xs text-muted">
            Рекорд: {progress.bestDailyStreak || 0} {pluralDays(progress.bestDailyStreak || 0)}
          </p>
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-3">
        <Card className="text-center">
          <Target size={24} className="mx-auto text-pastel-coral mb-2" />
          <p className="text-xl font-extrabold text-ink">{totalTests}%</p>
          <p className="text-xs text-muted">правильных</p>
        </Card>
        <Card className="text-center">
          <TrendingUp size={24} className="mx-auto text-pastel-softgreen mb-2" />
          <p className="text-xl font-extrabold text-ink">{progress.bestStreak}</p>
          <p className="text-xs text-muted">лучшая серия ответов</p>
        </Card>
      </div>

      <Card className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-pastel-lavender/60 flex items-center justify-center text-ink">
            {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
          </div>
          <div>
            <p className="font-bold text-ink">Звуковые эффекты</p>
            <p className="text-xs text-muted">{soundEnabled ? 'Включены' : 'Выключены'}</p>
          </div>
        </div>
        <Button
          variant={soundEnabled ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => {
            unlockAudio();
            setSoundEnabled(!soundEnabled);
          }}
        >
          {soundEnabled ? 'Выключить' : 'Включить'}
        </Button>
      </Card>

      <Card className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-pastel-peach/60 flex items-center justify-center text-ink">
            <Timer size={20} />
          </div>
          <div>
            <p className="font-bold text-ink">Таймер вопросов</p>
            <p className="text-xs text-muted">{timerEnabled ? 'Включен' : 'Выключен'}</p>
          </div>
        </div>
        <Button
          variant={timerEnabled ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => setTimerEnabled(!timerEnabled)}
        >
          {timerEnabled ? 'Выключить' : 'Включить'}
        </Button>
      </Card>

      <Card>
        <div className="flex items-center gap-2 mb-3">
          <Award size={20} className="text-pastel-coral" />
          <p className="font-bold text-ink">Награды ({progress.badges.length}/{achievements.length})</p>
        </div>
        <div className="space-y-2">
          {achievements.map((badge) => {
            const earned = progress.badges.includes(badge.id);
            return (
              <div
                key={badge.id}
                className={`
                  flex items-center gap-3 p-3 rounded-2xl transition-colors
                  ${earned ? 'bg-pastel-lemon/40' : 'bg-gray-50'}
                `}
              >
                <div className={`
                  w-10 h-10 rounded-xl flex items-center justify-center text-lg
                  ${earned ? 'bg-white shadow-soft' : 'bg-gray-100'}
                `}>
                  {badgeEmoji(badge.icon)}
                </div>
                <div className="flex-1">
                  <p className={`font-bold ${earned ? 'text-ink' : 'text-muted'}`}>{badge.title}</p>
                  <p className="text-xs text-muted">{badge.description}</p>
                </div>
                {earned && <span className="text-pastel-coral font-bold text-sm">✓</span>}
              </div>
            );
          })}
        </div>
      </Card>
    </motion.div>
  );
}
