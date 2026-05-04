import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { db } from "@/lib/db";
import { deleteCustomerUserTx } from "@/lib/admin-delete-customer";

type Params = { params: Promise<{ id: string }> };

export async function DELETE(_request: Request, { params }: Params) {
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

    const { id } = await params;
    if (id === session.user.id) {
      return NextResponse.json(
        { error: "You cannot delete your own account from here." },
        { status: 400 },
      );
    }

    await db.$transaction(async (tx) => {
      await deleteCustomerUserTx(tx, id);
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete user";
    if (message === "USER_NOT_FOUND") {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    if (message === "CANNOT_DELETE_ADMIN") {
      return NextResponse.json({ error: "Cannot delete an admin user" }, { status: 400 });
    }
    console.error("Admin user delete:", error);
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}
