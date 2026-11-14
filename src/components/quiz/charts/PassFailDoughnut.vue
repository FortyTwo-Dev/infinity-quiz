<script setup lang="ts">
import { computed } from 'vue'
import { Doughnut } from 'vue-chartjs'
import type { ChartOptions } from 'chart.js'
import './chartSetup'
import { useThemeColor, useThemeRadius } from '@/composables'

interface Props {
  passed: number
  failed: number
}

const props = defineProps<Props>()

const successColor = useThemeColor('success')
const dangerColor = useThemeColor('danger')
const radius = useThemeRadius()

const chartData = computed(() => ({
  labels: ['Passed', 'Failed'],
  datasets: [
    {
      data: [props.passed, props.failed],
      backgroundColor: [successColor.value, dangerColor.value],
      borderWidth: 0,
      borderRadius: radius.value,
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
  <div class="quiz-chart">
    <Doughnut :data="chartData" :options="chartOptions" />
  </div>
</template>
