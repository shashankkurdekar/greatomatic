import pool from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const date = searchParams.get("date");

    let query = `
      SELECT
        id,
        state,
        district,
        taluk,
        landmark,
        date,
        start_time,
        end_time
      FROM event
    `;

    const params: string[] = [];

    // Filter by date if supplied
    if (date) {
      query += ` WHERE date = ?`;
      params.push(date);
    }

    query += ` ORDER BY date ASC, start_time ASC`;

    const [rows] = await pool.execute(query, params);

    return NextResponse.json(
      {
        success: true,
        events: rows,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error("Get events error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch events.",
      },
      {
        status: 500,
      },
    );
  }
}