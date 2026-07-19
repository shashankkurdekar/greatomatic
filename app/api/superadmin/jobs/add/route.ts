import pool from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const {
      branch,
      jobType,
      jobName,
      noOfVacancies,
      gender,
      minAge,
      maxAge,
      qualification,
      experience,
      shift,
      nature,
      interviewStart,
      interviewEnd,
      payoff,
      state,
    } = await req.json();

    if (!state) {
      await pool.execute(
        `
      INSERT INTO jobs (OfficeType, JobType, BranchID, NumberOfJobs, Gender, Grade, MinAge, MaxAge, EXP, Salary, JobName, AddedBy, JobShift, JobNature, IntStartDate, AppLastDate, Status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
        [
          branch,
          jobType,
          "GIPL/REGD/Udupi/Udupi/Karnataka/India",
          noOfVacancies,
          gender,
          qualification,
          minAge,
          maxAge,
          experience,
          payoff,
          jobName,
          "superadmin@greatomatic.com",
          shift,
          nature,
          interviewStart,
          interviewEnd,
          "1",
        ],
      );
      return NextResponse.json(
        { message: "Job Added Successfully" },
        { status: 201 },
      );
    } else if (state) {
      await pool.execute(
        `
      INSERT INTO jobs (OfficeType, JobType, BranchID, NumberOfJobs, Gender, Grade, MinAge, MaxAge, EXP, Salary, JobName, AddedBy, JobShift, JobNature, IntStartDate, AppLastDate, State, Status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
        [
          branch,
          jobType,
          "GIPL/REGD/Udupi/Udupi/Karnataka/India",
          noOfVacancies,
          gender,
          qualification,
          minAge,
          maxAge,
          experience,
          payoff,
          jobName,
          "superadmin@greatomatic.com",
          shift,
          nature,
          interviewStart,
          interviewEnd,
          state,
          "1",
        ],
      );
      return NextResponse.json(
        { message: "Job Added Successfully" },
        { status: 201 },
      );
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch job names" },
      { status: 500 },
    );
  }
}
