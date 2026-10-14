# Proposal: Add CFP (Call for Papers) Feature

## Why

To allow speakers to submit talks for conferences, the platform requires an accessible and validated Call for Papers (CFP) submission feature. This establishes a robust flow bridging the Angular frontend and NestJS backend via a shared DTO contract.

## What Changes

- **Shared Types**:
  - Export `SpeakerDTO` contract from `shared-types` with fields (`id`, `name`, `email`, `talkTitle`, `isGDE`).
  - Introduce validation-ready class / schema definitions compatible with NestJS `class-validator` and Angular frontend consumption.
- **Backend (NestJS in `api`)**:
  - Add CFP module, controller, and service with a `POST /api/cfp` (or `POST /api/speakers`) submission endpoint.
  - Implement `@Body()` validation with strict `ValidationPipe`, rejecting invalid payloads with `400 Bad Request`.
  - Add Jest unit tests verifying successful creation and rejection of invalid payloads.
- **Frontend (Angular in `frontend`)**:
  - Implement standalone CFP submission component using Angular Signals for state management (form state, submission status, validation).
  - Enforce WAI-ARIA compliance (semantic form controls, labels, `aria-invalid`, `aria-describedby`, error alerts, focus management).
  - Submit talk data consuming `SpeakerDTO` via an HTTP service.
  - Add unit tests verifying initial Signal states and submission button disabling/enabling logic.

## Capabilities

### New Capabilities
- `cfp-submission`: Covers talk submission handling, speaker payload validation, accessible submission form with reactive signal state, and unit test suites across frontend and backend.

### Modified Capabilities
*(None - this is a new capability)*

## Impact

- **Affected Packages**:
  - `shared-types`: Export and alignment of `SpeakerDTO`.
  - `api`: New CFP controller/service, dependency on `class-validator` and `class-transformer` for strict validation pipe, Jest unit test suite.
  - `frontend`: New standalone CFP submission component and service, integration with root routes/app layout, unit test suite.
- **Dependencies**:
  - Install `class-validator` and `class-transformer` if not present in dependencies for NestJS runtime validation.
- **APIs**:
  - `POST /api/cfp`: Submits speaker proposal adhering to `SpeakerDTO`.
