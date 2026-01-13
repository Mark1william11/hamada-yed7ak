import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';

/**
 * OptionGrid Component - PREMIUM MOBILE GAME VERSION
 * Grid of mouth options with 3D press effects and haptic feedback
 */
export const OptionGrid = ({ 
  options, 
  selectedMouth, 
  correctMouth, 
  isLevelComplete, 
  onMouthSelect,
  onMouthHover = null
}) => {
  return (
    <div className="w-full px-3 py-4 bg-gradient-to-b from-white/90 via-white/80 to-purple-50/60 backdrop-blur-sm border-t-4 border-purple-200 relative overflow-hidden">
      {/* Floating background particles */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        {Array.from({ length: 4 }).map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute rounded-full"
            style={{
              width: `${20 + i * 10}px`,
              height: `${20 + i * 10}px`,
              background: ['#A78BFA', '#60A5FA', '#FB923C', '#F472B6'][i % 4],
              filter: 'blur(8px)',
            }}
            animate={{
              x: [-50, 50, -50],
              y: [-30, 30, -30],
              scale: [0.8, 1.2, 0.8],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 5 + i,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute"
            style={{
              left: `${20 + i * 20}%`,
              top: `${10 + i * 15}%`,
            }}
          />
        ))}
      </div>

      <div className="max-w-md mx-auto relative z-10">
        <motion.h3 
          className="text-center text-purple-600 text-xs font-bold mb-3 uppercase tracking-wider"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          🎯 Choose the correct mouth
        </motion.h3>
        
        <div className="grid grid-cols-2 gap-3">
          {options.map((option, index) => {
            const isSelected = selectedMouth === option.id;
            const isCorrect = option.id === correctMouth;
            const showFeedback = isSelected && !isLevelComplete;
            const showCorrect = isLevelComplete && isCorrect;
            const isDisabled = isLevelComplete || selectedMouth !== null;

            return (
              <motion.button
                key={option.id}
                onClick={() => !isDisabled && onMouthSelect(option.id)}
                onMouseEnter={() => onMouthHover && onMouthHover(option)}
                onMouseLeave={() => onMouthHover && onMouthHover(null)}
                onTouchStart={() => onMouthHover && onMouthHover(option)}
                onTouchEnd={() => onMouthHover && onMouthHover(null)}
                disabled={isDisabled}
                className={`
                  relative overflow-hidden rounded-2xl h-20 sm:h-24
                  transition-shadow duration-150 transform shadow-lg
                  border-b-4
                  ${isLevelComplete 
                    ? isCorrect 
                      ? 'bg-gradient-to-br from-green-400 to-emerald-500 border-green-600 ring-4 ring-green-300 ring-offset-2' 
                      : 'bg-gray-200 border-gray-300 opacity-40'
                    : showFeedback
                      ? isCorrect
                        ? 'bg-gradient-to-br from-green-400 to-emerald-500 border-green-600 ring-4 ring-green-300 ring-offset-2'
                        : 'bg-gradient-to-br from-red-400 to-rose-500 border-red-600 ring-4 ring-red-300 ring-offset-2'
                      : 'bg-gradient-to-br from-purple-300 to-pink-300 border-purple-500 hover:border-purple-600 active:border-purple-300 active:shadow-md border-white'
                  }
                  ${!isDisabled ? 'cursor-pointer active:translate-y-1' : 'cursor-not-allowed'}
                `}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05, duration: 0.2 }}
                whileHover={!isDisabled ? { 
                  scale: 1.08,
                  rotate: 2,
                  transition: { duration: 0.15 }
                } : {}}
                whileTap={!isDisabled ? { 
                  scale: 0.92,
                  transition: { duration: 0.05 }
                } : {}}
              >
                {/* Mouth Image */}
                <img 
                  src={option.image} 
                  alt="Mouth option"
                  className="absolute inset-0 w-full h-full object-cover pointer-events-none rounded-2xl"
                />

                {/* Overlay gradient */}
                <div className={`absolute inset-0 transition-all duration-100 rounded-2xl ${
                  showFeedback || showCorrect 
                    ? 'bg-gradient-to-t from-black/50 to-transparent' 
                    : 'bg-gradient-to-t from-black/10 to-transparent'
                }`} />

                {/* Feedback Icons */}
                {(showFeedback || showCorrect) && (
                  <motion.div
                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center z-10"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  >
                    {isCorrect ? (
                      <Check className="w-5 h-5 text-green-600" strokeWidth={3} />
                    ) : (
                      <X className="w-5 h-5 text-red-600" strokeWidth={3} />
                    )}
                  </motion.div>
                )}

                {/* Pulse Ring for Correct Answer */}
                {showCorrect && (
                  <motion.div
                    className="absolute inset-0 rounded-2xl border-4 border-yellow-400 pointer-events-none"
                    animate={{
                      scale: [1, 1.04, 1],
                      opacity: [0.7, 1, 0.7],
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                    }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
