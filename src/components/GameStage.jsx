import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';

/**
 * GameStage Component - FIXED VERSION
 * 
 * Fixes:
 * - NO toggling/fading on base image - stays solid at 100% opacity
 * - Mouth overlay properly centered and smaller (40% width)
 * - Complete image fades in smoothly on win
 */
export const GameStage = ({ 
  level, 
  isLevelComplete, 
  isShaking, 
  previewMouth = null,
  selectedMouth = null
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const prevLevelId = useRef(level?.id);

  // Only reset loaded state when level ID actually changes
  useEffect(() => {
    if (prevLevelId.current !== level?.id) {
      setImageLoaded(false);
      prevLevelId.current = level?.id;
    }
  }, [level?.id]);

  // Get the mouth to display (preview/selected during gameplay only)
  const displayMouth = isLevelComplete 
    ? null  // Don't show overlay when complete
    : previewMouth || (selectedMouth && level.options.find(opt => opt.id === selectedMouth));

  return (
    <div className={`flex-1 flex items-center justify-center px-3 py-3 ${isShaking ? 'shake' : ''} min-h-0 h-full`}>
      <div className="relative w-full max-w-sm h-full flex items-center justify-center">
        {/* Image Container with fixed aspect ratio */}
        <div className="image-container rounded-3xl overflow-hidden shadow-xl border-4 border-white/50 relative">
          
          {/* Base Image - ALWAYS 100% opacity, no transitions, no toggling */}
          <img
            src={level.baseImage}
            alt={`${level.celebrity} - base`}
            className="w-full h-full object-cover"
            style={{ 
              display: isLevelComplete ? 'none' : 'block'
            }}
            onLoad={() => setImageLoaded(true)}
          />

          {/* Complete Image - Shown only when level is complete */}
          {isLevelComplete && (
            <motion.img
              src={level.completeImage}
              alt={`${level.celebrity} - complete`}
              className="w-full h-full object-cover"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            />
          )}

          {/* Mouth Overlay - CENTERED and smaller */}
          <AnimatePresence mode="wait">
            {displayMouth && !isLevelComplete && (
              <motion.div
                key={displayMouth.id}
                className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.08 }}
              >
                <img
                  src={displayMouth.image}
                  alt="Mouth preview"
                  className="object-contain rounded-lg shadow-lg"
                  style={{
                    width: '40%',  // Smaller - 40% of container
                    maxHeight: '30%',
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Loading Skeleton */}
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gradient-to-br from-purple-200 to-pink-200 animate-pulse rounded-3xl" />
          )}

          {/* Decorative Glow Ring */}
          <div
            className="absolute inset-0 rounded-3xl pointer-events-none"
            style={{
              boxShadow: isLevelComplete
                ? '0 0 40px rgba(251, 146, 60, 0.6), inset 0 0 40px rgba(251, 146, 60, 0.2)'
                : '0 0 20px rgba(167, 139, 250, 0.5)',
              transition: 'box-shadow 0.4s ease'
            }}
          />

          {/* Success Burst Effect */}
          {isLevelComplete && (
            <motion.div
              className="absolute inset-0 rounded-3xl bg-gradient-to-br from-yellow-300/30 to-orange-300/30 z-30 pointer-events-none"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1.15, opacity: [0, 0.5, 0] }}
              transition={{ duration: 0.5 }}
            />
          )}
        </div>

        {/* Celebrity Name Badge */}
        <motion.div
          className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-500 to-pink-500 px-4 sm:px-6 py-1.5 sm:py-2 rounded-full shadow-lg border-3 border-white z-40"
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.25 }}
        >
          <p className="text-white font-bold text-xs sm:text-sm tracking-wide whitespace-nowrap drop-shadow-md">
            {level.celebrity}
          </p>
        </motion.div>
      </div>
    </div>
  );
};
