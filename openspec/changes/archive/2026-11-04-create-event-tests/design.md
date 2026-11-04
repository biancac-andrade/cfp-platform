# Design

## Context

Monorepo Nx com `api` (NestJS), `frontend` (Angular, standalone + Signals), `shared-types` e dois projetos E2E em Playwright (`frontend-e2e`, `api-e2e`). Não há rota `/event/new` nem módulo de eventos. `cypress` e `@nx/cypress` já foram adicionados ao `package.json` e ao `nx.json` (plugin com `targetName: "e2e"`), sem configuração gerada. Veja `proposal.md` para a motivação.

## Goals / Non-Goals

**Goals:**
- Entregar a tela `/event/new` com validação nativa HTML5 e a API `POST /api/events`.
- Entregar `frontend-e2e/src/e2e/event-registration.cy.ts` com cenário de sucesso e de erro.
- Seguir a identidade visual e acessibilidade do `CfpFormComponent`.

**Non-Goals:**
- Persistência real, listagem/edição/remoção de eventos na UI.
- Qualquer biblioteca ou plugin de IA para testes.
- Migrar os testes Playwright existentes.

## Decisions

### Decision 1: Cypress dentro do `frontend-e2e` existente
- **Choice**: adicionar `cypress.config.ts` e `src/e2e/` ao `frontend-e2e`, com `baseUrl` `http://localhost:4200`. Mantém o Playwright (`example.spec.ts` não conflita com `*.cy.ts`).
- **Rationale**: respeita a localização pedida e a decisão do usuário.
- **Alternative**: projeto novo separado — descartado por escolha do usuário.
- **Ponto de atenção**: Playwright e `@nx/cypress/plugin` inferem o target `e2e`. Se colidirem, renomear o `targetName` do Cypress (ex.: `e2e-cypress`) em `nx.json`.

### Decision 2: Validação nativa HTML5 no formulário
- **Choice**: `<form novalidate>` NÃO é usado; inputs com `required`, `type="number"` + `min="1"` e `type="date"`. O Angular não bloqueia o submit nativo.
- **Rationale**: o requisito pede mensagens nativas de validação; o teste verifica via `input:invalid` e `validationMessage` (asserções `should`).
- **Alternative**: mensagens customizadas com `aria-describedby` — contraria o requisito de "nativas".

### Decision 3: Seletores estáveis por `id`
- **Choice**: ids `event-name`, `event-address`, `event-capacity`, `event-date`, `submit-event-btn`, e `.status-success` para confirmação; atributos `name` correspondentes.
- **Rationale**: o pedido exige seletores CSS convencionais.

### Decision 4: Backend de eventos
- **Choice**: `EventsModule` com controller `events`, service em memória, `EventDTO` compartilhado (`@IsString`, `@IsNotEmpty`, `@IsInt`, `@Min(1)`, `@IsDateString`). `ValidationPipe` global já existente aplica a validação.
- **Alternative**: reutilizar `CfpModule` — rejeitado por domínio distinto.

### Decision 5: Isolamento dos testes
- **Choice**: o teste de sucesso usa o backend real iniciado por `nx serve frontend` (que depende de `api:serve`); a asserção verifica a mensagem de sucesso. Sem `cy.intercept`, para teste ponta a ponta fiel.

## Risks / Trade-offs

- **[Colisão do target `e2e`]** → Renomear `targetName` do plugin Cypress.
- **[Versão do Cypress `^16`]** → Verificar instalação do binário (`npx cypress verify`) antes de rodar.
- **[Mensagens nativas variam por navegador/idioma]** → Asserir `:invalid` e `validationMessage` não vazio, e usar um único navegador (Electron/Chrome) na suíte.
- **[Estado em memória compartilhado]** → Testes não dependem de contagem de eventos.
