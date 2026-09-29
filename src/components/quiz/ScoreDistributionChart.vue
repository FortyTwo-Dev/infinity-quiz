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

const primaryColor = useThemeColor('primary')
const radius = useThemeRadius()

const chartData = computed(() => ({
  labels: props.bins.map((b) => b.label),
  datasets: [
    {
      label: 'Attempts',
      data: props.bins.map((b) => b.count),
      backgroundColor: primaryColor.value,
      hoverBackgroundColor: oklchWithAlpha(primaryColor.value, 0.85),
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
  <div class="h-64">
    <Bar :data="chartData" :options="chartOptions" />
  </div>
</template>
