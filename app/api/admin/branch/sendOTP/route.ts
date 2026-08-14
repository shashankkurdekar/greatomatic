import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { cookies } from "next/headers";
export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json(
        {
          message: "Email is required",
        },
        { status: 400 },
      );
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    

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
      subject: "Verify your email address",
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
            .credentials {
              background-color: #f3f4f6;
              padding: 16px;
              border-radius: 8px;
              margin: 16px 0;
              list-style: none;
            }
            .credentials li {
              margin-bottom: 12px;
            }
            .credentials strong {
              display: inline-block;
              width: 80px;
            }
            .button {
              display: inline-block;
              margin: 20px 0;
              padding: 14px 24px;
              background-color: #1d4ed8;
              color: #ffffff;
              text-decoration: none;
              border-radius: 8px;
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
              <h1>Verify your email address</h1>
            </div>
            <div class="content">
              <p>Hello, ${email}</p>
              <p>Please use the following OTP to verify your email address:</p>
              <ul class="credentials">
                <li><strong>OTP:</strong> ${otp}</li>
              </ul>
              <a class="button" style="color: #ffffff; text-decoration: none;" href="${process.env.NODE_ENV === "development" ? "http://localhost:3000/login/admin" : "https://greatomatic.com/login/admin"}">Open Admin Login</a>
              <p>If you did not request this email, please ignore it or contact support.</p>
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

    const cookieStore = await cookies();
    cookieStore.set("otp", otp, { httpOnly: true, secure: true });

    return NextResponse.json(
      {
        message: "OTP sent successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        message: "Internal Server Error",
      },
      { status: 500 },
    );
  }
}
