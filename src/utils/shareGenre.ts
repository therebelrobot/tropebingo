import type { Genre } from '@data/types';
import { saveCustomGenre } from './customGenres';

/**
 * Encode genre to URL-safe base64 string
 */
export function encodeGenreToUrl(genre: Genre): string {
  const json = JSON.stringify(genre);
  // Convert to base64 and make URL-safe
  const base64 = btoa(unescape(encodeURIComponent(json)));
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

/**
 * Decode genre from URL-safe base64 string
 */
export function decodeGenreFromUrl(encoded: string): Genre | null {
  try {
    // Restore base64 characters
    const base64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
    // Add padding if needed
    const padded = base64 + '=='.substring(0, (4 - base64.length % 4) % 4);
    // Decode
    const json = decodeURIComponent(escape(atob(padded)));
    return JSON.parse(json) as Genre;
  } catch (error) {
    console.error('Error decoding genre from URL:', error);
    return null;
  }
}

/**
 * Create shareable URL for a genre
 */
export function createShareUrl(genre: Genre): string {
  const encoded = encodeGenreToUrl(genre);
  const baseUrl = window.location.origin + window.location.pathname;
  return `${baseUrl}#share=${encoded}`;
}

/**
 * Check if URL contains shared genre data
 */
export function getSharedGenreFromUrl(): Genre | null {
  const hash = window.location.hash;
  if (!hash.startsWith('#share=')) return null;

  const encoded = hash.substring(7); // Remove '#share='
  return decodeGenreFromUrl(encoded);
}

/**
 * Clear shared genre from URL
 */
export function clearShareUrl(): void {
  if (window.location.hash.startsWith('#share=')) {
    window.history.replaceState(null, '', window.location.pathname);
  }
}

/**
 * Handle shared genre import with callbacks for UI
 */
export function handleSharedGenreImport(
  genre: Genre,
  onSuccess: (message: string) => void,
  onError: (message: string) => void
): void {
  try {
    saveCustomGenre(genre);
    clearShareUrl();
    onSuccess(`"${genre.name}" has been imported successfully!`);
    // Reload to show new genre in selector
    setTimeout(() => window.location.reload(), 1500);
  } catch (error) {
    onError('Failed to import genre: ' + (error as Error).message);
  }
}