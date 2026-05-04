import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { db } from "@/lib/db";

type Params = { params: Promise<{ id: string }> };

/**
 * Removes linked Google OAuth rows for a customer so the next "Sign in with Google"
 * can run linkAccount again (fixes failed links after schema mismatches, etc.).
 */
export async function POST(_request: Request, { params }: Params) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const admin = await db.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });
    if (admin?.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id: userId } = await params;

    const target = await db.user.findUnique({
      where: { id: userId },
      select: { id: true, role: true, email: true },
    });
    if (!target) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    if (target.role === "ADMIN") {
      return NextResponse.json({ error: "Not allowed for admin users" }, { status: 400 });
    }

    const result = await db.account.deleteMany({
      where: { userId, provider: "google" },
    });

    return NextResponse.json({
      ok: true,
      deleted: result.count,
      message:
        result.count > 0
          ? "Google link removed. Ask the customer to use Sign in with Google again."
          : "No Google link was stored for this user. They can try Sign in with Google; if it still fails, ensure the database migration (Account.type) is deployed.",
    });
  } catch (error) {
    console.error("Admin disconnect Google:", error);
    return NextResponse.json({ error: "Failed to reset Google link" }, { status: 500 });
  }
}
