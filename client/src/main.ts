import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import { extend, TresCanvas } from '@tresjs/core'
import * as THREE from 'three'

import App from './App.vue'
import router from './router'

// Extend TresJS with all Three.js objects
extend(THREE)

const app = createApp(App)

app.use(createPinia())
app.use(router)

// PrimeVue
app.use(PrimeVue, { unstyled: true })

// Register TresCanvas globally
app.component('TresCanvas', TresCanvas)

app.mount('#app')
