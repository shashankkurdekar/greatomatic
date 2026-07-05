export default function Why() {
  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-blue-600 font-semibold uppercase tracking-widest">
            Why Greatomatic
          </span>

          <h2 className="mt-4 text-4xl md:text-5xl font-bold text-slate-900">
            Building a Better Future for
            <span className="text-blue-600">
              {" "}
              Farmers, Businesses & Families
            </span>
          </h2>

          <div className="w-24 h-1 bg-blue-600 mx-auto mt-6 rounded-full"></div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <div className="bg-white p-8 rounded-3xl shadow-lg">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">
                Still a Developing Nation?
              </h3>

              <p className="text-slate-600 leading-8">
                Despite decades of economic growth, millions of people still
                struggle with access to fair opportunities, stable income, and
                affordable essentials.
              </p>

              <p className="text-slate-600 leading-8 mt-5">
                Small manufacturers, farmers, and service providers often
                receive limited returns for their hard work while consumers
                continue to face increasing costs.
              </p>

              <p className="text-slate-600 leading-8 mt-5">
                Greatomatic was founded in 2022 with a mission to bridge this
                gap and create a sustainable ecosystem that benefits both
                producers and consumers.
              </p>
            </div>
          </div>

          {/* Right Side Stats */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white p-8 rounded-3xl shadow-lg">
              <h4 className="md:text-5xl text-3xl font-bold text-blue-600">77.4%</h4>

              <p className="mt-3 text-slate-600">
                Wealth held by India&apos;s top 10%
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-lg">
              <h4 className="md:text-5xl text-3xl font-bold text-green-600">4%</h4>

              <p className="mt-3 text-slate-600">
                Wealth held by the bottom 60%
              </p>
            </div>

            <div className="bg-linear-to-br from-blue-600 to-indigo-700 text-white p-8 rounded-3xl col-span-2">
              <h4 className="text-2xl font-bold mb-4">Our Mission</h4>

              <ul className="space-y-4">
                <li className="flex gap-3">
                  ✓ Ensure fair returns for farmers and manufacturers
                </li>

                <li className="flex gap-3">
                  ✓ Support service providers and entrepreneurs
                </li>

                <li className="flex gap-3">
                  ✓ Deliver quality essentials at affordable prices
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="mt-20">
          <div className="bg-white rounded-3xl shadow-lg p-10">
            <h3 className="text-3xl font-bold text-center mb-10">
              Our Journey
            </h3>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl">
                  01
                </div>

                <h4 className="font-bold mt-4">Identify Problems</h4>

                <p className="text-slate-600 mt-3">
                  Understanding challenges faced by farmers, manufacturers and
                  consumers.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl">
                  02
                </div>

                <h4 className="font-bold mt-4">Build Solutions</h4>

                <p className="text-slate-600 mt-3">
                  Creating innovative systems that improve distribution and
                  affordability.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl">
                  03
                </div>

                <h4 className="font-bold mt-4">Empower Communities</h4>

                <p className="text-slate-600 mt-3">
                  Helping people grow together through sustainable
                  opportunities.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
