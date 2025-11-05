describe('Home Page - Authenticated', () => {
  let userData;

  before(() => {
    cy.fixture('users.json').then((data) => {
      userData = data.validUser;
    });
  });

  it('should show a list of posts when available (happy path)', () => {
    cy.fixture('existing-post.json').then((posts) => {
      cy.intercept('GET', '**/rest/v1/posts*', {
        statusCode: 200,
        body: [posts],
      }).as('getPosts');

      cy.login({
        email: userData.email,
        password: userData.password,
      });

      cy.url().should('eq', Cypress.config().baseUrl + "/")
      cy.wait('@getPosts');
      cy.get('[data-cy=post-card]').should('exist');
    });
  });

  it('shows empty state when there are no posts (sad path)', () => {
    cy.login({
        email: userData.email,
        password: userData.password,
      });

    cy.url().should('eq', Cypress.config().baseUrl + "/")
    cy.intercept('GET', '**/rest/v1/posts*', { body: [] }).as('getEmptyPosts');

    cy.wait('@getEmptyPosts');
    cy.contains(/no posts available/i).should('be.visible');
  });

  it('shows network error message when request fails (sad path)', () => {
    cy.login({
        email: userData.email,
        password: userData.password,
      });

    cy.url().should('eq', Cypress.config().baseUrl + "/")
    cy.intercept('GET', '**/rest/v1/posts*', { forceNetworkError: true }).as('getNetworkFail');

    cy.wait('@getNetworkFail');
    cy.contains(/network error/i).should('be.visible');
  });

  it('shows error message when API returns 500 (sad path)', () => {
    cy.login({
        email: userData.email,
        password: userData.password,
      });

    cy.url().should('eq', Cypress.config().baseUrl + "/")
    cy.intercept('GET', '**/rest/v1/posts*', {
      statusCode: 500,
      body: { message: 'Internal Server Error' },
    }).as('getPostsFail');

    cy.wait('@getPostsFail');
    cy.contains(/an error occured/i).should('be.visible');
  });
});
