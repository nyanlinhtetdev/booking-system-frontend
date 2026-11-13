import { Link } from "react-router";

const features = [
  {
    title: "Find resources",
    description:
      "Browse available rooms, equipment, and other campus resources in one place.",
  },
  {
    title: "Book with confidence",
    description:
      "See availability before requesting a resource and keep your schedule organized.",
  },
  {
    title: "Manage everything",
    description:
      "Review your bookings and keep your account details up to date from one dashboard.",
  },
];

export default function HomePage() {
  return (
    <main className="bg-slate-50">
      <section className="bg-slate-900 px-4 py-20 text-white sm:px-6 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-blue-300">
              Campus resource booking
            </p>
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
              Make every booking simple.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              Booking System helps students discover campus resources, check
              availability, and manage reservations without the back-and-forth.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/resources"
                className="rounded-lg bg-blue-500 px-5 py-3 font-semibold text-white transition hover:bg-blue-400"
              >
                Browse resources
              </Link>
              <Link
                to="/register"
                className="rounded-lg border border-slate-600 px-5 py-3 font-semibold text-slate-100 transition hover:border-slate-400 hover:bg-slate-800"
              >
                Create an account
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold text-slate-900">
              Everything you need to plan ahead
            </h2>
            <p className="mt-3 text-lg text-slate-600">
              Spend less time searching and more time making the most of your
              campus resources.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {features.map((feature) => (
              <article
                key={feature.title}
                className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200"
              >
                <div className="mb-5 flex size-10 items-center justify-center rounded-lg bg-blue-100 font-bold text-blue-700">
                  ✓
                </div>
                <h3 className="text-xl font-semibold text-slate-900">
                  {feature.title}
                </h3>
                <p className="mt-3 leading-7 text-slate-600">
                  {feature.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}