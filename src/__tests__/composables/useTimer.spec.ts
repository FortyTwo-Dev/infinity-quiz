import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { useTimer } from '../../composables/useTimer'

describe('useTimer', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should initialize with correct time', () => {
    const { timeLeft } = useTimer(60)
    expect(timeLeft.value).toBe(60)
  })

  it('should start timer and decrement time', () => {
    const { timeLeft, isRunning, start } = useTimer(10)

    expect(isRunning.value).toBe(false)
    start()
    expect(isRunning.value).toBe(true)

    vi.advanceTimersByTime(1000)
    expect(timeLeft.value).toBe(9)

    vi.advanceTimersByTime(1000)
    expect(timeLeft.value).toBe(8)
  })

  it('should stop timer when stop is called', () => {
    const { timeLeft, isRunning, start, stop } = useTimer(10)

    start()
    expect(isRunning.value).toBe(true)

    vi.advanceTimersByTime(2000)
    stop()
    expect(isRunning.value).toBe(false)

    vi.advanceTimersByTime(2000)
    expect(timeLeft.value).toBe(8) // Should not have continued decrementing
  })

  it('should reset timer to initial value', () => {
    const { timeLeft, isRunning, start, reset } = useTimer(10)

    start()
    vi.advanceTimersByTime(3000)
    expect(timeLeft.value).toBe(7)

    reset()
    expect(timeLeft.value).toBe(10)
    expect(isRunning.value).toBe(false)
  })

  it('should reset timer to new value', () => {
    const { timeLeft, start, reset } = useTimer(10)

    start()
    vi.advanceTimersByTime(3000)
    expect(timeLeft.value).toBe(7)

    reset(20)
    expect(timeLeft.value).toBe(20)
  })

  it('should set isExpired to true when time reaches 0', () => {
    const { timeLeft, isExpired, start } = useTimer(2)

    expect(isExpired.value).toBe(false)

    start()
    vi.advanceTimersByTime(1000)
    expect(isExpired.value).toBe(false)
    expect(timeLeft.value).toBe(1)

    vi.advanceTimersByTime(1000)
    expect(timeLeft.value).toBe(0)
    expect(isExpired.value).toBe(true)
  })

  it('should stop timer when time expires', () => {
    const { timeLeft, isRunning, start } = useTimer(2)

    start()
    expect(isRunning.value).toBe(true)

    vi.advanceTimersByTime(2000)
    expect(timeLeft.value).toBe(0)
    expect(isRunning.value).toBe(false)
  })

  it('should not start timer if already running', () => {
    const { isRunning, start } = useTimer(10)

    start()
    expect(isRunning.value).toBe(true)

    const initialIntervalCount = vi.getTimerCount()
    start() // Try to start again
    expect(vi.getTimerCount()).toBe(initialIntervalCount) // No new interval created
  })

  it('should not allow negative time', () => {
    const { timeLeft, start } = useTimer(1)

    start()
    vi.advanceTimersByTime(2000)
    expect(timeLeft.value).toBe(0)

    vi.advanceTimersByTime(1000)
    expect(timeLeft.value).toBe(0)
  })
})
