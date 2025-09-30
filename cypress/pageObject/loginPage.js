class Login {
  orangeUrl =
    "https://opensource-demo.orangehrmlive.com/web/index.php/auth/login";

  usernameSelector = 'input[name="username"]';
  passwordSelector = 'input[name="password"]';
  submitButtonSelector = 'button[type="submit"]';

  visitLoginPage() {
    cy.visit(this.orangeUrl);
  }

  fillUsername(username) {
    cy.get(this.usernameSelector).type(username);
  }

  fillPassword(password) {
    cy.get(this.passwordSelector).type(password);
  }

  submit() {
    cy.get(this.submitButtonSelector).click();
  }

  invalidCredentialsMessage() {
    cy.contains("Invalid credentials").should("be.visible");
  }

  requiredFieldMessage() {
    cy.contains("Required").should("be.visible");
  }

  successfulLogin() {
    cy.url().should("include", "/dashboard");
    cy.contains("Dashboard").should("be.visible");
  }
}

export default Login;
