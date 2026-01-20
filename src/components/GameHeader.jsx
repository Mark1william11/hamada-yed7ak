import { motion } from 'framer-motion';
import { Heart, Trophy, Sparkles, Home, Volume2, VolumeX } from 'lucide-react';

/**
 * GameHeader Component - REFACTORED CSS GRID VERSION
 * 
 * Uses CSS Grid with 3 fixed columns to prevent element collisions:
 * - Left: Home button (fixed width)
 * - Center: Score/Level/Lives (flex, min-width-0 to allow shrinking)
 * - Right: Sound button (fixed width)
 */
export const GameHeader = ({ 
  score, 
  lives, 
  currentLevel, 
  totalLevels, 
  gameState, 
  goHome, 
  isMuted, 
  toggleMute,
  onOpenLeaderboard 
}) => {
  return (
    <header className="w-full px-2 py-2 bg-white/80 backdrop-blur-sm border-b-4 border-purple-200 flex-shrink-0">
      {/* CSS Grid: 3 columns - fixed | flexible | fixed */}
      <div className="grid grid-cols-[48px_1fr_48px] items-center gap-1 max-w-md mx-auto">
        
        {/* Left Column: Home Button */}
        <div className="flex justify-start">
          {gameState !== 'MENU' ? (
            <motion.button
              onClick={goHome}
              className="flex items-center justify-center w-10 h-10 bg-white/60 backdrop-blur-md border-2 border-purple-200 rounded-full shadow-md cursor-pointer hover:bg-white active:scale-95 transition-all duration-100"
              aria-label="Back to Menu"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Home className="w-5 h-5 text-purple-600" />
            </motion.button>
          ) : (
            <div className="w-10 h-10" /> // Spacer
          )}
        </div>

        {/* Center Column: Score, Level, Lives */}
        <div className="flex items-center justify-center gap-2 min-w-0">
          {/* Score - Clickable to open leaderboard */}
          <motion.button
            onClick={onOpenLeaderboard}
            className="flex items-center gap-1 bg-gradient-to-r from-yellow-300 to-orange-300 px-2 py-1 rounded-full border-2 border-white shadow-sm flex-shrink-0 cursor-pointer hover:from-yellow-200 hover:to-orange-200 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="View Leaderboard"
          >
            <Trophy className="w-3.5 h-3.5 text-orange-700" />
            <span className="text-orange-800 font-bold text-sm">{score}</span>
          </motion.button>

          {/* Level Indicator */}
          <div className="flex flex-col items-center flex-shrink min-w-0">
            <div className="flex items-center gap-0.5 text-purple-500">
              <Sparkles className="w-3 h-3 flex-shrink-0" />
              <span className="text-[9px] font-semibold uppercase tracking-wide truncate">Level</span>
            </div>
            <span className="text-purple-700 font-bold text-sm leading-none whitespace-nowrap">
              {currentLevel}/{totalLevels}
            </span>
          </div>

          {/* Lives */}
          <div className="flex items-center gap-0.5 bg-gradient-to-r from-pink-300 to-red-300 px-2 py-1 rounded-full border-2 border-white shadow-sm flex-shrink-0">
            {Array.from({ length: 3 }).map((_, index) => (
              <motion.div
                key={index}
                initial={{ scale: 1 }}
                animate={{
                  scale: index < lives ? 1 : 0.6,
                  opacity: index < lives ? 1 : 0.3,
                }}
                transition={{ duration: 0.15 }}
              >
                <Heart
                  className={`w-3.5 h-3.5 ${
                    index < lives
                      ? 'text-red-600 fill-red-500'
                      : 'text-gray-400'
                  }`}
                />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right Column: Sound Button */}
        <div className="flex justify-end">
          <motion.button
            onClick={toggleMute}
            className="flex items-center justify-center w-10 h-10 bg-white/60 backdrop-blur-md border-2 border-purple-200 rounded-full shadow-md cursor-pointer hover:bg-white active:scale-95 transition-all duration-100"
            aria-label={isMuted ? 'Unmute' : 'Mute'}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isMuted ? (
              <VolumeX className="w-5 h-5 text-purple-600" />
            ) : (
              <Volume2 className="w-5 h-5 text-purple-600" />
            )}
          </motion.button>
        </div>
      </div>
    </header>
  );
};
