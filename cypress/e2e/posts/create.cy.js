describe("Create a Post", () => {
    let userData, newPost;

    before(() => {
        cy.fixture('users.json').then((data) => {
            userData = data.validUser;
        });

        cy.fixture("existing-post.json").then((data) => {
            newPost = data;
        })
    });


    beforeEach(() => {
        cy.login({
            email: userData.email,
            password: userData.password
        });
        cy.get('[data-cy="create-post-nav-mobile"]').click();
        cy.url().should('eq', Cypress.config().baseUrl + "/post/create");
        cy.contains(/create a new post/i).should('exist');
    });


    it("should fill and create a post successfully", () => {
        cy.fillPostForm({
            title: newPost.title,
            description: newPost.description,
            cover_image: "cypress/fixtures/blue-space.jpg",
            content: "Updated content from Cypress test.",
        })

        cy.intercept('POST', '**/rest/v1/posts*', {
            statusCode: 201,
            body: [newPost]
        }).as('createPost');
        cy.intercept(
            'GET',
            '**/rest/v1/posts?select=*%2Cauthor%3Aauthor_id%28name%29*&author_id=eq.*&order=created_at.desc',
            {
                statusCode: 200,
                body: [newPost],
            }
        ).as('getMyPosts');

        cy.get('[data-cy="create-post-button"]').click();

        cy.wait("@createPost");
        cy.get('[data-cy=post-card]').should('exist');
    });


    it('shows error when network fails during post creation', () => {
        cy.fillPostForm({
            title: newPost.title,
            description: newPost.description,
            cover_image: "cypress/fixtures/blue-space.jpg",
            content: "Updated content from Cypress test.",
        })

        cy.intercept('POST', '**/rest/v1/posts*', { forceNetworkError: true }).as('createPostFail');
        cy.get('[data-cy="create-post-button"]').click();
        cy.wait('@createPostFail');
        cy.contains(/network error/i).should('be.visible');
    });


    it('shows validation errors when fields are empty', () => {
        cy.get('[data-cy="create-post-nav-mobile"]').click();
        cy.get('textarea[name="title"]').focus().blur();
        cy.contains(/title is required/i).should('be.visible');

        cy.get('textarea[name="description"]').focus().blur();
        cy.contains(/description is required/i).should('be.visible');

        cy.get('input[name="cover_image"]').focus().blur();
        cy.contains(/cover image url is required/i).should('be.visible');

        cy.get('[data-cy="editor"]').find('[contenteditable="true"]').focus().blur();
        cy.contains(/Content is required/i).should('be.visible');
    });



    it('disables the create button when required fields are empty', () => {
        cy.get('[data-cy="create-post-nav-mobile"]').click();

        cy.get('[data-cy="create-post-button"]').should('be.disabled');

        cy.get('[data-cy="create-post-nav-mobile"]').click();
        cy.url().should('eq', Cypress.config().baseUrl + "/post/create");
        cy.contains(/create a new post/i).should('exist');
        cy.fillPostForm({
            title: newPost.title,
            description: newPost.description,
            cover_image: "cypress/fixtures/blue-space.jpg",
            content: "Updated content from Cypress test.",
        });

        cy.get('[data-cy="create-post-button"]').should('not.be.disabled');
    });



    it('shows a conflict message when a post with the same title already exists', () => {
        cy.fillPostForm({
            title: newPost.title,
            description: newPost.description,
            cover_image: "cypress/fixtures/blue-space.jpg",
            content: "Updated content from Cypress test.",
        });

        cy.intercept('POST', '**/rest/v1/posts*', {
            statusCode: 409,
            body: { message: 'duplicate key value violates unique constraint "posts_slug_key"' },
        }).as('duplicatePost');

        cy.get('[data-cy="create-post-button"]').click();
        cy.wait('@duplicatePost');
        cy.contains(/already exists/i).should('be.visible');
    });

})