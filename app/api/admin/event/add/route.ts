import pool from "@/lib/db";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
export async function POST(req: NextRequest) {
  try {
    const {
      state,
      district,
      taluk,
      landmark,
      date,
      startTime,
      endTime,
    } = await req.json();

    // ----------------------------------------
    // 1. Required field validation
    // ----------------------------------------

    if (
      !state ||
      !district ||
      !taluk ||
      !landmark ||
      !date ||
      !startTime ||
      !endTime
    ) {
      return NextResponse.json(
        {
          error: "All fields are required.",
        },
        {
          status: 400,
        },
      );
    }

    // ----------------------------------------
    // 2. End time must be greater than start
    // ----------------------------------------

    if (endTime <= startTime) {
      return NextResponse.json(
        {
          error: "End time must be greater than start time.",
        },
        {
          status: 400,
        },
      );
    }

    // ----------------------------------------
    // 3. Event date must be tomorrow or later
    // ----------------------------------------

    const today = new Date();

    const tomorrow = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 1,
    );

    const selectedDateParts = date.split("-").map(Number);

    const selectedDate = new Date(
      selectedDateParts[0],
      selectedDateParts[1] - 1,
      selectedDateParts[2],
    );

    if (selectedDate < tomorrow) {
      return NextResponse.json(
        {
          error: "Event date must be from tomorrow onwards.",
        },
        {
          status: 400,
        },
      );
    }

    // ----------------------------------------
    // 4. Extract names / IDs
    // ----------------------------------------

    // Your frontend stores values such as:
    // Karnataka/29
    // Udupi/152
    // Kundapura/1234

    const [stateName, stateId] = state.split("/");
    const [districtName, districtId] = district.split("/");
    const [talukName, talukId] = taluk.split("/");

    if (
      !stateName ||
      !stateId ||
      !districtName ||
      !districtId ||
      !talukName ||
      !talukId
    ) {
      return NextResponse.json(
        {
          error: "Invalid location details.",
        },
        {
          status: 400,
        },
      );
    }

    const cookieStore = await cookies();

    const admintoken = cookieStore.get("admintoken")?.value;

    const decoded = jwt.decode(admintoken || "") as { email: string; role: string } | null;

    const adminEmail = decoded?.email || "";

    const fullname = await pool
      .execute("SELECT name FROM admin WHERE email = ?", [adminEmail])
      .then(([rows]) => {
        const result = rows as { name: string }[];
        return result[0]?.name || "";
      });
    const mobile = await pool
      .execute("SELECT mobile FROM admin WHERE email = ?", [adminEmail])
      .then(([rows]) => {
        const result = rows as { mobile: string }[];
        return result[0]?.mobile || "";
      });

    // ----------------------------------------
    // 5. Insert event
    // ----------------------------------------

    const [result] = await pool.execute(
      `
        INSERT INTO event (fullname, email, mobile, state, district, taluk, landmark, date, start_time, end_time) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        fullname,
        adminEmail,
        mobile,
        stateName,
        districtName,
        talukName,
        landmark.trim(),
        date,
        startTime,
        endTime,
      ],
    );

    return NextResponse.json(
      {
        message: "Event added successfully.",
        result,
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error("Add event error:", error);

    return NextResponse.json(
      {
        error: "Something went wrong while adding the event.",
      },
      {
        status: 500,
      },
    );
  }
}