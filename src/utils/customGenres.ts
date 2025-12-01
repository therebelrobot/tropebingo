import type { Genre } from '@data/types';

const CUSTOM_GENRES_KEY = 'tropebingo_custom_genres';

/**
 * Get all custom genres from localStorage
 */
export function getCustomGenres(): Genre[] {
  try {
    const stored = localStorage.getItem(CUSTOM_GENRES_KEY);
    if (!stored) return [];

    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Error loading custom genres:', error);
    return [];
  }
}

/**
 * Save a custom genre to localStorage
 */
export function saveCustomGenre(genre: Genre): void {
  try {
    const existing = getCustomGenres();

    // Replace if exists, otherwise add
    const index = existing.findIndex(g => g.id === genre.id);
    if (index >= 0) {
      existing[index] = genre;
    } else {
      existing.push(genre);
    }

    localStorage.setItem(CUSTOM_GENRES_KEY, JSON.stringify(existing));
  } catch (error) {
    console.error('Error saving custom genre:', error);
    throw new Error('Failed to save genre to browser storage');
  }
}

/**
 * Delete a custom genre from localStorage
 */
export function deleteCustomGenre(genreId: string): void {
  try {
    const existing = getCustomGenres();
    const filtered = existing.filter(g => g.id !== genreId);
    localStorage.setItem(CUSTOM_GENRES_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error deleting custom genre:', error);
    throw new Error('Failed to delete genre from browser storage');
  }
}

/**
 * Check if a genre is custom (saved in localStorage)
 */
export function isCustomGenre(genreId: string): boolean {
  return getCustomGenres().some(g => g.id === genreId);
}