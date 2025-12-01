/**
 * Core type definitions for the Movie Trope Bingo application
 */

export interface Genre {
  id: string;
  name: string;
  description?: string;
  questions: Question[];
  tropeSets: TropeSet[];
  theme?: GenreTheme;
}

export interface Question {
  id: string;
  type: 'single' | 'multiple';
  text: string;
  options: QuestionOption[];
}

export interface QuestionOption {
  id: string;
  text: string;
  value: string;
}

export interface TropeSet {
  id: string;
  filters: {
    decade?: string;
    subgenres?: string[];
    [key: string]: string | string[] | undefined;
  };
  tropes: Trope[];
}

export interface Trope {
  id: string;
  text: string;
  description?: string;
  citation?: string;
}

// Game state types
export interface GameState {
  selectedGenre: string | null;
  answers: Record<string, string | string[]>;
  currentQuestionIndex: number;
  board: (Trope | null)[] | null;
  markedCells: number[];
  boardSeed: number;
  completedLines: number[];
}

export interface PersistedGameState {
  version: number;
  selectedGenre: string | null;
  answers: Record<string, string | string[]>;
  currentQuestionIndex: number;
  board: {
    tropes: (string | null)[];
    seed: number;
  } | null;
  markedCells: number[];
  completedLines: number[];
  timestamp: number;
}

// Win detection types
export type LineType = 'row' | 'col' | 'diag-main' | 'diag-anti';

export interface WinLine {
  type: LineType;
  index: number;
  cells: number[];
}

// Theme types
export type Theme = 'light' | 'dark';

// Genre theme colors
export interface GenreTheme {
  light: {
    primary: string;
    primaryHover: string;
    surface: string;
    accent: string;
  };
  dark: {
    primary: string;
    primaryHover: string;
    surface: string;
    accent: string;
  };
}