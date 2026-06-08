<script setup>
import { ref, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const busca = ref(route.query.q ?? '')

watch(busca, (valor) => {
  router.push({
    path: '/catalogo',
    query: valor ? { q: valor } : {},
  })
})

watch(
  () => route.query.q,
  (valor) => {
    busca.value = valor ?? ''
  }
)
</script>

<template>
  <header>
    <nav>
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/catalogo">Catálogo</RouterLink>
    </nav>
    <input v-model="busca" type="search" placeholder="Buscar produto..." class="busca" />
  </header>
</template>

<style scoped>
header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background: #f8f8f8;
  z-index: 100;
  padding: 16px;
  border-bottom: 1px solid #ddd;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  gap: 24px;
}

nav {
  display: flex;
  gap: 16px;
}

a {
  text-decoration: none;
  color: #333;
}

.router-link-active {
  font-weight: bold;
}

.busca {
  padding: 6px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  outline: none;
}

.busca:focus {
  border-color: #999;
}
</style>
