/* eslint-disable @typescript-eslint/no-explicit-any */
import pool from "@/lib/db";
import { NextResponse, NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import nodemailer from "nodemailer";
export async function POST(req: NextRequest) {
  try {
    const { email, clientOTP } = await req.json();

    if (!email || !clientOTP) {
      return NextResponse.json(
        { message: "Email and OTP are required." },
        { status: 400 },
      );
    }

    const [rows] = await pool.query<any[]>(
      "SELECT * FROM admin WHERE email = ?",
      [email],
    );
    const admin = rows[0];

    if (!admin) {
      return NextResponse.json({ message: "Invalid email." }, { status: 401 });
    }

    const cookieStore = await cookies();
    const otpToken = cookieStore.get("otp");

    if (!otpToken) {
      return NextResponse.json({ message: "Invalid or expired OTP." }, { status: 401 });
    }

    const decoded = jwt.verify(otpToken.value, process.env.JWT_SECRET!) as { email: string; otp: string };

    if (decoded.email !== email) {
      return NextResponse.json({ message: "Invalid email." }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(clientOTP, decoded.otp);

    if (!isMatch) {
      return NextResponse.json({ message: "Invalid OTP." }, { status: 401 });
    }

    cookieStore.delete("otp");

    return NextResponse.json(
      { message: "OTP verified successfully." },
      { status: 200 },
    );
  } catch (error) {
    console.error(
      process.env.NODE_ENV === "development"
        ? error
        : "An error occurred during login.",
    );
    return NextResponse.json(
      { message: "An error occurred during login." },
      { status: 500 },
    );
  }
}
