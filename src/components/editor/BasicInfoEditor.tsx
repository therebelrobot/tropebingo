import { useState } from 'react';
import { useGenreEditor } from '@context/GenreEditorContext';
import { Button } from '@components/ui/Button';
import { COLOR_PALETTES, generateRandomPalette, type ColorPalette } from '@utils/colorPalettes';

function PaletteSuggestions({ onApplyPalette }: { onApplyPalette: (palette: ColorPalette) => void }) {
  return (
    <div className="mb-6 p-4 bg-[var(--color-background)] rounded-lg border border-[var(--color-border)]">
      <h4 className="font-medium mb-3 text-[var(--color-text)]">Color Palette Presets</h4>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-3">
        {COLOR_PALETTES.map((palette) => (
          <button
            key={palette.name}
            onClick={() => onApplyPalette(palette)}
            className="p-3 text-left border border-[var(--color-border)] rounded-lg hover:border-[var(--color-primary)] transition-colors group"
          >
            <div className="flex gap-1 mb-2">
              {palette.preview.map((color, i) => (
                <div key={i} className="w-full h-6 rounded" style={{ backgroundColor: color }} />
              ))}
            </div>
            <div className="text-sm font-medium text-[var(--color-text)] group-hover:text-[var(--color-primary)]">
              {palette.name}
            </div>
            <div className="text-xs text-[var(--color-text-secondary)] mt-1">
              {palette.description}
            </div>
          </button>
        ))}
      </div>
      <div className="pt-3 border-t border-[var(--color-border)]">
        <Button
          onClick={() => onApplyPalette(generateRandomPalette())}
          variant="outline"
          className="w-full text-sm"
        >
          🎲 Generate Random Palette
        </Button>
      </div>
    </div>
  );
}

export function BasicInfoEditor() {
  const { editingGenre, updateGenre } = useGenreEditor();
  const [showPalettes, setShowPalettes] = useState(false);

  if (!editingGenre) return null;

  const handleChange = (field: string, value: string) => {
    updateGenre({ [field]: value });
  };

  const handleThemeChange = (mode: 'light' | 'dark', property: string, value: string) => {
    if (!editingGenre.theme) return;
    
    updateGenre({
      theme: {
        ...editingGenre.theme,
        [mode]: {
          ...editingGenre.theme[mode],
          [property]: value,
        },
      },
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2 text-[var(--color-text)]">
          Genre ID
        </label>
        <input
          type="text"
          value={editingGenre.id}
          onChange={(e) => handleChange('id', e.target.value)}
          className="w-full px-4 py-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-background)] text-[var(--color-text)]"
          placeholder="horror, romcom, etc."
        />
        <p className="text-xs text-[var(--color-text-secondary)] mt-1">
          Lowercase, no spaces. Used in URLs and file names.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2 text-[var(--color-text)]">
          Display Name
        </label>
        <input
          type="text"
          value={editingGenre.name}
          onChange={(e) => handleChange('name', e.target.value)}
          className="w-full px-4 py-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-background)] text-[var(--color-text)]"
          placeholder="Horror Movies"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2 text-[var(--color-text)]">
          Description
        </label>
        <textarea
          value={editingGenre.description || ''}
          onChange={(e) => handleChange('description', e.target.value)}
          className="w-full px-4 py-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-background)] text-[var(--color-text)]"
          rows={3}
          placeholder="Brief description of this genre..."
        />
      </div>

      {editingGenre.theme && (
        <div className="border-t border-[var(--color-border)] pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[var(--color-text)]">Theme Colors</h3>
            <Button
              onClick={() => setShowPalettes(!showPalettes)}
              variant="outline"
              className="text-sm"
            >
              {showPalettes ? 'Hide' : 'Show'} Palette Suggestions
            </Button>
          </div>

          {showPalettes && (
            <PaletteSuggestions
              onApplyPalette={(palette) => {
                if (editingGenre.theme) {
                  updateGenre({
                    theme: {
                      light: palette.light,
                      dark: palette.dark,
                    },
                  });
                }
                setShowPalettes(false);
              }}
            />
          )}
          
          <div className="grid md:grid-cols-2 gap-6 mt-6">
            {/* Light Theme */}
            <div className="space-y-3">
              <h4 className="font-medium text-[var(--color-text)]">Light Mode</h4>
              <div>
                <label className="block text-xs mb-1 text-[var(--color-text-secondary)]">Primary</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={editingGenre.theme.light.primary}
                    onChange={(e) => handleThemeChange('light', 'primary', e.target.value)}
                    className="w-12 h-10 rounded border border-[var(--color-border)]"
                  />
                  <input
                    type="text"
                    value={editingGenre.theme.light.primary}
                    onChange={(e) => handleThemeChange('light', 'primary', e.target.value)}
                    className="flex-1 px-3 py-2 border border-[var(--color-border)] rounded bg-[var(--color-background)] text-[var(--color-text)] text-sm"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-xs mb-1 text-[var(--color-text-secondary)]">Primary Hover</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={editingGenre.theme.light.primaryHover}
                    onChange={(e) => handleThemeChange('light', 'primaryHover', e.target.value)}
                    className="w-12 h-10 rounded border border-[var(--color-border)]"
                  />
                  <input
                    type="text"
                    value={editingGenre.theme.light.primaryHover}
                    onChange={(e) => handleThemeChange('light', 'primaryHover', e.target.value)}
                    className="flex-1 px-3 py-2 border border-[var(--color-border)] rounded bg-[var(--color-background)] text-[var(--color-text)] text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs mb-1 text-[var(--color-text-secondary)]">Surface</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={editingGenre.theme.light.surface}
                    onChange={(e) => handleThemeChange('light', 'surface', e.target.value)}
                    className="w-12 h-10 rounded border border-[var(--color-border)]"
                  />
                  <input
                    type="text"
                    value={editingGenre.theme.light.surface}
                    onChange={(e) => handleThemeChange('light', 'surface', e.target.value)}
                    className="flex-1 px-3 py-2 border border-[var(--color-border)] rounded bg-[var(--color-background)] text-[var(--color-text)] text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs mb-1 text-[var(--color-text-secondary)]">Accent</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={editingGenre.theme.light.accent}
                    onChange={(e) => handleThemeChange('light', 'accent', e.target.value)}
                    className="w-12 h-10 rounded border border-[var(--color-border)]"
                  />
                  <input
                    type="text"
                    value={editingGenre.theme.light.accent}
                    onChange={(e) => handleThemeChange('light', 'accent', e.target.value)}
                    className="flex-1 px-3 py-2 border border-[var(--color-border)] rounded bg-[var(--color-background)] text-[var(--color-text)] text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Dark Theme */}
            <div className="space-y-3">
              <h4 className="font-medium text-[var(--color-text)]">Dark Mode</h4>
              <div>
                <label className="block text-xs mb-1 text-[var(--color-text-secondary)]">Primary</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={editingGenre.theme.dark.primary}
                    onChange={(e) => handleThemeChange('dark', 'primary', e.target.value)}
                    className="w-12 h-10 rounded border border-[var(--color-border)]"
                  />
                  <input
                    type="text"
                    value={editingGenre.theme.dark.primary}
                    onChange={(e) => handleThemeChange('dark', 'primary', e.target.value)}
                    className="flex-1 px-3 py-2 border border-[var(--color-border)] rounded bg-[var(--color-background)] text-[var(--color-text)] text-sm"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-xs mb-1 text-[var(--color-text-secondary)]">Primary Hover</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={editingGenre.theme.dark.primaryHover}
                    onChange={(e) => handleThemeChange('dark', 'primaryHover', e.target.value)}
                    className="w-12 h-10 rounded border border-[var(--color-border)]"
                  />
                  <input
                    type="text"
                    value={editingGenre.theme.dark.primaryHover}
                    onChange={(e) => handleThemeChange('dark', 'primaryHover', e.target.value)}
                    className="flex-1 px-3 py-2 border border-[var(--color-border)] rounded bg-[var(--color-background)] text-[var(--color-text)] text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs mb-1 text-[var(--color-text-secondary)]">Surface</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={editingGenre.theme.dark.surface}
                    onChange={(e) => handleThemeChange('dark', 'surface', e.target.value)}
                    className="w-12 h-10 rounded border border-[var(--color-border)]"
                  />
                  <input
                    type="text"
                    value={editingGenre.theme.dark.surface}
                    onChange={(e) => handleThemeChange('dark', 'surface', e.target.value)}
                    className="flex-1 px-3 py-2 border border-[var(--color-border)] rounded bg-[var(--color-background)] text-[var(--color-text)] text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs mb-1 text-[var(--color-text-secondary)]">Accent</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={editingGenre.theme.dark.accent}
                    onChange={(e) => handleThemeChange('dark', 'accent', e.target.value)}
                    className="w-12 h-10 rounded border border-[var(--color-border)]"
                  />
                  <input
                    type="text"
                    value={editingGenre.theme.dark.accent}
                    onChange={(e) => handleThemeChange('dark', 'accent', e.target.value)}
                    className="flex-1 px-3 py-2 border border-[var(--color-border)] rounded bg-[var(--color-background)] text-[var(--color-text)] text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}