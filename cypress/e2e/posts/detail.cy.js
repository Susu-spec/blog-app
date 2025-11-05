describe('View Post Detail', () => {
    let userData, existingPost;

    before(() => {
        cy.fixture('users.json').then((data) => {
            userData = data.validUser;
        })

        cy.fixture('existing-post.json').then((data) => {
            existingPost = data;
        })
    })

    it("display post content and author", () => {
        cy.login({
            email: userData.email,
            password: userData.password
        })
        cy.intercept(
            'GET',
            '**/rest/v1/posts?select=*%2Cauthor%3Aauthor_id%28name%29*&author_id=eq.*&order=created_at.desc',
            {
                statusCode: 200,
                body: [existingPost],
            }
        ).as('getMyPosts');

        cy.intercept('GET', `**/rest/v1/posts?*slug=eq.*`, {
            statusCode: 200,
            body: existingPost,
        }).as('getPostDetail');

        cy.get('[data-cy="my-posts-button"]').click();
        cy.wait('@getMyPosts')
        cy.url().should('eq', Cypress.config().baseUrl + "/my-posts");
        cy.get('[data-cy="post-card"]').first().click();
        cy.wait('@getPostDetail');
        cy.url().should('eq', Cypress.config().baseUrl + `/posts/${existingPost.slug}`);
        cy.contains(existingPost.title).should('be.visible');
        cy.contains(existingPost.author.name).should('be.visible');

    })

    // it("redirects unauthenticated users when accessing a protected post", () => {
    //     cy.visit('/')

    //     cy.get('[data-cy="home-button"]').click();
    //     cy.get('[data-cy="create-post-nav-mobile"]').click();

    //     cy.url().should('include', '/login');
    //     cy.contains(/please sign in/i).should('be.visible');
    // });


})