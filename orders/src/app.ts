import express from "express";
import "express-async-errors";
import { errorHandler, NotFoundError, currentUser } from "@lalatickets/common";
import cookieSession from "cookie-session";

import {deleteOrderRouter} from "./routes/delete"
import {indexOrderRouter} from "./routes/index"
import {newOrderRouter} from "./routes/new"
import {showOrderRouter} from "./routes/show"

const app = express();

//Request is proxied through nginx. Course Content : 161 = 2:30
app.set("trust proxy", true);

app.use(express.json());
app.use(
  cookieSession({
    signed: false,
    //secure: true means that you can only access the req.session in an https url
    //this used the NODE_ENV so that when doing tests on the routes, the cookies will be accessable during the test 
    // (because we need to check the cookies in the test)
    secure: process.env.NODE_ENV !== "test",
  })
);

app.use(currentUser)

app.use(deleteOrderRouter)
app.use(indexOrderRouter)
app.use(newOrderRouter)
app.use(showOrderRouter)

//all means all kinds of request, get,post,del put. This app.all will trigger if it didnt use anything from any endpoints above it. ^^^^^^
app.all("*", async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
