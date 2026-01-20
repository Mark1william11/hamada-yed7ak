/**
 * AudioManager - Centralized Audio Controller
 * 
 * Handles both Music (BGM) and SFX with separate volume controls.
 * Uses Web Audio API for programmatic sound generation (no external files needed).
 * 
 * Features:
 * - Separate Music & SFX channels with independent volume
 * - Programmatically generated SFX (no mp3 files required)
 * - BGM support via external URL or local file
 * - Fade in/out for music transitions
 * - Singleton pattern for global access
 */

class AudioManagerClass {
    constructor() {
        this.audioContext = null;
        this.masterGain = null;
        this.musicGain = null;
        this.sfxGain = null;

        // Volume state (0-100)
        this.musicVolume = 70;
        this.sfxVolume = 80;
        this.isMusicMuted = false;
        this.isSfxMuted = false;

        // BGM state
        this.bgmSource = null;
        this.bgmBuffer = null;
        this.isBgmPlaying = false;

        // Initialize on first user interaction (required by browsers)
        this.initialized = false;
    }

    /**
     * Initialize the audio context (must be called after user interaction)
     */
    init() {
        if (this.initialized) return;

        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();

            // Create gain nodes for volume control
            this.masterGain = this.audioContext.createGain();
            this.musicGain = this.audioContext.createGain();
            this.sfxGain = this.audioContext.createGain();

            // Connect: sources -> channel gains -> master -> destination
            this.musicGain.connect(this.masterGain);
            this.sfxGain.connect(this.masterGain);
            this.masterGain.connect(this.audioContext.destination);

            // Apply initial volumes
            this.setMusicVolume(this.musicVolume);
            this.setSfxVolume(this.sfxVolume);

            this.initialized = true;
            console.log('[AudioManager] Initialized successfully');
        } catch (err) {
            console.warn('[AudioManager] Failed to initialize:', err);
        }
    }

    /**
     * Ensure audio context is ready (resume if suspended)
     */
    async ensureReady() {
        if (!this.initialized) this.init();
        if (this.audioContext?.state === 'suspended') {
            await this.audioContext.resume();
        }
    }

    /**
     * Set music volume (0-100)
     */
    setMusicVolume(volume) {
        this.musicVolume = Math.max(0, Math.min(100, volume));
        if (this.musicGain) {
            const gain = this.isMusicMuted ? 0 : this.musicVolume / 100;
            this.musicGain.gain.setTargetAtTime(gain, this.audioContext.currentTime, 0.1);
        }
    }

    /**
     * Set SFX volume (0-100)
     */
    setSfxVolume(volume) {
        this.sfxVolume = Math.max(0, Math.min(100, volume));
        if (this.sfxGain) {
            const gain = this.isSfxMuted ? 0 : this.sfxVolume / 100;
            this.sfxGain.gain.setTargetAtTime(gain, this.audioContext.currentTime, 0.1);
        }
    }

    /**
     * Toggle music mute
     */
    toggleMusicMute() {
        this.isMusicMuted = !this.isMusicMuted;
        this.setMusicVolume(this.musicVolume);
        return this.isMusicMuted;
    }

    /**
     * Toggle SFX mute
     */
    toggleSfxMute() {
        this.isSfxMuted = !this.isSfxMuted;
        this.setSfxVolume(this.sfxVolume);
        return this.isSfxMuted;
    }

    /**
     * Toggle all audio mute
     */
    toggleMute() {
        const shouldMute = !this.isMusicMuted || !this.isSfxMuted;
        this.isMusicMuted = shouldMute;
        this.isSfxMuted = shouldMute;
        this.setMusicVolume(this.musicVolume);
        this.setSfxVolume(this.sfxVolume);
        return shouldMute;
    }

    /**
     * Check if all audio is muted
     */
    isMuted() {
        return this.isMusicMuted && this.isSfxMuted;
    }

    // =====================================
    // SFX - Programmatically Generated
    // =====================================

    /**
     * Play a success/correct sound (cheerful ascending tone)
     */
    async playCorrect() {
        await this.ensureReady();
        this._playTone([523.25, 659.25, 783.99], 0.12, 'sine', 0.4); // C5 -> E5 -> G5
    }

    /**
     * Play a wrong/error sound (descending buzz)
     */
    async playWrong() {
        await this.ensureReady();
        this._playTone([311.13, 233.08], 0.15, 'sawtooth', 0.25); // Eb4 -> Bb3
    }

    /**
     * Play a level complete fanfare
     */
    async playLevelComplete() {
        await this.ensureReady();
        // Triumphant chord progression
        const now = this.audioContext.currentTime;
        this._playToneAt([523.25], 0.2, 'sine', 0.35, now);      // C5
        this._playToneAt([659.25], 0.2, 'sine', 0.35, now + 0.1); // E5
        this._playToneAt([783.99], 0.2, 'sine', 0.35, now + 0.2); // G5
        this._playToneAt([1046.5], 0.3, 'sine', 0.4, now + 0.3);  // C6
    }

    /**
     * Play a click sound (short pop)
     */
    async playClick() {
        await this.ensureReady();
        this._playTone([800, 600], 0.05, 'sine', 0.15);
    }

    /**
     * Play a hover sound (soft blip)
     */
    async playHover() {
        await this.ensureReady();
        this._playTone([1200], 0.03, 'sine', 0.08);
    }

    /**
     * Play game over sound
     */
    async playGameOver() {
        await this.ensureReady();
        const now = this.audioContext.currentTime;
        this._playToneAt([392], 0.3, 'triangle', 0.3, now);        // G4
        this._playToneAt([349.23], 0.3, 'triangle', 0.3, now + 0.2); // F4
        this._playToneAt([329.63], 0.4, 'triangle', 0.3, now + 0.4); // E4
        this._playToneAt([293.66], 0.5, 'triangle', 0.35, now + 0.6); // D4
    }

    /**
     * Internal: Play a sequence of tones
     */
    _playTone(frequencies, duration, type = 'sine', volume = 0.3) {
        this._playToneAt(frequencies, duration, type, volume, this.audioContext.currentTime);
    }

    /**
     * Internal: Play tones at specific time
     */
    _playToneAt(frequencies, duration, type, volume, startTime) {
        if (!this.audioContext || this.isSfxMuted || this.sfxVolume === 0) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.type = type;
        oscillator.connect(gainNode);
        gainNode.connect(this.sfxGain);

        // Schedule frequency changes
        const freqStep = duration / frequencies.length;
        frequencies.forEach((freq, i) => {
            oscillator.frequency.setValueAtTime(freq, startTime + i * freqStep);
        });

        // Envelope: quick attack, sustain, quick release
        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(volume, startTime + 0.01);
        gainNode.gain.setValueAtTime(volume, startTime + duration - 0.02);
        gainNode.gain.linearRampToValueAtTime(0, startTime + duration);

        oscillator.start(startTime);
        oscillator.stop(startTime + duration + 0.05);
    }

    // =====================================
    // BGM - Background Music
    // =====================================

    /**
     * Load and play background music from URL
     * @param {string} url - URL to audio file (mp3, ogg, etc.)
     * @param {boolean} loop - Whether to loop the music
     */
    async playBGM(url, loop = true) {
        await this.ensureReady();

        // Stop current BGM if playing
        this.stopBGM();

        try {
            const response = await fetch(url);
            const arrayBuffer = await response.arrayBuffer();
            this.bgmBuffer = await this.audioContext.decodeAudioData(arrayBuffer);

            this.bgmSource = this.audioContext.createBufferSource();
            this.bgmSource.buffer = this.bgmBuffer;
            this.bgmSource.loop = loop;
            this.bgmSource.connect(this.musicGain);

            this.bgmSource.start(0);
            this.isBgmPlaying = true;

            console.log('[AudioManager] BGM started');
        } catch (err) {
            console.warn('[AudioManager] Failed to load BGM:', err);
        }
    }

    /**
     * Stop background music
     */
    stopBGM() {
        if (this.bgmSource && this.isBgmPlaying) {
            try {
                this.bgmSource.stop();
            } catch (e) {
                // Already stopped
            }
            this.bgmSource = null;
            this.isBgmPlaying = false;
        }
    }

    /**
     * Fade out and stop BGM
     */
    fadeOutBGM(duration = 1) {
        if (!this.musicGain || !this.isBgmPlaying) return;

        const now = this.audioContext.currentTime;
        this.musicGain.gain.setValueAtTime(this.musicGain.gain.value, now);
        this.musicGain.gain.linearRampToValueAtTime(0, now + duration);

        setTimeout(() => {
            this.stopBGM();
            this.setMusicVolume(this.musicVolume); // Restore volume
        }, duration * 1000);
    }

    /**
     * Get current state for persistence
     */
    getState() {
        return {
            musicVolume: this.musicVolume,
            sfxVolume: this.sfxVolume,
            isMusicMuted: this.isMusicMuted,
            isSfxMuted: this.isSfxMuted,
        };
    }

    /**
     * Restore state from persistence
     */
    restoreState(state) {
        if (state.musicVolume !== undefined) this.musicVolume = state.musicVolume;
        if (state.sfxVolume !== undefined) this.sfxVolume = state.sfxVolume;
        if (state.isMusicMuted !== undefined) this.isMusicMuted = state.isMusicMuted;
        if (state.isSfxMuted !== undefined) this.isSfxMuted = state.isSfxMuted;

        if (this.initialized) {
            this.setMusicVolume(this.musicVolume);
            this.setSfxVolume(this.sfxVolume);
        }
    }
}

// Singleton instance
export const AudioManager = new AudioManagerClass();

export default AudioManager;
