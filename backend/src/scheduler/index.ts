import cron from "node-cron";
import { pollAllUrls } from "./poll";

export function startScheduler() {
  console.log("🕒 Scheduler started. Polling every 10 minutes...");

  cron.schedule("*/10 * * * *", async () => {
    console.log("🔁 Running poll cycle...");
    await pollAllUrls();
  });
}
