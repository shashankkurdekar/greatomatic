import {
  Users,
  Building2,
  MapPinned,
  Map,
  House,
  BriefcaseBusiness,
  FileQuestion,
  ImagePlus,
} from "lucide-react";
import { RowDataPacket } from 'mysql2';
import pool from '@/lib/db'
import Link from "next/link";


type CountRow = RowDataPacket & {
  count: number;
};

export default async function StatsCards() {
  const [rows] = await pool.query<CountRow[]>("SELECT COUNT(*) as count FROM admin WHERE role = 'admin'");
  const totalAdmins = rows[0]?.count ?? 0;
  

  const stats = [
    {
      title: "Total Admins",
      value: totalAdmins,
      icon: Users,
      color: "from-blue-500 to-cyan-500",
      href: "/superadmin/admin/manage",
    },
    {
      title: "State Branches",
      value: "28",
      icon: Building2,
      color: "from-indigo-500 to-blue-500",
      
    },
    {
      title: "District Branches",
      value: "185",
      icon: MapPinned,
      color: "from-emerald-500 to-green-500",
    },
    {
      title: "Taluk Branches",
      value: "512",
      icon: Map,
      color: "from-orange-500 to-amber-500",
    },
    {
      title: "Village Branches",
      value: "1,248",
      icon: House,
      color: "from-pink-500 to-rose-500",
    },
    {
      title: "Active Jobs",
      value: "83",
      icon: BriefcaseBusiness,
      color: "from-violet-500 to-purple-500",
    },
    {
      title: "Question Papers",
      value: "140",
      icon: FileQuestion,
      color: "from-sky-500 to-cyan-500",
    },
    {
      title: "Job Posters",
      value: "64",
      icon: ImagePlus,
      color: "from-red-500 to-pink-500",
    },
  ];
  return (
    <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((item) => {
        const Icon = item.icon;

        return (
          <Link
            href={item.href || "#"}
            key={item.title}
            className="
              group
              relative
              overflow-hidden
              rounded-3xl
              bg-white
              p-6
              shadow-sm
              border
              border-slate-200
              transition-all
              duration-300
              hover:-translate-y-2
              hover:shadow-2xl
            "
          >
            {/* Background Circle */}
            <div
              className={`
                absolute
                -right-10
                -top-10
                h-32
                w-32
                rounded-full
                bg-linear-to-br
                ${item.color}
                opacity-10
                group-hover:scale-125
                transition-all
                duration-500
              `}
            />

            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-500">
                  {item.title}
                </p>

                <h2 className="mt-3 text-4xl font-bold text-slate-900">
                  {item.value}
                </h2>
              </div>

              <div
                className={`
                  flex
                  h-16
                  w-16
                  items-center
                  justify-center
                  rounded-2xl
                  bg-linear-to-br
                  ${item.color}
                  text-white
                  shadow-lg
                `}
              >
                <Icon size={30} />
              </div>
            </div>
          </Link>
        );
      })}
    </section>
  );
}