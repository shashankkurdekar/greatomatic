import pool from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) { 
    try {
        const { id } = await req.json();
        await pool.execute("DELETE FROM jobposter WHERE id = ?", [id]);
        return NextResponse.json({ message: "Poster Deleted Successfully" }, { status: 200 })
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to fetch posters" }, { status: 500 });
    }
}