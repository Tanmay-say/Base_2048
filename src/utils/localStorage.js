// LocalStorage utility for game settings and state

const STORAGE_KEYS = {
  GRID_SIZE: 'base2048_grid_size',
  SOUND_ENABLED: 'base2048_sound_enabled',
  MUSIC_ENABLED: 'base2048_music_enabled',
  HAPTICS_ENABLED: 'base2048_haptics_enabled',
  BEST_SCORE: 'base2048_best_score',
  GAME_STATE: 'base2048_game_state',
  PREV_GAME_STATE: 'base2048_prev_game_state'
};

export const storage = {
  // Grid size
  getGridSize() {
    const size = localStorage.getItem(STORAGE_KEYS.GRID_SIZE);
    return size ? parseInt(size, 10) : 4;
  },

  setGridSize(size) {
    localStorage.setItem(STORAGE_KEYS.GRID_SIZE, size.toString());
  },

  // Sound settings
  getSoundEnabled() {
    const enabled = localStorage.getItem(STORAGE_KEYS.SOUND_ENABLED);
    return enabled === 'true';
  },

  setSoundEnabled(enabled) {
    localStorage.setItem(STORAGE_KEYS.SOUND_ENABLED, enabled.toString());
  },

  // Music settings
  getMusicEnabled() {
    const enabled = localStorage.getItem(STORAGE_KEYS.MUSIC_ENABLED);
    return enabled === null ? true : enabled === 'true';
  },

  setMusicEnabled(enabled) {
    localStorage.setItem(STORAGE_KEYS.MUSIC_ENABLED, enabled.toString());
  },

  // Haptics settings
  getHapticsEnabled() {
    const enabled = localStorage.getItem(STORAGE_KEYS.HAPTICS_ENABLED);
    return enabled === 'true';
  },

  setHapticsEnabled(enabled) {
    localStorage.setItem(STORAGE_KEYS.HAPTICS_ENABLED, enabled.toString());
  },

  // Best score
  getBestScore() {
    const score = localStorage.getItem(STORAGE_KEYS.BEST_SCORE);
    return score ? parseInt(score, 10) : 0;
  },

  setBestScore(score) {
    localStorage.setItem(STORAGE_KEYS.BEST_SCORE, score.toString());
  },

  // Game state (current board)
  getGameState() {
    const state = localStorage.getItem(STORAGE_KEYS.GAME_STATE);
    return state ? JSON.parse(state) : null;
  },

  setGameState(state) {
    localStorage.setItem(STORAGE_KEYS.GAME_STATE, JSON.stringify(state));
  },

  clearGameState() {
    localStorage.removeItem(STORAGE_KEYS.GAME_STATE);
  },

  // Previous game state (for undo)
  getPreviousGameState() {
    const state = localStorage.getItem(STORAGE_KEYS.PREV_GAME_STATE);
    return state ? JSON.parse(state) : null;
  },

  setPreviousGameState(state) {
    localStorage.setItem(STORAGE_KEYS.PREV_GAME_STATE, JSON.stringify(state));
  },

  clearPreviousGameState() {
    localStorage.removeItem(STORAGE_KEYS.PREV_GAME_STATE);
  }
};
