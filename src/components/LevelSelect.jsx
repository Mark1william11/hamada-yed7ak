import { motion } from 'framer-motion';
import { Lock, Star, Play, ChevronLeft } from 'lucide-react';

/**
 * LevelSelect Component - COZY PLAYFUL DESIGN
 * Grid of level buttons with locked/unlocked states
 */
export const LevelSelect = ({ 
  levels, 
  onSelectLevel, 
  onBack,
  isLevelUnlocked,
  isLevelCompleted 
}) => {
  return (
    <div className="absolute inset-0 z-40 bg-gradient-to-br from-purple-100 via-blue-50 to-pink-100 overflow-y-auto">
      {/* Floating Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-16 h-16 rounded-full opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: ['#A78BFA', '#60A5FA', '#FB923C', '#F472B6'][i % 4],
            }}
            animate={{
              y: [0, -30, 0],
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 px-4 py-6 max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <motion.button
            onClick={onBack}
            className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ delay: 0.0001 }}
          >
            <ChevronLeft className="w-5 h-5 text-purple-600" />
            <span className="text-purple-600 font-semibold text-sm">Back</span>
          </motion.button>

          <div className="text-center">
            <h2 className="text-2xl font-bold gradient-text">
              Select Level
            </h2>
          </div>

          <div className="w-20" /> {/* Spacer for centering */}
        </div>

        {/* Levels Grid */}
        <div className="grid grid-cols-3 gap-4 mt-8">
          {levels.map((level, index) => {
            const levelNumber = index + 1;
            const isUnlocked = isLevelUnlocked(levelNumber);
            const isCompleted = isLevelCompleted(levelNumber);

            return (
              <motion.button
                key={level.id}
                onClick={() => isUnlocked && onSelectLevel(levelNumber)}
                disabled={!isUnlocked}
                className={`
                  relative aspect-square rounded-3xl shadow-lg transition-all duration-200
                  ${isUnlocked 
                    ? 'bg-gradient-to-br from-purple-400 to-pink-400 hover:shadow-xl cursor-pointer' 
                    : 'bg-gray-300 cursor-not-allowed opacity-50'
                  }
                  ${isCompleted ? 'ring-4 ring-yellow-400 ring-offset-2' : ''}
                `}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                whileHover={isUnlocked ? { scale: 1.1, rotate: 5 } : {}}
                whileTap={isUnlocked ? { scale: 0.95, rotate: 0 } : {}}
              >
                {/* Background Shine Effect */}
                {isUnlocked && (
                  <div className="absolute inset-0 rounded-3xl overflow-hidden">
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/30 to-white/0"
                      animate={{
                        x: ['-100%', '100%'],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatDelay: 1,
                      }}
                    />
                  </div>
                )}

                {/* Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  {!isUnlocked ? (
                    // Locked State
                    <Lock className="w-8 h-8 text-gray-500" />
                  ) : isCompleted ? (
                    // Completed State
                    <>
                      <motion.div
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                      >
                        <Star className="w-10 h-10 text-yellow-300 fill-yellow-300 drop-shadow-lg" />
                      </motion.div>
                      <span className="text-white font-bold text-lg mt-1 drop-shadow-md">
                        {levelNumber}
                      </span>
                    </>
                  ) : (
                    // Unlocked State
                    <>
                      <Play className="w-6 h-6 text-white mb-1 drop-shadow-md" fill="white" />
                      <span className="text-white font-bold text-2xl drop-shadow-md">
                        {levelNumber}
                      </span>
                    </>
                  )}
                </div>

                {/* Pulse animation for unlocked but not completed */}
                {isUnlocked && !isCompleted && (
                  <motion.div
                    className="absolute inset-0 rounded-3xl border-4 border-white/50"
                    animate={{
                      scale: [1, 1.1, 1],
                      opacity: [0.5, 0, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                    }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Progress Summary */}
        <motion.div
          className="mt-8 bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between">
            <div className="text-center flex-1">
              <div className="text-3xl font-bold text-purple-600">
                {levels.filter((_, i) => isLevelCompleted(i + 1)).length}
              </div>
              <div className="text-xs text-gray-600 uppercase tracking-wide">
                Completed
              </div>
            </div>
            <div className="w-px h-12 bg-gray-300" />
            <div className="text-center flex-1">
              <div className="text-3xl font-bold text-blue-600">
                {levels.filter((_, i) => isLevelUnlocked(i + 1)).length}
              </div>
              <div className="text-xs text-gray-600 uppercase tracking-wide">
                Unlocked
              </div>
            </div>
            <div className="w-px h-12 bg-gray-300" />
            <div className="text-center flex-1">
              <div className="text-3xl font-bold text-pink-600">
                {levels.length}
              </div>
              <div className="text-xs text-gray-600 uppercase tracking-wide">
                Total
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bottom Spacing for Mobile */}
        <div className="h-8" />
      </div>
    </div>
  );
};
