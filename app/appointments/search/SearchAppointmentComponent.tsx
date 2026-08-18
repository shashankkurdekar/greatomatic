"use client";

import { useLayoutEffect, useMemo, useState } from "react";
import Select, { SingleValue } from "react-select";
import {
  Search,
  MapPin,
  UserRound,
  RotateCcw,
  CalendarDays,
  Clock3,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface SelectOption {
  value: string;
  label: string;
}

interface Appointments {
  fullname: string;
  email: string;
  mobile: string;
  state: string;
  district: string;
  taluk: string;
  date: string;
  start_time: string;
  end_time: string;
  landmark: string;
}

interface SearchableSelectProps {
  label: string;
  placeholder: string;
  options: SelectOption[];
  value: string;
  icon: React.ReactNode;
  onChange: (option: SingleValue<SelectOption>) => void;
}

export default function SearchAppointmentComponent() {
  const [admins, setAdmins] = useState<Appointments[]>([]);

  useLayoutEffect(() => {
    async function fetchAdmins() {
      try {
        const res = await fetch("/api/appointments/fetchAdmins");
        if (res.ok) {
          const data = await res.json();
          setAdmins(data);
        }
      } catch (error) {
        console.error(error);
        alert("Something went wrong");
      }
    }
    fetchAdmins();
  }, []);

  const [selectedAdmin, setSelectedAdmin] = useState("");

  const [selectedLocation, setSelectedLocation] = useState("");

  const adminOptions: SelectOption[] = useMemo(() => {
    const uniqueAdmins = new Map<string, SelectOption>();

    admins.forEach((admin) => {
      const email = admin.email.trim().toLowerCase();

      if (!email) return;

      if (!uniqueAdmins.has(email)) {
        uniqueAdmins.set(email, {
          value: admin.email,
          label: admin.fullname,
        });
      }
    });

    return Array.from(uniqueAdmins.values());
  }, [admins]);

  /*
   * Create location options from admin addresses.
   *
   * You can replace this with your location API
   * if you have State / District / Taluk data.
   */
 const locationOptions: SelectOption[] = useMemo(() => {
  const uniqueLocations = new Map<string, SelectOption>();

  admins
    .filter((admin) => {
      // If admin is selected,
      // show only locations belonging to that admin
      if (!selectedAdmin) {
        return true;
      }

      return admin.email === selectedAdmin;
    })
    .forEach((admin) => {
      const locationValue = [
        admin.state,
        admin.district,
        admin.taluk,
        admin.landmark,
      ]
        .filter(Boolean)
        .join("|");

      const locationLabel = [
        admin.state,
        admin.district,
        admin.taluk,
        admin.landmark,
      ]
        .filter(Boolean)
        .join(" → ");

      if (!locationValue) return;

      if (!uniqueLocations.has(locationValue)) {
        uniqueLocations.set(locationValue, {
          value: admin.landmark,
          label: locationLabel,
        });
      }
    });

  return Array.from(uniqueLocations.values());
}, [admins, selectedAdmin]);

  /*
   * Search logic
   */
  const filteredAdmins = useMemo(() => {
    return admins.filter((admin) => {
      const matchesAdmin =
        !selectedAdmin || String(admin.email) === selectedAdmin;

      const matchesLocation =
        !selectedLocation || admin.landmark === selectedLocation;

      return matchesAdmin && matchesLocation;
    });
  }, [admins, selectedAdmin, selectedLocation]);

  const handleReset = () => {
    setSelectedAdmin("");
    setSelectedLocation("");
  };

  const router = useRouter();

  async function handleBook(fullname: string, email: string, mobile: string, state: string, district: string, taluk: string, landmark: string, date: string, start_time: string, end_time: string) {
    try {
      const res = await fetch("/api/appointments/genarateID", {
        method: "POST",
        body: JSON.stringify({ fullname, email, mobile, state, district, taluk, landmark, date, start_time, end_time })
      });
      if (res.ok) {
        const data = await res.json();
        router.push(`/appointments/book?id=${data}`);
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong")
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}

        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-200">
            <Search size={26} />
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Search Admins
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Search administrators by name or location
          </p>
        </div>

        {/* Search Card */}

        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="grid gap-5 lg:grid-cols-[1fr_1fr_auto]">
            {/* Admin Search */}

            <SearchableSelect
              label="Search Admin"
              placeholder="Select available admin..."
              options={adminOptions}
              value={selectedAdmin}
              icon={<UserRound size={18} />}
              onChange={(option) => {
                setSelectedAdmin(option?.value ?? "");
              }}
            />

            {/* Location Search */}

            <SearchableSelect
              label="Search By Location"
              placeholder="Search location..."
              options={locationOptions}
              value={selectedLocation}
              icon={<MapPin size={18} />}
              onChange={(option) => {
                setSelectedLocation(option?.value ?? "");
              }}
            />

            {/* Reset */}

            <div className="flex items-end">
              <button
                type="button"
                onClick={handleReset}
                className="flex min-h-13 w-full items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-rose-500 to-red-600 px-7 font-semibold text-white shadow-lg shadow-red-100 transition hover:from-rose-600 hover:to-red-700 lg:w-auto"
              >
                <RotateCcw size={18} />
                Reset
              </button>
            </div>
          </div>

          {/* Result Count */}

          <div className="mt-5 border-t border-slate-100 pt-4">
            <p className="text-sm text-slate-500">
              Showing{" "}
              <span className="font-bold text-slate-900">
                {filteredAdmins.length}
              </span>{" "}
              of{" "}
              <span className="font-bold text-slate-900">{admins.length}</span>{" "}
              admins
            </p>
          </div>
        </section>

        {/* Results */}

        <section className="mt-6">
          {filteredAdmins.length > 0 ? (
            <div className="grid gap-5 lg:grid-cols-2">
              {filteredAdmins.map((admin, index) => (
                <div
                  key={`${admin.email}-${index}`}
                  className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                >
                  {/* Admin Header */}
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-blue-500 to-indigo-600 text-lg font-bold text-white">
                      {admin.fullname.charAt(0).toUpperCase()}
                    </div>

                    {/* Admin Details */}
                    <div className="min-w-0 flex-1">
                      <h2 className="font-bold text-slate-900">
                        {admin.fullname}
                      </h2>

                      <p className="mt-1 text-sm text-slate-500">
                        {admin.email}
                      </p>
                    </div>

                    {/* Status */}
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
                      Active
                    </span>
                  </div>

                  {/* Date & Time */}
                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    {/* Date */}
                    <div className="flex items-center gap-3 rounded-2xl bg-blue-50 p-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white">
                        <CalendarDays size={19} />
                      </div>

                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-blue-500">
                          Appointment Date
                        </p>

                        <p className="mt-1 text-sm font-bold text-slate-900">
                          {formatDate(admin.date)}
                        </p>
                      </div>
                    </div>

                    {/* Time */}
                    <div className="flex items-center gap-3 rounded-2xl bg-violet-50 p-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-600 text-white">
                        <Clock3 size={19} />
                      </div>

                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-violet-500">
                          Appointment Time
                        </p>

                        <p className="mt-1 text-sm font-bold text-slate-900">
                          {formatTime(admin.start_time)} -{" "}
                          {formatTime(admin.end_time)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="mt-4 flex items-start gap-3 rounded-2xl bg-slate-50 p-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white">
                      <MapPin size={19} />
                    </div>

                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                        Location
                      </p>

                      <p className="mt-1 text-sm leading-6 text-slate-700">
                        {[
                          admin.landmark,
                          admin.taluk,
                          admin.district,
                          admin.state,
                        ]
                          .filter(Boolean)
                          .join(", ")}
                      </p>
                    </div>
                  </div>

                  {/* Mobile + Action */}
                  <div className="mt-5 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-400">Mobile</p>

                      <p className="mt-1 text-sm font-semibold text-slate-700">
                        {admin.mobile}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleBook(admin.fullname, admin.email, admin.mobile, admin.state, admin.district, admin.taluk, admin.landmark, admin.date, admin.start_time, admin.end_time)}
                      className="rounded-xl bg-blue-50 px-5 py-2.5 text-sm font-semibold text-blue-600 transition hover:bg-blue-600 hover:text-white"
                    >
                      Book Appoinment
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Empty State */

            <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                <Search size={28} />
              </div>

              <h3 className="mt-5 text-lg font-bold text-slate-900">
                No admins found
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Try selecting a different admin or location.
              </p>

              <button
                type="button"
                onClick={handleReset}
                className="mt-5 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Clear Search
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

/* =========================================================
   Reusable Searchable Select
========================================================= */

function SearchableSelect({
  label,
  placeholder,
  options,
  value,
  icon,
  onChange,
}: SearchableSelectProps) {
  const selectedOption =
    options.find((option) => option.value === value) ?? null;

  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </label>

      <div className="relative">
        {/* Icon */}

        <div className="pointer-events-none absolute left-4 top-1/2 z-20 -translate-y-1/2 text-slate-400">
          {icon}
        </div>

        <Select<SelectOption>
          instanceId={label}
          options={options}
          value={selectedOption}
          onChange={onChange}
          isSearchable
          isClearable
          placeholder={placeholder}
          noOptionsMessage={() => "No results found"}
          className="text-sm"
          classNamePrefix="admin-search"
          styles={{
            control: (base, state) => ({
              ...base,
              minHeight: "52px",
              borderRadius: "16px",
              paddingLeft: "30px",
              backgroundColor: "#f8fafc",
              borderColor: state.isFocused ? "#3b82f6" : "#cbd5e1",
              boxShadow: state.isFocused
                ? "0 0 0 4px rgba(59,130,246,.1)"
                : "none",
              transition: "all 0.2s",
            }),

            placeholder: (base) => ({
              ...base,
              color: "#94a3b8",
            }),

            singleValue: (base) => ({
              ...base,
              color: "#0f172a",
            }),

            input: (base) => ({
              ...base,
              color: "#0f172a",
            }),

            indicatorSeparator: () => ({
              display: "none",
            }),

            dropdownIndicator: (base) => ({
              ...base,
              color: "#64748b",
            }),

            clearIndicator: (base) => ({
              ...base,
              color: "#64748b",
            }),

            menu: (base) => ({
              ...base,
              zIndex: 9999,
              borderRadius: "16px",
              overflow: "hidden",
              boxShadow: "0 20px 40px rgba(15,23,42,.15)",
            }),

            menuList: (base) => ({
              ...base,
              padding: "6px",
              maxHeight: "250px",
            }),

            option: (base, state) => ({
              ...base,
              borderRadius: "10px",
              padding: "10px 12px",
              cursor: "pointer",
              backgroundColor: state.isSelected
                ? "#2563eb"
                : state.isFocused
                  ? "#eff6ff"
                  : "#ffffff",
              color: state.isSelected ? "#ffffff" : "#0f172a",
            }),
          }}
        />
      </div>
    </div>
  );
}

function formatDate(date: string) {
  if (!date) return "N/A";

  const [year, month, day] = date
    .split("T")[0]
    .split("-")
    .map(Number);

  if (!year || !month || !day) {
    return date;
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(year, month - 1, day));
}

function formatTime(time: string) {
  if (!time) return "N/A";

  const [hours, minutes] = time
    .split(":")
    .map(Number);

  if (
    Number.isNaN(hours) ||
    Number.isNaN(minutes)
  ) {
    return time;
  }

  const date = new Date();
  date.setHours(hours, minutes, 0, 0);

  return new Intl.DateTimeFormat("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}