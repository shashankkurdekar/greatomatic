/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse, NextRequest } from "next/server";
import pool from "@/lib/db";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
export async function PATCH(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const cookie = cookieStore.get("admintoken");
    if (!cookie?.value) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const decoded: any = jwt.decode(cookie.value);
    const email = decoded?.email;
    if (!email) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
    const { password } = await req.json();
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = "UPDATE admin SET password = ? WHERE email = ?";
    await pool.execute(query, [hashedPassword, email]);
    return NextResponse.json({ message: "Password Changed successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to Change Password" }, { status: 500 });
  }
}