import request from "supertest";
import { app } from "../../app";

it("Response about current user", async () => {
  
    // Cookies are not automatically sent by supertest, you must manually place it.
  const cookie = await global.signin();

  const response = await request(app)
    .get("/api/users/currentuser")
    .set("Cookie", cookie)
    .send({})
    .expect(200);

  expect(response.body.currentUser.email).toEqual("test@test.com")
});

it("Respond with null if not Authentiicagted", async () => {
    const response = await request(app)
        .get('/api/users/currentuser')
        .send()
        .expect(200)

    expect(response.body.currentUser).toEqual(null)
})