import { createApp } from 'vue'
import App from './App.vue'
import { defineCustomElements } from '@ionic/pwa-elements/loader'

console.log(import.meta.env.VITE_PAGOS_KEY)

defineCustomElements(window)
createApp(App).mount('#app')
