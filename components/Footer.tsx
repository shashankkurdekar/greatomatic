import Link from "next/link";
import { Phone, Mail, MapPin, ArrowUpRight } from "lucide-react";
import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaWhatsapp,
  FaXTwitter,
} from "react-icons/fa6";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-white">
      {/* Top Section */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-4 gap-12">
          {/* Company */}
          <div>
            {/* <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center font-bold text-xl">
                G
              </div>

              <div>
                <h3 className="text-2xl font-bold">Greatomatic</h3>

                <p className="text-slate-400 text-sm">India Pvt. Ltd.</p>
              </div>
            </div> */}
            <div className="inline-flex items-center justify-center rounded-md bg-white border border-white/10 backdrop-blur-xl p-4 shadow-xl shadow-slate-950/20">
              <Image
                src="/LOGO.png"
                alt="Greatomatic"
                width={160}
                height={60}
                className="object-contain"
              />
            </div>

            <p className="text-slate-400 mt-6 leading-7">
              Empowering businesses, communities and individuals through
              innovation, opportunities and sustainable growth.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-5">Quick Links</h4>

            <div className="space-y-3">
              <Link href="/" className="block text-slate-400 hover:text-white">
                Home
              </Link>

              <Link
                href="#about"
                className="block text-slate-400 hover:text-white"
              >
                About Us
              </Link>

              <Link
                href="#director"
                className="block text-slate-400 hover:text-white"
              >
                Leadership Team
              </Link>

              <Link
                href="#gallery"
                className="block text-slate-400 hover:text-white"
              >
                Careers
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-lg mb-5">Contact</h4>

            <div className="space-y-5">
              <div className="flex gap-3">
                <Phone size={18} className="text-blue-500 mt-1" />
                <div>
                  <p>+91 94826 42843</p>
                  <p>+91 76763 90549</p>
                </div>
              </div>

              <div className="flex gap-3">
                <Mail size={18} className="text-blue-500 mt-1" />
                <div>registeredoffice@greatomatic.com</div>
              </div>

              <div className="flex gap-3">
                <MapPin size={18} className="text-blue-500 mt-1" />
                <div>Udupi, Karnataka, India</div>
              </div>
            </div>
          </div>

          {/* Newsletter / CTA */}
          <div>
            <h4 className="font-semibold text-lg mb-5">Connect With Us</h4>

            <p className="text-slate-400 mb-6">
              Follow us on social media and stay updated with opportunities and
              company news.
            </p>

            <Link
              href="#gallery"
              className="
              inline-flex
              items-center
              gap-2
              bg-blue-600
              hover:bg-blue-700
              px-5
              py-3
              rounded-xl
              transition
            "
            >
              View Vacancies
              <ArrowUpRight size={18} />
            </Link>
          </div>
        </div>
      </div>

      {/* Social Section */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Copyright */}
            <div className="text-slate-400 text-center md:text-left">
              © {new Date().getFullYear()} Greatomatic India Pvt. Ltd. All
              Rights Reserved.
            </div>

            {/* Social Icons */}
            <div className="flex gap-4">
              <a href="#">
                <FaFacebookF size={18} />
              </a>

              <a href="#">
                <FaXTwitter size={18} />
              </a>

              <a href="#">
                <FaWhatsapp size={18} />
              </a>

              <a href="#">
                <FaInstagram size={18} />
              </a>

              <a href="#">
                <FaYoutube size={18} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
