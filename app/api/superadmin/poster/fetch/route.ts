import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() { 
    try {
        const [posters] = await pool.query("SELECT * FROM jobposter");
        return NextResponse.json(posters, { status: 200 })
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to fetch posters" }, { status: 500 });
    }
}