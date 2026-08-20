const STORAGE_KEY = 'engQuest_soundEnabled';

// Sound effects are pre-rendered audio files (see frontend/public/sounds/).
// Playing via <audio> elements instead of the Web Audio API matters on iOS:
// HTMLMediaElement playback is heard even when the Ring/Silent switch is on,
// whereas AudioContext output is muted by the switch.
const SOUND_FILES = {
  correct: '/sounds/correct.wav',
  wrong: '/sounds/wrong.wav',
  levelUp: '/sounds/levelup.wav',
  badge: '/sounds/badge.wav',
  complete: '/sounds/complete.wav',
};

const elements = {};
let unlocked = false;
let unlockListenersAdded = false;

function getElement(name) {
  if (typeof window === 'undefined' || typeof Audio === 'undefined') return null;
  if (!elements[name]) {
    const el = new Audio(SOUND_FILES[name]);
    el.preload = 'auto';
    el.setAttribute('playsinline', '');
    elements[name] = el;
  }
  return elements[name];
}

function isEnabled() {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored !== 'false';
}

// iOS Safari only lets an <audio> element play if play() was first called
// inside a user gesture. Warm every element up once, muted, during a gesture.
export function unlockAudio() {
  if (unlocked) return;
  let allOk = true;
  Object.keys(SOUND_FILES).forEach((name) => {
    const el = getElement(name);
    if (!el) return;
    el.muted = true;
    const attempt = el.play();
    if (attempt && typeof attempt.then === 'function') {
      attempt
        .then(() => {
          el.pause();
          el.currentTime = 0;
          el.muted = false;
        })
        .catch(() => {
          el.muted = false;
          allOk = false;
        });
    } else {
      el.pause();
      el.currentTime = 0;
      el.muted = false;
    }
  });
  unlocked = allOk;
}

export function setupGlobalAudioUnlock() {
  if (unlockListenersAdded) return;
  if (typeof window === 'undefined') return;

  const events = ['touchend', 'click', 'keydown'];
  const unlock = () => {
    unlockAudio();
    if (unlocked) {
      events.forEach((event) => window.removeEventListener(event, unlock));
    }
  };

  events.forEach((event) => {
    window.addEventListener(event, unlock, { passive: true });
  });

  unlockListenersAdded = true;
}

function play(name) {
  if (!isEnabled()) return;
  const el = getElement(name);
  if (!el) return;
  try {
    el.currentTime = 0;
  } catch {
    // ignore: element not ready yet
  }
  const attempt = el.play();
  if (attempt && typeof attempt.catch === 'function') {
    attempt.catch(() => {});
  }
}

export function playCorrect() {
  play('correct');
}

export function playWrong() {
  play('wrong');
}

export function playLevelUp() {
  play('levelUp');
}

export function playBadge() {
  play('badge');
}

export function playComplete() {
  play('complete');
}
