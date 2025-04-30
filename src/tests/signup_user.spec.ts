import * as supertest from "supertest";
import { faker } from "@faker-js/faker";
const request = supertest("http://localhost:8001/api/v1");

interface UserData {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
}

describe("USER SIGN UP", () => {
  describe("POSITIVE TESTING with async/await", () => {
    it("should sign up a new user", async () => {
      const userData: UserData = {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: "test1234",
        passwordConfirm: "test1234",
      };

      console.log(userData);
      try {
        const res = await request.post("/users/signup").send(userData).expect(201);
        console.log(res.body.message);
        console.log(res.body);

        expect(res.body.status).toBe("success");
        expect(res.body.data.user.name).toBe(userData.name);
        expect(typeof res.body.data.user.name).toBe("string");
        expect(res.body.data.user.email).toBe(userData.email.toLowerCase());
        expect(typeof res.body.data.user.email).toBe("string");
        expect(res.body.token).toBeDefined();
        expect(typeof res.body.token).toBe("string");

        expect(res.body.data.user).toHaveProperty("_id");
        expect(res.body.data.user).not.toHaveProperty("password");
      } catch (error) {
        console.error("Error during signup:", error);
        throw error;
      }
    });
  });

  describe("POSITIVE TESTING with .then", () => {
    it("should sign up a new user", () => {
      const userData: UserData = {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: "test1234",
        passwordConfirm: "test1234",
      };

      console.log(userData);
      return request
        .post("/users/signup")
        .send(userData)
        .expect(201)
        .then((res: supertest.Response) => {
          expect(res.body.status).toBe("success");
          expect(res.body.data.user.name).toBe(userData.name);
          expect(typeof res.body.data.user.name).toBe("string");
          expect(res.body.data.user.email).toBe(userData.email.toLowerCase());
          expect(typeof res.body.data.user.email).toBe("string");
          expect(res.body.token).toBeDefined();
          expect(typeof res.body.token).toBe("string");

          expect(res.body.data.user).toHaveProperty("_id");
          expect(res.body.data.user).not.toHaveProperty("password");
        })
        .catch((error) => {
          console.error("Error during signup:", error);
          throw error;
        });
    });
  });

  describe("POSITIVE TESTING with .end() and .done()", () => {
    it("should sign up a new user", (done) => {
      const userData: UserData = {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: "test1234",
        passwordConfirm: "test1234",
      };

      console.log(userData);
      request
        .post("/users/signup")
        .send(userData)
        .expect(201)
        .end((err: Error | null, res: supertest.Response) => {
          if (err) {
            console.error("Error during signup:", err);
            return done(err);
          }

          try {
            expect(res.body.status).toBe("success");
            expect(res.body.data.user.name).toBe(userData.name);
            expect(typeof res.body.data.user.name).toBe("string");
            expect(res.body.data.user.email).toBe(userData.email.toLowerCase());
            expect(typeof res.body.data.user.email).toBe("string");
            expect(res.body.token).toBeDefined();
            expect(typeof res.body.token).toBe("string");

            expect(res.body.data.user).toHaveProperty("_id");
            expect(res.body.data.user).not.toHaveProperty("password");
            done();
          } catch (error) {
            console.error("Error during signup:", error);
            done(error);
          }
        });
    });
  });

  describe("NEGATIVE TESTING", () => {
    it("should not sign up user without email", async () => {
      const userData = {
        name: faker.person.fullName(),
        email: "", // empty email
        password: "test1234",
        passwordConfirm: "test1234",
      };

      const res = await request.post("/users/signup").send(userData).expect(400);
      expect(res.body.status).toBe("fail");
      expect(res.body.message).toMatch(/email/i);
    });
  });
});
