import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose"

it("Returns 404 if ticket is not found", async () => {
    const id = new mongoose.Types.ObjectId().toHexString()

    //Instead of just putting in a random Id for this test, we had to use the code above.
    // its because ids in mongodb has a certain standard, according to docs, it should be 12 byte binary string number
    //we dont know what that is so lets just use mongoose to generate us some of it.
    await request(app).get(`/api/tickets/${id}`).send().expect(404);

});

it("Returns the ticket if the ticket is found", async () => {
  const title = "concert";
  const price = 420;

  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      title,
      price,
    })
    .expect(201);

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send()
    .expect(200);

  expect(ticketResponse.body.title).toEqual(title);
  expect(ticketResponse.body.price).toEqual(price);
});
