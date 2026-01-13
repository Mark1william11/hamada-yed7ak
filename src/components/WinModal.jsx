import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, RotateCcw, ArrowRight, Star, Zap } from 'lucide-react';

/**
 * WinModal Component - COZY PLAYFUL VERSION
 * Level complete overlay with bubbly, friendly design
 */
export const WinModal = ({ 
  isOpen, 
  score, 
  currentLevel, 
  totalLevels, 
  onNextLevel, 
  onReplay 
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="absolute inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-purple-300/98 via-pink-300/98 to-orange-300/98 backdrop-blur-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Floating Stars */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {Array.from({ length: 15 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -50, 0],
                  rotate: [0, 360],
                  scale: [1, 1.5, 1],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              >
                <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
              </motion.div>
            ))}
          </div>

          {/* Content Container */}
          <motion.div
            className="relative z-10 text-center px-8 py-12 max-w-md w-full"
            initial={{ scale: 0.8, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 50 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          >
            {/* Trophy Icon */}
            <motion.div
              className="inline-flex items-center justify-center w-28 h-28 mb-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full shadow-2xl border-4 border-white"
              animate={{
                rotate: [0, -10, 10, -10, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                repeatType: 'reverse',
              }}
            >
              <Trophy className="w-14 h-14 text-white" strokeWidth={2.5} />
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              className="text-7xl font-extrabold mb-2 gradient-text drop-shadow-lg"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              ممتاز!
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              className="text-3xl text-purple-700 font-bold mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Level Complete!
            </motion.p>

            {/* Score Display */}
            <motion.div
              className="bg-white/90 backdrop-blur-sm border-4 border-yellow-400 rounded-3xl px-8 py-6 mb-8 shadow-xl"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center justify-center gap-3 mb-2">
                <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                <span className="text-purple-600 text-sm uppercase tracking-wider font-bold">
                  Score
                </span>
                <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
              </div>
              <p className="text-6xl font-extrabold text-orange-500">
                {score}
              </p>
            </motion.div>

            {/* Action Buttons */}
            <div className="space-y-3">
              {/* Next Level Button */}
              <motion.button
                onClick={onNextLevel}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold text-xl py-5 px-8 rounded-3xl shadow-xl flex items-center justify-center gap-3 group border-4 border-white"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(139, 92, 246, 0.5)' }}
                whileTap={{ scale: 0.95 }}
              >
                <Zap className="w-6 h-6 group-hover:animate-pulse" />
                <span>Next Level!</span>
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </motion.button>

              {/* Replay Button */}
              <motion.button
                onClick={onReplay}
                className="w-full bg-white/80 hover:bg-white backdrop-blur-sm text-purple-600 font-semibold py-4 px-6 rounded-3xl border-4 border-purple-200 flex items-center justify-center gap-2 shadow-lg"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <RotateCcw className="w-5 h-5" />
                <span>Replay Level</span>
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
