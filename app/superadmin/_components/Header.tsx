"use client";

import {
  Bell,
  Menu,
  Search,
  UserCircle2,
} from "lucide-react";

interface Props {
  onMenu: () => void;
}

export default function Header({
  onMenu,
}: Props) {
  return (
    <header className="sticky top-0 z-30 p-6">

      <div
        className="
        flex
        items-center
        justify-between
        rounded-2xl
        border
        border-white/20
        bg-white/70
        backdrop-blur-xl
        px-6
        py-4
        shadow-lg
      "
      >
        {/* Left */}

        <div className="flex items-center gap-4">

          <button
            onClick={onMenu}
            className="lg:hidden"
          >
            <Menu />
          </button>

          <div>

            <h1 className="text-2xl font-bold">
              Dashboard
            </h1>

            <p className="text-slate-500">
              Welcome back 👋
            </p>

          </div>

        </div>

        {/* Search */}

        
        {/* Right */}

        <div className="flex items-center gap-5">

          

          <div className="flex items-center gap-3">

            <UserCircle2 size={40} />

            <div className="hidden md:block">

              <p className="font-semibold">
                Super Admin
              </p>

              <p className="text-sm text-slate-500">
                Administrator
              </p>

            </div>

          </div>

        </div>

      </div>

    </header>
  );
}