import { motion } from 'framer-motion';
import { Loader } from 'lucide-react';

/**
 * LoadingTransition Component
 * 
 * Full-screen loading overlay shown between levels while assets load.
 * Displays animated spinner and progress.
 */
export const LoadingTransition = ({ progress = 0, message = "Loading..." }) => {
  return (
    <motion.div
      className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-purple-100 via-blue-50 to-pink-100"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Animated Background Circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute rounded-full opacity-30"
            style={{
              width: `${120 + i * 40}px`,
              height: `${120 + i * 40}px`,
              left: `${20 + i * 25}%`,
              top: `${30 + i * 15}%`,
              background: ['#A78BFA', '#60A5FA', '#F472B6'][i],
            }}
            animate={{
              y: [0, -30, 0],
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 3 + i,
              repeat: Infinity,
              delay: i * 0.5,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 text-center">
        {/* Spinner */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          className="inline-block mb-6"
        >
          <div className="w-16 h-16 rounded-full border-4 border-purple-200 border-t-purple-500 border-r-pink-500" />
        </motion.div>

        {/* Message */}
        <motion.h2
          className="text-2xl font-bold text-purple-600 mb-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {message}
        </motion.h2>

        {/* Progress Bar */}
        <motion.div
          className="w-48 h-2 bg-white/50 rounded-full overflow-hidden mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <motion.div
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </motion.div>

        {/* Progress Text */}
        <motion.p
          className="text-sm text-purple-400 mt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {progress}%
        </motion.p>
      </div>
    </motion.div>
  );
};

export default LoadingTransition;
