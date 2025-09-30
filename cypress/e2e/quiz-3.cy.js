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

  // Test Case 4: Login dengan username dan password yang keduanya tidak valid
  it("Login dengan username dan password yang keduanya tidak valid", () => {
    cy.visit(orangeUrl);
    cy.get('input[name="username"]').type("invaliduser"); // username tidak valid
    cy.get('input[name="password"]').type("wrongpassword"); // password tidak valid
    cy.get('button[type="submit"]').click();
    cy.contains("Invalid credentials").should("be.visible");
  });

  //   Test Case 5: Login dengan username yang kosong
  it("Login dengan username yang kosong", () => {
    cy.visit(orangeUrl);
    cy.get('input[name="password"]').type("admin123");
    cy.get('button[type="submit"]').click();
    cy.contains("Required").should("be.visible");
  });

  //   Test Case 6: Login dengan password yang kosong
  it("Login dengan password yang kosong", () => {
    cy.visit(orangeUrl);
    cy.get('input[name="username"]').type("Admin");
    cy.get('button[type="submit"]').click();
    cy.contains("Required").should("be.visible");
  });

  // Test Case 7: Login dengan username dan password yang kosong
  it("Login dengan username dan password yang kosong", () => {
    cy.visit(orangeUrl);
    cy.get('button[type="submit"]').click();
    cy.contains("Required").should("be.visible");
  });

  //   Test Case 8: Memeriksa case sensitivity username (Bug: sistem tidak case-sensitive!)
  it("Login dengan username huruf kecil - UNEXPECTED: berhasil login", () => {
    cy.visit(orangeUrl);
    cy.get('input[name="username"]').type("admin"); // huruf kecil
    cy.get('input[name="password"]').type("admin123"); // password tetap benar
    cy.get('button[type="submit"]').click();

    // EXPECTED: Seharusnya gagal, tapi ternyata berhasil (bug!)
    cy.url().should("include", "/dashboard");
    cy.contains("Dashboard").should("be.visible");
  });

  // Test Case 9: Memeriksa case sensitivity password
  it("Login dengan password case berbeda - seharusnya gagal", () => {
    cy.visit(orangeUrl);
    cy.get('input[name="username"]').type("Admin");
    cy.get('input[name="password"]').type("Admin123"); // huruf besar di awal
    cy.get('button[type="submit"]').click();
    cy.contains("Invalid credentials").should("be.visible");
  });

  // Test Case 10: Username dengan spasi di awal/akhir
  it("Login dengan username yang mengandung spasi", () => {
    cy.visit(orangeUrl);
    cy.get('input[name="username"]').type(" Admin "); // dengan spasi
    cy.get('input[name="password"]').type("admin123");
    cy.get('button[type="submit"]').click();
    cy.contains("Invalid credentials").should("be.visible");
  });
});
