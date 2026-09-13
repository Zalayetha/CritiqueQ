import { Worker } from "bullmq";
import { generateFeedbackAnalysis } from "../modules/job/service";
import { db } from "../utils/db";
import { QUEUE_NAME, workerConnection } from "./config";

export const worker = new Worker(
  QUEUE_NAME,
  async (job) => {
    console.log(`Processing job ${job.id}...`);

    const jobid = job.data.id;
    if (!jobid) {
      throw new Error("Job ID is required");
    }

    try {
      const jobData = await db.orm.public.Job.where((j) => j.id.eq(jobid)).first();
      if (!jobData) {
        throw new Error(`Job with ID ${jobid} not found`);
      }

      const analysis = await generateFeedbackAnalysis({
        feedbackText: jobData.feedbackText,
        source: jobData.source ?? undefined,
        userTier: jobData.userTier ?? undefined,
      });

      // Save analysis result to Database
      await db.orm.public.JobResult.create({
        jobId: jobid,
        sentiment: analysis.sentiment,
        category: analysis.category,
        summary: analysis.summary,
        actionItem: analysis.actionItem,
        urgencyScore: analysis.urgencyScore,
      });

      // Update Job status to COMPLETED
      await db.orm.public.Job.where((j) => j.id.eq(jobid)).update({
        status: "COMPLETED",
      });

      console.log(`Job ${jobid} successfully processed and marked as COMPLETED.`);
    } catch (err) {
      console.error(`Job ${jobid} failed:`, err);
      // Mark as FAILED in Database
      try {
        await db.orm.public.Job.where((j) => j.id.eq(jobid)).update({
          status: "FAILED",
        });
      } catch (dbErr) {
        console.error(`Failed to update job status to FAILED:`, dbErr);
      }
      throw err;
    }
  },
  {
    connection: workerConnection,
  }
);

worker.on("completed", (job) => {
  console.log(`Job ${job.id} completed.`);
});

worker.on("failed", (job, err) => {
  console.error(`Job ${job?.id} failed with error:`, err);
});

worker.on("error", (err) => {
  console.error("Worker encountered an error:", err);
});
