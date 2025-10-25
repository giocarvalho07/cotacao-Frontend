# Frontend do Conversor de Moedas

Este é o projeto frontend para o Conversor de Moedas, desenvolvido em React. Ele permite aos usuários converter valores entre diversas moedas, visualizar cotações em tempo real e acompanhar o histórico de suas transações.

## Tecnologias Utilizadas

*   **React:** Biblioteca JavaScript para construção de interfaces de usuário.
*   **Materialize CSS:** Framework CSS responsivo baseado em Material Design para estilização.
*   **React Router DOM:** Para gerenciamento de rotas na aplicação de página única (SPA).
*   **JavaScript (ES6+):** Linguagem de programação principal.
*   **Fetch API:** Para realizar requisições HTTP ao backend.

## Arquitetura do Projeto

A arquitetura do projeto segue uma estrutura comum de aplicações React, organizada para facilitar a manutenção e escalabilidade:

```
cotacao-Frontend/
├── public/               # Arquivos estáticos (index.html, manifest.json, etc.)
├── src/
│   ├── components/       # Componentes reutilizáveis (Navbar, TransactionTable)
│   ├── pages/            # Componentes de página (Home, Converter)
│   ├── App.js            # Componente raiz da aplicação e configuração de rotas
│   ├── index.js          # Ponto de entrada da aplicação React
│   └── ...               # Outros arquivos (CSS, testes, etc.)
├── package.json          # Metadados do projeto e dependências
├── README.md             # Este arquivo
└── ...
```

### Componentes Principais:

*   **`App.js`**: O componente principal que define a estrutura da aplicação e configura as rotas usando `react-router-dom`.
*   **`pages/Home.js`**: A página inicial (landing page) que apresenta o projeto, uma breve descrição e um carrossel interativo com cotações de moedas em tempo real. Possui um botão para navegar até a página de conversão.
*   **`pages/Converter.js`**: A página principal de conversão de moedas. Contém um formulário para selecionar as moedas de origem e destino, o valor a ser convertido e o nome do usuário. Exibe o resultado da conversão e o histórico de transações.
*   **`components/Navbar.js`**: O componente de navegação superior, presente em todas as páginas. Exibe o título do projeto e um link para a página de conversão.
*   **`components/TransactionTable.js`**: Um componente reutilizável que exibe o histórico de transações. Inclui funcionalidades de paginação (10 itens por página) e busca por termo (usuário ou tipo de transação).

## Interação com a API Backend

O frontend se comunica com uma API backend (esperada em `http://localhost:8080/api/v1/cotacao`) para obter dados e realizar operações. Os principais endpoints utilizados são:

*   **`GET /api/v1/cotacao/moedas-disponiveis`**: Utilizado para obter a lista completa de moedas disponíveis e suas cotações detalhadas. Esta informação é usada para popular os dropdowns de seleção de moedas no conversor e para exibir o carrossel de cotações na página inicial.
*   **`POST /api/v1/cotacao/converter`**: Utilizado para realizar a conversão de moedas. Recebe `from` (moeda de origem), `to` (moeda de destino), `amount` (valor a ser convertido) e `nomeUsuario` (nome do usuário que realiza a transação).
*   **`GET /api/v1/cotacao/transacoes?page={page}&size={size}&searchTerm={term}`**: Utilizado para buscar o histórico de transações. Suporta paginação (parâmetros `page` e `size`) e filtragem por termo de busca (`searchTerm`).

## Funcionalidades

*   **Conversão de Moedas Genérica:** Converta entre qualquer par de moedas suportado pela API backend.
*   **Cotações em Tempo Real:** Visualize um carrossel interativo na página inicial com as cotações atualizadas de diversas moedas, incluindo ícones de bandeiras para moedas nacionais e logos para criptomoedas.
*   **Histórico de Transações:** Acompanhe todas as conversões realizadas, com paginação e funcionalidade de busca por usuário ou tipo de transação.
*   **Interface Moderna:** Design limpo e responsivo utilizando Materialize CSS.

## Como Configurar e Rodar Localmente

Para rodar este projeto frontend em sua máquina local, siga os passos abaixo:

### Pré-requisitos

*   Node.js (versão 14 ou superior) e npm (gerenciador de pacotes do Node.js) instalados.
*   O projeto backend do Conversor de Moedas deve estar rodando e acessível em `http://localhost:8080`.

### Passos

1.  **Clone o repositório (se ainda não o fez):**
    ```bash
    git clone <URL_DO_SEU_REPOSITORIO_FRONTEND>
    cd cotacao-Frontend
    ```
    *(Se você já tem o projeto, apenas navegue até a pasta `cotacao-Frontend`.)*

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

3.  **Inicie o servidor de desenvolvimento:**
    ```bash
    npm start
    ```

    Isso iniciará a aplicação em modo de desenvolvimento. Abra [http://localhost:3000](http://localhost:3000) (ou a porta indicada no seu terminal) para visualizá-la no navegador.

    A página será recarregada automaticamente se você fizer edições. Você também verá quaisquer erros de lint no console.

## Scripts Disponíveis

No diretório do projeto, você pode rodar:

*   **`npm start`**
    Inicia a aplicação em modo de desenvolvimento.

*   **`npm run build`**
    Compila a aplicação para produção na pasta `build`.

*   **`npm test`**
    Inicia o executor de testes em modo interativo.

*   **`npm eject`**
    Remove a dependência de build do `react-scripts` e copia as configurações e scripts para o diretório do projeto. Use com cautela, pois esta operação é irreversível.