export function generateId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function formatDate(date) {
  return new Date(date).toLocaleDateString('ru-RU');
}

export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}
