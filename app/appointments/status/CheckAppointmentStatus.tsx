"use client";

import { useState } from "react";
import { SearchCheck } from "lucide-react";
import AppointmentTable from "./AppointmentTable";

export default function CheckAppointmentStatus() {
  const [appointmentId, setAppointmentId] = useState("");
  const [loading, setLoading] = useState(false);
  const [appointments, setAppointments] = useState([]);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!appointmentId.trim()) {
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/appointments/status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          appointmentId,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        alert(data.error)
      }
      if (response.ok) {
        setAppointments(data.appointment);
      }

    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: number) => {
    console.log("Delete:", id);
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto w-full max-w-2xl">
        {/* Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100">
              <SearchCheck size={28} className="text-emerald-600" />
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Check Your Appointment Status
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Enter the appointment ID received in your email.
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="space-y-5"
            autoComplete="off"
          >
            {/* Appointment ID */}
            <div>
              <label
                htmlFor="appointmentId"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Appointment ID
              </label>

              <input
                id="appointmentId"
                name="appointmentId"
                type="text"
                value={appointmentId}
                onChange={(e) => setAppointmentId(e.target.value)}
                placeholder="Enter Appointment ID received in your mail"
                required
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !appointmentId.trim()}
              className="flex w-full items-center justify-center rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-200 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {loading ? "Checking..." : "Check Status"}
            </button>
          </form>

          {/* Information */}
          <div className="mt-6 rounded-xl bg-slate-50 p-4">
            <p className="text-center text-xs leading-5 text-slate-500">
              Your appointment ID was sent to your registered email address
              after successfully booking the appointment.
            </p>
          </div>
        </div>
      </div>
      {appointments.length > 0 ? (
        <AppointmentTable appointments={appointments} onDelete={handleDelete} />
      ) : null}
    </div>
  );
}