import express from "express";
import "express-async-errors";
import { errorHandler, NotFoundError } from "@lalatickets/common";
import { currentUserRouter } from "./routes/current-user";
import { signinRouter } from "./routes/signin";
import { signoutRouter } from "./routes/signout";
import { signupRouter } from "./routes/signup";
import cookieSession from "cookie-session";

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

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signupRouter);
app.use(signoutRouter);

//all means all kidns of request, get,post,del put. This app.all will trigger if it didnt use anything from any endpoints above it. ^^^^^^
app.all("*", async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
