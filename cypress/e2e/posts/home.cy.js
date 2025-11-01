describe('Home Page', () => {
  it('passes', () => {
    cy.visit('http://localhost:5173/'),
    cy.contains("Now")
  })
})