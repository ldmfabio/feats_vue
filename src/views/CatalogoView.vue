<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import ProdutoCard from '@/components/ProdutoCard.vue'
import produtos from '@/utils/produtos'

const route = useRoute()

const produtosFiltrados = computed(() => {
  const q = (route.query.q ?? '').toLowerCase()
  if (!q) return produtos
  return produtos.filter((p) => p.nome.toLowerCase().includes(q))
})
</script>

<template>
  <div class="catalogo">
    <ProdutoCard v-for="produto in produtosFiltrados" :key="produto.id" :produto="produto" />
  </div>
</template>

<style scoped>
.catalogo {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}
</style>
