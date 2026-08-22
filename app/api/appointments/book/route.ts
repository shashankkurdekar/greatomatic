import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import nodemailer from "nodemailer";
import jwt from 'jsonwebtoken'
export async function POST(req: NextRequest) {
  try {
    const { fullname, email, mobile, time, id } = await req.json();

    if (!fullname || !email || !mobile || !time || !id) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    const decoded = jwt.decode(id.toString());
    const adminfullname = decoded && typeof decoded !== 'string' ? decoded.fullname : undefined;
    const adminemail = decoded && typeof decoded !== 'string' ? decoded.email : undefined;
    const date = decoded && typeof decoded !== 'string' ? decoded.date : undefined;
    const state = decoded && typeof decoded !== 'string' ? decoded.state : undefined;
  const district = decoded && typeof decoded !== 'string' ? decoded.district : undefined;
  const taluk = decoded && typeof decoded !== 'string' ? decoded.taluk : undefined;
  const landmark = decoded && typeof decoded !== 'string' ? decoded.landmark : undefined;
  const EventID = decoded && typeof decoded !== 'string' ? decoded.id : undefined;
  const address = `${state}->${district}->${taluk}->${landmark}`
    const appointmentID = `GIPL${adminfullname.split(" ").join("")}${date.split("-").join("")}${time.split(":").join("")}`;

    await pool.execute("INSERT INTO `booking` (`EventID`, `VisitorName`, `AppointmentID`, `Mobile`, `Email`, `AdminEmail`, `Date`, `Time`, `Address`, `Status`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [EventID, fullname, appointmentID, mobile, email, adminemail, date, time, address, 'pending']);

    const transport = nodemailer.createTransport({
      host: "smtp.zeptomail.in",
      port: 587,
      auth: {
        user: "emailapikey",
        pass: "PHtE6r1fSuHojDIsoBkF7fK/EMfyNIoqqLxkLVRPtIwXDaUBTE1V+t0swDDhr08pB6RERfXIz4xps7rNuu6GIDrqNGdFVGqyqK3sx/VYSPOZsbq6x00bsF0SckXUUYbnc9Jt0iHWuNfeNA==",
      },
    });

    const visitorMailOptions = {
      from: '"Greatomatic Team" <noreply@greatomatic.com>',
      to: email,
      subject: "Your Appointment Has Been Booked",
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
              <h1>Appointment Booked Successfully</h1>
            </div>
            <div class="content">
              <p>Hello ${fullname},</p>
              <p>Your appointment with administrator <strong>${adminfullname}</strong> has been booked successfully.</p>
              <ul class="credentials">
                <li><strong>Date:</strong> ${date}</li>
                <li><strong>Time:</strong> ${time}</li>
                <li><strong>Appointment ID:</strong> ${appointmentID}</li>
              </ul>
              <p>If you have any questions, please contact the administrator.</p>
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

    const adminMailOptions = {
      from: '"Greatomatic Team" <noreply@greatomatic.com>',
      to: adminemail,
      subject: "New Appointment Booked",
      html: `
        <h2>New Appointment Booked</h2>
        <p>Hello ${adminfullname},</p>
        <p>${fullname} has booked an appointment with you.</p>
        <ul>
          <li><strong>Date:</strong> ${date}</li>
          <li><strong>Time:</strong> ${time}</li>
          <li><strong>Visitor:</strong> ${fullname}</li>
          <li><strong>Email:</strong> ${email}</li>
          <li><strong>Mobile:</strong> ${mobile}</li>
          <li><strong>Appointment ID:</strong> ${appointmentID}</li>
          <li><strong>Address:</strong> ${address}</li>
        </ul>
      `,
    };

    await Promise.all([
      transport.sendMail(visitorMailOptions),
      transport.sendMail(adminMailOptions),
    ]);

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
