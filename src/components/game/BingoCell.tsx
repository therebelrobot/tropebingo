import { useState } from 'react';
import type { Trope } from '@data/types';
import { cn } from '@utils/cn';

interface BingoCellProps {
  index: number;
  trope: Trope | null;
  isMarked: boolean;
  isFreeSpace: boolean;
  isInWinningLine: boolean;
  onToggle: () => void;
}

export function BingoCell({ 
  trope, 
  isMarked, 
  isFreeSpace, 
  isInWinningLine,
  onToggle 
}: BingoCellProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  const handleClick = () => {
    if (!isFreeSpace) {
      onToggle();
    }
  };

  return (
    <div className="relative group">
      <button
        onClick={handleClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className={cn(
          'w-full aspect-square p-4 rounded-xl border-2 transition-all duration-200',
          'flex items-center justify-center text-center',
          'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary)]',
          'min-h-[100px] sm:min-h-[120px]',
          
          // Free space styling
          isFreeSpace && [
            'bg-[var(--cell-free-bg)] text-[var(--cell-free-text)]',
            'border-[var(--cell-free-bg)] cursor-default',
            'font-bold text-lg',
          ],
          
          // Marked cell styling
          !isFreeSpace && isMarked && [
            'bg-[var(--cell-marked-bg)] text-[var(--cell-marked-text)]',
            'border-[var(--cell-marked-bg)]',
            'shadow-lg scale-95',
          ],
          
          // Unmarked cell styling
          !isFreeSpace && !isMarked && [
            'bg-[var(--cell-bg)] text-[var(--color-text)]',
            'border-[var(--cell-border)]',
            'hover:border-[var(--cell-hover-border)] hover:scale-105 hover:shadow-md',
            'cursor-pointer',
          ],
          
          // Winning line highlight
          isInWinningLine && 'ring-4 ring-yellow-400 ring-opacity-50',
        )}
        disabled={isFreeSpace}
        aria-pressed={isMarked}
        aria-label={isFreeSpace ? 'Free space' : trope?.text}
      >
        <span
          className={cn(
            'font-semibold leading-snug',
            isFreeSpace ? 'text-2xl' : 'text-base sm:text-lg'
          )}
          dangerouslySetInnerHTML={{
            __html: isFreeSpace ? 'FREE' : (trope?.text || '')
          }}
        />
        
        {/* Checkmark for marked cells */}
        {isMarked && !isFreeSpace && (
          <div className="absolute top-1 right-1">
            <svg 
              className="w-4 h-4 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        )}
      </button>

      {/* Tooltip with description */}
      {showTooltip && trope?.description && (
        <div className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-xl max-w-xs pointer-events-none animate-fade-in">
          <p className="mb-1 font-semibold">{trope.text.replace(/&shy;/g, '')}</p>
          <p className="text-gray-300 leading-relaxed">{trope.description}</p>
          {trope.citation && (
            <p className="text-gray-400 text-xs mt-1">Source: {trope.citation}</p>
          )}
          {/* Tooltip arrow */}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-px">
            <div className="border-8 border-transparent border-t-gray-900" />
          </div>
        </div>
      )}
    </div>
  );
}