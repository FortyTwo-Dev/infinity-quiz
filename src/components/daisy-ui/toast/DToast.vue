<script setup lang="ts">
/**
 * DToast - Daisy UI Toast container component
 * Wrapper for toast positioning classes
 *
 * @example
 * <DToast position="top-end">
 *   <div class="alert alert-info">Message</div>
 * </DToast>
 */

type HorizontalPosition = 'start' | 'center' | 'end'
type VerticalPosition = 'top' | 'middle' | 'bottom'

interface Props {
  /** Horizontal position */
  horizontal?: HorizontalPosition
  /** Vertical position */
  vertical?: VerticalPosition
}

const props = withDefaults(defineProps<Props>(), {
  horizontal: 'end',
  vertical: 'bottom',
})

/**
 * DaisyUI toast position classes
 */
const horizontalClasses: Record<HorizontalPosition, string> = {
  start: 'toast-start',
  center: 'toast-center',
  end: 'toast-end',
}

const verticalClasses: Record<VerticalPosition, string> = {
  top: 'toast-top',
  middle: 'toast-middle',
  bottom: 'toast-bottom',
}
</script>

<template>
  <div
    class="toast z-50"
    :class="[horizontalClasses[props.horizontal], verticalClasses[props.vertical]]"
  >
    <slot />
  </div>
</template>
