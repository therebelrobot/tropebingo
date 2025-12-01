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

## Project Structure

```
app/
├── src/
│   ├── components/
│   │   ├── game/
│   │   │   ├── GenreSelector.tsx    # Genre selection screen
│   │   │   ├── QuestionFlow.tsx     # Question wizard
│   │   │   ├── QuestionCard.tsx     # Individual question
│   │   │   ├── BingoBoard.tsx       # Main board component
│   │   │   └── BingoCell.tsx        # Individual cell with tooltip
│   │   └── ui/
│   │       ├── Button.tsx           # Reusable button
│   │       └── ThemeToggle.tsx      # Dark/light mode toggle
│   │
│   ├── context/
│   │   ├── ThemeContext.tsx         # Theme management
│   │   └── GameStateContext.tsx     # Game state & logic
│   │
│   ├── data/
│   │   ├── types.ts                 # TypeScript definitions
│   │   └── genres/
│   │       ├── index.ts             # Genre registry
│   │       ├── horror.ts            # Horror genre data
│   │       └── README.md            # Adding new genres guide
│   │
│   ├── utils/
│   │   ├── shuffle.ts               # Seeded randomization
│   │   ├── tropes.ts                # Trope selection logic
│   │   ├── winDetection.ts          # Bingo win detection
│   │   ├── persistence.ts           # localStorage helpers
│   │   └── cn.ts                    # className utility
│   │
│   ├── styles/
│   │   └── index.css                # Global styles & themes
│   │
│   ├── App.tsx                      # Root component
│   └── main.tsx                     # App entry point
│
├── public/                          # Static assets
├── vite.config.ts                   # Vite configuration
├── tailwind.config.js               # Tailwind configuration
└── tsconfig.json                    # TypeScript configuration
```

## How to Play

1. **Choose Genre** - Select "Horror Movies"
2. **Answer Questions**:
   - What decade was the movie made?
   - What sub-genres does it fall into?
3. **Get Your Board** - Click "Generate Board"
4. **Mark Tropes** - Click cells as you spot tropes while watching
5. **Get BINGO!** - Complete a row, column, or diagonal

### Tips
- 💡 **Hover over cells** to see full trope descriptions
- 🔄 **Click "New Board"** to generate a different board with same filters
- 🔁 **Click "Start Over"** to choose a different genre/decade
- 🌓 **Toggle theme** for comfortable viewing in any lighting

## Adding New Genres

To add a new genre (e.g., Romantic Comedy):

1. Create `src/data/genres/romcom.ts`:

```typescript
import type { Genre } from '@data/types';

export const romcomGenre: Genre = {
  id: 'romcom',
  name: 'Romantic Comedy',
  description: 'Track tropes in romantic comedies',
  
  // Define genre-specific colors
  theme: {
    light: {
      primary: '#ec4899',      // Pink
      primaryHover: '#db2777',
      surface: '#fdf2f8',
      accent: '#be185d',
    },
    dark: {
      primary: '#f472b6',
      primaryHover: '#ec4899',
      surface: '#1c1917',
      accent: '#db2777',
    },
  },

  questions: [
    {
      id: 'decade',
      type: 'single',
      text: 'What decade?',
      options: [/* ... */],
    },
    // Add more questions
  ],

  tropeSets: [
    {
      id: 'modern-romcom',
      filters: { decade: '2000s' },
      tropes: [
        {
          id: 'meet-cute',
          text: 'Meet Cute',
          description: 'Protagonists meet in an adorable/awkward way',
        },
        // Add 35 more tropes for complete set
      ],
    },
  ],
};
```

2. Register in `src/data/genres/index.ts`:

```typescript
import { romcomGenre } from './romcom';

const genres: Genre[] = [
  horrorGenre,
  romcomGenre,  // Add here
];
```

3. That's it! The new genre is now available.

### Data Requirements

Each trope set should have:
- **36+ tropes** (enough for 1.5 bingo boards)
- **Unique IDs** within the genre
- **Text** with optional `&shy;` for line-break hints
- **Description** (optional but recommended)
- **Citation** (optional)

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

## Acknowledgments

- Trope research compiled from film history sources
- Built following React and accessibility best practices
- Inspired by classic bingo gameplay

---

**Enjoy tracking tropes!** 🎬🎲