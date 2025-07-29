<template>
  <div class="pointer-events-none absolute top-0 left-0 h-full w-full">
    <InterfaceItem>
      <MicroMenu class="absolute right-3 bottom-3" @openBackpack="openBackpack" @openLogout="openLogout" />
    </InterfaceItem>

    <!-- Modals -->
    <SettingsMenu v-model:visible="showSettingsMenu" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import InterfaceItem from './InterfaceItem.vue'
import MicroMenu from './MicroMenu.vue'
import SettingsMenu from './SettingsMenu.vue'

const showSettingsMenu = ref(false)

const openBackpack = () => {
  console.log('Opening Backpack')
}

const openLogout = () => {
  showSettingsMenu.value = !showSettingsMenu.value
}
</script>
