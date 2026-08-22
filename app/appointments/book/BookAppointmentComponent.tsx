"use client";

import { useState } from "react";
import {
  User,
  Mail,
  Phone,
  CalendarDays,
  Clock3,
  MapPin,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  Clock,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface FormData {
  fullname: string;
  email: string;
  mobile: string;
  time: string;
  id: string;
}

export default function BookAppointmentComponent({ address, date, start_time, end_time, id }: { address: string, date: string, start_time: string, end_time: string, id: string }) {
  const [formData, setFormData] = useState<FormData>({
    fullname: "",
    email: "",
    mobile: "",
    time: "",
    id: id
  });

  const router = useRouter();

  const [otp, setOtp] = useState("");

  const [otpSent, setOtpSent] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);

  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [booking, setBooking] = useState(false);

  const [otpMessage, setOtpMessage] = useState("");
  const [error, setError] = useState("");

  const [resendTimer, setResendTimer] = useState(0);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // If email is changed after verification,
    // email must be verified again.
    if (name === "email") {
      setEmailVerified(false);
      setOtpSent(false);
      setOtp("");
      setOtpMessage("");
    }
  };

  // =========================================================
  // SEND OTP
  // =========================================================

  const handleSendOtp = async () => {
    setError("");
    setOtpMessage("");

    if (!formData.email) {
      setError("Please enter your email address.");
      return;
    }

    if (!formData.fullname) {
      setError("Please enter your full name.");
      return;
    }

    try {
      setSendingOtp(true);

      const res = await fetch(
        "/api/appointments/send-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error || "Failed to send OTP."
        );
      }

      setOtpSent(true);
      setOtp("");

      setOtpMessage(
        "OTP has been sent to your email address."
      );

      // Start resend timer
      setResendTimer(60);

      const timer = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }

          return prev - 1;
        });
      }, 1000);

    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to send OTP."
      );
    } finally {
      setSendingOtp(false);
    }
  };

  // =========================================================
  // VERIFY OTP
  // =========================================================

  const handleVerifyOtp = async () => {
    setError("");
    setOtpMessage("");

    if (otp.length !== 6) {
      setError("Please enter the 6-digit OTP.");
      return;
    }

    try {
      setVerifyingOtp(true);

      const res = await fetch(
        "/api/appointments/verify-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email,
            otp,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error || "Invalid OTP."
        );
      }

      setEmailVerified(true);
      setOtpMessage(
        "Email address verified successfully."
      );

    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "OTP verification failed."
      );
    } finally {
      setVerifyingOtp(false);
    }
  };

  // =========================================================
  // BOOK APPOINTMENT
  // =========================================================

  const handleSubmit = async (
    e: React.SubmitEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setError("");

    if (!emailVerified) {
      setError(
        "Please verify your email address before booking."
      );
      return;
    }

    try {
      setBooking(true);

      const res = await fetch(
        "/api/appointments/book",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error ||
            "Failed to book appointment."
        );
      }

      alert("Appointment booked successfully!");

      router.replace("/");

      setFormData({
        fullname: "",
        email: "",
        mobile: "",
        time: "",
        id: id,
      });

      setOtp("");
      setOtpSent(false);
      setEmailVerified(false);

    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setBooking(false);
    }
  };

  return (
    <main className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-100 px-4 py-10 sm:px-6 lg:px-8">

      <div className="mx-auto max-w-5xl">

        {/* Header */}

        <div className="mb-8 text-center">

          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-blue-600 to-indigo-700 text-white shadow-lg shadow-blue-200">
            <CalendarDays size={30} />
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Book Your Appointment
          </h1>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
            Enter your details and verify your email
            address to book an appointment.
          </p>

        </div>

        {/* Main Card */}

        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60">

          {/* Header */}

          <div className="bg-linear-to-r from-blue-600 to-indigo-700 px-6 py-6 text-white sm:px-8">

            <div className="flex items-center gap-4">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15">
                <User size={24} />
              </div>

              <div>
                <h2 className="text-xl font-bold">
                  Your Details
                </h2>

                <p className="mt-1 text-sm text-blue-100">
                  Enter your personal information
                </p>
              </div>

            </div>

          </div>

          <form
            onSubmit={handleSubmit}
            className="p-6 sm:p-8 lg:p-10"
          >

            {/* Error */}

            {error && (
              <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {error}
              </div>
            )}

            {/* Success */}

            {otpMessage && (
              <div className="mb-6 flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                <CheckCircle2 size={18} />
                {otpMessage}
              </div>
            )}

            <div className="grid gap-6 md:grid-cols-2">

              {/* Full Name */}

              <div className="md:col-span-2">

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Full Name
                  <span className="ml-1 text-red-500">
                    *
                  </span>
                </label>

                <div className="relative">

                  <User
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="text"
                    name="fullname"
                    value={formData.fullname}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                    className="w-full rounded-2xl border border-slate-300 bg-slate-50 py-4 pl-12 pr-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  />

                </div>

              </div>

              {/* Email */}

              <div className="md:col-span-2">

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Email Address
                  <span className="ml-1 text-red-500">
                    *
                  </span>
                </label>

                <div className="flex flex-col gap-3 sm:flex-row">

                  <div className="relative flex-1">

                    <Mail
                      size={19}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={emailVerified}
                      placeholder="you@example.com"
                      required
                      className={`w-full rounded-2xl border py-4 pl-12 pr-4 text-sm outline-none transition ${
                        emailVerified
                          ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                          : "border-slate-300 bg-slate-50 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                      }`}
                    />

                    {emailVerified && (
                      <CheckCircle2
                        size={20}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-600"
                      />
                    )}

                  </div>

                  {!emailVerified && (
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      disabled={
                        sendingOtp ||
                        resendTimer > 0
                      }
                      className="flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-6 py-4 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {sendingOtp ? (
                        <>
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          Sending...
                        </>
                      ) : resendTimer > 0 ? (
                        <>
                          <RefreshCw size={17} />
                          Resend in {resendTimer}s
                        </>
                      ) : otpSent ? (
                        <>
                          <RefreshCw size={17} />
                          Resend OTP
                        </>
                      ) : (
                        <>
                          Send OTP
                          <ArrowRight size={17} />
                        </>
                      )}
                    </button>
                  )}

                </div>

                {emailVerified && (
                  <p className="mt-2 flex items-center gap-1 text-xs font-medium text-emerald-600">
                    <CheckCircle2 size={14} />
                    Email verified
                  </p>
                )}

              </div>

              {/* OTP */}

              {otpSent && !emailVerified && (
                <div className="md:col-span-2">

                  <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5">

                    <div className="flex items-start gap-3">

                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white">
                        <Mail size={19} />
                      </div>

                      <div className="flex-1">

                        <h3 className="font-semibold text-slate-900">
                          Verify Your Email
                        </h3>

                        <p className="mt-1 text-sm text-slate-600">
                          Enter the 6-digit OTP sent to{" "}
                          <strong>
                            {formData.email}
                          </strong>
                        </p>

                      </div>

                    </div>

                    <div className="mt-4 flex flex-col gap-3 sm:flex-row">

                      <input
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        value={otp}
                        onChange={(e) => {
                          const value =
                            e.target.value.replace(
                              /\D/g,
                              ""
                            );

                          setOtp(value);
                        }}
                        placeholder="Enter 6-digit OTP"
                        className="flex-1 rounded-2xl border border-slate-300 bg-white px-4 py-4 text-center text-lg font-bold tracking-[0.5em] outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                      />

                      <button
                        type="button"
                        onClick={handleVerifyOtp}
                        disabled={
                          verifyingOtp ||
                          otp.length !== 6
                        }
                        className="rounded-2xl bg-emerald-600 px-7 py-4 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {verifyingOtp
                          ? "Verifying..."
                          : "Verify OTP"}
                      </button>

                    </div>

                    <p className="mt-3 text-xs text-slate-500">
                      OTP is valid for 10 minutes.
                    </p>

                  </div>

                </div>
              )}

              {/* Mobile */}

              <div className="md:col-span-2">

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Mobile Number
                  <span className="ml-1 text-red-500">
                    *
                  </span>
                </label>

                <div className="relative">

                  <Phone
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    placeholder="Enter 10 digit mobile number"
                    maxLength={10}
                    pattern="[0-9]{10}"
                    required
                    className="w-full rounded-2xl border border-slate-300 bg-slate-50 py-4 pl-12 pr-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  />

                </div>

              </div>
              {/* Time */}

              <div className="md:col-span-2">

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Select Preffered Time
                  <span className="ml-1 text-red-500">
                    *
                  </span>
                </label>

                <div className="relative">

                  <Clock
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    min={start_time}
                    max={end_time}
                    required
                    className="w-full rounded-2xl border border-slate-300 bg-slate-50 py-4 pl-12 pr-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  />

                </div>

              </div>

            </div>

            {/* Appointment Info */}

            <div className="mt-8 rounded-2xl border border-blue-100 bg-blue-50 p-5">

              <div className="flex items-start gap-3">

                <CalendarDays
                  size={20}
                  className="mt-1 text-blue-600"
                />

                <div>

                  <h3 className="font-semibold text-slate-900">
                    Appointment Information
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    Your appointment date, time and location
                    will be shown here.
                  </p>

                </div>

              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">

                <div className="rounded-xl bg-white p-4">
                  <CalendarDays
                    size={18}
                    className="text-blue-600"
                  />

                  <p className="mt-2 text-xs text-slate-400">
                    Date
                  </p>

                  <p className="mt-1 text-sm font-semibold">
                    {date}
                  </p>
                </div>

                <div className="rounded-xl bg-white p-4">
                  <Clock3
                    size={18}
                    className="text-indigo-600"
                  />

                  <p className="mt-2 text-xs text-slate-400">
                    Availability
                  </p>

                  <p className="mt-1 text-sm font-semibold">
                    {start_time} to {end_time}
                  </p>
                </div>

                <div className="rounded-xl bg-white p-4">
                  <MapPin
                    size={18}
                    className="text-emerald-600"
                  />

                  <p className="mt-2 text-xs text-slate-400">
                    Location
                  </p>

                  <p className="mt-1 text-sm font-semibold">
                    {address}
                  </p>
                </div>

              </div>

            </div>

            {/* Security */}

            <div className="mt-6 flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">

              <ShieldCheck
                size={20}
                className="shrink-0 text-emerald-600"
              />

              <p className="text-xs leading-5 text-slate-500">
                Your email will be verified before your
                appointment request is submitted.
              </p>

            </div>

            {/* Submit */}

            <button
              type="submit"
              disabled={
                booking || !emailVerified
              }
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-blue-600 to-indigo-700 px-6 py-4 text-sm font-bold text-white shadow-lg shadow-blue-200 transition hover:from-blue-700 hover:to-indigo-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {booking ? (
                <>
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Booking Appointment...
                </>
              ) : (
                <>
                  Book Appointment
                  <ArrowRight size={19} />
                </>
              )}
            </button>

            {!emailVerified && (
              <p className="mt-3 text-center text-xs text-slate-400">
                Verify your email to enable appointment booking.
              </p>
            )}

          </form>

        </div>

      </div>

    </main>
  );
}