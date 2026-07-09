"use client";

import Image from "next/image";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  Mail,
  Phone,
  MapPin,
  BadgeCheck,
  Check,
} from "lucide-react";
import { useLayoutEffect, useState } from "react";
import { IAdmin } from "@/types/admin.interface";
import Link from "next/link";

export default function AdminManageComponent() {
  const [admins, setAdmins] = useState<IAdmin[]>([]);
  const [search, setSearch] = useState("");
  useLayoutEffect(() => {
    const fetchAdmins = async () => {
      try {
        const response = await fetch("/api/superadmin/admin/manage");
        if (!response.ok) {
          throw new Error("Failed to fetch admins");
        }
        const data: IAdmin[] = await response.json();
        setAdmins(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchAdmins();
  }, []);
  const filteredAdmins = admins.filter((admin) => {
    const keyword = search.toLowerCase();

    return (
      admin.name.toLowerCase().includes(keyword) ||
      admin.role.toLowerCase().includes(keyword) ||
      admin.adminID.toLowerCase().includes(keyword) ||
      admin.mobile.includes(keyword) ||
      admin.email.toLowerCase().includes(keyword) ||
      admin.address.toLowerCase().includes(keyword) ||
      admin.status.toLowerCase().includes(keyword)
    );
  });

  const handleDeactivate = async (adminID: string) => {
    if (!confirm("Are you sure you want to deactivate this admin?")) {
      return;
    }
    try {
      const res = await fetch(`/api/superadmin/admin/deactivate`, {
        method: "PATCH",
        body: JSON.stringify({ id: adminID }),
      });
      if (!res.ok) {
        alert("Something went wrong while deactivating the admin.");
      }
      // mark admin as inactive (soft delete) by setting status to "0"
      setAdmins((prevAdmins) =>
        prevAdmins.map((admin) =>
          admin.adminID == adminID ? { ...admin, status: "0" } : admin
        )
      );
    } catch (error) {
      console.error(error);
      alert("Something went wrong while deactivating the admin.");
    }
  };
  const handleActivate = async (adminID: string) => {
    if (!confirm("Are you sure you want to activate this admin?")) {
      return;
    }
    try {
      const res = await fetch(`/api/superadmin/admin/activate`, {
        method: "PATCH",
        body: JSON.stringify({ id: adminID }),
      });
      if (!res.ok) {
        alert("Something went wrong while activating the admin.");
      }
      // mark admin as active by setting status to "1"
      setAdmins((prevAdmins) =>
        prevAdmins.map((admin) =>
          admin.adminID == adminID ? { ...admin, status: "1" } : admin
        )
      );
    } catch (error) {
      console.error(error);
      alert("Something went wrong while activating the admin.");
    }
  };
  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}

        <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">
              Manage Hierarchy Admins
            </h1>

            <p className="mt-1 text-gray-500">
              Manage all organization hierarchy admins
            </p>
          </div>

          <div className="flex gap-4">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                placeholder="Search admin..."
                className="h-11 w-72 rounded-xl border bg-white pl-11 pr-4 outline-none focus:border-blue-500"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <Link
              href="/superadmin/admin/create"
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 text-white hover:bg-blue-700"
            >
              <Plus size={18} />
              Add Admin
            </Link>
          </div>
        </div>

        {/* Cards */}

        <div className="space-y-6">
          {filteredAdmins.length > 0 ? (
            filteredAdmins.map((admin) => (
              <div
                key={admin.id}
                className="rounded-2xl bg-white shadow-sm transition hover:shadow-lg"
              >
                <div className="flex flex-col gap-6 p-6 lg:flex-row lg:items-center">
                  {/* Image */}

                  <div className="flex justify-center">
                    <Image
                      src={`/uploads/admins/${admin.image}`}
                      alt={admin.name}
                      width={120}
                      height={120}
                      className="rounded-2xl border object-cover"
                    />
                  </div>

                  {/* Details */}

                  <div className="grid flex-1 gap-6 lg:grid-cols-3">
                    <div>
                      <h2 className="text-xl font-bold text-slate-800">
                        {admin.name}
                      </h2>

                      <p className="mt-1 text-blue-600 font-medium">Admin</p>

                      <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-sm text-green-700">
                        <BadgeCheck size={16} />

                        {admin.status === "1" ? "Active" : "Inactive"}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <p className="text-xs uppercase text-gray-400">
                          Admin ID
                        </p>

                        <p className="font-semibold">{admin.adminID}</p>
                      </div>

                      <div className="flex items-center gap-2 text-gray-600">
                        <Phone size={17} />

                        {admin.mobile}
                      </div>

                      <div className="flex items-center gap-2 text-gray-600">
                        <Mail size={17} />

                        {admin.email}
                      </div>
                    </div>

                    <div>
                      <p className="mb-2 text-xs uppercase text-gray-400">
                        Address
                      </p>

                      <div className="flex gap-2">
                        <MapPin className="mt-1 text-red-500" size={18} />

                        <p className="text-gray-600 leading-7">
                          {admin.address}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Buttons */}

                  <div className="flex flex-col gap-3">
                    <Link
                      href={`/superadmin/admin/edit/${admin.adminID}`}
                      className="flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-5 py-3 font-medium text-white hover:bg-amber-600 duration-300"
                    >
                      <Pencil size={18} />
                      Edit
                    </Link>

                    {admin.status === "1" ? (
                      <button
                        onClick={() => handleDeactivate(admin.adminID)}
                        className="flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 font-medium text-white hover:bg-red-700 duration-300"
                      >
                        <Trash2 size={18} />
                        Deactivate
                      </button>
                    ) : (
                      <button
                        onClick={() => handleActivate(admin.adminID)}
                        className="flex items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-3 font-medium text-white hover:bg-green-700 duration-300"
                      >
                        <Check size={18} />
                        Activate
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-xl bg-white p-12 text-center shadow">
              <Search className="mx-auto mb-3 text-gray-400" size={45} />
              <h3 className="text-lg font-semibold">No Admin Found</h3>
              <p className="text-gray-500">
                No results found for &quot;
                <span className="font-medium">{search}</span>&quot;
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
