import { motion } from 'framer-motion';
import { Flame, Star, Volume2, VolumeX } from 'lucide-react';
import { useProgressContext } from '../../contexts/ProgressContext';
import { xpForNextLevel } from '../../lib/gamification';
import { unlockAudio } from '../../lib/sounds';

export function Header() {
  const { progress, soundEnabled, setSoundEnabled } = useProgressContext();

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-20 safe-top bg-white/90 backdrop-blur-md border-b border-pastel-lavender/50 px-4 py-3"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-pastel-pink to-pastel-coral flex items-center justify-center text-white font-extrabold text-lg shadow-glow">
            EQ
          </div>
          <div>
            <h1 className="text-lg font-extrabold text-ink leading-tight">EngQuest</h1>
            <p className="text-xs text-muted">Уровень {progress.level}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-pastel-lemon/60 px-2.5 py-1 rounded-full">
            <Star size={16} className="text-pastel-coral" />
            <span className="text-sm font-bold text-ink">{progress.xp}/{xpForNextLevel(progress.level)}</span>
          </div>
          {progress.streak >= 3 && (
            <div className="flex items-center gap-1 bg-pastel-peach/60 px-2.5 py-1 rounded-full">
              <Flame size={16} className="text-pastel-coral" />
              <span className="text-sm font-bold text-ink">{progress.streak}</span>
            </div>
          )}
          <motion.button
            type="button"
            onClick={() => {
              unlockAudio();
              setSoundEnabled(!soundEnabled);
            }}
            whileTap={{ scale: 0.9 }}
            className="w-9 h-9 rounded-full bg-pastel-lavender/60 hover:bg-pastel-lavender flex items-center justify-center text-ink transition-colors"
            aria-label={soundEnabled ? 'Выключить звук' : 'Включить звук'}
          >
            {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
}

export function AppShell({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 px-4 py-5 safe-bottom">
        {children}
      </main>
    </div>
  );
}
