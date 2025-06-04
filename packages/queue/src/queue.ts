import { Queue } from "bullmq";
import { producerConnection } from "#connection";

export const callQueue = new Queue("call-queue", {
  connection: producerConnection,
});
