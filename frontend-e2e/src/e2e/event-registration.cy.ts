describe('Event registration (/event/new)', () => {
  beforeEach(() => {
    cy.visit('/event/new');
  });

  it('registers a new event successfully', () => {
    cy.get('#event-name').type('Tech Conference 2026');
    cy.get('#event-address').type('Av. Paulista, 1000 - Sao Paulo');
    cy.get('input[name="capacity"]').type('250');
    cy.get('input[name="date"]').type('2026-12-10');

    cy.get('#submit-event-btn').click();

    cy.get('.status-success').should('be.visible');
    cy.contains('Event registered successfully!').should('be.visible');
    cy.get('#event-name').should('have.value', '');
  });

  it('shows native validation messages when submitting an empty form', () => {
    cy.get('#submit-event-btn').click();

    cy.get('#event-form').then(($form) => {
      expect(($form[0] as HTMLFormElement).checkValidity()).to.equal(false);
    });

    cy.get('#event-name:invalid').should('exist');
    cy.get('#event-address:invalid').should('exist');
    cy.get('#event-capacity:invalid').should('exist');
    cy.get('#event-date:invalid').should('exist');

    ['#event-name', '#event-address', '#event-capacity', '#event-date'].forEach((selector) => {
      cy.get(selector).then(($input) => {
        expect(($input[0] as HTMLInputElement).validationMessage).to.have.length.greaterThan(0);
      });
    });

    cy.contains('Event registered successfully!').should('not.exist');
  });
});
