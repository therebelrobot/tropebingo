import { useState, useEffect } from 'react';
import { ThemeProvider } from '@context/ThemeContext';
import { GameStateProvider, useGameState } from '@context/GameStateContext';
import { GenreEditorProvider } from '@context/GenreEditorContext';
import { ThemeToggle } from '@components/ui/ThemeToggle';
import { Button } from '@components/ui/Button';
import { Modal } from '@components/ui/Modal';
import { GenreSelector } from '@components/game/GenreSelector';
import { QuestionFlow } from '@components/game/QuestionFlow';
import { BingoBoard } from '@components/game/BingoBoard';
import { GenreEditor } from '@components/editor/GenreEditor';
import { getSharedGenreFromUrl, handleSharedGenreImport, clearShareUrl } from '@utils/shareGenre';
import type { Genre } from '@data/types';

type AppMode = 'game' | 'editor';

function AppContent() {
  const { selectedGenre, board } = useGameState();
  const [mode, setMode] = useState<AppMode>('game');
  const [sharedGenre, setSharedGenre] = useState<Genre | null>(null);
  const [importModal, setImportModal] = useState(false);
  const [successModal, setSuccessModal] = useState<string>('');
  const [errorModal, setErrorModal] = useState<string>('');

  // Handle shared genre links on mount
  useEffect(() => {
    const genre = getSharedGenreFromUrl();
    if (genre) {
      setSharedGenre(genre);
      setImportModal(true);
    }
  }, []);

  const handleImportConfirm = () => {
    if (sharedGenre) {
      handleSharedGenreImport(
        sharedGenre,
        (message) => {
          setImportModal(false);
          setSuccessModal(message);
        },
        (message) => {
          setImportModal(false);
          setErrorModal(message);
        }
      );
    }
  };

  const handleImportCancel = () => {
    setImportModal(false);
    setSharedGenre(null);
    clearShareUrl();
  };

  if (mode === 'editor') {
    return (
      <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] transition-colors duration-200">
        <header className="border-b border-[var(--color-border)] bg-[var(--color-surface)]">
          <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
            <h1 className="text-3xl font-bold">🎬 Movie Trope Bingo</h1>
            <div className="flex items-center gap-4">
              <Button onClick={() => setMode('game')} variant="outline" className="text-sm">
                ← Back to Game
              </Button>
              <ThemeToggle />
            </div>
          </div>
        </header>
        <GenreEditor />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] transition-colors duration-200">
      <header className="border-b border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold">🎬 Movie Trope Bingo</h1>
          <div className="flex items-center gap-4">
            <Button onClick={() => setMode('editor')} variant="outline" className="text-sm">
              Genre Editor
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* No genre selected - show genre selector */}
        {!selectedGenre && <GenreSelector />}
        
        {/* Genre selected but no board - show question flow */}
        {selectedGenre && !board && <QuestionFlow />}
        
        {/* Board generated - show bingo board */}
        {selectedGenre && board && <BingoBoard />}
      </main>

      {/* Shared Genre Import Modals */}
      <Modal
        isOpen={importModal}
        onClose={handleImportCancel}
        onConfirm={handleImportConfirm}
        title="Import Shared Genre"
        message={`Import shared genre "${sharedGenre?.name}"?\n\nThis will save it to your browser and make it available in the genre selector.`}
        type="confirm"
        confirmText="Import"
      />

      <Modal
        isOpen={!!successModal}
        onClose={() => setSuccessModal('')}
        title="Success"
        message={successModal}
        type="alert"
      />

      <Modal
        isOpen={!!errorModal}
        onClose={() => setErrorModal('')}
        title="Error"
        message={errorModal}
        type="alert"
      />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <GameStateProvider>
        <GenreEditorProvider>
          <AppContent />
        </GenreEditorProvider>
      </GameStateProvider>
    </ThemeProvider>
  );
}

export default App;
