<script setup lang="ts">
import { computed } from 'vue'
import { Doughnut } from 'vue-chartjs'
import type { ChartOptions } from 'chart.js'
import './chartSetup'

interface Props {
  value: number
  label: string
  color: string
  size?: number
}

const props = withDefaults(defineProps<Props>(), {
  size: 160,
})

const clamped = computed(() => Math.min(100, Math.max(0, props.value)))

const chartData = computed(() => ({
  datasets: [
    {
      data: [clamped.value, 100 - clamped.value],
      backgroundColor: [props.color, 'oklch(0% 0 0 / 0.08)'],
      borderWidth: 0,
      borderRadius: 6,
    },
  ],
}))

const chartOptions: ChartOptions<'doughnut'> = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '78%',
  rotation: -90,
  circumference: 360,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      enabled: false,
    },
  },
}
</script>

<template>
  <div class="relative" :style="{ width: `${size}px`, height: `${size}px` }">
    <Doughnut :data="chartData" :options="chartOptions" />
    <div class="absolute inset-0 flex flex-col items-center justify-center text-center">
      <span class="text-2xl font-bold leading-tight">{{ Math.round(value) }}%</span>
      <span class="text-sm text-base-content/70 leading-tight">{{ label }}</span>
    </div>
  </div>
</template>
