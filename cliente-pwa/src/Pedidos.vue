<script setup>
import { ref } from 'vue'
const API = import.meta.env.VITE_API_URL
const email = ref('ana@test.pe')
const password = ref('secreto123')
const pedidos = ref([])

async function entrar() {
  const res = await fetch(`${API}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ email: email.value, password: password.value })
  })
  const json = await res.json()
  if (json.token) {
    sessionStorage.setItem('token', json.token)
    await cargar()
  }
}

async function cargar() {
  const token = sessionStorage.getItem('token')
  if (!token) return
  const res = await fetch(`${API}/pedidos`, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    }
  })
  if (res.ok) {
    pedidos.value = await res.json()
  }
}

async function salir() {
  const token = sessionStorage.getItem('token')
  if (token) {
    try {
      await fetch(`${API}/logout`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`
        }
      })
    } catch (e) {
      console.error('Error al revocar token:', e)
    }
  }
  sessionStorage.removeItem('token')
  pedidos.value = []
  if ('caches' in window) {
    await caches.delete('api-cache')
  }
}
</script>

<template>
  <section>
    <input v-model="email" /> <input v-model="password" type="password" />
    <button @click="entrar">Entrar</button> <button @click="salir">Salir</button>
    <ul>
      <li v-for="p in pedidos" :key="p.id">{{ p.descripcion }}</li>
    </ul>
  </section>
</template>
