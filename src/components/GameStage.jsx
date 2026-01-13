import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

/**
 * GameStage Component - COZY PLAYFUL VERSION
 * CRITICAL BUG FIX: Complete image now properly shows when level is won
 * Fixed opacity swap logic for ghost image mechanism
 */
export const GameStage = ({ 
  level, 
  isLevelComplete, 
  isShaking, 
  previewMouth = null,
  selectedMouth = null
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  // Get the mouth to display (preview/selected during gameplay only)
  const displayMouth = isLevelComplete 
    ? null  // Don't show overlay when complete - show full image instead
    : previewMouth || (selectedMouth && level.options.find(opt => opt.id === selectedMouth));

  return (
    <div className={`flex-1 flex items-center justify-center px-3 py-4 ${isShaking ? 'shake' : ''} min-h-0`}>
      <div className="relative w-full max-w-sm">
        {/* Image Container with fixed aspect ratio */}
        <div className="image-container rounded-3xl overflow-hidden shadow-xl border-4 border-white/50">
          
          {/* Ghost Base Image - VISIBLE during gameplay, HIDDEN when complete */}
          <img
            src={level.baseImage}
            alt={`${level.celebrity} - base`}
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-400"
            style={{
              opacity: isLevelComplete ? 0 : 1,  // KEY FIX: Hide base when complete
              pointerEvents: 'none'
            }}
            onLoad={() => setImageLoaded(true)}
          />

          {/* Mouth Overlay - Only shows during gameplay */}
          <AnimatePresence mode="wait">
            {displayMouth && !isLevelComplete && (
              <motion.img
                key={displayMouth.id}
                src={displayMouth.image}
                alt="Mouth overlay"
                className="absolute object-contain pointer-events-none z-10"
                style={{
                  top: level.overlayStyle.top,
                  left: level.overlayStyle.left,
                  width: level.overlayStyle.width,
                  transform: level.overlayStyle.transform || 'translate(0, -50%)',
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.08 }}
              />
            )}
          </AnimatePresence>

          {/* Complete Image - FULLY VISIBLE when level complete */}
          <AnimatePresence>
            {isLevelComplete && (
              <motion.img
                src={level.completeImage}
                alt={`${level.celebrity} - complete`}
                className="absolute inset-0 w-full h-full object-cover z-20"  // Higher z-index
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ 
                  opacity: 1,  // KEY FIX: Full opacity
                  scale: 1 
                }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              />
            )}
          </AnimatePresence>

          {/* Loading Skeleton */}
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gradient-to-br from-purple-200 to-pink-200 animate-pulse" />
          )}

          {/* Decorative Glow Ring - Cozy Colors */}
          <div
            className="absolute inset-0 rounded-3xl pointer-events-none transition-shadow duration-500"
            style={{
              boxShadow: isLevelComplete
                ? '0 0 40px rgba(251, 146, 60, 0.6), inset 0 0 40px rgba(251, 146, 60, 0.2)'  // Orange glow
                : '0 0 20px rgba(167, 139, 250, 0.5)',  // Purple glow
            }}
          />

          {/* Success Burst Effect */}
          {isLevelComplete && (
            <motion.div
              className="absolute inset-0 rounded-3xl bg-gradient-to-br from-yellow-300/30 to-orange-300/30"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1.2, opacity: [0, 0.5, 0] }}
              transition={{ duration: 0.6 }}
            />
          )}
        </div>

        {/* Celebrity Name Badge - Playful Style */}
        <motion.div
          className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-500 to-pink-500 px-5 sm:px-7 py-2 sm:py-2.5 rounded-full shadow-lg border-3 border-white"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          <p className="text-white font-bold text-sm sm:text-base tracking-wide whitespace-nowrap drop-shadow-md">
            {level.celebrity}
          </p>
        </motion.div>
      </div>
    </div>
  );
};

