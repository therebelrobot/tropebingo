import React, { createContext, useContext, useState, useCallback } from 'react';
import type { Genre } from '@data/types';

interface GenreEditorContextType {
  editingGenre: Genre | null;
  originalGenre: Genre | null;
  hasUnsavedChanges: boolean;
  loadGenre: (genre: Genre) => void;
  updateGenre: (updates: Partial<Genre>) => void;
  resetChanges: () => void;
  clearEditor: () => void;
  exportGenre: () => void;
}

const GenreEditorContext = createContext<GenreEditorContextType | undefined>(undefined);

export function GenreEditorProvider({ children }: { children: React.ReactNode }) {
  const [editingGenre, setEditingGenre] = useState<Genre | null>(null);
  const [originalGenre, setOriginalGenre] = useState<Genre | null>(null);

  const hasUnsavedChanges = editingGenre !== null && 
    originalGenre !== null && 
    JSON.stringify(editingGenre) !== JSON.stringify(originalGenre);

  const loadGenre = useCallback((genre: Genre) => {
    // Deep clone to avoid reference issues
    let cloned = JSON.parse(JSON.stringify(genre)) as Genre;
    
    // Normalize filter keys to match question IDs
    // This handles cases where existing genres use different key names
    const questionIds = new Set(cloned.questions.map(q => q.id));
    
    cloned.tropeSets = cloned.tropeSets.map(set => {
      const normalizedFilters: Record<string, string | string[]> = {};
      
      Object.entries(set.filters).forEach(([key, value]) => {
        // Try to match filter key to a question ID
        let matchedKey = key;
        
        // Common normalizations
        if (!questionIds.has(key)) {
          // Try singular/plural variations
          const singular = key.replace(/s$/, '');
          const plural = key + 's';
          
          if (questionIds.has(singular)) {
            matchedKey = singular;
          } else if (questionIds.has(plural)) {
            matchedKey = plural;
          }
        }
        
        if (value !== undefined) {
          normalizedFilters[matchedKey] = value;
        }
      });
      
      return { ...set, filters: normalizedFilters };
    });
    
    setEditingGenre(cloned);
    setOriginalGenre(JSON.parse(JSON.stringify(genre)) as Genre);
  }, []);

  const updateGenre = useCallback((updates: Partial<Genre>) => {
    setEditingGenre(prev => {
      if (!prev) return null;
      return { ...prev, ...updates };
    });
  }, []);

  const resetChanges = useCallback(() => {
    if (originalGenre) {
      setEditingGenre(JSON.parse(JSON.stringify(originalGenre)) as Genre);
    }
  }, [originalGenre]);

  const clearEditor = useCallback(() => {
    setEditingGenre(null);
    setOriginalGenre(null);
  }, []);

  const exportGenre = useCallback(() => {
    if (!editingGenre) return;

    const dataStr = JSON.stringify(editingGenre, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${editingGenre.id}-genre.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [editingGenre]);

  return (
    <GenreEditorContext.Provider
      value={{
        editingGenre,
        originalGenre,
        hasUnsavedChanges,
        loadGenre,
        updateGenre,
        resetChanges,
        clearEditor,
        exportGenre,
      }}
    >
      {children}
    </GenreEditorContext.Provider>
  );
}

export function useGenreEditor() {
  const context = useContext(GenreEditorContext);
  if (!context) {
    throw new Error('useGenreEditor must be used within GenreEditorProvider');
  }
  return context;
}