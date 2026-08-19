import { motion } from 'framer-motion';

export function QuestionCard({ question, index, total }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl shadow-soft p-5 mb-4"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold text-muted uppercase tracking-wider">
          Вопрос {index + 1} / {total}
        </span>
      </div>
      <h3 className="text-xl font-bold text-ink leading-snug">{question.question}</h3>
    </motion.div>
  );
}
