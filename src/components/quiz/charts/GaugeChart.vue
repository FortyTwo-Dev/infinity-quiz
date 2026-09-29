<script setup lang="ts">
import { computed } from 'vue'
import { Doughnut } from 'vue-chartjs'
import type { ChartOptions } from 'chart.js'
import './chartSetup'
import { useThemeColor, useThemeRadius, oklchWithAlpha, type ThemeColorName } from '@/composables'

interface Props {
  value: number
  label: string
  color?: ThemeColorName
  size?: number
}

const props = withDefaults(defineProps<Props>(), {
  color: 'primary',
  size: 160,
})

const colorValue = useThemeColor(props.color)
const radius = useThemeRadius()

const clamped = computed(() => Math.min(100, Math.max(0, props.value)))

const chartData = computed(() => ({
  datasets: [
    {
      data: [clamped.value, 100 - clamped.value],
      backgroundColor: [colorValue.value, oklchWithAlpha(colorValue.value, 0.08)],
      borderWidth: 0,
      borderRadius: radius.value,
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
