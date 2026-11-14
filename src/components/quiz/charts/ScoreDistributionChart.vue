<script setup lang="ts">
import { computed } from 'vue'
import { Bar } from 'vue-chartjs'
import type { ChartOptions } from 'chart.js'
import './chartSetup'
import { useThemeColor, useThemeRadius, oklchWithAlpha } from '@/composables'

interface Bin {
  label: string
  count: number
}

interface Props {
  bins: Bin[]
}

const props = defineProps<Props>()

const accentColor = useThemeColor('accent')
const radius = useThemeRadius()

const chartData = computed(() => ({
  labels: props.bins.map((b) => b.label),
  datasets: [
    {
      label: 'Attempts',
      data: props.bins.map((b) => b.count),
      backgroundColor: accentColor.value,
      hoverBackgroundColor: oklchWithAlpha(accentColor.value, 0.85),
      borderRadius: radius.value,
    },
  ],
}))

const chartOptions: ChartOptions<'bar'> = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        precision: 0,
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
