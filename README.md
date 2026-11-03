# 🎤 CFP Platform (Call for Papers)

Monorepo full-stack corporativo para gerenciamento e submissão de propostas de palestras (*Call for Papers*) em conferências de tecnologia, desenvolvido com arquitetura **Spec-Driven** orientada por especificações formais com [OpenSpec](https://openspec.dev) e orquestrado via [Nx](https://nx.dev).

---

## 📌 Visão Geral do Projeto

A **CFP Platform** é composta por uma aplicação web reativa, uma API REST com validação rigorosa de dados e uma biblioteca compartilhada de tipos e contratos de dados (DTOs).

### Principais Funcionalidades

1. **Submissão de Propostas (`/cfp`):**
   - Formulário reativo baseado em **Angular Signals**.
   - Validação em tempo real com estados acessíveis para leitores de tela (*WAI-ARIA*).
   - Suporte a palestrantes **Google Developer Experts (GDE)**.
   - Desabilitação inteligente e reativa do botão de submissão enquanto o formulário estiver incompleto ou inválido.

2. **Dashboard de Propostas (`/dashboard`):**
   - Visualização tabular estruturada em HTML semântico (`<table>`, `<caption>`, `<th scope="col">`).
   - Gerenciamento reativo de estado de listagem (`WritableSignal<SpeakerDTO[]>`), carregamento (`isLoading`) e falha (`errorMessage`).
   - Badges visuais de identificação de GDE.
   - Estados vazios informativos (*Empty State*) e tratamento de erros de conexão com ação de nova tentativa (*Retry*).

3. **Navegação & Consistência Visual:**
   - Roteamento SPA desacoplado no Angular Router.
   - Navegação bidirecional integrada entre formulário e painel de controle.
   - Rigorosa fidelidade aos **Design Tokens** (paleta de cores, tipografia, bordas e elevação por sombras).

4. **Ciclo de Vida Orientado a Especificações (OpenSpec):**
   - Todos os requisitos de comportamento (APIs, regras de acessibilidade e cenários de aceitação) são formalizados em `openspec/specs/` antes da codificação.

---

## 🛠️ Stack Tecnológica & Frameworks

| Camada | Tecnologia | Versão / Destaque |
| :--- | :--- | :--- |
| **Monorepo Engine** | [Nx](https://nx.dev) | v23 (orquestração de tarefas, grafo de dependências e caching) |
| **Frontend** | [Angular](https://angular.dev) | Standalone Components, Angular Signals (`signal`, `computed`), Control Flow (`@if`, `@for`) |
| **Backend** | [NestJS](https://nestjs.com) | v11 (Arquitetura modular, Injeção de Dependências, Controllers e Services) |
| **Contratos & Validação** | [class-validator](https://github.com/typestack/class-validator) & [class-transformer](https://github.com/typestack/class-transformer) | Validação declarativa via decorators compartilhados no monorepo |
| **Linguagem** | [TypeScript](https://www.typescriptlang.org) | Tipagem estrita ponta a ponta (Frontend, Backend e Shared Library) |
| **Testes Unitários (Front)** | [Vitest](https://vitest.dev) | Testes ultrarrápidos integrados ao executor do Angular |
| **Testes Unitários (Back)** | [Jest](https://jestjs.io) | Testes integrados com `TestingTestingModule` do NestJS |
| **Testes E2E** | [Playwright](https://playwright.dev) | Automação e testes ponta a ponta para API e Frontend |
| **Linter & Formatação** | [ESLint](https://eslint.org) | v9 (flat config) |
| **Especificações** | [OpenSpec](https://openspec.dev) | Especificação de requisitos normativos (SHALL/MUST) e deltas de mudança |

---

## 🏛️ Arquitetura do Monorepo

```text
cfp-platform/
├── api/                             # Aplicação Backend (NestJS 11)
│   ├── src/
│   │   ├── app/
│   │   │   ├── cfp/                 # Módulo de CFP (Controller, Service e Testes)
│   │   │   └── app.module.ts
│   │   └── main.ts                  # Bootstrap, porta 3000, prefixo global /api e ValidationPipe
│   └── project.json
│
├── frontend/                        # Aplicação Web (Angular 21)
│   ├── src/
│   │   ├── app/
│   │   │   ├── cfp/                 # Componentes Standalone (Form & Dashboard), Services e Testes
│   │   │   ├── app.routes.ts        # Rotas ('', 'cfp', 'dashboard')
│   │   │   └── app.config.ts        # Configuração do HttpClient e Router
│   │   └── styles.css               # Estilos globais
│   ├── proxy.conf.json              # Redirecionamento de chamadas /api para localhost:3000
│   └── project.json
│
├── shared-types/                    # Biblioteca TypeScript Compartilhada
│   └── src/
│       ├── lib/
│       │   └── speaker.dto.ts       # SpeakerDTO com decorators de validação
│       └── index.ts                 # Exportação do path alias @cfp-platform/shared-types
│
├── openspec/                        # Especificações formais do sistema
│   ├── config.yaml                  # Configuração do schema (spec-driven)
│   ├── specs/                       # Especificações ativas consolidadas
│   │   ├── cfp-submission/spec.md   # Especificação de submissão e formulário
│   │   └── cfp-dashboard/spec.md    # Especificação do painel de propostas
│   └── changes/archive/             # Mudanças concluídas e arquivadas com rastreabilidade
│
├── api-e2e/                         # Testes E2E da API com Playwright
├── frontend-e2e/                    # Testes E2E do Frontend com Playwright
└── nx.json                          # Configurações de pipeline e cache do Nx
```

---

## 🌐 Endpoints da API REST

A API roda por padrão em `http://localhost:3000/api`.

| Método | Endpoint | Descrição | Status de Sucesso | Erros Mapeados |
| :--- | :--- | :--- | :--- | :--- |
| **POST** | `/api/cfp` | Submete uma nova proposta de palestra | `201 Created` | `400 Bad Request` (campos ausentes, email inválido ou propriedades não permitidas) |
| **GET** | `/api/cfp` | Retorna o array de todas as propostas cadastradas | `200 OK` | `500 Internal Server Error` |

### Exemplo de Payload (`SpeakerDTO`):

```json
{
  "name": "Linus Torvalds",
  "email": "linus@example.com",
  "talkTitle": "The Architecture of Git and Linux Kernel",
  "isGDE": false
}
```

---

## ♿ Acessibilidade e Design System (WAI-ARIA)

O frontend implementa padrões estritos de acessibilidade conforme as diretrizes WCAG:

- **Associação Semântica de Formulários:** Todo `<input>` possui `<label for="...">` explícito, `autocomplete` adequado e referência de erros via `aria-describedby`.
- **Validação Acessível:** Campos inválidos acionam dinamicamente `aria-invalid="true"` e mensagens de erro com `role="alert"`.
- **Regiões Vivas:** Indicadores de carregamento, alertas de erro e confirmações de envio utilizam `aria-live="polite"` e `aria-atomic="true"`.
- **Tabela Semântica:** A listagem no dashboard utiliza `<caption>`, cabeçalhos com `<th scope="col">` e classes de suporte visual como `.sr-only` para leitores de tela em elementos semânticos complementares.
- **Design Tokens de Interface:**
  - **Primária / Ação:** `#2563eb` (Hover: `#1d4ed8`, Focus: `2px solid #2563eb`)
  - **Títulos / Cabeçalhos:** `#111827`
  - **Textos Secundários:** `#4b5563`
  - **Feedback Positivo:** `#059669` (Fundo: `#ecfdf5`, Borda: `#a7f3d0`)
  - **Feedback Crítico:** `#dc2626` (Fundo: `#fef2f2`, Borda: `#fecaca`)
  - **Container Card:** `#ffffff`, `border-radius: 8px`, elevação suave via `box-shadow`.

---

## 🚀 Como Executar o Projeto

### Pré-requisitos
- **Node.js**: Versão `>= 20.x` (recomendado v22 ou v24)
- **NPM**: Versão `>= 10.x`

### 1. Clonar o repositório e instalar dependências

```bash
git clone git@github.com:biancac-andrade/cfp-platform.git
cd cfp-platform
npm install
```

---

### 2. Executar a Aplicação em Desenvolvimento

Graças à dependência configurada no Nx (`dependsOn: ["api:serve"]`), iniciar o frontend inicia automaticamente a API NestJS:

```bash
# Inicia API (porta 3000) e Frontend (porta 4200) com proxy reverso integrado
npx nx serve frontend
```

Você também pode executá-los em terminais separados, se desejar:

```bash
# Terminal 1 - Backend NestJS
npx nx serve api

# Terminal 2 - Frontend Angular
npx nx serve frontend
```

Acesse no navegador:
- **Formulário de Submissão:** [http://localhost:4200/cfp](http://localhost:4200/cfp)
- **Dashboard de Propostas:** [http://localhost:4200/dashboard](http://localhost:4200/dashboard)
- **API REST Direta:** [http://localhost:3000/api/cfp](http://localhost:3000/api/cfp)

---

### 3. Executar os Testes Automatizados

#### Testes Unitários:
```bash
# Executa todos os testes unitários do monorepo (API + Frontend + Shared)
npx nx run-many -t test

# Executa apenas os testes do Frontend (Vitest)
npx nx test frontend

# Executa apenas os testes do Backend (Jest)
npx nx test api

# Executa testes ignorando o cache do Nx
npx nx run-many -t test --skip-nx-cache
```

#### Testes End-to-End (E2E):
```bash
# Executa os testes E2E com Playwright
npx nx run-many -t e2e
```

---

### 4. Análise Estática (Linting) & Verificação de Tipos

```bash
# Executa o ESLint em todos os projetos do monorepo
npx nx run-many -t lint
```

---

### 5. Compilação para Produção (Build)

```bash
# Compila todos os projetos (artefatos gerados em dist/)
npx nx run-many -t build

# Compilar apenas o frontend em modo de produção
npx nx build frontend --configuration=production

# Compilar apenas a API
npx nx build api --configuration=production
```

---

### 6. Validação das Especificações OpenSpec

O repositório utiliza o CLI do **OpenSpec** para garantir a integridade dos contratos de requisitos:

```bash
# Validar todas as especificações consolidadas
openspec validate --specs

# Executar diagnóstico do ecossistema OpenSpec
openspec doctor
```

---

## 📄 Licença

Distribuído sob a licença **MIT**. Consulte o arquivo de licença para mais detalhes.
