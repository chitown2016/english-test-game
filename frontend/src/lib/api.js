const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

function getDeviceId() {
  return localStorage.getItem('engQuest_deviceId') || '';
}

async function api(path, options = {}) {
  const url = `${API_URL}${path}`;
  const headers = {
    'Content-Type': 'application/json',
    'X-Device-Id': getDeviceId(),
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json();
}

export const apiService = {
  getTests: () => api('/tests'),
  getTest: (id) => api(`/tests/${id}`),
  getAchievements: () => api('/achievements'),
  getProgress: () => api('/progress'),
  saveProgress: (progress) => api('/progress', {
    method: 'PUT',
    body: JSON.stringify(progress),
  }),
};
