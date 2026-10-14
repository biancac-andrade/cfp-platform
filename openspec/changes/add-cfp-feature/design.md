# Design: Call for Papers (CFP) Feature

## Context

The CFP platform needs a talk submission pipeline connecting an Angular frontend application to a NestJS API backend within an Nx monorepo.
Motivation and problem context are detailed in [proposal.md](file:///Users/bianca.andrade/Desktop/development/engenhariaIA/modulo5/cfp-platform/openspec/changes/add-cfp-feature/proposal.md). Requirements and behavioral contracts are specified in [spec.md](file:///Users/bianca.andrade/Desktop/development/engenhariaIA/modulo5/cfp-platform/openspec/changes/add-cfp-feature/specs/cfp-submission/spec.md).

Currently:
- `shared-types` defines a minimal `SpeakerDTO` interface without validation decorators.
- `api` contains a default NestJS starter app without request validation or CFP business logic.
- `frontend` contains a default Angular starter template without form inputs or Signal state for CFP.

## Goals / Non-Goals

**Goals:**
- Provide a single source of truth for the `SpeakerDTO` contract in `shared-types`.
- Implement a robust NestJS backend endpoint (`POST /api/cfp`) protected by `@Body()` and strict `class-validator` rules returning `400 Bad Request` for invalid input.
- Build a standalone Angular CFP component using Angular Signals for local state management (field values, validity, submission status) and enforce WAI-ARIA standards for accessibility.
- Provide comprehensive Jest unit tests covering NestJS payload validation and Angular Signal state transitions.

**Non-Goals:**
- Database persistence layer (in-memory storage or mock persistence is sufficient for this stage).
- User authentication, OAuth, or speaker role management.
- Complex multi-step speaker wizard or file uploads (slides/avatars).

## Decisions

### 1. Shared Contract and Validation Strategy
- **Decision**: Update `shared-types` to provide `SpeakerDTO` as a class with `class-validator` decorators (e.g., `@IsString()`, `@IsNotEmpty()`, `@IsEmail()`, `@IsBoolean()`, `@IsOptional()`), while preserving structural compatibility for frontend consumers.
- **Rationale**: NestJS's `ValidationPipe` relies on TypeScript metadata reflection at runtime, which requires a class. By exporting `SpeakerDTO` as a class from `shared-types`, both backend and frontend consume identical types and validation constraints without code duplication.
- **Alternatives Considered**:
  - *Keep `SpeakerDTO` as an interface and declare a duplicate `CreateSpeakerDto` class in `api`*: Violates DRY and risks schema drift between frontend and backend.
  - *Zod schema in `shared-types`*: Adds extra runtime dependencies and deviates from standard NestJS `class-validator` conventions.

### 2. NestJS Architecture and Strict Validation
- **Decision**: Create a dedicated `CfpModule` containing `CfpController` and `CfpService`. Configure `ValidationPipe` with `{ whitelist: true, forbidNonWhitelisted: true, transform: true }`.
- **Rationale**: Strict validation ensures unknown fields are rejected and invalid types immediately fail with standard `400 Bad Request` responses before reaching controller logic.
- **Alternatives Considered**:
  - *Manual validation inside controller methods*: Error-prone, boilerplate-heavy, and deviates from NestJS best practices.

### 3. Angular Standalone Component with Signals
- **Decision**: Create a standalone component `CfpFormComponent` in `frontend/src/app/cfp/` utilizing Angular Signals (`signal`, `computed`) for form state management.
  - Form field signals: `name = signal('')`, `email = signal('')`, `talkTitle = signal('')`, `isGDE = signal(false)`.
  - Status signals: `isSubmitting = signal(false)`, `submitError = signal<string | null>(null)`, `isSubmitted = signal(false)`.
  - Computed signal: `isFormValid = computed(() => ...)` evaluating validity of fields.
- **Rationale**: Angular 21 emphasizes zoneless-ready, reactive state using Signals. Standalone components simplify dependency graphs and avoid NgModules.
- **Alternatives Considered**:
  - *Angular Reactive Forms (`FormGroup` / `FormControl`)*: Functional, but Signals provide fine-grained reactivity, simpler state inspection in tests, and direct alignment with modern Angular architecture.

### 4. WAI-ARIA Accessibility Architecture
- **Decision**: Implement comprehensive accessibility in the CFP form:
  - Explicit `<label for="...">` associations for each control.
  - Dynamic `[attr.aria-invalid]="isFieldInvalid()"` on inputs.
  - Error messages with unique IDs linked via `[attr.aria-describedby]="errorId"`.
  - Accessible button state: `[disabled]="!isFormValid() || isSubmitting()"` with `aria-disabled`.
  - Live status announcements: `<div role="status" aria-live="polite">` for submission feedback.
- **Rationale**: Guarantees screen readers and assistive devices accurately convey form state, field validation, and submission status.

### 5. Testing Strategy with Jest
- **Backend (`api`)**:
  - Use `ValidationPipe` within testing module or pipe unit tests to assert invalid payloads (missing required fields, malformed email) throw `BadRequestException` (`400`).
  - Unit test `CfpController` and `CfpService` for successful submission flows.
- **Frontend (`frontend`)**:
  - Angular unit tests verifying:
    1. Initial Signal state: inputs empty, `isFormValid()` is false, submission button is disabled.
    2. Input updates: updating signals to valid data enables the submit button.
    3. Submission flow: triggers API call and transitions submission status signals.

## Risks / Trade-offs

- **[Risk] Decorator metadata compilation across monorepo boundaries** → Ensure `experimentalDecorators` and `emitDecoratorMetadata` remain enabled in `tsconfig.base.json`, and ensure `@cfp-platform/shared-types` imports `class-validator` cleanly without bundle issues in Angular.
- **[Risk] Angular Jest execution environment** → Workspace has `@nx/jest` and Jest configured; verify test runners in both `api` and `frontend` execute isolated unit tests without external daemon dependencies.
- **[Risk] Email regex strictness** → Rely on standard `class-validator` `@IsEmail()` and standard email regex in frontend signals for consistency.

## Migration Plan

1. Install `class-validator` and `class-transformer` if required in root `package.json`.
2. Enhance `shared-types` to export `SpeakerDTO` class with validation decorators.
3. Implement `CfpModule`, `CfpController`, and `CfpService` in `api`, with unit tests verifying 400 rejection.
4. Implement `CfpService` and `CfpFormComponent` in `frontend`, with unit tests verifying initial state and button disabling.
5. Register route or component in `frontend` root view.
