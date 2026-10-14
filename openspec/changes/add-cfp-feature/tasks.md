# Tasks

## 1. Shared Contract & Dependencies

- [ ] 1.1 Install `class-validator` and `class-transformer` in root dependencies and verify installation with `npm ls class-validator class-transformer`
- [ ] 1.2 Update `shared-types/src/lib/speaker.dto.ts` to export `SpeakerDTO` as a class decorated with `class-validator` rules (`@IsString()`, `@IsNotEmpty()`, `@IsEmail()`, `@IsBoolean()`, `@IsOptional()`) and verify compilation with `npx tsc --noEmit -p shared-types/tsconfig.json`
- [ ] 1.3 Export `SpeakerDTO` from `shared-types/src/index.ts` and verify resolution via path alias `@cfp-platform/shared-types`

## 2. Backend CFP API & Validation (NestJS in `api`)

- [ ] 2.1 Enable global `ValidationPipe` with `{ whitelist: true, forbidNonWhitelisted: true, transform: true }` in `api/src/main.ts` or scoped module pipe to strictly validate incoming requests
- [ ] 2.2 Create `CfpService` in `api/src/app/cfp/cfp.service.ts` to process and persist/store speaker submissions adhering to `SpeakerDTO`
- [ ] 2.3 Create `CfpController` in `api/src/app/cfp/cfp.controller.ts` with `POST /api/cfp` endpoint accepting `@Body() speakerDto: SpeakerDTO` and returning `201 Created`
- [ ] 2.4 Register `CfpModule` in `api/src/app/app.module.ts` and verify application starts without dependency injection errors
- [ ] 2.5 Write Jest unit tests in `api/src/app/cfp/cfp.controller.spec.ts` and `cfp.service.spec.ts` verifying that valid payloads are accepted and invalid payloads (missing required fields, malformed email, extra fields) throw `BadRequestException` (`400 Bad Request`); verify with `npx nx test api`

## 3. Frontend CFP Component, Signals & Accessibility (Angular in `frontend`)

- [ ] 3.1 Create `CfpService` in `frontend/src/app/cfp/cfp.service.ts` to submit proposals via `HttpClient` consuming `SpeakerDTO` from `@cfp-platform/shared-types`
- [ ] 3.2 Implement standalone `CfpFormComponent` in `frontend/src/app/cfp/cfp-form.component.ts` managing reactive state using Angular Signals (`signal()` for fields/submission states, `computed()` for `isFormValid`)
- [ ] 3.3 Implement accessible template with WAI-ARIA standards (semantic `<label for="...">`, `aria-invalid`, `aria-describedby` error associations, `aria-live="polite"` status message, `[disabled]` and `aria-disabled` on submit button)
- [ ] 3.4 Register `CfpFormComponent` route in `frontend/src/app/app.routes.ts` or embed in `frontend/src/app/app.ts` and verify template renders cleanly
- [ ] 3.5 Write Jest unit tests in `frontend/src/app/cfp/cfp-form.component.spec.ts` verifying initial Signal state (empty values, `isFormValid() === false`), submit button disabled on initial load, submit button enabled when fields become valid, and state updates upon submission; verify with `npx nx test frontend`

## 4. End-to-End Monorepo Quality & Verification

- [ ] 4.1 Run type-checking and linter across workspace with `npx nx run-many -t lint` and verify zero errors
- [ ] 4.2 Run all unit test suites in monorepo with `npx nx run-many -t test` and verify all tests pass
- [ ] 4.3 Build both frontend and api applications with `npx nx run-many -t build` and verify successful production bundles
