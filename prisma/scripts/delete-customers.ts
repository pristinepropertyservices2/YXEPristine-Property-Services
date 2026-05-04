/**
 * Delete one or more users (customers) and dependent rows using Prisma.
 *
 * Usage (from project root, .env with DATABASE_URL):
 *   npx tsx prisma/scripts/delete-customers.ts <userId> [userId ...]
 *
 * Or:
 *   npm run db:delete-users -- <userId> [userId ...]
 *
 * Refuses to delete users with role ADMIN unless you pass --force-admin
 */
import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function parseArgs(argv: string[]) {
  const forceAdmin = argv.includes("--force-admin");
  const ids = argv.filter((a) => !a.startsWith("--"));
  return { ids, forceAdmin };
}

async function deleteUsersByIds(userIds: string[], forceAdmin: boolean) {
  if (userIds.length === 0) {
    console.error("Usage: npx tsx prisma/scripts/delete-customers.ts <userId> [userId ...]");
    console.error("       npm run db:delete-users -- <userId> [userId ...]");
    process.exit(1);
  }

  const users = await prisma.user.findMany({
    where: { id: { in: userIds } },
    select: { id: true, email: true, role: true },
  });

  if (users.length === 0) {
    console.log("No matching users found.");
    return;
  }

  const missing = userIds.filter((id) => !users.some((u) => u.id === id));
  if (missing.length) {
    console.warn("Unknown ids (skipped):", missing.join(", "));
  }

  const admins = users.filter((u) => u.role === "ADMIN");
  if (admins.length && !forceAdmin) {
    console.error("Refusing to delete ADMIN user(s). Pass --force-admin to override.");
    console.error(admins.map((u) => `${u.id} ${u.email}`).join("\n"));
    process.exit(1);
  }

  console.log("Deleting:", users.map((u) => `${u.email} (${u.id})`).join("\n"));

  await prisma.$transaction(async (tx) => {
    const p1 = await tx.payment.deleteMany({
      where: { booking: { userId: { in: userIds } } },
    });
    const p2 = await tx.payment.deleteMany({
      where: { subscription: { userId: { in: userIds } } },
    });
    const p3 = await tx.payment.deleteMany({ where: { userId: { in: userIds } } });
    const b = await tx.booking.deleteMany({ where: { userId: { in: userIds } } });
    const s = await tx.subscription.deleteMany({ where: { userId: { in: userIds } } });
    const a = await tx.account.deleteMany({ where: { userId: { in: userIds } } });
    const sess = await tx.session.deleteMany({ where: { userId: { in: userIds } } });
    const v = await tx.verificationToken.deleteMany({ where: { userId: { in: userIds } } });
    const u = await tx.user.deleteMany({ where: { id: { in: userIds } } });

    console.log(
      `Removed: payments(bookings)=${p1.count} payments(subs)=${p2.count} payments(user)=${p3.count} bookings=${b.count} subscriptions=${s.count} accounts=${a.count} sessions=${sess.count} verificationTokens=${v.count} users=${u.count}`,
    );
  });
}

const { ids, forceAdmin } = parseArgs(process.argv.slice(2));

deleteUsersByIds(ids, forceAdmin)
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
