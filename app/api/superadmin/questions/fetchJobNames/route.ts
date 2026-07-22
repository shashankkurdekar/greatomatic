import pool from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) { 
    try {
        const { office, branch, jobType } = await req.json();
        if (!jobType || !office || !branch) {
            return NextResponse.json({ error: "All Fields are required" }, { status: 400 });
        }

        if (office === "Head") {
            if (branch === "Head") {
                if (jobType === "Office") {
                    const [rows] = await pool.query("SELECT JobName FROM headofficejobs ORDER BY JobName ASC");
                    return NextResponse.json(rows, { status: 200 })
                }
                else if (jobType === "Marketing") {
                    const [rows] = await pool.query("SELECT JobName FROM headofficemarketingjobs ORDER BY JobName ASC");
                    return NextResponse.json(rows, { status: 200 })
                }
            }
        }
        if (office === "Branch") {
            if (branch === "State") {
                if (jobType === "Branch") {
                    const [rows] = await pool.query("SELECT JobName FROM statebranchjobs ORDER BY JobName ASC");
                    return NextResponse.json(rows, { status: 200 })
                }
                else if (jobType === "Marketing") {
                    const [rows] = await pool.query("SELECT JobName FROM statebranchmarketingjobs ORDER BY JobName ASC");
                    return NextResponse.json(rows, { status: 200 })
                }
            }
            else if (branch === "District") {
                if (jobType === "Branch") {
                    const [rows] = await pool.query("SELECT JobName FROM districtbranchjobs ORDER BY JobName ASC");
                    return NextResponse.json(rows, { status: 200 })
                }
                else if (jobType === "Marketing") {
                    const [rows] = await pool.query("SELECT JobName FROM districtbranchmarketingjobs ORDER BY JobName ASC");
                    return NextResponse.json(rows, { status: 200 })
                }
            }
            else if (branch === "Taluk") {
                if (jobType === "Branch") {
                    const [rows] = await pool.query("SELECT JobName FROM talukbranchjobs ORDER BY JobName ASC");
                    return NextResponse.json(rows, { status: 200 })
                }
                else if (jobType === "Marketing") {
                    const [rows] = await pool.query("SELECT JobName FROM talukbranchmarketingjobs ORDER BY JobName ASC");
                    return NextResponse.json(rows, { status: 200 })
                }
            }
        }
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to fetch job names" }, { status: 500 });
    }
}