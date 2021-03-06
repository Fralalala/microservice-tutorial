import {Subjects} from "./subjects"
import { OrderStatus } from "./types/order-status";

export interface OrderCreatedEvent {
    subject: Subjects.OrderCreated
    data: {
        id: string,
        stauts : OrderStatus,
        userId: string,
        expiresAt: string
    }
}