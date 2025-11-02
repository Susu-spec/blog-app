describe('Sign up Flow', () => {
    let userData;
        
    beforeEach(() => {
        cy.fixture('users.json').then((data) => {
            userData = data;
        });
    });

    it('should create a new user account (happy path)', () => {
        const max = 100, min = 1;
        const uniqueId = Math.floor(Math.random() * (max - min + 1)) + min;
        const name = `User${uniqueId}`
        const email = `user${uniqueId}@gmail.com`;
        const password = 'Password123';

        cy.fillSignUpForm({
            name: name,
            email: email,
            password: password
        })

        cy.url().should('eq', `${Cypress.config().baseUrl}/login`);

        cy.contains("Login").should('exist');

    })


    it('shows error for duplicate email (sad path)', () => {
        cy.intercept('POST', '**/auth/v1/signup', {
            statusCode: 400,
            body: {
                message: 'User already registered',
            },
        }).as('signupFail');

        cy.fillSignUpForm({
            name: "Existing User",
            email: userData.validUser.email,
            password: userData.validUser.password
        });

        cy.wait('@signupFail');

        cy.contains(/email already in use/i).should('be.visible');
    })


    it('should handle network failure (sad path)', () => {
        cy.intercept('POST', '**/auth/v1/signup', { forceNetworkError: true }).as('networkFail');

        cy.fillSignUpForm({
            name: "Existing User",
            email: userData.randomUser.email,
            password: userData.randomUser.password
        });

        cy.wait('@networkFail');

        cy.contains(/failed to fetch/i).should('be.visible')
    })
})