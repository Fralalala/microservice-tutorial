import nats, { Stan } from "node-nats-streaming"
import {TicketCreatedPublisher} from './events/ticket-created-publisher'

console.clear()

const stan = nats.connect('ticketing', 'abc', {
    url: 'http://localhost:4222',
})

stan.on('connect', async () => {
    console.log('Publisher connected to NATS')

    const publisher = new TicketCreatedPublisher(stan)

    await publisher.publish({
        id:  '123',
        title: 'concert',
        price: 250
    })

    // const data = JSON.stringify({
    //     id: '123',
    //     title: "concert",
    //     price: 250
    // })

    // stan.publish('ticket:created', data, () => {
    //     console.log('event published')
    // })

})