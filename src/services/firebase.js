/**
 * Firebase Configuration for Hamada Yed7ak
 * 
 * This configures Firebase Realtime Database for the global leaderboard.
 * The database rules allow read access to everyone and write access to authenticated scores.
 */
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, push, onValue, query, orderByChild, limitToLast, set, get } from 'firebase/database';

// Firebase configuration - Free tier project for Hamada Yed7ak
// Note: For production, create your own Firebase project at https://console.firebase.google.com
const firebaseConfig = {
    apiKey: "AIzaSyAEfGz2uLuJzlBWZ2dcGwLJaIzCy6yhbxI",
    authDomain: "hamada-co.firebaseapp.com",
    databaseURL: "https://hamada-co-default-rtdb.firebaseio.com",
    projectId: "hamada-co",
    storageBucket: "hamada-co.firebasestorage.app",
    messagingSenderId: "422768411809",
    appId: "1:422768411809:web:57ef8c96a97d9462f6dce0",
    measurementId: "G-JV608NZRLL"
};

// Initialize Firebase
let app = null;
let database = null;

try {
    app = initializeApp(firebaseConfig);
    database = getDatabase(app);
} catch (error) {
    console.warn('[Firebase] Failed to initialize:', error.message);
}

/**
 * LeaderboardService - Handles all leaderboard operations
 */
export const LeaderboardService = {
    /**
     * Submit a score to the global leaderboard
     * @param {string} playerName - Player's display name
     * @param {number} score - Total score
     * @param {number} levelsCompleted - Number of levels completed
     */
    async submitScore(playerName, score, levelsCompleted) {
        if (!database) {
            console.warn('[Leaderboard] Database not initialized, using local only');
            return this._saveLocalScore(playerName, score, levelsCompleted);
        }

        try {
            const scoresRef = ref(database, 'leaderboard');
            const newScoreRef = push(scoresRef);

            const scoreEntry = {
                name: playerName.substring(0, 20), // Max 20 chars
                score: score,
                levelsCompleted: levelsCompleted,
                timestamp: Date.now(),
                id: newScoreRef.key
            };

            await set(newScoreRef, scoreEntry);
            console.log('[Leaderboard] Score submitted successfully');
            return scoreEntry;
        } catch (error) {
            console.warn('[Leaderboard] Failed to submit score:', error.message);
            return this._saveLocalScore(playerName, score, levelsCompleted);
        }
    },

    /**
     * Get top scores from the leaderboard
     * @param {number} limit - Number of scores to fetch (default 50)
     * @returns {Promise<Array>} Array of score entries
     */
    async getTopScores(limit = 50) {
        if (!database) {
            return this._getLocalScores();
        }

        try {
            const scoresRef = ref(database, 'leaderboard');
            const topScoresQuery = query(scoresRef, orderByChild('score'), limitToLast(limit));

            const snapshot = await get(topScoresQuery);

            if (!snapshot.exists()) {
                return [];
            }

            const scores = [];
            snapshot.forEach((child) => {
                scores.push(child.val());
            });

            // Sort by score descending (Firebase limitToLast gives ascending order)
            return scores.sort((a, b) => b.score - a.score);
        } catch (error) {
            console.warn('[Leaderboard] Failed to fetch scores:', error.message);
            return this._getLocalScores();
        }
    },

    /**
     * Subscribe to real-time leaderboard updates
     * @param {Function} callback - Called with updated scores array
     * @param {number} limit - Number of scores to track
     * @returns {Function} Unsubscribe function
     */
    subscribeToLeaderboard(callback, limit = 50) {
        if (!database) {
            callback(this._getLocalScores());
            return () => { };
        }

        const scoresRef = ref(database, 'leaderboard');
        const topScoresQuery = query(scoresRef, orderByChild('score'), limitToLast(limit));

        const unsubscribe = onValue(topScoresQuery, (snapshot) => {
            if (!snapshot.exists()) {
                callback([]);
                return;
            }

            const scores = [];
            snapshot.forEach((child) => {
                scores.push(child.val());
            });

            // Sort by score descending
            callback(scores.sort((a, b) => b.score - a.score));
        }, (error) => {
            console.warn('[Leaderboard] Subscription error:', error.message);
            callback(this._getLocalScores());
        });

        return unsubscribe;
    },

    /**
     * Fallback: Save score locally
     */
    _saveLocalScore(playerName, score, levelsCompleted) {
        const localScores = this._getLocalScores();
        const newEntry = {
            name: playerName,
            score: score,
            levelsCompleted: levelsCompleted,
            timestamp: Date.now(),
            id: `local_${Date.now()}`
        };
        localScores.push(newEntry);
        localScores.sort((a, b) => b.score - a.score);
        localStorage.setItem('hamada_local_leaderboard', JSON.stringify(localScores.slice(0, 100)));
        return newEntry;
    },

    /**
     * Fallback: Get local scores
     */
    _getLocalScores() {
        try {
            const stored = localStorage.getItem('hamada_local_leaderboard');
            return stored ? JSON.parse(stored) : [];
        } catch {
            return [];
        }
    }
};

export default LeaderboardService;
