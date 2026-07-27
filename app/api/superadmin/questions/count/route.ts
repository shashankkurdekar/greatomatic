import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { RowDataPacket } from "mysql2";
type CountRow = RowDataPacket & {
  count: number;
};
export async function POST(req: NextRequest) {
  try {
    const { office, branch, jobType, designation } = await req.json();
    const JobName = designation.split(" ")[0]
    const tableName = `${office.toLowerCase()}_${branch.toLowerCase()}_${jobType.toLowerCase()}_${JobName.toLowerCase()}`;
    const [tableExist] = await pool.query<CountRow[]>(
      "select COUNT(*) AS count from information_schema.TABLES where TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ?",
      [tableName],
    );
    if (tableExist[0]?.count > 0) {
      return NextResponse.json(
        { error: "Question paper Already Exist" },
        { status: 409 },
      );
    }
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to check question paper" },
      { status: 500 }
    );
  }
}
