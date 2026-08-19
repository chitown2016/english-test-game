import { motion } from 'framer-motion';

export function XpBar({ value, label }) {
  return (
    <motion.div
      key={value}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="px-3 py-1.5 rounded-full bg-pastel-lemon/70 text-sm font-bold text-ink"
    >
      {label}
    </motion.div>
  );
}

export function StreakFlame({ streak }) {
  if (streak < 2) return null;

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-pastel-peach/70 text-sm font-bold text-ink"
    >
      <span className="text-base">🔥</span>
      <span>{streak}</span>
    </motion.div>
  );
}
