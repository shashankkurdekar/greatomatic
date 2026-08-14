"use client";

import { SubmitEvent, useLayoutEffect, useState } from "react";
import Select, { SingleValue } from "react-select";
import {
  CalendarDays,
  Clock3,
  MapPin,
  Map,
  Building2,
  Send,
  RotateCcw,
} from "lucide-react";
import { IStates } from "@/types/states.interface";
import { IDistricts } from "@/types/districts.interface";
import { ITaluks } from "@/types/taluks.interface";
import { useRouter } from "next/navigation";

export default function AddEventComponent() {
  const [formData, setFormData] = useState({
    state: "",
    district: "",
    taluk: "",
    landmark: "",
    date: "",
    startTime: "",
    endTime: "",
  });

  const [states, setStates] = useState<IStates[]>([]);
  const [districts, setDistricts] = useState<IDistricts[]>([]);
  const [taluks, setTaluks] = useState<ITaluks[]>([]);

  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [loadingTaluks, setLoadingTaluks] = useState(false);

  useLayoutEffect(() => {
    async function fetchStates() {
      try {
        setLoadingStates(true);

        const res = await fetch("/api/state");

        if (!res.ok) {
          throw new Error("Failed to fetch states");
        }

        const data = await res.json();

        setStates(data);
      } catch (error) {
        console.error(error);
        alert("Something went wrong while fetching states.");
      } finally {
        setLoadingStates(false);
      }
    }

    fetchStates();
  }, []);
  async function fetchDistricts(state_id: string) {
    try {
      setLoadingDistricts(true);

      const res = await fetch("/api/admin/branch/fetchDistricts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          state_id,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to fetch districts");
      }

      const data = await res.json();

      setDistricts(data);
    } catch (error) {
      console.error(error);
      alert("Server Error!");
    } finally {
      setLoadingDistricts(false);
    }
  }
  async function fetchTaluks(district_id: string) {
    try {
      setLoadingTaluks(true);

      const res = await fetch("/api/admin/branch/fetchTaluks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          district_id,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to fetch taluks");
      }

      const data = await res.json();

      setTaluks(data);
    } catch (error) {
      console.error(error);
      alert("Server Error!");
    } finally {
      setLoadingTaluks(false);
    }
  }

  const stateOptions = states.map((state) => ({
    value: `${state.state_name}/${state.state_id}`,
    label: state.state_name,
  }));

  const districtOptions = districts.map((district) => ({
    value: `${district.district_name}/${district.district_id}`,
    label: district.district_name,
  }));

  const talukOptions = taluks.map((taluk) => ({
    value: `${taluk.taluk_name}/${taluk.taluk_id}`,
    label: taluk.taluk_name,
  }));

  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData.startTime >= formData.endTime) {
      alert("End time must be greater than start time.");
      return;
    }

    try {
      setLoading(true);
      
      const res = await fetch("/api/admin/event/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create event");
      }

      alert("Event created successfully!");

      router.push("/admin");
      
      setFormData({
        state: "",
        district: "",
        taluk: "",
        landmark: "",
        date: "",
        startTime: "",
        endTime: "",
      });
    } catch (error) {
      console.error(error);
      alert("Something went wrong while creating the event.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      state: "",
      district: "",
      taluk: "",
      landmark: "",
      date: "",
      startTime: "",
      endTime: "",
    });
  };

  const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);

const minDate = tomorrow.toISOString().split("T")[0];

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Header */}

        <div className="mb-8 overflow-hidden rounded-3xl bg-linear-to-r from-blue-700 via-indigo-700 to-violet-700 p-8 text-white shadow-xl">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="rounded-2xl bg-white/15 p-4 backdrop-blur">
                <CalendarDays size={32} />
              </div>

              <div>
                <h1 className="text-3xl font-bold tracking-tight">Add Event</h1>

                <p className="mt-1 text-sm text-blue-100 sm:text-base">
                  Create and schedule a new event for your selected location.
                </p>
              </div>
            </div>

            <div className="hidden rounded-2xl bg-white/10 px-5 py-3 text-sm backdrop-blur sm:block">
              Event Management
            </div>
          </div>
        </div>

        {/* Form */}

        <form onSubmit={handleSubmit}>
          {/* Location Section */}

          <section className="rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 p-6">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-blue-100 p-3 text-blue-600">
                  <MapPin size={22} />
                </div>

                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Event Location
                  </h2>

                  <p className="text-sm text-slate-500">
                    Select where the event will take place.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="grid gap-6 md:grid-cols-2">
                {/* State */}

                <SearchableSelect
                  label="State"
                  name="state"
                  value={formData.state}
                  options={stateOptions}
                  placeholder="Search state..."
                  icon={<Map size={18} />}
                  isLoading={loadingStates}
                  required
                  onChange={(option) => {
                    const value = option?.value ?? "";

                    setFormData((prev) => ({
                      ...prev,
                      state: value,
                      district: "",
                      taluk: "",
                    }));

                    setDistricts([]);
                    setTaluks([]);

                    if (value) {
                      fetchDistricts(value.split("/")[1]);
                    }
                  }}
                />
                {/* District */}

                <SearchableSelect
                  label="District"
                  name="district"
                  value={formData.district}
                  options={districtOptions}
                  placeholder="Search district..."
                  icon={<Building2 size={18} />}
                  isDisabled={!formData.state}
                  isLoading={loadingDistricts}
                  required
                  onChange={(option) => {
                    const value = option?.value ?? "";

                    setFormData((prev) => ({
                      ...prev,
                      district: value,
                      taluk: "",
                    }));

                    setTaluks([]);

                    if (value) {
                      fetchTaluks(value.split("/")[1]);
                    }
                  }}
                />

                {/* Taluk */}

                <SearchableSelect
                  label="Taluk / Tehsil"
                  name="taluk"
                  value={formData.taluk}
                  options={talukOptions}
                  placeholder="Search taluk / tehsil..."
                  icon={<MapPin size={18} />}
                  isDisabled={!formData.district}
                  isLoading={loadingTaluks}
                  required
                  onChange={(option) => {
                    setFormData((prev) => ({
                      ...prev,
                      taluk: option?.value ?? "",
                    }));
                  }}
                />

                {/* Landmark */}

                <InputField
                  label="Landmark"
                  name="landmark"
                  value={formData.landmark}
                  onChange={(e) => {
                    setFormData({ ...formData, landmark: e.target.value });
                  }}
                  placeholder="Enter landmark"
                  icon={<MapPin size={18} />}
                  required
                />
              </div>
            </div>
          </section>

          {/* Schedule Section */}

          <section className="mt-6 rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 p-6">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-violet-100 p-3 text-violet-600">
                  <CalendarDays size={22} />
                </div>

                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Event Schedule
                  </h2>

                  <p className="text-sm text-slate-500">
                    Select the date and duration of your event.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="grid gap-6 md:grid-cols-3">
                {/* Date */}

                <InputField
                  label="Event Date"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => {
                    setFormData({ ...formData, date: e.target.value });
                  }}
                  icon={<CalendarDays size={18} />}
                  min={minDate}
                  required
                />

                {/* Start */}

                <InputField
                  label="Start Time"
                  name="startTime"
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => {
                    const startTime = e.target.value;

                    setFormData((prev) => ({
                      ...prev,
                      startTime,
                      // Clear end time if it is no longer valid
                      endTime:
                        prev.endTime && prev.endTime <= startTime
                          ? ""
                          : prev.endTime,
                    }));
                  }}
                  icon={<Clock3 size={18} />}
                  required
                />

                {/* End */}

                <InputField
                  label="End Time"
                  name="endTime"
                  type="time"
                  value={formData.endTime}
                  min={formData.startTime || undefined}
                  onChange={(e) => {
                    const endTime = e.target.value;

                    if (formData.startTime && endTime <= formData.startTime) {
                      return;
                    }

                    setFormData((prev) => ({
                      ...prev,
                      endTime,
                    }));
                  }}
                  icon={<Clock3 size={18} />}
                  required
                />
              </div>
            </div>
          </section>

          {/* Event Preview */}

          <section className="mt-6 rounded-3xl border border-blue-100 bg-blue-50 p-6">
            <div className="flex items-start gap-4">
              <div className="rounded-xl bg-blue-600 p-3 text-white">
                <CalendarDays size={22} />
              </div>

              <div className="flex-1">
                <h3 className="font-bold text-slate-900">Event Summary</h3>

                <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
                  <SummaryItem
                    label="State"
                    value={formData.state.split("/")[0] || "Not selected"}
                  />
                  <SummaryItem
                    label="District"
                    value={formData.district.split("/")[0] || "Not selected"}
                  />
                  <SummaryItem
                    label="Taluk / Tehsil"
                    value={formData.taluk.split("/")[0] || "Not selected"}
                  />

                  <SummaryItem
                    label="Landmark"
                    value={formData.landmark || "Not entered"}
                  />

                  <SummaryItem
                    label="Date"
                    value={formData.date || "Not selected"}
                  />

                  <SummaryItem
                    label="Time"
                    value={
                      formData.startTime && formData.endTime
                        ? `${formData.startTime} - ${formData.endTime}`
                        : "Not selected"
                    }
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Buttons */}

          <div className="mt-6 flex flex-col-reverse gap-4 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white px-7 py-3.5 font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <RotateCcw size={18} />
              Reset
            </button>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-blue-600 to-indigo-600 px-8 py-3.5 font-semibold text-white shadow-lg shadow-blue-200 transition hover:from-blue-700 hover:to-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Send size={18} />

              {loading ? "Creating Event..." : "Create Event"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* =========================================================
   Input Component
========================================================= */

interface InputFieldProps {
  label: string;
  name: string;
  type?: string;
  value: string;
  placeholder?: string;
  min?: string;
  required?: boolean;
  icon?: React.ReactNode;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function InputField({
  label,
  name,
  type = "text",
  value,
  placeholder,
  min,
  required,
  icon,
  onChange,
}: InputFieldProps) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block text-sm font-semibold text-slate-700"
      >
        {label}

        {required && <span className="ml-1 text-red-500">*</span>}
      </label>

      <div className="relative">
        {icon && (
          <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            {icon}
          </div>
        )}

        <input
          id={name}
          name={name}
          type={type}
          value={value}
          placeholder={placeholder}
          min={min}
          required={required}
          onChange={onChange}
          className={`w-full rounded-2xl border border-slate-300 bg-slate-50 py-3.5 pr-4 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 ${
            icon ? "pl-11" : "pl-4"
          }`}
        />
      </div>
    </div>
  );
}

/* =========================================================
   Select Component
========================================================= */

interface SearchOption {
  value: string;
  label: string;
}

interface SearchableSelectProps {
  label: string;
  name: string;
  value: string;
  placeholder?: string;
  required?: boolean;
  isDisabled?: boolean;
  isLoading?: boolean;
  icon?: React.ReactNode;
  options: SearchOption[];
  onChange: (option: SingleValue<SearchOption>) => void;
}

function SearchableSelect({
  label,
  name,
  value,
  placeholder = "Select...",
  required = false,
  isDisabled = false,
  isLoading = false,
  icon,
  options,
  onChange,
}: SearchableSelectProps) {
  const selectedOption =
    options.find((option) => option.value === value) ?? null;

  return (
    <div>
      {/* Label */}

      <label
        htmlFor={name}
        className="mb-2 block text-sm font-semibold text-slate-700"
      >
        {label}

        {required && <span className="ml-1 text-red-500">*</span>}
      </label>

      <div className="relative">
        {/* Left Icon */}

        {icon && (
          <div className="pointer-events-none absolute left-4 top-1/2 z-20 -translate-y-1/2 text-slate-400">
            {icon}
          </div>
        )}

        <Select<SearchOption>
          inputId={name}
          instanceId={name}
          options={options}
          value={selectedOption}
          onChange={onChange}
          isSearchable
          isClearable
          isDisabled={isDisabled}
          isLoading={isLoading}
          placeholder={placeholder}
          noOptionsMessage={() => "No results found"}
          loadingMessage={() => "Loading..."}
          className="text-sm"
          classNamePrefix="event-select"
          styles={{
            control: (base, state) => ({
              ...base,
              minHeight: "52px",
              borderRadius: "16px",
              borderColor: state.isFocused ? "#3b82f6" : "#cbd5e1",
              backgroundColor: isDisabled ? "#f1f5f9" : "#f8fafc",
              boxShadow: state.isFocused
                ? "0 0 0 4px rgba(59, 130, 246, 0.1)"
                : "none",
              paddingLeft: icon ? "32px" : "8px",
              cursor: isDisabled ? "not-allowed" : "pointer",
              "&:hover": {
                borderColor: "#3b82f6",
              },
            }),

            valueContainer: (base) => ({
              ...base,
              paddingLeft: icon ? "8px" : "8px",
            }),

            input: (base) => ({
              ...base,
              color: "#0f172a",
            }),

            singleValue: (base) => ({
              ...base,
              color: "#0f172a",
            }),

            placeholder: (base) => ({
              ...base,
              color: "#94a3b8",
            }),

            menu: (base) => ({
              ...base,
              zIndex: 9999,
              borderRadius: "16px",
              overflow: "hidden",
              boxShadow: "0 20px 40px rgba(15, 23, 42, 0.15)",
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
                  : "white",
              color: state.isSelected ? "white" : "#0f172a",
            }),

            dropdownIndicator: (base) => ({
              ...base,
              color: "#64748b",
            }),

            clearIndicator: (base) => ({
              ...base,
              color: "#64748b",
            }),

            indicatorSeparator: () => ({
              display: "none",
            }),
          }}
        />
      </div>
    </div>
  );
}

/* =========================================================
   Summary Component
========================================================= */

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-blue-100 bg-white p-3">
      <p className="text-xs font-medium text-slate-500">{label}</p>

      <p className="mt-1 truncate font-semibold text-slate-800">{value}</p>
    </div>
  );
}
