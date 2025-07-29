<template>
  <div class="game-container">
    <!-- 3D Game World -->
    <GameWorld class="game-world" @tile-click="onTileClick" />

    <!-- Game UI Overlay -->
    <UserInterface />
    <div class="game-ui">
      <!-- Top HUD -->
      <div class="top-hud">
        <PlayerStats v-if="gameStore.currentPlayer" :player="gameStore.currentPlayer" />
        <ConnectionStatus :is-connected="gameStore.isConnected" />
      </div>

      <!-- Loading Overlay -->
      <div v-if="gameStore.isLoading" class="loading-overlay">
        <div class="loading-spinner">Loading...</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import GameWorld from '../components/GameWorld.vue'
import PlayerStats from '../components/UI/PlayerStats.vue'
import UserInterface from '../components/UI/UserInterface.vue'
import ConnectionStatus from '../components/UI/ConnectionStatus.vue'
import { useGameStore, type WorldTile, type Position3D } from '../stores/game'

const gameStore = useGameStore()

onMounted(() => {
  // Initialize mock player data for development
  initializeDevelopmentData()
})

function initializeDevelopmentData() {
  // Mock current player for development
  gameStore.currentPlayer = {
    id: 1,
    name: 'TestPlayer',
    position: [10, 0, 10],
    level: 5,
    health: 80,
    maxHealth: 100,
    mana: 45,
    maxMana: 60,
    isOnline: true,
  }

  // Mock available spells
  gameStore.availableSpells = [
    {
      id: 1,
      name: 'Fireball',
      description: 'Launches a ball of fire at target location',
      spellType: 'combat',
      requiredMagicLevel: 3,
      manaCost: 15,
      castTimeMs: 2000,
      cooldownMs: 5000,
      rangeTiles: 5,
      modifiesTerrain: false,
      hasAreaEffect: true,
      areaRadius: 2,
      baseDamage: 25,
    },
    {
      id: 2,
      name: 'Earth Wall',
      description: 'Raises a wall of earth to block movement',
      spellType: 'terrain',
      requiredMagicLevel: 5,
      manaCost: 25,
      castTimeMs: 3000,
      cooldownMs: 10000,
      rangeTiles: 3,
      modifiesTerrain: true,
      hasAreaEffect: false,
      areaRadius: 0,
      terrainEffect: 'raise',
      baseDamage: 0,
    },
  ]
}

function onTileClick(tile: WorldTile) {
  console.log('Tile clicked:', tile)
  // Move player to clicked tile
  gameStore.movePlayer(tile.x, tile.z, tile.y)
}

function onCastSpell(spellId: number, targetPosition: Position3D) {
  console.log('Casting spell:', spellId, 'at position:', targetPosition)
  gameStore.castSpell(spellId, targetPosition)
}
</script>

<style scoped>
.game-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.game-world {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.game-ui {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 10;
}

.top-hud {
  position: absolute;
  top: 20px;
  left: 20px;
  right: 20px;
  display: flex;
  justify-content: space-between;
  pointer-events: auto;
}

.right-panel {
  position: absolute;
  top: 100px;
  right: 20px;
  width: 300px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  pointer-events: auto;
}

.bottom-panel {
  position: absolute;
  bottom: 20px;
  left: 20px;
  right: 320px;
  pointer-events: auto;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: auto;
}

.loading-spinner {
  color: white;
  font-size: 24px;
  font-weight: bold;
}
</style>
