<script setup lang="ts">
import { computed } from 'vue'
import { Line } from 'vue-chartjs'
import type { ChartOptions, ChartData } from 'chart.js'
import './chartSetup'
import { useThemeColor, oklchWithAlpha } from '@/composables'

interface Props {
  labels: string[]
  data: number[]
  unit?: string
}

const props = withDefaults(defineProps<Props>(), {
  unit: '%',
})

const primaryColor = useThemeColor('primary')

const chartData = computed<ChartData<'line'>>(() => ({
  labels: props.labels,
  datasets: [
    {
      label: `Score (${props.unit})`,
      data: props.data,
      borderColor: primaryColor.value,
      backgroundColor: oklchWithAlpha(primaryColor.value, 0.1),
      fill: true,
      tension: 0.3,
      clip: false,
    },
  ],
}))

const chartOptions: ChartOptions<'line'> = {
  responsive: true,
  maintainAspectRatio: false,
  layout: {
    padding: { top: 24, right: 8, bottom: 4 },
  },
  scales: {
    y: {
      min: 0,
      max: 100,
      ticks: {
        stepSize: 25,
        callback: (value) => `${value}${props.unit}`,
        padding: 10,
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
  <div class="h-96">
    <Line :data="chartData" :options="chartOptions" />
  </div>
</template>
