import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

import fs from "fs/promises";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const branch = formData.get("branch")?.toString() || "";
    const jobType = formData.get("jobType")?.toString() || "";
    const jobName = formData.get("jobName")?.toString() || "";
    const noOfVacancies = formData.get("noOfVacancies")?.toString() || "";
    const gender = formData.get("gender")?.toString() || "";
    const minAge = formData.get("minAge")?.toString() || "";
    const maxAge = formData.get("maxAge")?.toString() || "";
    const qualification = formData.get("qualification")?.toString() || "";
    const experience = formData.get("experience")?.toString() || "";
    const shift = formData.get("shift")?.toString() || "";
    const nature = formData.get("nature")?.toString() || "";
    const interviewStart = formData.get("interviewStart")?.toString() || "";
    const interviewEnd = formData.get("interviewEnd")?.toString() || "";
    const payoff = formData.get("payoff")?.toString() || "";

    const poster = formData.get("poster") as File | null;

    let posterName = "";

    if (poster) {
      const bytes = await poster.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadDir = path.join(process.cwd(), "public/uploads/posters");

      await fs.mkdir(uploadDir, { recursive: true });

      posterName = `${Date.now()}-${poster.name}`;

      await fs.writeFile(path.join(uploadDir, posterName), buffer);
    }
    

    await pool.query(
      `INSERT INTO jobposter (office, JobType, NumberOfJobs, Gender, Grade, MinAge, MaxAge, EXP, Salary, JobName, JobShift, JobNature, IntStartDate, AppLastDate, Poster)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [
        branch,
        jobType,
        noOfVacancies,
        gender,
        qualification,
        minAge,
        maxAge,
        experience,
        payoff,
        jobName,
        shift,
        nature,
        interviewStart,
        interviewEnd,
        posterName,
      ],
    );

    return NextResponse.json(
      {
        success: true,
        message: "Poster Added Successfully",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to add poster",
      },
      { status: 500 },
    );
  }
}
