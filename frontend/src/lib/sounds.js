const STORAGE_KEY = 'engQuest_soundEnabled';

let audioCtx = null;

function getContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return null;
    audioCtx = new AudioContextClass();
  }
  return audioCtx;
}

function isEnabled() {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored !== 'false';
}

async function resumeContext() {
  const ctx = getContext();
  if (!ctx) return false;
  if (ctx.state === 'suspended') {
    try {
      await ctx.resume();
    } catch {
      return false;
    }
  }
  return ctx.state === 'running';
}

function playTone({ frequency, duration, type = 'sine', gain = 0.12, when = 0 }) {
  const ctx = getContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gainNode = ctx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(frequency, ctx.currentTime + when);

  gainNode.gain.setValueAtTime(0, ctx.currentTime + when);
  gainNode.gain.linearRampToValueAtTime(gain, ctx.currentTime + when + 0.02);
  gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + when + duration);

  osc.connect(gainNode);
  gainNode.connect(ctx.destination);

  osc.start(ctx.currentTime + when);
  osc.stop(ctx.currentTime + when + duration);
}

function playSlide({ from, to, duration, type = 'sine', gain = 0.12 }) {
  const ctx = getContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gainNode = ctx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(from, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(to, ctx.currentTime + duration);

  gainNode.gain.setValueAtTime(0, ctx.currentTime);
  gainNode.gain.linearRampToValueAtTime(gain, ctx.currentTime + 0.02);
  gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

  osc.connect(gainNode);
  gainNode.connect(ctx.destination);

  osc.start();
  osc.stop(ctx.currentTime + duration);
}

async function playIfEnabled(playFn) {
  if (!isEnabled()) return;
  const ok = await resumeContext();
  if (!ok) return;
  playFn();
}

export function playCorrect() {
  playIfEnabled(() => {
    playTone({ frequency: 523.25, duration: 0.12, gain: 0.1 });
    playTone({ frequency: 783.99, duration: 0.18, gain: 0.1, when: 0.1 });
  });
}

export function playWrong() {
  playIfEnabled(() => {
    playSlide({ from: 329.63, to: 261.63, duration: 0.25, type: 'triangle', gain: 0.08 });
  });
}

export function playLevelUp() {
  playIfEnabled(() => {
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, i) => {
      playTone({ frequency: freq, duration: 0.25, gain: 0.11, when: i * 0.1 });
    });
  });
}

export function playBadge() {
  playIfEnabled(() => {
    playTone({ frequency: 880, duration: 0.12, gain: 0.1 });
    playTone({ frequency: 1174.66, duration: 0.2, gain: 0.1, when: 0.1 });
  });
}

export function playComplete() {
  playIfEnabled(() => {
    const notes = [
      { freq: 392, when: 0, duration: 0.3 },
      { freq: 523.25, when: 0.12, duration: 0.35 },
      { freq: 659.25, when: 0.24, duration: 0.5 },
    ];
    notes.forEach(({ freq, when, duration }) => {
      playTone({ frequency: freq, duration, gain: 0.11, when });
    });
  });
}

export function unlockAudio() {
  resumeContext().catch(() => {});
}
