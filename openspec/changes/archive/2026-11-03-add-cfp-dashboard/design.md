# Design

## Context

The CFP platform consists of an Angular 21 frontend and a NestJS backend monorepo managed with Nx. Currently, `CfpFormComponent` allows speakers to submit talk proposals, while the backend `CfpController` and `CfpService` store proposals in-memory.

The backend already has `findAll()` in `CfpService` and a `@Get()` handler in `CfpController`, but the frontend currently lacks a view and service method to fetch and display these proposals.

See `proposal.md` for motivation and background.

## Goals / Non-Goals

**Goals:**
- Implement `getProposals()` in frontend `CfpService` consuming `GET /api/cfp`.
- Create a standalone `CfpDashboardComponent` in Angular 21 utilizing Angular Signals (`WritableSignal<SpeakerDTO[]>`) for state management.
- Build an accessible semantic HTML view (data table or cards) displaying speaker proposals (name, email, talk title, GDE badge).
- Match the visual design tokens, typography, and color palette of `CfpFormComponent`.
- Configure routing for `/dashboard` in `app.routes.ts` and add navigation buttons between `/cfp` and `/dashboard`.
- Provide comprehensive unit tests for backend endpoint, frontend service, and dashboard component.

**Non-Goals:**
- Persistent database storage (in-memory backend storage matches current application scope).
- Filtering, sorting, pagination, or search functionality.
- Editing or deleting existing talk proposals.

## Decisions

### Decision 1: UI Presentation (Semantic Table with Responsive Fallback)
- **Choice**: Implement a semantic HTML table (`<table>`, `<caption>`, `<th scope="col">`, `<tbody>`) styled with the existing design tokens, wrapped in a responsive card container. If on mobile, table allows horizontal scroll or cleanly wraps cells.
- **Rationale**: A semantic table provides natural screen-reader navigation and accessible tabular data alignment for structured records (Name, Email, Talk Title, GDE status).
- **Alternative Considered**: Plain card list. While modern, a structured table with captions and scoped headers provides superior semantic accessibility for listing tabular data, and can be easily styled with the platform's card container.

### Decision 2: Reactive State Management with Signals
- **Choice**: Use Angular Signals:
  - `readonly proposals = signal<SpeakerDTO[]>([]);`
  - `readonly isLoading = signal<boolean>(true);`
  - `readonly errorMessage = signal<string | null>(null);`
- **Rationale**: Fulfills the requirement for `WritableSignal<SpeakerDTO[]>` and represents modern Angular 21 idiomatic patterns. Signals eliminate async pipe boilerplate and provide fine-grained reactivity.
- **Alternative Considered**: RxJS Observables with `async` pipe in the template. Rejected because the explicit requirement specifies Signals (`WritableSignal<SpeakerDTO[]>`).

### Decision 3: Service Layer Communication
- **Choice**: Add `getProposals(): Observable<SpeakerDTO[]>` to `frontend/src/app/cfp/cfp.service.ts` invoking `this.http.get<SpeakerDTO[]>(this.apiUrl)`. The dashboard component injects `CfpService` and loads proposals during initialization (`ngOnInit`).
- **Rationale**: Preserves clean architecture separation of concerns and facilitates isolated unit testing with mock services.
- **Alternative Considered**: Direct `HttpClient` calls in `CfpDashboardComponent`. While the prompt mentions injecting `HttpClient`, delegating to `CfpService` (which injects `HttpClient`) follows established repository conventions and makes tests cleaner. We can also allow injecting `HttpClient` or `CfpService`.

### Decision 4: Visual Consistency & Design Tokens
- **Choice**: Direct reuse of CSS design tokens established in `cfp-form.component.css`:
  - Container: Max width 800px, `#ffffff` background, `border-radius: 8px`, box shadow `0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)`.
  - Palette: `#111827` (headings), `#4b5563` (subtitles/secondary), `#2563eb` (primary blue buttons, focus outline, links), `#f9fafb` (table header background), `#e5e7eb` (borders).
  - GDE Badge: Pill badge with `#eff6ff` background, `#1d4ed8` text, and `border: 1px solid #bfdbfe`.
  - Navigation Buttons: Styled using the `.submit-btn` token (`background-color: #2563eb`, hover `#1d4ed8`, rounded corners, accessible focus ring).

## Risks / Trade-offs

- **[In-memory data reset]** → Backend data resets when the server restarts.
  - *Mitigation*: Expected for current monorepo prototype stage; does not hinder dashboard functionality.
- **[Empty list on initial start]** → When no proposals are submitted, an empty table looks broken.
  - *Mitigation*: Implement an explicit, accessible empty state message with a direct link/button to submit a proposal.
- **[Network failure handling]** → Backend unavailability could leave the user stranded.
  - *Mitigation*: Provide an accessible error banner with `role="alert"` and a "Try Again" retry button.

