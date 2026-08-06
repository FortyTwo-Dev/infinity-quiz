import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useQuizTimerStore } from '../../stores/quiz/quiz-timer-store'

describe('useQuizTimerStore', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    setActivePinia(createPinia())
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('state', () => {
    it('should initialize with null timeLeft', () => {
      const timerStore = useQuizTimerStore()
      expect(timerStore.timeLeft).toBeNull()
    })

    it('should initialize with null timerInterval', () => {
      const timerStore = useQuizTimerStore()
      expect(timerStore.timerInterval).toBeNull()
    })
  })

  describe('actions', () => {
    it('startTimer should set timeLeft to duration', () => {
      const timerStore = useQuizTimerStore()
      const mockCallback = vi.fn()

      timerStore.startTimer(10, mockCallback)

      expect(timerStore.timeLeft).toBe(10)
    })

    it('startTimer should call onExpiry callback when timer reaches 0', () => {
      const timerStore = useQuizTimerStore()
      const mockCallback = vi.fn(() => true)

      timerStore.startTimer(2, mockCallback)

      expect(mockCallback).not.toHaveBeenCalled()

      // Advance time by 1 second
      vi.advanceTimersByTime(1000)
      expect(timerStore.timeLeft).toBe(1)
      expect(mockCallback).not.toHaveBeenCalled()

      // Advance time by another second
      vi.advanceTimersByTime(1000)
      // Note: timeLeft is set to null by clearTimer() before calling callback
      expect(timerStore.timeLeft).toBeNull()
      expect(mockCallback).toHaveBeenCalledTimes(1)
    })

    it('clearTimer should reset timeLeft to null', () => {
      const timerStore = useQuizTimerStore()
      const mockCallback = vi.fn()

      timerStore.startTimer(10, mockCallback)
      expect(timerStore.timeLeft).toBe(10)

      timerStore.clearTimer()
      expect(timerStore.timeLeft).toBeNull()
    })

    it('clearTimer should stop the interval', () => {
      const timerStore = useQuizTimerStore()
      const mockCallback = vi.fn()

      timerStore.startTimer(10, mockCallback)
      const initialTimerCount = vi.getTimerCount()

      timerStore.clearTimer()

      // No new timers should be created after clear
      vi.advanceTimersByTime(5000)
      expect(mockCallback).not.toHaveBeenCalled()
      expect(vi.getTimerCount()).toBe(initialTimerCount - 1)
    })

    it('startTimer should not call callback if timer is cleared before expiry', () => {
      const timerStore = useQuizTimerStore()
      const mockCallback = vi.fn()

      timerStore.startTimer(5, mockCallback)
      vi.advanceTimersByTime(2000)

      timerStore.clearTimer()
      vi.advanceTimersByTime(4000)

      expect(mockCallback).not.toHaveBeenCalled()
    })

    it('startTimer should replace existing timer', () => {
      const timerStore = useQuizTimerStore()
      const mockCallback1 = vi.fn()
      const mockCallback2 = vi.fn()

      timerStore.startTimer(2, mockCallback1)
      timerStore.startTimer(2, mockCallback2)

      vi.advanceTimersByTime(2000)

      expect(mockCallback1).not.toHaveBeenCalled()
      expect(mockCallback2).toHaveBeenCalledTimes(1)
    })
  })
})
