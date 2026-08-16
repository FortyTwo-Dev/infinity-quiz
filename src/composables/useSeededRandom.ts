import { computed, type ComputedRef } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { generateSeed } from '../utils/id'
import { validate as uuidValidate, version as uuidVersion } from 'uuid'

export interface UseSeededRandomReturn {
  seed: ComputedRef<string>
}

function isValidSeed(seed: string): boolean {
  if (!seed || seed.length === 0) return false
  return uuidValidate(seed) && uuidVersion(seed) === 4
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
