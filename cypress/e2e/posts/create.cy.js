describe("Create a Post", () => {
    let userData, newPost;

    before(() => {
        cy.fixture('users.json').then((data) => {
            userData = data.validUser;
        })

        newPost = {
            id: "1",
            title: "New Post",
            description: "New Post Description",
            cover_image: "cypress/fixtures/blue-space.jpg",
            content: "This is new content."
        }
    })

    it("should fill and create a post successfully", () => {

        cy.login({
            email: userData.email,
            password: userData.password
        })

        cy.fillPostForm({
            title: newPost.title,
            description: newPost.description,
            cover_image: newPost.cover_image,
            content: newPost.content
        })

        cy.intercept('POST', '**/rest/v1/posts*').as('createPost');

        cy.get('[data-cy="create-post-button"]').click();

        cy.wait("@createPost");
        cy.get('[data-cy=post-card]').should('exist');
        cy.contains('New Post').should('be.visible');
        cy.contains('New Post Description').should('be.visible');
    })

    it('shows error when network fails during post creation', () => {
        cy.login({
            email: userData.email,
            password: userData.password
        })

        cy.fillPostForm({
            title: newPost.title,
            description: newPost.description,
            cover_image: newPost.cover_image,
            content: newPost.content
        })

        cy.intercept('POST', '**/rest/v1/posts*', { forceNetworkError: true }).as('createPostFail');
        cy.get('[data-cy="create-post-button"]').click();
        cy.wait('@createPostFail');
        cy.contains(/network error/i).should('be.visible');
    });

    it('shows validation errors when fields are empty', () => {
        cy.login({
            email: userData.email,
            password: userData.password
        })

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
        cy.login({ 
            email: userData.email, 
            password: userData.password 
        });
        cy.get('[data-cy="create-post-nav-mobile"]').click();

        cy.get('[data-cy="create-post-button"]').should('be.disabled');

        cy.fillPostForm({
            title: newPost.title,
            description: newPost.description,
            cover_image: newPost.cover_image,
            content: newPost.content
        });

        cy.get('[data-cy="create-post-button"]').should('not.be.disabled');
    });

    it('shows a conflict message when a post with the same title already exists', () => {
        cy.login({ 
            email: userData.email, 
            password: userData.password 
        });

        cy.get('[data-cy="create-post-nav-mobile"]').click();

        cy.fillPostForm({
            title: newPost.title,
            description: newPost.description,
            cover_image: newPost.cover_image,
            content: newPost.content
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