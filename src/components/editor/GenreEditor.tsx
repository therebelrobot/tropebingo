import { useState, useRef, useCallback } from 'react';
import { useGenreEditor } from '@context/GenreEditorContext';
import { getAllGenres } from '@data/genres';
import type { Genre } from '@data/types';
import { Button } from '@components/ui/Button';
import { Modal } from '@components/ui/Modal';
import { BasicInfoEditor } from './BasicInfoEditor';
import { QuestionsEditor } from './QuestionsEditor';
import { TropeSetsEditor } from './TropeSetsEditor';
import { saveCustomGenre } from '@utils/customGenres';
import { createShareUrl } from '@utils/shareGenre';

function EditorTabs() {
  const [activeTab, setActiveTab] = useState<'basic' | 'questions' | 'tropes'>('basic');

  const tabs = [
    { id: 'basic' as const, label: 'Basic Info' },
    { id: 'questions' as const, label: 'Questions' },
    { id: 'tropes' as const, label: 'Trope Sets' },
  ];

  return (
    <div className="space-y-6">
      <div className="border-b border-[var(--color-border)]">
        <div className="flex gap-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 font-medium transition-colors border-b-2 ${
                activeTab === tab.id
                  ? 'border-[var(--color-primary)] text-[var(--color-primary)]'
                  : 'border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text)]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-[var(--color-surface)] rounded-lg p-6 border border-[var(--color-border)]">
        {activeTab === 'basic' && <BasicInfoEditor />}
        {activeTab === 'questions' && <QuestionsEditor />}
        {activeTab === 'tropes' && <TropeSetsEditor />}
      </div>
    </div>
  );
}

export function GenreEditor() {
  const { editingGenre, hasUnsavedChanges, loadGenre, exportGenre, clearEditor } = useGenreEditor();
  const [showImportModal, setShowImportModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [alertTitle, setAlertTitle] = useState<string | null>(null);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [shouldShowAlert, setShouldShowAlert] = useState(false);

  const showAlert = useCallback((message: string, title: string = 'Alert') => {
    setAlertTitle(title);
    setAlertMessage(message);
    setShouldShowAlert(true);
  }, [setAlertTitle, setAlertMessage, setShouldShowAlert]);

  const handleSaveToBrowser = () => {
    if (!editingGenre) return;
    
    try {
      saveCustomGenre(editingGenre);
      showAlert(
        `"${editingGenre.name}" has been saved to your browser!\n\nIt will now appear in the genre selector.`,
        'Saved Successfully'
      );
    } catch (error) {
      showAlert('Failed to save genre: ' + (error as Error).message, 'Error');
    }
  };

  const handleShare = async () => {
    if (!editingGenre) return;

    const shareUrl = createShareUrl(editingGenre);
    
    try {
      await navigator.clipboard.writeText(shareUrl);
      showAlert(
        `Share link copied to clipboard!\n\nAnyone who opens this link will be prompted to import "${editingGenre.name}" into their browser.\n\nShare via text, QR code, email, etc.`,
        'Share Link Ready'
      );
    } catch (error) {
      showAlert(`Copy this link to share:\n\n${shareUrl}`, 'Share Link');
    }
  };

  const handleLoadExisting = (genreId: string) => {
    const genres = getAllGenres();
    const genre = genres.find(g => g.id === genreId);
    if (genre) {
      loadGenre(genre);
    }
  };

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const genre = JSON.parse(content) as Genre;
        loadGenre(genre);
        setShowImportModal(false);
      } catch (error) {
        showAlert('Error parsing JSON file: ' + (error as Error).message, 'Import Error');
      }
    };
    reader.readAsText(file);
  };

  const handleNewGenre = () => {
    const newGenre: Genre = {
      id: 'new-genre',
      name: 'New Genre',
      description: 'Enter a description',
      questions: [],
      tropeSets: [],
      theme: {
        light: {
          primary: '#3b82f6',
          primaryHover: '#2563eb',
          surface: '#eff6ff',
          accent: '#1d4ed8',
        },
        dark: {
          primary: '#2563eb',
          primaryHover: '#1d4ed8',
          surface: '#1e293b',
          accent: '#3b82f6',
        },
      },
    };
    loadGenre(newGenre);
  };

  if (!editingGenre) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-[var(--color-background)]">
        <div className="max-w-2xl w-full">
          <h1 className="text-4xl font-bold mb-4 text-[var(--color-text)]">Genre Editor</h1>
          <p className="text-lg mb-8 text-[var(--color-text-secondary)]">
            Create, edit, and manage genre files for your trope bingo games.
          </p>

          <div className="space-y-4">
            <Button onClick={handleNewGenre} className="w-full">
              Create New Genre
            </Button>

            <Button 
              onClick={() => setShowImportModal(true)} 
              variant="secondary"
              className="w-full"
            >
              Import Genre File
            </Button>

            <div className="border-t border-[var(--color-border)] pt-4 mt-6">
              <h2 className="text-xl font-semibold mb-3 text-[var(--color-text)]">
                Edit Existing Genres
              </h2>
              <div className="space-y-2">
                {getAllGenres().map(genre => (
                  <Button
                    key={genre.id}
                    onClick={() => handleLoadExisting(genre.id)}
                    variant="outline"
                    className="w-full justify-start"
                  >
                    {genre.name}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {showImportModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
              <div className="bg-[var(--color-surface)] rounded-lg p-6 max-w-md w-full">
                <h3 className="text-xl font-bold mb-4 text-[var(--color-text)]">Import Genre File</h3>
                <p className="mb-4 text-[var(--color-text-secondary)]">
                  Select a JSON file containing genre data to import.
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json"
                  onChange={handleFileImport}
                  className="w-full mb-4 p-2 border border-[var(--color-border)] rounded"
                />
                <div className="flex gap-2">
                  <Button onClick={() => setShowImportModal(false)} variant="outline" className="flex-1">
                    Cancel
                  </Button>
                  <Button onClick={() => fileInputRef.current?.click()} className="flex-1">
                    Choose File
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)] p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-[var(--color-text)]">
              Editing: {editingGenre.name}
            </h1>
            {hasUnsavedChanges && (
              <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-1">
                You have unsaved changes
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSaveToBrowser} variant="primary">
              💾 Save to Browser
            </Button>
            <Button onClick={handleShare} variant="secondary">
              🔗 Share Link
            </Button>
            <Button onClick={exportGenre} variant="outline">
              Export JSON
            </Button>
            <Button onClick={clearEditor} variant="outline">
              Close
            </Button>
          </div>
        </div>

        <EditorTabs />
      </div>
      <Modal
        isOpen={shouldShowAlert}
        onClose={() => setShouldShowAlert(false)}
        title={alertTitle || 'Alert'}
        message={alertMessage || ''}
        type="alert"
        confirmText="OK"
      />
    </div>
  );
}