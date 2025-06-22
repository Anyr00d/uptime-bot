import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { authMiddleware } from "../middleware/authMiddleware";
import { AuthRequest } from "../types/AuthRequest";
import { validate } from "../middleware/validate";
import { createUrlSchema, getMetricsSchema } from "../schemas/url";
import { ValidatedRequest } from "../types/ValidatedRequest";
import {z} from "zod";

const router = Router();
const prisma = new PrismaClient();

router.post("/url", authMiddleware, validate(createUrlSchema), async (req: AuthRequest, res) => {
  const { url, headers } = req.body;

  const newUrl = await prisma.monitoredURL.create({
    data: {
      url,
      headers,
      userId: req.userId!,
    },
  });

  res.status(201).json(newUrl);
});

router.get("/url", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const urls = await prisma.monitoredURL.findMany({
      where: {
        userId: req.userId,
        deleted: false,
      },
      select: {
        id: true,
        url: true,
        headers: true,
        isHttps: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(urls);
  } catch (err) {
    console.error("Error fetching URLs:", err);
    res.status(500).json({ error: "Failed to fetch URLs" });
  }
});

router.delete("/url/:id", authMiddleware, async (req: AuthRequest, res) => {
  const { id } = req.params;

  const url = await prisma.monitoredURL.findUnique({
    where: { id }
  });

  if (!url || url.userId !== req.userId) {
    res.status(404).json({ error: "URL not found or unauthorized" });
    return;
  }

  await prisma.monitoredURL.update({
    where: { id },
    data: { deleted: true },
  });

  res.json({ message: "URL marked as deleted" });
  });



router.get("/url/:id/metrics",authMiddleware,validate(getMetricsSchema),async (req, res) => {
  const { userId } = req as AuthRequest;
  const { validated } = req as ValidatedRequest<z.infer<typeof getMetricsSchema>>;
  const urlId = validated.params.id;
  const monitored = await prisma.monitoredURL.findFirst({
    where: { id: urlId, userId: userId!, deleted: false },
  });

  if (!monitored) {
    res.status(404).json({ error: "URL not found or unauthorized" });
    return;
  }

  const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);

  const pings = await prisma.uRLPing.findMany({
    where: {
      monitoredUrlId: urlId,
      checkedAt: { gte: twoDaysAgo },
    },
    orderBy: { checkedAt: "desc" },
    select: {
      checkedAt: true,
      isUp: true,
      statusCode: true,
      responseTime: true,
    },
  });

  res.json({ url: monitored.url, pings });
});

export default router;
