# 🎬 Movie Trope Bingo

An interactive bingo game for tracking common movie tropes while watching films. Built with React, TypeScript, and Tailwind CSS.

![Movie Trope Bingo](https://img.shields.io/badge/React-18-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Vite](https://img.shields.io/badge/Vite-5-646CFF)

## Features

### 🎯 Core Gameplay
- **Genre Selection** - Choose your movie genre (Horror currently available)
- **Smart Question Flow** - Answer questions to customize your board
- **5x5 Bingo Board** - 24 tropes + 1 FREE space
- **Interactive Cells** - Click to mark, hover for detailed descriptions
- **Win Detection** - Automatic detection of rows, columns, and diagonals
- **Celebration** - Visual feedback when you get BINGO!

### 🎨 Theming
- **Genre-Specific Colors** - Each genre has unique color schemes
  - Horror: Blood red accents (#dc2626 / #b91c1c)
  - Future genres can have their own palettes
- **Dark/Light Mode** - Toggle between themes with animated transition
- **Persistent Preference** - Theme choice saves across sessions

### 💾 State Persistence
Everything survives page reload:
- Selected genre
- Question answers
- Board configuration
- Marked cells
- Win status
- Theme preference

### 📚 Rich Content
- **72+ Horror Tropes** - Categorized by decade and sub-genre
- **Detailed Descriptions** - Full context from film history research
- **Citations** - Source references included
- **Educational** - Learn about film tropes while playing

### ♿ Accessibility
- Keyboard navigation support
- ARIA labels for screen readers
- Respects `prefers-reduced-motion`
- High contrast color schemes (WCAG AA)
- Focus indicators visible

## Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## How to Play

1. **Choose Genre** - Select "Horror Movies"
2. **Answer Questions**:
   - What decade was the movie made?
   - What sub-genres does it fall into?
3. **Get Your Board** - Click "Generate Board"
4. **Mark Tropes** - Click cells as you spot tropes while watching
5. **Get BINGO!** - Complete a row, column, or diagonal

## Development

### Tech Stack
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool & dev server
- **Tailwind CSS v4** - Utility-first styling
- **Context API** - State management
- **LocalStorage** - Persistence

### Key Concepts

**Seeded Randomization:**
- Same answers always generate same board
- Allows reproducible results
- Board can be regenerated for variety

**Filter-Based Selection:**
- Questions map to filter criteria
- Trope sets tagged with filters
- Smart matching algorithm finds relevant tropes

**State Persistence:**
- Auto-saves on every change
- Handles schema versioning
- Graceful fallback if corrupted

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome)

## License

MIT License - See LICENSE file for details

**Enjoy tracking tropes!** 🎬🎲