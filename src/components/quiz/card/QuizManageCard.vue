<script setup lang="ts">
import { PhCopy, PhPencil, PhTrash } from '@phosphor-icons/vue'
import { ItBadge, ItCard, ItCardActions, ItCardBody, ItCardTitle } from '@/components/itheme'
import { ItButton } from '@infinitylib/infinity-theme-vue'

interface Quiz {
  id: string
  title: string
  description: string
  category?: string
  tags?: string[]
  questions: unknown[]
}

const props = defineProps<{ quiz: Quiz }>()

const emit = defineEmits<{
  edit: [quizId: string]
  duplicate: [quizId: string]
  delete: [quizId: string]
}>()

function handleEdit() {
  emit('edit', props.quiz.id)
}

function handleDuplicate() {
  emit('duplicate', props.quiz.id)
}

function handleDelete() {
  emit('delete', props.quiz.id)
}
</script>

<template>
  <ItCard border class="quiz-manage-card" @click="handleEdit">
    <ItCardBody size="lg">
      <div class="quiz-card-meta">
        <ItBadge variant="primary" soft class="quiz-card-category">
          {{ quiz.category || 'Uncategorized' }}
        </ItBadge>
        <span class="quiz-manage-count">{{ quiz.questions.length }} questions</span>
      </div>

      <ItCardTitle as="h3">{{ quiz.title }}</ItCardTitle>
      <p class="quiz-card-description">{{ quiz.description }}</p>

      <ItCardActions justify="between">
        <ItButton type="button" variant="primary" @click.stop="handleEdit">
          <PhPencil :size="16" />
          Edit
        </ItButton>
        <div class="quiz-manage-actions">
          <ItButton
            type="button"
            variant="ghost"
            :aria-label="`Duplicate ${quiz.title}`"
            @click.stop="handleDuplicate"
          >
            <PhCopy :size="16" />
          </ItButton>
          <ItButton
            type="button"
            variant="danger"
            :aria-label="`Delete ${quiz.title}`"
            @click.stop="handleDelete"
          >
            <PhTrash :size="16" />
          </ItButton>
        </div>
      </ItCardActions>
    </ItCardBody>
  </ItCard>
</template>
