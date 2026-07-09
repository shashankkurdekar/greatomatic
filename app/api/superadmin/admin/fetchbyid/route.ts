/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse, NextRequest } from "next/server";
import pool from "@/lib/db";
import { cookies } from "next/headers";
export async function POST(request: NextRequest) {
  const { id } = await request.json();

  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admintoken");
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    // Typecast query result to any to avoid TypeScript indexing issues
    const [rows]: any = await pool.query("SELECT name, email, mobile, address, image, status FROM admin WHERE adminID = ?", [id]);
    const admin = rows[0];

    if (!admin) {
      return NextResponse.json({ error: "Admin not found" }, { status: 404 });
    }

    return NextResponse.json(admin, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
