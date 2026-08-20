import { motion } from 'framer-motion';
import { badgeEmoji } from '../../lib/gamification';
import { X } from 'lucide-react';

export function BadgeToast({ badge, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.8 }}
      className="fixed top-20 left-4 right-4 z-50 max-w-sm mx-auto"
    >
      <div className="bg-white rounded-3xl shadow-glow p-4 flex items-center gap-4 border-2 border-pastel-lemon"
      >
        <div className="w-14 h-14 rounded-2xl bg-pastel-lemon/50 flex items-center justify-center text-2xl">
          {badgeEmoji(badge.icon)}
        </div>
        <div className="flex-1">
          <p className="text-xs font-bold text-pastel-coral uppercase tracking-wider">Новая награда!</p>
          <p className="font-extrabold text-ink">{badge.title}</p>
          <p className="text-xs text-muted">{badge.description}</p>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-full hover:bg-black/5 transition-colors"
        >
          <X size={18} className="text-muted" />
        </button>
      </div>
    </motion.div>
  );
}
