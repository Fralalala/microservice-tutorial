import mongoose from "mongoose";
import { Order, OrderStatus } from "./order";

interface TicketAttrs {
  title: string;
  price: number;
}

export interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  isReserved() : Promise<boolean>;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
}

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

//The build function is added on to the Model itself
ticketSchema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket(attrs);
};

//This adds a function to the document
ticketSchema.methods.isReserved = async function() {

    //Run query to look at all orders. Find an order where the ticket
    //is the ticket we just found AND the order status is not cancelled
    //if we find an order status from that means the ticket IS reserved
    const existingOrder = await Order.findOne({
        ticket: this,
        status: {
          //this will find one that has a status property that has one of the values from the array
          $in: [
            OrderStatus.Created,
            OrderStatus.AwaitingPayment,
            OrderStatus.Complete,
          ]
        }
      })


    //if exisiting order is Null, it will be a True on the first ! then with the 2nd !, it will
    //inverse it to False. Bascially we're just making sure it's either True or False and not possibly a null
    return !!existingOrder
}

const Ticket = mongoose.model<TicketDoc, TicketModel>("Ticket", ticketSchema);

export {Ticket}