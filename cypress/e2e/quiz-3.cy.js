describe("OrangeHRM Login Feature", () => {
  const orangeUrl =
    "https://opensource-demo.orangehrmlive.com/web/index.php/auth/login";

  // Test Case 1: Login dengan kredensial yang valid
  it("Login dengan kredensial yang valid", () => {
    cy.visit(orangeUrl);
    cy.get('input[name="username"]').type("Admin");
    cy.get('input[name="password"]').type("admin123");
    cy.get('button[type="submit"]').click();
    cy.url().should("include", "/dashboard");
    cy.contains("Dashboard").should("contain", "Dashboard");
  });

  // Test Case 2: Login dengan username yang tidak valid
  it("Login dengan username yang tidak valid", () => {
    cy.visit(orangeUrl);
    cy.get('input[name="username"]').type("invaliduser");
    cy.get('input[name="password"]').type("admin123");
    cy.get('button[type="submit"]').click();
    cy.contains("Invalid credentials").should("be.visible");
  });

  // Test Case 3: Login dengan password yang tidak valid
  it("Login dengan password yang tidak valid", () => {
    cy.visit(orangeUrl);
    cy.get('input[name="username"]').type("Admin");
    cy.get('input[name="password"]').type("wrongpass");
    cy.get('button[type="submit"]').click();
    cy.contains("Invalid credentials").should("be.visible");
  });

  // Test Case 4: Login dengan username dan password yang kosong
  it("Login dengan username dan password yang kosong", () => {
    cy.visit(orangeUrl);
    cy.get('button[type="submit"]').click();
    cy.contains("Required").should("be.visible");
  });
});
