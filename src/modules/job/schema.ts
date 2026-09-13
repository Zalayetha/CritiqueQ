import { z } from "@hono/zod-openapi";

export const CreateJobSchema = z.object({
  feedbackText: z.string().max(255).openapi({
    example: "The app crashes every time I try to export my analytics report on iOS 18."
  }),
  source: z.enum(["appstore", "playstore", "website"]).openapi({
    example: "appstore"
  }),
  userTier: z.enum(["free", "premium"]).openapi({
    example: "premium"
  }),
}).openapi("CreateJobSchema")

export const JobItemSchema = z.object({
  id: z.string(),
  feedbackText: z.string().max(255).openapi({
    example: "The app crashes every time I try to export my analytics report on iOS 18."
  }),
  source: z.enum(["appstore", "playstore", "website"]).nullable().openapi({
    example: "appstore"
  }),
  userTier: z.enum(["free", "premium"]).nullable().openapi({
    example: "premium"
  }),
  status: z.enum(["PENDING", "COMPLETED", "FAILED"]).openapi({
    example: "PENDING"
  }),
}).openapi("JobItemSchema")

export const ListJobSchema = z.object({
  jobs: z.array(JobItemSchema),
}).openapi("ListJobSchema")

export const AnalysisOutputSchema = z.object({
  sentiment: z.enum(["POSITIVE", "NEGATIVE", "NEUTRAL"]),
  category: z.enum(["BUG_REPORT", "FEATURE_REQUEST", "PRICING", "OTHER"]),
  summary: z.string(),
  actionItem: z.string(),
  urgencyScore: z.number().min(1).max(5),
}).openapi("AnalysisOutputSchema")

export const JobResultSchema = z.object({
  id: z.string(),
  jobId: z.string(),
  sentiment: z.enum(["POSITIVE", "NEGATIVE", "NEUTRAL"]),
  category: z.enum(["BUG_REPORT", "FEATURE_REQUEST", "PRICING", "OTHER"]),
  summary: z.string(),
  actionItem: z.string(),
  urgencyScore: z.number().min(1).max(5),
}).openapi("JobResultSchema")

export const GetJobResponseSchema = z.object({
  job: JobItemSchema,
  result: JobResultSchema.nullable(),
}).openapi("GetJobResponseSchema")
