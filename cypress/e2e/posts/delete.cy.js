describe("Delete a Post", () => {
    let userData, randomUser, existingPost;

    before(() => {
        cy.fixture("users.json").then((data) => {
            userData = data.validUser;
            randomUser = data.randomUser;
        });

        cy.fixture("existing-post.json").then((data) => {
            existingPost = data;
        });
    });

    it("should allow a user to delete their own post", () => {
        cy.login({ email: userData.email, password: userData.password })

        cy.intercept("GET", "**/rest/v1/posts*", {
            statusCode: 200,
            body: [existingPost],
        }).as("getMyPosts");
        cy.get('[data-cy="my-posts-button"]').click();
        cy.wait("@getMyPosts");

        cy.intercept("DELETE", "**/rest/v1/posts*", {
            body: [],
        }).as("deletePost");

        cy.get('[data-cy="delete-post-trigger"]').click();
        cy.intercept("GET", "**/rest/v1/posts*", {
            body: [],
        }).as("afterDeleteFetch");


        cy.contains(/are you sure want to delete this post\?/i).should("be.visible");
        cy.get('[data-cy="delete-post-button"]').click();
        cy.contains(/post deleted/i).should("be.visible")
        cy.wait("@afterDeleteFetch");

        cy.contains(existingPost.title).should("not.exist");
    });

    it("should prevent a user from deleting another user's post", () => {
        cy.login({
            email: randomUser.email,
            password: randomUser.password,
        });

        cy.intercept("GET", "**/rest/v1/posts*", {
            statusCode: 200,
            body: [existingPost],
        }).as("getOtherPosts");
        cy.get('[data-cy="my-posts-button"]').click();
        cy.wait("@getOtherPosts");

        cy.contains(existingPost.title).should("exist");

        cy.get('[data-cy="delete-post-trigger"]').should("not.exist");
    });

    it("should show an error toast if delete fails", () => {
        cy.login({
            email: userData.email,
            password: userData.password,
        });

        cy.intercept("GET", "**/rest/v1/posts*", {
            statusCode: 200,
            body: [existingPost],
        }).as("getMyPosts");

        cy.get('[data-cy="my-posts-button"]').click();
        cy.wait("@getMyPosts");

        cy.intercept("DELETE", "**/rest/v1/posts*", {
            statusCode: 403,
            body: { message: "Forbidden" },
        }).as("deletePostFail");

        cy.get('[data-cy="delete-post-trigger"]').click();
        cy.contains(/are you sure want to delete this post\?/i).should("be.visible");
        cy.get('[data-cy="delete-post-button"]').click();
        cy.wait("@deletePostFail");
        cy.contains(/error/i).should("be.visible");
        cy.contains(existingPost.title).should("exist");
    });
});
