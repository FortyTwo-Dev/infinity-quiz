import { ref, type Ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { generateSeed } from '../utils/id'
import { validate as uuidValidate, version as uuidVersion } from 'uuid'

export interface UseSeededRandomReturn {
  seed: Ref<string | null>
  ensureSeed: () => string
}

function isValidSeed(seed: string): boolean {
  if (!seed || seed.length === 0) return false
  return uuidValidate(seed) && uuidVersion(seed) === 4
}

/**
 * Provides a stable, URL-backed seed used for reproducible shuffling.
 * Call `ensureSeed()` from an action (not a computed) to read the seed from
 * the URL or generate and persist a new one.
 */
export function useSeededRandom(): UseSeededRandomReturn {
  const route = useRoute()
  const router = useRouter()
  const seed = ref<string | null>(null)

  function ensureSeed(): string {
    const querySeed = route.query.seed as string | undefined

    if (querySeed && isValidSeed(querySeed)) {
      seed.value = querySeed
      return querySeed
    }

    const newSeed = generateSeed()
    seed.value = newSeed
    router.replace({
      query: {
        ...route.query,
        seed: newSeed,
      },
    })
    return newSeed
  }

  return {
    seed,
    ensureSeed,
  }
}
