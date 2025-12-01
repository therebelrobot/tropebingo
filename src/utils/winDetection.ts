import type { WinLine, LineType } from '@data/types';

/**
 * Check if a line (row, column, or diagonal) is complete on a 5x5 bingo board
 * Returns array of winning lines
 */
export function detectWins(markedCells: number[]): WinLine[] {
  const wins: WinLine[] = [];
  const marked = new Set(markedCells);

  // Check rows (0-4)
  for (let row = 0; row < 5; row++) {
    const cells = Array.from({ length: 5 }, (_, col) => row * 5 + col);
    if (cells.every(cell => cell === 12 || marked.has(cell))) {
      wins.push({
        type: 'row',
        index: row,
        cells,
      });
    }
  }

  // Check columns (0-4)
  for (let col = 0; col < 5; col++) {
    const cells = Array.from({ length: 5 }, (_, row) => row * 5 + col);
    if (cells.every(cell => cell === 12 || marked.has(cell))) {
      wins.push({
        type: 'col',
        index: col,
        cells,
      });
    }
  }

  // Check main diagonal (top-left to bottom-right)
  const mainDiag = [0, 6, 12, 18, 24];
  if (mainDiag.every(cell => cell === 12 || marked.has(cell))) {
    wins.push({
      type: 'diag-main',
      index: 0,
      cells: mainDiag,
    });
  }

  // Check anti-diagonal (top-right to bottom-left)
  const antiDiag = [4, 8, 12, 16, 20];
  if (antiDiag.every(cell => cell === 12 || marked.has(cell))) {
    wins.push({
      type: 'diag-anti',
      index: 0,
      cells: antiDiag,
    });
  }

  return wins;
}

/**
 * Check if a specific cell is part of any winning line
 */
export function isCellInWinningLine(cellIndex: number, wins: WinLine[]): boolean {
  return wins.some(win => win.cells.includes(cellIndex));
}

/**
 * Get a human-readable description of a win
 */
export function getWinDescription(win: WinLine): string {
  switch (win.type) {
    case 'row':
      return `Row ${win.index + 1}`;
    case 'col':
      return `Column ${win.index + 1}`;
    case 'diag-main':
      return 'Main Diagonal';
    case 'diag-anti':
      return 'Anti Diagonal';
  }
}

/**
 * Check if player has achieved a "blackout" (all cells marked)
 */
export function isBlackout(markedCells: number[]): boolean {
  // All 25 cells (including free space at 12)
  return markedCells.length >= 24; // 24 + free space = full board
}