import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { defineComponent, h } from 'vue'
import { mount } from '@vue/test-utils'
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
    expect(timeLeft.value).toBe(8)
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
    expect(vi.getTimerCount()).toBe(initialIntervalCount)
  })

  it('should not allow negative time', () => {
    const { timeLeft, start } = useTimer(1)

    start()
    vi.advanceTimersByTime(2000)
    expect(timeLeft.value).toBe(0)

    vi.advanceTimersByTime(1000)
    expect(timeLeft.value).toBe(0)
  })

  it('should stop when stop is called with null intervalId', () => {
    const { isRunning, stop } = useTimer(10)

    expect(isRunning.value).toBe(false)
    stop()
    expect(isRunning.value).toBe(false)
  })

  it('should cleanup on unmount', () => {
    const { start, isRunning, stop } = useTimer(10)

    start()
    expect(isRunning.value).toBe(true)

    stop()
    expect(isRunning.value).toBe(false)

    vi.advanceTimersByTime(1000)
    expect(isRunning.value).toBe(false)
  })

  it('should start and immediately expire when time is 1', () => {
    const { timeLeft, isExpired, start, isRunning } = useTimer(1)

    expect(isExpired.value).toBe(false)
    expect(timeLeft.value).toBe(1)

    start()
    expect(isRunning.value).toBe(true)

    vi.advanceTimersByTime(1000)
    expect(timeLeft.value).toBe(0)
    expect(isExpired.value).toBe(true)
    expect(isRunning.value).toBe(false)
  })

  it('should not start if already running with timer count check', () => {
    const { isRunning, start, stop } = useTimer(10)

    start()
    expect(isRunning.value).toBe(true)

    const timerCountBefore = vi.getTimerCount()
    start()
    const timerCountAfter = vi.getTimerCount()

    expect(timerCountAfter).toBe(timerCountBefore)
    expect(isRunning.value).toBe(true)

    stop()
  })

  it('should stop when called multiple times', () => {
    const { isRunning, start, stop } = useTimer(10)

    start()
    expect(isRunning.value).toBe(true)

    stop()
    expect(isRunning.value).toBe(false)

    stop()
    expect(isRunning.value).toBe(false)
  })

  it('should handle reset to 0', () => {
    const { timeLeft, isExpired, reset } = useTimer(10)

    reset(0)
    expect(timeLeft.value).toBe(0)
    expect(isExpired.value).toBe(true)
  })

  it('should handle negative initial time', () => {
    const { timeLeft, isExpired } = useTimer(-5)

    expect(timeLeft.value).toBe(-5)
    expect(isExpired.value).toBe(true)
  })

  // Helper to mount a component that uses useTimer
  function mountTimer(initialTime: number) {
    let timer: ReturnType<typeof useTimer>

    const wrapper = mount(
      defineComponent({
        setup() {
          timer = useTimer(initialTime)
          return () => h('div')
        },
      }),
    )

    return { wrapper, timer: timer! }
  }

  it('should start timer when mounted and decrement timeLeft', () => {
    const { timer } = mountTimer(10)

    timer.start()
    expect(timer.isRunning.value).toBe(true)

    vi.advanceTimersByTime(3000)
    expect(timer.timeLeft.value).toBe(7)
  })

  it('should call stop() automatically on component unmount', () => {
    const { wrapper, timer } = mountTimer(10)

    timer.start()
    expect(timer.isRunning.value).toBe(true)

    wrapper.unmount()

    // stop() sets isRunning to false
    expect(timer.isRunning.value).toBe(false)
  })

  it('should not continue decrementing timeLeft after unmount', () => {
    const { wrapper, timer } = mountTimer(10)

    timer.start()
    vi.advanceTimersByTime(2000)
    expect(timer.timeLeft.value).toBe(8)

    wrapper.unmount()

    // Advance time after unmount: nothing should change
    vi.advanceTimersByTime(5000)
    expect(timer.timeLeft.value).toBe(8)
  })

  it('should clear interval via clearInterval on unmount', () => {
    const clearIntervalSpy = vi.spyOn(global, 'clearInterval')
    const { wrapper, timer } = mountTimer(10)

    timer.start()
    wrapper.unmount()

    expect(clearIntervalSpy).toHaveBeenCalled()
    clearIntervalSpy.mockRestore()
  })
})
