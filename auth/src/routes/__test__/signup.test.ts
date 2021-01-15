import request from "supertest";
import { app } from "../../app";

it("returns a 201 on successfull signup", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "1234",
    })
    .expect(201);
});

it("returns a 400 with an invalid email", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "testest.com",
      password: "1234",
    })
    .expect(400);
});

it("returns a 400 with an invalid password", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "1",
    })
    .expect(400);
});

it("returns a 400 with an invalid password and email", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "1",
      password: "1",
    })
    .expect(400);
});

it("Does not allow used emails", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "1234",
    })
    .expect(201);

  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "1234",
    })
    .expect(400);
});

it("sets a cookie after a successful signup", async () => {
  const response = await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "1234",
    })
    .expect(201);

  expect(response.get("Set-Cookie")).toBeDefined();
});
