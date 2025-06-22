-- CreateTable
CREATE TABLE "URLPing" (
    "id" TEXT NOT NULL,
    "monitoredUrlId" TEXT NOT NULL,
    "statusCode" INTEGER,
    "responseTime" INTEGER,
    "isUp" BOOLEAN NOT NULL,
    "checkedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "URLPing_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "URLPing" ADD CONSTRAINT "URLPing_monitoredUrlId_fkey" FOREIGN KEY ("monitoredUrlId") REFERENCES "MonitoredURL"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
