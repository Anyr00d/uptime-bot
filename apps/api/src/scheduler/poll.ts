import axios from "axios";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function pollAllUrls() {
  const urls = await prisma.monitoredURL.findMany({
    where: { deleted: false },
  });

  for (const { id, url, headers } of urls) {
    const start = Date.now();

    try {
      const formattedHeaders =
        headers && typeof headers === "object" && !Array.isArray(headers)
          ? (headers as Record<string, string>)
          : undefined;

      const res = await axios.get(url, {
        headers: formattedHeaders,
        timeout: 10000,
      });

      const ms = Date.now() - start;
      console.log(`✅ ${url} - ${res.status} (${ms}ms)`);
    } catch (err) {
      const ms = Date.now() - start;
      console.log(`❌ ${url} - DOWN (${ms}ms)`);
    }
  }
}
