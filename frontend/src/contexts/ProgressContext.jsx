import { createContext, useContext, useState, useEffect } from 'react';
import { useDeviceId } from '../hooks/useDeviceId';
import { useProgress } from '../hooks/useProgress';
import { useSoundEnabled } from '../hooks/useSoundEnabled';
import { apiService } from '../lib/api';
import { unlockAudio } from '../lib/sounds';

const ProgressContext = createContext(null);

export function ProgressProvider({ children }) {
  const deviceId = useDeviceId();
  const { progress, loading, error, saveProgress } = useProgress();
  const [achievements, setAchievements] = useState([]);
  const [achievementsLoading, setAchievementsLoading] = useState(true);
  const [soundEnabled, setSoundEnabled] = useSoundEnabled();

  useEffect(() => {
    unlockAudio();
  }, []);

  useEffect(() => {
    const loadAchievements = async () => {
      try {
        const data = await apiService.getAchievements();
        setAchievements(data);
      } catch (err) {
        console.error('Failed to load achievements:', err);
      } finally {
        setAchievementsLoading(false);
      }
    };

    if (deviceId) {
      loadAchievements();
    }
  }, [deviceId]);

  const value = {
    deviceId,
    progress,
    loading,
    error,
    saveProgress,
    achievements,
    achievementsLoading,
    soundEnabled,
    setSoundEnabled,
  };

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgressContext() {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgressContext must be used within ProgressProvider');
  }
  return context;
}
