# 🎮 Hamada Yed7ak - حمادة يضحك

A cozy, hyper-casual mobile game where you fix celebrity faces by choosing the correct mouth!

## ✨ Features

- **4 Playable Levels** with Egyptian celebrities
- **Level Progression** - Complete levels to unlock the next
- **Score System** with local persistence
- **Responsive Mobile Design** - Works on all screen sizes
- **Haptic Feedback** - Vibration on supported devices
- **Sound Effects** - Programmatic audio (no external files)
- **Accessibility** - High contrast mode, reduce motion option

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## 📁 Project Structure

```
src/
├── App.jsx                      # Main app with navigation
├── main.jsx                     # React entry point
├── index.css                    # Global styles
├── components/
│   ├── MainMenu.jsx            # Start screen
│   ├── LevelSelect.jsx         # Level grid
│   ├── GameHeader.jsx          # Score, lives, level
│   ├── GameStage.jsx           # Image display
│   ├── OptionGrid.jsx          # Mouth selection
│   ├── WinModal.jsx            # Level complete
│   ├── LoadingTransition.jsx   # Loading overlay
│   ├── SettingsModal.jsx       # Settings panel
│   └── SettingsModal.module.css
├── hooks/
│   ├── useGameState.js         # Unified game state
│   └── useAssetPreloader.js    # Image preloading
├── services/
│   └── AudioManager.js         # Web Audio API sounds
└── data/
    └── gameData.js             # Level definitions
```

## 🎮 Adding New Levels

Add levels to `src/data/gameData.js`:

```javascript
{
  id: 5,
  celebrity: "Celebrity Name",
  baseImage: "/assets/level5/base.png",
  completeImage: "/assets/level5/complete.png",
  overlayStyle: {
    top: "50%",
    left: "50%",
    width: "40%"
  },
  options: [
    { id: "m1", image: "/assets/level5/mouth_wrong1.jpg" },
    { id: "m2", image: "/assets/level5/mouth_correct.jpg" },
    { id: "m3", image: "/assets/level5/mouth_wrong2.jpg" },
    { id: "m4", image: "/assets/level5/mouth_wrong3.jpg" },
  ],
  correctMouth: "m2"
}
```

## 📦 Dependencies

- React 19
- Framer Motion (animations)
- TailwindCSS 4 (styling)
- Lucide React (icons)
- Canvas Confetti (celebrations)

## 🚀 Deployment

1. Run `npm run build`
2. Deploy the `dist` folder to any static host (Netlify, Vercel, etc.)

## 📄 License

MIT - Hamada Co 2026
