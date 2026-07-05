import Link from "next/link";
import {
  BriefcaseBusiness,
  MapPinned,
  Building2,
  Landmark,
  ArrowRight,
} from "lucide-react";
import Image from "next/image";

const vacancies = [
  {
    title: "State Coordinator",
    image: "/images/jobs/state.jpg",
    icon: Landmark,
    id: 80,
    color: "from-blue-600 to-indigo-700",
  },
  {
    title: "District Coordinator",
    image: "/images/jobs/district.jpg",
    icon: Building2,
    id: 81,
    color: "from-emerald-600 to-green-700",
  },
  {
    title: "Tehsil Coordinator",
    image: "/images/jobs/tehsil.jpg",
    icon: MapPinned,
    id: 82,
    color: "from-orange-500 to-red-600",
  },
  {
    title: "City Coordinator",
    image: "/images/jobs/city.jpg",
    icon: BriefcaseBusiness,
    id: 83,
    color: "from-purple-600 to-pink-600",
  },
  {
    title: "Village Coordinator",
    image: "/images/jobs/village.jpg",
    icon: MapPinned,
    id: 84,
    color: "from-cyan-600 to-sky-700",
  },
];

export default function Vacancy() {
  return (
    <section
      id="gallery"
      className="py-24 bg-linear-to-b from-slate-900 to-slate-950 text-white"
    >
      <div className="max-w-7xl mx-auto px-6">

        {/* Heading */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 backdrop-blur-md">
            <BriefcaseBusiness size={18} />
            Career Opportunities
          </div>

          <h2 className="mt-6 text-5xl font-bold">
            Join Our Growing Team
          </h2>

          <p className="mt-4 text-slate-300 max-w-2xl mx-auto">
            Explore exciting leadership and management opportunities
            across different regions and become part of Greatomatic&apos;s mission.
          </p>
        </div>

        {/* Featured Job */}
        <div
          className="
          rounded-[40px]
          overflow-hidden
          bg-linear-to-r
          from-blue-600
          to-indigo-700
          p-10
          mb-10
        "
        >
          <div className="grid lg:grid-cols-2 gap-10 items-center">

            <div>
              <span className="bg-white/20 px-4 py-2 rounded-full text-sm">
                Featured Vacancy
              </span>

              <h3 className="text-5xl font-bold mt-6">
                State Coordinator
              </h3>

              <p className="mt-5 text-blue-100 leading-8">
                Lead operations, coordinate teams, and drive
                organizational growth at the state level.
              </p>

              <Link
                href="/jobs/80"
                className="
                inline-flex
                items-center
                gap-2
                bg-white
                text-blue-700
                px-6
                py-3
                rounded-xl
                mt-8
                font-semibold
              "
              >
                Apply Now
                <ArrowRight size={18} />
              </Link>
            </div>

            <div>
              <Image
                src="/Main_slide/1.jpg"
                alt="State Coordinator"
                className="rounded-3xl w-full object-cover"
                width={600}
                height={400}
              />
            </div>

          </div>
        </div>

        {/* Job Grid */}
        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">

          {vacancies.slice(1).map((job) => {
            const Icon = job.icon;

            return (
              <div
                key={job.id}
                className="
                bg-white/5
                border
                border-white/10
                backdrop-blur-xl
                rounded-3xl
                overflow-hidden
                hover:-translate-y-2
                hover:border-blue-500
                transition-all
                duration-300
              "
              >
                <Image
                  src={job.image}
                  alt={job.title}
                  className="h-52 w-full object-cover"
                  width={400}
                  height={208}
                />

                <div className="p-6">

                  <div
                    className={`
                    inline-flex
                    p-3
                    rounded-2xl
                    bg-linear-to-r
                    ${job.color}
                  `}
                  >
                    <Icon size={22} />
                  </div>

                  <h3 className="mt-5 text-xl font-bold">
                    {job.title}
                  </h3>

                  <p className="text-slate-400 mt-3">
                    Leadership opportunity available.
                  </p>

                  <Link
                    href={`/jobs/${job.id}`}
                    className="
                    mt-5
                    inline-flex
                    items-center
                    gap-2
                    text-blue-400
                    hover:text-blue-300
                  "
                  >
                    View Details
                    <ArrowRight size={16} />
                  </Link>

                </div>
              </div>
            );
          })}

        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <Link
            href="/careers"
            className="
            inline-flex
            items-center
            gap-3
            px-8
            py-4
            rounded-2xl
            bg-blue-600
            hover:bg-blue-700
            transition
            font-semibold
          "
          >
            View All Open Positions
            <ArrowRight size={18} />
          </Link>
        </div>

      </div>
    </section>
  );
}