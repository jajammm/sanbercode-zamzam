describe("Pengujian API Reqres untuk Authentication", () => {
  const baseUrl = "https://reqres.in/api";

  const apiKey = Cypress.env("API_KEY");
  const headers = {
    "Content-Type": "application/json",
    "x-api-key": apiKey,
  };

  describe("User Registration - Pendaftaran Pengguna", () => {
    it("Berhasil melakukan registrasi dengan kredensial yang valid", () => {
      const registerData = {
        email: "eve.holt@reqres.in",
        password: "pistol",
      };

      cy.request({
        method: "POST",
        url: `${baseUrl}/register`,
        headers: headers,
        body: registerData,
      }).then((response) => {
        // Memverifikasi status registrasi berhasil
        expect(response.status).to.eq(200);

        // Memverifikasi response memiliki ID dan token
        expect(response.body).to.have.property("id");
        expect(response.body).to.have.property("token");

        // Memverifikasi tipe data ID dan token
        expect(response.body.id).to.be.a("number");
        expect(response.body.token).to.be.a("string");

        // Memverifikasi token tidak kosong
        expect(response.body.token.length).to.be.greaterThan(0);
      });
    });

    it("Gagal registrasi dengan email yang kosong", () => {
      const registerData = {
        password: "pistol",
      };
      cy.request({
        method: "POST",
        url: `${baseUrl}/register`,
        headers: headers,
        body: registerData,
        failOnStatusCode: false,
      }).then((response) => {
        // Memverifikasi error handling untuk email yang kosong
        expect(response.status).to.eq(400);
        expect(response.body).to.have.property("error");
      });
    });

    it("Gagal registrasi dengan password yang kosong", () => {
      const registerData = {
        email: "sydney@fife",
      };

      cy.request({
        method: "POST",
        url: `${baseUrl}/register`,
        headers: headers,
        body: registerData,
        failOnStatusCode: false,
      }).then((response) => {
        // Memverifikasi status error untuk data tidak lengkap
        expect(response.status).to.eq(400);
        expect(response.body).to.have.property("error");

        // Memverifikasi pesan error yang sesuai
        expect(response.body.error).to.contain("Missing password");
      });
    });

    it("Gagal registrasi dengan email yang tidak valid", () => {
      const registerData = {
        email: "invalid@email.com",
        password: "password123",
      };

      cy.request({
        method: "POST",
        url: `${baseUrl}/register`,
        headers: headers,
        body: registerData,
        failOnStatusCode: false,
      }).then((response) => {
        // Memverifikasi status error untuk email tidak valid
        expect(response.status).to.eq(400);
        expect(response.body).to.have.property("error");
      });
    });

    it("Gagal registrasi dengan body kosong", () => {
      cy.request({
        method: "POST",
        url: `${baseUrl}/register`,
        headers: headers,
        body: {},
        failOnStatusCode: false,
      }).then((response) => {
        // Memverifikasi error handling untuk body kosong
        expect(response.status).to.eq(400);
        expect(response.body).to.have.property("error");
      });
    });
  });

  describe("User Login - Login Pengguna", () => {
    it("Berhasil login dengan kredensial yang valid", () => {
      const loginData = {
        email: "eve.holt@reqres.in",
        password: "cityslicka",
      };

      cy.request({
        method: "POST",
        url: `${baseUrl}/login`,
        headers: headers,
        body: loginData,
      }).then((response) => {
        // Memverifikasi status login berhasil
        expect(response.status).to.eq(200);

        // Memverifikasi response memiliki token
        expect(response.body).to.have.property("token");

        // Memverifikasi token adalah string dan tidak kosong
        expect(response.body.token).to.be.a("string");
        expect(response.body.token.length).to.be.greaterThan(0);

        // Memverifikasi waktu response dalam batas wajar
        expect(response.duration).to.be.lessThan(5000);
      });
    });

    it("Gagal login dengan kredensial yang salah", () => {
      const loginData = {
        email: "invalid@email.com",
        password: "wrongpassword",
      };

      cy.request({
        method: "POST",
        url: `${baseUrl}/login`,
        headers: headers,
        body: loginData,
        failOnStatusCode: false,
      }).then((response) => {
        // Memverifikasi status error untuk kredensial salah
        expect(response.status).to.eq(400);
        expect(response.body).to.have.property("error");
      });
    });

    it("Gagal login dengan email yang kosong", () => {
      const loginData = {
        password: "cityslicka",
      };

      cy.request({
        method: "POST",
        url: `${baseUrl}/login`,
        headers: headers,
        body: loginData,
        failOnStatusCode: false,
      }).then((response) => {
        // Memverifikasi error handling untuk email yang kosong
        expect(response.status).to.eq(400);
        expect(response.body).to.have.property("error");
      });
    });

    it("Gagal login dengan password yang kosong", () => {
      const loginData = {
        email: "peter@klaven",
      };

      cy.request({
        method: "POST",
        url: `${baseUrl}/login`,
        headers: headers,
        body: loginData,
        failOnStatusCode: false,
      }).then((response) => {
        // Memverifikasi status error untuk password yang kosong
        expect(response.status).to.eq(400);
        expect(response.body).to.have.property("error");

        // Memverifikasi pesan error yang sesuai
        expect(response.body.error).to.contain("Missing password");
      });
    });

    it("Gagal login dengan body yang kosong", () => {
      cy.request({
        method: "POST",
        url: `${baseUrl}/login`,
        headers: headers,
        body: {},
        failOnStatusCode: false,
      }).then((response) => {
        // Memverifikasi error handling untuk body kosong
        expect(response.status).to.eq(400);
        expect(response.body).to.have.property("error");
      });
    });
  });
});
