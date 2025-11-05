describe("Edit a Post", () => {
  let userData, existingPost, updatedPost;

  before(() => {
    cy.fixture("users.json").then((data) => {
      userData = data.validUser;
    });

    cy.fixture("existing-post.json").then((data) => {
      existingPost = data;
    })

    cy.fixture("updated-post.json").then((data) => {
      updatedPost = data;
    })
  });

  beforeEach(() => {
    cy.login({
      email: userData.email,
      password: userData.password,
    });

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
  })

  it("should edit and update a post successfully", () => {
    cy.intercept('PATCH', `**/rest/v1/posts?**id=eq.${existingPost.id}**`, {
      statusCode: 200,
      body: [updatedPost],
    }).as('updatePost');

    cy.get('[data-cy="my-posts-button"]').click();
    cy.wait('@getMyPosts')
    cy.get('[data-cy="post-card"]').first().click();
    cy.wait('@getPostDetail');

    cy.get('[data-cy="edit-post-button"]').click();
    cy.fillPostForm({
      title: updatedPost.title,
      description: updatedPost.description,
      cover_image: updatedPost.cover_image,
      content: "Updated content from Cypress test.",
    });

    cy.get('[data-cy="create-post-button"]').click();
    cy.wait('@updatePost').its('response.statusCode').should('eq', 200);

    cy.contains(updatedPost.title).should('be.visible');
    cy.contains(updatedPost.description).should('be.visible');
  });


  it("shows error when network fails during post update", () => {
    cy.get('[data-cy=my-posts-button]').click();
    cy.get('[data-cy=post-card]').click();

    cy.get('[data-cy="edit-post-button"]').click();

    cy.fillPostForm({
      title: updatedPost.title,
      description: updatedPost.description,
      cover_image: updatedPost.cover_image,
      content: "Updated content from Cypress test.",
    });

    cy.intercept("PATCH", "**/rest/v1/posts*", { forceNetworkError: true }).as(
      "updatePostFail"
    );

    cy.get('[data-cy="create-post-button"]').click();
    cy.wait("@updatePostFail");
    cy.contains(/network error/i).should("be.visible");
  });

  it("shows validation errors when fields are cleared", () => {
    cy.intercept('GET', '**/rest/v1/posts?*slug=eq.*', {
      statusCode: 200,
      body: {
        ...existingPost,
        title: "",
        description: "",
        content: "[]",
        cover_image: "",
      },
    }).as('getEmptyPostDetail');
    cy.get('[data-cy=my-posts-button]').click();
    cy.get('[data-cy=post-card]').click();
    // Adding an empty post detail interception empties the content for this test
    // A `beforeEach` set of commands was added at the top to run before every test
    // This interception overrides that
    cy.wait('@getEmptyPostDetail')

    cy.get('[data-cy="edit-post-button"]').click();

    cy.get('textarea[name="title"]').clear().blur();
    cy.contains(/title is required/i).should("be.visible");

    cy.get('textarea[name="description"]').clear().blur();
    cy.contains(/description is required/i).should("be.visible");

    cy.get('input[type="file"]').selectFile([]);
    cy.contains(/cover image url is required/i).should("be.visible");

    cy.get('[data-cy="editor"]').find('[contenteditable="true"]').clear().blur();
    cy.contains(/content is required/i).should("be.visible");
  });

  it("disables the edit button when fields are invalid", () => {
    cy.get('[data-cy=my-posts-button]').click();
    cy.get('[data-cy=post-card]').click();

    cy.get('[data-cy="edit-post-button"]').click();
    cy.get('[data-cy="create-post-button"]').should("be.disabled");

    cy.fillPostForm({
      title: updatedPost.title,
      description: updatedPost.description,
      cover_image: updatedPost.cover_image,
      content: "Updated content from Cypress test.",
    });

    cy.get('[data-cy="create-post-button"]').should("not.be.disabled");
  });
});
