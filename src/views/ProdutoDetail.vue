<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import produtos from '@/utils/produtos'

const route = useRoute()

const produto = computed(() => {
  return produtos.find((p) => p.id === Number(route.params.id))
})
</script>

<template>
  <div v-if="produto" class="detalhe">
    <a href="/catalogo">Voltar</a>
    <img :src="produto.imagem" :alt="produto.nome" class="detalhe-imagem" />
    <h1>{{ produto.nome }}</h1>
    <p>{{ produto.categoria }}</p>
    <strong>R$ {{ produto.preco.toFixed(2) }}</strong>
  </div>

  <p v-else>Produto não encontrado.</p>
</template>

<style scoped>
.detalhe {
  max-width: 400px;
  text-align: center;
}

.detalhe-imagem {
  width: 100%;
  height: 300px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 16px;
}

h1 {
  margin-bottom: 8px;
}

p {
  margin-bottom: 8px;
  color: #666;
}
</style>
