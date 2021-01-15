import request from "supertest"
import {app} from "../../app"
import mongoose from "mongoose"
import {natsWrapper} from "../../nats-wrapper"

it("returns a 404 if provided id does not exist", async () => {
    
    const id = new mongoose.Types.ObjectId().toHexString()

    await request(app)
        .put(`/api/tickets/${id}`)
        .send({
            title: "sometitle",
            price: 123
        })
        .set("Cookie", global.signin())
        .expect(404)

})

it("returns a 401 if user is not authenticated", async () => {
    const id = new mongoose.Types.ObjectId().toHexString()

    await request(app)
        .put(`/api/tickets/${id}`)
        .send({
            title: "sometitle",
            price: 123
        })
        .expect(401)
})

it("returns a 401 if the user does not own the ticket", async () => {
    const response = await request(app)
        .post("/api/tickets")
        .set('Cookie', global.signin())
        .send({
            title: "title to create",
            price: 919
        })
        .expect(201)
 
        await request(app)
            .put(`/api/tickets/${response.body.id}`)
            .set('Cookie', global.signin())
            .send({
                title: "other title",
                price: 202
            })
            .expect(401) 


})

it("returns a 400 if the user provide an invalid title or price ", async () => {
    const cookie = global.signin()
    const response = await request(app)
        .post("/api/tickets")
        .set('Cookie', cookie )
        .send({
            title: "title to create",
            price: 919
        })
        .expect(201)

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set("Cookie", cookie)
        .send({
            title: "",
            price: 20
        })
        .expect(400)
    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set("Cookie", cookie)
        .send({
            title: "43refdsc",
            price: -20
        })
        .expect(400)
})

it("updates the ticket provided valid input ", async () => {
    const cookie = global.signin()
    const response = await request(app)
        .post("/api/tickets")
        .set('Cookie', cookie )
        .send({
            title: "title to create",
            price: 919
        })
        .expect(201)

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: "newTitle",
            price: 250
        })
        .expect(200)

    const ticketResponse = await request(app)
        .get(`/api/tickets/${response.body.id}`)
        .send()

    expect(ticketResponse.body.title).toEqual("newTitle")
    expect(ticketResponse.body.price).toEqual(250)
})

it("publishes an event ", async () => {
    const cookie = global.signin()
    const response = await request(app)
        .post("/api/tickets")
        .set('Cookie', cookie )
        .send({
            title: "title to create",
            price: 919
        })
        .expect(201)

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: "newTitle",
            price: 250
        })
        .expect(200)

    expect(natsWrapper.client.publish).toHaveBeenCalled()
})