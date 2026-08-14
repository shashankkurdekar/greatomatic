/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useMemo, useState } from "react";
import Select, { SingleValue } from "react-select";
import {
  CalendarDays,
  Clock3,
  MapPin,
  Trash2,
  Search,
  CalendarCheck2,
  Map,
} from "lucide-react";

interface EventItem {
  id: number;
  state: string;
  district: string;
  taluk: string;
  landmark: string;
  date: string;
  startTime: string;
  endTime: string;
}

interface DateOption {
  value: string;
  label: string;
}

export default function ManageEventComponent() {
  const [selectedDate, setSelectedDate] = useState<string>("");

  const [search, setSearch] = useState("");
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [dateSearch, setDateSearch] = useState("");
  const [locationSearch, setLocationSearch] = useState("");
  function formatApiDate(date: string | Date) {
    if (date instanceof Date) {
      return date.toISOString().split("T")[0];
    }

    return String(date).split("T")[0];
  }
  useEffect(() => {
    async function fetchEvents() {
      try {
        setLoading(true);

        const res = await fetch("/api/admin/event/fetch", {
          method: "GET",
          cache: "no-store",
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to fetch events");
        }

        const formattedEvents: EventItem[] = data.events.map((event: any) => ({
          id: event.id,
          state: event.state,
          district: event.district,
          taluk: event.taluk,
          landmark: event.landmark,
          date: formatApiDate(event.date),
          startTime: event.start_time.slice(0, 5),
          endTime: event.end_time.slice(0, 5),
        }));

        setEvents(formattedEvents);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  const dateOptions: DateOption[] = useMemo(() => {
    const dates = [...new Set(events.map((event) => event.date))];

    return dates.map((date) => ({
      value: date,
      label: formatDate(date),
    }));
  }, []);

  const filteredEvents = events.filter((event) => {
    // Date search
    const matchesDate = !dateSearch || event.date === dateSearch;

    // Location search
    const search = locationSearch.trim().toLowerCase();

    const matchesLocation =
      !search ||
      event.state.toLowerCase().includes(search) ||
      event.district.toLowerCase().includes(search) ||
      event.taluk.toLowerCase().includes(search) ||
      event.landmark.toLowerCase().includes(search);

    return matchesDate && matchesLocation;
  });
  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this event?",
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const res = await fetch("/api/admin/event/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to delete event");
      }

      alert("Event deleted successfully.");

      // Remove from UI without another API request
      setEvents((prev) => prev.filter((event) => event.id !== id));
    } catch (error) {
      console.error(error);

      alert(error instanceof Error ? error.message : "Failed to delete event.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-blue-600 p-3 text-white shadow-lg shadow-blue-200">
                <CalendarCheck2 size={25} />
              </div>

              <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                  View Events
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                  Manage and view all scheduled events.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl bg-white px-5 py-3 shadow-sm">
            <CalendarDays size={20} className="text-blue-600" />

            <div>
              <p className="text-xs text-slate-500">Total Events</p>

              <p className="font-bold text-slate-900">{events.length}</p>
            </div>
          </div>
        </div>

        {/* Filters */}

        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="grid gap-4 md:grid-cols-3">
            {/* Date */}

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Search By Date
              </label>

              <div className="relative">
                <CalendarDays
                  size={18}
                  className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="date"
                  value={dateSearch}
                  onChange={(e) => {
                    setDateSearch(e.target.value);
                  }}
                  className="w-full rounded-2xl border border-slate-300 bg-slate-50 py-3.5 pl-11 pr-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                />
              </div>
            </div>

            {/* Location */}

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Search Location
              </label>

              <div className="relative">
                <Search
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  value={locationSearch}
                  onChange={(e) => {
                    setLocationSearch(e.target.value);
                  }}
                  placeholder="State, district, taluk..."
                  className="w-full rounded-2xl border border-slate-300 bg-slate-50 py-3.5 pl-11 pr-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                />
              </div>
            </div>

            {/* Clear */}

            <div className="flex items-end">
              <button
                type="button"
                onClick={() => {
                  setDateSearch("");
                  setLocationSearch("");
                }}
                className="w-full rounded-2xl border border-slate-300 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Clear Filters
              </button>
            </div>
          </div>

          {/* Result count */}

          <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
            <p className="text-sm text-slate-500">
              Showing{" "}
              <span className="font-semibold text-slate-900">
                {filteredEvents.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-slate-900">
                {events.length}
              </span>{" "}
              events
            </p>

            {(dateSearch || locationSearch) && (
              <button
                type="button"
                onClick={() => {
                  setDateSearch("");
                  setLocationSearch("");
                }}
                className="text-sm font-semibold text-blue-600 hover:text-blue-700"
              >
                Reset Search
              </button>
            )}
          </div>
        </section>

        {/* Event Count */}

        <div className="mt-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Scheduled Events
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {filteredEvents.length} event
              {filteredEvents.length !== 1 ? "s" : ""} found
            </p>
          </div>
        </div>

        {/* Desktop Table */}
        {loading ? (
          <div className="mt-4 rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

            <p className="mt-4 text-sm font-medium text-slate-500">
              Loading events...
            </p>
          </div>
        ) : (
          <section className="mt-4 hidden overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm md:block">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      #
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      Location
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      Date
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      Time
                    </th>

                    <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-500">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredEvents.map((event, index) => (
                    <tr key={event.id} className="transition hover:bg-slate-50">
                      {/* Number */}

                      <td className="px-6 py-5">
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-sm font-bold text-slate-600">
                          {index + 1}
                        </span>
                      </td>

                      {/* Location */}

                      <td className="px-6 py-5">
                        <div className="flex items-start gap-3">
                          <div className="rounded-xl bg-blue-100 p-2.5 text-blue-600">
                            <MapPin size={18} />
                          </div>

                          <div>
                            <p className="font-semibold text-slate-900">
                              {event.landmark}
                            </p>

                            <p className="mt-1 text-sm text-slate-500">
                              {event.taluk}, {event.district}
                            </p>

                            <p className="text-xs text-slate-400">
                              {event.state}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Date */}

                      <td className="px-6 py-5">
                        <span className="inline-flex items-center gap-2 rounded-xl bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700">
                          <CalendarDays size={16} />

                          {formatDate(event.date)}
                        </span>
                      </td>

                      {/* Time */}

                      <td className="px-6 py-5">
                        <span className="inline-flex items-center gap-2 rounded-xl bg-violet-50 px-3 py-2 text-sm font-semibold text-violet-700">
                          <Clock3 size={16} />
                          {formatTime(event.startTime)} -{" "}
                          {formatTime(event.endTime)}
                        </span>
                      </td>

                      {/* Actions */}

                      <td className="px-6 py-5">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            title="Delete"
                            onClick={() => handleDelete(event.id)}
                            className="rounded-xl bg-red-50 p-2.5 text-red-600 transition hover:bg-red-600 hover:text-white"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Mobile Cards */}
        {loading ? (
          <div className="mt-4 rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

            <p className="mt-4 text-sm font-medium text-slate-500">
              Loading events...
            </p>
          </div>
        ) : (
          <div className="mt-4 space-y-4 md:hidden">
            {filteredEvents.map((event, index) => (
              <div
                key={event.id}
                className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 text-sm font-bold text-blue-600">
                      {index + 1}
                    </span>

                    <div>
                      <p className="font-bold text-slate-900">
                        {event.landmark}
                      </p>

                      <p className="text-sm text-slate-500">
                        {event.taluk}, {event.district}
                      </p>
                    </div>
                  </div>

                  <Map size={20} className="text-slate-400" />
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-blue-50 p-3">
                    <p className="text-xs text-blue-500">Date</p>

                    <p className="mt-1 text-sm font-bold text-blue-700">
                      {formatDate(event.date)}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-violet-50 p-3">
                    <p className="text-xs text-violet-500">Time</p>

                    <p className="mt-1 text-sm font-bold text-violet-700">
                      {formatTime(event.startTime)} -{" "}
                      {formatTime(event.endTime)}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => handleDelete(event.id)}
                    className="rounded-xl bg-red-50 px-4 text-red-600"
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}

        {filteredEvents.length === 0 && (
          <div className="mt-4 rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              <CalendarDays size={30} />
            </div>

            <h3 className="mt-5 text-lg font-bold text-slate-900">
              No events found
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
              There are no events matching your current filters. Try selecting
              another date or clearing the filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/* =========================================================
   Helpers
========================================================= */

function formatDate(date: string) {
  if (!date) return "";

  const [year, month, day] = date.split("-").map(Number);

  return new Date(year, month - 1, day).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatTime(time: string) {
  if (!time) return "";

  const [hours, minutes] = time.split(":").map(Number);

  const date = new Date();

  date.setHours(hours, minutes, 0, 0);

  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}
