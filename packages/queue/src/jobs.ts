import { callQueue } from "./queue";
import { CallJobData } from "./types";

// TODO: Log the call to the callLogs table (status: PENDING)
export async function scheduleCallJob({
  userId,
  delayMs,
}: {
  userId: string;
  delayMs: number;
}) {
  const data: CallJobData = {
    userId,
  };

  await callQueue.add("call-user", data, {
    jobId: userId,
    delay: delayMs,
    // This way it will not be visualized in the bull-board but this way it is easier to see a job related to a user.
    // I could save and log important data to the callLogs table
    removeOnComplete: true,
    removeOnFail: true,
  });
}

export async function enqueueCallUserJob(userId: string) {
  await callQueue.add(
    "call-user",
    { userId },
    { jobId: userId, removeOnComplete: true, removeOnFail: true }
  );
}

export async function removeCallJob(userId: string) {
  await callQueue.remove(userId);
}

export async function getCallJob(jobId: string) {
  return await callQueue.getJob(jobId);
}

export async function getCallJobs() {
  return await callQueue.getJobs();
}
