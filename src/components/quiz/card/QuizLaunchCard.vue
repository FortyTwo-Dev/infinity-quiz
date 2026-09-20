<script setup lang="ts">
import { computed } from 'vue'
import { PhPlay } from '@phosphor-icons/vue'
import { DCard, DCardBody, DCardTitle, DCardActions } from '@/components/daisy-ui/card'
import { DBadge, DButton, DIndicator } from '@/components/daisy-ui'
import { LFlex } from '@/components/layout'
import {
  ATTEMPT_STATUS_COLORS,
  type AttemptStatus,
} from '@/composables/useAttempt'

interface Props {
  id: string
  title: string
  description: string
  primaryTag?: string
  tags?: string[]
  status?: AttemptStatus
}

const props = defineProps<Props>()

const statusColor = computed(() =>
  props.status ? ATTEMPT_STATUS_COLORS[props.status] : null,
)

interface Emits {
  (e: 'click'): void
  (e: 'info'): void
}

const emit = defineEmits<Emits>()

function handleInfoClick() {
  emit('info')
}
</script>

<template>
  <DIndicator class="w-full transition-transform hover:-rotate-1">
    <template #indicator>
      <span v-if="statusColor" class="status" :class="`status-${statusColor}`"></span>
    </template>
    <DCard border class="w-full bg-base-100 cursor-pointer" @click="emit('click')">
      <DCardBody padding="lg" class="gap-3">
        <LFlex as="div" justify="center" align="start" gap="sm" fullWidth>
          <DBadge soft variant="primary" class="uppercase font-bold text-nowrap">{{
            primaryTag || 'Uncategorized'
          }}</DBadge>
          <span v-if="tags && tags.length > 0" class="text-neutral mt-0.5">|</span>
          <LFlex as="div" justify="start" align="center" gap="sm" fullWidth class="overflow-hidden">
            <DBadge
              v-for="tag in tags"
              :key="tag"
              class="badge badge-soft badge-primary text-nowrap"
            >
              {{ tag }}
            </DBadge>
          </LFlex>
        </LFlex>
        <DCardTitle>{{ title }}</DCardTitle>
        <p>{{ description }}</p>
        <DCardActions justify="between">
          <DButton type="button" size="md" variant="primary" @click.stop="emit('click')">
            Launch
            <PhPlay size="16" weight="fill" />
          </DButton>
          <DButton type="button" size="md" variant="neutral" @click.stop="handleInfoClick">
            More Information
          </DButton>
        </DCardActions>
      </DCardBody>
    </DCard>
  </DIndicator>
</template>
