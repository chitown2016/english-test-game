import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';

export function AnswerOptions({ options, selectedOptionId, correctOptionId, status, onSelect }) {
  const isRevealed = status === 'answered';

  return (
    <div className="space-y-3">
      {options.map((option, index) => {
        const isSelected = selectedOptionId === option.id;
        const isCorrect = option.id === correctOptionId;
        const showCorrect = isRevealed && isCorrect;
        const showIncorrect = isRevealed && isSelected && !isCorrect;

        let buttonClass = 'bg-white hover:bg-pastel-lavender/30 border-2 border-transparent';
        if (showCorrect) {
          buttonClass = 'bg-pastel-softgreen/40 border-pastel-softgreen text-ink';
        } else if (showIncorrect) {
          buttonClass = 'bg-pastel-softred/20 border-pastel-softred text-ink';
        } else if (isSelected) {
          buttonClass = 'bg-pastel-lavender/50 border-pastel-lavender text-ink';
        }

        return (
          <motion.button
            key={option.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            whileTap={!isRevealed ? { scale: 0.97 } : {}}
            disabled={isRevealed}
            onClick={() => onSelect(option.id)}
            className={`
              w-full text-left px-5 py-4 rounded-2xl font-semibold transition-all duration-200
              shadow-soft flex items-center justify-between
              ${buttonClass}
            `}
          >
            <span>{option.text}</span>
            {showCorrect && <Check size={22} className="text-pastel-softgreen" />}
            {showIncorrect && <X size={22} className="text-pastel-softred" />}
          </motion.button>
        );
      })}
    </div>
  );
}
