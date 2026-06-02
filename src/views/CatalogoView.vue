<script setup>
import ProdutoCard from '@/components/ProdutoCard.vue'
import produtos from '@/utils/produtos';
</script>

<template>
  <div class="catalogo">
    <ProdutoCard
      v-for="produto in produtos"
      :key="produto.id"
      :produto="produto"
    />
  </div>
</template>

<style scoped>
.catalogo {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}
</style>
