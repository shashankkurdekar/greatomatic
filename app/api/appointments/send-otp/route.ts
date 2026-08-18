import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import crypto from "crypto";
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken'
export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required." },
        { status: 400 }
      );
    }

    // Generate 6 digit OTP
    const otp = crypto
      .randomInt(100000, 1000000)
      .toString();

    const token = jwt.sign({ otp }, process.env.JWT_SECRET!);

    const cookieStore = await cookies();

    cookieStore.set("otp", token, { httpOnly: true });

    const transport = nodemailer.createTransport({
      host: "smtp.zeptomail.in",
      port: 587,
      auth: {
        user: "emailapikey",
        pass: "PHtE6r1fSuHojDIsoBkF7fK/EMfyNIoqqLxkLVRPtIwXDaUBTE1V+t0swDDhr08pB6RERfXIz4xps7rNuu6GIDrqNGdFVGqyqK3sx/VYSPOZsbq6x00bsF0SckXUUYbnc9Jt0iHWuNfeNA==",
      },
    });

    await transport.sendMail({
      from: '"Greatomatic Team" <noreply@greatomatic.com>',
      to: email,
      subject: "Greatomatic - Email Verification OTP",

      html: `
        <!doctype html>
        <html>
        <head>
          <meta charset="UTF-8" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />

          <style>
            body {
              margin: 0;
              padding: 0;
              background: #f1f5f9;
              font-family: Arial, sans-serif;
            }

            .container {
              max-width: 600px;
              margin: 40px auto;
              background: #ffffff;
              border-radius: 20px;
              overflow: hidden;
              box-shadow: 0 10px 40px rgba(0,0,0,.08);
            }

            .header {
              padding: 30px;
              text-align: center;
              color: #ffffff;
              background: linear-gradient(
                135deg,
                #2563eb,
                #4338ca
              );
            }

            .header h1 {
              margin: 0;
              font-size: 25px;
            }

            .content {
              padding: 35px;
            }

            .otp {
              margin: 30px 0;
              padding: 25px;
              text-align: center;
              border-radius: 15px;
              background: #eff6ff;
              border: 2px solid #bfdbfe;
            }

            .otp-code {
              color: #2563eb;
              font-size: 36px;
              font-weight: bold;
              letter-spacing: 8px;
            }

            .expiry {
              margin-top: 10px;
              color: #64748b;
              font-size: 13px;
            }

            .warning {
              padding: 15px;
              border-radius: 10px;
              background: #fef3c7;
              color: #92400e;
              font-size: 13px;
            }

            .footer {
              padding: 20px;
              text-align: center;
              background: #f8fafc;
              color: #64748b;
              font-size: 13px;
            }
          </style>
        </head>

        <body>

          <div class="container">

            <div class="header">
              <h1>Verify Your Email</h1>
            </div>

            <div class="content">

              <p>Hello,</p>

              <p>
                We received a request to verify your email
                address for booking an appointment with
                Greatomatic.
              </p>

              <div class="otp">

                <div class="otp-code">
                  ${otp}
                </div>

                <div class="expiry">
                  This OTP expires in 10 minutes.
                </div>

              </div>

              <div class="warning">
                <strong>Important:</strong>
                Never share this OTP with anyone.
                Greatomatic Team will never ask for your OTP.
              </div>

              <p>
                If you did not request this verification,
                you can safely ignore this email.
              </p>

            </div>

            <div class="footer">
              Greatomatic Team<br />
              noreply@greatomatic.com
            </div>

          </div>

        </body>
        </html>
      `,
    });

    return NextResponse.json(
      {
        message: "OTP sent successfully.",
      },
      { status: 200 }
    );

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Failed to send OTP.",
      },
      { status: 500 }
    );
  }
}