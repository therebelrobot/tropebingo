import type { Genre } from '@data/types';

/**
 * Dynamically imports all JSON genre files from this directory
 * using Vite's glob import feature.
 * 
 * To add a new genre, simply place a JSON file in this directory.
 * The file will be automatically picked up on next build.
 */

// Import all .json files in this directory
const genreModules = import.meta.glob<{ default: Genre }>('./*.json', { eager: true });

// Extract genres from imported modules
export function loadJsonGenres(): Genre[] {
  const genres: Genre[] = [];

  for (const path in genreModules) {
    // Skip the .gitkeep file
    if (path.includes('.gitkeep')) continue;

    try {
      const module = genreModules[path];
      if (module && module.default) {
        genres.push(module.default);
      }
    } catch (error) {
      console.error(`Error loading genre from ${path}:`, error);
    }
  }

  return genres;
}