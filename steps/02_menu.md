# Adicionando Navegação ao Catálogo de Produtos

Este documento descreve as etapas para adicionar um menu de navegação à aplicação, incluindo a criação do componente `AppHeader`, uma página inicial (`HomeView`) e a atualização do roteador para suportar múltiplas rotas.

---

## Etapa 7 — Criação do componente `AppHeader.vue`

O componente de cabeçalho fica em `src/components/layout/AppHeader.vue`. A pasta `layout/` é criada dentro de `components/` para organizar os componentes estruturais da aplicação separadamente dos componentes de conteúdo (como o `ProdutoCard`).

O `AppHeader` é responsável por exibir a barra de navegação fixa no topo da página:

```vue
<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <header>
    <nav>
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/catalogo">Catálogo</RouterLink>
    </nav>
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
</style>
```

### O uso de `RouterLink`

O `RouterLink` é o componente do Vue Router equivalente à tag `<a>` do HTML, mas com uma diferença fundamental: ao invés de recarregar a página, ele navega entre as rotas da aplicação sem perder o estado do Vue. O atributo `to` recebe o caminho da rota de destino.

Além disso, o Vue Router adiciona automaticamente a classe `router-link-active` ao link cuja rota corresponde à URL atual. Por isso, o estilo `.router-link-active { font-weight: bold }` é suficiente para destacar visualmente qual página está ativa — sem nenhuma lógica JavaScript adicional.

### A estilização do cabeçalho

Algumas propriedades CSS merecem atenção:

| Propriedade              | Valor   | Por quê                                                                             |
| ------------------------ | ------- | ----------------------------------------------------------------------------------- |
| `position`               | `fixed` | Mantém o cabeçalho visível mesmo ao rolar a página                                  |
| `top: 0; left: 0`        | —       | Ancora o cabeçalho no canto superior esquerdo                                       |
| `width: 100%`            | —       | Garante que o cabeçalho ocupe toda a largura da tela                                |
| `z-index: 100`           | —       | Faz o cabeçalho ficar sobre os demais elementos da página                           |
| `box-sizing: border-box` | —       | Inclui o `padding` no cálculo da `width`, evitando que o cabeçalho extrapole a tela |

---

## Etapa 8 — Atualização do `App.vue`

Com o `AppHeader` criado, é necessário incluí-lo no `App.vue` para que ele apareça em todas as páginas da aplicação. Além disso, o `<RouterView />` é envolto em uma tag `<main>` para que seja possível aplicar espaçamento e evitar que o conteúdo fique escondido atrás do cabeçalho fixo:

```vue
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
```

O `padding-top` de `80px` no `<main>` é essencial. Como o `AppHeader` usa `position: fixed`, ele é removido do fluxo normal do documento — sem esse espaçamento, o topo do conteúdo ficaria coberto pelo cabeçalho. O valor de `80px` é suficiente para compensar a altura do cabeçalho fixo (que tem `padding: 16px` acima e abaixo do texto de navegação).

---

## Etapa 9 — Criação da `HomeView.vue`

Com a navegação em funcionamento, a rota `/` precisa de uma página própria. O arquivo `src/views/HomeView.vue` é criado para servir como página inicial da aplicação:

```vue
<script setup></script>

<template>
  <section>
    <h1>Catálogo de Produtos</h1>

    <p>Bem-vindo ao catálogo de produtos.</p>

    <p>
      Use o menu superior para visualizar os produtos por categoria: alimentos, brinquedos e
      higiene.
    </p>
  </section>
</template>

<style scoped>
section {
  padding: 24px;
}

h1 {
  margin-bottom: 16px;
}
</style>
```

Esta view é intencionalmente simples — seu papel é apenas orientar o usuário sobre o propósito da aplicação e indicar como navegar até o catálogo. O `<script setup>` está presente mas vazio, pois não há lógica nem imports necessários para esta página.

---

## Etapa 10 — Atualização do Vue Router

Com duas views disponíveis (`HomeView` e `CatalogoView`), o roteador em `src/router/index.js` precisa ser atualizado para registrar as duas rotas:

```js
import { createRouter, createWebHistory } from 'vue-router'
import CatalogoView from '@/views/CatalogoView.vue'
import HomeView from '@/views/HomeView.vue'

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
  ],
})

export default router
```

Em relação à configuração anterior (documentada na Etapa 3), as mudanças foram:

- A rota `/` foi redirecionada de `CatalogoView` para `HomeView`, pois agora a home tem conteúdo próprio.
- Uma nova rota `/catalogo` foi adicionada, apontando para `CatalogoView`.
- O import de `HomeView` foi incluído no topo do arquivo.

Cada rota possui três propriedades:

| Propriedade | Descrição                                                            |
| ----------- | -------------------------------------------------------------------- |
| `path`      | O caminho na URL que ativa esta rota                                 |
| `name`      | Um identificador único para a rota, útil para navegação programática |
| `component` | O componente Vue que será renderizado quando a rota estiver ativa    |

O `name` da rota permite usar `<RouterLink :to="{ name: 'catalogo' }">` no lugar de `<RouterLink to="/catalogo">`, o que torna o código mais robusto a mudanças de path no futuro.
