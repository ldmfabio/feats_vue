# Adicionando Ícones com Material Design Icons

Este documento descreve as etapas para instalar a biblioteca de ícones Material Design Icons (MDI), criar um componente de botão reutilizável que usa um ícone e incluí-lo nos cards do catálogo.

São necessárias quatro alterações: instalação da biblioteca, registro do CSS no `main.js`, criação do `ButtonChild.vue` e importação dele no `ProdutoCard.vue`.

---

## Etapa 17 — Instalação da biblioteca MDI

No terminal, dentro da pasta do projeto, execute:

```bash
npm i mdi
```

O pacote `mdi` contém os arquivos CSS e as fontes da biblioteca Material Design Icons. Após a instalação, os arquivos ficam disponíveis em `node_modules/mdi/`.

---

## Etapa 18 — Registro do CSS no `main.js`

Para que os ícones funcionem em qualquer componente da aplicação, o CSS da biblioteca precisa ser importado uma única vez, globalmente. O lugar correto é o `src/main.js`:

```js
import './assets/main.css'
import 'mdi/css/materialdesignicons.min.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(router)

app.mount('#app')
```

A linha adicionada é:

```js
import 'mdi/css/materialdesignicons.min.css'
```

Importar o CSS aqui garante que os estilos dos ícones estejam disponíveis em toda a aplicação, sem precisar repetir o import em cada componente que usar um ícone.

### Como o MDI funciona

Diferente de componentes Vue, os ícones MDI são usados como classes CSS em uma tag `<i>`. A estrutura é sempre:

```html
<i class="mdi mdi-NOME-DO-ICONE"></i>
```

- `mdi` — classe base obrigatória, carrega a fonte de ícones
- `mdi-NOME-DO-ICONE` — classe do ícone específico

Para descobrir o nome de um ícone, consulte [materialdesignicons.com](https://materialdesignicons.com). O ícone de carrinho de compras, por exemplo, se chama `mdi-cart`.

---

## Etapa 19 — Criação do `ButtonChild.vue`

O arquivo `src/components/ButtonChild.vue` é um componente de botão genérico e reutilizável. Ele emite um evento ao ser clicado e usa um `<slot>` para permitir que o conteúdo interno seja personalizado por quem o utiliza:

```vue
<script setup>
defineEmits(['clique'])
</script>

<template>
  <button @click.prevent="$emit('clique')" class="btn">
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
```

### `defineEmits`

```js
defineEmits(['clique'])
```

`defineEmits` declara os eventos que este componente pode emitir. Aqui, o único evento é `'clique'`. Declarar os emits é uma boa prática — o Vue usa essa lista para documentação e para emitir avisos no console caso um evento não declarado seja emitido.

### `@click.prevent` e `$emit`

```html
<button @click.prevent="$emit('clique')"></button>
```

- `@click` — ouve o evento de clique nativo do botão
- `.prevent` — chama `event.preventDefault()` automaticamente, evitando comportamentos padrão indesejados (como o envio de um formulário caso o botão esteja dentro de um `<form>`)
- `$emit('clique')` — dispara o evento `'clique'` para o componente pai, que pode escutá-lo com `@clique="..."`

### O `<slot>` com conteúdo padrão

```html
<slot>
  <i class="mdi mdi-cart"></i>
</slot>
```

O `<slot>` é o mecanismo do Vue para passar conteúdo de fora para dentro de um componente. O conteúdo colocado entre as tags `<slot>` é o **conteúdo padrão**: ele é exibido quando quem usa o componente não passa nada entre as tags `<ButtonChild>`.

Neste caso, o padrão é o ícone de carrinho `mdi-cart`. Se o componente pai passar algo, o ícone é substituído pelo conteúdo passado.

---

## Etapa 20 — Atualização do `ProdutoCard.vue`

Com o `ButtonChild` criado, ele é importado e usado dentro do card de cada produto:

```vue
<script setup>
import ButtonChild from '@/components/ButtonChild.vue'
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
    <p>
      <ButtonChild @clique="() => alert('Botão clicado!')"> </ButtonChild>
    </p>
  </div>
</template>
```

### O import do `ButtonChild`

```js
import ButtonChild from '@/components/ButtonChild.vue'
```

O import segue o mesmo padrão dos demais componentes — o alias `@` aponta para `src/`, então o caminho `@/components/ButtonChild.vue` localiza o arquivo independentemente de onde o componente importador esteja.

### O uso de `@clique`

```html
<ButtonChild @clique="() => alert('Botão clicado!')"> </ButtonChild>
```

`@clique` escuta o evento `'clique'` emitido pelo `ButtonChild`. O `@` é a forma abreviada de `v-on:`. O handler `() => alert('Botão clicado!')` é uma função anônima que executa o `alert` quando o evento chega.

Como nenhum conteúdo é passado entre as tags `<ButtonChild>`, o `<slot>` usará o conteúdo padrão definido no componente — o ícone `mdi-cart`.
