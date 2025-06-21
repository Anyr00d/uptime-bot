import { z } from "zod";

export const createUrlSchema = z.object({
  url: z.string().url("Invalid URL").min(5),
  headers: z.record(z.string()).optional(),
});
