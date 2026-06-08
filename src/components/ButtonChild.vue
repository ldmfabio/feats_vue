<script setup>
  defineEmits(['clique'])
</script>

<template>
  <button @click.prevent="$emit('clique')" class="'btn'">
    <slot>
      <i class="mdi mdi-cart"></i>
    </slot>
  </button>
</template>

<style scoped>
.btn {
  padding: 8px 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
