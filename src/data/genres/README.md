# Adding New Genres to Movie Trope Bingo

This guide explains how to add new movie genres to the application.

## Overview

Each genre is defined in its own TypeScript file and includes:
- Genre metadata (id, name, description)
- Optional custom theme colors
- Questions for user to answer
- Trope sets filtered by answers

## Step-by-Step Guide

### 1. Create Genre File

Create `src/data/genres/your-genre.ts`:

```typescript
import type { Genre } from '@data/types';

export const yourGenre: Genre = {
  // Unique identifier (used in URLs and storage)
  id: 'your-genre',
  
  // Display name
  name: 'Your Genre Name',
  
  // Optional description
  description: 'Track tropes in your genre movies',
  
  // Optional: Custom theme colors
  theme: {
    light: {
      primary: '#your-color',      // Main accent color
      primaryHover: '#your-hover',  // Hover state
      surface: '#your-surface',     // Background surface
      accent: '#your-accent',       // Additional accent
    },
    dark: {
      primary: '#your-color',
      primaryHover: '#your-hover',
      surface: '#your-surface',
      accent: '#your-accent',
    },
  },

  // Questions to determine which tropes to show
  questions: [
    {
      id: 'question-id',
      type: 'single',  // or 'multiple' for multi-select
      text: 'Your question here?',
      options: [
        { 
          id: 'option-1',
          text: 'Display Text',
          value: 'filter-value'  // Used for matching trope sets
        },
        // Add more options...
      ],
    },
    // Add more questions...
  ],

  // Collections of tropes filtered by question answers
  tropeSets: [
    {
      id: 'unique-set-id',
      filters: {
        // Keys match question IDs
        // Values match option values
        'question-id': 'filter-value',
        // For multiple choice questions, use array
        'subgenres': ['value1', 'value2'],
      },
      tropes: [
        {
          id: 'unique-trope-id',
          text: 'Trope Name',  // Can include &shy; for line breaks
          description: 'Full description of the trope with examples',
          citation: 'source.com',  // Optional
        },
        // Add 35+ more tropes (36 total recommended)
      ],
    },
    // Add more trope sets for different filter combinations
  ],
};
```

### 2. Register Genre

Edit `src/data/genres/index.ts`:

```typescript
import { horrorGenre } from './horror';
import { yourGenre } from './your-genre';

const genres: Genre[] = [
  horrorGenre,
  yourGenre,  // Add your genre here
];
```

### 3. That's It!

Your genre is now available in the app. The system automatically:
- Shows it in genre selection
- Applies custom theme colors
- Handles question flow
- Generates boards from your trope sets

## Best Practices

### Trope Sets

**Provide 36+ tropes per set** for variety:
- 24 tropes needed for one board
- Extra tropes ensure randomization variety
- Players can generate multiple different boards

**Use descriptive IDs:**
```typescript
// Good
id: 'meet-cute'
id: 'third-act-breakup'

// Avoid
id: 'trope1'
id: 'rc-23'
```

**Add line-break hints:**
```typescript
// For long trope names, use &shy; for soft hyphens
text: 'Enemies&shy;-to&shy;-Lovers'
text: 'Misunder&shy;standing Conflict'
```

### Questions

**Keep it simple:**
- 2-4 questions ideal
- First question: era/decade/setting
- Second question: sub-genre/style (allow multiple)
- Additional questions: specific elements

**Use meaningful filter values:**
```typescript
{
  id: 'era',
  type: 'single',
  text: 'When was it made?',
  options: [
    { id: 'classic', text: '1930s-1960s', value: 'classic' },
    { id: 'modern', text: '1990s-2020s', value: 'modern' },
  ],
}
```

### Filters

**Match filters to questions:**
```typescript
// If question uses value 'classic', trope set should too
filters: {
  era: 'classic',
  subgenre: ['romantic', 'comedy']
}
```

**Overlap is okay:**
- Trope sets can have overlapping filters
- Same trope can appear in multiple sets
- Deduplication happens automatically during selection

### Theme Colors

**Choose genre-appropriate colors:**
- Horror: Reds, dark purples
- Romantic: Pinks, warm tones
- Sci-Fi: Blues, teals
- Comedy: Bright, cheerful colors

**Ensure contrast:**
- Light mode: darker primary for readability
- Dark mode: lighter primary for visibility
- Test with both themes enabled

**Example palettes:**

```typescript
// Romantic Comedy
theme: {
  light: { primary: '#ec4899', accent: '#db2777' },  // Pink
  dark: { primary: '#f472b6', accent: '#ec4899' }
}

// Sci-Fi
theme: {
  light: { primary: '#0ea5e9', accent: '#0284c7' },  // Blue
  dark: { primary: '#38bdf8', accent: '#0ea5e9' }
}

// Holiday/Christmas
theme: {
  light: { primary: '#dc2626', accent: '#16a34a' },  // Red & green
  dark: { primary: '#ef4444', accent: '#22c55e' }
}
```

## Data Format Reference

### Complete Genre Type

```typescript
interface Genre {
  id: string;
  name: string;
  description?: string;
  questions: Question[];
  tropeSets: TropeSet[];
  theme?: GenreTheme;
}

interface Question {
  id: string;
  type: 'single' | 'multiple';
  text: string;
  options: QuestionOption[];
}

interface TropeSet {
  id: string;
  filters: {
    [questionId: string]: string | string[];
  };
  tropes: Trope[];
}

interface Trope {
  id: string;
  text: string;
  description?: string;
  citation?: string;
}
```

## Testing Your Genre

1. **Start dev server**: `npm run dev`
2. **Select your genre** from the home screen
3. **Answer questions** - verify all options work
4. **Generate board** - confirm tropes appear
5. **Test interactions**:
   - Click cells to mark
   - Hover for tooltips
   - Try "New Board" for different tropes
   - Test "Start Over" to return to genre selection
6. **Check both themes** - light and dark mode
7. **Reload page** - verify persistence works

## Common Issues

**Board shows fewer than 24 tropes:**
- Ensure trope sets have 36+ tropes
- Check filter values match question option values
- Verify multiple sets exist for your filter combinations

**Theme colors not applying:**
- Check theme object structure matches GenreTheme interface
- Verify color values are valid hex codes
- Ensure both light and dark themes defined

**Tropes repeating:**
- Normal if you have < 36 unique tropes for selected filters
- Add more trope sets or more tropes to existing sets

## Need Help?

Check the horror genre (`horror.ts`) as a reference implementation with:
- 72 tropes across 2 trope sets
- Custom blood-red theme
- 2 questions (decade + sub-genres)
- Multiple filter combinations

---

Happy genre building! 🎬