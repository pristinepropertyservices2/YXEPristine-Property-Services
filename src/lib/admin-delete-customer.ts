import type { Prisma } from "@prisma/client";

/**
 * Deletes a single non-admin user and dependent rows. Call inside `db.$transaction`.
 */
export async function deleteCustomerUserTx(
  tx: Prisma.TransactionClient,
  userId: string,
): Promise<void> {
  const user = await tx.user.findUnique({
    where: { id: userId },
    select: { id: true, role: true },
  });

  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }
  if (user.role === "ADMIN") {
    throw new Error("CANNOT_DELETE_ADMIN");
  }

  await tx.payment.deleteMany({
    where: { booking: { userId } },
  });
  await tx.payment.deleteMany({
    where: { subscription: { userId } },
  });
  await tx.payment.deleteMany({ where: { userId } });
  await tx.booking.deleteMany({ where: { userId } });
  await tx.subscription.deleteMany({ where: { userId } });
  await tx.account.deleteMany({ where: { userId } });
  await tx.session.deleteMany({ where: { userId } });
  await tx.verificationToken.deleteMany({ where: { userId } });
  await tx.user.delete({ where: { id: userId } });
}
