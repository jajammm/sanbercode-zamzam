export const BASE_URL = Cypress.env("BASE_URL");

export const loginSelectors = {
  usernameInput: 'input[name="username"]',
  passwordInput: 'input[name="password"]',
  submitButton: 'button[type="submit"]',
  dashboardText: "Dashboard",
  invalidCredentialsMsg: "Invalid credentials",
  requiredMsg: "Required",
};

export const visitLoginPage = () => {
  cy.visit(BASE_URL);
};

export const fillLoginForm = (username = "", password = "") => {
  if (username) {
    cy.get(loginSelectors.usernameInput).type(username);
  }
  if (password) {
    cy.get(loginSelectors.passwordInput).type(password);
  }
};

export const submitForm = () => {
  cy.get(loginSelectors.submitButton).click();
};

export const assertSuccessfulLogin = () => {
  cy.url().should("include", "/dashboard");
  cy.contains(loginSelectors.dashboardText).should("be.visible");
};

export const assertInvalidCredentials = () => {
  cy.contains(loginSelectors.invalidCredentialsMsg).should("be.visible");
};

export const assertRequiredFieldError = () => {
  cy.contains(loginSelectors.requiredMsg).should("be.visible");
};

export default {
  BASE_URL,
  loginSelectors,
  visitLoginPage,
  fillLoginForm,
  submitForm,
  assertSuccessfulLogin,
  assertInvalidCredentials,
  assertRequiredFieldError,
};
