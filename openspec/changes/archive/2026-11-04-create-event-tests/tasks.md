# Tasks

## 1. Shared Contract & Backend (NestJS)

- [x] 1.1 Criar `EventDTO` em `shared-types/src/lib/event.dto.ts` com decorators `class-validator` e exportá-lo em `shared-types/src/index.ts`; verificar com `npx nx build shared-types`
- [x] 1.2 Criar `EventsModule`, `EventsController` (`POST /api/events` 201, `GET /api/events`) e `EventsService` em memória em `api/src/app/events/` e registrar em `app.module.ts`; verificar com `npx nx build api`
- [x] 1.3 Escrever testes Jest do controller/service (payload válido, campos ausentes, capacity inválida, propriedade extra) e verificar com `npx nx test api`

## 2. Frontend Event Form (Angular)

- [x] 2.1 Criar `EventService` em `frontend/src/app/event/event.service.ts` com `createEvent(dto)` via `HttpClient`
- [x] 2.2 Criar `EventFormComponent` standalone (`.ts/.html/.css`) com campos `event-name`, `event-address`, `event-capacity`, `event-date`, validação HTML5 nativa, botão `submit-event-btn` e mensagem `.status-success`, reutilizando os design tokens do `CfpFormComponent`
- [x] 2.3 Registrar a rota `event/new` em `frontend/src/app/app.routes.ts`
- [x] 2.4 Escrever testes Vitest do componente e do service (render, campos obrigatórios, submissão com sucesso e com erro) e verificar com `npx nx test frontend`

## 3. Cypress E2E

- [x] 3.1 Configurar Cypress no `frontend-e2e` (`cypress.config.ts` com `baseUrl` `http://localhost:4200`, `tsconfig` para `*.cy.ts`, resolver a colisão do target `e2e` com o Playwright); verificar com `npx nx show project frontend-e2e` listando o target Cypress
- [x] 3.2 Criar `frontend-e2e/src/e2e/event-registration.cy.ts` com o cenário de sucesso: `cy.visit('/event/new')`, preencher Nome/Endereço/Capacidade/Data por `#id`/`name`, clicar em `#submit-event-btn` e `cy.contains` + `should('be.visible')` na confirmação
- [x] 3.3 No mesmo arquivo, criar o cenário de erro: submeter vazio e asserir com `should` que os campos obrigatórios estão `:invalid` e que `validationMessage` não está vazio
- [x] 3.4 Garantir sintaxe exclusivamente tradicional (`cy.get`, `cy.contains`, `should`) sem bibliotecas de IA e executar `npx nx e2e frontend-e2e` (ou o target Cypress definido) com ambos os cenários passando
- [x] 3.5 Criar `frontend-e2e/src/e2e/event-registration-ai.cy.ts` utilizando `cy.prompt([...])` para os cenários de sucesso e validação em linguagem natural; verificar tipagem e lint com `npx nx lint frontend-e2e`

## 4. Verificação Integrada

- [x] 4.1 Executar `npx nx run-many -t lint` sem erros
- [x] 4.2 Executar `npx nx run-many -t test --skip-nx-cache` com todos os testes passando
- [x] 4.3 Executar `npx nx run-many -t build --skip-nx-cache` com sucesso
