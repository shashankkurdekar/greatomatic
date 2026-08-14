/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { Lock, Eye, EyeOff, ShieldCheck, Save, RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";
export default function PasswordComponent() {
    const router = useRouter();
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [form, setForm] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const passwordStrength = () => {
    const password = form.newPassword;

    if (password.length === 0) return 0;
    if (password.length < 6) return 25;
    if (password.length < 8) return 50;
    if (
      /[A-Z]/.test(password) &&
      /[0-9]/.test(password) &&
      /[^A-Za-z0-9]/.test(password)
    )
      return 100;

    return 75;
  };

  const strength = passwordStrength();

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    if (form.confirmPassword !== form.newPassword) {
      alert("Passwords Not Matching");
      return;
    }
    try {
      const res = await fetch("/api/admin/password", {
        method: "PATCH",
        body: JSON.stringify({
          password: form.newPassword
        })
      });
      if (res.ok) {
        alert("Password Changed Successfully");
        router.push("/admin");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong.")
    }
  }
  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-2xl">
        {/* Header */}

        <div className="rounded-3xl bg-linear-to-r from-blue-700 to-indigo-700 p-8 text-white shadow-xl">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-white/20 p-4">
              <ShieldCheck size={40} />
            </div>

            <div>
              <h1 className="text-3xl font-bold">Change Password</h1>

              <p className="mt-1 text-blue-100">
                Keep your account secure by updating your password.
              </p>
            </div>
          </div>
        </div>

        {/* Form */}

        <form className="mt-8 rounded-3xl bg-white p-8 shadow-xl space-y-6" onSubmit={handleSubmit}>
          {/* New */}

          <PasswordInput
            label="New Password"
            value={form.newPassword}
            show={showNew}
            onToggle={() => setShowNew(!showNew)}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setForm({
                ...form,
                newPassword: e.target.value,
              })
            }
          />

          {/* Strength */}

          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Password Strength</span>

              <span className="text-sm font-semibold">
                {strength === 25 && "Weak"}

                {strength === 50 && "Fair"}

                {strength === 75 && "Good"}

                {strength === 100 && "Strong"}
              </span>
            </div>

            <div className="h-3 rounded-full bg-slate-200">
              <div
                style={{ width: `${strength}%` }}
                className={`h-3 rounded-full transition-all duration-500 ${
                  strength <= 25
                    ? "bg-red-500"
                    : strength <= 50
                      ? "bg-yellow-500"
                      : strength <= 75
                        ? "bg-blue-500"
                        : "bg-green-500"
                }`}
              />
            </div>
          </div>

          {/* Confirm */}

          <PasswordInput
            label="Confirm Password"
            value={form.confirmPassword}
            show={showConfirm}
            onToggle={() => setShowConfirm(!showConfirm)}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setForm({
                ...form,
                confirmPassword: e.target.value,
              })
            }
          />

          {/* Buttons */}

          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              className="flex items-center gap-2 rounded-xl border border-slate-300 px-6 py-3 font-semibold hover:bg-slate-100"
              onClick={() => setForm({ confirmPassword: "", newPassword: "" })}
            >
              <RotateCcw size={18} />
              Reset
            </button>

            <button
              type="submit"
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-3 font-semibold text-white hover:bg-blue-700"
            >
              <Save size={18} />
              Update Password
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
function PasswordInput({ label, value, show, onToggle, onChange }: any) {
  return (
    <div>
      <label className="mb-2 block font-medium text-slate-700">{label}</label>

      <div className="relative">
        <Lock
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={label}
          className="w-full rounded-xl border border-slate-300 bg-slate-50 py-3 pl-12 pr-12 outline-none transition focus:border-blue-600"
          required
        />

        <button
          type="button"
          onClick={onToggle}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
        >
          {show ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>
    </div>
  );
}
