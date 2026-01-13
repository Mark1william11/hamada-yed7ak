import React, { useState, useCallback } from 'react';
import styles from './SettingsModal.module.css';
import {
  Volume2,
  Music,
  Vibrate,
  RotateCcw,
  X,
  AlertTriangle,
  Check,
  Home, // New: Import Home icon
} from 'lucide-react';

/**
 * Premium Settings Modal Component
 * Integrates with useGameLogic settings state
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Modal visibility
 * @param {Function} props.onClose - Callback when modal closes
 * @param {Object} props.settings - Settings object from useGameLogic
 * @param {Function} props.updateSetting - Update single setting
 * @param {Function} props.updateSettings - Update multiple settings
 * @param {Function} props.onResetProgress - Trigger progress reset
 * @param {string} props.gameState - Current state of the game
 * @param {Function} props.goHome - Navigate to home/menu
 */
export const SettingsModal = ({
  isOpen,
  onClose,
  settings,
  updateSetting,
  updateSettings,
  onResetProgress,
  gameState, // New: Add gameState prop
  goHome, // New: Add goHome prop
}) => {
  const [confirmReset, setConfirmReset] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleMusicVolumeChange = useCallback((e) => {
    const value = parseInt(e.target.value, 10);
    updateSetting('audio.musicVolume', value);
  }, [updateSetting]);

  const handleSfxVolumeChange = useCallback((e) => {
    const value = parseInt(e.target.value, 10);
    updateSetting('audio.sfxVolume', value);
  }, [updateSetting]);

  const handleHapticsToggle = useCallback(() => {
    updateSetting('haptics.enabled', !settings.haptics.enabled);
  }, [settings.haptics.enabled, updateSetting]);

  const handleHapticsIntensity = useCallback((e) => {
    const value = parseFloat(e.target.value);
    updateSetting('haptics.intensity', value);
  }, [updateSetting]);

  const handleAccessibilityToggle = useCallback((key) => {
    const current = settings.accessibility[key];
    updateSetting(`accessibility.${key}`, !current);
  }, [settings.accessibility, updateSetting]);

  const handleResetClick = useCallback(async () => {
    if (!confirmReset) {
      setConfirmReset(true);
    } else {
      const success = onResetProgress(); // Call resetProgress and check success
      if (success) {
        setShowSuccess(true);
        setConfirmReset(false);
        setTimeout(() => {
          setShowSuccess(false);
          onClose(); // Auto-close modal on success
        }, 2000);
      }
    }
  }, [confirmReset, onResetProgress, onClose]);

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
              <div className={styles.sliderContainer}>
                <span className={styles.sliderIcon}>🔇</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={settings.audio.musicVolume}
                  onChange={handleMusicVolumeChange}
                  className={styles.slider}
                  style={{
                    background: `linear-gradient(to right, #A78BFA 0%, #A78BFA ${settings.audio.musicVolume}%, #E9D5FF ${settings.audio.musicVolume}%, #E9D5FF 100%)`
                  }}
                />
                <span className={styles.sliderIcon}>🔊</span>
              </div>
            </div>

            {/* SFX Volume */}
            <div className={styles.settingItem}>
              <div className={styles.settingLabel}>
                <span>Effects Volume</span>
                <span className={styles.value}>{settings.audio.sfxVolume}%</span>
              </div>
              <div className={styles.sliderContainer}>
                <span className={styles.sliderIcon}>🔇</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={settings.audio.sfxVolume}
                  onChange={handleSfxVolumeChange}
                  className={styles.slider}
                  style={{
                    background: `linear-gradient(to right, #60A5FA 0%, #60A5FA ${settings.audio.sfxVolume}%, #DBEAFE ${settings.audio.sfxVolume}%, #DBEAFE 100%)`
                  }}
                />
                <span className={styles.sliderIcon}>🔊</span>
              </div>
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
              <button
                className={`${styles.toggle} ${settings.haptics.enabled ? styles.toggleActive : ''}`}
                onClick={handleHapticsToggle}
                role="switch"
                aria-checked={settings.haptics.enabled}
              >
                <div className={styles.toggleSlider} />
              </button>
            </div>

            {/* Haptics Intensity */}
            {settings.haptics.enabled && (
              <div className={`${styles.settingItem} ${styles.settingItemIndented}`}>
                <div className={styles.settingLabel}>
                  <span>Intensity</span>
                  <span className={styles.value}>{Math.round(settings.haptics.intensity * 100)}%</span>
                </div>
                <div className={styles.sliderContainer}>
                  <span className={styles.sliderIcon}>🤲</span>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={settings.haptics.intensity}
                    onChange={handleHapticsIntensity}
                    className={styles.slider}
                    style={{
                      background: `linear-gradient(to right, #FB923C 0%, #FB923C ${settings.haptics.intensity * 100}%, #FED7AA ${settings.haptics.intensity * 100}%, #FED7AA 100%)`
                    }}
                  />
                  <span className={styles.sliderIcon}>💥</span>
                </div>
              </div>
            )}
          </section>

          {/* Accessibility Section */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              ♿ Accessibility
            </h2>

            <div className={styles.settingItem}>
              <div className={styles.settingLabel}>
                <span>Screen Reader Mode</span>
              </div>
              <button
                className={`${styles.toggle} ${settings.accessibility.screenReaderMode ? styles.toggleActive : ''}`}
                onClick={() => handleAccessibilityToggle('screenReaderMode')}
                role="switch"
                aria-checked={settings.accessibility.screenReaderMode}
              >
                <div className={styles.toggleSlider} />
              </button>
            </div>

            <div className={styles.settingItem}>
              <div className={styles.settingLabel}>
                <span>High Contrast</span>
              </div>
              <button
                className={`${styles.toggle} ${settings.accessibility.highContrast ? styles.toggleActive : ''}`}
                onClick={() => handleAccessibilityToggle('highContrast')}
                role="switch"
                aria-checked={settings.accessibility.highContrast}
              >
                <div className={styles.toggleSlider} />
              </button>
            </div>

            <div className={styles.settingItem}>
              <div className={styles.settingLabel}>
                <span>Reduce Motion</span>
              </div>
              <button
                className={`${styles.toggle} ${settings.accessibility.reduceMotion ? styles.toggleActive : ''}`}
                onClick={() => handleAccessibilityToggle('reduceMotion')}
                role="switch"
                aria-checked={settings.accessibility.reduceMotion}
              >
                <div className={styles.toggleSlider} />
              </button>
            </div>
          </section>

          {/* Data Management Section */}
          <section className={`${styles.section} ${styles.dangerZone}`}>
            <h2 className={styles.sectionTitle}>
              <AlertTriangle size={20} />
              Data Management
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
                  {confirmReset ? 'Are you sure?' : 'Reset All Progress'}
                </button>
                <p className={styles.dangerText}>
                  {confirmReset
                    ? 'Click again to confirm. This will permanently delete your score and unlocked levels.'
                    : 'This will permanently delete your score, unlocked levels, and game progress. Settings will be preserved.'
                  }
                </p>
              </>
            )}
          </section>

          {/* Footer Info */}
          <section className={styles.footer}>
            <div className={styles.credits}>
              <h3>Hamada</h3>
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
