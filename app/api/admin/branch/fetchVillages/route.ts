import pool from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { taluk_id } = await req.json();
        if (!taluk_id) {
            return NextResponse.json({ error: "Missing taluk_id in request body" }, { status: 400 });
        }
        const [rows] = await pool.query('SELECT * FROM village WHERE taluk_id = ?', [taluk_id]);
        return NextResponse.json(rows, { status: 200 });
    } catch (error) {
        console.error('Error fetching villages:', error);
        return NextResponse.json({ error: `Failed to fetch villages: ${error}` }, { status: 500 });
    }
}