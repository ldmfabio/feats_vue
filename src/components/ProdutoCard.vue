<script setup>
import { RouterLink } from 'vue-router'
defineProps({
  produto: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <div class="produto-card">
    <img :src="produto.imagem" :alt="produto.nome" class="produto-imagem">

    <h3>
      <RouterLink :to="{ name: 'produto', params: { id: produto.id } }">
        {{ produto.nome }}
      </RouterLink>
    </h3>

    <p>{{ produto.categoria }}</p>

    <strong>
      R$ {{ produto.preco.toFixed(2) }}
    </strong>
  </div>
</template>

<style scoped>
.produto-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 16px;
  text-align: center;
}

.produto-imagem {
  width: 100%;
  height: 200px;
  object-fit: cover;
}
</style>
