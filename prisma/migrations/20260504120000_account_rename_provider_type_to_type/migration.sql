-- NextAuth Prisma adapter sends `type` (e.g. "oauth"), not `providerType`.
ALTER TABLE "Account" RENAME COLUMN "providerType" TO "type";
