import {
  Crown,
  Briefcase,
  DollarSign,
  MonitorSmartphone,
  Megaphone,
  Users,
  Scale,
  Truck,
  Shield,
  HeartPulse,
  Building2,
} from "lucide-react";

const team = [
  {
    name: "Raymond Avil Madtha",
    short: "MD",
    role: "Managing Director",
    icon: Crown,
    featured: true,
  },
  {
    name: "Abhijith S Kumar",
    short: "CEO",
    role: "Chief Executive Officer",
    icon: Briefcase,
    featured: true,
  },
  {
    name: "Felcy Pauline Dsouza",
    short: "CFO",
    role: "Chief Financial Officer",
    icon: DollarSign,
  },
  {
    name: "Satish P Kurdekar",
    short: "CTO",
    role: "Chief Technology Officer",
    icon: MonitorSmartphone,
  },
  {
    name: "Krishnakumar Madhavan",
    short: "COO",
    role: "Chief Operating Officer",
    icon: Building2,
  },
  {
    name: "Krishna Nandan",
    short: "CMO",
    role: "Chief Marketing Officer",
    icon: Megaphone,
  },
  {
    name: "Sathish Shetty",
    short: "CLO",
    role: "Chief Legal Officer",
    icon: Scale,
  },
  {
    name: "Inder Singh",
    short: "CTCO",
    role: "Chief Transport & Cargo Officer",
    icon: Truck,
  },
  {
    name: "Manohar P",
    short: "CCDO",
    role: "Chief Collection & Delivery Officer",
    icon: Truck,
  },
  {
    name: "Rockey Dsouza",
    short: "CAO",
    role: "Chief Administrative Officer",
    icon: Building2,
  },
  {
    name: "Murali Krishna M G",
    short: "CPRO",
    role: "Chief Public Relations Officer",
    icon: Users,
  },
  {
    name: "Bhavya N V",
    short: "CHRO",
    role: "Chief Human Resources Officer",
    icon: Users,
  },
  {
    name: "Arfa Mohamed Akif",
    short: "CHO",
    role: "Chief Health Officer",
    icon: HeartPulse,
  },
  {
    name: "Azhagar D",
    short: "CSO",
    role: "Chief Security Officer",
    icon: Shield,
  },
];

export default function Team() {
  return (
    <section
      id="team"
      className="py-24 bg-linear-to-b from-slate-50 to-white"
    >
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-5 py-2 rounded-full">
            <Users size={18} />
            Leadership Team
          </div>

          <h2 className="mt-6 text-5xl font-bold text-slate-900">
            Management Professionals
          </h2>

          <p className="mt-4 text-slate-600 max-w-2xl mx-auto">
            Experienced leaders driving innovation, operations,
            technology, finance and growth at Greatomatic.
          </p>
        </div>

        {/* Featured Leadership */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">

          {team
            .filter((member) => member.featured)
            .map((member) => {
              const Icon = member.icon;

              return (
                <div
                  key={member.short}
                  className="relative overflow-hidden rounded-4xl
                  bg-linear-to-br from-blue-600 to-indigo-700
                  text-white p-10 shadow-2xl"
                >
                  <div className="absolute right-0 top-0 w-40 h-40 bg-white/10 rounded-full blur-3xl" />

                  <Icon size={60} />

                  <div className="mt-6">
                    <span className="text-sm uppercase tracking-widest opacity-80">
                      {member.short}
                    </span>

                    <h3 className="text-3xl font-bold mt-2">
                      {member.name}
                    </h3>

                    <p className="mt-3 text-blue-100">
                      {member.role}
                    </p>
                  </div>
                </div>
              );
            })}
        </div>

        {/* Executive Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

          {team
            .filter((member) => !member.featured)
            .map((member) => {
              const Icon = member.icon;

              return (
                <div
                  key={member.short}
                  className="
                  group
                  bg-white
                  border
                  rounded-3xl
                  p-6
                  shadow-md
                  hover:shadow-2xl
                  hover:-translate-y-2
                  transition-all duration-300
                "
                >
                  <div
                    className="
                    w-16 h-16 rounded-2xl
                    bg-blue-50
                    flex items-center justify-center
                    group-hover:bg-blue-600
                    transition-all
                  "
                  >
                    <Icon
                      size={30}
                      className="
                      text-blue-600
                      group-hover:text-white
                    "
                    />
                  </div>

                  <span className="inline-block mt-5 text-xs font-semibold bg-slate-100 px-3 py-1 rounded-full">
                    {member.short}
                  </span>

                  <h3 className="mt-4 text-lg font-bold text-slate-900">
                    {member.name}
                  </h3>

                  <p className="mt-2 text-sm text-slate-600">
                    {member.role}
                  </p>
                </div>
              );
            })}
        </div>
      </div>
    </section>
  );
}