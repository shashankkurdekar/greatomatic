import pool from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) { 
    try {
        const { id } = await req.json();
        if (!id) {
            return NextResponse.json({ error: "ID is required" }, { status: 400 });
        }

        await pool.execute("UPDATE jobs SET Status = ? WHERE id = ?", ["1", id]);
        return NextResponse.json({ message: "Job Activated Successfully" }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to fetch job names" }, { status: 500 });
    }
}