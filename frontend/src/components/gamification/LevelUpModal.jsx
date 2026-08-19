import { motion } from 'framer-motion';
import { Sparkles, X } from 'lucide-react';

export function LevelUpModal({ level, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/30 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.5, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.5, y: 50 }}
        className="bg-white rounded-4xl shadow-2xl p-8 text-center max-w-sm w-full relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-pastel-coral"
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: [0, 1, 0],
                y: [-20, -80],
                x: [0, (i % 2 === 0 ? 1 : -1) * 40],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
              }}
              style={{
                left: `${15 + i * 14}%`,
                bottom: '20%',
              }}
            >
              ✨
            </motion.div>
          ))}
        </div>

        <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-pastel-coral to-pastel-peach flex items-center justify-center text-white text-4xl shadow-glow mb-4">
          🚀
        </div>
        <h2 className="text-2xl font-extrabold text-ink mb-2">Новый уровень!</h2>
        <p className="text-muted mb-6">
          Поздравляем! Вы достигли уровня {level}.
        </p>
        <button
          onClick={onClose}
          className="w-full py-3 px-6 rounded-2xl bg-pastel-coral text-white font-bold hover:bg-pastel-coral/90 transition-colors"
        >
          Супер! 🎉
        </button>
      </motion.div>
    </motion.div>
  );
}
