<script setup>
import { RouterView } from 'vue-router'
import AppHeader from '@/components/layout/AppHeader.vue'
</script>

<template>
  <AppHeader />
  <main>
    <RouterView />
  </main>
</template>

<style scoped>
main {
  padding: 80px 24px 24px;
}
</style>
