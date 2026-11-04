# Spec Delta

## Purpose

Permite cadastrar eventos (nome, endereço, capacidade e data) por meio de um formulário validado e garante o comportamento por testes E2E automatizados.

## ADDED Requirements

### Requirement: Event Creation API
O sistema SHALL expor um endpoint para criar eventos a partir de nome, endereço, capacidade e data, rejeitando dados inválidos.

#### Scenario: Valid event creation
- **WHEN** o cliente envia POST em `/api/events` com name, address, capacity (inteiro positivo) e date válidos
- **THEN** o backend responde HTTP 201 Created com o evento registrado, incluindo um identificador

#### Scenario: Invalid event rejected
- **WHEN** o cliente envia POST em `/api/events` com campos ausentes, capacity não positiva ou propriedades desconhecidas
- **THEN** o backend responde HTTP 400 Bad Request com mensagens de validação

### Requirement: Event Registration Form
O frontend SHALL fornecer, na rota `/event/new`, um formulário com os campos Nome, Endereço, Capacidade e Data, todos obrigatórios e com validação nativa do navegador.

#### Scenario: Successful registration
- **WHEN** o usuário acessa `/event/new`, preenche todos os campos com valores válidos e aciona o botão de submissão
- **THEN** o evento é enviado ao backend e a tela exibe uma mensagem de confirmação de sucesso

#### Scenario: Empty form validation
- **WHEN** o usuário aciona o botão de submissão com o formulário vazio
- **THEN** a submissão é bloqueada e as mensagens nativas de validação (campo obrigatório) são apresentadas para os campos inválidos

### Requirement: Event Registration E2E Coverage
A suíte E2E SHALL cobrir os cenários de sucesso e de erro do formulário de cadastro de eventos usando exclusivamente comandos tradicionais do Cypress.

#### Scenario: Success flow covered
- **WHEN** a suíte E2E é executada
- **THEN** um teste navega a `/event/new`, preenche os campos por seletores `id`/`class`/`name`, submete e verifica a confirmação de sucesso

#### Scenario: Error flow covered
- **WHEN** a suíte E2E é executada
- **THEN** um teste submete o formulário vazio e verifica por asserções as mensagens nativas de validação
