import { motion } from 'framer-motion';
import { Play, Settings, Sparkles } from 'lucide-react';
import { useState } from 'react';

/**
 * MainMenu Component - PREMIUM MOBILE GAME VERSION
 * Opening screen with 3D press effects and haptic feedback
 */
export const MainMenu = ({ onStartGame, isSoundMuted, onToggleSound, onOpenSettings }) => {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-purple-100 via-blue-50 to-pink-100">
      {/* Animated Background Circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 10 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full opacity-30"
            style={{
              width: `${Math.random() * 150 + 50}px`,
              height: `${Math.random() * 150 + 50}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: ['#A78BFA', '#60A5FA', '#FB923C', '#F472B6'][i % 4],
            }}
            animate={{
              y: [0, -40, 0],
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <motion.div
        className="relative z-10 text-center px-8 w-full max-w-md"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        {/* Logo / Title */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="mb-8"
        >
          <motion.div
            animate={{ rotate: [0, -5, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
          >
            <h1 className="text-6xl font-extrabold mb-3 gradient-text drop-shadow-lg">
              حمادة يضحك
            </h1>
          </motion.div>
          <p className="text-3xl font-bold text-purple-600 mb-2">
            Hamada Yed7ak
          </p>
          <p className="text-sm text-purple-500 uppercase tracking-widest flex items-center gap-2 justify-center">
            <Sparkles className="w-4 h-4" />
            Face Fixer Challenge
            <Sparkles className="w-4 h-4" />
          </p>
        </motion.div>

        {/* Settings Panel */}
        {showSettings ? (
          <motion.div
            className="bg-white/90 backdrop-blur-md rounded-3xl p-6 mb-6 border-4 border-purple-200 shadow-xl"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <h3 className="text-purple-700 font-bold text-xl mb-4 flex items-center gap-2 justify-center">
              <Settings className="w-6 h-6" />
              Settings
            </h3>

            {/* Sound Toggle */}
            <button
              onClick={onToggleSound}
              className="w-full bg-purple-100 hover:bg-purple-200 rounded-2xl p-4 flex items-center justify-between transition-all duration-200 active:bg-purple-300 active:translate-y-1"
            >
              <span className="text-purple-700 font-semibold">
                🔊 Sound Effects
              </span>
              <div className={`w-14 h-7 rounded-full transition-all duration-200 ${
                isSoundMuted ? 'bg-gray-300' : 'bg-green-400'
              } relative`}>
                <motion.div
                  className="absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-lg"
                  animate={{ left: isSoundMuted ? '2px' : '30px' }}
                  transition={{ duration: 0.2, type: 'spring' }}
                />
              </div>
            </button>

            <button
              onClick={() => setShowSettings(false)}
              className="mt-4 text-sm text-purple-500 hover:text-purple-700 font-semibold"
            >
              ← Back
            </button>
          </motion.div>
        ) : (
          <motion.div
            className="flex flex-col items-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {/* Start Game Button - 3D Press Effect */}
            <motion.button
              onClick={onStartGame}
              className="
                rounded-full
                border-4 border-white
                border-b-8
                bg-gradient-to-r from-purple-500 to-pink-500
                shadow-xl
                box-border
                will-change-transform
                transition-all duration-150
                active:border-b-2
                active:shadow-sm
                active:translate-y-1
              "
              whileHover={{ 
                scale: 1.06,
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)',
                transition: { duration: 0.15 }
              }}
              whileTap={{ 
                scale: 0.95,
                transition: { duration: 0.05 }
              }}
            >
              <span
                className="
                  flex items-center
                  gap-4
                  pl-10 pr-14
                  py-5
                  min-h-[68px]
                  text-white font-bold text-2xl
                  tracking-wide
                "
              >
                <span className="flex items-center justify-center w-11 h-11 rounded-full bg-white/20">
                  <Play className="w-6 h-6 fill-white" />
                </span>

                <span>Start Game!</span>
              </span>
            </motion.button>


            {/* Settings Button - 3D Press Effect */}
            {onOpenSettings && (
              <motion.button
                onClick={onOpenSettings}
                className="
                  max-w-xs
                  bg-white/80
                  hover:bg-white
                  backdrop-blur-sm
                  text-purple-600
                  font-semibold
                  py-4 px-6
                  rounded-3xl
                  border-4 border-purple-200
                  border-b-4 border-b-purple-400
                  flex items-center justify-center gap-2
                  transition-all duration-150
                  shadow-lg
                  active:border-b-2
                  active:shadow-sm
                  active:translate-y-1
                "
                whileHover={{ 
                  scale: 1.05,
                  transition: { duration: 0.15 }
                }}
                whileTap={{ 
                  scale: 0.93,
                  transition: { duration: 0.05 }
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.0001 }}
              >
                <Settings className="w-5 h-5" />
                <span>Settings</span>
              </motion.button>
            )}
          </motion.div>
        )}

        {/* Version */}
        <motion.p
          className="text-purple-400 text-xs mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          v1.0.0 • Made with ❤️
        </motion.p>
      </motion.div>
    </div>
  );
};

export default MainMenu;
