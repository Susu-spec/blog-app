describe('My Posts', () => {
    let userData;

    before(() => {
            cy.fixture('users.json').then((data) => {
            userData = data.validUser;
        });
    });

    it("should show a list of user's posts when available", () => {
        cy.fixture('posts.json').then((posts) => {
            cy.intercept('GET', '**/rest/v1/posts?select=*&author_id=eq*', {
                statusCode: 200,
                body: posts
            }).as('getMyPosts');

            cy.login({
                email: userData.email,
                password: userData.password
            })

            cy.get('[data-cy="my-posts-button"]').click();
            cy.url().should('eq', Cypress.config().baseUrl + "/my-posts");
            cy.wait('@getMyPosts');

            cy.contains('Title').should('be.visible');
            cy.contains('Description').should('be.visible');
            cy.contains('Suwayba').should('be.visible');
            cy.get('[data-cy=post-card]').should('exist');
        })
    })

    it('shows empty state when there are no posts (sad path)', () => {
        cy.login({
            email: userData.email,
            password: userData.password,
        });

        cy.get('[data-cy="my-posts-button"]').click();
        cy.url().should('eq', Cypress.config().baseUrl + "/my-posts")
        cy.intercept('GET', '**/rest/v1/posts?select=*&author_id=eq*', { body: [] }).as('getEmptyPosts');

        cy.wait('@getEmptyPosts');
        cy.contains(/no posts available/i).should('be.visible');
    });

    it('shows network error message when request fails (sad path)', () => {
        cy.login({
            email: userData.email,
            password: userData.password,
        });

        cy.get('[data-cy="my-posts-button"]').click();
        cy.url().should('eq', Cypress.config().baseUrl + "/my-posts")
        cy.intercept('GET', '**/rest/v1/posts?select=*&author_id=eq*', { forceNetworkError: true }).as('getNetworkFail');

        cy.wait('@getNetworkFail');
        cy.contains(/network error/i).should('be.visible');
    });

    it('shows error message when API returns 500 (sad path)', () => {
        cy.login({
            email: userData.email,
            password: userData.password,
        });

        cy.get('[data-cy="my-posts-button"]').click();
        cy.url().should('eq', Cypress.config().baseUrl + "/my-posts");
        cy.intercept('GET', '**/rest/v1/posts*', {
            statusCode: 500,
            body: { message: 'Internal Server Error' },
        }).as('getMyPostsFail');

        cy.wait('@getMyPostsFail');
        cy.contains(/an error occured/i).should('be.visible');
    });
});