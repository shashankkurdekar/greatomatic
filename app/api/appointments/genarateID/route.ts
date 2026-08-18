import { NextRequest, NextResponse } from "next/server";
import jwt from 'jsonwebtoken';

export async function POST(req: NextRequest) {
    try {
        const { fullname, email, mobile, state, district, taluk, landmark, date, start_time, end_time } = await req.json();
        const token = jwt.sign({ fullname, email, mobile, state, district, taluk, landmark, date, start_time, end_time }, process.env.JWT_SECRET!);
        return NextResponse.json(token, { status: 200 })
    } catch (error) {
        console.error('Error genarating id:', error);
        return NextResponse.json({ error: `Failed to genarate id: ${error}` }, { status: 500 });
    }
}