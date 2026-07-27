/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

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

export default function AddPosterComponent() {
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

        <form className="mt-8 space-y-8">
          {/* Office */}

          <div className="rounded-3xl bg-white p-8 shadow-lg">
            <h2 className="mb-8 text-2xl font-bold text-slate-800">
              Office Information
            </h2>

            <div className="grid gap-6 md:grid-cols-3">
              <Select icon={<Building2 size={18} />} label="Office">
                <option>Select Office</option>
                <option>Head Office</option>
                <option>State Head Branch</option>
                <option>District Head Branch</option>
                <option>Taluk / Tehsil Head Branch</option>
              </Select>

              <Select icon={<Briefcase size={18} />} label="Job Type">
                <option>Select Job Type</option>
                <option>Office Jobs</option>
                <option>Marketing Jobs</option>
              </Select>

              <Select icon={<Briefcase size={18} />} label="Job Name">
                <option>Select Job Name</option>
              </Select>
            </div>
          </div>

          {/* Vacancy */}

          <div className="rounded-3xl bg-white p-8 shadow-lg">
            <h2 className="mb-8 text-2xl font-bold">Vacancy Details</h2>

            <div className="grid gap-6 md:grid-cols-2">
              <Input icon={<Users size={18} />} label="Number of Vacancies" />

              <Select icon={<User size={18} />} label="Gender">
                <option>Select Gender</option>
                <option>Male</option>
                <option>Female</option>
                <option>Anyone</option>
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
              />

              <Input
                type="number"
                icon={<User size={18} />}
                label="Maximum Age"
              />

              <Select icon={<GraduationCap size={18} />} label="Qualification">
                <option>Select Qualification</option>
                <option>10th Pass</option>
                <option>PUC / 10+2</option>
                <option>Graduate</option>
                <option>Post Graduate</option>
                <option>MBA</option>
                <option>PHD</option>
              </Select>

              <Select icon={<Briefcase size={18} />} label="Experience">
                <option>No Experience</option>
                <option>1+ Year</option>
                <option>2+ Years</option>
                <option>3+ Years</option>
                <option>5+ Years</option>
              </Select>

              <Select icon={<Clock size={18} />} label="Shift">
                <option>Day Shift</option>
                <option>Night Shift</option>
                <option>Day & Night Shift</option>
              </Select>

              <Select icon={<Briefcase size={18} />} label="Nature">
                <option>Permanent</option>
                <option>Part Time</option>
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
              />

              <Input
                type="date"
                icon={<Calendar size={18} />}
                label="Interview Last Date"
              />
            </div>
          </div>

          {/* Salary */}

          <div className="rounded-3xl bg-white p-8 shadow-lg">
            <h2 className="mb-8 text-2xl font-bold">Salary Details</h2>

            <Input icon={<IndianRupee size={18} />} label="Salary" />
          </div>

          {/* Upload */}

          <div className="rounded-3xl bg-white p-8 shadow-lg">
            <h2 className="mb-8 text-2xl font-bold">Job Poster</h2>

            <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-blue-300 bg-blue-50 p-12 transition hover:border-blue-500 hover:bg-blue-100">
              <ImagePlus className="mb-4 h-16 w-16 text-blue-600" />

              <p className="text-xl font-semibold">Upload Job Poster</p>

              <p className="mt-2 text-sm text-slate-500">
                PNG, JPG • Maximum 1 MB
              </p>

              <p className="text-sm text-slate-500">
                Recommended Resolution: 1920 × 1080
              </p>

              <input type="file" accept="image/*" className="hidden" />
            </label>
          </div>

          {/* Buttons */}

          <div className="flex justify-end gap-4">
            <button
              type="reset"
              className="flex items-center gap-2 rounded-xl border px-8 py-4 font-semibold hover:bg-slate-100"
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
