import { useEffect, useState } from 'react';

const STORAGE_KEY = 'engQuest_soundEnabled';

export function useSoundEnabled() {
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored !== null) {
      setSoundEnabled(stored === 'true');
    }
  }, []);

  const updateSoundEnabled = (enabled) => {
    localStorage.setItem(STORAGE_KEY, String(enabled));
    setSoundEnabled(enabled);
  };

  return [soundEnabled, updateSoundEnabled];
}
