import pool from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) { 
    try {
        const { jobName } = await req.json();
        if (!jobName) {
            return NextResponse.json({ error: "Job name is required" }, { status: 400 });
        }

        else if (jobName === "State Branch-Head") {
            const [states] = await pool.query("SELECT state FROM jobs WHERE jobName = ? ORDER BY state ASC", [jobName]);
            return NextResponse.json(states, { status: 200 });
        }
        else {
            return NextResponse.json({ error: "Invalid job name" }, { status: 400 });
        }
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to fetch states" }, { status: 500 });
    }
}