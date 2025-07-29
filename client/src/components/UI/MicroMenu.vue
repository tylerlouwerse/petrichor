<template>
  <div>
    <div class="flex">
      <!-- Backpack -->
      <div @click="openBackpack" title="Backpack" class="micro-menu-button">
        <img src="/backpack.png" alt="Backpack" class="h-6 w-6" />
      </div>
      <!-- Logout -->
      <div @click="openLogout" title="Logout" class="micro-menu-button">
        <img src="/exit-door-icon.png" alt="Logout" class="h-6 w-6" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import SettingsMenu from './SettingsMenu.vue'

const emit = defineEmits<{
  (e: 'openBackpack'): void
  (e: 'openLogout'): void
}>()

// Placeholder action functions
const openLogout = () => emit('openLogout')
const openBackpack = () => emit('openBackpack')
</script>

<style scoped>
.micro-menu-button {
  position: relative;
  display: flex;
  height: 2.25rem;
  width: 2.25rem;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  transition: all 150ms;
  border-radius: 0.4rem;

  /* RuneScape-style 3D inset button */
  background: linear-gradient(135deg, #8b7355 0%, #6b5b47 25%, #5a4a36 50%, #4a3a26 75%, #3a2a16 100%);
  border: 1px solid #2a1a06;
  border-top-color: #ab9375;
  border-left-color: #9b8365;
  border-right-color: #2a1a06;
  border-bottom-color: #1a0a00;

  /* Inset shadow effect */
  box-shadow:
    inset 1px 1px 0px rgba(171, 147, 117, 0.8),
    inset -1px -1px 0px rgba(26, 10, 0, 0.8),
    0 1px 2px rgba(0, 0, 0, 0.5);
}

.micro-menu-button:hover {
  background: linear-gradient(135deg, #9b8365 0%, #7b6b57 25%, #6a5a46 50%, #5a4a36 75%, #4a3a26 100%);
  transform: translateY(-1px);
  box-shadow:
    inset 1px 1px 0px rgba(181, 157, 127, 0.9),
    inset -1px -1px 0px rgba(26, 10, 0, 0.9),
    0 2px 4px rgba(0, 0, 0, 0.6);
}

.micro-menu-button:active {
  transform: translateY(1px);
  box-shadow:
    inset 1px 1px 2px rgba(26, 10, 0, 0.8),
    inset -1px -1px 0px rgba(171, 147, 117, 0.3),
    0 0px 1px rgba(0, 0, 0, 0.8);
}

.micro-menu-button:active::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.2);
  pointer-events: none;
}
</style>
