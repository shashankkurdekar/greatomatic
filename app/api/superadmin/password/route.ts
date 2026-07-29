import { NextResponse, NextRequest } from "next/server";
import pool from "@/lib/db";
import bcrypt from "bcryptjs";

export async function PATCH(req: NextRequest) {
  try {
    const { password } = await req.json();
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = "UPDATE admin SET password = ? WHERE adminID = ?";
    await pool.execute(query, [hashedPassword, "GIPL-Superadmin"]);
    return NextResponse.json({ message: "Password Changed successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to Change Password" }, { status: 500 });
  }
}