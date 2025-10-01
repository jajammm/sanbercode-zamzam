describe("Pengujian API Reqres untuk Users", () => {
  const baseUrl = "https://reqres.in/api";

  const apiKey = Cypress.env("API_KEY");
  const headers = {
    "Content-Type": "application/json",
    "x-api-key": apiKey,
  };

  describe("GET Users - Mengambil Data Pengguna", () => {
    it("Berhasil mengambil daftar semua pengguna dengan struktur data yang benar", () => {
      cy.request({
        method: "GET",
        url: `${baseUrl}/users`,
        headers: headers,
      }).then((response) => {
        // Memverifikasi status response berhasil
        expect(response.status).to.eq(200);

        // Memverifikasi struktur pagination response
        expect(response.body).to.have.property("page", 1);
        expect(response.body).to.have.property("per_page");
        expect(response.body).to.have.property("total");
        expect(response.body).to.have.property("total_pages");
        expect(response.body).to.have.property("data");

        // Memverifikasi data berupa array dan tidak kosong
        expect(response.body.data).to.be.an("array");
        expect(response.body.data.length).to.be.greaterThan(0);

        // Memverifikasi waktu response
        expect(response.duration).to.be.lessThan(5000);

        // Memverifikasi struktur data user pertama memiliki field yang diperlukan
        const firstUser = response.body.data[0];
        expect(firstUser).to.have.all.keys(
          "id",
          "email",
          "first_name",
          "last_name",
          "avatar"
        );
      });
    });

    it("Berhasil mengambil daftar pengguna dengan pagination halaman ke-2", () => {
      cy.request({
        method: "GET",
        url: `${baseUrl}/users?page=2`,
        headers: headers,
      }).then((response) => {
        // Memverifikasi status response berhasil
        expect(response.status).to.eq(200);

        // Memverifikasi halaman yang diminta benar
        expect(response.body).to.have.property("page", 2);
        expect(response.body).to.have.property("data");
        expect(response.body.data).to.be.an("array");

        // Memverifikasi bahwa halaman 2 memiliki data
        expect(response.body.data.length).to.be.greaterThan(0);
      });
    });

    it("Berhasil mengambil data satu pengguna berdasarkan ID dengan validasi tipe data", () => {
      cy.request({
        method: "GET",
        url: `${baseUrl}/users/2`,
        headers: headers,
      }).then((response) => {
        // Memverifikasi status response berhasil
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property("data");

        // Memverifikasi data user sesuai ID yang diminta
        expect(response.body.data).to.have.property("id", 2);
        expect(response.body.data).to.have.property("email");
        expect(response.body.data).to.have.property("first_name");
        expect(response.body.data).to.have.property("last_name");
        expect(response.body.data).to.have.property("avatar");

        // Memverifikasi tipe data setiap field
        expect(response.body.data.id).to.be.a("number");
        expect(response.body.data.email).to.be.a("string");
        expect(response.body.data.first_name).to.be.a("string");
        expect(response.body.data.last_name).to.be.a("string");
      });
    });

    it("Mengembalikan error 404 ketika mencari pengguna yang tidak ada", () => {
      cy.request({
        method: "GET",
        url: `${baseUrl}/users/23`,
        headers: headers,
        failOnStatusCode: false,
      }).then((response) => {
        // Memverifikasi status 404 untuk user yang tidak ditemukan
        expect(response.status).to.eq(404);
        expect(response.body).to.be.empty;
      });
    });

    it("Menangani ID pengguna yang tidak valid dengan benar", () => {
      cy.request({
        method: "GET",
        url: `${baseUrl}/users/invalid`,
        headers: headers,
        failOnStatusCode: false,
      }).then((response) => {
        // Memverifikasi error handling untuk ID yang tidak valid
        expect(response.status).to.eq(404);
      });
    });
  });

  describe("POST Create User - Membuat Pengguna Baru", () => {
    it("Berhasil membuat pengguna baru dengan data lengkap", () => {
      const userData = {
        name: "Zamzam",
        job: "Software Engineer",
      };

      cy.request({
        method: "POST",
        url: `${baseUrl}/users`,
        headers: headers,
        body: userData,
      }).then((response) => {
        // Memverifikasi status created (201)
        expect(response.status).to.eq(201);

        // Memverifikasi data yang dikembalikan sesuai input
        expect(response.body).to.have.property("name", userData.name);
        expect(response.body).to.have.property("job", userData.job);
        expect(response.body).to.have.property("id");
        expect(response.body).to.have.property("createdAt");

        // Memverifikasi ID berupa string (sesuai dengan Reqres API)
        expect(response.body.id).to.be.a("string");

        // Memverifikasi format tanggal createdAt valid
        expect(new Date(response.body.createdAt)).to.be.a("date");
      });
    });

    it("Berhasil membuat pengguna dengan data minimal (hanya nama)", () => {
      const userData = {
        name: "Jajam",
      };

      cy.request({
        method: "POST",
        url: `${baseUrl}/users`,
        headers: headers,
        body: userData,
      }).then((response) => {
        // Memverifikasi bahwa API masih bisa create dengan data minimal
        expect(response.status).to.eq(201);
        expect(response.body).to.have.property("name", userData.name);
        expect(response.body).to.have.property("id");
        expect(response.body).to.have.property("createdAt");
      });
    });

    it("Menangani request dengan body kosong", () => {
      cy.request({
        method: "POST",
        url: `${baseUrl}/users`,
        headers: headers,
        body: {},
      }).then((response) => {
        // Memverifikasi API tetap bisa menangani body kosong
        expect(response.status).to.eq(201);
        expect(response.body).to.have.property("id");
        expect(response.body).to.have.property("createdAt");
      });
    });
  });

  describe("PUT Update User - Memperbarui Data Pengguna Secara Lengkap", () => {
    it("Berhasil memperbarui data pengguna yang sudah ada", () => {
      const updatedData = {
        name: "Jane Smith",
        job: "Project Manager",
      };

      cy.request({
        method: "PUT",
        url: `${baseUrl}/users/2`,
        headers: headers,
        body: updatedData,
      }).then((response) => {
        // Memverifikasi status update berhasil
        expect(response.status).to.eq(200);

        // Memverifikasi data yang diperbarui sesuai input
        expect(response.body).to.have.property("name", updatedData.name);
        expect(response.body).to.have.property("job", updatedData.job);
        expect(response.body).to.have.property("updatedAt");

        // Memverifikasi format tanggal updatedAt valid
        expect(new Date(response.body.updatedAt)).to.be.a("date");
      });
    });

    it("Memperbarui data pengguna yang tidak ada (simulasi)", () => {
      const updatedData = {
        name: "Non Existent",
        job: "Ghost",
      };

      cy.request({
        method: "PUT",
        url: `${baseUrl}/users/999`,
        headers: headers,
        body: updatedData,
      }).then((response) => {
        // Reqres API tetap mengembalikan 200 untuk ID yang tidak ada
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property("name", updatedData.name);
        expect(response.body).to.have.property("job", updatedData.job);
      });
    });
  });

  describe("PATCH Update User - Memperbarui Data Pengguna Secara Parsial", () => {
    it("Berhasil memperbarui satu field (job) pada data pengguna", () => {
      const partialData = {
        job: "Senior Developer",
      };

      cy.request({
        method: "PATCH",
        url: `${baseUrl}/users/2`,
        headers: headers,
        body: partialData,
      }).then((response) => {
        // Memverifikasi status update berhasil
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property("job", partialData.job);
        expect(response.body).to.have.property("updatedAt");
      });
    });

    it("Berhasil memperbarui field nama saja", () => {
      const partialData = {
        name: "Update name",
      };

      cy.request({
        method: "PATCH",
        url: `${baseUrl}/users/3`,
        headers: headers,
        body: partialData,
      }).then((response) => {
        // Memverifikasi update parsial berhasil
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property("name", partialData.name);
        expect(response.body).to.have.property("updatedAt");
      });
    });
  });

  describe("DELETE User - Menghapus Data Pengguna", () => {
    it("Berhasil menghapus data pengguna", () => {
      cy.request({
        method: "DELETE",
        url: `${baseUrl}/users/2`,
        headers: headers,
      }).then((response) => {
        // Memverifikasi status delete berhasil (204 No Content)
        expect(response.status).to.eq(204);
        expect(response.body).to.be.empty;
      });
    });

    it("Menghapus pengguna yang tidak ada tetap mengembalikan status berhasil", () => {
      cy.request({
        method: "DELETE",
        url: `${baseUrl}/users/999`,
        headers: headers,
      }).then((response) => {
        // Reqres API mengembalikan 204 meskipun user tidak ada
        expect(response.status).to.eq(204);
      });
    });
  });
});
