"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown, Menu, X } from "lucide-react";

export default function Navbar() {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };

    window.addEventListener("scroll", onScroll);

    return () =>
      window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Desktop Navbar */}
      <nav
        className={`hidden lg:block fixed w-screen z-50 transition-all duration-500 ${
          isScrolled ? "top-5" : "top-14"
        }`}
      >
        <div className={`mx-auto ${isScrolled ? "max-w-7xl" : "max-w-full"}`}>
          <div
            className={`transition-all duration-500 flex items-center justify-between ${
              isScrolled
                ? `
                  rounded-3xl
                  px-8
                  py-4
                  bg-white/70
                  backdrop-blur-xl
                  border border-white/30
                  shadow-xl
                `
                : `
                  bg-white
                  border-b border-slate-200
                  px-50
                  py-5
                `
            }`}
          >
            {/* Logo */}
            <a href="#">
              <Image
                src="/LOGO.png"
                alt="Greatomatic"
                width={150}
                height={50}
                priority
              />
            </a>

            {/* Menu */}
            <ul className="flex items-center gap-8 font-medium text-slate-800">
              <li>
                <a
                  href="#"
                  className="hover:text-blue-600 transition"
                >
                  Home
                </a>
              </li>

              {/* About */}
              <li className="relative group">
                <button className="flex items-center gap-1 hover:text-blue-600 transition">
                  About Us

                  <ChevronDown
                    size={16}
                    className="transition-transform duration-300 group-hover:rotate-180"
                  />
                </button>

                <div
                  className="
                    absolute left-0 top-full mt-3
                    w-64
                    rounded-2xl
                    bg-white
                    shadow-xl
                    border
                    opacity-0
                    invisible
                    translate-y-2
                    transition-all duration-300
                    group-hover:opacity-100
                    group-hover:visible
                    group-hover:translate-y-0
                  "
                >
                  <a
                    href="#about"
                    className="block px-5 py-3 hover:bg-slate-100 rounded-t-2xl"
                  >
                    About Greatomatic
                  </a>

                  <a
                    href="#director"
                    className="block px-5 py-3 hover:bg-slate-100"
                  >
                    Greatomatic Admins
                  </a>

                  <a
                    href="#team"
                    className="block px-5 py-3 hover:bg-slate-100 rounded-b-2xl"
                  >
                    Management Team
                  </a>
                </div>
              </li>

              <li>
                <a
                  href="#gallery"
                  className="hover:text-blue-600 transition"
                >
                  Vacancy Details
                </a>
              </li>

              {/* Contact */}
              <li className="relative group">
                <button className="flex items-center gap-1 hover:text-blue-600 transition">
                  Contact Details

                  <ChevronDown
                    size={16}
                    className="transition-transform duration-300 group-hover:rotate-180"
                  />
                </button>

                <div
                  className="
                    absolute left-0 top-full mt-3
                    w-64
                    rounded-2xl
                    bg-white
                    shadow-xl
                    border
                    opacity-0
                    invisible
                    translate-y-2
                    transition-all duration-300
                    group-hover:opacity-100
                    group-hover:visible
                    group-hover:translate-y-0
                  "
                >
                  <a
                    href="#head_office"
                    className="block px-5 py-3 hover:bg-slate-100 rounded-t-2xl"
                  >
                    Registered Office
                  </a>

                  <a
                    href="#branch"
                    className="block px-5 py-3 hover:bg-slate-100 rounded-b-2xl"
                  >
                    Branch Offices
                  </a>
                </div>
              </li>

              {/* <li>
                <a
                  href="/jobs"
                  className="
                    px-5 py-3
                    rounded-xl
                    bg-blue-600
                    text-white
                    hover:bg-blue-700
                    transition
                  "
                >
                  We&apos;re Hiring
                </a>
              </li> */}
            </ul>
          </div>
        </div>
      </nav>

      {/* Mobile Navbar */}
      <nav
        className={`lg:hidden sticky top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/70 backdrop-blur-xl shadow-lg"
            : "bg-white border-b"
        }`}
      >
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/">
            <Image
              src="/LOGO.png"
              alt="Logo"
              width={140}
              height={50}
            />
          </Link>

          <button
            onClick={() => setMobileMenu(true)}
            className="p-2"
          >
            <Menu size={28} />
          </button>
        </div>
      </nav>

      {/* Overlay */}
      <div
        className={`fixed inset-0 z-999 transition-all duration-300 ${
          mobileMenu
            ? "visible bg-black/50"
            : "invisible bg-transparent"
        }`}
      >
        <div
          className={`absolute right-0 top-0 h-full w-[320px] max-w-[90vw] bg-white shadow-2xl transition-transform duration-300 ${
            mobileMenu
              ? "translate-x-0"
              : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between p-5 border-b">
            <Image
              src="/LOGO.png"
              alt="Logo"
              width={140}
              height={50}
            />

            <button
              onClick={() => setMobileMenu(false)}
            >
              <X size={24} />
            </button>
          </div>

          <div className="p-5 space-y-3">
            {[
              ["Home", "#"],
              ["About Greatomatic", "#about"],
              ["Greatomatic Admins", "#director"],
              ["Management Team", "#team"],
              ["Vacancy Details", "#gallery"],
              ["Registered Office", "#head_office"],
              ["Branch Offices", "#branch"],
            ].map(([title, href]) => (
              <a
                key={title}
                href={href}
                onClick={() =>
                  setMobileMenu(false)
                }
                className="
                  block
                  rounded-xl
                  bg-slate-100
                  px-4
                  py-3
                  hover:bg-slate-200
                "
              >
                {title}
              </a>
            ))}

            <a
              href="/jobs"
              className="
                block
                rounded-xl
                bg-blue-600
                text-white
                px-4
                py-3
                text-center
              "
            >
              We&apos;re Hiring
            </a>
            <a
              href="/appointments"
              className="
                block
                rounded-xl
                bg-blue-600
                text-white
                px-4
                py-3
                text-center
              "
            >
              Appointments
            </a>
            <a
              href="/login/admin"
              className="
                block
                rounded-xl
                bg-blue-600
                text-white
                px-4
                py-3
                text-center
              "
            >
              Login
            </a>
          </div>
        </div>
      </div>
    </>
  );
}