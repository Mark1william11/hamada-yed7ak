import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Medal, Crown, X, RefreshCw, User, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';
import { LeaderboardService } from '../services/firebase';

/**
 * Leaderboard Component - Global Rankings
 * 
 * Features:
 * - Real-time sync with Firebase
 * - Top 50 players worldwide
 * - Highlights current player
 * - Medal icons for top 3
 */
export const Leaderboard = ({ isOpen, onClose, currentPlayerName }) => {
  const [scores, setScores] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Subscribe to real-time leaderboard updates
  useEffect(() => {
    if (!isOpen) return;

    setIsLoading(true);
    setError(null);

    const unsubscribe = LeaderboardService.subscribeToLeaderboard((newScores) => {
      setScores(newScores);
      setIsLoading(false);
    }, 50);

    return () => unsubscribe();
  }, [isOpen]);

  // Refresh leaderboard manually
  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      const newScores = await LeaderboardService.getTopScores(50);
      setScores(newScores);
    } catch (err) {
      setError('Failed to load leaderboard');
    }
    setIsLoading(false);
  };

  // Get rank icon based on position
  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Crown className="w-5 h-5 text-yellow-500 fill-yellow-400" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-400 fill-gray-300" />;
      case 3:
        return <Medal className="w-5 h-5 text-amber-600 fill-amber-500" />;
      default:
        return <span className="text-sm font-bold text-gray-500 w-5 text-center">{rank}</span>;
    }
  };

  // Get row style based on position
  const getRowStyle = (rank, isCurrentPlayer) => {
    if (isCurrentPlayer) {
      return 'bg-gradient-to-r from-purple-100 to-pink-100 border-2 border-purple-400';
    }
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-50 to-amber-50 border-2 border-yellow-400';
      case 2:
        return 'bg-gradient-to-r from-gray-50 to-slate-100 border-2 border-gray-300';
      case 3:
        return 'bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-400';
      default:
        return 'bg-white/80 border border-gray-200';
    }
  };

  // Format timestamp to relative time
  const formatTime = (timestamp) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[85vh] overflow-hidden flex flex-col"
          initial={{ scale: 0.9, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 50 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Trophy className="w-7 h-7 text-yellow-300" />
              <div>
                <h2 className="text-xl font-bold text-white">Leaderboard</h2>
                <p className="text-purple-200 text-xs">Top 50 Players Worldwide</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <motion.button
                onClick={handleRefresh}
                className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9, rotate: 180 }}
                disabled={isLoading}
              >
                <RefreshCw className={`w-5 h-5 text-white ${isLoading ? 'animate-spin' : ''}`} />
              </motion.button>
              <motion.button
                onClick={onClose}
                className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-5 h-5 text-white" />
              </motion.button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <RefreshCw className="w-10 h-10 text-purple-500 animate-spin mb-3" />
                <p className="text-gray-500">Loading rankings...</p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-12">
                <p className="text-red-500 mb-4">{error}</p>
                <button
                  onClick={handleRefresh}
                  className="px-4 py-2 bg-purple-500 text-white rounded-full hover:bg-purple-600 transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : scores.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Trophy className="w-12 h-12 text-gray-300 mb-3" />
                <p className="text-gray-500 text-center">No scores yet!</p>
                <p className="text-gray-400 text-sm">Be the first to submit your score</p>
              </div>
            ) : (
              <div className="space-y-2">
                {scores.map((entry, index) => {
                  const rank = index + 1;
                  const isCurrentPlayer = entry.name.toLowerCase() === currentPlayerName?.toLowerCase();

                  return (
                    <motion.div
                      key={entry.id || index}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl ${getRowStyle(rank, isCurrentPlayer)}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03 }}
                    >
                      {/* Rank */}
                      <div className="w-8 flex justify-center">
                        {getRankIcon(rank)}
                      </div>

                      {/* Player Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          <span className={`font-semibold truncate ${isCurrentPlayer ? 'text-purple-700' : 'text-gray-800'}`}>
                            {entry.name}
                            {isCurrentPlayer && <span className="text-purple-500 text-xs ml-1">(You)</span>}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-400 mt-0.5">
                          <span>Lvl {entry.levelsCompleted || '?'}</span>
                          <span>•</span>
                          <Clock className="w-3 h-3" />
                          <span>{formatTime(entry.timestamp)}</span>
                        </div>
                      </div>

                      {/* Score */}
                      <div className="flex items-center gap-1 bg-gradient-to-r from-yellow-400 to-orange-400 px-3 py-1 rounded-full shadow-sm">
                        <Trophy className="w-4 h-4 text-yellow-800" />
                        <span className="font-bold text-yellow-900">{entry.score}</span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
            <p className="text-center text-xs text-gray-500">
              🌍 Rankings update in real-time
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Leaderboard;
