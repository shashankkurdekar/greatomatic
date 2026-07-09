import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admintoken");

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  cookieStore.delete("admintoken");

  return NextResponse.json({ message: "Logged out successfully" }, { status: 200 });
}