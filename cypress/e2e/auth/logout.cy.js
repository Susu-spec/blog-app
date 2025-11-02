describe('Log out flow', () => {
    let userData;
    beforeEach(() => {
        cy.fixture('users.json').then((data) => {
            userData = data;
        });
    })

    it('should log out of the application', () => {
        cy.login({
            email: userData.validUser.email,
            password: userData.validUser.password
        });

        cy.intercept('POST', '**/auth/v1/logout?scope=global', {
            statusCode: 200,
            body: {},
        }).as('logoutSuccess');

        cy.get('[data-cy="logout-button-mobile"]').click();

        cy.get('[data-cy="logout-button-mobile"]').should('not.exist');
        cy.contains(/logged out/i).should('be.visible');
    })

    it('should handle network failure during logout', () => {
        cy.login({
            email: userData.validUser.email,
            password: userData.validUser.password
        });
        
        cy.intercept('POST', '**/auth/v1/logout?scope=global', {
            forceNetworkError: true,
        }).as('logoutFail');
        
        cy.get('[data-cy="logout-button-mobile"]').click();
        cy.wait('@logoutFail')
        
        cy.contains(/network error/i).should('be.visible');
    })

})