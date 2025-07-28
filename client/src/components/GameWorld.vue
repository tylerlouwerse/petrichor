<template>
  <TresCanvas class="game-world" clear-color="#87CEEB">
    <!-- Isometric Camera Setup -->
    <TresPerspectiveCamera :position="cameraPosition" :look-at="playerPosition" />

    <!-- OrbitControls that orbit around the player -->
    <OrbitControls
      :target="playerPosition"
      :enable-pan="false"
      :enable-rotate="true"
      :enable-zoom="true"
      :min-distance="5"
      :max-distance="50"
    />

    <PlayerCharacter :position="playerPosition" :character-data="gameStore.currentPlayer || undefined" />

    <!-- Lighting -->
    <TresAmbientLight :intensity="0.6" />
    <TresDirectionalLight :position="[10, 10, 5]" :intensity="0.8" cast-shadow />

    <!-- Game World -->
    <GameTerrain :tiles="worldTiles" @click="handleTerrainClick" />

    <!-- Spell Effects -->
    <SpellEffect v-for="effect in activeSpellEffects" :key="effect.id" :effect="effect" />
  </TresCanvas>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { TresCanvas } from '@tresjs/core'
import { OrbitControls } from '@tresjs/cientos'
import GameTerrain from './GameTerrain.vue'
import PlayerCharacter from './PlayerCharacter.vue'
import { useGameStore, type Position3D } from '../stores/game'

// Game store
const gameStore = useGameStore()

// Camera offset for isometric view (relative to player position)
const cameraOffset: Position3D = [15, 20, 15]

// Camera position that follows the player
const cameraPosition = computed<Position3D>(() => {
  const playerPos = gameStore.playerPosition
  return [playerPos[0] + cameraOffset[0], playerPos[1] + cameraOffset[1], playerPos[2] + cameraOffset[2]] as Position3D
})

// Player position from store
const playerPosition = computed<Position3D>(() => gameStore.playerPosition as Position3D)

// Computed properties from store
const worldTiles = computed(() => gameStore.currentMap?.tiles || [])
const activeSpellEffects = computed(() => gameStore.activeSpellEffects)

// Initialize the game world
onMounted(() => {
  // Load initial world data
  gameStore.loadMap('tutorial_island')
  gameStore.connectToServer()
})

const handleTerrainClick = (tile: WorldTile) => {
  console.log('Terrain clicked:', tile)
  gameStore.movePlayer(tile.point)
}
</script>

<style scoped>
.game-world {
  width: 100%;
  height: 100vh;
  display: block;
}
</style>
