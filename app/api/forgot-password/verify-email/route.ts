/* eslint-disable @typescript-eslint/no-explicit-any */
import pool from "@/lib/db";
import { NextResponse, NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import nodemailer from "nodemailer";
export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { message: "Email is required." },
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

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = await bcrypt.hash(otp, 10);
    console.log(hashedOtp);
    const otpToken = jwt.sign(
      { email: admin.email, otp: hashedOtp },
      process.env.JWT_SECRET!,
      { expiresIn: "10m" },
    );
    const cookieStore = await cookies();
    cookieStore.set("otp", otpToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 10 * 60,
    });
    const transport = nodemailer.createTransport({
      host: "smtp.zeptomail.in",
      port: 587,
      auth: {
        user: "emailapikey",
        pass: "PHtE6r1fSuHojDIsoBkF7fK/EMfyNIoqqLxkLVRPtIwXDaUBTE1V+t0swDDhr08pB6RERfXIz4xps7rNuu6GIDrqNGdFVGqyqK3sx/VYSPOZsbq6x00bsF0SckXUUYbnc9Jt0iHWuNfeNA==",
      },
    });

    const mailOptions = {
      from: '"Greatomatic Team" <noreply@greatomatic.com>',
      to: email,
      subject: "Password Reset Request - OTP Verification",
      html: `
      <!doctype html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <style>
            body {
              margin: 0;
              padding: 0;
              font-family: Arial, sans-serif;
              background-color: #f4f6fa;
              color: #333333;
            }
            .email-container {
              max-width: 600px;
              margin: 0 auto;
              background-color: #ffffff;
              border-radius: 12px;
              overflow: hidden;
              box-shadow: 0 0 20px rgba(0, 0, 0, 0.08);
            }
            .header {
              background-color: #1d4ed8;
              color: #ffffff;
              padding: 24px;
              text-align: center;
            }
            .header h1 {
              margin: 0;
              font-size: 24px;
            }
            .content {
              padding: 24px;
            }
            .content p {
              line-height: 1.7;
              margin: 16px 0;
            }
            .otp-box {
              background-color: #f3f4f6;
              padding: 24px;
              border-radius: 8px;
              margin: 24px 0;
              text-align: center;
              border: 2px solid #1d4ed8;
            }
            .otp-code {
              font-size: 32px;
              font-weight: bold;
              color: #1d4ed8;
              letter-spacing: 4px;
              font-family: monospace;
            }
            .otp-expiry {
              font-size: 12px;
              color: #6b7280;
              margin-top: 12px;
            }
            .warning {
              background-color: #fef3c7;
              padding: 12px 16px;
              border-radius: 8px;
              margin: 16px 0;
              border-left: 4px solid #f59e0b;
              font-size: 14px;
              color: #92400e;
            }
            .footer {
              padding: 20px 24px;
              font-size: 14px;
              color: #6b7280;
              text-align: center;
              background-color: #f9fafb;
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="header">
              <h1>Password Reset Request</h1>
            </div>
            <div class="content">
              <p>Hello,</p>
              <p>We received a request to reset your password. Use the OTP code below to verify your identity and reset your password.</p>
              <div class="otp-box">
                <div class="otp-code">${otp}</div>
                <div class="otp-expiry">This OTP expires in 10 minutes</div>
              </div>
              <div class="warning">
                <strong>Important:</strong> Do not share this OTP with anyone. Greatomatic Team will never ask for your OTP.
              </div>
              <p>If you did not request a password reset, please ignore this email or contact support immediately.</p>
            </div>
            <div class="footer">
              <p>Greatomatic Team</p>
              <p>noreply@greatomatic.com</p>
            </div>
          </div>
        </body>
      </html>
    `,
    };
    await transport.sendMail(mailOptions);
    return NextResponse.json(
      { message: "OTP sent successfully." },
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
