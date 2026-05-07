-- PostgreSQL requires enum additions to be committed before use.
-- This runs after the previous migration so UNPAID is now safe to use.
ALTER TABLE "Booking"
ALTER COLUMN "paymentStatus" SET DEFAULT 'UNPAID';

UPDATE "Booking"
SET "paymentStatus" = 'UNPAID'
WHERE "paymentStatus" = 'PENDING'
  AND ("status" = 'PENDING' OR "status" = 'CONFIRMED');
