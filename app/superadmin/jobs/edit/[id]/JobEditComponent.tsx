/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { JobNames } from "@/types/JobNames.interface";
import { IStates } from "@/types/states.interface";
import { Briefcase, Building2, Calendar, Clock, GraduationCap, HomeIcon, IndianRupee, RotateCcw, Save, User, Users } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function JobEditComponent() {
    const { id } = useParams();
    const router = useRouter();
    const [formData, setFormData] = useState({
      branch: "Head Office",
      jobType: "",
      jobName: "",
      noOfVacancies: "",
      gender: "",
      minAge: "",
      maxAge: "",
      qualification: "",
      experience: "",
      shift: "",
      nature: "",
      interviewStart: "",
      interviewEnd: "",
      payoff: "",
      state: "",
    });
    const [jobNames, setJobNames] = useState<JobNames[]>([]);
    const [states, setStates] = useState<IStates[]>([]);
    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch("/api/superadmin/jobs/fetchEditData", {
                    method: "POST",
                    body: JSON.stringify({ id })
                });
                if (res.ok) {
                    const data = await res.json();
                    const rows = data.rows[0][0];
                    const jobNames = data.jobNames;
                    const states = data.states;
                    setJobNames(jobNames);
                    setStates(states);
                    setFormData({
                        branch: rows.OfficeType,
                        jobType: rows.JobType,
                        jobName: rows.JobName,
                        noOfVacancies: rows.NumberOfJobs,
                        gender: rows.Gender,
                        minAge: rows.MinAge,
                        maxAge: rows.MaxAge,
                        qualification: rows.Grade,
                        experience: rows.EXP,
                        shift: rows.JobShift,
                        nature: rows.JobNature,
                        interviewStart: new Date(rows.IntStartDate).toISOString().split("T")[0],
                        interviewEnd: new Date(rows.AppLastDate).toISOString().split("T")[0],
                        payoff: rows.Salary,
                        state: rows?.State
                    })
                }
            } catch (error) {
                console.error(error);
                alert("Something went wrong.")
            }
        }
        fetchData();
    }, [id]);
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
        const res = await fetch("/api/superadmin/jobs/edit", {
            method: "PATCH",
            body: JSON.stringify({ formData, id })
        });
        if (res.ok) {
            alert("Job Edited Successfully");
            router.push("/superadmin");
        }
    } catch (error) {
        console.error(error);
        alert("Something went wrong.")
    }
  }
  
  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}

        <div className="rounded-3xl bg-linear-to-r from-blue-700 to-indigo-700 p-8 text-white shadow-xl">
          <h1 className="text-4xl font-bold">Edit Job Vacancy</h1>
        </div>

        <form className="mt-8 space-y-8" onSubmit={handleSubmit}>
          {/* Basic */}

          <div className="rounded-3xl bg-white p-8 shadow">
            <h2 className="mb-6 text-2xl font-bold text-slate-800">
              Basic Information
            </h2>

            <div className="grid gap-6 md:grid-cols-2">
              <Input
                icon={<Building2 size={18} />}
                placeholder="Branch Office"
                name="branch"
                value={formData.branch}
                disabled
              />

              <Select
                icon={<Briefcase size={18} />}
                name="jobType"
                value={formData.jobType}
                disabled
                onChange={async (e: React.ChangeEvent<HTMLSelectElement>) => {
                  handleChange(e);
                  try {
                    if (e.target.value) {
                      const res = await fetch(
                        "/api/superadmin/jobs/fetchJobNames",
                        {
                          method: "POST",
                          body: JSON.stringify({ jobType: e.target.value }),
                        },
                      );
                      if (res.ok) {
                        const data: JobNames[] = await res.json();
                        setJobNames(data);
                      }
                    } else {
                      setJobNames([]);
                    }
                  } catch (error) {
                    console.error(error);
                    alert("Something went wrong while fetching job names.");
                  }
                }}
              >
                <option value="">Select Job Type</option>
                <option value="office">Office Jobs</option>
                <option value="marketing">Marketing Jobs</option>
              </Select>

              <Select
                icon={<Briefcase size={18} />}
                name="jobName"
                value={formData.jobName}
                disabled
                onChange={async (e: React.ChangeEvent<HTMLSelectElement>) => {
                  handleChange(e);
                  try {
                    if (e.target.value) {
                      if (e.target.value === "State Branch-Head") {
                        const res = await fetch(
                          "/api/superadmin/jobs/fetchStates",
                          {
                            method: "GET",
                          },
                        );
                        if (res.ok) {
                          const data: IStates[] = await res.json();
                          setStates(data);
                        }
                      }
                    }
                  } catch (error) {
                    console.error(error);
                    alert("Something went wrong while fetching job names.");
                  }
                }}
              >
                <option value="">Select Job Name</option>
                {jobNames.map((job) => (
                  <option key={job.JobName} value={job.JobName}>
                    {job.JobName}
                  </option>
                ))}
              </Select>
              {formData.jobName === "State Branch-Head" && (
                <Select
                  icon={<HomeIcon size={18} />}
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  disabled
                >
                  <option value="">Select State</option>
                  {states.map((state) => (
                    <option key={state.state_name} value={state.state_name}>
                      {state.state_name}
                    </option>
                  ))}
                </Select>
              )}

              <Input
                icon={<Users size={18} />}
                placeholder="Number of Vacancies"
                name="noOfVacancies"
                value={formData.noOfVacancies}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Requirements */}

          <div className="rounded-3xl bg-white p-8 shadow">
            <h2 className="mb-6 text-2xl font-bold">Candidate Requirements</h2>

            <div className="grid gap-6 md:grid-cols-3">
              <Select
                icon={<User size={18} />}
                name="gender"
                value={formData.gender}
                onChange={handleChange}
              >
                <option value="">Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Any">Any</option>
              </Select>

              <Input
                icon={<User size={18} />}
                placeholder="Minimum Age"
                name="minAge"
                value={formData.minAge}
                onChange={handleChange}
                min={18}
              />

              <Input
                icon={<User size={18} />}
                placeholder="Maximum Age"
                name="maxAge"
                value={formData.maxAge}
                onChange={handleChange}
                min={formData.minAge}
              />

              <Select
                icon={<GraduationCap size={18} />}
                name="qualification"
                value={formData.qualification}
                onChange={handleChange}
              >
                <option value="">Select Qualification for Vacancy</option>
                <option value="Uneducated">Uneducated</option>
                <option value="7th Standard Pass">7th Standard Pass</option>
                <option value="10th Pass">10th Pass</option>
                <option value="Diploma Course">Diploma Course</option>
                <option value="PUC / 10 + 2">PUC / 10 + 2</option>
                <option value="Graduation Completed">
                  Graduation Completed
                </option>
                <option value="MBA Graduate">MBA Graduate</option>
                <option value="P.G. Diploma">P.G. Diploma</option>
                <option value="Post Graduate">Post Graduate</option>
                <option value="Master Graduate">Master Graduate</option>
                <option value="PHD Graduate">PHD Graduate</option>
              </Select>

              <Select
                icon={<Briefcase size={18} />}
                name="experience"
                value={formData.experience}
                onChange={handleChange}
              >
                <option value="">Select Experience for Vacancy</option>
                <option value="No Experience">No Experience</option>
                <option value="1+ Year Experience">1+ Year Experience</option>
                <option value="2+ Year Experience">2+ Year Experience</option>
                <option value="3+ Year Experience">3+ Year Experience</option>
                <option value="4+ Year Experience">4+ Year Experience</option>
                <option value="5+ and More Year Experience">
                  5+ and More Year Experience
                </option>
              </Select>

              <Select
                icon={<Clock size={18} />}
                name="shift"
                value={formData.shift}
                onChange={handleChange}
              >
                <option value="">Select Shift</option>
                <option value="Day Shift">Day Shift</option>
                <option value="Night Shift">Night Shift</option>
                <option value="Day & Night Shift">Day & Night Shift</option>
              </Select>
              <Select
                icon={<Briefcase size={18} />}
                name="nature"
                value={formData.nature}
                onChange={handleChange}
              >
                <option value="">Select Nature</option>
                <option value="Permanent">Permanent</option>
                <option value="Part Time">Part Time</option>
              </Select>
            </div>
          </div>

          {/* Interview */}

          <div className="rounded-3xl bg-white p-8 shadow">
            <h2 className="mb-6 text-2xl font-bold">Interview Schedule</h2>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label>Interview Start Date</label>
                <Input
                  icon={<Calendar size={18} />}
                  type="date"
                  name="interviewStart"
                  value={formData.interviewStart}
                  onChange={handleChange}
                  min={formData.interviewStart}
                />
              </div>

              <div>
                <label>Interview Close Date</label>
                <Input
                  icon={<Calendar size={18} />}
                  type="date"
                  name="interviewEnd"
                  value={formData.interviewEnd}
                  onChange={handleChange}
                  min={
                    formData.interviewStart ||
                    new Date().toISOString().split("T")[0]
                  }
                />
              </div>
            </div>
          </div>

          {/* Salary */}

          <div className="rounded-3xl bg-white p-8 shadow">
            <h2 className="mb-6 text-2xl font-bold">Salary Details</h2>

            <Input
              icon={<IndianRupee size={18} />}
              placeholder="Salary / Payoff"
              name="payoff"
              value={formData.payoff}
              onChange={handleChange}
            />
          </div>

          {/* Buttons */}

          <div className="flex justify-end gap-4">
            <button
              type="button"
              className="flex items-center gap-2 rounded-xl border px-8 py-4 hover:bg-gray-100"
              onClick={() =>
                setFormData({
                  branch: "Head Office",
                  jobType: formData.jobType,
                  jobName: formData.jobName,
                  noOfVacancies: "",
                  gender: "",
                  minAge: "",
                  maxAge: "",
                  qualification: "",
                  experience: "",
                  shift: "",
                  nature: "",
                  interviewStart: "",
                  interviewEnd: "",
                  payoff: "",
                  state: formData.state,
                })
              }
            >
              <RotateCcw size={18} />
              Reset
            </button>

            <button
              type="submit"
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-10 py-4 font-semibold text-white hover:bg-blue-700"
            >
              <Save size={18} />
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Input({
  icon,
  ...props
}: any) {
  return (
    <div className="relative">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
        {icon}
      </span>

      <input
        {...props}
        className="w-full rounded-xl border border-gray-300 py-3 pl-12 pr-4 outline-none focus:border-blue-600"
        required
      />
    </div>
  );
}

function Select({
  icon,
  children,
  ...props
}: any) {
  return (
    <div className="relative">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
        {icon}
      </span>

      <select
        {...props}
        className="w-full rounded-xl border border-gray-300 py-3 pl-12 pr-4 outline-none focus:border-blue-600"
        required
      >
        {children}
      </select>
    </div>
  );
}