import type { Genre, Trope, TropeSet } from '@data/types';
import { shuffleArray } from './shuffle';

/**
 * Select 24 tropes based on user's answers to questions
 */
export function selectTropes(
  genre: Genre,
  answers: Record<string, string | string[]>,
  seed: number
): Trope[] {
  // Find matching trope sets based on filters
  let matchingSets = genre.tropeSets.filter(set => {
    return matchesFilters(set, answers);
  });

  // Fallback: if no exact matches, try partial matches (subgenre only)
  if (matchingSets.length === 0) {
    const subgenres = answers['subgenre'];
    if (subgenres) {
      matchingSets = genre.tropeSets.filter(set => {
        if (!set.filters.subgenres) return false;
        const subgenreArray = Array.isArray(subgenres) ? subgenres : [subgenres];
        return subgenreArray.some(sg => set.filters.subgenres?.includes(sg));
      });
    }
  }

  // Last fallback: use all available tropes
  if (matchingSets.length === 0) {
    console.warn('No matching trope sets found, using all available tropes');
    matchingSets = genre.tropeSets;
  }

  // Collect all tropes from matching sets
  const allTropes = matchingSets.flatMap(set => set.tropes);

  // Deduplicate by ID (keep first occurrence)
  const uniqueTropesMap = new Map<string, Trope>();
  allTropes.forEach(trope => {
    if (!uniqueTropesMap.has(trope.id)) {
      uniqueTropesMap.set(trope.id, trope);
    }
  });

  const uniqueTropes = Array.from(uniqueTropesMap.values());

  // If we still don't have enough tropes, pad with duplicates
  if (uniqueTropes.length < 24) {
    console.warn(
      `Only ${uniqueTropes.length} unique tropes available, padding to 24`
    );
    // Repeat tropes to fill board
    const needed = 24 - uniqueTropes.length;
    for (let i = 0; i < needed && uniqueTropes.length > 0; i++) {
      const tropeToRepeat = uniqueTropes[i % uniqueTropes.length];
      uniqueTropes.push({
        ...tropeToRepeat,
        id: `${tropeToRepeat.id}-${i}`, // Make ID unique
      });
    }
  }

  // Randomly select 24 tropes using seeded shuffle
  const shuffled = shuffleArray(uniqueTropes, seed);
  return shuffled.slice(0, 24);
}

/**
 * Check if a trope set matches the user's answers
 */
function matchesFilters(
  set: TropeSet,
  answers: Record<string, string | string[]>
): boolean {
  // Check each filter in the set
  for (const [filterKey, filterValue] of Object.entries(set.filters)) {
    const answer = answers[filterKey];

    if (filterValue === undefined || answer === undefined) {
      continue; // Skip undefined filters
    }

    // Handle array filters (like subgenres - matches if any overlap)
    if (Array.isArray(filterValue)) {
      const answerArray = Array.isArray(answer) ? answer : [answer];
      const hasMatch = filterValue.some(val => answerArray.includes(val));
      if (!hasMatch) {
        return false;
      }
    }
    // Handle single value filters (exact match required)
    else if (typeof filterValue === 'string') {
      if (Array.isArray(answer)) {
        // If answer is array, check if it includes the filter value
        if (!answer.includes(filterValue)) {
          return false;
        }
      } else {
        // Both are strings, must match exactly
        if (answer !== filterValue) {
          return false;
        }
      }
    }
  }

  return true;
}

/**
 * Generate a bingo board from tropes (24 tropes + 1 free space in center)
 */
export function generateBoard(tropes: Trope[]): (Trope | null)[] {
  if (tropes.length !== 24) {
    console.warn(`Expected 24 tropes, got ${tropes.length}`);
  }

  const board: (Trope | null)[] = [...tropes];
  // Insert null at position 12 (center of 5x5 grid)
  board.splice(12, 0, null);

  return board;
}

/**
 * Get trope by ID from board
 */
export function getTropeById(board: (Trope | null)[], id: string): Trope | null {
  return board.find(trope => trope?.id === id) || null;
}