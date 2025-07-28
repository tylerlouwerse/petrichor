<template>
  <div
    class="flex items-center gap-2 bg-black/80 p-2 rounded-2xl text-white text-sm"
    :class="{ connected: isConnected, disconnected: !isConnected }"
    @click="gameStore.connectToServer"
  >
    <div class="status-indicator"></div>
    <span>{{ isConnected ? "Connected" : "Disconnected" }}</span>
  </div>
</template>

<script setup lang="ts">
import { useGameStore } from "../../stores/game";

const gameStore = useGameStore();

interface Props {
  isConnected: boolean;
}

defineProps<Props>();
</script>

<style scoped>
.connection-status {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(0, 0, 0, 0.8);
  padding: 8px 16px;
  border-radius: 20px;
  color: white;
  font-size: 14px;
}

.status-indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

.connected .status-indicator {
  background: #4caf50;
}

.disconnected .status-indicator {
  background: #f44336;
}

@keyframes pulse {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
}
</style>
