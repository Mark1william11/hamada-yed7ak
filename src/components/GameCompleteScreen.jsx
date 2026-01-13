import { motion } from 'framer-motion';
import { Trophy, RotateCcw, Star, Sparkles, Award } from 'lucide-react';

/**
 * GameCompleteScreen Component
 * Final victory screen when all levels are completed
 */
export const GameCompleteScreen = ({ score, totalLevels, onPlayAgain }) => {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-yellow-900/98 via-purple-900/98 to-pink-900/98 backdrop-blur-lg">
      {/* Animated Stars Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          >
            <Star
              className="text-yellow-400/40"
              size={Math.random() * 20 + 10}
              fill="currentColor"
            />
          </motion.div>
        ))}
      </div>

      {/* Content */}
      <motion.div
        className="relative z-10 text-center px-8 py-12 max-w-md w-full"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      >
        {/* Trophy Icon */}
        <motion.div
          className="inline-flex items-center justify-center w-32 h-32 mb-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full shadow-2xl"
          animate={{
            rotate: [0, -5, 5, -5, 0],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        >
          <Trophy className="w-16 h-16 text-white" strokeWidth={2} />
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-7xl font-extrabold mb-3 gradient-text">
            مَبْرُوك!
          </h1>
          <p className="text-3xl font-bold text-white/90 mb-2">
            Game Complete!
          </p>
          <p className="text-white/70 mb-6">
            You've mastered all {totalLevels} levels
          </p>
        </motion.div>

        {/* Score Display */}
        <motion.div
          className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-2 border-yellow-400/50 rounded-3xl px-8 py-8 mb-8 backdrop-blur-sm"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-center gap-3 mb-3">
            <Sparkles className="w-6 h-6 text-yellow-400" />
            <span className="text-white/80 text-sm uppercase tracking-wider font-semibold">
              Final Score
            </span>
            <Sparkles className="w-6 h-6 text-yellow-400" />
          </div>
          <p className="text-6xl font-extrabold text-yellow-400 mb-2">
            {score}
          </p>
          <div className="flex items-center justify-center gap-2 text-white/60 text-sm">
            <Award className="w-4 h-4" />
            <span>Champion Status Achieved</span>
          </div>
        </motion.div>

        {/* Play Again Button */}
        <motion.button
          onClick={onPlayAgain}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-xl py-5 px-8 rounded-2xl shadow-2xl flex items-center justify-center gap-3 group transition-all duration-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          whileHover={{ scale: 1.02, boxShadow: '0 20px 40px rgba(147, 51, 234, 0.5)' }}
          whileTap={{ scale: 0.98 }}
        >
          <RotateCcw className="w-6 h-6 group-hover:rotate-180 transition-transform duration-500" />
          <span>Play Again</span>
        </motion.button>

        {/* Subtitle */}
        <motion.p
          className="text-white/40 text-sm mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          Challenge your friends to beat your score! 🎮
        </motion.p>
      </motion.div>

      {/* Floating Confetti Effect */}
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={`confetti-${i}`}
          className="absolute w-3 h-3 bg-yellow-400 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: '-5%',
          }}
          animate={{
            y: ['0vh', '110vh'],
            x: [0, (Math.random() - 0.5) * 100],
            rotate: [0, 360],
            opacity: [1, 0.5, 0],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  );
};
