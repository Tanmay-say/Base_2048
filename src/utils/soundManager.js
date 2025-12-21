// Sound Manager for game audio effects
class SoundManager {
  constructor() {
    this.sounds = {};
    this.enabled = false;
    this.loaded = false;
    this.audioContext = null;
  }

  init() {
    if (this.loaded) return;
    
    // Initialize Web Audio API for better performance
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
      console.warn('Web Audio API not supported');
    }

    this.loaded = true;
  }

  async loadSound(name, url) {
    if (this.sounds[name]) return;

    try {
      // Try to load the sound file
      const response = await fetch(url);
      if (response.ok) {
        const audio = new Audio(url);
        audio.preload = 'auto';
        audio.volume = 0.3;
        this.sounds[name] = audio;
      } else {
        // Fallback to Web Audio API beeps
        this.sounds[name] = { synthetic: true, type: name };
      }
    } catch (error) {
      // Fallback to synthetic sounds
      console.warn(`Using synthetic sound for: ${name}`);
      this.sounds[name] = { synthetic: true, type: name };
    }
  }

  // Generate synthetic beep sounds as fallback
  playSyntheticSound(type) {
    if (!this.audioContext) return;

    const ctx = this.audioContext;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    // Different frequencies and durations for different sounds
    switch (type) {
      case 'move':
        oscillator.frequency.value = 300;
        gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.05);
        break;
      case 'merge':
        oscillator.frequency.value = 500;
        gainNode.gain.setValueAtTime(0.15, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.1);
        break;
      case 'win':
        // Play ascending tones
        [400, 500, 600].forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.frequency.value = freq;
          gain.gain.setValueAtTime(0.1, ctx.currentTime + i * 0.1);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.1 + 0.2);
          osc.start(ctx.currentTime + i * 0.1);
          osc.stop(ctx.currentTime + i * 0.1 + 0.2);
        });
        return; // Early return for multi-tone
      case 'gameover':
        oscillator.frequency.value = 200;
        gainNode.gain.setValueAtTime(0.15, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.3);
        break;
    }
  }

  async loadAllSounds() {
    if (Object.keys(this.sounds).length > 0) return;

    const soundFiles = [
      { name: 'move', url: '/sounds/move.mp3' },
      { name: 'merge', url: '/sounds/merge.mp3' },
      { name: 'win', url: '/sounds/win.mp3' },
      { name: 'gameover', url: '/sounds/gameover.mp3' }
    ];

    await Promise.all(
      soundFiles.map(({ name, url }) => this.loadSound(name, url))
    );
  }

  play(name) {
    if (!this.enabled || !this.sounds[name]) return;

    try {
      const sound = this.sounds[name];
      
      // Check if synthetic sound
      if (sound.synthetic) {
        this.playSyntheticSound(sound.type);
      } else {
        const audio = sound.cloneNode();
        audio.volume = 0.3;
        audio.play().catch(err => {
          console.warn(`Failed to play sound: ${name}`, err);
        });
      }
    } catch (error) {
      console.warn(`Error playing sound: ${name}`, error);
    }
  }

  setEnabled(enabled) {
    this.enabled = enabled;
    if (enabled && !this.loaded) {
      this.init();
      this.loadAllSounds();
    }
  }

  isEnabled() {
    return this.enabled;
  }
}

// Create singleton instance
const soundManager = new SoundManager();

export default soundManager;
