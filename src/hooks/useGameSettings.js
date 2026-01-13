import { useState, useEffect } from 'react';

const STORAGE_KEY = 'hamada-yed7ak-settings';

/**
 * Custom hook to manage game settings with localStorage persistence
 */
export const useGameSettings = () => {
    const [isSoundMuted, setIsSoundMuted] = useState(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const settings = JSON.parse(stored);
                return settings.isSoundMuted ?? false;
            }
        } catch (error) {
            console.error('Failed to load settings:', error);
        }
        return false;
    });

    // Persist settings to localStorage whenever they change
    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({ isSoundMuted }));
        } catch (error) {
            console.error('Failed to save settings:', error);
        }
    }, [isSoundMuted]);

    const toggleSound = () => {
        setIsSoundMuted(prev => !prev);
    };

    return {
        isSoundMuted,
        toggleSound,
    };
};
