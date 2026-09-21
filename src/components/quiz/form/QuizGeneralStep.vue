<script setup lang="ts">
import { ref } from 'vue'
import { Field } from 'vee-validate'
import { DBadge, DButton, DInput, DLabel, DTextarea } from '@/components/daisy-ui'
import { DCard, DCardBody, DCardTitle } from '@/components/daisy-ui/card'
import { PhPlus } from '@phosphor-icons/vue'

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
  <DCard border class="bg-base-100 w-full">
    <DCardBody padding="lg" class="gap-6">
      <DCardTitle tag="h2" size="lg">General information</DCardTitle>

      <Field v-slot="{ field, errorMessage }" name="title">
        <DLabel variant="input" text="Title" class="w-full">
          <DInput
            :model-value="field.value"
            :color="errorMessage ? 'error' : undefined"
            placeholder="My quiz title"
            @update:model-value="field.onChange"
            @blur="field.onBlur"
          />
        </DLabel>
        <span v-if="errorMessage" class="text-error text-sm">{{ errorMessage }}</span>
      </Field>

      <Field v-slot="{ field, errorMessage }" name="description">
        <DLabel variant="input" text="Description" class="w-full">
          <DTextarea
            :model-value="field.value"
            :variant="errorMessage ? 'error' : 'neutral'"
            placeholder="What is this quiz about?"
            :rows="3"
            @update:model-value="field.onChange"
            @blur="field.onBlur"
          />
        </DLabel>
        <span v-if="errorMessage" class="text-error text-sm">{{ errorMessage }}</span>
      </Field>

      <Field v-slot="{ field }" name="category">
        <DLabel variant="input" text="Category" class="w-full">
          <DInput
            :model-value="field.value ?? ''"
            placeholder="e.g. Geography"
            @update:model-value="field.onChange"
            @blur="field.onBlur"
          />
        </DLabel>
      </Field>

      <div class="flex flex-col gap-3">
        <DLabel variant="input" text="Tags" class="w-full">
          <div class="flex gap-2">
            <DInput v-model="tagDraft" placeholder="Add a tag" @keydown.enter.prevent="submitTag" />
            <DButton type="button" variant="secondary" size="md" @click="submitTag">
              <PhPlus :size="16" />
            </DButton>
          </div>
        </DLabel>

        <Field v-slot="{ field }" name="tags">
          <div v-if="field.value.length > 0" class="flex flex-wrap gap-2">
            <DBadge
              v-for="tag in field.value"
              :key="tag"
              variant="primary"
              soft
              removable
              @remove="emit('remove-tag', tag)"
            >
              {{ tag }}
            </DBadge>
          </div>

          <div v-if="tagSuggestions.length > 0" class="flex flex-wrap gap-2 mt-1">
            <button
              v-for="suggestion in tagSuggestions"
              :key="suggestion"
              type="button"
              class="badge badge-ghost badge-sm cursor-pointer"
              @click="emit('add-tag', suggestion)"
            >
              + {{ suggestion }}
            </button>
          </div>
        </Field>
      </div>
    </DCardBody>
  </DCard>
</template>
