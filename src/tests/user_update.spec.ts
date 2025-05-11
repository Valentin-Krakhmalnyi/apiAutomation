import { de } from "@faker-js/faker";
import { User } from "../../helper/interface";
import { deleteFunction, getUser, login, signUp } from "../../helper/user";
let user: User
let cookie: string;

import * as supertest from "supertest";

const request = supertest("http://localhost:8001/api/v1");

describe("USER UPDATE - /user/updateMe",() => {
    beforeAll(async() => { 
        user = getUser("admin")
        const signUpRes = await signUp(user);
        expect(signUpRes.statusCode).toBe(201);
        const loginRes = await login(user);
        expect(loginRes.statusCode).toBe(200);
        cookie = loginRes.headers["set-cookie"][0].split(";")[0];
     });
    afterAll(async() => {
        await deleteFunction(cookie).then((res) => {
            expect(res.statusCode).toBe(200);
        })
    });
    it("should update the user name and email", async() => {
        const res = await request
            .patch("/users/updateMe")
            .set("Cookie", cookie)
            .send({
                name: "John Doe",
            })
            expect(res.statusCode).toBe(200);
    })
    it("should update the user photo", async() => {
        const resPhoto = await request
            .patch("/users/updateMe")
            .set("Cookie", cookie)
            .attach("photo", "data/photo/pasv.png")
            expect(resPhoto.statusCode).toBe(200);
    })
})