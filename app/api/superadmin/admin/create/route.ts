/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import fs from "fs/promises";
import path from "path";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
export async function POST(req: NextRequest) {
  try {
    const cookiesStore = await cookies();
    const token = cookiesStore.get("admintoken");

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 },
      );
    }

    const formData = await req.formData();

    const fullname = formData.get("fullname")?.toString();
    const email = formData.get("email")?.toString();
    const mobile = formData.get("mobile")?.toString();
    const address = formData.get("address")?.toString();

    const image = formData.get("image") as File | null;

    if (!fullname || !email || !mobile || !address) {
      return NextResponse.json(
        {
          success: false,
          message: "Please fill all required fields.",
        },
        { status: 400 },
      );
    }

    const existingAdmin = await db.query(
      `
      SELECT * FROM admin WHERE email = ?
      `,
      [email],
    );

    if ((existingAdmin as any)[0].length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Admin with this email already exists.",
        },
        { status: 400 },
      );
    }

    let imageName = "";

    if (image) {
      const bytes = await image.arrayBuffer();

      const buffer = Buffer.from(bytes);

      const extension = image.name.split(".").pop();

      imageName =
        Date.now() +
        "-" +
        Math.random().toString(36).substring(2, 8) +
        "." +
        extension;

      const uploadPath = path.join(
        process.cwd(),
        "public",
        "uploads",
        "admins",
        imageName,
      );

      await fs.writeFile(uploadPath, buffer);
    }
    const [adminID] = await db.query(
      `
      SELECT MAX(id) as maxId FROM admin
      `,
    );

    const newAdminID = `GIPL-${(adminID as any)[0].maxId + 1}`;
    const password = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(password, 10);

    await db.execute(
      `
      INSERT INTO admin
      (
        adminID,
        name,
        email,
        mobile,
        address,
        password,
        role,
        image,
        status
      )
      VALUES
      (?,?,?,?,?,?,?,?,?)
      `,
      [
        newAdminID,
        fullname,
        email,
        mobile,
        address,
        hashedPassword,
        "admin",
        imageName,
        1,
      ],
    );

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
      subject: "Your Administrator Account Created",
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
              <h1>Administrator Account Created</h1>
            </div>
            <div class="content">
              <p>Hello ${fullname},</p>
              <p>Your administrator account has been created successfully. You can now access the admin dashboard using the credentials below.</p>
              <ul class="credentials">
                <li><strong>Email:</strong> ${email}</li>
                <li><strong>Password:</strong> ${password}</li>
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

    return NextResponse.json({
      success: true,
      message: "Administrator created successfully.",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      {
        status: 500,
      },
    );
  }
}
