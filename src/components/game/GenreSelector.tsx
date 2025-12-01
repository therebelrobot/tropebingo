import { getAllGenres } from '@data/genres';
import { useGameState } from '@context/GameStateContext';

export function GenreSelector() {
  const genres = getAllGenres();
  const { selectGenre } = useGameState();

  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold mb-4">Choose Your Genre</h2>
        <p className="text-lg text-[var(--color-text-muted)]">
          Select which type of movie you're watching
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 max-w-3xl mx-auto">
        {genres.map((genre) => (
          <button
            key={genre.id}
            onClick={() => selectGenre(genre.id)}
            className="group relative p-6 rounded-xl border-2 border-[var(--color-border)] hover:border-[var(--color-primary)] transition-all duration-200 text-left bg-[var(--color-surface)] hover:shadow-lg"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold mb-2 text-[var(--color-text)] group-hover:text-[var(--color-primary)] transition-colors">
                  {genre.name}
                </h3>
                {genre.description && (
                  <p className="text-sm text-[var(--color-text-muted)]">
                    {genre.description}
                  </p>
                )}
              </div>
              <svg
                className="w-5 h-5 text-[var(--color-text-muted)] group-hover:text-[var(--color-primary)] transition-colors"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </button>
        ))}
      </div>

      {genres.length === 0 && (
        <div className="text-center p-8 border-2 border-dashed border-[var(--color-border)] rounded-xl">
          <p className="text-[var(--color-text-muted)]">
            No genres available yet. Check back soon!
          </p>
        </div>
      )}
    </div>
  );
}