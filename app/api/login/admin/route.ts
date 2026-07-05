/* eslint-disable @typescript-eslint/no-explicit-any */
import pool from '@/lib/db';
import { NextResponse, NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ message: "Email and password are required." }, { status: 400 });
        }

        const [rows] = await pool.query<any[]>('SELECT * FROM admin WHERE email = ?', [email]);
        const admin = rows[0];

        if (!admin) {
            return NextResponse.json({ message: "Invalid email or password." }, { status: 401 });
        }

        const isPasswordValid = await bcrypt.compare(password, admin.password);
        if (!isPasswordValid) {
            return NextResponse.json({ message: "Invalid email or password." }, { status: 401 });
        }
        const token = jwt.sign({ email: admin.email, role: admin.role }, process.env.JWT_SECRET!, { expiresIn: '4h' });
        const cookieStore = await cookies();
        cookieStore.set('admintoken', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge: 4 * 60 * 60 });
        return NextResponse.json({ message: "Login successful.", role: admin.role }, { status: 200 });
    } catch (error) {
        console.error(process.env.NODE_ENV === "development" ? error : "An error occurred during login.");
        return NextResponse.json({ message: "An error occurred during login." }, { status: 500 });
    }
}