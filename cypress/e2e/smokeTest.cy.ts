describe('Smoke Test', () => {
  it("Doesn't explode", () => {
    cy.visit('http://localhost:5173')
    cy.contains('💩 ➡ 🪭')

    cy.contains('Flashcards').click()
    cy.contains('All of the flashcards we currently support.')
  })
})
