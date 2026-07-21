import pool from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
  try {
    const { formData, id } = await req.json();

    if (!formData.state) {
      await pool.execute(
        "UPDATE jobs SET NumberOfJobs = ?, Gender = ?, Grade = ?, MinAge = ?, MaxAge = ?, EXP = ?, Salary = ?, JobShift = ?, JobNature = ?, IntStartDate = ?, AppLastDate = ? WHERE id = ?",
        [
          formData.noOfVacancies,
          formData.gender,
          formData.qualification,
          formData.minAge,
          formData.maxAge,
          formData.experience,
          formData.payoff,
          formData.shift,
          formData.nature,
          formData.interviewStart,
          formData.interviewEnd,
          id,
        ],
      );
      return NextResponse.json(
        { message: "Job Added Successfully" },
        { status: 201 },
      );
    } else if (formData.state) {
      await pool.execute(
        "UPDATE jobs SET NumberOfJobs = ?, Gender = ?, Grade = ?, MinAge = ?, MaxAge = ?, EXP = ?, Salary = ?, JobShift = ?, JobNature = ?, IntStartDate = ?, AppLastDate = ?, State = ? WHERE id = ?",
        [
          formData.noOfVacancies,
          formData.gender,
          formData.qualification,
          formData.minAge,
          formData.maxAge,
          formData.experience,
          formData.payoff,
          formData.shift,
          formData.nature,
          formData.interviewStart,
          formData.interviewEnd,
          formData.state,
          id,
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
