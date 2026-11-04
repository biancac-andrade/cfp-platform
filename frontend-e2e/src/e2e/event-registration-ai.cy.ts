describe('Event registration with AI (cy.prompt)', () => {
  beforeEach(() => {
    cy.visit('/event/new');
  });

  it('registers a new event using natural language steps', () => {
    cy.prompt([
      'Type "Tech Conference 2026" in the Event Name input',
      'Type "Av. Paulista, 1000 - Sao Paulo" in the Address input',
      'Type "250" in the Capacity input',
      'Type "2026-12-10" in the Date input',
      'Click the "Register Event" button',
      'Verify that the message "Event registered successfully!" is visible',
    ]);
  });

  it('validates required fields when submitting an empty form using natural language steps', () => {
    cy.prompt([
      'Click the "Register Event" button without filling any fields',
      'Verify that the Event Name, Address, Capacity, and Date inputs are invalid',
      'Verify that "Event registered successfully!" is not visible on the page',
    ]);
  });
});
