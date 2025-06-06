import { callQueue } from "#queue";
import { CallJobData } from "#types.js";

export async function scheduleCall({
  userId,
  phoneNumber,
  delayMs,
}: {
  userId: string;
  phoneNumber: string;
  delayMs: number;
}) {
  const data: CallJobData = {
    userId,
    phoneNumber,
  };

  await callQueue.add("call-user", data, {
    jobId: userId,
    delay: delayMs,
  });
}

export async function callUser(userId: string) {
  await callQueue.add("call-user", { userId });
}

export async function removeCallSchedule(userId: string) {
  await callQueue.remove(userId);
}

export async function getCallData(jobId: string) {
  return await callQueue.getJob(jobId);
}

export async function getCallsData() {
  return await callQueue.getJobs();
}
