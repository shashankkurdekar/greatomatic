import pool from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) { 
    try {
        const { jobType, office } = await req.json();
        if (!jobType || !office) {
            return NextResponse.json({ error: "All fields are required" }, { status: 400 });
        }

        if (office === "Head Office") {
            if (jobType === "Office Jobs") {
                const [jobNames] = await pool.query("SELECT JobName FROM headofficejobs ORDER BY JobName ASC");
                return NextResponse.json(jobNames, { status: 200 });
            }
            else if (jobType === "Marketing Jobs") {
                const [jobNames] = await pool.query("SELECT JobName FROM headofficemarketingjobs ORDER BY JobName ASC");
                return NextResponse.json(jobNames, { status: 200 });
            }
        }
        if (office === "State Head Branch") {
             if (jobType === "Office Jobs") {
                const [jobNames] = await pool.query("SELECT JobName FROM statebranchjobs ORDER BY JobName ASC");
                return NextResponse.json(jobNames, { status: 200 });
            }
            else if (jobType === "Marketing Jobs") {
                const [jobNames] = await pool.query("SELECT JobName FROM statebranchmarketingjobs ORDER BY JobName ASC");
                return NextResponse.json(jobNames, { status: 200 });
            }
        }
        if (office === "District Head Branch") {
             if (jobType === "Office Jobs") {
                const [jobNames] = await pool.query("SELECT JobName FROM districtbranchjobs ORDER BY JobName ASC");
                return NextResponse.json(jobNames, { status: 200 });
            }
            else if (jobType === "Marketing Jobs") {
                const [jobNames] = await pool.query("SELECT JobName FROM districtbranchmarketingjobs ORDER BY JobName ASC");
                return NextResponse.json(jobNames, { status: 200 });
            }
        }
        if (office === "Taluk / Tehsil Head Branch") {
             if (jobType === "Office Jobs") {
                const [jobNames] = await pool.query("SELECT JobName FROM talukbranchjobs ORDER BY JobName ASC");
                return NextResponse.json(jobNames, { status: 200 });
            }
            else if (jobType === "Marketing Jobs") {
                const [jobNames] = await pool.query("SELECT JobName FROM talukbranchmarketingjobs ORDER BY JobName ASC");
                return NextResponse.json(jobNames, { status: 200 });
            }
        }
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to fetch job names" }, { status: 500 });
    }
}