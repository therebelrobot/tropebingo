import { useGameState } from '@context/GameStateContext';
import { BingoCell } from './BingoCell';
import { Button } from '@components/ui/Button';
import { isCellInWinningLine } from '@utils/winDetection';
import { getGenreById } from '@data/genres';

export function BingoBoard() {
  const {
    selectedGenre,
    answers,
    board,
    markedCells,
    wins,
    hasWon,
    toggleCell,
    regenerateBoard,
    resetGame,
  } = useGameState();

  if (!board) return null;

  const genre = selectedGenre ? getGenreById(selectedGenre) : null;

  // Helper to get display text for an answer value
  const getAnswerDisplay = (questionId: string, value: string | string[]): string => {
    if (!genre) return String(value);
    
    const question = genre.questions.find(q => q.id === questionId);
    if (!question) return String(value);

    if (Array.isArray(value)) {
      return value
        .map(v => question.options.find(o => o.value === v)?.text || v)
        .join(', ');
    }

    return question.options.find(o => o.value === value)?.text || String(value);
  };

  return (
    <div className="max-w-5xl mx-auto px-4">
      {/* Header with stats and controls */}
      <div className="mb-6 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="text-center sm:text-left">
          <h2 className="text-3xl font-bold mb-2">Your Bingo Board</h2>
          <p className="text-base text-[var(--color-text-muted)]">
            {markedCells.length} / 24 cells marked
            {hasWon && ` • ${wins.length} bingo${wins.length > 1 ? 's' : ''}!`}
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={regenerateBoard}
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            New Board
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={resetGame}
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            Start Over
          </Button>
        </div>
      </div>

      {/* User Selections Display */}
      {genre && Object.keys(answers).length > 0 && (
        <div className="mb-8 p-4 bg-[var(--color-surface)] rounded-lg border border-[var(--color-border)]">
          <h3 className="text-sm font-semibold mb-2 text-[var(--color-text-secondary)]">
            Your Selections:
          </h3>
          <div className="flex flex-wrap gap-3">
            {Object.entries(answers).map(([questionId, value]) => {
              const question = genre.questions.find(q => q.id === questionId);
              if (!question) return null;
              
              return (
                <div key={questionId} className="inline-flex items-center gap-2 text-sm">
                  <span className="font-medium text-[var(--color-text)]">
                    {question.text.replace('?', '')}:
                  </span>
                  <span className="px-2 py-1 bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded">
                    {getAnswerDisplay(questionId, value)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Win celebration */}
      {hasWon && (
        <div className="mb-8 p-6 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-xl animate-fade-in shadow-lg">
          <div className="flex items-center justify-center gap-3">
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <div>
              <p className="font-bold text-lg">🎉 BINGO! 🎉</p>
              <p className="text-sm">
                You got {wins.length} line{wins.length > 1 ? 's' : ''}! Keep watching to get more!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* The 5x5 bingo grid */}
      <div className="grid grid-cols-5 gap-3 sm:gap-4 mb-10 max-w-3xl mx-auto">
        {board.map((trope, index) => (
          <BingoCell
            key={index}
            index={index}
            trope={trope}
            isMarked={markedCells.includes(index)}
            isFreeSpace={index === 12}
            isInWinningLine={isCellInWinningLine(index, wins)}
            onToggle={() => toggleCell(index)}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-6 justify-center text-base text-[var(--color-text-muted)] mb-8">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-[var(--cell-free-bg)]" />
          <span>Free Space</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-[var(--cell-marked-bg)]" />
          <span>Marked</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded border-2 border-[var(--cell-border)] bg-[var(--cell-bg)]" />
          <span>Unmarked</span>
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-10 p-6 bg-[var(--color-surface)] rounded-xl text-center max-w-2xl mx-auto border border-[var(--color-border)]">
        <p className="text-base text-[var(--color-text-muted)]">
          💡 <strong className="text-[var(--color-text)]">Tip:</strong> Hover over cells to see trope descriptions. Click to mark when you spot them!
        </p>
      </div>
    </div>
  );
}