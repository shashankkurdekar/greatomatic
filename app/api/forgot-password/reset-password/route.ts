/* eslint-disable @typescript-eslint/no-explicit-any */
import pool from "@/lib/db";
import { NextResponse, NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required." },
        { status: 400 },
      );
    }

    const [rows] = await pool.query<any[]>(
      "SELECT * FROM admin WHERE email = ?",
      [email],
    );
    const admin = rows[0];

    if (!admin) {
      const [rows1] = await pool.query<any[]>(
        "SELECT * FROM branch WHERE email = ?",
        [email],
      );
      const branch = rows1[0];
      if (!branch) {
        return NextResponse.json(
          { message: "Invalid email." },
          { status: 401 },
        );
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      await pool.query("UPDATE branch SET password = ? WHERE email = ?", [
        hashedPassword,
        email,
      ]);
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
        subject: "Password Changed Successfully",
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
          margin: 30px auto;
          background: #ffffff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 8px 20px rgba(0,0,0,0.08);
        }

        .header {
          background: linear-gradient(135deg,#16a34a,#15803d);
          color: #ffffff;
          text-align: center;
          padding: 30px;
        }

        .header h1 {
          margin: 0;
          font-size: 28px;
        }

        .content {
          padding: 30px;
        }

        .content p {
          line-height: 1.8;
          margin: 16px 0;
        }

        .success-box {
          margin: 30px 0;
          padding: 25px;
          text-align: center;
          background: #ecfdf5;
          border: 2px solid #16a34a;
          border-radius: 10px;
        }

        .success-icon {
          font-size: 60px;
          margin-bottom: 10px;
        }

        .success-title {
          font-size: 24px;
          color: #15803d;
          font-weight: bold;
        }

        .info {
          background: #eff6ff;
          border-left: 5px solid #2563eb;
          padding: 16px;
          margin: 25px 0;
          border-radius: 8px;
          font-size: 14px;
          color: #1e3a8a;
        }

        .warning {
          background: #fef3c7;
          border-left: 5px solid #f59e0b;
          padding: 16px;
          margin: 25px 0;
          border-radius: 8px;
          font-size: 14px;
          color: #92400e;
        }

        .button {
          display: inline-block;
          background: #2563eb;
          color: #ffffff !important;
          text-decoration: none;
          padding: 14px 30px;
          border-radius: 8px;
          font-weight: bold;
          margin-top: 20px;
        }

        .footer {
          background: #f9fafb;
          text-align: center;
          padding: 25px;
          color: #6b7280;
          font-size: 14px;
        }

        .footer a {
          color: #2563eb;
          text-decoration: none;
        }
      </style>
    </head>

    <body>

      <div class="email-container">

        <div class="header">
          <h1>Greatomatic</h1>
        </div>

        <div class="content">

          <p>Hello, ${admin.name}!</p>

          <p>
            Your account password has been changed successfully.
            This email confirms that your password was updated.
          </p>

          <div class="success-box">
            <div class="success-icon">✅</div>
            <div class="success-title">
              Password Updated Successfully
            </div>
          </div>

          <div class="info">
            <strong>Security Tip:</strong><br>
            Your new password is now active. Use it the next time you sign in to your account.
          </div>

          <div class="warning">
            <strong>Didn't make this change?</strong><br>
            If you did not change your password, your account may have been compromised.
            Please contact our support team immediately and reset your password again.
          </div>

          <p style="text-align:center;">
            <a href="https://greatomatic.com/login/admin" class="button">
              Login to Your Account
            </a>
          </p>

          <p>
            Thank you for choosing <strong>Greatomatic</strong>.
          </p>

          <p>
            Regards,<br>
            <strong>Greatomatic Team</strong>
          </p>

        </div>

        <div class="footer">
          <p><strong>Greatomatic Team</strong></p>
          <p>📧 noreply@greatomatic.com</p>
          <p>
            © ${new Date().getFullYear()} Greatomatic. All rights reserved.
          </p>
        </div>

      </div>

    </body>
  </html>
  `,
      };

      await transport.sendMail(mailOptions);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query("UPDATE admin SET password = ? WHERE email = ?", [
      hashedPassword,
      email,
    ]);

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
      subject: "Password Changed Successfully",
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
          margin: 30px auto;
          background: #ffffff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 8px 20px rgba(0,0,0,0.08);
        }

        .header {
          background: linear-gradient(135deg,#16a34a,#15803d);
          color: #ffffff;
          text-align: center;
          padding: 30px;
        }

        .header h1 {
          margin: 0;
          font-size: 28px;
        }

        .content {
          padding: 30px;
        }

        .content p {
          line-height: 1.8;
          margin: 16px 0;
        }

        .success-box {
          margin: 30px 0;
          padding: 25px;
          text-align: center;
          background: #ecfdf5;
          border: 2px solid #16a34a;
          border-radius: 10px;
        }

        .success-icon {
          font-size: 60px;
          margin-bottom: 10px;
        }

        .success-title {
          font-size: 24px;
          color: #15803d;
          font-weight: bold;
        }

        .info {
          background: #eff6ff;
          border-left: 5px solid #2563eb;
          padding: 16px;
          margin: 25px 0;
          border-radius: 8px;
          font-size: 14px;
          color: #1e3a8a;
        }

        .warning {
          background: #fef3c7;
          border-left: 5px solid #f59e0b;
          padding: 16px;
          margin: 25px 0;
          border-radius: 8px;
          font-size: 14px;
          color: #92400e;
        }

        .button {
          display: inline-block;
          background: #2563eb;
          color: #ffffff !important;
          text-decoration: none;
          padding: 14px 30px;
          border-radius: 8px;
          font-weight: bold;
          margin-top: 20px;
        }

        .footer {
          background: #f9fafb;
          text-align: center;
          padding: 25px;
          color: #6b7280;
          font-size: 14px;
        }

        .footer a {
          color: #2563eb;
          text-decoration: none;
        }
      </style>
    </head>

    <body>

      <div class="email-container">

        <div class="header">
          <h1>Greatomatic</h1>
        </div>

        <div class="content">

          <p>Hello, ${admin.name}!</p>

          <p>
            Your account password has been changed successfully.
            This email confirms that your password was updated.
          </p>

          <div class="success-box">
            <div class="success-icon">✅</div>
            <div class="success-title">
              Password Updated Successfully
            </div>
          </div>

          <div class="info">
            <strong>Security Tip:</strong><br>
            Your new password is now active. Use it the next time you sign in to your account.
          </div>

          <div class="warning">
            <strong>Didn't make this change?</strong><br>
            If you did not change your password, your account may have been compromised.
            Please contact our support team immediately and reset your password again.
          </div>

          <p style="text-align:center;">
            <a href="https://greatomatic.com/login/admin" class="button">
              Login to Your Account
            </a>
          </p>

          <p>
            Thank you for choosing <strong>Greatomatic</strong>.
          </p>

          <p>
            Regards,<br>
            <strong>Greatomatic Team</strong>
          </p>

        </div>

        <div class="footer">
          <p><strong>Greatomatic Team</strong></p>
          <p>📧 noreply@greatomatic.com</p>
          <p>
            © ${new Date().getFullYear()} Greatomatic. All rights reserved.
          </p>
        </div>

      </div>

    </body>
  </html>
  `,
    };

    await transport.sendMail(mailOptions);

    return NextResponse.json(
      { message: "Password reset successfully." },
      { status: 200 },
    );
  } catch (error) {
    console.error(
      process.env.NODE_ENV === "development"
        ? error
        : "An error occurred during password reset.",
    );
    return NextResponse.json(
      { message: "An error occurred during password reset." },
      { status: 500 },
    );
  }
}
