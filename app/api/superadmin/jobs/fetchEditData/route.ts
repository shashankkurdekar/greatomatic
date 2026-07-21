/* eslint-disable @typescript-eslint/no-explicit-any */
import pool from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) { 
    try {
        const { id } = await req.json();
        if (!id) {
            return NextResponse.json({ error: "ID is required" }, { status: 400 });
        }

        const rows = (await pool.query("SELECT * FROM jobs WHERE id = ?", [id])) as any[];
        console.log(rows);
        if (rows[0][0]?.JobType === "office") {
            const [jobNames] = await pool.query("SELECT JobName FROM headofficejobs ORDER BY JobName ASC");
            if (rows[0][0]?.JobName === "State Branch-Head") {
                const [states] = await pool.query("SELECT state_name FROM state ORDER BY state_name ASC");
                return NextResponse.json({ rows, jobNames, states }, { status: 200 })
            }
            return NextResponse.json({ rows, jobNames }, { status: 200 })
        }
        else if (rows[0][0]?.JobType === "marketing"){
            const [jobNames] = await pool.query("SELECT JobName FROM headofficemarketingjobs ORDER BY JobName ASC");
            return NextResponse.json({ rows, jobNames }, { status: 200 })
        }
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to fetch job names" }, { status: 500 });
    }
}