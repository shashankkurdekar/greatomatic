import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import fs from "fs/promises";
import path from "path";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    // ----------------------------------
    // Get normal form fields
    // ----------------------------------

    const fname = formData.get("fname")?.toString() || "";
    const bname = formData.get("bname")?.toString() || "";
    const btype = formData.get("btype")?.toString() || "";
    const email = formData.get("email")?.toString() || "";
    const mobile = formData.get("mobile")?.toString() || "";

    const state = formData.get("state")?.toString() || "";
    const district = formData.get("district")?.toString() || "";
    const taluk = formData.get("taluk")?.toString() || "";
    const village = formData.get("village")?.toString() || "";

    const landmark = formData.get("landmark")?.toString() || "";
    const blood = formData.get("blood")?.toString() || "";
    const emobile = formData.get("emobile")?.toString() || "";

    const acc = formData.get("acc")?.toString() || "";
    const ifsc = formData.get("ifsc")?.toString() || "";
    const acc_name = formData.get("acc_name")?.toString() || "";

    const nominame = formData.get("nominame")?.toString() || "";
    const nomirel = formData.get("nomirel")?.toString() || "";
    const nominum = formData.get("nominum")?.toString() || "";
    const nomiemail = formData.get("nomiemail")?.toString() || "";

    const bmobile = formData.get("bmobile")?.toString() || "";
    const maplink = formData.get("maplink")?.toString() || "";

    const g1name = formData.get("g1name")?.toString() || "";
    const g1num = formData.get("g1num")?.toString() || "";
    const g1email = formData.get("g1email")?.toString() || "";

    // ----------------------------------
    // Validate required fields
    // ----------------------------------

    if (!fname || !email || !bname || !btype) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Owner name, email, branch name and branch type are required",
        },
        { status: 400 },
      );
    }

    // ----------------------------------
    // Get uploaded files
    // ----------------------------------

    const imageFile = formData.get("img");
    const passportFile = formData.get("passport");

    let imageName = "";
    let ownerPhotoName = "";

    const uploadDir = path.join(
      process.cwd(),
      "public/uploads/branches",
    );

    await fs.mkdir(uploadDir, { recursive: true });

    // ----------------------------------
    // Save Branch Image
    // ----------------------------------

    if (imageFile instanceof File && imageFile.size > 0) {
      const extension = path.extname(imageFile.name);

      imageName = `${Date.now()}-branch${extension}`;

      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);

      await fs.writeFile(
        path.join(uploadDir, imageName),
        buffer,
      );
    }

    // ----------------------------------
    // Save Owner Photo
    // ----------------------------------

    if (passportFile instanceof File && passportFile.size > 0) {
      const extension = path.extname(passportFile.name);

      ownerPhotoName = `${Date.now()}-owner${extension}`;

      const bytes = await passportFile.arrayBuffer();
      const buffer = Buffer.from(bytes);

      await fs.writeFile(
        path.join(uploadDir, ownerPhotoName),
        buffer,
      );
    }

    // ----------------------------------
    // Generate Branch ID
    // ----------------------------------

    const branchID = `GIPL-${state}`;

    const address = `${state}-${district}-${taluk}-${village}-${landmark}`;

    const password = Math.random().toString(36).slice(-8);

    const hashedPassword = await bcrypt.hash(password, 10);

    const cookieStore = await cookies();

    const admintoken = cookieStore.get("admintoken")?.value;

    const decoded = jwt.decode(admintoken || "") as { email: string; role: string } | null;

    const adminEmail = decoded?.email || "";

    // ----------------------------------
    // Insert into database
    // ----------------------------------

    const sql = `
      INSERT INTO branch (
        BranchType,
        OwnerName,
        BranchName,
        Email,
        Mobile,
        State,
        District,
        Taluk,
        Village,
        Landmark,
        Address,
        Image,
        BranchID,
        Password,
        AddedBy,
        OwnerPhoto,
        BloodGroup,
        EmergencyMobile,
        AccountNumber,
        IFSC,
        AccountName,
        NomineeName,
        NomineeRelation,
        NomineeMobile,
        NomineeEmail,
        BranchMobile,
        BranchMapLink,
        GuarantorName,
        GuarantorMobile,
        GuarantorEmail,
        Status
      )
      VALUES (
        ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?, ?
      )
    `;

    const values = [
      btype,
      fname,
      bname,
      email,
      mobile,

      state,
      district,
      taluk,
      village,
      landmark,
      address,
      imageName,
      branchID,
      hashedPassword,
      adminEmail,
      ownerPhotoName,
      blood,
      emobile,
      acc,
      ifsc,
      acc_name,

      nominame,
      nomirel,
      nominum,
      nomiemail,

      bmobile,
      maplink,

      g1name,
      g1num,
      g1email,

      "1",
    ];

    await pool.query(sql, values);

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
  subject: "Welcome to Greatomatic – Branch Admin Account Created",
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
          font-family: Arial, Helvetica, sans-serif;
          background-color: #f4f6fa;
          color: #333333;
        }

        .email-container {
          max-width: 600px;
          margin: 30px auto;
          background-color: #ffffff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        }

        .header {
          background-color: #1d4ed8;
          color: #ffffff;
          padding: 28px 24px;
          text-align: center;
        }

        .header h1 {
          margin: 0;
          font-size: 24px;
        }

        .content {
          padding: 30px 25px;
        }

        .content p {
          font-size: 15px;
          line-height: 1.7;
          margin: 12px 0;
        }

        .details {
          background-color: #f8fafc;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 18px;
          margin: 20px 0;
        }

        .details table {
          width: 100%;
          border-collapse: collapse;
        }

        .details td {
          padding: 9px 5px;
          font-size: 14px;
        }

        .details .label {
          font-weight: bold;
          color: #374151;
          width: 40%;
        }

        .credentials {
          background-color: #eff6ff;
          border-left: 4px solid #1d4ed8;
          border-radius: 6px;
          padding: 18px;
          margin: 20px 0;
        }

        .credentials p {
          margin: 8px 0;
        }

        .credential-value {
          font-weight: bold;
          color: #1d4ed8;
        }

        .button {
          display: inline-block;
          margin: 20px 0;
          padding: 13px 24px;
          background-color: #1d4ed8;
          color: #ffffff !important;
          text-decoration: none;
          border-radius: 7px;
          font-weight: bold;
        }

        .warning {
          background-color: #fff7ed;
          border-left: 4px solid #f97316;
          padding: 14px;
          margin-top: 20px;
          font-size: 13px;
          line-height: 1.6;
        }

        .footer {
          padding: 20px 24px;
          font-size: 13px;
          color: #6b7280;
          text-align: center;
          background-color: #f9fafb;
        }
      </style>
    </head>

    <body>

      <div class="email-container">

        <!-- Header -->
        <div class="header">
          <h1>Welcome to Greatomatic</h1>
        </div>

        <!-- Content -->
        <div class="content">

          <p>Hello <strong>${fname}</strong>,</p>

          <p>
            We are pleased to inform you that you have been successfully
            assigned as a <strong>${state} State Branch Admin</strong> for Greatomatic.
          </p>

          <p>
            Your branch account has been created successfully. 
            Please find your branch details and login credentials below.
          </p>

          <!-- Branch Details -->
          <div class="details">
            <table>
              <tr>
                <td class="label">Branch Name</td>
                <td>${bname}</td>
              </tr>

              <tr>
                <td class="label">Branch ID</td>
                <td><strong>${branchID}</strong></td>
              </tr>

              <tr>
                <td class="label">Location</td>
                <td>${address}</td>
              </tr>

              <tr>
                <td class="label">Branch Mobile</td>
                <td>${bmobile || mobile}</td>
              </tr>
            </table>
          </div>

          <!-- Login Credentials -->
          <div class="credentials">

            <p>
              <strong>Login Email:</strong><br />
              <span class="credential-value">${email}</span>
            </p>

            <p>
              <strong>Password:</strong><br />
              <span class="credential-value">${password}</span>
            </p>

          </div>

          <p>
            You can use the above credentials to access the
            Greatomatic Branch Admin portal.
          </p>

          <div style="text-align:center;">
            <a
              class="button"
              href="${
                process.env.NODE_ENV === "development"
                  ? "http://localhost:3000/login/branch"
                  : "https://greatomatic.com/login/branch"
              }"
            >
              Login to Branch Admin
            </a>
          </div>

          <!-- Security Warning -->
          <div class="warning">
            <strong>Important Security Notice:</strong><br />
            Please change your temporary password after your first login.
            Do not share your login credentials with anyone.
          </div>

          <p>
            If you did not expect this account or believe this email was
            sent to you by mistake, please contact the Greatomatic support team.
          </p>

          <p>
            Regards,<br />
            <strong>Greatomatic Team</strong>
          </p>

        </div>

        <!-- Footer -->
        <div class="footer">
          <p>Greatomatic Team</p>
          <p>noreply@greatomatic.com</p>
          <p>This is an automated email. Please do not reply.</p>
        </div>

      </div>

    </body>
  </html>
  `,
};
    await transport.sendMail(mailOptions);

    return NextResponse.json(
      {
        success: true,
        message: "Branch created successfully",
        branchID,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("CREATE BRANCH ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 500 },
    );
  }
}