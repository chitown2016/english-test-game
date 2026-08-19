import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Lock, Play, Star } from 'lucide-react';
import { Card, Button } from '../components/ui';
import { useProgressContext } from '../contexts/ProgressContext';
import { apiService } from '../lib/api';

export function TestList({ onSelect, onBack }) {
  const { progress } = useProgressContext();
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await apiService.getTests();
        setTests(data);
      } catch (err) {
        console.error('Failed to load tests:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="text-4xl mb-3 animate-bounce">📚</div>
        <p className="text-muted">Загрузка тестов...</p>
      </div>
    );
  }

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
        <h2 className="text-xl font-extrabold text-ink">Выберите тест</h2>
      </div>

      <div className="space-y-3">
        {tests.map((test, index) => {
          const isLocked = test.unlockLevel > progress.level;
          const isCompleted = progress.completedTests.includes(test.id);
          const stat = progress.statsByTest[test.id];

          return (
            <motion.div
              key={test.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card
                className={`
                  relative transition-all duration-200
                  ${isLocked ? 'opacity-70' : 'hover:shadow-glow'}
                `}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-ink">{test.title}</h3>
                      {isCompleted && (
                        <Star size={16} className="text-pastel-coral fill-pastel-coral" />
                      )}
                    </div>
                    <p className="text-sm text-muted mb-2">{test.description}</p>
                    <div className="flex items-center gap-3 text-xs">
                      <span className="px-2 py-1 bg-pastel-lavender/50 rounded-full text-ink font-semibold">
                        {test.questionCount} вопросов
                      </span>
                      <span className="px-2 py-1 bg-pastel-mint/50 rounded-full text-ink font-semibold">
                        {test.timeLimitSeconds} сек
                      </span>
                      {stat && (
                        <span className="text-pastel-coral font-bold">
                          Лучший результат: {stat.bestScore}/{test.questionCount}
                        </span>
                      )}
                    </div>
                  </div>

                  <Button
                    variant={isLocked ? 'ghost' : 'primary'}
                    size="sm"
                    disabled={isLocked}
                    onClick={() => !isLocked && onSelect(test.id)}
                    className="!px-3 !rounded-2xl"
                  >
                    {isLocked ? <Lock size={18} /> : <Play size={18} />}
                  </Button>
                </div>

                {isLocked && (
                  <p className="text-xs text-muted mt-3">
                    🔒 Откроется на уровне {test.unlockLevel}
                  </p>
                )}
              </Card>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
