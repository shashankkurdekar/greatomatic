"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  Lock,
  LogOut,
  X,
  BuildingIcon,
  Pencil,
  Plus,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface Props {
  open: boolean;
  setOpen: (v: boolean) => void;
}

const menu = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    name: "Add State Branch",
    href: "/admin/branch/create",
    icon: BuildingIcon,
  },
  {
    name: "Add Event",
    href: "/admin/event/add",
    icon: Plus,
  },
  {
    name: "Manage Events",
    href: "/admin/event/manage",
    icon: Pencil,
  },
  {
    name: "Change Password",
    href: "/admin/password",
    icon: Lock,
  },
];

export default function Sidebar({ open, setOpen }: Props) {
  const router = useRouter();
  const handleLogout = async () => {
    try {
      const response = await fetch("/api/superadmin/logout");
      if (response.ok) {
        router.push("/login/admin");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong while logging out.");
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 bg-black/40 z-40 transition lg:hidden ${
          open ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      />

      <aside
        className={`
        fixed
        top-0
        left-0
        z-50
        h-screen
        w-72
        bg-slate-950
        text-white
        transition-transform
        duration-300
        lg:translate-x-0
        ${open ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        {/* Logo */}
        <div className="h-20 border-b border-white/10 flex items-center justify-between px-6">
          <div>
            <h2 className="text-2xl font-bold">Greatomatic</h2>

            <p className="text-xs text-slate-400">Admin</p>
          </div>

          <button className="lg:hidden" onClick={() => setOpen(false)}>
            <X />
          </button>
        </div>

        {/* Menu */}

        <div className="mt-6 px-4 space-y-2">
          {menu.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                className="
                flex
                items-center
                gap-4
                rounded-xl
                px-4
                py-3
                hover:bg-blue-600
                transition
              "
              >
                <Icon size={20} />

                {item.name}
              </Link>
            );
          })}
        </div>

        {/* Logout */}

        <div className="absolute bottom-6 left-4 right-4">
          <button
            className="
            flex
            w-full
            items-center
            justify-center
            gap-3
            rounded-xl
            bg-red-600
            py-3
            hover:bg-red-700
            duration-300
            cursor-pointer
          "
          onClick={handleLogout}
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
