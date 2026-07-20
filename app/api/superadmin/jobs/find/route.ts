import pool from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) { 
    try {
        const { jobType, jobName, state } = await req.json();
        if (!jobType || !jobName) {
            return NextResponse.json({ error: "Job type and Job Name are required" }, { status: 400 });
        }

        if (jobType !== "office" && jobType !== "marketing") {
            return NextResponse.json({ error: "Invalid job type" }, { status: 400 });
        }

        if (!state) {
            const [rows] = await pool.query("SELECT * FROM jobs WHERE JobType = ? AND JobName = ?", [jobType, jobName]);
            return NextResponse.json(rows, { status: 200 });
        }
        else {
            const [rows] = await pool.query("SELECT * FROM jobs WHERE JobType = ? AND JobName = ? AND state = ?", [jobType, jobName, state]);
            return NextResponse.json(rows, { status: 200 });
        }

        
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to fetch job names" }, { status: 500 });
    }
}