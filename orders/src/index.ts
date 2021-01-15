import mongoose from "mongoose";
import { isPropertyAccessChain } from "typescript";
import { app } from "./app";
import { natsWrapper } from "./nats-wrapper";

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("process.env.JWT_KEY not defined");
  }
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error("process.env.NATS_CLIENT_ID in tickets not defined");
  }
  if (!process.env.NATS_URL) {
    throw new Error("process.env.NATS_URL in tickets not defined");
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error("process.env.NATS_CLUSTER_ID in tickets not defined");
  }
  if (!process.env.MONGO_URI) {
    throw new Error("process.env.MONGO_URI in tickets not defined");
  }

  try {
    //third param is based on the cluster ip service in the yaml file for the nats depl.3
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );

    natsWrapper.client.on("close", () => {
      console.log("NATS Connection Close!");
      process.exit();
    });

    process.on("SIGINT", () => natsWrapper.client.close());
    process.on("SIGTERM", () => natsWrapper.client.close());

    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log("connected to mdb");
  } catch (err) {
    console.error(err);
  }
  app.listen(3000, () => {
    console.log("Listening on port 3000!!!!!!!!");
  });
};

start();
