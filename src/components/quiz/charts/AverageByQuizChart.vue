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
  scales: {
    x: {
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
    <Bar :data="chartData" :options="chartOptions" />
  </div>
</template>
