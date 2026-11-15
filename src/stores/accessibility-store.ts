import { defineStore } from 'pinia'
import { ref } from 'vue'
import { STORAGE_KEYS } from '../constants'

/**
 * The reading typeface is carried by one attribute on the document root; the
 * stylesheet binds `--it-font-sans` to it. Absent, the brand typeface applies.
 */
function writeDyslexicFont(enabled: boolean) {
  if (typeof document === 'undefined') return
  if (enabled) document.documentElement.dataset.font = 'dyslexic'
  else delete document.documentElement.dataset.font
}

export const useAccessibilityStore = defineStore(
  'accessibility',
  () => {
    const isDyslexicFontEnabled = ref(false)

    function setDyslexicFontEnabled(enabled: boolean) {
      isDyslexicFontEnabled.value = enabled
      writeDyslexicFont(enabled)
    }

    /** Apply the rehydrated preference, normalized: storage is untrusted. */
    function rehydrate() {
      isDyslexicFontEnabled.value = isDyslexicFontEnabled.value === true
      writeDyslexicFont(isDyslexicFontEnabled.value)
    }

    return {
      isDyslexicFontEnabled,
      setDyslexicFontEnabled,
      rehydrate,
    }
  },
  {
    persist: {
      key: STORAGE_KEYS.accessibility,
      pick: ['isDyslexicFontEnabled'],
    },
  },
)
