import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(req: NextRequest) {
    try {
        const { appointmentId } = await req.json();

        if (!appointmentId) {
            return NextResponse.json(
                { error: "Appointment ID is required." },
                { status: 400 }
            );
        }

        const [rows] = await pool.query(
            "SELECT * FROM `booking` WHERE `AppointmentID` = ?",
            [appointmentId]
        );

        if (Array.isArray(rows) && rows.length === 0) {
            return NextResponse.json(
                { error: "Appointment not found." },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, appointment: rows });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            {
                success: false,
                message: "Internal Server Error",
            },
            {
                status: 500,
            }
        );
    }
}