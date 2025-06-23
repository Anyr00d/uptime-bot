import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { AuthRequest } from "../types/AuthRequest";
import { validate } from "../middleware/validate";
import {
  createUrlSchema,
  getMetricsSchema,
  getUrlSummarySchema,
} from "../schemas/url";
import { ValidatedRequest } from "../types/ValidatedRequest";
import { z } from "zod";
import prisma from "../prismaclient";

const router = Router();

router.post(
  "/",
  authMiddleware,
  validate(createUrlSchema),
  async (req: AuthRequest, res) => {
    const { url, headers } = req.body;

    const newUrl = await prisma.monitoredURL.create({
      data: {
        url,
        headers,
        userId: req.userId!,
      },
    });

    res.status(201).json(newUrl);
  }
);

router.get("/", authMiddleware, async (req: AuthRequest, res) => {
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

router.delete("/:id", authMiddleware, async (req: AuthRequest, res) => {
  const { id } = req.params;

  const url = await prisma.monitoredURL.findUnique({
    where: { id },
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

router.get(
  "/:id/metrics",
  authMiddleware,
  validate(getMetricsSchema),
  async (req, res) => {
    const { userId } = req as AuthRequest;
    const { validated } = req as ValidatedRequest<
      z.infer<typeof getMetricsSchema>
    >;
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
  }
);

router.get(
  "/:id/summary",
  authMiddleware,
  validate(getUrlSummarySchema),
  async (req, res) => {
    const { userId } = req as AuthRequest;
    const { validated } = req as ValidatedRequest<
      z.infer<typeof getUrlSummarySchema>
    >;
    const urlId = validated.params.id;

    // Verify URL belongs to this user
    const url = await prisma.monitoredURL.findFirst({
      where: { id: urlId, userId: userId!, deleted: false },
    });

    if (!url) {
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
    });

    if (pings.length === 0) {
      res.json({
        uptimePercent: 0,
        avgResponseTime: null,
        latestStatus: null,
        downtimeStreak: 0,
      });
      return;
    }

    //1)upcount
    const upCount = pings.filter((p) => p.isUp).length;
    //2)avg response time
    const validPings = pings.filter((p) => p.responseTime !== null);
    const avgResponseTime =
      validPings.length > 0
        ? Math.round(
            validPings.reduce((sum, p) => sum + (p.responseTime as number), 0) /
              validPings.length
          )
        : null;
    //3)uptime %
    const uptimePercent = Math.round((upCount / pings.length) * 100);
    //4)latest ping
    const latest = pings[0];
    //5)if downtime now, what's the streak
    let streak = 0;
    for (const p of pings) {
      if (p.isUp) break;
      streak++;
    }

    res.json({
      uptimePercent,
      avgResponseTime,
      latestStatus: {
        isUp: latest.isUp,
        statusCode: latest.statusCode ?? null,
        checkedAt: latest.checkedAt,
      },
      downtimeStreak: streak,
    });
  }
);

export default router;
