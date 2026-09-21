import { seededShuffle } from './random'

/**
 * Shuffle an array. When a seed is provided the result is deterministic and
 * delegates to {@link seededShuffle}; otherwise it uses Math.random.
 */
export function shuffle<T>(array: T[], seed?: string | number): T[] {
  if (seed !== undefined) {
    return seededShuffle(array, seed)
  }

  const shuffled = [...array]
  // Math.random() is safe for non-cryptographic use (shuffling)
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const temp = shuffled[i]!
    shuffled[i] = shuffled[j]!
    shuffled[j] = temp
  }

  return shuffled
}
