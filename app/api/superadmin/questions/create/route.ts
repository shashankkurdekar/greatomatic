import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { RowDataPacket } from "mysql2";
type CountRow = RowDataPacket & {
  count: number;
};
export async function POST(req: NextRequest) {
  try {
    const { office, branch, jobType, jobName, questions } = await req.json();
    const newJobName = jobName.split(" ")[0];
    const tableName = `${office.toLowerCase()}_${branch.toLowerCase()}_${jobType.toLowerCase()}_${newJobName.toLowerCase()}`;
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
    await pool.execute(
      `CREATE TABLE ${tableName} (id INT NOT NULL AUTO_INCREMENT, question TEXT NOT NULL , PRIMARY KEY (id)) ENGINE = InnoDB;`,
    );
    await pool.execute(`
      INSERT INTO ${tableName} (question) VALUES (?)  
    `, [JSON.stringify(questions)]);
    return NextResponse.json(
      { message: "Question paper Created Succesfully" },
      { status: 201 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch job names" },
      { status: 500 },
    );
  }
}
