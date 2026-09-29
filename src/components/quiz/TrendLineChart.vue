<script setup lang="ts">
import { computed } from 'vue'
import { Line } from 'vue-chartjs'
import type { ChartOptions } from 'chart.js'
import './chartSetup'

interface Props {
  labels: string[]
  data: number[]
  unit?: string
}

const props = withDefaults(defineProps<Props>(), {
  unit: '%',
})

const chartData = computed(() => ({
  labels: props.labels,
  datasets: [
    {
      label: `Score (${props.unit})`,
      data: props.data,
      borderColor: 'oklch(54% 0.245 262.881)',
      backgroundColor: 'oklch(54% 0.245 262.881 / 0.1)',
      fill: true,
      tension: 0.3,
    },
  ],
}))

const chartOptions: ChartOptions<'line'> = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      min: 0,
      max: 100,
      ticks: {
        callback: (value) => `${value}${props.unit}`,
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
