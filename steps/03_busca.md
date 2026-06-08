# Adicionando Busca por Nome ao Catálogo de Produtos

Este documento descreve as etapas para implementar um campo de busca por nome de produto. O input fica no `AppHeader` e é visível em todas as páginas. Ao digitar, a URL é atualizada com um query param (`?q=termo`) e o catálogo filtra os produtos automaticamente — sem comunicação direta entre componentes.

---

## Etapa 11 — Atualização do `AppHeader.vue`

A lógica de busca é adicionada ao `AppHeader.vue`. A ideia central é que **a URL seja a fonte de verdade**: o input apenas lê e escreve na URL, e o catálogo apenas lê a URL para filtrar. Isso evita qualquer relação direta entre os dois componentes.

```vue
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
  },
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
```

### Os novos imports

Além do `RouterLink` já existente, três novos itens são importados:

| Import      | De onde      | Para que serve                                                |
| ----------- | ------------ | ------------------------------------------------------------- |
| `ref`       | `vue`        | Cria a variável reativa `busca` que controla o valor do input |
| `watch`     | `vue`        | Observa mudanças e dispara efeitos colaterais                 |
| `useRoute`  | `vue-router` | Dá acesso à rota atual, incluindo os query params da URL      |
| `useRouter` | `vue-router` | Dá acesso ao roteador para navegar programaticamente          |

### A variável reativa `busca`

```js
const busca = ref(route.query.q ?? '')
```

A variável `busca` é inicializada com o valor de `route.query.q` — ou uma string vazia caso o query param não exista. Isso garante que, ao acessar diretamente `/catalogo?q=ração` no browser, o input já apareça preenchido e a lista já esteja filtrada, sem nenhuma interação do usuário.

O operador `??` (nullish coalescing) retorna o valor da direita apenas quando o da esquerda é `null` ou `undefined` — diferente do `||`, que também substituiria uma string vazia `''`.

### O primeiro `watch` — atualizar a URL ao digitar

```js
watch(busca, (valor) => {
  router.push({
    path: '/catalogo',
    query: valor ? { q: valor } : {},
  })
})
```

Sempre que o usuário digitar no input, o `watch` detecta a mudança em `busca` e chama `router.push()` para atualizar a URL. Dois comportamentos importantes:

- Se `valor` não estiver vazio, a URL se torna `/catalogo?q=valor` e, se o usuário estiver em outra página, a navegação para o catálogo acontece automaticamente.
- Se `valor` estiver vazio (o usuário apagou tudo), o `query` enviado é um objeto vazio `{}`, o que resulta em uma URL limpa `/catalogo` — sem o `?q=` desnecessário.

### O segundo `watch` — sincronizar o input com a URL

```js
watch(
  () => route.query.q,
  (valor) => {
    busca.value = valor ?? ''
  },
)
```

Este segundo `watch` observa `route.query.q` — não `busca`. Ele é necessário para o caso em que a URL muda por um fator externo ao input: por exemplo, quando o usuário clica nos botões de voltar ou avançar do browser. Sem este watch, o input poderia mostrar um valor diferente da URL. A função `() => route.query.q` é usada como getter (ao invés de passar `route.query.q` diretamente) para que o `watch` seja reativo a mudanças aninhadas no objeto `route`.

### O input no template

```html
<input v-model="busca" type="search" placeholder="Buscar produto..." class="busca" />
```

O `v-model="busca"` cria uma ligação bidirecional entre o campo de texto e a variável `busca`. O `type="search"` é semanticamente mais correto para campos de busca e, na maioria dos browsers, exibe um botão `✕` para limpar o campo rapidamente.

### A estilização do cabeçalho

Para acomodar o input ao lado do `<nav>`, o `header` recebeu três novas propriedades:

```css
header {
  display: flex;
  align-items: center;
  gap: 24px;
}
```

`display: flex` alinha o `<nav>` e o `<input>` horizontalmente. `align-items: center` garante que ambos fiquem centralizados verticalmente. `gap: 24px` define o espaçamento entre eles.

---

## Etapa 12 — Atualização da `CatalogoView.vue`

O catálogo precisa ler o query param da URL e filtrar os produtos de acordo. Como o filtro deve ser recalculado sempre que a URL mudar, a solução ideal é um `computed`:

```vue
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
```

### Os novos imports

| Import     | De onde      | Por que foi adicionado                                       |
| ---------- | ------------ | ------------------------------------------------------------ |
| `computed` | `vue`        | Cria `produtosFiltrados` como um valor derivado reativo      |
| `useRoute` | `vue-router` | Dá acesso a `route.query.q` para ler o termo de busca da URL |

### O `computed` `produtosFiltrados`

```js
const produtosFiltrados = computed(() => {
  const q = (route.query.q ?? '').toLowerCase()
  if (!q) return produtos
  return produtos.filter((p) => p.nome.toLowerCase().includes(q))
})
```

Três decisões de implementação merecem atenção:

**1. Por que `computed` e não `ref` com `watch`?**

Um `computed` é um valor _derivado_ — ele é calculado automaticamente a partir de outras reatividades (`route.query.q` e `produtos`). Sempre que `route.query.q` mudar, o Vue recalcula `produtosFiltrados` automaticamente. Com `ref` + `watch`, seria necessário atualizar manualmente um segundo array, o que é mais verboso e propenso a erros de sincronização.

**2. A busca é insensível a maiúsculas e minúsculas**

Tanto o termo digitado (`q`) quanto o nome do produto (`p.nome`) são convertidos para letras minúsculas com `.toLowerCase()` antes da comparação. Isso garante que "Ração", "ração" e "RAÇÃO" retornem o mesmo resultado.

**3. Atalho para lista completa quando o input está vazio**

```js
if (!q) return produtos
```

Se o query param estiver ausente ou vazio, o array completo é retornado diretamente, sem executar o `filter`. Isso é mais eficiente do que filtrar com uma string vazia, que retornaria todos os itens de qualquer forma.

### A alteração no `v-for`

A única mudança no template foi substituir `produtos` por `produtosFiltrados`:

```html
<!-- antes -->
v-for="produto in produtos"

<!-- depois -->
v-for="produto in produtosFiltrados"
```

O comportamento do `v-for` permanece idêntico — a diferença é que agora ele itera sobre a lista filtrada em vez da lista completa.
