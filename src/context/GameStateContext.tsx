import { createContext, useContext, useEffect, useState, type PropsWithChildren } from 'react';
import type { GameState, Genre } from '@data/types';
import { getGenreById } from '@data/genres';
import { selectTropes, generateBoard } from '@utils/tropes';
import { generateSeed } from '@utils/shuffle';
import { detectWins } from '@utils/winDetection';
import { saveGameState, loadGameState, clearGameState } from '@utils/persistence';
import { useTheme } from './ThemeContext';

interface GameStateContextValue extends GameState {
  // Genre selection
  selectGenre: (genreId: string) => void;
  
  // Question flow
  answerQuestion: (questionId: string, answer: string | string[]) => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  canProceed: boolean;
  
  // Board generation
  generateNewBoard: () => void;
  regenerateBoard: () => void;
  
  // Cell interaction
  toggleCell: (index: number) => void;
  
  // Game control
  resetGame: () => void;
  
  // Computed properties
  currentGenre: Genre | null;
  wins: ReturnType<typeof detectWins>;
  hasWon: boolean;
}

const GameStateContext = createContext<GameStateContextValue | undefined>(undefined);

const getInitialState = (): GameState => ({
  selectedGenre: null,
  answers: {},
  currentQuestionIndex: 0,
  board: null,
  markedCells: [],
  boardSeed: generateSeed(),
  completedLines: [],
});

export function GameStateProvider({ children }: PropsWithChildren) {
  const [state, setState] = useState<GameState>(() => {
    // Try to load from localStorage
    const saved = loadGameState();
    return saved || getInitialState();
  });

  const { applyGenreTheme } = useTheme();

  // Persist state changes to localStorage
  useEffect(() => {
    saveGameState(state);
  }, [state]);

  // Apply genre theme when genre is selected
  useEffect(() => {
    if (state.selectedGenre) {
      const genre = getGenreById(state.selectedGenre);
      applyGenreTheme(genre);
    } else {
      applyGenreTheme(null);
    }
  }, [state.selectedGenre, applyGenreTheme]);

  // Computed values
  const currentGenre = state.selectedGenre ? getGenreById(state.selectedGenre) : null;
  const wins = state.board ? detectWins(state.markedCells) : [];
  const hasWon = wins.length > 0;

  // Check if current question has been answered
  const currentQuestion = currentGenre?.questions[state.currentQuestionIndex];
  const currentAnswer = currentQuestion ? state.answers[currentQuestion.id] : undefined;
  const canProceed = currentAnswer !== undefined && (
    !Array.isArray(currentAnswer) || currentAnswer.length > 0
  );

  // Actions
  const selectGenre = (genreId: string) => {
    const genre = getGenreById(genreId);
    if (!genre) return;

    const seed = generateSeed();
    
    // If genre has no questions, generate board immediately
    if (genre.questions.length === 0) {
      const selectedTropes = selectTropes(genre, {}, seed);
      const board = generateBoard(selectedTropes);
      
      setState({
        ...getInitialState(),
        selectedGenre: genreId,
        boardSeed: seed,
        board,
      });
    } else {
      // Has questions - show question flow
      setState({
        ...getInitialState(),
        selectedGenre: genreId,
        boardSeed: seed,
      });
    }
  };

  const answerQuestion = (questionId: string, answer: string | string[]) => {
    setState(prev => ({
      ...prev,
      answers: {
        ...prev.answers,
        [questionId]: answer,
      },
    }));
  };

  const nextQuestion = () => {
    if (!currentGenre) return;
    
    const isLastQuestion = state.currentQuestionIndex >= currentGenre.questions.length - 1;
    
    if (isLastQuestion) {
      // Generate board
      generateNewBoard();
    } else {
      setState(prev => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1,
      }));
    }
  };

  const previousQuestion = () => {
    setState(prev => ({
      ...prev,
      currentQuestionIndex: Math.max(0, prev.currentQuestionIndex - 1),
    }));
  };

  const generateNewBoard = () => {
    if (!currentGenre) return;

    const seed = generateSeed();
    const selectedTropes = selectTropes(currentGenre, state.answers, seed);
    const board = generateBoard(selectedTropes);

    setState(prev => ({
      ...prev,
      board,
      boardSeed: seed,
      markedCells: [],
      completedLines: [],
    }));
  };

  const regenerateBoard = () => {
    if (!currentGenre) return;

    const seed = generateSeed();
    const selectedTropes = selectTropes(currentGenre, state.answers, seed);
    const board = generateBoard(selectedTropes);

    setState(prev => ({
      ...prev,
      board,
      boardSeed: seed,
      markedCells: [],
      completedLines: [],
    }));
  };

  const toggleCell = (index: number) => {
    // Can't toggle the free space (index 12)
    if (index === 12) return;

    setState(prev => {
      const isMarked = prev.markedCells.includes(index);
      const newMarkedCells = isMarked
        ? prev.markedCells.filter(i => i !== index)
        : [...prev.markedCells, index];

      // Detect new wins
      const newWins = detectWins(newMarkedCells);
      const newCompletedLines = newWins.map((_, i) => i);

      return {
        ...prev,
        markedCells: newMarkedCells,
        completedLines: newCompletedLines,
      };
    });
  };

  const resetGame = () => {
    clearGameState();
    setState(getInitialState());
    applyGenreTheme(null);
  };

  const value: GameStateContextValue = {
    ...state,
    currentGenre,
    wins,
    hasWon,
    canProceed,
    selectGenre,
    answerQuestion,
    nextQuestion,
    previousQuestion,
    generateNewBoard,
    regenerateBoard,
    toggleCell,
    resetGame,
  };

  return (
    <GameStateContext.Provider value={value}>
      {children}
    </GameStateContext.Provider>
  );
}

export function useGameState() {
  const context = useContext(GameStateContext);
  if (context === undefined) {
    throw new Error('useGameState must be used within a GameStateProvider');
  }
  return context;
}