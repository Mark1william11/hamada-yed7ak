import React, { useState, useCallback } from 'react';
import styles from './SettingsModal.module.css';
import {
  Volume2,
  VolumeX,
  Music,
  Vibrate,
  RotateCcw,
  X,
  AlertTriangle,
  Check,
  Home,
  Zap,
  Eye,
  ScanEye,
  Sparkles,
  Play,
  User,
  Edit3,
} from 'lucide-react';

// Import AudioManager for test sounds
import { AudioManager } from '../services/AudioManager';

/**
 * Premium Settings Modal Component
 * ALL SETTINGS ARE FUNCTIONAL:
 * 
 * PROFILE:
 * - Player Name: Editable name for leaderboard
 * 
 * AUDIO:
 * - Music Volume: Controls background music volume (0-100%)
 * - SFX Volume: Controls sound effects volume (correct/wrong sounds)
 * 
 * HAPTICS:
 * - Vibration Feedback: Enables/disables phone vibration on interactions
 * - Intensity: Controls how strong vibrations are (0-100%)
 * 
 * ACCESSIBILITY:
 * - High Contrast: Applies high-contrast color scheme for visibility
 * - Reduce Motion: Disables all animations for motion sensitivity
 * 
 * DATA MANAGEMENT:
 * - Reset All Progress: Clears level progress and scores
 */
export const SettingsModal = ({
  isOpen,
  onClose,
  settings,
  updateSetting,
  updateSettings,
  onResetProgress,
  gameState,
  goHome,
  playerName,
  setPlayerName,
}) => {
  const [confirmReset, setConfirmReset] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(playerName || '');

  const handleMusicVolumeChange = useCallback((e) => {
    const value = parseInt(e.target.value, 10);
    updateSetting('audio.musicVolume', value);
  }, [updateSetting]);

  const handleSfxVolumeChange = useCallback((e) => {
    const value = parseInt(e.target.value, 10);
    updateSetting('audio.sfxVolume', value);
  }, [updateSetting]);

  const handleTestSound = useCallback(() => {
    AudioManager.init();
    AudioManager.playClick();
  }, []);

  const handleHapticsToggle = useCallback(() => {
    updateSetting('haptics.enabled', !settings.haptics.enabled);
    // Trigger a test vibration when enabling
    if (!settings.haptics.enabled && navigator.vibrate) {
      navigator.vibrate(50);
    }
  }, [settings.haptics.enabled, updateSetting]);

  const handleHapticsIntensity = useCallback((e) => {
    const value = parseFloat(e.target.value);
    updateSetting('haptics.intensity', value);
    // Test vibration with new intensity
    if (settings.haptics.enabled && navigator.vibrate) {
      navigator.vibrate(Math.round(50 * value));
    }
  }, [updateSetting, settings.haptics.enabled]);

  const handleAccessibilityToggle = useCallback((key) => {
    const current = settings.accessibility[key];
    updateSetting(`accessibility.${key}`, !current);
  }, [settings.accessibility, updateSetting]);

  const handleResetClick = useCallback(async () => {
    if (!confirmReset) {
      setConfirmReset(true);
    } else {
      const success = onResetProgress();
      if (success) {
        setShowSuccess(true);
        setConfirmReset(false);
        setTimeout(() => {
          setShowSuccess(false);
          onClose();
        }, 2000);
      }
    }
  }, [confirmReset, onResetProgress, onClose]);

  const handleSaveName = useCallback(() => {
    if (tempName.trim()) {
      setPlayerName(tempName.trim());
      setIsEditingName(false);
    }
  }, [tempName, setPlayerName]);

  const handleCancelEdit = useCallback(() => {
    setTempName(playerName || '');
    setIsEditingName(false);
  }, [playerName]);

  if (!isOpen) return null;

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          {gameState !== 'MENU' && (
            <button
              className={styles.homeButton}
              onClick={goHome}
              aria-label="Back to Menu"
            >
              <Home size={24} />
            </button>
          )}
          <h1 className={styles.title}>Settings</h1>
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close settings"
          >
            <X size={24} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className={styles.content}>
          {/* Player Profile Section */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <User size={20} />
              Player Profile
            </h2>

            <div className={styles.settingItem}>
              <div className={styles.settingLabel}>
                <span>Your Name</span>
              </div>
              <p className={styles.settingDescription}>
                Displayed on the global leaderboard
              </p>
              
              {isEditingName ? (
                <div className={styles.nameInputContainer}>
                  <input
                    type="text"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    placeholder="Enter your name..."
                    maxLength={20}
                    className={styles.nameInput}
                    autoFocus
                    onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
                  />
                  <div className={styles.nameButtons}>
                    <button 
                      className={styles.saveButton}
                      onClick={handleSaveName}
                      disabled={!tempName.trim()}
                    >
                      <Check size={16} />
                      Save
                    </button>
                    <button 
                      className={styles.cancelButton}
                      onClick={handleCancelEdit}
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className={styles.nameDisplay}>
                  <span className={styles.playerNameText}>
                    {playerName || 'Not set'}
                  </span>
                  <button 
                    className={styles.editButton}
                    onClick={() => {
                      setTempName(playerName || '');
                      setIsEditingName(true);
                    }}
                  >
                    <Edit3 size={16} />
                    Edit
                  </button>
                </div>
              )}
            </div>
          </section>

          {/* Audio Section */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <Music size={20} />
              Audio
            </h2>

            {/* Music Volume */}
            <div className={styles.settingItem}>
              <div className={styles.settingLabel}>
                <span>Music Volume</span>
                <span className={styles.value}>{settings.audio.musicVolume}%</span>
              </div>
              <p className={styles.settingDescription}>
                Background music during gameplay
              </p>
              <div className={styles.sliderContainer}>
                <VolumeX size={14} className={styles.sliderIconSvg} />
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={settings.audio.musicVolume}
                  onChange={handleMusicVolumeChange}
                  className={styles.slider}
                  aria-label="Music volume"
                  style={{
                    background: `linear-gradient(to right, #A78BFA 0%, #A78BFA ${settings.audio.musicVolume}%, #E9D5FF ${settings.audio.musicVolume}%, #E9D5FF 100%)`
                  }}
                />
                <Volume2 size={14} className={styles.sliderIconSvg} />
              </div>
            </div>

            {/* SFX Volume */}
            <div className={styles.settingItem}>
              <div className={styles.settingLabel}>
                <span>Effects Volume</span>
                <span className={styles.value}>{settings.audio.sfxVolume}%</span>
              </div>
              <p className={styles.settingDescription}>
                Sound effects for correct/wrong answers
              </p>
              <div className={styles.sliderContainer}>
                <VolumeX size={14} className={styles.sliderIconSvg} />
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={settings.audio.sfxVolume}
                  onChange={handleSfxVolumeChange}
                  className={styles.slider}
                  aria-label="Effects volume"
                  style={{
                    background: `linear-gradient(to right, #60A5FA 0%, #60A5FA ${settings.audio.sfxVolume}%, #DBEAFE ${settings.audio.sfxVolume}%, #DBEAFE 100%)`
                  }}
                />
                <Volume2 size={14} className={styles.sliderIconSvg} />
              </div>
              {/* Test Sound Button */}
              <button 
                className={styles.testButton}
                onClick={handleTestSound}
                aria-label="Test sound effects"
              >
                <Play size={14} />
                Test Sound
              </button>
            </div>
          </section>

          {/* Haptics Section */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <Vibrate size={20} />
              Haptics
            </h2>

            {/* Haptics Toggle */}
            <div className={styles.settingItem}>
              <div className={styles.settingLabel}>
                <span>Vibration Feedback</span>
              </div>
              <p className={styles.settingDescription}>
                Phone vibrates on button taps and game events
              </p>
              <button
                className={`${styles.toggle} ${settings.haptics.enabled ? styles.toggleActive : ''}`}
                onClick={handleHapticsToggle}
                role="switch"
                aria-checked={settings.haptics.enabled}
                aria-label="Toggle vibration feedback"
              >
                <div className={styles.toggleSlider} />
              </button>
            </div>

            {/* Haptics Intensity */}
            {settings.haptics.enabled && (
              <div className={`${styles.settingItem} ${styles.settingItemIndented}`}>
                <div className={styles.settingLabel}>
                  <span>Vibration Intensity</span>
                  <span className={styles.value}>{Math.round(settings.haptics.intensity * 100)}%</span>
                </div>
                <div className={styles.sliderContainer}>
                  <Vibrate size={14} className={styles.sliderIconSvg} />
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={settings.haptics.intensity}
                    onChange={handleHapticsIntensity}
                    className={styles.slider}
                    aria-label="Vibration intensity"
                    style={{
                      background: `linear-gradient(to right, #FB923C 0%, #FB923C ${settings.haptics.intensity * 100}%, #FED7AA ${settings.haptics.intensity * 100}%, #FED7AA 100%)`
                    }}
                  />
                  <Zap size={14} className={styles.sliderIconSvg} />
                </div>
              </div>
            )}
          </section>

          {/* Accessibility Section */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <Eye size={20} />
              Accessibility
            </h2>

            <div className={styles.settingItem}>
              <div className={styles.settingLabel}>
                <span>High Contrast</span>
              </div>
              <p className={styles.settingDescription}>
                Increases color contrast for better visibility
              </p>
              <button
                className={`${styles.toggle} ${settings.accessibility.highContrast ? styles.toggleActive : ''}`}
                onClick={() => handleAccessibilityToggle('highContrast')}
                role="switch"
                aria-checked={settings.accessibility.highContrast}
                aria-label="Toggle high contrast mode"
              >
                <div className={styles.toggleSlider} />
              </button>
            </div>

            <div className={styles.settingItem}>
              <div className={styles.settingLabel}>
                <span>Reduce Motion</span>
              </div>
              <p className={styles.settingDescription}>
                Disables animations for motion sensitivity
              </p>
              <button
                className={`${styles.toggle} ${settings.accessibility.reduceMotion ? styles.toggleActive : ''}`}
                onClick={() => handleAccessibilityToggle('reduceMotion')}
                role="switch"
                aria-checked={settings.accessibility.reduceMotion}
                aria-label="Toggle reduce motion"
              >
                <div className={styles.toggleSlider} />
              </button>
            </div>
          </section>

          {/* Data Management Section */}
          <section className={`${styles.section} ${styles.dangerZone}`}>
            <h2 className={styles.sectionTitle}>
              <AlertTriangle size={20} />
              Danger Zone
            </h2>

            {showSuccess ? (
              <div className={styles.successMessage}>
                <Check size={18} />
                Progress Reset Successfully!
              </div>
            ) : (
              <>
                <button
                  className={`${styles.dangerButton} ${confirmReset ? styles.confirmButton : ''}`}
                  onClick={handleResetClick}
                >
                  <RotateCcw size={18} />
                  {confirmReset ? 'Tap Again to Confirm' : 'Reset All Progress'}
                </button>
                <p className={styles.dangerText}>
                  {confirmReset
                    ? 'This action cannot be undone. All level progress and scores will be deleted.'
                    : 'Deletes all unlocked levels, scores, and game progress. Settings are preserved.'
                  }
                </p>
              </>
            )}
          </section>

          {/* Footer Info */}
          <section className={styles.footer}>
            <div className={styles.credits}>
              <h3>Hamada Yed7ak</h3>
              <p>Version 1.0.0</p>
              <p>Made with ❤️ by Hamada Co</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
