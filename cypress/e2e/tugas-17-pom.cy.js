import Login from "../pageObject/loginPage";

describe("OrangeHRM Login Feature", () => {
  const login = new Login();

  // Test Case 1: Login dengan kredensial yang valid
  it("Login dengan kredensial yang valid", () => {
    login.visitLoginPage();
    login.fillUsername("Admin");
    login.fillPassword("admin123");
    login.submit();
    login.successfulLogin();
  });

  // Test Case 2: Login dengan username yang tidak valid
  it("Login dengan username yang tidak valid", () => {
    login.visitLoginPage();
    login.fillUsername("invaliduser");
    login.fillPassword("admin123");
    login.submit();
    login.invalidCredentialsMessage();
  });

  // Test Case 3: Login dengan password yang tidak valid
  it("Login dengan password yang tidak valid", () => {
    login.visitLoginPage();
    login.fillUsername("Admin");
    login.fillPassword("wrongpass");
    login.submit();
    login.invalidCredentialsMessage();
  });

  // Test Case 4: Login dengan username dan password yang keduanya tidak valid
  it("Login dengan username dan password yang keduanya tidak valid", () => {
    login.visitLoginPage();
    login.fillUsername("invaliduser"); // username tidak valid
    login.fillPassword("wrongpassword"); // password tidak valid
    login.submit();
    login.invalidCredentialsMessage();
  });

  //   Test Case 5: Login dengan username yang kosong
  it("Login dengan username yang kosong", () => {
    login.visitLoginPage();
    login.fillPassword("admin123");
    login.submit();
    login.requiredFieldMessage();
  });

  //   Test Case 6: Login dengan password yang kosong
  it("Login dengan password yang kosong", () => {
    login.visitLoginPage();
    login.fillUsername("Admin");
    login.submit();
    login.requiredFieldMessage();
  });

  // Test Case 7: Login dengan username dan password yang kosong
  it("Login dengan username dan password yang kosong", () => {
    login.visitLoginPage();
    login.submit();
    login.requiredFieldMessage();
  });

  //   Test Case 8: Memeriksa case sensitivity username (Bug: sistem tidak case-sensitive!)
  it("Login dengan username huruf kecil - UNEXPECTED: berhasil login", () => {
    login.visitLoginPage();
    login.fillUsername("admin"); // huruf kecil
    login.fillPassword("admin123"); // password tetap benar
    login.submit();

    // EXPECTED: Seharusnya gagal, tapi ternyata berhasil (bug!)
    login.successfulLogin();
  });

  // Test Case 9: Memeriksa case sensitivity password
  it("Login dengan password case berbeda - seharusnya gagal", () => {
    login.visitLoginPage();
    login.fillUsername("Admin");
    login.fillPassword("Admin123"); // huruf besar di awal
    login.submit();
    login.invalidCredentialsMessage();
  });

  // Test Case 10: Username dengan spasi di awal/akhir
  it("Login dengan username yang mengandung spasi", () => {
    login.visitLoginPage();
    login.fillUsername(" Admin "); // dengan spasi
    login.fillPassword("admin123");
    login.submit();
    login.invalidCredentialsMessage();
  });
});
