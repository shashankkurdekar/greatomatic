"use client";

import { useState } from "react";
import {
  UserRound,
  BriefcaseBusiness,
  Award,
  Building2,
  ChevronRight,
} from "lucide-react";

const directors = [
  {
    id: "raymond",
    name: "Raymond Avil Madtha",
    role: "Chairman & Director",
    icon: UserRound,
    summary:
      "Founder Director of Greatomatic India Pvt. Ltd. with experience in technology, construction, health coaching and entrepreneurship.",
    achievements: [
      "Computer Service Engineer",
      "Health & Safety Instructor - Bahrain",
      "Construction Entrepreneur",
      "Health Coach",
    ],
  },
  {
    id: "abhijith",
    name: "Abhijith S Kumar",
    role: "Director",
    icon: BriefcaseBusiness,
    summary:
      "Civil Engineering professional with 22+ years of experience in construction, training, entrepreneurship and social welfare.",
    achievements: [
      "Civil Engineer",
      "Entrepreneur",
      "Skill Development Leader",
      "Social Activist",
    ],
  },
];

export default function Admins() {
  const [active, setActive] = useState(directors[0]);

  return (
    <section
      id="director"
      className="py-24 bg-linear-to-b from-slate-50 to-white"
    >
      <div className="max-w-7xl mx-auto px-6">

        {/* Heading */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-blue-100 text-blue-700">
            <Building2 size={18} />
            Leadership Team
          </div>

          <h2 className="mt-6 text-4xl md:text-5xl font-bold text-slate-900">
            Greatomatic Admins
          </h2>

          <p className="mt-4 text-slate-600 max-w-2xl mx-auto">
            Meet the visionary leaders driving innovation,
            entrepreneurship and social impact at Greatomatic.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-10">

          {/* Left Menu */}
          <div className="lg:col-span-4">
            <div className="space-y-4">

              {directors.map((director) => {
                const Icon = director.icon;

                return (
                  <button
                    key={director.id}
                    onClick={() => setActive(director)}
                    className={`w-full text-left p-6 rounded-3xl transition-all duration-300 ${
                      active.id === director.id
                        ? "bg-blue-600 text-white shadow-2xl"
                        : "bg-white border hover:border-blue-300 shadow-md"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`p-3 rounded-2xl ${
                          active.id === director.id
                            ? "bg-white/20"
                            : "bg-blue-50"
                        }`}
                      >
                        <Icon size={24} />
                      </div>

                      <div>
                        <h3 className="font-bold">
                          {director.name}
                        </h3>

                        <p
                          className={`text-sm ${
                            active.id === director.id
                              ? "text-blue-100"
                              : "text-slate-500"
                          }`}
                        >
                          {director.role}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-8">

            <div className="bg-white rounded-4xl shadow-xl border p-8 md:p-12">

              <div className="flex items-center gap-5">

                <div className="w-20 h-20 rounded-3xl bg-blue-100 flex items-center justify-center">
                  <active.icon
                    size={40}
                    className="text-blue-600"
                  />
                </div>

                <div>
                  <h3 className="text-3xl font-bold text-slate-900">
                    {active.name}
                  </h3>

                  <p className="text-blue-600 font-medium">
                    {active.role}
                  </p>
                </div>
              </div>

              <p className="mt-8 text-lg leading-9 text-slate-600">
                {active.summary}
              </p>

              {/* Achievements */}
              <div className="grid md:grid-cols-2 gap-4 mt-10">

                {active.achievements.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 bg-slate-50 rounded-2xl p-4"
                  >
                    <ChevronRight
                      size={18}
                      className="text-blue-600"
                    />

                    <span>{item}</span>
                  </div>
                ))}
              </div>

              {/* Stats */}
              <div className="grid md:grid-cols-3 gap-6 mt-12">

                <div className="bg-blue-50 rounded-3xl p-6 text-center">
                  <Award
                    className="mx-auto text-blue-600"
                    size={32}
                  />

                  <h4 className="mt-3 text-3xl font-bold">
                    20+
                  </h4>

                  <p className="text-slate-600">
                    Years Experience
                  </p>
                </div>

                <div className="bg-blue-50 rounded-3xl p-6 text-center">
                  <Building2
                    className="mx-auto text-blue-600"
                    size={32}
                  />

                  <h4 className="mt-3 text-3xl font-bold">
                    10+
                  </h4>

                  <p className="text-slate-600">
                    Business Ventures
                  </p>
                </div>

                <div className="bg-blue-50 rounded-3xl p-6 text-center">
                  <UserRound
                    className="mx-auto text-blue-600"
                    size={32}
                  />

                  <h4 className="mt-3 text-3xl font-bold">
                    1000+
                  </h4>

                  <p className="text-slate-600">
                    Lives Impacted
                  </p>
                </div>

              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}