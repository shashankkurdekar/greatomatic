"use client";

import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import Image from "next/image";
import { Upload, Save, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

interface IAdmin {
  name: string;
  email: string;
  mobile: string;
  address: string;
  image: File | null;
  status: string;
}

export default function EditAdminComponent() {
  const [admin, setAdmin] = useState<IAdmin>({
    name: "",
    email: "",
    mobile: "",
    address: "",
    image: null as File | null,
    status: "",
  });
  const [imagePreview, setImagePreview] = useState("/avatar-placeholder.jpg");
  
  const id = useParams().id;
  useEffect(() => {
    // Fetch admin data by ID from API
    const fetchAdminData = async () => {
      try {
        const response = await fetch(`/api/superadmin/admin/fetchbyid`, {
            method: "POST",
            body: JSON.stringify({ id }),
        });
        if (!response.ok) {
          alert("Something went wrong while fetching admin data.");
          return;
        }
        const data = await response.json();
        setAdmin({
          name: data.name,
          email: data.email,
          mobile: data.mobile,
          address: data.address,
          status: data.status,
          image: null,
        });
        setImagePreview(data.image ? `/uploads/admins/${data.image}` : "/avatar-placeholder.jpg");
      } catch (error) {
        console.error(error);
      }
    };

    fetchAdminData();
  }, [id]);
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setAdmin({
      ...admin,
      [e.target.name]: e.target.value,
    });
  };

  const handleImage = (
    e: React.ChangeEvent<HTMLInputElement>
) => {
    if (!e.target.files?.length) return;

    const file = e.target.files[0];

    setAdmin((prev) => ({
        ...prev,
        image: file,
    }));

    setImagePreview(URL.createObjectURL(file));
};

  const router = useRouter();

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
        const formData = new FormData();
        formData.append("name", admin.name);
        formData.append("email", admin.email);
        formData.append("mobile", admin.mobile);
        formData.append("address", admin.address);
        formData.append("status", admin.status);
        formData.append("id", id as string);
        if (admin.image instanceof File) {
          formData.append("image", admin.image);
        }
        const res = await fetch("/api/superadmin/admin/update", {
            method: "POST",
            body: formData,
        });
        if (!res.ok) {
            alert("Something went wrong while updating admin data.");
        }
        alert("Admin data updated successfully!");
        router.push("/superadmin/admin/manage");
    } catch (error) {
        console.error(error);
        alert("Something went wrong while updating admin data.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 py-10">
      <div className="mx-auto max-w-5xl">
        {/* Header */}

        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Edit Admin</h1>

            <p className="text-gray-500 mt-2">
              Update administrator information
            </p>
          </div>

          <Link
            href="/superadmin/admin/manage"
            className="flex items-center gap-2 rounded-lg border bg-white px-5 py-3 hover:bg-gray-50"
          >
            <ArrowLeft size={18} />
            Back
          </Link>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl bg-white p-8 shadow-lg"
        >
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Left Side */}

            <div className="flex flex-col items-center">
              <Image
                src={imagePreview}
                alt="Profile"
                width={180}
                height={180}
                className="rounded-xl object-cover"
              />

              <label className="mt-5 flex cursor-pointer items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-white hover:bg-blue-700">
                <Upload size={18} />
                Change Photo
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleImage}
                />
              </label>
            </div>

            {/* Right Side */}

            <div className="lg:col-span-2">
              <div className="grid gap-6 md:grid-cols-2">
                {/* Name */}

                <div>
                  <label className="mb-2 block font-medium">Full Name</label>

                  <input
                    type="text"
                    name="name"
                    value={admin.name}
                    onChange={handleChange}
                    className="w-full rounded-lg border p-3 outline-none focus:border-blue-500"
                  />
                </div>

                {/* Mobile */}

                <div>
                  <label className="mb-2 block font-medium">Mobile</label>

                  <input
                    type="text"
                    name="mobile"
                    value={admin.mobile}
                    onChange={handleChange}
                    className="w-full rounded-lg border p-3 outline-none focus:border-blue-500"
                  />
                </div>

                {/* Email */}

                <div className="md:col-span-2">
                  <label className="mb-2 block font-medium">Email</label>

                  <input
                    type="email"
                    name="email"
                    value={admin.email}
                    onChange={handleChange}
                    className="w-full rounded-lg border p-3 outline-none focus:border-blue-500"
                  />
                </div>

                {/* Address */}

                <div className="md:col-span-2">
                  <label className="mb-2 block font-medium">Address</label>

                  <textarea
                    rows={4}
                    name="address"
                    value={admin.address}
                    onChange={handleChange}
                    className="w-full rounded-lg border p-3 outline-none focus:border-blue-500"
                  />
                </div>

                {/* Status */}

                <div>
                  <label className="mb-2 block font-medium">Status</label>

                  <select
                    name="status"
                    value={admin.status}
                    onChange={handleChange}
                    className="w-full rounded-lg border p-3 outline-none focus:border-blue-500"
                  >
                    <option value="1">Active</option>
                    <option value="0">Inactive</option>
                  </select>
                </div>
              </div>

              {/* Buttons */}

              <div className="mt-10 flex gap-4">
                <button
                  type="submit"
                  className="flex items-center gap-2 rounded-lg bg-blue-600 px-8 py-3 text-white hover:bg-blue-700"
                >
                  <Save size={18} />
                  Update Admin
                </button>

                <Link
                  href="/superadmin/admin/manage"
                  className="rounded-lg border px-8 py-3 hover:bg-gray-100"
                >
                  Cancel
                </Link>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}