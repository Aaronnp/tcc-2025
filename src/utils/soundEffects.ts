// Sound Effects Generator for Special Attacks

const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

// Create sound effect function
const playSound = (frequency: number, type: OscillatorType, duration: number, volume: number = 0.3) => {
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  oscillator.frequency.value = frequency;
  oscillator.type = type;
  gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + duration);
};

// Multiple tones for more complex sounds
const playMultipleSounds = (sounds: Array<{freq: number, type: OscillatorType, duration: number, delay: number, volume?: number}>) => {
  sounds.forEach(sound => {
    setTimeout(() => {
      playSound(sound.freq, sound.type, sound.duration, sound.volume || 0.3);
    }, sound.delay);
  });
};

// SUKUNA SOUNDS
export const playSukunaDesmantelar = () => {
  playMultipleSounds([
    { freq: 800, type: 'sawtooth', duration: 0.1, delay: 0 },
    { freq: 1200, type: 'sawtooth', duration: 0.1, delay: 50 },
    { freq: 600, type: 'sawtooth', duration: 0.15, delay: 100, volume: 0.4 },
  ]);
};

export const playSukunaClevar = () => {
  playMultipleSounds([
    { freq: 1500, type: 'sawtooth', duration: 0.08, delay: 0 },
    { freq: 1800, type: 'sawtooth', duration: 0.1, delay: 40 },
    { freq: 2000, type: 'sawtooth', duration: 0.15, delay: 80, volume: 0.35 },
  ]);
};

export const playSukunaFuga = () => {
  playMultipleSounds([
    { freq: 200, type: 'triangle', duration: 0.2, delay: 0 },
    { freq: 400, type: 'triangle', duration: 0.3, delay: 100 },
    { freq: 600, type: 'sine', duration: 0.5, delay: 200, volume: 0.5 },
  ]);
};

export const playSukunaSantuario = () => {
  playMultipleSounds([
    { freq: 100, type: 'sawtooth', duration: 0.5, delay: 0, volume: 0.5 },
    { freq: 150, type: 'square', duration: 0.4, delay: 200 },
    { freq: 200, type: 'sawtooth', duration: 0.6, delay: 400, volume: 0.6 },
    { freq: 80, type: 'triangle', duration: 1, delay: 600, volume: 0.4 },
  ]);
};

// GOJO SOUNDS
export const playGojoAzul = () => {
  playMultipleSounds([
    { freq: 440, type: 'sine', duration: 0.3, delay: 0, volume: 0.4 },
    { freq: 880, type: 'sine', duration: 0.2, delay: 100 },
    { freq: 1320, type: 'sine', duration: 0.4, delay: 200, volume: 0.5 },
  ]);
};

export const playGojoVermelho = () => {
  playMultipleSounds([
    { freq: 200, type: 'square', duration: 0.2, delay: 0 },
    { freq: 300, type: 'square', duration: 0.3, delay: 100, volume: 0.4 },
    { freq: 150, type: 'sawtooth', duration: 0.5, delay: 200, volume: 0.5 },
  ]);
};

export const playGojoVazioRoxo = () => {
  playMultipleSounds([
    { freq: 300, type: 'sine', duration: 0.3, delay: 0, volume: 0.5 },
    { freq: 450, type: 'triangle', duration: 0.4, delay: 150 },
    { freq: 600, type: 'sine', duration: 0.5, delay: 300, volume: 0.6 },
    { freq: 200, type: 'square', duration: 0.8, delay: 500, volume: 0.4 },
  ]);
};

export const playGojoInfinito = () => {
  playMultipleSounds([
    { freq: 800, type: 'sine', duration: 0.5, delay: 0, volume: 0.3 },
    { freq: 1000, type: 'sine', duration: 0.5, delay: 200 },
    { freq: 1200, type: 'sine', duration: 0.6, delay: 400, volume: 0.4 },
  ]);
};

export const playGojoVazioInfinito = () => {
  playMultipleSounds([
    { freq: 100, type: 'sawtooth', duration: 1, delay: 0, volume: 0.5 },
    { freq: 200, type: 'square', duration: 0.8, delay: 300 },
    { freq: 150, type: 'triangle', duration: 1.2, delay: 600, volume: 0.6 },
    { freq: 80, type: 'sawtooth', duration: 1.5, delay: 900, volume: 0.4 },
  ]);
};

// YI SOUNDS
export const playYiCounter = () => {
  playMultipleSounds([
    { freq: 500, type: 'square', duration: 0.1, delay: 0, volume: 0.5 },
    { freq: 700, type: 'square', duration: 0.15, delay: 50 },
  ]);
};

export const playYiInsert = () => {
  playMultipleSounds([
    { freq: 400, type: 'triangle', duration: 0.2, delay: 0 },
    { freq: 600, type: 'sine', duration: 0.3, delay: 100, volume: 0.4 },
  ]);
};

export const playYiExplode = () => {
  playMultipleSounds([
    { freq: 80, type: 'sawtooth', duration: 0.5, delay: 0, volume: 0.6 },
    { freq: 120, type: 'square', duration: 0.4, delay: 100 },
    { freq: 60, type: 'sawtooth', duration: 0.8, delay: 200, volume: 0.7 },
    { freq: 40, type: 'triangle', duration: 1, delay: 400, volume: 0.5 },
  ]);
};

// MARIO SOUNDS
export const playMarioMushroom = () => {
  playMultipleSounds([
    { freq: 523, type: 'square', duration: 0.1, delay: 0, volume: 0.3 },
    { freq: 659, type: 'square', duration: 0.1, delay: 100 },
    { freq: 784, type: 'square', duration: 0.15, delay: 200, volume: 0.35 },
    { freq: 1047, type: 'square', duration: 0.2, delay: 300, volume: 0.4 },
  ]);
};

// CHRONOS SOUNDS
export const playChronosRewind = () => {
  playMultipleSounds([
    { freq: 1000, type: 'sine', duration: 0.3, delay: 0, volume: 0.4 },
    { freq: 800, type: 'sine', duration: 0.3, delay: 150 },
    { freq: 600, type: 'sine', duration: 0.3, delay: 300 },
    { freq: 400, type: 'sine', duration: 0.4, delay: 450, volume: 0.3 },
  ]);
};

export const playChronosTransform = () => {
  playMultipleSounds([
    { freq: 200, type: 'triangle', duration: 0.4, delay: 0, volume: 0.5 },
    { freq: 400, type: 'sine', duration: 0.5, delay: 200 },
    { freq: 800, type: 'sine', duration: 0.6, delay: 400, volume: 0.4 },
    { freq: 1600, type: 'triangle', duration: 0.8, delay: 600, volume: 0.3 },
  ]);
};

// GUEST 1337 SOUNDS
export const playGuest1337Block = () => {
  playMultipleSounds([
    { freq: 300, type: 'square', duration: 0.15, delay: 0, volume: 0.5 },
    { freq: 400, type: 'square', duration: 0.2, delay: 80, volume: 0.4 },
  ]);
};

export const playGuest1337BlockFail = () => {
  playMultipleSounds([
    { freq: 200, type: 'sawtooth', duration: 0.3, delay: 0, volume: 0.4 },
    { freq: 100, type: 'sawtooth', duration: 0.4, delay: 150, volume: 0.3 },
  ]);
};

// SONIC SOUNDS
export const playSonicDodge = () => {
  playMultipleSounds([
    { freq: 1000, type: 'sine', duration: 0.1, delay: 0, volume: 0.3 },
    { freq: 1500, type: 'sine', duration: 0.1, delay: 50 },
    { freq: 2000, type: 'sine', duration: 0.15, delay: 100, volume: 0.35 },
  ]);
};

// LUFFY SOUNDS
export const playLuffyGear = (gear: number) => {
  const baseFreq = 100 + (gear * 50);
  playMultipleSounds([
    { freq: baseFreq, type: 'sawtooth', duration: 0.3, delay: 0, volume: 0.5 },
    { freq: baseFreq * 1.5, type: 'square', duration: 0.4, delay: 150 },
    { freq: baseFreq * 2, type: 'sawtooth', duration: 0.5, delay: 300, volume: 0.6 },
  ]);
};

// NORMAL ATTACK SOUND
export const playNormalAttack = () => {
  playMultipleSounds([
    { freq: 400, type: 'sawtooth', duration: 0.1, delay: 0, volume: 0.3 },
    { freq: 300, type: 'square', duration: 0.15, delay: 50, volume: 0.25 },
  ]);
};

// GAMBLER SOUNDS
export const playGamblerCoinWin = () => {
  playMultipleSounds([
    { freq: 523, type: 'sine', duration: 0.1, delay: 0, volume: 0.4 },
    { freq: 659, type: 'sine', duration: 0.1, delay: 80 },
    { freq: 784, type: 'sine', duration: 0.15, delay: 160, volume: 0.45 },
    { freq: 1047, type: 'sine', duration: 0.2, delay: 240, volume: 0.5 },
  ]);
};

export const playGamblerCoinLose = () => {
  playMultipleSounds([
    { freq: 300, type: 'sawtooth', duration: 0.2, delay: 0, volume: 0.35 },
    { freq: 200, type: 'sawtooth', duration: 0.3, delay: 100, volume: 0.3 },
    { freq: 100, type: 'triangle', duration: 0.4, delay: 200, volume: 0.25 },
  ]);
};

// SUKUNA WORLD CUTTING SLASH
export const playSukunaWorldSlash = () => {
  playMultipleSounds([
    { freq: 100, type: 'sawtooth', duration: 0.3, delay: 0, volume: 0.6 },
    { freq: 2000, type: 'sawtooth', duration: 0.2, delay: 100 },
    { freq: 1500, type: 'sawtooth', duration: 0.3, delay: 200, volume: 0.5 },
    { freq: 800, type: 'square', duration: 0.5, delay: 300, volume: 0.4 },
    { freq: 400, type: 'triangle', duration: 0.8, delay: 500, volume: 0.3 },
  ]);
};
