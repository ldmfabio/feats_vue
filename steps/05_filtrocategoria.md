# Adicionando Filtro por Categoria ao Catálogo de Produtos

Este documento descreve as etapas para implementar um filtro de categoria na `CatalogoView`. O usuário seleciona uma categoria em um `<select>` e a listagem de produtos é atualizada automaticamente — em combinação com o filtro de busca por nome já existente.

Toda a alteração acontece em um único arquivo: `src/views/CatalogoView.vue`.

---

## Etapa 16 — Atualização da `CatalogoView.vue`

```vue
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
```

### Extraindo as categorias únicas do array

```js
const categorias = [...new Set(produtos.map((p) => p.categoria))].sort()
```

Esta linha extrai automaticamente as categorias disponíveis a partir dos próprios dados — sem precisar defini-las manualmente. O raciocínio é:

1. `produtos.map((p) => p.categoria)` — percorre o array e retorna apenas os valores da propriedade `categoria`: `['Acessórios', 'Alimentos', 'Brinquedos', 'Higiene', ...]`
2. `new Set(...)` — um `Set` é uma estrutura de dados que aceita apenas valores únicos; os duplicados são removidos automaticamente
3. `[...Set]` — o operador spread converte o `Set` de volta para um array
4. `.sort()` — ordena as categorias em ordem alfabética

O resultado é um array como `['Acessórios', 'Alimentos', 'Brinquedos', 'Higiene']`, atualizado automaticamente caso novos produtos com novas categorias sejam adicionados ao arquivo `produtos.js`.

### A variável reativa `categoria`

```js
const categoria = ref('')
```

`categoria` armazena a opção selecionada no `<select>`. Inicializa com `''` (string vazia), que representa "Todas as categorias" — o estado padrão em que nenhum filtro de categoria está ativo.

> É importante inicializar com `''` e não com o array `categorias`. Inicializar com o array faria com que o `<select>` não correspondesse a nenhuma opção e o filtro nunca funcionasse.

### O `<select>` no template

```html
<select v-model="categoria">
  <option value="">Todas as categorias</option>
  <option v-for="cat in categorias" :key="cat" :value="cat">{{ cat }}</option>
</select>
```

O `v-model="categoria"` cria uma ligação bidirecional entre o `<select>` e a variável `categoria`. Sempre que o usuário selecionar uma opção, `categoria.value` é atualizado automaticamente — e o `computed` `produtosFiltrados` é recalculado.

- A primeira `<option>` tem `value=""` fixo — ao ser selecionada, `categoria.value` volta a ser `''`, removendo o filtro de categoria
- As demais opções são geradas pelo `v-for` a partir do array `categorias`. O `:value="cat"` garante que ao selecionar "Alimentos", por exemplo, `categoria.value` receba exatamente a string `'Alimentos'`

### A lógica de filtragem no `computed`

```js
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
```

A estratégia é começar com o array completo e aplicar os filtros em sequência, um de cada vez:

**1. Array Completo - Sem filtros aplicados**

```js
let retorno = produtos
```

`retorno` começa com todos os produtos. A palavra-chave `let` é usada (em vez de `const`) porque a variável será reatribuída ao longo da função.

**2. Filtro de categoria**

```js
if (categoria.value) {
  retorno = retorno.filter((p) => p.categoria === categoria.value)
}
```

O `if (categoria.value)` só executa o filtro se uma categoria estiver selecionada — ou seja, se `categoria.value` não for uma string vazia. Quando o usuário escolhe "Todas as categorias", `categoria.value` é `''`, que é falso em JavaScript, e o bloco é pulado.

**3. Filtro de nome**

```js
const q = (route.query.q ?? '').toLowerCase()
if (q) {
  retorno = retorno.filter((p) => p.nome.toLowerCase().includes(q))
}
```

O filtro de busca por nome é aplicado sobre `retorno` — não sobre `produtos`. Isso garante que os dois filtros se combinem: se o usuário tiver selecionado "Alimentos" e digitado "ração", apenas os alimentos cujo nome contém "ração" serão exibidos.

**4. As quatro combinações possíveis**

| Categoria selecionada | Texto digitado | Resultado                                      |
| --------------------- | -------------- | ---------------------------------------------- |
| Nenhuma (`''`)        | Nenhum (`''`)  | Todos os produtos                              |
| Sim                   | Nenhum (`''`)  | Apenas produtos da categoria                   |
| Nenhuma (`''`)        | Sim            | Apenas produtos cujo nome contém o texto       |
| Sim                   | Sim            | Produtos da categoria cujo nome contém o texto |

> Imagino que vocês devem recordar um conteúdo de Programação I (há muito tempo atrás... lá de 2025). É a Tabela Verdade, que mostra todas as combinações possíveis de variáveis booleanas. Aqui, as variáveis são "Categoria selecionada" e "Texto digitado", e o resultado é a lista de produtos exibida.