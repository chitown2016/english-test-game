import { useEffect, useState } from 'react';

const STORAGE_KEY = 'engQuest_timerEnabled';

export function useTimerEnabled() {
  const [timerEnabled, setTimerEnabled] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored !== null) {
      setTimerEnabled(stored === 'true');
    }
  }, []);

  const updateTimerEnabled = (enabled) => {
    localStorage.setItem(STORAGE_KEY, String(enabled));
    setTimerEnabled(enabled);
  };

  return [timerEnabled, updateTimerEnabled];
}
