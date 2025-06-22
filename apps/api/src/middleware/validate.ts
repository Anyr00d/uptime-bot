import { ZodSchema, z } from "zod";
import { Request, Response, NextFunction } from "express";
import { ValidatedRequest } from "../types/ValidatedRequest";

export const validate = (schema: ZodSchema<any>) => (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const result = schema.safeParse({
    body: req.body,
    query: req.query,
    params: req.params,
  });

  if (!result.success) {
    res.status(400).json({ error: result.error.format() });
    return;
  }
  (req as ValidatedRequest<z.infer<typeof schema>>).validated = result.data;
  next();
};
