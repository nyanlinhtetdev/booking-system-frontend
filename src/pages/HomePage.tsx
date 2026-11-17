const principles = [
  {
    number: "01",
    title: "Discover",
    description:
      "Find the rooms, equipment, and shared spaces that make campus life work for you.",
  },
  {
    number: "02",
    title: "Plan",
    description:
      "See the details you need before you book, from location and capacity to availability.",
  },
  {
    number: "03",
    title: "Make it yours",
    description:
      "Keep your reservations organized and spend more time doing the work that matters.",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-[calc(100vh-81px)] bg-[#eaf3f7] text-[#173148]">
      <div className="mx-auto max-w-7xl px-6 py-14 sm:px-8 lg:px-12 lg:py-20">
        <section className="border-b border-[#c8dce5] pb-14 lg:pb-20">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-8">
            <div>
              <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#55798d]">
                Student life&nbsp; / &nbsp;campus resources
              </p>
              <h1 className="max-w-3xl font-serif text-6xl leading-[0.92] tracking-[-0.05em] text-[#142d43] sm:text-8xl">
                Make room
                <br />
                for what <em className="text-[#4d879d]">matters.</em>
              </h1>
            </div>
            <p className="max-w-[210px] pb-2 font-serif text-lg leading-7 text-[#55798d]">
              A considered way to find and reserve the spaces around you.
            </p>
          </div>

          <div className="grid gap-8 border-t border-[#c8dce5] pt-7 md:grid-cols-[1fr_2fr] md:gap-16">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#55798d]">
              Common ground
            </p>
            <p className="max-w-2xl font-serif text-2xl leading-9 tracking-[-0.02em] text-[#285571] sm:text-3xl">
              Your campus is full of places to study, collaborate, create, and
              pause. Start with a space that fits the way you work.
            </p>
          </div>
        </section>

        <section className="py-10 lg:py-14">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#55798d]">
                The simple approach
              </p>
              <h2 className="font-serif text-4xl tracking-[-0.04em] text-[#142d43]">
                Your day, with space to grow.
              </h2>
            </div>
          </div>

          <div className="grid border-t border-[#c8dce5] md:grid-cols-3">
            {principles.map((principle) => (
              <article
                key={principle.number}
                className="border-b border-[#c8dce5] py-7 md:border-b-0 md:border-r md:px-7 md:first:pl-0 md:last:border-r-0 md:last:pr-0"
              >
                <p className="mb-8 text-[11px] font-semibold tracking-[0.2em] text-[#6f95a5]">
                  {principle.number}
                </p>
                <h3 className="font-serif text-3xl tracking-[-0.03em] text-[#142d43]">
                  {principle.title}
                </h3>
                <p className="mt-3 max-w-xs text-sm leading-6 text-[#55798d]">
                  {principle.description}
                </p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
