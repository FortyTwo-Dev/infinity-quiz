<script setup lang="ts">
import { computed, ref } from 'vue'
import { Field, useFieldArray } from 'vee-validate'
import { DButton, DCheckbox, DInput, DLabel, DTextarea } from '@/components/daisy-ui'
import { DCard, DCardBody, DCardTitle } from '@/components/daisy-ui/card'
import { PhPlus, PhTrash, PhCaretDown, PhCaretUp } from '@phosphor-icons/vue'

interface Props {
  questionIndex: number
  totalQuestions: number
  canRemove: boolean
}

const props = defineProps<Props>()

interface Emits {
  (e: 'remove'): void
}

const emit = defineEmits<Emits>()

const showAdvanced = ref(false)

const basePath = computed(() => `questions[${props.questionIndex}]` as const)

const {
  fields: optionFields,
  push: pushOption,
  remove: removeOption,
} = useFieldArray<string>(`${basePath.value}.options`)

function addOption() {
  pushOption('')
}

function removeOptionAt(optionIndex: number) {
  if (optionFields.value.length <= 2) return
  removeOption(optionIndex)
}
</script>

<template>
  <DCard border class="bg-base-100 w-full">
    <DCardBody padding="lg" class="gap-4">
      <div class="flex items-center justify-between">
        <DCardTitle tag="h3" size="md">Question {{ questionIndex + 1 }}</DCardTitle>
        <DButton
          v-if="canRemove"
          type="button"
          variant="error"
          size="sm"
          soft
          @click="emit('remove')"
        >
          <PhTrash :size="16" />
        </DButton>
      </div>

      <Field v-slot="{ field, errorMessage }" :name="`${basePath}.text`">
        <DLabel variant="input" text="Question text" class="w-full">
          <DInput
            :model-value="field.value"
            :color="errorMessage ? 'error' : undefined"
            placeholder="Your question"
            @update:model-value="field.onChange"
            @blur="field.onBlur"
          />
        </DLabel>
        <span v-if="errorMessage" class="text-error text-sm">{{ errorMessage }}</span>
      </Field>

      <div class="flex flex-col gap-2">
        <span class="text-sm font-medium">Options</span>
        <Field
          v-slot="{ field: correctField }"
          :name="`${basePath}.correctAnswerIndex`"
        >
          <div class="flex flex-col gap-2">
            <div
              v-for="(optionField, optionIndex) in optionFields"
              :key="optionField.key"
              class="flex items-center gap-2"
            >
              <input
                type="radio"
                class="radio radio-primary"
                :name="`correct-${questionIndex}`"
                :checked="correctField.value === optionIndex"
                :aria-label="`Mark option ${optionIndex + 1} as correct`"
                @change="correctField.onChange(optionIndex)"
              />
              <Field
                v-slot="{ field, errorMessage }"
                :name="`${basePath}.options[${optionIndex}]`"
                class="flex-1"
              >
                <DInput
                  :model-value="field.value"
                  :color="errorMessage ? 'error' : undefined"
                  :placeholder="`Option ${optionIndex + 1}`"
                  class="flex-1"
                  @update:model-value="field.onChange"
                  @blur="field.onBlur"
                />
              </Field>
              <DButton
                type="button"
                variant="ghost"
                size="sm"
                :disabled="optionFields.length <= 2"
                @click="removeOptionAt(optionIndex)"
              >
                <PhTrash :size="16" />
              </DButton>
            </div>
          </div>
        </Field>
        <DButton type="button" variant="secondary" size="sm" soft @click="addOption">
          <PhPlus :size="16" />
          Add option
        </DButton>
      </div>

      <div class="flex flex-col gap-3">
        <button
          type="button"
          class="btn btn-ghost btn-sm justify-start gap-2 self-start"
          @click="showAdvanced = !showAdvanced"
        >
          <PhCaretUp v-if="showAdvanced" :size="16" />
          <PhCaretDown v-else :size="16" />
          Advanced options
        </button>

        <div v-if="showAdvanced" class="flex flex-col gap-4 pl-2">
          <Field v-slot="{ field }" :name="`${basePath}.explanation`">
            <DLabel variant="input" text="Explanation (shown with feedback)" class="w-full">
              <DTextarea
                :model-value="field.value ?? ''"
                :rows="2"
                placeholder="Explain the correct answer"
                @update:model-value="field.onChange"
                @blur="field.onBlur"
              />
            </DLabel>
          </Field>

          <Field v-slot="{ field }" :name="`${basePath}.timeLimit`">
            <DLabel variant="input" text="Time limit (seconds, optional)" class="w-full">
              <DInput
                type="number"
                :model-value="field.value ?? ''"
                placeholder="No limit"
                @update:model-value="field.onChange"
                @blur="field.onBlur"
              />
            </DLabel>
          </Field>

          <Field v-slot="{ field }" :name="`${basePath}.shuffleAnswers`">
            <label class="flex items-center gap-3 cursor-pointer">
              <DCheckbox
                :model-value="field.value ?? false"
                @update:model-value="field.onChange"
              />
              <span class="text-sm">Shuffle this question's answers</span>
            </label>
          </Field>
        </div>
      </div>
    </DCardBody>
  </DCard>
</template>
