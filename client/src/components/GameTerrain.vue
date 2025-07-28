<template>
  <TresGroup>
    <!-- Render each tile as a mesh -->
    <TresMesh
      v-for="tile in tiles"
      :key="`${tile.x}-${tile.y}`"
      :position="[tile.x, tile.height, tile.y]"
      @click="onTileClick(tile)"
    >
      <TresBoxGeometry :args="[1, 0.2, 1]" />
      <TresMeshLambertMaterial :color="getTileColor(tile)" />
    </TresMesh>
  </TresGroup>
</template>

<script setup lang="ts">
import type { WorldTile } from '../stores/game'

interface Props {
  tiles: WorldTile[]
}

const props = defineProps<Props>()

// Emit tile click events for movement/interaction
const emit = defineEmits<{
  tileClick: [tile: WorldTile]
}>()

function getTileColor(tile: WorldTile): string {
  // Simple color mapping based on tile type/height
  switch (tile.texture) {
    case 'grass':
      return '#4a7c59'
    case 'stone':
      return '#8c8c8c'
    case 'water':
      return '#4a90e2'
    case 'sand':
      return '#f4e4bc'
    case 'dirt':
      return '#8b5a3c'
    default:
      return '#4a7c59' // Default grass
  }
}

function onTileClick(tile: WorldTile) {
  emit('tileClick', tile)
}
</script>
