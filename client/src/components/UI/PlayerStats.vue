<template>
  <div class="player-stats">
    <div class="player-info">
      <h3>{{ player.name }}</h3>
      <div class="level">Level {{ player.level }}</div>
    </div>

    <div class="stat-bars">
      <!-- Health Bar -->
      <div class="stat-bar">
        <div class="stat-label">Health</div>
        <div class="bar-container">
          <div class="bar health-bar" :style="{ width: healthPercentage + '%' }" />
          <div class="bar-text">{{ player.health }}/{{ player.maxHealth }}</div>
        </div>
      </div>

      <!-- Mana Bar -->
      <div class="stat-bar">
        <div class="stat-label">Mana</div>
        <div class="bar-container">
          <div class="bar mana-bar" :style="{ width: manaPercentage + '%' }" />
          <div class="bar-text">{{ player.mana }}/{{ player.maxMana }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Player } from '../../stores/game'

interface Props {
  player: Player
}

const props = defineProps<Props>()

const healthPercentage = computed(() => (props.player.health / props.player.maxHealth) * 100)

const manaPercentage = computed(() => (props.player.mana / props.player.maxMana) * 100)
</script>

<style scoped>
.player-stats {
  background: rgba(0, 0, 0, 0.8);
  border-radius: 8px;
  padding: 16px;
  color: white;
  min-width: 250px;
}

.player-info {
  text-align: center;
  margin-bottom: 12px;
}

.player-info h3 {
  margin: 0 0 4px 0;
  font-size: 18px;
}

.level {
  font-size: 14px;
  color: #ffd700;
}

.stat-bars {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.stat-bar {
  display: flex;
  align-items: center;
  gap: 8px;
}

.stat-label {
  font-size: 12px;
  min-width: 50px;
  text-align: right;
}

.bar-container {
  position: relative;
  flex: 1;
  height: 20px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  overflow: hidden;
}

.bar {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  border-radius: 10px;
  transition: width 0.3s ease;
}

.health-bar {
  background: linear-gradient(90deg, #ff4444, #ff6666);
}

.mana-bar {
  background: linear-gradient(90deg, #4444ff, #6666ff);
}

.bar-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 12px;
  font-weight: bold;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
  z-index: 1;
}
</style>
