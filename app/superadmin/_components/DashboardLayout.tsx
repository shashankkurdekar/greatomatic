"use client";

import { ReactNode, useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

interface Props {
  children: ReactNode;
}

export default function DashboardLayout({
  children,
}: Props) {
  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  return (
    <div className="min-h-screen bg-slate-100">

      {/* Sidebar */}
      <Sidebar
        open={sidebarOpen}
        setOpen={setSidebarOpen}
      />

      {/* Main */}
      <div className="lg:ml-72">

        {/* Header */}
        <Header
          onMenu={() =>
            setSidebarOpen(true)
          }
        />

        {/* Page */}
        <main className="p-6">
          {children}
        </main>

      </div>

    </div>
  );
}