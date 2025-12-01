import type { PersistedGameState, GameState, Trope } from '@data/types';
import { getGenreById } from '@data/genres';

const GAME_STATE_KEY = 'tropebingo_game_state';
const THEME_KEY = 'tropebingo_theme';
const CURRENT_VERSION = 1;

/**
 * Save game state to localStorage
 */
export function saveGameState(state: GameState): void {
  try {
    const persisted: PersistedGameState = {
      version: CURRENT_VERSION,
      selectedGenre: state.selectedGenre,
      answers: state.answers,
      currentQuestionIndex: state.currentQuestionIndex,
      board: state.board
        ? {
          tropes: state.board.map(t => (t ? t.id : null)),
          seed: state.boardSeed,
        }
        : null,
      markedCells: state.markedCells,
      completedLines: state.completedLines,
      timestamp: Date.now(),
    };

    localStorage.setItem(GAME_STATE_KEY, JSON.stringify(persisted));
  } catch (error) {
    console.error('Failed to save game state:', error);
  }
}

/**
 * Load game state from localStorage
 */
export function loadGameState(): GameState | null {
  try {
    const saved = localStorage.getItem(GAME_STATE_KEY);
    if (!saved) return null;

    const persisted: PersistedGameState = JSON.parse(saved);

    // Check version compatibility
    if (persisted.version !== CURRENT_VERSION) {
      console.warn('Incompatible game state version, clearing...');
      clearGameState();
      return null;
    }

    // Reconstruct board if it exists
    let board: (Trope | null)[] | null = null;
    if (persisted.board && persisted.selectedGenre) {
      const genre = getGenreById(persisted.selectedGenre);
      if (genre) {
        // Find tropes by ID
        const allTropes = genre.tropeSets.flatMap(set => set.tropes);
        board = persisted.board.tropes.map((id): Trope | null => {
          if (id === null) return null;
          return allTropes.find((t: Trope) => t.id === id) || null;
        });
      }
    }

    return {
      selectedGenre: persisted.selectedGenre,
      answers: persisted.answers,
      currentQuestionIndex: persisted.currentQuestionIndex,
      board,
      markedCells: persisted.markedCells,
      boardSeed: persisted.board?.seed || Date.now(),
      completedLines: persisted.completedLines || [],
    };
  } catch (error) {
    console.error('Failed to load game state:', error);
    return null;
  }
}

/**
 * Clear game state from localStorage
 */
export function clearGameState(): void {
  try {
    localStorage.removeItem(GAME_STATE_KEY);
  } catch (error) {
    console.error('Failed to clear game state:', error);
  }
}

/**
 * Save theme preference to localStorage
 */
export function saveTheme(theme: 'light' | 'dark'): void {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch (error) {
    console.error('Failed to save theme:', error);
  }
}

/**
 * Load theme preference from localStorage
 */
export function loadTheme(): 'light' | 'dark' | null {
  try {
    const theme = localStorage.getItem(THEME_KEY);
    if (theme === 'light' || theme === 'dark') {
      return theme;
    }
    return null;
  } catch (error) {
    console.error('Failed to load theme:', error);
    return null;
  }
}