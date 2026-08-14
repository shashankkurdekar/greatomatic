/* eslint-disable @typescript-eslint/no-explicit-any */
import pool from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: "Event ID is required.",
        },
        {
          status: 400,
        },
      );
    }

    const [result]: any = await pool.execute(
      `
        DELETE FROM event
        WHERE id = ?
      `,
      [id],
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Event not found.",
        },
        {
          status: 404,
        },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Event deleted successfully.",
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error("Delete event error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete event.",
      },
      {
        status: 500,
      },
    );
  }
}