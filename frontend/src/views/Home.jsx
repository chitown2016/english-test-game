import { motion } from 'framer-motion';
import { BookOpen, Trophy, User, Zap } from 'lucide-react';
import { Card, Button } from '../components/ui';
import { useProgressContext } from '../contexts/ProgressContext';
import { xpForNextLevel } from '../lib/gamification';
import { unlockAudio } from '../lib/sounds';

export function Home({ onStartGeneral, onProfile }) {
  const { progress, achievements } = useProgressContext();

  const nextLevelXp = xpForNextLevel(progress.level);
  const xpProgress = Math.min(100, Math.round((progress.xp / nextLevelXp) * 100));

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-5"
    >
      <div className="text-center py-2">
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="text-5xl mb-3">
          🌸
        </motion.div>
        <h2 className="text-2xl font-extrabold text-ink">Привет! Готовы учить английский? 👋</h2>
        <p className="text-muted mt-1">Выбирайте тест, отвечайте на вопросы и получайте награды!</p>
      </div>

      <Card className="bg-gradient-to-br from-pastel-pink/40 to-pastel-lavender/40 border border-pastel-pink/30">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-white shadow-soft flex items-center justify-center">
              <Zap size={20} className="text-pastel-coral" />
            </div>
            <div>
              <p className="text-sm text-muted">Уровень {progress.level}</p>
              <p className="text-xl font-extrabold text-ink">{progress.xp} / {nextLevelXp} XP</p>
            </div>
          </div>
          <span className="text-2xl font-extrabold text-pastel-coral">{xpProgress}%</span>
        </div>
        <div className="w-full bg-white/60 rounded-full h-3 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${xpProgress}%` }}
            className="h-full bg-gradient-to-r from-pastel-coral to-pastel-peach rounded-full"
          />
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Card className="text-center">
          <Trophy size={28} className="mx-auto text-pastel-coral mb-2" />
          <p className="text-2xl font-extrabold text-ink">{progress.badges.length}</p>
          <p className="text-xs text-muted">наград</p>
        </Card>
        <Card className="text-center">
          <BookOpen size={28} className="mx-auto text-pastel-softgreen mb-2" />
          <p className="text-2xl font-extrabold text-ink">{progress.completedTests.length}</p>
          <p className="text-xs text-muted">тестов пройдено</p>
        </Card>
      </div>

      <Button
        onClick={() => {
          unlockAudio();
          onStartGeneral();
        }}
        size="lg"
        className="w-full"
      >
        🎮 Начать общий тест
      </Button>

      <Button onClick={onProfile} variant="secondary" size="md" className="w-full">
        <User size={18} className="mr-2" />
        Мой профиль
      </Button>

      {progress.badges.length > 0 && (
        <Card>
          <p className="text-sm font-bold text-ink mb-3">Последние награды</p>
          <div className="flex flex-wrap gap-2">
            {progress.badges.slice(-3).map((id) => {
              const badge = achievements.find((b) => b.id === id);
              return (
                <span
                  key={id}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-pastel-lemon/60 rounded-full text-sm font-semibold text-ink"
                >
                  {badge?.icon === 'star' && '⭐'}
                  {badge?.icon === 'trophy' && '🏆'}
                  {badge?.icon === 'flame' && '🔥'}
                  {badge?.icon === 'zap' && '⚡'}
                  {badge?.icon === 'rocket' && '🚀'}
                  {badge?.title || id}
                </span>
              );
            })}
          </div>
        </Card>
      )}
    </motion.div>
  );
}
