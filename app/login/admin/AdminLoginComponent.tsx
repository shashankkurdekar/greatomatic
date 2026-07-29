"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowRight,
  ShieldCheck,
  Home,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminLoginComponent() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [values, setValues] = useState({
    email: "",
    password: "",
  });

  async function handleLogin(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      const res = await fetch("/api/login/admin", {
        method: "POST",
        body: JSON.stringify(values),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.role === "superadmin") {
          router.push("/superadmin");
        } else if (data.role === "admin") {
          router.push("/admin");
        } else {
          alert("Invalid credentials. Please contact support.");
        }
      }
      else {
        alert("Invalid credentials.");
      }
    } catch (error) {
      console.error(
        process.env.NODE_ENV === "development"
          ? error
          : "An error occurred during login.",
      );
    }
  }

  return (
    <section className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center px-4 py-10">
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>

      <div className="relative w-full max-w-6xl overflow-hidden rounded-4xl bg-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl">
        <div className="grid lg:grid-cols-2">
          {/* Left Side */}
          <div className="hidden lg:flex flex-col justify-center bg-linear-to-br from-blue-700 to-indigo-900 p-16 text-white relative overflow-hidden">
            <div className="absolute -top-32 -right-32 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 -left-24 w-72 h-72 bg-cyan-400/20 rounded-full blur-3xl"></div>

            <Image
              src="/LOGO.png"
              alt="Greatomatic"
              width={180}
              height={60}
              className="mb-10 bg-white rounded-lg p-2"
            />

            <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full w-fit">
              <ShieldCheck size={18} />
              Secure Administration Portal
            </div>

            <h1 className="mt-8 text-5xl font-bold leading-tight">
              Welcome Back,
              <br />
              Administrator
            </h1>

            <p className="mt-6 text-blue-100 text-lg leading-8">
              Manage branches, vacancies, appointments, users and company
              information securely from one centralized dashboard.
            </p>

            <div className="mt-12 flex gap-6">
              <div>
                <h3 className="text-3xl font-bold">100%</h3>
                <p className="text-blue-200">Secure Login</p>
              </div>

              <div>
                <h3 className="text-3xl font-bold">24/7</h3>
                <p className="text-blue-200">Availability</p>
              </div>
            </div>
          </div>

          {/* Right Side */}
          <div className="bg-white p-8 md:p-12 lg:p-16">
            <div className="flex justify-between items-center mb-10">
              <Image
                src="/LOGO.png"
                alt="Logo"
                width={150}
                height={50}
                className="lg:hidden"
              />

              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-xl bg-blue-50 px-4 py-2 text-blue-600 hover:bg-blue-100 transition"
              >
                <Home size={18} />
                Home
              </Link>
            </div>

            <h2 className="text-4xl font-bold text-slate-900">Admin Login</h2>

            <p className="mt-2 text-slate-500">
              Sign in to access your dashboard.
            </p>

            <form className="mt-10 space-y-6" onSubmit={handleLogin}>
              {/* Email */}
              <div>
                <label className="mb-2 block font-medium text-slate-700">
                  Email Address
                </label>

                <div className="relative">
                  <Mail
                    size={20}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="email"
                    placeholder="admin@example.com"
                    className="w-full rounded-2xl border border-slate-300 py-4 pl-12 pr-4 outline-none focus:border-blue-600"
                    value={values.email}
                    onChange={(e) =>
                      setValues({ ...values, email: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="mb-2 block font-medium text-slate-700">
                  Password
                </label>

                <div className="relative">
                  <Lock
                    size={20}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="w-full rounded-2xl border border-slate-300 py-4 pl-12 pr-14 outline-none focus:border-blue-600"
                    value={values.password}
                    onChange={(e) =>
                      setValues({ ...values, password: e.target.value })
                    }
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Forgot Password */}
              <div className="flex justify-end">
                <Link
                  href="/forgot-password"
                  className="text-blue-600 hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>

              {/* Login Button */}
              <button
                className="
                  w-full
                  rounded-2xl
                  bg-linear-to-r
                  from-blue-600
                  to-indigo-700
                  py-4
                  text-lg
                  font-semibold
                  text-white
                  transition
                  hover:scale-[1.02]
                "
              >
                <span className="flex justify-center items-center gap-2">
                  Login
                  <ArrowRight size={20} />
                </span>
              </button>
            </form>

            {/* Bottom Links */}
            <div className="mt-10 grid grid-cols-2 gap-4">
              <Link
                href="/branch-login"
                className="rounded-2xl border border-slate-300 py-4 text-center hover:bg-slate-100 transition"
              >
                Branch Login
              </Link>

              <Link
                href="/"
                className="rounded-2xl border border-slate-300 py-4 text-center hover:bg-slate-100 transition"
              >
                Back to Website
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
