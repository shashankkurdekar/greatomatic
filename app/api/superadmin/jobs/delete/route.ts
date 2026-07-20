import pool from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) { 
    try {
        const { id } = await req.json();
        if (!id) {
            return NextResponse.json({ error: "ID is required" }, { status: 400 });
        }

        await pool.execute("UPDATE jobs SET Status = ? WHERE id = ?", ["0", id]);
        return NextResponse.json({ message: "Job Deleted Successfully" }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to fetch job names" }, { status: 500 });
    }
}