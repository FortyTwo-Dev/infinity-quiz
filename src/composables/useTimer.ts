import { ref, computed, onUnmounted, type Ref } from 'vue'

export interface TimerResult {
  timeLeft: Ref<number>
  isRunning: Ref<boolean>
  isExpired: Ref<boolean>
  start: () => void
  stop: () => void
  reset: (newTime?: number) => void
}

export function useTimer(initialTime: number): TimerResult {
  const timeLeft = ref(initialTime)
  const isRunning = ref(false)
  const isExpired = computed(() => timeLeft.value <= 0)

  let intervalId: ReturnType<typeof setInterval> | null = null

  const start = () => {
    if (isRunning.value) return
    isRunning.value = true
    intervalId = setInterval(() => {
      timeLeft.value--
      if (timeLeft.value <= 0) {
        stop()
      }
    }, 1000)
  }

  const stop = () => {
    isRunning.value = false
    if (intervalId) {
      clearInterval(intervalId)
      intervalId = null
    }
  }

  const reset = (newTime?: number) => {
    stop()
    timeLeft.value = newTime ?? initialTime
  }

  onUnmounted(() => {
    stop()
  })

  return {
    timeLeft,
    isRunning,
    isExpired,
    start,
    stop,
    reset,
  }
}
