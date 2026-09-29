<script setup lang="ts">
import { computed } from 'vue'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  type ChartOptions,
} from 'chart.js'
import type { QuizResult } from '@/types'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

interface Props {
  results: QuizResult[]
}

const props = defineProps<Props>()

const chartData = computed(() => {
  const attempts = props.results.map((_, index) => `#${index + 1}`)
  const percentages = props.results.map((r) =>
    r.totalQuestions > 0 ? Math.round((r.score / r.totalQuestions) * 100) : 0,
  )

  return {
    labels: attempts,
    datasets: [
      {
        label: 'Score (%)',
        data: percentages,
        borderColor: 'oklch(54% 0.245 262.881)',
        backgroundColor: 'oklch(54% 0.245 262.881 / 0.1)',
        fill: true,
        tension: 0.3,
      },
    ],
  }
})

const chartOptions: ChartOptions<'line'> = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      min: 0,
      max: 100,
      ticks: {
        callback: (value) => `${value}%`,
      },
    },
  },
  plugins: {
    legend: {
      display: false,
    },
  },
}
</script>

<template>
  <div class="h-64">
    <Line :data="chartData" :options="chartOptions" />
  </div>
</template>
