# Tasks

## 1. Backend Verification & Tests (NestJS `api`)

- [x] 1.1 Verify and test `GET /api/cfp` in `CfpController` and `CfpService` returning `SpeakerDTO[]`, ensuring unit test coverage in `api/src/app/cfp/cfp.controller.spec.ts` and `api/src/app/cfp/cfp.service.spec.ts`; verify with `npx nx test api`

## 2. Frontend Service Layer (Angular `frontend`)

- [x] 2.1 Add `getProposals(): Observable<SpeakerDTO[]>` to `frontend/src/app/cfp/cfp.service.ts` consuming `GET /api/cfp` via injected `HttpClient`
- [x] 2.2 Add unit tests for `getProposals()` in `frontend/src/app/cfp/cfp.service.spec.ts` validating GET request dispatch and response mapping; verify with `npx nx test frontend`

## 3. Frontend Dashboard Component & Signals State

- [x] 3.1 Create standalone `CfpDashboardComponent` in `frontend/src/app/cfp/cfp-dashboard.component.ts` managing reactive state with Angular Signals (`proposals = signal<SpeakerDTO[]>([])`, `isLoading = signal(true)`, `errorMessage = signal<string | null>(null)`)
- [x] 3.2 Implement accessible template in `frontend/src/app/cfp/cfp-dashboard.component.html` with semantic HTML (`<table>`, `<caption>`, `<th scope="col">`), displaying speaker proposals (name, email, talkTitle, isGDE badge), loading indicator, accessible empty state message, and error alerts with `role="alert"`
- [x] 3.3 Implement styling in `frontend/src/app/cfp/cfp-dashboard.component.css` rigorously matching design tokens from `cfp-form.component.css` (`#2563eb`, `#111827`, `#4b5563`, `#f9fafb`, `#d1d5db`, `#ffffff`, border radius, box shadow, and focus outlines)
- [x] 3.4 Write unit tests in `frontend/src/app/cfp/cfp-dashboard.component.spec.ts` verifying signal state initialization, successful rendering of proposal rows/cards, GDE badge display, empty state, and error handling; verify with `npx nx test frontend`

## 4. Routing & Form Navigation

- [x] 4.1 Register route `path: 'dashboard'` targeting `CfpDashboardComponent` in `frontend/src/app/app.routes.ts`
- [x] 4.2 Add navigation button to `/dashboard` in `CfpFormComponent` (`cfp-form.component.html` and `.ts`), importing `RouterModule`, adhering to the established button design tokens, and include back-navigation link in `CfpDashboardComponent` to `/cfp`
- [x] 4.3 Update `frontend/src/app/cfp/cfp-form.component.spec.ts` to verify the dashboard navigation button presence and accessibility attributes; verify with `npx nx test frontend`

## 5. End-to-End Monorepo Quality & Verification

- [x] 5.1 Run linting across all monorepo projects with `npx nx run-many -t lint` and verify zero errors
- [x] 5.2 Run all unit test suites across all monorepo projects with `npx nx run-many -t test` and verify all tests pass
- [x] 5.3 Run production build for all monorepo applications with `npx nx run-many -t build` and verify successful output bundles

