describe('Login Flow', () => {
  let userData;

    beforeEach(() => {
        cy.fixture('users.json').then((data) => {
            userData = data;
        });
    });

    it('should log in to the application (happy path)', () => {
        cy.login({
            email: userData.validUser.email,
            password: userData.validUser.password,
        });

        cy.url().should("eq", Cypress.config().baseUrl + "/");
        cy.contains(/now/i).should('exist');
    });

    it('shows error for invalid email or password (sad path)', () => {
        cy.intercept('POST', '**/auth/v1/token?grant_type=password', {
            statusCode: 400,
            body: { message: 'Invalid login credentials' },
        }).as('credentialFail');

        cy.login({
            email: userData.invalidUser.email,
            password: userData.invalidUser.password,
        });

        cy.wait('@credentialFail');
        cy.contains(/invalid credentials/i).should('be.visible');
    });

  it('should handle network failure (sad path)', () => {
    cy.intercept('POST', '**/auth/v1/token?grant_type=password', {
        forceNetworkError: true,
    }).as('networkFail');

    cy.login({
        email: userData.validUser.email,
        password: userData.validUser.password,
    });

    cy.wait('@networkFail');
    cy.contains(/network error/i).should('be.visible');
  });

    it('should handle rate limit exceeded (sad path)', () => {
        cy.intercept('POST', '**/auth/v1/token?grant_type=password', {
            statusCode: 429,
            body: { message: 'Rate limit exceeded' },
        }).as('rateLimitedLogin');

        cy.login({
            email: userData.validUser.email,
            password: userData.validUser.password,
        });

        cy.wait('@rateLimitedLogin');
        cy.contains(/too many attempts|rate limit exceeded/i).should('be.visible');
    });
});
