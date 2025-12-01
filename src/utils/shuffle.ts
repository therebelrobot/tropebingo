/**
 * Seeded random number generator using the Mulberry32 algorithm
 * Provides deterministic "random" numbers based on a seed
 */
export class SeededRandom {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed;
  }

  /**
   * Generate next random number between 0 and 1
   */
  next(): number {
    let t = (this.seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  /**
   * Generate random integer between min (inclusive) and max (exclusive)
   */
  nextInt(min: number, max: number): number {
    return Math.floor(this.next() * (max - min)) + min;
  }
}

/**
 * Fisher-Yates shuffle with seeded randomness
 * Ensures the same seed always produces the same shuffle order
 */
export function shuffleArray<T>(array: T[], seed: number): T[] {
  const result = [...array];
  const rng = new SeededRandom(seed);

  for (let i = result.length - 1; i > 0; i--) {
    const j = rng.nextInt(0, i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}

/**
 * Generate a random seed based on current timestamp
 */
export function generateSeed(): number {
  return Date.now();
}