import { response } from "express";
import request from "supertest";
import { app } from "../../app";

const createTicket = (title: string, price: number) => {
  return request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      title,
      price,
    })
    .expect(201);
};

it("can fetch a list of tickets", async () => {
  await createTicket("some title", 110)
  await createTicket("2nd title", 220)
  await createTicket("3rd title", 330)


  const response = await request(app)
    .get("/api/tickets")
    .send()
    .expect(200)

    expect(response.body.length).toEqual(3)

});
