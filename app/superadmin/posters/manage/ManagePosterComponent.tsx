"use client";

import { Trash2, Search } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface JobBanner {
  id: number;
  office: string;
  JobType: string;
  JobName: string;
  Salary: string;
  Poster: string;
}

export default function ManagePosterComponent() {
    const router = useRouter();
  const [search, setSearch] = useState("");

  const [banners, setBanners] = useState<JobBanner[]>([])

  useEffect(() => {
    async function fetchBanners() {
        try {
            const res = await fetch("/api/superadmin/poster/fetch");
            if (res.ok) {
                const data = await res.json();
                setBanners(data);
                console.log(data);
                
            }
        } catch (error) {
            console.error(error);
            alert("Something went wrong")
        }
    }
    fetchBanners();
  }, [])

  const filtered = banners.filter((job) =>
    job.JobName.toLowerCase().includes(search.toLowerCase())
  );

  async function DeletePoster(id: number) {
    try {
      const res = await fetch("/api/superadmin/poster/delete", {
        method: "DELETE",
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        alert("Poster Deleted Successfully");
        router.push("/superadmin")
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}

        <div className="rounded-3xl bg-linear-to-r from-blue-700 to-indigo-700 p-8 text-white shadow-xl">
          <h1 className="text-3xl font-bold">Manage Job Banners</h1>

          <p className="mt-2 text-blue-100">
            View and delete uploaded job posters.
          </p>
        </div>

        {/* Search */}

        <div className="mt-8 rounded-2xl bg-white p-6 shadow">
          <div className="relative max-w-md">
            <Search
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="Search Job Name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-gray-300 py-3 pl-12 pr-4 outline-none focus:border-blue-600"
            />
          </div>
        </div>

        {/* Table */}

        <div className="mt-8 overflow-hidden rounded-3xl bg-white shadow-lg">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-slate-800 text-white">
                <tr>
                  <th className="px-5 py-4 text-left">Poster</th>
                  <th className="px-5 py-4 text-left">Office</th>
                  <th className="px-5 py-4 text-left">Job Type</th>
                  <th className="px-5 py-4 text-left">Job Name</th>
                  <th className="px-5 py-4 text-left">Salary</th>
                  <th className="px-5 py-4 text-center">Action</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((job) => (
                  <tr key={job.id} className="border-b hover:bg-slate-50">
                    <td className="px-5 py-4">
                      <Image
                        src={`/uploads/posters/${job.Poster}`}
                        alt={job.JobName}
                        width={100}
                        height={60}
                        className="rounded-lg border object-cover"
                      />
                    </td>

                    <td className="px-5 py-4">{job.office}</td>

                    <td className="px-5 py-4 font-semibold">{job.JobType}</td>

                    <td className="px-5 py-4 font-semibold">{job.JobName}</td>

                   

                    <td className="px-5 py-4 font-semibold text-green-600">
                      ₹{job.Salary}
                    </td>

                    <td className="px-5 py-4 text-center">
                      <button
                        className="rounded-lg bg-red-600 p-3 text-white transition hover:bg-red-700"
                        onClick={() => {
                          if (
                            confirm(
                              "Are you sure you want to delete this banner?",
                            )
                          ) {
                            DeletePoster(job.id)
                          }
                        }}
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}

                {filtered.length === 0 && (
                  <tr>
                    <td
                      colSpan={11}
                      className="py-10 text-center text-gray-500"
                    >
                      No Job Banner Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}