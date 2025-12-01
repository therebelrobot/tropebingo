import type { Genre } from '@data/types';
import { getCustomGenres } from '@utils/customGenres';

// Import genre definitions
import { horrorGenre } from './horror';
import { loadJsonGenres } from './json/loader';

// Combine hardcoded genres with JSON-loaded genres and custom genres
const hardcodedGenres: Genre[] = [
  horrorGenre,
];

const jsonGenres = loadJsonGenres();

/**
 * Get all genres including custom ones from localStorage
 */
function getAllGenresIncludingCustom(): Genre[] {
  const customGenres = getCustomGenres();
  return [...hardcodedGenres, ...jsonGenres, ...customGenres];
}

/**
 * Get all available genres (including custom ones)
 */
export function getAllGenres(): Genre[] {
  return getAllGenresIncludingCustom();
}

/**
 * Get genre by ID (including custom ones)
 */
export function getGenreById(id: string): Genre | null {
  const allGenres = getAllGenresIncludingCustom();
  return allGenres.find(g => g.id === id) || null;
}

/**
 * Check if a genre exists (including custom ones)
 */
export function hasGenre(id: string): boolean {
  const allGenres = getAllGenresIncludingCustom();
  return allGenres.some(g => g.id === id);
}