import { defineStore } from 'pinia'
import { ref, computed, reactive } from 'vue'
import Echo from 'laravel-echo'
import Pusher from 'pusher-js'

// Type declaration for window.Pusher
declare global {
  interface Window {
    Pusher: typeof Pusher
  }
}

// Configure Echo for Laravel Reverb
window.Pusher = Pusher

const echo = new Echo({
  broadcaster: 'pusher',
  key: import.meta.env.VITE_REVERB_APP_KEY || 'reverb-key',
  cluster: 'mt1', // not used for Reverb but required by pusher-js
  wsHost: import.meta.env.VITE_REVERB_HOST || 'localhost',
  wsPort: import.meta.env.VITE_REVERB_PORT || 8080,
  wssPort: import.meta.env.VITE_REVERB_PORT || 8080,
  forceTLS: (import.meta.env.VITE_REVERB_SCHEME || 'http') === 'https',
  enabledTransports: ['ws', 'wss'],
  disableStats: true,
})

// Use tuple type instead of Three.js Vector3 for simple position arrays
export type Position3D = [number, number, number]

// Types
export interface Player {
  id: number
  name: string
  position: Position3D
  level: number
  health: number
  maxHealth: number
  mana: number
  maxMana: number
  isOnline: boolean
}

export interface WorldTile {
  x: number
  y: number
  z: number
  height: number
  texture: string
  walkable: boolean
  objects?: any[]
}

export interface WorldMap {
  name: string
  displayName: string
  width: number
  height: number
  tiles: WorldTile[]
  spawnPoints: Array<{ x: number; y: number; z: number; type: string }>
}

export interface TerrainModification {
  id: number
  characterId: number
  spellId: number
  mapName: string
  centerX: number
  centerY: number
  centerZ: number
  affectedTiles: Array<{
    x: number
    y: number
    originalHeight: number
    newHeight: number
  }>
  modificationType: string
  heightChange: number
  expiresAt?: Date
  isActive: boolean
}

export interface SpellEffect {
  id: string
  spellId: number
  position: Position3D
  duration: number
  startTime: Date
  particleEffect?: string
}

export interface Spell {
  id: number
  name: string
  description: string
  spellType: string
  requiredMagicLevel: number
  manaCost: number
  castTimeMs: number
  cooldownMs: number
  rangeTiles: number
  modifiesTerrain: boolean
  hasAreaEffect: boolean
  areaRadius: number
  terrainEffect?: string
  baseDamage: number
}

export const useGameStore = defineStore('game', () => {
  // State
  const currentPlayer = ref<Player | null>(null)
  const players = ref<Player[]>([])
  const currentMap = ref<WorldMap | null>(null)
  const terrainModifications = ref<TerrainModification[]>([])
  const activeSpellEffects = ref<SpellEffect[]>([])
  const availableSpells = ref<Spell[]>([])
  const isConnected = ref(false)
  const isLoading = ref(false)

  // WebSocket connection
  let websocket: WebSocket | null = null

  // Computed
  const isPlayerOnline = computed(() => currentPlayer.value?.isOnline || false)
  const playerPosition = computed(() => currentPlayer.value?.position || [0, 0, 0])

  // Actions
  async function connectToServer() {
    try {
      console.log('Connecting to game server via Laravel Reverb...')

      // Join the public game channel
      const gameChannel = echo.channel('game-public')

      gameChannel.listen('.game.player-moved', (data: any) => {
        console.log('Player moved:', data)
        handlePlayerMove(data)
      })

      gameChannel.listen('.game.player-joined', (data: any) => {
        console.log('Player joined:', data)
        handlePlayerJoin(data)
      })

      gameChannel.listen('.game.player-left', (data: any) => {
        console.log('Player left:', data)
        handlePlayerLeave(data)
      })

      // Set connection status after a brief delay to allow Echo to initialize
      setTimeout(() => {
        isConnected.value = true
        console.log('Connected to game server via Reverb')
      }, 1000)
    } catch (error) {
      console.error('Failed to connect to server:', error)
      isConnected.value = false
    }
  }

  function handleServerMessage(data: any) {
    switch (data.type) {
      case 'player_update':
        updatePlayer(data.player)
        break
      case 'terrain_modification':
        addTerrainModification(data.modification)
        break
      case 'spell_effect':
        addSpellEffect(data.effect)
        break
      case 'players_list':
        players.value = data.players
        break
    }
  }

  async function loadMap(mapName: string) {
    isLoading.value = true
    try {
      // Mock map data for development - in real app this would come from Laravel API
      if (mapName === 'tutorial_island') {
        const mockMapData: WorldMap = {
          name: 'tutorial_island',
          displayName: 'Tutorial Island',
          width: 20,
          height: 20,
          tiles: generateMockTiles(20, 20),
          spawnPoints: [{ x: 10, y: 10, z: 0, type: 'default' }],
        }
        currentMap.value = mockMapData
      } else {
        // Fetch map data from Laravel API (when backend is ready)
        const response = await fetch(`http://localhost:8000/api/maps/${mapName}`)
        const mapData = await response.json()
        currentMap.value = mapData
      }

      // Load terrain modifications for this map
      await loadTerrainModifications(mapName)
    } catch (error) {
      console.error('Failed to load map:', error)
      // Fallback to mock data
      currentMap.value = {
        name: mapName,
        displayName: 'Default Map',
        width: 10,
        height: 10,
        tiles: generateMockTiles(10, 10),
        spawnPoints: [{ x: 5, y: 5, z: 0, type: 'default' }],
      }
    } finally {
      isLoading.value = false
    }
  }

  async function loadTerrainModifications(mapName: string) {
    try {
      const response = await fetch(`http://localhost:8000/api/terrain-modifications/${mapName}`)
      const modifications = await response.json()
      terrainModifications.value = modifications
    } catch (error) {
      console.error('Failed to load terrain modifications:', error)
    }
  }

  async function castSpell(spellId: number, targetPosition: Position3D) {
    if (!currentPlayer.value) return

    try {
      const response = await fetch('http://localhost:8000/api/cast-spell', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          character_id: currentPlayer.value.id,
          spell_id: spellId,
          target_x: targetPosition[0],
          target_y: targetPosition[1],
          target_z: targetPosition[2],
        }),
      })

      const result = await response.json()

      if (result.success) {
        // Add spell effect immediately for responsiveness
        addSpellEffect({
          id: `temp_${Date.now()}`,
          spellId,
          position: targetPosition,
          duration: 3000, // 3 seconds default
          startTime: new Date(),
        })
      }
    } catch (error) {
      console.error('Failed to cast spell:', error)
    }
  }

  function updatePlayer(playerData: Player) {
    const index = players.value.findIndex((p) => p.id === playerData.id)
    if (index >= 0) {
      players.value[index] = playerData
    } else {
      players.value.push(playerData)
    }

    if (currentPlayer.value && currentPlayer.value.id === playerData.id) {
      currentPlayer.value = playerData
    }
  }

  function addTerrainModification(modification: TerrainModification) {
    terrainModifications.value.push(modification)
  }

  function addSpellEffect(effect: SpellEffect) {
    activeSpellEffects.value.push(effect)

    // Remove effect after duration
    setTimeout(() => {
      const index = activeSpellEffects.value.findIndex((e) => e.id === effect.id)
      if (index >= 0) {
        activeSpellEffects.value.splice(index, 1)
      }
    }, effect.duration)
  }

  function movePlayer(position: Position3D) {
    if (!currentPlayer.value) return

    // Send movement to server
    if (websocket && websocket.readyState === WebSocket.OPEN) {
      websocket.send(
        JSON.stringify({
          type: 'player_move',
          character_id: currentPlayer.value.id,
          x: position.x,
          y: position.y,
          z: position.z,
        })
      )
    }

    console.log('Moving player to:', position)

    // Update local position immediately for responsiveness
    currentPlayer.value.position = [position.x, position.y, position.z]
  }

  function createMockPlayer(): Player {
    return {
      id: 1,
      name: 'TestPlayer',
      position: [10, 10, 0] as Position3D,
      level: 5,
      health: 85,
      maxHealth: 100,
      mana: 45,
      maxMana: 60,
      isOnline: true,
    }
  }

  function setMockPlayer() {
    currentPlayer.value = createMockPlayer()
    updatePlayer(currentPlayer.value)
    console.log('Mock player created:', currentPlayer.value)
  }

  function generateMockTiles(width: number, height: number): WorldTile[] {
    const tiles: WorldTile[] = []

    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        // Create varied terrain
        let texture = 'grass'
        let height = 0
        let walkable = true

        // Create some water around the edges
        if (x === 0 || y === 0 || x === width - 1 || y === height - 1) {
          texture = 'water'
          height = -0.5
          walkable = false
        }
        // Create some stone areas
        else if ((x + y) % 7 === 0) {
          texture = 'stone'
          height = 0.2
        }
        // Create some dirt patches
        else if ((x * y) % 11 === 0) {
          texture = 'dirt'
          height = -0.1
        }
        // Add some height variation
        else if ((x + y) % 5 === 0) {
          height = Math.random() * 0.3
        }

        tiles.push({
          x,
          y,
          z: height,
          height,
          texture,
          walkable,
          objects: [],
        })
      }
    }

    return tiles
  }

  function handlePlayerMove(data: any) {
    // Handle player movement updates
    const player = players.value.find((p) => p.id === data.playerId)
    if (player) {
      player.position = data.position
    }
  }

  function handlePlayerJoin(data: any) {
    // Handle new player joining
    const existingPlayer = players.value.find((p) => p.id === data.player.id)
    if (!existingPlayer) {
      players.value.push(data.player)
    }
  }

  function handlePlayerLeave(data: any) {
    // Handle player leaving
    const index = players.value.findIndex((p) => p.id === data.playerId)
    if (index !== -1) {
      players.value.splice(index, 1)
    }
  }

  return {
    // State
    currentPlayer,
    players,
    currentMap,
    terrainModifications,
    activeSpellEffects,
    availableSpells,
    isConnected,
    isLoading,

    // Computed
    isPlayerOnline,
    playerPosition,

    // Actions
    connectToServer,
    loadMap,
    castSpell,
    movePlayer,
    updatePlayer,
    addTerrainModification,
    addSpellEffect,
    createMockPlayer,
    setMockPlayer,
  }
})
