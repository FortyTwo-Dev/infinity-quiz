import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { ref } from 'vue'

// Mock Vue Router
const mockRoute = ref({ query: {}, params: {} })
const mockReplace = vi.fn<[object]>()

vi.mock('vue-router', () => ({
  useRoute: () => mockRoute.value,
  useRouter: () => ({
    replace: mockReplace,
  }),
}))

// Mock the id module
vi.mock('../../utils/id', () => ({
  generateSeed: () => 'aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa',
}))

// Import after mocks
import { useSeededRandom } from '../../composables/useSeededRandom'

describe('useSeededRandom', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockRoute.value = { query: {}, params: {} }
    mockReplace.mockClear()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should start with a null seed', () => {
    const { seed } = useSeededRandom()

    expect(seed.value).toBeNull()
  })

  it('should generate a seed when none exists in URL', () => {
    const { seed, ensureSeed } = useSeededRandom()

    const result = ensureSeed()

    expect(result).toBe('aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa')
    expect(seed.value).toBe('aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa')
    expect(mockReplace).toHaveBeenCalledWith({
      query: { seed: 'aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa' },
    })
  })

  it('should use seed from URL when available', () => {
    mockRoute.value = { query: { seed: 'bbbbbbbb-bbbb-4bbb-bbbb-bbbbbbbbbbbb' }, params: {} }

    const { seed, ensureSeed } = useSeededRandom()
    const result = ensureSeed()

    expect(result).toBe('bbbbbbbb-bbbb-4bbb-bbbb-bbbbbbbbbbbb')
    expect(seed.value).toBe('bbbbbbbb-bbbb-4bbb-bbbb-bbbbbbbbbbbb')
    expect(mockReplace).not.toHaveBeenCalled()
  })

  it('should ignore empty seed from URL and generate new one', () => {
    mockRoute.value = { query: { seed: '' }, params: {} }

    const { ensureSeed } = useSeededRandom()
    ensureSeed()

    expect(mockReplace).toHaveBeenCalledWith({
      query: { seed: 'aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa' },
    })
  })

  it('should generate seeds in UUID v4 format', () => {
    const { ensureSeed } = useSeededRandom()

    const uuidV4Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    expect(ensureSeed()).toMatch(uuidV4Regex)
  })

  it('should return the same seed on repeated calls', () => {
    mockRoute.value = { query: { seed: 'bbbbbbbb-bbbb-4bbb-bbbb-bbbbbbbbbbbb' }, params: {} }

    const { ensureSeed } = useSeededRandom()

    expect(ensureSeed()).toBe('bbbbbbbb-bbbb-4bbb-bbbb-bbbbbbbbbbbb')
    expect(ensureSeed()).toBe('bbbbbbbb-bbbb-4bbb-bbbb-bbbbbbbbbbbb')
  })
})
