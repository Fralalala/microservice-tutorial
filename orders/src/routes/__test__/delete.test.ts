import request from "supertest"
import {app} from "../../app"
import {Ticket} from "../../models/ticket"
import {Order, OrderStatus} from "../../models/order"

it('Marks an order as Cancelled' , async  () => {
    //Create a ticket model
    const ticket = Ticket.build({
        title: "Concert Title",
        price: 420
    })

    await ticket.save()

    const user = global.signin()

    // Make a request to create an order
    const {body: order} = await request(app)
        .post('/api/orders')
        .set("Cookie", user)
        .send({ticketId: ticket.id})
        .expect(201)
 
    //make a request to cancel an order
    await request(app)
        .delete(`/api/orders/${order.id}`)
        .set("Cookie", user)
        .send()
        .expect(204)

    //expectation to make sure the thing is cancelled
    const updatedOrder = await  Order.findById(order.id)
 

    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled)
})

it.todo("Emnits an order cancelled event")