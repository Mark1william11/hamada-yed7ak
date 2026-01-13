# 🎮 Hamada Yed7ak (Face Fixer) - Production Ready

A premium, viral-ready mobile game built with React, Tailwind CSS, and Framer Motion.

## ✨ Features

### 🎯 Complete Game Loop
- **Main Menu** with Start Game and Settings
- **Gameplay** with instant feedback and smooth animations
- **Victory Screen** when all levels are completed
- **Game Over** screen with retry option
- Proper state machine managing all game states

### 🎨 Premium UI/UX
- **Mobile-First Design** - Perfectly fits any screen height
- **Instant Hover Feedback** - 80ms transitions for snappy feel
- **Touch-Optimized** - Full touch event support for mobile
- **Ghost Image Mechanic** - Zero layout shifts during gameplay
- **Dark/Gold Theme** - Professional, high-end aesthetics

### ⚙️ Settings & Persistence
- **Sound Toggle** - Mute/unmute sound effects
- **LocalStorage Persistence** - Settings saved between sessions
- **Credits Screen** - Attribution and version info

### 📱 Mobile Optimization
- Uses `h-[100dvh]` for dynamic viewport height
- CSS Flexbox layout with `min-h-0` for proper sizing
- Compact spacing on mobile, responsive on desktop
- No scrolling or cut-off buttons

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
├── App.jsx                      # Main app with state machine
├── main.jsx                     # React entry point
├── index.css                    # Global styles & animations
├── components/
│   ├── MainMenu.jsx            # Opening screen
│   ├── GameHeader.jsx          # Score, lives, level
│   ├── GameStage.jsx           # Image display with overlay
│   ├── OptionGrid.jsx          # Mouth selection buttons
│   ├── WinModal.jsx            # Level complete overlay
│   └── GameCompleteScreen.jsx  # Final victory screen
├── hooks/
│   ├── useGameLogic.js         # Game state management
│   └── useGameSettings.js      # Settings persistence
└── data/
    └── gameData.js             # Level definitions
```

## 🎮 Game Data Format

Each level in `gameData.js` follows this structure:

```javascript
{
  id: 1,
  celebrity: "Celebrity Name",
  baseImage: "/assets/level1/base.png",
  completeImage: "/assets/level1/complete.png",
  overlayStyle: {
    top: "60%",      // Mouth vertical position
    left: "50%",     // Mouth horizontal position
    width: "40%",    // Mouth width
    transform: "translate(-50%, -50%)"  // Optional centering
  },
  options: [
    { id: "m1", image: "/assets/level1/mouth_wrong1.jpg" },
    { id: "m2", image: "/assets/level1/mouth_correct.jpg" },
    { id: "m3", image: "/assets/level1/mouth_wrong2.jpg" },
    { id: "m4", image: "/assets/level1/mouth_wrong3.jpg" },
  ],
  correctMouth: "m2"
}
```

## 🔧 Technical Highlights

### State Machine
Uses a clean state machine pattern:
- `MENU` → `PLAYING` → `GAME_WON` or `GAME_OVER` → `MENU`

### Performance Optimizations
- **Instant Transitions**: 80ms for mouth preview, 100ms for hover
- **Touch Events**: OnTouchStart/End for mobile devices
- **Reduced Motion**: Removed unnecessary animation wrappers
- **CSS Transitions**: Using CSS where possible instead of JS

### Layout Strategy
- **Flex Container**: `flex flex-col` with `h-[100dvh]`
- **Fixed Header/Footer**: `flex-none` for header and options
- **Flexible Stage**: `flex-1 min-h-0` for image area
- **Mobile Safe**: No hardcoded heights, uses viewport units

## 🎨 Design System

### Colors
- **Primary Gold**: `#FFD700`
- **Accent Purple**: `#9333EA`
- **Accent Pink**: `#EC4899`
- **Dark Background**: `#0F172A`

### Typography
- **Headings**: Fredoka (Arabic-friendly, playful)
- **Body**: Inter (Clean, modern)

### Spacing
- **Mobile**: Compact spacing (px-3, py-3, gap-2.5)
- **Desktop**: Comfortable spacing (px-4, py-4, gap-3)

## 📦 Dependencies

```json
{
  "react": "^19.2.0",
  "framer-motion": "^12.25.0",
  "tailwindcss": "^4.1.18",
  "canvas-confetti": "^1.9.4",
  "lucide-react": "^0.562.0"
}
```

## 🚀 Deployment

### Build
```bash
npm run build
```

### Deploy to Netlify/Vercel
1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Deploy!

### Performance Tips
- Place assets in `/public/assets/`
- Optimize images (WebP format recommended)
- Use lazy loading for images if needed

## 🎯 Game Balance

### Configuration
Located in `gameData.js`:
```javascript
export const GAME_CONFIG = {
  INITIAL_LIVES: 3,
  POINTS_PER_LEVEL: 100,
  POINTS_BONUS_SPEED: 50,
  ANIMATION_DURATION: 300,
  CONFETTI_DURATION: 3000
};
```

## 🐛 Troubleshooting

### Mobile buttons cut off
- Ensure using `h-[100dvh]` not `h-screen`
- Check `min-h-0` is applied to flex children

### Hover not working on mobile
- Use `onTouchStart`/`onTouchEnd` events
- Test on actual device, not just Chrome DevTools

### Images not loading
- Check paths are relative to `public/`
- Use `/assets/` not `./assets/`

## 📄 License

MIT - Feel free to use this for your own projects!

## 🙏 Credits

Created with ❤️ by Hamada Co
Powered by React, Tailwind CSS, and Framer Motion

---

**Version**: 1.0.0  
**Status**: Production Ready ✅
