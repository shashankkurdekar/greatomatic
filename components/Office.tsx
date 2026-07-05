import {
  MapPin,
  Clock3,
  Phone,
  Mail,
  Building2,
  BadgeCheck,
  ArrowUpRight,
} from "lucide-react";

export default function Office() {
  return (
    <section
      id="head_office"
      className="py-24 bg-linear-to-b from-slate-900 to-slate-950 text-white"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 backdrop-blur-md">
            <Building2 size={18} />
            Registered Office
          </div>

          <h2 className="mt-6 text-5xl font-bold">Visit Our Headquarters</h2>

          <p className="mt-4 text-slate-400 max-w-2xl mx-auto">
            The central hub of Greatomatic India Pvt. Ltd., where innovation,
            leadership and operations come together.
          </p>
        </div>

        {/* Top Info Bar */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
            <p className="text-sm text-slate-400">Branch ID</p>

            <h3 className="font-semibold mt-2">
              GIL/REGD/Udupi/Udupi/Karnataka/India
            </h3>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
            <p className="text-sm text-slate-400">GST Number</p>

            <h3 className="font-semibold mt-2">29AAJCG7838A1ZF</h3>
          </div>
        </div>

        {/* Map */}
        <div className="overflow-hidden rounded-4xl border border-white/10 shadow-2xl mb-12">
          <iframe
            src="https://maps.google.com/maps?q=Greatomatic&t=&z=14&ie=UTF8&iwloc=&output=embed"
            className="w-full h-125"
            loading="lazy"
          />
        </div>

        {/* Contact Grid */}
        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
          {/* Address */}
          <div
            className="
            bg-white/5
            backdrop-blur-xl
            border border-white/10
            rounded-3xl
            p-8
            hover:border-blue-500
            transition-all
          "
          >
            <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center">
              <MapPin />
            </div>

            <h3 className="text-xl font-semibold mt-6">Office Address</h3>

            <p className="text-slate-400 mt-4 leading-7">
              D.No: 3-1-41A(8), First Floor, Mahakali Enclave, Near Thimmappa
              Hotel, Adi Udupi, Karnataka - 576103
            </p>
          </div>

          {/* Hours */}
          <div
            className="
            bg-white/5
            backdrop-blur-xl
            border border-white/10
            rounded-3xl
            p-8
            hover:border-blue-500
            transition-all
          "
          >
            <div className="w-14 h-14 rounded-2xl bg-green-600 flex items-center justify-center">
              <Clock3 />
            </div>

            <h3 className="text-xl font-semibold mt-6">Working Hours</h3>

            <div className="mt-4 space-y-2 text-slate-400">
              <p>Monday - Friday</p>
              <p>10:00 AM - 5:00 PM</p>

              <div className="h-px bg-white/10 my-4"></div>

              <p>Saturday</p>
              <p>10:00 AM - 1:00 PM</p>
            </div>
          </div>

          {/* Phone */}
          <div
            className="
            bg-white/5
            backdrop-blur-xl
            border border-white/10
            rounded-3xl
            p-8
            hover:border-blue-500
            transition-all
          "
          >
            <div className="w-14 h-14 rounded-2xl bg-orange-600 flex items-center justify-center">
              <Phone />
            </div>

            <h3 className="text-xl font-semibold mt-6">Contact Numbers</h3>

            <div className="mt-4 space-y-3">
              <a
                href="tel:+919482642843"
                className="block text-slate-400 hover:text-white"
              >
                +91 94826 42843
              </a>

              <a
                href="tel:+917676390549"
                className="block text-slate-400 hover:text-white"
              >
                +91 76763 90549
              </a>
            </div>
          </div>

          {/* Email */}
          <div
            className="
            bg-white/5
            backdrop-blur-xl
            border border-white/10
            rounded-3xl
            p-8
            hover:border-blue-500
            transition-all
          "
          >
            <div className="w-14 h-14 rounded-2xl bg-purple-600 flex items-center justify-center">
              <Mail />
            </div>

            <h3 className="text-xl font-semibold mt-6">Email Address</h3>

            <a
              href="mailto:registeredoffice@greatomatic.com"
              className="
              mt-4
              inline-flex
              items-center
              gap-2
              text-slate-400
              hover:text-white
            "
            >
              registeredoffice@greatomatic.com
              
            </a>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16">
          <div
            className="
            rounded-4xl
            bg-linear-to-r
            from-blue-600
            to-indigo-700
            p-10
            text-center
          "
          >
            <BadgeCheck size={48} className="mx-auto mb-4" />

            <h3 className="text-3xl font-bold">Trusted Corporate Office</h3>

            <p className="mt-4 text-blue-100">
              Serving customers, partners and communities with transparency,
              innovation and commitment.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
