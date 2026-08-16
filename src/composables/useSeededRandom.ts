import { computed, type ComputedRef } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { generateSeed } from '../utils/id'

export interface UseSeededRandomReturn {
  seed: ComputedRef<string>
}

export function useSeededRandom(): UseSeededRandomReturn {
  const route = useRoute()
  const router = useRouter()

  const seed = computed<string>(() => {
    const querySeed = route.query.seed as string | undefined

    if (querySeed && isValidSeed(querySeed)) {
      return querySeed
    }

    const newSeed = generateSeed()
    updateUrlWithSeed(newSeed)
    return newSeed
  })

  function isValidSeed(seed: string): boolean {
    if (!seed || seed.length === 0) return false

    const uuidV4Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

    return uuidV4Regex.test(seed) || seed.length > 0
  }

  function updateUrlWithSeed(seedValue: string): void {
    router.replace({
      query: {
        ...route.query,
        seed: seedValue,
      },
    })
  }

  return {
    seed,
  }
}
