export function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export function randomElement<T>(array: T[]): T | undefined {
  if (array.length === 0) return undefined
  const index = Math.floor(Math.random() * array.length)
  return array[index]
}

export function randomElements<T>(array: T[], count: number): T[] {
  if (count <= 0) return []
  if (count >= array.length) return [...array]

  const shuffled = shuffle(array)
  return shuffled.slice(0, count)
}

export function arraysEqual<T>(a: T[], b: T[]): boolean {
  if (a.length !== b.length) return false
  return a.every((item, index) => item === b[index])
}

export function unique<T>(array: T[]): T[] {
  return [...new Set(array)]
}

export function flatten<T>(array: (T | T[])[]): T[] {
  return array.flat()
}

export function groupBy<T>(array: T[], keyFn: (item: T) => string | number): Record<string, T[]> {
  return array.reduce(
    (acc, item) => {
      const key = keyFn(item)
      if (!acc[key]) {
        acc[key] = []
      }
      acc[key].push(item)
      return acc
    },
    {} as Record<string, T[]>,
  )
}

export function partition<T>(array: T[], predicate: (item: T) => boolean): [T[], T[]] {
  return array.reduce(
    ([pass, fail], item) => (predicate(item) ? [[...pass, item], fail] : [pass, [...fail, item]]),
    [[], []] as [T[], T[]],
  )
}
