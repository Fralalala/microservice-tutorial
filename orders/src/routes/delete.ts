import { NotAuthorizedError, NotFoundError, OrderStatus } from '@lalatickets/common';
import express, {Request, Response} from 'express'
import {Order} from "../models/order"


const router = express.Router();

router.delete("/api/orders/:orderId", async (req: Request, res: Response) => {

    const {orderId} = req.params

    const order = await Order.findById(orderId)

    if (!order) {
        throw new NotFoundError()
    }

    if (order.userId !== req.currentUser!.id) {
        throw new NotAuthorizedError()
    }

    order.status = OrderStatus.Cancelled
 
    await order.save()

    //publish an event that an order is updated to cancelled
 
    res.status(204).send(order)
})

export {router as deleteOrderRouter}