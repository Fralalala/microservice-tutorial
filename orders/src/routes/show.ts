import { NotAuthorizedError, NotFoundError, requireAuth } from '@lalatickets/common';
import express, {Request, Response} from 'express'
import {Order} from "../models/order"

const router = express.Router();

router.get("/api/orders/:orderId",requireAuth, async (req: Request, res: Response) => {

    const {orderId} = req.params

    //You can add a check wether the orderId is of the 
    //mongoose object id Format

    //For some reason, you need to populate the ticket property of the Order doc
    const order = await Order.findById(orderId).populate("ticket")

    if (!order) {
        throw new NotFoundError()
    }

    if (order.userId !== req.currentUser!.id) {
        throw new NotAuthorizedError()
    }



    res.send(order)
})

export {router as showOrderRouter}