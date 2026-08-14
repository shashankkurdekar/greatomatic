import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const [rows] = await pool.query('SELECT * FROM state');
        return NextResponse.json(rows, { status: 200 });
    } catch (error) {
        console.error('Error fetching states:', error);
        return NextResponse.json({ error: `Failed to fetch states: ${error}` }, { status: 500 });
    }
}