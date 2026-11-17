<script setup lang="ts">
import { computed, ref } from 'vue'
import { Field, useFieldArray } from 'vee-validate'
import { ItCard, ItCardBody, ItCardTitle } from '@/components/itheme'
import { ItButton, ItCheckbox, ItField, ItInput, ItTextarea } from '@infinitylib/infinity-theme-vue'
import { PhPlus, PhTrash, PhCaretDown, PhCaretUp } from '@phosphor-icons/vue'
import { MarkdownContent } from '../content'

interface Props {
  questionIndex: number
  totalQuestions: number
  canRemove: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{ remove: [] }>()

const showAdvanced = ref(false)
const showContextPreview = ref(false)

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
  <ItCard border class="quiz-form-card">
    <ItCardBody size="lg">
      <div class="quiz-question-head">
        <ItCardTitle as="h3">Question {{ questionIndex + 1 }}</ItCardTitle>
        <ItButton
          v-if="canRemove"
          type="button"
          variant="danger"
          size="sm"
          :aria-label="`Remove question ${questionIndex + 1}`"
          @click="emit('remove')"
        >
          <PhTrash :size="16" />
        </ItButton>
      </div>

      <Field v-slot="{ field, errorMessage }" :name="`${basePath}.text`">
        <ItField
          label="Question text"
          :html-for="`question-${questionIndex}-text`"
          :error="errorMessage"
        >
          <ItInput
            :id="`question-${questionIndex}-text`"
            :model-value="field.value"
            :invalid="!!errorMessage"
            placeholder="Your question"
            @update:model-value="field.onChange"
            @blur="field.onBlur"
          />
        </ItField>
      </Field>

      <Field v-slot="{ field }" :name="`${basePath}.context`">
        <ItField
          label="Context (optional, Markdown)"
          :html-for="`question-${questionIndex}-context`"
          hint="A code sample, a quotation, a table: what the question refers to. Links open in a new tab."
        >
          <div class="quiz-context-editor">
            <fieldset class="it-fieldset-plain quiz-context-tools">
              <legend class="it-sr-only">Context preview</legend>
              <ItButton
                type="button"
                size="sm"
                :variant="showContextPreview ? 'ghost' : 'secondary'"
                :aria-pressed="!showContextPreview"
                @click="showContextPreview = false"
              >
                Write
              </ItButton>
              <ItButton
                type="button"
                size="sm"
                :variant="showContextPreview ? 'secondary' : 'ghost'"
                :aria-pressed="showContextPreview"
                @click="showContextPreview = true"
              >
                Preview
              </ItButton>
            </fieldset>

            <ItTextarea
              v-show="!showContextPreview"
              :id="`question-${questionIndex}-context`"
              :model-value="field.value ?? ''"
              :rows="4"
              placeholder="Write Markdown shown with the question"
              @update:model-value="field.onChange"
              @blur="field.onBlur"
            />

            <div v-show="showContextPreview" class="quiz-context-preview">
              <MarkdownContent v-if="field.value" :source="field.value" />
              <p v-else class="quiz-context-empty">Nothing to preview yet.</p>
            </div>
          </div>
        </ItField>
      </Field>

      <div class="quiz-options">
        <span class="quiz-options-label">Options</span>
        <Field v-slot="{ field: correctField }" :name="`${basePath}.correctAnswerIndex`">
          <div class="quiz-option-list">
            <div
              v-for="(optionField, optionIndex) in optionFields"
              :key="optionField.key"
              class="quiz-option-row"
            >
              <input
                type="radio"
                class="it-radio-primary"
                :name="`correct-${questionIndex}`"
                :checked="correctField.value === optionIndex"
                :aria-label="`Mark option ${optionIndex + 1} as correct`"
                @change="correctField.onChange(optionIndex)"
              />
              <Field
                v-slot="{ field, errorMessage }"
                :name="`${basePath}.options[${optionIndex}]`"
                class="quiz-option-field"
              >
                <ItInput
                  :model-value="field.value"
                  :invalid="!!errorMessage"
                  :placeholder="`Option ${optionIndex + 1}`"
                  :aria-label="`Option ${optionIndex + 1}`"
                  @update:model-value="field.onChange"
                  @blur="field.onBlur"
                />
              </Field>
              <ItButton
                type="button"
                variant="ghost"
                size="sm"
                :disabled="optionFields.length <= 2"
                :aria-label="`Remove option ${optionIndex + 1}`"
                @click="removeOptionAt(optionIndex)"
              >
                <PhTrash :size="16" />
              </ItButton>
            </div>
          </div>
        </Field>
        <ItButton type="button" variant="secondary" size="sm" @click="addOption">
          <PhPlus :size="16" />
          Add option
        </ItButton>
      </div>

      <div class="quiz-advanced">
        <button
          type="button"
          class="quiz-advanced-toggle"
          :aria-expanded="showAdvanced"
          :aria-controls="`question-${questionIndex}-advanced`"
          @click="showAdvanced = !showAdvanced"
        >
          <PhCaretUp v-if="showAdvanced" :size="16" />
          <PhCaretDown v-else :size="16" />
          Advanced options
        </button>

        <div
          v-if="showAdvanced"
          :id="`question-${questionIndex}-advanced`"
          class="quiz-advanced-panel"
        >
          <Field v-slot="{ field }" :name="`${basePath}.explanation`">
            <ItField
              label="Explanation (Markdown, shown with feedback)"
              :html-for="`question-${questionIndex}-explanation`"
            >
              <ItTextarea
                :id="`question-${questionIndex}-explanation`"
                :model-value="field.value ?? ''"
                :rows="2"
                placeholder="Explain the correct answer"
                @update:model-value="field.onChange"
                @blur="field.onBlur"
              />
            </ItField>
          </Field>

          <Field v-slot="{ field }" :name="`${basePath}.timeLimit`">
            <ItField
              label="Time limit (seconds, optional)"
              :html-for="`question-${questionIndex}-time-limit`"
            >
              <ItInput
                :id="`question-${questionIndex}-time-limit`"
                type="number"
                :model-value="field.value ?? ''"
                placeholder="No limit"
                @update:model-value="field.onChange"
                @blur="field.onBlur"
              />
            </ItField>
          </Field>

          <Field v-slot="{ field }" :name="`${basePath}.shuffleAnswers`">
            <ItCheckbox
              :id="`question-${questionIndex}-shuffle`"
              :label="`Shuffle this question's answers`"
              :model-value="field.value ?? false"
              @update:model-value="field.onChange"
            />
          </Field>
        </div>
      </div>
    </ItCardBody>
  </ItCard>
</template>
