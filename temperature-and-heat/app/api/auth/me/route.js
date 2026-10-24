import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { query } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ user: null });
  try {
    const result = await query(
      "SELECT id, username FROM tbl_users WHERE id = $1",
      [session.id],
    );
    const user = result.rows[0];
    if (!user) return NextResponse.json({ user: null });
    return NextResponse.json({
      user: { id: user.id, username: user.username },
    });
  } catch {
    return NextResponse.json(
      { error: "Unable to restore the session." },
      { status: 503 },
    );
  }
}
