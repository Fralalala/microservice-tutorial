import {
  BadRequestError,
  NotFoundError,
  OrderStatus,
  requireAuth,
} from "@lalatickets/common";
import mongoose from "mongoose";
import express, { Request, Response } from "express";
import { body } from "express-validator";
import { Ticket } from "../models/ticket";
import { Order } from "../models/order";

const router = express.Router();

const EXPIRATION_WINDOW_SECONDS = 15 * 60;

router.post(
  "/api/orders",  
  requireAuth,
  [
    body("ticketId")
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage("Ticket Id must be provided"),
  ],
  async (req: Request, res: Response) => {
    const { ticketId } = req.body;

    //Find the ticket the user is trying to order in the db
    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
      throw new NotFoundError();
    }

    //make sure the ticket is not yet reserved
    const isReserved = await ticket.isReserved();

    if (isReserved) {
      throw new BadRequestError("Ticket is already reserved");
    }

    //Calculate an expiration date for this order
    const expiration = new Date()

    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS)

    //Build the order and save to db
    const order = Order.build({

      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt: expiration,
      ticket
      
    })

    await order.save()

    // PUblish an event that an order was created

    res.status(201).send(order);
  }
);

export { router as newOrderRouter };
