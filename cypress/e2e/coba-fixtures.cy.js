import loginTestData from "../fixtures/loginTestData.json";
import {
  visitLoginPage,
  fillLoginForm,
  submitForm,
  assertSuccessfulLogin,
  assertInvalidCredentials,
  assertRequiredFieldError,
} from "../../helpers/loginHelper.js";

describe("Fitur Login OrangeHRM", () => {
  // Agar setiap skenario dimulai dari halaman login
  beforeEach(() => {
    visitLoginPage();
  });

  describe("Skenario Login Valid", () => {
    it("Login berhasil dengan kredensial yang valid", () => {
      fillLoginForm(
        loginTestData.validCredentials.username,
        loginTestData.validCredentials.password
      );
      submitForm();
      assertSuccessfulLogin();
    });
  });

  describe("Skenario Kredensial Tidak Valid", () => {
    loginTestData.invalidCredentialsTestCases.forEach(
      ({ description, username, password }) => {
        it(description, () => {
          fillLoginForm(username, password);
          submitForm();
          assertInvalidCredentials();
        });
      }
    );
  });

  describe("Validasi Field Kosong", () => {
    loginTestData.emptyFieldTestCases.forEach(
      ({ description, username, password }) => {
        it(description, () => {
          fillLoginForm(username, password);
          submitForm();
          assertRequiredFieldError();
        });
      }
    );
  });
});
