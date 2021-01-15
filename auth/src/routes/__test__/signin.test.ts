import request from "supertest";
import { app } from "../../app";

it("Must be a valid Email", async () => {
  await request(app)
    .post("/api/users/signin")
    .send({
      email: "test",
      password: "somePassword",
    })
    .expect(400);
});

it("Fails when supplied email does not exist", async () => {
  await request(app)
    .post("/api/users/signin")
    .send({
      email: "test@test.com",
      password: "1z234",
    })
    .expect(400);
});

it("Fail when incorrect password is supplied", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "1234",
    })
    .expect(201);

  await request(app)
    .post("/api/users/signin")
    .send({
      email: "test@test.com",
      password: "abcd",
    })
    .expect(400);
});

it("Responds with a cookie when given valid credentials", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "1234",
    })
    .expect(201);

  const response = await request(app)
    .post("/api/users/signin")
    .send({
      email: "test@test.com",
      password: "1234",
    })
    .expect(200);
 
  expect(response.get("Set-Cookie")).toBeDefined();
});
