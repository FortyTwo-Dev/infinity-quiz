import seedrandom from 'seedrandom'

export function createRandom(seed: string | number): () => number {
  const rng = seedrandom(typeof seed === 'number' ? seed.toString() : seed)
  return () => rng()
}

export function seededShuffle<T>(array: T[], seed: string | number): T[] {
  const shuffled = [...array]
  const random = createRandom(seed)

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1))
    const temp = shuffled[i]!
    shuffled[i] = shuffled[j]!
    shuffled[j] = temp
  }
  return shuffled
}

export function indexedSeededShuffle<T>(
  array: T[],
  baseSeed: string | number,
  index: number,
): T[] {
  const elementSeed = `${baseSeed}-${index}`
  return seededShuffle(array, elementSeed)
}
