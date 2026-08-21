const STORAGE_KEY = 'engQuest_difficulty';

export const DIFFICULTY_OPTIONS = [
  { value: 'easy', label: 'Легко', emoji: '🌱' },
  { value: 'medium', label: 'Средне', emoji: '🌿' },
  { value: 'all', label: 'Микс', emoji: '🌈' },
];

export function getDifficulty() {
  const stored = localStorage.getItem(STORAGE_KEY);
  return DIFFICULTY_OPTIONS.some((o) => o.value === stored) ? stored : 'easy';
}

export function setDifficulty(value) {
  localStorage.setItem(STORAGE_KEY, value);
}
