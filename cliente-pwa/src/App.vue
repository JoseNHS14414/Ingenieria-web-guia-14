<script setup>
import { ref, onMounted } from 'vue'
import { Network } from '@capacitor/network'
import { Camera, CameraResultType } from '@capacitor/camera'
import Pedidos from './Pedidos.vue'

const API = import.meta.env.VITE_API_URL
const items = ref([])
const estado = ref('Cargando…')
const actualizado = ref(null)
const enLinea = ref(true)
const foto = ref(null)

async function cargar() {
  try {
    const res = await fetch(`${API}/productos`)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const json = await res.json()
    items.value = json.data ?? json
    actualizado.value = new Date().toLocaleString()
    estado.value = ''
  } catch (e) {
    estado.value = 'No se pudo conectar con la API'
  }
}

onMounted(async () => {
  cargar()
  enLinea.value = (await Network.getStatus()).connected
  Network.addListener('networkStatusChange', (s) => {
    enLinea.value = s.connected
  })
})

async function tomarFoto() {
  const img = await Camera.getPhoto({ resultType: CameraResultType.Uri, quality: 80 })
  foto.value = img.webPath
}
</script>

<template>
  <main>
    <h1>Mi app</h1>
    <p v-if="!enLinea" style="color: red;">Sin conexión. Se muestran los últimos datos guardados.</p>
    <button @click="tomarFoto">Tomar foto</button>
    <div v-if="foto">
      <img :src="foto" width="240" alt="Foto tomada" />
    </div>
    <p v-if="estado">{{ estado }}</p>
    <ul>
      <li v-for="item in items" :key="item.id">{{ item.nombre }}</li>
    </ul>
    <small v-if="actualizado">Actualizado: {{ actualizado }}</small>

    <hr style="margin: 20px 0;" />
    <h2>Módulo de Pedidos</h2>
    <Pedidos />
  </main>
</template>