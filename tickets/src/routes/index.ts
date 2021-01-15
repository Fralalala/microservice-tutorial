import express, {Response, Request} from "express"
import {Ticket} from "../model/Ticket"
import { showTicketRouter } from "./show";

const router = express.Router();

router.get("/api/tickets", async (req: Request, res: Response) => {
    const tickets = await Ticket.find({})

    res.send(tickets)
})

export {router as indexTicketRouter}