"use client";

import { ReactNode, useLayoutEffect, useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useRouter } from "next/navigation";

interface Props {
  children: ReactNode;
}

const INACTIVITY_TIMEOUT = 60 * 60 * 1000; // 1 hour in milliseconds

export default function DashboardLayout({ children }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  useLayoutEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const response = await fetch("/api/superadmin/checklogin");
        if (!response.ok) {
          router.push("/login/admin");
        }
      } catch (error) {
        console.error(error);
      }
    };

    checkLoggedIn();
  }, []);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    const logout = async () => {
      try {
        await fetch("/api/superadmin/logout");
        router.push("/login/admin");
      } catch (error) {
        console.error(error);
      }
    };

    const resetTimer = () => {
      // console.log("Activity detected");
      clearTimeout(timer);
      timer = setTimeout(logout, INACTIVITY_TIMEOUT);
    };

    const events = [
      "mousemove",
      "mousedown",
      "keypress",
      "scroll",
      "touchstart",
      "click",
    ];

    events.forEach((event) => {
      window.addEventListener(event, resetTimer);
    });

    resetTimer();

    return () => {
      clearTimeout(timer);

      events.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Sidebar */}
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      {/* Main */}
      <div className="lg:ml-72">
        {/* Header */}
        <Header onMenu={() => setSidebarOpen(true)} />

        {/* Page */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
