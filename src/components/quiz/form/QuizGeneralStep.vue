<script setup lang="ts">
import { ref } from 'vue'
import { Field } from 'vee-validate'
import { DBadge, DButton, DFieldset, DInput, DTextarea } from '@/components/daisy-ui'
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
        <DFieldset label="Title" :message="errorMessage" :error="!!errorMessage" class="w-full">
          <DInput
            :model-value="field.value"
            :color="errorMessage ? 'error' : undefined"
            placeholder="My quiz title"
            @update:model-value="field.onChange"
            @blur="field.onBlur"
          />
        </DFieldset>
      </Field>

      <Field v-slot="{ field, errorMessage }" name="description">
        <DFieldset
          label="Description"
          :message="errorMessage"
          :error="!!errorMessage"
          class="w-full"
        >
          <DTextarea
            :model-value="field.value"
            :variant="errorMessage ? 'error' : undefined"
            placeholder="What is this quiz about?"
            :rows="3"
            @update:model-value="field.onChange"
            @blur="field.onBlur"
          />
        </DFieldset>
      </Field>

      <Field v-slot="{ field }" name="category">
        <DFieldset label="Category" class="w-full">
          <DInput
            :model-value="field.value ?? ''"
            placeholder="e.g. Geography"
            @update:model-value="field.onChange"
            @blur="field.onBlur"
          />
        </DFieldset>
      </Field>

      <DFieldset label="Tags" class="w-full">
        <div class="flex gap-2">
          <DInput v-model="tagDraft" placeholder="Add a tag" @keydown.enter.prevent="submitTag" />
          <DButton type="button" variant="secondary" size="md" @click="submitTag">
            <PhPlus :size="16" />
          </DButton>
        </div>

        <Field v-slot="{ field }" name="tags">
          <div v-if="field.value.length > 0" class="flex flex-wrap gap-2 mt-2">
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

          <div v-if="tagSuggestions.length > 0" class="flex flex-wrap gap-2 mt-2">
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
      </DFieldset>
    </DCardBody>
  </DCard>
</template>
