"use client";

import { useState } from "react";
import {
  Building2,
  GitBranch,
  Briefcase,
  ClipboardList,
  PlusCircle,
  RotateCcw,
} from "lucide-react";
import { JobNames } from "@/types/JobNames.interface";
import { useRouter } from "next/navigation";

export default function AddQuestionsComponent() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    office: "",
    branch: "",
    jobType: "",
    designation: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/superadmin/questions/count", {
        method: "POST",
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (!res.ok) {
        alert(data.error);
        return;
      }
      router.push(
        `/superadmin/questions/create?office=${formData.office}&branch=${formData.branch}&jobType=${formData.jobType}&jobName=${formData.designation}`,
      );
    } catch (error) {
      console.error(error);
      alert("Something Went Wrong");
    }
  };

  const handleReset = () => {
    setFormData({
      office: "",
      branch: "",
      jobType: "",
      designation: "",
    });
  };

  const [jobNames, setJobNames] = useState<JobNames[]>([]);

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-4xl">
        {/* Header */}

        <div className="rounded-3xl bg-linear-to-r from-blue-700 via-blue-600 to-indigo-700 p-8 text-white shadow-xl">
          <h1 className="text-3xl font-bold">Add Interview Questions</h1>

          <p className="mt-2 text-blue-100">
            Select office, branch and job designation to add interview
            questions.
          </p>
        </div>

        {/* Form */}

        <form
          onSubmit={handleSubmit}
          className="mt-8 rounded-3xl bg-white p-8 shadow-lg"
        >
          <div className="grid gap-6 md:grid-cols-2">
            {/* Office */}

            <div>
              <label className="mb-2 block font-semibold text-slate-700">
                Office
              </label>

              <div className="relative">
                <Building2
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-600"
                />

                <select
                  name="office"
                  value={formData.office}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-300 py-3 pl-12 pr-4 outline-none focus:border-blue-600"
                  required
                >
                  <option value="">Select Office</option>
                  <option value="Head">Head Office</option>
                  <option value="Branch">Branch Office</option>
                </select>
              </div>
            </div>

            {/* Branch */}

            <div>
              <label className="mb-2 block font-semibold text-slate-700">
                Branch
              </label>

              <div className="relative">
                <GitBranch
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-600"
                />

                <select
                  name="branch"
                  value={formData.branch}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-300 py-3 pl-12 pr-4 outline-none focus:border-blue-600"
                  required
                >
                  <option value="">Select Branch</option>
                  {formData.office === "Head" ? (
                    <option value="Head">Head Office</option>
                  ) : formData.office === "Branch" ? (
                    <>
                      <option value="State">State Head Branch</option>
                      <option value="District">District Head Branch</option>
                      <option value="Taluk">Taluk Head Branch</option>
                    </>
                  ) : null}
                </select>
              </div>
            </div>

            {/* Job Type */}

            <div>
              <label className="mb-2 block font-semibold text-slate-700">
                Job Type
              </label>

              <div className="relative">
                <Briefcase
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-600"
                />

                <select
                  name="jobType"
                  value={formData.jobType}
                  required
                  onChange={async (e) => {
                    handleChange(e);
                    if (e.target.value) {
                      try {
                        const res = await fetch(
                          "/api/superadmin/questions/fetchJobNames",
                          {
                            method: "POST",
                            body: JSON.stringify({
                              office: formData.office,
                              branch: formData.branch,
                              jobType: e.target.value,
                            }),
                          },
                        );
                        if (res.ok) {
                          const data = await res.json();
                          setJobNames(data);
                        }
                      } catch (error) {
                        console.error(error);
                        alert("Something Went Wrong");
                      }
                    }
                  }}
                  className="w-full rounded-xl border border-gray-300 py-3 pl-12 pr-4 outline-none focus:border-blue-600"
                >
                  <option value="">Select Job Type</option>
                  {formData.branch === "Head" ? (
                    <>
                      <option value="Office">Office Jobs</option>
                      <option value="Marketing">Marketing Jobs</option>
                    </>
                  ) : formData.branch === "State" ||
                    formData.branch === "District" ||
                    formData.branch === "Taluk" ? (
                    <>
                      <option value="Branch">Branch Jobs</option>
                      <option value="Marketing">Marketing Jobs</option>
                    </>
                  ) : null}
                </select>
              </div>
            </div>

            {/* Designation */}

            <div>
              <label className="mb-2 block font-semibold text-slate-700">
                Job Designation
              </label>

              <div className="relative">
                <ClipboardList
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-600"
                />

                <select
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-gray-300 py-3 pl-12 pr-4 outline-none focus:border-blue-600"
                >
                  <option value="">Select Job Designation</option>
                  {jobNames.length > 0
                    ? jobNames.map((jobName) => (
                        <option key={jobName.JobName} value={jobName.JobName}>
                          {jobName.JobName}
                        </option>
                      ))
                    : null}
                </select>
              </div>
            </div>
          </div>

          {/* Buttons */}

          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center justify-center gap-2 rounded-xl border border-red-300 bg-red-50 px-8 py-3 font-semibold text-red-600 transition hover:bg-red-100"
            >
              <RotateCcw size={18} />
              Reset
            </button>

            <button
              type="submit"
              className="flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-blue-600 to-indigo-700 px-8 py-3 font-semibold text-white transition hover:scale-[1.02]"
            >
              <PlusCircle size={18} />
              Add Questions
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
