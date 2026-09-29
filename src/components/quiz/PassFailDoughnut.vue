<script setup lang="ts">
import { computed } from 'vue'
import { Doughnut } from 'vue-chartjs'
import type { ChartOptions } from 'chart.js'
import './chartSetup'

interface Props {
  passed: number
  failed: number
}

const props = defineProps<Props>()

const chartData = computed(() => ({
  labels: ['Passed', 'Failed'],
  datasets: [
    {
      data: [props.passed, props.failed],
      backgroundColor: ['oklch(72% 0.219 149.579)', 'oklch(63% 0.237 25.331)'],
      borderWidth: 0,
    },
  ],
}))

const chartOptions: ChartOptions<'doughnut'> = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '70%',
  plugins: {
    legend: {
      position: 'bottom',
    },
  },
}
</script>

<template>
  <div class="h-64">
    <Doughnut :data="chartData" :options="chartOptions" />
  </div>
</template>
