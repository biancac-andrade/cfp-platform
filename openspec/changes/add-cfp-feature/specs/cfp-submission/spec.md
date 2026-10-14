# Spec Delta: CFP Submission

## Purpose

Enables prospective speakers to submit talk proposals for conferences with strict data validation, reactive state feedback, and full accessibility support.

## ADDED Requirements

### Requirement: Speaker Talk Submission API
The backend system SHALL provide an API endpoint to receive and validate talk proposal submissions according to the SpeakerDTO contract.

#### Scenario: Valid speaker proposal submission
- **WHEN** client submits a POST request with a valid SpeakerDTO payload containing valid name, email, talkTitle, and isGDE
- **THEN** backend accepts the proposal, returns HTTP 201 Created, and returns the registered speaker record

#### Scenario: Rejection of invalid speaker proposals
- **WHEN** client submits a POST request with missing required fields, invalid email format, or invalid data types
- **THEN** backend rejects the request with HTTP 400 Bad Request and provides structured validation error messages

### Requirement: Accessible CFP Submission Form
The frontend SHALL provide an accessible form using WAI-ARIA standards and Angular Signals for reactive state and button disabling.

#### Scenario: Initial form and signal state
- **WHEN** user navigates to the CFP submission form
- **THEN** the initial signal state indicates unsubmitted/idle, form controls are empty, and the submit button is disabled

#### Scenario: Form validation and submission button enabling
- **WHEN** user inputs valid values for name, email, talkTitle, and isGDE
- **THEN** form signals update to valid, the submit button becomes enabled, and assistive technologies receive appropriate validity states

#### Scenario: Accessible error feedback
- **WHEN** a required field is blurred or submitted with invalid data
- **THEN** the input element sets aria-invalid="true" and references error text using aria-describedby
