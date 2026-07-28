/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { JobNames } from "@/types/JobNames.interface";
import {
  Building2,
  Briefcase,
  Users,
  User,
  GraduationCap,
  Clock,
  Calendar,
  IndianRupee,
  ImagePlus,
  Save,
  RotateCcw,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function AddPosterComponent() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    branch: "",
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
    poster: null as File | null,
  });
  const [jobNames, setJobNames] = useState<JobNames[]>([]);
  async function fetchJobNames(e: React.ChangeEvent<HTMLSelectElement>) {
    setFormData({ ...formData, jobType: e.target.value });
    try {
      const res = await fetch("/api/superadmin/poster/fetchJobNames", {
        method: "POST",
        body: JSON.stringify({
          office: formData.branch,
          jobType: e.target.value,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setJobNames(data);
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    }
  }
  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;

    const file = e.target.files[0];

    if (!file.type.startsWith("image/")) {
      alert("Please upload an image.");
      return;
    }

    if (file.size > 1024 * 1024) {
      alert("Image must be below 1 MB");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      poster: file,
    }));
  };
  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const data = new FormData();

      data.append("branch", formData.branch);
      data.append("jobType", formData.jobType);
      data.append("jobName", formData.jobName);
      data.append("noOfVacancies", formData.noOfVacancies);
      data.append("gender", formData.gender);
      data.append("minAge", formData.minAge);
      data.append("maxAge", formData.maxAge);
      data.append("qualification", formData.qualification);
      data.append("experience", formData.experience);
      data.append("shift", formData.shift);
      data.append("nature", formData.nature);
      data.append("interviewStart", formData.interviewStart);
      data.append("interviewEnd", formData.interviewEnd);
      data.append("payoff", formData.payoff);

      if (formData.poster) {
        data.append("poster", formData.poster);
      }

      const response = await fetch("/api/superadmin/poster/create", {
        method: "POST",
        body: data,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to Add Poster");
      }

      alert(result.message || "Poster Added successfully");
      router.push("/superadmin")
    } catch (error) {
      console.error(error);

      alert(error instanceof Error ? error.message : "Something went wrong.");
    }
  };
  const resetForm = () => {
    setFormData({
      branch: "",
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
      poster: null as File | null,
    });
  };
  return (
    <div className="min-h-screen bg-slate-100 py-8 px-4">
      <div className="mx-auto max-w-7xl">
        {/* Header */}

        <div className="rounded-3xl bg-linear-to-r from-blue-700 to-indigo-700 p-8 text-white shadow-xl">
          <h1 className="text-4xl font-bold">Add Jobs Banner</h1>

          <p className="mt-2 text-blue-100">
            Publish a new job advertisement with poster.
          </p>
        </div>

        <form className="mt-8 space-y-8" onSubmit={handleSubmit}>
          {/* Office */}

          <div className="rounded-3xl bg-white p-8 shadow-lg">
            <h2 className="mb-8 text-2xl font-bold text-slate-800">
              Office Information
            </h2>

            <div className="grid gap-6 md:grid-cols-3">
              <Select
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setFormData({ ...formData, branch: e.target.value })
                }
                icon={<Building2 size={18} />}
                label="Office"
                value={formData.branch}
              >
                <option value={""}>Select Office</option>
                <option value={"Head Office"}>Head Office</option>
                <option value={"State Head Branch"}>State Head Branch</option>
                <option value={"District Head Branch"}>
                  District Head Branch
                </option>
                <option value={"Taluk / Tehsil Head Branch"}>
                  Taluk / Tehsil Head Branch
                </option>
              </Select>

              <Select
                onChange={fetchJobNames}
                icon={<Briefcase size={18} />}
                label="Job Type"
                value={formData.jobType}
              >
                <option value={""}>Select Job Type</option>
                <option value={"Office Jobs"}>Office Jobs</option>
                <option value={"Marketing Jobs"}>Marketing Jobs</option>
              </Select>

              <Select
                icon={<Briefcase size={18} />}
                label="Job Name"
                value={formData.jobName}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setFormData({
                    ...formData,
                    jobName: e.target.value,
                  })
                }
              >
                <option value={""}>Select Job Name</option>
                {jobNames.length > 0
                  ? jobNames.map((job) => (
                      <option value={job.JobName} key={job.JobName}>
                        {job.JobName}
                      </option>
                    ))
                  : null}
              </Select>
            </div>
          </div>

          {/* Vacancy */}

          <div className="rounded-3xl bg-white p-8 shadow-lg">
            <h2 className="mb-8 text-2xl font-bold">Vacancy Details</h2>

            <div className="grid gap-6 md:grid-cols-2">
              <Input
                icon={<Users size={18} />}
                label="Number of Vacancies"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, noOfVacancies: e.target.value })
                }
                value={formData.noOfVacancies}
              />

              <Select
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setFormData({ ...formData, gender: e.target.value })
                }
                icon={<User size={18} />}
                label="Gender"
                value={formData.gender}
              >
                <option value={""}>Select Gender</option>
                <option value={"Male"}>Male</option>
                <option value={"Female"}>Female</option>
                <option value={"Anyone"}>Anyone</option>
              </Select>
            </div>
          </div>

          {/* Candidate */}

          <div className="rounded-3xl bg-white p-8 shadow-lg">
            <h2 className="mb-8 text-2xl font-bold">Candidate Requirements</h2>

            <div className="grid gap-6 md:grid-cols-3">
              <Input
                type="number"
                icon={<User size={18} />}
                label="Minimum Age"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, minAge: e.target.value })
                }
                min={18}
                value={formData.minAge}
              />

              <Input
                type="number"
                icon={<User size={18} />}
                label="Maximum Age"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, maxAge: e.target.value })
                }
                min={formData.minAge}
                value={formData.maxAge}
              />

              <Select
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setFormData({ ...formData, qualification: e.target.value })
                }
                icon={<GraduationCap size={18} />}
                label="Qualification"
                value={formData.qualification}
              >
                <option value={""}>Select Qualification</option>
                <option value={"10th Pass"}>10th Pass</option>
                <option value={"PUC / 10+2"}>PUC / 10+2</option>
                <option value={"Graduate"}>Graduate</option>
                <option value={"Post Graduate"}>Post Graduate</option>
                <option value={"MBA"}>MBA</option>
                <option value={"PHD"}>PHD</option>
              </Select>

              <Select
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setFormData({ ...formData, experience: e.target.value })
                }
                icon={<Briefcase size={18} />}
                label="Experience"
                value={formData.experience}
              >
                <option value={""}>No Experience</option>
                <option value={"1+ Year"}>1+ Year</option>
                <option value={"2+ Year"}>2+ Years</option>
                <option value={"3+ Year"}>3+ Years</option>
                <option value={"5+ Year"}>5+ Years</option>
              </Select>

              <Select
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setFormData({ ...formData, shift: e.target.value })
                }
                icon={<Clock size={18} />}
                label="Shift"
                value={formData.shift}
              >
                <option value={""}>Select Shift</option>
                <option value={"Day Shift"}>Day Shift</option>
                <option value={"Night Shift"}>Night Shift</option>
                <option value={"Day & Night Shift"}>Day & Night Shift</option>
              </Select>

              <Select
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setFormData({ ...formData, nature: e.target.value })
                }
                icon={<Briefcase size={18} />}
                label="Nature"
                value={formData.nature}
              >
                <option value={""}>Select Nature</option>
                <option value={"Permanent"}>Permanent</option>
                <option value={"Part Time"}>Part Time</option>
              </Select>
            </div>
          </div>

          {/* Interview */}

          <div className="rounded-3xl bg-white p-8 shadow-lg">
            <h2 className="mb-8 text-2xl font-bold">Interview Schedule</h2>

            <div className="grid gap-6 md:grid-cols-2">
              <Input
                type="date"
                icon={<Calendar size={18} />}
                label="Interview Start"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, interviewStart: e.target.value })
                }
                min={new Date().toISOString().split("T")[0]}
                value={formData.interviewStart}
              />

              <Input
                type="date"
                icon={<Calendar size={18} />}
                label="Interview Last Date"
                min={formData.interviewStart}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, interviewEnd: e.target.value })
                }
                value={formData.interviewEnd}
              />
            </div>
          </div>

          {/* Salary */}

          <div className="rounded-3xl bg-white p-8 shadow-lg">
            <h2 className="mb-8 text-2xl font-bold">Salary Details</h2>

            <Input
              icon={<IndianRupee size={18} />}
              label="Salary"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormData({ ...formData, payoff: e.target.value })
              }
              value={formData.payoff}
            />
          </div>

          {/* Upload */}

          <div className="rounded-3xl bg-white p-8 shadow-lg">
            <h2 className="mb-8 text-2xl font-bold">Job Poster</h2>

            <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-blue-300 bg-blue-50 p-12 transition hover:border-blue-500 hover:bg-blue-100">
              <ImagePlus className="mb-4 h-16 w-16 text-blue-600" />

              <p className="text-xl font-semibold">
                {formData.poster ? formData.poster.name : "Upload Job Poster"}
              </p>

              <p className="mt-2 text-sm text-slate-500">
                PNG, JPG • Maximum 1 MB
              </p>

              <p className="text-sm text-slate-500">
                Recommended Resolution: 1920 × 1080
              </p>

              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImage}
              />
            </label>
          </div>

          {/* Buttons */}

          <div className="flex justify-end gap-4">
            <button
              type="button"
              className="flex items-center gap-2 rounded-xl border px-8 py-4 font-semibold hover:bg-slate-100"
              onClick={resetForm}
            >
              <RotateCcw size={18} />
              Reset
            </button>

            <button
              type="submit"
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-4 font-semibold text-white hover:bg-blue-700"
            >
              <Save size={18} />
              Add Poster
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Input({ icon, label, ...props }: any) {
  return (
    <div>
      <label className="mb-2 block font-medium text-slate-700">{label}</label>

      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
          {icon}
        </span>

        <input
          {...props}
          className="w-full rounded-xl border border-slate-300 bg-slate-50 py-3 pl-12 pr-4 outline-none transition focus:border-blue-600"
        />
      </div>
    </div>
  );
}

function Select({ icon, label, children, ...props }: any) {
  return (
    <div>
      <label className="mb-2 block font-medium text-slate-700">{label}</label>

      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
          {icon}
        </span>

        <select
          {...props}
          className="w-full rounded-xl border border-slate-300 bg-slate-50 py-3 pl-12 pr-4 outline-none transition focus:border-blue-600"
        >
          {children}
        </select>
      </div>
    </div>
  );
}
