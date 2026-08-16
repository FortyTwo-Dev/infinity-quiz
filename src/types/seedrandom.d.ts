/**
 * Type declaration for seedrandom library
 */
declare module 'seedrandom' {
  interface PRNG {
    (): number
    quick: () => number
    int32: () => number
    uint32: () => number
    double: () => number
  }

  interface Seedrandom {
    (seed: string, options?: { entropy?: boolean; global?: boolean }): PRNG
    (seed: string, useArray?: boolean, options?: { entropy?: boolean }): PRNG
  }

  const seedrandom: Seedrandom
  export = seedrandom
}
