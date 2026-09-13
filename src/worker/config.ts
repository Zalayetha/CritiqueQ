import "dotenv/config";
export const QUEUE_NAME = "critiqueQ-queue"
export const workerConnection = {
  host: process.env.WORKER_URL ?? "localhost",
  port: "6380"
};
