<script setup lang="ts">
import { ref } from 'vue'
import { Field } from 'vee-validate'
import { ItBadge, ItCard, ItCardBody, ItCardTitle } from '@/components/itheme'
import {
  ItButton,
  ItField,
  ItInput,
  ItOption,
  ItSelect,
  ItTextarea,
} from '@infinitylib/infinity-theme-vue'
import { PhPlus } from '@phosphor-icons/vue'
import { DEFAULT_THEME, THEME_OPTIONS } from '@/constants/themes'

interface Props {
  tagSuggestions: string[]
}

defineProps<Props>()

interface Emits {
  (e: 'add-tag', tag: string): void
  (e: 'remove-tag', tag: string): void
}

const emit = defineEmits<Emits>()

const tagDraft = ref('')

function submitTag() {
  const value = tagDraft.value.trim()
  if (!value) return
  emit('add-tag', value)
  tagDraft.value = ''
}
</script>

<template>
  <ItCard border class="quiz-form-card">
    <ItCardBody size="lg">
      <ItCardTitle as="h2" size="lg">General information</ItCardTitle>

      <Field v-slot="{ field, errorMessage }" name="title">
        <ItField label="Title" html-for="quiz-title" :error="errorMessage">
          <ItInput
            id="quiz-title"
            :model-value="field.value"
            :invalid="!!errorMessage"
            placeholder="My quiz title"
            @update:model-value="field.onChange"
            @blur="field.onBlur"
          />
        </ItField>
      </Field>

      <Field v-slot="{ field, errorMessage }" name="description">
        <ItField label="Description" html-for="quiz-description" :error="errorMessage">
          <ItTextarea
            id="quiz-description"
            :model-value="field.value"
            :invalid="!!errorMessage"
            placeholder="What is this quiz about?"
            :rows="3"
            @update:model-value="field.onChange"
            @blur="field.onBlur"
          />
        </ItField>
      </Field>

      <Field v-slot="{ field }" name="category">
        <ItField label="Category" html-for="quiz-category">
          <ItInput
            id="quiz-category"
            :model-value="field.value ?? ''"
            placeholder="e.g. Geography"
            @update:model-value="field.onChange"
            @blur="field.onBlur"
          />
        </ItField>
      </Field>

      <Field v-slot="{ field }" name="theme">
        <ItField label="Theme" html-for="quiz-theme" hint="Defaults to the application theme.">
          <ItSelect
            id="quiz-theme"
            :model-value="field.value ?? ''"
            @update:model-value="field.onChange"
            @blur="field.onBlur"
          >
            <ItOption value="" :text="`Default (${DEFAULT_THEME.mode}, ${DEFAULT_THEME.accent})`" />
            <ItOption
              v-for="option in THEME_OPTIONS"
              :key="option.value"
              :value="option.value"
              :text="`${option.mode} · ${option.accent}`"
            />
          </ItSelect>
        </ItField>
      </Field>

      <ItField label="Tags" html-for="quiz-tag-input">
        <div class="quiz-tag-row">
          <ItInput
            id="quiz-tag-input"
            v-model="tagDraft"
            class="quiz-tag-input"
            placeholder="Add a tag"
            @keydown.enter.prevent="submitTag"
          />
          <ItButton type="button" variant="secondary" :aria-label="'Add tag'" @click="submitTag">
            <PhPlus :size="16" />
          </ItButton>
        </div>

        <Field v-slot="{ field }" name="tags">
          <div v-if="field.value.length > 0" class="quiz-tag-list">
            <ItBadge
              v-for="tag in field.value"
              :key="tag"
              variant="primary"
              soft
              removable
              :remove-label="`Remove tag ${tag}`"
              @remove="emit('remove-tag', tag)"
            >
              {{ tag }}
            </ItBadge>
          </div>

          <div v-if="tagSuggestions.length > 0" class="quiz-tag-list">
            <button
              v-for="suggestion in tagSuggestions"
              :key="suggestion"
              type="button"
              class="quiz-tag-suggestion"
              @click="emit('add-tag', suggestion)"
            >
              + {{ suggestion }}
            </button>
          </div>
        </Field>
      </ItField>
    </ItCardBody>
  </ItCard>
</template>
