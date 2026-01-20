import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Asset Preloader Hook
 * 
 * Preloads images for the current level to prevent pop-in.
 * Returns isReady=true only when ALL critical assets are loaded.
 * 
 * @param {Object} level - Current level object with image paths
 * @param {number} levelIndex - Current level index (for tracking changes)
 */
export const useAssetPreloader = (level, levelIndex) => {
    const [isReady, setIsReady] = useState(false);
    const [progress, setProgress] = useState(0);
    const previousLevelRef = useRef(levelIndex);
    const cacheRef = useRef(new Map());

    /**
     * Preload a single image and return a promise
     */
    const preloadImage = useCallback((src) => {
        // Check cache first
        if (cacheRef.current.has(src)) {
            return Promise.resolve(cacheRef.current.get(src));
        }

        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                cacheRef.current.set(src, img);
                resolve(img);
            };
            img.onerror = reject;
            img.src = src;
        });
    }, []);

    /**
     * Preload all assets for the current level
     */
    const preloadLevel = useCallback(async () => {
        if (!level) return;

        setIsReady(false);
        setProgress(0);

        // Collect all images to preload
        const imagesToLoad = [
            level.baseImage,
            level.completeImage,
            ...level.options.map(opt => opt.image),
        ].filter(Boolean);

        const total = imagesToLoad.length;
        let loaded = 0;

        try {
            // Load all images in parallel
            await Promise.all(
                imagesToLoad.map(async (src) => {
                    await preloadImage(src);
                    loaded++;
                    setProgress(Math.round((loaded / total) * 100));
                })
            );

            setIsReady(true);
        } catch (err) {
            console.warn('[useAssetPreloader] Some assets failed to load:', err);
            // Still mark as ready so game can proceed (with possibly broken images)
            setIsReady(true);
        }
    }, [level, preloadImage]);

    /**
     * Trigger preload when level changes
     */
    useEffect(() => {
        // Only preload if level actually changed
        if (previousLevelRef.current !== levelIndex) {
            previousLevelRef.current = levelIndex;
            preloadLevel();
        } else if (!isReady && level) {
            // Initial load
            preloadLevel();
        }
    }, [levelIndex, level, preloadLevel, isReady]);

    /**
     * Reset ready state when level changes
     */
    useEffect(() => {
        setIsReady(false);
    }, [levelIndex]);

    /**
     * Manually trigger preload (for next level preloading)
     */
    const preloadNextLevel = useCallback(async (nextLevel) => {
        if (!nextLevel) return;

        const imagesToLoad = [
            nextLevel.baseImage,
            nextLevel.completeImage,
            ...nextLevel.options.map(opt => opt.image),
        ].filter(Boolean);

        await Promise.all(imagesToLoad.map(preloadImage));
    }, [preloadImage]);

    return {
        isReady,
        progress,
        preloadNextLevel,
    };
};

export default useAssetPreloader;
