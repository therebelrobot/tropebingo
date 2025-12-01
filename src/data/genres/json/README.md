# JSON Genre Import Folder

This folder enables dynamic loading of genre files from JSON. Simply place any genre JSON file in this directory and it will be automatically included in the application on the next build.

## How It Works

The `loader.ts` file uses Vite's glob import feature to automatically discover and import all `.json` files in this directory at build time. These genres are then merged with the hardcoded genres defined in TypeScript files.

## Adding a New Genre

1. Export a genre from the Genre Editor as JSON
2. Place the JSON file in this directory (e.g., `romcom.json`, `action.json`)
3. Rebuild the application (`npm run build` or restart dev server)
4. The genre will automatically appear in the genre selector

## JSON File Format

Your JSON file must match the `Genre` type definition:

```json
{
  "id": "romcom",
  "name": "Romantic Comedy",
  "description": "Track common tropes in romantic comedies",
  "questions": [
    {
      "id": "decade",
      "type": "single",
      "text": "What decade was this made?",
      "options": [
        { "id": "2000s", "text": "2000s", "value": "2000s" },
        { "id": "2010s", "text": "2010s", "value": "2010s" }
      ]
    }
  ],
  "tropeSets": [
    {
      "id": "classic-romcom",
      "filters": { "decade": "2000s" },
      "tropes": [
        {
          "id": "meet-cute",
          "text": "Meet Cute",
          "description": "Charming first meeting"
        }
      ]
    }
  ],
  "theme": {
    "light": {
      "primary": "#ec4899",
      "primaryHover": "#db2777",
      "surface": "#fdf2f8",
      "accent": "#be185d"
    },
    "dark": {
      "primary": "#db2777",
      "primaryHover": "#be185d",
      "surface": "#1e293b",
      "accent": "#ec4899"
    }
  }
}
```

## Using the Genre Editor

The easiest way to create a genre JSON file:

1. Click "Genre Editor" in the app header
2. Choose "Create New Genre" or edit an existing one
3. Fill in all the details (Basic Info, Questions, Trope Sets)
4. Click "Export JSON" to download the file
5. Place the downloaded file in this directory
6. Rebuild the app

## Notes

- File names can be anything ending in `.json`
- The `.gitkeep` file is ignored by the loader
- JSON files must be valid and match the Genre type
- Invalid files will be logged to console but won't break the app
- Genre IDs must be unique across all genres (hardcoded + JSON)

## Example Workflow

```bash
# After exporting romcom-genre.json from the editor:
mv ~/Downloads/romcom-genre.json app/src/data/genres/json/

# Restart dev server or rebuild
npm run dev
```

Your new genre will now appear in the genre selector!