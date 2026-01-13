import { useState, useEffect } from 'react';

const PROGRESS_KEY = 'hamada-yed7ak-progress';

/**
 * Custom hook to manage game progress with localStorage persistence
 * Tracks which levels are unlocked and completed
 */
export const useGameProgress = (totalLevels) => {
    const [progress, setProgress] = useState(() => {
        try {
            const stored = localStorage.getItem(PROGRESS_KEY);
            if (stored) {
                return JSON.parse(stored);
            }
        } catch (error) {
            console.error('Failed to load progress:', error);
        }

        // Default: Only level 1 unlocked
        return {
            unlockedLevels: [1],
            completedLevels: [],
            bestScores: {}
        };
    });

    // Persist progress to localStorage whenever it changes
    useEffect(() => {
        try {
            localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
        } catch (error) {
            console.error('Failed to save progress:', error);
        }
    }, [progress]);

    // Mark a level as completed and unlock the next one
    const completeLevel = (levelId, score) => {
        setProgress(prev => {
            const newCompleted = prev.completedLevels.includes(levelId)
                ? prev.completedLevels
                : [...prev.completedLevels, levelId];

            const nextLevel = levelId + 1;
            const newUnlocked = nextLevel <= totalLevels && !prev.unlockedLevels.includes(nextLevel)
                ? [...prev.unlockedLevels, nextLevel]
                : prev.unlockedLevels;

            const newBestScores = {
                ...prev.bestScores,
                [levelId]: Math.max(prev.bestScores[levelId] || 0, score)
            };

            return {
                unlockedLevels: newUnlocked,
                completedLevels: newCompleted,
                bestScores: newBestScores
            };
        });
    };

    // Check if a level is unlocked
    const isLevelUnlocked = (levelId) => {
        return progress.unlockedLevels.includes(levelId);
    };

    // Check if a level is completed
    const isLevelCompleted = (levelId) => {
        return progress.completedLevels.includes(levelId);
    };

    // Get best score for a level
    const getBestScore = (levelId) => {
        return progress.bestScores[levelId] || 0;
    };

    // Reset all progress
    const resetProgress = () => {
        setProgress({
            unlockedLevels: [1],
            completedLevels: [],
            bestScores: {}
        });
    };

    return {
        progress,
        completeLevel,
        isLevelUnlocked,
        isLevelCompleted,
        getBestScore,
        resetProgress,
    };
};
