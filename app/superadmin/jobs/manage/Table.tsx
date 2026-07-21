"use client";

import { IJobs } from "@/types/jobs.interface";
import {
  Building2,
  Briefcase,
  Users,
  GraduationCap,
  IndianRupee,
  Pencil,
  Trash2,
  MapPin,
  X,
  Check,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function Table({ jobs }: { jobs: IJobs[] }) {
  const router = useRouter();
  async function handleDelete(id: number) {
    if (!confirm("Are you sure want to deactivate this job")) {
      return;
    }
    try {
      const res = await fetch("/api/superadmin/jobs/delete", {
        method: "DELETE",
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        alert("Job Deleted Successfully");
        router.push("/superadmin");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    }
  }
  async function handleActivate(id: number) {
    if (!confirm("Are you sure want to activate this job")) {
      return;
    }
    try {
      const res = await fetch("/api/superadmin/jobs/activate", {
        method: "PATCH",
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        alert("Job Activated Successfully");
        router.push("/superadmin");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    }
  }
  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="mx-auto max-w-7xl">
        {/* Table */}

        <div className="overflow-hidden rounded-3xl bg-white shadow-xl">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr className="text-left">
                <th className="px-6 py-5">#</th>

                <th className="px-6 py-5">Job Details</th>

                <th className="px-6 py-5">Vacancy</th>

                <th className="px-6 py-5">Candidate</th>

                <th className="px-6 py-5">Salary</th>

                <th className="px-6 py-5 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {jobs.map((job) => (
                <tr
                  key={job.id}
                  className="border-t hover:bg-slate-50 transition"
                >
                  <td className="px-6 py-6 font-semibold">{job.id}</td>

                  <td className="px-6 py-6">
                    <h3 className="font-semibold text-lg">{job.JobName}</h3>

                    <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Building2 size={16} />

                        {job.OfficeType}
                      </span>

                      <span className="flex items-center gap-1">
                        <Briefcase size={16} />

                        {job.JobType}
                      </span>

                      <span className="flex items-center gap-1">
                        <MapPin size={16} />

                        {job?.State || "NA"}
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-6">
                    <span className="rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
                      {job.NumberOfJobs}
                    </span>
                  </td>

                  <td className="px-6 py-6">
                    <div className="space-y-2 text-sm">
                      <p className="flex items-center gap-2">
                        <Users size={16} />

                        {job.Gender}
                      </p>

                      <p className="flex items-center gap-2">
                        <GraduationCap size={16} />

                        {job.Grade}
                      </p>

                      <p>🎂 Minimum Age {job.MinAge}</p>
                      <p>🎂 Maximum Age {job.MaxAge}</p>

                      <p>💼 {job.EXP}</p>
                    </div>
                  </td>

                  <td className="px-6 py-6">
                    <span className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 font-semibold text-blue-700">
                      <IndianRupee size={16} />

                      {job.Salary}
                    </span>
                  </td>

                  <td className="px-6 py-6">
                    <div className="flex justify-center gap-3">
                      <button
                        className="rounded-xl bg-amber-500 p-3 text-white hover:bg-amber-600"
                        onClick={() =>
                          router.push(`/superadmin/jobs/edit/${job.id}`)
                        }
                      >
                        <Pencil size={18} />
                      </button>

                      {job.Status === "1" ? (
                        <button
                          className="rounded-xl bg-red-600 p-3 text-white hover:bg-red-700"
                          onClick={() => handleDelete(job.id)}
                        >
                          <X size={18} />
                        </button>
                      ) : (
                        <button
                          className="rounded-xl bg-green-600 p-3 text-white hover:bg-green-700"
                          onClick={() => handleActivate(job.id)}
                        >
                          <Check size={18} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
