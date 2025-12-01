import React, { useState } from 'react';
import { useGenreEditor } from '@context/GenreEditorContext';
import type { Question, QuestionOption } from '@data/types';
import { Button } from '@components/ui/Button';
import { Modal } from '@components/ui/Modal';
import { generateUniqueSlug } from '@utils/slugify';

export function QuestionsEditor() {
  const { editingGenre, updateGenre } = useGenreEditor();
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);
  const [deleteModal, setDeleteModal] = useState<{ show: boolean; index: number }>({
    show: false,
    index: -1,
  });

  if (!editingGenre) return null;

  const addQuestion = () => {
    const newQuestion: Question = {
      id: `question-${Date.now()}`,
      type: 'single',
      text: 'New Question',
      options: [],
    };
    updateGenre({
      questions: [...editingGenre.questions, newQuestion],
    });
    setExpandedQuestion(editingGenre.questions.length);
  };

  const updateQuestion = (index: number, updates: Partial<Question>) => {
    const updated = [...editingGenre.questions];
    updated[index] = { ...updated[index], ...updates };
    updateGenre({ questions: updated });
  };

  const deleteQuestion = (index: number) => {
    setDeleteModal({ show: true, index });
  };

  const handleConfirmDelete = () => {
    const updated = editingGenre.questions.filter((_, i) => i !== deleteModal.index);
    updateGenre({ questions: updated });
    setExpandedQuestion(null);
    setDeleteModal({ show: false, index: -1 });
  };

  const addOption = (questionIndex: number) => {
    const question = editingGenre.questions[questionIndex];
    const existingIds = question.options.map(o => o.id);
    const existingValues = question.options.map(o => o.value);
    
    const baseText = 'New Option';
    const newId = generateUniqueSlug(baseText, existingIds);
    const newValue = generateUniqueSlug(baseText, existingValues);
    
    const newOption: QuestionOption = {
      id: newId,
      text: baseText,
      value: newValue,
    };
    updateQuestion(questionIndex, {
      options: [...question.options, newOption],
    });
  };

  const updateOption = (questionIndex: number, optionIndex: number, updates: Partial<QuestionOption>) => {
    const question = editingGenre.questions[questionIndex];
    const updatedOptions = [...question.options];
    const currentOption = updatedOptions[optionIndex];
    
    // If text is being updated, auto-update value to match (as slug)
    if (updates.text !== undefined && updates.text !== currentOption.text) {
      const otherValues = question.options
        .filter((_, i) => i !== optionIndex)
        .map(o => o.value);
      
      updates.value = generateUniqueSlug(updates.text, otherValues);
    }
    
    updatedOptions[optionIndex] = { ...currentOption, ...updates };
    updateQuestion(questionIndex, { options: updatedOptions });
  };

  const deleteOption = (questionIndex: number, optionIndex: number) => {
    const question = editingGenre.questions[questionIndex];
    const updatedOptions = question.options.filter((_, i) => i !== optionIndex);
    updateQuestion(questionIndex, { options: updatedOptions });
  };

  const moveQuestion = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= editingGenre.questions.length) return;
    
    const updated = [...editingGenre.questions];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    updateGenre({ questions: updated });
    setExpandedQuestion(newIndex);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-[var(--color-text)]">
          Questions ({editingGenre.questions.length})
        </h3>
        <Button onClick={addQuestion}>
          + Add Question
        </Button>
      </div>

      {editingGenre.questions.length === 0 && (
        <div className="text-center py-12 text-[var(--color-text-secondary)]">
          No questions yet. Click "Add Question" to get started.
        </div>
      )}

      <div className="space-y-3">
        {editingGenre.questions.map((question, qIndex) => (
          <div
            key={question.id}
            className="border border-[var(--color-border)] rounded-lg overflow-hidden"
          >
            <div
              className="bg-[var(--color-surface)] p-4 cursor-pointer hover:bg-[var(--color-background)] transition-colors"
              onClick={() => setExpandedQuestion(expandedQuestion === qIndex ? null : qIndex)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <span className="text-[var(--color-text)] font-medium">
                      {qIndex + 1}. {question.text}
                    </span>
                    <span className="text-xs px-2 py-1 rounded bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                      {question.type === 'single' ? 'Single Choice' : 'Multiple Choice'}
                    </span>
                  </div>
                  <div className="text-sm text-[var(--color-text-secondary)] mt-1">
                    {question.options.length} options
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={(e) => { e.stopPropagation(); moveQuestion(qIndex, 'up'); }}
                    variant="ghost"
                    disabled={qIndex === 0}
                    className="px-2 py-1"
                  >
                    ↑
                  </Button>
                  <Button
                    onClick={(e) => { e.stopPropagation(); moveQuestion(qIndex, 'down'); }}
                    variant="ghost"
                    disabled={qIndex === editingGenre.questions.length - 1}
                    className="px-2 py-1"
                  >
                    ↓
                  </Button>
                </div>
              </div>
            </div>

            {expandedQuestion === qIndex && (
              <div className="p-4 border-t border-[var(--color-border)] space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-[var(--color-text)]">
                    Question ID
                  </label>
                  <input
                    type="text"
                    value={question.id}
                    onChange={(e) => updateQuestion(qIndex, { id: e.target.value })}
                    className="w-full px-3 py-2 border border-[var(--color-border)] rounded bg-[var(--color-background)] text-[var(--color-text)]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-[var(--color-text)]">
                    Question Text
                  </label>
                  <input
                    type="text"
                    value={question.text}
                    onChange={(e) => updateQuestion(qIndex, { text: e.target.value })}
                    className="w-full px-3 py-2 border border-[var(--color-border)] rounded bg-[var(--color-background)] text-[var(--color-text)]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-[var(--color-text)]">
                    Type
                  </label>
                  <select
                    value={question.type}
                    onChange={(e) => updateQuestion(qIndex, { type: e.target.value as 'single' | 'multiple' })}
                    className="w-full px-3 py-2 border border-[var(--color-border)] rounded bg-[var(--color-background)] text-[var(--color-text)]"
                  >
                    <option value="single">Single Choice</option>
                    <option value="multiple">Multiple Choice</option>
                  </select>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-[var(--color-text)]">
                      Options
                    </label>
                    <Button onClick={() => addOption(qIndex)} variant="outline" className="text-xs py-1 px-2">
                      + Add Option
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {question.options.map((option, oIndex) => (
                      <div key={option.id} className="border border-[var(--color-border)] rounded p-3 bg-[var(--color-background)]">
                        <div className="flex gap-2 items-start mb-2">
                          <input
                            type="text"
                            value={option.text}
                            onChange={(e) => updateOption(qIndex, oIndex, { text: e.target.value })}
                            placeholder="Display text"
                            className="flex-1 px-3 py-2 border border-[var(--color-border)] rounded bg-[var(--color-surface)] text-[var(--color-text)] text-sm"
                          />
                          <Button
                            onClick={() => deleteOption(qIndex, oIndex)}
                            variant="ghost"
                            className="px-2 py-2 text-red-600 hover:text-red-700"
                          >
                            ×
                          </Button>
                        </div>
                        <div>
                          <label className="text-xs text-[var(--color-text-secondary)] mb-1 block">
                            Value (auto-generated from text, editable)
                          </label>
                          <input
                            type="text"
                            value={option.value}
                            onChange={(e) => updateOption(qIndex, oIndex, { value: e.target.value })}
                            placeholder="value-slug"
                            className="w-full px-3 py-2 border border-[var(--color-border)] rounded bg-[var(--color-surface)] text-[var(--color-text)] text-sm font-mono"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-[var(--color-border)]">
                  <Button
                    onClick={() => deleteQuestion(qIndex)}
                    variant="outline"
                    className="text-red-600 hover:text-red-700 hover:border-red-600"
                  >
                    Delete Question
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <Modal
        isOpen={deleteModal.show}
        onClose={() => setDeleteModal({ show: false, index: -1 })}
        onConfirm={handleConfirmDelete}
        title="Delete Question"
        message="Are you sure you want to delete this question? This action cannot be undone."
        type="confirm"
      />
    </div>
  );
}