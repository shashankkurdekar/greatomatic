import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const [admins] = await pool.query("SELECT * FROM event");;
        return NextResponse.json(admins, { status: 200 });
    } catch (error) {
        console.error('Error fetching admins:', error);
        return NextResponse.json({ error: `Failed to fetch admins: ${error}` }, { status: 500 });
    }
}