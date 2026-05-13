-- Square payment support (enum value + optional Square payment id)
ALTER TYPE "PaymentMethod" ADD VALUE IF NOT EXISTS 'SQUARE';

ALTER TABLE "Payment" ADD COLUMN IF NOT EXISTS "squareId" TEXT;
