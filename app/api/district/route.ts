import pool from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { state_id } = await req.json();
        if (!state_id) {
            return NextResponse.json({ error: "Missing state_id in request body" }, { status: 400 });
        }
        const [rows] = await pool.query('SELECT * FROM district WHERE state_id = ?', [state_id]);
        return NextResponse.json(rows, { status: 200 });
    } catch (error) {
        console.error('Error fetching districts:', error);
        return NextResponse.json({ error: `Failed to fetch districts: ${error}` }, { status: 500 });
    }
}