import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { db } from "../../utils/db";
import { queue } from "../../worker/queue";
import { CreateJobSchema, GetJobResponseSchema, JobItemSchema, ListJobSchema } from "./schema";

const ErrorResponseSchema = z.object({
  error: z.string(),
}).openapi("ErrorResponseSchema");

export const jobRouter = new OpenAPIHono()
  .openapi(
    createRoute({
      method: "get",
      path: "/",
      tags: ["Jobs"],
      operationId: "listJobs",
      summary: "List jobs",
      responses: {
        200: {
          description: "Successfully fetched jobs",
          content: {
            "application/json": { schema: ListJobSchema },
          },
        },
      },
    }),
    async (c) => {
      const jobs = await db.orm.public.Job.all();
      return c.json(
        {
          jobs: jobs.map((j) => ({
            id: j.id,
            feedbackText: j.feedbackText,
            source: (j.source as "appstore" | "playstore" | "website") ?? null,
            userTier: (j.userTier as "free" | "premium") ?? null,
            status: (j.status as "PENDING" | "COMPLETED" | "FAILED") ?? "PENDING",
          })),
        },
        200
      );
    }
  )
  .openapi(
    createRoute({
      method: "get",
      path: "/:id",
      tags: ["Jobs"],
      operationId: "getJob",
      summary: "Get job detail and analysis result",
      responses: {
        200: {
          description: "Successfully fetched job and result",
          content: {
            "application/json": { schema: GetJobResponseSchema },
          },
        },
        404: {
          description: "Job not found",
          content: {
            "application/json": { schema: ErrorResponseSchema },
          },
        },
      },
    }),
    async (c) => {
      const { id } = c.req.param();
      const job = await db.orm.public.Job.where((j) => j.id.eq(id)).first();

      if (!job) {
        return c.json(
          {
            error: "Job not found",
          },
          404
        );
      }

      const jobResult = await db.orm.public.JobResult.where(
        (jr) => jr.jobId.eq(id)
      ).first();

      return c.json(
        {
          job: {
            id: job.id,
            feedbackText: job.feedbackText,
            source: (job.source as "appstore" | "playstore" | "website") ?? null,
            userTier: (job.userTier as "free" | "premium") ?? null,
            status: (job.status as "PENDING" | "COMPLETED" | "FAILED") ?? "PENDING",
          },
          result: jobResult
            ? {
                id: jobResult.id,
                jobId: jobResult.jobId,
                sentiment: jobResult.sentiment as "POSITIVE" | "NEGATIVE" | "NEUTRAL",
                category: jobResult.category as "BUG_REPORT" | "FEATURE_REQUEST" | "PRICING" | "OTHER",
                summary: jobResult.summary,
                actionItem: jobResult.actionItem,
                urgencyScore: jobResult.urgencyScore,
              }
            : null,
        },
        200
      );
    }
  )
  .openapi(
    createRoute({
      method: "post",
      path: "/",
      tags: ["Jobs"],
      operationId: "createJob",
      summary: "Create Job",
      request: {
        body: {
          content: {
            "application/json": {
              schema: CreateJobSchema,
            },
          },
        },
      },
      responses: {
        202: {
          description: "Successfully created job",
          content: {
            "application/json": { schema: JobItemSchema },
          },
        },
        400: { description: "Invalid or missing JSON request body" },
      },
    }),
    async (c) => {
      const body = c.req.valid("json");
      const newJob = await db.orm.public.Job.create({
        feedbackText: body.feedbackText,
        source: body.source,
        userTier: body.userTier,
        status: "PENDING",
      });

      await queue.add("generate-feedback-analysis", newJob, {
        attempts: 3,
        backoff: {
          type: "exponential",
          delay: 1000,
        },
      });

      return c.json(
        {
          id: newJob.id,
          feedbackText: newJob.feedbackText,
          source: (newJob.source as "appstore" | "playstore" | "website") ?? null,
          userTier: (newJob.userTier as "free" | "premium") ?? null,
          status: "PENDING" as const,
        },
        202
      );
    }
  );
