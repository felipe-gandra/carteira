# Carteira de Investimentos

Sistema web para gerenciamento de carteira de investimentos pessoal.

## Tecnologias Utilizadas

- **Frontend:** HTML5, CSS3, JavaScript (ES6+)
- **Backend:** Node.js, Express.js
- **Banco de Dados:** JSON (arquivo local)
- **API Externa:** Finnhub API (cotações de ativos)

## Funcionalidades

### Autenticação
- Sistema de login e cadastro de usuários
- Validação de credenciais
- Sessão persistente com localStorage

### Gerenciamento de Ativos
- Adicionar ativos (ações, criptomoedas, fundos de investimento)
- Editar informações de ativos existentes
- Remover ativos da carteira
- Validação de existência de ativos via API

### Visualização de Dados
- Resumo financeiro com estatísticas da carteira
- Gráficos de pizza para distribuição de ativos
- Cálculo de valorização e lucro/prejuízo
- Visualização por tipo de ativo

### Interface
- Design responsivo para diferentes tamanhos de tela
- Modais para interação com usuário
- Sistema de cards organizados
- Scroll automático para conteúdo extenso

## Estrutura do Projeto

```
carteira/
├── back/
│   ├── api.js              # Integração com API externa
│   ├── server.js           # Servidor Express
│   └── bancoDados/
│       └── registros.json  # Dados dos usuários
└── front/
    ├── index.html          # Página principal
    ├── login.html          # Página de autenticação
    ├── api.js              # Requisições HTTP
    ├── ui.js               # Interface e gráficos
    ├── render.js           # Renderização de dados
    ├── main.js             # Inicialização
    └── styles/             # Estilos CSS
```

## Como Executar

1. Configure a API key no arquivo `config.json`
2. Instale as dependências: `npm install`
3. Inicie o servidor: `node back/server.js`
4. Acesse `http://localhost:3000`