-- Add new enum values for booking-level payment state.
ALTER TYPE "PaymentStatus" ADD VALUE IF NOT EXISTS 'UNPAID';
ALTER TYPE "PaymentStatus" ADD VALUE IF NOT EXISTS 'PAID';

-- Add workflow and snapshot columns to Booking.
ALTER TABLE "Booking"
ADD COLUMN IF NOT EXISTS "customerName" TEXT,
ADD COLUMN IF NOT EXISTS "email" TEXT,
ADD COLUMN IF NOT EXISTS "phone" TEXT,
ADD COLUMN IF NOT EXISTS "serviceType" TEXT,
ADD COLUMN IF NOT EXISTS "bookingDate" TIMESTAMP(3),
ADD COLUMN IF NOT EXISTS "bookingTime" TEXT,
ADD COLUMN IF NOT EXISTS "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'UNPAID',
ADD COLUMN IF NOT EXISTS "assignedCleanerId" TEXT;

-- Backfill snapshot columns from existing data.
UPDATE "Booking" b
SET
  "customerName" = COALESCE(b."customerName", u."name"),
  "email" = COALESCE(b."email", u."email"),
  "phone" = COALESCE(b."phone", u."phone"),
  "serviceType" = COALESCE(b."serviceType", s."name"),
  "bookingDate" = COALESCE(b."bookingDate", b."date"),
  "bookingTime" = COALESCE(b."bookingTime", b."time")
FROM "User" u, "Service" s
WHERE b."userId" = u."id"
  AND b."serviceId" = s."id";

-- Create Cleaner table and relation.
CREATE TABLE IF NOT EXISTS "Cleaner" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "email" TEXT,
  "phone" TEXT,
  "availability" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Cleaner_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "Cleaner_email_key" ON "Cleaner"("email");
CREATE INDEX IF NOT EXISTS "Booking_assignedCleanerId_idx" ON "Booking"("assignedCleanerId");

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'Booking_assignedCleanerId_fkey'
  ) THEN
    ALTER TABLE "Booking"
    ADD CONSTRAINT "Booking_assignedCleanerId_fkey"
    FOREIGN KEY ("assignedCleanerId") REFERENCES "Cleaner"("id")
    ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;
