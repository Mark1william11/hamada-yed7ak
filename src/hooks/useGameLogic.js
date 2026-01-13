import { useState, useCallback, useEffect } from 'react';
import { gameLevels, GAME_CONFIG } from '../data/gameData';
import confetti from 'canvas-confetti';

const STORAGE_KEYS = {
  HIGH_SCORE: 'hamada_highScore',
  UNLOCKED_LEVEL: 'hamada_unlockedLevelIndex',
  SETTINGS: 'hamada_settings_v1',
};

// Sound type constants
const SOUND_TYPES = {
  CORRECT: 'correct',
  WRONG: 'wrong',
  LEVEL_COMPLETE: 'levelComplete',
  GAME_OVER: 'gameOver',
};

// Default settings schema for AAA quality
const DEFAULT_SETTINGS = {
  version: 1,
  audio: {
    musicVolume: 70,      // 0-100
    sfxVolume: 80,        // 0-100
  },
  haptics: {
    enabled: true,
    intensity: 0.7,       // 0-1
  },
  accessibility: {
    screenReaderMode: false,
    highContrast: false,
    reduceMotion: false,
  },
};

/**
 * Production-ready game logic hook with AAA-quality settings management
 * 
 * @param {number} levelIndex - Current level index (0-based)
 * @returns {Object} Game state, actions, and settings
 * 
 * Features:
 * - Granular audio control (music & SFX volume)
 * - Haptics/vibration support with intensity
 * - Data management with reset progress
 * - Versioned localStorage persistence for all settings
 * - Smart state management to prevent cheating
 */
export const useGameLogic = (levelIndex = 0) => {
  // Core game state
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(GAME_CONFIG.INITIAL_LIVES);
  const [isLevelComplete, setIsLevelComplete] = useState(false);
  const [selectedMouth, setSelectedMouth] = useState(null);
  const [isShaking, setIsShaking] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [gameState, setGameState] = useState('PLAYING'); // New: Track overall game mode

  // Persistence state
  const [highScore, setHighScore] = useState(0);
  const [unlockedLevelIndex, setUnlockedLevelIndex] = useState(0);

  // Settings state
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  const currentLevel = gameLevels[levelIndex] || gameLevels[0];

  /**
   * Initialize state from localStorage on component mount
   */
  useEffect(() => {
    const savedHighScore = localStorage.getItem(STORAGE_KEYS.HIGH_SCORE);
    const savedUnlockedLevel = localStorage.getItem(STORAGE_KEYS.UNLOCKED_LEVEL);
    const savedSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);

    if (savedHighScore) setHighScore(parseInt(savedHighScore, 10));
    if (savedUnlockedLevel) setUnlockedLevelIndex(parseInt(savedUnlockedLevel, 10));
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        // Merge with defaults to handle version upgrades
        setSettings({ ...DEFAULT_SETTINGS, ...parsed });
      } catch (err) {
        console.warn('Failed to parse settings:', err);
      }
    }
  }, []);

  /**
   * Hard reset when level changes
   */
  useEffect(() => {
    setSelectedMouth(null);
    setIsLevelComplete(false);
    setIsShaking(false);
  }, [levelIndex]);

  /**
   * Persist highScore to localStorage
   */
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.HIGH_SCORE, highScore.toString());
  }, [highScore]);

  /**
   * Persist unlockedLevelIndex to localStorage
   */
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.UNLOCKED_LEVEL, unlockedLevelIndex.toString());
  }, [unlockedLevelIndex]);

  /**
   * Persist settings to localStorage whenever they change
   */
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }, [settings]);

  /**
   * Trigger haptic feedback based on settings
   * @param {number} intensity - 0-1 (will be multiplied by settings.haptics.intensity)
   */
  const triggerHaptic = useCallback((intensity = 1) => {
    if (!settings.haptics.enabled) return;

    const finalIntensity = intensity * settings.haptics.intensity;

    // Modern Vibration API
    if (navigator.vibrate) {
      const duration = Math.round(50 * finalIntensity);
      navigator.vibrate(duration);
    }
  }, [settings.haptics.enabled, settings.haptics.intensity]);

  /**
   * Centralized sound playback with volume control
   * @param {string} soundType - Type of sound (SOUND_TYPES)
   * @param {string} category - 'music' or 'sfx' (defaults to 'sfx')
   */
  const playSound = useCallback((soundType, category = 'sfx') => {
    const volumeKey = category === 'music' ? 'musicVolume' : 'sfxVolume';
    const volume = settings.audio[volumeKey] / 100;

    if (volume === 0) return;

    try {
      const soundMap = {
        [SOUND_TYPES.CORRECT]: '/sounds/correct.mp3',
        [SOUND_TYPES.WRONG]: '/sounds/wrong.mp3',
        [SOUND_TYPES.LEVEL_COMPLETE]: '/sounds/levelComplete.mp3',
        [SOUND_TYPES.GAME_OVER]: '/sounds/gameOver.mp3',
      };

      const soundFile = soundMap[soundType];
      if (soundFile) {
        const audio = new Audio(soundFile);
        audio.volume = volume;
        audio.play().catch(err => console.warn('Audio play failed:', err));
      }
    } catch (err) {
      console.warn('Sound playback error:', err);
    }
  }, [settings.audio]);

  /**
   * Update a specific setting
   * @param {string} path - Dot notation path (e.g., 'audio.musicVolume')
   * @param {*} value - New value
   */
  const updateSetting = useCallback((path, value) => {
    setSettings(prev => {
      const keys = path.split('.');
      const updated = JSON.parse(JSON.stringify(prev)); // Deep copy
      
      let current = updated;
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      
      return updated;
    });
  }, []);

  /**
   * Update multiple settings at once
   * @param {Object} updates - Partial settings object
   */
  const updateSettings = useCallback((updates) => {
    setSettings(prev => ({ ...prev, ...updates }));
  }, []);

  /**
   * Reset all progress (game state only, not settings)
   * Now clears localStorage and returns success boolean
   * Preserves: all settings
   */
  const handleResetProgress = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.HIGH_SCORE);
    localStorage.removeItem(STORAGE_KEYS.UNLOCKED_LEVEL);
    
    setScore(0);
    setLives(GAME_CONFIG.INITIAL_LIVES);
    setIsLevelComplete(false);
    setSelectedMouth(null);
    setIsShaking(false);
    setGameOver(false);
    setUnlockedLevelIndex(0); // Reset unlocked levels
    
    return true; // Success confirmation
  }, []);

  /**
   * Hard reset: Clear ALL data including highScore and unlocked levels
   * Used only when user explicitly confirms data wipe from Settings
   */
  const handleHardReset = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.HIGH_SCORE);
    localStorage.removeItem(STORAGE_KEYS.UNLOCKED_LEVEL);
    
    setHighScore(0);
    setUnlockedLevelIndex(0);
    handleResetProgress();
  }, []);

  // Trigger confetti effect
  const triggerConfetti = useCallback(() => {
    const count = 200;
    const defaults = {
        origin: { y: 0.7 },
        zIndex: 9999
    };

    function fire(particleRatio, opts) {
        confetti({
            ...defaults,
            ...opts,
            particleCount: Math.floor(count * particleRatio),
            spread: 90,
            scalar: 1.2,
            gravity: 1.5,
            ticks: 200,
        });
    }

    fire(0.25, {
        spread: 26,
        startVelocity: 55,
        colors: ['#A78BFA', '#60A5FA', '#FB923C']
    });

    fire(0.2, {
        spread: 60,
        colors: ['#F472B6', '#FBBF24']
    });

    fire(0.35, {
        spread: 100,
        decay: 0.91,
        scalar: 0.8,
        colors: ['#A78BFA', '#FB923C']
    });

    fire(0.1, {
        spread: 120,
        startVelocity: 25,
        decay: 0.92,
        scalar: 1.2,
        colors: ['#60A5FA', '#F472B6']
    });
  }, []);

  /**
   * Handle mouth selection with validation
   */
  const handleMouthSelect = useCallback((mouthId) => {
    if (isLevelComplete || gameOver) return;

    setSelectedMouth(mouthId);
    triggerHaptic(0.5);

    if (mouthId === currentLevel.correctMouth) {
      // Correct answer!
      const newScore = score + GAME_CONFIG.POINTS_PER_LEVEL;
      setScore(newScore);
      setIsLevelComplete(true);

      if (newScore > highScore) {
        setHighScore(newScore);
      }

      if (levelIndex + 1 < gameLevels.length && levelIndex >= unlockedLevelIndex) {
        setUnlockedLevelIndex(levelIndex + 1);
      }

      playSound(SOUND_TYPES.CORRECT, 'sfx');
      triggerHaptic(0.8);

      setTimeout(() => {
        triggerConfetti();
        playSound(SOUND_TYPES.LEVEL_COMPLETE, 'sfx');
      }, 200);
    } else {
      // Wrong answer!
      setIsShaking(true);
      playSound(SOUND_TYPES.WRONG, 'sfx');
      triggerHaptic(0.3);

      setLives(prev => {
        const newLives = prev - 1;
        if (newLives <= 0) {
          setGameOver(true);
          playSound(SOUND_TYPES.GAME_OVER, 'sfx');
          triggerHaptic(0.6);
        }
        return newLives;
      });

      setTimeout(() => {
        setIsShaking(false);
        setSelectedMouth(null);
      }, 400);
    }
  }, [currentLevel, isLevelComplete, gameOver, triggerConfetti, score, highScore, levelIndex, unlockedLevelIndex, playSound, triggerHaptic]);

  /**
   * Reset game state for new level
   */
  const handleResetGame = useCallback(() => {
    handleResetProgress();
  }, []);

  /**
   * Go home: Switch to MENU and reset temporary level state
   * Preserves cumulative score
   */
  const goHome = useCallback(() => {
    setGameState('MENU');
    setSelectedMouth(null);
    setIsLevelComplete(false);
    setIsShaking(false);
    setGameOver(false);
  }, []);

  return {
    // Game State
    currentLevel,
    score,
    lives,
    isLevelComplete,
    selectedMouth,
    isShaking,
    gameOver,
    gameState, // New: Expose gameState

    // Persistent State
    highScore,
    unlockedLevelIndex,

    // Settings
    settings,
    updateSetting,
    updateSettings,

    // Actions
    handleMouthSelect,
    handleResetGame,
    handleResetProgress,
    handleHardReset,
    playSound,
    triggerHaptic,
    goHome, // New: Expose goHome
  };
};

export { SOUND_TYPES, DEFAULT_SETTINGS };
