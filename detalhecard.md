# Adicionando a Página de Detalhe do Produto

Este documento descreve as etapas para implementar uma página de detalhe para cada produto. Ao clicar no nome do produto em um card do catálogo, o usuário é redirecionado para uma nova URL — `/produto/1`, por exemplo — onde os dados do produto são exibidos de forma detalhada.

São necessárias três alterações: uma nova rota no roteador (`index.js`), a transformação do nome do produto em link clicável no `ProdutoCard`, e a criação da view `ProdutoDetail`.

---

## Etapa 13 — Atualização do Vue Router

A primeira coisa a fazer é registrar a nova rota no arquivo `src/router/index.js`. Sem isso, qualquer URL como `/produto/1` resultaria em uma página em branco.

```js
import { createRouter, createWebHistory } from 'vue-router'
import CatalogoView from '@/views/CatalogoView.vue'
import HomeView from '@/views/HomeView.vue'
import ProdutoDetail from '@/views/ProdutoDetail.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/catalogo',
      name: 'catalogo',
      component: CatalogoView,
    },
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/produto/:id',
      name: 'produto',
      component: ProdutoDetail,
    },
  ],
})

export default router
```

Duas adições em relação à configuração anterior:

- O import de `ProdutoDetail` foi incluído no topo do arquivo.
- Uma nova rota com `path: '/produto/:id'` foi adicionada ao array de rotas.

### O parâmetro dinâmico `:id`

O trecho `:id` no path é um **parâmetro dinâmico**. Ele funciona como um "coringa": qualquer valor colocado nessa posição da URL é capturado e fica disponível dentro do componente. Assim, tanto `/produto/1` quanto `/produto/5` ou `/produto/99` são atendidas pela mesma rota — o que muda é apenas o valor de `id`.

Dentro do componente, esse valor é acessado via `route.params.id`. O `name: 'produto'` permite referenciar a rota pelo nome ao criar links.

---

## Etapa 14 — Atualização do `ProdutoCard.vue`

Com a rota criada, o próximo passo é transformar o nome do produto em um link clicável. A alteração acontece em `src/components/ProdutoCard.vue`:

```vue
<script setup>
import { RouterLink } from 'vue-router'

defineProps({
  produto: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <div class="produto-card">
    <img :src="produto.imagem" :alt="produto.nome" class="produto-imagem" />

    <h3>
      <RouterLink :to="{ name: 'produto', params: { id: produto.id } }">
        {{ produto.nome }}
      </RouterLink>
    </h3>

    <p>{{ produto.categoria }}</p>

    <strong> R$ {{ produto.preco.toFixed(2) }} </strong>
  </div>
</template>
```

### O import de `RouterLink`

O `RouterLink` precisa ser importado explicitamente no `<script setup>` para poder ser usado no template. Sem o import, o Vue não reconheceria a tag `<RouterLink>` e emitiria um aviso no console.

### O atributo `:to` com objeto

```html
<RouterLink :to="{ name: 'produto', params: { id: produto.id } }"></RouterLink>
```

O `:to` aceita tanto uma string (`to="/produto/1"`) quanto um objeto. A forma com objeto é mais recomendada por dois motivos:

- **`name: 'produto'`** — referencia a rota pelo nome definido no router. Se o path mudar de `/produto/:id` para, por exemplo, `/produtos/:id`, o link continuará funcionando sem precisar de alteração aqui.
- **`params: { id: produto.id }`** — passa o valor do parâmetro dinâmico. O Vue Router substitui `:id` pelo valor de `produto.id` ao montar a URL final.

A tag `<RouterLink>` envolve o texto `{{ produto.nome }}` — o nome do produto se torna o texto clicável do link.

O `<RouterLink>` fará, portanto, o papel da tag `<a>` tradicional, mas com a vantagem de integrar-se perfeitamente ao sistema de rotas do Vue, evitando recarregamentos desnecessários da página.

---

## Etapa 15 — Criação do `ProdutoDetail.vue`

O arquivo `src/views/ProdutoDetail.vue` é a view que exibe os detalhes do produto. Ela lê o `id` da URL, encontra o produto correspondente no array e renderiza as informações:

```vue
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
```

### Os imports

| Import     | De onde            | Para que serve                                                |
| ---------- | ------------------ | ------------------------------------------------------------- |
| `computed` | `vue`              | Cria `produto` como um valor derivado reativo                 |
| `useRoute` | `vue-router`       | Dá acesso aos parâmetros da URL atual                         |
| `produtos` | `@/utils/produtos` | Array com todos os produtos — a "fonte de dados" da aplicação |

### Encontrando o produto pelo `id` da URL

```js
const produto = computed(() => {
  return produtos.find((p) => p.id === Number(route.params.id))
})
```

`route.params.id` retorna **sempre uma string** — afinal, o que está na URL é texto. Por isso, antes de comparar com o `id` do produto (que é um número no array), é necessário converter com `Number()`. Sem essa conversão, a comparação `'1' === 1` retornaria `false` e nenhum produto seria encontrado, mesmo com um id válido na URL.

O método `find()` percorre o array e retorna o **primeiro objeto** cujo `id` corresponda ao valor buscado. Se nenhum item for encontrado, retorna `undefined`.

O uso de `computed` garante que, se o `id` da URL mudar (por exemplo, ao navegar de `/produto/1` para `/produto/2`), o `produto` seja recalculado automaticamente.

### A renderização condicional com `v-if` e `v-else`

```html
<div v-if="produto" class="detalhe">...</div>

<p v-else>Produto não encontrado.</p>
```

Como `computed` pode retornar `undefined` (quando o `id` não existe no array), é necessário proteger o template. O `v-if="produto"` renderiza o bloco de detalhes apenas quando o produto foi encontrado. O `v-else` é o fallback — exibido quando a URL contém um `id` inválido, como `/produto/999`.

Sem essa proteção, tentar acessar `produto.nome` com `produto` sendo `undefined` causaria um erro em tempo de execução.

### O link "Voltar"

```html
<a href="/catalogo">Voltar</a>
```

Um link simples para retornar à listagem. Neste contexto, uma tag `<a>` convencional é suficiente — o uso de `RouterLink` seria igualmente válido, mas, como o destino é fixo e não depende de parâmetros, qualquer uma das duas opções funciona.
