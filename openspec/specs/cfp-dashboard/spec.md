# CFP Dashboard Specification

## Purpose

Provides an accessible dashboard interface and backend retrieval endpoint allowing organizers and attendees to view and track submitted CFP talk proposals.

## Requirements

### Requirement: Speaker Proposals Retrieval API
The backend system SHALL provide an API endpoint to retrieve all submitted talk proposals as an array of speaker records.

#### Scenario: Retrieve all proposals successfully
- **WHEN** client issues a GET request to `/api/cfp`
- **THEN** backend responds with HTTP 200 OK and a JSON array containing all registered speaker proposals conforming to the SpeakerDTO contract

### Requirement: Accessible CFP Dashboard View
The frontend SHALL provide an accessible dashboard component displaying submitted talk proposals using semantic HTML, reactive Angular Signals, and established design tokens.

#### Scenario: Successful display of submitted proposals
- **WHEN** user navigates to the dashboard and proposals are successfully loaded
- **THEN** proposals are rendered in semantic HTML (table or card list) displaying speaker name, email, talk title, and GDE status with design tokens matching the CFP form

#### Scenario: Empty state presentation
- **WHEN** user navigates to the dashboard and no proposals exist
- **THEN** the dashboard displays an accessible empty state notification indicating no proposals have been submitted yet

#### Scenario: Error state notification
- **WHEN** proposal retrieval fails due to a network or server error
- **THEN** the dashboard renders an accessible error alert with `role="alert"` communicating the failure

### Requirement: CFP Platform Dashboard Navigation
The application SHALL provide accessible routing and navigation controls between the CFP submission form and the proposals dashboard.

#### Scenario: Navigation from submission form to dashboard
- **WHEN** user activates the dashboard navigation control on the CFP submission form
- **THEN** the router navigates to `/dashboard` without full page reload

#### Scenario: Navigation from dashboard to submission form
- **WHEN** user activates the form navigation control on the dashboard
- **THEN** the router navigates back to `/cfp` without full page reload
