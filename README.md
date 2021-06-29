# Gerenciador de devedores 💲

O objetivo desse projeto é o relacionamento de dívidas com clientes, cosumindo a API do [JSONPlaceholder](https://jsonplaceholder.typicode.com/) para obter informações dos clientes e outra API para gerenciamento das dívidas.

## 🌐 Acesso

https://gerenciamento-de-devedores.vercel.app

![Screenshot](https://user-images.githubusercontent.com/39037180/123813190-13f95480-d8cb-11eb-8c5c-c99ba281f6f0.png)

## 📝 Detalhes

Cada usuário é uma pessoa com dívidas, na qual iremos fazer o
cadastro no sistema.

### ▶️ Operações básicas

1. Adicionar nova dívida, informando qual cliente está relacionada a ela;
2. Obter detalhes de uma dívida;
3. Editar uma dívida;
4. Deletar uma dívida.
 
### 📱 Detalhes da tela

- Será mostrada uma lista lateral com os devedores (clientes com dívida), sendo possível clica nesse devedor e mostrar todas as dívídas dele.
- Cada dívida pode ser clicada e aparecerá detalhes dela no formulário para possível edição ou exclusão da mesma.
- A edição é feita modificando os dados presentes no formulário e clicando no botão "Salvar".
- A exclusão é feita clicando no botão "Excluir".
- É possível adicionar uma nova dívida a partir do formulário, preenchendo os determinados dados e clicando no botão "Criar".

## 🔨 Desenvolvimento

Aplicação frontend desenvolvida com o framework [ReactJS](https://pt-br.reactjs.org) com [Typescript](https://www.typescriptlang.org).

Usando também as bibliotecas 
- [React Icons](https://react-icons.github.io/react-icons/search) para uso de icones
- [Axios](https://axios-http.com) para fazer chamadas às APIs.

### 📁 Pastas

A organização da pasta "src" se deu usando um padrão de pastas que uso, onde
  - 📂 "src/components" ficam os componentes isolados utilizados na(s) página(s) da aplicação.
  - 📂 "src/pages" ficam as páginas principais da aplicação.
  - 📂 "src/styles" ficam folhas de estilização (css) padrões da aplicação como estilos e cores padrões.
  - 📂 "src/services" ficam arquivos para fazer a conexão com alguma api externa.

Cada página ou componente tem uma pasta com o seu nome, contendo 
  - 📎 um arquivo tsx, para renderização do componente;
  - 📎 um aquivo css, para estilização daquele componente.

### 🔷 Detalhes dos componentes

Componentes e página foram desenvolvidos usando o conceito de *functional components*, ou seja, os componentes renderizados são funções javascript.

## 📥 Acesso ao Backend

Para fazer as requisições ao backend é necessário ter um UUID.

**É necessário que o UUID esteja em uma variável local**

Seguindo o [exemplo](https://github.com/ricardorodriguespes17/gerenciamento-de-devedores/blob/master/.env.example).

## ⬇️ Instalação

Com o código clonado no computador, use o seguinte comando para instalar os pacotes 👇

```
npm install
```

Após o termino da instalação, use o seguinte comando para iniciar a aplicação localmente 👇

```
npm start
```

A aplicação rodará se possível em 🌐 http://localhost:3000.

## 🚀 Aprenda mais sobre React

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
