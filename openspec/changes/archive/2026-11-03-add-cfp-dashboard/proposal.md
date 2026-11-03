# Proposal

## Why

While prospective speakers can submit talk proposals through the CFP submission form, conference organizers and attendees currently have no way within the platform to view and track submitted proposals. Providing a reactive, accessible dashboard fulfills the need for proposal visibility and transparent tracking.

## What Changes

- **Backend (NestJS)**: Ensure and test a `GET /api/cfp` endpoint on `CfpController` that delegates to `CfpService.findAll()` and returns an array of `SpeakerDTO` items.
- **Frontend Service**: Extend `CfpService` with a `getProposals()` method consuming `GET /api/cfp` via Angular's `HttpClient`.
- **Frontend Dashboard Component**: Create a standalone `CfpDashboardComponent` in `frontend/src/app/cfp/cfp-dashboard.component.ts` managing reactive state using Angular Signals (`WritableSignal<SpeakerDTO[]>`), with loading, empty, and error state handling.
- **UX/UI & Design Tokens**: Implement semantic HTML (structured data table or card grid) strictly adhering to the design tokens, typography, spacing, and color palette established in `CfpFormComponent` (`#2563eb` primary, `#111827` heading, `#4b5563` subtitle/neutral, rounded corners, elevation shadows).
- **Routing**: Register `path: 'dashboard'` in `frontend/src/app/app.routes.ts` targeting `CfpDashboardComponent`.
- **Navigation**: Add an accessible navigation button in `CfpFormComponent` linking to `/dashboard` matching the established design tokens, and a back-navigation link in the dashboard component.

## Capabilities

### New Capabilities
- `cfp-dashboard`: Covers talk proposal retrieval from the backend, reactive dashboard presentation using Angular Signals and semantic HTML, and navigation routing between the CFP form and dashboard.

### Modified Capabilities

## Impact

- **Backend**: `api/src/app/cfp/cfp.controller.ts`, `api/src/app/cfp/cfp.service.ts`, and corresponding unit tests in `api/src/app/cfp/cfp.controller.spec.ts`.
- **Frontend Service**: `frontend/src/app/cfp/cfp.service.ts` and `frontend/src/app/cfp/cfp.service.spec.ts`.
- **Frontend Routing**: `frontend/src/app/app.routes.ts`.
- **Frontend Components**:
  - New `CfpDashboardComponent` in `frontend/src/app/cfp/cfp-dashboard.component.{ts,html,css}` and unit tests `cfp-dashboard.component.spec.ts`.
  - Update `CfpFormComponent` in `frontend/src/app/cfp/cfp-form.component.{html,ts,css}` to include navigation button to `/dashboard`.
- **Shared Types**: Leverages existing `SpeakerDTO` from `@cfp-platform/shared-types`.

