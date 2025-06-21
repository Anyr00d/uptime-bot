import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { authMiddleware, AuthRequest } from "../middleware/authMiddleware";
import { validate } from "../middleware/validate";
import { createUrlSchema } from "../schemas/url";

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

export default router;
