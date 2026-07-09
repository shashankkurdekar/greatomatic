import { NextResponse, NextRequest } from "next/server";
import pool from "@/lib/db";

export async function PATCH(req: NextRequest) {
  try {
    const { id } = await req.json();
    const query = "UPDATE admin SET status = '1' WHERE adminID = ?";
    const [result] = await pool.execute(query, [id]);
    return NextResponse.json({ message: "Admin activated successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to activate admin" }, { status: 500 });
  }
}