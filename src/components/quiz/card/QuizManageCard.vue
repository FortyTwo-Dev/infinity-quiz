<script setup lang="ts">
import { DCard, DCardBody, DCardTitle, DCardActions } from '@/components/daisy-ui/card'
import { DBadge, DButton, DIndicator } from '@/components/daisy-ui'
import { LFlex } from '@/components/layout'
import { PhCopy, PhPencil, PhTrash } from '@phosphor-icons/vue'

interface Quiz {
  id: string
  title: string
  description: string
  category?: string
  tags?: string[]
  questions: unknown[]
}

interface Props {
  quiz: Quiz
}

const props = defineProps<Props>()

interface Emits {
  (e: 'edit', quizId: string): void
  (e: 'duplicate', quizId: string): void
  (e: 'delete', quizId: string): void
}

const emit = defineEmits<Emits>()

const handleEdit = () => {
  emit('edit', props.quiz.id)
}

const handleDuplicate = (e: Event) => {
  e.stopPropagation()
  emit('duplicate', props.quiz.id)
}

const handleDelete = (e: Event) => {
  e.stopPropagation()
  emit('delete', props.quiz.id)
}
</script>

<template>
  <DIndicator class="w-full transition-transform hover:-rotate-1">
    <DCard border class="w-full bg-base-100 cursor-pointer" @click="handleEdit">
      <DCardBody padding="lg" class="gap-3">
        <LFlex as="div" justify="center" align="start" gap="sm" fullWidth>
          <DBadge soft variant="primary" class="uppercase font-bold text-nowrap">
            {{ quiz.category || 'Uncategorized' }}
          </DBadge>
          <span v-if="quiz.tags && quiz.tags.length > 0" class="text-neutral mt-0.5">|</span>
          <LFlex as="div" justify="start" align="center" gap="sm" fullWidth class="overflow-hidden">
            <DBadge
              v-for="tag in quiz.tags"
              :key="tag"
              class="badge badge-soft badge-primary text-nowrap"
            >
              {{ tag }}
            </DBadge>
          </LFlex>
        </LFlex>
        <DCardTitle>{{ quiz.title }}</DCardTitle>
        <p>{{ quiz.description }}</p>
        <DCardActions justify="between">
          <DButton type="button" size="md" variant="primary" soft @click="handleEdit">
            <PhPencil :size="16" />
            Edit
          </DButton>
          <LFlex as="div" justify="end" align="center" gap="sm">
            <DButton
              type="button"
              size="md"
              variant="neutral"
              @click="handleDuplicate"
              title="Duplicate"
            >
              <PhCopy :size="16" />
            </DButton>
            <DButton
              type="button"
              size="md"
              variant="error"
              soft
              @click="handleDelete"
              title="Delete"
            >
              <PhTrash :size="16" />
            </DButton>
          </LFlex>
        </DCardActions>
      </DCardBody>
    </DCard>
  </DIndicator>
</template>
