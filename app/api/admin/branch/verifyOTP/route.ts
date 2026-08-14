import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
export async function POST(req: NextRequest) {
    try {
        const { email, otp } = await req.json();
        if (!email || !otp) {
            return NextResponse.json(
                {
                    message: "Email and OTP are required",
                    success: false,
                },
                { status: 200 },
            );
        }
        const cookieStore = await cookies();
        const storedOtp = cookieStore.get("otp")?.value;
        if (!storedOtp) {
            return NextResponse.json(
                {
                    message: "OTP has expired or is not set",
                    success: false,
                },
                { status: 200 },
            );
        }

        if (storedOtp !== otp) {
            return NextResponse.json(
                {
                    message: "Invalid OTP",
                    success: false,
                },
                { status: 200 },
            );
        }

        cookieStore.delete("otp");

        return NextResponse.json(
            {
                success: true,
                message: "OTP verified successfully",
            },
            { status: 200 },
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            {
                success: false,
                message: "Internal Server Error",
            },
            { status: 500 },
        );
    }
}