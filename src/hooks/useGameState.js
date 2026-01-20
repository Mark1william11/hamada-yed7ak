import { useState, useCallback, useEffect, useRef } from 'react';
import { gameLevels, GAME_CONFIG } from '../data/gameData';
import { AudioManager } from '../services/AudioManager';
import { LeaderboardService } from '../services/firebase';
import confetti from 'canvas-confetti';

/**
 * STORAGE SCHEMA - Single Source of Truth
 * All game data stored under one versioned key
 */
const STORAGE_KEY = 'hamada_game_v3';

/**
 * SCORING SYSTEM
 * Points based on number of attempts:
 * - 1st try: 100 points
 * - 2nd try: 70 points  
 * - 3rd try: 40 points
 */
const POINTS_BY_ATTEMPT = {
    1: 100,
    2: 70,
    3: 40,
};

const DEFAULT_STATE = {
    version: 3,
    // Player Profile
    playerName: '',
    playerId: null, // Unique ID for leaderboard
    // Progress
    unlockedLevels: [1],
    completedLevels: [],
    bestScores: {},
    highScore: 0,
    totalScore: 0, // Cumulative score across all levels
    // Settings
    settings: {
        audio: {
            musicVolume: 70,
            sfxVolume: 80,
            isMusicMuted: false,
            isSfxMuted: false,
        },
        haptics: {
            enabled: true,
            intensity: 0.7,
        },
        accessibility: {
            screenReaderMode: false,
            highContrast: false,
            reduceMotion: false,
        },
    },
};

/**
 * Generate a unique player ID
 */
const generatePlayerId = () => {
    return 'player_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
};

/**
 * Load state from localStorage with migration support
 */
const loadPersistedState = () => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            const parsed = JSON.parse(stored);
            // Deep merge with defaults to handle schema upgrades
            const merged = {
                ...DEFAULT_STATE,
                ...parsed,
                playerId: parsed.playerId || generatePlayerId(),
                settings: {
                    ...DEFAULT_STATE.settings,
                    ...parsed.settings,
                    audio: { ...DEFAULT_STATE.settings.audio, ...parsed.settings?.audio },
                    haptics: { ...DEFAULT_STATE.settings.haptics, ...parsed.settings?.haptics },
                    accessibility: { ...DEFAULT_STATE.settings.accessibility, ...parsed.settings?.accessibility },
                },
            };
            return merged;
        }
    } catch (err) {
        console.warn('[useGameState] Failed to load persisted state:', err);
    }
    return { ...DEFAULT_STATE, playerId: generatePlayerId() };
};

/**
 * Unified Game State Hook
 * 
 * Single source of truth for:
 * - Player profile (name, ID)
 * - Game progress (unlocked/completed levels, scores)
 * - Game session (score, lives, level state, attempts)
 * - Settings (audio, haptics, accessibility)
 * 
 * @param {number} levelIndex - Current level index (0-based)
 */
export const useGameState = (levelIndex = 0) => {
    // ========================================
    // PERSISTED STATE (survives page reload)
    // ========================================
    const [persistedState, setPersistedState] = useState(loadPersistedState);

    // ========================================
    // SESSION STATE (resets on page reload)
    // ========================================
    const [sessionScore, setSessionScore] = useState(0); // Score for current game session
    const [lives, setLives] = useState(GAME_CONFIG.INITIAL_LIVES);
    const [attempts, setAttempts] = useState(0); // Attempts for current level
    const [isLevelComplete, setIsLevelComplete] = useState(false);
    const [selectedMouth, setSelectedMouth] = useState(null);
    const [isShaking, setIsShaking] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Track if audio manager was initialized
    const audioInitialized = useRef(false);

    const currentLevel = gameLevels[levelIndex] || gameLevels[0];

    // ========================================
    // PERSIST STATE TO LOCALSTORAGE
    // ========================================
    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(persistedState));
        } catch (err) {
            console.warn('[useGameState] Failed to persist state:', err);
        }
    }, [persistedState]);

    // ========================================
    // SYNC AUDIO MANAGER WITH SETTINGS
    // ========================================
    useEffect(() => {
        const audioSettings = persistedState.settings.audio;
        AudioManager.restoreState({
            musicVolume: audioSettings.musicVolume,
            sfxVolume: audioSettings.sfxVolume,
            isMusicMuted: audioSettings.isMusicMuted,
            isSfxMuted: audioSettings.isSfxMuted,
        });
    }, [persistedState.settings.audio]);

    // ========================================
    // INITIALIZE AUDIO ON FIRST INTERACTION
    // ========================================
    const initAudio = useCallback(() => {
        if (!audioInitialized.current) {
            AudioManager.init();
            audioInitialized.current = true;
        }
    }, []);

    // ========================================
    // RESET LEVEL STATE ON LEVEL CHANGE
    // ========================================
    useEffect(() => {
        setSelectedMouth(null);
        setIsLevelComplete(false);
        setIsShaking(false);
        setAttempts(0); // Reset attempts for new level
    }, [levelIndex]);

    // ========================================
    // PLAYER NAME ACTIONS
    // ========================================

    /**
     * Set player name
     */
    const setPlayerName = useCallback((name) => {
        const cleanName = name.trim().substring(0, 20); // Max 20 chars
        setPersistedState(prev => ({
            ...prev,
            playerName: cleanName,
        }));
    }, []);

    /**
     * Get player name (or generate default)
     */
    const playerName = persistedState.playerName || `Player ${persistedState.playerId?.slice(-4) || '0000'}`;

    // ========================================
    // SETTINGS ACTIONS
    // ========================================

    /**
     * Update a single setting by path (e.g., 'audio.musicVolume')
     */
    const updateSetting = useCallback((path, value) => {
        setPersistedState(prev => {
            const keys = path.split('.');
            const updated = JSON.parse(JSON.stringify(prev)); // Deep copy

            let current = updated.settings;
            for (let i = 0; i < keys.length - 1; i++) {
                current = current[keys[i]];
            }
            current[keys[keys.length - 1]] = value;

            return updated;
        });

        // Immediately update AudioManager for audio settings
        if (path.startsWith('audio.')) {
            const key = path.split('.')[1];
            if (key === 'musicVolume') {
                AudioManager.setMusicVolume(value);
            } else if (key === 'sfxVolume') {
                AudioManager.setSfxVolume(value);
            }
        }
    }, []);

    /**
     * Update multiple settings at once
     */
    const updateSettings = useCallback((updates) => {
        setPersistedState(prev => ({
            ...prev,
            settings: { ...prev.settings, ...updates },
        }));
    }, []);

    /**
     * Get current settings object
     */
    const settings = persistedState.settings;

    // ========================================
    // PROGRESS ACTIONS
    // ========================================

    /**
     * Check if a level is unlocked
     */
    const isLevelUnlocked = useCallback((levelId) => {
        return persistedState.unlockedLevels.includes(levelId);
    }, [persistedState.unlockedLevels]);

    /**
     * Check if a level is completed
     */
    const isLevelCompleted = useCallback((levelId) => {
        return persistedState.completedLevels.includes(levelId);
    }, [persistedState.completedLevels]);

    /**
     * Get best score for a level
     */
    const getBestScore = useCallback((levelId) => {
        return persistedState.bestScores[levelId] || 0;
    }, [persistedState.bestScores]);

    /**
     * Mark a level as completed and unlock next
     */
    const completeLevel = useCallback((levelId, levelScore) => {
        setPersistedState(prev => {
            const newCompleted = prev.completedLevels.includes(levelId)
                ? prev.completedLevels
                : [...prev.completedLevels, levelId];

            const nextLevel = levelId + 1;
            const newUnlocked = nextLevel <= gameLevels.length && !prev.unlockedLevels.includes(nextLevel)
                ? [...prev.unlockedLevels, nextLevel]
                : prev.unlockedLevels;

            const newBestScores = {
                ...prev.bestScores,
                [levelId]: Math.max(prev.bestScores[levelId] || 0, levelScore),
            };

            // Calculate total score from all best scores
            const newTotalScore = Object.values(newBestScores).reduce((sum, s) => sum + s, 0);
            const newHighScore = Math.max(prev.highScore, newTotalScore);

            return {
                ...prev,
                completedLevels: newCompleted,
                unlockedLevels: newUnlocked,
                bestScores: newBestScores,
                totalScore: newTotalScore,
                highScore: newHighScore,
            };
        });
    }, []);

    /**
     * Submit score to global leaderboard
     */
    const submitToLeaderboard = useCallback(async () => {
        const name = persistedState.playerName || playerName;
        const levelsCompleted = persistedState.completedLevels.length;
        const totalScore = persistedState.totalScore;

        if (totalScore > 0 && name) {
            await LeaderboardService.submitScore(name, totalScore, levelsCompleted);
        }
    }, [persistedState.playerName, persistedState.completedLevels.length, persistedState.totalScore, playerName]);

    // ========================================
    // HAPTICS
    // ========================================
    const triggerHaptic = useCallback((intensity = 1) => {
        if (!settings.haptics.enabled) return;
        const finalIntensity = intensity * settings.haptics.intensity;
        if (navigator.vibrate) {
            navigator.vibrate(Math.round(50 * finalIntensity));
        }
    }, [settings.haptics.enabled, settings.haptics.intensity]);

    // ========================================
    // CONFETTI
    // ========================================
    const triggerConfetti = useCallback(() => {
        const count = 200;
        const defaults = { origin: { y: 0.7 }, zIndex: 9999 };

        const fire = (particleRatio, opts) => {
            confetti({
                ...defaults,
                ...opts,
                particleCount: Math.floor(count * particleRatio),
                spread: 90,
                scalar: 1.2,
                gravity: 1.5,
                ticks: 200,
            });
        };

        fire(0.25, { spread: 26, startVelocity: 55, colors: ['#A78BFA', '#60A5FA', '#FB923C'] });
        fire(0.2, { spread: 60, colors: ['#F472B6', '#FBBF24'] });
        fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8, colors: ['#A78BFA', '#FB923C'] });
        fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2, colors: ['#60A5FA', '#F472B6'] });
    }, []);

    // ========================================
    // GAME ACTIONS
    // ========================================

    /**
     * Calculate points based on attempt number
     */
    const getPointsForAttempt = (attemptNumber) => {
        return POINTS_BY_ATTEMPT[attemptNumber] || 40; // Default to 40 for 3+ attempts
    };

    /**
     * Handle mouth selection with audio feedback
     */
    const handleMouthSelect = useCallback((mouthId) => {
        if (isLevelComplete || gameOver) return;

        // Initialize audio on first interaction
        initAudio();

        setSelectedMouth(mouthId);
        triggerHaptic(0.5);

        // Increment attempt counter
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);

        if (mouthId === currentLevel.correctMouth) {
            // CORRECT ANSWER - Calculate points based on attempts
            const pointsEarned = getPointsForAttempt(newAttempts);
            const newSessionScore = sessionScore + pointsEarned;
            setSessionScore(newSessionScore);
            setIsLevelComplete(true);

            AudioManager.playCorrect();
            triggerHaptic(0.8);

            setTimeout(() => {
                triggerConfetti();
                AudioManager.playLevelComplete();
            }, 200);
        } else {
            // WRONG ANSWER
            setIsShaking(true);
            AudioManager.playWrong();
            triggerHaptic(0.3);

            setLives(prev => {
                const newLives = prev - 1;
                if (newLives <= 0) {
                    setGameOver(true);
                    AudioManager.playGameOver();
                    triggerHaptic(0.6);
                }
                return newLives;
            });

            setTimeout(() => {
                setIsShaking(false);
                setSelectedMouth(null);
            }, 400);
        }
    }, [currentLevel, isLevelComplete, gameOver, sessionScore, attempts, triggerConfetti, triggerHaptic, initAudio]);

    /**
     * Reset current level (try again)
     */
    const handleResetLevel = useCallback(() => {
        setSessionScore(0);
        setLives(GAME_CONFIG.INITIAL_LIVES);
        setAttempts(0);
        setIsLevelComplete(false);
        setSelectedMouth(null);
        setIsShaking(false);
        setGameOver(false);
    }, []);

    /**
     * Reset ALL progress (danger zone)
     * Clears progress but preserves settings and player name
     */
    const handleResetProgress = useCallback(() => {
        // Clear progress
        setPersistedState(prev => ({
            ...prev,
            unlockedLevels: [1],
            completedLevels: [],
            bestScores: {},
            highScore: 0,
            totalScore: 0,
        }));

        // Reset session state
        handleResetLevel();

        return true; // Success indicator
    }, [handleResetLevel]);

    /**
     * Hard reset - clear EVERYTHING including settings
     */
    const handleHardReset = useCallback(() => {
        localStorage.removeItem(STORAGE_KEY);
        setPersistedState({ ...DEFAULT_STATE, playerId: generatePlayerId() });
        handleResetLevel();
    }, [handleResetLevel]);

    /**
     * Toggle global mute
     */
    const toggleMute = useCallback(() => {
        initAudio();
        const isMuted = AudioManager.toggleMute();
        setPersistedState(prev => ({
            ...prev,
            settings: {
                ...prev.settings,
                audio: {
                    ...prev.settings.audio,
                    isMusicMuted: isMuted,
                    isSfxMuted: isMuted,
                },
            },
        }));
        return isMuted;
    }, [initAudio]);

    /**
     * Check if muted
     */
    const isMuted = settings.audio.isMusicMuted && settings.audio.isSfxMuted;

    // ========================================
    // RETURN PUBLIC API
    // ========================================
    return {
        // Current level
        currentLevel,

        // Player profile
        playerName,
        playerId: persistedState.playerId,
        setPlayerName,

        // Session state
        score: sessionScore,
        lives,
        attempts, // Current level attempts
        isLevelComplete,
        selectedMouth,
        isShaking,
        gameOver,
        isLoading,
        setIsLoading,

        // Persisted state
        highScore: persistedState.highScore,
        totalScore: persistedState.totalScore,

        // Settings
        settings,
        updateSetting,
        updateSettings,
        isMuted,
        toggleMute,

        // Progress
        isLevelUnlocked,
        isLevelCompleted,
        getBestScore,
        completeLevel,
        submitToLeaderboard,
        progress: {
            unlockedLevels: persistedState.unlockedLevels,
            completedLevels: persistedState.completedLevels,
            bestScores: persistedState.bestScores,
        },

        // Actions
        handleMouthSelect,
        handleResetLevel,
        handleResetProgress,
        handleHardReset,
        triggerHaptic,
        initAudio,

        // Audio Manager reference for direct access
        AudioManager,

        // Scoring info
        getPointsForAttempt,
    };
};

export default useGameState;
