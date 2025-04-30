import { User } from "../../helper/interface";
import { deleteFunction, getUser, login, signUp } from "../../helper/user";
import * as supertest from "supertest";
const request = supertest("http://localhost:8001/api/v1");

describe("USER SIGNUP AND LOGIN", () => {
    const user: User = getUser("admin")
    let cookie;
    describe("POSITIVE TESTING", () => {
        it("should sign up, login and delete the user", async () => {

            try {
                const res = await signUp(user);
                expect(res.statusCode).toBe(201);
                expect(res.body.data.user.email).toEqual(user.email);
                expect(res.body.status).toEqual("success");
                const loginRes = await login(user)
                expect(loginRes.statusCode).toBe(200);
                expect(loginRes.body.status).toEqual("success");
                console.log(loginRes.body);
                cookie = loginRes.headers["set-cookie"][0].split(";")[0];
                const deleteRes = await deleteFunction(cookie);
                expect(deleteRes.statusCode).toBe(200);
                expect(deleteRes.body.message).toEqual("User deleted successfully");

                const loginAfterDeletion = await login(user);
                expect(loginAfterDeletion.statusCode).toBe(401);
                expect(loginAfterDeletion.body.message).toBe("User deleted successfully");
            } catch (error) {
                console.error("Error during signup:", error);
                throw error;
            }
        })
    })
})