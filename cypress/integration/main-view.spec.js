describe("ventana principal", () => {
  it("Tiene encabezado correcto y en español por defecto", () => {
    cy.visit("http://localhost:4200");
    cy.contains("Whishlist");
    cy.get("h1 b").should("contain", "HOLAes");
  });
});
