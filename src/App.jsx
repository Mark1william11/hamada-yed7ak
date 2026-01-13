import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { GameHeader } from './components/GameHeader';
import { GameStage } from './components/GameStage';
import { OptionGrid } from './components/OptionGrid';
import { WinModal } from './components/WinModal';
import { MainMenu } from './components/MainMenu';
import { LevelSelect } from './components/LevelSelect';
import { SettingsModal } from './components/SettingsModal';
import { useGameLogic } from './hooks/useGameLogic';
import { useGameSettings } from './hooks/useGameSettings';
import { useGameProgress } from './hooks/useGameProgress';
import { gameLevels } from './data/gameData';
import { RefreshCw, Home, Loader, Volume2, VolumeX, Settings } from 'lucide-react';

// Game states
const GAME_STATE = {
  MENU: 'MENU',
  LEVEL_SELECT: 'LEVEL_SELECT',
  PLAYING: 'PLAYING',
};

/**
 * Main App Component - PREMIUM MOBILE GAME VERSION
 * Features:
 * - Dynamic animated background with floating particles
 * - Smooth state transitions with AnimatePresence
 * - Enhanced commercial break UI with countdown
 * - Sound toggle with persistent mute state
 * - Premium game juice and visual polish
 */
function App() {
  const [gameState, setGameState] = useState(GAME_STATE.MENU);
  const [selectedLevelIndex, setSelectedLevelIndex] = useState(0);
  const [showAd, setShowAd] = useState(false);
  const [adCountdown, setAdCountdown] = useState(3);
  const [showSettings, setShowSettings] = useState(false);
  
  const { isSoundMuted, toggleSound } = useGameSettings();
  const {
    progress,
    completeLevel,
    isLevelUnlocked,
    isLevelCompleted,
  } = useGameProgress(gameLevels.length);

  const {
    currentLevel,
    score,
    lives,
    isLevelComplete,
    selectedMouth,
    isShaking,
    gameOver,
    handleMouthSelect,
    handleResetGame,
    handleResetProgress,
    handleHardReset,
    isMuted,
    toggleMute,
    settings,
    updateSetting,
    updateSettings,
    gameState: hookGameState, // New: Rename to avoid conflict
    goHome, // New: Add goHome function
  } = useGameLogic(selectedLevelIndex);

  // State for hover preview
  const [previewMouth, setPreviewMouth] = useState(null);

  /**
   * Ad countdown timer effect
   */
  useEffect(() => {
    if (!showAd) return;
    
    setAdCountdown(3);
    const timer = setInterval(() => {
      setAdCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [showAd]);

  // Handle mouth hover for preview
  const handleMouthHover = (mouth) => {
    if (!isLevelComplete && !selectedMouth) {
      setPreviewMouth(mouth);
    }
  };

  // Start game from menu
  const handleStartGame = () => {
    setGameState(GAME_STATE.LEVEL_SELECT);
  };

  // Select a level from the level select screen
  const handleSelectLevel = (levelNumber) => {
    setSelectedLevelIndex(levelNumber - 1);
    handleResetGame();
    setGameState(GAME_STATE.PLAYING);
  };

  // Return to menu
  const handleBackToMenu = () => {
    handleResetGame();
    setGameState(GAME_STATE.MENU);
  };

  // Return to level select
  const handleBackToLevelSelect = () => {
    handleResetGame();
    setGameState(GAME_STATE.LEVEL_SELECT);
  };

  // Handle level completion
  const handleLevelWon = () => {
    const levelNumber = selectedLevelIndex + 1;
    completeLevel(levelNumber, score);
    
    // Show ad immediately
    setShowAd(true);
    
    // After 3 seconds, hide ad and advance
    setTimeout(() => {
      setShowAd(false);
      
      // Auto-advance to next level if available
      if (levelNumber < gameLevels.length && isLevelUnlocked(levelNumber + 1)) {
        setSelectedLevelIndex(levelNumber);
        handleResetGame();
      } else {
        // No more levels, back to level select
        handleBackToLevelSelect();
      }
    }, 3000);
  };

  return (
    <div className="min-h-[100dvh] w-full flex items-center justify-center p-2 sm:p-4 relative overflow-hidden">
      {/* Dynamic Animated Background */}
      <div className="fixed inset-0 -z-20 bg-gradient-to-br from-purple-100 via-blue-50 to-pink-100">
        {/* Floating particle background */}
        <motion.div
          className="absolute inset-0 opacity-40"
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'linear',
          }}
        >
          {/* Animated gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-300/20 to-transparent" />
        </motion.div>

        {/* Floating circles - Left side */}
        <motion.div
          className="absolute top-1/4 left-5 w-32 h-32 bg-purple-400/30 rounded-full blur-3xl"
          animate={{
            y: [0, 40, 0],
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Floating circles - Right side */}
        <motion.div
          className="absolute bottom-1/3 right-5 w-40 h-40 bg-pink-400/30 rounded-full blur-3xl"
          animate={{
            y: [0, -50, 0],
            scale: [1.1, 1, 1.1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1,
          }}
        />

        {/* Floating circles - Center top */}
        <motion.div
          className="absolute top-1/3 right-1/3 w-28 h-28 bg-blue-400/30 rounded-full blur-3xl"
          animate={{
            y: [0, 30, 0],
            x: [0, 20, 0],
            scale: [1, 1.15, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 2,
          }}
        />
      </div>

      {/* Phone Container - PREMIUM THEME */}
      <motion.div
        className="relative w-full max-w-md h-[100dvh] sm:h-[90vh] bg-white sm:rounded-3xl shadow-2xl overflow-hidden sm:border-4 border-purple-300 flex flex-col"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        {/* Sound Toggle - Top Right Corner */}
        <motion.button
          onClick={toggleMute}
          className="absolute top-4 right-4 z-40 bg-white/80 backdrop-blur-sm hover:bg-white p-2 sm:p-3 rounded-full shadow-lg border-2 border-purple-200"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? (
            <VolumeX className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
          ) : (
            <Volume2 className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
          )}
        </motion.button>

        {/* Settings Button - Top Left Corner (visible in menu/level select) */}
        {gameState !== GAME_STATE.PLAYING && (
          <motion.button
            onClick={() => setShowSettings(true)}
            className="absolute top-4 left-4 z-40 bg-white/80 backdrop-blur-sm hover:bg-white p-2 sm:p-3 rounded-full shadow-lg border-2 border-purple-200"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            title="Settings"
          >
            <Settings className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
          </motion.button>
        )}

        {/* Smooth State Transitions */}
        <AnimatePresence mode="wait">
          {/* MENU STATE */}
          {gameState === GAME_STATE.MENU && (
            <motion.div
              key="menu"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full"
            >
              <MainMenu
                onStartGame={handleStartGame}
                isSoundMuted={isMuted}
                onToggleSound={toggleMute}
                onOpenSettings={() => setShowSettings(true)}
              />
            </motion.div>
          )}

          {/* LEVEL SELECT STATE */}
          {gameState === GAME_STATE.LEVEL_SELECT && (
            <motion.div
              key="levelSelect"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full"
            >
              <LevelSelect
                levels={gameLevels}
                onSelectLevel={handleSelectLevel}
                onBack={handleBackToMenu}
                isLevelUnlocked={isLevelUnlocked}
                isLevelCompleted={isLevelCompleted}
              />
            </motion.div>
          )}

          {/* PLAYING STATE */}
          {gameState === GAME_STATE.PLAYING && (
            <motion.div
              key="playing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full flex flex-col"
            >
              {/* GAME OVER OVERLAY */}
              <AnimatePresence>
                {gameOver && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-red-300/98 via-pink-200/98 to-orange-200/98 backdrop-blur-lg"
                  >
                    <div className="text-center px-8 py-12">
                      <motion.div
                        className="inline-flex items-center justify-center w-24 h-24 mb-6 bg-gradient-to-br from-red-400 to-red-600 rounded-full shadow-2xl"
                        animate={{
                          rotate: [0, -10, 10, -10, 0],
                        }}
                        transition={{
                          duration: 0.5,
                          repeat: Infinity,
                          repeatDelay: 1,
                        }}
                      >
                        <span className="text-6xl">😢</span>
                      </motion.div>

                      <h1 className="text-5xl font-extrabold mb-4 text-red-600">
                        Oh No!
                      </h1>
                      <p className="text-xl text-gray-700 mb-2">
                        No lives remaining!
                      </p>
                      <p className="text-3xl font-bold text-purple-600 mb-8">
                        Score: <span className="text-orange-500">{score}</span>
                      </p>

                      <div className="space-y-3">
                        <motion.button
                          onClick={() => {
                            handleResetGame();
                          }}
                          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold text-lg py-4 px-8 rounded-3xl shadow-xl flex items-center justify-center gap-3 border-4 border-white"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <RefreshCw className="w-6 h-6" />
                          <span>Try Again</span>
                        </motion.button>

                        <motion.button
                          onClick={handleBackToLevelSelect}
                          className="w-full bg-white/80 hover:bg-white text-purple-600 font-semibold py-3 px-6 rounded-3xl border-4 border-purple-200 flex items-center justify-center gap-2"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Home className="w-5 h-5" />
                          <span>Level Select</span>
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* PLAYING CONTENT */}
              <div className="flex-none">
                <GameHeader
                  score={score}
                  lives={lives}
                  currentLevel={selectedLevelIndex + 1}
                  totalLevels={gameLevels.length}
                  gameState={gameState}
                  goHome={() => handleBackToMenu()} // New: Pass goHome callback
                  isMuted={isMuted} // New: Pass isMuted state
                  toggleMute={toggleMute} // New: Pass toggleMute function
                />
              </div>

              <div className="flex-1 min-h-0 flex flex-col bg-gradient-to-br from-purple-50 to-pink-50">
                <GameStage
                  level={currentLevel}
                  isLevelComplete={isLevelComplete}
                  isShaking={isShaking}
                  previewMouth={previewMouth}
                  selectedMouth={selectedMouth}
                />
              </div>

              <div className="flex-none">
                <OptionGrid
                  options={currentLevel.options}
                  selectedMouth={selectedMouth}
                  correctMouth={currentLevel.correctMouth}
                  isLevelComplete={isLevelComplete}
                  onMouthSelect={handleMouthSelect}
                  onMouthHover={handleMouthHover}
                />
              </div>

              {/* Win Modal */}
              <WinModal
                isOpen={isLevelComplete}
                score={score}
                currentLevel={selectedLevelIndex + 1}
                totalLevels={gameLevels.length}
                onNextLevel={handleLevelWon}
                onReplay={() => handleResetGame()}
                isGameWon={false}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* PREMIUM COMMERCIAL BREAK OVERLAY */}
        <AnimatePresence>
          {showAd && (
            <motion.div
              key="ad"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center"
            >
              <div className="text-center space-y-8">
                {/* Commercial Break Badge */}
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                  className="inline-block px-6 py-2 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full shadow-lg"
                >
                  <span className="text-sm font-bold text-gray-900">
                    ✨ COMMERCIAL BREAK ✨
                  </span>
                </motion.div>

                {/* Loading Spinner */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className="inline-block"
                >
                  <Loader className="w-20 h-20 text-white" />
                </motion.div>

                {/* Main Message */}
                <div>
                  <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-4xl font-black text-white mb-2"
                  >
                    Sponsored by
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
                  >
                    Hamada Co.
                  </motion.p>
                </div>

                {/* Countdown Timer */}
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="flex items-center justify-center"
                >
                  <div className="relative w-24 h-24 flex items-center justify-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                      className="absolute inset-0 rounded-full border-4 border-transparent border-t-yellow-400 border-r-orange-400"
                    />
                    <div className="text-center">
                      <div className="text-5xl font-black text-white">
                        {adCountdown}
                      </div>
                      <div className="text-xs font-bold text-gray-300">
                        seconds
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Fun tagline */}
                <motion.p
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-lg text-gray-300 font-semibold"
                >
                  Get ready for the next level! 🎮
                </motion.p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Settings Modal - Rendered at top level for full-screen overlay */}
      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        settings={settings}
        updateSetting={updateSetting}
        updateSettings={updateSettings}
        onResetProgress={handleResetProgress} // Updated: Changed from onHardReset
        gameState={gameState} // New: Pass gameState
        goHome={() => handleBackToMenu()} // New: Pass goHome callback
      />
    </div>
  );
}

export default App;
