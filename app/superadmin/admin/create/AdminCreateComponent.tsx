"use client";

import { ChangeEvent, useRef, useState } from "react";
import Image from "next/image";
import { Camera, Mail, MapPin, Phone, Trash2, Upload, User } from "lucide-react";

export default function AdminCreateComponent() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);

  const [preview, setPreview] = useState("/avatar-placeholder.jpg");

  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    mobile: "",
    address: "",
    image: null as File | null,
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleImage = (e: ChangeEvent<HTMLInputElement>) => {
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
      image: file,
    }));

    setPreview(URL.createObjectURL(file));
  };
  const removeImage = () => {
    setPreview("/avatar-placeholder.jpg");

    setFormData((prev) => ({
      ...prev,
      image: null,
    }));

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  const resetForm = () => {
    setFormData({
      fullname: "",
      email: "",
      mobile: "",
      address: "",
      image: null,
    });

    setPreview("/avatar-placeholder.jpg");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  const handleSubmit = async (
  e: React.FormEvent<HTMLFormElement>
) => {
  e.preventDefault();

  if (
    !formData.fullname ||
    !formData.email ||
    !formData.mobile ||
    !formData.address
  ) {
    alert("Please fill all fields.");
    return;
  }

  setLoading(true);

  try {
    const data = new FormData();

    data.append("fullname", formData.fullname);
    data.append("email", formData.email);
    data.append("mobile", formData.mobile);
    data.append("address", formData.address);

    if (formData.image) {
      data.append("image", formData.image);
    }

    const response = await fetch("/api/superadmin/admin/create", {
      method: "POST",
      body: data,
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to create admin");
    }

    alert(result.message || "Admin created successfully");

    resetForm();
  } catch (error) {
    console.error(error);

    alert(
      error instanceof Error
        ? error.message
        : "Something went wrong."
    );
  } finally {
    setLoading(false);
  }
};
  return (
    <section className="max-w-6xl mx-auto">
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
        {/* Header */}

        <div className="bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 px-8 py-8">
          <h2 className="text-3xl font-bold text-white">
            Create Hierarchy Admin
          </h2>

          <p className="mt-2 text-blue-100">
            Add a new administrator to your organization.
          </p>
        </div>

        {/* Body */}

        <form onSubmit={handleSubmit} className="p-8">
          {/* Avatar */}

          <div className="mb-10 flex flex-col items-center">
            <div className="relative">
              <input
                ref={fileInputRef}
                type="file"
                hidden
                accept="image/*"
                onChange={handleImage}
              />
              <Image
                src={preview}
                alt=""
                width={140}
                height={140}
                className="h-36 w-36 rounded-full border-4 border-blue-100 object-cover"
              />

              <button
                type="button"
                className="
                  absolute
                  bottom-1
                  right-1
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-full
                  bg-blue-600
                  text-white
                  shadow-lg
                  hover:bg-blue-700
                "
                onClick={() => fileInputRef.current?.click()}
              >
                <Camera size={20} />
              </button>
            </div>

            <div className="mt-5 flex gap-4">
              <button
                type="button"
                className="
                  flex
                  items-center
                  gap-2
                  rounded-xl
                  bg-blue-600
                  px-5
                  py-3
                  text-white
                  hover:bg-blue-700
                "
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload size={18} />
                Upload Image
              </button>
              {formData.image && (
                <button
                  type="button"
                  onClick={removeImage}
                  className="flex items-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-white hover:bg-red-700"
                >
                  <Trash2 size={18} />
                  Remove
                </button>
              )}
            </div>

            <p className="mt-3 text-sm text-slate-500">JPG, PNG (Max 1MB)</p>
          </div>

          {/* Form */}

          <div className="grid gap-6 md:grid-cols-2">
            {/* Full Name */}

            <div>
              <label className="mb-2 block font-semibold">Full Name</label>

              <div className="relative">
                <User
                  size={18}
                  className="absolute left-4 top-5 text-slate-400"
                />

                <input
                  type="text"
                  placeholder="Enter Full Name"
                  className="
                    w-full
                    rounded-2xl
                    border
                    border-slate-300
                    py-4
                    pl-12
                    pr-4
                    outline-none
                    transition
                    focus:border-blue-600
                  "
                  value={formData.fullname}
                  onChange={handleChange}
                  name="fullname"
                />
              </div>
            </div>

            {/* Email */}

            <div>
              <label className="mb-2 block font-semibold">Email Address</label>

              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-4 top-5 text-slate-400"
                />

                <input
                  type="email"
                  placeholder="Enter Email"
                  className="
                    w-full
                    rounded-2xl
                    border
                    border-slate-300
                    py-4
                    pl-12
                    pr-4
                    outline-none
                    transition
                    focus:border-blue-600
                  "
                  value={formData.email}
                  onChange={handleChange}
                  name="email"
                />
              </div>
            </div>

            {/* Mobile */}

            <div>
              <label className="mb-2 block font-semibold">Mobile Number</label>

              <div className="relative">
                <Phone
                  size={18}
                  className="absolute left-4 top-5 text-slate-400"
                />

                <input
                  type="text"
                  placeholder="Enter Mobile Number"
                  className="
                    w-full
                    rounded-2xl
                    border
                    border-slate-300
                    py-4
                    pl-12
                    pr-4
                    outline-none
                    transition
                    focus:border-blue-600
                  "
                  value={formData.mobile}
                  onChange={handleChange}
                  name="mobile"
                />
              </div>
            </div>
            {/* Address */}

            <div>
              <label className="mb-2 block font-semibold">Address</label>

              <div className="relative">
                <MapPin
                  size={18}
                  className="absolute left-4 top-5 text-slate-400"
                />

                <textarea
                  placeholder="Enter Complete Address..."
                  className="
                  w-full
                  rounded-2xl
                  border
                  border-slate-300
                  py-4
                  pl-12
                  pr-4
                  outline-none
                  transition
                  focus:border-blue-600
                "
                  value={formData.address}
                  onChange={handleChange}
                  name="address"
                />
              </div>
            </div>
          </div>

          {/* Buttons */}

          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-end">
            <button
              type="button"
              className="
                rounded-xl
                border
                border-slate-300
                px-8
                py-4
                font-semibold
                hover:bg-slate-100
              "
              onClick={resetForm}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="
                rounded-xl
                bg-linear-to-r
                from-blue-600
                to-indigo-700
                px-10
                py-4
                font-semibold
                text-white
                shadow-lg
                transition
                hover:scale-105
              "
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Administrator"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
