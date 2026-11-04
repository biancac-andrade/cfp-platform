# Proposal

## Why

A plataforma só cobre submissão de propostas de palestras (CFP). Não existe tela de cadastro de eventos, nem testes E2E com Cypress. Esta change cria a tela `/event/new` e a cobre com testes E2E tradicionais (`cy.get()`, `cy.contains()`, `should()`), formando a base de regressão antes de qualquer automação assistida por IA.

## What Changes

- **Backend (NestJS)**: novo módulo `events` com `POST /api/events` (validação via `class-validator`, armazenamento em memória) e `GET /api/events`.
- **Shared types**: novo `EventDTO` (`name`, `address`, `capacity`, `date`) com decorators de validação em `@cfp-platform/shared-types`.
- **Frontend (Angular)**: novo `EventFormComponent` standalone na rota `/event/new`, com campos Nome, Endereço, Capacidade (number) e Data (date), atributos nativos de validação HTML5 (`required`, `min`), submissão via `HttpClient` e mensagem de confirmação.
- **E2E (Cypress)**: configuração do Cypress no projeto `frontend-e2e` e arquivo `frontend-e2e/src/e2e/event-registration.cy.ts` com cenário de sucesso e cenário de erro (formulário vazio), usando exclusivamente sintaxe tradicional do Cypress e seletores `id`/`class`/`name`.
- **Restrição**: nenhuma biblioteca externa de IA é adicionada.

## Capabilities

### New Capabilities
- `event-registration`: cadastro de eventos (API de criação, formulário com validação nativa, rota `/event/new`) e sua cobertura E2E.

### Modified Capabilities

## Impact

- **Backend**: `api/src/app/events/*`, `api/src/app/app.module.ts`.
- **Shared**: `shared-types/src/lib/event.dto.ts`, `shared-types/src/index.ts`.
- **Frontend**: `frontend/src/app/event/*`, `frontend/src/app/app.routes.ts`.
- **E2E**: `frontend-e2e/cypress.config.ts`, `frontend-e2e/src/e2e/event-registration.cy.ts`, `frontend-e2e/project.json`, tsconfig do e2e.
- **Dependências/Nx**: `cypress` e `@nx/cypress` já constam no `package.json`/`nx.json` (alterações ainda não commitadas); o plugin `@nx/cypress` usa `targetName: "e2e"`, o mesmo do Playwright.
