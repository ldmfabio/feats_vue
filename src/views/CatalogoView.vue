<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import ProdutoCard from '@/components/ProdutoCard.vue'
import produtos from '@/utils/produtos'

const route = useRoute()

const categorias = [...new Set(produtos.map((p) => p.categoria))].sort()
const categoria = ref('')

const produtosFiltrados = computed(() => {
  let retorno = produtos

  if (categoria.value) {
    retorno = retorno.filter((p) => p.categoria === categoria.value)
  }

  const q = (route.query.q ?? '').toLowerCase()
  if (q) {
    retorno = retorno.filter((p) => p.nome.toLowerCase().includes(q))
  }

  return retorno
})

</script>

<template>
  <select v-model="categoria">
    <option value="">Todas as categorias</option>
    <option v-for="cat in categorias" :key="cat" :value="cat">{{ cat }}</option>
  </select>
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
