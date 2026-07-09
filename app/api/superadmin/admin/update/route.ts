/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import fs from "fs";
import path from "path";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
export async function POST(req: NextRequest) {
  try {

    const formData = await req.formData();

    const id = formData.get("id") as string;
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const mobile = formData.get("mobile") as string;
    const address = formData.get("address") as string;
    const status = formData.get("status") as string;

    const image = formData.get("image") as File | null;

    const [rows]: any = await pool.query("SELECT * FROM admin WHERE adminID = ?", [id]);

    const admin = rows[0];

    if (!admin) {
      return NextResponse.json(
        { success: false, message: "Admin not found" },
        { status: 404 }
      );
    }

    let imagePath = admin.image;

    if (image && image.size > 0) {
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const fileName = `${Date.now()}-${image.name}`;

      const uploadDir = path.join(process.cwd(), "public/uploads/admins");

      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const filePath = path.join(uploadDir, fileName);

      fs.writeFileSync(filePath, buffer);

      imagePath = `/uploads/admins/${fileName}`;

      // Delete old image
      if (admin.image) {
        const oldImage = path.join(process.cwd(), "public/uploads/admins", path.basename(admin.image));

        if (fs.existsSync(oldImage)) {
          fs.unlinkSync(oldImage);
        }
      }
    }

    const password = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query("UPDATE admin SET name = ?, email = ?, mobile = ?, address = ?, status = ?, image = ?, password = ? WHERE adminID = ?", [
      name,
      email,
      mobile,
      address,
      status,
      imagePath,
      hashedPassword,
      id
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
      subject: "Your Administrator Account Updated",
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
              <h1>Administrator Account Updated</h1>
            </div>
            <div class="content">
              <p>Hello ${name},</p>
              <p>Your administrator account has been updated successfully. You can now access the admin dashboard using the updated credentials below.</p>
              <ul class="credentials">
                <li><strong>Email:</strong> ${email}</li>
                <li><strong>New Password:</strong> ${password}</li>
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
      message: "Admin updated successfully",
    }, { status: 200 });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong",
      },
      {
        status: 500,
      }
    );
  }
}