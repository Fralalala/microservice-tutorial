import {Publisher, Subjects, TicketUpdatedEvent} from "@lalatickets/common"

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    readonly subject = Subjects.TicketUpdated
}