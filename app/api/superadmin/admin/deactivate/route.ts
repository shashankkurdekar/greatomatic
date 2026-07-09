import { NextResponse, NextRequest } from "next/server";
import pool from "@/lib/db";

export async function PATCH(req: NextRequest) {
  try {
    const { id } = await req.json();
    const query = "UPDATE admin SET status = '0' WHERE adminID = ?";
    const [result] = await pool.execute(query, [id]);
    return NextResponse.json({ message: "Admin deactivated successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to deactivate admin" }, { status: 500 });
  }
}