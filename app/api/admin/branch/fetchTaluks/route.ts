import pool from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { district_id } = await req.json();
        if (!district_id) {
            return NextResponse.json({ error: "Missing district_id in request body" }, { status: 400 });
        }
        const [rows] = await pool.query('SELECT * FROM taluk WHERE district_id = ?', [district_id]);
        return NextResponse.json(rows, { status: 200 });
    } catch (error) {
        console.error('Error fetching taluks:', error);
        return NextResponse.json({ error: `Failed to fetch taluks: ${error}` }, { status: 500 });
    }
}