<template>
  <prime-dialog v-model:visible="visible" :header draggable :class="maxWidthClass">
    <template #header>
      <slot name="header">
        <div class="modal-title">{{ header }}</div>
      </slot>
    </template>

    <slot />

    <template #footer>
      <slot name="footer" />
    </template>
  </prime-dialog>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import PrimeDialog from 'primevue/dialog'

// A wrapper around PrimeVue's Dialog component
// https://primevue.org/dialog/

const visible = defineModel<boolean>('visible')

const props = withDefaults(
  defineProps<{
    header?: string
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'
  }>(),
  {
    maxWidth: '2xl',
  }
)

const maxWidthClass = computed(
  () =>
    ({
      sm: 'sm:min-w-sm',
      md: 'sm:min-w-md',
      lg: 'sm:min-w-lg',
      xl: 'sm:min-w-xl',
      '2xl': 'sm:max-w-2xl',
      '3xl': 'sm:max-w-3xl',
    })[props.maxWidth]
)
</script>
