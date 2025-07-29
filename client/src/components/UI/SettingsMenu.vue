<template>
  <BaseModal v-model:visible="visible" class="cursor-default bg-white">
    <template #header>
      <div class="text-2xl text-gray-600">Settings</div>
    </template>

    <div class="flex flex-col items-center justify-center bg-white">
      <h1>Settings</h1>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import { BaseModal } from '@/components/core'

const visible = defineModel<boolean>('visible')
</script>
