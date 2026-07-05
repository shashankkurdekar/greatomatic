"use client";

import { useState } from "react";
import { Building, Globe, Rocket, EyeIcon } from "lucide-react";

const tabs = [
  {
    id: "greatomatic",
    title: "About Greatomatic",
    icon: Building,
    content:
      "Greatomatic India Private Limited was launched with the objective of overcoming unemployment and poverty. Our mission is to create opportunities that improve financial stability and contribute to economic growth.",
  },
  {
    id: "gremail",
    title: "About Gremail",
    icon: Globe,
    content:
      "Gremail India Digital Mart is a unit of Greatomatic that connects consumers, manufacturers, and service providers. It helps people access products and services efficiently while saving time and money.",
  },
  {
    id: "goal",
    title: "Our Goal",
    icon: Rocket,
    content:
      "We aim to empower individuals through professional training, skill development, and economic opportunities that help them become self-reliant and successful.",
  },
  {
    id: "vision",
    title: "Our Vision",
    icon: EyeIcon,
    content:
      "Our vision is to build a reliable ecosystem for consumers, manufacturers, and service providers while contributing to economic growth and national development.",
  },
];

export default function About() {
  const [activeTab, setActiveTab] = useState(tabs[0]);

  return (
    <section
      id="about"
      className="py-24 bg-linear-to-b from-slate-50 to-white"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Heading */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold">
            About Us
          </span>

          <h2 className="mt-6 text-4xl md:text-5xl font-bold text-slate-900">
            Discover Our Story
          </h2>

          <p className="mt-4 max-w-2xl mx-auto text-slate-600">
            Creating opportunities, empowering communities, and building
            sustainable growth for a better future.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-10">
          {/* Navigation */}
          <div className="lg:col-span-4">
            <div className="space-y-4">
              {tabs.map((tab) => {
                const Icon = tab.icon;

                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab)}
                    className={`w-full text-left p-5 rounded-2xl transition-all duration-300 border ${
                      activeTab.id === tab.id
                        ? "bg-blue-600 text-white border-blue-600 shadow-xl"
                        : "bg-white text-slate-700 border-slate-200 hover:border-blue-300 hover:shadow-lg"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <Icon className="w-7 h-7" />

                      <div>
                        <h3 className="font-semibold">
                          {tab.title}
                        </h3>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-slate-100">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center">
                  <activeTab.icon className="w-8 h-8 text-blue-600" />
                </div>

                <h3 className="text-3xl font-bold text-slate-900">
                  {activeTab.title}
                </h3>
              </div>

              <p className="text-lg leading-9 text-slate-600">
                {activeTab.content}
              </p>

              {/* Feature Cards */}
              <div className="grid md:grid-cols-3 gap-6 mt-10">
                <div className="bg-slate-50 rounded-2xl p-6">
                  <h4 className="font-bold text-blue-600">
                    Mission
                  </h4>

                  <p className="mt-3 text-sm text-slate-600">
                    Creating meaningful opportunities for everyone.
                  </p>
                </div>

                <div className="bg-slate-50 rounded-2xl p-6">
                  <h4 className="font-bold text-blue-600">
                    Growth
                  </h4>

                  <p className="mt-3 text-sm text-slate-600">
                    Supporting economic and social development.
                  </p>
                </div>

                <div className="bg-slate-50 rounded-2xl p-6">
                  <h4 className="font-bold text-blue-600">
                    Impact
                  </h4>

                  <p className="mt-3 text-sm text-slate-600">
                    Empowering communities through innovation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Stats */}
        <div className="grid md:grid-cols-3 gap-6 mt-16">
          <div className="bg-white rounded-3xl shadow-lg p-8 text-center">
            <h3 className="text-4xl font-bold text-blue-600">
              2022
            </h3>
            <p className="mt-2 text-slate-600">
              Company Established
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-lg p-8 text-center">
            <h3 className="text-4xl font-bold text-blue-600">
              100%
            </h3>
            <p className="mt-2 text-slate-600">
              Commitment to Growth
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-lg p-8 text-center">
            <h3 className="text-4xl font-bold text-blue-600">
              ∞
            </h3>
            <p className="mt-2 text-slate-600">
              Opportunities Ahead
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}