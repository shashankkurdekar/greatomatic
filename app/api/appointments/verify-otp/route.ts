import { NextRequest, NextResponse } from "next/server";
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

export async function POST(req: NextRequest) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json(
        { error: "Email and OTP are required." },
        { status: 400 }
      );
    }

    const normalizedEmail = email
      .trim()
      .toLowerCase();

    const cookieStore = await cookies();

    const cookieotp = cookieStore.get("otp")?.value;

    if (cookieotp !== otp) 

    return NextResponse.json(
      {
        message: "Email verified successfully.",
        verified: true,
      },
      { status: 200 }
    );

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "OTP verification failed." },
      { status: 500 }
    );
  }
}