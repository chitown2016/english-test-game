import { motion } from 'framer-motion';
import { CheckCircle2, XCircle } from 'lucide-react';

export function ExplanationPanel({ question, isCorrect, onContinue }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        mt-4 rounded-3xl p-5 border-2
        ${isCorrect ? 'bg-pastel-softgreen/20 border-pastel-softgreen/30' : 'bg-pastel-softred/10 border-pastel-softred/20'}
      `}
    >
      <div className="flex items-center gap-2 mb-2">
        {isCorrect ? (
          <>
            <CheckCircle2 size={22} className="text-pastel-softgreen" />
            <span className="font-bold text-pastel-softgreen">Правильно! 🎉</span>
          </>
        ) : (
          <>
            <XCircle size={22} className="text-pastel-softred" />
            <span className="font-bold text-pastel-softred">Не совсем так</span>
          </>
        )}
      </div>
      <p className="text-ink leading-relaxed mb-4">{question.explanation}</p>
      <button
        onClick={onContinue}
        className="w-full py-3 px-6 rounded-2xl bg-ink text-white font-bold hover:bg-ink/90 transition-colors"
      >
        Дальше →
      </button>
    </motion.div>
  );
}
