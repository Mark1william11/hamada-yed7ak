import { motion } from 'framer-motion';
import { Check, X, Target } from 'lucide-react';

/**
 * OptionGrid Component - REFACTORED VERSION
 * 
 * Changes:
 * - Replaced emoji with Lucide Target icon
 * - Added max-height constraint for mobile
 * - Faster animation transitions for snappier feel
 * - Safe area padding for notched phones
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
    <div className="w-full px-3 py-3 bg-gradient-to-b from-white/90 via-white/80 to-purple-50/60 backdrop-blur-sm border-t-4 border-purple-200 relative overflow-hidden max-h-[180px] flex-shrink-0 pb-safe">
      <div className="max-w-md mx-auto relative z-10">
        {/* Header with SVG icon instead of emoji */}
        <motion.h3 
          className="text-center text-purple-600 text-xs font-bold mb-2 uppercase tracking-wider flex items-center justify-center gap-1.5"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <Target className="w-3.5 h-3.5" />
          <span>Choose the correct mouth</span>
        </motion.h3>
        
        <div className="grid grid-cols-2 gap-2">
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
                  relative overflow-hidden rounded-xl h-16 sm:h-20
                  transition-all duration-100 transform shadow-md
                  border-b-4
                  ${isLevelComplete 
                    ? isCorrect 
                      ? 'bg-gradient-to-br from-green-400 to-emerald-500 border-green-600 ring-4 ring-green-300 ring-offset-1' 
                      : 'bg-gray-200 border-gray-300 opacity-40'
                    : showFeedback
                      ? isCorrect
                        ? 'bg-gradient-to-br from-green-400 to-emerald-500 border-green-600 ring-4 ring-green-300 ring-offset-1'
                        : 'bg-gradient-to-br from-red-400 to-rose-500 border-red-600 ring-4 ring-red-300 ring-offset-1'
                      : 'bg-gradient-to-br from-purple-300 to-pink-300 border-purple-500 hover:border-purple-600 active:border-purple-300 active:shadow-sm border-white'
                  }
                  ${!isDisabled ? 'cursor-pointer active:translate-y-0.5' : 'cursor-not-allowed'}
                `}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 + index * 0.03, duration: 0.15 }}
                whileHover={!isDisabled ? { 
                  scale: 1.05,
                  rotate: 1,
                  transition: { duration: 0.1 }
                } : {}}
                whileTap={!isDisabled ? { 
                  scale: 0.95,
                  transition: { duration: 0.03 }
                } : {}}
              >
                {/* Mouth Image */}
                <img 
                  src={option.image} 
                  alt="Mouth option"
                  className="absolute inset-0 w-full h-full object-cover pointer-events-none rounded-xl"
                />

                {/* Overlay gradient */}
                <div className={`absolute inset-0 transition-all duration-75 rounded-xl ${
                  showFeedback || showCorrect 
                    ? 'bg-gradient-to-t from-black/50 to-transparent' 
                    : 'bg-gradient-to-t from-black/10 to-transparent'
                }`} />

                {/* Feedback Icons */}
                {(showFeedback || showCorrect) && (
                  <motion.div
                    className="absolute top-1.5 right-1.5 w-7 h-7 rounded-full bg-white shadow-lg flex items-center justify-center z-10"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  >
                    {isCorrect ? (
                      <Check className="w-4 h-4 text-green-600" strokeWidth={3} />
                    ) : (
                      <X className="w-4 h-4 text-red-600" strokeWidth={3} />
                    )}
                  </motion.div>
                )}

                {/* Pulse Ring for Correct Answer */}
                {showCorrect && (
                  <motion.div
                    className="absolute inset-0 rounded-xl border-3 border-yellow-400 pointer-events-none"
                    animate={{
                      scale: [1, 1.03, 1],
                      opacity: [0.7, 1, 0.7],
                    }}
                    transition={{
                      duration: 0.8,
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
