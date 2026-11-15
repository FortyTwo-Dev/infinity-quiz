<script setup lang="ts">
import { computed } from 'vue'
import { PhPlay } from '@phosphor-icons/vue'
import { ItBadge, ItCard, ItCardActions, ItCardBody, ItCardTitle } from '@/components/itheme'
import { ItButton } from '@infinitylib/infinity-theme-vue'
import {
  ATTEMPT_STATUS_COLORS,
  ATTEMPT_STATUS_LABELS,
  type AttemptStatus,
} from '@/composables/useAttempt'

interface Props {
  id: string
  title: string
  description: string
  primaryTag?: string
  status?: AttemptStatus
}

const props = defineProps<Props>()

const emit = defineEmits<{ click: []; info: [] }>()

/** The status colour is also carried by a label, never by colour alone. */
const status = computed(() =>
  props.status
    ? { color: ATTEMPT_STATUS_COLORS[props.status], label: ATTEMPT_STATUS_LABELS[props.status] }
    : null,
)
</script>

<template>
  <ItCard border class="quiz-launch-card" @click="emit('click')">
    <ItCardBody>
      <div class="quiz-card-meta">
        <ItBadge variant="primary" soft class="quiz-card-category">
          {{ primaryTag || 'Uncategorized' }}
        </ItBadge>
        <span v-if="status" class="quiz-status" :data-status="status.color">
          <span class="quiz-status-dot" aria-hidden="true" />
          {{ status.label }}
        </span>
      </div>

      <ItCardTitle as="h3">{{ title }}</ItCardTitle>
      <p class="quiz-card-description">{{ description }}</p>

      <ItCardActions justify="between">
        <ItButton type="button" variant="primary" @click.stop="emit('click')">
          Launch
          <PhPlay :size="16" weight="fill" />
        </ItButton>
        <ItButton type="button" variant="ghost" @click.stop="emit('info')">
          Details
        </ItButton>
      </ItCardActions>
    </ItCardBody>
  </ItCard>
</template>
