import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useQuizTimerStore = defineStore('quizTimer', () => {
  // State
  const timeLeft = ref<number | null>(null)
  const timerInterval = ref<ReturnType<typeof setInterval> | null>(null)
  const onExpiryCallback = ref<(() => boolean) | null>(null)

  // Actions
  const clearTimer = () => {
    if (timerInterval.value) {
      clearInterval(timerInterval.value)
      timerInterval.value = null
    }
    timeLeft.value = null
    // Note: We don't clear onExpiryCallback here because it's needed for the expiry logic
  }

  const startTimer = (duration: number, onExpiry: () => boolean) => {
    clearTimer()
    timeLeft.value = duration
    onExpiryCallback.value = onExpiry
    timerInterval.value = setInterval(() => {
      if (timeLeft.value === null) return
      timeLeft.value--
      if (timeLeft.value <= 0) {
        const callback = onExpiryCallback.value
        clearTimer()
        onExpiryCallback.value = null
        if (callback) {
          callback()
        }
      }
    }, 1000)
  }

  return {
    // State
    timeLeft,
    timerInterval,

    // Actions
    clearTimer,
    startTimer,
  }
})
