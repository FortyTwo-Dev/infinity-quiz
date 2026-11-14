<script setup lang="ts">
import { computed } from 'vue'
import { Bar } from 'vue-chartjs'
import type { ChartOptions } from 'chart.js'
import './chartSetup'
import { useThemeColor, useThemeRadius, oklchWithAlpha } from '@/composables'

interface Props {
  labels: string[]
  data: number[]
}

const props = defineProps<Props>()

const accentColor = useThemeColor('accent')
const radius = useThemeRadius()

const chartData = computed(() => ({
  labels: props.labels,
  datasets: [
    {
      label: 'Average score (%)',
      data: props.data,
      backgroundColor: accentColor.value,
      hoverBackgroundColor: oklchWithAlpha(accentColor.value, 0.85),
      borderRadius: radius.value,
    },
  ],
}))

const chartOptions: ChartOptions<'bar'> = {
  indexAxis: 'y',
  responsive: true,
  maintainAspectRatio: false,
  layout: {
    padding: { left: 4, right: 8 },
  },
  scales: {
    x: {
      min: 0,
      max: 100,
      ticks: {
        callback: (value) => `${value}%`,
      },
    },
    y: {
      ticks: {
        autoSkip: false,
        // The card is narrow: a clipped label is worse than a shortened one.
        callback(value) {
          const label = this.getLabelForValue(value as number)
          return label.length > 14 ? `${label.slice(0, 13)}…` : label
        },
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
  <div class="quiz-chart">
    <Bar :data="chartData" :options="chartOptions" />
  </div>
</template>
