import { callQueue } from "#queue";

export async function scheduleCall(userId: string, delayMs: number) {
  await callQueue.add("call-user", { userId }, { delay: delayMs });
}
