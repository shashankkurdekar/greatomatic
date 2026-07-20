import pool from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) { 
    try {
        const { jobType } = await req.json();
        if (!jobType) {
            return NextResponse.json({ error: "Job type is required" }, { status: 400 });
        }

        if (jobType !== "office" && jobType !== "marketing") {
            return NextResponse.json({ error: "Invalid job type" }, { status: 400 });
        }

        else if (jobType === "office" || jobType === "marketing") {
            const [rows] = await pool.query("SELECT JobName FROM jobs WHERE JobType = ? ORDER BY JobName ASC", [jobType]);
            return NextResponse.json(rows, { status: 200 });
        }
        else {
            return NextResponse.json({ error: "Invalid job type" }, { status: 400 });
        }
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to fetch job names" }, { status: 500 });
    }
}