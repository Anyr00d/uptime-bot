import axios from "axios";
import { PrismaClient } from "@prisma/client";
import { performance } from "perf_hooks";

const prisma = new PrismaClient();

export async function pollAllUrls() {
  const urls = await prisma.monitoredURL.findMany({
    where: { deleted: false },
  });

  for (const { id, url, headers } of urls) {
    const start = performance.now();

    try {
      const formattedHeaders =
        headers && typeof headers === "object" && !Array.isArray(headers)
          ? (headers as Record<string, string>)
          : undefined;

      const res = await axios.get(url, {
        headers: formattedHeaders,
        timeout: 10000,
      });

      const ms = performance.now() - start;
      console.log(`✅ ${url} - ${res.status} (${ms}ms)`);

      await prisma.uRLPing.create({
        data: {
          monitoredUrlId: id,
          isUp: true,
          statusCode: res.status,
          responseTime: ms,
        },
      });

    } catch (err) {
      const ms = performance.now() - start;
      console.log(`❌ ${url} - DOWN (${ms}ms)`);
      await prisma.uRLPing.create({
        data: {
          monitoredUrlId: id,
          isUp: false,
          responseTime: ms,
        },
      });
    }
  }
}
