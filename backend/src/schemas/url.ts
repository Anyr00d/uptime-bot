import { z } from "zod";

export const createUrlSchema = z.object({
  body: z.object({
    url: z.string().url("Invalid URL").min(5),
    headers: z.record(z.string()).optional(),
  })
});

export const getMetricsSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
});

export const getUrlSummarySchema = getMetricsSchema;
