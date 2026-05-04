import type { Adapter } from 'next-auth/adapters';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import type { PrismaClient } from '@prisma/client';

function parseExpiresAt(
  expires_at: unknown,
  expiresAt: unknown,
): Date | null {
  if (expires_at != null && typeof expires_at === 'number') {
    return new Date(expires_at * 1000);
  }
  if (expires_at != null && typeof expires_at === 'string') {
    const n = Number(expires_at);
    if (!Number.isNaN(n)) return new Date(n * 1000);
  }
  if (expiresAt instanceof Date) return expiresAt;
  return null;
}

/**
 * Wraps {@link PrismaAdapter} so `linkAccount` matches this project's Prisma `Account` model.
 * NextAuth passes OAuth fields as snake_case (`access_token`, `expires_at`, …); our schema uses camelCase.
 */
export function prismaAuthAdapter(prisma: PrismaClient): Adapter {
  const base = PrismaAdapter(prisma);
  return {
    ...base,
    linkAccount(account) {
      const a = account as Record<string, unknown>;
      return prisma.account.create({
        data: {
          userId: String(a.userId),
          type: String(a.type),
          provider: String(a.provider),
          providerAccountId: String(a.providerAccountId),
          refreshToken:
            (a.refresh_token ?? a.refreshToken) as string | null | undefined,
          accessToken:
            (a.access_token ?? a.accessToken) as string | null | undefined,
          expiresAt: parseExpiresAt(a.expires_at, a.expiresAt),
          tokenType:
            (a.token_type ?? a.tokenType) as string | null | undefined,
          scope: a.scope as string | null | undefined,
          idToken: (a.id_token ?? a.idToken) as string | null | undefined,
          sessionState:
            (a.session_state ?? a.sessionState) as string | null | undefined,
        },
      });
    },
  };
}
