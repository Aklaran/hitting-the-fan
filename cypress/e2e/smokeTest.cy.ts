describe('Smoke Test', () => {
  it('Loads the page', () => {
    cy.visit('http://localhost:5173')
    cy.contains('💩 ➡ 🪭')
  })
})
