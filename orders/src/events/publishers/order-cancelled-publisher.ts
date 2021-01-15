import {Publisher, OrderCancelledEvent, Subjects} from "@lalatickets/common"

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    readonly subject = Subjects.OrderCancelled
}

