"use client";
import { JobNames } from "@/types/JobNames.interface";
import { Briefcase, HomeIcon, RotateCcw, Search } from "lucide-react";
import React, { useState } from "react";
import Table from "./Table";

/* eslint-disable @typescript-eslint/no-explicit-any */
export default function JobManageComponent() {
  const [jobNames, setJobNames] = useState<JobNames[]>([]);
  const [states, setStates] = useState<{ state: string }[]>([]);
  const [formData, setFormData] = useState({
    jobType: "",
    jobName: "",
    state: "",
  });
  const [jobs, setJobs] = useState([]);
  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
        const res = await fetch("/api/superadmin/jobs/find", {
            method: "POST",
            body: JSON.stringify(formData)
        });
        if (res.ok) {
            const data = await res.json();
            setJobs(data);
        }
    } catch (error) {
        console.error(error);
        alert("Something went wrong.")
    }
  }
  return (
    <div>
      <div className="rounded-3xl bg-linear-to-r from-blue-700 to-indigo-700 p-8 text-white shadow-xl">
        <h1 className="text-4xl font-bold">Manage Job Vacancies</h1>
      </div>
      <form onSubmit={handleSubmit} className="rounded-3xl bg-white p-8 shadow mt-5">
        <h2 className="mb-6 text-2xl font-bold text-slate-800">
          Enter Information
        </h2>

        <div className="grid gap-6 md:grid-cols-2">
          <Select
            icon={<Briefcase size={18} />}
            name="jobType"
            value={formData.jobType}
            onChange={async (e: React.ChangeEvent<HTMLSelectElement>) => {
              setFormData({ ...formData, jobType: e.target.value });
              try {
                if (e.target.value) {
                  const res = await fetch(
                    "/api/superadmin/jobs/fetchExistingJobs",
                    {
                      method: "POST",
                      body: JSON.stringify({ jobType: e.target.value }),
                    },
                  );
                  if (res.ok) {
                    const data: JobNames[] = await res.json();
                    setJobNames(data);
                    if (data.length <= 0) {
                      alert("No Jobs Found");
                    }
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
          {jobNames.length > 0 && (
            <Select
              icon={<Briefcase size={18} />}
              name="jobName"
              value={formData.jobName}
              onChange={async (e: React.ChangeEvent<HTMLSelectElement>) => {
                setFormData({ ...formData, jobName: e.target.value });
                try {
                  if (e.target.value) {
                    if (e.target.value === "State Branch-Head") {
                      const res = await fetch(
                        "/api/superadmin/jobs/fetchExistingState",
                        {
                          method: "POST",
                          body: JSON.stringify({ jobName: e.target.value }),
                        },
                      );
                      if (res.ok) {
                        const data: { state: string }[] = await res.json();
                        setStates(data);
                      }
                    }
                  } else {
                    setStates([]);
                  }
                } catch (error) {
                  console.error(error);
                  alert("Something went wrong while fetching job names.");
                }
              }}
            >
              <option value="">Select Job Name</option>
              {jobNames.map((jobName) => (
                <option key={jobName.JobName} value={jobName.JobName}>
                  {jobName.JobName}
                </option>
              ))}
            </Select>
          )}
          {states.length > 0 && (
            <Select
              icon={<HomeIcon size={18} />}
              name="state"
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setFormData({ ...formData, state: e.target.value })
              }
              value={formData.state}
            >
              <option value="">Select State</option>
              {states.map((state) => (
                <option key={state.state} value={state.state}>
                  {state.state}
                </option>
              ))}
            </Select>
          )}
        </div>
        <div className="flex justify-end gap-4 mt-5">
          <button
            type="button"
            className="flex items-center gap-2 rounded-xl border px-8 py-4 hover:bg-gray-100"
            onClick={() => {
              setFormData({
                jobName: "",
                jobType: "",
                state: "",
              });
              setJobNames([]);
              setStates([]);
            }}
          >
            <RotateCcw size={18} />
            Reset
          </button>

          <button
            type="submit"
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-10 py-4 font-semibold text-white hover:bg-blue-700"
          >
            <Search size={18} />
            Search Job
          </button>
        </div>
      </form>
      {jobs.length > 0 ? (
        <Table jobs={jobs} />
      ): <h1 className="mt-5 text-xl text-center">No Jobs Found</h1>}
    </div>
  );
}

function Select({ icon, children, ...props }: any) {
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
