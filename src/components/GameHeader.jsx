import { motion } from 'framer-motion';
import { Heart, Trophy, Sparkles, Home, Volume2, VolumeX } from 'lucide-react';

/**
 * GameHeader Component - COZY PLAYFUL VERSION
 * Displays score, lives, and current level with bright, friendly colors
 * Layout: [Home] --- [Score/Level/Lives] --- [Sound]
 */
export const GameHeader = ({ score, lives, currentLevel, totalLevels, gameState, goHome, isMuted, toggleMute }) => {
  return (
    <header className="w-full px-3 py-3 bg-white/80 backdrop-blur-sm border-b-4 border-purple-200">
      <div className="flex items-center justify-between max-w-md mx-auto gap-2">
        {/* Home Button - Left */}
        {gameState !== 'MENU' && (
          <motion.button
            onClick={goHome}
            className="relative z-50 flex items-center justify-center w-12 h-12 bg-white/20 backdrop-blur-md border border-white/30 rounded-full shadow-lg cursor-pointer hover:bg-white/40 active:scale-95 transition-all duration-200"
            aria-label="Back to Menu"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Home className="w-6 h-6 text-purple-600" />
          </motion.button>
        )}

        {/* Center Content - Score, Level, Lives */}
        <div className="flex items-center justify-center gap-3 flex-1">
          {/* Score */}
          <div className="flex items-center gap-1.5 bg-gradient-to-r from-yellow-300 to-orange-300 px-3 py-1.5 rounded-full border-3 border-white shadow-md">
            <Trophy className="w-4 h-4 text-orange-700" />
            <span className="text-orange-800 font-bold text-base">{score}</span>
          </div>

          {/* Level Indicator */}
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1 text-purple-500">
              <Sparkles className="w-3.5 h-3.5" />
              <span className="text-[10px] font-semibold uppercase tracking-wider">Level</span>
            </div>
            <span className="text-purple-700 font-bold text-lg gradient-text leading-none">
              {currentLevel} / {totalLevels}
            </span>
          </div>

          {/* Lives */}
          <div className="flex items-center gap-1 bg-gradient-to-r from-pink-300 to-red-300 px-3 py-1.5 rounded-full border-3 border-white shadow-md">
            {Array.from({ length: 3 }).map((_, index) => (
              <motion.div
                key={index}
                initial={{ scale: 1 }}
                animate={{
                  scale: index < lives ? 1 : 0.6,
                  opacity: index < lives ? 1 : 0.3,
                }}
                transition={{ duration: 0.2 }}
              >
                <Heart
                  className={`w-4 h-4 ${
                    index < lives
                      ? 'text-red-600 fill-red-500'
                      : 'text-gray-400'
                  }`}
                />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Sound Button - Right */}
        <motion.button
          onClick={toggleMute}
          className="relative z-50 flex items-center justify-center w-12 h-12 bg-white/20 backdrop-blur-md border border-white/30 rounded-full shadow-lg cursor-pointer hover:bg-white/40 active:scale-95 transition-all duration-200"
          aria-label={isMuted ? 'Unmute' : 'Mute'}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isMuted ? (
            <VolumeX className="w-6 h-6 text-purple-600" />
          ) : (
            <Volume2 className="w-6 h-6 text-purple-600" />
          )}
        </motion.button>
      </div>
    </header>
  );
};
