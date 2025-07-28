<template>
  <TresGroup :position="position">
    <!-- Character Body -->
    <TresMesh :position="[0, 0.5, 0]">
      <TresBoxGeometry :args="[1, 0.5, 1]" />
      <TresMeshLambertMaterial color="#ff6b6b" />
    </TresMesh>

    <!-- Character Head -->
    <TresMesh :position="[0, 1.2, 0]">
      <TresSphereGeometry :args="[0.25, 8, 8]" />
      <TresMeshLambertMaterial color="#fdbcb4" />
    </TresMesh>

    <!-- Equipment/Weapon placeholder -->
    <!-- <TresMesh v-if="characterData.equipment?.weapon" :position="[0.4, 0.8, 0]">
      <TresBoxGeometry :args="[0.1, 0.8, 0.1]" />
      <TresMeshLambertMaterial color="#8b4513" />
    </TresMesh> -->
  </TresGroup>
</template>

<script setup lang="ts">
import type { Player, Position3D } from '../stores/game'

interface Props {
  position: Position3D
  characterData?: Player
}

const props = defineProps<Props>()

function getPlayerColor(): string {
  // Different colors for different players
  const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#f0932b', '#eb4d4b']
  return colors[(props.characterData?.id || 0) % colors.length]
}
</script>
