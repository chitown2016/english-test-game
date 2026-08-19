import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export function TimerBar({ timeRemainingMs, timeLimitMs, status, onTick, onTimeUp }) {
  const lastTickRef = useRef(Date.now());

  useEffect(() => {
    if (status !== 'answering') return;

    lastTickRef.current = Date.now();
    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = now - lastTickRef.current;
      lastTickRef.current = now;

      onTick((prev) => {
        const next = Math.max(0, prev - elapsed);
        if (next === 0 && prev > 0 && onTimeUp) {
          onTimeUp();
        }
        return next;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [status, onTick, onTimeUp]);

  const percentage = timeLimitMs > 0 ? (timeRemainingMs / timeLimitMs) * 100 : 0;

  let colorClass = 'bg-pastel-softgreen';
  if (percentage < 40) colorClass = 'bg-pastel-softred';
  else if (percentage < 70) colorClass = 'bg-pastel-peach';

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between text-xs text-muted mb-1">
        <span>Время</span>
        <span>{Math.ceil(timeRemainingMs / 1000)} сек</span>
      </div>
      <div className="w-full bg-pastel-lavender/40 rounded-full h-2.5 overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${colorClass}`}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.1, ease: 'linear' }}
        />
      </div>
    </div>
  );
}
