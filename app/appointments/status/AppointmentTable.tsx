"use client";

import { Eye, Pencil, Trash2 } from "lucide-react";

type Appointment = {
  id: number;
  VisitorName: string;
  AppointmentID: string;
  Mobile: string;
  Email: string;
  AdminEmail: string;
  Date: string;
  Time: string;
  Address: string;
  Status: string;
};

interface AppointmentTableProps {
  appointments: Appointment[];
  onView?: (appointment: Appointment) => void;
  onEdit?: (appointment: Appointment) => void;
  onDelete?: (id: number) => void;
}

export default function AppointmentTable({
  appointments,
  onDelete,
}: AppointmentTableProps) {
  return (
    <div className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm mt-5">

      {/* Header */}
      <div className="border-b border-slate-200 px-6 py-5">
        <h2 className="text-xl font-bold text-slate-900">
          Appointments
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Manage visitor appointments
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-350 text-left text-sm">

          <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-600">
            <tr>
              <th className="px-5 py-4">#</th>
              <th className="px-5 py-4">Visitor</th>
              <th className="px-5 py-4">Appointment ID</th>
              <th className="px-5 py-4">Mobile</th>
              <th className="px-5 py-4">Email</th>
              <th className="px-5 py-4">Admin</th>
              <th className="px-5 py-4">Date</th>
              <th className="px-5 py-4">Time</th>
              <th className="px-5 py-4">Location</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4 text-center">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">

            {appointments.length === 0 ? (
              <tr>
                <td
                  colSpan={11}
                  className="px-5 py-12 text-center text-slate-500"
                >
                  No appointments found.
                </td>
              </tr>
            ) : (
              appointments.map((appointment, index) => (

                <tr
                  key={appointment.id}
                  className="transition hover:bg-slate-50"
                >

                  {/* Number */}
                  <td className="px-5 py-4 font-medium text-slate-500">
                    {index + 1}
                  </td>

                  {/* Visitor */}
                  <td className="px-5 py-4">
                    <div className="font-semibold text-slate-900">
                      {appointment.VisitorName}
                    </div>
                  </td>

                  {/* Appointment ID */}
                  <td className="px-5 py-4">
                    <span className="rounded-lg bg-slate-100 px-3 py-1.5 font-mono text-xs text-slate-700">
                      {appointment.AppointmentID}
                    </span>
                  </td>

                  {/* Mobile */}
                  <td className="whitespace-nowrap px-5 py-4 text-slate-700">
                    {appointment.Mobile}
                  </td>

                  {/* Email */}
                  <td className="px-5 py-4 text-slate-700">
                    {appointment.Email}
                  </td>

                  {/* Admin */}
                  <td className="px-5 py-4 text-slate-700">
                    {appointment.AdminEmail}
                  </td>

                  {/* Date */}
                  <td className="whitespace-nowrap px-5 py-4">
                    <span className="font-medium text-slate-800">
                      {appointment.Date}
                    </span>
                  </td>

                  {/* Time */}
                  <td className="whitespace-nowrap px-5 py-4">
                    <span className="rounded-lg bg-blue-50 px-3 py-1.5 text-blue-700">
                      {appointment.Time}
                    </span>
                  </td>

                  {/* Location */}
                  <td className="max-w-xs px-5 py-4">
                    <p
                      className="truncate text-slate-700"
                      title={appointment.Address}
                    >
                      {appointment.Address}
                    </p>
                  </td>

                  {/* Status */}
                  <td className="px-5 py-4">
                    <StatusBadge status={appointment.Status} />
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-center gap-2">

                      

                      {/* Delete */}
                      <button
                        type="button"
                        onClick={() => onDelete?.(appointment.id)}
                        title="Delete appointment"
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 size={17} />
                      </button>

                    </div>
                  </td>

                </tr>
              ))
            )}

          </tbody>
        </table>
      </div>
    </div>
  );
}


/* --------------------------------
   Status Badge
-------------------------------- */

function StatusBadge({ status }: { status: string }) {
  const normalizedStatus = status.toLowerCase();

  if (normalizedStatus === "approved") {
    return (
      <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
        Approved
      </span>
    );
  }

  if (normalizedStatus === "rejected") {
    return (
      <span className="inline-flex rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
        Rejected
      </span>
    );
  }

  return (
    <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
      Pending
    </span>
  );
}