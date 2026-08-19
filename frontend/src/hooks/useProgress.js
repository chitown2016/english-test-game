import { useState, useEffect } from 'react';
import { apiService } from '../lib/api';

const DEFAULT_PROGRESS = {
  xp: 0,
  level: 1,
  totalCorrect: 0,
  totalAnswered: 0,
  streak: 0,
  bestStreak: 0,
  completedTests: [],
  badges: [],
  statsByTest: {},
  lastVisitDate: null,
};

export function useProgress() {
  const [progress, setProgress] = useState(DEFAULT_PROGRESS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await apiService.getProgress();
        setProgress({
          ...DEFAULT_PROGRESS,
          ...data,
        });
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const saveProgress = async (updates) => {
    const next = { ...progress, ...updates };
    setProgress(next);
    try {
      const saved = await apiService.saveProgress(next);
      setProgress({ ...DEFAULT_PROGRESS, ...saved });
      return saved;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return { progress, loading, error, saveProgress };
}
