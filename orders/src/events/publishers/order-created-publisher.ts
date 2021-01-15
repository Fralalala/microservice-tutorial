import {Publisher, OrderCreatedEvent, Subjects} from "@lalatickets/common"

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    readonly subject = Subjects.OrderCreated
}