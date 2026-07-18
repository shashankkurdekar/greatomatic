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

export default function ForgotPasswordComponent() {
  const router = useRouter();
  const [step, setStep] = useState(1);

  const [loading, setLoading] = useState(false);

  const [values, setValues] = useState({
    email: "",
    otp: "",
    password: "",
    confirmPassword: "",
  });

  const verifyEmail = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/forgot-password/verify-email", {
        method: "POST",
        body: JSON.stringify({
          email: values.email,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.message);
        return;
      }

      alert("OTP sent successfully.");

      setStep(2);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  const verifyOTP = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/forgot-password/verify-otp", {
        method: "POST",
        body: JSON.stringify({
          email: values.email,
          clientOTP: values.otp,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      alert("OTP Verified");

      setStep(3);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async () => {
    if (values.password !== values.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/forgot-password/reset-password", {
        method: "POST",
        body: JSON.stringify({
          email: values.email,
          password: values.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      alert("Password changed successfully.");

      router.push("/login/admin");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  async function handleForgotPassword(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      const res = await fetch("/api/forgot-password", {
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
              Secure Reset Password Portal
            </div>

            <h1 className="mt-8 text-5xl font-bold leading-tight">
              Reset Password Portal
            </h1>

            <p className="mt-6 text-blue-100 text-lg leading-8">
              Reset your password securely and regain access to your account. Our platform ensures that your credentials are protected with the highest level of security.
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

            <h2 className="text-4xl font-bold text-slate-900">
              Reset Password
            </h2>

            <p className="mt-2 text-slate-500">
              Enter your email address to reset your password.
            </p>

            <form className="mt-10 space-y-6" onSubmit={handleForgotPassword}>
              {/* Email */}
              <div>
                <label>Email</label>
                
                <input
                  type="email"
                  value={values.email}
                  onChange={(e) =>
                    setValues({
                      ...values,
                      email: e.target.value,
                    })
                  }
                  disabled={step > 1}
                  className="w-full rounded-2xl border border-slate-300 py-4 pl-12 pr-14 outline-none focus:border-blue-600"
                  placeholder="Enter your email"
                />
              </div>

              {/* OTP */}

              {step >= 2 && (
                <div>
                  <label>OTP</label>

                  <input
                    type="text"
                    placeholder="Enter OTP"
                    value={values.otp}
                    onChange={(e) =>
                      setValues({
                        ...values,
                        otp: e.target.value,
                      })
                    }
                    disabled={step > 2}
                    className="w-full rounded-2xl border border-slate-300 py-4 pl-12 pr-14 outline-none focus:border-blue-600"
                  />
                </div>
              )}

              {/* Password */}
              {step === 3 && (
                <>
                  <div>
                    <label>New Password</label>

                    <input
                      type="password"
                      value={values.password}
                      onChange={(e) =>
                        setValues({
                          ...values,
                          password: e.target.value,
                        })
                      }
                      className="w-full rounded-2xl border border-slate-300 py-4 pl-12 pr-14 outline-none focus:border-blue-600"
                      placeholder="Enter new password"
                    />
                  </div>

                  <div>
                    <label>Confirm Password</label>

                    <input
                      type="password"
                      value={values.confirmPassword}
                      onChange={(e) =>
                        setValues({
                          ...values,
                          confirmPassword: e.target.value,
                        })
                      }
                      className="w-full rounded-2xl border border-slate-300 py-4 pl-12 pr-14 outline-none focus:border-blue-600"
                      placeholder="Confirm new password"
                    />
                  </div>
                </>
              )}             

              {/* Login Button */}
              <button
                type="button"
                onClick={() => {
                  if (step === 1) verifyEmail();
                  if (step === 2) verifyOTP();
                  if (step === 3) resetPassword();
                }}
                disabled={loading}
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
                {loading
                  ? "Please wait..."
                  : step === 1
                    ? "Verify Email"
                    : step === 2
                      ? "Verify OTP"
                      : "Reset Password"}
              </button>
            </form>

            {/* Bottom Links */}
            <div className="mt-10 grid grid-cols-1 gap-4">

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
