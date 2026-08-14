import { Users, CheckCircle2, Clock3, XCircle } from "lucide-react";

const stats = [
  {
    title: "Total Appointments",
    value: 256,
    icon: Users,
    color: "from-blue-500 to-blue-700",
    change: "+12 Today",
  },
  {
    title: "Approved",
    value: 210,
    icon: CheckCircle2,
    color: "from-green-500 to-green-700",
    change: "+8 Today",
  },
  {
    title: "Pending",
    value: 31,
    icon: Clock3,
    color: "from-yellow-400 to-orange-500",
    change: "Needs Review",
  },
  {
    title: "Rejected",
    value: 15,
    icon: XCircle,
    color: "from-red-500 to-red-700",
    change: "Last 7 Days",
  },
];

export default function StatsCard() {
  return (
    <div>
      {/* Cards */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="overflow-hidden rounded-3xl bg-white shadow transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className={`bg-linear-to-r ${item.color} p-6 text-white`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-80">{item.title}</p>

                    <h2 className="mt-3 text-4xl font-bold">{item.value}</h2>
                  </div>

                  <div className="rounded-2xl bg-white/20 p-4">
                    <Icon size={34} />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-5">
                <span className="text-sm text-slate-500">{item.change}</span>

                <button className="text-sm font-semibold text-blue-600 hover:underline">
                  View
                </button>
              </div>
            </div>
          );
        })}
      </div>
      {/* Recents */}
      <div className="mt-8 rounded-3xl bg-white shadow">
        <div className="border-b p-6">
          <h2 className="text-xl font-bold">Recent Appointments</h2>
        </div>

        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="p-4 text-left">Visitor Name</th>

              <th className="p-4 text-left">Email</th>

              <th className="p-4 text-left">Mobile</th>

              <th className="p-4 text-left">Date & Time</th>

              <th className="p-4 text-left">Location</th>

              <th className="p-4 text-left">View</th>
            </tr>
          </thead>

          <tbody>{/* Data */}</tbody>
        </table>
      </div>
    </div>
  );
}
