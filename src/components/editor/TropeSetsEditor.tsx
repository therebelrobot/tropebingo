import React, { useState } from 'react';
import { useGenreEditor } from '@context/GenreEditorContext';
import type { TropeSet, Trope } from '@data/types';
import { Button } from '@components/ui/Button';
import { Modal } from '@components/ui/Modal';
import { slugify } from '@utils/slugify';

export function TropeSetsEditor() {
  const { editingGenre, updateGenre } = useGenreEditor();
  const [expandedSet, setExpandedSet] = useState<number | null>(null);
  const [expandedTrope, setExpandedTrope] = useState<string | null>(null);
  const [duplicateModal, setDuplicateModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{ show: boolean; index: number }>({
    show: false,
    index: -1,
  });

  if (!editingGenre) return null;

  // Generate set ID from filters
  const generateSetId = (filters: Record<string, string | string[]>): string => {
    const parts: string[] = [];
    
    for (const [key, value] of Object.entries(filters)) {
      if (value === undefined) continue;
      
      if (Array.isArray(value)) {
        parts.push(...value.map(v => slugify(v)));
      } else {
        parts.push(slugify(value));
      }
    }
    
    return parts.length > 0 ? parts.join('-') : 'default';
  };

  // Check if filters combination already exists
  const isDuplicateFilters = (filters: Record<string, string | string[]>, excludeIndex?: number): boolean => {
    const newId = generateSetId(filters);
    
    return editingGenre.tropeSets.some((set, index) => {
      if (index === excludeIndex) return false;
      return set.id === newId;
    });
  };

  const addTropeSet = () => {
    // Start with empty filters
    const newFilters: Record<string, string | string[]> = {};
    
    // Initialize with first option of each question
    editingGenre.questions.forEach(q => {
      if (q.options.length > 0) {
        if (q.type === 'multiple') {
          newFilters[q.id] = [];
        } else {
          newFilters[q.id] = q.options[0].value;
        }
      }
    });

    const newId = generateSetId(newFilters);
    
    // Check for duplicates
    if (isDuplicateFilters(newFilters)) {
      setDuplicateModal(true);
      return;
    }

    const newSet: TropeSet = {
      id: newId,
      filters: newFilters,
      tropes: [],
    };
    
    updateGenre({
      tropeSets: [...editingGenre.tropeSets, newSet],
    });
    setExpandedSet(editingGenre.tropeSets.length);
  };

  const updateTropeSetFilters = (index: number, newFilters: Record<string, string | string[] | undefined>) => {
    // Clean undefined values
    const cleanFilters: Record<string, string | string[]> = {};
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value !== undefined) {
        cleanFilters[key] = value;
      }
    });
    
    const newId = generateSetId(cleanFilters);
    
    // Check for duplicates (excluding current set)
    if (isDuplicateFilters(cleanFilters, index)) {
      setDuplicateModal(true);
      return;
    }

    const updated = [...editingGenre.tropeSets];
    updated[index] = {
      ...updated[index],
      id: newId,
      filters: cleanFilters,
    };
    updateGenre({ tropeSets: updated });
  };

  const updateTropeSet = (index: number, updates: Partial<TropeSet>) => {
    const updated = [...editingGenre.tropeSets];
    updated[index] = { ...updated[index], ...updates };
    updateGenre({ tropeSets: updated });
  };

  const deleteTropeSet = (index: number) => {
    setDeleteModal({ show: true, index });
  };

  const handleConfirmDelete = () => {
    const updated = editingGenre.tropeSets.filter((_, i) => i !== deleteModal.index);
    updateGenre({ tropeSets: updated });
    setExpandedSet(null);
    setDeleteModal({ show: false, index: -1 });
  };

  const addTrope = (setIndex: number) => {
    const tropeSet = editingGenre.tropeSets[setIndex];
    const newTrope: Trope = {
      id: `trope-${Date.now()}`,
      text: 'New Trope',
      description: '',
    };
    updateTropeSet(setIndex, {
      tropes: [...tropeSet.tropes, newTrope],
    });
  };

  const updateTrope = (setIndex: number, tropeIndex: number, updates: Partial<Trope>) => {
    const tropeSet = editingGenre.tropeSets[setIndex];
    const updatedTropes = [...tropeSet.tropes];
    updatedTropes[tropeIndex] = { ...updatedTropes[tropeIndex], ...updates };
    updateTropeSet(setIndex, { tropes: updatedTropes });
  };

  const deleteTrope = (setIndex: number, tropeIndex: number) => {
    const tropeSet = editingGenre.tropeSets[setIndex];
    const updatedTropes = tropeSet.tropes.filter((_, i) => i !== tropeIndex);
    updateTropeSet(setIndex, { tropes: updatedTropes });
  };

  // Get display name for filter values
  const getFilterDisplayName = (questionId: string, value: string | string[]): string => {
    const question = editingGenre.questions.find(q => q.id === questionId);
    if (!question) return String(value);

    if (Array.isArray(value)) {
      return value
        .map(v => question.options.find(o => o.value === v)?.text || v)
        .join(', ');
    }

    return question.options.find(o => o.value === value)?.text || String(value);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-[var(--color-text)]">
          Trope Sets ({editingGenre.tropeSets.length})
        </h3>
        <Button onClick={addTropeSet} disabled={editingGenre.questions.length === 0}>
          + Add Trope Set
        </Button>
      </div>

      {editingGenre.questions.length === 0 && (
        <div className="text-center py-8 text-[var(--color-text-secondary)] bg-[var(--color-surface)] rounded-lg border border-[var(--color-border)]">
          Add questions first to create trope sets with filters.
        </div>
      )}

      {editingGenre.tropeSets.length === 0 && editingGenre.questions.length > 0 && (
        <div className="text-center py-12 text-[var(--color-text-secondary)]">
          No trope sets yet. Click "Add Trope Set" to get started.
        </div>
      )}

      <div className="space-y-3">
        {editingGenre.tropeSets.map((set, sIndex) => (
          <div
            key={set.id}
            className="border border-[var(--color-border)] rounded-lg overflow-hidden"
          >
            <div
              className="bg-[var(--color-surface)] p-4 cursor-pointer hover:bg-[var(--color-background)] transition-colors"
              onClick={() => setExpandedSet(expandedSet === sIndex ? null : sIndex)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-[var(--color-text)] font-mono text-sm">
                    {set.id}
                  </div>
                  <div className="text-sm text-[var(--color-text-secondary)] mt-1">
                    {Object.entries(set.filters).map(([key, value]) => {
                      if (value === undefined) return null;
                      return (
                        <span key={key} className="mr-3">
                          <strong>{key}:</strong> {getFilterDisplayName(key, value)}
                        </span>
                      );
                    })}
                  </div>
                  <div className="text-xs text-[var(--color-text-secondary)] mt-1">
                    {set.tropes.length} tropes
                  </div>
                </div>
              </div>
            </div>

            {expandedSet === sIndex && (
              <div className="p-4 border-t border-[var(--color-border)] space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-[var(--color-text)]">
                    Filters
                  </label>
                  <div className="space-y-3 bg-[var(--color-background)] p-4 rounded-lg">
                    {editingGenre.questions.map(question => (
                      <div key={question.id}>
                        <label className="block text-xs font-medium mb-1 text-[var(--color-text)]">
                          {question.text}
                        </label>
                        {question.type === 'single' ? (
                          <select
                            value={String(set.filters[question.id] || '')}
                            onChange={(e) => {
                              const newFilters = { ...set.filters };
                              if (e.target.value) {
                                newFilters[question.id] = e.target.value;
                              } else {
                                delete newFilters[question.id];
                              }
                              updateTropeSetFilters(sIndex, newFilters);
                            }}
                            className="w-full px-3 py-2 border border-[var(--color-border)] rounded bg-[var(--color-surface)] text-[var(--color-text)]"
                          >
                            <option value="">Any</option>
                            {question.options.map(option => (
                              <option key={option.id} value={option.value}>
                                {option.text}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <div className="space-y-2">
                            {question.options.map(option => {
                              const currentValues = Array.isArray(set.filters[question.id]) 
                                ? set.filters[question.id] as string[]
                                : [];
                              const isChecked = currentValues.includes(option.value);
                              
                              return (
                                <label key={option.id} className="flex items-center gap-2 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={(e) => {
                                      const newFilters = { ...set.filters };
                                      let newValues: string[];
                                      if (e.target.checked) {
                                        newValues = [...currentValues, option.value];
                                      } else {
                                        newValues = currentValues.filter(v => v !== option.value);
                                      }
                                      if (newValues.length > 0) {
                                        newFilters[question.id] = newValues;
                                      } else {
                                        delete newFilters[question.id];
                                      }
                                      updateTropeSetFilters(sIndex, newFilters);
                                    }}
                                    className="rounded"
                                  />
                                  <span className="text-sm text-[var(--color-text)]">{option.text}</span>
                                </label>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-[var(--color-text-secondary)] mt-2">
                    Set ID: <code className="font-mono bg-[var(--color-surface)] px-2 py-1 rounded">{set.id}</code> (auto-generated from selections)
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-[var(--color-text)]">
                      Tropes
                    </label>
                    <Button onClick={() => addTrope(sIndex)} variant="outline" className="text-xs py-1 px-2">
                      + Add Trope
                    </Button>
                  </div>

                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {set.tropes.map((trope, tIndex) => (
                      <div key={trope.id} className="border border-[var(--color-border)] rounded p-3">
                        <div
                          className="cursor-pointer"
                          onClick={() => setExpandedTrope(expandedTrope === trope.id ? null : trope.id)}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-[var(--color-text)]">{trope.text}</span>
                            <span className="text-xs text-[var(--color-text-secondary)]">
                              {expandedTrope === trope.id ? '▼' : '▶'}
                            </span>
                          </div>
                          {trope.description && (
                            <div className="text-sm text-[var(--color-text-secondary)] mt-1">
                              {trope.description}
                            </div>
                          )}
                        </div>

                        {expandedTrope === trope.id && (
                          <div className="mt-3 space-y-2 pt-3 border-t border-[var(--color-border)]">
                            <input
                              type="text"
                              value={trope.id}
                              onChange={(e) => updateTrope(sIndex, tIndex, { id: e.target.value })}
                              placeholder="ID"
                              className="w-full px-3 py-2 border border-[var(--color-border)] rounded bg-[var(--color-background)] text-[var(--color-text)] text-sm"
                            />
                            <input
                              type="text"
                              value={trope.text}
                              onChange={(e) => updateTrope(sIndex, tIndex, { text: e.target.value })}
                              placeholder="Display Text"
                              className="w-full px-3 py-2 border border-[var(--color-border)] rounded bg-[var(--color-background)] text-[var(--color-text)] text-sm"
                            />
                            <input
                              type="text"
                              value={trope.description || ''}
                              onChange={(e) => updateTrope(sIndex, tIndex, { description: e.target.value })}
                              placeholder="Description (optional)"
                              className="w-full px-3 py-2 border border-[var(--color-border)] rounded bg-[var(--color-background)] text-[var(--color-text)] text-sm"
                            />
                            <input
                              type="text"
                              value={trope.citation || ''}
                              onChange={(e) => updateTrope(sIndex, tIndex, { citation: e.target.value })}
                              placeholder="Citation (optional)"
                              className="w-full px-3 py-2 border border-[var(--color-border)] rounded bg-[var(--color-background)] text-[var(--color-text)] text-sm"
                            />
                            <Button
                              onClick={() => deleteTrope(sIndex, tIndex)}
                              variant="ghost"
                              className="text-red-600 hover:text-red-700 text-sm"
                            >
                              Delete Trope
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-[var(--color-border)]">
                  <Button
                    onClick={() => deleteTropeSet(sIndex)}
                    variant="outline"
                    className="text-red-600 hover:text-red-700 hover:border-red-600"
                  >
                    Delete Trope Set
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <Modal
        isOpen={duplicateModal}
        onClose={() => setDuplicateModal(false)}
        title="Duplicate Trope Set"
        message="A trope set with these filters already exists! Please select different filter values."
        type="alert"
      />

      <Modal
        isOpen={deleteModal.show}
        onClose={() => setDeleteModal({ show: false, index: -1 })}
        onConfirm={handleConfirmDelete}
        title="Delete Trope Set"
        message="Are you sure you want to delete this trope set and all its tropes? This action cannot be undone."
        type="confirm"
      />
    </div>
  );
}