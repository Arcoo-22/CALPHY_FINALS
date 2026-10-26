import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { query } from "@/lib/db";
import { toProgressDto } from "@/lib/progress";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ user: null });
  try {
    const result = await query(
      "SELECT id, username, user_progress FROM tbl_users WHERE id = $1",
      [session.id],
    );
    const user = result.rows[0];
    if (!user) return NextResponse.json({ user: null });
    return NextResponse.json({
      user: { id: user.id, username: user.username },
      progress: toProgressDto(user.user_progress),
    });
  } catch {
    return NextResponse.json(
      { error: "Unable to restore the session." },
      { status: 503 },
    );
  }
}
