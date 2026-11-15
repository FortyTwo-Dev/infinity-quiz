<script setup lang="ts">
import { ItBadge, ItCard, ItCardBody, ItCardTitle } from '@/components/itheme'

interface Props {
  title: string
  description?: string
  /** Status of a section that is not available yet, shown beside its title. */
  badge?: string
}

const props = withDefaults(defineProps<Props>(), {
  description: undefined,
  badge: undefined,
})
</script>

<template>
  <ItCard border class="settings-card">
    <ItCardBody size="lg">
      <div class="settings-card-head">
        <ItCardTitle as="h2">{{ props.title }}</ItCardTitle>
        <ItBadge v-if="props.badge" variant="neutral" soft size="sm">{{ props.badge }}</ItBadge>
      </div>

      <p v-if="props.description" class="settings-card-description">{{ props.description }}</p>

      <slot />
    </ItCardBody>
  </ItCard>
</template>
