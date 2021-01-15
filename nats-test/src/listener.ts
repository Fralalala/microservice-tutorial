import nats from "node-nats-streaming";
import { randomBytes } from "crypto";
import { TicketCreatedListener } from "./events/ticket-created-listener";
console.clear();

const stan = nats.connect("ticketing", randomBytes(4).toString("hex"), {
  url: "http://localhost:4222",
});

stan.on("connect", () => { 
  console.log("listener connected to nats");

  stan.on("close", () => {
    console.log("NATS Connection Close!");
    process.exit();
  });

  //#region
  // const options = stan
  //   .subscriptionOptions()
  //   .setManualAckMode(true)
  //   //Processes all request again
  //   //This will process everything according to the transaction history,
  //   //this will only happen during its initial moments, like only the first time it "wakes up"
  //   .setDeliverAllAvailable()
  //   //When a process is done, it adds it to its history of transactions, in which some are processed and some are in queue
  //   //not having this will make this service do every transaction according to history
  //   //everytime another instance is made from an rs command
  //   .setDurableName("a-service-name-listener");

  // //Because we set a queue group name, the history of transactions wont be deleted.
  // //Without the queue group name, the history will be based on a specific pod, here instead
  // //is on a group.
  // const subscription = stan.subscribe(
  //   "ticket:created",
  //   "MyQueueGroupName",
  //   options
  // );

  // //message is a generic term for when a publish from a client in a publisher file happens
  // subscription.on("message", (msg: Message) => {
  //   const data = msg.getData();
  //   console.log(typeof data);
  //   if (typeof data === "string") {
  //     console.log(`Received event #${msg.getSequence()}, with data: ${data}`);
  //   }
  //   msg.ack();
  // });
  //#endregion

  new TicketCreatedListener(stan).listen();
});

process.on("SIGINT", () => stan.close());
process.on("SIGTERM", () => stan.close());


